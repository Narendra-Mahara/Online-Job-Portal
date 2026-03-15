import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="flex items-center justify-center  py-36 bg-gray-100 px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Find Your <span className="text-blue-600">Dream Job</span> Today
          </h1>

          <p className="mt-4 text-gray-500 text-lg">
            Connect with top employers, build your resume, and track
            applications — all in one place.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link to="/jobs">
              {" "}
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg cursor-pointer">
                Browse Jobs
              </button>
            </Link>

            <Link to="/register">
              {" "}
              <button className="border border-gray-300 px-6 py-3 rounded-lg  transition-all duration-300  hover:scale-105 hover:shadow-lg  cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
