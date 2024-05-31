"use client"; // This marks the component as a Client Component
import Link from "next/link"
import React, { useState} from "react"
export default function Navbar() {
    const [isOpen,setisOpen] = useState(false)
    const handleBurgerClick = () => {
        setisOpen(!isOpen)
    }
    return(      
    <div className="navbar bg-primary text-white">
    <div className="navbar-start">
      <div className="dropdown" onClick={handleBurgerClick}>
        
        <div  tabIndex={0} onClick={handleBurgerClick} className="btn btn-ghost lg:hidden"  >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        {isOpen && (
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-primary rounded-box w-52"
        >
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a>Parent</a>
            <ul className="p-2">
              <li>
                <a>Submenu 1</a>
              </li>
              <li>
                <a>Submenu 2</a>
              </li>
            </ul>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      )   } 
        
      </div>
      {/* <a className="btn btn-ghost text-xl">daisyUI</a> */}
      <img src="../logo.svg" alt="logo" className="w-60 ml-20" />
    </div>
    <div className="navbar-center hidden lg:flex ">
      <ul className="menu menu-horizontal px-1">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <details>
            <summary>Flowchart</summary>
            <ul className="p-2  text-black">
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
                <a>2023 - 2024 </a>
              </li>
              <li>
                <a href="/flowchart/create">Create Flowchart</a>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary>Degree map</summary>
            <ul className="p-2 bg-background text-black">
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
    <div className="navbar-end">
      <a className="btn btn-secondary">Get Started</a>
    </div>
  </div>
)
}