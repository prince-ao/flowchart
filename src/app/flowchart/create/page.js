"use client"
import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, { 
    Controls, 
    MiniMap, 
    Background, 
    ControlButton, 
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState, } from 'reactflow';
import { FilePlusIcon, BoxIcon } from "@radix-ui/react-icons";
import 'reactflow/dist/style.css';
import DragNodes from '@/app/_components/DragNodes';
  
  // Initial state for nodes and edges
  const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Test Node' },
        position: { x: 250, y: 5 },
        },
  ];
  const initialEdges = [];

  let id = 0;
  const getId = () => `dndnode_${id++}`;

export default function CreateFlowchart() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
    const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)),
      [],
    );
  
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
          data: { label: `${type} node` },
        };
  
        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance],
    );
  
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
              fitView
            >
            <Background />
              <Controls />
            </ReactFlow>
          </div>
            <DragNodes />
        </ReactFlowProvider>
      </div>
    );
  };