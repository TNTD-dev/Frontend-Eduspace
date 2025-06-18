import axiosInstance from "@/config/axios";
import { LESSON_ENDPOINTS } from "@/api/config/endpoints";

export const moduleLessonAPI = {
  getAllLessons: (courseId, moduleId) =>
    axiosInstance.get(LESSON_ENDPOINTS.BASE.replace(":courseId", courseId).replace(":moduleId", moduleId)),

  getLessonById: (courseId, moduleId, lessonId) =>
    axiosInstance.get(LESSON_ENDPOINTS.BY_ID(courseId, moduleId, lessonId)),

  createLesson: (courseId, moduleId, lessonData) => {
    const formData = new FormData();
    formData.append('title', lessonData.title);
    formData.append('description', lessonData.description || '');
    if (lessonData.fileObject) {
      formData.append('file', lessonData.fileObject);
    }
    return axiosInstance.post(
      LESSON_ENDPOINTS.CREATE.replace(":courseId", courseId).replace(":moduleId", moduleId),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  updateLesson: (courseId, moduleId, lessonId, lessonData) => {
    const formData = new FormData();
    
    // Add required fields
    formData.append('title', lessonData.title || '');
    formData.append('description', lessonData.description || '');
    formData.append('type', lessonData.type || 'document');
    
    // Add file if exists
    if (lessonData.fileObject) {
      formData.append('file', lessonData.fileObject);
    }

    // Log FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    return axiosInstance.put(
      LESSON_ENDPOINTS.UPDATE(courseId, moduleId, lessonId),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  deleteLesson: (courseId, moduleId, lessonId) =>
    axiosInstance.delete(LESSON_ENDPOINTS.DELETE(courseId, moduleId, lessonId)),

  updateLessonOrder: (courseId, moduleId, lessonId, newOrder) =>
    axiosInstance.patch(LESSON_ENDPOINTS.UPDATE_ORDER(courseId, moduleId, lessonId), { newOrder }),
};