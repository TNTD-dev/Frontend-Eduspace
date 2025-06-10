import axiosInstance from '@/api/config/axios';
import { TAGS_ENDPOINTS } from '@/api/config/endpoints';

export const tagsAPI = {
  // Get all tags
  getTags: () => axiosInstance.get(TAGS_ENDPOINTS.BASE),

  // Get tag by ID
  getTagById: (id) => axiosInstance.get(TAGS_ENDPOINTS.BY_ID(id)),

  // Create new tag
  createTag: (tagData) => axiosInstance.post(TAGS_ENDPOINTS.CREATE, tagData),

  // Update tag
  updateTag: (id, tagData) => axiosInstance.put(TAGS_ENDPOINTS.UPDATE(id), tagData),

  // Delete tag
  deleteTag: (id) => axiosInstance.delete(TAGS_ENDPOINTS.DELETE(id)),
};