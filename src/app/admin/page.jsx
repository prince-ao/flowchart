"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Admin() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authValues, setAuthValues] = useState({
    email: "",
    password: "",
  });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(authValues);
    setLoading(false);
    if (!error) {
      localStorage.setItem("BCuRm", data.session.access_token); // figure out how to stop cross-side scripting
      setAuthValues({
        email: "",
        password: "",
      });
      router.push("/in");
    }
  }

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthValues({
      ...authValues,
      [name]: value,
    });
  };
  return (
    <main className="h-lvh flex justify-center items-center">
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

          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
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
              {!passwordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3C5 3 1.25 8 1.25 8s3.75 5 8.75 5 8.75-5 8.75-5S15 3 10 3Zm0 8A3 3 0 1 1 10 5a3 3 0 0 1 0 6Zm0-1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3C5 3 1.25 8 1.25 8s3.75 5 8.75 5 8.75-5 8.75-5S15 3 10 3Zm0 8A3 3 0 1 1 10 5a3 3 0 0 1 0 6Zm0-1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                    clipRule="evenodd"
                  />
                  <path
                    d="M1 1l18 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
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
