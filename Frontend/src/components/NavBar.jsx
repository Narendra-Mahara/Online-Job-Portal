import { useState } from "react";
import LoginButton from "./LoginButton";
import RegisterButton from "./RegisterButton";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  const [isHamClicked, setIsHamClicked] = useState(false);
  return (
    <>
      <nav className="max-w-full p-5 font-bold border-b border-slate-200 flex justify-between items-center ">
        <Link to="/">
          {" "}
          <h1 className="text-2xl font-mono ">
            Career<span className="text-blue-600">Forge</span>
          </h1>
        </Link>
        {/* Mobile hamburger */}
        <div
          className="w-6 h-5 flex flex-col gap-1 hamburger cursor-pointer md:hidden"
          onClick={() => setIsHamClicked(!isHamClicked)}
        >
          <div className="bg-black w-6 h-1"></div>
          <div className="bg-black w-5 h-1"></div>
          <div className="bg-black w-4 h-1"></div>
        </div>
        <div
          className={`bg-slate-900 z-50 text-white md:hidden flex flex-row-reverse justify-between fixed top-0 right-0 p-5 h-screen w-64 transform transition-transform duration-300 ease-in-out ${
            isHamClicked ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="text-2xl" onClick={() => setIsHamClicked(false)}>
            X
          </div>
          <ul className="font-bold text-xl mt-10 ml-2 flex flex-col gap-3">
            <Link to="/">
              <li>Home</li>
            </Link>
            <Link to="/about">
              <li>About Us</li>
            </Link>
            <Link to="/contact">
              <li>Contact Us</li>
            </Link>
            <Link to="/jobs">
              <li>Browse Jobs</li>
            </Link>
            <li>
              <Link to="/login">
                <LoginButton />
              </Link>
            </li>
            <li>
              <Link to="/register">
                <RegisterButton />
              </Link>
            </li>
          </ul>
        </div>

        {/* For Larger Screen */}

        <div className="hidden md:block">
          <ul className="flex items-center gap-5">
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive &&
                  "text-blue-600 underline decoration-2 underline-offset-2 "
                }
                to="/jobs"
              >
                Browse Jobs
              </NavLink>
            </li>

            <li>
              <Link to="/login">
                <LoginButton />
              </Link>
            </li>
            <li>
              <Link to="/register">
                <RegisterButton />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
