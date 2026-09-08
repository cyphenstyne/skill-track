import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Eye, CheckCircle2, XCircle } from "lucide-react";
import { fetchApi } from "../api";
import Pagination from "../components/Pagination";
import { paginate, PAGE_SIZE } from "../utils/pagination";

function Trainees() {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All Districts");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function loadTrainees() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchApi("/trainees");
        if (isMounted) {
          setTrainees(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "An error occurred while fetching trainees.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTrainees();

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

  const uniqueDistricts = Array.from(
    new Set(trainees.map((item) => item.district).filter(Boolean))
  ).sort();

  const districts = ["All Districts", ...uniqueDistricts];

  const filteredTrainees = trainees.filter((trainee) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      (trainee.name || "").toLowerCase().includes(searchValue) ||
      (trainee.qualification || "").toLowerCase().includes(searchValue);

    const matchesDistrict =
      district === "All Districts" || trainee.district === district;

    return matchesSearch && matchesDistrict;
  });

  // Client-side pagination: backend GET /trainees returns the full list
  // (no server pagination), so slice here. Reset to page 1 on filter change.
  const { items: pagedTrainees, totalPages } = paginate(filteredTrainees, page, PAGE_SIZE);

  const consentGranted = trainees.filter(
    (trainee) => trainee.consentStatus ?? trainee.consent
  ).length;
  const consentNotGranted = trainees.length - consentGranted;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Trainee Management
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Trainees
        </h1>

        <p className="text-slate-500 mt-2">
          View and track registered trainees and their basic information.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Registered
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {trainees.length}
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
                Consent Given
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {consentGranted}
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
                Consent Not Given
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {consentNotGranted}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-blue-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
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
                placeholder="Search by name or qualification..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>

            {/* District */}
            <select
              value={district}
              onChange={(event) => {
                setDistrict(event.target.value);
                setPage(1);
              }}
              className="md:w-56 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
            >
              {districts.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Result count */}
          <div className="mt-4 text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredTrainees.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {trainees.length}
            </span>{" "}
            displayed trainees
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
                  Qualification
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  District
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Consent
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {pagedTrainees.length > 0 ? (
                pagedTrainees.map((trainee) => (
                  <tr
                    key={trainee.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                          {trainee.name ? trainee.name.charAt(0) : "T"}
                        </div>

                        <span className="font-semibold text-slate-800">
                          {trainee.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {trainee.qualification}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {trainee.district || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {(trainee.consentStatus ?? trainee.consent) ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-medium">
                          <CheckCircle2 size={14} />
                          Granted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium">
                          <XCircle size={14} />
                          Not granted
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/trainees/${trainee.id}`)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No trainees found matching your search or district.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filteredTrainees.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default Trainees;