import React, { useState, useEffect } from "react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import CircularProgress from "@/components/common/CircularProgress";
import SpacedRepetitionChart from "@/components/features/flashcard/SpacedRepetitionChart";
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
  ArrowLeft,
  Pencil,
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
import ReviewCards from "@/components/features/flashcard/ReviewCards";
import { flashcardAPI } from "@/api";
import { toast } from "sonner";
import EditDeck from "@/components/features/flashcard/EditDeck";
import EditCard from "@/components/features/flashcard/EditCard";
import DeleteCardConfirm from "@/components/features/flashcard/DeleteCardConfirm";

export default function FlashCards() {
  const navigate = useNavigate();
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [showBulkSuccess, setShowBulkSuccess] = useState(false);
  const [bulkCardCount, setBulkCardCount] = useState(0);
  const [activeTab, setActiveTab] = useState("decks");
  const [loading, setLoading] = useState(true);
  const [allCards, setAllCards] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [editingDeckName, setEditingDeckName] = useState("");
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingCardQuestion, setEditingCardQuestion] = useState("");
  const [editingCardAnswer, setEditingCardAnswer] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingGroupTitle, setEditingGroupTitle] = useState(null);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [deletingGroupTitle, setDeletingGroupTitle] = useState(null);

  // Fetch cards when selectedDeckId changes
  useEffect(() => {
    setSelectedTitle(null);
    if (!selectedDeckId || selectedDeckId === "") {
      setCards(allCards);
    } else {
      fetchCards(selectedDeckId);
    }
  }, [selectedDeckId, allCards]);

  // Fetch decks and cards on component mount
  useEffect(() => {
    fetchDecks();
    fetchDueCards();
  }, []);

  // Fetch all cards when component mounts
  useEffect(() => {
    fetchAllCards();
  }, []);

  // Fetch decks
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

  // Fetch cards for a specific deck
  const fetchCards = async (deckId) => {
    try {
      setLoading(true);
      const response = await flashcardAPI.getCardsInDeck(deckId);
      setCards(response?.data || []); // Add fallback to empty array
    } catch (error) {
      toast.error(error.message || "Failed to fetch cards");
      setCards([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch due cards
  const fetchDueCards = async () => {
    try {
      setLoading(true);
      console.log("Fetching due cards...");
      const response = await flashcardAPI.getDueCards();
      console.log("Due cards response:", response);

      if (response?.data) {
        setCards(response.data);
      } else {
        console.warn("No data in due cards response");
        setCards([]);
      }
    } catch (error) {
      console.error("Error fetching due cards:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch due cards"
      );
      setCards([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch all cards from all decks
  const fetchAllCards = async () => {
    try {
      setLoading(true);
      console.log("Fetching all cards...");
      const decksResponse = await flashcardAPI.getDecks();
      const decks = decksResponse.data;
      console.log("Fetched decks:", decks);

      // Fetch cards for each deck
      const allCardsPromises = decks.map((deck) =>
        flashcardAPI.getCardsInDeck(deck.id)
      );

      const cardsResponses = await Promise.all(allCardsPromises);
      console.log("Cards responses:", cardsResponses);

      const allCards = cardsResponses.flatMap(
        (response) => response.data || []
      );
      console.log("All cards:", allCards);

      setAllCards(allCards);
    } catch (error) {
      console.error("Error fetching all cards:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch cards"
      );
      setAllCards([]);
    } finally {
      setLoading(false);
    }
  };

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
    return matchesSearch;
  });

  // Handle creating a new deck
  const handleCreateDeck = async () => {
    if (newDeckName.trim()) {
      try {
        const response = await flashcardAPI.createDeck({ name: newDeckName });
        toast.success("Deck created successfully");
        setDecks([...decks, response.data]);
        setNewDeckName("");
        setIsCreatingDeck(false);
      } catch (error) {
        toast.error(error.message || "Failed to create deck");
      }
    }
  };

  // Handle deleting a card
  const handleDeleteCard = async (cardId) => {
    try {
      await flashcardAPI.deleteCard(cardId);
      toast.success("Card deleted successfully");
      setCards(cards.filter((card) => card.id !== cardId));
      // Update deck card count
      const updatedDecks = decks.map((deck) => {
        if (deck.id === selectedDeckId) {
          return {
            ...deck,
            cardCount: deck.cardCount - 1,
          };
        }
        return deck;
      });
      setDecks(updatedDecks);
    } catch (error) {
      toast.error(error.message || "Failed to delete card");
    }
  };

  // Handle deleting a deck
  const handleDeleteDeck = async (deckId) => {
    try {
      await flashcardAPI.deleteDeck(deckId);
      toast.success("Deck deleted successfully");
      setDecks(decks.filter((deck) => deck.id !== deckId));
      setCards(cards.filter((card) => card.deckId !== deckId));
    } catch (error) {
      toast.error(error.message || "Failed to delete deck");
    }
  };

  // Calculate dashboard statistics from all cards
  const totalCards = allCards.length;
  const dueCards = allCards.filter(
    (card) => card.status === "due" || card.status === "new"
  ).length;
  const learnedCards = allCards.filter(
    (card) => card.status === "learned"
  ).length;

  // Calculate retention score
  const calculateRetentionScore = (cards) => {
    if (!cards || cards.length === 0) return 0;

    const weights = {
      learned: 1.0,
      due: 0.5,
      new: 0.2,
    };

    const totalWeight = cards.reduce(
      (sum, card) => sum + (weights[card.status] || 0),
      0
    );

    const maxPossibleWeight = cards.length * weights.learned;
    return Math.round((totalWeight / maxPossibleWeight) * 100) || 0;
  };

  const retentionScore = calculateRetentionScore(allCards);
  const maxRetentionScore = 100;

  // Calculate spaced repetition data
  const getSpacedRepetitionData = (cards) => {
    const uniqueIntervals = Array.from(
      new Set(cards.map((card) => card.interval))
    ).sort((a, b) => a - b);
    return uniqueIntervals.map((interval) => ({
      interval,
      count: cards.filter((card) => card.interval === interval).length,
    }));
  };

  const spacedRepetitionData = getSpacedRepetitionData(allCards);

  // Handle starting study session
  const handleStartStudy = async (deckId) => {
    try {
      setLoading(true);
      let cardsToStudy;

      if (deckId) {
        // If studying a specific deck, get cards from that deck
        const response = await flashcardAPI.getCardsInDeck(deckId);
        cardsToStudy = response.data;
      } else {
        // If studying all due cards
        const response = await flashcardAPI.getDueCards();
        cardsToStudy = response.data;
      }

      if (!cardsToStudy || cardsToStudy.length === 0) {
        toast.info("No cards available for study");
        return;
      }

      const deckName = deckId
        ? decks.find((d) => d.id === deckId)?.name
        : "All Cards";

      navigate("/student/flashcards/study", {
        state: {
          cards: cardsToStudy,
          deckId,
          deckName,
        },
      });
    } catch (error) {
      toast.error(error.message || "Failed to start study session");
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm group cards theo cardSetTitle
  const groupCardsBySetTitle = (cards) => {
    const groups = {};
    cards.forEach((card) => {
      const title = card.cardSetTitle || "No Title";
      if (!groups[title]) groups[title] = [];
      groups[title].push(card);
    });
    return groups;
  };

  // Add handleEditDeck function
  const handleEditDeck = async (deckId, newName) => {
    try {
      await flashcardAPI.updateDeck(deckId, { name: newName });
      setDecks(decks.map(deck => 
        deck.id === deckId ? { ...deck, name: newName } : deck
      ));
      setEditingDeckId(null);
      setEditingDeckName("");
      toast.success("Deck name updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update deck name");
    }
  };

  const handleDeckUpdated = (deckId, newName) => {
    setDecks(prevDecks =>
      prevDecks.map(deck =>
        deck.id === deckId ? { ...deck, name: newName } : deck
      )
    );
  };

  const handleEditCardSave = async () => {
    try {
      await flashcardAPI.updateCard(editingCardId, {
        question: editingCardQuestion,
        answer: editingCardAnswer,
      });
      setCards(prev => prev.map(card => card.id === editingCardId ? { ...card, question: editingCardQuestion, answer: editingCardAnswer } : card));
      setEditingCardId(null);
      toast.success("Card updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update card");
    }
  };

  const handleDeleteCardConfirm = async () => {
    try {
      await flashcardAPI.deleteCard(editingCardId);
      setCards(prev => prev.filter(card => card.id !== editingCardId));
      setEditingCardId(null);
      setShowDeleteDialog(false);
      toast.success("Card deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete card");
    }
  };

  const handleEditGroupTitle = async () => {
    try {
      await flashcardAPI.updateCardGroupTitle({ oldTitle: editingGroupTitle, newTitle: newGroupTitle });
      toast.success("Group title updated");
      setEditingGroupTitle(null);
      setNewGroupTitle("");
      fetchAllCards();
    } catch (error) {
      toast.error(error.message || "Failed to update group title");
    }
  };

  const handleDeleteGroupTitle = async () => {
    try {
      await flashcardAPI.deleteCardGroupByTitle(deletingGroupTitle);
      toast.success("Group deleted");
      setDeletingGroupTitle(null);
      fetchAllCards();
    } catch (error) {
      toast.error(error.message || "Failed to delete group");
    }
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
                
              </div>

              <ReviewCards
                cards={allCards.filter(
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
                          <div className="relative inline-block">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="fixed z-[9999] bg-white shadow-lg rounded-md border border-gray-200 min-w-[160px] p-1"
                                sideOffset={5}
                                alignOffset={0}
                                style={{
                                  position: 'fixed',
                                  transform: 'translate3d(0, 0, 0)',
                                  willChange: 'transform'
                                }}
                              >
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    setEditingDeckId(deck.id);
                                    setEditingDeckName(deck.name);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteDeck(deck.id)} 
                                  className="text-red-500 cursor-pointer hover:bg-gray-100 px-2 py-1.5 text-sm flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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
                    {decks?.map((deck) => (
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
                      disabled={!cards?.length}
                    >
                      Study Selected Deck
                    </Button>
                  )}
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : selectedTitle === null ? (
                  Object.keys(groupCardsBySetTitle(filteredCards)).length ===
                  0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No card sets in this deck.
                      </p>
                    </div>
                  ) : (
                    Object.entries(groupCardsBySetTitle(filteredCards)).map(
                      ([title, cardsInGroup]) => (
                        <div
                          key={title}
                          className="mb-4 cursor-pointer hover:bg-blue-50 rounded p-4 border"
                          onClick={() => setSelectedTitle(title)}
                        >
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold">{title}</h2>
                            <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); setEditingGroupTitle(title); setNewGroupTitle(title); }}>
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); setDeletingGroupTitle(title); }}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          <span className="text-sm text-gray-500">
                            {cardsInGroup.length} cards
                          </span>
                        </div>
                      )
                    )
                  )
                ) : (
                  <div>
                    <Button
                      onClick={() => setSelectedTitle(null)}
                      variant="outline"
                      className="mb-4 flex items-center gap-2 border-gray-300 text-[#303345] hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Card Sets
                    </Button>
                    <h2 className="text-xl font-bold mb-4">{selectedTitle}</h2>
                    <div className="space-y-3">
                      {groupCardsBySetTitle(filteredCards)[selectedTitle].map(
                        (card) => (
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
                                  <Badge
                                    variant="outline"
                                    className="ml-2 mb-2"
                                  >
                                    {card.type === "basic"
                                      ? "Basic"
                                      : card.type === "cloze"
                                      ? "Cloze"
                                      : "Image"}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-gray-100"
                                    onClick={() => {
                                      setEditingCardId(card.id);
                                      setEditingCardQuestion(card.question);
                                      setEditingCardAnswer(card.answer);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 text-gray-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-gray-100"
                                    onClick={() => { setEditingCardId(card.id); setShowDeleteDialog(true); }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {card.type === "basic" ? (
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="flex-1 bg-blue-50 rounded-md p-4">
                                    <h3 className="font-medium mb-1 text-blue-700">Question</h3>
                                    <p>{card.question}</p>
                                  </div>
                                  <div className="flex-1 bg-green-50 rounded-md p-4">
                                    <h3 className="font-medium mb-1 text-green-700">Answer</h3>
                                    <p>{card.answer}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="flex-1 bg-blue-50 rounded-md p-4">
                                    <h3 className="font-medium mb-1 text-blue-700">Question</h3>
                                    <p>{card.question}</p>
                                    {card.imageUrl && (
                                      <img
                                        src={card.imageUrl || "/placeholder.svg"}
                                        alt="Card image"
                                        className="my-2 max-h-[200px] object-contain rounded-md" 
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 bg-green-50 rounded-md p-4">
                                    <h3 className="font-medium mb-1 text-green-700">Answer</h3>
                                    <p>{card.answer}</p>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="flex flex-wrap gap-1 pt-0">
                              <div className="flex items-center text-xs text-gray-500 mr-3">
                                <Tag className="h-3 w-3 mr-1" />
                                {card.tags?.map((tag, index) => (
                                  <span key={index} className="mr-1">
                                    {tag}
                                    {index < card.tags.length - 1 ? "," : ""}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <span className="mr-2">
                                  Interval: {card.interval || 0} days
                                </span>
                                <span>
                                  Ease: {(card.easeFactor || 2.5).toFixed(1)}
                                </span>
                              </div>
                            </CardFooter>
                          </Card>
                        )
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Edit Deck Modal */}
            <EditDeck
              isOpen={!!editingDeckId}
              onClose={() => {
                setEditingDeckId(null);
                setEditingDeckName("");
              }}
              deckId={editingDeckId}
              currentName={editingDeckName}
              onDeckUpdated={handleDeckUpdated}
            />

            {/* Edit Card */}
            <EditCard
              open={!!editingCardId && !showDeleteDialog}
              onClose={() => setEditingCardId(null)}
              question={editingCardQuestion}
              answer={editingCardAnswer}
              onChangeQuestion={setEditingCardQuestion}
              onChangeAnswer={setEditingCardAnswer}
              onSave={handleEditCardSave}
            />

            {/* Delete Card Confirm */}
            <DeleteCardConfirm
              open={showDeleteDialog}
              onClose={() => {
                setShowDeleteDialog(false);
                setEditingCardId(null);
              }}
              onConfirm={handleDeleteCardConfirm}
            />

            {/* Edit Group Title */}
            <Dialog open={!!editingGroupTitle} onOpenChange={open => { if (!open) setEditingGroupTitle(null); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Group Title</DialogTitle>
                </DialogHeader>
                <Input value={newGroupTitle} onChange={e => setNewGroupTitle(e.target.value)} />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setEditingGroupTitle(null)}>Cancel</Button>
                  <Button className="bg-[#1f53f3] text-white" onClick={handleEditGroupTitle}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Group Title */}
            <Dialog open={!!deletingGroupTitle} onOpenChange={open => { if (!open) setDeletingGroupTitle(null); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Group</DialogTitle>
                </DialogHeader>
                <div className="py-4">Are you sure you want to delete all cards in group "{deletingGroupTitle}"?</div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDeletingGroupTitle(null)}>Cancel</Button>
                  <Button className="bg-red-500 text-white" onClick={handleDeleteGroupTitle}>Delete</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
