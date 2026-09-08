import { useState, useEffect, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Award,
  BriefcaseBusiness,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { fetchApi } from "../api";

function readinessColor(pct) {
  if (pct >= 75) return "text-emerald-700";
  if (pct >= 50) return "text-amber-700";
  return "text-red-700";
}

function readinessBar(pct) {
  if (pct >= 75) return "from-emerald-500 to-green-600";
  if (pct >= 50) return "from-amber-500 to-orange-500";
  return "from-red-500 to-rose-600";
}

function SkillGapCalculator() {
  const [roles, setRoles] = useState([]);
  const [overview, setOverview] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [traineeSearch, setTraineeSearch] = useState("");
  const [selectedTraineeId, setSelectedTraineeId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [result, setResult] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingResult, setLoadingResult] = useState(false);
  const [error, setError] = useState(null);
  const [resultError, setResultError] = useState(null);
  const [gapSearch, setGapSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [coreOnly, setCoreOnly] = useState(false);

  // Initial load: roles + overview + leaderboard.
  useEffect(() => {
    let isMounted = true;

    async function loadInit() {
      try {
        setLoadingInit(true);
        setError(null);
        const [rolesData, overviewData, leaderboardData] = await Promise.all([
          fetchApi("/skill-gaps/roles"),
          fetchApi("/skill-gaps/overview"),
          fetchApi("/skill-gaps/leaderboard?limit=10"),
        ]);
        if (isMounted) {
          setRoles(Array.isArray(rolesData) ? rolesData : []);
          setOverview(overviewData || null);
          const board = Array.isArray(leaderboardData) ? leaderboardData : [];
          setLeaderboard(board);
          // Preselect the top-ranked trainee so the calculator
          // shows a meaningful gap immediately.
          if (board.length > 0) {
            setSelectedTraineeId(String(board[0].traineeId));
            setSelectedRoleId(String(board[0].roleId));
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load data");
      } finally {
        if (isMounted) {
          setLoadingInit(false);
          setLoadingLeaderboard(false);
        }
      }
    }

    loadInit();
    return () => {
      isMounted = false;
    };
  }, []);

  // Leaderboard: top 10 trainees ranked by readiness for the
  // currently selected role (refetches on search or role change).
  useEffect(() => {
    if (loadingInit) return;

    const handle = setTimeout(async () => {
      try {
        setLoadingLeaderboard(true);
        const query = traineeSearch.trim();
        const params = new URLSearchParams({ limit: "10" });
        if (query) params.set("search", query);
        if (selectedRoleId) params.set("roleId", selectedRoleId);
        const data = await fetchApi(`/skill-gaps/leaderboard?${params}`);
        setLeaderboard(Array.isArray(data) ? data : []);
      } catch {
        // Keep existing rows; search failure is non-fatal.
      } finally {
        setLoadingLeaderboard(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [traineeSearch, selectedRoleId, loadingInit]);

  // Auto-calculate whenever the trainee or role changes.
  // Role is optional: without it the backend falls back to the
  // trainee's assigned target role.
  useEffect(() => {
    if (!selectedTraineeId) {
      return;
    }

    let isMounted = true;
    async function calculate() {
      try {
        setLoadingResult(true);
        setResultError(null);
        const params = new URLSearchParams({ traineeId: selectedTraineeId });
        if (selectedRoleId) params.set("roleId", selectedRoleId);
        const data = await fetchApi(`/skill-gaps/calculate?${params}`);
        if (isMounted) setResult(data);
      } catch (err) {
        if (isMounted) {
          setResult(null);
          setResultError(err.message || "Failed to calculate skill gap");
        }
      } finally {
        if (isMounted) setLoadingResult(false);
      }
    }

    calculate();
    return () => {
      isMounted = false;
    };
  }, [selectedTraineeId, selectedRoleId]);

  const selectedEntry = useMemo(
    () =>
      leaderboard.find(
        (entry) => String(entry.traineeId) === String(selectedTraineeId)
      ),
    [leaderboard, selectedTraineeId]
  );

  const selectedRoleName = useMemo(
    () =>
      roles.find((role) => String(role.id) === String(selectedRoleId))?.name ||
      result?.role?.name ||
      null,
    [roles, selectedRoleId, result]
  );

  function handleSelectEntry(entry) {
    setSelectedTraineeId(String(entry.traineeId));
    setSelectedRoleId(String(entry.roleId));
  }

  const filteredGaps = useMemo(() => {
    if (!result?.gaps) return [];
    const q = gapSearch.toLowerCase().trim();
    return result.gaps.filter((gap) => {
      const matchesSearch =
        !q ||
        (gap.skillName || "").toLowerCase().includes(q) ||
        (gap.requiredProficiency || "").toLowerCase().includes(q) ||
        (gap.traineeProficiency || "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Has" && gap.skillStatus === "has") ||
        (statusFilter === "Missing" && gap.skillStatus === "missing");
      const matchesCore = !coreOnly || gap.isCore;
      return matchesSearch && matchesStatus && matchesCore;
    });
  }, [result, gapSearch, statusFilter, coreOnly]);

  const avgReadiness = useMemo(() => {
    const rows = overview?.readinessByRole || [];
    if (rows.length === 0) return 0;
    const total = rows.reduce((sum, r) => sum + (r.readinessPct || 0), 0);
    return Math.round(total / rows.length);
  }, [overview]);

  if (loadingInit) {
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

  const summary = result?.summary;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">Skill Gap Analysis</p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Skill Gap Calculator
        </h1>
        <p className="text-slate-500 mt-2">
          Compare a trainee&apos;s skills against a target role to see what
          they have and what&apos;s missing.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Target Roles</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {overview?.totalRoles ?? roles.length}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BriefcaseBusiness size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg. Readiness</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {avgReadiness}%
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Calculator + result in one card */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Calculate a gap</h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter a trainee ID and pick a target role — or select a trainee
          from the leaderboard below. Readiness updates automatically.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          <div>
            <label
              htmlFor="gap-trainee-id"
              className="block text-sm font-medium text-slate-600 mb-2"
            >
              Trainee ID
            </label>
            <input
              id="gap-trainee-id"
              inputMode="numeric"
              value={selectedTraineeId}
              onChange={(e) => {
                const next = e.target.value.replace(/[^0-9]/g, "");
                setSelectedTraineeId(next);
                if (!next) {
                  setResult(null);
                  setResultError(null);
                }
              }}
              placeholder="e.g. 1"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
            />
            {selectedEntry ? (
              <p className="text-xs text-slate-500 mt-2">
                Selected trainee:{" "}
                <span className="font-semibold text-slate-700">
                  #{selectedEntry.traineeId} {selectedEntry.traineeName}
                </span>
              </p>
            ) : selectedTraineeId ? (
              <p className="text-xs text-slate-500 mt-2">
                Selected trainee:{" "}
                <span className="font-semibold text-slate-700">
                  #{selectedTraineeId}
                </span>{" "}
                — manual lookup (not in the top 10 below).
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="gap-role"
              className="block text-sm font-medium text-slate-600 mb-2"
            >
              Target role
            </label>
            <select
              id="gap-role"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
            >
              <option value="">Select a role...</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} ({role.requiredCount} skills)
                </option>
              ))}
            </select>
            {result?.role && (
              <p className="text-xs text-slate-500 mt-2">
                {result.role.category || "General"}
                {result.role.targetLevel
                  ? ` · Target level: ${result.role.targetLevel}`
                  : ""}
                {!result.role.isTargetRole && " · Ad-hoc comparison"}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-blue-100 mt-6 pt-6">
          {loadingResult ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : resultError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
              <p className="font-semibold">Could not calculate gap</p>
              <p className="text-sm mt-1">{resultError}</p>
            </div>
          ) : result && summary ? (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    {result.trainee.name} → {result.role.name}
                  </p>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {summary.hasCount} of {summary.totalRequired} skills covered
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {summary.missingCount} missing · {summary.coreMissing} core
                    missing
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Overall</p>
                    <p
                      className={`text-2xl font-bold ${readinessColor(
                        summary.readinessPct
                      )}`}
                    >
                      {summary.readinessPct}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Core skills</p>
                    <p
                      className={`text-2xl font-bold ${readinessColor(
                        summary.coreReadinessPct
                      )}`}
                    >
                      {summary.coreReadinessPct}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r rounded-full transition-all ${readinessBar(
                      summary.readinessPct
                    )}`}
                    style={{ width: `${summary.readinessPct}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    {summary.hasCount} have
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <XCircle size={14} className="text-red-500" />
                    {summary.missingCount} missing
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Award size={14} className="text-amber-600" />
                    {summary.coreHas}/{summary.coreTotal} core covered
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">
              Enter a trainee ID and pick a role — or select a trainee from
              the leaderboard — to see readiness here.
            </p>
          )}
        </div>
      </div>

      {/* Trainee readiness leaderboard */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Trophy size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Trainee Readiness Leaderboard
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedRoleName ? (
                    <>
                      Top 10 trainees most ready for{" "}
                      <span className="font-semibold text-slate-700">
                        {selectedRoleName}
                      </span>{" "}
                      — select a row to inspect the gap.
                    </>
                  ) : (
                    "Top 10 by readiness for assigned target roles — select a role to rank trainees for it."
                  )}
                </p>
              </div>
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={traineeSearch}
                onChange={(e) => setTraineeSearch(e.target.value)}
                placeholder="Search trainees..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loadingLeaderboard ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : leaderboard.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">
                    Rank
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">
                    Trainee
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">
                    Target Role
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">
                    Readiness
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">
                    Skills
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => {
                  const isSelected =
                    String(entry.traineeId) === String(selectedTraineeId) &&
                    String(entry.roleId) === String(selectedRoleId);
                  return (
                    <tr
                      key={`${entry.traineeId}-${entry.roleId}`}
                      onClick={() => handleSelectEntry(entry)}
                      className={`border-b border-slate-100 last:border-0 transition cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/70 hover:bg-blue-50"
                          : "hover:bg-blue-50/40"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold">
                          {entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">
                          #{entry.traineeId} {entry.traineeName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {entry.roleName}
                        <span className="text-slate-400">
                          {" "}
                          · {entry.targetLevel || "Entry-level"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-36">
                          <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r rounded-full ${readinessBar(
                                entry.readinessPct
                              )}`}
                              style={{ width: `${entry.readinessPct}%` }}
                            />
                          </div>
                          <span
                            className={`text-xs font-bold ${readinessColor(
                              entry.readinessPct
                            )}`}
                          >
                            {entry.readinessPct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                        {entry.hasCount}/{entry.totalRequired} ·{" "}
                        {entry.missingCount} missing
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-12 text-center text-slate-500">
              No trainees found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* Result */}
      {loadingResult || resultError || !(result && summary) ? null : (
        <div className="space-y-6">

          {/* Gaps table */}
          <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-blue-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Required skills breakdown
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Showing{" "}
                    <span className="font-semibold text-slate-800">
                      {filteredGaps.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-800">
                      {result.gaps.length}
                    </span>{" "}
                    required skills
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={gapSearch}
                      onChange={(e) => setGapSearch(e.target.value)}
                      placeholder="Search required skills..."
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
                  >
                    <option value="All">All statuses</option>
                    <option value="Missing">Missing only</option>
                    <option value="Has">Has only</option>
                  </select>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={coreOnly}
                      onChange={(e) => setCoreOnly(e.target.checked)}
                      className="accent-blue-600"
                    />
                    Core only
                  </label>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">
                      Skill
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">
                      Required
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">
                      Trainee level
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">
                      Priority
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGaps.length > 0 ? (
                    filteredGaps.map((gap) => (
                      <tr
                        key={gap.skillId}
                        className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {gap.skillName}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {gap.requiredProficiency || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {gap.traineeProficiency || "—"}
                        </td>
                        <td className="px-6 py-4">
                          {gap.isCore ? (
                            <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-medium">
                              Core
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-medium">
                              Optional
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {gap.skillStatus === "has" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                              <CheckCircle2 size={14} />
                              Has
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium">
                              <XCircle size={14} />
                              Missing
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No skills match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Role insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Most missing skills</h2>
          <p className="text-sm text-slate-500 mt-1">
            Required skills trainees lack most often
          </p>
          <div className="mt-4 space-y-3">
            {(overview?.mostMissingSkills || []).length > 0 ? (
              overview.mostMissingSkills.map((item) => (
                <div
                  key={item.skillName}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
                >
                  <span className="font-medium text-slate-800">
                    {item.skillName}
                  </span>
                  <span className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg whitespace-nowrap">
                    {item.missingCount} missing
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No data available.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Readiness by role</h2>
          <p className="text-sm text-slate-500 mt-1">
            Share of required skills trainees already have
          </p>
          <div className="mt-4 space-y-4">
            {(overview?.readinessByRole || []).length > 0 ? (
              overview.readinessByRole.map((row) => (
                <div key={row.roleId}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-800">
                      {row.roleName}
                      <span className="text-slate-400 font-normal">
                        {" "}
                        · {row.trainees} trainees
                      </span>
                    </span>
                    <span className="font-semibold text-slate-700">
                      {row.readinessPct}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full bg-gradient-to-r rounded-full ${readinessBar(
                        row.readinessPct
                      )}`}
                      style={{ width: `${row.readinessPct}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillGapCalculator;
