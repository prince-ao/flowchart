"use client";
import Footer from "../_components/Footer";
import Header from "../_components/Header";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header navigator />

      <div className="flex-grow flex justify-center items-center">
        <div className="flex flex-col items-center w-[80%]">
          <h2 className="text-4xl font-bold mb-16">Contact</h2>
          <div className="flex justify-around w-[inherit]">
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact Administrator</h3>
              <p className="font-bold italic">Professor Shuqun Zhang</p>

              <p>Chairperson of the Department</p>

              <p>2800 Victory Blvd, 1N-215</p>

              <p>Staten Island, New York 10314</p>

              <p>Phone: 718.982-2850</p>

              <p>Fax: 718.982-2856</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact Developers</h3>
              <a
                href="https://github.com/Unaiza898/flowchart-csi/issues/new"
                target="_blank"
                className="link"
              >
                <p>Submit a GitHub issue</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
