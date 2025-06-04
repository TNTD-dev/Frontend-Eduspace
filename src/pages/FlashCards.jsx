import React, { useState } from "react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import { mockCards } from "@/data/mock/cardData";
import { mockDecks } from "@/data/mock/deckData";
import CircularProgress from "@/components/CircularProgress";
import SpacedRepetitionChart from "@/components/SpacedRepetitionChart";
import {
  PlusCircle,
  FolderPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import ReviewCards from "@/components/ReviewCards";

export default function FlashCards() {
  const navigate = useNavigate();
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [decks, setDecks] = useState(mockDecks);
  const [cards, setCards] = useState(mockCards);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [showBulkSuccess, setShowBulkSuccess] = useState(false);
  const [bulkCardCount, setBulkCardCount] = useState(0);
  const [activeTab, setActiveTab] = useState("decks");

  // Filter cards based on search query and selected deck
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      searchQuery === "" ||
      (card.type === "basic" &&
        (card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.answer.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (card.type === "cloze" &&
        card.clozeText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      card.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDeck =
      selectedDeckId === null || card.deckId === selectedDeckId;

    return matchesSearch && matchesDeck;
  });

  // Handle creating a new deck
  const handleCreateDeck = () => {
    if (newDeckName.trim()) {
      const newDeck = {
        id: `deck${decks.length + 1}`,
        name: newDeckName,
        cardCount: 0,
        dueCount: 0,
        lastStudied: "Never",
      };
      setDecks([...decks, newDeck]);
      setNewDeckName("");
      setIsCreatingDeck(false);
    }
  };

  // Handle deleting a card
  const handleDeleteCard = (cardId) => {
    const cardToDelete = cards.find((card) => card.id === cardId);
    if (cardToDelete) {
      setDecks(
        decks.map((deck) => {
          if (deck.id === cardToDelete.deckId) {
            return {
              ...deck,
              cardCount: Math.max(0, deck.cardCount - 1),
              dueCount:
                cardToDelete.status === "due"
                  ? Math.max(0, deck.dueCount - 1)
                  : deck.dueCount,
            };
          }
          return deck;
        })
      );
    }
    setCards(cards.filter((card) => card.id !== cardId));
  };

  // Handle deleting a deck
  const handleDeleteDeck = (deckId) => {
    setDecks(decks.filter((deck) => deck.id !== deckId));
    setCards(cards.filter((card) => card.deckId !== deckId));
  };

  // Calculate dashboard statistics
  const totalCards = cards.length;
  const dueCards = cards.filter(
    (card) => card.status === "due" || card.status === "new"
  ).length;
  const learnedCards = cards.filter((card) => card.status === "learned").length;

  // Calculate retention score
  const calculateRetentionScore = (cards) => {
    const weights = {
      learned: 1.0,
      due: 0.5,
      new: 0.2,
    };
    const totalWeight = cards.reduce(
      (sum, card) => sum + weights[card.status],
      0
    );
    const maxPossibleWeight = cards.length * weights.learned;
    return Math.round((totalWeight / maxPossibleWeight) * 100);
  };

  const retentionScore = calculateRetentionScore(cards);
  const maxRetentionScore = 100;

  // Calculate spaced repetition data
  const getSpacedRepetitionData = (cards) => {
    const intervals = [0, 1, 3, 7, 14, 30, 60];
    const data = intervals.map((interval) => ({
      interval,
      count: cards.filter((card) => card.interval === interval).length,
    }));
    return data;
  };

  const spacedRepetitionData = getSpacedRepetitionData(cards);

  // Handle starting study session
  const handleStartStudy = (deckId) => {
    const cardsToStudy = cards.filter(
      (card) =>
        (card.status === "due" || card.status === "new") &&
        (!deckId || card.deckId === deckId)
    );

    if (cardsToStudy.length === 0) {
      return;
    }

    const deckName = deckId ? decks.find((d) => d.id === deckId)?.name : null;

    navigate("/student/flashcards/study", {
      state: {
        cards: cardsToStudy,
        deckId,
        deckName,
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />

            {/* Success Alert */}
            {showBulkSuccess && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <PlusCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  {bulkCardCount} flashcards have been created successfully.
                </AlertDescription>
              </Alert>
            )}

            {/* Header with Buttons */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#303345]">Flashcards</h1>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/student/flashcards/create-card")}
                  className="bg-[#1f53f3] hover:bg-[#1f53f3]/90 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Cards
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingDeck(true)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Deck
                </Button>
              </div>
            </div>

            {/* Create Deck Modal */}
            <Dialog open={isCreatingDeck} onOpenChange={setIsCreatingDeck}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Deck</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="deckName">Deck Name</Label>
                    <Input
                      id="deckName"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      placeholder="Enter deck name"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingDeck(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#1f53f3] hover:bg-[#1f53f3]/90 text-white"
                    onClick={handleCreateDeck}
                  >
                    Create Deck
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Dashboard Stats */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Due Cards */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <CircularProgress
                    value={dueCards}
                    maxValue={totalCards}
                    color="#F59E0B"
                    label="Due Cards"
                  />
                </div>
              </div>

              {/* Learned Cards */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <CircularProgress
                    value={learnedCards}
                    maxValue={totalCards}
                    color="#10B981"
                    label="Learned Cards"
                  />
                </div>
              </div>

              {/* Retention Score */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <CircularProgress
                    value={retentionScore}
                    maxValue={maxRetentionScore}
                    color="#3B82F6"
                    label="Retention Score"
                  />
                </div>
              </div>
            </div>

            {/* Spaced Repetition Chart */}
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <SpacedRepetitionChart data={spacedRepetitionData} />
            </div>

            {/* Today's Review Cards */}
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#303345]">
                    Today's Review
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {dueCards} cards due for review today
                  </p>
                </div>
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleStartStudy(null)}
                  disabled={dueCards === 0}
                >
                  Start Review
                </Button>
              </div>

              <ReviewCards
                cards={cards.filter(
                  (card) => card.status === "due" || card.status === "new"
                )}
                onStartReview={handleStartStudy}
                onDeleteCard={handleDeleteCard}
              />
            </div>

            {/* Decks and Cards Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full mt-8"
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="decks" className="px-6">
                    Decks
                  </TabsTrigger>
                  <TabsTrigger value="cards" className="px-6">
                    Cards
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="decks" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {decks.map((deck) => (
                    <Card key={deck.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{deck.name}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDeck(deck.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription>
                          <div className="flex items-center gap-1 text-sm">
                            <BookOpen className="h-3.5 w-3.5" />
                            {deck.cardCount} cards
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-amber-500 font-medium">
                              {deck.dueCount} due
                            </span>
                          </div>
                          <div className="text-gray-500">
                            Last studied: {deck.lastStudied}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDeckId(deck.id);
                            setActiveTab("cards");
                          }}
                        >
                          View Cards
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => handleStartStudy(deck.id)}
                          disabled={deck.cardCount === 0}
                        >
                          Study Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="cards" className="mt-0">
                <div className="mb-4 flex items-center gap-2">
                  <select
                    className="border rounded-md px-3 py-1.5 text-sm"
                    value={selectedDeckId || ""}
                    onChange={(e) => setSelectedDeckId(e.target.value || null)}
                  >
                    <option value="">All Decks</option>
                    {decks.map((deck) => (
                      <option key={deck.id} value={deck.id}>
                        {deck.name}
                      </option>
                    ))}
                  </select>

                  {selectedDeckId && (
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 ml-auto"
                      onClick={() => handleStartStudy(selectedDeckId)}
                      disabled={
                        decks.find((d) => d.id === selectedDeckId)
                          ?.cardCount === 0
                      }
                    >
                      Study Selected Deck
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {filteredCards.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No cards found. Create a new card or adjust your
                        filters.
                      </p>
                      <Button
                        onClick={() =>
                          navigate("/student/flashcards/create-card")
                        }
                        className="mt-4 bg-green-500 hover:bg-green-600"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Cards
                      </Button>
                    </div>
                  ) : (
                    filteredCards.map((card) => (
                      <Card key={card.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <Badge
                                variant="outline"
                                className={`mb-2 ${
                                  card.status === "due"
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : card.status === "learned"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-blue-100 text-blue-800 border-blue-200"
                                }`}
                              >
                                {card.status === "due"
                                  ? "Due for review"
                                  : card.status === "learned"
                                  ? "Learned"
                                  : "New"}
                              </Badge>
                              <Badge variant="outline" className="ml-2 mb-2">
                                {card.type === "basic"
                                  ? "Basic"
                                  : card.type === "cloze"
                                  ? "Cloze"
                                  : "Image"}
                              </Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {card.type === "basic" ? (
                            <div>
                              <h3 className="font-medium mb-1">Question:</h3>
                              <p className="mb-3">{card.question}</p>
                              <h3 className="font-medium mb-1">Answer:</h3>
                              <p>{card.answer}</p>
                            </div>
                          ) : card.type === "cloze" ? (
                            <div>
                              <h3 className="font-medium mb-1">Cloze:</h3>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: card.clozeText.replace(
                                    /\{\{([^}]+)\}\}/g,
                                    '<span class="bg-blue-200 px-1 rounded">$1</span>'
                                  ),
                                }}
                              ></p>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-medium mb-1">
                                Image Question:
                              </h3>
                              <p>{card.question}</p>
                              {card.imageUrl && (
                                <img
                                  src={card.imageUrl || "/placeholder.svg"}
                                  alt="Card image"
                                  className="my-2 max-h-[200px] object-contain rounded-md"
                                />
                              )}
                              <h3 className="font-medium mb-1 mt-3">Answer:</h3>
                              <p>{card.answer}</p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex flex-wrap gap-1 pt-0">
                          <div className="flex items-center text-xs text-gray-500 mr-3">
                            <Tag className="h-3 w-3 mr-1" />
                            {card.tags.map((tag, index) => (
                              <span key={index} className="mr-1">
                                {tag}
                                {index < card.tags.length - 1 ? "," : ""}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-2">
                              Interval: {card.interval} days
                            </span>
                            <span>Ease: {card.easeFactor.toFixed(1)}</span>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
