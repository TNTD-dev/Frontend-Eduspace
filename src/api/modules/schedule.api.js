import axiosInstance from '@/api/config/axios';
import { CALENDAR_ENDPOINTS } from '@/api/config/endpoints';

export const scheduleAPI = {
  // Get all tasks
  getTasks: () => 
    axiosInstance.get(CALENDAR_ENDPOINTS.BASE),
  
  // Get task by ID
  getTaskById: (id) => 
    axiosInstance.get(CALENDAR_ENDPOINTS.BY_ID(id)),
  
  // Create new task
  createTask: (taskData) => 
    axiosInstance.post(CALENDAR_ENDPOINTS.CREATE, taskData),
  
  // Update task
  updateTask: (id, taskData) => 
    axiosInstance.put(CALENDAR_ENDPOINTS.UPDATE(id), taskData),
  
  // Delete task
  deleteTask: (id) => 
    axiosInstance.delete(CALENDAR_ENDPOINTS.DELETE(id)),
};
