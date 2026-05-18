import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/jobs/employer-job`,
          {
            withCredentials: true,
          },
        );

        const jobsData = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const jobsWithApplicantCount = await Promise.all(
          jobsData.map(async (job) => {
            try {
              const applicationsResponse = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/application/job/${job._id}`,
                {
                  withCredentials: true,
                },
              );

              const applications = Array.isArray(
                applicationsResponse.data?.data,
              )
                ? applicationsResponse.data.data
                : [];

              return { ...job, applicantCount: applications.length };
            } catch {
              return { ...job, applicantCount: 0 };
            }
          }),
        );

        setJobs(jobsWithApplicantCount);
      } catch {
        setError("Unable to load your dashboard right now.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerJobs();
  }, []);

  const summary = useMemo(() => {
    const counts = {
      active: 0,
      closed: 0,
      applicants: 0,
    };

    jobs.forEach((job) => {
      const status = (job.status || "active").toLowerCase();
      if (status === "closed") {
        counts.closed += 1;
      } else {
        counts.active += 1;
      }
      counts.applicants += job.applicantCount || 0;
    });

    return counts;
  }, [jobs]);

  const totalJobs = jobs.length;
  const recentJobs = jobs.slice(0, 4);

  const donutSegments = [
    {
      key: "active",
      label: "Active",
      value: summary.active,
      color: "#10b981",
    },
    {
      key: "closed",
      label: "Closed",
      value: summary.closed,
      color: "#ef4444",
    },
  ];

  const chartData = donutSegments.filter((segment) => segment.value > 0);

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Dashboard
          </h1>
          <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
            Track your posted jobs, monitor active vs closed roles, and review
            total applicant activity.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading your dashboard...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 font-medium text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Total jobs
                  </p>
                  <p className="mt-3 text-4xl font-bold text-slate-900">
                    {totalJobs}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Active jobs
                  </p>
                  <p className="mt-3 text-4xl font-bold text-emerald-500">
                    {summary.active}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Total applicants
                  </p>
                  <p className="mt-3 text-4xl font-bold text-blue-500">
                    {summary.applicants}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Job status overview
                    </h2>
                    <p className="text-sm text-slate-500">
                      Distribution of active and closed jobs.
                    </p>
                  </div>
                  <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                    {totalJobs} total
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:items-center">
                  <div className="flex items-center justify-center">
                    <div className="h-72 w-full max-w-sm">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={72}
                            outerRadius={108}
                            paddingAngle={3}
                            stroke="none"
                          >
                            {chartData.map((entry) => (
                              <Cell key={entry.key} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [value, name]}
                            contentStyle={{
                              borderRadius: "16px",
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            formatter={(value) => (
                              <span style={{ color: "#334155" }}>{value}</span>
                            )}
                          />
                          <text
                            x="50%"
                            y="46%"
                            textAnchor="middle"
                            className="fill-slate-900 text-[24px] font-bold"
                            style={{ fontSize: "24px", fontWeight: 700 }}
                          >
                            {totalJobs}
                          </text>
                          <text
                            x="50%"
                            y="56%"
                            textAnchor="middle"
                            className="fill-slate-500 text-[11px] font-semibold uppercase tracking-[0.25em]"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                          >
                            Jobs
                          </text>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {donutSegments.map((segment) => (
                      <div
                        key={segment.key}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-3.5 w-3.5 rounded-full"
                            style={{ backgroundColor: segment.color }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {segment.label}
                            </p>
                            <p className="text-xs text-slate-500">
                              Jobs currently {segment.key}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {segment.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Recent jobs
                    </h2>
                    <p className="text-sm text-slate-500">
                      Latest jobs you posted.
                    </p>
                  </div>
                  <Link
                    to="/employer/my-jobs"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View all
                  </Link>
                </div>

                {recentJobs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                    You have not posted any jobs yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs.map((job) => {
                      const postedDate = job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently";

                      return (
                        <div
                          key={job._id}
                          className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {job.title || "Untitled role"}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {job.company || "Company not specified"}
                              </p>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                              {postedDate}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                            <span>
                              {job.location || "Location unavailable"}
                            </span>
                            <span>•</span>
                            <span className="capitalize">
                              {job.status || "active"}
                            </span>
                            <span>•</span>
                            <span>{job.applicantCount || 0} applicants</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-slate-900">
                  Status breakdown
                </h2>
                <div className="mt-5 space-y-4">
                  {donutSegments.map((segment) => {
                    const percentage = totalJobs
                      ? Math.round((segment.value / totalJobs) * 100)
                      : 0;

                    return (
                      <div key={segment.key}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {segment.label}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {segment.value} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: segment.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  to="/employer/post-job"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Post a new job
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
