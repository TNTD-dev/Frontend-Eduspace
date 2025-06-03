import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/**
 * @param {import("@/types/taskDialog").TaskDialogProps} props
 */
export function TaskDialog({
  open,
  onOpenChange,
  onAddTask,
  initialStartTime,
  initialEndTime,
  customTags,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [tag, setTag] = useState(customTags[0]?.id || ""); 

  // Update form when initialStartTime and initialEndTime change
  useEffect(() => {
    if (initialStartTime && initialEndTime) {
      setDate(format(initialStartTime, "yyyy-MM-dd"));
      setStartTime(format(initialStartTime, "HH:mm"));
      setEndTime(format(initialEndTime, "HH:mm"));
    }
    if (open) {
      setTitle("");
      setDescription("");
      setTag(customTags[0]?.id || "");
    }
  }, [initialStartTime, initialEndTime, open, customTags]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setStartTime("09:00");
    setEndTime("10:00");
    setTag(customTags[0]?.id || "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
      tag,
      date,
    };
    onAddTask(newTask);
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="pb-2" htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="pb-2" htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div>
              <Label className="pb-2" htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="pb-2" htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="pb-2" htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label className="pb-2" htmlFor="tag">Tag</Label>
            <select
              id="tag"
              className="w-full border rounded px-2 py-2"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              {customTags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => { onOpenChange(false); resetForm(); }}>
              Cancel
            </Button>
            <Button className="bg-[#1f53f5] text-white hover:bg-[#1f53f5]/90" type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

