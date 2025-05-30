import axiosInstance from '../config/axios';

// Auth APIs
export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return axiosInstance.post('/auth/logout');
  },
  googleLogin: () => window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`,
  handleGoogleCallback: () => axiosInstance.get('/auth/google/redirect'),
};

// User APIs
export const userAPI = {
  getProfile: () => axiosInstance.get('/users/profile'),
  updateProfile: (data) => axiosInstance.put('/users/profile', data),
};

// Course APIs
export const courseAPI = {
  getAllCourses: () => axiosInstance.get('/courses'),
  getCourseById: (id) => axiosInstance.get(`/courses/${id}`),
  createCourse: (data) => axiosInstance.post('/courses', data),
  updateCourse: (id, data) => axiosInstance.put(`/courses/${id}`, data),
  deleteCourse: (id) => axiosInstance.delete(`/courses/${id}`),
};

// Lesson APIs
export const lessonAPI = {
  getLessonsByCourse: (courseId) => axiosInstance.get(`/courses/${courseId}/lessons`),
  getLessonById: (id) => axiosInstance.get(`/lessons/${id}`),
  createLesson: (data) => axiosInstance.post('/lessons', data),
  updateLesson: (id, data) => axiosInstance.put(`/lessons/${id}`, data),
  deleteLesson: (id) => axiosInstance.delete(`/lessons/${id}`),
};

// Quiz APIs
export const quizAPI = {
  getQuizzesByLesson: (lessonId) => axiosInstance.get(`/lessons/${lessonId}/quizzes`),
  getQuizById: (id) => axiosInstance.get(`/quizzes/${id}`),
  submitQuiz: (id, answers) => axiosInstance.post(`/quizzes/${id}/submit`, answers),
};

// Progress APIs
export const progressAPI = {
  getProgress: () => axiosInstance.get('/progress'),
  updateProgress: (data) => axiosInstance.put('/progress', data),
};