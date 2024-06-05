"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSideBar from "@/app/_components/AdminSideBar";
import { isLoggedIn, logout, withAuth } from "@/utils/authentication";
import { displayYear, getVisibleYears } from "@/utils/flowchart";
import { supabase } from "@/utils/supabase";

function AdminHome() {
  const [isAuth, setIsAuth] = useState(false);
  const [flowChartUploadName, setFlowChartUploadName] = useState("");
  const [totalFlowcharts, setTotalFlowcharts] = useState(0);
  const [courseYears, setCourseYears] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);
  const [file, setFile] = useState(null);
  const [flowchartYear, setFlowchartYear] = useState('');
  const [successUploadMessage, setSuccessUploadMessage] = useState('');
  const [errorUploadMessage, setErrorUploadMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const getAllFlowcharts = async () => {
    setIsLoading(true);
    let { data: flowcharts, error } = await supabase
      .from('flowcharts')
      .select('flowchart_json');
  
    if (error) {
      console.log('Error: ', error);
      setIsLoading(false);
      return;
    }
  
    console.log('Total Flowcharts: ', flowcharts.length);
    setTotalFlowcharts(flowcharts.length);
    setIsLoading(false);
  };

  const getAllFlowchartData = async () => {
    try {
      const years = await getVisibleYears();
      setCourseYears(years);
    } catch (e) {
      console.log(e);
    }
  };

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
    getAllFlowcharts();
    getAllFlowchartData();
  }, []);

  function goToLoginError() {
    localStorage.setItem("homeAuthFailed", "true");
    router.push("/admin/login");
  }

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  useEffect(() => {
    setTimeout(() => {
      setIsAuth(true);
    }, 500);
  }, []);

  return (
    <main className="h-lvh flex-auto" role="login-home">
      <AdminSideBar />
      {isAuth ? (
        <button className="btn btn-primary" onClick={handleLogout}>
          Log out
        </button>
      ) : (
        <div className="absolute h-lvh w-lvw z-20 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to the Admin Home Page
      </h1>
      <div className="grid gap-8 grid-cols-1">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-center">Flowchart Data</h2>
          <div className="stats shadow stats-vertical md:stats-horizontal">
            <div className="stat justify-center text-center">
              <div className="stat-title">Total Flowcharts</div>
              {isLoading ? (
                <div className="stat-value loading loading-spinner loading-sm text-center"></div>
              ) : (
                <div className="stat-value">{totalFlowcharts}</div>
              )}
              <div className="stat-desc">Total number of flowcharts</div>
            </div>
            <div className="stat text-center">
              <div className="stat-title">Current Classes Added</div>
              <div className="stat-value">TBD</div>
              <div className="stat-desc">Total number of classes</div>
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
                {courseYears.map((year, index) => (
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
