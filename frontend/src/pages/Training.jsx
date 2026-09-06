import { useState } from "react";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Search,
  CheckCircle2,
} from "lucide-react";

const providers = [
  {
    id: 1,
    name: "Maharashtra Digital Skills Centre",
    type: "Government",
  },
  {
    id: 2,
    name: "TechPath Training Institute",
    type: "Private",
  },
  {
    id: 3,
    name: "SkillBridge Academy",
    type: "Private",
  },
  {
    id: 4,
    name: "MahaSkill Development Centre",
    type: "Government",
  },
  {
    id: 5,
    name: "FutureTech Academy",
    type: "Private",
  },
  {
    id: 6,
    name: "Digital Maharashtra Institute",
    type: "Government",
  },
  {
    id: 7,
    name: "NextGen Skills Hub",
    type: "Private",
  },
  {
    id: 8,
    name: "CareerReady Institute",
    type: "Private",
  },
  {
    id: 9,
    name: "Maharashtra IT Skills Centre",
    type: "Government",
  },
  {
    id: 10,
    name: "Udyam Skill Development Centre",
    type: "Government",
  },
];

const courses = [
  {
    id: 1,
    name: "Full Stack Web Development",
    category: "IT",
    duration: 24,
    level: "Intermediate",
  },
  {
    id: 2,
    name: "Java Programming",
    category: "IT",
    duration: 16,
    level: "Beginner",
  },
  {
    id: 3,
    name: "React Web Development",
    category: "IT",
    duration: 16,
    level: "Intermediate",
  },
  {
    id: 4,
    name: "Python Development",
    category: "IT",
    duration: 20,
    level: "Intermediate",
  },
  {
    id: 5,
    name: "Data Analytics",
    category: "Data",
    duration: 20,
    level: "Intermediate",
  },
  {
    id: 6,
    name: "Cloud Computing Fundamentals",
    category: "Cloud",
    duration: 16,
    level: "Intermediate",
  },
  {
    id: 7,
    name: "Digital Marketing",
    category: "Marketing",
    duration: 12,
    level: "Beginner",
  },
  {
    id: 8,
    name: "Graphic Design",
    category: "Design",
    duration: 16,
    level: "Beginner",
  },
  {
    id: 9,
    name: "DevOps Engineering",
    category: "IT",
    duration: 24,
    level: "Advanced",
  },
  {
    id: 10,
    name: "Cybersecurity Fundamentals",
    category: "Security",
    duration: 20,
    level: "Intermediate",
  },
  {
    id: 11,
    name: "AWS Cloud Practitioner",
    category: "Cloud",
    duration: 12,
    level: "Beginner",
  },
  {
    id: 12,
    name: "Database Administration",
    category: "IT",
    duration: 16,
    level: "Intermediate",
  },
  {
    id: 13,
    name: "Android Development",
    category: "Mobile",
    duration: 20,
    level: "Intermediate",
  },
  {
    id: 14,
    name: "UI/UX Design",
    category: "Design",
    duration: 16,
    level: "Beginner",
  },
  {
    id: 15,
    name: "Machine Learning Fundamentals",
    category: "AI",
    duration: 24,
    level: "Advanced",
  },
  {
    id: 16,
    name: "Entrepreneurship & Small Business",
    category: "Business",
    duration: 12,
    level: "Beginner",
  },
];

const categories = [
  "All Categories",
  "IT",
  "Data",
  "Cloud",
  "Marketing",
  "Design",
  "Security",
  "Mobile",
  "AI",
  "Business",
];

function Training() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const filteredCourses = courses.filter((course) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      course.name.toLowerCase().includes(searchValue) ||
      course.category.toLowerCase().includes(searchValue) ||
      course.level.toLowerCase().includes(searchValue);

    const matchesCategory =
      category === "All Categories" ||
      course.category === category;

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
                10
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
                16
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
                80%
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
              className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Building2 size={19} />
              </div>

              <h3 className="font-semibold text-slate-900">
                {provider.name}
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                {provider.type}
              </p>
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
                  Duration
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Level
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
                      {course.duration} weeks
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {course.level}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
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