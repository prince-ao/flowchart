import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export default function CoreqNode({ data }) {
  return (
    <div className="flex bg-primary p-6 rounded gap-4">
      <div className="bg-secondary rounded flex flex-col items-center p-2 w-40">
        <h1 className="font-bold text-xl text-center">{data.courseNumber1}</h1>
        <h2 className="text-center">{data.fullName1}</h2>
      </div>

      <div className="bg-secondary rounded flex flex-col items-center p-2 w-40">
        <h1 className="font-bold text-xl text-center">{data.courseNumber2}</h1>
        <h2 className="text-center">{data.fullName2}</h2>
      </div>
    </div>
  );
}
