import React from "react";

const assignments = [
  {
    id: 1,
    title: "Software Design Patterns",
    course: "Introduction to Software Engineering",
    completed: 32,
    total: 40,
  },
  {
    id: 2,
    title: "Database Schema Design",
    course: "Introduction to Software Engineering",
    completed: 18,
    total: 40,
  },
  {
    id: 3,
    title: "Image Processing Basics",
    course: "Introduction to Computer Vision",
    completed: 25,
    total: 30,
  },
];

const TeacherAssignmentCard = () => {
  return (
    <div className="rounded-xl bg-white p-4 shadow w-full">
      <h2 className="text-base font-bold text-[#303345] mb-3">
        Assignment Progress
      </h2>

      {/* Scrollable area limited to ~2 items */}
      <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
        {assignments.map((assignment) => {
          const percentage = Math.round(
            (assignment.completed / assignment.total) * 100
          );

          return (
            <div
              key={assignment.id}
              className="bg-slate-50 rounded-md p-3 space-y-1"
            >
              <div className="flex justify-between items-center text-sm font-medium text-[#303345]">
                <span className="line-clamp-1">{assignment.title}</span>
                <span className="text-slate-500 text-xs">{percentage}%</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {assignment.course}
              </p>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 text-right">
                {assignment.completed} of {assignment.total} students completed
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherAssignmentCard;