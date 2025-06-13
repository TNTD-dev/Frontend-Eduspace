import React, { useState } from "react";
import { Users, Star, Clock, TrendingUp, Trash2 } from "lucide-react";

export default function StudentsTab({
  topTen = [],
  students = [],
  inviteCode = "",
  onRemove,
  showInviteModal,
  setShowInviteModal
}) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3 h-full">
        {/* Left: Top 10 & Overview */}
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
                    {["Rank","Name","Score"].map(col => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {topTen.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">{idx+1}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">{s.name}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">{s.score}</td>
                    </tr>
                  ))}
                  {topTen.length===0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">
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
              {[
                { icon: Users, label: "Total Students", value: students.length },
                { icon: Star, label: "Most Active", value: topTen[0]?.name||"—" },
                { icon: Clock, label: "Lessons this week", value: "—" },
                { icon: TrendingUp, label: "Avg. Progress", value: "—%" }
              ].map(({icon:Icon,label,value})=>(
                <div key={label} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Enrolled Students */}
        <div className="col-span-2 flex flex-col h-full">
          <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Enrolled Students
              </h2>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Invite Student
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f4f9fc]">
                  <tr>
                    {["Name","Email","Actions"].map((h,i)=>(
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {s.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {s.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => onRemove(s.id)}
                          className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.length===0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
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

      {/* InviteStudentModal */}
      {showInviteModal && <InviteStudentModal inviteCode={inviteCode} onClose={()=>setShowInviteModal(false)} />}
    </>
  );
}

// Move this into StudentsTab.jsx
function InviteStudentModal({ inviteCode, onClose }) {
  const [email, setEmail] = useState("");

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    alert("Copied!");
  };

  const sendInvite = () => {
    alert(`Invite sent to ${email}!`);
    setEmail("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e=>e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">Invite Students</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Class Code</label>
          <div className="mt-1 flex">
            <input readOnly value={inviteCode} className="flex-1 rounded-l-md border border-gray-300 p-2 text-sm" />
            <button onClick={copyCode} className="rounded-r-md bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">
              Copy
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Invite by Email</label>
          <div className="mt-1 flex">
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              className="flex-1 rounded-l-md border border-gray-300 p-2 text-sm"
            />
            <button onClick={sendInvite} className="rounded-r-md bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700">
              Send
            </button>
          </div>
        </div>
        <button onClick={onClose} className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
          Close
        </button>
      </div>
    </div>
  );
}
