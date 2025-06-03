import { tasks, DEFAULT_TAGS } from "@/data/mock/taskData"

// Helper functions for task management
export const getTasksForDate = (date) => {
  const dateString = date.toISOString().split('T')[0]
  return tasks.filter(task => task.date === dateString)
}

export const getTasksForDateRange = (startDate, endDate) => {
  const start = startDate.toISOString().split('T')[0]
  const end = endDate.toISOString().split('T')[0]
  return tasks.filter(task => task.date >= start && task.date <= end)
}

export const getTasksByTag = (tagId) => {
  return tasks.filter(task => task.tag === tagId)
}

export const getTagById = (tagId) => {
  return DEFAULT_TAGS.find(tag => tag.id === tagId) || null
}

// Function to add a new task
export const addTask = (task) => {
  const newTask = {
    ...task,
    id: Math.random().toString(36).substring(2, 9),
    date: task.startTime.toISOString().split('T')[0]
  }
  tasks.push(newTask)
  return newTask
}

// Function to update an existing task
export const updateTask = (taskId, updatedTask) => {
  const taskIndex = tasks.findIndex(task => task.id === taskId)
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updatedTask,
      date: updatedTask.startTime.toISOString().split('T')[0]
    }
    return tasks[taskIndex]
  }
  return null
}

// Function to delete a task
export const deleteTask = (taskId) => {
  const taskIndex = tasks.findIndex(task => task.id === taskId)
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1)
    return true
  }
  return false
}

// Function to get tasks for a specific month
export const getTasksForMonth = (year, month) => {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)
  return getTasksForDateRange(startDate, endDate)
}

// Function to get tasks for a specific week
export const getTasksForWeek = (date) => {
  const startDate = new Date(date)
  startDate.setDate(date.getDate() - date.getDay()) // Start from Sunday
  
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6) // End on Saturday
  
  return getTasksForDateRange(startDate, endDate)
}

// Function to check if a task overlaps with a time range
export const isTaskOverlapping = (task, startTime, endTime) => {
  return (
    (task.startTime >= startTime && task.startTime < endTime) ||
    (task.endTime > startTime && task.endTime <= endTime) ||
    (task.startTime <= startTime && task.endTime >= endTime)
  )
}

// Function to get tasks for a specific time range
export const getTasksForTimeRange = (date, startHour, endHour) => {
  const dateString = date.toISOString().split('T')[0]
  const dateTasks = tasks.filter(task => task.date === dateString)
  
  const startTime = createDateTime(date, startHour)
  const endTime = createDateTime(date, endHour)
  
  return dateTasks.filter(task => isTaskOverlapping(task, startTime, endTime))
}

// Function to get tasks grouped by date
export const getTasksGroupedByDate = () => {
  return tasks.reduce((groups, task) => {
    if (!groups[task.date]) {
      groups[task.date] = []
    }
    groups[task.date].push(task)
    return groups
  }, {})
}



