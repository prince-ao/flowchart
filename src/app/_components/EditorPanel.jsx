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

export default function EditorPanel({ setEdges, edges, setNodes, nodes }) {
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
      // console.log(nodes, edges);

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
    // console.log(name, value);
    selection.data[name] = value;
    // console.log(selection);
    setSelection({ ...selection });
  };

  // Move a node from corequisites to prerequisites
  // const moveToPrerequisites = (nodeId, index) => {
  //   const list = [...selectedNodes];
  //   const node = list[index];
  //   const corequisites = node.data.corequisites || [];
  //   const corequisitesIndex = corequisites.indexOf(nodeId);
  //   if (corequisitesIndex > -1) {
  //     corequisites.splice(corequisitesIndex, 1);
  //     node.data.prerequisites = [...(node.data.prerequisites || []), nodeId];
  //   }
  //   setSelectedNodes(list);

  //   // Modify the edge
  //   setEdges((eds) =>
  //     eds.map((e) => {
  //       if (
  //         (e.source === nodeId && e.target === node.id) ||
  //         (e.source === node.id && e.target === nodeId)
  //       ) {
  //         return {
  //           ...e,
  //           markerStart: {
  //             type: null,
  //           },
  //           markerEnd: {
  //             type: MarkerType.Arrow,
  //           },
  //         };
  //       }
  //       return e;
  //     })
  //   );
  // };

  // Move a node from prerequisites to corequisites
  // const moveToCorequisites = (nodeId, index) => {
  //   const list = [...selectedNodes];
  //   const node = list[index];
  //   const prerequisites = node.data.prerequisites || [];
  //   const prerequisitesIndex = prerequisites.indexOf(nodeId);
  //   if (prerequisitesIndex > -1) {
  //     prerequisites.splice(prerequisitesIndex, 1);
  //     node.data.corequisites = [...(node.data.corequisites || []), nodeId];
  //   }
  //   setSelectedNodes(list);

  //   // Modify the edge
  //   setEdges((eds) =>
  //     eds.map((e) => {
  //       if (
  //         (e.source === nodeId && e.target === node.id) ||
  //         (e.source === node.id && e.target === nodeId)
  //       ) {
  //         return {
  //           ...e,
  //           markerStart: {
  //             type: MarkerType.Arrow,
  //           },
  //           markerEnd: {
  //             type: MarkerType.Arrow,
  //           },
  //         };
  //       }
  //       return e;
  //     })
  //   );
  // };

  return (
    <div className="flex flex-col items-center gap-4 rounded-box bg-base-200 max-w-md p-4">
      {!selection ? (
        <p className="text-center w-full">
          Select a <b>node</b> or <b>edge</b> to edit its properties
        </p>
      ) : (
        <>
          {selection.panelType === "edge" ? (
            <div className="flex flex-col w-full">
              <label className="font-bold text-xl">Edge:</label>
              <p className="text-lg mb-4">id: {selection.id}</p>
              <button
                className="btn btn-error text-white"
                onClick={() => {
                  // console.log("selection", selection);
                  const edgeId = selection.id;
                  const reactflowRegex1 = /^reactflow__edge-(\d+)c-(\d+)d$/;
                  const reactflowRegex2 = /^reactflow__edge-(\d+)b-(\d+)a$/;
                  const simpleRegex1 = /^e(\d+)-(\d+)c$/;
                  const simpleRegex2 = /^e(\d+)-(\d+)p$/;

                  let sourceId, targetId, ignore;

                  let match = edgeId.match(reactflowRegex1);
                  if (match) {
                    [ignore, sourceId, targetId] = match;
                  }
                  match = edgeId.match(reactflowRegex2);
                  if (match) {
                    [ignore, sourceId, targetId] = match;
                  }
                  match = edgeId.match(simpleRegex1);
                  if (match) {
                    [ignore, sourceId, targetId] = match;
                  }
                  match = edgeId.match(simpleRegex2);
                  if (match) {
                    [ignore, sourceId, targetId] = match;
                  }

                  setNodes((prevNodes) => {
                    const sourceNode = prevNodes.find(
                      (node) => node.id === sourceId
                    );
                    const targetNode = prevNodes.find(
                      (node) => node.id === targetId
                    );
                    // console.log("source", sourceNode, targetNode);

                    if (!sourceNode || !targetNode) {
                      throw new Error("Source or target node not found");
                    }

                    if (
                      selection.sourceHandle === "c" ||
                      selection.sourceHandle === "d"
                    ) {
                      sourceNode.data.corequisites =
                        sourceNode.data.corequisites.filter(
                          (co) => co.id !== targetId
                        );
                      targetNode.data.corequisites =
                        targetNode.data.corequisites.filter(
                          (co) => co.id !== sourceId
                        );
                    } else {
                      sourceNode.data.postrequisites =
                        sourceNode.data.postrequisites.filter(
                          (co) => co !== targetId
                        );

                      // console.log("updated", sourceNode);
                    }

                    return prevNodes.map((node) => {
                      if (node.id === sourceNode.id) {
                        return { ...sourceNode };
                      } else if (node.id === targetNode.id) {
                        return { ...targetNode };
                      }
                      return node;
                    });
                  });

                  setEdges(
                    edges.filter(
                      (edge) =>
                        edge.id !== selection.id &&
                        edge.id !== `e${sourceId}-${targetId}c` &&
                        edge.id !== `e${targetId}-${sourceId}c`
                    )
                  );
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            <>
              {selection.type === "text" ? (
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-bold text-xl">Note Text:</label>
                  <textarea
                    name="text"
                    value={selection.data.text}
                    onChange={(e) => handleInputChange(e)}
                    className="input input-bordered bg-gray-700 text-white"
                  />
                  <label className="font-bold text-xl">
                    Choose the note color:
                  </label>
                  <input
                    name="color"
                    type="color"
                    value={selection.data.color}
                    onChange={(e) => handleInputChange(e)}
                    className=""
                  />
                  <button
                    className="btn btn-error mt-4 text-white"
                    onClick={() => {
                      setNodes(
                        nodes.filter((node) => node.id !== selection.id)
                      );
                    }}
                  >
                    Delete
                  </button>
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
                      <span key={postreq} className="badge badge-primary py-4">
                        {
                          nodes.find((node) => node.id === postreq)?.data
                            .courseCode
                        }
                      </span>
                    ))}
                  </div>
                  <label className="font-bold text-xl">Corequisites:</label>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {!selection.data.corequisites.length && (
                      <span className="text-gray-500">No corequisites</span>
                    )}
                    {selection.data.corequisites.map((coreq) => (
                      <span key={coreq.id} className="badge badge-primary py-4">
                        {
                          nodes.find((node) => node.id === coreq.id)?.data
                            .courseCode
                        }
                      </span>
                    ))}
                  </div>
                  <button
                    className="btn btn-error mt-4 text-white"
                    onClick={() => {
                      setNodes(
                        nodes.filter((node) => node.id !== selection.id)
                      );
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
