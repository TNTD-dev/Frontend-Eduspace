import axiosInstance from '@/api/config/axios';
import { COURSE_ENROLLMENT_ENDPOINTS } from '@/api/config/endpoints';

export const courseEnrollmentAPI = {
  getMyCourses: () => axiosInstance.get(COURSE_ENROLLMENT_ENDPOINTS.MY_COURSES),
}; 