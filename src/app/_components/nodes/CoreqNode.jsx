import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export default function CoreqNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <div className="flex bg-primary p-6 rounded gap-4">
        <div className="bg-secondary rounded flex flex-col items-center p-2 w-40">
          <h1>{data.courseNumber1}</h1>
          <h2 className="text-center">{data.fullName1}</h2>
        </div>

        <div className="bg-secondary rounded flex flex-col items-center p-2 w-40">
          <h1>{data.courseNumber2}</h1>
          <h2 className="text-center">{data.fullName2}</h2>
        </div>
      </div>

      <Handle
        id="a"
        type="target"
        position={Position.Top}
        style={{ background: "#414A4C" }}
      />

      <Handle
        id="b"
        type="source"
        position={Position.Bottom}
        style={{ background: "#414A4C" }}
      />
    </>
  );
}
