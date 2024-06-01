"use client";

import { useState, useEffect } from "react";
import { getVisibleYears, displayYear } from "@/utils/flowchart";
import Header from "./_components/Header";

export default function Home() {
  const [courseYears, setCourseYears] = useState([]);

  useEffect(() => {
    (async () => {
      const courseYears = await getVisibleYears();
      setCourseYears(courseYears);
    })();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center text-black ">
      <Header navigator />

      <div className="hero min-h-[70vh] bg-dotted-pattern bg-size-10">
        <div className="hero-content flex-col lg:flex-row-reverse justify-around max-w-[100%]">
          <img
            src="/images/flowchart.gif"
            className="w-1/2 lg:max-w-xl rounded-xl shadow-2xl z-0 border-4 border-primary lg:flex-shrink-0"
          />
          <div className="lg:flex-shrink flex flex-col lg:w-1/2">
            <h1 className="text-2xl text-center lg:text-left lg:text-5xl xl:text-6xl font-bold">
              Plan your college journey from{" "}
              <span className="relative inline-block">
                <div className="bg-secondary absolute bottom-1 lg:bottom-0 left-0 -z-10 h-2 lg:h-4 w-full"></div>
                start to finish
              </span>
            </h1>
            <p className="py-6 text-xs lg:text-lg xl:text-xl bg-white">
              With our interactive flowchart, you can effortlessly plan and
              build your entire college journey. Visualize your courses, track
              your progress, and adjust your schedule with ease. Our tool makes
              it simple to ensure you meet all your academic requirements while
              staying on track to achieve your college goals in an easy and
              visual manner.
            </p>
            <button className="btn btn-secondary !btn-lg self-center lg:self-start">
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex  items-center justify-center gap-4 ">
        <div className="w-full flex flex-col items-center ">
          <figure className="w-full flex justify-center">
            <img src="flowchart.png" alt="flowchart" className="w-3/4" />
          </figure>
        </div>
        <div className="w-full flex flex-col ">
          <div className="">
            <p className="text-bold  text-4xl">Flowchart </p>
            <p className="text-bold  text-2xl">Plan your path to success</p>
            {/* <Link href="/flowchart/create">
              <button className="btn btn-secondary mt-5">
                Create Your Own Flowchart
              </button>
            </Link>{" "} */}
          </div>
        </div>
      </div>
      <div className="hidden lg:flex  items-center justify-center gap-4 ">
        <div className="w-full flex flex-col items-center ">
          <div className="">
            <p className="text-bold  text-4xl">Degree Works</p>
            <p className="text-bold  text-2xl">
              Look into your four year degree map
            </p>
            {/* <Link href="/flowchart/create">
              <button className="btn btn-secondary mt-5">
                Create Your Own Flowchart
              </button>
            </Link> */}
          </div>
        </div>
        <div className="w-full  flex flex-col items-center  ">
          <figure className="w-full flex justify-center">
            <img src="degree.png" alt="flowchart" className="w-3/4" />
          </figure>
        </div>
      </div>

      <div className="w-84 lg:hidden flex flex-col sm:flex-row items-center justify-center gap-4 p-6 ">
        <div className="card shadow-xl w-full sm:w-1/2 flex flex-col items-center p-6 bg-white rounded-lg">
          <h2 className="card-title text-center mb-4">
            Create Your Own Flowchart
          </h2>
          <figure className="w-full flex justify-center">
            <img src="flowchart.svg" alt="flowchart" className="mt-5" />
          </figure>
          <div className="card-body">
            <p>Plan your path to success</p>
          </div>
        </div>
        <div className="card shadow-xl w-full sm:w-1/2 flex flex-col items-center p-6 bg-white rounded-lg">
          <h2 className="card-title text-center mb-10">4 Year Degree Map</h2>
          <figure className="w-full flex justify-center">
            <img src="flowchart.svg" alt="flowchart" className="mt-5" />
          </figure>
          <div className="card-body">
            <p>Plan your path to success</p>
          </div>
        </div>
      </div>

      {/* footer  */}
      <footer class=" mt-10 w-full bg-gray-800 py-6">
        <div class="container mx-auto flex flex-col items-center">
          <nav class=" flex flex-wrap justify-center">
            <a href="#" class="text-gray-300 hover:text-white px-4 py-2">
              Home
            </a>
            <a href="#" class="text-gray-300 hover:text-white px-4 py-2">
              About
            </a>
            <a href="#" class="text-gray-300 hover:text-white px-4 py-2">
              Services
            </a>
            <a href="#" class="text-gray-300 hover:text-white px-4 py-2">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
