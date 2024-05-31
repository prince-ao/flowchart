import Link from "next/link";
import Navbar from './_components/Navbar';
// import React,{useState} from "react";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-black ">
      {/* navbar */}
      <Navbar />
      {/* carousel */}


      <div className="w-full xs:w-3/4 carousel  border border-gray-300 rounded-lg  lg:flex">
        <div id="item1" className=" justify-between carousel-item w-full flex">
          <div class="ml-10 sm:mt-40 mt-10 font-bold sm:text-xl ">
            Unlock Your Potential and Navigate Your Way to Success{" "}
            <div>
              {" "}
              <a className="btn btn-secondary">Get Started</a>
            </div>
          </div>

          <img
            src="main.png"
            className=" w-64 sm:w-3/4 h-64 sm:h-96"
            alt="description"
          />
          {/* sm:w-24 sm:h-24 */}
          {/* <img src="edimage.png" className=" w-25 h-25  xs:w-25 xs:h-10 " /> */}
        </div>
        <div id="item2" class="carousel-item w-full ">
        <div class="ml-10 sm:mt-40 mt-10 font-bold sm:text-xl ">
        Map your academic path with ease using our online flowchart tool <div>
              {" "}
              {/* <Link href="/flowchart/create">
              <a className="btn btn-secondary">Create Your Own Flowchart</a> 
               </Link> */}
            </div>
          </div>
          <img
            src="file.png"
            className=" w-64 sm:w-3/4 h-64 sm:h-96"
            alt="description"
          />
        </div>
        <div id="item3" class="carousel-item w-full ">
          TBD
        </div>
        <div id="item4" class="carousel-item w-full ">
          TBD
        </div>
      </div>
      <div class="flex justify-center w-full py-2 gap-2 mb-10">
        <a href="#item1" class="btn btn-xs">
          1
        </a>
        <a href="#item2" class="btn btn-xs">
          2
        </a>
        <a href="#item3" class="btn btn-xs">
          3
        </a>
        <a href="#item4" class="btn btn-xs">
          4
        </a>
      </div>
      {/* <div className="hidden lg:flex  text-2xl mb-20">
        Some Text here
      </div> */}

        <div className="hidden lg:flex  items-center justify-center gap-4 ">
        <div className="w-full flex flex-col items-center ">

          <figure className="w-full flex justify-center">
            <img src="flowchart.png" alt="flowchart" className="w-3/4" />
          </figure>
        </div>
        <div className="w-full flex flex-col ">
          <div className="">
          <p className="text-bold  text-4xl">Flowchart </p>
            <p  className="text-bold  text-2xl">Plan your path to success</p>
            <Link href="/flowchart/create">
             <button className="btn btn-secondary mt-5">Create Your Own Flowchart</button>
          </Link> </div>
        </div>
      </div>
      <div className="hidden lg:flex  items-center justify-center gap-4 ">
        <div className="w-full flex flex-col items-center ">
   <div className="">
            <p className="text-bold  text-4xl">Degree Works</p>
            <p className="text-bold  text-2xl">Look into your four year degree map</p>
            <Link href="/flowchart/create">
             <button className="btn btn-secondary mt-5">Create Your Own Flowchart</button>
          </Link> 
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