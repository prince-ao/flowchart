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
  hasCourseBuilder,
}) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(false);

  const flowchartEnv = getFlowchartEnv();

  useEffect(() => {
    (async () => {
      try {
        console.log(degree, year);
        const flowcharts = await getDegreeMapByDegreeYear(
          decodeURIComponent(degree),
          year
        );

        const courses = flowcharts[0][flowchartEnv][0].flowchart_json;

        const nodes = dirtyNodes(courses);

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
        setError(true);
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
    <>
      {error ? (
        <p className="text-red-500">
          Flowchart for course year {year} and degree{" "}
          {decodeURIComponent(degree)} not found.
        </p>
      ) : (
        <ReactFlowProvider>
          <ViewableFlowchart
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            viewHeight={height}
            hasCourseBuilder={hasCourseBuilder}
            setEdges={setEdges}
            setNodes={setNodes}
          />
          
        </ReactFlowProvider>
      )}
    </>
  );
}

YearViewableFlowchart.defaultProps = {
  height: "50vh",
  onNodeClick: () => {},
  hasCourseBuilder: false,
};
