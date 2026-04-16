import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiGroup } from "react-icons/bi";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
const Home = () => {
  const { user, authLoading } = useAuth();
  return (
    <>
      <div className="flex items-center justify-center  py-36 bg-gray-100 px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Find Your <span className="text-blue-600">Dream Job</span> Today
          </h1>

          <p className="mt-4 text-gray-500 text-lg">
            Connect with top employers, build your resume, and track
            applications — all in one place.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            {!authLoading && (
              <Link to={user?.role === "employer" ? "employer/post-job" : "/jobs"}>
                {" "}
                <button className="bg-blue-600 text-white px-6 py-3 rounded-sm transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg cursor-pointer">
                  {user
                    ? user.role === "employer"
                      ? "Post a Job"
                      : "Browse Jobs"
                    : "Browse Jobs"}
                </button>
              </Link>
            )}

            {authLoading ? (
              <div className="h-12 w-32 bg-gray-300 rounded-sm animate-pulse"></div>
            ) : user ? (
              <Link
                to={
                  user.role === "employer"
                    ? "/employer/dashboard"
                    : "/jobseeker/dashboard"
                }
              >
                <button className="border border-gray-300 px-6 py-3 rounded-sm  transition-all duration-300  hover:scale-105 hover:shadow-lg  cursor-pointer">
                  View Profile
                </button>
              </Link>
            ) : (
              <Link to="/register">
                {" "}
                <button className="border border-gray-300 px-6 py-3 rounded-sm  transition-all duration-300  hover:scale-105 hover:shadow-lg  cursor-pointer">
                  Get Started
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="p-2 bg-gray-100">
        <h1 className="text-3xl text-center font-bold mb-5">
          {" "}
          Everything You Need
        </h1>
        <div className="flex flex-col md:flex-row gap-5 items-center md:justify-around p-2 md:p-5 ">
          <Card
            icon={<HiMagnifyingGlass size="29px" color="#2463EB" />}
            title="Smart Job Search"
            desc="Find the job that suits you best based on location, salary, job type, and experience level."
          />
          <Card
            icon={<IoDocumentTextOutline size="29px" color="#2463EB" />}
            title="Resume Builder"
            desc="Build a professional resume with our integrated builder and download as PDF."
          />
          <Card
            icon={<BiGroup size="29px" color="#2463EB" />}
            title="For Employers Too"
            desc="Post jobs, review applicants, and manage your hiring pipeline effortlessly."
          />
        </div>
      </div>
    </>
  );
};

export default Home;