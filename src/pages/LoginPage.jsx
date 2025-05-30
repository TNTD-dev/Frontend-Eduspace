import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { ColorfulDots } from "@/components/ColorfulDots";
import { authAPI } from "@/services/api";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Add useEffect to handle Google callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          const response = await authAPI.handleGoogleCallback();
          if (response.data.accessToken) {
            localStorage.setItem("token", response.data.accessToken);
            if (response.data.user) {
              localStorage.setItem("user", JSON.stringify(response.data.user));
            }
            window.location.href = "/student/dashboard";
          }
        } catch (err) {
          console.error("Google login error:", err);
          setError("Failed to login with Google");
        }
      }
    };

    handleGoogleCallback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({
        email,
        password,
      });

      // Kiểm tra response từ backend
      if (response.data) {
        // Kiểm tra nếu có lỗi
        if (response.data.errCode !== undefined) {
          setError(response.data.errMessage);
          setLoading(false);
          return;
        }

        // Nếu đăng nhập thành công
        if (response.data.accessToken) {
          // Lưu token vào localStorage
          localStorage.setItem("token", response.data.accessToken);
          // Lưu thông tin user
          if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
          // Chuyển hướng đến dashboard
          window.location.href = "/student/dashboard";
        }
      }
    } catch (err) {
      console.log("Login error:", err.response?.data);
      // Xử lý các loại lỗi khác nhau
      if (err.response?.data?.errMessage) {
        setError(err.response.data.errMessage);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authAPI.googleLogin();
  };

  return (
    <div className="flex min-h-screen  w-full flex-col bg-[#f4f9fc]">
      <div className="absolute right-25 top-6">
        <img
          src="/logo-eduspace.png"
          alt="EduSpace Logo"
          className="h-25 w-auto"
        />
      </div>
      <div className="container relative flex flex-1 items-center">
        <ColorfulDots />

        <div className="grid w-full gap-6 md:grid-cols-2">
          <div className="flex items-center justify-center p-6">
            <motion.img
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              src="/login-illustration.png"
              alt="Login illustration"
              className="relative h-full w-full max-w-md object-contain"
            />
          </div>
          <div className="flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-full max-w-md space-y-6 ml-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-2 text-center"
              >
                <h1 className="text-3xl font-semibold font-atyp">Log In</h1>
                <p className="text-slate-500">
                  Enter your credentials to access your account
                </p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="email"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <Input
                    className="bg-white border-0"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="password"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      className="bg-white border-0"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                  <Link
                    to="/auth/forgot-password"
                    className="flex justify-end text-sm text-[#1f53f3] hover:text-[#071f8c] font-medium mt-1"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-3 text-base shadow-md hover:bg-[#071f8c] transform hover:-translate-y-0.5 bg-[#1f53f3]"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Login"}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50 text-gray-500">
                    or login with
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="grid grid-cols-2 gap-4"
              >
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-2.5 hover:border-[#1f53f3] hover:text-[#1f53f3] shadow-sm"
                  onClick={handleGoogleLogin}
                >
                  <div className="flex items-center justify-center h-5 w-5">
                    <FcGoogle className="w-3 h-3" />
                  </div>
                  <span className="font-medium">Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-2.5 hover:border-[#1f53f3] hover:text-[#1f53f3] shadow-sm"
                >
                  <div className="flex items-center justify-center h-5 w-5">
                    <FaFacebookF color="#1877F2" className="w-3 h-3" />
                  </div>
                  <span className="font-medium">Facebook</span>
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1 }}
                className="mt-8 text-center text-gray-600"
              >
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="text-[#1f53f3] hover:text-[#071f8c] font-medium"
                >
                  Sign up
                </Link>
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
