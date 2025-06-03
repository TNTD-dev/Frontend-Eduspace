/**
 * @typedef {Object} CustomTag
 * @property {string} id - The unique identifier of the tag
 * @property {string} name - The display name of the tag
 * @property {string} bgColor - The background color class (e.g., 'bg-blue-50')
 * @property {string} textColor - The text color class (e.g., 'text-blue-700')
 * @property {string} borderColor - The border color class (e.g., 'border-l-blue-500')
 */

/**
 * @typedef {Object} TagManagerProps
 * @property {boolean} open - Whether the tag manager dialog is open
 * @property {(open: boolean) => void} onOpenChange - Callback when dialog open state changes
 * @property {CustomTag[]} tags - List of custom tags
 * @property {(tag: CustomTag) => void} onAddTag - Callback when a new tag is added
 * @property {(tag: CustomTag) => void} onUpdateTag - Callback when a tag is updated
 * @property {(tagId: string) => void} onDeleteTag - Callback when a tag is deleted
 */
