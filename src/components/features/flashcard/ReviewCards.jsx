import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const ReviewCards = ({ cards, onStartReview, onDeleteCard }) => {
  // Group cards by cardSetTitle only
  const [groupedCards, setGroupedCards] = useState({});
  
  useEffect(() => {
    const grouped = cards.reduce((acc, card) => {
      const key = card.cardSetTitle || "No Title";
      if (!acc[key]) {
        acc[key] = {
          cardSetTitle: card.cardSetTitle,
          cards: []
        };
      }
      acc[key].cards.push(card);
      return acc;
    }, {});
    setGroupedCards(grouped);
  }, [cards]);

  

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Card Groups by Title */}
      {Object.entries(groupedCards).map(([key, group]) => (
        <div key={key} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-[#303345]">{group.cardSetTitle || "No Title"}</h3>
              <Badge variant="outline" className="bg-blue-50">
                {group.cards.length} cards
              </Badge>
            </div>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => onStartReview(group.cards[0]?.deckId, group.cardSetTitle)}
              disabled={group.cards.length === 0}
            >
              Study Now
            </Button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Badge
                    variant="outline"
                    className={`${
                      card.status === "due"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }`}
                  >
                    {card.status === "due" ? "Due" : "New"}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#303345] truncate">{card.question}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span title={`Next review: ${card.nextReview ? new Date(card.nextReview).toLocaleString() : 'Never'}`}>
                        {card.nextReview ? formatDate(card.nextReview) : '-'}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteCard(card.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      {cards.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No cards due for review today</p>
          <Button variant="outline">View All Cards</Button>
        </div>
      )}
    </div>
  );
};

export default ReviewCards; 