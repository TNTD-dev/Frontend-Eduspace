import axiosInstance from "@/config/axios";
import { ASSIGNMENT_ENDPOINTS } from "@/api/config/endpoints";

export const moduleAssignmentAPI = {
    getAllAssignments: (courseId, moduleId) =>
        axiosInstance.get(ASSIGNMENT_ENDPOINTS.BASE.replace(":courseId", courseId).replace(":moduleId", moduleId)),
    getAssignmentById: (courseId, moduleId, assignmentId) =>
        axiosInstance.get(ASSIGNMENT_ENDPOINTS.BY_ID(courseId, moduleId, assignmentId)),
    createAssignment: (courseId, moduleId, assignmentData) =>
        axiosInstance.post(ASSIGNMENT_ENDPOINTS.CREATE.replace(":courseId", courseId).replace(":moduleId", moduleId), assignmentData),
    updateAssignment: (courseId, moduleId, assignmentId, assignmentData) =>
        axiosInstance.put(ASSIGNMENT_ENDPOINTS.UPDATE(courseId, moduleId, assignmentId), assignmentData),
    deleteAssignment: (courseId, moduleId, assignmentId) =>
        axiosInstance.delete(ASSIGNMENT_ENDPOINTS.DELETE(courseId, moduleId, assignmentId)),
}