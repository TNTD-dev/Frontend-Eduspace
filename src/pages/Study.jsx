import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";

const Study = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cards: initialCards, deckId, deckName } = location.state || { cards: [], deckId: null, deckName: null };

  const [cards, setCards] = useState(initialCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [studyHistory, setStudyHistory] = useState([]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRating = (rating) => {
    const currentCard = cards[currentCardIndex];
    const studyRecord = {
      cardId: currentCard.id,
      performance: rating,
      timeSpent,
      date: new Date().toISOString()
    };

    setStudyHistory([...studyHistory, studyRecord]);

    // Move to next card or end study session
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
      setTimeSpent(0);
    } else {
      // End study session
      navigate('/student/flashcards', {
        state: {
          studyHistory,
          completed: true
        }
      });
    }
  };

  const handleSkip = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
      setTimeSpent(0);
    } else {
      navigate('/student/flashcards', {
        state: {
          studyHistory,
          completed: true
        }
      });
    }
  };

  const handleEndSession = () => {
    navigate('/student/flashcards', {
      state: {
        studyHistory,
        completed: true
      }
    });
  };

  const currentCard = cards[currentCardIndex];

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleEndSession}
                  className="hover:bg-gray-100 text-[#303345]"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Flashcards
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-[#303345]">
                    Studying {deckName || 'All Cards'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Card {currentCardIndex + 1} of {cards.length}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleEndSession}
              >
                End Session
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <Progress value={(currentCardIndex / cards.length) * 100} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Time: {timeSpent}s</span>
                <span>Progress: {currentCardIndex + 1}/{cards.length}</span>
              </div>
            </div>

            {/* Card Container */}
            <div className="flex justify-center mb-8">
              <div 
                className={`relative w-full max-w-2xl h-[400px] perspective-1000`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className={`flip-inner w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'flipped' : ''}`}> 
                  {/* Front of card */}
                  <div className="flip-face flip-front absolute w-full h-full backface-hidden">
                    <Card className="w-full h-full flex items-center justify-center p-8 bg-white border-2 border-[#1f53f3] shadow-lg rounded-xl">
                      <div className="text-center">
                        <h2 className="text-2xl font-semibold text-[#303345] mb-4">
                          {currentCard.question}
                        </h2>
                        <p className="text-gray-500">Click to flip</p>
                      </div>
                    </Card>
                  </div>
                  {/* Back of card */}
                  <div className="flip-face flip-back absolute w-full h-full backface-hidden">
                    <Card className="w-full h-full flex flex-col items-center justify-center p-8 bg-white border-2 border-[#1f53f3] shadow-lg rounded-xl">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-[#303345] mb-4">
                          {currentCard.answer}
                        </h2>
                        <p className="text-gray-500">Click to flip back</p>
                      </div>
                      {/* Rating Buttons */}
                      <div className="flex justify-center gap-4">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          onClick={e => { e.stopPropagation(); handleRating('poor'); }}
                        >
                          <XCircle className="h-5 w-5 text-red-500" />
                          Failed
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200"
                          onClick={e => { e.stopPropagation(); handleRating('medium'); }}
                        >
                          <HelpCircle className="h-5 w-5 text-yellow-500" />
                          Hard
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                          onClick={e => { e.stopPropagation(); handleRating('good'); }}
                        >
                          <ThumbsUp className="h-5 w-5 text-blue-500" />
                          Good
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                          onClick={e => { e.stopPropagation(); handleRating('excellent'); }}
                        >
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          Perfect
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                Skip
              </Button>
              <Button
                variant="outline"
                onClick={() => setTimeSpent(0)}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <Clock className="h-4 w-4" />
                Reset Timer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }
        .flip-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .flip-front {
          transform: rotateX(0deg);
        }
        .flip-back {
          transform: rotateX(180deg);
        }
        .flipped {
          transform: rotateX(180deg);
        }
      `}</style>
    </div>
  );
};

export default Study; 