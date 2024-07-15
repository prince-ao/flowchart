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
  Suspense,
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
import { EditableNode, TextNode } from "@/app/_components/nodes";
import EditorPanel from "@/app/_components/EditorPanel";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { withAuth } from "@/utils/authentication";

// Initial state for nodes and edges
const initialNodes = [];
const initialEdges = [];
const MAX_NODES = 100000000000; // increase if a lot of collisions

function CreateFlowchart() {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const hasRendered = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [year, setYear] = useState("");
  const [degree, setDegree] = useState("");

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
    console.log(randomNumber);
    return `${randomNumber}`;
  }

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => {
      connectingNodeId.current = null;

      if (params.sourceHandle === "a" || params.sourceHandle === "b") {
        let markerEnd = {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: "#000",
        };
        let style = {
          stroke: "#000",
          strokeWidth: 3,
        };

        let type = "default";
        let animated = true;

        setEdges((eds) =>
          addEdge({ ...params, markerEnd, type, style, animated }, eds)
        );

        setNodes((ns) =>
          ns.map((n) => {
            if (n.id === params.source) {
              return {
                ...n,
                data: {
                  ...n.data,
                  postrequisites: [...n.data.postrequisites, params.target],
                },
              };
            }
            return n;
          })
        );
      } else {
        let markerEnd = {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: "#F00",
        };
        let markerStart = {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: "#F00",
        };
        let style = {
          stroke: "#F00",
          strokeWidth: 3,
        };

        let type = "default";
        let animated = true;

        setEdges((eds) =>
          addEdge(
            { ...params, markerEnd, markerStart, type, style, animated },
            eds
          )
        );

        setNodes((ns) =>
          ns.map((n) => {
            if (n.id === params.source) {
              return {
                ...n,
                data: {
                  ...n.data,
                  corequisites: [
                    ...n.data.corequisites,
                    { id: params.target, source: true },
                  ],
                },
              };
            } else if (n.id === params.target) {
              return {
                ...n,
                data: {
                  ...n.data,
                  corequisites: [
                    ...n.data.corequisites,
                    { id: params.source, source: false },
                  ],
                },
              };
            }
            return n;
          })
        );
      }
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

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = getId();

      const newNode =
        type === "text"
          ? {
              id: id,
              type,
              position,
              data: {
                text: "",
                color: "#000",
              },
            }
          : {
              id: id,
              type,
              position,
              data: {
                courseCode: "CSC 101",
                courseName: "Introduction to Computer Science",
                postrequisites: [],
                corequisites: [],
              },
            };

      // Add the new node to the state
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const nodeTypes = useMemo(
    () => ({
      single: EditableNode,
      text: TextNode,
    }),
    []
  );

  useEffect(() => {
    const year = searchParams.get("year");
    const degree = searchParams.get("degree");

    if (!year || !degree) {
      router.push("/admin/home");
    }

    setYear(year);
    setDegree(degree);

    const loadFromLocalStorage = () => {
      const cachedNodes = localStorage.getItem("cache_nodes");
      const cachedEdges = localStorage.getItem("cache_edges");

      // console.log("here3");
      // console.log(cachedNodes, cachedEdges);
      if (cachedNodes && cachedEdges) {
        setNodes(JSON.parse(cachedNodes));
        setEdges(JSON.parse(cachedEdges));
      }
    };

    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    // i don't have to update all the time... I only have to update once.
    // console.log(nodes);

    if (hasRendered.current) {
      localStorage.setItem("cache_nodes", JSON.stringify(nodes));
      localStorage.setItem("cache_edges", JSON.stringify(edges));
    } else {
      hasRendered.current = true;
    }
  }, [nodes, edges]);

  // clear cache upon new arrival
  // send back if fake url (direct url access)

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
              <EditorPanel
                setEdges={setEdges}
                setNodes={setNodes}
                edges={edges}
                nodes={nodes}
              />
            </Panel>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <DragNodes clearCache={clearCache} year={year} degree={degree} create />
      </ReactFlowProvider>
    </div>
  );
}

function SuspenseCreateFlowchart() {
  return (
    <Suspense>
      <CreateFlowchart />
    </Suspense>
  );
}

export default withAuth(
  SuspenseCreateFlowchart,
  () => {},
  () => {
    localStorage.setItem("homeAuthFailed", "true");
  },
  "/admin/login",
  ""
);
