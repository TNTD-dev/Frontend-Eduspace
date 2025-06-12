import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import SideBarTeacher from '@/components/layout/SideBarTeacher';
import NavBar from '@/components/layout/NavBar';
import {
  ArrowLeft,
  Upload,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Link as LinkIcon,
  Trash2,
} from 'lucide-react';

export default function NewCourse() {
  const { courseId } = useParams();
  const navigate     = useNavigate();

  // Form state
  const [title, setTitle]               = useState('');
  const [category, setCategory]         = useState('');
  const [instructor, setInstructor]     = useState('');
  const [descriptionHtml, setDescriptionHtml] = useState('');
  const [startDate, setStartDate]       = useState('');
  const [endDate, setEndDate]           = useState('');
  const [schedule, setSchedule]         = useState('');
  const [location, setLocation]         = useState('');
  const [coverFile, setCoverFile]       = useState(null);

  const fileInputRef = useRef(null);
  const editorRef    = useRef(null);

  // If in “edit” mode, load mock data once
  useEffect(() => {
    if (courseId) {
      const mockCourse = {
        title: 'Existing Course Title',
        category: 'Mock Category',
        instructor: 'Jane Doe',
        description:
          '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
        startDate: '2025-06-01',
        endDate: '2025-07-01',
        schedule: 'Mon & Wed 5–7pm',
        location: 'Room 101',
        coverFileName: '',
        image: '',
        status: 'draft',
      };

      setTitle(mockCourse.title);
      setCategory(mockCourse.category);
      setInstructor(mockCourse.instructor);
      setDescriptionHtml(mockCourse.description);
      setStartDate(mockCourse.startDate);
      setEndDate(mockCourse.endDate);
      setSchedule(mockCourse.schedule);
      setLocation(mockCourse.location);
      if (mockCourse.coverFileName) {
        setCoverFile({ name: mockCourse.coverFileName, isPlaceholder: true });
      }
    }
  }, [courseId]);

  // Inject initial description into editor once
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = descriptionHtml;
    }
  }, []);

  // execCommand helper
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setDescriptionHtml(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const newCourse = {
      id: courseId || Date.now(),
      title: title.trim(),
      category: category.trim(),
      instructor: instructor.trim(),
      description: descriptionHtml.trim(),
      startDate,
      endDate,
      schedule: schedule.trim(),
      location: location.trim(),
      coverFileName: coverFile ? coverFile.name : '',
      // new fields for draft flow:
      status: 'draft',
      image: coverFile ? URL.createObjectURL(coverFile) : '',
    };

    // pass the course via navigate state for mock-list merging
    navigate('/teacher/courses', { state: { newCourse } });
  };

  const handleCancel = () => {
    navigate('/teacher/courses');
  };

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarTeacher />

      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          {/* NavBar */}
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />
          </div>

          {/* Content */}
          <div className="w-full -mt-4 px-6">
            {/* Back + Heading */}
            <div className="flex items-center gap-6 mb-6">
              <Link
                to="/teacher/courses"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="ml-2 text-base font-medium">Back</span>
              </Link>
              <h1 className="text-2xl font-semibold">Create New Course</h1>
            </div>

            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full bg-white rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Course Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full bg-white rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Course Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Instructor
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full bg-white rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Instructor Name"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1 border border-gray-300 rounded-md bg-white">
                    {/* Toolbar */}
                    <div className="flex items-center border-b border-gray-200 bg-gray-50 px-2 py-1 space-x-1">
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => execCommand('bold')}
                      >
                        <Bold className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => execCommand('italic')}
                      >
                        <Italic className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => execCommand('underline')}
                      >
                        <Underline className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => execCommand('strikeThrough')}
                      >
                        <Strikethrough className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => execCommand('insertUnorderedList')}
                      >
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
                            setDescriptionHtml('');
                          }
                        }}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                    {/* Editable Region */}
                    <div
                      ref={editorRef}
                      contentEditable
                      className="min-h-[150px] w-full border-0 bg-white p-3 text-sm focus:outline-none"
                      onInput={() => {
                        if (editorRef.current) {
                          setDescriptionHtml(editorRef.current.innerHTML);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 lg:border-l lg:border-gray-300 lg:pl-6">
                {/* Start & End Dates */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 w-full bg-white rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 w-full bg-white rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Schedule
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full bg-white rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Mon/Wed 5–7pm"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full bg-white rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Classroom or URL"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Image
                  </label>
                  <div
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        setCoverFile(e.dataTransfer.files[0]);
                        e.dataTransfer.clearData();
                      }
                    }}
                    className="mt-1 w-full h-44 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer relative"
                  >
                    <Upload className="h-6 w-6 text-gray-500" />
                    <p className="mt-2 text-sm text-gray-500">
                      Drag & Drop or Browse
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, JPEG (MAX. 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer"
                      onChange={handleCoverChange}
                    />
                  </div>
                  {coverFile && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <span>
                        {coverFile.name}
                        {coverFile.isPlaceholder && ' (current)'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={handleCancel}
                    className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    {courseId ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
