"use client";
import Footer from "../_components/Footer";
import Header from "../_components/Header";

export default function About() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const developers = [
    {
      image: "/images/developers/prince_addo.jpg",
      name: "Prince Addo",
      title: "Creator, Maintainer",
      special_link: "https://princeaddo.xyz",
    },
    {
      image: "/images/developers/adam_kostandy.jpg",
      name: "Adam Kostandy",
      title: "Creator, Contributor",
      special_link: "https://adamkostandy.netlify.app/",
    },
    {
      image: "/images/developers/unaiza_nizami.jpg",
      name: "Unaiza N Nizami",
      title: "Creator, Contributor",
      special_link: "https://github.com/Unaiza898",
    },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      <Header navigator />

      <div className="bg-dotted-pattern bg-size-10 flex justify-center py-16">
        <div className="flex flex-col items-center w-[80%] md:w-[50%]">
          <h2 className="text-4xl text-center md:text-6xl font-bold">
            About flowchart
          </h2>
          <p className="mt-6 bg-white md:text-lg">
            A flowchart is a graph that is meant to make it simple for a student
            to plan their application journey. This web application is a digital
            extension of that idea; it allows students to explore and interact
            with their flowcharts in an accessible manner. This project, built
            for the computer science department and by students in the
            department, originated from the{" "}
            <a
              href="https://flowchart-csi.vercel.app"
              target="_blank"
              className="link"
            >
              initial version
            </a>{" "}
            created by Andrea Habib with the help of Kristi Nielson-Brescia.
            Recognizing some accessibility issues, the department decided to
            rewrite and enhance the application to better serve the needs of our
            students and faculty.
          </p>
        </div>
      </div>

      <div className="mt-8 px-8 flex-grow">
        <h3 className="text-3xl md:text-4xl font-bold">Developers</h3>
        <div className="flex gap-6 flex-wrap mt-4 justify-center md:justify-start">
          {developers.map(({ name, image, title, special_link }, i) => (
            <div key={i} className="flex flex-col items-center">
              <a href={special_link} target={special_link && "_blank"}>
                <img
                  src={basePath + image}
                  alt="profile image"
                  className="md:w-[150px] md:h-[150px] w-[75px] h-[75px] rounded-full"
                />
              </a>
              <p className="font-bold">{name}</p>
              <p>{title}</p>
            </div>
          ))}

          <div className="flex flex-col items-center">
            <a
              href="https://github.com/Unaiza898/flowchart-csi"
              target="_blank"
              className="md:w-[150px] md:h-[150px] w-[75px] h-[75px] flex items-center justify-center"
            >
              <p className="text-3xl md:text-5xl">🫵</p>
            </a>
            <p className="font-bold">You?</p>
            <a
              className="link"
              href="https://github.com/Unaiza898/flowchart-csi"
              target="_blank"
            >
              learn how to contribute
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
