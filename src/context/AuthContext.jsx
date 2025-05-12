import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // If user exists and it's first login, redirect to role selection
    if (currentUser && authService.isFirstLogin()) {
      navigate('/auth/select-role');
    }
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const { user } = await authService.login(email, password);
      setUser(user);
      navigate('/auth/select-role');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { user } = await authService.register(userData);
      setUser(user);
      navigate('/auth/select-role');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const socialLogin = async (provider) => {
    try {
      // Simulate social login
      const { user } = await authService.socialLogin(provider);
      setUser(user);
      navigate('/auth/select-role');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const setRole = async (role) => {
    try {
      await authService.setUserRole(role);
      // Redirect based on role
      if (role === 'student') {
        navigate('/student/dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher/dashboard');
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/auth/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    socialLogin,
    setRole,
    logout,
    isAuthenticated: !!user,
    userRole: authService.getUserRole()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 