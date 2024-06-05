"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import ReactFlow, { Background, MiniMap, Controls, MarkerType } from "reactflow";
import { displayYear } from "@/utils/flowchart";
import "reactflow/dist/style.css";

const nodeColor = (node) => {
  switch (node.type) {
    case "input":
      return "#6ede87";
    case "output":
      return "#6865A5";
    default:
      return "#FFF";
  }
};

const DisplayState = {
  LOADING: 0,
  SHOW: 1,
  ERROR: 2,
};

export default function FlowchartsYear({ params }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [displayState, setDisplayState] = useState(DisplayState.LOADING);
  const [tooltip, setTooltip] = useState({display: false, content: "", x: 0, y: 0});
  const [selected, setSelected] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleMouseEnter = (event, node) => {
    setTooltip({
      display: true,
      content: node.data.fullName,
      x: event.pageX,
      y: event.pageY
    });
  };
  
  const handleMouseLeave = () => {
    setTooltip({
      display: false,
      content: "",
      x: 0,
      y: 0
    });
  };

  useEffect(() => {
    (async () => {
      let { data: flowcharts, error } = await supabase
        .from("flowcharts")
        .select("flowchart_json")
        .eq("flowchart_year", params.year);

      if (error || flowcharts.length === 0) {
        setDisplayState(DisplayState.ERROR);
        return;
      }

      const courses = flowcharts[0].flowchart_json;

      const nodes = courses.map((course) => ({
        id: course.id,
        type: course.nodeType,
        data: { label: course.courseName, fullName: course.fullName, description: course.description, prerequisite: course.prerequisites, corequisite: course.corequisites},
        style: {
          backgroundColor: nodeColor({ type: "default" }),
          border: '3px solid #79BDE8',
          color: "black",
          borderRadius: '0.375rem',
          padding: '1rem', // p-4
        },
        position: { x: course.position.x, y: course.position.y },
      }));

      const edges = courses.flatMap((course) => [
        ...course.prerequisites.map((prerequisite) => ({
          id: "e" + prerequisite + "-" + course.id,
          source: prerequisite,
          target: course.id,
          type: 'bezier',
          markerEnd: {
            type: MarkerType.Arrow,
            width: 10,
            height: 10,
            color: '#79BDE8',
          },
          style: {
            stroke: '#79BDE8',
            strokeWidth: 3,
          },
          animated: selectedNode && selectedNode.id === course.id,
        })),
        ...course.corequisites.map((corequisite) => ({
          id: "e" + corequisite + "-" + course.id,
          source: corequisite,
          target: course.id,
          type: 'bezier',
          markerEnd: {
            width: 10,
            height: 10,
            type: MarkerType.Arrow,
            color: selectedNode && selectedNode.id === course.id ? 'red' : '#ff7f7f', // faded red
          },
          markerStart: {
            width: 10,
            height: 10,
            type: MarkerType.Arrow,
            color: selectedNode && selectedNode.id === course.id ? 'red' : '#ff7f7f', // faded red
          },
          style: {
            stroke: selectedNode && selectedNode.id === course.id ? 'red' : '#ff7f7f', // faded red
            strokeWidth: 3,
          },
          animated: selectedNode && selectedNode.id === course.id,
        })),
      ]);
      setNodes(nodes);
      setEdges(edges);
      setDisplayState(DisplayState.SHOW);
    })();
  }, [selectedNode]);

  return (
    <main className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{params.year}</h1>
      <div className=" h-[90vh] bg-white p-4 rounded shadow">

        {displayState === DisplayState.LOADING ? (
          <p className="text-gray-500">Loading...</p>
        ) : displayState === DisplayState.SHOW ? (
          <ReactFlow nodes={nodes} edges={edges}    
          onNodeMouseEnter={handleMouseEnter}
          onNodeMouseLeave={handleMouseLeave}
          onNodeDragStart={(event, node) => setSelected(node.id)}
          onNodeDragStop={() => setSelected(null)}
          onNodeClick={(event, node) => setSelectedNode(node)}
          fitView>
            <Background color="#aaa" gap={16} />
            <Controls />
          </ReactFlow>
        ) : displayState === DisplayState.ERROR ? (
          <p className="text-red-500">
            Flowchart for course year {params.year} not found.
          </p>
        ) : (
          <></>
        )}
      </div>
      {tooltip.display && (
        <div 
          style={{position: 'absolute', top: tooltip.y, left: tooltip.x}}
          className="bg-blue-500 text-white p-2 rounded-md shadow-lg max-w-xs"
        >
          {tooltip.content}
        </div>
    )}
    </main>
  );
}