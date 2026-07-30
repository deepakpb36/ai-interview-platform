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

import { categories as dataCategories } from "../data/data";

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

  const mapLevelToDifficulty = (level) => {
    if (!level) return "Medium";

    const value = level.toLowerCase();

    if (value === "beginner") return "Easy";
    if (value === "intermediate") return "Medium";
    if (value === "advanced") return "Hard";

    return "Medium";
  };

  const getIcon = (id) => {
    switch (id) {
      case "frontend":
        return <Monitor size={34} />;

      case "backend":
        return <Server size={34} />;

      case "html":
        return <FileCode size={34} />;

      case "css":
        return <Palette size={34} />;

      case "tailwind":
        return <Wind size={34} />;

      case "java":
        return <Coffee size={34} />;

      case "python":
        return <Code2 size={34} />;

      case "ai":
        return <Bot size={34} />;

      case "machine-learning":
        return <Brain size={34} />;

      case "deep-learning":
        return <Cpu size={34} />;

      case "php":
        return <Code2 size={34} />;

      case "c":
        return <FileCode size={34} />;

      case "csharp":
        return <FileCode size={34} />;

      case "hr":
        return <Users size={34} />;

      default:
        return <Monitor size={34} />;
    }
  };

  const categories = dataCategories.map((cat) => {
    const bgStyle =
      cat.color && cat.color.startsWith("#")
        ? { background: cat.color }
        : undefined;

    return {
      id: cat.id,
      title: cat.title,
      description: cat.description,
      questions: cat.questionsCount ?? 20,
      duration: cat.duration ?? "15 Minutes",
      difficulty: mapLevelToDifficulty(cat.level),
      progress: cat.progress ?? 0,
      badge: cat.badge || "",
      bgStyle,
      icon: getIcon(cat.id),
      route: cat.id,
    };
  });

  return (
    <div className="max-w-7xl mx-auto w-full">

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Choose Your Interview
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
          Practice technical and HR interviews with AI-powered questions.
          Select your preferred category to begin.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {categories.map((category) => (

          <div
            key={category.id}
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

            <div
              className="p-6 text-white"
              style={category.bgStyle}
            >

              <div className="flex justify-between items-center">

                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-white/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  {category.icon}
                </div>


                {category.badge && (
                  <div
                    className="
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
                    "
                  >
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



            <div className="p-6">


              <div className="grid grid-cols-3 gap-4">


                <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-4 text-center">

                  <CircleHelp className="mx-auto text-blue-600" />

                  <p className="text-xs text-gray-500 mt-2">
                    Questions
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.questions}
                  </h3>

                </div>



                <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-4 text-center">

                  <Clock3 className="mx-auto text-green-600" />

                  <p className="text-xs text-gray-500 mt-2">
                    Duration
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {category.duration}
                  </h3>

                </div>



                <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-4 text-center">

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
                    className="
                      h-full
                      bg-gradient-to-r
                      from-blue-500
                      to-indigo-600
                      rounded-full
                      transition-all
                      duration-700
                    "
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