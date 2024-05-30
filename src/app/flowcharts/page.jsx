"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/authentication";
import { getVisibleYears } from "@/utils/flowchart";

// change icons from svg to radix
export default function Flowcharts() {
  const [flowcharts, setFlowcharts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const course_years = await getVisibleYears();
      setFlowcharts(course_years);

      setLoading(false);
    })();
  }, []);

  return (
    <main className="">
      <h1>Years available</h1>
      {flowcharts.length > 0 ? (
        <ul>
          {flowcharts.map((year, i) => (
            <li key={i} className="text-info">
              <a href={`/flowcharts/${year}`}>{year}</a>
            </li>
          ))}
        </ul>
      ) : (
        <span className="loading loading-spinner loading-sm"></span>
      )}
    </main>
  );
}