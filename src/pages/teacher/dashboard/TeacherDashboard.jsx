import React, { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import SideBarTeacher from "@/components/layout/SideBarTeacher";
import TeacherCourseCard from "@/components/features/course/teacher/TeacherCourseCard";
import CalendarCard from "@/components/features/calendar/CalendarCard";
import TeacherAssignmentCard from "@/components/features/course/teacher/TeacherAssignmentCard";
import ActivityChart from "@/components/common/ActivityChart";
import { currentCourses } from "@/data/mock/courseData";
import {Clock, Users, Star, TrendingUp} from "lucide-react";
import { userAPI } from "@/api";

export default function TeacherDashboard() {
  const activeCourseCount = currentCourses.length;
  const [user,setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    userAPI.getUser()
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Error fetching user");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarTeacher />

      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            {/* Header */}
            <NavBar />

            <div className="flex-1 h-full grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column (2/3) */}
              <div className="lg:col-span-2 flex flex-col h-full">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-[#303345]">
                    🎓 Welcome back, {user?.firstName + " " + user?.lastName}!
                  </h1>
                </div>

                {/* Class Overview + Activity Chart */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 👥 Enhanced Class Overview */}
                  <div className="md:col-span-1 flex flex-col">
                    <h2 className="text-lg font-bold text-[#303345] mb-4">
                      Class Overview
                    </h2>
                    <div className="rounded-xl bg-white p-6 shadow flex flex-col justify-between min-h-[300px]">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="rounded-full bg-blue-100 p-3">
                          <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
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
                        <span>42</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Most Active</span>
                        </div>
                        <span>Nguyen Van A</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Lessons this week</span>
                        </div>
                        <span>12</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Avg. Progress</span>
                        </div>
                        <span>58%</span>
                      </div>
                    </div>

                      <div className="mt-6">
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: "58%" }}
                          />
                        </div>
                        <p className="text-xs text-right mt-1 text-[#6b7280]">
                          Progress rate
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Chart */}
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-bold text-[#303345] mb-4">
                      Class Activity
                    </h2>
                    <div className="rounded-xl bg-white p-6 shadow min-h-[300px]">
                      <ActivityChart />
                    </div>
                  </div>
                </div>

                {/* Courses Section */}
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#303345] flex items-center gap-2">
                      Your Courses{" "}
                      <span className="text-sm font-normal text-slate-500">
                        (Active courses: {activeCourseCount})
                      </span>
                    </h2>
                    <a
                      href="/teacher/courses"
                      className="text-sm font-medium text-blue-500 hover:text-blue-600"
                    >
                      Manage all
                    </a>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-2">
                    {currentCourses.slice(0, 2).map((course) => (
                      <div key={course.id} className="min-w-[300px] flex-1">
                        <TeacherCourseCard course={course} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (1/3) */}
              <div className="lg:col-span-1 flex flex-col h-full">
                <h2 className="text-lg font-bold text-[#303345] mb-4 mt-16">
                  Calendar
                </h2>
                <div className="rounded-xl bg-white p-6 shadow min-h-[400px] flex flex-col mb-6">
                  <CalendarCard />
                </div>

                <div>
                  <TeacherAssignmentCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}