"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import {
  displayYear,
  getDegreeMapByDegree,
  getFlowchartEnv,
} from "../../../utils/flowchart-api";
import Header from "../../_components/Header";
import Link from "next/link";

const _color = "#6E01EF";
const _size = 20;

export default function FlowchartGuide() {
  const [selectedMap, setSelectedMap] = useState("");
  const [degreeMaps, setDegreeMaps] = useState([]);
  const [degree, setDegree] = useState("");

  const router = useRouter();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const flowchartEnv = getFlowchartEnv();

  const videoRef = useRef(null);
  const hasFetched = useRef(false);

  const defaultMessage = "Select Computer Science Prerequisite Flowchart";

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const degree = localStorage.getItem("selected-degree");

    if (!degree) {
      router.replace("/flowchart-guide/select-degree");
    } else {
      (async () => {
        try {
          const degreeMaps = await getDegreeMapByDegree(degree);
          // console.log(degreeMaps);
          setDegreeMaps(degreeMaps);
        } catch (e) {
          console.log(e);
        }
      })();

      setDegree(degree);

      const video = videoRef.current;

      if (video) {
        video.play().catch((error) => {
          console.error("Error trying to play the video:", error);
        });
      }

      localStorage.removeItem("selected-degree");
    }
  }, [router]);
  return (
    <main className="">
      <Header />
      <dialog id="info-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            How to find my prerequisite flowchart?
          </h3>
          <ol className="list-decimal list-inside mt-4">
            <li>
              Go to{" "}
              <Link
                class="link"
                href="https://degreeworks.cuny.edu/"
                target="_blank"
              >
                degreeworks
              </Link>
            </li>
            <li>
              Look for the section with your computer science major (typically
              the third section)
            </li>
            <li>
              Look for <span className="font-bold">Year</span> in the line
              underneath that
            </li>
            <li>
              Your year, which corresponds with the prerequisite flowchart,
              should be to the right of that
            </li>
          </ol>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="min-h-screen-header flex justify-center items-center">
        <div className="p-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 flex flex-col items-center">
          <h2 className="mb-8 text-xl lg:text-2xl font-bold text-center">
            Select Computer Science Prerequisite Flowchart
          </h2>
          <div className="indicator">
            <button
              onClick={() => document.getElementById("info-modal").showModal()}
            >
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 0, scale: 4 }}
                  transition={{
                    type: "tween",
                    duration: 2,
                    ease: "easeOut",
                    delay: index * 0.4,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="bg-info"
                  style={styles.dot}
                />
              ))}
              <InfoCircledIcon className="indicator-item badge badge-info p-0 h-6 w-6 cursor-pointer" />
            </button>
            {/* make the video responsive */}
            <video
              ref={videoRef}
              className="w-[330px] h-[230px] lg:w-[600px] lg:h-[350px] shadow-lg"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src={basePath + "/videos/finding-course.mp4"}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <Link
            className="link text-blue-600 mt-8 text-lg lg:text-xl text-center"
            href="https://degreeworks.cuny.edu/"
            target="_blank"
          >
            Click here to go to degreeworks
          </Link>
          <select
            className="select select-bordered w-full max-w-xs mt-16"
            value={selectedMap ? selectedMap : defaultMessage}
            onChange={(e) => setSelectedMap(e.target.value)}
          >
            <option disabled>{defaultMessage}</option>
            {degreeMaps.length > 0 &&
              degreeMaps[0][flowchartEnv].map((data, i) => (
                <option
                  key={i}
                  value={data.flowchart_year}
                  className="cursor-pointer"
                >
                  {displayYear(data.flowchart_year)}
                </option>
              ))}
          </select>
          {selectedMap && (
            <button
              className="btn btn-primary mt-4"
              onClick={() => {
                localStorage.setItem("degree", degree);
                localStorage.setItem("year", selectedMap);
                router.push("/flowcharts");
              }}
            >
              Go to course year flowchart
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

const styles = {
  dot: {
    position: "absolute",
    right: -10,
    top: -10,
    width: _size,
    height: _size,
    borderRadius: "50%",
  },
};
