/*
    This is the page for editing a degree. It is a form that allows the user to edit the degree's name and description.
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
import { getDegreeMapByDegreeYear } from "@/utils/flowchart-api";

// Initial state for nodes and edges
const initialNodes = [];
const initialEdges = [];
const MAX_NODES = 200;

export default function EditFlowchart({params}) {
  // References to the reactflow instance and the ID of the node being connected
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const hasRendered = useRef(false);

  // State for the nodes and edges in the flowchart
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [flowcharts, setFlowcharts] = useState([]);
    const [loading , setLoading] = useState(true);
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
    (async () => {
      try {
        setLoading(true);
        const degree = decodeURIComponent(params.degree);
        const year = params.year;
        const flowcharts = await getDegreeMapByDegreeYear(degree, year);
        if (flowcharts.length > 0 && flowcharts[0].flowcharts_dev.length > 0) {
          const flowchart = flowcharts[0].flowcharts_dev[0];
          const nodes = flowchart.flowchart_json.map(node => {
            if (node.nodeType === 'coreq') {
              return {
                id: node.id,
                type: node.nodeType,
                position: node.position,
                data: {
                  label: `node ${node.id}`,
                  courseNumber1: node.courseName1,
                  fullName1: node.fullName1,
                  courseNumber2: node.courseName2,
                  fullName2: node.fullName2,
                  description: node.description || '',
                  prerequisites: node.prerequisites || [],
                },
              };
            } else {
              return {
                id: node.id,
                type: node.nodeType,
                position: node.position,
                data: {
                  label: `node ${node.id}`,
                  courseNumber: node.courseName,
                  fullName: node.fullName,
                  description: node.description || '',
                  prerequisites: node.prerequisites || [],
                },
              };
            }
          });
          const edges = flowchart.flowchart_json.filter(node => node.prerequisites && node.prerequisites.length > 0)
            .map(node => node.prerequisites.map(source => ({ source, target: node.id })))
            .flat();
          setNodes(nodes);
          setEdges(edges);
        }
      } catch (error) {
        console.error(error);
      }
        setLoading(false);
    })();
  }, [params.degree, params.year]);


  function clearCache() {
    setNodes([]);
    setEdges([]);
  }

  return (
    <div className="flex flex-grow-1 h-100 w-100 md:flex-row flex-col ">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <span className="loading loading-lg"></span>
        </div>
      ) : nodes.length === 0 && !loading ? (
        <div className="fixed inset-0 flex items-center justify-center text-2xl">
          There is no flow chart to edit
        </div>
      ) : (
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
      )}
    </div>
  );
}
