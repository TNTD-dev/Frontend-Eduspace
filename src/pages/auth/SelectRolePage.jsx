import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { GraduationCap, School } from "lucide-react";
import { ColorfulDots } from '@/components/common/ColorfulDots';
import { authAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';

const SelectRolePage = () => {
  const {setUser} = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('Token in SelectRolePage:', token);
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/auth/login');
    }
  }, [searchParams, navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = searchParams.get('token');
      const response = await authAPI.updateRole(selectedRole, token);
      
      console.log('Response after role update:', response);
      
      if (response.success) {
        // Lưu token và user data
        console.log('Token to store:', response.data.token);
        console.log('User data to store:', response.data.user);
        console.log('Redirect URL from response:', response.data.redirectUrl);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        // Xử lý URL chuyển hướng
        const redirectUrl = new URL(response.data.redirectUrl);
        console.log('Parsed pathname:', redirectUrl.pathname);
        navigate(redirectUrl.pathname);
      }
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err.response?.data?.message || 'Failed to update role');
      setLoading(false);
    } 
  };

  return (
    <div className='flex min-h-screen w-full flex-col bg-[#f4f9fc]'>
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
              src="/select-role.png"
              alt="Select Role illustration"
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
                <h1 className="text-3xl font-semibold font-atyp">Select Your Role</h1>
                <p className="text-slate-500">Choose how you want to use EduSpace</p>
              </motion.div>

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

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="grid gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                      selectedRole === 'student' 
                        ? 'border-[#1f53f3] bg-blue-50' 
                        : 'border-gray-200 hover:border-[#1f53f3] hover:bg-blue-50/50'
                    }`}
                    onClick={() => handleRoleSelect('student')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full p-2 ${
                        selectedRole === 'student' ? 'bg-[#1f53f3] text-white' : 'bg-gray-100'
                      }`}>
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Student</h3>
                        <p className="text-sm text-gray-500">Access courses and learning materials</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                      selectedRole === 'teacher' 
                        ? 'border-[#1f53f3] bg-blue-50' 
                        : 'border-gray-200 hover:border-[#1f53f3] hover:bg-blue-50/50'
                    }`}
                    onClick={() => handleRoleSelect('teacher')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full p-2 ${
                        selectedRole === 'teacher' ? 'bg-[#1f53f3] text-white' : 'bg-gray-100'
                      }`}>
                        <School className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Teacher</h3>
                        <p className="text-sm text-gray-500">Create and manage courses</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-3 text-base shadow-md hover:bg-[#071f8c] transform hover:-translate-y-0.5 bg-[#1f53f3]"
                    disabled={!selectedRole || loading}
                  >
                    {loading ? 'Processing...' : 'Continue'}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
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
}

export default SelectRolePage; 