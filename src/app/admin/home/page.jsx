"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logout, withAuth } from "@/utils/authentication";
import { supabase } from "@/utils/supabase";
import {
  getAllFlowcharts,
  displayYear,
  getDegrees,
  getDegreeMapByDegreeYear,
  getDegreeMapYears,
  getFlowchartEnv,
} from "@/utils/flowchart-api";
import Header from "@/app/_components/Header";
import AdminSideBar from "@/app/_components/AdminSideBar";
import YearViewableFlowchart from "@/app/_components/YearViewableFlowchart";

function AdminHome() {
  const [isAuth, setIsAuth] = useState(false);
  const [flowChartUploadName, setFlowChartUploadName] = useState("");
  const [flowcharts, setFlowcharts] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);
  const [degree, setDegree] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const flowchartEnv = getFlowchartEnv();

  async function updateDegreeMaps(degree) {
    const flowcharts = await getDegreeMapYears(degree);
    setFlowcharts(flowcharts[0][flowchartEnv]);
    console.log(flowcharts);
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const degrees = await getDegrees();

        setDegrees(degrees);
        setDegree(degrees[0].name);

        updateDegreeMaps(degrees[0].name);

        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
    setTimeout(() => {
      setIsAuth(true);
    }, 500);
  }, []);

  function goToLoginError() {
    // todo
    localStorage.setItem("homeAuthFailed", "true");
    router.push("/admin/login");
  }

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  function handleDegreeChange(e) {
    setIsLoading(true);
    setDegree(e.target.value);
    updateDegreeMaps(e.target.value);
    setSelectedChart(null);
    setIsLoading(false);
  }

  return (
    <main className="h-lvh flex" role="login-home">
      <AdminSideBar />
      <div className="w-4/5">
        <div className="flex justify-end pe-2 pt-2">
          <button className=" btn btn-primary" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Computer Science Degree</h2>
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={handleDegreeChange}
          >
            {degrees.length === 0 ? (
              <option disabled>none</option>
            ) : (
              <>
                {degrees.map((degree, i) => (
                  <option key={i} value={degree.name}>
                    {degree.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        <div className="grid gap-8 grid-cols-1">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-center mb-4">
              Flowchart Data
            </h2>
            <div className="stats shadow stats-vertical md:stats-horizontal mb-4">
              <div className="stat justify-center text-center">
                <div className="stat-title">Total Degree Maps</div>
                {isLoading ? (
                  <div className="stat-value loading loading-spinner loading-sm text-center"></div>
                ) : (
                  <div className="stat-value">{flowcharts.length}</div>
                )}
                <div className="stat-desc">Total number of degree maps</div>
              </div>
              <div className="stat">
                <div className="text-xl font-bold text-center">
                  View Degree Maps
                </div>
                <select
                  className="select select-primary w-full max-w-xs"
                  value={selectedChart}
                  onChange={(e) => setSelectedChart(e.target.value)}
                >
                  <option disabled selected>
                    Pick A Year
                  </option>
                  {flowcharts
                    .map((flowchart) => flowchart.flowchart_year)
                    .map((year, index) => (
                      <option key={index} value={year}>
                        {displayYear(year)}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {selectedChart && (
            <div className="w-4/5 border-4 border-[#1e90ff] rounded-lg shadow">
              <YearViewableFlowchart
                year={selectedChart}
                degree={degree}
                height="50vh"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default withAuth(
  AdminHome,
  () => {},
  () => {
    localStorage.setItem("homeAuthFailed", "true");
  },
  "/admin/login",
  ""
);
