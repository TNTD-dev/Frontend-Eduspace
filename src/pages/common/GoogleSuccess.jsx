import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    console.log("Google Success Page - Initial params:", { token: token ? "exists" : "none", error });

    if (error) {
      console.error("Google login error:", error);
      navigate("/auth/login");
      return;
    }

    if (token) {
      try {
        console.log("Processing Google login token...");
        
        // Lưu token vào localStorage
        localStorage.setItem("token", token);
        console.log("Token saved to localStorage");
        
        // Decode JWT token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        console.log("Decoded token payload:", payload);
        
        // Lưu thông tin user
        const userData = {
          id: payload.id,
          email: payload.email,
          firstName: payload.firstname,
          lastName: payload.lastname,
          role: payload.role
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        console.log("User data saved to localStorage:", userData);
        
        // Kiểm tra nếu là user mới (chưa có role)
        if (!payload.role) {
          console.log("New user detected - redirecting to role selection");
          navigate("/auth/select-role");
          return;
        }
        
        // Điều hướng dựa vào role
        console.log("Redirecting based on role:", payload.role);
        if (payload.role === "student") {
          navigate("/student/dashboard");
        } else if (payload.role === "teacher") {
          navigate("/teacher/dashboard");
        } else if (payload.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          console.error("Unknown role:", payload.role);
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Error processing token:", error);
        navigate("/auth/login");
      }
    } else {
      console.log("No token found in URL");
      navigate("/auth/login");
    }
  }, [navigate, searchParams, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Đang đăng nhập bằng Google...</h2>
        <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
};

export default GoogleSuccess;