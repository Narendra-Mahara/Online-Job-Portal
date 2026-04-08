import React from "react";

const Login = () => {
  return (
    <div className="flex h-screen">
      
      {/* Left Section */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex flex-col justify-center px-16">
        
        <h1 className="text-3xl font-mono font-bold">
          💼 CareerForge
        </h1>

        <h1 className="text-4xl font-bold mb-4">
          Find your dream job <br /> in minutes.
        </h1>

        <p className="text-gray-200 max-w-md">
          Connect with top employers, discover opportunities,
          and take the next step in your career journey.
        </p>

      </div>

      {/* Right Section */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        
        <div className="w-[350px]">
          
          <h2 className="text-2xl font-semibold mb-2">
            Welcome back
          </h2>

          <p className="text-gray-500 mb-6">
            Enter your credentials to access your account
          </p>

          {/* Email */}
          <label className="block mb-1 text-sm">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            placeholder="******"
            className="w-full p-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Sign In →
          </button>

          {/* Signup */}
          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <span className="text-blue-600 cursor-pointer">
              Create one now
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;