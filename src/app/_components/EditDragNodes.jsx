/** Fix this so it martches DragNodes */

import React, { useState, useRef, useMemo } from "react";
import { useNodes } from "reactflow";
import {
  createNewFlowchart,
  cleanNodes,
  updateFlowchart,
} from "@/utils/flowchart-api";
import { useRouter } from "next/navigation";

export default function EditDragNodes({ year, degree }) {
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
      await updateFlowchart(clean, year, degree);

      setInsertSuccess(true);

      setTimeout(() => {
        setInsertSuccess(false);

        // router.push("/admin/home");
      }, 4 * 1e3);
    } catch (e) {
      setInsertError({ value: true, text: e.message });
    }
  }

  return (
    <aside className="h-screen md:w-1/4 p-6 bg-white shadow-lg rounded-lg space-y-4">
      <h1 className="font-bold text-2xl text-center">
        Edit the degree map for <span className="italicize">{year}</span> |{" "}
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
      <div
        className="p-2 bg-blue-500 text-white cursor-move rounded"
        onDragStart={(event) => onDragStart(event, "single")}
        draggable
      >
        Class Node
      </div>
      {/* change the input to make it more strict */}
      {insertError.value && (
        <p className="text-error">
          error creating a flowchart: {insertError.text}
        </p>
      )}
      <button className="btn btn-blue" onClick={saveToSupabase}>
        Submit
      </button>
      {insertSuccess && <p className="text-success">Degree map updated!</p>}
      <a ref={downloadLink} className="hidden" />
    </aside>
  );
}
