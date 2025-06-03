/**
 * @typedef {Object} MonthViewProps
 * @property {Date} currentDate - The current date being displayed
 * @property {Array<Task>} tasks - List of tasks for the month
 * @property {Function} onTaskClick - Callback when a task is clicked
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
 * @typedef {Object} CustomTag
 * @property {string} id - The unique identifier of the tag
 * @property {string} name - The name of the tag
 * @property {string} bgColor - Background color class
 * @property {string} textColor - Text color class
 * @property {string} borderColor - Border color class
 */
