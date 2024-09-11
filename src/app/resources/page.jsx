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
        <div className="flex gap-4 lg:mx-5 flex-col lg:flex-row">
          <div className="grow-[1] flex flex-col items-center border-[5px] rounded py-6 bg-white border-black">
            <h2 className="text-center mb-1 text-xl font-bold">
              Required Computer Science Courses
            </h2>
            <p className="mb-7"> * courses are only required if you&apos;re taking BS Computer Science * </p>
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
            <h2 className="text-center mb-1 text-xl font-bold">
              Elective Computer Science Courses
            </h2>
            <p className="mb-7"> * elective courses vary from semester to semester* </p>
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

        <h3 className="ms-5 text-xl mt-4">
          Based on feedback from employers, alumni, and faculty, the Computer Science department
          designed a career-readiness pathway that will help you prepare for internships and jobs.
          The combination of your <span className="italic underline">degree</span>, <span className="italic underline">relevant experience</span>, and <span className=" italic underline ">ability to market yourself </span> will help you stand out to employers.
        </h3>

        <h2 className="ms-5 text-2xl mt-16">
          💼 <span className="font-bold">Internship Handbook</span>:{" "}
          <a
            href="https://csi-cs-department.gitbook.io/internship-handbook"
            target="_blank"
            className="link"
          >
            click here
          </a>
        </h2>
        
        <h3 className="ms-5 text-xl mt-4">
        Who is this handbook for? 🤨
        For any student who wants to get an internship in the tech field! That could be interning anything like software engineering, web development and app development! This handbook is useful for everyone, even freshmen (first-year students), the earlier the better!
        In order to be competitive with the many other CS majors applying for internships, we highly recommend you complete the following modules in this handbook, at your pace.
        </h3>

      </div>
      <Footer />
    </main>
  );
}
