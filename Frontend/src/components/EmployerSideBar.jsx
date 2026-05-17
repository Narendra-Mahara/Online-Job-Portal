import React from "react";
import { NavLink } from "react-router-dom";
import { FaBriefcase, FaRegUserCircle } from "react-icons/fa";
import { MdDashboard, MdWorkOutline } from "react-icons/md";

const EmployerSideBar = () => {
  return (
    <div className="hidden md:flex w-60 shrink-0 flex-col gap-4 p-5 bg-gray-100 text-lg">
      <NavLink
        to="dashboard"
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
        to="profile"
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
        to="post-job"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 text-blue-600 font-semibold underline underline-offset-2"
            : "flex items-center gap-2 text-slate-700 hover:text-blue-600"
        }
      >
        <FaBriefcase className="text-lg" />
        Post Job
      </NavLink>
      <NavLink
        to="my-jobs"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 text-blue-600 font-semibold underline underline-offset-2"
            : "flex items-center gap-2 text-slate-700 hover:text-blue-600"
        }
      >
        <MdWorkOutline className="text-xl" />
        My Jobs
      </NavLink>
    </div>
  );
};

export default EmployerSideBar;
