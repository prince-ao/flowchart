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
    // References to the reactflow instance and the ID of the node being connected
    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);

    // State for the nodes and edges in the flowchart
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // State for the reactflow instance
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    // Function to handle connections between nodes
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

    // Function to handle drag over events
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Function to handle drop events
    const onDrop = useCallback((event) => {
        event.preventDefault();

        const type = event.dataTransfer.getData('application/reactflow');

        // Check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
            return;
        }

        // Get the position where the element was dropped
        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        // Create a new node at the drop position
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

        // Add the new node to the state
        setNodes((nds) => nds.concat(newNode));
    }, [reactFlowInstance]);

    // Define the types of nodes that can be created
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