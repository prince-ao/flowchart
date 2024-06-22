/**
 * CourseBuilderBar is a component that allows users to select courses and see their prerequisites and postrequisites.
 * 
 * Props:
 * - setNodes: Function to update the nodes in the parent component.
 * - setEdges: Function to update the edges in the parent component.
 * 
 * State:
 * - isOpen: Boolean indicating whether the Course Builder Bar is open.
 * - selectedNodes: Map of selected nodes. The keys are node IDs and the values are course codes.
 * - highlightedNodes: Set of IDs of nodes that should be highlighted.
 * - currentPage: Current page number in the pagination of courses.
 * - takenCourses: Set of course codes that the user has taken.
 * - itemsPerPage: Number of items per page in the pagination of courses.
 * 
 * The component uses the useNodes and useEdges hooks from reactflow to get the current nodes and edges.
 * 
 * The handleNodeSelect function is used to handle the selection and deselection of nodes. When a node is selected, it is added to the selectedNodes map and the takenCourses set. If the node has any postrequisites, they are added to the highlightedNodes set. When a node is deselected, it is removed from the selectedNodes map and the highlightedNodes set, and its postrequisites are also removed from the highlightedNodes set.
 * 
 * The useEffect hook is used to update the nodes and edges whenever the selectedNodes, highlightedNodes, or takenCourses state changes. The new nodes and edges are created with updated colors and opacities based on whether they are selected or highlighted.
 * 
 * The component renders a button to open and close the Course Builder Bar, and when the bar is open, it renders a list of courses with pagination. The courses that are selected or highlighted are styled differently. The user can select a course to see its postrequisites and deselect a course to remove its postrequisites from the highlighted courses.
 */

import { useEffect, useState } from 'react';
import { useNodes, useEdges } from 'reactflow';

export default function CourseBuilderBar({setNodes = () => {}, setEdges = () => {}}) {
  const nodes = useNodes();
  const edges = useEdges();

  const [isOpen, setIsOpen] = useState(true);
  const [selectedNodes, setSelectedNodes] = useState(new Map());
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [takenCourses, setTakenCourses] = useState(new Set());
  const itemsPerPage = 12;


  /*
    * handleNodeSelect is a function that handles the selection and deselection of nodes.
    * When a node is selected, it is added to the selectedNodes map and the takenCourses set.
    * If the node has any postrequisites, they are added to the highlightedNodes set.
    * When a node is deselected, it is removed from the selectedNodes map and the highlightedNodes set.
    * Its postrequisites are also removed from the highlightedNodes set.
    *
    * @param {Object} node - The node that was selected or deselected.
    * @returns {void}
    *   
    * */
  const handleNodeSelect = (node) => {
    setSelectedNodes((prevSelectedNodes) => {
      const newSelectedNodes = new Map(prevSelectedNodes);
      let isNodeDeselected = false;
      if (newSelectedNodes.has(node.id)) {
        newSelectedNodes.delete(node.id);
        isNodeDeselected = true;
      } else {
        newSelectedNodes.set(node.id, node.data.courseCode);
        setTakenCourses(prevTakenCourses => new Set([...prevTakenCourses, node.data.courseCode]));
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
        newNode.data.futureCourse = highlightedNodes.has(node.id) && !takenCourses.has(node.data.courseCode);
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
  
    // Update the nodes and edges
    setNodes(newNodes);
    setEdges(newEdges);
  }, [selectedNodes, highlightedNodes, takenCourses]);

 // Calculate total pages
 const totalPages = Math.ceil(nodes.length / itemsPerPage);
 // Get current page items
 const currentPageItems = nodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
// Get taken and future courses
const takenCoursesArray = Array.from(takenCourses);
const futureCourses = nodes.filter(node => node.data.futureCourse && !takenCourses.has(node.data.courseCode)).map(node => node.data.courseCode);

return (
  <>
    <button 
    onClick={() => setIsOpen(!isOpen)} 
    className={` bg-blue-500 text-white p-2 rounded-full shadow-lg ${isOpen ? 'hidden' : ''}`}
  >
    Course Builder
  </button>
<div className={` mx-auto h-[50vh] sm:h-[50vh] md:h-[50vh] lg:h-[60vh] xl:h-[75vh] bg-white shadow-lg rounded-md p-2 ${isOpen ? '' : 'hidden'} sm:max-w-md md:max-w-md lg:max-w-md overflow-y-scroll `}>  <>
    <button onClick={() => setIsOpen(!isOpen)} >{isOpen ? 'X' : 'Open'}</button>
    <h2 className="text-lg text-center font-bold mb-2">Course Builder</h2>
      <div className="text-sm text-center mb-2 bg-blue-100 p-2 rounded-md shadow-md">
        <p className="font-bold">Instructions:</p>
        <p>Click on a class to see future courses you can take.</p>
        <p className="text-xs text-gray-500 mt-1">The selected class will be highlighted, and the future courses will be shown below.</p>
      </div>
      <div className="text-sm text-center mb-2 bg-green-100 p-2 rounded-md shadow-md">
        <p className="font-bold">Next courses to take:</p>
        <p className="font-semibold text-blue-600">{futureCourses.length > 0 ? futureCourses.join(', ') : 'No courses selected'}</p>   
        <p className="text-xs text-gray-500 mt-1">These are the courses that you can take</p>
      </div>   
      <h3 className="text-md text-center font-bold mt-2">Classes</h3>
      <div className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3 md:grid-cols-4">
        {currentPageItems.map((node) => (
          <div key={node.id} className="card bordered shadow-md">
            <figure>
              <button
                className={`btn text-xs w-full ${selectedNodes.has(node.id) ? 'btn-secondary' : 'btn-white'} border-2 ${highlightedNodes.has(node.id) ? 'border-blue-500' : 'border-gray-300 hover:border-gray-500'} ${node.data.futureCourse ? 'bg-green-100' : ''}`}
                onClick={() => handleNodeSelect(node)}
              >
                {node.data.courseCode}
              </button>
            </figure>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <button
          className="btn btn-secondary text-xs"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary text-xs"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
        >
          Next
        </button>
      </div>
      <h3 className="text-md text-center font-bold mt-2 mb-2">Key</h3>
      <div className="flex justify-center space-x-4">
        <div>
          <div className="w-16 rounded h-4 bg-blue-500"> </div>
          <p className='text-sm'>Classes you've taken</p>
        </div>
        <div>
          <div className="w-16 rounded h-4 bg-green-500"></div>
          <p className='text-sm '>Classes you can take</p>
        </div>
      </div>      
    </>
  </div>
  </>
);
}