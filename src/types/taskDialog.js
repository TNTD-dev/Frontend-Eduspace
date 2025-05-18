/**
 * @typedef {Object} TaskDialogProps
 * @property {boolean} open
 * @property {(open: boolean) => void} onOpenChange
 * @property {(task: Task) => void} onAddTask
 * @property {Date=} initialStartTime
 * @property {Date=} initialEndTime
 * @property {CustomTag[]} customTags
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Date} startTime
 * @property {Date} endTime
 * @property {string} tag
 * @property {string} date
 */

/**
 * @typedef {Object} CustomTag
 * @property {string} id
 * @property {string} name
 * @property {string} bgColor
 * @property {string} textColor
 * @property {string} borderColor
 */
