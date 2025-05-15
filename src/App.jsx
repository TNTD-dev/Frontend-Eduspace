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
