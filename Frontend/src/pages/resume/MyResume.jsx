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
  const [hasApplications, setHasApplications] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  const formatRange = (start, end, fallback = "-") => {
    if (!start && !end) {
      return fallback;
    }

    if (start && end) {
      return `${start} - ${end}`;
    }

    return start || end || fallback;
  };

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

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/application/my-applications`,
        { withCredentials: true },
      );

      const applications = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setHasApplications(applications.length > 0);
    } catch (err) {
      setHasApplications(false);
    }
  };

  useEffect(() => {
    fetchResumes();
    fetchApplications();
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

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error("Please select a PDF file.");
      return;
    }

    if (resumeFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setIsUploading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/resume/upload-pdf`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(response.data.message);
      navigate("/resume-builder", {
        state: response.data.data,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload resume.");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Resume</h1>
            <p className="mt-1 text-sm text-slate-500">
              Review the full resume data stored in your profile.
            </p>
          </div>
          <button
            disabled={Boolean(resume)}
            onClick={() => navigate("/resume-builder")}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:opacity-50"
            title={resume ? "You already have a resume" : "Create a resume"}
          >
            Create Resume
          </button>
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
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Upload Your Resume
            </h2>

            <p className="mt-2 text-slate-500">
              Upload your resume in PDF format and we'll automatically extract
              the information into the resume builder.
            </p>

            <div className="mt-8">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="block w-full rounded-lg border border-slate-300
        text-sm text-slate-700
        file:mr-4
        file:rounded-md
        file:border-0
        file:bg-blue-600
        file:px-4
        file:py-2
        file:text-white
        hover:file:bg-blue-700"
              />

              {resumeFile && (
                <p className="mt-3 text-sm text-slate-500">
                  Selected File: <strong>{resumeFile.name}</strong>
                </p>
              )}

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={handleResumeUpload}
                  disabled={isUploading}
                  className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Upload Resume"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/resume-builder")}
                  className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100"
                >
                  Create Manually
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && resume && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Resume Overview
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {resume.personalInfo?.fullName || "Unnamed"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {resume.summary || "No summary provided."}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  <div className="text-xs text-slate-400">
                    <p>Created: {formatDate(resume.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    disabled={hasApplications}
                    title={
                      hasApplications
                        ? "Unable to delete resume because you have already applied for a job"
                        : "Delete resume"
                    }
                    className="rounded-md border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Personal Information
                </h3>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">Name:</span>{" "}
                    {resume.personalInfo?.fullName || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Email:</span>{" "}
                    {resume.personalInfo?.email || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Phone:</span>{" "}
                    {resume.personalInfo?.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">
                      Address:
                    </span>{" "}
                    {resume.personalInfo?.address || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">
                      LinkedIn:
                    </span>{" "}
                    {resume.personalInfo?.linkedIn ? (
                      <a
                        href={resume.personalInfo.linkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-blue-600 hover:underline"
                      >
                        {resume.personalInfo.linkedIn}
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">
                      GitHub:
                    </span>{" "}
                    {resume.personalInfo?.github ? (
                      <a
                        href={resume.personalInfo.github}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-blue-600 hover:underline"
                      >
                        {resume.personalInfo.github}
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Skills
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {resume.skills?.length > 0 ? (
                    resume.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No skills listed.</p>
                  )}
                </div>
              </section>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Education
                </h3>
                <div className="mt-4 space-y-3">
                  {resume.education?.length > 0 ? (
                    resume.education.map((education, index) => (
                      <div
                        key={`${education.institution || "education"}-${index}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {education.degree || "Degree"}
                            </p>
                            <p className="text-sm text-slate-600">
                              {education.institution || "Institution"}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500">
                            {formatRange(
                              education.startYear,
                              education.endYear,
                            )}
                          </p>
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-slate-700">
                          <p>
                            <span className="font-semibold text-slate-900">
                              Field:
                            </span>{" "}
                            {education.fieldOfStudy || "-"}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">
                              Grade:
                            </span>{" "}
                            {education.grade || "-"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No education listed.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Experience
                </h3>
                <div className="mt-4 space-y-3">
                  {resume.experience?.length > 0 ? (
                    resume.experience.map((experience, index) => (
                      <div
                        key={`${experience.company || "experience"}-${index}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {experience.role || "Role"}
                            </p>
                            <p className="text-sm text-slate-600">
                              {experience.company || "Company"}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500">
                            {formatRange(
                              experience.startDate,
                              experience.endDate,
                            )}
                          </p>
                        </div>
                        {experience.description && (
                          <p className="mt-3 text-sm leading-6 text-slate-700">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No experience listed.
                    </p>
                  )}
                </div>
              </section>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Projects
                </h3>
                <div className="mt-4 space-y-3">
                  {resume.projects?.length > 0 ? (
                    resume.projects.map((project, index) => (
                      <div
                        key={`${project.title || "project"}-${index}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="font-semibold text-slate-900">
                          {project.title || "Project"}
                        </p>
                        {project.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {project.description}
                          </p>
                        )}
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block break-all text-sm text-blue-600 hover:underline"
                          >
                            {project.link}
                          </a>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No projects listed.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Resume Notes
                </h3>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">
                      Summary:
                    </span>{" "}
                    {resume.summary || "-"}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-900">
                      Created At:
                    </span>{" "}
                    {formatDate(resume.createdAt)}
                  </p>
                </div>
              </section>
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
                  className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
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
