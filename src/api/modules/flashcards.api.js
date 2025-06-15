import axiosInstance from '@/api/config/axios';
import { FLASHCARD_ENDPOINTS } from '@/api/config/endpoints';

export const flashcardAPI = {
  // Flashcard statistics
  getFlashcardStats: () => axiosInstance.get(FLASHCARD_ENDPOINTS.STATS),

  // Deck CRUD
  getDecks: () => axiosInstance.get(FLASHCARD_ENDPOINTS.DECKS),
  getDeckDetail: (deckId) => axiosInstance.get(FLASHCARD_ENDPOINTS.DECK_DETAIL(deckId)),
  createDeck: (data) => axiosInstance.post(FLASHCARD_ENDPOINTS.CREATE_DECK, data),
  updateDeck: (deckId, data) => axiosInstance.put(FLASHCARD_ENDPOINTS.UPDATE_DECK(deckId), data),
  deleteDeck: (deckId) => axiosInstance.delete(FLASHCARD_ENDPOINTS.DELETE_DECK(deckId)),

  // Card CRUD
  getCardsInDeck: (deckId) => axiosInstance.get(FLASHCARD_ENDPOINTS.CARDS_IN_DECK(deckId)),
  getCardDetail: (cardId) => axiosInstance.get(FLASHCARD_ENDPOINTS.CARD_DETAIL(cardId)),
  createCard: (data) => axiosInstance.post(FLASHCARD_ENDPOINTS.CREATE_CARD, data),
  updateCard: (cardId, data) => axiosInstance.put(FLASHCARD_ENDPOINTS.UPDATE_CARD(cardId), data),
  deleteCard: (cardId) => axiosInstance.delete(FLASHCARD_ENDPOINTS.DELETE_CARD(cardId)),

  // Spaced repetition
  getDueCards: () => axiosInstance.get(FLASHCARD_ENDPOINTS.DUE),
  getDueCardsByDate: (date) => axiosInstance.get(FLASHCARD_ENDPOINTS.DUE_BY_DATE(date)),
  studyCard: (cardId, data) => axiosInstance.post(FLASHCARD_ENDPOINTS.STUDY(cardId), data),

  // Group card title
  updateCardGroupTitle: (data) => axiosInstance.put(FLASHCARD_ENDPOINTS.UPDATE_GROUP_TITLE, data),
  deleteCardGroupByTitle: (title) => axiosInstance.delete(FLASHCARD_ENDPOINTS.DELETE_GROUP_TITLE(title)),
};