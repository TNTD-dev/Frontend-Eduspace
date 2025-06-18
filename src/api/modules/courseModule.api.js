import axiosInstance from "@/config/axios";
import { MODULE_ENDPOINTS } from "@/api/config/endpoints";

export const courseModuleAPI = {
    getAllModules: async (courseId) => {
        return axiosInstance.get(MODULE_ENDPOINTS.BASE.replace(":courseId", courseId));
    },
    getModuleById: async (courseId, moduleId) => {
        return axiosInstance.get(MODULE_ENDPOINTS.BY_ID(courseId, moduleId));
    },
    createModule: async (courseId, moduleData) => {
        console.log("API call - courseId:", courseId);
        console.log("API call - moduleData:", moduleData);
        console.log("API call - endpoint:", MODULE_ENDPOINTS.CREATE.replace(":courseId", courseId));
        
        return axiosInstance.post(
            MODULE_ENDPOINTS.CREATE.replace(":courseId", courseId), 
            moduleData
        );
    },
    updateModule: async (courseId, moduleId, moduleData) => {
        return axiosInstance.put(MODULE_ENDPOINTS.UPDATE(courseId, moduleId), moduleData);
    },
    deleteModule: async (courseId, moduleId) => {
        return axiosInstance.delete(MODULE_ENDPOINTS.DELETE(courseId, moduleId));
    },
    updateModuleOrder: async (courseId, moduleId, newOrder) => {
        return axiosInstance.patch(MODULE_ENDPOINTS.UPDATE_ORDER(courseId, moduleId), { newOrder });
    }
}