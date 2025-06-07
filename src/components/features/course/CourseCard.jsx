import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SquareLibrary } from "lucide-react";

/**
 * @typedef {Object} Course
 * @property {number} id - The course ID
 * @property {string} title - The course title
 * @property {string} category - The course category
 * @property {string} categoryColor - The color for the category
 * @property {number} progress - The current progress
 * @property {number} total - The total number of items
 * @property {date} endDate - The date the course was completed
 * @property {string} image - The course image URL
 * @property {string} instructor - The instructor of the course
 * @property {string} grade - The grade of the course
 */

/**
 * @param {Object} props
 * @param {Course} props.course - The course object containing all course details
 */
const CourseCard = ({ course }) => {
  const {
    id,
    title = '',
    category = '',
    categoryColor = 'bg-blue-500',
    progress = 0,
    total = 1,
    image = '',
    instructorName = '',
    endDate = '',
  } = course || {};
  const progressPercentage = total > 0 ? (progress / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
    >
      <Link to={`/student/courses/${id}`}>
        <div className="relative h-32 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div
            className={`absolute left-2 top-2 rounded-md ${categoryColor} px-2 py-0.5 text-xs font-medium text-white`}
          >
            {category}
          </div>
        </div>
        <div className="p-3">
          <h3 className="mb-2 text-sm font-semibold text-[#303345] line-clamp-2">
            {title}
          </h3>
          <div className="mb-3 flex items-center gap-1 text-xs text-slate-500">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
              {(instructorName || '').split(' ').map((name) => name[0]).join('')}
            </div>
            <span>{instructorName}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <SquareLibrary className="w-4 h-4" />
              <span>{total} lessons</span>
            </div>
            <span>
              {progress}/{total}
            </span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${categoryColor}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const CourseCardCompleted = ({ course }) => {
  const {
    id,
    title,
    category,
    categoryColor,
    progress,
    total,
    image,
    instructor,
    endDate,
    grade,
  } = course;
  const progressPercentage = (progress / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
    >
      <Link to={`/student/courses/${course.id}`}>
        <div className="relative h-32 overflow-hidden">
          <img
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div
            className={`absolute left-2 top-2 rounded-md ${course.categoryColor} px-2 py-0.5 text-xs font-medium text-white`}
          >
            {course.category}
          </div>
        </div>
        <div className="p-3">
          <h3 className="mb-2 text-sm font-semibold text-[#303345] line-clamp-2">
            {course.title}
          </h3>
          <div className="mb-3 flex items-center gap-1 text-xs text-slate-500">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
              {instructor
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </div>
            <span>{instructor}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <SquareLibrary className="w-4 h-4" />
              <span>{course.total} lessons</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="inline-block h-4 w-4">🏆</span>
              <span>Completed on {endDate}</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
              <span className="text-sm font-bold">{grade}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export { CourseCard, CourseCardCompleted };
