import React from 'react';


export default function DragNodes() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the left.</div>
      <div className="dndnode input btn" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Start Node
      </div>
      <div className="dndnode btn" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Class Node
      </div>
      <div className="dndnode output btn" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        End Node
      </div>
    </aside>
  );
};