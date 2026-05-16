import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Slide } from "react-toastify";
export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  //Loads jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/jobs`,
        );
        const data = response.data?.data || [];

        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Unable to load jobs right now.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  //Disable scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleApplyJob = (jobId) => {
    setIsModalOpen(true);
    setSelectedJobId(jobId);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md shadow-lg">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg sm:text-xl">
                ?
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-center mb-2">
              Apply for Job.
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 text-center mb-5">
              Are you sure you want to apply for this job?
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                className="w-full px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 cursor-pointer font-semibold"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer font-semibold"
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      `${import.meta.env.VITE_API_BASE_URL}/application/apply/${selectedJobId}`,
                      {},
                      {
                        withCredentials: true, // This is important to include cookies in the request
                      },
                    );

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
                    setIsModalOpen(false);
                  } catch (error) {
                    toast.error(
                      error.response?.data?.message || "Something went wrong",
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
                    setIsModalOpen(false);
                  }
                }}
              >
                Yes, Apply
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-slate-50 min-h-screen px-6 py-12 lg:px-20">
        {/* HEADER SECTION */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">
            Job Listings
          </p>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Explore active jobs from employers
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Browse open roles, compare salaries, and find the right next step in
            your career.
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-4 mb-8">
          <div className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full text-sm font-semibold border border-blue-100 shadow-sm">
            {jobs.length} active jobs
          </div>
        </div>

        {/* LOADING & ERROR */}
        {loading && (
          <div className="text-center py-20 text-slate-500 font-medium">
            Loading opportunities...
          </div>
        )}
        {error && (
          <div className="text-center py-20 text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* JOB CARDS GRID */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, index) => (
              <div
                id={job._id}
                key={job._id || index}
                className="bg-white p-7 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* TOP LABELS */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                    {job.jobType || "Full-Time"}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    {job.status || "active"}
                  </span>
                </div>

                {/* ICON AND TITLE SECTION */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-slate-200">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 leading-snug">
                      {job.title}
                    </h2>
                    <p className="text-sm font-semibold text-slate-400 mt-0.5">
                      🏢 {job.company || "Employer"}
                    </p>
                  </div>
                </div>

                {/* DETAILS SECTION */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-[15px] text-slate-600 gap-2.5">
                    <span className="text-lg opacity-80">📍</span>
                    <span className="font-medium">
                      {job.location && !job.location.includes("India")
                        ? job.location
                        : "Kathmandu, Nepal"}
                    </span>
                  </div>
                  <div className="flex items-center  text-[15px] text-slate-600 gap-1">
                    <span className="text-lg font-bold text-slate-400">
                      Rs.
                    </span>
                    <span className="font-bold text-slate-700 mt-1">
                      {job.salaryRange?.min?.toLocaleString("en-NP") || "0"} -{" "}
                      {job.salaryRange?.max?.toLocaleString("en-NP") ||
                        "Negotiable"}
                    </span>
                  </div>
                </div>
                {/* JOB SUMMARY LINE - Normal Text Style */}
                <p className="text-sm text-slate-500 leading-relaxed border-l-2 border-slate-100 pl-3">
                  {job.summary ||
                    `Join our team as a ${job.title} to help us scale and deliver high-quality solutions in the Nepal market.`}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 my-5">
                  {job.requirements?.slice(0, 3).map((skill, i) => (
                    <span
                      key={i}
                      className="text-[12px] bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-xl text-slate-500 font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* FOOTER & ACTIONS */}
                <div className="pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Posted: {job.createdAt.slice(0, 10)}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 hover:bg-slate-100 transition border border-slate-100">
                      View details
                    </button>
                    <button
                      className="flex-1 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-900 transition shadow-lg shadow-indigo-100 cursor-pointer"
                      onClick={() => handleApplyJob(job._id)}
                    >
                      Apply now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
