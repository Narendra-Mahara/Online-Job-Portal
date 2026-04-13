import { useState, useEffect } from "react";
import { IoMailOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { GoLock } from "react-icons/go";
import { toast, Slide } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  let navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const handleForm = async (e) => {
    e.preventDefault();

    try {
      setPending(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // This is important to include cookies in the request
        },
      );
      const loggedInUser = response.data.data.user;
      login(loggedInUser);

      toast.success(response.data.message, {
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

      navigate("/");
    } catch (error) {
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
    } finally {
      setPending(false);
    }
  };
  return (
    <>
      <div className="flex bg-gray-100">
        <div className="md:flex w-1/2 hidden flex-col px-10 py-44 gap-5 bg-blue-600 text-white">
          <h1 className="text-3xl font-mono font-bold">CareerForge</h1>
          <h3 className="text-5xl font-bold ">
            Find your dream job in minutes.
          </h3>
          <h4 className="text-lg">
            Connect with top employers, discover opportunities, and take the
            next step in your career journey.
          </h4>
        </div>
        <div className=" md:w-1/2 w-full p-5 text-center">
          <h1 className="text-2xl font-bold md:text-3xl">Welcome back</h1>
          <h4 className="text-gray-600">
            Enter your credentials to access your account
          </h4>
          <form className="py-2 flex flex-col gap-5" onSubmit={handleForm}>
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

            <div className="flex justify-center w-full">
              <button
                className="py-5 px-5 bg-blue-600 text-white text-xl rounded-sm flex items-center justify-center gap-2 font-bold transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg cursor-pointer"
                type="submit"
                disabled={pending}
              >
                {pending ? "Logging in.." : "Login "}
                <FaArrowRight />
              </button>
            </div>
          </form>
          <div className="mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
