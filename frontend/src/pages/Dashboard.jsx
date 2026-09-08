import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  BriefcaseBusiness,
  UserCheck,
  TrendingUp,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import { fetchApi } from "../api";

function StatCard({ title, value, subtitle, icon: Icon, iconClass }) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h3>

          <p className="text-xs text-slate-500 mt-2">
            {subtitle}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

const EMPLOYMENT_TYPE_CLASSES = {
  employment: "bg-blue-500",
  "self-employment": "bg-indigo-500",
  apprenticeship: "bg-violet-500",
  unemployed: "bg-pink-500",
};

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [employment, setEmployment] = useState([]);
  const [retention, setRetention] = useState([]);
  const [nonPlacement, setNonPlacement] = useState([]);
  const [wages, setWages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const [
          summaryData,
          employmentData,
          retentionData,
          nonPlacementData,
          wagesData,
          coursesData,
        ] = await Promise.all([
          fetchApi("/dashboard/summary"),
          fetchApi("/dashboard/employment"),
          fetchApi("/dashboard/retention"),
          fetchApi("/dashboard/non-placement"),
          fetchApi("/dashboard/wages"),
          fetchApi("/dashboard/courses"),
        ]);

        if (isMounted) {
          setSummary(summaryData);
          setEmployment(employmentData || []);
          setRetention(retentionData || []);
          setNonPlacement(nonPlacementData || []);
          setWages(wagesData || []);
          setCourses(coursesData || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
        <p className="font-semibold">Failed to load data</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  // Calculate training status and completions from courses
  const totalCompleted = courses.reduce(
    (sum, c) => sum + (c.completed || 0),
    0
  );
  const totalDropped = courses.reduce((sum, c) => sum + (c.dropped || 0), 0);
  const totalInProgress = courses.reduce(
    (sum, c) => sum + (c.inProgress || 0),
    0
  );
  const totalTrainingStatus =
    totalCompleted + totalDropped + totalInProgress;

  const trainingStatus = [
    {
      label: "Completed",
      value: totalCompleted,
      percent:
        totalTrainingStatus > 0
          ? Math.round((totalCompleted / totalTrainingStatus) * 100)
          : 0,
    },
    {
      label: "Dropped",
      value: totalDropped,
      percent:
        totalTrainingStatus > 0
          ? Math.round((totalDropped / totalTrainingStatus) * 100)
          : 0,
    },
    {
      label: "In Progress",
      value: totalInProgress,
      percent:
        totalTrainingStatus > 0
          ? Math.round((totalInProgress / totalTrainingStatus) * 100)
          : 0,
    },
  ];

  const totalTrainees = summary?.totalTrainees || 0;
  const completedPercent =
    totalTrainees > 0
      ? Math.round((totalCompleted / totalTrainees) * 100)
      : totalTrainingStatus > 0
      ? Math.round((totalCompleted / totalTrainingStatus) * 100)
      : 0;

  // Calculate employment outcomes
  const totalEmploymentCount = employment.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  const employmentOutcomes = employment.map((item) => {
    const rawType = item.employmentType || "";
    const label = rawType
      ? rawType.charAt(0).toUpperCase() + rawType.slice(1)
      : "Unknown";
    const percent =
      totalEmploymentCount > 0
        ? Math.round((item.count / totalEmploymentCount) * 100)
        : 0;
    const className =
      EMPLOYMENT_TYPE_CLASSES[rawType.toLowerCase()] || "bg-blue-500";

    return {
      label,
      value: item.count,
      percent,
      className,
    };
  });

  // Calculate salary progression
  let startingSalarySum = 0;
  let latestSalarySum = 0;
  let wageEntriesCount = 0;

  wages.forEach((entry) => {
    if (entry.records && entry.records.length > 0) {
      startingSalarySum += entry.records[0].salaryAmount || 0;
      latestSalarySum +=
        entry.records[entry.records.length - 1].salaryAmount || 0;
      wageEntriesCount += 1;
    }
  });

  const avgStartingSalary =
    wageEntriesCount > 0 ? startingSalarySum / wageEntriesCount : 0;
  const avgLatestSalary =
    wageEntriesCount > 0 ? latestSalarySum / wageEntriesCount : 0;

  let salaryPercentChange = 0;
  if (avgStartingSalary > 0) {
    salaryPercentChange =
      ((avgLatestSalary - avgStartingSalary) / avgStartingSalary) * 100;
  }
  const salaryProgressionText = `${
    salaryPercentChange >= 0 ? "+" : ""
  }${salaryPercentChange.toFixed(1)}%`;

  // Calculate follow-up activity
  const completedFollowUps = retention.reduce(
    (sum, r) => sum + (r.completedFollowUps || 0),
    0
  );
  const noResponseFollowUps = retention.reduce(
    (sum, r) => sum + (r.noResponseFollowUps || 0),
    0
  );
  const totalFollowUps = completedFollowUps + noResponseFollowUps;
  const followUpPercent =
    totalFollowUps > 0
      ? Math.round((completedFollowUps / totalFollowUps) * 100)
      : 0;

  // Calculate non-placement reasons
  const totalNonPlacement = nonPlacement.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );
  const nonPlacementReasons = [...nonPlacement]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 4)
    .map((item) => ({
      reason: item.reason,
      value: item.count,
    }));

  return (
    <div className="space-y-6">

      {/* Page introduction */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Program Overview
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Skilling Outcomes Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Track training completion, employment outcomes and follow-up status.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Trainees"
          value={totalTrainees}
          subtitle="Registered trainees"
          icon={Users}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Training Completed"
          value={totalCompleted}
          subtitle={`${completedPercent}% of trainees`}
          icon={GraduationCap}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Employment Outcomes"
          value={summary?.workingTrainees ?? 0}
          subtitle="Employment + self-employment + apprenticeship"
          icon={BriefcaseBusiness}
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Active Outcomes"
          value={summary?.verifiedEmployment ?? 0}
          subtitle="Currently active records"
          icon={UserCheck}
          iconClass="bg-emerald-50 text-emerald-600"
        />

      </div>

      {/* Employment + Training */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Employment outcomes */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Employment Outcomes
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Post-training outcome distribution
              </p>
            </div>

            <BriefcaseBusiness
              size={21}
              className="text-blue-600"
            />
          </div>

          <div className="space-y-5">

            {employmentOutcomes.map((item) => (
              <div key={item.label}>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {item.value}
                  </span>
                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.className}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* Training status */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Training Status
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Training completion distribution
              </p>
            </div>

            <GraduationCap
              size={21}
              className="text-indigo-600"
            />
          </div>

          <div className="space-y-5">

            {trainingStatus.map((item) => (
              <div key={item.label}>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {item.value} ({item.percent}%)
                  </span>
                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>

      {/* Outcome summaries */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Salary */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Salary Progression
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {salaryProgressionText}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Starting vs. six-month salary
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={21} />
            </div>
          </div>

          <div className="mt-6 flex items-end gap-2 h-28">
            <div className="flex-1 bg-blue-100 rounded-t-lg h-[55%]" />
            <div className="flex-1 bg-blue-200 rounded-t-lg h-[65%]" />
            <div className="flex-1 bg-blue-300 rounded-t-lg h-[72%]" />
            <div className="flex-1 bg-blue-400 rounded-t-lg h-[84%]" />
            <div className="flex-1 bg-blue-500 rounded-t-lg h-[95%]" />
          </div>

          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Starting</span>
            <span>6 Months</span>
          </div>

        </div>

        {/* Follow-ups */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Follow-up Activity
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {followUpPercent}%
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Approximate completed responses
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock3 size={21} />
            </div>
          </div>

          <div className="mt-6 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full"
              style={{ width: `${followUpPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Completed</span>
            <span>No response</span>
          </div>

        </div>

        {/* Non-placement */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-sm text-slate-500">
                Non-placement Reports
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {totalNonPlacement}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Trainees with reported reasons
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <AlertTriangle size={21} />
            </div>
          </div>

          <div className="space-y-3">

            {nonPlacementReasons.map((item) => (
              <div
                key={item.reason}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-slate-600 truncate">
                  {item.reason}
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {item.value}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;