// src/pages/teacher/TeacherResourceDetail.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Upload, FileText } from "lucide-react";
import SideBarTeacher from "@/components/layout/SideBarTeacher";
import NavBar from "@/components/layout/NavBar";
import { currentCourses, completedCourses } from "@/data/mock/courseData";
const allCourses = [...currentCourses, ...completedCourses];

const TeacherResourceDetail = () => {
  const { courseId, resourceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isNew = resourceId === "new";
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [visible, setVisible] = useState(true);
  const [existingResource, setExistingResource] = useState(null);

  useEffect(() => {
    const foundCourse = allCourses.find((c) => c.id === parseInt(courseId));
    if (!foundCourse) {
      navigate("/teacher/courses", { replace: true });
      return;
    }

    if (!isNew) {
      const locRes = location.state?.fromResource?.resource;
      if (locRes) {
        setExistingResource(locRes);
        setTitle(locRes.title || "");
        setDescription(locRes.description || "");
        setVisible(locRes.visible == null ? true : locRes.visible);
        if (locRes.filename) {
          setAttachedFile({ name: locRes.filename, isPlaceholder: true });
        }
      } else {
        navigate(`/teacher/courses/${courseId}`, { replace: true });
      }
    }
  }, [courseId, isNew, location.state, navigate]);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleSave = (closeAfter = false) => {
    const id = isNew ? Date.now() : parseInt(resourceId);
    const resourceObj = {
      id,
      title: title.trim(),
      description: description.trim(),
      filename: attachedFile ? attachedFile.name : "",
      visible,
      fileObject: attachedFile instanceof File ? attachedFile : null,
    };

    navigate(`/teacher/courses/${courseId}`, {
      state: {
        fromResource: {
          action: isNew ? "add" : "edit",
          resource: resourceObj,
        },
      },
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this resource?")) return;
    navigate(`/teacher/courses/${courseId}`, {
      state: {
        fromResource: {
          action: "delete",
          resource: { id: parseInt(resourceId) },
        },
      },
    });
  };

  const backURL = `/teacher/courses/${courseId}`;

  return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
    <SideBarTeacher />
    <div className="flex-1 flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6">
        <NavBar />
      {/* ── Top Bar: “Back to Manage Resources” ──────────────────────────────────── */}
      <div className="w-full mb-4">
        <Link
          to={backURL}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="ml-2 text-base font-medium">
            Back
          </span>
        </Link>
      </div>

      {/* ── Form Container ─────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Form Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold">
              {isNew ? "Add New Resource" : "Edit Resource"}
            </h1>
          </div>

          {/* Form Fields */}
          <div className="px-6 py-6 space-y-6">
            {/* ── Title ───────────────────────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Resource Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* ── Description ────────────────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="Optional description for this resource…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* ── File Upload (Click or Drag/Dro​p) ─────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attach File
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    setAttachedFile(e.dataTransfer.files[0]);
                    e.dataTransfer.clearData();
                  }
                }}
                className="mt-1 w-full h-32 flex items-center justify-center border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer relative"
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-6 w-6 text-gray-500" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, DOC, DOCX, ZIP (MAX. 20MB)
                  </p>
                </div>
                {/* Invisible file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.zip"
                  className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer"
                  onChange={onFileChange}
                />
              </div>

              {attachedFile && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>
                    {attachedFile.name}{" "}
                    {attachedFile.isPlaceholder && "(already uploaded)"}
                  </span>
                </div>
              )}
            </div>

            {/* ── Visibility Toggle ────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <label>Visibility:</label>
              <button
                onClick={() => setVisible((prev) => !prev)}
                className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-colors"
              >
                {visible ? "Visible" : "Hidden"}
              </button>
            </div>

            {/* ── Buttons: Save / Save & Close / Cancel / Delete ───────────────── */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {/* Save & Close → navigate back với “closeAfter” */}
                <button
                  onClick={() => handleSave(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Save and Close
                </button>
                {/* Save (ở lại trang) */}
                <button
                  onClick={() => handleSave(false)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Save
                </button>
                {/* Cancel → quay lại */}
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Chỉ hiển thị “Delete” khi đang edit (không phải new) */}
              {!isNew && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
      </div>
  );
};

export default TeacherResourceDetail;
