import { useState } from "react";
import {
  AlertCircle,
  Search,
  Users,
  MapPin,
  GraduationCap,
} from "lucide-react";

const nonPlacementRecords = [
  {
    id: 1,
    trainee: "Vikram Pawar",
    district: "Pune",
    reason: "Lack of required skills",
    reportedAt: "2026-08-05",
  },
  {
    id: 2,
    trainee: "Neha Shinde",
    district: "Mumbai",
    reason: "No suitable jobs nearby",
    reportedAt: "2026-08-07",
  },
  {
    id: 3,
    trainee: "Amit Jadhav",
    district: "Nagpur",
    reason: "Salary too low",
    reportedAt: "2026-08-09",
  },
  {
    id: 4,
    trainee: "Pooja More",
    district: "Nashik",
    reason: "Relocation required",
    reportedAt: "2026-08-11",
  },
  {
    id: 5,
    trainee: "Karan Patil",
    district: "Thane",
    reason: "Family responsibilities",
    reportedAt: "2026-08-13",
  },
  {
    id: 6,
    trainee: "Snehal Joshi",
    district: "Kolhapur",
    reason: "Pursuing higher education",
    reportedAt: "2026-08-15",
  },
  {
    id: 7,
    trainee: "Aditya Kulkarni",
    district: "Aurangabad",
    reason: "Still searching",
    reportedAt: "2026-08-17",
  },
  {
    id: 8,
    trainee: "Riya Deshmukh",
    district: "Navi Mumbai",
    reason: "Personal reasons",
    reportedAt: "2026-08-19",
  },
];

const reasons = [
  "All Reasons",
  "Lack of required skills",
  "No suitable jobs nearby",
  "Salary too low",
  "Relocation required",
  "Family responsibilities",
  "Pursuing higher education",
  "Still searching",
  "Personal reasons",
];

const districts = [
  "All Districts",
  "Mumbai",
  "Pune",
  "Nagpur",
  "Nashik",
  "Thane",
  "Aurangabad",
  "Kolhapur",
  "Navi Mumbai",
];

function NonPlacement() {
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState("All Reasons");
  const [district, setDistrict] = useState("All Districts");

  const filteredRecords = nonPlacementRecords.filter((item) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      item.trainee.toLowerCase().includes(searchValue) ||
      item.district.toLowerCase().includes(searchValue) ||
      item.reason.toLowerCase().includes(searchValue);

    const matchesReason =
      reason === "All Reasons" ||
      item.reason === reason;

    const matchesDistrict =
      district === "All Districts" ||
      item.district === district;

    return (
      matchesSearch &&
      matchesReason &&
      matchesDistrict
    );
  });

  const reasonCounts = reasons
    .filter((item) => item !== "All Reasons")
    .map((item) => ({
      reason: item,
      count: nonPlacementRecords.filter(
        (record) => record.reason === item
      ).length,
    }));

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Employment Outcomes
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Non-placement Tracking
        </h1>

        <p className="text-slate-500 mt-2">
          Track reported reasons for trainees who are not placed.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Non-placement Reports
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                50
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Reported Reasons
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                8
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Trainees Without Placement
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                50
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Reason overview */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Non-placement Reasons
            </h2>

            <p className="text-sm text-slate-500">
              Reasons recorded in the system
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reasonCounts.map((item) => (
            <div
              key={item.reason}
              className="border border-slate-200 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition"
            >
              <p className="text-sm font-medium text-slate-700">
                {item.reason}
              </p>

              <div className="flex items-end justify-between mt-4">
                <p className="text-2xl font-bold text-slate-900">
                  {item.count}
                </p>

                <span className="text-xs text-slate-400">
                  displayed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Records */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Non-placement Records
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Trainee reports and recorded reasons
              </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  placeholder="Search trainee or reason..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>

              {/* Reason */}
              <select
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {reasons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* District */}
              <select
                value={district}
                onChange={(event) =>
                  setDistrict(event.target.value)
                }
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {districts.map((item) => (
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
                {nonPlacementRecords.length}
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
                  District
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Non-placement Reason
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Reported At
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                          {item.trainee.charAt(0)}
                        </div>

                        <span className="font-semibold text-slate-800">
                          {item.trainee}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={15} />
                        {item.district}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium">
                        {item.reason}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {item.reportedAt}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No non-placement records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend mapping */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="text-blue-600 mt-0.5"
            size={20}
          />

          <div>
            <h3 className="font-semibold text-slate-900">
              Backend mapping
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              Reasons come from{" "}
              <span className="font-medium text-slate-800">
                non_placement_reasons
              </span>
              , while trainee reports and dates come from{" "}
              <span className="font-medium text-slate-800">
                trainee_non_placement
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NonPlacement;