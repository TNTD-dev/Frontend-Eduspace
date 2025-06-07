export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/redirect',
    UPDATE_ROLE: '/auth/update-role',
  };
  
  export const COURSE_ENDPOINTS = {
    BASE: '/courses',
    BY_ID: (id) => `/courses/${id}`,
    LESSONS: (courseId) => `/courses/${courseId}/lessons`,
  };
  
  export const LESSON_ENDPOINTS = {
    BASE: '/lessons',
    BY_ID: (id) => `/lessons/${id}`,
    QUIZZES: (lessonId) => `/lessons/${lessonId}/quizzes`,
  };
  
  export const QUIZ_ENDPOINTS = {
    BASE: '/quizzes',
    BY_ID: (id) => `/quizzes/${id}`,
    SUBMIT: (id) => `/quizzes/${id}/submit`,
  };
  
  export const PROGRESS_ENDPOINTS = {
    BASE: '/progress',
    UPDATE: '/progress',
  };

export const USER_ENDPOINTS = {
  PROFILE: '/auth/profile',

  // ... other endpoints
};

export const COURSE_ENROLLMENT_ENDPOINTS = {
  MY_COURSES: '/api/coursesEnrollment/my-courses',
  // ... các endpoint khác nếu có
};

