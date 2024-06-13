import { useState, useEffect, useMemo } from "react";
import ViewableFlowchart from "./ViewableFlowchart";
import {
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

export default function YearViewableFlowchart({ year, degree, height }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const flowchartEnv = getFlowchartEnv();

  useEffect(() => {
    (async () => {
      try {
        console.log(degree, year);
        const flowcharts = await getDegreeMapByDegreeYear(degree, year);

        const courses = flowcharts[0][flowchartEnv][0].flowchart_json;

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

        console.log(nodes);

        setNodes(nodes);
        setEdges(edges);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const nodeTypes = useMemo(
    () => ({
      single: ViewEditableNode,
      coreq: ViewCoreqNode,
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
