import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import { Routes, Route, Navigate } from "react-router-dom";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import SelectRolePage from "@/pages/auth/SelectRolePage";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import StudentDashboard from "@/pages/student/dashboard/StudentDashboard";
import CoursePage from "@/pages/student/courses/CoursePage";
import CourseDetail from "@/pages/student/courses/CourseDetail";
import LessonDetail from "@/pages/student/courses/LessonDetail";
import AssignmentDetail from "@/pages/student/courses/AssignmentDetail";
import DiscussionDetail from "@/pages/student/courses/DiscussionDetail";
import Schedule from "@/pages/student/schedule/Schedule";
import FlashCard from "@/pages/student/flashcards/FlashCards";
import CreateCards from "@/pages/student/flashcards/CreateCards";
import Study from "@/pages/student/flashcards/StudyFlashCard";
import GoogleSuccess from "@/pages/common/GoogleSuccess";
import PomodoroPage from "@/pages/student/pomodoro/PomodoroPage";
import AlAssistantPage from "@/pages/student/aiassistant/AlAssistantPage";
import SettingPage from "@/pages/common/SettingPage";
import TeacherDashboard from "@/pages/teacher/dashboard/TeacherDashboard";
import TeacherCoursesPage from "@/pages/teacher/courses/TeacherCoursesPage";
import TeacherCourseDetail from "@/pages/teacher/courses/TeacherCourseDetail";
import TeacherAssignmentDetail from "@/pages/teacher/courses/TeacherAssignmentDetail";
import TeacherResourceDetail from "@/pages/teacher/courses/TeacherResourceDetail";
import NewModulePage from "@/pages/teacher/courses/NewModulePage";
import NewCoursePage from "@/pages/teacher/courses/NewCoursePage";

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
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
        <Route path="/auth/settings" element={<SettingPage />} />
        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute requiredRole="student">
              <CoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:courseId"
          element={
            <ProtectedRoute requiredRole="student">
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:courseId/lessons/:lessonId"
          element={
            <ProtectedRoute requiredRole="student">
              <LessonDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:courseId/assignments/:assignmentId"
          element={
            <ProtectedRoute requiredRole="student">
              <AssignmentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:courseId/discussions/:discussionId"
          element={
            <ProtectedRoute requiredRole="student">
              <DiscussionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/schedule"
          element={
            <ProtectedRoute requiredRole="student">
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/flashcards"
          element={
            <ProtectedRoute requiredRole="student">
              <FlashCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/flashcards/create-card"
          element={
            <ProtectedRoute requiredRole="student">
              <CreateCards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/flashcards/study"
          element={
            <ProtectedRoute requiredRole="student">
              <Study />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/pomodoro"
          element={
            <ProtectedRoute requiredRole="student">
              <PomodoroPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/al-assistant"
          element={
            <ProtectedRoute requiredRole="student">
              <AlAssistantPage />
            </ProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/:courseId"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherCourseDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/courses/new"
          element={
            <ProtectedRoute requiredRole="teacher">
              <NewCoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/:courseId/edit"
          element={
            <ProtectedRoute requiredRole="teacher">
              <NewCoursePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/courses/:courseId/assignments/:assignmentId"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherAssignmentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/:courseId/resources/:resourceId"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherResourceDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/:courseId/modules/new"
          element={
            <ProtectedRoute requiredRole="teacher">
              <NewModulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/:courseId/discussions/:discussionId"
          element={
            <ProtectedRoute requiredRole="teacher">
              <DiscussionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/schedule"
          element={
            <ProtectedRoute requiredRole="teacher">
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/ai-assistant"
          element={
            <ProtectedRoute requiredRole="teacher">
              <AlAssistantPage />
            </ProtectedRoute>
          }
        />


      </Routes>
    </AuthProvider>
  );
}

export default App;
