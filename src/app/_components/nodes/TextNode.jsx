import { useCallback } from "react";
import { Handle, Position, NodeResizer } from "reactflow";

export default function TextNode({ data, isConnectable }) {
  return (
    <>
      <div
        className="flex flex-col rounded border-2 items-center p-6"
        style={{ borderColor: data.color }}
      >
        <NodeResizer isVisible={true} minWidth={180} minHeight={100} />
        <p>{data.text}</p>
      </div>
    </>
  );
}
