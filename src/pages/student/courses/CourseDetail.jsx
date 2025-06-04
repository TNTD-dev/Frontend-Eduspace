import React, { useState, useEffect } from "react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  MessageSquare,
  Award,
  Clock,
  Calendar,
  Download,
  Users,
  Play,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  MoreHorizontal,
  MapPin,
  ExternalLink,
  ThumbsUp,
} from "lucide-react";
import { currentCourses, completedCourses } from "@/data/mock/courseData";
import NavBar from "@/components/layout/NavBar";
import NewDiscussion from "@/components/features/course/NewDiscussion";

// Combine current and completed courses into a single array for easier course lookup
const allCourses = [...currentCourses, ...completedCourses];

const CourseDetail = () => {
  // Get courseId from URL parameters
  const { courseId } = useParams();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("content"); // Controls which tab is currently active
  const [course, setCourse] = useState(null); // Stores the current course data
  const [loading, setLoading] = useState(true); // Controls loading state
  const [expandedModules, setExpandedModules] = useState({}); // Tracks which modules are expanded
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false); // Controls if the new discussion modal is open

  // Fetch course data when component mounts or courseId changes
  useEffect(() => {
    // Simulate API call to fetch course details
    const fetchCourse = () => {
      setLoading(true);
      setTimeout(() => {
        // Find course by ID in the combined courses array
        const foundCourse = allCourses.find((c) => c.id === parseInt(courseId));
        setCourse(foundCourse || null);

        // Initialize all modules as expanded by default
        if (foundCourse && foundCourse.modules) {
          const initialExpandedState = {};
          foundCourse.modules.forEach((module) => {
            initialExpandedState[module.id] = true;
          });
          setExpandedModules(initialExpandedState);
        }

        setLoading(false);
      }, 500); // Simulate network delay
    };

    fetchCourse();
  }, [courseId]);

  // Toggle module expansion state
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Helper functions to determine course type
  const isCurrentCourse = course && course.progress < course.total; // Check if it's a current course
  const isCompletedCourse = course && course.progress === course.total; // Check if it's a completed course

  // Add this function to handle lesson click
  const handleLessonClick = (lessonId) => {
    navigate(`/student/courses/${courseId}/lessons/${lessonId}`);
  };

  const handleAssignmentClick = (assignmentId) => {
    navigate(`/student/courses/${courseId}/assignments/${assignmentId}`);
  };

  // Add this function after handleAssignmentClick
  const handleDiscussionClick = (discussionId) => {
    navigate(`/student/courses/${courseId}/discussions/${discussionId}`);
  };

  // Add this function after handleDiscussionClick
  const handleNewDiscussion = async (discussionData) => {
    // Simulate API call to create new discussion
    const newDiscussion = {
      id: `d${Date.now()}`,
      ...discussionData,
    };

    // Update course discussions
    setCourse((prev) => ({
      ...prev,
      discussions: [newDiscussion, ...(prev.discussions || [])],
    }));

    // Navigate to the new discussion
    handleDiscussionClick(newDiscussion.id);
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarStudent />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state UI - Course not found
  if (!course) {
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
                    Course Not Found
                  </h2>
                  <p className="text-gray-500">
                    The course you're looking for doesn't exist.
                  </p>
                  <Link
                    to="/student/courses"
                    className="mt-4 inline-block text-blue-500 hover:text-blue-600"
                  >
                    Return to Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main course detail UI
  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />
            {/* Course content will go here */}
            <div
              className="relative rounded-t-lg overflow-hidden h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${course.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
              <div className="absolute bottom-0 left-0 w-full p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Link
                    to="/student/courses"
                    className="rounded-full bg-white/20 p-1 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <span
                    className={`rounded-md ${course.categoryColor} px-2 py-1 text-xs font-bold text-white`}
                  >
                    {course.category}
                  </span>
                </div>
                <h1 className="mb-2 text-3xl font-bold text-white">
                  {course.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-white">
                      <img
                        src={course.instructorImage || "/placeholder.jpg"}
                        alt={course.instructor}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  {isCurrentCourse && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-white/30">
                        <div
                          className="h-full rounded-full bg-white"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {course.progress}% Complete
                      </span>
                    </div>
                  )}

                  {isCompletedCourse && (
                    <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-green-300 backdrop-blur-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Completed on {course.endDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Navigation */}
            <div className="border-b bg-white">
              <div className="flex space-x-1 px-6">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === "content"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab("assignments")}
                  className={`border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === "assignments"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Assignments
                </button>
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === "resources"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Resources
                </button>
                <button
                  onClick={() => setActiveTab("discussions")}
                  className={`border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === "discussions"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Discussions
                </button>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              {/*Course Overview*/}
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                      About This Course
                    </h2>
                    <p className="text-gray-700">{course.description}</p>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                      Course Details
                    </h2>
                    <div className="space-y-3">
                      {isCurrentCourse && (
                        <>
                          <div className="flex items-start gap-3">
                            <Calendar className="mt-0.5 h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Course Duration
                              </p>
                              <p className="text-sm text-gray-600">
                                {course.startDate} - {course.endDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="mt-0.5 h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Schedule
                              </p>
                              <p className="text-sm text-gray-600">
                                {course.schedule}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Location
                              </p>
                              <p className="text-sm text-gray-600">
                                {course.location}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      {isCompletedCourse && (
                        <>
                          <div className="flex items-start gap-3">
                            <Calendar className="mt-0.5 h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Course Period
                              </p>
                              <p className="text-sm text-gray-600">
                                {course.startDate} - {course.endDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Award className="mt-0.5 h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Final Grade
                              </p>
                              <p className="text-sm text-gray-600">
                                {course.grade}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="mt-0.5 h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Completion Date
                              </p>
                              <p className="text-sm text-gray-600">
                                {course.endDate}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {isCurrentCourse && (
                      <div className="mt-6">
                        <button className="w-full rounded-lg bg-blue-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-600">
                          Continue Learning
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "content" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  Course Content
                </h2>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {course.modules?.length || 0} modules •{" "}
                    {course.modules?.reduce(
                      (total, module) => total + module.lessons.length,
                      0
                    ) || 0}{" "}
                    lessons
                  </p>
                  {isCurrentCourse && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${course.categoryColor}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {course.progress}/{course.total} completed
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {course.modules?.map((module) => (
                    <div
                      key={module.id}
                      className="rounded-lg border border-gray-200"
                    >
                      <div
                        className="flex cursor-pointer items-center justify-between bg-gray-50 p-4"
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {module.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {module.lessons.length} lessons
                            </p>
                          </div>
                        </div>
                        <button className="rounded-full p-1 hover:bg-gray-200">
                          {expandedModules[module.id] ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>

                      {expandedModules[module.id] && (
                        <div className="divide-y border-t">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleLessonClick(lesson.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="rounded-full bg-gray-100 p-2 text-gray-500">
                                  {lesson.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    {lesson.title}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {lesson.duration}
                                  </p>
                                </div>
                              </div>
                              {!isCompletedCourse && (
                                <button
                                  className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the parent div's onClick
                                    handleLessonClick(lesson.id);
                                  }}
                                >
                                  {lesson.completed ? "Review" : "Start"}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  Assignments
                </h2>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f4f9fc]">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Assignment
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Due Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Grade
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {course.assignments?.map((assignment) => (
                        <tr
                          key={assignment.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleAssignmentClick(assignment.id)}
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.title}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {assignment.dueDate}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                assignment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : assignment.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {assignment.status === "completed"
                                ? "Completed"
                                : assignment.status === "in-progress"
                                ? "In Progress"
                                : "To Do"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {assignment.grade ? (
                              <div className="text-sm font-medium text-gray-900">
                                {assignment.grade}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">-</div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignmentClick(assignment.id);
                              }}
                            >
                              {isCompletedCourse
                                ? "View"
                                : assignment.status === "completed"
                                ? "Review"
                                : "Submit"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  Course Resources
                </h2>
                <div className="space-y-4">
                  {course.resources?.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {resource.type}
                          </p>
                        </div>
                      </div>
                      <a
                        href={resource.link}
                        className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        target="_blank" // Opens the link in a new tab
                        rel="noopener noreferrer" // Prevents the new page from accessing the window.opener property
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Open</span>
                      </a>
                    </div>
                  ))}

                  {/* No Resources Available */}
                  {(!course.resources || course.resources.length === 0) && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 text-center">
                      <div className="mb-3 rounded-full bg-gray-100 p-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mb-1 text-lg font-medium text-gray-800">
                        No Resources Available
                      </h3>
                      <p className="text-gray-500">
                        There are no resources available for this course yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Discussions */}
            {activeTab === "discussions" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Discussion Forum
                  </h2>
                  {!isCompletedCourse && (
                    <button
                      onClick={() => setIsNewDiscussionOpen(true)}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      New Discussion
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {course.discussions?.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleDiscussionClick(discussion.id)}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full">
                            <img
                              src={
                                "/placeholder.jpg" || discussion.author.avatar
                              }
                              alt={discussion.author.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-800">
                                {discussion.title}
                              </h3>
                              {discussion.isPinned && (
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                                  Pinned
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-medium">
                                {discussion.author.name}
                              </span>
                              <span>•</span>
                              <span>
                                {discussion.author.role === "teacher"
                                  ? "Teacher"
                                  : "Student"}
                              </span>
                              <span>•</span>
                              <span>{discussion.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="rounded-full p-1 hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more options click
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="mb-2 text-gray-600 line-clamp-2">
                        {discussion.content}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MessageSquare className="h-4 w-4" />
                            <span>
                              {discussion.replies?.length || 0} replies
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          Last activity: {discussion.lastActivity}
                        </span>
                      </div>
                    </div>
                  ))}

                  {(!course.discussions || course.discussions.length === 0) && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 text-center">
                      <div className="mb-3 rounded-full bg-gray-100 p-3">
                        <MessageSquare className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mb-1 text-lg font-medium text-gray-800">
                        No Discussions Yet
                      </h3>
                      <p className="mb-4 text-gray-500">
                        Be the first to start a discussion in this course.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <NewDiscussion
        isOpen={isNewDiscussionOpen}
        onClose={() => setIsNewDiscussionOpen(false)}
        onSubmit={handleNewDiscussion}
      />
    </div>
  );
};

export default CourseDetail;
