"use client";
import { useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "../../_components/Header";

const _size = 20;

export default function FlowchartGuide() {
  const [track, setTrack] = useState("");
  const router = useRouter();

  function handleNextClick() {
    localStorage.setItem("selected-track", track);

    setTimeout(() => {
      router.push("/flowchart-guide/select-course-year");
    }, 400);
  }

  return (
    <main className="">
      <Header />
      <dialog id="info-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            How to find computer science track?
          </h3>
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
              Look for <span className="font-bold">Major</span> in the first
              section
            </li>
            <li>
              Your computer science track is to the right of{" "}
              <span className="font-bold">Major</span>
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
      <div className="min-h-screen-header flex justify-center">
        <div className="p-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 flex flex-col items-center">
          <h2 className="mb-8 text-lg lg:text-2xl font-bold text-center">
            Select Computer Science Track
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
            {/* make a video */}
            <img
              src="/images/degreeworks-track.png"
              className="w-[300px] h-[150px] lg:w-[600px] lg:h-[350px]"
            />
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
            value={track ? track : "Select Computer Science Track"}
            onChange={(e) => setTrack(e.target.value)}
          >
            <option disabled>Select Computer Science Track</option>
            <option>Computer Science BS</option>
            <option>Computer Science - Mathematics BS</option>
            <option>Computer Science Associates</option>
          </select>
          {track && (
            <button className="btn btn-primary mt-4" onClick={handleNextClick}>
              Next
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
