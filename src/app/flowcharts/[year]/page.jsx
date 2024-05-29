"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import ReactFlow, { Background, MiniMap, Controls } from "reactflow";

import "reactflow/dist/style.css";

const nodeColor = (node) => {
  switch (node.type) {
    case "input":
      return "#6ede87";
    case "output":
      return "#6865A5";
    default:
      return "#ff0072";
  }
};

export default function FlowchartsYear({ params }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    (async () => {
      let { data: flowcharts, error } = await supabase
        .from("flowcharts")
        .select("flowchart_json")
        .eq("flowchart_year", params.year);

      const courses = flowcharts[0].flowchart_json;

      const nodes = courses.map((course) => ({
        id: course.id,
        type: course.nodeType,
        data: { label: course.courseName },
        style: {
          backgroundColor: nodeColor({ type: "default" }),
          color: "white",
        },
        position: { x: course.position.x, y: course.position.y },
      }));

      const edges = courses.flatMap((course) => [
        ...course.prerequisites.map((prerequisite) => ({
          id: "e" + prerequisite + "-" + course.id,
          source: prerequisite,
          target: course.id,
          type: "default",
          animated: true,
        })),
        ...course.corequisites.map((corequisite) => ({
          id: "e" + corequisite + "-" + course.id,
          source: corequisite,
          target: course.id,
          type: "default",
          animated: true,
        })),
      ]);

      setNodes(nodes);
      setEdges(edges);
    })();
  }, []);

  return (
    <main>
      <h1>{params.year}</h1>
      <div className=" h-96">
        {nodes.length === 0 && edges.length === 0 && <p>Loading...</p>}
        {nodes.length !== 0 && edges.length !== 0 && (
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <MiniMap
              nodeColor={nodeColor}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Background color="#aaa" gap={16} />
            <Controls />
          </ReactFlow>
        )}
      </div>
    </main>
  );
}