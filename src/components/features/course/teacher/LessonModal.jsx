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
    onSave({
      ...initialData,
      title: title.trim(),
      description: description.trim(),
      fileObject: attachedFile,
      filename: attachedFile?.name || initialData.filename
    });
    onClose();
  };

  if (!isOpen) return null;

  //icon for file preview
  const isVideo = attachedFile
    ? attachedFile.type.startsWith("video/")
    : initialData.filename?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {initialData.id ? "Edit Lesson" : "New Lesson"}
          </h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Attach File</label>
            <div
              className="mt-1 flex items-center gap-4"
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
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}