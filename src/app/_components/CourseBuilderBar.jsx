import { useEffect, useState } from 'react';
import { useNodes, useEdges } from 'reactflow';

export default function CourseBuilderBar({setNodes = () => {}, setEdges = () => {}}) {
  const nodes = useNodes();
  const edges = useEdges();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodes, setSelectedNodes] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(true); // Add this line

  const nodesPerPage = 8; // Adjust this value as needed

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    // Update search results
    if (event.target.value) {
      const lowerCaseSearchTerm = event.target.value.toLowerCase();
      const results = nodes.filter((node) => 
        node.data.courseName.toLowerCase().includes(lowerCaseSearchTerm) ||
        node.data.courseCode.toLowerCase().includes(lowerCaseSearchTerm)
      ).slice(0, 5); // Limit to 5 results
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultSelect = (node) => {
    handleNodeSelect(node);
    setSearchTerm(''); // Clear search term
    setSearchResults([]); // Clear search results
  };


  const handleNodeSelect = (node) => {
    setSelectedNodes((prevSelectedNodes) => {
      const newSelectedNodes = new Map(prevSelectedNodes);
      let isNodeDeselected = false;
      if (newSelectedNodes.has(node.id)) {
        newSelectedNodes.delete(node.id);
        isNodeDeselected = true;
      } else {
        newSelectedNodes.set(node.id, node.data.courseCode);
      }
  
      // Update highlighted nodes
      setHighlightedNodes((prevHighlightedNodes) => {
        const newHighlightedNodes = new Set(prevHighlightedNodes);
        if (isNodeDeselected) {
          // Remove the node and its postrequisites from highlighted nodes
          newHighlightedNodes.delete(node.id);
          if (node.data.postrequisites) {
            node.data.postrequisites.forEach((id) => newHighlightedNodes.delete(id));
          }
        } else if (node.data.postrequisites) {
          node.data.postrequisites.forEach((id) => newHighlightedNodes.add(id));
        }
        return newHighlightedNodes;
      });
  
      return newSelectedNodes;
    });
  };
  useEffect(() => {
    // Create new arrays of nodes and edges with updated colors
  
    const newNodes = nodes.map((node) => {
      const newNode = { ...node, data: { ...node.data } };
  
      if (selectedNodes.size > 0) {
        newNode.data.canTakeCourse = selectedNodes.has(node.id) || highlightedNodes.has(node.id);
        newNode.data.futureCourse = highlightedNodes.has(node.id);
      } else {
        delete newNode.data.canTakeCourse;
        delete newNode.data.futureCourse;
      }
  
      return newNode;
    });
  
    const newEdges = edges.map((edge) => ({
      ...edge,
      style: {
        ...edge.style,
        opacity: highlightedNodes.has(edge.source) || highlightedNodes.has(edge.target) ? 1 : 0.5,
      },
      animated: highlightedNodes.has(edge.source) || highlightedNodes.has(edge.target),
    }));
  
    console.log("newNodes", newNodes);
  
    // Update the nodes and edges
    setNodes(newNodes);
    setEdges(newEdges);
  }, [selectedNodes, highlightedNodes]);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === 'prev' && prevPage > 1) {
        return prevPage - 1;
      } else if (direction === 'next' && prevPage < totalPages) {
        return prevPage + 1;
      } else {
        return prevPage;
      }
    });
  };

  const startIndex = (currentPage - 1) * nodesPerPage;
  const endIndex = startIndex + nodesPerPage;
  const totalPages = Math.ceil(nodes.length / nodesPerPage);

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-md p-2 overflow-x-auto overflow-y-auto h-[700px]">
      <>

        <h2 className="text-lg text-center font-bold mb-2">Course Builder</h2>
        <input
          type="text"
          className="input input-bordered w-full text-sm"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchResults.length > 0 && (
          <div className="border rounded mt-1">
            {searchResults.map((node) => (
              <div
                key={node.id}
                className="p-1 hover:bg-gray-200 cursor-pointer text-sm"
                onClick={() => handleSearchResultSelect(node)}
              >
                {node.data.courseCode} - {node.data.courseName}
              </div>
            ))}
          </div>
        )}
  
            <h3 className="text-md text-center font-bold mt-2">Taken Classes</h3>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {selectedNodes.size > 0 ? (
              Array.from(selectedNodes.keys()).map((nodeId) => {
                const node = nodes.find((n) => n.id === nodeId);
                return (
                  <div key={nodeId} className="card bordered p-1">
                    <figure>
                      <button
                        className="btn btn-secondary text-xs w-full"
                        onClick={() => handleNodeSelect(node)}
                      >
                        {node.data.courseCode} 
                      </button>
                    </figure>
                  </div>
                );
              })
            ) : (
              <div className='w-full col-span-4'> 
                <h3 className="text-xs text-center text-red-600 mt-2">No Selected Classes</h3> 
              </div>
            )}
          </div>
  
        <h3 className="text-md text-center font-bold mt-2">Untaken Classes</h3>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {nodes.filter((node) => !selectedNodes.has(node.id)).slice(startIndex, endIndex).map((node, i) => (
            <div key={i} className="card bordered p-1">
              <figure>
                <button
                  className="btn btn-outline text-xs w-full"
                  onClick={() => handleNodeSelect(node)}
                >
                  {node.data.courseCode} 
                </button>
              </figure>
            </div>
          ))}
        </div>
          
        <div className="flex justify-center items-center mt-2">
          <button className="mx-1 btn btn-xs" onClick={() => handlePageChange('prev')}>«</button>
          <button className="mx-1 btn btn-xs">Page {currentPage}</button>
          <button className="mx-1 btn btn-xs" onClick={() => handlePageChange('next')}>»</button>
        </div>
      </>
    </div>
  );
}