// Mock data for cards
export const mockCards = [
  // Biology Set
  {
    id: "card1",
    type: "basic",
    cardSetTitle: "Biology Basics",
    question: "What is photosynthesis?",
    answer: "The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.",
    deckId: "deck1",
    deckName: "Biology",
    tags: ["biology", "plants"],
    status: "due",
    interval: 1,
    easeFactor: 2.5,
    repetitions: 1,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: "2024-03-19"
  },
  {
    id: "card3",
    type: "cloze",
    cardSetTitle: "Biology Basics",
    clozeText: "The {{mitochondria}} is the powerhouse of the cell.",
    deckId: "deck1",
    deckName: "Biology",
    tags: ["biology", "cells"],
    status: "due",
    interval: 3,
    easeFactor: 2.5,
    repetitions: 2,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: "2024-03-17"
  },
  {
    id: "card9",
    type: "basic",
    cardSetTitle: "Biology Basics",
    question: "What is the largest organ in the human body?",
    answer: "The skin",
    deckId: "deck1",
    deckName: "Biology",
    tags: ["biology", "anatomy"],
    status: "learned",
    interval: 14,
    easeFactor: 2.9,
    repetitions: 4,
    nextReviewDate: "2024-04-02",
    lastReviewDate: "2024-03-19"
  },

  // Geography Set
  {
    id: "card2",
    type: "basic",
    cardSetTitle: "World Geography",
    question: "What is the capital of France?",
    answer: "Paris",
    deckId: "deck4",
    deckName: "Geography",
    tags: ["geography", "europe"],
    status: "new",
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: null
  },
  {
    id: "card10",
    type: "basic",
    cardSetTitle: "World Geography",
    question: "What is the capital of Japan?",
    answer: "Tokyo",
    deckId: "deck4",
    deckName: "Geography",
    tags: ["geography", "asia"],
    status: "due",
    interval: 7,
    easeFactor: 2.8,
    repetitions: 3,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: "2024-03-13"
  },
  {
    id: "card13",
    type: "basic",
    cardSetTitle: "World Geography",
    question: "What is the capital of Australia?",
    answer: "Canberra",
    deckId: "deck4",
    deckName: "Geography",
    tags: ["geography", "australia"],
    status: "learned",
    interval: 60,
    easeFactor: 3.0,
    repetitions: 6,
    nextReviewDate: "2024-05-18",
    lastReviewDate: "2024-03-19"
  },

  // Mathematics Set
  {
    id: "card4",
    type: "basic",
    cardSetTitle: "Mathematics Fundamentals",
    question: "What is the formula for calculating the area of a circle?",
    answer: "A = πr²",
    deckId: "deck3",
    deckName: "Mathematics",
    tags: ["math", "geometry"],
    status: "due",
    interval: 1,
    easeFactor: 2.3,
    repetitions: 1,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: "2024-03-19"
  },
  {
    id: "card12",
    type: "basic",
    cardSetTitle: "Mathematics Fundamentals",
    question: "What is the square root of 144?",
    answer: "12",
    deckId: "deck3",
    deckName: "Mathematics",
    tags: ["math", "algebra"],
    status: "due",
    interval: 3,
    easeFactor: 2.9,
    repetitions: 2,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: "2024-03-17"
  },

  // Chemistry Set
  {
    id: "card6",
    type: "basic",
    cardSetTitle: "Chemistry Basics",
    question: "What is the chemical symbol for gold?",
    answer: "Au",
    deckId: "deck2",
    deckName: "Chemistry",
    tags: ["chemistry", "elements"],
    status: "due",
    interval: 7,
    easeFactor: 2.5,
    repetitions: 2,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: "2024-03-13"
  },
  {
    id: "card11",
    type: "basic",
    cardSetTitle: "Chemistry Basics",
    question: "What is the chemical formula for water?",
    answer: "H2O",
    deckId: "deck2",
    deckName: "Chemistry",
    tags: ["chemistry", "compounds"],
    status: "learned",
    interval: 30,
    easeFactor: 3.0,
    repetitions: 5,
    nextReviewDate: "2024-04-18",
    lastReviewDate: "2024-03-19"
  },

  // Language Set
  {
    id: "card5",
    type: "basic",
    cardSetTitle: "Spanish Vocabulary",
    question: "How do you say 'hello' in Spanish?",
    answer: "Hola",
    deckId: "deck5",
    deckName: "Languages",
    tags: ["spanish", "greetings"],
    status: "due",
    interval: 3,
    easeFactor: 2.8,
    repetitions: 2,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: "2024-03-17"
  },

  // Literature Set
  {
    id: "card7",
    type: "basic",
    cardSetTitle: "Classic Literature",
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
    deckId: "deck4",
    deckName: "Geography",
    tags: ["literature", "authors"],
    status: "due",
    interval: 7,
    easeFactor: 2.7,
    repetitions: 3,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: "2024-03-13"
  },

  // Physics Set
  {
    id: "card8",
    type: "basic",
    cardSetTitle: "Physics Constants",
    question: "What is the speed of light?",
    answer: "299,792,458 meters per second",
    deckId: "deck3",
    deckName: "Mathematics",
    tags: ["physics", "constants"],
    status: "due",
    interval: 7,
    easeFactor: 2.6,
    repetitions: 3,
    nextReviewDate: "2024-03-20", // Today
    lastReviewDate: "2024-03-13"
  },

  // Astronomy Set
  {
    id: "card14",
    type: "basic",
    cardSetTitle: "Astronomy Basics",
    question: "What is the largest planet in our solar system?",
    answer: "Jupiter",
    deckId: "deck3",
    deckName: "Mathematics",
    tags: ["astronomy", "planets"],
    status: "learned",
    interval: 60,
    easeFactor: 3.0,
    repetitions: 6,
    nextReviewDate: "2024-05-18",
    lastReviewDate: "2024-03-19"
  }
];
