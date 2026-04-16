import React from "react";
import EmployerSideBar from "./EmployerSideBar";
import { Outlet } from "react-router-dom";

const EmployerLayout = () => {
  return (
    <div className="flex">
      <EmployerSideBar />
      <Outlet />
    </div>
  );
};

export default EmployerLayout;
