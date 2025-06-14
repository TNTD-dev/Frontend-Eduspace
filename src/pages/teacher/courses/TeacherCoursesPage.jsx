import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideBarTeacher from "@/components/layout/SideBarTeacher";
import NavBar from "@/components/layout/NavBar";
import TeacherCourseCard from "@/components/features/course/teacher/TeacherCourseCard";

import {
  currentCourses as initialCurrent,
  draftCourses as initialDrafts,
  archivedCourses as staticArchived,
} from "@/data/mock/teacherCourseData";

export default function TeacherCoursesPage() {
  const navigate = useNavigate();
  const location = useLocation(); // for reading navigate state

  // ─── 1. Tabs: "teaching" | "drafts" | "archived"
  const [tab, setTab] = useState("teaching");

  // ─── 2. Local state from mocks
  const [current, setCurrent] = useState(initialCurrent);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [archived, setArchived] = useState(staticArchived);

  // ─── 2a. Merge any incoming newCourse into drafts (once, no duplicates)
  useEffect(() => {
    const newCourse = location.state?.newCourse;
    if (newCourse) {
      setDrafts((prev) => {
        // if already present, skip
        if (prev.some((c) => c.id === newCourse.id)) {
          return prev;
        }
        return [newCourse, ...prev];
      });
      // clear navigation state so effect won't run again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // ─── 3. Pick which list to show
  const filteredCourses = useMemo(() => {
    switch (tab) {
      case "drafts":
        return drafts;
      case "archived":
        return archived;
      default:
        return current;
    }
  }, [tab, current, drafts, archived]);

  // ─── 4. Handlers
  const handleCreate = () => {
    navigate("/teacher/courses/new");
  };

  const handleEdit = (courseToEdit) => {
    navigate(`/teacher/courses/${courseToEdit.id}/edit`);
  };

  const handleArchive = (courseToArchive) => {
    const confirmMsg = `Archive "${courseToArchive.title}"?`;
    if (!window.confirm(confirmMsg)) return;

    setCurrent((prev) => prev.filter((c) => c.id !== courseToArchive.id));
    setDrafts((prev) => prev.filter((c) => c.id !== courseToArchive.id));
    setArchived((prev) => [courseToArchive, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarTeacher />

      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />

            {/* HEADER */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h1 className="text-2xl font-bold text-[#303345]">Courses</h1>
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Create New Course
                </button>
              </div>

              {/* TABS */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTab("teaching")}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    tab === "teaching"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  My Courses
                </button>
                <button
                  onClick={() => setTab("drafts")}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    tab === "drafts"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Drafts
                </button>
                <button
                  onClick={() => setTab("archived")}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    tab === "archived"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Archived
                </button>
              </div>

              {/* COURSE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <TeacherCourseCard
                    key={course.id}
                    course={course}
                    onEdit={() => handleEdit(course)}
                    onArchive={() => handleArchive(course)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
