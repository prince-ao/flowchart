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

import { useState, useEffect } from "react";
import ReactFlow, {
  useOnSelectionChange,
  useEdges,
  getConnectedEdges,
  MarkerType,
} from "reactflow";

export default function EditorPanel({ setEdges }) {
  // State for storing currently selected nodes
  const [selection, setSelection] = useState(() => {
    const savedSelectedNodes = localStorage.getItem("selection");

    return savedSelectedNodes ? JSON.parse(savedSelectedNodes) : null;
  });
  // Get all edges in the graph
  // const edges = useEdges();
  // // Get edges connected to the currently selected nodes
  // const connectedEdges = getConnectedEdges(selectedNodes, edges);

  // Update selected nodes when selection changes

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      console.log(nodes, edges);

      if (nodes.length > 0) {
        setSelection({ panelType: "node", ...nodes[0] });
      } else if (edges.length > 0) {
        setSelection({ panelType: "edge", ...edges[0] });
      } else {
        setSelection(null);
      }
    },
  });

  useEffect(() => {
    localStorage.setItem("selection", JSON.stringify(selection));
  }, [selection]);

  // Handle changes to input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedNodes({
      ...selection,
      data: { ...selection.data, [name]: value },
    });
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
    setEdges((eds) =>
      eds.map((e) => {
        if (
          (e.source === nodeId && e.target === node.id) ||
          (e.source === node.id && e.target === nodeId)
        ) {
          return {
            ...e,
            markerStart: {
              type: null,
            },
            markerEnd: {
              type: MarkerType.Arrow,
            },
          };
        }
        return e;
      })
    );
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
    setEdges((eds) =>
      eds.map((e) => {
        if (
          (e.source === nodeId && e.target === node.id) ||
          (e.source === node.id && e.target === nodeId)
        ) {
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
      })
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-box bg-base-200 max-w-md p-4">
      {!selection ? (
        <p className="text-center w-full">
          Select a <b>node</b> or <b>edge</b> to edit its properties
        </p>
      ) : (
        <>
          {selection.panelType === "edge" ? (
            <div className="w-full">
              <button className="btn btn-error text-white">Delete</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-xl">Course Code:</label>
              <input
                name="courseCode"
                value={selection.data.courseCode}
                onChange={(e) => handleInputChange(e)}
                className="input input-bordered bg-gray-700 text-white"
              />
              <label className="font-bold text-xl">Full Name:</label>
              <input
                name="courseName"
                value={selection.data.courseName}
                onChange={(e) => handleInputChange(e)}
                className="input input-bordered bg-gray-700 text-white"
              />
              <label className="font-bold text-xl">Postrequites:</label>
              <div className="flex gap-2 flex-wrap justify-center">
                {!selection.data.postrequisites.length && (
                  <span className="text-gray-500">No postrequisites</span>
                )}
                {selection.data.postrequisites.map((postreq) => (
                  <span
                    key={postreq}
                    className="badge badge-primary cursor-pointer"
                  >
                    {postreq}
                  </span>
                ))}
              </div>
              <label className="font-bold text-xl">Corequisites:</label>
              <div className="flex gap-2 flex-wrap justify-center">
                {!selection.data.corequisites.length && (
                  <span className="text-gray-500">No corequisites</span>
                )}
                {selection.data.corequisites.map((coreq) => (
                  <span
                    key={coreq}
                    className="badge badge-primary cursor-pointer"
                  >
                    {coreq}
                  </span>
                ))}
              </div>
              <button className="btn btn-error mt-4 text-white">Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
