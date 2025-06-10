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
//temporary
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";

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

// Demo Teacher Dashboard placeholder
const TeacherDashboard = () => (
  <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />
  <div className="flex-1 flex flex-col h-screen">
  <div className="flex-1 overflow-auto">
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <NavBar />
      <h1>Teacher Dashboard</h1>
      </div>
      </div>
      </div>
      </div>
      
);

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
      </Routes>
    </AuthProvider>
  );
}

export default App;
