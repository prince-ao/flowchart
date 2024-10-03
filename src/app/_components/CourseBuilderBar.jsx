import { useEffect, useState } from "react";
import { useNodes, useEdges } from "reactflow";

export default function CourseBuilderBar({
  setNodes = () => {},
  setEdges = () => {},
}) {
  const nodes = useNodes();
  const edges = useEdges();

  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  function ghost() {
    let none_taken = true;

    for (let g_node of nodes) {
      if (g_node.data.taken) {
        none_taken = false;
        break;
      }
    }

    if (!none_taken) {
      for (let g_node of nodes) {
        if (
          !g_node.data.taken &&
          !g_node.data.canTake &&
          !g_node.data.missingRequirements
        ) {
          g_node.data.ghost = true;
        } else {
          g_node.data.ghost = false;
        }
      }
    } else {
      for (let g_node of nodes) {
        g_node.data.ghost = false;
      }
    }
  }

  function handleNodeSelect(node) {
    const beingSelected = !node.data.taken;

    if (beingSelected) {
      node.data.taken = true;
      node.data.canTake = false;

      for (let id of node.data.postrequisites) {
        let canTake = true;
        for (let sub_node of nodes) {
          if (
            sub_node.data.postrequisites &&
            sub_node.data.postrequisites.includes(id) &&
            sub_node.id !== node.id &&
            !sub_node.data.taken
          ) {
            canTake = false;
            break;
          }
        }

        const edit_node = nodes.find((node) => node.id === id);
        if (canTake) {
          edit_node.data.missingRequirements = false;
          edit_node.data.canTake = true;
          if (edit_node.data.corequisites) {
            for (let coreq of edit_node.data.corequisites) {
              const co_node = nodes.find((node) => node.id === coreq.id);
              co_node.data.missingRequirements = false;
              co_node.data.canTake = true;
            }
          }
        } else {
          edit_node.data.missingRequirements = true;

          if (edit_node.data.corequisites) {
            for (let coreq of edit_node.data.corequisites) {
              const co_node = nodes.find((node) => node.id === coreq.id);
              co_node.data.missingRequirements = true;
            }
          }
        }
      }
    } else {
      node.data.taken = false;

      for (let g_node of nodes) {
        if (
          g_node.data.postrequisites &&
          g_node.data.taken &&
          g_node.data.postrequisites.includes(node.id)
        ) {
          node.data.canTake = true;
        }
      }

      function setAsMissingRequirements(node) {
        for (let g_node of nodes) {
          if (
            g_node.data.postrequisites &&
            g_node.data.taken &&
            g_node.data.postrequisites.includes(node.id)
          ) {
            node.data.missingRequirements = true;

            if (node.data.corequisites) {
              for (let coreq of node.data.corequisites) {
                const co_node = nodes.find((node) => node.id === coreq.id);

                co_node.data.missingRequirements = true;
              }
            }
          }
        }
      }

      function turnOff(postrequisites) {
        for (let id of postrequisites) {
          const node = nodes.find((node) => node.id === id);

          if (node.data.taken) {
            node.data.taken = false;
            node.data.canTake = false;
            setAsMissingRequirements(node);

            turnOff(node.data.postrequisites);
          } else if (node.data.canTake) {
            node.data.canTake = false;

            if (node.data.corequisites) {
              for (let coreq of node.data.corequisites) {
                const co_node = nodes.find((node) => node.id === coreq.id);

                co_node.data.canTake = false;
              }
            }

            setAsMissingRequirements(node);
          } else if (node.data.missingRequirements) {
            node.data.missingRequirements = false;

            if (node.data.corequisites) {
              for (let coreq of node.data.corequisites) {
                const co_node = nodes.find((node) => node.id === coreq.id);

                co_node.data.missingRequirements = false;
              }
            }
          }
        }
      }

      turnOff(node.data.postrequisites);
    }

    ghost();
    setNodes(nodes);
  }

  function handleClean() {
    const resetNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        taken: false,
        canTake: false,
        missingRequirements: false,
        ghost: false,
      },
    }));
    setNodes(resetNodes);
  }

  const totalPages = Math.ceil(nodes.length / itemsPerPage);
  const currentPageItems = nodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                        nodes.find((sub_node) => sub_node.id === node.id)?.data
                          .taken
                          ? "btn-secondary"
                          : nodes.find((sub_node) => sub_node.id === node.id)
                              ?.data.canTake
                          ? "bg-green-200 hover:bg-green-300"
                          : "btn-white"
                      } border-2 ${
                        nodes.find((sub_node) => sub_node.id === node.id)?.data
                          .taken
                          ? "border-blue-500"
                          : nodes.find((sub_node) => sub_node.id === node.id)
                              ?.data.canTake
                          ? "border-green-500 hover:border-green-500"
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
            className="btn btn-danger text-xs"
            onClick={handleClean}
          >
            Clear Selection
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
          <p className="font-bold text-center">Courses you can take:</p>
          <p className="font-semibold text-blue-600 text-center">
            {nodes.filter((node) => node.data.canTake).length > 0
              ? nodes
                  .filter((node) => node.data.canTake)
                  .map((node) => node.data.courseCode)
                  .join(" | ")
              : "No courses selected"}
          </p>
          <p className="text-xs text-gray-500 mt-1 text-center">
            These are the courses that you can take
          </p>
          <p className="font-bold text-center mt-2">
            Courses missing requirements:
          </p>
          <p className="font-semibold text-red-600 text-center">
            {nodes.filter((node) => node.data.missingRequirements).length > 0
              ? nodes
                  .filter((node) => node.data.missingRequirements)
                  .map((node) => node.data.courseCode)
                  .join(" | ")
              : "No courses missing requirements"}
          </p>
        </div>
        <h3 className="text-lg text-center font-bold mt-4 mb-4">Key</h3>
        <div className="flex justify-center gap-8 pb-20">
          <div className="flex flex-col items-center gap-2">
            <div className="badge badge-lg bg-blue-500"></div>
            <p className="text-xs text-center">Classes you&apos;ve taken</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="badge badge-lg bg-green-500"></div>
            <p className="text-xs text-center">Classes you can take</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="badge badge-lg bg-red-500"></div>
            <p className="text-xs text-center">Classes missing pre-requisite</p>
          </div>
        </div>
      </div>
    </>
  );
}