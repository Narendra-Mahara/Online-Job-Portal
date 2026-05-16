import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
const AppliedJob = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/application/my-applications`,
          {
            withCredentials: true,
          },
        );

        const data = response.data?.data;
        setApplications(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError("Unable to load your applications right now.");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="bg-white min-h-screen w-full py-10 px-0">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6 w-full">
          <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading your applications...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 font-medium text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No applications yet
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-6">
              Once you apply for a job, it will appear here.
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Browse jobs
            </button>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-500">
                      Job Title
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-500">
                      Company
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-500">
                      Location
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-500">
                      Applied
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {applications.map((application) => {
                    const job = application.job || {};
                    const statusKey = application.status || "pending";
                    const appliedDate = application.createdAt
                      ? new Date(application.createdAt)
                          .toISOString()
                          .slice(0, 10)
                      : "-";

                    return (
                      <tr
                        key={application._id}
                        className="hover:bg-slate-50/70 transition"
                      >
                        <td className="px-5 py-5 text-sm font-semibold text-slate-900">
                          <button
                            onClick={() =>
                              job._id && navigate(`/job/${job._id}`)
                            }
                            disabled={!job._id}
                            className="text-left hover:text-blue-600 transition disabled:cursor-default disabled:hover:text-slate-900"
                          >
                            {job.title || "Untitled role"}
                          </button>
                        </td>
                        <td className="px-5 py-5 text-sm text-slate-700">
                          {job.company || "-"}
                        </td>
                        <td className="px-5 py-5 text-sm text-slate-700">
                          {job.location || "-"}
                        </td>
                        <td className="px-5 py-5 text-sm text-slate-700">
                          {appliedDate}
                        </td>
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[statusKey] || statusStyles.pending}`}
                          >
                            {application.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJob;
