import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaRegUser } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";
import { GoLock } from "react-icons/go";
import axios from "axios";
import { toast, Slide } from "react-toastify";

const Register = () => {
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [pending, setPending] = useState(false);
  const handleForm = async (e) => {
    e.preventDefault();
    setPending(true);
    if (!role) {
      toast.error("Please select a role (Job Seeker or Employer)", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
        transition: Slide,
      });
      setPending(false);
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/register`,
        {
          name,
          email,
          password,
          role,
        },
      );
      console.log("Form Submitted", res);
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      setPending(false);

      navigate("/login");
    } catch (error) {
      console.log("Error", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      setPending(false);
    }
  };
  return (
    <>
      <div className="flex bg-gray-100">
        <div className="md:flex w-1/2 hidden flex-col px-10 py-44 gap-5 bg-blue-600 text-white">
          <h1 className="text-3xl font-mono font-bold">CareerForge</h1>
          <h3 className="text-5xl font-bold ">Start your journey today.</h3>
          <h4 className="text-lg">
            Whether you're hiring or looking, create an account to unlock
            thousands of opportunities.
          </h4>
        </div>
        <div className=" md:w-1/2 w-full p-5 text-center">
          <h1 className="text-2xl font-bold md:text-3xl">Create an account</h1>
          <h4 className="text-gray-600">
            Choose your role and get started in seconds
          </h4>
          <form className="py-2 flex flex-col gap-5" onSubmit={handleForm}>
            <div className="flex flex-col text-left relative gap-2">
              <label htmlFor="fullname">Full Name</label>
              <FaRegUser
                className="absolute top-10 left-2"
                size={20}
                color="gray"
              />
              <input
                className="p-2 pl-9 rounded outline-none border border-gray-400 placeholder:text-sm"
                type="text"
                name="name"
                id="fullname"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col text-left relative gap-2">
              <label htmlFor="email">Email</label>
              <IoMailOutline
                className="absolute top-10 left-2"
                size={22}
                color="gray"
              />

              <input
                className="p-2 pl-9 rounded outline-none border border-gray-400  placeholder:text-sm"
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col text-left relative gap-2">
              <label htmlFor="password">Password</label>
              <GoLock
                className="absolute top-10 left-2"
                size={22}
                color="gray"
              />

              <input
                className=" p-2 pl-9 rounded outline-none border border-gray-400 placeholder:text-sm"
                type="password"
                name="password"
                id="password"
                placeholder="•••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col text-left gap-2">
              <label>Select Role</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Job Seeker */}
                <div
                  onClick={() => setRole("jobseeker")}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200
      ${
        role === "jobseeker"
          ? "border-blue-600 bg-blue-50 shadow-sm"
          : "border-gray-300 hover:border-blue-400"
      }`}
                >
                  <h3 className="text-md font-semibold text-gray-800">
                    Job Seeker
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Find jobs and apply
                  </p>
                </div>

                {/* Employer */}
                <div
                  onClick={() => setRole("employer")}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200
      ${
        role === "employer"
          ? "border-blue-600 bg-blue-50 shadow-md"
          : "border-gray-300 hover:border-blue-400"
      }`}
                >
                  <h3 className="text-md font-semibold text-gray-800">
                    Employer
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Post jobs & hire</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <button
                className="py-5 px-7 bg-blue-600 text-white text-xl rounded-sm flex items-center justify-center gap-5 font-bold transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg cursor-pointer"
                type="submit"
                disabled={pending}
              >
                {pending ? "Creating.." : "Create Account "}
                <FaArrowRight />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
