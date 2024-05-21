import React, { useState, useRef } from 'react';
import { useNodes } from 'reactflow';

export default function DragNodes() {
  const nodes = useNodes();
  const [fileName, setFileName] = useState("nodes.json");
  const downloadLink = useRef();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const saveNodes = () => {
    const cleanNodes = nodes.map(node => ({
      id: node.id,
      courseName: node.data.courseNumber,
      description: node.data.description,
      fullName: node.data.fullName,
      nodeType: node.type,
      position: node.position,
      prerequisites: node.data.prerequisites,
      corequisites: node.data.corequisites
    }));
  
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanNodes));
    downloadLink.current.setAttribute("href", dataStr);
    downloadLink.current.setAttribute("download", fileName);
    downloadLink.current.click();
  };

  return (
    <aside className="p-6 bg-white shadow-lg rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Instructions</h2>
      <p className="text-gray-600">You can drag the "Class Node" to the pane on the left to create a new node in the flowchart.</p>
      <h3 className="text-xl font-bold text-gray-900">Key</h3>
      <ul className="list-disc pl-5 text-gray-600">
        <li><strong>Class Node:</strong> Represents a class in the flowchart. Drag and drop it to the desired location.</li>
      </ul>
      <div className="p-2 bg-blue-500 text-white cursor-move rounded" 
           onDragStart={(event) => onDragStart(event, 'default')} 
           draggable>
        Class Node
      </div>
      <input className="mt-2 mb-2 input input-sm" type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
      <button className="btn btn-blue">Save Nodes</button>
      <a ref={downloadLink} className="hidden"/>
    </aside>
  );
};