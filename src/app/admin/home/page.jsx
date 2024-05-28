"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    <main className="h-lvh flex justify-center items-center" role="login-home">
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
