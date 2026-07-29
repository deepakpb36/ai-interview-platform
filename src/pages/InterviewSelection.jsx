import { useNavigate } from "react-router-dom";

import {
  Monitor,
  Server,
  FileCode,
  Palette,
  Wind,
  Coffee,
  Code2,
  Brain,
  Bot,
  Cpu,
  Users,
  ArrowRight,
  Star,
  Clock3,
  CircleHelp,
} from "lucide-react";

function InterviewSelection() {
  const navigate = useNavigate();

  const difficultyColor = (difficulty) => {
    if (difficulty === "Easy") {
      return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400";
    }

    if (difficulty === "Medium") {
      return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
    }

    return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400";
  };

  const categories = [
        {
      title: "Frontend",
      description:
        "HTML, CSS, JavaScript, React and modern UI development.",
      questions: 20,
      duration: "15 Minutes",
      difficulty: "Medium",
      progress: 85,
      color: "bg-purple-600",
      badge: "Popular",
      icon: <Monitor size={34} />,
      route: "frontend",
    },

    {
      title: "Backend",
      description:
        "Node.js, Express.js, REST APIs, Authentication and Databases.",
      questions: 20,
      duration: "15 Minutes",
      difficulty: "Medium",
      progress: 0,
      color: "bg-indigo-600",
      badge: "New",
      icon: <Server size={34} />,
      route: "backend",
    },

    {
      title: "HTML",
      description:
        "HTML5, Semantic Tags, Forms, Tables and Accessibility.",
      questions: 20,
      duration: "15 Minutes",
      difficulty: "Easy",
      progress: 75,
      color: "bg-orange-600",
      badge: "",
      icon: <FileCode size={34} />,
      route: "html",
    },

    {
      title: "CSS",
      description:
        "Selectors, Flexbox, Grid, Animations and Responsive Design.",
      questions: 20,
      duration: "15 Minutes",
      difficulty: "Easy",
      progress: 0,
      color: "bg-sky-600",
      badge: "",
      icon: <Palette size={34} />,
      route: "css",
    },

    {
      title: "Tailwind CSS",
      description:
        "Utility Classes, Components, Responsive Design and Layout.",
      questions: 20,
      duration: "15 Minutes",
      difficulty: "Easy",
      progress: 0,
      color: "bg-cyan-600",
      badge: "Trending",
      icon: <Wind size={34} />,
      route: "tailwind",
    },

    {
      title: "Java",
      description:
        "Core Java, OOP, Collections, Exception Handling and Multithreading.",
      questions: 20,
      duration: "15 Minutes",
      difficulty: "Medium",
      progress: 70,
      color: "bg-amber-600",
      badge: "",
      icon: <Coffee size={34} />,
      route: "java",
    },

    {
      title: "Python",
      description:
        "Python Basics, OOP, Functions, Modules and Data Structures.",
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
      title: "Artificial Intelligence",
      description:
        "AI Basics, Intelligent Agents, Search Algorithms and Applications.",
      questions: 20,
      duration: "20 Minutes",
      difficulty: "Hard",
      progress: 0,
      color: "bg-pink-600",
      badge: "Hot",
      icon: <Bot size={34} />,
      route: "ai",
    },

    {
      title: "Machine Learning",
      description:
        "Regression, Classification, Training Models and Evaluation.",
      questions: 20,
      duration: "20 Minutes",
      difficulty: "Hard",
      progress: 0,
      color: "bg-green-600",
      badge: "",
      icon: <Brain size={34} />,
      route: "machinelearning",
    },

    {
      title: "Deep Learning",
      description:
        "Neural Networks, CNN, RNN, Transformers and Deep Learning.",
      questions: 20,
      duration: "20 Minutes",
      difficulty: "Hard",
      progress: 0,
      color: "bg-red-600",
      badge: "Advanced",
      icon: <Cpu size={34} />,
      route: "deeplearning",
    },

    {
      title: "HR",
      description:
        "Communication Skills, HR Questions and Personality Development.",
      questions: 15,
      duration: "10 Minutes",
      difficulty: "Easy",
      progress: 90,
      color: "bg-green-700",
      badge: "Recommended",
      icon: <Users size={34} />,
      route: "hr",
    },
  ];
    return (
    <div className="max-w-7xl mx-auto w-full">

      {/* Page Header */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Choose Your Interview
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
          Practice technical and HR interviews with AI-powered questions.
          Select your preferred category to begin.
        </p>

      </div>

      {/* Interview Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {categories.map((category) => (

          <div
            key={category.title}
            className="
              bg-white
              dark:bg-slate-900
              border
              border-gray-200
              dark:border-slate-800
              rounded-3xl
              shadow-lg
              hover:shadow-2xl
              hover:-translate-y-2
              transition-all
              duration-300
              overflow-hidden
            "
          >

            {/* Card Header */}

            <div className={`${category.color} p-6 text-white`}>

              <div className="flex justify-between items-center">

                <div className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-white/20
                  flex
                  items-center
                  justify-center
                ">
                  {category.icon}
                </div>

                {category.badge && (

                  <div className="
                    bg-white
                    text-gray-900
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-bold
                    flex
                    items-center
                    gap-1
                  ">

                    <Star size={14} />

                    {category.badge}

                  </div>

                )}

              </div>

              <h2 className="text-3xl font-bold mt-6">
                {category.title}
              </h2>

              <p className="text-white/90 mt-3 leading-7">
                {category.description}
              </p>

            </div>

            {/* Card Body */}

            <div className="p-6">

              <div className="grid grid-cols-3 gap-4">

                <div className="
                  bg-gray-100
                  dark:bg-slate-800
                  rounded-xl
                  p-4
                  text-center
                ">

                  <CircleHelp
                    className="
                      mx-auto
                      text-blue-600
                    "
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Questions
                  </p>

                  <h3 className="
                    text-xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  ">
                    {category.questions}
                  </h3>

                </div>

                <div className="
                  bg-gray-100
                  dark:bg-slate-800
                  rounded-xl
                  p-4
                  text-center
                ">

                  <Clock3
                    className="
                      mx-auto
                      text-green-600
                    "
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Duration
                  </p>

                  <h3 className="
                    text-lg
                    font-bold
                    text-gray-900
                    dark:text-white
                  ">
                    {category.duration}
                  </h3>

                </div>

                <div className="
                  bg-gray-100
                  dark:bg-slate-800
                  rounded-xl
                  p-4
                  text-center
                ">

                  <p className="text-xs text-gray-500">
                    Difficulty
                  </p>

                  <span
                    className={`
                      inline-block
                      mt-3
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-semibold
                      ${difficultyColor(category.difficulty)}
                    `}
                  >
                    {category.difficulty}
                  </span>

                </div>

              </div>

              <div className="mt-8">
                                <div className="flex justify-between items-center mb-2">

                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Preparation Level
                  </span>

                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {category.progress}%
                  </span>

                </div>

                <div className="w-full h-3 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
                    style={{
                      width: `${category.progress}%`,
                    }}
                  />

                </div>

              </div>

              <button
                onClick={() =>
                  navigate(`/interview/${category.route}`)
                }
                className="
                  w-full
                  mt-8
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-3
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                "
              >

                Start Interview

                <ArrowRight size={20} />

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
export default InterviewSelection;