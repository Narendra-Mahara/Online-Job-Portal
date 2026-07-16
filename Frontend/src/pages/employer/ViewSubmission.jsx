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
  const [expandedSubmissions, setExpandedSubmissions] = useState([]);

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
    const skills = Array.isArray(resume.skills) ? resume.skills : [];
    const topSkills = skills.slice(0, 4);
    const educationList = Array.isArray(resume.education)
      ? resume.education
      : [];
    const experienceList = Array.isArray(resume.experience)
      ? resume.experience
      : [];
    const projectsList = Array.isArray(resume.projects) ? resume.projects : [];
    const latestEducation = educationList[0] || null;
    const experienceCount = experienceList.length;

    const appliedDate = submission.createdAt
      ? new Date(submission.createdAt).toISOString().slice(0, 10)
      : "-";
    const currentStatus = submission.status || "pending";
    const isStatusLocked = currentStatus !== "pending";

    return {
      id: submission._id,
      applicantImage:
        applicant.profileImage ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      fullName: personalInfo.fullName || applicant.name || "Unknown candidate",
      email: personalInfo.email || applicant.email || "-",
      phone: personalInfo.phone || applicant.phone || "No phone",
      address: personalInfo.address || "-",
      linkedIn: personalInfo.linkedIn || "",
      github: personalInfo.github || "",
      summary: resume.summary || "No summary provided",
      skills,
      topSkills,
      educationList,
      experienceList,
      projectsList,
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

  const toggleSubmission = (submissionId) => {
    setExpandedSubmissions((current) =>
      current.includes(submissionId)
        ? current.filter((id) => id !== submissionId)
        : [...current, submissionId],
    );
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
    <div className="min-h-screen w-full bg-white px-0 py-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Submissions</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Review applicants for this job and update their status.
            </p>
          </div>
          <Link
            to="/employer/my-jobs"
            className="inline-flex items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
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
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              No submissions yet
            </h2>
            <p className="mx-auto max-w-lg text-slate-500">
              Once candidates apply to this job, their submissions will appear
              here.
            </p>
          </div>
        )}

        {!loading && !error && submissions.length > 0 && (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const normalized = normalizeSubmission(submission);
              const isExpanded = expandedSubmissions.includes(normalized.id);

              return (
                <div
                  key={normalized.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleSubmission(normalized.id)}
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50/80 sm:px-5"
                    aria-expanded={isExpanded}
                    aria-controls={`submission-panel-${normalized.id}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <img
                          src={normalized.applicantImage}
                          alt={normalized.fullName}
                          className="h-15 w-15 shrink-0 rounded-full border border-slate-200 object-cover"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                              {normalized.fullName}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[normalized.currentStatus] || statusStyles.pending}`}
                            >
                              {normalized.currentStatus}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-sm text-slate-500">
                            {normalized.email}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {normalized.summary}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 pt-1 text-slate-500">
                      <span className="hidden text-xs font-medium uppercase tracking-wider sm:inline">
                        {isExpanded ? "Collapse" : "Expand"}
                      </span>
                      <svg
                        className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>

                  <div
                    id={`submission-panel-${normalized.id}`}
                    className={`${isExpanded ? "block" : "hidden"} border-t border-slate-200 bg-slate-50/60 px-4 py-4 sm:px-5 sm:py-5`}
                  >
                    <div className="grid gap-4 lg:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Personal Info
                        </h4>
                        <div className="space-y-1 text-sm text-slate-700">
                          <p>
                            <span className="font-semibold text-slate-800">
                              Name:
                            </span>{" "}
                            {normalized.fullName}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-800">
                              Email:
                            </span>{" "}
                            {normalized.email}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-800">
                              Phone:
                            </span>{" "}
                            {normalized.phone}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-800">
                              Address:
                            </span>{" "}
                            {normalized.address}
                          </p>
                          {normalized.linkedIn && (
                            <p className="break-all">
                              <span className="font-semibold text-slate-800">
                                LinkedIn:
                              </span>{" "}
                              <a
                                href={normalized.linkedIn}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {normalized.linkedIn}
                              </a>
                            </p>
                          )}
                          {normalized.github && (
                            <p className="break-all">
                              <span className="font-semibold text-slate-800">
                                GitHub:
                              </span>{" "}
                              <a
                                href={normalized.github}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {normalized.github}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Education & Experience
                        </h4>
                        <div className="space-y-3 text-sm text-slate-700">
                          <div>
                            <p className="mb-1 font-semibold text-slate-800">
                              Education
                            </p>
                            {normalized.educationList.length > 0 ? (
                              <ul className="space-y-2">
                                {normalized.educationList.map(
                                  (education, index) => (
                                    <li
                                      key={`${normalized.id}-edu-${index}`}
                                      className="rounded-lg bg-slate-50 p-3"
                                    >
                                      <div className="font-medium text-slate-800">
                                        {education.degree || "Degree"}
                                      </div>
                                      <div className="text-slate-600">
                                        {education.institution || "Institution"}
                                      </div>
                                      <div className="mt-1 text-xs text-slate-500">
                                        {[
                                          education.fieldOfStudy,
                                          education.grade,
                                        ]
                                          .filter(Boolean)
                                          .join(" • ") ||
                                          "No additional education details"}
                                      </div>
                                      <div className="mt-1 text-xs text-slate-500">
                                        {education.startYear || ""}
                                        {education.endYear
                                          ? ` - ${education.endYear}`
                                          : ""}
                                      </div>
                                    </li>
                                  ),
                                )}
                              </ul>
                            ) : (
                              <p className="text-slate-500">-</p>
                            )}
                          </div>

                          <div>
                            <p className="mb-1 font-semibold text-slate-800">
                              Experience
                            </p>
                            {normalized.experienceList.length > 0 ? (
                              <ul className="space-y-2">
                                {normalized.experienceList.map(
                                  (experience, index) => (
                                    <li
                                      key={`${normalized.id}-exp-${index}`}
                                      className="rounded-lg bg-slate-50 p-3"
                                    >
                                      <div className="font-medium text-slate-800">
                                        {experience.role || "Role"}
                                      </div>
                                      <div className="text-slate-600">
                                        {experience.company || "Company"}
                                      </div>
                                      <div className="mt-1 text-xs text-slate-500">
                                        {experience.startDate || ""}
                                        {experience.endDate
                                          ? ` - ${experience.endDate}`
                                          : ""}
                                      </div>
                                      {experience.description && (
                                        <p className="mt-2 text-xs text-slate-500">
                                          {experience.description}
                                        </p>
                                      )}
                                    </li>
                                  ),
                                )}
                              </ul>
                            ) : (
                              <p className="text-slate-500">-</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Skills & Projects
                        </h4>
                        <div className="space-y-3 text-sm text-slate-700">
                          <div>
                            <p className="mb-2 font-semibold text-slate-800">
                              Skills
                            </p>
                            {normalized.skills.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {normalized.skills.map((skill) => (
                                  <span
                                    key={`${normalized.id}-skill-${skill}`}
                                    className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-500">-</p>
                            )}
                          </div>

                          <div>
                            <p className="mb-1 font-semibold text-slate-800">
                              Projects
                            </p>
                            {normalized.projectsList.length > 0 ? (
                              <ul className="space-y-2">
                                {normalized.projectsList.map(
                                  (project, index) => (
                                    <li
                                      key={`${normalized.id}-project-${index}`}
                                      className="rounded-lg bg-slate-50 p-3"
                                    >
                                      <div className="font-medium text-slate-800">
                                        {project.title || "Project"}
                                      </div>
                                      {project.description && (
                                        <p className="mt-1 text-xs text-slate-500">
                                          {project.description}
                                        </p>
                                      )}
                                      {project.link && (
                                        <a
                                          href={project.link}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="mt-1 inline-block break-all text-xs text-blue-600 hover:underline"
                                        >
                                          {project.link}
                                        </a>
                                      )}
                                    </li>
                                  ),
                                )}
                              </ul>
                            ) : (
                              <p className="text-slate-500">-</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Applied On
                        </p>
                        <p className="text-sm text-slate-700">
                          {normalized.appliedDate}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Experience Summary
                        </p>
                        <p className="text-sm text-slate-700">
                          {normalized.experienceLabel}
                        </p>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Update Status
                        </label>
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
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSubmission;
