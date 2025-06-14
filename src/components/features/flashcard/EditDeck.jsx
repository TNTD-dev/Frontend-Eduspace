import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { flashcardAPI } from "@/api";

const EditDeck = ({ 
  isOpen, 
  onClose, 
  deckId, 
  currentName, 
  onDeckUpdated 
}) => {
  const [deckName, setDeckName] = React.useState(currentName);

  // Reset deck name when dialog opens with new deck
  React.useEffect(() => {
    setDeckName(currentName);
  }, [currentName]);

  const handleEditDeck = async () => {
    if (!deckName.trim()) {
      toast.error("Deck name cannot be empty");
      return;
    }

    try {
      await flashcardAPI.updateDeck(deckId, { name: deckName });
      onDeckUpdated(deckId, deckName);
      onClose();
      toast.success("Deck name updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update deck name");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Deck Name</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="deckName">Deck Name</Label>
            <Input
              id="deckName"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Enter deck name"
              autoFocus
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1f53f3] hover:bg-[#1f53f3]/90 text-white"
            onClick={handleEditDeck}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDeck;
