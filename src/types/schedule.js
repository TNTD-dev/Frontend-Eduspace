/**
 * @typedef {'day' | 'week' | 'month'} ViewType
 */

/**
 * @typedef {Object} DragInfo
 * @property {Date} startTime - The start time of the drag
 * @property {Date} endTime - The end time of the drag
 * @property {number} startY - The starting Y position of the drag
 * @property {number} currentY - The current Y position of the drag
 */

/**
 * @typedef {Object} CustomTag
 * @property {string} id - The unique identifier of the tag
 * @property {string} name - The display name of the tag
 * @property {string} bgColor - The background color class (e.g., 'bg-blue-50')
 * @property {string} textColor - The text color class (e.g., 'text-blue-700')
 * @property {string} borderColor - The border color class (e.g., 'border-l-blue-500')
 */

/**
 * @typedef {Object} CalendarHeaderProps
 * @property {Date} currentDate - The current date being displayed
 * @property {ViewType} viewType - The current view type (day, week, or month)
 */

// Export the types for use in other files
export const VIEW_TYPES = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
}

// Example of how to use these types in a component:
/**
 * @param {Object} props
 * @param {ViewType} props.viewType - The current view type
 * @param {DragInfo} props.dragInfo - The current drag information
 * @param {CustomTag[]} props.tags - The list of custom tags
 */
export const ScheduleComponent = ({ viewType, dragInfo, tags }) => {
  // Component implementation
} 