const lessons = [
  {
    id: 1,
    title: "Introduction to React",
    type: "video",
    duration: "15:30",
    content: {
      videoUrl: "/video/reactjs.mp4",
      description: "Learn the basics of React and its core concepts.",
      resources: [
        {
          id: 1,
          title: "React Documentation",
          type: "pdf",
          link: "https://reactjs.org/docs"
        },
        {
          id: 2,
          title: "React Cheatsheet",
          type: "pdf",
          link: "https://reactcheatsheet.com"
        }
      ]
    },
    completed: false,
    progress: 0
  },
  {
    id: 2,
    title: "React Components",
    type: "document",
    duration: "20:00",
    content: {
      document: "/pdf/Introduction-to-React.pdf",
      description: "Understanding React components and their lifecycle.",
      resources: [
        {
          id: 3,
          title: "Component Lifecycle Guide",
          type: "pdf",
          link: "https://example.com/lifecycle.pdf"
        }
      ]
    },
    completed: false,
    progress: 0
  }
];

const modules = [
  {
    id: 1,
    title: "Module 1: React Basics",
    lessons: lessons
  }
];

export const currentCourses = [
  {
    id: 1,
    title: "React Development",
    category: "Programming",
    categoryColor: "bg-blue-500",
    instructor: "Jordan Walke",
    image: "/cover/cover-react.jpg",
    description: "Learn React from scratch and build modern web applications.",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    schedule: "Monday, Wednesday 10:00 AM",
    location: "Online",
    progress: 30,
    total: 100,
    modules: modules
  },
  {
    id: 2,
    title: "Introduction Software Engineering",
    category: "SE",
    categoryColor: "bg-[#9937fc]",
    progress: 28,
    total: 45,
    image: "/cover/cover-software-engineer.jpg",
    instructor: "Duc Tran",
    description: "This course is designed to introduce students to the fundamentals of software engineering. It covers topics such as software development methodologies, programming languages, and software testing.",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    schedule: "Monday, Wednesday, Friday",
    location:"UIT",
    modules:[
        {
            id:"m1",
            title:"Introduction to Software Engineering",
            lessons: [
                {
                    id: "l1",
                    title: "What is Software Engineering?",
                    duration: "45 min",
                    completed: true,
                },
                {
                    id: "l2",
                    title: "Software Development Life Cycle",
                    duration: "30 min",
                    completed: true,
                },
                {
                    id: "l3",
                    title: "Software Engineering Process",
                    duration: "25 min",
                    completed: true,
                },

            ]
        },
        {
            id: "m2",
            title: "Requirements Engineering",
            lessons: [
              {
                id: "l4",
                title: "Requirements Elicitation",
                duration: "1 hr",
                completed: true,
              },
              {
                id: "l5",
                title: "Requirements Analysis",
                duration: "1.5 hrs",
                completed: true,
              },
              {
                id: "l6",
                title: "Requirements Specification",
                duration: "1 hr",
                completed: false,
              },
            ],
          },
          {
            id: "m3",
            title: "Software Design",
            lessons: [
              {
                id: "l7",
                title: "Design Principles",
                duration: "1 hr",
                completed: false,
              },
              {
                id: "l8",
                title: "Architectural Design",
                duration: "1.5 hrs",
                completed: false,
              },
              {
                id: "l9",
                title: "Detailed Design",
                duration: "1 hr",
                completed: false,
              },
            ],
          },
        ],
        assignments: [
          {
            id: "a1",
            title: "Software Requirements Specification",
            dueDate: "February 28, 2024",
            status: "completed",
            grade: "A",
            description: "Create a comprehensive Software Requirements Specification (SRS) document for a student management system. The document should include:\n\n1. Introduction\n   - Purpose\n   - Scope\n   - Definitions\n   - References\n\n2. System Description\n   - System perspective\n   - System features\n   - User classes\n\n3. Functional Requirements\n   - User authentication\n   - Course management\n   - Grade management\n   - Report generation\n\n4. Non-functional Requirements\n   - Performance\n   - Security\n   - Reliability\n\n5. System Models\n   - Use case diagrams\n   - Activity diagrams\n   - Data flow diagrams",
            feedback: {
              grade: "A",
              comment: "Excellent work on the SRS document! Your requirements are well-defined and comprehensive. The system models are particularly well-done.",
              strengths: [
                "Clear and detailed functional requirements",
                "Well-structured document format",
                "Comprehensive system models"
              ],
              improvements: [
                "Could include more specific performance metrics",
                "Consider adding more security requirements"
              ]
            }
          },
          {
            id: "a2",
            title: "Software Design Document",
            dueDate: "April 15, 2024",
            status: "in-progress",
            grade: null,
            description: "Develop a detailed Software Design Document (SDD) for the student management system. The document should include:\n\n1. System Architecture\n   - High-level architecture\n   - Component diagrams\n   - Deployment diagrams\n\n2. Detailed Design\n   - Class diagrams\n   - Sequence diagrams\n   - Database schema\n\n3. Interface Design\n   - User interface mockups\n   - API specifications\n\n4. Security Design\n   - Authentication mechanisms\n   - Authorization rules\n   - Data protection measures",
            feedback: null
          },
          {
            id: "a3",
            title: "Final Project",
            dueDate: "May 25, 2024",
            status: "to-do",
            grade: null,
            description: "Implement a complete student management system based on the SRS and SDD documents. The project should include:\n\n1. Implementation\n   - Frontend development\n   - Backend development\n   - Database implementation\n\n2. Testing\n   - Unit tests\n   - Integration tests\n   - User acceptance testing\n\n3. Documentation\n   - User manual\n   - Technical documentation\n   - Deployment guide\n\n4. Presentation\n   - System demonstration\n   - Project report\n   - Code review",
            feedback: null
          },
        ],
        resources: [
          {
            id: "r1",
            title: "Software Engineering: A Practitioner's Approach",
            type: "Book",
            link: "#",
          },
          {
            id: "r2",
            title: "UML Diagram Templates",
            type: "Template",
            link: "#",
          },
          {
            id: "r3",
            title: "Software Testing Techniques",
            type: "Article",
            link: "#",
          },
        ],
        discussions: [
          {
            id: "d1",
            title: "Agile vs. Waterfall Methodology",
            content: "I'm trying to understand the key differences between Agile and Waterfall methodologies. Can someone explain the main advantages and disadvantages of each approach? I'm particularly interested in how they handle changing requirements during development.",
            author: {
              id: "s1",
              name: "John Smith",
              role: "student",
              avatar: "/avatars/student1.jpg"
            },
            createdAt: "2 days ago",
            lastActivity: "1 hour ago",
            isPinned: true,
            tags: ["Methodology", "Software Development"],
            replies: [
              {
                id: "r1",
                content: "Waterfall is more structured and sequential, while Agile is more flexible and iterative. In my experience, Agile works better for projects where requirements might change frequently.",
                author: {
                  id: "t1",
                  name: "Duc Tran",
                  role: "teacher",
                  avatar: "/avatars/teacher1.jpg"
                },
                createdAt: "1 day ago"
              },
              {
                id: "r2",
                content: "I agree with the teacher. Also, Agile promotes better team collaboration and faster delivery of working software.",
                author: {
                  id: "s2",
                  name: "Alice Johnson",
                  role: "student",
                  avatar: "/avatars/student2.jpg"
                },
                createdAt: "12 hours ago"
              }
            ]
          },
          {
            id: "d2",
            title: "Best Practices for Requirements Gathering",
            content: "What are some effective techniques for gathering software requirements? I'm working on my SRS document and want to make sure I'm following the best practices.",
            author: {
              id: "s3",
              name: "Mike Brown",
              role: "student",
              avatar: "/avatars/student3.jpg"
            },
            createdAt: "1 week ago",
            lastActivity: "3 days ago",
            isPinned: false,
            tags: ["Requirements", "Documentation"],
            replies: [
              {
                id: "r3",
                content: "Some key techniques include: 1) User interviews, 2) Surveys, 3) Workshops, 4) Prototyping, and 5) Document analysis. Make sure to involve all stakeholders in the process.",
                author: {
                  id: "t1",
                  name: "Duc Tran",
                  role: "teacher",
                  avatar: "/avatars/teacher1.jpg"
                },
                createdAt: "6 days ago"
              }
            ]
          }
        ]
  },
  {
    id: 2,
    title: "Introduction to Computer Vision",
    category: "CS",
    categoryColor: "bg-[#1cd767]",
    progress: 22,
    total: 36,
    image: "/cover/cover-computer-vision.jpg",
    instructor: "Duc Tran",
    description: "This course is designed to introduce students to the fundamentals of computer vision. It covers topics such as image processing, computer vision algorithms, and computer vision applications.",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    schedule: "Monday, Wednesday, Friday",
    location:"UIT",
    modules: [
        {
          id: "m1",
          title: "Introduction to Computer Vision",
          lessons: [
            {
              id: "l1",
              title: "What is Computer Vision?",
              duration: "45 min",
              completed: true,
            },
            {
              id: "l2",
              title: "History and Applications",
              duration: "1 hr",
              completed: true,
            },
          ],
        },
        {
          id: "m2",
          title: "Image Processing Fundamentals",
          lessons: [
            {
              id: "l3",
              title: "Digital Image Representation",
              duration: "1 hr",
              completed: true,
            },
            {
              id: "l4",
              title: "Image Enhancement Techniques",
              duration: "1.5 hrs",
              completed: true,
            },
            {
              id: "l5",
              title: "Image Filtering",
              duration: "1 hr",
              completed: false,
            },
          ],
        },
      ],
      assignments: [
        {
          id: "a1",
          title: "Image Processing Implementation",
          dueDate: "March 10, 2024",
          status: "completed",
          grade: "A-",
          description: "Implement basic image processing techniques using Python and OpenCV. The assignment should include:\n\n1. Image Loading and Display\n   - Read different image formats\n   - Display images with proper scaling\n\n2. Basic Operations\n   - Grayscale conversion\n   - Image resizing\n   - Image rotation\n\n3. Filtering\n   - Gaussian blur\n   - Edge detection\n   - Noise reduction\n\n4. Color Processing\n   - Color space conversion\n   - Color channel separation\n   - Color enhancement",
          feedback: {
            grade: "A-",
            comment: "Very good implementation of image processing techniques. The code is well-structured and documented.",
            strengths: [
              "Clean and efficient code",
              "Good error handling",
              "Clear documentation"
            ],
            improvements: [
              "Could optimize some filtering operations",
              "Add more advanced color processing techniques"
            ]
          }
        },
        {
          id: "a2",
          title: "Object Detection Project",
          dueDate: "April 25, 2024",
          status: "to-do",
          grade: null,
          description: "Develop an object detection system using deep learning. The project should include:\n\n1. Dataset Preparation\n   - Data collection\n   - Data annotation\n   - Data augmentation\n\n2. Model Development\n   - Model architecture\n   - Training pipeline\n   - Evaluation metrics\n\n3. Implementation\n   - Real-time detection\n   - Performance optimization\n   - Error handling\n\n4. Documentation\n   - Technical report\n   - User guide\n   - API documentation",
          feedback: null
        },
      ],
      resources: [
        {
          id: "r1",
          title: "Computer Vision: Algorithms and Applications",
          type: "Book",
          link: "#",
        },
        {
          id: "r2",
          title: "OpenCV Documentation",
          type: "Documentation",
          link: "#",
        },
      ],
      discussions: [
        {
          id: "d1",
          title: "Deep Learning for Image Recognition",
          content: "I'm having trouble understanding how deep learning models process and recognize images. Can someone explain the basic architecture of a CNN and how it differs from traditional image processing?",
          author: {
            id: "s4",
            name: "Sarah Wilson",
            role: "student",
            avatar: "/avatars/student4.jpg"
          },
          createdAt: "1 day ago",
          lastActivity: "4 hours ago",
          isPinned: true,
          tags: ["Deep Learning", "CNN", "Image Processing"],
          replies: [
            {
              id: "r4",
              content: "CNNs use multiple layers of filters to extract features from images. The key difference from traditional methods is their ability to learn these features automatically through training.",
              author: {
                id: "t1",
                name: "Duc Tran",
                role: "teacher",
                avatar: "/avatars/teacher1.jpg"
              },
              createdAt: "20 hours ago"
            }
          ]
        },
        {
          id: "d2",
          title: "Real-time Object Detection Challenges",
          content: "What are the main challenges in implementing real-time object detection? I'm working on a project that needs to process video streams and detect objects in real-time.",
          author: {
            id: "s5",
            name: "David Lee",
            role: "student",
            avatar: "/avatars/student5.jpg"
          },
          createdAt: "4 days ago",
          lastActivity: "2 days ago",
          isPinned: false,
          tags: ["Object Detection", "Real-time", "Performance"],
          replies: [
            {
              id: "r5",
              content: "The main challenges are: 1) Processing speed, 2) Accuracy vs. Speed trade-off, 3) Resource constraints, and 4) Handling different lighting conditions. Consider using optimized models like YOLO or SSD for real-time applications.",
              author: {
                id: "t1",
                name: "Duc Tran",
                role: "teacher",
                avatar: "/avatars/teacher1.jpg"
              },
              createdAt: "3 days ago"
            }
          ]
        }
      ],
  },
  {
    id: 3,
    title: "Introduction to Computational Thinking",
    category: "CS",
    categoryColor: "bg-[#1cd767]",
    progress: 10,
    total: 100,
    image: "/cover/cover-computational-thinking.jpg",
    instructor: "Duc Tran",
    description: "This course introduces students to computational thinking concepts and problem-solving techniques. It covers algorithmic thinking, pattern recognition, abstraction, and decomposition.",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    schedule: "Tuesday, Thursday",
    location: "UIT",
    modules: [
      {
        id: "m1",
        title: "Foundations of Computational Thinking",
        lessons: [
          {
            id: "l1",
            title: "What is Computational Thinking?",
            duration: "45 min",
            completed: true,
          },
          {
            id: "l2",
            title: "Problem Decomposition",
            duration: "1 hr",
            completed: true,
          },
          {
            id: "l3",
            title: "Pattern Recognition",
            duration: "45 min",
            completed: false,
          }
        ]
      },
      {
        id: "m2",
        title: "Algorithmic Thinking",
        lessons: [
          {
            id: "l4",
            title: "Understanding Algorithms",
            duration: "1 hr",
            completed: false,
          },
          {
            id: "l5",
            title: "Algorithm Design Techniques",
            duration: "1.5 hrs",
            completed: false,
          },
          {
            id: "l6",
            title: "Algorithm Analysis",
            duration: "1 hr",
            completed: false,
          }
        ]
      }
    ],
    assignments: [
      {
        id: "a1",
        title: "Problem Decomposition Exercise",
        dueDate: "March 15, 2024",
        status: "in-progress",
        grade: null,
        description: "Solve a complex problem using computational thinking principles. The assignment should include:\n\n1. Problem Analysis\n   - Problem statement\n   - Input/output analysis\n   - Constraints identification\n\n2. Decomposition\n   - Break down into subproblems\n   - Identify patterns\n   - Create abstraction\n\n3. Algorithm Design\n   - Step-by-step solution\n   - Pseudocode\n   - Complexity analysis\n\n4. Implementation\n   - Code implementation\n   - Testing\n   - Documentation",
        feedback: null
      },
      {
        id: "a2",
        title: "Algorithm Design Project",
        dueDate: "April 20, 2024",
        status: "to-do",
        grade: null,
        description: "Design and implement an efficient algorithm for a real-world problem. The project should include:\n\n1. Problem Selection\n   - Real-world scenario\n   - Problem complexity\n   - Practical applications\n\n2. Algorithm Design\n   - Multiple approaches\n   - Efficiency analysis\n   - Optimization techniques\n\n3. Implementation\n   - Code development\n   - Performance testing\n   - Error handling\n\n4. Documentation\n   - Design rationale\n   - Performance analysis\n   - Usage examples",
        feedback: null
      }
    ],
    resources: [
      {
        id: "r1",
        title: "Computational Thinking: A Beginner's Guide",
        type: "Book",
        link: "#",
      },
      {
        id: "r2",
        title: "Problem-Solving Strategies",
        type: "Article",
        link: "#",
      },
      {
        id: "r3",
        title: "Algorithm Visualization Tools",
        type: "Tool",
        link: "#",
      }
    ],
    discussions: [
      {
        id: "d1",
        title: "Understanding Algorithm Complexity",
        content: "I'm struggling with understanding time and space complexity. Can someone explain Big O notation with some practical examples?",
        author: {
          id: "s6",
          name: "Emma Davis",
          role: "student",
          avatar: "/avatars/student6.jpg"
        },
        createdAt: "3 days ago",
        lastActivity: "1 day ago",
        isPinned: true,
        tags: ["Algorithms", "Complexity", "Big O"],
        replies: [
          {
            id: "r6",
            content: "Big O notation describes how an algorithm's performance scales with input size. For example, a simple loop through an array is O(n), while a nested loop is O(n²).",
            author: {
              id: "t1",
              name: "Duc Tran",
              role: "teacher",
              avatar: "/avatars/teacher1.jpg"
            },
            createdAt: "2 days ago"
          }
        ]
      },
      {
        id: "d2",
        title: "Problem Decomposition Techniques",
        content: "What are some effective strategies for breaking down complex problems into smaller, manageable parts? I'm working on a project and finding it difficult to organize my approach.",
        author: {
          id: "s7",
          name: "Tom Wilson",
          role: "student",
          avatar: "/avatars/student7.jpg"
        },
        createdAt: "5 days ago",
        lastActivity: "2 days ago",
        isPinned: false,
        tags: ["Problem Solving", "Decomposition"],
        replies: [
          {
            id: "r7",
            content: "Start by identifying the main components of the problem. Then break each component into smaller tasks. Use diagrams or flowcharts to visualize the relationships between parts.",
            author: {
              id: "t1",
              name: "Duc Tran",
              role: "teacher",
              avatar: "/avatars/teacher1.jpg"
            },
            createdAt: "4 days ago"
          }
        ]
      }
    ]
  },
];

