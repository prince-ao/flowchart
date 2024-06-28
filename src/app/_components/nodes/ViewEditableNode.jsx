import { Handle, Position } from "reactflow";

export default function ViewEditableNode({ data, selected }) {
  return (
    <>
      <div
        className={`flex flex-col rounded border-2 border-black items-center p-6 w-48  
        ${data.ghost ? "opacity-25" : ""}
${!data.missingRequirements ? "" : "bg-red-200 shadow-2xl"}
          ${!data.canTake ? "" : "bg-green-200 shadow-2xl"}
          ${!data.taken ? "" : "bg-blue-200 glass shadow-2xl"}
          `}
      >
        <h1 className="font-bold text-xl text-center">{data.courseCode}</h1>
        <h2 className="text-center">{data.courseName}</h2>
      </div>
      <Handle
        id="a"
        type="target"
        position={Position.Top}
        style={{ background: "#414A4C", width: 0, height: 0 }}
      />
      <Handle
        id="b"
        type="source"
        position={Position.Bottom}
        style={{ background: "#414A4C", width: 0, height: 0 }}
      />
      <Handle
        id="c"
        type="source"
        position={Position.Left}
        style={{ background: "#414A4C", width: 0, height: 0 }}
      />
      <Handle
        id="d"
        type="target"
        position={Position.Right}
        style={{ background: "#414A4C", width: 0, height: 0 }}
      />
    </>
  );
}
