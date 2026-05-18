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
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Jobs from "./pages/Jobs.jsx";
import ResumeBuilder from "./pages/resume/ResumeBuilder.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import JobseekerDashboard from "./pages/jobseeker/JobseekerDashboard.jsx";
import EmployerDashboard from "./pages/employer/EmployerDashboard.jsx";
import JobseekerLayout from "./components/JobseekerLayout.jsx";
import Profile from "./pages/Profile.jsx";
import EmployerLayout from "./components/EmployerLayout.jsx";
import axios from "axios";
import ViewJob from "./pages/ViewJob.jsx";
import AppliedJob from "./pages/jobseeker/AppliedJob.jsx";
import MyResume from "./pages/resume/MyResume.jsx";
import PostJob from "./pages/employer/PostJob.jsx";
import MyPostedJob from "./pages/employer/MyPostedJob.jsx";
import ViewSubmission from "./pages/employer/ViewSubmission.jsx";
import NotFound from "./pages/NotFound.jsx";

axios.defaults.withCredentials = true;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/job/:jobId" element={<ViewJob />} />
      {/* Jobseeker routes */}
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
        <Route path="resume" element={<MyResume />} />
        <Route path="applied-jobs" element={<AppliedJob />} />
      </Route>
      <Route
        path="/resume"
        element={
          <ProtectedRoute allowedRole="jobseeker">
            <MyResume />
          </ProtectedRoute>
        }
      />
      {/* Resume builder */}
      <Route
        path="/resume-builder"
        element={
          <ProtectedRoute allowedRole="jobseeker">
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />
      {/* Employer routes */}
      <Route
        path="/job/submissions/:jobId"
        element={
          <ProtectedRoute allowedRole="employer">
            <ViewSubmission />
          </ProtectedRoute>
        }
      />
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
        <Route path="post-job" element={<PostJob />} />
        <Route path="my-jobs" element={<MyPostedJob />} />
      </Route>
      <Route path="*" element={<NotFound />} />
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
