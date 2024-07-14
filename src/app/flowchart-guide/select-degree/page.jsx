"use client";
import { useEffect, useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "../../_components/Header";
import { getDegrees } from "../../../utils/flowchart-api";
import Link from "next/link";
import Image from "next/image";

const _size = 20;

export default function FlowchartGuide() {
  const [degree, setDegree] = useState("");
  const [degrees, setDegrees] = useState([]);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const router = useRouter();

  function handleNextClick() {
    localStorage.setItem("selected-degree", degree);

    setTimeout(() => {
      router.push("/flowchart-guide/select-prereq-flowchart");
    }, 400);
  }

  useEffect(() => {
    (async () => {
      try {
        const degrees = await getDegrees();
        setDegrees(degrees);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <main className="">
      <Header />
      <dialog id="info-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            How to find my computer science degree?
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
              Look for <span className="font-bold">Major</span> in the first
              section
            </li>
            <li>
              Your computer science degree is to the right of{" "}
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
      <div className="min-h-screen-header flex justify-center items-center">
        <div className="p-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 flex flex-col items-center">
          <h2 className="mb-8 text-xl lg:text-2xl font-bold text-center">
            Select Computer Science Degree
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
            <Image
              height={200}
              width={300}
              alt="choosing a degree"
              src={basePath + "/images/degreeworks-track.png"}
              className="w-[300px] h-[150px] lg:w-[600px] lg:h-[350px] shadow-lg"
            />
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
            value={degree ? degree : "Select Computer Science Degree"}
            onChange={(e) => setDegree(e.target.value)}
          >
            <option disabled>Select Computer Science Degree</option>

            {degrees.length === 0 ? (
              <option disabled>none</option>
            ) : (
              <>
                {degrees.map((degree, i) => (
                  <option key={i} className="cursor-pointer">
                    {degree.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {degree && (
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
