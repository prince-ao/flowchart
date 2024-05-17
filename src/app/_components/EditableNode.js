import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

export default function EditableNode ({ data, isConnectable }) {
    const onChange = useCallback((evt) => {
        const { name, value } = evt.target;
        data[name] = value;
        console.log(data);
    }, [data]);

    return (
        <div className="class-node">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <div>
                <label htmlFor="courseNumber">Course Number:</label>
                <input id="courseNumber" name="courseNumber" onChange={onChange} className="nodrag input input-bordered input-primary h-1/2 w-full max-w-xs text-white text-sm" />
                <label htmlFor="fullName">Full Name:</label>
                <input id="fullName" name="fullName" onChange={onChange} className="nodrag input input-bordered input-primary h-1/2 w-full max-w-xs text-white " />
                <label htmlFor="description">Description:</label>
                <input id="description" name="description" onChange={onChange} className="textarea small-font textarea-bordered textarea-md w-full max-w-x text-white" />
            </div>
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Left}  isConnectable={isConnectable} />
            <Handle type="source" position={Position.Right}  isConnectable={isConnectable} />
        </div>
    );
}