import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const MyPostedJob = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/jobs/employer-job`,
          {
            withCredentials: true,
          },
        );
        const data = response.data?.data;
        setMyJobs(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError("Unable to load your jobs right now.");
        setMyJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const handleDeleteClick = (jobId) => {
    setSelectedJobId(jobId);
    setShowModal(true);
  };

  const handleClose = async () => {
    try {
      setClosing(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/jobs/update/${selectedJobId}`,
        {},
        {
          withCredentials: true,
        },
      );

      setMyJobs((prev) =>
        prev.map((j) =>
          j._id === selectedJobId ? { ...j, status: "closed" } : j,
        ),
      );
      closeModal();
      toast.success(response.data?.message || "Job closed successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to close the job. Please try again.",
      );
      setError("Failed to close job.");
    } finally {
      setClosing(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJobId(null);
  };

  return (
    <div className="bg-white min-h-screen w-full py-10 px-0">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6 w-full">
          <h1 className="text-3xl font-bold text-slate-900">My Posted Jobs</h1>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading your jobs...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 font-medium text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && myJobs.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm flex flex-col items-center ">
            <h2 className="text-xl font-semibold text-slate-900 ">
              No jobs posted yet
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Start posting jobs to see them here.
            </p>
            <Link to="/employer/post-job">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-5 cursor-pointer">
                Post your first job
              </button>
            </Link>
          </div>
        )}

        {!loading && !error && myJobs.length > 0 && (
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 sm:px-5 py-2 sm:py-4 text-left text-sm font-semibold text-slate-500">
                      Job Title
                    </th>
                    <th className="px-3 sm:px-5 py-2 sm:py-4 text-left text-sm font-semibold text-slate-500">
                      Location
                    </th>
                    <th className="px-3 sm:px-5 py-2 sm:py-4 text-left text-sm font-semibold text-slate-500">
                      Type
                    </th>
                    <th className="px-3 sm:px-5 py-2 sm:py-4 text-left text-sm font-semibold text-slate-500">
                      Applicants
                    </th>
                    <th className="px-3 sm:px-5 py-2 sm:py-4 text-left text-sm font-semibold text-slate-500">
                      Status
                    </th>
                    <th className="px-3 sm:px-5 py-2 sm:py-4 text-left text-sm font-semibold text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {myJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-3 sm:px-5 py-3 sm:py-5 text-sm font-semibold text-slate-900 whitespace-normal">
                        {job.title}
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-5 text-sm text-slate-700 whitespace-normal">
                        {job.location}
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-5 text-sm text-slate-700 whitespace-normal">
                        {job.jobType}
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-5">
                        <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                          {job.applicants?.length || 0}
                        </span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-5">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                            job.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {job.status === "active" ? "Active" : "Closed"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-5 text-sm">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                          <button className="bg-blue-600 font-semibold sm:mr-4 mb-2 sm:mb-0 px-4 py-2 rounded-md text-white hover:bg-blue-700 w-full sm:w-auto">
                            View Submission
                          </button>
                          <button
                            onClick={() => handleDeleteClick(job._id)}
                            disabled={job.status === "closed"}
                            className="font-semibold bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                          >
                            Close Job
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Close Job?
            </h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to close this job posting? This action
              cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={closeModal}
                disabled={closing}
                className="px-5 py-2 rounded-lg border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                disabled={closing}
                className="px-5 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition disabled:opacity-50"
              >
                {closing ? "Closing..." : "Close Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPostedJob;
