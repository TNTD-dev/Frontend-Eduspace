import React, { useState, useEffect } from 'react' 
import { motion } from 'framer-motion'

/**
 * @typedef {Object} CircularProgressProps
 * @property {number} value - The progress value (0-100)
 * @property {string} maxValue - The label of the progress bar
 * @property {string} color - The color of the progress bar
 * @property {number} size - The size of the progress bar
 * @property {string} label - The label to display under the circle
 */

/**
 * @param {Object} props
 * @param {CircularProgressProps} props.progress
 */

const CircularProgress = ({ value, maxValue, color, label }) => {
    const [percentage, setPercentage] = useState(0)
    useEffect(() => {
        setPercentage((value / maxValue) * 100)
      }, [value, maxValue])

      const radius = 40
      const strokeWidth = 12
      const circumference = 2 * Math.PI * radius
      const strokeDashoffset = circumference - (percentage / 100) * circumference
    
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24 flex items-center justify-center">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#efefef"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 1px 3px ${color}33)` }}
          />
        </svg>
        {/* Number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold" style={{ color }}>{value}</span>
          <span className="text-xs text-slate-400 font-semibold">/ {maxValue}</span>
        </div>
      </div>
      {/* Label dưới vòng tròn */}
      <div className="mt-2 text-center text-base font-semibold " style={{ color: color }}>{label}</div>
    </div>
  )
}

export default CircularProgress