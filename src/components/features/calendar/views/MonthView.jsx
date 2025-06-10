import React from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  format,
  isSameMonth,
} from "date-fns";
import { cn } from "@/lib/utils";

/**
 * @param {import("@/types/monthView").MonthViewProps} props
 */
export function MonthView({ currentDate, tasks, onTaskClick, getTagById }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Group days into weeks
  const weeks = [];
  let week = [];
  days.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <div className="w-full h-full">
      <div className="flex flex-col h-full">
        {weeks.map((week, i) => (
          <div
            key={i}
            className="grid grid-cols-7 flex-1 min-h-[100px] border-b last:border-b-0"
          >
            {week.map((day, j) => {
              const dayTasks = tasks.filter(
                (task) => {
                  const taskDate = new Date(task.startTime);
                  return taskDate.toDateString() === day.toDateString();
                }
              );
              return (
                <div
                  key={j}
                  className={cn(
                    "relative border-r last:border-r-0 p-1 align-top cursor-pointer group",
                    !isSameMonth(day, currentDate) && "bg-gray-50 text-gray-400"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-7 h-7 mx-auto mb-1 text-sm font-medium",
                      isToday(day) && "bg-[#1f53f5] text-white rounded-full"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  {/* Render tasks for this day */}
                  <div className="space-y-1">
                    {dayTasks.map((task) => {
                      const tag = getTagById(task.tagId);
                      return (
                        <div
                          key={task.id}
                          className="truncate px-2 py-1 rounded text-xs mb-1 cursor-pointer border-l-4"
                          style={{
                            backgroundColor: tag?.bgColor ? tag.bgColor.replace('bg-[', '').replace(']/10', '') + '10' : '#f3f4f6',
                            color: tag?.textColor ? tag.textColor.replace('text-[', '').replace(']', '') : '#374151',
                            borderLeftColor: tag?.borderColor ? tag.borderColor.replace('border-l-[', '').replace(']', '') : '#6b7280'
                          }}
                          onClick={() => onTaskClick(task)}
                          title={task.title}
                        >
                          <div className="font-medium truncate">
                            {task.title}
                          </div>
                          <div className="text-xs truncate">
                            {format(new Date(task.startTime), "h:mm a")} -{" "}
                            {format(new Date(task.endTime), "h:mm a")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
