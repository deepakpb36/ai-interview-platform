import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
 CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";

import {
  Target,
  TrendingUp,
  Trophy,
  Clock,
  BookOpen,
  Terminal,
  Code,
  Users,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import INTERVIEW_QUESTIONS from "../data/questions";
import { getHistory } from "../utils/storage";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const INTERVIEW_TRACKS = [
  {
    id: "html",
    title: "HTML",
    description: "Master semantic HTML, accessibility and page structure.",
    icon: BookOpen,
    color: "from-orange-500 to-red-500",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    id: "python",
    title: "Python",
    description: "Practice Python fundamentals and problem solving.",
    icon: Terminal,
    color: "from-blue-500 to-indigo-500",
    difficulty: "Intermediate",
    duration: "10 min",
  },
  {
    id: "java",
    title: "Java",
    description: "Prepare Java OOP and core interview questions.",
    icon: Code,
    color: "from-red-500 to-rose-500",
    difficulty: "Intermediate",
    duration: "10 min",
  },
  {
    id: "hr",
    title: "HR",
    description: "Improve communication and behavioural interview skills.",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    difficulty: "Easy",
    duration: "8 min",
  },
];

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-white`}
        >
          <Icon size={26} />
        </div>

      </div>

    </div>
  );
}

function Dashboard() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const search =
    searchParams.get("search") || "";

  const history = getHistory();

 const stats = useMemo(() => {

  const total = history.length;


  const scores = history.map((item) =>
    Number(
      item.scorePercentage ??
      item.score ??
      0
    )
  );


  const average =
    total === 0
      ? 0
      : Math.round(
          scores.reduce(
            (sum, score) => sum + score,
            0
          ) / total
        );


  const best =
    scores.length === 0
      ? 0
      : Math.max(...scores);



  return {

    totalInterviews: total,

    averageScore: average,

    bestScore: best,

    practiceMinutes: total * 10,

  };


}, [history]);

  const categoryCount = {
    html: 0,
    python: 0,
    java: 0,
    hr: 0,
  };

  history.forEach((item) => {
    if (categoryCount[item.category] !== undefined) {
      categoryCount[item.category]++;
    }
  });

  const doughnutData = {
    labels: ["HTML", "Python", "Java", "HR"],
    datasets: [
      {
        data: [
          categoryCount.html,
          categoryCount.python,
          categoryCount.java,
          categoryCount.hr,
        ],
      },
    ],
  };

  const lineData = {
    labels: history
      .slice(-7)
      .map((item) => item.date),

    datasets: [
      {
        label: "Score",
        data: history
          .slice(-7)
          .map((item) => item.score),

        tension: 0.4,
      },
    ],
  };

  const filteredTracks =
    INTERVIEW_TRACKS.filter((track) =>
      track.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
      return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">

          <div className="max-w-7xl mx-auto space-y-8">

            {/* Hero Section */}

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    Welcome Back, Deepak 👋
                  </h1>

                  <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
                    Practice technical interviews, improve your confidence,
                    and track your progress with every assessment.
                  </p>

                  <button
                    onClick={() => navigate("/interview")}
                    className="mt-6 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                  >
                    Start New Interview
                  </button>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-5 text-center">

                    <p className="text-sm text-slate-500">
                      Average Score
                    </p>

                    <h2 className="text-3xl font-bold text-blue-600 mt-2">
                      {stats.averageScore}%
                    </h2>

                  </div>

                  <div className="bg-green-50 dark:bg-slate-800 rounded-xl p-5 text-center">

                    <p className="text-sm text-slate-500">
                      Best Score
                    </p>

                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                      {stats.bestScore}%
                    </h2>

                  </div>

                </div>

              </div>

            </div>

            {/* Statistics */}

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

              <StatCard
                title="Total Interviews"
                value={stats.totalInterviews}
                icon={Target}
                color="from-blue-500 to-blue-700"
              />

              <StatCard
                title="Average Score"
                value={`${stats.averageScore}%`}
                icon={TrendingUp}
                color="from-green-500 to-green-700"
              />

              <StatCard
                title="Highest Score"
                value={`${stats.bestScore}%`}
                icon={Trophy}
                color="from-yellow-500 to-orange-500"
              />

              <StatCard
                title="Practice Time"
                value={`${stats.practiceMinutes} min`}
                icon={Clock}
                color="from-purple-500 to-pink-600"
              />

            </section>

            {/* Interview Categories */}

            <section>

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Interview Categories
                  </h2>

                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Choose a category to begin your interview.
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {filteredTracks.map((track) => {

                  const Icon = track.icon;

                  const questionCount =
                    INTERVIEW_QUESTIONS[track.id]?.length || 0;

                  return (

                    <div
                      key={track.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition p-6"
                    >

                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${track.color} flex items-center justify-center text-white`}
                      >
                        <Icon size={28} />
                      </div>

                      <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                        {track.title}
                      </h3>

                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-6">
                        {track.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-5">

                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {questionCount} Questions
                        </span>

                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          {track.duration}
                        </span>

                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                          {track.difficulty}
                        </span>

                      </div>

                      <button
                        onClick={() => navigate(`/interview/${track.id}`)}
                        className="mt-6 w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white py-3 font-semibold"
                      >
                        Start Interview
                      </button>

                    </div>

                  );

                })}

              </div>

            </section>

            {/* Analytics */}

            <section>

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Performance Analytics
                  </h2>

                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Monitor your interview progress and performance.
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Category Distribution
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 mb-6">
                    Interviews attempted in each category.
                  </p>

                  <div className="h-[320px]">

                    <Doughnut
                      data={doughnutData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "68%",
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />

                  </div>

                </div>

                <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Score Progress
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 mb-6">
                    Performance across completed interviews.
                  </p>

                  <div className="h-[320px]">

                    <Line
                      data={lineData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: "top",
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }}
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* Recent Interviews */}

            <section>

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Recent Interviews
                  </h2>

                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Your latest interview attempts.
                  </p>

                </div>

                <button
                  onClick={() => navigate("/history")}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                  View History
                </button>

              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                {history.length === 0 ? (

                  <div className="py-20 text-center">

                    <Target
                      size={60}
                      className="mx-auto text-blue-500 mb-5"
                    />

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      No Interviews Yet
                    </h3>

                    <p className="mt-3 text-slate-500 dark:text-slate-400">
                      Complete your first interview to see your activity.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-slate-200 dark:divide-slate-800">

                    {history
                      .slice()
                      .reverse()
                      .slice(0, 5)
                      .map((item) => (

                        <div
                          key={item.id}
                          className="flex items-center justify-between px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >

                          <div>

                            <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                              {item.category} Interview
                            </h3>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {item.date} • {item.time}
                            </p>

                          </div>

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              item.score >= 80
                                ? "bg-green-100 text-green-700"
                                : item.score >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.score}%
                          </span>

                        </div>

                      ))}

                  </div>

                )}

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;