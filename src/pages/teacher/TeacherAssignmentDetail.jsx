// src/pages/teacher/TeacherAssignmentDetail.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
import SideBarTeacher from "@/components/layout/SideBarTeacher";
import NavBar from "@/components/layout/NavBar";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  CheckCircle,
  Edit2,
  Trash2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff,
  Plus,
  FileText,
  MessageSquare,
} from "lucide-react";
import { currentCourses, completedCourses } from "@/data/mock/courseData";

const allCourses = [...currentCourses, ...completedCourses];

export default function TeacherAssignmentDetail() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  //new or edit mode
  const isNew = assignmentId === "new";
  const matchEdit = useMatch("/teacher/courses/:courseId/assignments/:assignmentId/edit");
  const isEditing = isNew || !!matchEdit;

  const editorRef = useRef(null);

  //course view data
  const [course, setCourse] = useState(null);
  const [assignment, setAssignment] = useState(null);

  //form state
  const [title, setTitle] = useState("");
  const [scoreOutOf, setScoreOutOf] = useState("Ungraded");
  const [dueDate, setDueDate] = useState("");
  const [instructionsHtml, setInstructionsHtml] = useState("");
  const [visible, setVisible] = useState(true);

  //file‐attachment
  const [imageFile, setImageFile] = useState(null);
  const [folderFiles, setFolderFiles] = useState([]);

  //mock data
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState({});

  const [loading, setLoading] = useState(true);

  //load course
  useEffect(() => {
    setLoading(true);

    const foundCourse = allCourses.find((c) => c.id === parseInt(courseId));
    setCourse(foundCourse || null);

    if (!foundCourse) {
      setAssignment(null);
      setLoading(false);
      return;
    }

    if (!isNew) {
      //view already existed assignment
      const rawId = assignmentId;                                 
      const foundAssign = foundCourse.assignments?.find(a =>      
        String(a.id) === rawId
      );
      setAssignment(foundAssign || null);

      if (foundAssign) {
        setTitle(foundAssign.title || "");
        setScoreOutOf(foundAssign.scoreOutOf ?? "Ungraded");
        setDueDate(foundAssign.dueDate || "");
        setInstructionsHtml(foundAssign.instructions || "");
        setVisible(foundAssign.visible == null ? true : foundAssign.visible);

        //mock data
        const mockSubs = [
          {
            id: 1,
            studentName: "Alice Johnson",
            date: "2024-03-10 14:30",
            file: "alice_solution.pdf",
            status: "submitted",
            grade: null,
            feedback: null,
          },
          {
            id: 2,
            studentName: "Bob Smith",
            date: "2024-03-11 09:15",
            file: "bob_solution.pdf",
            status: "graded",
            grade: "B+",
            feedback: "Good breakdown—watch edge cases.",
          },
        ];
        setSubmissionHistory(mockSubs);

        const fm = {};
        mockSubs.forEach((sub) => {
          fm[sub.id] = sub.feedback;
        });
        setFeedbackMap(fm);
      }
    } else {
      //new assignment
      setAssignment(null);
      setTitle("");
      setScoreOutOf("Ungraded");
      setDueDate("");
      setInstructionsHtml("");
      setVisible(true);
      setSubmissionHistory([]);
      setFeedbackMap({});
      setImageFile(null);
      setFolderFiles([]);
    }

    setLoading(false);
  }, [courseId, assignmentId, isNew, isEditing]);

  //view mode
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsSubmitting(true);

    //network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newSub = {
      id: submissionHistory.length + 1,
      studentName: "Teacher (preview)",
      date: new Date().toLocaleString(),
      file: selectedFile.name,
      status: "submitted",
      grade: null,
      feedback: null,
    };
    setSubmissionHistory((prev) => [newSub, ...prev]);
    setSelectedFile(null);
    setIsSubmitting(false);
  };

  //save
  const handleSave = (closeAfter = false) => {
    const id = !isNew ? parseInt(assignmentId.split("/")[0]) : Date.now();
    const assignmentObj = {
      id,
      title: title.trim(),
      scoreOutOf: scoreOutOf.trim(),
      dueDate,
      instructions: instructionsHtml.trim(),
      visible,
    };

    navigate(`/teacher/courses/${courseId}`, {
      state: {
        fromAssignment: {
          action: isNew ? "add" : "edit",
          assignment: assignmentObj,
        },
      },
    });
  };

  //delete
  const handleDelete = () => {
    if (!window.confirm("Delete this assignment?")) return;
    navigate(`/teacher/courses/${courseId}`, {
      state: {
        fromAssignment: {
          action: "delete",
          assignment: { id: parseInt(assignmentId.split("/")[0]) },
        },
      },
    });
  };

  //rick text editor
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    // After running the command, update our state:
    if (editorRef.current) {
      setInstructionsHtml(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  //loading + not found
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarTeacher />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <h2 className="text-2xl font-bold text-gray-700">Loading…</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarTeacher />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <h2 className="text-2xl font-bold text-gray-700">Course Not Found</h2>
                <Link
                  to="/teacher/courses"
                  className="mt-4 inline-block text-blue-500 hover:text-blue-600"
                >
                  Return to Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isNew && !assignment) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarTeacher />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <h2 className="text-2xl font-bold text-gray-700">Assignment Not Found</h2>
                <Link
                  to={`/teacher/courses/${courseId}`}
                  className="mt-4 inline-block text-blue-500 hover:text-blue-600"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //edit or new form
  if (isEditing) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
    <SideBarTeacher />
    <div className="flex-1 flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6">
        <NavBar />
      <div className="min-h-screen bg-[#f4f9fc]">
        {/*go back*/}
        <div className="w-full bg-[#f4f9fc] px-4">
          <Link
            to={`/teacher/courses/${courseId}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-2 text-base font-medium">
              Back
            </span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow-sm">
            {/*title*/}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <h1 className="text-2xl font-semibold">
                {isNew ? "New Assignment" : "Edit Assignment"}
              </h1>
            </div>

            {/*form*/}
            <div className="px-6 py-6 space-y-6">
              {/*name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Untitled"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/*score out of and due*/}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Score Out Of
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Ungraded"
                    value={scoreOutOf}
                    onChange={(e) => setScoreOutOf(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <div className="relative mt-1">
                    <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Instructions
  </label>

  <div className="mt-1 border border-gray-300 rounded-md">
    {/*tool bar*/}
    <div className="flex items-center border-b border-gray-200 bg-gray-50 px-2 py-1 space-x-1">
      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => execCommand("bold")}
      >
        <Bold className="h-5 w-5 text-gray-600" />
      </button>

      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => execCommand("italic")}
      >
        <Italic className="h-5 w-5 text-gray-600" />
      </button>

      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => execCommand("underline")}
      >
        <Underline className="h-5 w-5 text-gray-600" />
      </button>

      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => execCommand("strikeThrough")}
      >
        <Strikethrough className="h-5 w-5 text-gray-600" />
      </button>

      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => execCommand("insertUnorderedList")}
      >
        <List className="h-5 w-5 text-gray-600" />
      </button>

      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => {
          const url = window.prompt("Enter URL:", "https://");
          if (url) execCommand("createLink", url);
        }}
      >
        <LinkIcon className="h-5 w-5 text-gray-600" />
      </button>

      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => {
          const url = window.prompt("Enter image URL:", "https://");
          if (url) execCommand("insertImage", url);
        }}
      >
        <ImageIcon className="h-5 w-5 text-gray-600" />
      </button>

      <button
        type="button"
        className="ml-auto p-1 hover:bg-gray-100 rounded"
        onClick={() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = "";
            setInstructionsHtml("");
          }
        }}
      >
        <Trash2 className="h-5 w-5 text-red-500" />
      </button>
    </div>

    <div
      ref={editorRef}
      contentEditable
      className="min-h-[150px] w-full resize-none border-0 p-2 text-sm focus:outline-none"
    />
  </div>
</div>


              {/*attach file */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/*image*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Attach Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImageFile(file);
                    }}
                    className="mt-1 block w-full text-sm text-gray-600"
                  />
                  {imageFile && (
                    <p className="mt-2 text-xs text-gray-500">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>

                {/*folder*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Attach Folder
                  </label>
                  <input
                    type="file"
                    webkitdirectory="true"
                    directory=""
                    onChange={(e) => {
                      const filesArray = Array.from(e.target.files);
                      setFolderFiles(filesArray);
                    }}
                    className="mt-1 block w-full text-sm text-gray-600"
                  />
                  {folderFiles.length > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      {folderFiles.length} files selected
                    </p>
                  )}
                </div>
              </div>

              {/*visibility button*/}
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSave(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Save and Close
                  </button>
                  <button
                    onClick={() => handleSave(false)}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>Visibility:</span>
                  <button
                    onClick={() => setVisible((v) => !v)}
                    className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    {visible ? (
                      <>
                        <Eye className="h-4 w-4 text-gray-600" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 text-gray-600" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                  {!isNew && (
                    <button
                      onClick={handleDelete}
                      className="ml-4 flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-200 transition-colors"
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarTeacher />
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />

            {/* Assignment Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  to={`/teacher/courses/${courseId}`}
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-[#1f53f3]"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </Link>
              </div>
              <button
                onClick={() =>
                  navigate(
                    `/teacher/courses/${courseId}/assignments/${assignment.id}/edit`
                  )
                }
                className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1 hover:bg-gray-200 transition-colors"
              >
                <Edit2 className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {assignment.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Due: {assignment.dueDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>Status: {assignment.status}</span>
              </div>
            </div>

            {/*main content*/}
            <div className="grid grid-cols-1 gap-6">
              {/*details*/}
              <div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Assignment Details
                  </h2>
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: assignment.instructions }}
                  />

                  {/*student submission*/}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Student Submissions
                    </h3>
                    <div className="space-y-4">
                      {submissionHistory.length === 0 && (
                        <div className="text-sm text-gray-500">
                          No submissions yet.
                        </div>
                      )}
                        {submissionHistory.map((sub) => (
                          <div key={sub.id} className="rounded-lg border p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    {sub.studentName} — {sub.file}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    Submitted on {sub.date}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                              {sub.grade && (
                                <span className="text-sm font-medium text-gray-700">
                                  Grade: {sub.grade}
                                </span>
                              )}
                              </div>
                              <button
                                onClick={() => {
                                  setActiveSubmission(sub);
                                  setGradeInput(sub.grade || "");
                                  setFeedbackInput(sub.feedback || "");
                                  setShowSubmissionModal(true);
                                }}
                                className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700"
                              >
                                Review
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                {showSubmissionModal && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowSubmissionModal(false)}
                  >
                    <div
                      className="bg-white rounded-lg p-6 w-full max-w-md"
                      onClick={e => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-semibold mb-4">Review Submission</h3>

                      <p className="font-medium">File:</p>
                      <a
                        href={`path/to/uploads/${activeSubmission.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mb-4 block"
                      >
                        View Attached File
                      </a>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Grade</label>
                        <input
                          type="text"
                          value={gradeInput}
                          onChange={e => setGradeInput(e.target.value)}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Feedback</label>
                        <textarea
                          rows={3}
                          value={feedbackInput}
                          onChange={e => setFeedbackInput(e.target.value)}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowSubmissionModal(false)}
                          className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            // update your submissionHistory and feedbackMap here:
                            setSubmissionHistory(prev =>
                              prev.map(s =>
                                s.id === activeSubmission.id
                                  ? { ...s, status: "graded", grade: gradeInput, feedback: feedbackInput }
                                  : s
                              )
                            );
                            setFeedbackMap(prev => ({
                              ...prev,
                              [activeSubmission.id]: feedbackInput
                            }));
                            setShowSubmissionModal(false);
                          }}
                          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>    
    </div>
  );
}
