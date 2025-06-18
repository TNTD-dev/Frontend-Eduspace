import React, { useState, useEffect } from "react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import { CourseCard, CourseCardCompleted } from "@/components/features/course/CourseCard";
import EnrollCodeDialog from "@/components/features/course/EnrollCodeDialog";
import { courseEnrollmentAPI } from '@/api/modules/courseEnrollment.api';
import { toast } from 'sonner';

const CoursePage = () => {
  const [courseType, setCourseType] = useState("all");
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await courseEnrollmentAPI.getMyCourses();
      if (response.success) {
        // Transform the data to match CourseCard props
        const transformedCourses = response.data.map(course => ({
          id: course.id,
          title: course.title,
          category: course.category,
          categoryColor: course.categoryColor,
          image: course.image,
          progress: course.progress || 0,
          total: course.total || 0,
          instructorName: course.instructorName || '',
          endDate: course.endDate,
          status: course.status
        }));
        console.log('Transformed courses:', transformedCourses); // Debug log
        setCourses(transformedCourses);
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on type
  const filteredCourses = {
    current: courses.filter(course => course.status === 'current'),
    completed: courses.filter(course => course.status === 'completed')
  };

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
                <div className="mb-8 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#303345]">Courses</h1>
                  <button
                    onClick={() => setIsEnrollDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Enroll with Code
                  </button>
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

                {/* Loading State */}
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    {courseType === "all" && (
                      <>
                        {renderCourseSection("Current Courses", filteredCourses.current)}
                        {renderCourseSection("Completed Courses", filteredCourses.completed, true)}
                      </>
                    )}
                    {courseType === "current" && renderCourseSection("Current Courses", filteredCourses.current)}
                    {courseType === "completed" && renderCourseSection("Completed Courses", filteredCourses.completed, true)}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enroll Code Dialog */}
      <EnrollCodeDialog
        isOpen={isEnrollDialogOpen}
        onClose={() => setIsEnrollDialogOpen(false)}
        onSuccess={fetchCourses}
      />
    </div>
  );
};

export default CoursePage;
