import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import CategoryCard from "../components/CategoryCard";
import RecentInterviews from "../components/RecentInterviews";
import PerformanceChart from "../components/PerformanceChart";
import AIAssistant from "../components/AIAssistant";

function Dashboard() {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">

          <h1 className="text-4xl font-bold text-white">
            Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Track your interview preparation and improve your skills.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mt-8">

            <StatsCard
              title="Total Interviews"
              value="24"
              subtitle="+12% this week"
              iconBg="bg-blue-600"
            />

            <StatsCard
              title="Average Score"
              value="78%"
              subtitle="+6%"
              iconBg="bg-purple-600"
            />

            <StatsCard
              title="Best Score"
              value="92%"
              subtitle="Frontend"
              iconBg="bg-pink-600"
            />

            <StatsCard
              title="Practice Time"
              value="12.5h"
              subtitle="This Week"
              iconBg="bg-cyan-600"
            />

          </div>

          {/* Categories */}

          <div className="mt-12">

            <h2 className="text-white text-2xl font-bold mb-2">
              Practice by Category
            </h2>

            <p className="text-gray-400 mb-6">
              Choose your interview category
            </p>

            <div className="grid grid-cols-4 gap-6">

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

          </div>

          {/* Bottom Section */}

          <div className="grid grid-cols-3 gap-6 mt-12">

            <div className="col-span-2 space-y-6">

              <RecentInterviews />

              <PerformanceChart />

            </div>

            <div>

              <AIAssistant />

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;