"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  MarkerType,
} from "reactflow";
import {
  displayYear,
  getDegreeMapByDegreeYear,
  getFlowchartEnv,
} from "@/utils/flowchart-api";
import { EditableNode, CoreqNode } from "@/app/_components/nodes";
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
  const [tooltip, setTooltip] = useState({
    display: false,
    content: "",
    x: 0,
    y: 0,
  });
  const [selected, setSelected] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const flowchartEnv = getFlowchartEnv();

  const handleMouseEnter = (event, node) => {
    setTooltip({
      display: true,
      content: node.data.fullName,
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      display: false,
      content: "",
      x: 0,
      y: 0,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const flowcharts = await getDegreeMapByDegreeYear(
          decodeURIComponent(params.degree),
          params.year
        );

        const courses = flowcharts[0][flowchartEnv][0].flowchart_json;
        console.log(courses);

        const nodes = courses.map((course) =>
          course.nodeType === "coreq"
            ? {
                id: course.id,
                type: course.nodeType,
                data: {
                  courseNumber1: course.courseName1,
                  fullName1: course.fullName1,
                  courseNumber2: course.courseName2,
                  fullName2: course.fullName2,
                  description: course.description,
                },
                position: { x: course.position.x, y: course.position.y },
              }
            : {
                id: course.id,
                type: course.nodeType,
                data: {
                  courseNumber: course.courseName,
                  fullName: course.fullName,
                  description: course.description,
                },
                position: { x: course.position.x, y: course.position.y },
              }
        );

        const edges = courses.flatMap((course) => [
          ...course.prerequisites.map((prerequisite) => ({
            id: "e" + prerequisite + "-" + course.id,
            source: prerequisite,
            target: course.id,
            type: "bezier",
            markerEnd: {
              type: MarkerType.Arrow,
              width: 10,
              height: 10,
              color: "#79BDE8",
            },
            style: {
              stroke: "#79BDE8",
              strokeWidth: 3,
            },
            animated: true,
          })),
        ]);

        setNodes(nodes);
        setEdges(edges);
        setDisplayState(DisplayState.SHOW);
      } catch (e) {
        console.log(e);
        setDisplayState(DisplayState.ERROR);
      }
    })();
  }, [selectedNode]);

  const nodeTypes = useMemo(
    () => ({
      single: EditableNode,
      coreq: CoreqNode,
    }),
    []
  );

  return (
    <main className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{displayYear(params.year)}</h1>
      <div className=" h-[90vh] bg-white p-4 rounded shadow">
        {displayState === DisplayState.LOADING ? (
          <p className="text-gray-500">Loading...</p>
        ) : displayState === DisplayState.SHOW ? (
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
            <Background color="#aaa" gap={16} />
            {/* <Controls /> */}
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
          style={{ position: "absolute", top: tooltip.y, left: tooltip.x }}
          className="bg-blue-500 text-white p-2 rounded-md shadow-lg max-w-xs"
        >
          {tooltip.content}
        </div>
      )}
    </main>
  );
}
