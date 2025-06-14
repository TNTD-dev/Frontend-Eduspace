import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteCardConfirm = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-[350px]">
      <DialogHeader>
        <DialogTitle>Delete Card</DialogTitle>
      </DialogHeader>
      <div className="py-4">Are you sure you want to delete this card?</div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-red-500 text-white" onClick={onConfirm}>Delete</Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default DeleteCardConfirm;
