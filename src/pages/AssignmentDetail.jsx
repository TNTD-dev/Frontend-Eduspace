import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import {
  ArrowLeft,
  FileText,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { currentCourses, completedCourses } from "@/data/mock/courseData";

const allCourses = [...currentCourses, ...completedCourses];

const AssignmentDetail = () => {
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Find course and assignment from mock data
    const foundCourse = allCourses.find(
      (course) => course.id === parseInt(courseId)
    );
    setCourse(foundCourse);

    if (foundCourse) {
      const foundAssignment = foundCourse.assignments?.find(
        (assignment) => assignment.id === assignmentId
      );
      setAssignment(foundAssignment);

      // Mock submission history
      if (foundAssignment) {
        setSubmissionHistory([
          {
            id: 1,
            date: "2024-03-15 14:30",
            file: "assignment1_v1.pdf",
            status: "submitted",
            grade: null,
            feedback: null,
          },
          {
            id: 2,
            date: "2024-03-16 09:15",
            file: "assignment1_v2.pdf",
            status: "graded",
            grade: "A",
            feedback: "Great work! Your implementation shows good understanding of the concepts.",
          },
        ]);
      }
    }

    setLoading(false);
  }, [courseId, assignmentId]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add new submission to history
    const newSubmission = {
      id: submissionHistory.length + 1,
      date: new Date().toLocaleString(),
      file: selectedFile.name,
      status: "submitted",
      grade: null,
      feedback: null,
    };

    setSubmissionHistory([newSubmission, ...submissionHistory]);
    setSelectedFile(null);
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarStudent />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Loading...
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !assignment) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarStudent />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Assignment Not Found
                  </h2>
                  <p className="text-gray-500">
                    The assignment you're looking for doesn't exist.
                  </p>
                  <Link
                    to={`/student/courses/${courseId}`}
                    className="mt-4 inline-block text-blue-500 hover:text-blue-600"
                  >
                    Return to Course
                  </Link>
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
      <SideBarStudent />
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />
            
            {/* Assignment Header */}
            <div className="mb-6">
              <Link
                to={`/student/courses/${courseId}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1f53f3]"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Course</span>
              </Link>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {assignment.title}
              </h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {assignment.dueDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Status: {assignment.status}</span>
                </div>
                {assignment.grade && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Grade: {assignment.grade}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Assignment Content */}
            <div className="grid grid-cols-1 gap-6">
              {/* Main Content */}
              <div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Assignment Details
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600">
                      {assignment.description || "No description provided."}
                    </p>
                  </div>

                  {/* Submission Form */}
                  {assignment.status !== "completed" && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Submit Assignment
                      </h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-4">
                          <label className="flex-1">
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PDF, DOC, DOCX (MAX. 10MB)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  accept=".pdf,.doc,.docx"
                                />
                              </label>
                            </div>
                          </label>
                        </div>
                        {selectedFile && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>{selectedFile.name}</span>
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={!selectedFile || isSubmitting}
                          className="w-full rounded-lg bg-blue-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Assignment"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Submission History */}
                <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Submission History
                  </h2>
                  <div className="space-y-4">
                    {submissionHistory.map((submission) => (
                      <div
                        key={submission.id}
                        className="rounded-lg border p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {submission.file}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Submitted on {submission.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {submission.status === "graded" ? (
                              <>
                                <span className="text-sm font-medium text-green-600">
                                  Grade: {submission.grade}
                                </span>
                                <button
                                  onClick={() => setFeedback(submission.feedback)}
                                  className="p-2 text-gray-500 hover:text-gray-700"
                                >
                                  <MessageSquare className="h-5 w-5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">
                                Pending review
                              </span>
                            )}
                          </div>
                        </div>
                        {feedback && submission.id === submissionHistory[0].id && (
                          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                            <p className="font-medium text-gray-800">Feedback:</p>
                            <p className="mt-1">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
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

export default AssignmentDetail;