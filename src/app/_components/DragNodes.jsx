/**
 * This file defines a DragNodes component
 * The component is designed to be used with the reactflow library, which provides
 * a way to create and manipulate a flowchart-like network of nodes.
 *
 * The DragNodes component allows users to drag a "Class Node" into a flowchart.
 * It also provides a way to save the current state of the nodes in the flowchart to a JSON file.
 *
 * The component uses the useState and useRef hooks from React to manage the name of the file to be saved
 * and a reference to a download link, respectively.
 *
 * The component also uses the useNodes hook from reactflow to access the current state of the nodes in the flowchart.
 *
 * The onDragStart function is used to set the data and effect for the drag operation.
 *
 * The saveNodes function is used to create a clean copy of the nodes (with only the necessary data),
 * convert it to a JSON string, create a data URL with the JSON string, and trigger a download of the data URL.
 *
 * The component is styled using Tailwind CSS.
 */

import React, { useState, useRef, useMemo } from "react";
import { useNodes } from "reactflow";
import { createNewFlowchart, cleanNodes } from "@/utils/flowchart-api";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function DragNodes({ clearCache, year, degree }) {
  const nodes = useNodes();
  const router = useRouter();

  const [fileNameError, setFileNameError] = useState(false);
  const [insertError, setInsertError] = useState({ value: false, text: "" });
  const [insertSuccess, setInsertSuccess] = useState(false);
  const downloadLink = useRef();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // const saveNodes = () => {
  //   const cleanNodes = nodes.map((node) => ({
  //     id: node.id,
  //     courseName: node.data.courseNumber,
  //     description: node.data.description,
  //     fullName: node.data.fullName,
  //     nodeType: node.type,
  //     position: node.position,
  //     prerequisites: node.data.prerequisites,
  //     corequisites: node.data.corequisites,
  //   }));

  //   const dataStr =
  //     "data:text/json;charset=utf-8," +
  //     encodeURIComponent(JSON.stringify(cleanNodes));
  //   downloadLink.current.setAttribute("href", dataStr);
  //   downloadLink.current.setAttribute("download", fileName);
  //   downloadLink.current.click();
  // };

  async function saveToSupabase() {
    setFileNameError(false);
    setInsertError({
      value: false,
      text: "",
    });

    const clean = cleanNodes(nodes);

    try {
      await createNewFlowchart(clean, year, degree);

      setInsertSuccess(true);
      var end = Date.now() + 4 * 1000;

      var colors = ["#8ac2eb"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 90,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 90,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
      clearCache();

      setTimeout(() => {
        router.push("/admin/home");
      }, 4 * 1e3);
    } catch (e) {
      setInsertError({ value: true, text: e.message });
    }
  }

  return (
    <aside className="h-screen md:w-1/4 p-6 bg-white shadow-lg rounded-lg space-y-4">
      <h1 className="font-bold text-2xl text-center">
        Create the degree map for <span className="italicize">{year}</span> |{" "}
        <span className="italicize">{degree}</span>
      </h1>
      <h2 className="text-2xl font-bold text-gray-900">Instructions</h2>
      <p className="text-gray-600">
        You can drag the &quot;Class Node&quot; to the pane on the left to
        create a new node in the flowchart.
      </p>
      <h3 className="text-xl font-bold text-gray-900">Key</h3>
      <ul className="list-disc pl-5 text-gray-600">
        <li>
          <strong>Class Node:</strong> Represents a class in the flowchart. Drag
          and drop it to the desired location.
        </li>
      </ul>
      <h3 className="mt-4 font-bold text-lg">Nodes</h3>
      <div>
        <h2>Course Node:</h2>
        <div
          className="p-2 border-2 border-black cursor-move rounded flex justify-center items-center flex-col"
          onDragStart={(event) => onDragStart(event, "single")}
          draggable
        >
          <p className="font-bold text-lg">Course Code</p>
          <p>Course Name</p>
        </div>
      </div>
      {/* change the input to make it more strict */}
      {insertError.value && (
        <p className="text-error">
          error creating a flowchart: {insertError.text}
        </p>
      )}
      <button className="btn btn-success" onClick={saveToSupabase}>
        Create
      </button>
      {insertSuccess && <p className="text-success">New flowchart created!</p>}
      <a ref={downloadLink} className="hidden" />
    </aside>
  );
}
