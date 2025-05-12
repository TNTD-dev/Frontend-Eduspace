import React from "react"
import { PlusCircle, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample assignment data
const courseAssignments = [
  {
    id: 1,
    courseId: 1,
    courseName: "Introduction Software Engineering",
    courseBadge: "SE",
    badgeColor: "bg-purple-500",
    assignments: [
      { id: 101, title: "Software Design Patterns", dueDate: "2024-08-15", status: "completed" },
      { id: 102, title: "Database Schema Design", dueDate: "2024-08-18", status: "in-progress" },
      { id: 103, title: "API Development", dueDate: "2024-08-20", status: "to-do" },
      { id: 104, title: "Unit Testing", dueDate: "2024-08-25", status: "to-do" },
    ],
  },
  {
    id: 2,
    courseId: 2,
    courseName: "Introduction to Computer Vision",
    courseBadge: "CS",
    badgeColor: "bg-green-500",
    assignments: [
      { id: 201, title: "Image Processing Basics", dueDate: "2024-08-14", status: "completed" },
      { id: 202, title: "Feature Detection", dueDate: "2024-08-19", status: "to-do" },
      { id: 203, title: "Object Recognition", dueDate: "2024-08-22", status: "to-do" },
    ],
  },
]

export default function AssignmentCard() {
  // Calculate total assignments across all courses
  const totalAssignments = courseAssignments.reduce((total, course) => total + course.assignments.length, 0)

  // Calculate completed, in-progress, and to-do assignments
  const completedAssignments = courseAssignments.reduce(
    (total, course) => total + course.assignments.filter((a) => a.status === "completed").length,
    0,
  )

  const inProgressAssignments = courseAssignments.reduce(
    (total, course) => total + course.assignments.filter((a) => a.status === "in-progress").length,
    0,
  )

  const todoAssignments = courseAssignments.reduce(
    (total, course) => total + course.assignments.filter((a) => a.status === "to-do").length,
    0,
  )

  // Calculate overall progress percentage
  const progressPercentage = Math.round((completedAssignments / totalAssignments) * 100)

  return (
    <div className=" border-0 p-6 ">
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-gray-700">
            {completedAssignments}/{totalAssignments} completed
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#1f53f3] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Assignment Status Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        <StatusCard
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
          count={completedAssignments}
          label="Completed"
          color="bg-green-100 text-green-800"
        />
        <StatusCard
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          count={inProgressAssignments}
          label="In Progress"
          color="bg-amber-100 text-amber-800"
        />
        <StatusCard
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
          count={todoAssignments}
          label="To-Do"
          color="bg-red-100 text-red-800"
        />
      </div>
    </div>
  )
}

function StatusCard({ icon, count, label, color }) {
    return (
      <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3 text-center">
        <div className="mb-1">{icon}</div>
        <span className="text-lg font-bold text-gray-800">{count}</span>
        <span className={cn("mt-1 rounded-full px-2 py-0.5 text-xs font-medium", color)}>{label}</span>
      </div>
    )
  }