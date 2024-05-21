import { useState } from 'react';
import ReactFlow, { useOnSelectionChange, useEdges, getConnectedEdges } from 'reactflow';
 
export default function NodeEditorPanel() {
    const [selectedNodes, setSelectedNodes] = useState([]);
    const edges = useEdges();
    const connectedEdges = getConnectedEdges(selectedNodes, edges);

    useOnSelectionChange({
      onChange: ({ nodes }) => {
        setSelectedNodes(nodes.map((node) => node));
      },
    });

    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...selectedNodes];
      list[index]['data'][name] = value;
      setSelectedNodes(list);
    };

    const moveToPrerequisites = (nodeId, index) => {
      const list = [...selectedNodes];
      const node = list[index];
      const corequisites = node.data.corequisites || [];
      const corequisitesIndex = corequisites.indexOf(nodeId);
      if (corequisitesIndex > -1) {
        corequisites.splice(corequisitesIndex, 1);
        node.data.prerequisites = [...(node.data.prerequisites || []), nodeId];
      }
      setSelectedNodes(list);
    };

    const moveToCorequisites = (nodeId, index) => {
      const list = [...selectedNodes];
      const node = list[index];
      const prerequisites = node.data.prerequisites || [];
      const prerequisitesIndex = prerequisites.indexOf(nodeId);
      if (prerequisitesIndex > -1) {
        prerequisites.splice(prerequisitesIndex, 1);
        node.data.corequisites = [...(node.data.corequisites || []), nodeId];
      }
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
                <p>Prerequisites: {node.data.prerequisites.map((prereq) => <span key={prereq} onClick={() => moveToCorequisites(prereq, index)}>{prereq}</span>)}</p>
                <p>Corequisite: {node.data.corequisites.map((coreq) => <span key={coreq} onClick={() => moveToPrerequisites(coreq, index)}>{coreq}</span>)}</p>
            </div>
        ))}
    </div>
  );
}