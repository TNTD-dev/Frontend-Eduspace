import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SquareLibrary, Users2, Pencil, Archive as ArchiveIcon } from "lucide-react";

/**
 * @typedef {Object} Course
 * @property {number} id
 * @property {string} title
 * @property {string} category
 * @property {string} categoryColor
 * @property {number} total
 * @property {string} image
 * @property {string} instructor
 * @property {number} studentCount
 */

/**
 * @param {Object} props
 * @param {Course} props.course - Course data including total students
 * @param {(course: Course) => void} props.onEdit - Called when the pencil icon is clicked
 * @param {(course: Course) => void} props.onArchive - Called when the archive icon is clicked
 */
const TeacherCourseCard = ({ course, onEdit, onArchive }) => {
  const {
    id,
    title,
    category,
    categoryColor,
    total,
    image,
    instructor,
    studentCount,
  } = course;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md min-w-[300px] flex-1"
    >
      <div className="relative">
        <Link to={`/teacher/courses/${id}`}>
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
        </Link>
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit(course);
            }}
            className="bg-white text-blue-600 hover:bg-blue-50 p-1 rounded shadow"
            title="Edit Course"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onArchive(course);
            }}
            className="bg-white text-red-600 hover:bg-red-50 p-1 rounded shadow"
            title="Archive Course"
          >
            <ArchiveIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="mb-2 text-sm font-semibold text-[#303345] line-clamp-2">
          {title}
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
            <span>{total} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users2 className="w-4 h-4" />
            <span>{studentCount} students</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherCourseCard;