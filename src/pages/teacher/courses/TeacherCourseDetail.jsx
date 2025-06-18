// src/pages/teacher/TeacherCourseDetail.jsx

import React, { useState, useEffect, useRef } from "react";
import SideBarTeacher from "@/components/layout/SideBarTeacher";
import EditableCourseHeader from "@/components/features/course/teacher/EditableCourseHeader";
import LessonModal from "@/components/features/course/teacher/LessonModal";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Play,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Calendar,
  Clock,
  Award,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Users,
  Star,
  TrendingUp,
  MapPin
} from "lucide-react";
import { currentCourses, completedCourses } from "@/data/mock/courseData";
import NavBar from "@/components/layout/NavBar";
import NewDiscussion from "@/components/features/course/NewDiscussion";
import { studentData } from "@/data/mock/mockStudentData";
import { courseAPI, courseModuleAPI, moduleLessonAPI } from "@/api";
import { toast } from "sonner";
import AddModuleModal from '@/components/features/course/teacher/AddModuleModal';


const allCourses = [...currentCourses, ...completedCourses];

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();


  const [activeTab, setActiveTab] = useState("content");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  const [draftDescription, setDraftDescription] = useState("");
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");
  const [draftSchedule, setDraftSchedule] = useState("");
  const [draftLocation, setDraftLocation] = useState("");

  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);


  const [modulesState, setModulesState] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});

  const [students, setStudents] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [showAddModuleModal, setShowAddModuleModal] = useState(false);

  const [editingModule, setEditingModule] = useState(null);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const editDialogRef = useRef(null);

  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const isPublished = course?.status === "current";
  const isArchived = course?.status === "archived";

  const dialogRef = useRef(null);

  //load details
  useEffect(() => {
    setLoading(true);
    Promise.all([
      courseAPI.getCourseById(courseId),
      courseModuleAPI.getAllModules(courseId)
    ])
      .then(([resCourse, resModules]) => {
        const courseData = resCourse.data;
        setCourse(courseData);

        console.log('API Response:', resModules);
        console.log('Response data:', resModules.data);
        console.log('Is Array?', Array.isArray(resModules.data));
        console.log('Data type:', typeof resModules.data);
        console.log('Data structure:', JSON.stringify(resModules.data, null, 2));

        // Set draft fields
        setDraftDescription(courseData.description || "");
        setDraftStartDate(courseData.startDate || "");
        setDraftEndDate(courseData.endDate || "");
        setDraftSchedule(courseData.schedule || "");
        setDraftLocation(courseData.location || "");

        // Set modules từ API - Fix: Access the data array correctly
        const modulesData = resModules.data.data || [];
        console.log('Processed modules data:', modulesData);
        
        // Sort modules by order before setting state
        const sortedModules = modulesData.sort((a, b) => a.order - b.order);
        
        setModulesState(
          sortedModules.map((m) => ({
            ...m,
            lessons: m.Lessons ? [...m.Lessons].sort((a, b) => a.order - b.order) : []
          }))
        );
        
        const initialExpanded = {};
        sortedModules.forEach((m) => {
          initialExpanded[m.id] = true;
        });
        setExpandedModules(initialExpanded);

        // TODO: Replace with real API call for students
        setStudents(studentData[courseData.id] || []);
      })
      .catch(err => {
        console.error("Error fetching course details:", err);
        toast.error("Failed to load course details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId]);

  //handle add assignment
  useEffect(() => {
    if (course && location.state?.fromAssignment) {
      const { action, assignment } = location.state.fromAssignment;
      if (action === "add") {
        setCourse((prev) => ({
          ...prev,
          assignments: [assignment, ...(prev.assignments || [])]
        }));
      } else if (action === "edit") {
        setCourse((prev) => ({
          ...prev,
          assignments: prev.assignments.map((a) =>
            a.id === assignment.id ? assignment : a
          )
        }));
      } else if (action === "delete") {
        setCourse((prev) => ({
          ...prev,
          assignments: prev.assignments.filter((a) => a.id !== assignment.id)
        }));
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, course, navigate]);

  //handle add resources
  useEffect(() => {
    if (course && location.state?.fromResource) {
      const { action, resource } = location.state.fromResource;
      if (action === "add") {
        setCourse((prev) => ({
          ...prev,
          resources: [resource, ...(prev.resources || [])]
        }));
      } else if (action === "edit") {
        setCourse((prev) => ({
          ...prev,
          resources: prev.resources.map((r) =>
            r.id === resource.id ? resource : r
          )
        }));
      } else if (action === "delete") {
        setCourse((prev) => ({
          ...prev,
          resources: prev.resources.filter((r) => r.id !== resource.id)
        }));
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, course, navigate]);

  // Thêm useEffect log modulesState mỗi khi thay đổi
  useEffect(() => {
    console.log('modulesState updated:', modulesState);
  }, [modulesState]);

  //module and lessons
  const toggleModule = (mid) => {
    setExpandedModules((prev) => ({ ...prev, [mid]: !prev[mid] }));
  };

  const handleAddModule = () => {
    if (dialogRef.current) dialogRef.current.showModal();
    setShowAddModuleModal(true);
  };

  const handleCloseDialog = () => {
    if (dialogRef.current) dialogRef.current.close();
    setShowAddModuleModal(false);
  };

  const handleModuleAdded = (newModule) => {
    // Reload page to fetch latest modules from server
    window.location.reload();
  };

  const handleAddLesson = (moduleId) => {
    const lessonTitle = prompt("Enter new lesson title:");
    if (!lessonTitle?.trim()) return;
    const lessonDuration = prompt("Enter lesson duration (e.g. '10:00'):");
    if (!lessonDuration?.trim()) return;
    const newLesson = {
      id: Date.now(),
      title: lessonTitle.trim(),
      duration: lessonDuration.trim(),
      completed: false
    };
    setModulesState((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      )
    );
  };

  const handleEditModule = (moduleId) => {
    const mod = modulesState.find((m) => m.id === moduleId);
    if (!mod) return;
    setEditingModule(mod);
    setShowEditModuleModal(true);
    if (editDialogRef.current) editDialogRef.current.showModal();
  };

  const handleCloseEditDialog = () => {
    setShowEditModuleModal(false);
    setEditingModule(null);
    if (editDialogRef.current) editDialogRef.current.close();
  };

  const handleModuleUpdated = () => {
    window.location.reload();
  };

  const handleDeleteModule = async (moduleId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this module and all its lessons?"
      )
    )
      return;

    try {
      // Call API to delete module - backend will verify user through JWT token
      await courseModuleAPI.deleteModule(courseId, moduleId);
      
      // Update local state after successful deletion
      setModulesState((prev) => prev.filter((m) => m.id !== moduleId));
      setExpandedModules((prev) => {
        const copy = { ...prev };
        delete copy[moduleId];
        return copy;
      });

      toast.success("Module deleted successfully");
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.error(error.response?.data?.message || "Failed to delete module");
    }
  };

  const moveModule = async (moduleId, direction) => {
    try {
      const idx = modulesState.findIndex((m) => m.id === moduleId);
      if (idx < 0) return;
      
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= modulesState.length) return;

      // Get the modules to swap
      const currentModule = modulesState[idx];
      const swapModule = modulesState[swapIdx];

      // Update UI first for better user experience
      setModulesState((prev) => {
        const newArr = [...prev];
        [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];
        return newArr;
      });

      // Then update orders in the database
      try {
        await Promise.all([
          courseModuleAPI.updateModuleOrder(courseId, currentModule.id, swapModule.order),
          courseModuleAPI.updateModuleOrder(courseId, swapModule.id, currentModule.order)
        ]);
      } catch (error) {
        // If API call fails, revert the UI change
        setModulesState((prev) => {
          const newArr = [...prev];
          [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];
          return newArr;
        });
        throw error;
      }
    } catch (error) {
      console.error("Error updating module order:", error);
      toast.error("Failed to update module order");
    }
  };

 const handleEditLesson = (moduleId, lessonId) => {
   const mod = modulesState.find(m => m.id === moduleId);
   const lesson = mod?.lessons.find(l => l.id === lessonId);
   if (!lesson) return;
   setEditingLesson({ moduleId, ...lesson });
   setLessonModalOpen(true);
 };

 const handleDeleteLesson = async (moduleId, lessonId) => {
   if (!window.confirm("Are you sure you want to delete this lesson?")) return;
   
   try {
     await moduleLessonAPI.deleteLesson(courseId, moduleId, lessonId);
     // Update local state after successful deletion
     setModulesState(prev =>
       prev.map(m =>
         m.id === moduleId
           ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
           : m
       )
     );
     toast.success("Lesson deleted successfully");
   } catch (error) {
     console.error("Error deleting lesson:", error);
     toast.error(error.response?.data?.message || "Failed to delete lesson");
   }
 };

 const handleSaveLesson = async (lessonData) => {
   try {
     console.log('Saving lesson data:', lessonData); // Debug log
     
     if (lessonData.id) {
       // Update existing lesson
       await moduleLessonAPI.updateLesson(
         courseId,
         lessonData.moduleId,
         lessonData.id,
         {
           title: lessonData.title,
           description: lessonData.description,
           type: lessonData.type,
           fileObject: lessonData.fileObject
         }
       );
       toast.success("Lesson updated successfully");
     } else {
       // Create new lesson
       await moduleLessonAPI.createLesson(courseId, currentModuleId, lessonData);
       toast.success("Lesson created successfully");
     }
     // Reload page to get updated data
     window.location.reload();
   } catch (error) {
     console.error("Error saving lesson:", error);
     toast.error(error.response?.data?.message || "Failed to save lesson");
   }
 };


  const moveLesson = async (moduleId, lessonId, direction) => {
    try {
      const mod = modulesState.find(m => m.id === moduleId);
      if (!mod) return;
      
      const idx = mod.lessons.findIndex(l => l.id === lessonId);
      if (idx < 0) return;
      
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= mod.lessons.length) return;

      // Get the lessons to swap
      const currentLesson = mod.lessons[idx];
      const swapLesson = mod.lessons[swapIdx];

      // Update UI first for better user experience
      setModulesState(prev =>
        prev.map(m => {
          if (m.id !== moduleId) return m;
          const newLessons = [...m.lessons];
          [newLessons[idx], newLessons[swapIdx]] = [newLessons[swapIdx], newLessons[idx]];
          return { ...m, lessons: newLessons };
        })
      );

      // Then update orders in the database
      try {
        await Promise.all([
          moduleLessonAPI.updateLessonOrder(courseId, moduleId, currentLesson.id, swapLesson.order),
          moduleLessonAPI.updateLessonOrder(courseId, moduleId, swapLesson.id, currentLesson.order)
        ]);
      } catch (error) {
        // If API call fails, revert the UI change
        setModulesState(prev =>
          prev.map(m => {
            if (m.id !== moduleId) return m;
            const newLessons = [...m.lessons];
            [newLessons[idx], newLessons[swapIdx]] = [newLessons[swapIdx], newLessons[idx]];
            return { ...m, lessons: newLessons };
          })
        );
        throw error;
      }
    } catch (error) {
      console.error("Error updating lesson order:", error);
      toast.error("Failed to update lesson order");
    }
  };


  //save about and details
  const saveAbout = async () => {
    try {
      // Build updated course data
      const updatedCourse = {
        ...course,
        description: draftDescription.trim()
      };

      // Call API to update course
      await courseAPI.updateCourse(course.id, updatedCourse);
      
      // Update local state
      setCourse(updatedCourse);
      setIsEditingAbout(false);
      toast.success("Course description updated successfully");
    } catch (error) {
      console.error("Error updating course description:", error);
      toast.error("Failed to update course description");
    }
  };

  const saveDetails = async () => {
    try {
      // Build updated course data
      const updatedCourse = {
        ...course,
        startDate: draftStartDate,
        endDate: draftEndDate,
        schedule: draftSchedule.trim(),
        location: draftLocation.trim()
      };

      // Call API to update course
      await courseAPI.updateCourse(course.id, updatedCourse);
      
      // Update local state
      setCourse(updatedCourse);
      setIsEditingDetails(false);
      toast.success("Course details updated successfully");
    } catch (error) {
      console.error("Error updating course details:", error);
      toast.error("Failed to update course details");
    }
  };

  //navigation
  const handleLessonClick = (lessonId, moduleId) => {
    navigate(`/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
  };

  const handleAssignmentClick = (aid, mode = "view") => {
    if (mode === "edit") {
      navigate(`/teacher/courses/${courseId}/assignments/${aid}/edit`, {
        state: { assignment: course.assignments.find((a) => a.id === aid) }
      });
    } else {
      navigate(`/teacher/courses/${courseId}/assignments/${aid}`);
    }
  };

  const handleDiscussionClick = (did) =>
    navigate(`/teacher/courses/${courseId}/discussions/${did}`);

  const handleNewDiscussion = (discussionData) => {
    const newD = { id: `d${Date.now()}`, ...discussionData };
    setCourse((prev) => ({
      ...prev,
      discussions: [newD, ...(prev.discussions || [])]
    }));
    handleDiscussionClick(newD.id);
  };

  const handleAddAssignment = () =>
    navigate(`/teacher/courses/${courseId}/assignments/new`);

  const handleDeleteAssignment = (assignId) => {
    if (
      !window.confirm("Are you sure you want to delete this assignment?")
    )
      return;
    setCourse((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== assignId)
    }));
  };

  const handleAddResource = () =>
    navigate(`/teacher/courses/${courseId}/resources/new`);

  const handleEditResource = (resId) => {
    const res = course.resources.find((r) => r.id === resId);
    if (!res) return;
    navigate(`/teacher/courses/${courseId}/resources/${resId}`, {
      state: { fromResource: { resource: res } }
    });
  };

  const handleDeleteResource = (resId) => {
    if (!window.confirm("Delete this resource?")) return;
    navigate(`/teacher/courses/${courseId}`, {
      state: { fromResource: { action: "delete", resource: { id: resId } } }
    });
  };

  const handleOpenAddLessonModal = (moduleId) => {
    setCurrentModuleId(moduleId);
    setShowAddLessonModal(true);
  };
  const handleCloseAddLessonModal = () => {
    setShowAddLessonModal(false);
    setCurrentModuleId(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f9fc]">
        <SideBarTeacher />
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <NavBar />
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Course Not Found
                  </h2>
                  <p className="text-gray-500">
                    The course you&apos;re looking for doesn&apos;t exist.
                  </p>
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
      </div>
    );
  }

  //top 10 stu stu
  const topTen = [...students]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  console.log('modulesState:', modulesState);

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarTeacher />
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />

            {/*header*/}
            <div
              className="relative rounded-t-lg overflow-hidden h-64 bg-cover bg-center mb-6"
              style={{ 
                backgroundImage: `url(${course.image || '/cover/placeholder-course.jpg'})` 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="relative z-10 flex items-center gap-2 px-6 pt-4">
                <Link
                  to="/teacher/courses"
                  className="rounded-full bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <span
                  className={`rounded-md ${course.categoryColor ? ` ${course.categoryColor}` : ' bg-blue-500'} px-2 py-1 text-xs font-bold text-white`}
                >
                  {course.category}
                </span>
              </div>
              <div className="absolute bottom-4 left-6 z-10 text-white">
                <h1 className="text-3xl font-bold leading-tight">
                  {course.title}
                </h1>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-white">
                      <img
                        src={course.instructorImage || "/placeholder.jpg"}
                        alt={course.instructorName || "Instructor"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium">
                      {course.instructorName || "Unknown Instructor"}
                    </p>
                  </div>
                  {isArchived && (
                    <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-green-300 backdrop-blur-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Completed on {course.endDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {!isEditingHeader && (
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => setIsEditingHeader(true)}
                    className="rounded-lg bg-gray-700/50 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/70 transition-colors"
                  >
                    Edit Header
                  </button>
                </div>
              )}
              {isEditingHeader && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                  <div className="w-full max-w-3xl px-6 pb-6">
                    <EditableCourseHeader
                      course={course}
                      onUpdate={(updatedCourse) => {
                        // Cập nhật state local với dữ liệu mới
                        setCourse(updatedCourse);
                        // Đóng modal edit
                        setIsEditingHeader(false);
                      }}
                      onCancel={() => setIsEditingHeader(false)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/*tabs*/}
            <div className="border-b bg-white mb-6">
              <div className="flex space-x-1 px-6">
                {[
                  "content",
                  "assignments",
                  "resources",
                  "discussions",
                  "students"
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 px-4 py-3 text-sm font-medium ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/*about this course + course details*/}
            <div className="p-6 mb-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/*about*/}
                <div className="lg:col-span-2">
                  <div className="relative rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        About This Course
                      </h2>
                      {!isEditingAbout && (
                        <button
                          onClick={() => setIsEditingAbout(true)}
                          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                        >
                          <Edit2 className="h-5 w-5 text-gray-500" />
                        </button>
                      )}
                    </div>
                    {!isEditingAbout && (
                      <p className="text-gray-700">{course.description}</p>
                    )}
                    {isEditingAbout && (
                      <div className="space-y-4">
                        <textarea
                          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          rows={4}
                          value={draftDescription}
                          onChange={(e) => setDraftDescription(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveAbout}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setDraftDescription(course.description);
                              setIsEditingAbout(false);
                            }}
                            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/*details*/}
                <div className="lg:col-span-1">
                  <div className="relative rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        Course Details
                      </h2>
                      {!isEditingDetails && (
                        <button
                          onClick={() => setIsEditingDetails(true)}
                          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                        >
                          <Edit2 className="h-5 w-5 text-gray-500" />
                        </button>
                      )}
                    </div>
                    {!isEditingDetails && (
                      <div className="space-y-3 text-gray-700">
                        {isPublished && (
                          <>
                            <div className="flex items-start gap-3">
                              <Calendar className="mt-0.5 h-5 w-5 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Course Duration
                                </p>
                                <p className="text-sm text-gray-600">
                                  {course.startDate.split('T')[0]} - {course.endDate.split('T')[0]}
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
                        {isArchived && (
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
                    )}
                    {isEditingDetails && (
                      <div className="space-y-4 text-gray-700">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={draftStartDate}
                            onChange={(e) =>
                              setDraftStartDate(e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={draftEndDate}
                            onChange={(e) =>
                              setDraftEndDate(e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Schedule
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Monday, Wednesday 10:00 AM"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={draftSchedule}
                            onChange={(e) =>
                              setDraftSchedule(e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Online"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={draftLocation}
                            onChange={(e) =>
                              setDraftLocation(e.target.value)
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveDetails}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setDraftStartDate(course.startDate);
                              setDraftEndDate(course.endDate);
                              setDraftSchedule(course.schedule);
                              setDraftLocation(course.location);
                              setIsEditingDetails(false);
                            }}
                            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/*tab content*/}
            {activeTab === "content" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Course Content
                  </h2>
                  <button
                    onClick={handleAddModule}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    <span>Add New Module</span>
                  </button>
                </div>

                <p className="mb-4 text-sm text-gray-600">
                  {modulesState.length} modules •{" "}
                  {modulesState.reduce(
                    (total, m) => total + (m.lessons?.length || 0),
                    0
                  )}{" "}
                  lessons
                </p>

                <div className="space-y-4">
                  {modulesState.map((mod, modIndex) => (
                    <div
                      key={mod.id}
                      className="rounded-lg border border-gray-200"
                    >
                      <div
                        className="flex items-center justify-between bg-gray-50 p-4 cursor-pointer"
                        onClick={() => toggleModule(mod.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {mod.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {mod.lessons?.length || 0} lessons
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveModule(mod.id, "up");
                            }}
                            disabled={modIndex === 0}
                            className={`rounded-full p-1 hover:bg-gray-200 transition-colors ${
                              modIndex === 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <ArrowUp className="h-5 w-5 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveModule(mod.id, "down");
                            }}
                            disabled={modIndex === modulesState.length - 1}
                            className={`rounded-full p-1 hover:bg-gray-200 transition-colors ${
                              modIndex === modulesState.length - 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <ArrowDown className="h-5 w-5 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditModule(mod.id);
                            }}
                            className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                          >
                            <Edit2 className="h-5 w-5 text-gray-500" />
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteModule(mod.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full"
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </button>
                          <button className="rounded-full p-1 hover:bg-gray-200">
                            {expandedModules[mod.id] ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenAddLessonModal(mod.id);
                            }}
                            className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600 transition-colors shadow"
                          >
                            <span>+ Add Lesson</span>
                          </button>
                        </div>
                      </div>

                      {expandedModules[mod.id] && (
                        <div className="divide-y border-t">
                          {mod.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                              {lesson.type === "video" ? (
                                  <Play className="h-5 w-5 text-blue-500" />
                                ) : lesson.type === "document" ? (
                                  <FileText className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-gray-500" />
                                )}
                                <div>
                                  <h4 className="font-medium">{lesson.title}</h4>
                                  {/* description: time for video, description text otherwise */}
                                  <p className="text-sm text-gray-500">
                                    {lesson.type === "video"
                                      ? lesson.duration
                                      : lesson.description || "No description"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveLesson(mod.id, lesson.id, "up");
                                  }}
                                  disabled={lessonIndex === 0}
                                  className={`rounded-full p-1 hover:bg-gray-200 transition-colors ${
                                    lessonIndex === 0
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  <ArrowUp className="h-5 w-5 text-gray-500" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveLesson(mod.id, lesson.id, "down");
                                  }}
                                  disabled={
                                    lessonIndex === mod.lessons.length - 1
                                  }
                                  className={`rounded-full p-1 hover:bg-gray-200 transition-colors ${
                                    lessonIndex === mod.lessons.length - 1
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  <ArrowDown className="h-5 w-5 text-gray-500" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditLesson(mod.id, lesson.id);
                                  }}
                                  className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                                >
                                  <Edit2 className="h-5 w-5 text-gray-500" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteLesson(mod.id, lesson.id);
                                  }}
                                  className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5 text-red-500" />
                                </button>
                                {!isArchived && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLessonClick(lesson.id, mod.id);
                                    }}
                                    className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
                                  >
                                    Review
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {mod.lessons.length === 0 && (
                            <div className="p-4 flex flex-col items-center justify-center gap-2">
                              <span className="text-gray-500 text-sm mb-1">No lessons yet.</span>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleOpenAddLessonModal(mod.id);
                                }}
                                className="flex items-center gap-1 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors shadow"
                              >
                                <span>+ Add Lesson</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Assignments
                  </h2>
                  <button
                    onClick={handleAddAssignment}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    <span>Add Assignment</span>
                  </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f4f9fc]">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Assignment
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Due Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {course.assignments?.map((assign) => (
                        <tr
                          key={assign.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() =>
                            handleAssignmentClick(assign.id, "view")
                          }
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assign.title}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {assign.dueDate}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                assign.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : assign.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {assign.status === "completed"
                                ? "Completed"
                                : assign.status === "in-progress"
                                ? "In Progress"
                                : "To Do"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignmentClick(assign.id, "edit");
                                }}
                                className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                              >
                                <Edit2 className="h-5 w-5 text-gray-500" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAssignment(assign.id);
                                }}
                                className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                              >
                                <Trash2 className="h-5 w-5 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Course Resources
                  </h2>
                  <button
                    onClick={handleAddResource}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    <span>Add Resource</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {course.resources?.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {res.title}
                          </h3>
                          <p className="text-sm text-gray-500">{res.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditResource(res.id);
                          }}
                          className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                        >
                          <Edit2 className="h-5 w-5 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResource(res.id);
                          }}
                          className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                        <a
                          href={res.link}
                          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                  ))}

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

            {activeTab === "discussions" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Discussion Forum
                  </h2>
                  {!isArchived && (
                    <button
                      onClick={() => setIsNewDiscussionOpen(true)}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
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
                                discussion.author.avatar || "/placeholder.jpg"
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
                          onClick={(e) => e.stopPropagation()}
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
                            <span>{discussion.replies?.length || 0} replies</span>
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

            {/*student tab*/}
            {activeTab === "students" && (
              <div className="grid gap-6 lg:grid-cols-3 h-full">
                {/* Left column (one-third width): Top 10 + Class Overview */}
                <div className="col-span-1 flex flex-col space-y-6 h-full">
                  {/*top 10*/}
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        Top 10 Students
                      </h2>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                              Rank
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                              Score
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {topTen.map((s, idx) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                              <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                                {idx + 1}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                                {s.name}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                                {s.score}
                              </td>
                            </tr>
                          ))}
                          {topTen.length === 0 && (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-4 text-center text-sm text-gray-500"
                              >
                                No students enrolled yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/*class overview*/}
                  <div className="rounded-lg border bg-white p-6 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="rounded-full bg-blue-100 p-3">
                        <Users className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-md font-semibold text-[#303345]">
                          Engagement Summary
                        </h3>
                        <p className="text-sm text-[#9ca3af]">
                          Live stats from your classroom
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm text-[#303345]">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Total Students</span>
                        </div>
                        <span>{students.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Most Active</span>
                        </div>
                        <span>{topTen[0]?.name || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Lessons this week</span>
                        </div>
                        <span>—</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Avg. Progress</span>
                        </div>
                        <span>—%</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: "0%" }}
                        />
                      </div>
                      <p className="text-xs text-right mt-1 text-[#6b7280]">
                        Progress rate
                      </p>
                    </div>
                  </div>
                </div>
            {/*enrolled students*/}
            <div className="col-span-2 flex flex-col h-205">
              <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Enrolled Students
                  </h2>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    Invite Student
                  </button>
                </div>

                <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f4f9fc]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                          Email
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {s.name}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {s.email}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to remove this student?"
                                  )
                                ) {
                                  setStudents((prev) =>
                                    prev.filter((st) => st.id !== s.id)
                                  );
                                }
                              }}
                              className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                            >
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No students enrolled yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

        {showInviteModal && (
          <InviteStudentModal
            inviteCode={course?.inviteCode || "XXXX-XXXX"}
            onClose={() => setShowInviteModal(false)}
          />
        )}
          </div>
            )}
        </div>
      </div>

      <NewDiscussion
        isOpen={isNewDiscussionOpen}
        onClose={() => setIsNewDiscussionOpen(false)}
        onSubmit={handleNewDiscussion}
      />
                 <LessonModal
             isOpen={lessonModalOpen}
             onClose={() => setLessonModalOpen(false)}
             initialData={editingLesson}
             onSave={handleSaveLesson}
           />

        <dialog ref={editDialogRef} open={showEditModuleModal} className="rounded-lg p-0 border-none max-w-md w-full">
          <AddModuleModal
            open={showEditModuleModal}
            onClose={handleCloseEditDialog}
            courseId={courseId}
            isEdit={true}
            initialData={editingModule}
            onModuleUpdated={handleModuleUpdated}
          />
        </dialog>

        <dialog ref={dialogRef} open={showAddModuleModal} className="rounded-lg p-0 border-none max-w-md w-full">
          <AddModuleModal
            open={showAddModuleModal}
            onClose={handleCloseDialog}
            courseId={courseId}
            onModuleAdded={handleModuleAdded}
          />
        </dialog>

        <dialog open={showAddLessonModal} className="rounded-lg p-0 border-none max-w-md w-full">
          <LessonModal
            isOpen={showAddLessonModal}
            onClose={handleCloseAddLessonModal}
            initialData={{}}
            onSave={async (updated) => {
              if (!currentModuleId) return;
              try {
                await moduleLessonAPI.createLesson(courseId, currentModuleId, updated);
                toast.success('Lesson created!');
                window.location.reload();
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to create lesson');
              }
            }}
          />
        </dialog>

    </div>
    </div>
  );
}

function InviteStudentModal({ inviteCode, onClose }) {
  const [email, setEmail] = useState("");

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    alert("Copied!");
  };

  const sendInvite = () => {
    // TODO: integrate email-sending logic
    alert(`Invite sent to ${email}!`);
    setEmail("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Invite Students</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Class Code
          </label>
          <div className="mt-1 flex">
            <input
              type="text"
              readOnly
              value={inviteCode}
              className="flex-1 rounded-l-md border border-gray-300 p-2 text-sm"
            />
            <button
              onClick={copyCode}
              className="rounded-r-md bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
        </div>
        

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Invite by Email
          </label>
          <div className="mt-1 flex">
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-l-md border border-gray-300 p-2 text-sm"
            />
            <button
              onClick={sendInvite}
              className="rounded-r-md bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
}