import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
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
        <button className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full text-sm font-semibold border border-blue-100 shadow-sm">
          {jobs.length} active jobs
        </button>
        <button className="bg-white text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition">
          Fresh listings from the backend
        </button>
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
              key={job._id || index}
              className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
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
                <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-slate-200">
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
                <div className="flex items-center text-[15px] text-slate-600 gap-2.5">
                  <span className="text-lg font-bold text-slate-400">Rs.</span>
                  <span className="font-bold text-slate-700">
                    {job.salaryRange?.min?.toLocaleString("en-NP") || "0"} -{" "}
                    {job.salaryRange?.max?.toLocaleString("en-NP") ||
                      "Negotiable"}
                  </span>
                </div>
              </div>
{/* JOB SUMMARY LINE - Normal Text Style */}
<p className="text-sm text-slate-500 leading-relaxed border-l-2 border-slate-100 pl-3">
  {job.summary || `Join our team as a ${job.title} to help us scale and deliver high-quality solutions in the Nepal market.`}
</p>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 mb-8">
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
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                    Posted: May 5, 2026
                  </p>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 hover:bg-slate-100 transition border border-slate-100">
                    View details
                  </button>
                  <button className="flex-1 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-900 transition shadow-lg shadow-indigo-100">
                    Apply now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
