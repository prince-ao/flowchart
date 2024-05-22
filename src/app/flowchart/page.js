/**
 * This file defines a Flowchart component for use in a React application.
 * The component is designed to be used with the reactflow library, which provides
 * a way to create and manipulate a flowchart-like network of nodes.
 * 
 * The Flowchart component fetches data from a JSON file and uses it to create a flowchart.
 * It also provides a way to customize the color of the nodes based on their type.
 * 
 * The component uses the useState and useEffect hooks from React to manage the state of the nodes and edges,
 * and to fetch the data when the component mounts.
 * 
 * The nodeColor function is used to determine the color of a node based on its type.
 * 
 * The component is styled using Tailwind CSS.
 */
"use client"
import { useEffect, useState } from "react"
import ReactFlow, { Background, MiniMap, Controls } from "reactflow"

import 'reactflow/dist/style.css';

// Function to determine the color of a node based on its type
const nodeColor = (node) => {
  switch (node.type) {
    case 'input':
      return '#6ede87';
    case 'output':
      return '#6865A5';
    default:
      return '#ff0072';
  }
};

export default function Flowchart() {
  // State for the nodes and edges in the flowchart
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  /* Fetch the flowchart data from the JSON file 
  and set the nodes and edges state when the component mounts */
  useEffect(() => {
    fetch('flowchart.json')
      .then(res => res.json())
      .then(courses => {
        // Create nodes from the course data
        const nodes = courses.map(course => ({
          id: course.id,
          type: course.nodeType,
          data: { label: course.courseName },
          style: { backgroundColor: nodeColor({type: 'default'}), color: 'white' },
          position: { x: course.position.x, y: course.position.y },
        }));

        // Create edges from the course data
        const edges = courses.flatMap(course => [
          ...course.prerequisites.map(prerequisite => ({
            id: 'e' + prerequisite + '-' + course.id,
            source: prerequisite,
            target: course.id,
            type: 'default',
            animated: true,
          })),
          ...course.corequisites.map(corequisite => ({
            id: 'e' + corequisite + '-' + course.id,
            source: corequisite,
            target: course.id,
            type: 'default',
            animated: true,
          })),
        ]);

        // Set the state for the nodes and edges
        setNodes(nodes);
        setEdges(edges);
      });
  }, []);

  return (
    <section className=" min-h-screen">
      <div className="hero place-content-center">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold">2023-2024 Flowchart</h1>
            <p className="py-6">This flowchart is for CSI 2023-2024</p>
          </div>
        </div>
      </div>
      <div className=" h-96">
        {nodes.length === 0 && edges.length === 0 && <p>Loading...</p>}
        {nodes.length !== 0 && edges.length !== 0 && (
        <ReactFlow nodes={nodes} edges ={edges}  fitView>
           <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
        )}
      </div>
    </section>
  )
}