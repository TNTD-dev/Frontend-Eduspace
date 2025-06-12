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
  ChevronRight,
  FileText,
} from "lucide-react";

export default function ResourcesTab({
    course={},
  handleAddResource,
  handleEditResource,
  handleDeleteResource,
}) {
    const resources = course.resources ?? [];
    return (
              <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Course Resources
                  </h2>
                  <button
                    onClick={handleAddResource}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    <span>Add Resource</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {resources?.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {res.title}
                          </h3>
                          <p className="text-sm text-gray-500">{res.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditResource(res.id);
                          }}
                          className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                        >
                          <Edit2 className="h-5 w-5 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResource(res.id);
                          }}
                          className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                        <a
                          href={res.link}
                          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                  ))}

                  {(!resources || resources.length === 0) && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 text-center">
                      <div className="mb-3 rounded-full bg-gray-100 p-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mb-1 text-lg font-medium text-gray-800">
                        No Resources Available
                      </h3>
                      <p className="text-gray-500">
                        There are no resources available for this course yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}