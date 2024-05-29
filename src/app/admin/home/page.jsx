"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/authentication";
import AdminSideBar from "@/app/_components/AdminSideBar";
import { isLoggedIn, logout, withAuth } from "@/utils/authentication";

function AdminHome() {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

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
    <main className="h-lvh flex-auto">
      <AdminSideBar />
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to the Admin Home Page</h1>
      <div className="grid gap-8 grid-cols-1">
        <div className = "flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-center">Flowchart Data</h2>
          <div className="stats shadow stats-vertical md:stats-horizontal">
            <div className="stat justify-center text-center">
              <div className="stat-title">Total Flowcharts</div>
              <div className="stat-value">10</div>
              <div className="stat-desc">Total number of flowcharts</div>
            </div>
            <div className="stat text-center">
              <div className="stat-title">Current Classes Added</div>
              <div className="stat-value">100</div>
              <div className="stat-desc">Total number of classes</div>
            </div>
            <div className="stat">
              <div className="text-xl font-bold text-center">View Flowcharts</div>
              <select className="select select-primary w-full max-w-xs">
                <option disabled selected>Pick a Chart</option>
                <option>2022-2023</option>
                <option>blah</option>
                <option>blah</option>
                <option>blah</option>
              </select> 
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mt-8">Manage Flowcharts</h2>
          <div className="stats shadow stats-vertical md:stats-horizontal">
          <div className="stat">
              <div className="text-xl font-bold text-center">Upload Flowchart</div>
              <input type="file" className="file-input file-input-primary w-full mb-4 max-w-xs" />
          </div>
          <div className="stat">
              <div className="text-xl font-bold text-center">Create Flowchart</div>
              <button className="btn btn-primary">Create</button>
          </div>
          <div className="stat">
              <div className="text-xl font-bold text-center">Edit Flowcharts</div>
              <select className="select select-primary w-full max-w-xs">
                <option disabled selected>Edit a Chart</option>
                <option>2022-2023</option>
                <option>blah</option>
                <option>blah</option>
                <option>blah</option>
              </select> 
            </div>
          <div className="stat">
              <div className="text-xl font-bold text-center">Delete Flowchart</div>
              <select className="select select-primary w-full max-w-xs">
                <option disabled selected>Delete a Chart</option>
                <option>2022-2023</option>
                <option>blah</option>
                <option>blah</option>
                <option>blah</option>
              </select>
          </div>    
        </div>
      </div>
    </div>
      {isAuth ? (
        <button className="btn btn-primary" onClick={handleLogout}>
          Log out
        </button>
      ) : (
        <div className="absolute h-lvh w-lvw z-20 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
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
