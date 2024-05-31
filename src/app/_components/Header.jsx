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

  useEffect(() => {
    (async () => {
      const courseYears = await getVisibleYears();
      setCourseYears(courseYears);
    })();
  }, []);

  return (
    <header className="navbar bg-primary h-[80px] text-white">
      <div className="navbar-start flex justify-around">
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
            <ul className="menu p-4 w-80 min-h-full bg-primary text-white">
              <li>
                <a href="/" className="p-[1rem]">
                  Home
                </a>
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
            </ul>
          </div>
        </div>
        <a href="/" className="flex">
          <img
            className="w-[200px]"
            src="/images/cslogo.png"
            alt="college of staten island computer science department logo"
          />
          <h1 className="font-bold">flowchart</h1>
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
                  <summary>Flowchart</summary>
                  {/* fix the static text size */}
                  <ul className="p-2 text-black w-[180px]">
                    {courseYears.length > 0 &&
                      courseYears.map((year, i) => (
                        <li key={i}>
                          <a href={`/flowcharts/${year}`}>
                            {displayYear(year)}
                          </a>
                        </li>
                      ))}
                  </ul>
                </details>
              </li>
              <li>
                <a>About</a>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <a href="/flowchart-guide/select-cs-track" className="me-6">
              <button className="btn btn-secondary">Get Started</button>
            </a>
          </div>
        </>
      )}
    </header>
  );
}
