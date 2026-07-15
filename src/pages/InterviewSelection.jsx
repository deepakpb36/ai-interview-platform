import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Monitor,
  Coffee,
  Code2,
  Users,
  ArrowRight,
  Star,
  Clock3,
  CircleHelp,
} from "lucide-react";

function InterviewSelection() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Frontend",
      description: "Practice HTML, CSS, JavaScript, React and UI development.",
      questions: 20,
      duration: "15 Minutes",
      difficulty: "Medium",
      progress: 85,
      color: "bg-purple-600",
      badge: "Most Popular",
      icon: <Monitor size={34} />,
      route: "frontend",
    },
    {
      title: "Java",
      description: "Master OOP, Collections, Exception Handling and Core Java.",
      questions: 20,
      duration: "15 Minutes",
      difficulty: "Medium",
      progress: 70,
      color: "bg-orange-600",
      badge: "",
      icon: <Coffee size={34} />,
      route: "java",
    },
    {
      title: "Python",
      description: "Practice Python Basics, OOP, Functions and Data Structures.",
      questions: 20,
      duration: "15 Minutes",
      difficulty: "Easy",
      progress: 60,
      color: "bg-blue-600",
      badge: "",
      icon: <Code2 size={34} />,
      route: "python",
    },
    {
      title: "HR",
      description: "Improve communication, confidence and HR interview skills.",
      questions: 15,
      duration: "10 Minutes",
      difficulty: "Easy",
      progress: 90,
      color: "bg-green-600",
      badge: "Recommended",
      icon: <Users size={34} />,
      route: "hr",
    },
  ];

  const difficultyColor = (difficulty) => {
    if (difficulty === "Easy")
      return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400";

    if (difficulty === "Medium")
      return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";

    return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400";
  };

  return (
    <div className="flex bg-gray-100 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Choose Your Interview
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Select a category and begin your AI-powered mock interview.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 mt-10">
            {categories.map((category) => (
              <div
                key={category.title}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 hover:border-blue-500 hover:-translate-y-2 transition duration-300 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg`}
                  >
                    {category.icon}
                  </div>

                  {category.badge && (
                    <span className="bg-pink-600 px-3 py-1 rounded-full text-sm text-white flex items-center gap-1">
                      <Star size={15} />
                      {category.badge}
                    </span>
                  )}
                </div>

                <h2 className="text-gray-900 dark:text-white text-3xl font-bold mt-6">
                  {category.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mt-3 leading-7">
                  {category.description}
                </p>

                {/* Sub-Metric Cards */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-4 text-center transition">
                    <CircleHelp className="mx-auto text-blue-600 dark:text-blue-400" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      Questions
                    </p>
                    <h3 className="text-gray-900 dark:text-white text-xl font-bold mt-1">
                      {category.questions}
                    </h3>
                  </div>

                  <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-4 text-center transition">
                    <Clock3 className="mx-auto text-green-600 dark:text-green-400" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      Duration
                    </p>
                    <h3 className="text-gray-900 dark:text-white text-xl font-bold mt-1">
                      {category.duration}
                    </h3>
                  </div>

                  <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-4 text-center transition">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Difficulty
                    </p>
                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor(
                        category.difficulty
                      )}`}
                    >
                      {category.difficulty}
                    </span>
                  </div>
                </div>

                {/* Progress Level */}
                <div className="mt-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Preparation Level
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {category.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-3 transition">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{
                        width: `${category.progress}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action CTA Button */}
                <button
                  onClick={() => navigate(`/interview/${category.route}`)}
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition"
                >
                  Start Interview
                  <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewSelection;