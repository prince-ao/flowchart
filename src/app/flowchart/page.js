"use client"
import { useEffect, useState } from "react"
import ReactFlow, { Background, MiniMap, Controls } from "reactflow"

import 'reactflow/dist/style.css';

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
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  /* Fetch the flowchart data from the JSON file 
  and set the nodes and edges state when the component mounts */
  
  useEffect(() => {
    fetch('flowchart.json')
      .then(res => res.json())
      .then(courses => {
        const nodes = courses.map(course => ({
          id: course.id,
          type: course.nodeType,
          data: { label: course.courseName },
          style: { backgroundColor: nodeColor({type: 'default'}), color: 'white' },
          position: { x: course.position.x, y: course.position.y },
        }));

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