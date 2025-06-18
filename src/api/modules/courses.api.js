import axiosInstance from "../config/axios";
import { COURSE_ENDPOINTS } from "../config/endpoints";

export const courseAPI = {
  // Lấy tất cả khóa học
  getAllCourses: () => axiosInstance.get(COURSE_ENDPOINTS.BASE),

  // Lấy chi tiết 1 khóa học
  getCourseById: (id) => axiosInstance.get(COURSE_ENDPOINTS.BY_ID(id)),

  // Tạo mới khóa học
  createCourse: (data) =>
    axiosInstance.post(COURSE_ENDPOINTS.CREATE, data, {
      headers: { "Content-Type": "application/json" }
    }),

  // Cập nhật khóa học
  updateCourse: (id, data) =>
    axiosInstance.put(COURSE_ENDPOINTS.UPDATE(id), data),

  // Xóa khóa học
  deleteCourse: (id) =>
    axiosInstance.delete(COURSE_ENDPOINTS.DELETE(id)),

  // Lấy progress của khóa học
  getCourseProgress: (id) =>
    axiosInstance.get(COURSE_ENDPOINTS.PROGRESS(id)),
};

