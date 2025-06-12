// src/App.jsx

import { Button } from "@/components/ui/button";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route, Navigate } from "react-router-dom";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SelectRolePage from "./pages/SelectRolePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import StudentDashboard from "./pages/StudentDashboard";
import CoursePage from "./pages/CoursePage";
import CourseDetail from "./pages/CourseDetail";
import LessonDetail from "./pages/LessonDetail";
import AssignmentDetail from "./pages/AssignmentDetail";
import DiscussionDetail from './pages/DiscussionDetail';
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCoursesPage from "./pages/teacher/TeacherCoursePage";
import TeacherCourseDetail from "./pages/teacher/TeacherCourseDetail";
import TeacherAssignmentDetail from "./pages/teacher/TeacherAssignmentDetail";
import TeacherResourceDetail from "./pages/teacher/TeacherResourceDetail";
import NewModulePage from "@/pages/teacher/NewModulePage";


import NewCourse from "@/components/NewCourse";

import Schedule from "./pages/Schedule";
import FlashCard from "./pages/FlashCards";
import CreateCards from "./pages/CreateCards";
import Study from "./pages/StudyFlashCard";
import GoogleSuccess from "./pages/GoogleSuccess";
import PomodoroPage from "./pages/PomodoroPage";
import AlAssistantPage from "./pages/AlAssistantPage";

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/auth/select-role" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/select-role" element={<SelectRolePage />} />
        <Route path="/student/courses/:courseId/lessons/:lessonId" element={<LessonDetail />} />

        {/* Student routes */}
        <Route path="/student/courses" element={<CoursePage />} />
        <Route path="/student/courses/:courseId" element={<CourseDetail />} />
        <Route path="/student/courses/:courseId/assignments/:assignmentId" element={<AssignmentDetail />} />
        <Route path="/student/courses/:courseId/discussions/:discussionId" element={<DiscussionDetail />} />
        <Route path="/student/schedule" element={<Schedule />} />
        <Route path="/student/flashcards" element={<FlashCard />} />
        <Route path="/student/flashcards/create-card" element={<CreateCards />} />
        <Route path="/student/flashcards/study" element={<Study />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
        <Route path="/student/pomodoro" element={<PomodoroPage />} />
        <Route path="/student/al-assistant" element={<AlAssistantPage />} />

        <Route
          path="/student/dashboard"
          element={
            // <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            // </ProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path="/teacher/dashboard"
          element={
            // <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            // </ProtectedRoute>
          }
        />
        <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
        <Route path="/teacher/courses/:courseId/lessons/:lessonId" element={<LessonDetail />} />
        <Route path="/teacher/schedule"  element={<Schedule />} />
        <Route path="/teacher/ai-assistant" element={<AlAssistantPage />} />
        <Route path="/teacher/courses/:courseId" element={<TeacherCourseDetail />} />
        <Route path="/teacher/courses/:courseId/modules/new" element={<NewModulePage />} />
        <Route path="/teacher/courses/:courseId/assignments/:assignmentId" element={<TeacherAssignmentDetail />} />
        <Route
          path="/teacher/courses/:courseId/assignments/:assignmentId/edit"
          element={<TeacherAssignmentDetail />}
        />

        <Route
          path="/teacher/courses/:courseId/resources/:resourceId"
          element={<TeacherResourceDetail />}
        />
        <Route path="/teacher/courses/new" element={<NewCourse />} />
        <Route path="/teacher/courses/:courseId/edit" element={<NewCourse />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
