"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/authentication";

// change icons from svg to radix
export default function AdminHome() {
  const router = useRouter();

  function goToLoginError() {
    localStorage.setItem("homeAuthFailed", "true");
    router.push("/admin/login");
  }

  useEffect(() => {
    (async () => {
      if (!isLoggedIn()) {
        goToLoginError();
      }
    })();
  }, []);

  return <main className="h-lvh flex justify-center items-center"></main>;
}
