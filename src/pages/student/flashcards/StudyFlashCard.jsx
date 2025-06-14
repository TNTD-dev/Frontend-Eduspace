import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  RefreshCw,
} from "lucide-react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import CircularProgress from "@/components/common/CircularProgress";
import { flashcardAPI } from "@/api";
import { toast } from "sonner";

const Study = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cards: initialCards,
    deckId,
    deckName,
  } = location.state || { cards: [], deckId: null, deckName: null };

  const [cards, setCards] = useState(initialCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [studyHistory, setStudyHistory] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!showSummary) {
      const timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSummary]);

  const handleRating = async (rating) => {
    try {
      setLoading(true);
      const currentCard = cards[currentCardIndex];
      
      // Map UI ratings to API status
      const statusMap = {
        'excellent': 'perfect',
        'good': 'good',
        'medium': 'hard',
        'poor': 'failed'
      };

      // Call API to update card progress
      await flashcardAPI.studyCard(currentCard.id, {
        status: statusMap[rating],
        timeSpent
      });

      const studyRecord = { 
        cardId: currentCard.id,
        performance: rating,
        timeSpent,
        date: new Date().toISOString(),
      };

      setStudyHistory([...studyHistory, studyRecord]);

      // Move to next card or show summary
      if (currentCardIndex < cards.length - 1) {
        setIsFlipped(false);
        setTimeSpent(0);
        setCurrentCardIndex((prev) => prev + 1);
      } else {
        setShowSummary(true);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update card progress");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (currentCardIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeSpent(0);
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      const hasStudiedAnyCard = studyHistory.length > 0 || currentCardIndex > 0;
      
      if (hasStudiedAnyCard) {
        setShowSummary(true);
      } else {
        navigate("/student/flashcards");
      }
    }
  };

  const handleEndSession = () => {
    const hasStudiedAnyCard = studyHistory.length > 0 || currentCardIndex > 0;
    
    if (hasStudiedAnyCard) {
      setShowSummary(true);
    } else {
      navigate("/student/flashcards");
    }
  };

  const handleBackToFlashcards = () => {
    const hasStudiedAnyCard = studyHistory.length > 0 || currentCardIndex > 0;
    
    if (!hasStudiedAnyCard) {
      navigate("/student/flashcards");
      return;
    }

    navigate("/student/flashcards", {
      state: {
        studyHistory,
        completed: true,
      },
    });
  };

  const handleStudyAgain = async () => {
    try {
      setLoading(true);
      // Fetch due cards again
      const response = await flashcardAPI.getDueCards();
      setCards(response.data);
      setShowSummary(false);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setTimeSpent(0);
      setStudyHistory([]);
    } catch (error) {
      toast.error(error.message || "Failed to fetch cards for study");
    } finally {
      setLoading(false);
    }
  };

  const currentCard = cards[currentCardIndex];

  // Calculate summary statistics
  const totalCards = cards.length;
  const studiedCards = studyHistory.length;
  const totalTime = studyHistory.reduce((acc, record) => acc + record.timeSpent, 0);
  const performanceCounts = studyHistory.reduce((acc, record) => {
    acc[record.performance] = (acc[record.performance] || 0) + 1;
    return acc;
  }, {});

  // Calculate performance percentages
  const perfectPercentage = ((performanceCounts.excellent || 0) / totalCards) * 100;
  const goodPercentage = ((performanceCounts.good || 0) / totalCards) * 100;
  const hardPercentage = ((performanceCounts.medium || 0) / totalCards) * 100;
  const failedPercentage = ((performanceCounts.poor || 0) / totalCards) * 100;

  if (showSummary) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarStudent />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              
              {/* Summary Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleBackToFlashcards}
                    className="hover:bg-gray-100 text-[#303345]"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Flashcards
                  </Button>
                  <h1 className="text-2xl font-bold text-[#303345]">
                    Study Summary
                  </h1>
                </div>
              </div>

              {/* Summary Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Statistics Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Study Statistics</h2>
                  <div className="flex justify-center">
                    <CircularProgress
                      value={studiedCards}
                      maxValue={totalCards}
                      color="#1f53f3"
                      label="Cards Studied"
                    />
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Time:</span>
                      <span className="font-medium">
                        {Math.floor(totalTime / 60)}m {totalTime % 60}s
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Time per Card:</span>
                      <span className="font-medium">
                        {Math.floor((totalTime / totalCards) / 60)}m {Math.floor((totalTime / totalCards) % 60)}s
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Performance Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Performance Analysis</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <CircularProgress
                      value={performanceCounts.excellent || 0}
                      maxValue={totalCards}
                      color="#10b981"
                      label="Perfect"
                    />
                    <CircularProgress
                      value={performanceCounts.good || 0}
                      maxValue={totalCards}
                      color="#3b82f6"
                      label="Good"
                    />
                    <CircularProgress
                      value={performanceCounts.medium || 0}
                      maxValue={totalCards}
                      color="#f59e0b"
                      label="Hard"
                    />
                    <CircularProgress
                      value={performanceCounts.poor || 0}
                      maxValue={totalCards}
                      color="#ef4444"
                      label="Failed"
                    />
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium text-green-600">
                        {Math.round(((performanceCounts.excellent || 0) + (performanceCounts.good || 0)) / totalCards * 100)}%
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleStudyAgain}
                  className="flex items-center gap-2 bg-[#1f53f3] text-white hover:bg-[#1a47d9]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Study Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    Studying {deckName || "All Cards"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Card {currentCardIndex + 1} of {cards.length}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleEndSession}>
                End Session
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <Progress
                value={(currentCardIndex / cards.length) * 100}
                className="h-2 [&>div]:bg-[#1f53f3]" // Added progress color with all divs 
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Time: {timeSpent}s</span>
                <span>
                  Progress: {currentCardIndex + 1}/{cards.length}
                </span>
              </div>
            </div>

            {/* Card Container */}
            <div className="flex justify-center mb-8">
              <div
                className="relative w-full max-w-2xl h-[400px] [perspective:1000px]"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className={`relative w-full h-full [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateX(180deg)]" : ""
                  }`}
                  style={{
                    transition: isFlipped 
                      ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
                      : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Front of card */}
                  <div className="absolute w-full h-full [backface-visibility:hidden]">
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
                  <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateX(180deg)]">
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                            setTimeout(() => handleRating("poor"), 100);
                          }}
                          disabled={loading}
                        >
                          <XCircle className="h-5 w-5 text-red-500" />
                          Failed
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                            setTimeout(() => handleRating("medium"), 100);
                          }}
                          disabled={loading}
                        >
                          <HelpCircle className="h-5 w-5 text-yellow-500" />
                          Hard
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                            setTimeout(() => handleRating("good"), 100);
                          }}
                          disabled={loading}
                        >
                          <ThumbsUp className="h-5 w-5 text-blue-500" />
                          Good
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                            setTimeout(() => handleRating("excellent"), 100);
                          }}
                          disabled={loading}
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
  
    </div>
  );
};

export default Study;
