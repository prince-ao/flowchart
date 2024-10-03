import {
  displayYear,
  getDegrees,
  getFlowchartEnv,
} from "../../utils/flowchart-api.js";
import { useState, useEffect } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Header({ navigator }) {
  const [degrees, setDegrees] = useState([]);
  const [collapseOpen, setCollapseOpen] = useState({});
  const [largeCollapseOpen, setLargeCollapseOpen] = useState(false);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const router = useRouter();
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
                  <Link href="/" className="p-[1rem]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="p-[1rem]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="p-[1rem]">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="p-[1rem]">
                    Resources
                  </Link>
                </li>
                <li>
                  <a
                    href="http://www.cs.csi.cuny.edu/content/Sample_cs_4_yr_degree-career-map.pdf"
                    className="p-[1rem] text-yellow-300 font-bold focus:text-yellow-300 active:text-yellow-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sample CS 4 Yr Degree Career Map
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
                                    onClick={() => {
                                      localStorage.setItem(
                                        "degree",
                                        degree.name
                                      );
                                      localStorage.setItem(
                                        "year",
                                        data.flowchart_year
                                      );
                                      router.push("/flowcharts");
                                    }}
                                  >
                                    {displayYear(data.flowchart_year)}
                                  </a>
                                </li>
                              ))}
                            </>
                          ) : (
                            <p className="italic">
                              In progress
                            </p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}

                <Link href="/flowchart-guide/select-degree" className="mt-6">
                  <button className="btn btn-secondary btn-md">
                    Get Started
                  </button>
                </Link>
              </ul>
            </div>
          </div>
          <Link href="/" className="flex">
            <Image
              height={200}
              width={200}
              className=" w-[600px] md:w-[200px] ml-[100px] lg:ml-0"
              src={basePath + "/images/cslogo.png"}
              alt="college of staten island computer science department logo"
            />
          </Link>
        </div>
        {navigator && (
          <>
            <div className="navbar-center hidden lg:flex ">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <Link href="/">Home</Link>
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
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/resources">Resources</Link>
                </li>
                <li className="relative group">
                <a
                  href="https://csi-cuny.campus.eab.com/pal/TYU-XOs5O9"
                  className="text-yellow-300 font-bold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🌟 Career-Infused Degree Map 🌟
                </a>
                <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-8 w-max px-4 py-3 text-lg text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Check out career-readiness
                  <br />
                  activities for each semester!
                  <span className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-3 h-3 bg-gray-800 rotate-45"></span>
                </span>
              </li>
              </ul>
            </div>
            <div className="md:navbar-end">
              <Link
                href="/flowchart-guide/select-degree"
                className="hidden lg:block lg:me-6"
              >
                <button className="btn btn-secondary btn-xs lg:btn-md">
                  Get Started
                </button>
              </Link>
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
                          onClick={() => {
                            localStorage.setItem("degree", degree.name);
                            localStorage.setItem("year", data.flowchart_year);
                            router.push("/flowcharts");
                          }}
                        >
                          {displayYear(data.flowchart_year)}
                        </a>
                      </li>
                    ))}
                  </>
                ) : (
                  <p className="italic">In progress</p>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}