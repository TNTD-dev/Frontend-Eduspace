import axiosInstance from '@/api/config/axios';
import { AUTH_ENDPOINTS } from '@/api/config/endpoints';

export const authAPI = {
  login: (credentials) => 
    axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials),
  
  register: (userData) => 
    axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
  },
  
  googleLogin: () => 
    window.location.href = `${axiosInstance.defaults.baseURL}${AUTH_ENDPOINTS.GOOGLE}`,

  updateRole: (role, token) => 
    axiosInstance.post(AUTH_ENDPOINTS.UPDATE_ROLE, { role }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
};