import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export default function EditableNode({ data }) {
  return (
    <>
      <div className="flex flex-col rounded border-0 bg-secondary items-center p-6 w-48">
        <h1 className="font-bold text-xl text-center">{data.courseNumber}</h1>
        <h2 className="text-center">{data.fullName}</h2>
      </div>
      <Handle
        id="a"
        type="target"
        isConnectable={false}
        position={Position.Top}
        style={{ background: "#414A4C", width: 0, height: 0 }}
      />
      <Handle
        id="b"
        type="source"
        isConnectable={false}
        position={Position.Bottom}
        style={{ background: "#414A4C", width: 0, height: 0 }}
      />
    </>
  );
}
