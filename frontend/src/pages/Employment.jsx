import { useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

const employmentRecords = [
  {
    id: 1,
    trainee: "Aarav Sharma",
    employer: "TechNova Solutions",
    role: "Junior Developer",
    type: "Employment",
    status: "Active",
    verification: "Verified",
    relevance: "Relevant",
  },
  {
    id: 2,
    trainee: "Priya Patil",
    employer: "MahaTech Services",
    role: "Web Developer",
    type: "Employment",
    status: "Active",
    verification: "Verified",
    relevance: "Relevant",
  },
  {
    id: 3,
    trainee: "Rahul Deshmukh",
    employer: "Independent",
    role: "Freelance Developer",
    type: "Self-employment",
    status: "Active",
    verification: "Verified",
    relevance: "Relevant",
  },
  {
    id: 4,
    trainee: "Sneha Kulkarni",
    employer: "FutureTech Systems",
    role: "Software Trainee",
    type: "Apprenticeship",
    status: "Active",
    verification: "Verified",
    relevance: "Relevant",
  },
  {
    id: 5,
    trainee: "Rohan Joshi",
    employer: "TechWorks Pvt Ltd",
    role: "Support Executive",
    type: "Employment",
    status: "Inactive",
    verification: "Unverified",
    relevance: "Not relevant",
  },
  {
    id: 6,
    trainee: "Ananya Patil",
    employer: "Digital Maharashtra",
    role: "Frontend Developer",
    type: "Employment",
    status: "Active",
    verification: "Verified",
    relevance: "Relevant",
  },
  {
    id: 7,
    trainee: "Vikram Pawar",
    employer: "Independent",
    role: "Small Business Owner",
    type: "Self-employment",
    status: "Active",
    verification: "Unverified",
    relevance: "Relevant",
  },
  {
    id: 8,
    trainee: "Neha Shinde",
    employer: "Not placed",
    role: "-",
    type: "Employment",
    status: "Unemployed",
    verification: "Unverified",
    relevance: "Not relevant",
  },
];

const types = [
  "All Types",
  "Employment",
  "Self-employment",
  "Apprenticeship",
];

const statuses = [
  "All Statuses",
  "Active",
  "Inactive",
  "Unemployed",
];

const verificationStatuses = [
  "All Verification",
  "Verified",
  "Unverified",
];

function Employment() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Statuses");
  const [verification, setVerification] =
    useState("All Verification");

  const filteredRecords = employmentRecords.filter((record) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      record.trainee.toLowerCase().includes(searchValue) ||
      record.employer.toLowerCase().includes(searchValue) ||
      record.role.toLowerCase().includes(searchValue);

    const matchesType =
      type === "All Types" || record.type === type;

    const matchesStatus =
      status === "All Statuses" || record.status === status;

    const matchesVerification =
      verification === "All Verification" ||
      record.verification === verification;

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesVerification
    );
  });

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Employment Outcomes
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Employment
        </h1>

        <p className="text-slate-500 mt-2">
          Track employment outcomes, verification and training relevance.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Employment
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            318
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Employment records
          </p>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Self-employment
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            66
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Self-employment records
          </p>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Apprenticeships
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            44
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Apprenticeship records
          </p>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Salary Progression
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                +15.2%
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <IndianRupee size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Employment records */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Employment Records
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Employment outcomes recorded for trainees
              </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search trainee, employer..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>

              {/* Type */}
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {types.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Status */}
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Verification */}
              <select
                value={verification}
                onChange={(event) =>
                  setVerification(event.target.value)
                }
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {verificationStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredRecords.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {employmentRecords.length}
              </span>{" "}
              displayed records
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Trainee
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Employer
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Role
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Type
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Verification
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Relevance
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                          {record.trainee.charAt(0)}
                        </div>

                        <span className="font-semibold text-slate-800">
                          {record.trainee}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {record.employer}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {record.role}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium">
                        <BriefcaseBusiness size={14} />
                        {record.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {record.status === "Active" ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-medium">
                          <CheckCircle2 size={14} />
                          Active
                        </span>
                      ) : record.status === "Unemployed" ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium">
                          <Clock3 size={14} />
                          Unemployed
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {record.verification === "Verified" ? (
                        <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-medium">
                          Unverified
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg font-medium ${
                          record.relevance === "Relevant"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {record.relevance}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No employment records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <IndianRupee size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Salary Progression
            </h2>

            <p className="text-sm text-slate-500">
              Salary records from employment outcomes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">
              Average Starting Salary
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              ₹18,500
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">
              Average Six-Month Salary
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              ₹21,310
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">
              Average Increase
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              +15.2%
            </p>
          </div>
        </div>
      </div>

      {/* Backend mapping */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <BriefcaseBusiness
            className="text-blue-600 mt-0.5"
            size={20}
          />

          <div>
            <h3 className="font-semibold text-slate-900">
              Backend mapping
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              Employment records map to{" "}
              <span className="font-medium text-slate-800">
                employment_records
              </span>
              , employers map to{" "}
              <span className="font-medium text-slate-800">
                employers
              </span>
              , and salary progression comes from{" "}
              <span className="font-medium text-slate-800">
                salary_history
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employment;