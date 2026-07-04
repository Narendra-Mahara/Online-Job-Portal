import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ViewSubmission = () => {
  const { jobId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const statusOptions = ["pending", "shortlisted", "rejected"];

  const normalizeSubmission = (submission) => {
    const resume = submission.resume || {};
    const personalInfo = resume.personalInfo || {};
    const applicant = submission.applicant || {};
    const topSkills = Array.isArray(resume.skills)
      ? resume.skills.slice(0, 4)
      : [];
    const educationList = Array.isArray(resume.education)
      ? resume.education
      : [];
    const latestEducation = educationList[0] || null;
    const experienceCount = Array.isArray(resume.experience)
      ? resume.experience.length
      : 0;

    const appliedDate = submission.createdAt
      ? new Date(submission.createdAt).toISOString().slice(0, 10)
      : "-";
    const currentStatus = submission.status || "pending";
    const isStatusLocked = currentStatus !== "pending";

    return {
      id: submission._id,
      fullName: applicant.name || personalInfo.fullName || "Unknown candidate",
      email: applicant.email || personalInfo.email || "-",
      phone: applicant.phone || personalInfo.phone || "No phone",
      summary: resume.summary || "No summary provided",
      topSkills,
      educationDegree: latestEducation?.degree || "Degree",
      educationInstitution:
        latestEducation?.institution || "Institution not provided",
      hasEducation: Boolean(latestEducation),
      experienceLabel:
        experienceCount > 0
          ? `${experienceCount} role${experienceCount > 1 ? "s" : ""}`
          : "Fresher",
      appliedDate,
      currentStatus,
      isStatusLocked,
    };
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/application/job/${jobId}`,
          {
            withCredentials: true,
          },
        );

        const data = response.data?.data;
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError("Unable to load job submissions right now.");
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchSubmissions();
    }
  }, [jobId]);

  const handleStatusUpdate = async (applicationId, nextStatus) => {
    try {
      setUpdatingId(applicationId);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/application/update/${applicationId}`,
        { status: nextStatus },
        { withCredentials: true },
      );

      setSubmissions((prev) =>
        prev.map((submission) =>
          submission._id === applicationId
            ? { ...submission, status: nextStatus }
            : submission,
        ),
      );
      toast.success("Application status updated.");
    } catch (updateError) {
      toast.error(
        updateError.response?.data?.message ||
          "Failed to update application status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white min-h-screen w-full py-10 px-0">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Submissions</h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Review applicants for this job and update their status.
            </p>
          </div>
          <Link
            to="/employer/my-jobs"
            className="inline-flex items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            Back to My Jobs
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading submissions...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 font-medium text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No submissions yet
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Once candidates apply to this job, their submissions will appear
              here.
            </p>
          </div>
        )}

        {!loading && !error && submissions.length > 0 && (
          <>
            <div className="md:hidden space-y-4">
              {submissions.map((submission) => {
                const normalized = normalizeSubmission(submission);

                return (
                  <div
                    key={normalized.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {normalized.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {normalized.email}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[normalized.currentStatus] || statusStyles.pending}`}
                      >
                        {normalized.currentStatus}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-3">
                      {normalized.summary}
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-800">
                          Phone:
                        </span>{" "}
                        {normalized.phone}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Education:
                        </span>{" "}
                        {normalized.hasEducation
                          ? `${normalized.educationDegree} - ${normalized.educationInstitution}`
                          : "-"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Experience:
                        </span>{" "}
                        {normalized.experienceLabel}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Applied On:
                        </span>{" "}
                        {normalized.appliedDate}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {normalized.topSkills.length > 0 ? (
                        normalized.topSkills.map((skill) => (
                          <span
                            key={`${normalized.id}-${skill}`}
                            className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          No skills listed
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Update Status
                      </label>
                      <select
                        value={normalized.currentStatus}
                        onChange={(event) =>
                          handleStatusUpdate(normalized.id, event.target.value)
                        }
                        disabled={
                          updatingId === normalized.id ||
                          normalized.isStatusLocked
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {statusOptions.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption.charAt(0).toUpperCase() +
                              statusOption.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 sm:px-5 py-3 sm:py-4 text-left text-sm font-semibold text-slate-500">
                        Applicant
                      </th>
                      <th className="px-4 sm:px-5 py-3 sm:py-4 text-left text-sm font-semibold text-slate-500">
                        Contact
                      </th>
                      <th className="px-4 sm:px-5 py-3 sm:py-4 text-left text-sm font-semibold text-slate-500">
                        Skills
                      </th>
                      <th className="px-4 sm:px-5 py-3 sm:py-4 text-left text-sm font-semibold text-slate-500">
                        Education
                      </th>
                      <th className="px-4 sm:px-5 py-3 sm:py-4 text-left text-sm font-semibold text-slate-500">
                        Experience
                      </th>
                      <th className="px-4 sm:px-5 py-3 sm:py-4 text-left text-sm font-semibold text-slate-500">
                        Applied On
                      </th>
                      <th className="px-4 sm:px-5 py-3 sm:py-4 text-left text-sm font-semibold text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {submissions.map((submission) => {
                      const normalized = normalizeSubmission(submission);

                      return (
                        <tr
                          key={normalized.id}
                          className="hover:bg-slate-50/70 transition"
                        >
                          <td className="px-4 sm:px-5 py-4 sm:py-5 align-top">
                            <div className="text-sm font-semibold text-slate-900">
                              {normalized.fullName}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {normalized.summary}
                            </div>
                          </td>
                          <td className="px-4 sm:px-5 py-4 sm:py-5 align-top text-sm text-slate-700">
                            <div>{normalized.email}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {normalized.phone}
                            </div>
                          </td>
                          <td className="px-4 sm:px-5 py-4 sm:py-5 align-top">
                            <div className="flex flex-wrap gap-2">
                              {normalized.topSkills.length > 0 ? (
                                normalized.topSkills.map((skill) => (
                                  <span
                                    key={`${normalized.id}-${skill}`}
                                    className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-slate-500">
                                  -
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 sm:px-5 py-4 sm:py-5 align-top text-sm text-slate-700">
                            {normalized.hasEducation ? (
                              <>
                                <div className="font-medium text-slate-800">
                                  {normalized.educationDegree}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  {normalized.educationInstitution}
                                </div>
                              </>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 sm:px-5 py-4 sm:py-5 align-top text-sm text-slate-700">
                            {normalized.experienceLabel}
                          </td>
                          <td className="px-4 sm:px-5 py-4 sm:py-5 align-top text-sm text-slate-700">
                            {normalized.appliedDate}
                          </td>
                          <td className="px-4 sm:px-5 py-4 sm:py-5 align-top">
                            <select
                              value={normalized.currentStatus}
                              onChange={(event) =>
                                handleStatusUpdate(
                                  normalized.id,
                                  event.target.value,
                                )
                              }
                              disabled={
                                updatingId === normalized.id ||
                                normalized.isStatusLocked
                              }
                              className="w-full min-w-36 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {statusOptions.map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                  {statusOption.charAt(0).toUpperCase() +
                                    statusOption.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewSubmission;
