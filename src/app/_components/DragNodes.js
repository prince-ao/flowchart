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

import React, { useState, useRef } from "react";
import { useNodes } from "reactflow";
import { supabase } from "@/utils/supabase";

export default function DragNodes() {
  const nodes = useNodes();
  const [fileName, setFileName] = useState("");
  const [fileNameError, setFileNameError] = useState(false);
  const [insertError, setInsertError] = useState({ value: false, text: "" });
  const [insertSuccess, setInsertSuccess] = useState(false);
  const downloadLink = useRef();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const saveNodes = () => {
    const cleanNodes = nodes.map((node) => ({
      id: node.id,
      courseName: node.data.courseNumber,
      description: node.data.description,
      fullName: node.data.fullName,
      nodeType: node.type,
      position: node.position,
      prerequisites: node.data.prerequisites,
      corequisites: node.data.corequisites,
    }));

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(cleanNodes));
    downloadLink.current.setAttribute("href", dataStr);
    downloadLink.current.setAttribute("download", fileName);
    downloadLink.current.click();
  };

  async function saveToSupabase() {
    setInsertError({ value: false, text: "" });
    if (!/^\d{4} - \d{4}$/.test(fileName)) {
      setFileNameError(true);
      return;
    }

    setFileNameError(false);

    const cleanNodes = nodes.map((node) => ({
      id: node.id,
      courseName: node.data.courseNumber,
      description: node.data.description,
      fullName: node.data.fullName,
      nodeType: node.type,
      position: node.position,
      prerequisites: node.data.prerequisites,
      corequisites: node.data.corequisites,
    }));

    const flowchart_json = JSON.stringify(cleanNodes);

    const { data, error } = await supabase
      .from("flowcharts")
      .insert([{ flowchart_json, flowchart_year: fileName }]);

    setFileName("");
    if (error) {
      setInsertError({ value: true, text: error.message });
    } else {
      setInsertSuccess(true);
      setTimeout(() => {
        setInsertSuccess(false);
      }, 4 * 1e3);
    }
  }

  return (
    <aside className="h-screen md:w-1/4 p-6 bg-white shadow-lg rounded-lg space-y-4">
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
        onDragStart={(event) => onDragStart(event, "default")}
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
      {insertSuccess && <p className="text-success">New flowchart created!</p>}
      <input
        className={`mt-2 mb-2 input input-sm`}
        type="text"
        value={fileName}
        placeholder="course year"
        onChange={(e) => setFileName(e.target.value)}
      />
      <p className={`text-xs !mt-0 ${fileNameError ? "text-error" : ""}`}>
        must be in the format <br />
        &#123;start year&#125; - &#123;end year&#125;
      </p>
      <button className="btn btn-blue" onClick={saveToSupabase}>
        Save Nodes
      </button>
      <a ref={downloadLink} className="hidden" />
    </aside>
  );
}
