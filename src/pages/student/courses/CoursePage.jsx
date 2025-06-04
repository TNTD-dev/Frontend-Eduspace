import React, { useState, useMemo } from "react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import { CourseCard, CourseCardCompleted } from "@/components/features/course/CourseCard";
import { currentCourses, completedCourses } from "@/data/mock/courseData";

const CoursePage = () => {
  const [courseType, setCourseType] = useState("all");

  // Memoize filtered courses to prevent unnecessary recalculations
  const filteredCourses = useMemo(() => {
    switch (courseType) {
      case "current":
        return { current: currentCourses, completed: [] };
      case "completed":
        return { current: [], completed: completedCourses };
      default:
        return { current: currentCourses, completed: completedCourses };
    }
  }, [courseType]);

  const renderCourseSection = (title, courses, isCompleted = false) => {
    if (courses.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="mb-4 text-xl font-bold text-[#303345]">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id}>
              {isCompleted ? (
                <CourseCardCompleted course={course} />
              ) : (
                <CourseCard course={course} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />

      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            {/* Header */}
            <NavBar />
            {/* Content */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col h-full">
                {/* Course Details */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-[#303345]">Courses</h1>
                </div>

                {/* Course Type Filter */}
                <div className="mb-8 flex">
                  <div className="inline-flex gap-2 rounded-lg border bg-white p-1 shadow-sm">
                    <button
                      onClick={() => setCourseType("all")}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                        courseType === "all"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setCourseType("current")}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                        courseType === "current"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Current
                    </button>
                    <button
                      onClick={() => setCourseType("completed")}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                        courseType === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                {/* Course Sections */}
                {renderCourseSection("Current Courses", filteredCourses.current)}
                {renderCourseSection("Completed Courses", filteredCourses.completed, true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
