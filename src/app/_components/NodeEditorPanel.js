import { useState } from 'react';
import ReactFlow, { useOnSelectionChange, useEdges, getConnectedEdges } from 'reactflow';
 
export default function NodeEditorPanel() {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const edges = useEdges();
  const connectedEdges = getConnectedEdges(selectedNodes, edges);

  useOnSelectionChange({
    onChange: ({ nodes}) => {
      setSelectedNodes(nodes.map((node) => node));
    },
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...selectedNodes];
    list[index]['data'][name] = value;
    setSelectedNodes(list);
  };
  

  return (
    <div>
        {
        selectedNodes.map((node, index) => (
            <div key={node.id}>
                <p>Label: <input name="label" value={node.data.label} onChange={e => handleInputChange(e, index)} /></p>
                <p>Course Number: <input name="courseNumber" value={node.data.courseNumber} onChange={e => handleInputChange(e, index)} /></p>
                <p>Full Name: <input name="fullName" value={node.data.fullName} onChange={e => handleInputChange(e, index)} /></p>
                <p>Description: <input name="description" value={node.data.description} onChange={e => handleInputChange(e, index)} /></p>
            </div>
        ))}
        {
        connectedEdges.map((edge) => (
            <div key={edge.id}>
                <p>Edge ID: {edge.id}</p>
                <p>Source: {edge.source}</p>
                <p>Target: {edge.target}</p>
            </div>
        ))
        }
    </div>
  );
}