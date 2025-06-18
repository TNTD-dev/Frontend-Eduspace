import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideBarTeacher from '@/components/layout/SideBarTeacher';
import NavBar from '@/components/layout/NavBar';
import {
  ArrowLeft,
  FileText,
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Link as LinkIcon
} from 'lucide-react';
import { courseModuleAPI } from '@/api';
import { moduleLessonAPI } from '@/api';
import { toast } from 'sonner';

export default function NewModulePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [lessons, setLessons] = useState([]);
  const [moduleId, setModuleId] = useState(null);

  const editorRef = useRef(null);

  // Inject initial HTML once to avoid caret jumping
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = moduleDescription;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setModuleDescription(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  const handleAddLesson = () =>
    setLessons(prev => [...prev, { id: Date.now(), title: '', duration: '', material: null }]);
  const handleLessonChange = (id, field, value) =>
    setLessons(prev => prev.map(l => (l.id === id ? { ...l, [field]: value } : l)));
  const handleMaterialChange = (id, file) => handleLessonChange(id, 'material', file);
  const handleDeleteLesson = id => setLessons(prev => prev.filter(l => l.id !== id));
  const handleNext = async () => {
    try {
      // Validate required fields
      if (!moduleTitle.trim()) {
        toast.error("Please enter module title");
        return;
      }

      if (!moduleDescription.trim()) {
        toast.error("Please enter module description");
        return;
      }

      console.log("Creating module with data:", {
        courseId,
        title: moduleTitle.trim(),
        description: moduleDescription.trim()
      });

      // Create module first
      const moduleResponse = await courseModuleAPI.createModule(courseId, {
        title: moduleTitle.trim(),
        description: moduleDescription.trim()
      });

      console.log("Module response:", moduleResponse);

      if (!moduleResponse) {
        throw new Error("Failed to create module");
      }

      // Store moduleId for later use
      setModuleId(moduleResponse.id);
      setStep(2);
    } catch (error) {
      console.error("Error creating module:", error);
      toast.error(error.response?.data?.message || "Failed to create module");
    }
  };
  const handleBack = () => setStep(1);

  const handleSave = async () => {
    try {
      if (!moduleId) {
        toast.error("Module not created");
        return;
      }

      // Create lessons if any
      if (lessons.length > 0) {
        const lessonPromises = lessons.map(lesson => 
          moduleLessonAPI.createLesson(courseId, moduleId, {
            title: lesson.title.trim(),
            duration: lesson.duration.trim(),
            contentURL: lesson.material ? URL.createObjectURL(lesson.material) : null,
            contentData: lesson.material ? lesson.material.name : null,
            type: lesson.material ? lesson.material.type : 'text'
          })
        );

        await Promise.all(lessonPromises);
      }

      toast.success("Module created successfully");
      navigate(`/teacher/courses/${courseId}`, { 
        state: { 
          fromModule: { id: moduleId, title: moduleTitle, description: moduleDescription }
        } 
      });
    } catch (error) {
      console.error("Error creating lessons:", error);
      toast.error(error.response?.data?.message || "Failed to create lessons");
    }
  };
  const handleCancel = () => navigate(`/teacher/courses/${courseId}`);

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarTeacher />

      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />

            {/* Back */}
            <button
              onClick={handleCancel}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="ml-2 text-base font-medium">Back</span>
            </button>

            {/* Step 1: Module Info */}
            {step === 1 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <FileText className="h-10 w-10 text-green-500" />
                  <h1 className="text-2xl font-semibold">Create A New Module</h1>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="mt-1 w-full bg-white rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Module title"
                    value={moduleTitle}
                    onChange={e => setModuleTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <div className="mt-1 border border-gray-300 rounded-md bg-white">
                    <div className="flex items-center border-b border-gray-200 bg-gray-50 px-2 py-1 space-x-1">
                      <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => execCommand('bold')}>
                        <Bold className="h-5 w-5 text-gray-600" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => execCommand('italic')}>
                        <Italic className="h-5 w-5 text-gray-600" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => execCommand('underline')}>
                        <Underline className="h-5 w-5 text-gray-600" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => execCommand('strikeThrough')}>
                        <Strikethrough className="h-5 w-5 text-gray-600" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => execCommand('insertUnorderedList')}>
                        <List className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => {
                          const url = window.prompt('Enter URL:', 'https://');
                          if (url) execCommand('createLink', url);
                        }}
                      >
                        <LinkIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        className="ml-auto p-1 hover:bg-gray-100 rounded"
                        onClick={() => {
                          if (editorRef.current) {
                            editorRef.current.innerHTML = '';
                            setModuleDescription('');
                          }
                        }}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                    <div
                      ref={editorRef}
                      contentEditable
                      className="min-h-[150px] w-full border-0 bg-white p-3 text-sm focus:outline-none"
                      onInput={() => {
                        if (editorRef.current) {
                          setModuleDescription(editorRef.current.innerHTML);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Next/Cancel */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCancel}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNext}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Lessons */}
            {step === 2 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <FileText className="h-10 w-10 text-green-500" />
                  <h1 className="text-2xl font-semibold">Create New Lessons</h1>
                </div>

                <div className="rounded-2xl border bg-white p-6 space-y-6" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-medium">Lesson {idx + 1}</h2>
                        <button onClick={() => handleDeleteLesson(lesson.id)} className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            className="mt-1 w-full bg-white rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Lesson title"
                            value={lesson.title}
                            onChange={e => handleLessonChange(lesson.id, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            rows={3}
                            className="mt-1 w-full bg-white rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                            placeholder="Lesson description…"
                            value={lesson.duration}
                            onChange={e => handleLessonChange(lesson.id, 'duration', e.target.value)}
                          />
                        </div>
                        <label
                          htmlFor={`lesson-file-${lesson.id}`}
                          className="mt-1 w-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer relative"
                        >
                          <FileText className="h-6 w-6 text-gray-500" />
                          <p className="mt-2 text-sm text-gray-500">Upload videos, PDF about the lesson</p>
                          <input
                            id={`lesson-file-${lesson.id}`}
                            type="file"
                            accept="*"
                            className="absolute opacity-0 top-0 left-0 w-full h-full"
                            onChange={e => e.target.files[0] && handleMaterialChange(lesson.id, e.target.files[0])}
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddLesson}
                    className="w-full rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    + Add Lesson
                  </button>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleBack}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSave}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Save Module
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}