import React from "react";
import { NavLink } from "react-router-dom";
import { FaRegUserCircle, FaRegFileAlt, FaSearch } from "react-icons/fa";
import { MdDashboard, MdWorkOutline } from "react-icons/md";
const JobseekerSideBar = () => {
  return (
    <div className="hidden md:flex w-60 shrink-0 flex-col gap-4 p-5 bg-gray-100 text-lg">
      <NavLink
        to="/jobseeker/dashboard"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 text-blue-600 font-semibold underline underline-offset-2"
            : "flex items-center gap-2 text-slate-700 hover:text-blue-600"
        }
      >
        <MdDashboard className="text-xl" />
        Dashboard
      </NavLink>
      <NavLink
        to="/jobseeker/profile"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 text-blue-600 font-semibold underline underline-offset-2"
            : "flex items-center gap-2 text-slate-700 hover:text-blue-600"
        }
      >
        <FaRegUserCircle className="text-lg" />
        Profile
      </NavLink>
      <NavLink
        to="/jobseeker/resume"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 text-blue-600 font-semibold underline underline-offset-2"
            : "flex items-center gap-2 text-slate-700 hover:text-blue-600"
        }
      >
        <FaRegFileAlt className="text-lg" />
        My Resume
      </NavLink>
      <NavLink
        to="/jobseeker/applied-jobs"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 text-blue-600 font-semibold underline underline-offset-2"
            : "flex items-center gap-2 text-slate-700 hover:text-blue-600"
        }
      >
        <MdWorkOutline className="text-xl" />
        Applied Jobs
      </NavLink>
      <NavLink
        to="/jobs"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 text-blue-600 font-semibold underline underline-offset-2"
            : "flex items-center gap-2 text-slate-700 hover:text-blue-600"
        }
      >
        <FaSearch className="text-lg" />
        Browse Jobs
      </NavLink>
    </div>
  );
};

export default JobseekerSideBar;
