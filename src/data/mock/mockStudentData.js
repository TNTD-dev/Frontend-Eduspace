// src/data/mockStudentData.js

// Helper: creates an array of `count` students, each with a random score from 1–100
const generateStudents = (count) =>
    Array.from({ length: count }, (_ , i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@example.com`,
      score: Math.floor(Math.random() * 100) + 1
    }));
  
  export const studentData = {
    1: generateStudents(42),
    2: generateStudents(48),
    3: generateStudents(50),
    4: generateStudents(47),
    5: generateStudents(43)
  };