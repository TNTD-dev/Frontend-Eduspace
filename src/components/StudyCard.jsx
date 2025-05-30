import React, { useState } from 'react';
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
  HelpCircle
} from "lucide-react";

const StudyCard = ({ card, onComplete, onSkip }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRating = (rating) => {
    setSelectedRating(rating);
    onComplete({
      cardId: card.id,
      performance: rating,
      timeSpent
    });
  };

  const getPerformanceLabel = (rating) => {
    switch (rating) {
      case 'excellent': return 'Perfect!';
      case 'good': return 'Good';
      case 'medium': return 'Hard';
      case 'poor': return 'Failed';
      default: return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={timeSpent} max={300} className="h-2" />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Time: {timeSpent}s</span>
          <span>Max: 5m</span>
        </div>
      </div>

      {/* Card */}
      <Card className="p-6 mb-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{card.question}</h2>
          
          {showAnswer ? (
            <div className="space-y-4">
              <p className="text-lg">{card.answer}</p>
              
              {/* Rating Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleRating('poor')}
                >
                  <XCircle className="h-5 w-5 text-red-500" />
                  Failed
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleRating('medium')}
                >
                  <HelpCircle className="h-5 w-5 text-yellow-500" />
                  Hard
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleRating('good')}
                >
                  <ThumbsUp className="h-5 w-5 text-blue-500" />
                  Good
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleRating('excellent')}
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Perfect
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowAnswer(true)}
              className="mt-4"
            >
              Show Answer
            </Button>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onSkip}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Skip
        </Button>
        <Button
          variant="outline"
          onClick={() => setTimeSpent(0)}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          Reset Timer
        </Button>
      </div>
    </div>
  );
};

export default StudyCard; 