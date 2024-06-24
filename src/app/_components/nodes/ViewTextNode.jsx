import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export default function ViewTextNode({ data, isConnectable }) {
  return (
    <>
      <div
        className="flex flex-col rounded border-2 items-center p-6 w-48"
        style={{
          borderColor: data.color,
          width: data.width,
        }}
      >
        <p>{data.text}</p>
      </div>
    </>
  );
}
