"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../utils/supabase";
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
  getDegreeByName,
  getDegreeMapByDegreeYear,
  getDegrees,
  getFlowchartEnv,
  yearComponents,
} from "../../utils/flowchart-api";
import { ViewEditableNode, ViewCoreqNode } from "@/app/_components/nodes";
import "reactflow/dist/style.css";
import ViewableFlowchart from "@/app/_components/ViewableFlowchart";
import YearViewableFlowchart from "@/app/_components/YearViewableFlowchart";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
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

// export async function generateStaticParams() {
//   // generate all degrees and for each degree generate years
//   const degree_years = await getDegrees();
//   const flowchart = getFlowchartEnv();

//   return degree_years
//     .map((degree_year) =>
//       degree_year[flowchart].map((flowchart) => ({
//         degree: degree_year.name,
//         year: flowchart.flowchart_year,
//       }))
//     )
//     .flat(Infinity);
// }

export default function FlowchartsYear() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [displayState, setDisplayState] = useState(DisplayState.LOADING);
  const [color, setColor] = useState("#1e90ff");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const flowchartEnv = getFlowchartEnv();
  const [isPhone, setIsPhone] = useState(false);
  const params_degree =
    typeof window !== "undefined" ? window.localStorage.getItem("degree") : "";
  const params_year =
    typeof window !== "undefined" ? window.localStorage.getItem("year") : "";

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
          // console.log("child", child);

          for (let parent_id of child.data.prerequisites) {
            const parent = nodes.find((node) => node.id === parent_id);
            // console.log("parent", parent);
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

  function isColorDark(color) {
    function hexToRgb(hex) {
      hex = hex.replace(/^#/, "");
      let bigint = parseInt(hex, 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;
      return [r, g, b];
    }

    function luminance(r, g, b) {
      let a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    let rgb;

    if (color.startsWith("#")) {
      rgb = hexToRgb(color);
    } else if (color.startsWith("rgb")) {
      rgb = color.match(/\d+/g).map(Number);
    } else {
      false;
    }

    const [r, g, b] = rgb;
    const lum = luminance(r, g, b);

    return lum < 0.5;
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      // console.log(
      //   (await getDegrees())
      //     .map((degree_year) =>
      //       degree_year[flowchartEnv].map((flowchart) => ({
      //         degree: degree_year.name,
      //         year: flowchart.flowchart_year,
      //       }))
      //     )
      //     .flat(Infinity)
      // );
      const courses = await getAllCourses();
      const degree = await getDegreeByName(params_degree);
      setCourses(courses);
      setColor(degree[0].color);
      setLoading(false);

      const mediaQuery = window.matchMedia("(max-width: 768px)");
      const handleMediaQueryChange = (event) => {
        setIsPhone(event.matches);
      };

      handleMediaQueryChange(mediaQuery);
      mediaQuery.addEventListener("change", handleMediaQueryChange);

      return () => {
        mediaQuery.removeEventListener("change", handleMediaQueryChange);
      };
    })();
  }, []);

  return (
    <main
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: color + "20" }}
    >
      <Header />

      {loading ? (
        <div className="flex items-center justify-center flex-grow">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <h1
            className="text-2xl font-bold m-4 text-center  p-2 rounded"
            style={{
              backgroundColor: color,
              color: isColorDark(color) ? "white" : "black",
            }}
          >
            {params_degree} Prerequisites Flowchart{" "}
            <span className="italic">
              Fall {yearComponents(params_year)[0]} - Spring{" "}
              {yearComponents(params_year)[1]}
            </span>
          </h1>

          <div className="border border-info p-4 m-5 rounded-md bg-white inline-flex lg:hidden">
            <img
              src={basePath + "/images/warning2.png"}
              className="w-6 h-6 mr-3 mt-2"
              alt="Warning Icon"
            />
            <div>
              <p className="justify-center">
                It is recommended to view this flowchart on a laptop or desktop
                for the best experience.
                <br />
                To use the course builder you must use a laptop or a desktop
              </p>
            </div>
          </div>
          <div className="border border-[red] p-4 mx-5 mb-5 rounded-md bg-white inline-flex ">
            <img
              src={basePath + "/images/warning.png"}
              className="w-6 h-6 mr-3 "
              alt="Warning Icon"
            />
            <div>
              <p className="justify-center">
                depending on your grade in MTH 123, you may take MTH 130 next,
                or MTH 230 in place of MTH 231. You must earn a minimum “C” or
                higher grade in CSC courses which are pre-requisites to other
                CSC course
              </p>
            </div>
          </div>

          <div
            className={`h-[75vh] border-4 rounded-lg shadow m-5`}
            style={{ borderColor: color }}
          >
            <YearViewableFlowchart
              year={params_year}
              degree={params_degree}
              height="74.1vh"
              hasCourseBuilder={!isPhone}
            />
          </div>
        </>
      )}

      <Footer />
    </main>
  );
}
