import React, { useRef, useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import {
  WEEK_VIEW_CONSTANTS,
  calculateTaskPosition,
  calculateTimeFromY,
  calculateDayFromX,
  getWeekDates,
} from "@/types/weekView";

/**
 * WeekView component for displaying weekly schedule
 * @param {import('@/types/weekView').WeekViewProps} props
 */
export function WeekView({
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
  const dayRefs = useRef(Array(7).fill(null));
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(null);

  // Generate time slots for the day
  const timeSlots = Array.from(
    { length: WEEK_VIEW_CONSTANTS.END_HOUR - WEEK_VIEW_CONSTANTS.START_HOUR },
    (_, i) => i + WEEK_VIEW_CONSTANTS.START_HOUR
  );

  // Get week dates
  const weekDates = getWeekDates(currentDate);

  // Calculate current time position
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimePosition =
    (currentHour - WEEK_VIEW_CONSTANTS.START_HOUR) *
      WEEK_VIEW_CONSTANTS.HOUR_HEIGHT +
    (currentMinute / 60) * WEEK_VIEW_CONSTANTS.HOUR_HEIGHT;

  // Handle mouse events for drag-to-create
  const handleMouseDown = (e, dayIndex) => {
    // Only start drag if it's not clicking on a task
    if (!e.target.closest('.task-item')) {
      const dayRef = dayRefs.current[dayIndex];
      if (dayRef) {
        const rect = dayRef.getBoundingClientRect();
        const y = e.clientY - rect.top;

        // Calculate time from y position
        const hourDecimal = y / WEEK_VIEW_CONSTANTS.HOUR_HEIGHT + WEEK_VIEW_CONSTANTS.START_HOUR;
        const hour = Math.floor(hourDecimal);
        const minute = Math.floor((hourDecimal - hour) * 60);

        // Create date object for this time on the selected day
        const startTime = new Date(weekDates[dayIndex]);
        startTime.setHours(hour, minute, 0, 0);

        setActiveDayIndex(dayIndex);
        setMouseDown(true);
        onDragStart(startTime, y);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!mouseDown || activeDayIndex === null) return;

    if (!isDragging) {
      setIsDragging(true);
    }

    const dayRef = dayRefs.current[activeDayIndex];
    if (dayRef) {
      const rect = dayRef.getBoundingClientRect();
      const y = e.clientY - rect.top;

      // Calculate time from y position
      const hourDecimal = y / WEEK_VIEW_CONSTANTS.HOUR_HEIGHT + WEEK_VIEW_CONSTANTS.START_HOUR;
      const hour = Math.floor(hourDecimal);
      const minute = Math.floor((hourDecimal - hour) * 60);

      // Create date object for this time on the selected day
      const endTime = new Date(weekDates[activeDayIndex]);
      endTime.setHours(hour, minute, 0, 0);

      onDragMove(y, endTime);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onDragEnd();
    }
    setMouseDown(false);
    setIsDragging(false);
    setActiveDayIndex(null);
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

 
  
  return (
    <div className="grid grid-cols-[80px_repeat(7,1fr)] h-[calc(100vh-280px)] overflow-y-auto">
      <div className="border-r">
        {timeSlots.map((hour) => (
          <div key={hour} className="h-20 border-b flex items-start justify-end pr-2 pt-1 text-gray-500 text-sm">
            {hour}:00
          </div>
        ))}
      </div>

      {weekDates.map((date, dayIndex) => (
        <div
          key={date.toISOString()}
          ref={el => dayRefs.current[dayIndex] = el}
          className="relative border-r"
          onMouseDown={(e) => handleMouseDown(e, dayIndex)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Time slots */}
          {timeSlots.map((hour) => (
            <div key={hour} className="h-20 border-b"></div>
          ))}

          {/* Current time indicator */}
          {isToday(date) && (
            <div
              className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
              style={{ top: currentTimePosition }}
            >
              <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          )}

          {/* Drag overlay */}
          {dragInfo && activeDayIndex === dayIndex && (
            <div
              className="absolute left-1 right-1 bg-blue-100 opacity-50 border border-blue-300 rounded-md z-5"
              style={{
                top: Math.min(dragInfo.startY, dragInfo.currentY),
                height: Math.abs(dragInfo.currentY - dragInfo.startY),
              }}
            />
          )}

          {/* Render tasks for this day */}
          {tasks
            .filter(task => task.date === date.toISOString().split('T')[0])
            .map((task) => {
              const { top, height } = calculateTaskPosition(task, 0);
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
      ))}
    </div>
  );
}
