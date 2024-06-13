"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";
import {
  displayYear,
  getAllCourses,
  getDegreeMapByDegreeYear,
  getFlowchartEnv,
} from "@/utils/flowchart-api";
import { ViewEditableNode, ViewCoreqNode } from "@/app/_components/nodes";
import "reactflow/dist/style.css";
import ViewableFlowchart from "@/app/_components/ViewableFlowchart";

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
  const [courses, setCourses] = useState([]);
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

        const real_courses = await getAllCourses();

        setCourses(real_courses);

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

        console.log(nodes);

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
      single: ViewEditableNode,
      coreq: ViewCoreqNode,
    }),
    []
  );

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">{displayYear(params.year)}</h1>
      <div className="h-[75vh] border-4 border-[#1e90ff] rounded-lg shadow">
        {displayState === DisplayState.LOADING ? (
          <p className="text-gray-500">Loading...</p>
        ) : displayState === DisplayState.SHOW ? (
          <ReactFlowProvider>
            <ViewableFlowchart
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              viewHeight="74.1vh"
            />
          </ReactFlowProvider>
        ) : displayState === DisplayState.ERROR ? (
          <p className="text-red-500">
            Flowchart for course year {params.year} not found.
          </p>
        ) : (
          <></>
        )}
      </div>
      <div className="flex gap-4 mt-16">
        <div className="grow-[1] flex flex-col items-center border-[5px] border-blue-300 rounded py-6">
          <h2 className="mb-8 text-xl font-bold">Required CS Courses</h2>
          <div className="flex gap-3 flex-wrap">
            {courses.length > 0 ? (
              courses.map(
                (course, i) =>
                  course.category === "cs_required" && (
                    <div
                      className="tooltip bg-gray-200 p-2 rounded-full"
                      data-tip={`${course.name}`}
                      key={i}
                    >
                      <a
                        href={`${course.url ?? "#"}`}
                        target={course.url ? "_blank" : ""}
                      >
                        <p>{course.code}</p>
                      </a>
                    </div>
                  )
              )
            ) : (
              <p>No courses yet.</p>
            )}
          </div>
        </div>
        <div className="grow-[1] flex flex-col items-center border-[5px] border-blue-300 rounded py-6">
          <h2 className="mb-8 text-xl font-bold">Elective CS Courses</h2>
          <div className="flex gap-3 flex-wrap">
            {courses.length > 0 ? (
              courses.map(
                (course, i) =>
                  course.category === "cs_elective" && (
                    <div
                      className="tooltip bg-gray-200 p-2 rounded-full"
                      data-tip={`${course.name}`}
                      key={i}
                    >
                      <a
                        href={`${course.url ?? "#"}`}
                        target={course.url ? "_blank" : ""}
                      >
                        <p>{course.code}</p>
                      </a>
                    </div>
                  )
              )
            ) : (
              <p>No courses yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
