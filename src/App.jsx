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
import DiscussionDetail from '@/pages/student/courses/DiscussionDetail';
import Schedule from "@/pages/student/schedule/Schedule";
import FlashCard from "@/pages/student/flashcards/FlashCards";
import CreateCards from "@/pages/student/flashcards/CreateCards";
import Study from "@/pages/student/flashcards/StudyFlashCard";
import GoogleSuccess from "@/pages/common/GoogleSuccess";
import PomodoroPage from "@/pages/student/pomodoro/PomodoroPage";
import AlAssistantPage from "@/pages/student/aiassistant/AlAssistantPage";
import SettingPage from "@/pages/common/SettingPage";

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

// Student Dashboard placeholder

// Teacher Dashboard placeholder
const TeacherDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
    <p>Welcome to your teacher dashboard!</p>
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
        <Route path="/auth/settings" element={<SettingPage />} />
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
