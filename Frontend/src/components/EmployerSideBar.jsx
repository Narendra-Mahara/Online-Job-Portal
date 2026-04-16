import React from "react";
import { Link } from "react-router-dom";
const EmployerSideBar = () => {
  return (
    <div className="flex flex-col  gap-4 p-4 bg-gray-100 ">
      <Link to="dashboard">Dashboard</Link>
      <Link to="profile">Profile</Link>
      <Link to="post-job">Post Job</Link>
      <Link to="my-jobs">My Jobs</Link>
    </div>
  );
};

export default EmployerSideBar;
