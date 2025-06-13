import React from "react";
import { MessageSquare, MoreHorizontal } from "lucide-react";

export default function DiscussionsTab({
  course = {},                    // never undefined
  isArchived,
  setIsNewDiscussionOpen,         // matches parent handler
  handleDiscussionClick           // matches parent handler
}) {
  const discussions = course.discussions ?? [];  // safe default

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Discussion Forum</h2>
        {!isArchived && (
          <button
            onClick={() => setIsNewDiscussionOpen(true)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            New Discussion
          </button>
        )}
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.length > 0 ? (
          discussions.map((d) => (
            <div
              key={d.id}
              className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleDiscussionClick(d.id)}
            >
              {/* Title & Meta */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img
                      src={d.author.avatar || "/placeholder.jpg"}
                      alt={d.author.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">{d.title}</h3>
                      {d.isPinned && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                          Pinned
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium">{d.author.name}</span>
                      <span>•</span>
                      <span>
                        {d.author.role === "teacher" ? "Teacher" : "Student"}
                      </span>
                      <span>•</span>
                      <span>{d.createdAt}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Content Preview */}
              <div className="mb-2 text-gray-600 line-clamp-2">
                {d.content}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{d.replies?.length || 0} replies</span>
                </div>
                <span>Last activity: {d.lastActivity}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <div className="mb-3 rounded-full bg-gray-100 p-3">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-gray-800">
              No Discussions Yet
            </h3>
            <p className="text-gray-500">
              Be the first to start a discussion in this course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
