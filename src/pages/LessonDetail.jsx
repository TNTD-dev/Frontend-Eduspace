import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SideBarStudent from "../components/layout/SideBarStudent";
import SideBarTeacher from "@/components/layout/SideBarTeacher";
import NavBar from "../components/layout/NavBar";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  CheckCircle,
  Play,
} from "lucide-react";
import { currentCourses, completedCourses } from "../data/mock/courseData";

const allCourses = [...currentCourses, ...completedCourses];

const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const location   = useLocation();
  const isTeacher  = location.pathname.startsWith("/teacher/");
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find course and lesson from mock data
    const foundCourse = allCourses.find(
      (course) => course.id === parseInt(courseId)
    );
    setCourse(foundCourse);

    if (foundCourse) {
      const foundLesson = foundCourse.modules
        .flatMap((module) => module.lessons)
        .find((lesson) => lesson.id === parseInt(lessonId));
      setLesson(foundLesson);
    }

    setLoading(false);
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        {isTeacher ? <SideBarTeacher /> : <SideBarStudent />}
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Loading...
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        {isTeacher ? <SideBarTeacher /> : <SideBarStudent />}
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Lesson Not Found
                  </h2>
                  <p className="text-gray-500">
                    The lesson you're looking for doesn't exist.
                  </p>
                  <Link
                    to={`/student/courses/${courseId}`}
                    className="mt-4 inline-block text-blue-500 hover:text-blue-600"
                  >
                    Return to Course
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      {isTeacher ? <SideBarTeacher /> : <SideBarStudent />}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />
            
            {/* Lesson Header */}
            <div className="mb-6">
              <Link 
                to={`${isTeacher ? "/teacher" : "/student"}/courses/${courseId}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1f53f3]"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Course</span>
              </Link>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {lesson.title}
              </h1>
            </div>

            {/* Lesson Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  {lesson.type === "video" ? (
                    <div className="aspect-video bg-black rounded-lg">
                      <video
                        src={lesson.content.videoUrl}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <iframe
                        src={lesson.content.document}
                        className="w-full h-[600px]"
                        title={lesson.title}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Lesson Resources
                  </h2>
                  <div className="space-y-4">
                    {lesson.content.resources?.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium">
                            {resource.title}
                          </span>
                        </div>
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ))}

                    {(!lesson.content.resources || lesson.content.resources.length === 0) && (
                      <div className="text-center py-4 text-gray-500">
                        No additional resources available for this lesson.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;