export const completedCourses = [
  {
    id: 4,
    title: "Design and Analysis of Algorithms",
    category: "CS",
    categoryColor: "bg-[#1cd767]",
    progress: 36,
    total: 36,
    image: "/cover/cover-daa.jpg",
    instructor: "Duc Tran",
    description: "Advanced course covering algorithm design techniques, complexity analysis, and optimization strategies. Students learn to design efficient algorithms and analyze their performance.",
    startDate: "2024-01-01",
    endDate: "2024-03-15",
    schedule: "Monday, Wednesday, Friday",
    location: "UIT",
    grade: "A",
    modules: [
      {
        id: "m1",
        title: "Algorithm Analysis",
        lessons: [
          {
            id: "l1",
            title: "Time Complexity Analysis",
            duration: "1 hr",
            completed: true,
          },
          {
            id: "l2",
            title: "Space Complexity Analysis",
            duration: "1 hr",
            completed: true,
          },
          {
            id: "l3",
            title: "Asymptotic Notations",
            duration: "45 min",
            completed: true,
          }
        ]
      },
      {
        id: "m2",
        title: "Advanced Algorithms",
        lessons: [
          {
            id: "l4",
            title: "Dynamic Programming",
            duration: "1.5 hrs",
            completed: true,
          },
          {
            id: "l5",
            title: "Greedy Algorithms",
            duration: "1 hr",
            completed: true,
          },
          {
            id: "l6",
            title: "Graph Algorithms",
            duration: "1.5 hrs",
            completed: true,
          }
        ]
      }
    ],
    assignments: [
      {
        id: "a1",
        title: "Algorithm Analysis Report",
        dueDate: "February 15, 2024",
        status: "completed",
        grade: "A",
      },
      {
        id: "a2",
        title: "Dynamic Programming Project",
        dueDate: "March 1, 2024",
        status: "completed",
        grade: "A",
      }
    ],
    resources: [
      {
        id: "r1",
        title: "Introduction to Algorithms",
        type: "Book",
        link: "#",
      },
      {
        id: "r2",
        title: "Algorithm Visualization Tools",
        type: "Tool",
        link: "#",
      }
    ],
    discussions: [
      {
        id: "d1",
        title: "Optimization Techniques",
        content: "What are the most effective optimization techniques for improving algorithm performance? I'm particularly interested in space-time trade-offs.",
        author: {
          id: "s8",
          name: "Lisa Chen",
          role: "student",
          avatar: "/avatars/student8.jpg"
        },
        createdAt: "2 weeks ago",
        lastActivity: "1 week ago",
        isPinned: true,
        tags: ["Optimization", "Performance"],
        replies: [
          {
            id: "r8",
            content: "Common optimization techniques include: 1) Memoization, 2) Dynamic Programming, 3) Greedy Algorithms, and 4) Space-Time Trade-offs. The choice depends on your specific problem constraints.",
            author: {
              id: "t1",
              name: "Duc Tran",
              role: "teacher",
              avatar: "/avatars/teacher1.jpg"
            },
            createdAt: "2 weeks ago"
          }
        ]
      }
    ],
    feedback: {
      rating: 4.8,
      comment: "Excellent course with comprehensive coverage of algorithms. The practical assignments were challenging but very educational.",
      strengths: [
        "Clear explanations of complex concepts",
        "Practical coding assignments",
        "Good balance of theory and practice"
      ],
      improvements: [
        "Could include more real-world case studies",
        "Additional practice problems would be beneficial"
      ]
    }
  },
  {
    id: 5,
    title: "Natural Language Processing",
    category: "CS",
    categoryColor: "bg-[#1cd767]",
    progress: 50,
    total: 50,
    image: "/cover/cover-nlp.jpg",
    instructor: "Duc Tran",
    description: "Comprehensive course on NLP fundamentals, including text processing, language models, and machine learning applications in natural language understanding.",
    startDate: "2024-01-01",
    endDate: "2024-02-28",
    schedule: "Tuesday, Thursday",
    location: "UIT",
    grade: "A",
    modules: [
      {
        id: "m1",
        title: "NLP Fundamentals",
        lessons: [
          {
            id: "l1",
            title: "Text Preprocessing",
            duration: "1 hr",
            completed: true,
          },
          {
            id: "l2",
            title: "Tokenization",
            duration: "45 min",
            completed: true,
          },
          {
            id: "l3",
            title: "Text Classification",
            duration: "1.5 hrs",
            completed: true,
          }
        ]
      },
      {
        id: "m2",
        title: "Advanced NLP",
        lessons: [
          {
            id: "l4",
            title: "Language Models",
            duration: "1.5 hrs",
            completed: true,
          },
          {
            id: "l5",
            title: "Named Entity Recognition",
            duration: "1 hr",
            completed: true,
          },
          {
            id: "l6",
            title: "Sentiment Analysis",
            duration: "1 hr",
            completed: true,
          }
        ]
      }
    ],
    assignments: [
      {
        id: "a1",
        title: "Text Classification Project",
        dueDate: "February 10, 2024",
        status: "completed",
        grade: "A",
      },
      {
        id: "a2",
        title: "NLP Application Development",
        dueDate: "February 25, 2024",
        status: "completed",
        grade: "A",
      }
    ],
    resources: [
      {
        id: "r1",
        title: "NLP with Python",
        type: "Book",
        link: "#",
      },
      {
        id: "r2",
        title: "NLP Libraries Documentation",
        type: "Documentation",
        link: "#",
      }
    ],
    discussions: [
      {
        id: "d1",
        title: "NLP Applications",
        content: "What are some real-world applications of NLP that we've learned in this course? I'm interested in understanding how these concepts are applied in industry.",
        author: {
          id: "s9",
          name: "James Wilson",
          role: "student",
          avatar: "/avatars/student9.jpg"
        },
        createdAt: "2 weeks ago",
        lastActivity: "1 week ago",
        isPinned: true,
        tags: ["Applications", "Industry"],
        replies: [
          {
            id: "r9",
            content: "Common applications include: 1) Sentiment Analysis, 2) Machine Translation, 3) Chatbots, 4) Text Classification, and 5) Named Entity Recognition. These are widely used in customer service, social media, and content analysis.",
            author: {
              id: "t1",
              name: "Duc Tran",
              role: "teacher",
              avatar: "/avatars/teacher1.jpg"
            },
            createdAt: "2 weeks ago"
          }
        ]
      }
    ],
    feedback: {
      rating: 4.9,
      comment: "Outstanding course with excellent practical applications. The projects were particularly valuable for learning real-world NLP implementation.",
      strengths: [
        "Hands-on experience with NLP tools",
        "Strong focus on practical applications",
        "Up-to-date content with latest research"
      ],
      improvements: [
        "Could include more advanced topics in deep learning",
        "More emphasis on multilingual NLP"
      ]
    }
  }
]; 