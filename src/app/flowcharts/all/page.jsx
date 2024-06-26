"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/authentication";
import {
  getAllDegrees,
  getDegreeMapByDegree,
  getFlowchartEnv,
} from "@/utils/flowchart-api";

export default function Flowcharts() {
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);

      const degrees = await getAllDegrees();
      const degreeToFlowcharts = await Promise.all(
        degrees.map((degree) => getDegreeMapByDegree(degree.name))
      );
      const getCurrentEnvironment = getFlowchartEnv();
      setCurrentEnvironment(getCurrentEnvironment);
      setDegrees(degreeToFlowcharts);

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex align-center text-center justify-center items-center h-[100vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="p-4">
      {degrees.length > 0 ? (
        degrees.map((degree, i) => (
          <div key={i} className="mb-4 p-4 bg-white rounded shadow">
            <h1 className="text-xl font-bold mb-2">{degree[0].name}</h1>
            <ul className="list-disc pl-5">
              {(currentEnvironment === "flowcharts_dev"
                ? degree[0].flowcharts_dev
                : degree[0].flowcharts
              ).length > 0 ? (
                (currentEnvironment === "flowcharts_dev"
                  ? degree[0].flowcharts_dev
                  : degree[0].flowcharts
                ).map((flowchart, i) => (
                  <li key={i}>
                    <a
                      href={`/flowcharts/${degree[0].name}/${flowchart.flowchart_year}`}
                      className="text-blue-500 hover:underline"
                    >
                      {flowchart.flowchart_year}
                    </a>
                  </li>
                ))
              ) : (
                <li>No flowcharts</li>
              )}
            </ul>
          </div>
        ))
      ) : (
        <p>No degrees</p>
      )}
    </main>
  );
}
