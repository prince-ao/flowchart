/** */
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
import {
  dirtyNodes,
  getDegreeMapByDegreeYear,
  getFlowchartEnv,
} from "@/utils/flowchart-api";

// Initial state for nodes and edges
const initialNodes = [];
const initialEdges = [];
const MAX_NODES = 200;

function EditFlowchart() {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const hasRendered = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const flowchartEnv = getFlowchartEnv();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [year, setYear] = useState("");
  const [degree, setDegree] = useState("");
  const [loading, setLoading] = useState(true);

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

    // const loadFromLocalStorage = () => {
    //   const cachedNodes = localStorage.getItem("cache_nodes");
    //   const cachedEdges = localStorage.getItem("cache_edges");

    //   if (cachedNodes && cachedEdges) {
    //     setNodes(JSON.parse(cachedNodes));
    //     setEdges(JSON.parse(cachedEdges));
    //   }
    // };

    // loadFromLocalStorage();
    (async () => {
      try {
        setLoading(true);
        const degreeMap = await getDegreeMapByDegreeYear(degree, year);
        const courses = degreeMap[0][flowchartEnv][0].flowchart_json;

        const nodes = dirtyNodes(courses);

        const edges = courses.flatMap((course) =>
          course.type !== "text"
            ? [
                ...course.postrequisites.map((post) => ({
                  id: "e" + course.id + "-" + post + "p",
                  source: course.id,
                  target: post,
                  type: "default",
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: "#000",
                  },
                  style: {
                    stroke: "#000",
                    strokeWidth: 3,
                  },
                  animated: true,
                })),
                ...course.corequisites
                  .map((co) => {
                    if (co.source) {
                      return {
                        id: `e${co.id}-${course.id}c`,
                        source: course.id,
                        target: co.id,
                        sourceHandle: "c",
                        targetHandle: "d",
                        type: "default",
                        markerEnd: {
                          type: MarkerType.ArrowClosed,
                          width: 10,
                          height: 10,
                          color: "#f00",
                        },
                        markerStart: {
                          type: MarkerType.ArrowClosed,
                          width: 10,
                          height: 10,
                          color: "#f00",
                        },
                        style: {
                          stroke: "#f00",
                          strokeWidth: 3,
                        },
                        animated: true,
                      };
                    }
                  })
                  .filter((edge) => edge !== undefined),
              ]
            : []
        );

        setNodes(nodes);
        setEdges(edges);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  // useEffect(() => {
  //   console.log("teser1", nodes, edges);
  //   if (hasRendered.current) {
  //     localStorage.setItem("cache_nodes", JSON.stringify(nodes));
  //     localStorage.setItem("cache_edges", JSON.stringify(edges));
  //   } else {
  //     hasRendered.current = true;
  //   }
  // }, [nodes, edges]);

  function clearCache() {
    setNodes([]);
    setEdges([]);
  }

  return (
    <div className="flex flex-grow-1 h-100 w-100 md:flex-row flex-col ">
      {loading ? (
        <div className="loading loading-spinner loading-lg text-center"></div>
      ) : (
        <ReactFlowProvider>
          <div className="h-screen w-screen" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={(e) => setReactFlowInstance(e)}
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
          <DragNodes clearCache={clearCache} year={year} degree={degree} />
        </ReactFlowProvider>
      )}
    </div>
  );
}

function SuspenseEditFlowchart() {
  return (
    <Suspense>
      <EditFlowchart />
    </Suspense>
  );
}

export default withAuth(
  SuspenseEditFlowchart,
  () => {},
  () => {
    localStorage.setItem("homeAuthFailed", "true");
  },
  "/admin/login",
  ""
);
