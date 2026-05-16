import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const ViewJob = () => {
  const { user } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Fetch job details on component mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}`,
        );
        setJob(response.data?.data);
      } catch (err) {
        setError("Unable to load job details. Please try again.");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  // Disable scroll when apply modal is open
  useEffect(() => {
    if (isApplyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isApplyModalOpen]);

  const handleApplyJob = async () => {
    setIsApplying(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/application/apply/${jobId}`,
        {},
        {
          withCredentials: true,
        },
      );

      toast.success(response.data.message || "Applied successfully!", {
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
      setIsApplyModalOpen(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to apply for job. Please try again.",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Slide,
        },
      );
      setIsApplyModalOpen(false);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600 text-xl">
            ⚠
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            {error || "Job not found"}
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            We couldn't load this job. Please try again or go back.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition cursor-pointer"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md shadow-lg">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg sm:text-xl">
                ?
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-center mb-2">
              Apply for Job
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 text-center mb-5">
              Are you sure you want to apply for this job?
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                className="w-full px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 cursor-pointer font-semibold disabled:opacity-50"
                onClick={() => setIsApplyModalOpen(false)}
                disabled={isApplying}
              >
                Cancel
              </button>

              <button
                className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                onClick={handleApplyJob}
                disabled={isApplying}
              >
                {isApplying ? "Applying..." : "Yes, Apply"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-50 min-h-screen px-6 py-12 lg:px-20">
        {/* BACK BUTTON */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/jobs")}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
          >
            ← Back to Jobs
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* JOB DETAILS SECTION */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              {/* HEADER */}
              <div className="mb-8 pb-8 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
                      {job.title}
                    </h1>
                    <p className="text-xl text-slate-600 font-semibold">
                      {job.company}
                    </p>
                  </div>
                  <span className="inline-block px-4 py-1.5 bg-blue-100 text-green-700 rounded-full text-sm font-semibold capitalize">
                    {job.status}
                  </span>
                </div>

                {/* META INFO */}
              </div>

              {/* DESCRIPTION SECTION */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Job Description
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {/* REQUIREMENTS SECTION */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {Array.isArray(job.requirements) &&
                    job.requirements.map((requirement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-slate-700"
                      >
                        <span className="text-blue-600 font-bold mt-1">✓</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SIDEBAR - APPLY SECTION */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-8 shadow-lg sticky top-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {job.company}
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  {job.location} • {job.jobType}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{job.salaryRange?.min?.toLocaleString()} - ₹
                  {job.salaryRange?.max?.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsApplyModalOpen(true);
                  if (!user) {
                    toast.error("Please log in to apply for jobs.", {
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
                    navigate("/login");
                    return;
                  }
                }}
                className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold transition shadow-md hover:shadow-lg mb-4 cursor-pointer"
              >
                Apply Now
              </button>

              <button
                onClick={() => navigate("/jobs")}
                className="w-full px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition cursor-pointer"
              >
                Browse More Jobs
              </button>

              {/* JOB DETAILS CARD */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-4">
                  Job Details
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-slate-600 font-semibold mb-1">
                      Job Type
                    </p>
                    <p className="text-slate-900 capitalize">{job.jobType}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-semibold mb-1">
                      Location
                    </p>
                    <p className="text-slate-900">{job.location}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-semibold mb-1">
                      Posted On
                    </p>
                    <p className="text-slate-900">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewJob;
