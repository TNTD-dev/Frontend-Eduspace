import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBarStudent from "@/components/layout/SideBarStudent";
import SideBarTeacher from "@/components/layout/SideBarTeacher";
import NavBar from "@/components/layout/NavBar";
import { useAuth } from "@/context/AuthContext";
import {
  addDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  TagIcon,
} from "lucide-react";
import { VIEW_TYPES } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarHeader } from "@/components/features/calendar/CalendarHeader";
import { DayView } from "@/components/features/calendar/views/DayView";
import { WeekView } from "@/components/features/calendar/views/WeekView";
import { MonthView } from "@/components/features/calendar/views/MonthView";
import { TaskDialog } from "@/components/features/calendar/tasks/TaskDialog";
import { TaskDetail } from "@/components/features/calendar/tasks/TaskDetail";
import { TagManager } from "@/components/features/calendar/tasks/TagManager";
import { scheduleAPI, tagsAPI } from "@/api";
import { toast } from "sonner";

export default function Schedule() {
  const { userRole } = useAuth();
  // Current date state
  const [currentDate, setCurrentDate] = useState(new Date());

  // View type state
  const [viewType, setViewType] = useState(VIEW_TYPES.WEEK);

  // Drag info state
  const [dragInfo, setDragInfo] = useState(null);

  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Custom tags state
  const [customTags, setCustomTags] = useState([]);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  // Task states
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks and tags on component mount
  useEffect(() => {
    fetchTasks();
    fetchTags();
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await scheduleAPI.getTasks();
      // Convert startTime and endTime to Date objects
      const formattedTasks = response.data.map(task => ({
        ...task,
        startTime: new Date(task.startTime),
        endTime: new Date(task.endTime),
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tags from API
  const fetchTags = async () => {
    try {
      const response = await tagsAPI.getTags();
      setCustomTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to fetch tags');
    }
  };

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
    
    if (viewType === VIEW_TYPES.WEEK) {
      // Get the current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const currentDay = today.getDay();
      // Calculate days to subtract to get to Monday (1)
      const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
      // Create a new date for Monday
      const monday = new Date(today);
      monday.setDate(today.getDate() - daysToSubtract);
      setCurrentDate(monday);
    } else if (viewType === VIEW_TYPES.MONTH) {
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      setCurrentDate(firstDayOfMonth);
    } else {
      setCurrentDate(today);
    }
  };

  // Task handlers
  const handleAddTask = async (task) => {
    try {
      const response = await scheduleAPI.createTask(task);
      // Convert startTime and endTime to Date objects
      const newTask = {
        ...response.data,
        startTime: new Date(response.data.startTime),
        endTime: new Date(response.data.endTime),
      };
      setTasks((prev) => [...prev, newTask]);
      setIsTaskDialogOpen(false);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      // Format dates to ISO string before sending to API
      const taskToUpdate = {
        ...updatedTask,
        startTime: new Date(updatedTask.startTime).toISOString(),
        endTime: new Date(updatedTask.endTime).toISOString(),
      };
      
      const response = await scheduleAPI.updateTask(updatedTask.id, taskToUpdate);
      // Convert startTime and endTime to Date objects
      const formattedTask = {
        ...response.data,
        startTime: new Date(response.data.startTime),
        endTime: new Date(response.data.endTime),
      };
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? formattedTask : task))
      );
      setSelectedTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await scheduleAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setSelectedTask(null);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
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

  const getTagById = (tagId) => {
    return customTags.find((tag) => tag.id === tagId) || null;
  };

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      {userRole === 'teacher' ? <SideBarTeacher /> : <SideBarStudent />}

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
                      className="bg-white hover:bg-[#1f53f3] text-gray-700 "
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNext}
                      className="bg-white hover:bg-[#1f53f3] text-gray-700"
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
        onTagsChange={setCustomTags}
      />
    </div>
  );
}
