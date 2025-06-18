import React, { useState, useEffect } from 'react';
import { courseModuleAPI } from '@/api';
import { toast } from 'sonner';

export default function AddModuleModal({ open, onClose, courseId, onModuleAdded, isEdit = false, initialData = {}, onModuleUpdated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (isEdit && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    // eslint-disable-next-line
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && initialData?.id) {
        // Update module
        await courseModuleAPI.updateModule(courseId, initialData.id, {
          newTitle: title,
          newDescription: description
        });
        toast.success('Module updated!');
        if (onModuleUpdated) onModuleUpdated();
      } else {
        // Create module
        const res = await courseModuleAPI.createModule(courseId, { title, description });
        toast.success('Module created!');
        if (onModuleAdded) onModuleAdded(res.data);
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || (isEdit ? 'Failed to update module' : 'Failed to create module'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100 relative animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center tracking-tight">
          {isEdit ? 'Edit Module' : 'Add New Module'}
        </h2>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
          <input
            className="w-full rounded-lg border border-gray-300 p-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none bg-gray-50"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Enter module title..."
            autoFocus
          />
        </div>
        <div className="mb-7">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 p-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none bg-gray-50 resize-none min-h-[100px]"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder="Enter module description..."
          />
        </div>
        <div className="flex gap-3 justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            {loading ? (isEdit ? 'Saving...' : 'Saving...') : (isEdit ? 'Update' : 'Save')}
          </button>
        </div>
      </form>
    </div>
  );
} 