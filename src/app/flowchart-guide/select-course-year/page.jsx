"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { displayYear, getVisibleYears } from "@/utils/flowchart";
import Header from "../../_components/Header";

const _color = "#6E01EF";
const _size = 20;

export default function FlowchartGuide() {
  const [selectedYear, setSelectedYear] = useState("");
  const [courseYears, setCourseYears] = useState([]);
  const [track, setTrack] = useState("");

  const router = useRouter();

  const videoRef = useRef(null);
  const hasFetched = useRef(false);

  const defaultMessage = "Select Computer Science Course Year";

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const track = localStorage.getItem("selected-track");

    if (!track) {
      router.replace("/flowchart-guide/select-cs-track");
    } else {
      (async () => {
        try {
          const years = await getVisibleYears();
          setCourseYears(years);
        } catch (e) {
          console.log(e);
        }
      })();

      setTrack(track);

      const video = videoRef.current;

      if (video) {
        video.play().catch((error) => {
          console.error("Error trying to play the video:", error);
        });
      }

      localStorage.removeItem("selected-track");
    }
  }, [router]);
  return (
    <main className="">
      <Header />
      <dialog id="info-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">How to find your course year?</h3>
          <ol className="list-decimal list-inside mt-4">
            <li>
              Go to{" "}
              <a
                class="link"
                href="https://degreeworks.cuny.edu/"
                target="_blank"
              >
                degreeworks
              </a>
            </li>
            <li>
              Look for the section with your computer science major (typically
              the third section)
            </li>
            <li>
              Look for <span className="font-bold">Year</span> in the line
              underneath that
            </li>
            <li>Your course year should be to the right of that</li>
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
      <div className="min-h-screen-header flex justify-center">
        <div className="p-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 flex flex-col items-center">
          <h2 className="mb-8 text-lg lg:text-2xl font-bold text-center text-center">
            Select Computer Science Course Year
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
              className="w-[300px] h-[150px] lg:w-[600px] lg:h-[350px]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/finding-course.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <a
            className="link link-primary"
            href="https://degreeworks.cuny.edu/"
            target="_blank"
          >
            Click here to go to degreeworks
          </a>
          <select
            className="select select-bordered w-full max-w-xs mt-10 lg:mt-16"
            value={selectedYear ? selectedYear : defaultMessage}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option disabled>{defaultMessage}</option>
            {courseYears.map((year, i) => (
              <option key={i} value={year}>
                {displayYear(year)}
              </option>
            ))}
          </select>
          {selectedYear && (
            <a href={`/flowcharts/${selectedYear}`}>
              <button className="btn btn-primary mt-4">
                Go to course year flowchart
              </button>
            </a>
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
