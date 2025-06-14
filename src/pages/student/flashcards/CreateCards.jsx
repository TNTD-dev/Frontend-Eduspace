import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Trash2 as TrashIcon,
  Image as ImageIcon,
  ArrowLeft,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import { flashcardAPI } from "@/api";
import { toast } from "sonner";

export default function CreateCards() {
  const navigate = useNavigate();
  const [selectedDeck, setSelectedDeck] = useState("");
  const [cardSetTitle, setCardSetTitle] = useState("");
  const [cards, setCards] = useState([
    { question: "", answer: "", imageQ: null, imageA: null },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const answerInputRef = useRef(null);

  // Fetch decks when component mounts
  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const response = await flashcardAPI.getDecks();
      setDecks(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch decks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = () => {
    setCards([
      ...cards,
      { question: "", answer: "", imageQ: null, imageA: null },
    ]);
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleRemoveCard = (index) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const handleImageChange = (index, field, file) => {
    const newCards = [...cards];
    newCards[index][field] = file;
    setCards(newCards);
  };

  const handleSave = async () => {
    if (!selectedDeck) {
      setError("Please select a deck");
      return;
    }
    if (!cardSetTitle.trim()) {
      setError("Please enter a title for your card set");
      return;
    }
    const validCards = cards.filter(
      (card) => card.question.trim() && card.answer.trim()
    );
    if (validCards.length === 0) {
      setError("Please enter at least one valid card");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Create cards one by one
      const createPromises = validCards.map(card => 
        flashcardAPI.createCard({
          question: card.question,
          answer: card.answer,
          deckId: selectedDeck,
          cardSetTitle: cardSetTitle,
          type: "basic",
          status: "new",
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0,
          // Handle image uploads if needed
          imageQ: card.imageQ,
          imageA: card.imageA,
        })
      );

      await Promise.all(createPromises);

      setShowSuccess(true);
      toast.success("Cards created successfully!");
      
      // Navigate back after success
      setTimeout(() => {
        navigate("/student/flashcards");
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to create cards");
      toast.error(error.message || "Failed to create cards");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index, field, e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (field === 'question') {
        // Focus on answer input
        answerInputRef.current?.focus();
      } else if (field === 'answer') {
        // Always create new card when pressing Tab in Definition field
        handleAddCard();
        // Focus on question input of new card
        setTimeout(() => {
          const newQuestionInput = document.querySelector(`input[data-card-index="${index + 1}"][data-field="question"]`);
          newQuestionInput?.focus();
        }, 0);
      }
    }
  };

  const autoResizeTextarea = (element) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  const handleTextareaChange = (index, field, e) => {
    handleCardChange(index, field, e.target.value);
    autoResizeTextarea(e.target);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <NavBar />
            {/* Header + Deck select + Save */}
            <div className="flex items-center justify-between mb-8 mt-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/student/flashcards")}
                  className="hover:bg-gray-100 text-[#303345]"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-[#303345]">Create Cards</h1>
              </div>
              <div className="flex gap-4 items-center">
                <div>
                  <select
                    id="deck"
                    className="rounded-md border border-gray-300 bg-white py-2 px-3 text-[#303345] focus:border-[#1f53f3] focus:outline-none focus:ring-1 focus:ring-[#1f53f3]"
                    value={selectedDeck}
                    onChange={(e) => setSelectedDeck(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select a deck</option>
                    {decks.map((deck) => (
                      <option key={deck.id} value={deck.id}>{deck.name}</option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleSave}
                  className="bg-[#1f53f3] hover:bg-[#1f53f3]/90 text-white"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Cards"}
                </Button>
              </div>
            </div>
            {/* Card Set Title */}
            <div className="mb-8">
              <input
                className="w-full bg-white border-b-2 border-gray-300 text-[#303345] text-xl font-bold px-2 py-3 focus:outline-none focus:border-[#1f53f3]"
                placeholder="Enter your card set title"
                value={cardSetTitle}
                onChange={(e) => setCardSetTitle(e.target.value)}
              />
            </div>
            {/* Alerts */}
            {showSuccess && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <PlusCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Cards have been created successfully.
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertTitle className="text-red-800">Error</AlertTitle>
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            {/* Card List */}
            <div className="flex flex-col gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow border border-gray-200 p-6 relative flex flex-col"
                >
                  {/* Card number */}
                  <div className="absolute top-4 left-6 text-xl font-bold text-[#1f53f3] opacity-90">{index + 1}</div>
                  {/* Delete button */}
                  {cards.length > 1 && (
                    <button
                      className="absolute top-4 right-6 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveCard(index)}
                    >
                      <TrashIcon />
                    </button>
                  )}
                  {/* Input content */}
                  <div className="flex flex-row gap-8 mt-8">
                    {/* Term */}
                    <div className="flex-1 flex flex-col">
                      <textarea
                        className="bg-white border-b-2 border-gray-300 text-[#303345] text-lg px-2 py-2 focus:outline-none focus:border-[#1f53f3] w-full overflow-hidden"
                        placeholder="Term"
                        value={card.question}
                        onChange={(e) => handleTextareaChange(index, "question", e)}
                        onKeyDown={(e) => handleKeyDown(index, "question", e)}
                        data-card-index={index}
                        data-field="question"
                        rows="1"
                      />
                      <span className="mt-2 text-xs text-[#303345]">TERM</span>
                      {/* Image button */}
                      <label className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center text-gray-500 hover:bg-blue-50 cursor-pointer w-32">
                        <ImageIcon className="mr-2" /> Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(index, "imageQ", e.target.files[0])}
                        />
                      </label>
                      {card.imageQ && (
                        <span className="text-xs text-green-500 mt-1">Selected: {card.imageQ.name}</span>
                      )}
                    </div>
                    {/* Definition */}
                    <div className="flex-1 flex flex-col">
                      <textarea
                        ref={answerInputRef}
                        className="bg-white border-b-2 border-gray-300 text-[#303345] text-lg px-2 py-2 focus:outline-none focus:border-[#1f53f3] w-full overflow-hidden"
                        placeholder="Definition"
                        value={card.answer}
                        onChange={(e) => handleTextareaChange(index, "answer", e)}
                        onKeyDown={(e) => handleKeyDown(index, "answer", e)}
                        data-card-index={index}
                        data-field="answer"
                        rows="1"
                      />
                      <span className="mt-2 text-xs text-[#303345]">DEFINITION</span>
                      {/* Image button */}
                      <label className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center text-gray-500 hover:bg-blue-50 cursor-pointer w-32">
                        <ImageIcon className="mr-2" /> Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(index, "imageA", e.target.files[0])}
                        />
                      </label>
                      {card.imageA && (
                        <span className="text-xs text-green-500 mt-1">Selected: {card.imageA.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Add Card Button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleAddCard}
                variant="outline"
                className="border-gray-300 text-[#303345] bg-white hover:bg-gray-100"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
