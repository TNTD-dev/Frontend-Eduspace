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

// Sample task data
export const tasksByDate = {
  // Current month tasks
  "2025-05-13": [
    {
      id: 1,
      title: "Landing Page Design",
      time: "08:00 AM",
      category: "Web Design",
      icon: taskCategories["Web Design"],
      description: "Design the main landing page for the new product",
      priority: "high"
    },
    {
      id: 2,
      title: "3D Icon Design",
      time: "09:00 AM",
      category: "3D Modeling",
      icon: taskCategories["3D Modeling"],
      description: "Create 3D icons for the mobile app",
      priority: "medium"
    }
  ],
  "2025-05-14": [
    {
      id: 3,
      title: "Frontend Development",
      time: "10:00 AM",
      category: "Development",
      icon: taskCategories["Development"],
      description: "Implement new features for the dashboard",
      priority: "high"
    }
  ],
  "2025-05-15": [
    {
      id: 4,
      title: "UI Design Review",
      time: "02:00 PM",
      category: "Design",
      icon: taskCategories["Design"],
      description: "Review the new UI design with the team",
      priority: "medium"
    }
  ],

  // Next month tasks
  "2025-05-16": [
    {
      id: 5,
      title: "Project Planning",
      time: "09:00 AM",
      category: "Planning",
      icon: taskCategories["Planning"],
      description: "Plan the next sprint goals and tasks",
      priority: "high"
    }
  ],
  "2025-05-17": [
    {
      id: 6,
      title: "Team Meeting",
      time: "11:00 AM",
      category: "Meeting",
      icon: taskCategories["Meeting"],
      description: "Weekly team sync meeting",
      priority: "medium"
    }
  ],

  // Previous month tasks
  "2025-05-18": [
    {
      id: 7,
      title: "Code Review",
      time: "03:00 PM",
      category: "Review",
      icon: taskCategories["Review"],
      description: "Review pull requests for the main branch",
      priority: "high"
    }
  ]
}


