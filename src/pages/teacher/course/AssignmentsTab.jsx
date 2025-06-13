import React from "react";
import { Edit2, Trash2 } from "lucide-react";   // ← only the icons we actually use

export default function AssignmentsTab({
  course = {},                                // ← default so course never undefined
  handleAddAssignment,                        // ← matches parent prop
  handleAssignmentClick,                      // ← matches parent prop
  handleDeleteAssignment                      // ← matches parent prop
}) {
  const assignments = course.assignments ?? []; // ← safe default array

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Assignments</h2>
        <button
          onClick={handleAddAssignment}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Assignment
        </button>
      </div>

      {/* Table or empty state */}
      {assignments.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f4f9fc]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {assignments.map((assign) => (
                <tr
                  key={assign.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAssignmentClick(assign.id, "view")}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assign.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assign.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        assign.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : assign.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {assign.status === "completed"
                        ? "Completed"
                        : assign.status === "in-progress"
                        ? "In Progress"
                        : "To Do"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignmentClick(assign.id, "edit");
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 className="h-5 w-5 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAssignment(assign.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500">
          No assignments yet.
        </div>
      )}
    </div>
  );
}
