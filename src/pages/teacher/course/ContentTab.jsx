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

export default function ContentTab({
  modulesState = [],
  expandedModules = {},
  toggleModule,
  handleAddModule,
  moveModule,
  moveLesson,
  handleEditModule,
  handleDeleteModule,
  handleEditLesson,
  handleDeleteLesson,
  handleLessonClick,
  isArchived
}) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
        <button
          onClick={handleAddModule}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          Add New Module
        </button>
      </div>

      {/* Summary */}
      <p className="mb-4 text-sm text-gray-600">
        {modulesState.length} modules •{" "}
        {modulesState.reduce((t, m) => t + (m.lessons?.length || 0), 0)} lessons
      </p>

      {/* Module List */}
      <div className="space-y-4">
        {modulesState.map((mod, idx) => (
          <div key={mod.id} className="rounded-lg border border-gray-200">
            <div
              className="flex items-center justify-between bg-gray-50 p-4 cursor-pointer"
              onClick={() => toggleModule(mod.id)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{mod.title}</h3>
                  <p className="text-sm text-gray-500">
                    {mod.lessons?.length || 0} lessons
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); moveModule(mod.id, "up"); }}
                  disabled={idx === 0}
                  className={`rounded-full p-1 hover:bg-gray-200 transition-colors ${
                    idx === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <ArrowUp className="h-5 w-5 text-gray-500" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); moveModule(mod.id, "down"); }}
                  disabled={idx === modulesState.length - 1}
                  className={`rounded-full p-1 hover:bg-gray-200 transition-colors ${
                    idx === modulesState.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <ArrowDown className="h-5 w-5 text-gray-500" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleEditModule(mod.id); }}
                  className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="h-5 w-5 text-gray-500" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleDeleteModule(mod.id); }}
                  className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
                <div className="rounded-full p-1 hover:bg-gray-200">
                  {expandedModules[mod.id] ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Lessons */}
            {expandedModules[mod.id] && (
              <div className="divide-y border-t">
                {mod.lessons.map((lesson, lidx) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gray-100 p-2 text-gray-500">
                        {lesson.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {lesson.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {lesson.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); moveLesson(mod.id, lesson.id, "up"); }}
                        disabled={lidx === 0}
                        className={`rounded-full p-1 hover:bg-gray-200 transition-colors ${
                          lidx === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <ArrowUp className="h-5 w-5 text-gray-500" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); moveLesson(mod.id, lesson.id, "down"); }}
                        disabled={lidx === mod.lessons.length - 1}
                        className={`rounded-full p-1 hover:bg-gray-200 transition-colors ${
                          lidx === mod.lessons.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <ArrowDown className="h-5 w-5 text-gray-500" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleEditLesson(mod.id, lesson.id); }}
                        className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 className="h-5 w-5 text-gray-500" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDeleteLesson(mod.id, lesson.id); }}
                        className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                      {!isArchived && (
                        <button
                          onClick={e => { e.stopPropagation(); handleLessonClick(lesson.id); }}
                          className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
                        >
                          {lesson.completed ? "Review" : "Start"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {mod.lessons.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No lessons. Use the “+” icon above to add one.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
