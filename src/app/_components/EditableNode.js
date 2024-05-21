import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

export default function EditableNode ({ data, isConnectable}) {
    // Function to handle changes in the node data
    const onChange = useCallback((evt) => {
        const { name, value } = evt.target;
        data[name] = value;
        // updateNodeData(data);
    }, [data]);

    return (
        
        // Node container with Tailwind CSS classes for styling
        <>
        <div className=" px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
            <div className="flex">
            {/* Node data display */}
            <div>
                {/* Course number displayed as a heading */}
                <h1 className="text-lg font-bold mb-2">{data.courseNumber}</h1>
                {/* Full course name displayed as a subheading */}
                <h2 className=" text-sm text-gray-700">{data.fullName} 🏫</h2>
            </div>
            </div>
            {/* Handles for creating connections from the bottom, left, and right of the node */}
                   {/* Handle for creating connections from the top of the node */}
            <Handle id ="a" type="target" position={Position.Top} style={{ background: '#6ede87' }} />
            {/* Handle for creating connections from the bottom of the node */}
            <Handle id = "b" type="source" position={Position.Bottom} style={{ background: '#6865A5' }} />
            {/* Handle for creating connections from the left of the node */}
            <Handle id = "c" type="source" position={Position.Left} style={{ background: '#ff0072' }} />
            {/* Handle for creating connections from the right of the node */}
            <Handle id = "d" type="target" position={Position.Right} style={{ background: '#ff0072' }} />


        </div>
        </>
    );
}