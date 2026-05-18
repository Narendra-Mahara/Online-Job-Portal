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

const JobseekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Unable to load your application summary right now.");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const summary = useMemo(() => {
    const counts = {
      pending: 0,
      shortlisted: 0,
      rejected: 0,
    };

    applications.forEach((application) => {
      const status = (application.status || "pending").toLowerCase();
      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [applications]);

  const totalApplications = applications.length;
  const recentApplications = applications.slice(0, 4);

  const donutSegments = [
    {
      key: "pending",
      label: "Pending",
      value: summary.pending,
      color: "#f59e0b",
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      value: summary.shortlisted,
      color: "#10b981",
    },
    {
      key: "rejected",
      label: "Rejected",
      value: summary.rejected,
      color: "#ef4444",
    },
  ];

  const chartData = donutSegments.filter((segment) => segment.value > 0);

  return (
    <div className="min-h-screen w-full  px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-2">
         
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Dashboard
          </h1>
          <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
            Track how many jobs you have applied to and see the current status
            breakdown in a graph.
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
                    Total applied
                  </p>
                  <p className="mt-3 text-4xl font-bold text-slate-900">
                    {totalApplications}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Pending
                  </p>
                  <p className="mt-3 text-4xl font-bold text-amber-500">
                    {summary.pending}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Shortlisted
                  </p>
                  <p className="mt-3 text-4xl font-bold text-emerald-500">
                    {summary.shortlisted}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Applied jobs overview
                    </h2>
                    <p className="text-sm text-slate-500">
                      Status distribution from your applications.
                    </p>
                  </div>
                  <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                    {totalApplications} total
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
                            {totalApplications}
                          </text>
                          <text
                            x="50%"
                            y="56%"
                            textAnchor="middle"
                            className="fill-slate-500 text-[11px] font-semibold uppercase tracking-[0.25em]"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                          >
                            Applied
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
                              Applications with {segment.key} status
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
                      Recent applications
                    </h2>
                    <p className="text-sm text-slate-500">
                      Latest jobs you applied for.
                    </p>
                  </div>
                  <Link
                    to="/jobseeker/applied-jobs"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View all
                  </Link>
                </div>

                {recentApplications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                    You have not applied to any jobs yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((application) => {
                      const job = application.job || {};
                      const appliedDate = application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "Recently";

                      return (
                        <div
                          key={application._id}
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
                              {appliedDate}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                            <span>
                              {job.location || "Location unavailable"}
                            </span>
                            <span>•</span>
                            <span className="capitalize">
                              {application.status || "pending"}
                            </span>
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
                    const percentage = totalApplications
                      ? Math.round((segment.value / totalApplications) * 100)
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobseekerDashboard;
