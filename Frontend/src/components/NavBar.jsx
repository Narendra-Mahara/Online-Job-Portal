import { useEffect, useRef, useState } from "react";
import LoginButton from "./LoginButton";
import RegisterButton from "./RegisterButton";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
const NavBar = () => {
  const navigate = useNavigate();
  const [isHamClicked, setIsHamClicked] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const { user, logout } = useAuth();
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
      <nav className="max-w-full p-5 font-bold border-b border-slate-200 flex justify-between items-center ">
        <Link to="/">
          {" "}
          <h1 className="text-2xl font-mono ">
            Career<span className="text-blue-600">Forge</span>
          </h1>
        </Link>
        {/* Mobile hamburger */}
        <div
          ref={hamButtonRef}
          className="w-6 h-5 flex flex-col gap-1 hamburger cursor-pointer md:hidden"
          onClick={() => setIsHamClicked(!isHamClicked)}
        >
          <div className="bg-black w-6 h-1"></div>
          <div className="bg-black w-5 h-1"></div>
          <div className="bg-black w-4 h-1"></div>
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
            <Link to="/" onClick={closeMobileMenu}>
              <li>Home</li>
            </Link>
            <Link to="/about" onClick={closeMobileMenu}>
              <li>About Us</li>
            </Link>
            <Link to="/contact" onClick={closeMobileMenu}>
              <li>Contact Us</li>
            </Link>
            <Link to="/jobs" onClick={closeMobileMenu}>
              <li>Browse Jobs</li>
            </Link>
            {!user ? (
              <>
                <li>
                  <Link to="/login" onClick={closeMobileMenu}>
                    <LoginButton />
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={closeMobileMenu}>
                    <RegisterButton />
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to={
                      user.role === "employer"
                        ? "/employer/dashboard"
                        : "/jobseeker/dashboard"
                    }
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    className="font-bold bg-blue-600 text-white px-3 py-1 rounded-sm cursor-pointer hover:bg-blue-700 transition-colors duration-300"
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                  >
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
              {!user && (
                <Link to="/login">
                  <LoginButton />
                </Link>
              )}
            </li>
            <li>
              {!user ? (
                <Link to="/register">
                  <RegisterButton />
                </Link>
              ) : (
                <div
                  className="w-10 rounded-full relative"
                  ref={profileMenuRef}
                >
                  <button
                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg ring-3 ring-blue-600"
                    onClick={() => {
                      setIsProfileClicked(!isProfileClicked);
                    }}
                  >
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user.profileImage}
                      alt=""
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
                            ? "/employer/dashboard"
                            : "/jobseeker/dashboard"
                        }
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Profile
                      </Link>

                      <button
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        onClick={handleLogout}
                      >
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
