"use client";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-black ">
      <Header navigator />

      <div className="hero min-h-[80vh] bg-dotted-pattern bg-size-10">
        <div className="hero-content flex-col lg:flex-row-reverse justify-around max-w-[100%]">
          <img
            src="/images/flowchart.gif"
            className="w-1/2 lg:max-w-sm rounded-xl shadow-2xl z-0 border-4 border-primary lg:flex-shrink-0"
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
              your progress, and adjust your schedule with ease.
            </p>
            <button className="btn btn-secondary lg:!btn-lg self-center lg:self-start">
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-around w-[100%]">
        <img src="flowchart.png" alt="flowchart" className="w-7/8 lg:w-1/3" />
        <div className="w-3/4 lg:w-1/3">
          <h3 className="text-bold text-2xl lg:text-4xl font-bold">
            View your course roadmap
          </h3>
          <p className="text-bold text-xs lg:text-lg mt-1 lg:mt-4">
            Easily visualize your entire academic journey with our comprehensive
            course roadmap feature. Stay on track by mapping out each semester,
            ensuring you meet all prerequisites and graduation requirements.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-around w-[100%] mt-24">
        <div className="w-3/4 lg:w-1/3 mt-6 lg:mt-0">
          <h3 className="text-bold text-2xl lg:text-4xl font-bold">
            Interact with your course roadmap
          </h3>
          <p className="text-bold text-xs lg:text-lg mt-1 lg:mt-4">
            Explore your academic journey like never before with our interactive
            course roadmap. Click on any course to reveal the required
            prerequisites and discover the steps needed to reach your desired
            classes.
          </p>
        </div>
        <img src="degree.png" alt="flowchart" className="w-7/8 lg:w-1/3" />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-around w-[100%] mt-24">
        <img src="flowchart.png" alt="flowchart" className="w-7/8 lg:w-1/3" />
        <div className="w-3/4 lg:w-1/3">
          <h3 className="text-bold text-2xl lg:text-4xl font-bold">
            Plan your academic journey
          </h3>
          <p className="text-bold text-xs lg:text-lg mt-1 lg:mt-4">
            Take charge of your education with our comprehensive planning tools.
            Design a personalized academic plan that fits your goals and
            timeline, ensuring you meet all the necessary requirements for
            graduation.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <button className="btn btn-secondary lg:!btn-lg self-center lg:self-start">
          Get Started
        </button>
      </div>

      <Footer />
    </main>
  );
}
