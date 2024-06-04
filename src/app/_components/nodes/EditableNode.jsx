/**
 * This file defines an EditableNode component
 * The component is designed to be used with the reactflow library, which provides
 * a way to create and manipulate a flowchart-like network of nodes.
 *
 * The EditableNode component displays data about a course, including its number and full name.
 * It also provides handles on all four sides that can be used to create connections to other nodes.
 *
 * The component uses the useCallback hook from React to create a function that updates the node's data
 *
 * The component is styled using Tailwind CSS.
 */

import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export default function EditableNode({ data, isConnectable }) {
  // Function to handle changes in the node data
  const onChange = useCallback(
    (evt) => {
      const { name, value } = evt.target;
      data[name] = value;
      // updateNodeData(data);
    },
    [data]
  );

  return (
    <>
      <div className="flex flex-col rounded border-0 bg-secondary items-center p-6 w-48">
        <h1 className="font-bold text-xl">{data.courseNumber}</h1>
        <h2 className="text-center">{data.fullName}</h2>
      </div>
      <Handle
        id="a"
        type="target"
        position={Position.Top}
        style={{ background: "#414A4C", width: 10, height: 10 }}
      />
      <Handle
        id="b"
        type="source"
        position={Position.Bottom}
        style={{ background: "#414A4C", width: 10, height: 10 }}
      />
    </>
  );
}
