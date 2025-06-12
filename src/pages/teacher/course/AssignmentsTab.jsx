import React from "react";
import {
  BookOpen,
  Play,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight
} from "lucide-react";

export default function AssignmentsTab({
  course = {},
  handleAddAssignment,
  handleAssignmentClick,
  handleDeleteAssignment
}) {
    const assignments = course.assignments ?? [];
    return (
              <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Assignments
                  </h2>
                  <button
                    onClick={handleAddAssignment}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    <span>Add Assignment</span>
                  </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f4f9fc]">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Assignment
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Due Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {assignments?.map((assign) => (
                        <tr
                          key={assign.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() =>
                            handleAssignmentClick(assign.id, "view")
                          }
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assign.title}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {assign.dueDate}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
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
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignmentClick(assign.id, "edit");
                                }}
                                className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                              >
                                <Edit2 className="h-5 w-5 text-gray-500" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAssignment(assign.id);
                                }}
                                className="rounded-full p-1 hover:bg-gray-200 transition-colors"
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
              </div>
  );
}
