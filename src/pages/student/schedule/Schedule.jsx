import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import {
  addDays,
  isSameDay,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Bell,
  TagIcon,
} from "lucide-react";
import { tasks as initialTasks, DEFAULT_TAGS } from "@/data/mock/taskData";
import { VIEW_TYPES } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarHeader } from "@/components/features/calendar/CalendarHeader";
import { DayView } from "@/components/features/calendar/views/DayView";
import { WeekView } from "@/components/features/calendar/views/WeekView";
import { getTasksForDate } from "@/utils/taskUtils";
import { MonthView } from "@/components/features/calendar/views/MonthView";
import { TaskDialog } from "@/components/features/calendar/tasks/TaskDialog";
import { TaskDetail } from "@/components/features/calendar/tasks/TaskDetail";
import { TagManager } from "@/components/features/calendar/tasks/TagManager";
export default function Schedule() {
  // Current date state
  const [currentDate, setCurrentDate] = useState(new Date());

  // View type state
  const [viewType, setViewType] = useState(VIEW_TYPES.WEEK);

  // Drag info state
  const [dragInfo, setDragInfo] = useState(null);

  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Custom tags state
  const [customTags, setCustomTags] = useState(DEFAULT_TAGS);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  // Task states
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Navigation handlers
  const handlePrevious = () => {
    if (viewType === VIEW_TYPES.DAY) {
      setCurrentDate((prev) => addDays(prev, -1));
    } else if (viewType === VIEW_TYPES.WEEK) {
      setCurrentDate((prev) => subWeeks(prev, 1));
    } else {
      setCurrentDate((prev) => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewType === VIEW_TYPES.DAY) {
      setCurrentDate((prev) => addDays(prev, 1));
    } else if (viewType === VIEW_TYPES.WEEK) {
      setCurrentDate((prev) => addWeeks(prev, 1));
    } else {
      setCurrentDate((prev) => addMonths(prev, 1));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);

    // Nếu đang ở chế độ day view, giữ nguyên
    // Nếu đang ở chế độ week view, chuyển về tuần hiện tại
    // Nếu đang ở chế độ month view, chuyển về tháng hiện tại
    if (viewType === VIEW_TYPES.WEEK) {
      // Đảm bảo ngày hiện tại nằm trong tuần hiện tại
      const currentDay = today.getDay();
      const diff = today.getDate() - currentDay;
      const monday = new Date(today.setDate(diff));
      setCurrentDate(monday);
    } else if (viewType === VIEW_TYPES.MONTH) {
      // Đảm bảo ngày hiện tại nằm trong tháng hiện tại
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      setCurrentDate(firstDayOfMonth);
    }
  };

  // Task handlers
  const handleAddTask = (task) => {
    setTasks((prev) => [
      ...prev,
      { ...task, id: Math.random().toString(36).substring(2, 9) },
    ]);
    setIsTaskDialogOpen(false);
  };

  const handleTaskClick = (task) => {
    console.log("Task clicked:", task);
    console.log("Task data:", {
      id: task.id,
      title: task.title,
      startTime: task.startTime,
      endTime: task.endTime,
      tag: task.tag,
    });
    setSelectedTask(task);
  };

  const handleCloseTaskDetail = () => {
    console.log("Closing task detail");
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedTask) => {
    console.log("Updating task:", updatedTask);
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTask(null);
  };

  // Drag handlers
  const handleDragStart = (startTime, startY) => {
    setDragInfo({
      startTime,
      endTime: startTime,
      startY,
      currentY: startY,
    });
  };

  const handleDragMove = (currentY, endTime) => {
    if (dragInfo) {
      setDragInfo({
        ...dragInfo,
        currentY,
        endTime,
      });
    }
  };

  const handleDragEnd = () => {
    if (dragInfo) {
      // Ensure start time is before end time
      const startTime =
        dragInfo.startTime < dragInfo.endTime
          ? dragInfo.startTime
          : dragInfo.endTime;
      const endTime =
        dragInfo.startTime < dragInfo.endTime
          ? dragInfo.endTime
          : dragInfo.startTime;

      // Open task dialog with pre-filled times
      setIsTaskDialogOpen(true);

      // Reset drag info
      setDragInfo(null);

      // Return the time range for the task dialog
      return { startTime, endTime };
    }
    return null;
  };

  // Tag handlers
  const handleAddTag = (tag) => {
    setCustomTags((prev) => [...prev, tag]);
  };

  const handleUpdateTag = (updatedTag) => {
    setCustomTags((prev) =>
      prev.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
    );
  };

  const handleDeleteTag = (tagId) => {
    // Check if tag is in use
    const tagInUse = tasks.some((task) => task.tag === tagId);

    if (tagInUse) {
      alert("Cannot delete this tag as it is being used by one or more tasks.");
      return;
    }

    setCustomTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const getTagById = (tagId) => {
    return customTags.find((tag) => tag.id === tagId) || null;
  };

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            {/* Header */}
            <NavBar />

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="flex justify-between items-center mb-6">
                {/* Navigation and Today */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex gap-2 rounded-lg border bg-white p-1 shadow-sm">
                    <button
                      onClick={handleToday}
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Today
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrevious}
                      className="bg-white hover:bg-[#1f53f3] text-gray-700 hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNext}
                      className="bg-white hover:bg-[#1f53f3] text-gray-700 hover:text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {viewType === VIEW_TYPES.DAY
                      ? currentDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : viewType === VIEW_TYPES.WEEK
                      ? `${currentDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : currentDate.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                  </h2>
                </div>

                {/* Select view type */}
                <div className="flex items-center gap-3">
                  <div className="inline-flex gap-2 rounded-lg border bg-white p-1 shadow-sm">
                    <button
                      className={cn(
                        "rounded-md px-3 py-1.5 text-sm font-medium",
                        viewType === VIEW_TYPES.DAY
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setViewType(VIEW_TYPES.DAY)}
                    >
                      Day
                    </button>
                    <button
                      className={cn(
                        "rounded-md px-3 py-1.5 text-sm font-medium",
                        viewType === VIEW_TYPES.WEEK
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setViewType(VIEW_TYPES.WEEK)}
                    >
                      Week
                    </button>
                    <button
                      className={cn(
                        "rounded-md px-3 py-1.5 text-sm font-medium",
                        viewType === VIEW_TYPES.MONTH
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setViewType(VIEW_TYPES.MONTH)}
                    >
                      Month
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTagManagerOpen(true)}
                  >
                    <TagIcon className="h-4 w-4 mr-1" /> Manage Tags
                  </Button>
                  <Button
                    className="bg-[#1f53f3] hover:bg-[#1f2af3] text-white"
                    onClick={() => setIsTaskDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> New Task
                  </Button>
                </div>
              </div>

              <div className="bg-white border rounded-xl  overflow-hidden">
                <CalendarHeader currentDate={currentDate} viewType={viewType} />
                {viewType === VIEW_TYPES.DAY && (
                  <DayView
                    currentDate={currentDate}
                    currentTime={currentTime}
                    tasks={tasks}
                    onTaskClick={handleTaskClick}
                    dragInfo={dragInfo}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    getTagById={getTagById}
                  />
                )}

                {viewType === VIEW_TYPES.WEEK && (
                  <WeekView
                    currentDate={currentDate}
                    currentTime={currentTime}
                    tasks={tasks}
                    onTaskClick={handleTaskClick}
                    dragInfo={dragInfo}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    getTagById={getTagById}
                  />
                )}
                {viewType === VIEW_TYPES.MONTH && (
                  <MonthView
                    currentDate={currentDate}
                    tasks={tasks}
                    onTaskClick={handleTaskClick}
                    getTagById={getTagById}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onAddTask={handleAddTask}
        initialStartTime={dragInfo?.startTime}
        initialEndTime={dragInfo?.endTime}
        customTags={customTags}
      />

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={handleCloseTaskDetail}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          customTags={customTags}
        />
      )}

      <TagManager
        open={isTagManagerOpen}
        onOpenChange={setIsTagManagerOpen}
        tags={customTags}
        onAddTag={handleAddTag}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
      />
    </div>
  );
}
