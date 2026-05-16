import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const MyResume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/resume/get-resume`,
        { withCredentials: true },
      );
      const data = response.data?.data || [];
      setResume(Array.isArray(data) ? data[0] : null);
    } catch (err) {
      setError("Unable to load resume right now.");
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = (resumeId) => {
    setSelectedResumeId(resumeId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedResumeId) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/resume/delete/${selectedResumeId}`,
        { withCredentials: true },
      );

      toast.success(response.data?.message || "Resume deleted", {
        position: "top-right",
        autoClose: 2000,
      });

      setResume(null);
      setConfirmOpen(false);
      setSelectedResumeId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete resume", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setSelectedResumeId(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">My Resume</h1>
          <div className="flex gap-2">
            <button
              disabled={Boolean(resume)}
              onClick={() => navigate("/resume-builder")}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              title={resume ? "You already have a resume" : "Create a resume"}
            >
              Create Resume
            </button>
            <Link to="/resume-builder" className="hidden" />
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading resumes...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 font-medium text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && !resume && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-700">You have no saved resume.</p>
            <div className="mt-4">
              <button
                onClick={() => navigate("/resume-builder")}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create your first resume
              </button>
            </div>
          </div>
        )}

        {!loading && !error && resume && (
          <div className="grid grid-cols-1 gap-4">
            <div
              key={resume._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {resume.personalInfo?.fullName || "Unnamed"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {resume.personalInfo?.email} • {resume.personalInfo?.phone}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    {resume.summary}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-slate-400">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="rounded-md border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">
                    Education
                  </h3>
                  <ul className="mt-2 text-sm text-slate-600">
                    {resume.education?.map((e, i) => (
                      <li key={i} className="mb-1">
                        <strong>{e.institution}</strong> — {e.degree}{" "}
                        {e.startYear &&
                          `(${e.startYear}${e.endYear ? ` - ${e.endYear}` : ""})`}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700">
                    Experience
                  </h3>
                  <ul className="mt-2 text-sm text-slate-600">
                    {resume.experience?.map((ex, i) => (
                      <li key={i} className="mb-1">
                        <strong>{ex.role}</strong> @ {ex.company}{" "}
                        {ex.startDate &&
                          `(${ex.startDate}${ex.endDate ? ` - ${ex.endDate}` : ""})`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {resume.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeConfirm}
            />

            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900">
                Confirm delete
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Are you sure you want to delete this resume? This action cannot
                be undone.
              </p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={closeConfirm}
                  className="rounded-md border bg-transparent px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResume;
