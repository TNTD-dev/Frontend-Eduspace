import React from 'react'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import { ColorfulDots } from '@/components/common/ColorfulDots';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Add your password reset logic here
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
              src="/forgot-password.png"  
              alt="Forgot Password illustration"
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
                <h1 className="text-3xl font-semibold font-atyp">Forgot Your Password?</h1>
                <p className="text-slate-500">Enter your email to reset your password</p>
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
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
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
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-3 text-base shadow-md hover:bg-[#071f8c] transform hover:-translate-y-0.5 bg-[#1f53f3]"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Send Reset Link'}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="mt-8 text-center text-gray-600"
              >
                Remember your password?{" "}
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

export default ForgotPasswordPage