import { useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Search,
} from "lucide-react";

const followUps = [
  {
    id: 1,
    trainee: "Aarav Sharma",
    scheduledAt: "2026-08-15",
    completedAt: "2026-08-16",
    channel: "SMS",
    employmentStatus: "Employed",
    responseStatus: "Completed",
  },
  {
    id: 2,
    trainee: "Priya Patil",
    scheduledAt: "2026-08-18",
    completedAt: "2026-08-18",
    channel: "Email",
    employmentStatus: "Self-employed",
    responseStatus: "Completed",
  },
  {
    id: 3,
    trainee: "Rahul Deshmukh",
    scheduledAt: "2026-08-20",
    completedAt: null,
    channel: "App",
    employmentStatus: "Unemployed",
    responseStatus: "No response",
  },
  {
    id: 4,
    trainee: "Sneha Kulkarni",
    scheduledAt: "2026-08-22",
    completedAt: "2026-08-23",
    channel: "SMS",
    employmentStatus: "Apprenticeship",
    responseStatus: "Completed",
  },
  {
    id: 5,
    trainee: "Rohan Joshi",
    scheduledAt: "2026-08-25",
    completedAt: null,
    channel: "Email",
    employmentStatus: "Unemployed",
    responseStatus: "No response",
  },
  {
    id: 6,
    trainee: "Ananya Patil",
    scheduledAt: "2026-08-28",
    completedAt: "2026-08-28",
    channel: "App",
    employmentStatus: "Employed",
    responseStatus: "Completed",
  },
];

const channels = [
  "All Channels",
  "SMS",
  "Email",
  "App",
];

const employmentStatuses = [
  "All Employment Statuses",
  "Employed",
  "Self-employed",
  "Apprenticeship",
  "Unemployed",
];

const responseStatuses = [
  "All Responses",
  "Completed",
  "No response",
];

function FollowUps() {
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("All Channels");
  const [employmentStatus, setEmploymentStatus] = useState(
    "All Employment Statuses"
  );
  const [responseStatus, setResponseStatus] =
    useState("All Responses");

  const filteredFollowUps = followUps.filter((item) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      item.trainee.toLowerCase().includes(searchValue) ||
      item.channel.toLowerCase().includes(searchValue) ||
      item.employmentStatus.toLowerCase().includes(searchValue);

    const matchesChannel =
      channel === "All Channels" ||
      item.channel === channel;

    const matchesEmploymentStatus =
      employmentStatus === "All Employment Statuses" ||
      item.employmentStatus === employmentStatus;

    const matchesResponseStatus =
      responseStatus === "All Responses" ||
      item.responseStatus === responseStatus;

    return (
      matchesSearch &&
      matchesChannel &&
      matchesEmploymentStatus &&
      matchesResponseStatus
    );
  });

  const completed = followUps.filter(
    (item) => item.responseStatus === "Completed"
  ).length;

  const noResponse = followUps.filter(
    (item) => item.responseStatus === "No response"
  ).length;

  const pending = followUps.filter(
    (item) => !item.completedAt
  ).length;

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
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Follow-up Records
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Scheduled and completed trainee follow-ups
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
                  placeholder="Search trainee..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>

              {/* Channel */}
              <select
                value={channel}
                onChange={(event) =>
                  setChannel(event.target.value)
                }
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {channels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Employment status */}
              <select
                value={employmentStatus}
                onChange={(event) =>
                  setEmploymentStatus(event.target.value)
                }
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {employmentStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Response status */}
              <select
                value={responseStatus}
                onChange={(event) =>
                  setResponseStatus(event.target.value)
                }
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {responseStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredFollowUps.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {followUps.length}
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
                  Scheduled
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Completed
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Channel
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Employment Status
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Response
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredFollowUps.length > 0 ? (
                filteredFollowUps.map((item) => (
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
                      {item.scheduledAt}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {item.completedAt || "Not completed"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium">
                        <MessageSquare size={14} />
                        {item.channel}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        {item.employmentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {item.responseStatus === "Completed" ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-medium">
                          <CheckCircle2 size={14} />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium">
                          <Clock3 size={14} />
                          No response
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No follow-up records match the selected filters.
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
              table: scheduled date, completed date, channel,
              employment status and response status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowUps;