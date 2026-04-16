import React from "react";
import { Link } from "react-router-dom";
const JobseekerSideBar = () => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-100 ">
      <Link to="/jobseeker/dashboard">Dashboard</Link>
      <Link to="/jobseeker/profile">Profile</Link>
      <Link to="/resume-builder">Resume Builder</Link>
      <Link to="/jobseeker/applied-jobs">Applied Jobs</Link>
      <Link to="/jobs">Browse Jobs</Link>
    </div>
  );
};

export default JobseekerSideBar;
