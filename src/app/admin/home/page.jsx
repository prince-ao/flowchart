"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSideBar from "@/app/_components/AdminSideBar";
import { isLoggedIn, logout, withAuth } from "@/utils/authentication";
import { supabase } from "@/utils/supabase";
import {
  getAllFlowcharts,
  displayYear,
  getDegrees,
} from "@/utils/flowchart-api";
import Header from "@/app/_components/Header";
function AdminHome() {
  const [isAuth, setIsAuth] = useState(false);
  const [flowChartUploadName, setFlowChartUploadName] = useState("");
  const [flowcharts, setFlowcharts] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);
  const [file, setFile] = useState(null);
  const [flowchartYear, setFlowchartYear] = useState("");
  const [successUploadMessage, setSuccessUploadMessage] = useState("");
  const [errorUploadMessage, setErrorUploadMessage] = useState("");
  const [track, setTrack] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  async function handleFileUpload() {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    if (!flowchartYear) {
      alert("Please enter the flowchart year.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const json = JSON.parse(reader.result);
        const { data, error } = await supabase
          .from("flowcharts")
          .insert([{ flowchart_year: flowchartYear, flowchart_json: json }]);

        if (error) {
          console.error("Error: ", error);
          setErrorUploadMessage("Error uploading flowchart.");
        } else {
          console.log(
            "Flowchart uploaded successfully: ",
            JSON.stringify(data)
          );
          // Refresh the flowcharts
          setSuccessUploadMessage("Flowchart uploaded successfully.");
          getAllFlowchartData();
        }
      } catch (err) {
        console.error("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const flowcharts = await getAllFlowcharts();
        const degrees = await getDegrees();
        console.log(degrees);
        setFlowcharts(flowcharts);
        setDegrees(degrees);

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
    localStorage.setItem("homeAuthFailed", "true");
    router.push("/admin/login");
  }

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  return (
    <main className=" h-lvh flex-auto" role="login-home">
      <div className="navbar">
        <div className="navbar-start">
          {" "}
          <AdminSideBar />{" "}
        </div>

        <div className="navbar-end">
          {isAuth ? (
            <button className=" btn btn-primary" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <div className="absolute h-lvh w-lvw z-20 flex items-center justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
        </div>
      </div>
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to the Admin Home Page
      </h1>

      <select
        className="select select-bordered w-full max-w-xs mt-16"
        value={track ? track : "Select Computer Science Track"}
        onChange={(e) => setTrack(e.target.value)}
      >
        <option disabled>Select Computer Science Track</option>
        {degrees.length === 0 ? (
          <option disabled>none</option>
        ) : (
          <>
            {degrees.map((degree, i) => (
              <option key={i}>{degree.name}</option>
            ))}
          </>
        )}
      </select>

      <div className="grid gap-8 grid-cols-1">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-center">Flowchart Data</h2>
          <div className="stats shadow stats-vertical md:stats-horizontal">
            <div className="stat justify-center text-center">
              <div className="stat-title">Total Flowcharts</div>
              {isLoading ? (
                <div className="stat-value loading loading-spinner loading-sm text-center"></div>
              ) : (
                <div className="stat-value">{flowcharts.length}</div>
              )}
              <div className="stat-desc">Total number of flowcharts</div>
            </div>
            <div className="stat">
              <div className="text-xl font-bold text-center">
                View Flowcharts
              </div>
              <select
                className="select select-primary w-full max-w-xs"
                onChange={(e) => setSelectedChart(e.target.value)}
              >
                <option disabled selected>
                  Pick a Chart
                </option>
                {flowcharts
                  .map((flowchart) => flowchart.flowchart_year)
                  .map((year, index) => (
                    <option key={index} value={year}>
                      {displayYear(year)}
                    </option>
                  ))}
              </select>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  if (selectedChart) {
                    router.push(`/flowcharts/${selectedChart}`);
                  } else {
                    /* add a toast message here */
                  }
                }}
              >
                View Chart
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mt-8">
            Manage Flowcharts
          </h2>
          <div className="stats shadow stats-vertical md:stats-horizontal">
            <div className="stat">
              <div className="text-xl font-bold text-center">
                Upload Flowchart
              </div>
              <input
                type="file"
                className="file-input file-input-primary w-full mb-4 max-w-xs"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <input
                type="text"
                className="input input-primary w-full mb-4 max-w-xs"
                placeholder="Flowchart Year"
                onChange={(e) => setFlowchartYear(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleFileUpload}>
                Upload
              </button>
              {successUploadMessage && (
                <div className="text-center text-success">
                  {successUploadMessage}
                </div>
              )}
              {errorUploadMessage && (
                <div className="text-center text-error">
                  {errorUploadMessage}
                </div>
              )}
            </div>
            <div className="stat">
              <div className="text-xl font-bold text-center">
                Create Flowchart
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  router.push("/flowchart/create");
                }}
              >
                Create
              </button>
            </div>
            <div className="stat">
              <div className="text-xl font-bold text-center">
                Edit Flowcharts
              </div>
              <select className="select select-primary w-full max-w-xs">
                <option disabled selected>
                  Edit a Chart (NC){" "}
                </option>
                <option>In Progress</option>
              </select>
            </div>
            <div className="stat">
              <div className="text-xl font-bold text-center">
                Delete Flowchart
              </div>
              <select className="select select-primary w-full max-w-xs">
                <option disabled selected>
                  Delete a Chart
                </option>
                <option>In Progress</option>
              </select>
            </div>
          </div>
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
