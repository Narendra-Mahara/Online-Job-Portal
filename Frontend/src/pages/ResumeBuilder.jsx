import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [isCheckingResume, setIsCheckingResume] = useState(true);
  const hasCheckedResumeRef = useRef(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedIn: "",
      github: "",
    },
    summary: "",
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        grade: "",
        startYear: "",
        endYear: "",
      },
    ],
    experience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    skills: [""],
    projects: [
      {
        title: "",
        description: "",
        link: "",
      },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (hasCheckedResumeRef.current) {
      return;
    }

    hasCheckedResumeRef.current = true;

    const checkExistingResume = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/resume/get-resume`,
          { withCredentials: true },
        );

        const data = response.data?.data || [];
        const existingResume = Array.isArray(data) ? data[0] : null;

        if (existingResume) {
          toast.info("You already have resume", {
            position: "top-right",
            autoClose: 2000,
          });
          navigate("/jobseeker/resume");
          return;
        }
      } catch (err) {
        // If the lookup fails, let the user continue to the builder.
      } finally {
        setIsCheckingResume(false);
      }
    };

    checkExistingResume();
  }, [navigate]);

  const inputClassName =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  const sectionCardClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

  const handlePersonalInfoChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      personalInfo: {
        ...previous.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleSummaryChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      summary: event.target.value,
    }));
  };

  const handleArrayObjectChange = (section, index, field, value) => {
    setFormData((previous) => ({
      ...previous,
      [section]: previous[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleSkillChange = (index, value) => {
    setFormData((previous) => ({
      ...previous,
      skills: previous.skills.map((skill, skillIndex) =>
        skillIndex === index ? value : skill,
      ),
    }));
  };

  const addArrayObjectEntry = (section, emptyItem) => {
    setFormData((previous) => ({
      ...previous,
      [section]: [...previous[section], emptyItem],
    }));
  };

  const removeArrayObjectEntry = (section, index) => {
    setFormData((previous) => {
      if (previous[section].length === 1) {
        return previous;
      }

      return {
        ...previous,
        [section]: previous[section].filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      };
    });
  };

  const addSkillEntry = () => {
    setFormData((previous) => ({
      ...previous,
      skills: [...previous.skills, ""],
    }));
  };

  const removeSkillEntry = (index) => {
    setFormData((previous) => {
      if (previous.skills.length === 1) {
        return previous;
      }

      return {
        ...previous,
        skills: previous.skills.filter((_, skillIndex) => skillIndex !== index),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      ...formData,
      skills: formData.skills.map((skill) => skill.trim()).filter(Boolean),
      education: formData.education.filter(
        (item) => item.institution.trim() || item.degree.trim(),
      ),
      experience: formData.experience.filter(
        (item) => item.company.trim() || item.role.trim(),
      ),
      projects: formData.projects.filter(
        (item) => item.title.trim() || item.description.trim(),
      ),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/resume/create`,
        payload,
        {
          withCredentials: true,
        },
      );

      toast.success(response.data?.message || "Resume created successfully.", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/jobseeker/resume");
    } catch (submitError) {
      setErrorMessage(
        submitError.response?.data?.message ||
          "Unable to create resume. Please check your fields and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingResume) {
    return (
      <div className="min-h-screen w-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          Checking resume status...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Resume Builder
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Fill in your profile, work history, skills, and projects to generate
            your resume data.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className={sectionCardClass}>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                className={inputClassName}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.personalInfo.email}
                onChange={handlePersonalInfoChange}
                className={inputClassName}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className={inputClassName}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.personalInfo.address}
                onChange={handlePersonalInfoChange}
                className={inputClassName}
              />
              <input
                type="url"
                name="linkedIn"
                placeholder="LinkedIn URL"
                value={formData.personalInfo.linkedIn}
                onChange={handlePersonalInfoChange}
                className={inputClassName}
              />
              <input
                type="url"
                name="github"
                placeholder="GitHub URL"
                value={formData.personalInfo.github}
                onChange={handlePersonalInfoChange}
                className={inputClassName}
              />
            </div>
          </section>

          <section className={sectionCardClass}>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Summary
            </h2>
            <textarea
              placeholder="Write a short professional summary..."
              value={formData.summary}
              onChange={handleSummaryChange}
              className={`${inputClassName} min-h-32`}
              maxLength={500}
              required
            />
          </section>

          <section className={sectionCardClass}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Education
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayObjectEntry("education", {
                    institution: "",
                    degree: "",
                    fieldOfStudy: "",
                    grade: "",
                    startYear: "",
                    endYear: "",
                  })
                }
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Add Education
              </button>
            </div>

            <div className="space-y-4">
              {formData.education.map((item, index) => (
                <div
                  key={`education-${index}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="mb-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeArrayObjectEntry("education", index)}
                      className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Institution"
                      value={item.institution}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "education",
                          index,
                          "institution",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={item.degree}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "education",
                          index,
                          "degree",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={item.fieldOfStudy}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "education",
                          index,
                          "fieldOfStudy",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      placeholder="Grade / GPA"
                      value={item.grade}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "education",
                          index,
                          "grade",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      placeholder="Start Year"
                      value={item.startYear}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "education",
                          index,
                          "startYear",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      placeholder="End Year"
                      value={item.endYear}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "education",
                          index,
                          "endYear",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Experience
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayObjectEntry("experience", {
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                }
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {formData.experience.map((item, index) => (
                <div
                  key={`experience-${index}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="mb-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayObjectEntry("experience", index)
                      }
                      className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Company"
                      value={item.company}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "experience",
                          index,
                          "company",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={item.role}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "experience",
                          index,
                          "role",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      placeholder="Start Date (e.g. Jan 2023)"
                      value={item.startDate}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "experience",
                          index,
                          "startDate",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      placeholder="End Date (e.g. Present)"
                      value={item.endDate}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "experience",
                          index,
                          "endDate",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                  </div>

                  <textarea
                    placeholder="Describe your key responsibilities and achievements"
                    value={item.description}
                    onChange={(event) =>
                      handleArrayObjectChange(
                        "experience",
                        index,
                        "description",
                        event.target.value,
                      )
                    }
                    className={`${inputClassName} mt-3 min-h-24`}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Skills</h2>
              <button
                type="button"
                onClick={addSkillEntry}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Add Skill
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {formData.skills.map((skill, index) => (
                <div key={`skill-${index}`} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Skill"
                    value={skill}
                    onChange={(event) =>
                      handleSkillChange(index, event.target.value)
                    }
                    className={inputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => removeSkillEntry(index)}
                    className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Projects</h2>
              <button
                type="button"
                onClick={() =>
                  addArrayObjectEntry("projects", {
                    title: "",
                    description: "",
                    link: "",
                  })
                }
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>

            <div className="space-y-4">
              {formData.projects.map((item, index) => (
                <div
                  key={`project-${index}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="mb-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeArrayObjectEntry("projects", index)}
                      className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={item.title}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "projects",
                          index,
                          "title",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                    <input
                      type="url"
                      placeholder="Project Link"
                      value={item.link}
                      onChange={(event) =>
                        handleArrayObjectChange(
                          "projects",
                          index,
                          "link",
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    />
                  </div>

                  <textarea
                    placeholder="Project description"
                    value={item.description}
                    onChange={(event) =>
                      handleArrayObjectChange(
                        "projects",
                        index,
                        "description",
                        event.target.value,
                      )
                    }
                    className={`${inputClassName} mt-3 min-h-24`}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {errorMessage && (
              <p className="mb-3 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving resume..." : "Save Resume"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeBuilder;
