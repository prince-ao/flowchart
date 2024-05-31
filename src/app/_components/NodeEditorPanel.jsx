/**
 * NodeEditorPanel is a React component that provides an interface for editing nodes in a graph.
 * It uses the ReactFlow library to handle node selection and edge connections.
 * 
 * The component maintains a state of currently selected nodes and provides input fields for editing their properties.
 * It also allows for moving nodes between prerequisites and corequisites.
 * 
 * The component renders a panel with input fields for each selected node's properties, and lists of prerequisites and corequisites.
 * Each prerequisite and corequisite is rendered as a clickable badge that, when clicked, moves the node to the other list.
 */

import { useState } from 'react';
import ReactFlow, { useOnSelectionChange, useEdges, getConnectedEdges, MarkerType } from 'reactflow';
 
export default function NodeEditorPanel({ setEdges }) {
    // State for storing currently selected nodes
    const [selectedNodes, setSelectedNodes] = useState([]);
    // Get all edges in the graph
    const edges = useEdges();
    // Get edges connected to the currently selected nodes
    const connectedEdges = getConnectedEdges(selectedNodes, edges);

    // Update selected nodes when selection changes
    useOnSelectionChange({
      onChange: ({ nodes }) => {
        setSelectedNodes(nodes.map((node) => node));
      },
    });

    // Handle changes to input fields
    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...selectedNodes];
      list[index]['data'][name] = value;
      setSelectedNodes(list);
    };

    // Move a node from corequisites to prerequisites
    const moveToPrerequisites = (nodeId, index) => {
      const list = [...selectedNodes];
      const node = list[index];
      const corequisites = node.data.corequisites || [];
      const corequisitesIndex = corequisites.indexOf(nodeId);
      if (corequisitesIndex > -1) {
        corequisites.splice(corequisitesIndex, 1);
        node.data.prerequisites = [...(node.data.prerequisites || []), nodeId];
      }
      setSelectedNodes(list);
    
      // Modify the edge
      setEdges((eds) => eds.map((e) => {
        if ((e.source === nodeId && e.target === node.id) || (e.source === node.id && e.target === nodeId)) {
          return {
            ...e,
            markerStart: {
              type: null
            },
            markerEnd: {
              type: MarkerType.Arrow,
            },
          };
        }
        return e;
      }));
    };

    // Move a node from prerequisites to corequisites
    const moveToCorequisites = (nodeId, index) => {
      const list = [...selectedNodes];
      const node = list[index];
      const prerequisites = node.data.prerequisites || [];
      const prerequisitesIndex = prerequisites.indexOf(nodeId);
      if (prerequisitesIndex > -1) {
        prerequisites.splice(prerequisitesIndex, 1);
        node.data.corequisites = [...(node.data.corequisites || []), nodeId];
      }
      setSelectedNodes(list);
    
      // Modify the edge
      setEdges((eds) => eds.map((e) => {
        if ((e.source === nodeId && e.target === node.id) || (e.source === node.id && e.target === nodeId)) {
          return {
            ...e,
            markerStart: {
              type: MarkerType.Arrow,
            },
            markerEnd: {
              type: MarkerType.Arrow,
            },
          };
        }
        return e;
      }));
    };

    // Render the component
    return (
      <div className="flex flex-col items-center gap-4 rounded-box bg-base-200 max-w-md p-4">
        {selectedNodes.length === 0 && <p className="text-center w-full">Select a node to edit its properties</p>}
        {selectedNodes.map((node, index) => (
          <div key={node.id} className="flex flex-col gap-2 w-full">
            <label className="font-bold text-xl">Label:</label>
            <input name="label" value={node.data.label} onChange={e => handleInputChange(e, index)} className="input input-bordered bg-gray-700 text-white" />
            <label className="font-bold text-xl">Course Number:</label>
            <input name="courseNumber" value={node.data.courseNumber} onChange={e => handleInputChange(e, index)} className="input input-bordered bg-gray-700 text-white" />
            <label className="font-bold text-xl">Full Name:</label>
            <input name="fullName" value={node.data.fullName} onChange={e => handleInputChange(e, index)} className="input input-bordered bg-gray-700 text-white" />
            <label className="font-bold text-xl">Description:</label>
            <input name="description" value={node.data.description} onChange={e => handleInputChange(e, index)} className="input input-bordered bg-gray-700 text-white" />
            <label className="font-bold text-xl">Prerequisites:</label>
            <div className="flex gap-2 flex-wrap justify-center">
              {!node.data.prerequisites.length && <span className="text-gray-500">No prerequisites</span>}
              {node.data.prerequisites.map((prereq) => 
                <span key={prereq} onClick={() => moveToCorequisites(prereq, index)} className="badge badge-primary cursor-pointer">{prereq}</span>
              )}
            </div>
            <label className="font-bold text-xl">Corequisite:</label>
            <div className="flex gap-2 flex-wrap justify-center">
              {!node.data.corequisites.length && <span className="text-gray-500">No corequisites</span>}
              {node.data.corequisites.map((coreq) => 
                <span key={coreq} onClick={() => moveToPrerequisites(coreq, index)} className="badge badge-primary cursor-pointer">{coreq}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
}