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
      <div className="flex flex-col rounded border-2 border-black items-center p-6 w-48">
        <h1 className="font-bold text-xl text-center">{data.courseCode}</h1>
        <h2 className="text-center">{data.courseName}</h2>
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
      <Handle
        id="c"
        type="source"
        position={Position.Left}
        style={{ background: "#414A4C", width: 10, height: 10 }}
      />
      <Handle
        id="d"
        type="target"
        position={Position.Right}
        style={{ background: "#414A4C", width: 10, height: 10 }}
      />
    </>
  );
}
