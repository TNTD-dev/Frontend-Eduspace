import React from 'react'
import { CircleCheck, EllipsisVertical } from 'lucide-react'


/**
 * Task Item Component
 * @param {Object} props
 * @param {Object} props.task - Task object containing task details
 * @param {number} props.task.id - The task ID
 * @param {string} props.task.title - The task title
 * @param {string} props.task.time - The task time
 * @param {string} props.task.category - The task category
 * @param {string} props.task.icon - The task icon
 */
const TaskItem = ({ task }) => {
  const { id, title, time, category, icon } = task;
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center ">
        <img src={"/check-list.png"} alt={category} className="h-8 w-8" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-[#303345]">{title}</h3>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <EllipsisVertical className="h-3 w-3" />
          <span>{time}</span>
        </div>
      </div>
      <div className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {category}
      </div>
    </div>
  )
}

export default TaskItem
