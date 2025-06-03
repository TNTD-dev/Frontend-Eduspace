import React, { useRef, useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DAY_VIEW_CONSTANTS,
  calculateTaskPosition,
  calculateTimeFromY,
} from "@/types/dayView";

/**
 * DayView component for displaying daily schedule
 * @param {import('@/types/dayView').DayViewProps} props
 */
export function DayView({
  currentDate,
  currentTime,
  tasks,
  onTaskClick,
  dragInfo,
  onDragStart,
  onDragMove,
  onDragEnd,
  getTagById,
}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  // Generate time slots for the day
  const timeSlots = Array.from(
    { length: DAY_VIEW_CONSTANTS.END_HOUR - DAY_VIEW_CONSTANTS.START_HOUR },
    (_, i) => i + DAY_VIEW_CONSTANTS.START_HOUR
  );

  // Calculate current time position
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimePosition =
    (currentHour - DAY_VIEW_CONSTANTS.START_HOUR) *
      DAY_VIEW_CONSTANTS.HOUR_HEIGHT +
    (currentMinute / 60) * DAY_VIEW_CONSTANTS.HOUR_HEIGHT;

  // Handle mouse events for drag-to-create
  const handleMouseDown = (e) => {
    // Only start drag if it's not clicking on a task
    if (!e.target.closest('.task-item')) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;

        const startTime = calculateTimeFromY(y, currentDate);
        setMouseDown(true);
        onDragStart(startTime, y);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!mouseDown) return;

    if (!isDragging) {
      setIsDragging(true);
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;

      const endTime = calculateTimeFromY(y, currentDate);
      onDragMove(y, endTime);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onDragEnd();
    }
    setMouseDown(false);
    setIsDragging(false);
  };

  // Add mouse up event listener to window
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (mouseDown) {
        handleMouseUp();
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [mouseDown]);

  // Add context menu prevention
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
    };
    
    if (containerRef.current) {
      containerRef.current.addEventListener('contextmenu', preventContextMenu);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('contextmenu', preventContextMenu);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-[80px_1fr] h-[calc(100vh-280px)] overflow-y-auto">
      {/* Time slots */}
      <div className="border-r">
        {timeSlots.map((hour) => (
          <div key={hour} className="h-20 border-b flex items-start justify-end pr-2 pt-1 text-gray-500 text-sm">
            {hour}:00
          </div>
        ))}
      </div>
      <div
        ref={containerRef}
        className="relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
         {timeSlots.map((hour) => (
          <div key={hour} className="h-20 border-b"></div>
        ))}
        

        {/* Current time indicator */}
        {isToday(currentDate) && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
            style={{ top: currentTimePosition }}
          >
            <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500"></div>
          </div>
        )}

        {/* Drag overlay */}
        {dragInfo && (
          <div
            className="absolute left-1 right-1 bg-blue-100 opacity-50 border border-blue-300 rounded-md z-5"
            style={{
              top: Math.min(dragInfo.startY, dragInfo.currentY),
              height: Math.abs(dragInfo.currentY - dragInfo.startY),
            }}
          />
        )}

        {/* Render tasks */}
        {tasks
          .filter(task => task.date === currentDate.toISOString().split('T')[0])
          .map((task) => {
            const { top, height } = calculateTaskPosition(task);
            const tag = getTagById(task.tag);

            return (
              <div
                key={task.id}
                className={cn(
                  "task-item absolute left-1 right-1 rounded-md p-2 cursor-pointer border-l-4 hover:shadow-md transition-shadow",
                  tag?.bgColor || "bg-gray-100",
                  tag?.textColor || "text-gray-700",
                  tag?.borderColor || "border-l-gray-500"
                )}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick(task);
                }}
              >
                <div className="font-medium truncate">{task.title}</div>
                <div className="text-xs truncate">
                  {format(task.startTime, "h:mm a")} -{" "}
                  {format(task.endTime, "h:mm a")}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

