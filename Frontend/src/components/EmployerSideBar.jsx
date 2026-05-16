import React from "react";
import { NavLink } from "react-router-dom";

const EmployerSideBar = () => {
  return (
    <div className="hidden md:flex w-60 shrink-0 flex-col gap-4 p-5 bg-gray-100 text-lg">
      <NavLink
        to="dashboard"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold underline underline-offset-2"
            : ""
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="profile"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold underline underline-offset-2"
            : ""
        }
      >
        Profile
      </NavLink>
      <NavLink
        to="post-job"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold underline underline-offset-2"
            : ""
        }
      >
        Post Job
      </NavLink>
      <NavLink
        to="my-jobs"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold underline underline-offset-2"
            : ""
        }
      >
        My Jobs
      </NavLink>
    </div>
  );
};

export default EmployerSideBar;
