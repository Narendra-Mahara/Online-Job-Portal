import { useState } from "react";

const App = () => {
  const [isHamClicked, setIsHamClicked] = useState(false);
  return (
    <>
      <nav className="max-w-full p-5 font-bold border-b border-slate-200 flex justify-between items-center ">
        <a href="/">
          {" "}
          <h1 className="text-2xl font-mono ">
            Career<span className="text-blue-600">Forge</span>
          </h1>
        </a>
        {/* Mobile hamburger */}
        <div
          className="w-6 h-5 flex flex-col gap-1 hamburger cursor-pointer lg:hidden"
          onClick={() => setIsHamClicked(!isHamClicked)}
        >
          <div className="bg-black w-6 h-1"></div>
          <div className="bg-black w-5 h-1"></div>
          <div className="bg-black w-4 h-1"></div>
        </div>
        <div
          className={`bg-slate-900 text-white lg:hidden flex flex-row-reverse justify-between fixed top-0 right-0 p-5 h-screen w-64 transform transition-transform duration-300 ease-in-out ${
            isHamClicked ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="text-2xl" onClick={() => setIsHamClicked(false)}>
            X
          </div>
          <ul className="font-bold text-xl mt-10 ml-2 flex flex-col gap-3">
            <a href="/">
              <li>Home</li>
            </a>
            <a href="/about">
              <li>About Us</li>
            </a>
            <a href="/contact">
              <li>Contact Us</li>
            </a>
            <a href="/jobs">
              <li>Browse Jobs</li>
            </a>
            <li>
              <a href="/login">
                <button className="px-3 py-3 bg-blue-600 text-white font-bold rounded-sm">
                  Login
                </button>
              </a>
            </li>
            <li>
              <a href="/register">
                <button className=" cursor-pointer p-2 outline-2 outline-slate-300  font-bold rounded-sm">
                  Register
                </button>
              </a>
            </li>
          </ul>
        </div>

        {/* For Larger Screen */}

        <div className="hidden lg:block">
          <ul className="flex items-center gap-5">
            <li>
              <a href="/jobs">Browse Jobs</a>
            </li>

            <li>
              <a href="/login">
                <button
                  className="cursor-pointer p-2 w-22 bg-blue-600 text-white font-bold rounded-sm transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg"
                >
                  Login
                </button>
              </a>
            </li>
            <li>
              <a href="/register">
                <button
                  className=" cursor-pointer p-2 outline-2 outline-slate-300 transition-all duration-300 hover:scale-105 hover:shadow-lg font-bold rounded-sm hover:bg-blue-600 hover:text-white hover:outline-0"
                >
                  Register
                </button>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default App;
