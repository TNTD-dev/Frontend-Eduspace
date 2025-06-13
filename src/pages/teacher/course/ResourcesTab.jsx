import React from "react";
import { FileText, Edit2, Trash2, ExternalLink } from "lucide-react";

export default function ResourcesTab({
  course = {},               // never undefined
  handleAddResource,         // from TeacherCourseDetail
  handleEditResource,        // from TeacherCourseDetail
  handleDeleteResource,      // from TeacherCourseDetail
  handleResourceClick        // optional: to view resource details
}) {
  const resources = course.resources ?? [];  // safe default

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Course Resources</h2>
        <button
          onClick={handleAddResource}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Resource
        </button>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {resources.length > 0 ? (
          resources.map((res) => (
            <div
              key={res.id}
              onClick={() => handleResourceClick?.(res.id)}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{res.title}</h3>
                  <p className="text-sm text-gray-500">{res.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditResource(res.id);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="h-5 w-5 text-gray-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteResource(res.id);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <ExternalLink className="inline-block h-4 w-4 mr-1 text-gray-500" />
                  Open
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <div className="mb-3 rounded-full bg-gray-100 p-3">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-gray-800">
              No Resources Available
            </h3>
            <p className="text-gray-500">
              There are no resources for this course yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
