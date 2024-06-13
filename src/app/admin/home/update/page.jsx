"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logout, withAuth } from "@/utils/authentication";
import { supabase } from "@/utils/supabase";
import {
  getAllFlowcharts,
  displayYear,
  getDegrees,
} from "@/utils/flowchart-api";
import AdminSideBar from "@/app/_components/AdminSideBar";

function AdminHomeUpdate() {
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

  function handleDegreeChange(e) {}

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
              Manage Degree Maps
            </h2>
            <div className="stats shadow stats-vertical md:stats-horizontal">
              <div className="stat">
                <div className="text-xl font-bold text-center">
                  Upload Degree Maps
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
                  Get Started
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
      </div>
    </main>
  );
}

export default withAuth(
  AdminHomeUpdate,
  () => {},
  () => {
    localStorage.setItem("homeAuthFailed", "true");
  },
  "/admin/login",
  ""
);
