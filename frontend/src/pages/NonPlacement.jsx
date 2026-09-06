import { useState, useEffect } from "react";
import {
  AlertCircle,
  Search,
  Users,
  GraduationCap,
} from "lucide-react";
import { fetchApi } from "../api";

function NonPlacement() {
  const [nonPlacement, setNonPlacement] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [nonPlacementData, summaryData] = await Promise.all([
          fetchApi("/dashboard/non-placement"),
          fetchApi("/dashboard/summary"),
        ]);

        setNonPlacement(nonPlacementData || []);
        setSummary(summaryData || null);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
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

  const totalReports = nonPlacement.reduce(
    (sum, item) => sum + (Number(item.count) || 0),
    0
  );
  const reportedReasonsCount = nonPlacement.length;
  const traineesWithoutPlacement = summary?.unemployedTrainees ?? 0;

  const filteredRecords = nonPlacement.filter((item) => {
    const searchValue = search.toLowerCase().trim();
    return !searchValue || item.reason.toLowerCase().includes(searchValue);
  });

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
                {totalReports}
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
                {reportedReasonsCount}
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
                {traineesWithoutPlacement}
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
          {nonPlacement.map((item) => (
            <div
              key={item.id || item.reason}
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
                  trainees
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
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
                  placeholder="Search reason..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredRecords.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {nonPlacement.length}
              </span>{" "}
              reasons
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Reason
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Count
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((item) => (
                  <tr
                    key={item.id || item.reason}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">
                        {item.reason}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium">
                        {item.count}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
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