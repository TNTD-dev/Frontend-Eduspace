import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Nếu muốn, có thể fetch thêm user info ở đây
      navigate("/student/dashboard");
    } else {
      // Nếu không có token, chuyển về login
      navigate("/auth/login");
    }
  }, [navigate]);

  return <div>Đang đăng nhập bằng Google...</div>;
};

export default GoogleSuccess;