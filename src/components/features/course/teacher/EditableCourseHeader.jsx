import React, { useState } from "react";
import { courseAPI } from "@/api";
import { toast } from "sonner";

/**
 * Props:
 *   - course: the current course object (must at least have { title, category, status })
 *   - onUpdate: (updatedCourse) => void  → called when form is saved
 *   - onCancel: () => void              → called when user clicks "Cancel"
 */
const EditableCourseHeader = ({ course, onUpdate, onCancel }) => {
  // Map status từ server (current) sang UI (published)
  const mapStatusToUI = (status) => {
    if (status === "current") return "published";
    return status;
  };

  // Map status từ UI (published) sang server (current)
  const mapStatusToServer = (status) => {
    if (status === "published") return "current";
    return status;
  };

  // Local state for the fields you want to allow editing
  const [title, setTitle] = useState(course.title || "");
  const [category, setCategory] = useState(course.category || "");
  const [status, setStatus] = useState(mapStatusToUI(course.status) || "draft");
  const [isLoading, setIsLoading] = useState(false);

  // In case you want to edit other fields (e.g. instructor), you can add them here as well.

  // "Save" handler
  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Build updated course data
      const updatedCourse = {
        ...course,
        title: title.trim(),
        category: category.trim(),
        status: mapStatusToServer(status), // Map status trước khi gửi lên server
      };

      // Call API to update course
      await courseAPI.updateCourse(course.id, updatedCourse);
      
      // Notify parent component with UI status
      onUpdate({
        ...updatedCourse,
        status: status, // Giữ nguyên status UI cho component cha
      });
      toast.success("Course updated successfully");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-white">
          Course Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter course title"
          disabled={isLoading}
        />
      </div>

      {/* Category Badge Text */}
      <div>
        <label className="block text-sm font-medium text-white">
          Category Badge Text
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. Programming, Design, etc."
          disabled={isLoading}
        />
      </div>

      {/* Status Dropdown */}
      <div>
        <label className="block text-sm font-medium text-white">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditableCourseHeader;