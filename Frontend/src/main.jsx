import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Layout from "./Layout.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Jobs from "./pages/Jobs.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import JobseekerDashboard from "./pages/JobseekerDashboard.jsx";
import EmployerDashboard from "./pages/EmployerDashboard.jsx";
import JobseekerLayout from "./components/JobseekerLayout.jsx";
import Profile from "./pages/Profile.jsx";
import EmployerLayout from "./components/EmployerLayout.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />

      <Route
        path="/jobseeker"
        element={
          <ProtectedRoute allowedRole="jobseeker">
            <JobseekerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<JobseekerDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="resume-builder" element={<ResumeBuilder />} />
      </Route>

      <Route
        path="/employer"
        element={
          <ProtectedRoute allowedRole="employer">
            <EmployerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<EmployerDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="post-job" element={<h1>Post Job Page</h1>} />
        <Route path="my-jobs" element={<h1>My Jobs Page</h1>} />
      </Route>

    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
