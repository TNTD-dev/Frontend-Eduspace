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
  MessageSquare,
} from "lucide-react";

export default function DiscussionsTab({
  course = {},
  isArchived,
  setIsNewDiscussionOpen,
  handleDiscussionClick,
}) {
    const discussions = course.discussions ?? [];
    return (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Discussion Forum
                  </h2>
                  {!isArchived && (
                    <button
                      onClick={() => setIsNewDiscussionOpen(true)}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                    >
                      New Discussion
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {discussions?.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleDiscussionClick(discussion.id)}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full">
                            <img
                              src={
                                discussion.author.avatar || "/placeholder.jpg"
                              }
                              alt={discussion.author.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-800">
                                {discussion.title}
                              </h3>
                              {discussion.isPinned && (
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                                  Pinned
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-medium">
                                {discussion.author.name}
                              </span>
                              <span>•</span>
                              <span>
                                {discussion.author.role === "teacher"
                                  ? "Teacher"
                                  : "Student"}
                              </span>
                              <span>•</span>
                              <span>{discussion.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="rounded-full p-1 hover:bg-gray-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="mb-2 text-gray-600 line-clamp-2">
                        {discussion.content}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MessageSquare className="h-4 w-4" />
                            <span>{discussion.replies?.length || 0} replies</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          Last activity: {discussion.lastActivity}
                        </span>
                      </div>
                    </div>
                  ))}

                  {(!discussions || discussions.length === 0) && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 text-center">
                      <div className="mb-3 rounded-full bg-gray-100 p-3">
                        <MessageSquare className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mb-1 text-lg font-medium text-gray-800">
                        No Discussions Yet
                      </h3>
                      <p className="mb-4 text-gray-500">
                        Be the first to start a discussion in this course.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
