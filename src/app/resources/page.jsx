"use client";
import Footer from "../_components/Footer";
import Header from "../_components/Header";
import { useEffect, useState } from "react";
import { getAllCourses } from "@/utils/flowchart-api";

export default function About() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const courses = await getAllCourses();
      setCourses(courses);
      setLoading(false);
    })();
  }, []);
  return (
    <main className="flex flex-col min-h-screen">
      <Header navigator />

      <div className="mt-8 px-8 flex-grow">
        <h2 className="text-3xl font-bold">Resources</h2>

        <h2 className="ms-5 text-2xl mt-16 mb-4 font-bold">Courses</h2>
        <div className="flex gap-4 mx-5">
          <div className="grow-[1] flex flex-col items-center border-[5px] rounded py-6 bg-white border-black">
            <h2 className="mb-8 text-xl font-bold">Computer Science Courses</h2>
            {loading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              <div className="flex gap-3 flex-wrap justify-center">
                {courses.length > 0 ? (
                  courses.map(
                    (course, i) =>
                      course.category === "cs_required" && (
                        <a
                          href={`${course.url ?? "#"}`}
                          target={course.url ? "_blank" : ""}
                          key={i}
                        >
                          <div
                            className="tooltip bg-gray-200 p-2 rounded-full"
                            data-tip={`${course.name}`}
                          >
                            <p>{course.code}</p>
                          </div>
                        </a>
                      )
                  )
                ) : (
                  <p>No courses yet.</p>
                )}
              </div>
            )}
          </div>
          <div className="grow-[1] flex flex-col items-center border-[5px] rounded py-6 bg-white border-black">
            <h2 className="mb-8 text-xl font-bold">
              Elective Computer Science Courses
            </h2>
            {loading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              <div className="flex gap-3 flex-wrap justify-center">
                {courses.length > 0 ? (
                  courses.map(
                    (course, i) =>
                      course.category === "cs_elective" && (
                        <div
                          className="tooltip bg-gray-200 p-2 rounded-full"
                          data-tip={`${course.name}`}
                          key={i}
                        >
                          <a
                            href={`${course.url ?? "#"}`}
                            target={course.url ? "_blank" : ""}
                          >
                            <p>{course.code}</p>
                          </a>
                        </div>
                      )
                  )
                ) : (
                  <p>No courses yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <h2 className="ms-5 text-2xl mt-16">
          🗺️ <span className="font-bold">Degree / Career Milestone Map</span>:{" "}
          <a
            href="http://www.cs.csi.cuny.edu/content/Sample_cs_4_yr_degree-career-map.pdf"
            target="_blank"
            className="link"
          >
            click here
          </a>
        </h2>

        <h2 className="ms-5 text-2xl mt-16">
          💼 <span className="font-bold">Internship gitbook</span>:{" "}
          <a
            href="https://csi-cs-department.gitbook.io/internship-handbook"
            target="_blank"
            className="link"
          >
            click here
          </a>
        </h2>
      </div>

      <Footer />
    </main>
  );
}
