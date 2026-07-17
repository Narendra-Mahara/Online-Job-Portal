import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    jobType: "full-time",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  const normalizeSalary = (value) =>
    Number(String(value).replace(/,/g, "").trim());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.company.trim()) return "Company is required";
    if (!form.location.trim()) return "Location is required";
    if (!String(form.salaryMin).trim() || !String(form.salaryMax).trim())
      return "Salary range (min and max) is required";

    const min = normalizeSalary(form.salaryMin);
    const max = normalizeSalary(form.salaryMax);
    if (!Number.isFinite(min) || !Number.isFinite(max))
      return "Salary min and max must be numeric values";
    if (min <= 0 || max <= 0)
      return "Salary min and max must be greater than 0";
    if (min > max) return "Salary min cannot be greater than salary max";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err, { position: "top-right" });
      return;
    }

    setIsSubmitting(true);

    const salaryMin = normalizeSalary(form.salaryMin);
    const salaryMax = normalizeSalary(form.salaryMax);

    const payload = {
      title: form.title,
      description: form.description,
      requirements: form.requirements
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      jobType: form.jobType,
      company: form.company,
      location: form.location,
      salaryRange: {
        min: salaryMin,
        max: salaryMax,
      },
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/jobs/create`,
        payload,
        { withCredentials: true },
      );

      toast.success(res.data?.message || "Job posted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/employer/my-jobs");
    } catch (error) {
      console.error("Post job error", error);
      toast.error(error.response?.data?.message || "Failed to post job", {
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Post a Job</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Job Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Senior Frontend Developer"
            />

            <label className="block mt-4 mb-2 text-sm font-medium text-slate-700">
              Company
            </label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Tech Corp"
            />

            <label className="block mt-4 mb-2 text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Kanchanpur, Nepal"
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Salary Min
                </label>
                <input
                  name="salaryMin"
                  value={form.salaryMin}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 50000"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Salary Max
                </label>
                <input
                  name="salaryMax"
                  value={form.salaryMax}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 100000"
                />
              </div>
            </div>

            <label className="block mt-4 mb-2 text-sm font-medium text-slate-700">
              Job Type
            </label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>

            <label className="block mt-4 mb-2 text-sm font-medium text-slate-700">
              Requirements (comma separated)
            </label>
            <input
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. React, Node.js, SQL"
            />

            <label className="block mt-4 mb-2 text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} min-h-36`}
              placeholder="Write a detailed job description here..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer "
            >
              {isSubmitting ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
