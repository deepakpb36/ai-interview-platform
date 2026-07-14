import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import CategoryCard from "../components/CategoryCard";
import RecentInterviews from "../components/RecentInterviews";
import PerformanceChart from "../components/PerformanceChart";
import AIAssistant from "../components/AIAssistant";
import { getHistory } from "../utils/storage";

function Dashboard() {
  const history = getHistory();

  const totalInterviews = history.length;

  const averageScore =
    totalInterviews > 0
      ? Math.round(
          history.reduce((sum, item) => sum + item.score, 0) /
            totalInterviews
        )
      : 0;

  const bestScore =
    totalInterviews > 0
      ? Math.max(...history.map((item) => item.score))
      : 0;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      <Sidebar />

      <main className="flex-1 overflow-hidden">

        <Navbar />

        <div className="p-8 lg:p-10">

          {/* Welcome */}

          <div className="mb-10">

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Welcome Back 👋
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Track your interview preparation, monitor your progress and
              improve your skills every day.
            </p>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            <StatsCard
              title="Total Interviews"
              value={totalInterviews}
              subtitle="Completed"
              iconBg="bg-blue-600"
            />

            <StatsCard
              title="Average Score"
              value={`${averageScore}%`}
              subtitle="Overall Performance"
              iconBg="bg-purple-600"
            />

            <StatsCard
              title="Best Score"
              value={`${bestScore}%`}
              subtitle="Highest Score"
              iconBg="bg-pink-600"
            />

            <StatsCard
              title="Practice Time"
              value={`${totalInterviews * 15} min`}
              subtitle="Estimated"
              iconBg="bg-cyan-600"
            />

          </div>

          {/* Categories */}

          <section className="mt-12">

            <div className="mb-6">

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Practice Categories
              </h2>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Select a category and start your AI mock interview.
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

              <CategoryCard
                title="Frontend"
                interviews="12"
                score="75%"
                color="bg-purple-700"
              />

              <CategoryCard
                title="Java"
                interviews="8"
                score="80%"
                color="bg-orange-600"
              />

              <CategoryCard
                title="Python"
                interviews="10"
                score="68%"
                color="bg-blue-700"
              />

              <CategoryCard
                title="HR"
                interviews="6"
                score="85%"
                color="bg-green-700"
              />

            </div>

          </section>

          {/* Bottom */}

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">

            <div className="xl:col-span-2 space-y-8">

              <RecentInterviews />

              <PerformanceChart />

            </div>

            <div>

              <AIAssistant />

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;