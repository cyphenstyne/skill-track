import { useState, useEffect } from "react";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Search,
  CheckCircle2,
} from "lucide-react";
import { fetchApi } from "../api";

function Training() {
  const [providers, setProviders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [providersData, coursesData] = await Promise.all([
          fetchApi("/dashboard/providers"),
          fetchApi("/dashboard/courses"),
        ]);
        if (isMounted) {
          setProviders(providersData);
          setCourses(coursesData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load training data");
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

  const totalEnrolled = courses.reduce((sum, c) => sum + (c.enrolled || 0), 0);
  const totalCompleted = courses.reduce((sum, c) => sum + (c.completed || 0), 0);
  const completionPercentage =
    totalEnrolled > 0
      ? `${Math.round((totalCompleted / totalEnrolled) * 100)}%`
      : "0%";

  const uniqueCategories = Array.from(
    new Set(courses.map((c) => c.category).filter(Boolean))
  ).sort();

  const categories = ["All Categories", ...uniqueCategories];

  const filteredCourses = courses.filter((course) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      (course.name || "").toLowerCase().includes(searchValue) ||
      (course.category || "").toLowerCase().includes(searchValue) ||
      (course.level || "").toLowerCase().includes(searchValue) ||
      (course.providerName || "").toLowerCase().includes(searchValue);

    const matchesCategory =
      category === "All Categories" || course.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Training Management
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Training
        </h1>

        <p className="text-slate-500 mt-2">
          Monitor training providers, courses and training outcomes.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Training Providers
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {providers.length}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Courses
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {courses.length}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Training Completion
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {completionPercentage}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Providers */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="text-blue-600" size={22} />

          <h2 className="text-lg font-bold text-slate-900">
            Training Providers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Building2 size={19} />
                </div>

                <h3 className="font-semibold text-slate-900">
                  {provider.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {provider.providerType}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
                <span>{provider.courses} {provider.courses === 1 ? "course" : "courses"}</span>
                <span>{provider.trainees} {provider.trainees === 1 ? "trainee" : "trainees"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Courses
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Courses available through registered training providers
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full sm:w-48 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredCourses.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {courses.length}
            </span>{" "}
            courses
          </div>
        </div>

        {/* Course table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Course
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Category
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Provider
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Level
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Enrolled
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Completed
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  In Progress
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Dropped
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <BookOpen size={17} />
                        </div>

                        <span className="font-semibold text-slate-800">
                          {course.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium">
                        {course.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {course.providerName}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {course.level}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {course.enrolled ?? 0}
                    </td>

                    <td className="px-6 py-4 font-medium text-emerald-600">
                      {course.completed ?? 0}
                    </td>

                    <td className="px-6 py-4 font-medium text-blue-600">
                      {course.inProgress ?? 0}
                    </td>

                    <td className="px-6 py-4 font-medium text-rose-500">
                      {course.dropped ?? 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No courses found matching your search or category.
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
          <GraduationCap
            className="text-blue-600 mt-0.5"
            size={20}
          />

          <div>
            <h3 className="font-semibold text-slate-900">
              Backend mapping
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              Provider information comes from{" "}
              <span className="font-medium text-slate-800">
                training_providers
              </span>
              , while course information maps to{" "}
              <span className="font-medium text-slate-800">
                courses
              </span>{" "}
              and its provider relationship.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Training;