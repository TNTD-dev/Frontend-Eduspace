import React from 'react';
import {format, startOfWeek, endOfWeek, eachDayOfInterval, isToday} from 'date-fns';
import {VIEW_TYPES} from '@/types/schedule';
import { cn } from '@/lib/utils';

/**
 * Calendar header component that displays the current date based on view type
 * @param {import('../types/schedule').CalendarHeaderProps} props
 */
export function CalendarHeader({ currentDate, viewType }) {
  if (viewType === VIEW_TYPES.DAY) {
    return (
      <div className="border-b">
        <div className="grid grid-cols-1 text-center py-2">
          <div className={cn(
            "text-2xl font-semibold",
            isToday(currentDate) && "bg-[#1f53f5] text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto"
          )}>
            {format(currentDate, "d")}
          </div>
          <div className="text-gray-500">{format(currentDate, "EEEE, MMMM yyyy")}</div>
        </div>
      </div>
    );
  }

  if (viewType === VIEW_TYPES.WEEK) {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="border-b pl-[80px]">
        <div className="grid grid-cols-7 text-center">
          {days.map((day, i) => (
            <div key={i} className="py-2 flex flex-col items-center">
              <div className={cn(
                "text-lg font-semibold",
                isToday(day) && "bg-[#1f53f5] text-white rounded-full w-8 h-8 flex items-center justify-center"
              )}>
                {format(day, "d")}
              </div>
              <div className="text-gray-500">{format(day, "EEE")}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewType === VIEW_TYPES.MONTH) {
    return (
      <div className="border-b"> 
        <div className="grid grid-cols-7 text-center py-2 border-t">
          <div className="text-gray-500">Mon</div>
          <div className="text-gray-500">Tue</div>
          <div className="text-gray-500">Wed</div>
          <div className="text-gray-500">Thu</div>
          <div className="text-gray-500">Fri</div>
          <div className="text-gray-500">Sat</div>
          <div className="text-gray-500">Sun</div>
        </div>
      </div>
    );
  }

  return null;
}


