import React, { useState } from "react";
import {
  Users,
  Star,
  Clock,
  TrendingUp,
  Trash2
} from "lucide-react";

export default function StudentsTab({
  topTen = [],                  // ← default to array, not {}
  students = [],                // ← also safe-default students
  inviteCode,
  onRemove,
  setShowInviteModal           // ← your prop for showing the modal
}) {
  const [emailInput, setEmailInput] = useState("");

  return (
    <div className="grid gap-6 lg:grid-cols-3 h-full">
      {/* Left column: Top 10 + Overview */}
      <div className="col-span-1 flex flex-col space-y-6 h-full">
        {/* Top 10 */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Top 10 Students
            </h2>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Rank
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {topTen.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                      {s.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                      {s.score}
                    </td>
                  </tr>
                ))}
                {topTen.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No students enrolled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Class Overview */}
        <div className="rounded-lg border bg-white p-6 shadow-sm flex-1 flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-md font-semibold text-[#303345]">
                Engagement Summary
              </h3>
              <p className="text-sm text-[#9ca3af]">
                Live stats from your classroom
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-[#303345]">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Total Students</span>
              </div>
              <span>{students.length}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Most Active</span>
              </div>
              <span>{topTen[0]?.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Lessons this week</span>
              </div>
              <span>—</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Avg. Progress</span>
              </div>
              <span>—%</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: "0%" }}
              />
            </div>
            <p className="text-xs text-right mt-1 text-[#6b7280]">
              Progress rate
            </p>
          </div>
        </div>
      </div>

      {/* Enrolled Students */}
      <div className="col-span-2 flex flex-col h-full">
        <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Enrolled Students
            </h2>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Invite Student
            </button>
          </div>

          <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f4f9fc]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Email
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {s.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{s.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to remove this student?"
                            )
                          ) {
                            onRemove(s.id);
                          }
                        }}
                        className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No students enrolled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
