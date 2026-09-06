import {
  Users,
  GraduationCap,
  BriefcaseBusiness,
  UserCheck,
  TrendingUp,
  Clock3,
  AlertTriangle,
} from "lucide-react";

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

function Dashboard() {
  const employmentOutcomes = [
    {
      label: "Employment",
      value: 318,
      percent: 71,
      className: "bg-blue-500",
    },
    {
      label: "Self-employment",
      value: 66,
      percent: 15,
      className: "bg-indigo-500",
    },
    {
      label: "Apprenticeship",
      value: 44,
      percent: 10,
      className: "bg-violet-500",
    },
    {
      label: "Unemployed",
      value: 22,
      percent: 5,
      className: "bg-pink-500",
    },
  ];

  const trainingStatus = [
    {
      label: "Completed",
      value: 400,
      percent: 80,
    },
    {
      label: "Dropped",
      value: 50,
      percent: 10,
    },
    {
      label: "In Progress",
      value: 50,
      percent: 10,
    },
  ];

  const nonPlacementReasons = [
    { reason: "Lack of required skills", value: 7 },
    { reason: "No suitable jobs nearby", value: 7 },
    { reason: "Salary too low", value: 6 },
    { reason: "Relocation required", value: 6 },
  ];

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
          value="500"
          subtitle="Registered trainees"
          icon={Users}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Training Completed"
          value="400"
          subtitle="80% of trainees"
          icon={GraduationCap}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Employment Outcomes"
          value="428"
          subtitle="Employment + self-employment + apprenticeship"
          icon={BriefcaseBusiness}
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Active Outcomes"
          value="368"
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
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
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
                +15.2%
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
                90%
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
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              style={{ width: "90%" }}
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
                50
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