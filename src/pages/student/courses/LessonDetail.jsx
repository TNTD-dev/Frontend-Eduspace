import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  CheckCircle,
  Play,
} from "lucide-react";
import { currentCourses, completedCourses } from "@/data/mock/courseData";
import { useAuth } from "@/context/AuthContext";
import SideBarTeacher from "@/components/layout/SideBarTeacher";
import { moduleLessonAPI } from "@/api/modules/moduleLesson.api";
const allCourses = [...currentCourses, ...completedCourses];

const LessonDetail = () => {
  const { userRole } = useAuth();
  const { courseId, moduleId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await moduleLessonAPI.getLessonById(courseId, moduleId, lessonId);
        console.log('Raw response:', res);
        const lessonData = res.data.data;
        setLesson(lessonData);
        // Log lesson data and full URL
        console.log('Lesson data:', lessonData);
        if (lessonData?.contentURL) {
          console.log('Content URL:', lessonData.contentURL);
          console.log('Full URL:', `${import.meta.env.VITE_API_URL}${lessonData.contentURL}`);
          console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [courseId, moduleId, lessonId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        {userRole === 'teacher' ? <SideBarTeacher /> : <SideBarStudent />}
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

  if (!lesson) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        {userRole === 'teacher' ? <SideBarTeacher /> : <SideBarStudent />}
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
                    to={`/${userRole}/courses/${courseId}`}
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
      {userRole === 'teacher' ? <SideBarTeacher /> : <SideBarStudent />}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />
            
            {/* Lesson Header */}
            <div className="mb-6">
              <Link
                to={`/${userRole}/courses/${courseId}`}
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
              <div className="lg:col-span-3">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  {lesson.type === "video" && lesson.contentURL ? (
                    <div className="aspect-video bg-black rounded-lg">
                      <video
                        src={`${import.meta.env.VITE_API_URL}${lesson.contentURL}`}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  ) : lesson.type === "document" && lesson.contentURL ? (
                    <div className="prose max-w-none">
                      <object
                        data={`${import.meta.env.VITE_API_URL}${lesson.contentURL}`}
                        type="application/pdf"
                        className="w-full h-[600px] rounded-lg"
                      >
                        <p>Unable to display PDF file. <a href={`${import.meta.env.VITE_API_URL}${lesson.contentURL}`} target="_blank" rel="noopener noreferrer">Download</a> instead.</p>
                      </object>
                    </div>
                  ) : (
                    <div className="text-gray-500">No file available for this lesson.</div>
                  )}
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