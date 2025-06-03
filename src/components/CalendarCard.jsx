import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import TaskItem from "@/components/TaskItem"
import { tasks } from "@/data/mock/taskData"
import { getTasksForDate } from "@/utils/taskUtils"

export default function CalendarCard() {
  const [currentMonth, setCurrentMonth] = useState(new Date()) // Current date
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]) // Default selected date
  const [hoveredDate, setHoveredDate] = useState(null)

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (1 = Monday, 2 = Tuesday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 7, then subtract 1 to make Monday (1) the first day
    return day === 0 ? 6 : day - 1;
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  // Day names - Changed order to start from Monday
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1))
  }

  // Format date string (YYYY-MM-DD)
  const formatDateString = (day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  // Handle date click
  const handleDateClick = (day) => {
    const dateString = formatDateString(day)
    setSelectedDate(dateString)
  }

  // Handle date hover
  const handleDateHover = (day) => {
    if (day === null) {
      setHoveredDate(null)
      return
    }
    const dateString = formatDateString(day)
    setHoveredDate(dateString)
  }

  // Get tasks for selected date
  const selectedTasks = getTasksForDate(new Date(selectedDate))

  // Get tasks for hovered date
  const hoveredTasks = hoveredDate ? getTasksForDate(new Date(hoveredDate)) : []

  // Determine which tasks to display
  const displayTasks = hoveredDate ? hoveredTasks : selectedTasks

  return (
    <div className="w-full max-w-md overflow-hidden border-0">
      {/* Calendar header */}
      <div className="flex items-center justify-between border-b p-4">
        <button onClick={prevMonth} className="rounded-full p-1 hover:bg-gray-100" aria-label="Previous month">
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h2>
        <button onClick={nextMonth} className="rounded-full p-1 hover:bg-gray-100" aria-label="Next month">
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="p-4">
        {/* Day names */}
        <div className="mb-2 grid grid-cols-7 text-center">
          {dayNames.map((day, index) => (
            <div key={index} className="text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-8" />
            }

            const dateString = formatDateString(day)
            const hasTask = tasks.some(task => task.date === dateString)
            const isSelected = dateString === selectedDate

            return (
              <div
                key={`day-${day}`}
                className="relative"
                onMouseEnter={() => handleDateHover(day)}
                onMouseLeave={() => handleDateHover(null)}
              >
                <button
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                    isSelected ? "bg-blue-500 text-white" : hasTask ? "hover:bg-blue-100" : "hover:bg-gray-100",
                    dateString === hoveredDate && !isSelected && "bg-blue-100",
                  )}
                >
                  {day}
                </button>
                {hasTask && !isSelected && (
                  <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tasks section */}
      <div className="border-t p-4">
        <h3 className="mb-3 font-semibold text-gray-800">
          {hoveredDate ? `Tasks for ${new Date(hoveredDate).getDate()} ${monthNames[month]}` : "Today's Task"}
        </h3>

        {displayTasks.length > 0 ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {displayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tasks for this day</p>
        )}
      </div>
    </div>
  )
}
