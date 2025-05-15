import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const NewDiscussion = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState(''); // Title of the discussion
  const [content, setContent] = useState(''); // Content of the discussion
  const [tags, setTags] = useState(''); // Tags of the discussion
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  //Prevent browser refresh
    if (!title.trim() || !content.trim()) return; // Check if title and content are empty

    setIsSubmitting(true); // Show loading state
    try {
      // Split tags by comma and trim whitespace
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: tagArray,
        createdAt: 'Just now',
        lastActivity: 'Just now',
        isPinned: false,
        author: {
          id: 'current-user',
          name: 'Current User',
          role: 'student',
          avatar: '/placeholder.jpg'
        },
        replies: []
      });

      // Reset form
      setTitle('');
      setContent('');
      setTags('');
      onClose();
    } catch (error) {
      console.error('Error creating discussion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Create New Discussion</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter discussion title"
              className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Content Textarea */}
          <div className="mb-4">
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your discussion content..."
              className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              rows="5"
              required
            />
          </div>

          {/* Tags Input */}
          <div className="mb-6">
            <label
              htmlFor="tags"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., Question, Help, Discussion"
              className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Add tags to help others find your discussion
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Creating...' : 'Create Discussion'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussion;
