/**
 * @typedef {Object} DayViewProps
 * @property {Date} currentDate - The current date being displayed
 * @property {Date} currentTime - The current time
 * @property {Array<Task>} tasks - List of tasks for the day
 * @property {Function} onTaskClick - Callback when a task is clicked
 * @property {DragInfo|null} dragInfo - Information about current drag operation
 * @property {Function} onDragStart - Callback when drag starts
 * @property {Function} onDragMove - Callback when drag moves
 * @property {Function} onDragEnd - Callback when drag ends
 * @property {Function} getTagById - Function to get tag by ID
 */

/**
 * @typedef {Object} Task
 * @property {string} id - The unique identifier of the task
 * @property {string} title - The title of the task
 * @property {string} description - The description of the task
 * @property {Date} startTime - The start time of the task
 * @property {Date} endTime - The end time of the task
 * @property {string} tag - The tag ID of the task
 * @property {string} date - The date of the task in YYYY-MM-DD format
 * @property {number} [progress] - Optional progress of the task (0-100)
 */

/**
 * @typedef {Object} DragInfo
 * @property {Date} startTime - The start time of the drag
 * @property {Date} endTime - The end time of the drag
 * @property {number} startY - The starting Y position of the drag
 * @property {number} currentY - The current Y position of the drag
 */

// Export the types for use in other files
export const DAY_VIEW_CONSTANTS = {
  HOUR_HEIGHT: 80, // Height of each hour slot in pixels
  START_HOUR: 0,   // Start hour of the day view (0 AM)
  END_HOUR: 24,    // End hour of the day view (24 PM)
}

// Helper function to get tasks for a specific date
export const getTasksForDate = (tasks, date) => {
  const dateString = date.toISOString().split('T')[0];
  return tasks.filter(task => task.date === dateString);
}

// Helper function to calculate task position and height
export const calculateTaskPosition = (task, hourHeight = DAY_VIEW_CONSTANTS.HOUR_HEIGHT) => {
  const startHour = task.startTime.getHours();
  const startMinute = task.startTime.getMinutes();
  const endHour = task.endTime.getHours();
  const endMinute = task.endTime.getMinutes();
  
  const top = (startHour - DAY_VIEW_CONSTANTS.START_HOUR) * hourHeight + 
              (startMinute / 60) * hourHeight;
  const height = ((endHour - startHour) * 60 + (endMinute - startMinute)) / 60 * hourHeight;
  
  return { top, height };
}

// Helper function to calculate time from Y position
export const calculateTimeFromY = (y, date, hourHeight = DAY_VIEW_CONSTANTS.HOUR_HEIGHT) => {
  const hourDecimal = y / hourHeight + DAY_VIEW_CONSTANTS.START_HOUR;
  const hour = Math.floor(hourDecimal);
  const minute = Math.floor((hourDecimal - hour) * 60);

  const time = new Date(date);
  time.setHours(hour, minute, 0, 0);
  return time;
} 