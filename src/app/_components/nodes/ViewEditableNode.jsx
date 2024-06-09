import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export default function EditableNode({ data, isConnectable }) {
  return (
    <div className="flex flex-col rounded border-0 bg-secondary items-center p-6 w-48">
      <h1 className="font-bold text-xl text-center">{data.courseNumber}</h1>
      <h2 className="text-center">{data.fullName}</h2>
    </div>
  );
}
