import React from "react";

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      
      <div className="text-center max-w-2xl">

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Find Your <span className="text-indigo-600">Dream Job</span> Today
        </h1>

        <p className="mt-4 text-gray-500 text-lg">
          Connect with top employers, build your resume, and track applications
          — all in one place.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">

          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
            🔍 Browse Jobs
          </button>

          <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100">
            Get Started Free
          </button>

        </div>

      </div>

    </div>
  );
};

export default Home;