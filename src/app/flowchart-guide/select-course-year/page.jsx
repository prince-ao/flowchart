"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Header from "../../_components/Header";

const _color = "#6E01EF";
const _size = 20;

export default function FlowchartGuide() {
  const [courseYear, setCourseYear] = useState("");
  const [track, setTrack] = useState("");
  const router = useRouter();

  const videoRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const track = localStorage.getItem("selected-track");

    if (!track) {
      router.replace("/flowchart-guide/select-cs-track");
    } else {
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
      <div className="min-h-screen-header flex justify-center">
        <div className="p-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 flex flex-col items-center">
          <h2 className="mb-8 text-2xl font-bold text-center">
            Select Computer Science Course Year
          </h2>
          <div className="indicator">
            <div>
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
            </div>
            {/* make the video responsive */}
            {/* <img
              src="https://picsum.photos/600/350"
              alt="instruction for finding a student's flowchart"
            /> */}
            <video
              ref={videoRef}
              width="600"
              height="350"
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
            className="select select-bordered w-full max-w-xs mt-16"
            value={
              courseYear ? courseYear : "Select Computer Science Course Year"
            }
            onChange={(e) => setCourseYear(e.target.value)}
          >
            <option disabled>Select Computer Science Course Year</option>
            <option>2024-2025</option>
            <option>2023-2024</option>
            <option>2022-2023</option>
            <option>2021-2022</option>
          </select>
          {courseYear && (
            <a href={`/flowcharts/${courseYear}`}>
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
