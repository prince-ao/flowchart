import { useCallback, useEffect } from 'react';
import { Handle, NodeToolbar, Position } from 'reactflow';

export default function EditableNode ({ data, isConnectable, updateNodeData }) {

    const onChange = useCallback((evt) => {
        const { name, value } = evt.target;
        data[name] = value;
        console.log(data);
        // updateNodeData(data);
    }, [data]);

    return (
        <div className="class-node">
            {/* <NodeToolbar isVisible={data.toolbarVisible} position='={data.toolbarPosition}'>What could this be?</NodeToolbar> */}
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <div>
                <h1>{data.courseNumber}</h1>
                <h2>{data.fullName}</h2>
            </div>
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Left}  isConnectable={isConnectable} />
            <Handle type="source" position={Position.Right}  isConnectable={isConnectable} />
        </div>
    );
}