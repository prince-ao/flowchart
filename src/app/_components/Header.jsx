import { getVisibleYears, displayYear } from "@/utils/flowchart";
import { useState, useEffect } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function Header({ navigator }) {
  const [courseYears, setCourseYears] = useState([]);
  const [collapseOpen, setCollapseOpen] = useState({
    cs_bs: false,
    cs_math: false,
    cs_as: false,
  });
  const [largeCollapseOpen, setLargeCollapseOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const courseYears = await getVisibleYears();
      setCourseYears(courseYears);
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
                  <a href="/" className="p-[1rem]">Home</a>
                </li>
                <li>
                  <a className="p-[1rem]">About</a>
                </li>
                <li>
                  <div
                    className={`collapse p-0 collapse-arrow ${
                      collapseOpen.cs_bs ? "collapse-open" : "collapse-closed"
                    }`}
                    onClick={() =>
                      setCollapseOpen({
                        cs_as: false,
                        cs_math: false,
                        cs_bs: !collapseOpen.cs_bs,
                      })
                    }
                  >
                    <div className="collapse-title">Computer Science BS</div>
                    <div className="collapse-content p-0">
                      <ul className="p-0">
                        {courseYears.length > 0 &&
                          courseYears.map((year, i) => (
                            <li key={i}>
                              <a href={`/flowcharts/${year}`}>
                                {displayYear(year)}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </li>
                <li>
                  <div
                    className={`collapse p-0 collapse-arrow ${
                      collapseOpen.cs_math ? "collapse-open" : "collapse-closed"
                    }`}
                    onClick={() =>
                      setCollapseOpen({
                        cs_as: false,
                        cs_bs: false,
                        cs_math: !collapseOpen.cs_math,
                      })
                    }
                  >
                    <div className="collapse-title">
                      Computer Science - Mathematics
                    </div>
                    <div className="collapse-content">
                      <p>TODO</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div
                    className={`collapse p-0  collapse-arrow ${
                      collapseOpen.cs_as ? "collapse-open" : "collapse-closed"
                    }`}
                    onClick={() =>
                      setCollapseOpen({
                        cs_bs: false,
                        cs_math: false,
                        cs_as: !collapseOpen.cs_as,
                      })
                    }
                  >
                    <div className="collapse-title">
                      Computer Science - Associate
                    </div>
                    <div className="collapse-content">
                      <p>TODO</p>
                    </div>
                  </div>
                </li>
                <a href="/flowchart-guide/select-cs-track" className="mt-6">
                  <button className="btn btn-secondary btn-md">
                    Get Started
                  </button>
                </a>
              </ul>
            </div>
          </div>
          <a href="/" className="flex">
            <img
              className="h-[60px] ml-[100px] w-[600px] md:w-[200px] md:h-[30px]"
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
                  <a href="#">About</a>
                </li>
                <li>
                  <details>
                    <summary
                      onClick={() => setLargeCollapseOpen(!largeCollapseOpen)}
                    >
                      Flowchart
                    </summary>
                    {/* <ul className="p-2 text-black w-[180px]">
                      {courseYears.length > 0 &&
                        courseYears.map((year, i) => (
                          <li key={i}>
                            <a href={`/flowcharts/${year}`}>
                              {displayYear(year)}
                            </a>
                          </li>
                        ))}
                    </ul> */}
                  </details>
                </li>
              </ul>
            </div>
            <div className="md:navbar-end">
              <a
                href="/flowchart-guide/select-cs-track"
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
        <div className="lg:flex bg-primary w-[100%] text-white justify-center gap-8 sticky top-[80px] z-50 py-3 hidden">
          <div className="flex flex-col items-center">
            <h3 className="underline">Computer Science BS</h3>
            <ul className="mt-2">
              {courseYears.length > 0 &&
                courseYears.map((year, i) => (
                  <li key={i}>
                    <a className="hover:link" href={`/flowcharts/${year}`}>
                      {displayYear(year)}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h3 className="underline">Computer Science - Mathematics</h3>
          </div>
          <div>
            <h3 className="underline">Computer Science - Associate</h3>
          </div>
        </div>
      )}
    </>
  );
}
