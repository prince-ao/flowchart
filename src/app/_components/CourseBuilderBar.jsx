import { useEffect, useState } from "react";
import { useNodes, useEdges } from "reactflow";

export default function CourseBuilderBar({
  setNodes = () => {},
  setEdges = () => {},
}) {
  const nodes = useNodes();
  const edges = useEdges();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState(new Map());
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [takenCourses, setTakenCourses] = useState(new Set());
  const [futureCourses, setFutureCourses] = useState(new Set()); // [courseCode1, courseCode2, ...
  const [nodePostrequisiteCounts, setNodePostrequisiteCounts] = useState(
    new Map()
  );
  const itemsPerPage = 12;

  const handleNodeSelect = (node) => {
    setSelectedNodes((prevSelectedNodes) => {
      const newSelectedNodes = new Map(prevSelectedNodes);
      let isNodeDeselected = false;
      if (newSelectedNodes.has(node.id)) {
        newSelectedNodes.delete(node.id);
        isNodeDeselected = true;
      } else {
        newSelectedNodes.set(node.id, node.data.courseCode);
        setTakenCourses(
          (prevTakenCourses) =>
            new Set([...prevTakenCourses, node.data.courseCode])
        );
      }

      if (isNodeDeselected) {
        // Remove the course from taken courses if the node is deselected
        setTakenCourses((prevTakenCourses) => {
          const updatedTakenCourses = new Set(prevTakenCourses);
          updatedTakenCourses.delete(node.data.courseCode);
          return updatedTakenCourses;
        });

        // Ensure the deselected course is not marked as a future course
        setFutureCourses((prevFutureCourses) => {
          const updatedFutureCourses = new Set(prevFutureCourses);
          updatedFutureCourses.delete(node.data.courseCode);
          return updatedFutureCourses;
        });
      }

      setHighlightedNodes((prevHighlightedNodes) => {
        const newHighlightedNodes = new Set(prevHighlightedNodes);
        if (isNodeDeselected) {
          newHighlightedNodes.delete(node.id);
          if (node.data.postrequisites) {
            node.data.postrequisites.forEach((id) =>
              newHighlightedNodes.delete(id)
            );
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
    const localNodePostrequisiteCounts = new Map();
    nodes.forEach((node) => {
      if (node.data.postrequisites) {
        node.data.postrequisites.forEach((id) => {
          const currentCount = localNodePostrequisiteCounts.get(id) || 0;
          localNodePostrequisiteCounts.set(id, currentCount + 1);
        });
      }
    });

    // Calculate prerequisites selected count outside of the nodes.map for optimization

    // Now map over nodes to update their state based on the pre-calculated values
    const newNodes = nodes.map((node) => {
      const newNode = { ...node, data: { ...node.data } };
      const stringId = node.id.toString();

      if (selectedNodes.size > 0) {
        newNode.data.canTakeCourse =
          selectedNodes.has(node.id) || highlightedNodes.has(node.id);
        newNode.data.futureCourse =
          highlightedNodes.has(node.id) &&
          !takenCourses.has(node.data.courseCode);

        if (newNode.data.futureCourse) {
          if (highlightedNodes.has(node.id) && node.data.missingRequirement) {
            localNodePostrequisiteCounts.set(
              stringId,
              (localNodePostrequisiteCounts.get(node.id) || 0) - 1
            );
          }
          localNodePostrequisiteCounts.set(
            stringId,
            (localNodePostrequisiteCounts.get(node.id) || 0) - 1
          );
        }

        if (
          localNodePostrequisiteCounts.get(stringId) !== 0 &&
          newNode.data.futureCourse
        ) {
          delete newNode.data.futureCourse;
          newNode.data.missingRequirement = true;
          // console.log(`Node ${node.id} is missing a requirement.`);
        } else {
          delete newNode.data.missingRequirement;
        }
      } else {
        delete newNode.data.canTakeCourse;
        delete newNode.data.futureCourse;
        delete newNode.data.missingRequirement;
      }
      return newNode;
    });

    // Update nodePostrequisiteCounts after processing all nodes
    let newEdges = edges;
    if (selectedNodes.size > 0) {
      newEdges = edges.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          opacity:
            highlightedNodes.has(edge.source) ||
            highlightedNodes.has(edge.target)
              ? 1
              : 0.5,
        },
        animated:
          highlightedNodes.has(edge.source) ||
          highlightedNodes.has(edge.target),
      }));
    } else {
      newEdges = edges.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          opacity:
            highlightedNodes.has(edge.source) ||
            highlightedNodes.has(edge.target)
              ? 1
              : 0.5,
        },
        animated: true,
      }));
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [selectedNodes, highlightedNodes, takenCourses]); // Include nodes and edges in the dependency array to ensure updates are processed

  const totalPages = Math.ceil(nodes.length / itemsPerPage);
  const currentPageItems = nodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const takenCoursesArray = Array.from(takenCourses);
  const coursesToTake = nodes
    .filter(
      (node) =>
        node.data.futureCourse && !takenCourses.has(node.data.courseCode)
    )
    .map((node) => node.data.courseCode);
  const missingRequirement = nodes
    .filter((node) => node.data.missingRequirement)
    .map((node) => node.data.courseCode);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-blue-500 text-white p-2 rounded-full shadow-lg ${
          isOpen ? "hidden" : ""
        }`}
      >
        Course Builder
      </button>
      <div
        className={`mx-auto h-[50vh] sm:h-[50vh] md:h-[50vh] lg:h-[60vh] xl:h-[75vh] bg-white shadow-lg rounded-md p-2 ${
          isOpen ? "" : "hidden"
        } sm:max-w-md md:max-w-md lg:max-w-md overflow-y-scroll `}
      >
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "X" : "Open"}
        </button>
        <h2 className="text-lg text-center font-bold mb-2">Course Builder</h2>
        <div className="text-sm text-center mb-2 bg-blue-100 p-2 rounded-md shadow-md">
          <p className="font-bold">Instructions:</p>
          <p>Click on a class to see future courses you can take.</p>
          <p className="text-xs text-gray-500 mt-1">
            The selected class will be highlighted, and the future courses will
            be shown below.
          </p>
        </div>
        <h3 className="text-md text-center font-bold mt-2">Classes</h3>
        <div className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3 md:grid-cols-4">
          {currentPageItems.map(
            (node) =>
              node.data.courseCode && (
                <div key={node.id} className="card bordered shadow-md">
                  <figure>
                    <button
                      className={`btn text-xs w-full ${
                        selectedNodes.has(node.id)
                          ? "btn-secondary"
                          : "btn-white"
                      } border-2 ${
                        highlightedNodes.has(node.id)
                          ? "border-blue-500"
                          : "border-gray-300 hover:border-gray-500"
                      } ${node.data.futureCourse ? "bg-green-100" : ""}`}
                      onClick={() => handleNodeSelect(node)}
                    >
                      {node.data.courseCode}
                    </button>
                  </figure>
                </div>
              )
          )}
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
        <div className="text-sm text-center mt-4 bg-green-100 p-2 rounded-md shadow-md">
          <p className="font-bold text-center">Next courses to take:</p>
          <p className="font-semibold text-blue-600 text-center">
            {coursesToTake.length > 0
              ? coursesToTake.join(", ")
              : "No courses selected"}
          </p>
          <p className="text-xs text-gray-500 mt-1 text-center">
            These are the courses that you can take
          </p>
          <p className="font-bold text-center mt-2">Missing Requirements:</p>
          <p className="font-semibold text-red-600 text-center">
            {missingRequirement.length > 0
              ? missingRequirement.join(", ")
              : "No missing requirements"}
          </p>
        </div>
        <h3 className="text-lg text-center font-bold mt-4 mb-4">Key</h3>
        <div className="flex justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="badge badge-lg bg-blue-500"></div>
            <p className="text-base text-center">Classes you&apos;ve taken</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="badge badge-lg bg-green-500"></div>
            <p className="text-base text-center">Classes you can take</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="badge badge-lg bg-red-500"></div>
            <p className="text-base text-center">Missing Pre-requisite</p>
          </div>
        </div>
      </div>
    </>
  );
}
