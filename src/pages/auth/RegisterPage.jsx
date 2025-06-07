import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GraduationCap, School, CheckCircle2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { ColorfulDots } from '@/components/common/ColorfulDots';
import { FcGoogle } from "react-icons/fc";
import { authAPI } from '@/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Gọi API register sử dụng authAPI
      const response = await authAPI.register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      });

      console.log('Registration response:', response);

      // Xử lý response
      if (response && response.data) {
        // Lấy token từ response
        const { token, redirectUrl } = response.data;
        console.log('Token received:', token);
        
        if (redirectUrl) {
          // Nếu có redirectUrl, sử dụng nó
          window.location.href = redirectUrl;
        } else {
          // Nếu không có redirectUrl, tự tạo URL với token
          navigate(`/auth/select-role?token=${token}`);
        }
      }
    } catch (err) {
      // Xử lý lỗi từ axios
      console.log('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className='flex min-h-screen  w-full flex-col bg-[#f4f9fc]'>
      <div className="absolute right-25 top-6">
        <img
          src="/logo-eduspace.png"
          alt="EduSpace Logo"
          className="h-25 w-auto"
        />
      </div>
      <div className='container relative flex flex-1 items-center'>
        <ColorfulDots />

        <div className="grid w-full gap-6 md:grid-cols-2">
          <div className="flex items-center justify-center p-6">
            <motion.img
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              src="/login-illustration.png"
              alt="Register illustration"
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
                <h1 className="text-3xl font-semibold font-atyp">Create Account</h1>
                <p className="text-slate-500">Join our community and start learning</p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="firstname">
                      First Name <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <Input
                    className="bg-white border-0"
                    id="firstname"
                    name="firstname"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstname}
                    onChange={handleChange}
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
                    <label className="block text-sm font-medium text-gray-700" htmlFor="lastname">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <Input
                    className="bg-white border-0"
                    id="lastname"
                    name="lastname"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <Input
                    className="bg-white border-0"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className='relative'>
                    <Input
                      className="bg-white border-0"
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className='relative'>
                    <Input
                      className="bg-white border-0"
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-3 text-base shadow-md hover:bg-[#071f8c] transform hover:-translate-y-0.5 bg-[#1f53f3]"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Create Account'}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50 text-gray-500">or sign up with</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.1 }}
                className="grid grid-cols-2 gap-4"
              >
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-2.5 hover:border-[#1f53f3] hover:text-[#1f53f3] shadow-sm"
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
                    <FaFacebookF color='#1877F2' className="w-3 h-3" />
                  </div>
                  <span className="font-medium">Facebook</span>
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.2 }}
                className="mt-8 text-center text-gray-600"
              >
                Already have an account?{" "}
                <Link to="/auth/login" className="text-[#1f53f3] hover:text-[#071f8c] font-medium">
                  Log in
                </Link>
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
