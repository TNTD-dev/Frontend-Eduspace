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
  USER: "/user", // để gọi GET /
  PROFILE: "/user/profile", // để gọi PUT /profile

  // ... other endpoint
};

export const COURSE_ENROLLMENT_ENDPOINTS = {
  MY_COURSES: '/api/coursesEnrollment/my-courses',
  // ... các endpoint khác nếu có
};

export const CALENDAR_ENDPOINTS = {
  BASE: '/api/calendar',
  BY_ID: (id) => `/api/calendar/${id}`,
  CREATE: '/api/calendar',
  UPDATE: (id) => `/api/calendar/${id}`,
  DELETE: (id) => `/api/calendar/${id}`,
};

export const TAGS_ENDPOINTS = {
  BASE: '/api/tags',
  BY_ID: (id) => `/api/tags/${id}`,
  CREATE: '/api/tags',
  UPDATE: (id) => `/api/tags/${id}`,
  DELETE: (id) => `/api/tags/${id}`,
};

