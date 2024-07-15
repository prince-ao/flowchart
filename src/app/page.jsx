"use client";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useDeviceSize from "@/app/_components/useDeviceSize";

export default function Home() {
  const router = useRouter();
  const { isPhone, isTablet } = useDeviceSize();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <main className="flex min-h-screen flex-col items-center text-black ">
      <Header navigator />

      <div className="hero min-h-[80vh] bg-dotted-pattern bg-size-10">
        <div className="hero-content flex-col lg:flex-row-reverse justify-around max-w-[100%]">
          <div className="lg:flex-shrink-0 shadow-2xl z-0">
            <iframe
              width={isPhone ? "280" : isTablet ? "560" : "840"}
              height={isPhone ? "157" : isTablet ? "315" : "472"}
              src="https://www.youtube.com/embed/HUMyTnrs_m0?autoplay=1&mute=1&loop=1&playlist=HUMyTnrs_m0"
              className="rounded-xl"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
          {/* <Image
            alt="flowchart"
            src={basePath + "/images/flowchart.gif"}
            width={200}
            height={200}
          /> */}
          <div className="lg:flex-shrink flex flex-col lg:w-1/2">
            <h1 className="text-3xl text-center lg:text-left lg:text-5xl xl:text-6xl font-bold">
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
            <Link
              href="/flowchart-guide/select-degree"
              className="mt-6 w-fit self-center lg:self-start"
            >
              <button className="btn btn-secondary lg:!btn-lg  self-center lg:self-start">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-around w-[100%]">
        <Image
          alt="flowchart 2"
          src={basePath + "/images/flowchart2.gif"}
          width={200}
          height={200}
          className="w-7/8 lg:w-1/3 rounded-xl border-black border-4"
        />
        <div className="w-3/4 lg:w-1/3 mt-6 lg:mt-0">
          <h3 className="text-bold text-2xl lg:text-4xl font-bold text-center lg:text-left">
            View your course roadmap
          </h3>
          <p className="text-bold text-xs lg:text-lg mt-1 lg:mt-4">
            Easily visualize your entire academic journey with our comprehensive
            course roadmap feature. Stay on track by mapping out each semester,
            ensuring you meet all prerequisites and graduation requirements.
          </p>
        </div>
      </div>

      {/* <div className="flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-around w-[100%] mt-24">
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
      </div> */}

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-around w-[100%] mt-24">
        <div className="w-3/4 lg:w-1/3">
          <h3 className="text-bold text-2xl lg:text-4xl font-bold text-center lg:text-left">
            Plan your academic journey
          </h3>
          <p className="text-bold text-xs lg:text-lg mt-1 lg:mt-4 mb-6 lg:mb-0">
            Take charge of your education with our comprehensive planning tools.
            Design a personalized academic plan that fits your goals and
            timeline, ensuring you meet all the necessary requirements for
            graduation.
          </p>
        </div>
        <Image
          src={basePath + "/images/flowchart3.png"}
          alt="flowchart"
          width={200}
          height={200}
          className="w-7/8 lg:w-1/3 rounded-xl border-black border-4"
        />
      </div>

      <div className="mt-16">
        <Link href="flowchart-guide/select-degree" className="mt-6">
          <button className="btn btn-secondary lg:!btn-lg self-center lg:self-start">
            Get Started
          </button>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
