import React from "react";
import { Link, NavLink } from "react-router-dom";
const JobseekerSideBar = () => {
  return (
    <div className="hidden md:flex w-60 shrink-0 flex-col gap-4 p-5 bg-gray-100 text-lg">
      <NavLink
        to="/jobseeker/dashboard"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold underline underline-offset-2"
            : ""
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/jobseeker/profile"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold underline underline-offset-2"
            : ""
        }
      >
        Profile
      </NavLink>
      <NavLink
        to="/jobseeker/resume"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold underline underline-offset-2"
            : ""
        }
      >
        My Resume
      </NavLink>
      <NavLink
        to="/jobseeker/applied-jobs"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold underline underline-offset-2"
            : ""
        }
      >
        Applied Jobs
      </NavLink>
      <NavLink to="/jobs">Browse Jobs</NavLink>
    </div>
  );
};

export default JobseekerSideBar;
