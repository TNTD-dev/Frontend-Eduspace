// Task categories with their icons
export const taskCategories = {
  "Web Design": "📝",
  "3D Modeling": "🔮",
  "Software": "👥",
  "Design": "🎨",
  "Development": "💻",
  "Meeting": "🤝",
  "Review": "📋",
  "Planning": "📅",
  "Testing": "🧪",
  "Deployment": "🚀"
}

// Default tags for task categorization
export const DEFAULT_TAGS = [
  {
    id: "study",
    name: "Study",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-l-blue-500",
  },
  {
    id: "meeting",
    name: "Meeting",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-l-green-500",
  },
  {
    id: "deadline",
    name: "Deadline",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-l-red-500",
  },
  {
    id: "exam",
    name: "Exam",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-l-purple-500",
  },
  {
    id: "personal",
    name: "Personal",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-l-amber-500",
  },
]

// Helper function to create a date with specific time
const createDateTime = (date, hours, minutes = 0) => {
  const newDate = new Date(date)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate
}

// Sample tasks
export const tasks = [
  {
    id: "1",
    title: "Study Software Engineering",
    description: "Review chapter 5 and complete practice exercises",
    date: "2025-05-18",
    startTime: createDateTime(new Date("2025-05-18"), 10),
    endTime: createDateTime(new Date("2025-05-18"), 12),
    tag: "study",
   
  },
  {
    id: "2",
    title: "Group Project Meeting",
    description: "Discuss progress and next steps for the database project",
    date: "2025-05-19",
    startTime: createDateTime(new Date("2025-05-19"), 14),
    endTime: createDateTime(new Date("2025-05-19"), 15, 30),
    tag: "meeting",
  },
  {
    id: "3",
    title: "Assignment Deadline",
    description: "Submit the programming assignment for Data Structures",
    date: "2025-05-18",
    startTime: createDateTime(new Date("2025-05-18"), 22),
    endTime: createDateTime(new Date("2025-05-18"), 23),
    tag: "deadline",
  },
  {
    id: "4",
    title: "Study Session: Algorithms",
    description: "Practice sorting algorithms and complexity analysis",
    date: "2025-05-19",
    startTime: createDateTime(new Date("2025-05-19"), 9),
    endTime: createDateTime(new Date("2025-05-19"), 11),
    tag: "study",
   
  },
  {
    id: "5",
    title: "Office Hours",
    description: "Meet with Professor Johnson to discuss project proposal",
    date: "2024-03-15",
    startTime: createDateTime(new Date("2024-03-15"), 15),
    endTime: createDateTime(new Date("2024-03-15"), 16),
    tag: "meeting",
  },
  {
    id: "6",
    title: "Final Exam Preparation",
    description: "Review all course materials and practice problems",
    date: "2024-03-15",
    startTime: createDateTime(new Date("2024-03-15"), 13),
    endTime: createDateTime(new Date("2024-03-15"), 17),
    tag: "exam",
    
  }
]
  
