import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Youtube } from 'lucide-react';

/**
 * @typedef {Object} Course
 * @property {number} id - The course ID
 * @property {string} title - The course title
 * @property {string} category - The course category
 * @property {string} categoryColor - The color for the category
 * @property {number} progress - The current progress
 * @property {number} total - The total number of items
 * @property {string} image - The course image URL
 */

/**
 * @param {Object} props
 * @param {Course} props.course - The course object containing all course details
 */
const CourseCard = ({ course }) => {
  const { id, title, category, categoryColor, progress, total, image } = course;
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
          <img src={course.image || "/placeholder.svg"} alt={course.title} className="h-full w-full object-cover" />
          <div
            className={`absolute left-2 top-2 rounded-md ${course.categoryColor} px-2 py-0.5 text-xs font-medium text-white`}
          >
            {course.category}
          </div>
        </div>
        <div className="p-3">
          <h3 className="mb-2 text-sm font-semibold text-[#303345] line-clamp-2">{course.title}</h3>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className='flex items-center gap-1'>
              <Youtube className='w-3 h-3'/>
              <span>{course.progress} lessons</span>
            </div>
            <span>
              {course.progress}/{course.total}
            </span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${course.categoryColor}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CourseCard