/**
 * @typedef {Object} TaskDetailProps
 * @property {Task} task
 * @property {() => void} onClose
 * @property {(task: Task) => void} onUpdate
 * @property {(taskId: string) => void} onDelete
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
 * @property {number} [progress]
 */

/**
 * @typedef {Object} CustomTag
 * @property {string} id
 * @property {string} name
 * @property {string} bgColor
 * @property {string} textColor
 * @property {string} borderColor
 */
