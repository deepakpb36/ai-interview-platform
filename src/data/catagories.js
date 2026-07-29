import {
  BookOpen,
  Code,
  Terminal,
  Brain,
  Database,
  Users,
  Globe,
  Cpu,
} from "lucide-react";

export const categories = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "HTML, CSS, JavaScript, React and UI concepts.",
    icon: Globe,
    difficulty: "Beginner",
    duration: "15 min",
    color: "from-cyan-500 to-blue-500",
  },

  {
    id: "backend",
    title: "Backend Development",
    description: "Server-side development and APIs.",
    icon: Database,
    difficulty: "Intermediate",
    duration: "15 min",
    color: "from-green-500 to-emerald-600",
  },

  {
    id: "html",
    title: "HTML",
    description: "Semantic HTML and web page structure.",
    icon: BookOpen,
    difficulty: "Easy",
    duration: "10 min",
    color: "from-orange-500 to-red-500",
  },

  {
    id: "css",
    title: "CSS",
    description: "Layouts, Flexbox, Grid and responsive design.",
    icon: BookOpen,
    difficulty: "Easy",
    duration: "10 min",
    color: "from-blue-500 to-cyan-500",
  },

  {
    id: "javascript",
    title: "JavaScript",
    description: "ES6, DOM, events and asynchronous programming.",
    icon: Code,
    difficulty: "Medium",
    duration: "15 min",
    color: "from-yellow-500 to-orange-500",
  },

  {
    id: "react",
    title: "React",
    description: "Components, Hooks, Routing and State Management.",
    icon: Code,
    difficulty: "Medium",
    duration: "15 min",
    color: "from-sky-500 to-cyan-500",
  },

  {
    id: "tailwind",
    title: "Tailwind CSS",
    description: "Utility-first CSS framework.",
    icon: BookOpen,
    difficulty: "Medium",
    duration: "10 min",
    color: "from-teal-500 to-cyan-500",
  },

  {
    id: "php",
    title: "PHP",
    description: "PHP fundamentals and backend programming.",
    icon: Terminal,
    difficulty: "Medium",
    duration: "15 min",
    color: "from-indigo-500 to-purple-600",
  },

  {
    id: "python",
    title: "Python",
    description: "Python programming interview questions.",
    icon: Terminal,
    difficulty: "Medium",
    duration: "15 min",
    color: "from-blue-500 to-indigo-600",
  },

  {
    id: "java",
    title: "Java",
    description: "Core Java and OOP concepts.",
    icon: Code,
    difficulty: "Medium",
    duration: "15 min",
    color: "from-red-500 to-rose-600",
  },

  {
    id: "c",
    title: "C Programming",
    description: "C language fundamentals.",
    icon: Terminal,
    difficulty: "Easy",
    duration: "15 min",
    color: "from-gray-600 to-slate-700",
  },

  {
    id: "csharp",
    title: "C#",
    description: ".NET and C# programming.",
    icon: Code,
    difficulty: "Medium",
    duration: "15 min",
    color: "from-purple-600 to-violet-700",
  },

  {
    id: "ai",
    title: "Artificial Intelligence",
    description: "Artificial Intelligence fundamentals.",
    icon: Brain,
    difficulty: "Advanced",
    duration: "20 min",
    color: "from-pink-500 to-purple-600",
  },

  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "ML algorithms and concepts.",
    icon: Cpu,
    difficulty: "Advanced",
    duration: "20 min",
    color: "from-amber-500 to-orange-600",
  },

  {
    id: "deep-learning",
    title: "Deep Learning",
    description: "Neural Networks and Deep Learning.",
    icon: Brain,
    difficulty: "Advanced",
    duration: "20 min",
    color: "from-red-500 to-pink-600",
  },

  {
    id: "hr",
    title: "HR Interview",
    description: "Behavioral and HR interview questions.",
    icon: Users,
    difficulty: "Easy",
    duration: "10 min",
    color: "from-fuchsia-500 to-pink-600",
  },
];