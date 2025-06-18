export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/redirect',
    UPDATE_ROLE: '/auth/update-role',
  };
  
  export const COURSE_ENDPOINTS = {
    BASE: '/api/courses',
    BY_ID: (id) => `/api/courses/${id}`,
    CREATE: '/api/courses/createNewCourse',
    UPDATE: (id) => `/api/courses/${id}/updateCourse`,
    DELETE: (id) => `/api/courses/${id}/deleteCourse`,
    PROGRESS: (id) => `/api/courses/${id}/progress`,
  };

  export const MODULE_ENDPOINTS = {
    BASE: '/api/courses/:courseId/modules',
    BY_ID: (courseId, moduleId) => `/api/courses/${courseId}/modules/${moduleId}`,
    CREATE: '/api/courses/:courseId/modules',
    UPDATE: (courseId, moduleId) => `/api/courses/${courseId}/modules/${moduleId}`,
    DELETE: (courseId, moduleId) => `/api/courses/${courseId}/modules/${moduleId}`,
    UPDATE_ORDER: (courseId, moduleId) => `/api/courses/${courseId}/modules/${moduleId}/order`,
  };
  
  export const LESSON_ENDPOINTS = {
    BASE: '/api/courses/:courseId/modules/:moduleId/lessons',
    BY_ID: (courseId, moduleId, lessonId) => `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    CREATE: '/api/courses/:courseId/modules/:moduleId/lessons',
    UPDATE: (courseId, moduleId, lessonId) => `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    DELETE: (courseId, moduleId, lessonId) => `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    UPDATE_ORDER: (courseId, moduleId, lessonId) => `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/order`,
  };

  export const ASSIGNMENT_ENDPOINTS = {
    BASE: '/api/courses/:courseId/modules/:moduleId/assignments',
    BY_ID: (courseId, moduleId, assignmentId) => `/api/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}`,
    CREATE: '/api/courses/:courseId/modules/:moduleId/assignments',
    UPDATE: (courseId, moduleId, assignmentId) => `/api/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}`,
    DELETE: (courseId, moduleId, assignmentId) => `/api/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}`,
  };
  
  export const FLASHCARD_ENDPOINTS = {
    // Flashcard statistics endpoints
    STATS: '/api/flashcards/stats',

    // Deck endpoints
    DECKS: '/api/flashcards/decks',
    DECK_DETAIL: (deckId) => `/api/flashcards/decks/${deckId}`,
    CREATE_DECK: '/api/flashcards/decks',
    UPDATE_DECK: (deckId) => `/api/flashcards/decks/${deckId}`,
    DELETE_DECK: (deckId) => `/api/flashcards/decks/${deckId}`,

    // Card endpoints
    CARDS_IN_DECK: (deckId) => `/api/flashcards/decks/${deckId}/cards`,
    CARD_DETAIL: (cardId) => `/api/flashcards/cards/${cardId}`,
    CREATE_CARD: '/api/flashcards/cards',
    UPDATE_CARD: (cardId) => `/api/flashcards/cards/${cardId}`,
    DELETE_CARD: (cardId) => `/api/flashcards/cards/${cardId}`,

    // Study endpoints
    DUE: '/api/flashcards/study/due',
    DUE_BY_DATE: (date) => `/api/flashcards/study/due/${date}`,
    STUDY: (cardId) => `/api/flashcards/study/${cardId}`,

    // Group card title endpoints
    UPDATE_GROUP_TITLE: '/api/flashcards/cards/group-title',
    DELETE_GROUP_TITLE: (title) => `/api/flashcards/cards/group-title/${title}`,
  };
  
 

export const USER_ENDPOINTS = {
  USER: "/user", // để gọi GET /
  PROFILE: "/user/profile", // để gọi PUT /profile
  BY_ID: (id) => `/user/${id}`,

  // ... other endpoint
};

export const COURSE_ENROLLMENT_ENDPOINTS = {
  MY_COURSES: '/api/coursesEnrollment/my-courses',
  ENROLL_BY_CODE: '/api/coursesEnrollment/enroll-by-code',
  MY_COURSE_DETAIL: (courseId) => `/api/coursesEnrollment/my-course/${courseId}`,
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

