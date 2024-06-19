import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export default function TextNode({ data, isConnectable }) {
  return (
    <>
      <div
        className="flex flex-col rounded border-2 items-center p-6 w-48"
        style={{ borderColor: data.color }}
      >
        <p>{data.text}</p>
      </div>
    </>
  );
}