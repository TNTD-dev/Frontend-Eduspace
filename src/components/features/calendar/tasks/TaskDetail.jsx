import React, { useState } from "react";
import { format } from "date-fns";
import { X, Edit, Trash, Clock, Tag as TagIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";


export function TaskDetail({ task, onClose, onUpdate, onDelete, customTags }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [date, setDate] = useState(format(task.startTime, "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState(format(task.startTime, "HH:mm"));
  const [endTime, setEndTime] = useState(format(task.endTime, "HH:mm"));
  const [tag, setTag] = useState(task.tagId);

  const currentTag = customTags.find((t) => t.id === tag) || null;
  const tagLabel = currentTag?.name || "Unknown";

  console.log("Tag data:", {
    taskTag: tag,
    currentTag,
    borderColor: currentTag?.borderColor,
    processedColor: currentTag
      ? currentTag.borderColor.replace("border-l-[", "").replace("]", "")
      : "#6b7280"
  });

  const handleUpdate = () => {
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    const updatedTask = {
      ...task,
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
      tagId: tag,
    };
    console.log("Updating task with data:", updatedTask);
    onUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border-l-4"
              style={{
                backgroundColor: currentTag?.bgColor ? currentTag.bgColor.replace('bg-[', '').replace(']/10', '') + '10' : '#f3f4f6',
                borderLeftColor: currentTag?.borderColor ? currentTag.borderColor.replace('border-l-[', '').replace(']', '') : '#6b7280'
              }}
            ></div>
            <DialogTitle>{isEditing ? "Edit Task" : "Task Details"}</DialogTitle>
          </div>
          
        </DialogHeader>
        {isEditing ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Form submitted");
              handleUpdate();
            }}
          >
            <div>
              <Label className="pb-2" htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => {
                  console.log("Title changed:", e.target.value);
                  setTitle(e.target.value);
                }} 
                required 
              />
            </div>
            <div>
              <Label className="pb-2" htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={e => {
                  console.log("Description changed:", e.target.value);
                  setDescription(e.target.value);
                }} 
              />
            </div>
            <div className="flex gap-2">
              <div>
                <Label className="pb-2" htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date} 
                  onChange={e => {
                    console.log("Date changed:", e.target.value);
                    setDate(e.target.value);
                  }} 
                  required 
                />
              </div>
              <div>
                <Label className="pb-2" htmlFor="startTime">Start Time</Label>
                <Input 
                  id="startTime" 
                  type="time" 
                  value={startTime} 
                  onChange={e => {
                    console.log("Start time changed:", e.target.value);
                    setStartTime(e.target.value);
                  }} 
                  required 
                />
              </div>
              <div>
                <Label className="pb-2" htmlFor="endTime">End Time</Label>
                <Input 
                  id="endTime" 
                  type="time" 
                  value={endTime} 
                  onChange={e => {
                    console.log("End time changed:", e.target.value);
                    setEndTime(e.target.value);
                  }} 
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
                onChange={e => {
                  console.log("Tag changed:", e.target.value);
                  setTag(e.target.value);
                }}
              >
                {customTags.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#1f53f5] text-white hover:bg-[#1f53f5]/90"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{title}</h2>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="destructive" onClick={handleDelete}>
                  <Trash className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="text-gray-500">{description}</div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              {format(task.startTime, "yyyy-MM-dd HH:mm")} - {format(task.endTime, "HH:mm")}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TagIcon className="w-4 h-4" />
              <span
                style={{
                  color: currentTag?.textColor ? currentTag.textColor.replace('text-[', '').replace(']', '') : '#374151'
                }}
              >
                {tagLabel}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
