import axiosInstance from '@/api/config/axios';
import { USER_ENDPOINTS } from '@/api/config/endpoints';

export const userAPI = {
  getUser: () => 
    axiosInstance.get(USER_ENDPOINTS.USER),
  
  updateUser: (data) => 
    axiosInstance.put(USER_ENDPOINTS.PROFILE, data),

  getUserById: (id) =>
    axiosInstance.get(USER_ENDPOINTS.BY_ID(id)),
}; 