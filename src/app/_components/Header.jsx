import {
  displayYear,
  getDegrees,
  getFlowchartEnv,
} from "@/utils/flowchart-api";
import { useState, useEffect } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function Header({ navigator }) {
  const [degrees, setDegrees] = useState([]);
  const [collapseOpen, setCollapseOpen] = useState({});
  const [largeCollapseOpen, setLargeCollapseOpen] = useState(false);

  const flowchartEnv = getFlowchartEnv();

  const handleCollapseToggle = (index) => {
    setCollapseOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    (async () => {
      const degrees = await getDegrees();

      setDegrees(degrees);
    })();
  }, []);

  return (
    <>
      <header className="navbar bg-primary h-[80px] text-white sticky top-0 z-50">
        <div className="navbar-start flex ">
          <div className="drawer drawer-start lg:hidden">
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label htmlFor="drawer" className="drawer-button btn btn-primary">
                <HamburgerMenuIcon />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu p-4 w-60 min-h-full bg-primary text-white">
                <li>
                  <a href="/" className="p-[1rem]">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="p-[1rem]">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="p-[1rem]">
                    Contact
                  </a>
                </li>

                {degrees.map((degree, i) => (
                  <li key={i}>
                    <div
                      className={`collapse p-0 collapse-arrow ${
                        collapseOpen[i] ? "collapse-open" : "collapse-closed"
                      }`}
                      onClick={() => handleCollapseToggle(i)}
                    >
                      <div className="collapse-title">{degree.name}</div>
                      <div className="collapse-content p-0">
                        <ul className="p-0">
                          {degree[flowchartEnv].length > 0 ? (
                            <>
                              {degree[flowchartEnv].map((data, j) => (
                                <li key={j}>
                                  <a
                                    href={`/flowcharts/${degree.name}/${data.flowchart_year}`}
                                  >
                                    {displayYear(data.flowchart_year)}
                                  </a>
                                </li>
                              ))}
                            </>
                          ) : (
                            <p className="italic">
                              No prerequisite flowchart yet
                            </p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}

                <a href="/flowchart-guide/select-degree" className="mt-6">
                  <button className="btn btn-secondary btn-md">
                    Get Started
                  </button>
                </a>
              </ul>
            </div>
          </div>
          <a href="/" className="flex">
            <img
              className=" w-[600px] md:w-[200px] ml-[100px] lg:ml-0"
              src="/images/cslogo.png"
              alt="college of staten island computer science department logo"
            />
          </a>
        </div>
        {navigator && (
          <>
            <div className="navbar-center hidden lg:flex ">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <details>
                    <summary
                      onClick={() => setLargeCollapseOpen(!largeCollapseOpen)}
                    >
                      Prerequisite flowcharts
                    </summary>
                  </details>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="md:navbar-end">
              <a
                href="/flowchart-guide/select-degree"
                className="hidden lg:block lg:me-6"
              >
                <button className="btn btn-secondary btn-xs lg:btn-md">
                  Get Started
                </button>
              </a>
            </div>
          </>
        )}
      </header>

      {largeCollapseOpen && (
        <div className="lg:flex bg-primary w-[100%] text-white justify-center gap-8 sticky top-[80px] z-50 py-3 hidden flex-wrap">
          {degrees.map((degree, i) => (
            <div className="flex flex-col items-center" key={i}>
              <h3 className="font-bold">{degree.name}</h3>
              <ul className="mt-2">
                {degree[flowchartEnv].length > 0 ? (
                  <>
                    {degree[flowchartEnv].map((data, j) => (
                      <li key={j}>
                        <a
                          className="hover:link"
                          href={`/flowcharts/${degree.name}/${data.flowchart_year}`}
                        >
                          {displayYear(data.flowchart_year)}
                        </a>
                      </li>
                    ))}
                  </>
                ) : (
                  <p className="italic">No prerequisite flowchart yet</p>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
