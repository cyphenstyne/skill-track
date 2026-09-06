import { useState, useEffect, useMemo } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock3,
  MessageSquare,
} from "lucide-react";
import { fetchApi } from "../api";

function formatEmploymentStatus(status) {
  if (!status) return "Unspecified";
  return status
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function FollowUps() {
  const [retentionData, setRetentionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employmentStatus, setEmploymentStatus] = useState(
    "All Employment Statuses"
  );

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchApi("/dashboard/retention");
        if (isMounted) {
          setRetentionData(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const completed = useMemo(() => {
    return retentionData.reduce(
      (sum, item) => sum + (Number(item.completedFollowUps) || 0),
      0
    );
  }, [retentionData]);

  const pending = useMemo(() => {
    return retentionData.reduce((sum, item) => {
      const total = Number(item.totalFollowUps) || 0;
      const comp = Number(item.completedFollowUps) || 0;
      const noResp = Number(item.noResponseFollowUps) || 0;
      const p = total - comp - noResp;
      return sum + (p > 0 ? p : 0);
    }, 0);
  }, [retentionData]);

  const noResponse = useMemo(() => {
    return retentionData.reduce(
      (sum, item) => sum + (Number(item.noResponseFollowUps) || 0),
      0
    );
  }, [retentionData]);

  const availableStatuses = useMemo(() => {
    const set = new Set();
    retentionData.forEach((item) => {
      if (item.employmentStatus) {
        set.add(item.employmentStatus);
      }
    });
    return ["All Employment Statuses", ...Array.from(set).sort()];
  }, [retentionData]);

  const filteredRetention = useMemo(() => {
    return retentionData.filter((item) => {
      if (employmentStatus === "All Employment Statuses") {
        return true;
      }
      return (
        item.employmentStatus?.toLowerCase() ===
        employmentStatus.toLowerCase()
      );
    });
  }, [retentionData, employmentStatus]);

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

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Follow-up Management
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Follow-up Tracking
        </h1>

        <p className="text-slate-500 mt-2">
          Track trainee follow-ups and employment status responses.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Completed Follow-ups
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {completed}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Pending Follow-ups
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {pending}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                No Response
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {noResponse}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <MessageSquare size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Records */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Follow-up Records
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Retention and follow-up metrics by employment status
              </p>
            </div>

            {/* Employment status filter */}
            <div className="w-full sm:w-64">
              <select
                value={employmentStatus}
                onChange={(event) =>
                  setEmploymentStatus(event.target.value)
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {availableStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item === "All Employment Statuses"
                      ? "All Employment Statuses"
                      : formatEmploymentStatus(item)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-slate-500 mt-4">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredRetention.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {retentionData.length}
            </span>{" "}
            displayed records
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Employment Status
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Total Follow-ups
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Completed
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  No Response
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Response Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRetention.length > 0 ? (
                filteredRetention.map((item, index) => {
                  const total = Number(item.totalFollowUps) || 0;
                  const completedCount = Number(item.completedFollowUps) || 0;
                  const noRespCount = Number(item.noResponseFollowUps) || 0;
                  const rate =
                    total > 0
                      ? Math.round((completedCount / total) * 100)
                      : 0;
                  const formattedStatus = formatEmploymentStatus(
                    item.employmentStatus
                  );

                  return (
                    <tr
                      key={item.employmentStatus || index}
                      className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                            {formattedStatus.charAt(0)}
                          </div>

                          <span className="font-semibold text-slate-800">
                            {formattedStatus}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        {total}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-medium">
                          <CheckCircle2 size={14} />
                          {completedCount}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium">
                          <Clock3 size={14} />
                          {noRespCount}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-800 w-12">
                            {rate}%
                          </span>
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(rate, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No follow-up records match the selected filter.
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
          <ClipboardCheck
            className="text-blue-600 mt-0.5"
            size={20}
          />

          <div>
            <h3 className="font-semibold text-slate-900">
              Backend mapping
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              This module maps directly to the{" "}
              <span className="font-medium text-slate-800">
                follow_ups
              </span>{" "}
              table aggregated by employment status from the{" "}
              <span className="font-medium text-slate-800">
                /dashboard/retention
              </span>{" "}
              endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowUps;