import { useState, useEffect, useMemo } from "react";
import {
  Award,
  Search,
  Users,
  TrendingUp,
} from "lucide-react";
import { fetchApi } from "../api";

function getCommonProficiency(skill) {
  const beginner = skill.beginnerCount || 0;
  const intermediate = skill.intermediateCount || 0;
  const advanced = skill.advancedCount || 0;

  if (beginner === 0 && intermediate === 0 && advanced === 0) {
    return "N/A";
  }

  if (advanced > intermediate && advanced > beginner) {
    return "Advanced";
  }
  if (intermediate >= beginner && intermediate >= advanced) {
    return "Intermediate";
  }
  if (beginner >= intermediate && beginner >= advanced) {
    return "Beginner";
  }
  return "Intermediate";
}

function Skills() {
  const [skills, setSkills] = useState([]);
  const [summary, setSummary] = useState(null);
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

        const [skillGapsData, summaryData] = await Promise.all([
          fetchApi("/dashboard/skill-gaps"),
          fetchApi("/dashboard/summary"),
        ]);

        if (isMounted) {
          setSkills(Array.isArray(skillGapsData) ? skillGapsData : []);
          setSummary(summaryData || {});
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

  const mostCommonSkill = useMemo(() => {
    if (!skills || skills.length === 0) return "N/A";
    const topSkill = skills.reduce((prev, curr) => {
      const currCount = curr.traineeCount || 0;
      const prevCount = prev.traineeCount || 0;
      return currCount > prevCount ? curr : prev;
    }, skills[0]);
    return topSkill?.name || "N/A";
  }, [skills]);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(skills.map((s) => s.category).filter(Boolean))
    ).sort();
    return ["All Categories", ...unique];
  }, [skills]);

  const totalTrainees = summary?.totalTrainees || 0;

  const processedSkills = useMemo(() => {
    return skills.map((skill) => {
      const proficiency = getCommonProficiency(skill);
      const coverage =
        totalTrainees > 0
          ? Number(((skill.traineeCount / totalTrainees) * 100).toFixed(1))
          : 0;

      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        trainees: skill.traineeCount ?? 0,
        traineeCount: skill.traineeCount ?? 0,
        proficiency,
        coverage,
      };
    });
  }, [skills, totalTrainees]);

  const filteredSkills = useMemo(() => {
    return processedSkills.filter((skill) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        (skill.name || "").toLowerCase().includes(searchValue) ||
        (skill.category || "").toLowerCase().includes(searchValue) ||
        (skill.proficiency || "").toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All Categories" ||
        skill.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [processedSkills, search, category]);

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
          Skill Tracking
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Skills
        </h1>

        <p className="text-slate-500 mt-2">
          Track trainee skills, proficiency levels and skill coverage.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Skills in System
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {skills.length}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Trainees with Skills
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {totalTrainees}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Most Common Skill
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {mostCommonSkill}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Skills table */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Skill Registry
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Skills recorded for trainees
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
                  placeholder="Search skills..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full sm:w-52 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
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
              {filteredSkills.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {skills.length}
            </span>{" "}
            displayed skills
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Skill
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Category
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Trainees
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Common Proficiency
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Skill Coverage
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => (
                  <tr
                    key={skill.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Award size={17} />
                        </div>

                        <span className="font-semibold text-slate-800">
                          {skill.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium">
                        {skill.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {skill.trainees}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        {skill.proficiency}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-36">
                        <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                            style={{
                              width: `${Math.min(skill.coverage, 100)}%`,
                            }}
                          />
                        </div>

                        <span className="text-xs font-semibold text-slate-600">
                          {skill.coverage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No skills found matching your search or category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Skills;