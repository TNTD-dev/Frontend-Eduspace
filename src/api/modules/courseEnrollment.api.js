import axiosInstance from '@/api/config/axios';
import { COURSE_ENROLLMENT_ENDPOINTS } from '@/api/config/endpoints';

export const courseEnrollmentAPI = {
  getMyCourses: () => axiosInstance.get(COURSE_ENROLLMENT_ENDPOINTS.MY_COURSES),

  getMyCourseDetail: (courseId) => axiosInstance.get(COURSE_ENROLLMENT_ENDPOINTS.MY_COURSE_DETAIL(courseId)),

  enrollByCode: (code) => axiosInstance.post(COURSE_ENROLLMENT_ENDPOINTS.ENROLL_BY_CODE, { courseCode: code }),
}; 