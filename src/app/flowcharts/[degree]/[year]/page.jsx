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
import YearViewableFlowchart from "@/app/_components/YearViewableFlowchart";

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
  const [color, setColor] = useState("#1e90ff");
  const [courses, setCourses] = useState([]);
  const flowchartEnv = getFlowchartEnv();

  function handleNodeClick(e, n) {
    const current_node = nodes.find((node) => node.id === n.id);

    function selectAncestors(node_id) {
      const current_node = nodes.find((node) => node.id === node_id);
      if (!current_node) return;

      current_node.selected = true;
      current_node.data.canTake = false;

      for (let edge of edges) {
        if (edge.target === node_id) {
          selectAncestors(edge.source);
        }
      }
    }

    function deselectDescendents(node_id) {
      const current_node = nodes.find((node) => node.id === node_id);
      if (!current_node) return;

      current_node.selected = false;
      current_node.data.canTake = false;

      for (let edge of edges) {
        if (edge.source === node_id) {
          deselectDescendents(edge.target);
        }
      }
    }

    function noteChildren(node_id) {
      for (let edge of edges) {
        if (edge.source === node_id) {
          const child = nodes.find((node) => node.id === edge.target);
          console.log("child", child);

          for (let parent_id of child.data.prerequisites) {
            const parent = nodes.find((node) => node.id === parent_id);
            console.log("parent", parent);
            if (!parent.selected) return;
          }

          child.data.canTake = true;
        }
      }
    }

    function noteSelf() {
      for (let parent_id of current_node.data.prerequisites) {
        const parent = nodes.find((node) => node.id === parent_id);
        if (!parent.selected) return;
      }
      current_node.data.canTake = true;
    }

    if (!current_node.selected) {
      selectAncestors(current_node.id);
      noteChildren(current_node.id);
    } else {
      deselectDescendents(current_node.id);
      noteSelf();
    }
    setNodes([...nodes]);
  }

  return (
    <main className="p-4" style={{ backgroundColor: color + "20" }}>
      <h1 className="text-2xl font-bold mb-4">{displayYear(params.year)}</h1>
      <div
        className={`h-[75vh] border-4 rounded-lg shadow`}
        style={{ borderColor: color }}
      >
        <YearViewableFlowchart
          year={params.year}
          degree={params.degree}
          height="74.1vh"
        />
      </div>
      <div className="flex gap-4 mt-16">
        <div
          className="grow-[1] flex flex-col items-center border-[5px] rounded py-6 bg-white"
          style={{ borderColor: color }}
        >
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
        <div
          className="grow-[1] flex flex-col items-center border-[5px] rounded py-6 bg-white"
          style={{ borderColor: color }}
        >
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
