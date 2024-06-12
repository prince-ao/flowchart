import { Handle, Position } from "reactflow";

export default function ViewCoreqNode({ data, selected }) {
  const TOTAL_WIDTH = 134.168;
  const TOTAL_WIDTH2 = 362.504;
  const MARGIN_HEIGHT = 25;
  return (
    <>
      <div
        className={`flex bg-primary p-6 rounded gap-4 ${
          selected ? "border-[6px] border-green-500" : ""
        } ${data.canTake ? "border-[6px] border-red-500" : ""}`}
      >
        <div className="bg-secondary rounded flex flex-col items-center p-2 w-40">
          <h1 className="font-bold text-xl text-center">
            {data.courseNumber1}
          </h1>
          <h2 className="text-center">{data.fullName1}</h2>
        </div>

        <div className="bg-secondary rounded flex flex-col items-center p-2 w-40">
          <h1 className="font-bold text-xl text-center">
            {data.courseNumber2}
          </h1>
          <h2 className="text-center">{data.fullName2}</h2>
        </div>
      </div>
      <Handle
        id="a"
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{
          background: "#414A4C",
          width: 0,
          height: 0,
          left: TOTAL_WIDTH,
          top: MARGIN_HEIGHT,
        }}
      />
      <Handle
        id="b"
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{
          background: "#414A4C",
          width: 0,
          height: 0,
          left: TOTAL_WIDTH,
          bottom: MARGIN_HEIGHT,
        }}
      />

      <Handle
        id="c"
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{
          background: "#414A4C",
          width: 0,
          height: 0,
          left: TOTAL_WIDTH2,
          top: MARGIN_HEIGHT,
        }}
      />

      <Handle
        id="d"
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{
          background: "#414A4C",
          width: 0,
          height: 0,
          left: TOTAL_WIDTH2,
          bottom: MARGIN_HEIGHT,
        }}
      />

      <Handle
        id="e"
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{
          background: "#414A4C",
          width: 0,
          height: 0,
        }}
      />

      <Handle
        id="f"
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{
          background: "#414A4C",
          width: 0,
          height: 0,
        }}
      />
    </>
  );
}
