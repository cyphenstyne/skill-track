import { useState, useEffect, useMemo } from "react";
import {
  BriefcaseBusiness,
  Search,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { fetchApi } from "../api";
import Pagination from "../components/Pagination";
import { paginate, PAGE_SIZE } from "../utils/pagination";

function Employment() {
  const [employmentData, setEmploymentData] = useState([]);
  const [wagesData, setWagesData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [traineesData, setTraineesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All Roles");
  const [district, setDistrict] = useState("All Districts");
  const [growth, setGrowth] = useState("All Growth");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [employmentRes, wagesRes, summaryRes, traineesRes] =
          await Promise.all([
            fetchApi("/dashboard/employment"),
            fetchApi("/dashboard/wages"),
            fetchApi("/dashboard/summary"),
            fetchApi("/trainees"),
          ]);

        if (isMounted) {
          setEmploymentData(employmentRes || []);
          setWagesData(wagesRes || []);
          setSummaryData(summaryRes || null);
          setTraineesData(traineesRes || []);
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

  // Summary card counts from /dashboard/employment
  const employmentCount =
    employmentData.find(
      (item) => item.employmentType?.toLowerCase() === "employment"
    )?.count || 0;

  const selfEmploymentCount =
    employmentData.find(
      (item) => item.employmentType?.toLowerCase() === "self-employment"
    )?.count || 0;

  const apprenticeshipCount =
    employmentData.find(
      (item) => item.employmentType?.toLowerCase() === "apprenticeship"
    )?.count || 0;

  // Compute salary progression metrics from /dashboard/wages
  const { avgStartingSalary, avgCurrentSalary, salaryProgression } =
    useMemo(() => {
      let totalStart = 0;
      let totalCurr = 0;
      let count = 0;

      for (const item of wagesData) {
        const recs = item.records;
        if (Array.isArray(recs) && recs.length > 0) {
          const start = recs[0]?.salaryAmount;
          const curr = recs[recs.length - 1]?.salaryAmount;
          if (typeof start === "number" && typeof curr === "number") {
            totalStart += start;
            totalCurr += curr;
            count++;
          }
        }
      }

      const starting = count > 0 ? Math.round(totalStart / count) : 0;
      const current = count > 0 ? Math.round(totalCurr / count) : 0;
      const progression =
        starting > 0
          ? Number((((current - starting) / starting) * 100).toFixed(1))
          : 0;

      return {
        avgStartingSalary: starting,
        avgCurrentSalary: current,
        salaryProgression: progression,
      };
    }, [wagesData]);

  // Lookup map for trainees by ID
  const traineeMap = useMemo(() => {
    const map = new Map();
    for (const t of traineesData) {
      map.set(t.id, t);
    }
    return map;
  }, [traineesData]);

  // Merge wages data with trainee info for the table
  const wageRecords = useMemo(() => {
    return wagesData.map((item, index) => {
      const trainee = traineeMap.get(item.traineeId);
      const recs = item.records || [];
      const startingSalary = recs[0]?.salaryAmount || 0;
      const currentSalary =
        recs[recs.length - 1]?.salaryAmount || startingSalary;
      const change =
        startingSalary > 0
          ? Number(
              (((currentSalary - startingSalary) / startingSalary) * 100).toFixed(
                1
              )
            )
          : 0;

      return {
        id: item.employmentId || `${item.traineeId}-${index}`,
        traineeId: item.traineeId,
        trainee: trainee?.name || `Trainee #${item.traineeId}`,
        qualification: trainee?.qualification || "",
        district: trainee?.district || "Unknown",
        role: item.role || "Trainee",
        startingSalary,
        currentSalary,
        changePercent: change,
      };
    });
  }, [wagesData, traineeMap]);

  // Dynamic filter lists
  const availableRoles = useMemo(() => {
    const set = new Set();
    wageRecords.forEach((r) => {
      if (r.role) set.add(r.role);
    });
    return ["All Roles", ...Array.from(set).sort()];
  }, [wageRecords]);

  const availableDistricts = useMemo(() => {
    const set = new Set();
    wageRecords.forEach((r) => {
      if (r.district && r.district !== "Unknown") set.add(r.district);
    });
    return ["All Districts", ...Array.from(set).sort()];
  }, [wageRecords]);

  const growthOptions = ["All Growth", "Positive Growth", "No Change"];

  // Filtered records
  const filteredRecords = useMemo(() => {
    return wageRecords.filter((record) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        record.trainee.toLowerCase().includes(searchValue) ||
        record.role.toLowerCase().includes(searchValue) ||
        record.district.toLowerCase().includes(searchValue);

      const matchesRole =
        role === "All Roles" || record.role === role;

      const matchesDistrict =
        district === "All Districts" || record.district === district;

      const matchesGrowth =
        growth === "All Growth" ||
        (growth === "Positive Growth" && record.changePercent > 0) ||
        (growth === "No Change" && record.changePercent <= 0);

      return matchesSearch && matchesRole && matchesDistrict && matchesGrowth;
    });
  }, [wageRecords, search, role, district, growth]);

  // Client-side pagination: GET /dashboard/wages returns all employment
  // records at once (backend has no server pagination), so slice here.
  const { items: pagedRecords, totalPages } = paginate(filteredRecords, page, PAGE_SIZE);

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
            {employmentCount.toLocaleString("en-IN")}
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
            {selfEmploymentCount.toLocaleString("en-IN")}
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
            {apprenticeshipCount.toLocaleString("en-IN")}
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
                {salaryProgression >= 0
                  ? `+${salaryProgression}%`
                  : `${salaryProgression}%`}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Avg: ₹{summaryData?.averageSalary ? Math.round(summaryData.averageSalary).toLocaleString("en-IN") : "0"}
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
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search trainee, role, district..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>

              {/* Role */}
              <select
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {availableRoles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* District */}
              <select
                value={district}
                onChange={(event) => {
                  setDistrict(event.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {availableDistricts.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Growth */}
              <select
                value={growth}
                onChange={(event) => {
                  setGrowth(event.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {growthOptions.map((item) => (
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
                {wageRecords.length}
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
                  Role
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  District
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Starting Salary
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Current Salary
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Salary Growth
                </th>
              </tr>
            </thead>

            <tbody>
              {pagedRecords.length > 0 ? (
                pagedRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                          {record.trainee.charAt(0)}
                        </div>

                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {record.trainee}
                          </span>
                          {record.qualification && (
                            <span className="text-xs text-slate-400">
                              {record.qualification}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium">
                        <BriefcaseBusiness size={14} />
                        {record.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {record.district}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700">
                      ₹{record.startingSalary.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800">
                      ₹{record.currentSalary.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${
                          record.changePercent > 0
                            ? "bg-green-50 text-green-700"
                            : record.changePercent === 0
                            ? "bg-slate-100 text-slate-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <TrendingUp size={14} />
                        {record.changePercent >= 0
                          ? `+${record.changePercent}%`
                          : `${record.changePercent}%`}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No employment records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filteredRecords.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
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
              ₹{avgStartingSalary.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">
              Average Six-Month Salary
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              ₹{avgCurrentSalary.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">
              Average Increase
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              {salaryProgression >= 0
                ? `+${salaryProgression}%`
                : `${salaryProgression}%`}
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