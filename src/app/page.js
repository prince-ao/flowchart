
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-black bg-[#FAF8F5]">
      {/* navbar */}
      <div className="navbar bg-[#FAF8F5] text-black">
        <div className="navbar-start">
          {/* <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li><a>Home</a></li>
        <li>
          <a>Parent</a>
          <ul className="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </li>
        <li><a>Item 3</a></li>
      </ul>
    </div> */}
          {/* <a className="btn btn-ghost text-xl">daisyUI</a> */}
          <img src="logo.svg" alt="logo" className="w-60 ml-20" />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Home</a>
            </li>
            <li>
              <details>
                <summary>Flowchart</summary>
                <ul className="p-2 bg-[#FAF8F5]">
                  <li>
                    <a>2019 - 2020 </a>
                  </li>
                  <li>
                    <a>2021 - 2022 </a>
                  </li>
                  <li>
                    <a>2021 - 2022 </a>
                  </li>
                  <li>
                    <a>FAQ </a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary>Degree map</summary>
                <ul className="p-2 bg-[#FAF8F5]">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full xs:w-3/4 carousel  border border-gray-300 rounded-lg  lg:flex">
        <div id="item1" className=" justify-between carousel-item w-full flex">
          <div class="ml-10 mt-40  font-bold text-xl ">
            Unlock Your Potential and Navigate Your Way to Success{" "}
          </div>

          <img src="edimage.png" className=" w-50 h-45 " />
        </div>
        <div id="item2" class="carousel-item w-full ">
          TBD{" "}
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
      <div className="w-full flex justify-center text-2xl mb-20">
        Some Text here
      </div>
      <div className="w-full flex justify-center">
        <div className="card w-96  shadow-xl w-1/2 flex flex-col items-center">
          <h2 className="card-title">Create Your own flowchart </h2>
          <figure>
            <img src="flowchart.svg" alt="degree map" className="mt-5" />
          </figure>
          <div className="card-body">
            <p> Plan your path to success</p>
          </div>
        </div>
   
        <div className="card w-96  shadow-xl w-1/2 flex flex-col items-center">
          <h2 className="card-title">4 year Degree Map</h2>
          <figure>
            <img src="degree.svg" alt="degree map" className="mt-5" />
          </figure>
          <div className="card-body">
            <p> Plan your path to success</p>
          </div>
        </div>
      </div>

      <div className="mt-20 w-full flex justify-center">
        <div className="card w-96  shadow-xl w-1/2 flex flex-col items-center">
          <h2 className="card-title">flowchart </h2>
          <figure>
            <img src="flowchart.svg" alt="degree map" className="mt-5" />
          </figure>
          <div className="card-body">
            <p> Plan your path to success</p>
          </div>
        </div>
   
        <div className="card w-96  shadow-xl w-1/2 flex flex-col items-center">
          <h2 className="card-title">4 year Degree Map</h2>
          <figure>
            <img src="degree.svg" alt="degree map" className="mt-5" />
          </figure>
          <div className="card-body">
            <p> Plan your path to success</p>
          </div>
        </div>
      </div>

      <div className="">
      
      <img src="img.svg"/>

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
