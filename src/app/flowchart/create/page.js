"use client"
import React, { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, { 
    Controls, 
    MiniMap, 
    Background, 
    ControlButton, 
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Panel } from 'reactflow';
import { FilePlusIcon, BoxIcon } from "@radix-ui/react-icons";
import 'reactflow/dist/style.css';
import DragNodes from '@/app/_components/DragNodes';
import EditableNode from '@/app/_components/EditableNode';
import NodeEditorPanel from '@/app/_components/NodeEditorPanel';

  // Initial state for nodes and edges
  const initialNodes = [];
  const initialEdges = [];

  let id = 0;
  const getId = () => `${id++}`;

export default function CreateFlowchart() {
    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);


    const onConnect = useCallback((params) => {
      connectingNodeId.current = null;
      // Add the new edge
      setEdges((eds) => addEdge(params, eds));
    
      // Add the source node to the target node's prerequisites list
      setNodes((ns) => ns.map((n) => {
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
      }));
    }, []);

    const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);
  
    const onDrop = useCallback(
      (event) => {
        event.preventDefault();
  
        const type = event.dataTransfer.getData('application/reactflow');
  
        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }
  
        // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
        // and you don't need to subtract the reactFlowBounds.left/top anymore
        // details: https://reactflow.dev/whats-new/2023-11-10
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        const newNode = {
          id: getId(),
          type,
          position,
          data: { 
            label: ` node ${id}`, 
            courseNumber: 'CSC 101', 
            fullName: 'Introduction to Computer Science', 
            description: 'This course introduces students to the field of computer science.',
            corequisites: [],
            prerequisites: [],
          },
        };
  
        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance],
    );
    
    const nodeTypes = useMemo(() => ({
        input: EditableNode,
        default: EditableNode,
        output: EditableNode,
        }), []);

    return (
      <div className="dndflow">
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
            <NodeEditorPanel />
            </Panel> 
            <Background />
              <Controls />
            </ReactFlow>
          </div>
            <DragNodes />
        </ReactFlowProvider>
      </div>
    );
  };