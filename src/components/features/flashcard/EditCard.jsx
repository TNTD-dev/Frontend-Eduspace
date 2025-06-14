import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EditCard = ({ open, onClose, question, answer, onChangeQuestion, onChangeAnswer, onSave }) => (
  <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Card</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-question">Question</Label>
          <Input
            id="edit-question"
            value={question}
            onChange={e => onChangeQuestion(e.target.value)}
            placeholder="Enter question"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-answer">Answer</Label>
          <Input
            id="edit-answer"
            value={answer}
            onChange={e => onChangeAnswer(e.target.value)}
            placeholder="Enter answer"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[#1f53f3] text-white" onClick={onSave}>Save</Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default EditCard;
