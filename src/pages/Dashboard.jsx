import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Code, BookOpen, Terminal, Users, Play, Star } from "lucide-react";

const INTERVIEW_TRACKS = [
  {
    id: "html",
    title: "HTML / Web UI",
    description: "Deep dive into document structures, semantic elements, forms, layouts, and accessibility APIs.",
    questionsCount: 5,
    difficulty: "Beginner",
    icon: BookOpen,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "python",
    title: "Python Core",
    description: "Test your functional skills, data structures, mutability concepts, and native programming models.",
    questionsCount: 5,
    difficulty: "Medium",
    icon: Terminal,
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: "java",
    title: "Java & OOPs",
    description: "Prepare for OOP pillars, multi-threading basics, memory management, JVM, and reference types.",
    questionsCount: 5,
    difficulty: "Hard",
    icon: Code,
    color: "from-red-500 to-rose-600"
  },
  {
    id: "hr",
    title: "HR Behavioral",
    description: "Refine soft skills, situational problem-solving, stress handling, and background descriptions.",
    questionsCount: 5,
    difficulty: "Easy",
    icon: Users,
    color: "from-purple-500 to-pink-500"
  }
];

function Dashboard() {
  const navigate = useNavigate();
  
  // 1. Hook up search parameters from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // 2. Filter tracks matching on titles, descriptions, or IDs
  const filteredTracks = INTERVIEW_TRACKS.filter((track) => {
    const target = searchQuery.toLowerCase().trim();
    return (
      track.title.toLowerCase().includes(target) ||
      track.description.toLowerCase().includes(target) ||
      track.id.toLowerCase().includes(target)
    );
  });

  return (
    <div className="flex bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Navbar doesn't need custom local state props passed down anymore! */}
        <Navbar />

        <main className="p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Choose an Interview Category
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Pick a card to start a customized fullscreen AI-assisted assessment.
            </p>
          </div>

          {/* Grid Layout - Renders only filtered cards */}
          {filteredTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTracks.map((track) => {
                const IconComponent = track.icon;

                return (
                  <div
                    key={track.id}
                    className="group relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300"
                  >
                    <div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${track.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent size={24} />
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {track.title}
                      </h3>

                      <div className="flex items-center gap-2 mt-2.5 mb-4">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-950">
                          {track.questionsCount} Qs
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400">
                          {track.difficulty}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-6">
                        {track.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/interview/${track.id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all"
                    >
                      <Play size={16} fill="white" />
                      Start Assessment
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Search Empty State */
            <div className="bg-white dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-16 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto text-red-500 dark:text-red-400 mb-4">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                No Tracks Match "{searchQuery}"
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                We couldn't find any language profiles with that key. Double-check your spelling!
              </p>
              <button
                type="button"
                onClick={() => setSearchParams({})} // Simply clears parameters to reset view
                className="mt-6 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-semibold py-2 px-5 rounded-lg text-sm transition-all"
              >
                Clear Search Filter
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Dashboard;