import React, { useState, useEffect, useRef } from "react";
import { Play, FileText, X } from "lucide-react";

export default function LessonModal({
  isOpen,
  onClose,
  onSave,
  initialData = {}
}) {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setAttachedFile(initialData.fileObject || null);
    }
  }, [isOpen, initialData]);

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const lessonData = {
      title: title.trim(),
      description: description.trim(),
      type: isVideo ? 'video' : 'document',
      fileObject: attachedFile,
      filename: attachedFile?.name || initialData.filename
    };

    // If editing existing lesson, include the id and moduleId
    if (initialData.id) {
      lessonData.id = initialData.id;
      lessonData.moduleId = initialData.moduleId;
    }

    console.log('Submitting lesson data:', lessonData); // Debug log
    onSave(lessonData);
    onClose();
  };

  if (!isOpen) return null;

  //icon for file preview
  const isVideo = attachedFile
    ? attachedFile.type.startsWith("video/")
    : initialData.filename?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
      <form
        onSubmit={e => { e.preventDefault(); handleSubmit(); }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100 relative animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {initialData.id ? "Edit Lesson" : "New Lesson"}
          </h2>
          <button type="button" onClick={onClose} className="hover:bg-gray-100 rounded-full p-1">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none bg-gray-50"
            placeholder="Enter lesson title..."
            required
            autoFocus
          />
        </div>

        <div className="mb-7">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none bg-gray-50 resize-none min-h-[80px]"
            placeholder="Enter lesson description..."
            required
          />
        </div>

        <div className="mb-7">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Attach File</label>
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            {isVideo ? (
              <Play className="h-6 w-6 text-blue-500" />
            ) : (
              <FileText className="h-6 w-6 text-gray-500" />
            )}
            <span className="text-sm text-gray-600">
              {attachedFile?.name || initialData.filename || "No file chosen"}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,.pdf,.doc,.docx,.zip"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}