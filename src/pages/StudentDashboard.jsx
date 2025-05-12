import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, ChevronDown, Clock, CalendarDays, SwatchBook } from 'lucide-react';
import SideBarStudent from '../components/layout/SideBarStudent';
import CourseCard from '../components/CourseCard';
import CircularProgress from '../components/CircularProgress';
import ActivityChart from '../components/ActivityChart';
import { Calendar } from "@/components/ui/calendar"
import TaskItem from '../components/TaskItem';
import CalendarCard from '../components/CalendarCard';
import AssignmentCard from '../components/AssignmentCard';

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState(new Date())
  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "Introduction Software Engineering",
      category: "SE",
      categoryColor: "bg-[#9937fc]",
      progress: 28,
      total: 45,
      image: "/cover/cover-software-engineer.jpg",
    },
    {
      id: 2,
      title: "Introduction to Computer Vision",
      category: "CS",
      categoryColor: "bg-[#1cd767]",
      progress: 22,
      total: 36,
      image: "/cover/cover-computer-vision.jpg",
    },
    {
      id: 3,
      title: "Introduction to Computational Thinking",
      category: "Computational Thinking",
      categoryColor: "bg-[#ff1d7c]",
      progress: 10,
      total: 100,
      image: "/cover/cover-computational-thinking.jpg",
    },
  ]

  // Mock data for user
  const user = {
    name: "Duc",
    avatar: "/icons8-user-96.png",
    designScore: 790,
    designTotal: 800,
    testingScore: 800,
    testingTotal: 900,
    flashcardToReview: 35,    // Số flashcard cần review
    flashcardRemembered: 120,
    reviewTimeCorrect: 100,
    reviewTimeWrong: 20,


  }

  return (
    <div className='flex min-h-screen bg-[#f4f9fc]'>
      <SideBarStudent />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        <div className='flex-1 overflow-auto'>
          <div className="mx-auto max-w-7xl px-4 py-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for courses, people, etc."
                  className="h-10 w-full max-x-lg rounded-md border-0 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4 pr-10">
                <button className="relative rounded-md bg-white p-2 text-slate-600 shadow-sm hover:text-blue-500">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="h-8 w-8 rounded-md object-cover"
                  />
                  <span className="font-medium text-[#303345]">{user.name}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 h-full grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - Courses */}
              <div className="lg:col-span-2 flex flex-col h-full">
                {/* Greeting */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-[#303345]">
                    <span className="mr-2">👋</span>
                    Hi, {user.name}!
                  </h1>
                </div>

                {/* Courses Section */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#303345]">Courses</h2>
                    <button className="text-sm font-medium text-blue-500 hover:text-blue-600">View all</button>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4">
                    {courses.slice(0, 2).map((course) => (
                      <div key={course.id} className="min-w-[300px] flex-1">
                        <CourseCard course={course} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Spent & Flashcards*/}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                  {/* Flashcard - Your points */}
                  <div className="md:col-span-1 h-full flex flex-col">
                    <h2 className="text-lg font-bold text-[#303345] mb-4">Flashcards</h2>
                    <div className="rounded-xl bg-white p-4 shadow flex flex-col items-center min-h-[300px] w-full  ">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="text-semibold text-[#303345] pr-4">Total flashcards</div>
                        <div className="flex items-center gap-1">
                          <SwatchBook className="h-4 w-4 text-[#303345]" />
                          <span className="font-medium text-[#303345]">{user.flashcardRemembered + user.flashcardToReview}</span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <CircularProgress
                          value={user.flashcardToReview}
                          maxValue={user.flashcardRemembered + user.flashcardToReview}
                          color="#9337fc"
                          label="To Review"
                        />
                        <CircularProgress
                          value={user.reviewTimeCorrect}
                          maxValue={user.reviewTimeCorrect + user.reviewTimeWrong}
                          color="#1cd767"
                          label="Retention Rate"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Statistics - Time Spent */}
                  <div className="md:col-span-2  flex flex-col">
                    <h2 className="text-lg font-bold text-[#303345] mb-4">Statistics</h2>
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
                <h2 className="text-lg font-bold text-[#303345] mb-4 mt-16">Schedule</h2>
                <div className="rounded-xl bg-white p-6 shadow min-h-[400px] flex flex-col mb-2">
                  {/* Calendar */}
                 <div className='flex-1'>
                  <CalendarCard />
                 </div>
                </div>
                {/* Assignment Card */}
                <h2 className="text-lg font-bold text-[#303345] mb-4 mt-2">Assignment</h2>
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
