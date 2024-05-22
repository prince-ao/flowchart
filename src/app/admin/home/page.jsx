"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { FaceIcon, ImageIcon, SunIcon } from "@radix-ui/react-icons";

// change icons from svg to radix
export default function AdminHome() {
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  function goToLoginError() {
    localStorage.setItem("homeAuthFailed", "true");
    router.push("/admin/login");
  }

  useEffect(() => {
    (async () => {
      const access_token = localStorage.getItem("BCuRm");
      if (access_token) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          goToLoginError();
        }
      } else {
        goToLoginError();
      }
    })();
  }, []);

  return <main className="h-lvh flex justify-center items-center"></main>;
}
