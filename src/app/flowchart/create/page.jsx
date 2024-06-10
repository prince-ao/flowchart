/**
 * This file defines a CreateFlowchart component for use in a React application.
 * The component is designed to be used with the reactflow library, which provides
 * a way to create and manipulate a flowchart-like network of nodes.
 *
 * The CreateFlowchart component allows users to create a flowchart by dragging and dropping nodes,
 * and connecting them with edges. It also provides a way to save the current state of the nodes in the flowchart to a JSON file.
 *
 * The component uses the useState, useRef, useCallback, and useMemo hooks from React to manage the state of the nodes and edges,
 * a reference to the reactflow instance, and the types of nodes that can be created.
 *
 * The onConnect function is used to add a new edge and update the prerequisites of the target node.
 *
 * The onDragOver function is used to set the drop effect for the drag operation.
 *
 * The onDrop function is used to create a new node at the position where an element is dropped.
 *
 * The nodeTypes object is used to specify the types of nodes that can be created.
 *
 * The component is styled using Tailwind CSS.
 */
"use client";
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  ControlButton,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from "reactflow";
import { FilePlusIcon, BoxIcon } from "@radix-ui/react-icons";
import "reactflow/dist/style.css";
import DragNodes from "@/app/_components/DragNodes";
import { EditableNode, CoreqNode } from "@/app/_components/nodes";
import NodeEditorPanel from "@/app/_components/NodeEditorPanel";

// Initial state for nodes and edges
const initialNodes = [];
const initialEdges = [];
const MAX_NODES = 200;

export default function CreateFlowchart() {
  // References to the reactflow instance and the ID of the node being connected
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const hasRendered = useRef(false);

  // State for the nodes and edges in the flowchart
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  function idExists(id) {
    for (const node of nodes) {
      if (node.id === `${id}`) return true;
    }
    return false;
  }

  function getId() {
    let randomNumber = Math.floor(Math.random() * MAX_NODES) + 1;
    while (idExists(randomNumber)) {
      randomNumber = Math.floor(Math.random() * MAX_NODES) + 1;
    }
    return `${randomNumber}`;
  }

  // State for the reactflow instance
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Function to handle connections between nodes
  const onConnect = useCallback(
    (params) => {
      connectingNodeId.current = null;

      // Set the default markerEnd
      let markerEnd = {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
        color: "#79BDE8",
      };
      let style = {
        stroke: "#79BDE8",
        strokeWidth: 3,
      };

      let type = "bezier";
      let animated = true;

      // Add the new edge
      setEdges((eds) =>
        addEdge({ ...params, markerEnd, type, style, animated }, eds)
      );

      // Add the source node to the target node's prerequisites list
      setNodes((ns) =>
        ns.map((n) => {
          if (n.id === params.target) {
            return {
              ...n,
              data: {
                ...n.data,
                prerequisites: [...n.data.prerequisites, params.source],
              },
            };
          }
          return n;
        })
      );
    },
    [nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // Get the position where the element was dropped
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = getId();
      let newNode = undefined;
      if (type === "coreq") {
        newNode = {
          id: id,
          type,
          position,
          data: {
            label: ` node ${id}`,
            courseNumber1: "CSC 101",
            fullName1: "Introduction to Computer Science",

            courseNumber2: "CSC 101",
            fullName2: "Introduction to Computer Science",

            description: "",
            prerequisites: [],
          },
        };
      } else {
        newNode = {
          id: id,
          type,
          position,
          data: {
            label: ` node ${id}`,
            courseNumber: "CSC 101",
            fullName: "Introduction to Computer Science",

            description: "",
            prerequisites: [],
          },
        };
      }

      // Add the new node to the state
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const nodeTypes = useMemo(
    () => ({
      single: EditableNode,
      coreq: CoreqNode,
    }),
    []
  );

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const cachedNodes = localStorage.getItem("cache_nodes");
      const cachedEdges = localStorage.getItem("cache_edges");

      console.log("here3");
      // console.log(cachedNodes, cachedEdges);
      if (cachedNodes && cachedEdges) {
        setNodes(JSON.parse(cachedNodes));
        setEdges(JSON.parse(cachedEdges));
      }
    };

    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    if (hasRendered.current) {
      console.log("here1");
      localStorage.setItem("cache_nodes", JSON.stringify(nodes));
      localStorage.setItem("cache_edges", JSON.stringify(edges));
    } else {
      console.log("here2");
      hasRendered.current = true;
    }
  }, [nodes, edges]);

  function clearCache() {
    setNodes([]);
    setEdges([]);
  }

  return (
    <div className="flex flex-grow-1 h-100 w-100 md:flex-row flex-col ">
      <ReactFlowProvider>
        <div className="h-screen w-screen" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Panel position="top-right">
              <NodeEditorPanel setEdges={setEdges} />
            </Panel>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <DragNodes clearCache={clearCache} />
      </ReactFlowProvider>
    </div>
  );
}
