import { useEffect, useRef, useState } from "react";
import LoginButton from "./LoginButton";
import RegisterButton from "./RegisterButton";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegFileAlt, FaRegUserCircle, FaBriefcase } from "react-icons/fa";
import { FiLogOut, FiSearch } from "react-icons/fi";
import {
  MdDashboard,
  MdHome,
  MdInfoOutline,
  MdOutlineContactMail,
  MdWorkOutline,
} from "react-icons/md";

const NavBar = () => {
  const navigate = useNavigate();
  const [isHamClicked, setIsHamClicked] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const { user, logout, authLoading } = useAuth();
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamButtonRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isProfileClicked &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileClicked(false);
      }

      if (
        isHamClicked &&
        mobileMenuRef.current &&
        hamButtonRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !hamButtonRef.current.contains(event.target)
      ) {
        setIsHamClicked(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isProfileClicked, isHamClicked]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/logout`,
        {},
        { withCredentials: true },
      );
      logout();
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      navigate("/");
      setIsProfileClicked(false);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const closeMobileMenu = () => {
    setIsHamClicked(false);
  };

  return (
    <>
      <nav className="max-w-full px-5 py-3 font-bold border-b border-slate-200 flex justify-between items-center ">
        <Link to="/">
          {" "}
          <h1 className="text-2xl font-mono ">
            Career<span className="text-blue-600">Forge</span>
          </h1>
        </Link>
        {/* Mobile hamburger */}
        <div
          ref={hamButtonRef}
          className="w-12 h-12 flex items-center justify-center flex-col gap-1 hamburger cursor-pointer md:hidden"
          onClick={() => setIsHamClicked(!isHamClicked)}
        >
          {user ? (
            <img
              className="h-12 w-12 rounded-full object-cover ring-1 ring-blue-500 "
              src={user.profileImage}
              alt={user?.name || "Profile"}
            />
          ) : (
            <>
              <div className="bg-black w-6 h-1"></div>
              <div className="bg-black w-5 h-1"></div>
              <div className="bg-black w-4 h-1"></div>
            </>
          )}
        </div>
        <div
          ref={mobileMenuRef}
          className={`bg-slate-900 z-50 text-white md:hidden flex flex-row-reverse justify-between fixed top-0 right-0 p-5 h-screen w-64 transform transition-transform duration-300 ease-in-out ${
            isHamClicked ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="text-2xl" onClick={() => setIsHamClicked(false)}>
            X
          </div>
          <ul className="font-bold text-xl mt-10 ml-2 flex flex-col gap-3">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="inline-flex items-center gap-2"
            >
              <li className="inline-flex items-center gap-2">
                <MdHome />
                Home
              </li>
            </Link>
            {user?.role === "employer" && (
              <>
                <Link
                  to="/employer/my-jobs"
                  onClick={closeMobileMenu}
                  className="inline-flex items-center gap-2"
                >
                  <li className="inline-flex items-center gap-2">
                    <MdWorkOutline className="text-lg" />
                    My Jobs
                  </li>
                </Link>
                <Link
                  to="/employer/post-job"
                  onClick={closeMobileMenu}
                  className="inline-flex items-center gap-2"
                >
                  <li className="inline-flex items-center gap-2">
                    <FaBriefcase />
                    Post Job
                  </li>
                </Link>
              </>
            )}

            {authLoading ? (
              <li className="text-gray-300">Loading...</li>
            ) : !user ? (
              <>
                <li>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center justify-center cursor-pointer p-2 w-22 bg-blue-600 text-white font-bold rounded-sm transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center justify-center cursor-pointer p-2 outline-2 outline-slate-300 transition-all duration-300 hover:scale-105 hover:shadow-lg font-bold rounded-sm hover:bg-blue-600 hover:text-white hover:outline-0"
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to={
                      user.role === "employer"
                        ? "/employer/profile"
                        : "/jobseeker/profile"
                    }
                    onClick={closeMobileMenu}
                    className="inline-flex items-center gap-2"
                  >
                    <FaRegUserCircle />
                    Profile
                  </Link>
                </li>
                {user.role === "jobseeker" && (
                  <li>
                    <Link
                      to={"/jobseeker/resume"}
                      onClick={closeMobileMenu}
                      className="inline-flex items-center gap-2"
                    >
                      <FaRegFileAlt />
                      My Resume
                    </Link>
                  </li>
                )}
                {user.role === "jobseeker" && (
                  <li>
                    <Link
                      to="/jobs"
                      onClick={closeMobileMenu}
                      className="inline-flex items-center gap-2"
                    >
                      <FiSearch />
                      Browse Jobs
                    </Link>
                  </li>
                )}
                {user.role === "jobseeker" && (
                  <li>
                    <Link
                      to={"/jobseeker/applied-jobs"}
                      onClick={closeMobileMenu}
                      className="inline-flex items-center gap-2"
                    >
                      <MdWorkOutline />
                      Applied Jobs
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to={
                      user.role === "employer"
                        ? "/employer/dashboard"
                        : "/jobseeker/dashboard"
                    }
                    onClick={closeMobileMenu}
                    className="inline-flex items-center gap-2"
                  >
                    <MdDashboard />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    className="font-bold bg-blue-600 text-white px-3 py-1 rounded-sm cursor-pointer hover:bg-blue-700 transition-colors duration-300 inline-flex items-center gap-2"
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* For Larger Screen */}

        <div className="hidden md:block">
          <ul className="flex items-center gap-5">
            <li>
              <NavLink
                className={({ isActive }) =>
                  `hover:text-blue-600 font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 underline decoration-2 underline-offset-2"
                      : "text-gray-600"
                  }`
                }
                to="/jobs"
              >
                Browse Jobs
              </NavLink>
            </li>

            <li>
              {!authLoading && !user && (
                <Link to="/login">
                  <LoginButton />
                </Link>
              )}
            </li>
            <li>
              {authLoading ? (
                <div className="w-24 h-10" aria-hidden="true"></div>
              ) : !user ? (
                <Link to="/register">
                  <RegisterButton />
                </Link>
              ) : (
                <div
                  className="relative w-12 h-12 rounded-full p-0.5 bg-linear-to-br from-blue-500 via-cyan-400 to-emerald-400 shadow-[0_10px_24px_rgba(59,130,246,0.28)]"
                  ref={profileMenuRef}
                >
                  <button
                    className="group w-full h-full rounded-full overflow-hidden cursor-pointer bg-white ring-2 ring-white transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => {
                      setIsProfileClicked(!isProfileClicked);
                    }}
                  >
                    <img
                      className="h-full w-full rounded-full object-cover transition-transform duration-300 "
                      src={
                        user.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.name || "User",
                        )}&background=eff6ff&color=2563eb&size=256`
                      }
                      alt={user?.name || "Profile"}
                    />
                  </button>
                  {isProfileClicked && (
                    <div className="absolute right-5  w-48 bg-white rounded-md  drop-shadow-xl py-2 z-50 ring-1 ring-gray-300 mt-2">
                      <Link
                        onClick={() => {
                          setIsProfileClicked(false);
                        }}
                        to={
                          user.role === "employer"
                            ? "/employer/profile"
                            : "/jobseeker/profile"
                        }
                        className="px-4 py-2 text-gray-800 hover:bg-gray-100 inline-flex items-center gap-2 w-full"
                      >
                        <FaRegUserCircle />
                        Profile
                      </Link>

                      <button
                        className="px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left inline-flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <FiLogOut />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
