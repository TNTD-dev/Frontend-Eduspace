import axiosInstance from '@/api/config/axios';
import { USER_ENDPOINTS } from '@/api/config/endpoints';

export const userAPI = {
  // Lấy thông tin profile
  getProfile: () => 
    axiosInstance.get(USER_ENDPOINTS.PROFILE),
  
  // Cập nhật thông tin profile
  updateProfile: (data) => 
    axiosInstance.put(USER_ENDPOINTS.PROFILE, data),
}; 