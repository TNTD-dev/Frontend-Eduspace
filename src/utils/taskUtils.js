import { tasksByDate } from "@/data/mock/taskData"

// Helper function to get tasks for a specific date
export const getTasksForDate = (date) => {
  return tasksByDate[date] || []
}

// Helper function to get tasks for a date range
export const getTasksForDateRange = (startDate, endDate) => {
  const tasks = []
  const currentDate = new Date(startDate)
  const lastDate = new Date(endDate)

  while (currentDate <= lastDate) {
    const dateString = currentDate.toISOString().split('T')[0]
    const dateTasks = tasksByDate[dateString]
    if (dateTasks) {
      tasks.push(...dateTasks)
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return tasks
}

// Helper function to get tasks by category
export const getTasksByCategory = (category) => {
  const tasks = []
  Object.values(tasksByDate).forEach(dateTasks => {
    dateTasks.forEach(task => {
      if (task.category === category) {
        tasks.push(task)
      }
    })
  })
  return tasks
}

// Helper function to get tasks by priority
export const getTasksByPriority = (priority) => {
  const tasks = []
  Object.values(tasksByDate).forEach(dateTasks => {
    dateTasks.forEach(task => {
      if (task.priority === priority) {
        tasks.push(task)
      }
    })
  })
  return tasks
} 