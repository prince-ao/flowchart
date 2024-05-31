"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PersonIcon,
  LockClosedIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { login, loginLocally, withAuth } from "../../../utils/authentication";

function AdminLogin() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authValues, setAuthValues] = useState({
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  function clearAuthValues() {
    setAuthValues({
      email: "",
      password: "",
    });
  }

  // add a feature to hide courses for students

  // allow students to build flowcharts

  // add computer science math and associates

  useEffect(() => {
    const errorFromHome = localStorage.getItem("homeAuthFailed");
    console.log(errorFromHome);

    if (errorFromHome) {
      document.getElementById("error_modal").showModal();

      setTimeout(() => {
        document.getElementById("error_modal").close();
      }, 5 * 1e3);
    }

    localStorage.removeItem("homeAuthFailed");
  }, []);

  async function handleLogin() {
    setLoading(true);
    setAuthError(false);

    const auth_response = await login(authValues);
    const auth_response_locally = loginLocally(authValues);

    clearAuthValues();
    setLoading(false);

    if (auth_response || auth_response_locally) {
      router.push("/admin/home");
    } else {
      setAuthError(true);
      setPasswordVisible(false);
    }
  }

  function handleAuthChange(event) {
    const { name, value } = event.target;
    setAuthValues({
      ...authValues,
      [name]: value,
    });
  }

  return (
    <main className="h-lvh flex justify-center items-center">
      <dialog id="error_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Must be authenticated.</h3>
        </div>
      </dialog>
      {loading ? (
        <div className="absolute h-lvh w-lvw bg-black/50 z-20 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <></>
      )}
      <div className="card w-96 bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Admin Login</h2>
          {authError && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Unable to authenticate admin, please{" "}
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-gray-700/70 font-bold"
                >
                  contact developers
                </a>
                .
              </span>
            </div>
          )}{" "}
          {/* The /contact has developer contacts*/}
          <label className="input input-bordered flex items-center gap-2">
            <PersonIcon />
            <input
              type="text"
              className="grow"
              name="email"
              placeholder="Email"
              value={authValues.email}
              onChange={handleAuthChange}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <LockClosedIcon />
            <input
              type={`${passwordVisible ? "" : "password"}`}
              className="grow"
              placeholder="********"
              name="password"
              onChange={handleAuthChange}
              value={authValues.password}
            />
            <button
              onClick={function handleEyeClick() {
                setPasswordVisible(!passwordVisible);
              }}
            >
              {!passwordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </label>
          <div className="card-actions justify-start">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuth(
  AdminLogin,
  () => {},
  () => {},
  "",
  "/admin/home"
);
