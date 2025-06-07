import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  Clock,
  CalendarDays,
  SwatchBook,
} from "lucide-react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import { CourseCard } from "@/components/features/course/CourseCard";
import CircularProgress from "@/components/common/CircularProgress";
import ActivityChart from "@/components/common/ActivityChart";
import { Calendar } from "@/components/ui/calendar";
import TaskItem from "@/components/features/calendar/tasks/TaskItem";
import CalendarCard from "@/components/features/calendar/CalendarCard";
import AssignmentCard from "@/components/features/course/AssignmentCard";
import NavBar from "@/components/layout/NavBar";
import { currentCourses} from "@/data/mock/courseData";
import { userData } from "@/data/mock/userData";
import { userAPI } from "@/api";
import { courseEnrollmentAPI } from "@/api";

export default function StudentDashboard() {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user,setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    userAPI.getProfile()
      .then(res => {
        setUser(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Error fetching user");
        setLoading(false);
      });

    courseEnrollmentAPI.getMyCourses()
      .then(res => {
        console.log('Courses API Response:', res); // Debug log
        // Check if response is an array
        if (Array.isArray(res)) {
          setCourses(res);
        } else if (res.data && Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.error('Invalid courses data format:', res);
          setCourses([]);
        }
      })
      .catch(err => {
        console.error('Courses API Error:', err);
        setError(err.response?.data?.error || "Error fetching courses");
        setCourses([]);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            {/* Header */}
            <NavBar />

            {/* Content */}
            <div className="flex-1 h-full grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - Courses */}
              <div className="lg:col-span-2 flex flex-col h-full">
                {/* Greeting */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-[#303345]">
                    <span className="mr-2">👋</span>
                    Hi, {user?.firstName + " " + user?.lastName}!
                  </h1>
                </div>

                {/* Courses Section */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#303345]">
                      Courses
                    </h2>
                    <Link
                      to="/student/courses"
                      className="text-sm font-medium text-blue-500 hover:text-blue-600"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4">
                    {courses && courses.length > 0 ? (
                      courses.slice(0, 2).map((course) => (
                        <div
                          key={course.id}
                          className="min-w-[300px] flex-1"
                        > 
                          <CourseCard course={course} />
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No courses available</div>
                    )}
                  </div>
                </div>

                {/* Time Spent & Flashcards*/}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                  {/* Flashcard - Your points */}
                  <div className="md:col-span-1 h-full flex flex-col">
                    <h2 className="text-lg font-bold text-[#303345] mb-4">
                      Flashcards
                    </h2>
                    <div className="rounded-xl bg-white p-4 shadow flex flex-col items-center min-h-[300px] w-full  ">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="text-semibold text-[#303345] pr-4">
                          Total flashcards
                        </div>
                        <div className="flex items-center gap-1">
                          <SwatchBook className="h-4 w-4 text-[#303345]" />
                          <span className="font-medium text-[#303345]">
                            {userData.flashcards.remembered +
                              userData.flashcards.toReview}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <CircularProgress
                          value={userData.flashcards.toReview}
                          maxValue={
                            userData.flashcards.remembered +
                            userData.flashcards.toReview
                          }
                          color="#9337fc"
                          label="To Review"
                        />
                        <CircularProgress
                          value={userData.flashcards.reviewStats.correct}
                          maxValue={
                            userData.flashcards.reviewStats.correct +
                            userData.flashcards.reviewStats.wrong
                          }
                          color="#1cd767"
                          label="Retention Rate"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Statistics - Time Spent */}
                  <div className="md:col-span-2  flex flex-col">
                    <h2 className="text-lg font-bold text-[#303345] mb-4">
                      Statistics
                    </h2>
                    <div className="rounded-xl bg-white p-6 shadow min-h-[300px] w-full">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-[#a3a6aa]">
                          <CalendarDays className="h-4 w-4 " />
                          <span>01.2025 - 12.2025</span>
                        </div>
                      </div>

                      <div className="flex-1 mt-8">
                        <ActivityChart />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 flex flex-col h-full ">
                {/* Schedule Card */}
                <h2 className="text-lg font-bold text-[#303345] mb-4 mt-16">
                  Schedule
                </h2>
                <div className="rounded-xl bg-white p-6 shadow min-h-[400px] flex flex-col mb-2">
                  {/* Calendar */}
                  <div className="flex-1">
                    <CalendarCard />
                  </div>
                </div>
                {/* Assignment Card */}
                <h2 className="text-lg font-bold text-[#303345] mb-4 mt-2">
                  Assignment
                </h2>
                <div className="rounded-xl bg-white p-6 shadow min-h-[100x] w-full flex flex-1 flex-col">
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <AssignmentCard />
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
