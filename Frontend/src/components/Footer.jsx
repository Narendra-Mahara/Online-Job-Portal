import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="flex  flex-col gap-4 md:flex-row p-5 md:justify-around border-t border-slate-200 ">
        <div>
          <h1 className="text-xl font-mono font-bold">
            Career<span className="text-blue-600">Forge</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Find your dream job or hire top talent.
          </p>
        </div>
        <div>
          <h1 className="font-bold">For Job Seekers</h1>
          <ul className="text-gray-600 text-sm">
            <li>
              <Link to="/jobs">Browser Jobs</Link>
            </li>
            <li>
              <Link to="/resume-builder">Resume Builder</Link>
            </li>
          </ul>
        </div>
        <div>
          <h1 className="font-bold">For Employers</h1>
          <ul className="text-gray-600 text-sm">
            <li>
              <Link to="#">Post job</Link>
            </li>
            <li>
              <Link to="#">Dashboard</Link>
            </li>
          </ul>
        </div>
        <div>
          <h1 className="font-bold">Company</h1>
          <ul className="text-gray-600 text-sm">
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 p-5 text-center ">
        &copy; 2026{" "}
        <Link className="underline" to="/">
          CareerForge
        </Link>
        . All rights reserved.
      </div>
    </>
  );
};

export default Footer;
