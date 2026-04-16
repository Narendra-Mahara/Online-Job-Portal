import { Outlet } from "react-router-dom";
import JobseekerSideBar from "../components/JobseekerSideBar";

const JobseekerLayout = () => {
  return (
    <div className="flex">
      <JobseekerSideBar />
      <Outlet />
    </div>
  );
};

export default JobseekerLayout;
