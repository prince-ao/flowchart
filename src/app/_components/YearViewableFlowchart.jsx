import { useState, useEffect, useMemo } from "react";
import ViewableFlowchart from "./ViewableFlowchart";
import {
  dirtyNodes,
  getDegreeMapByDegreeYear,
  getFlowchartEnv,
} from "@/utils/flowchart-api";
import { ViewEditableNode, ViewCoreqNode } from "@/app/_components/nodes";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

export default function YearViewableFlowchart({
  year,
  degree,
  height,
  onNodeClick,
}) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const flowchartEnv = getFlowchartEnv();

  useEffect(() => {
    (async () => {
      try {
        console.log(degree, year);
        const flowcharts = await getDegreeMapByDegreeYear(degree, year);

        const courses = flowcharts[0][flowchartEnv][0].flowchart_json;
        console.log(courses);

        const nodes = dirtyNodes(courses);
        console.log(nodes);
        const setCoreqs = new Set();

        const edges = courses.flatMap((course) => [
          ...course.postrequisites.map((post) => ({
            id: "e" + course.id + "-" + post,
            source: course.id,
            target: post,
            type: "bezier",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 10,
              height: 10,
              color: "#000",
            },
            style: {
              stroke: "#000",
              strokeWidth: 3,
            },
            animated: true,
          })),
          ...course.corequisites.map((co) => {
            console.log(co);
            if (co.source) {
              setCoreqs.add(`e${course.id}-${co.id}`);
              return {
                id: `e${co}-${course.id}`,
                source: course.id,
                target: co.id,
                sourceHandle: "c",
                targetHandle: "d",
                type: "bezier",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 10,
                  height: 10,
                  color: "#f00",
                },
                markerStart: {
                  type: MarkerType.ArrowClosed,
                  width: 10,
                  height: 10,
                  color: "#f00",
                },
                style: {
                  stroke: "#f00",
                  strokeWidth: 3,
                },
                animated: true,
              };
            }
          }),
        ]);

        setNodes(nodes);
        setEdges(edges);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [year, degree]);

  const nodeTypes = useMemo(
    () => ({
      single: ViewEditableNode,
    }),
    []
  );

  return (
    <ReactFlowProvider>
      <ViewableFlowchart
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        viewHeight={height}
      />
    </ReactFlowProvider>
  );
}
