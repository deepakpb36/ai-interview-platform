import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDashboardStats,
  getUserPerformance,
  getCategoryStatistics,
  getRecentInterviews,
} from "../utils/adminStorage";

import {
  Users,
  Trophy,
  Search,
  BarChart3,
  TrendingUp,
  Mic,
  LogOut,
} from "lucide-react";

import {
  Bar,
  Doughnut,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Admin() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const users = getUserPerformance() || [];

  const dashboard =
    getDashboardStats() || {};

  const categories =
    getCategoryStatistics() || {
      labels: [],
      data: [],
    };

  const recentInterviews =
    getRecentInterviews() || [];

  const filteredUsers = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return users.filter((user) => {
      const name =
        (user.name || "").toLowerCase();

      const email =
        (user.email || "").toLowerCase();

      return (
        name.includes(searchText) ||
        email.includes(searchText)
      );
    });
  }, [users, search]);

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdmin");

    navigate("/admin-login", {
      replace: true,
    });
  };

  const categoryChartData = {
    labels: categories.labels || [],
    datasets: [
      {
        label: "Interviews",
        data: categories.data || [],
        borderWidth: 1,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const stats = [
    {
      title: "Total Users",
      value: dashboard.totalUsers || 0,
      icon: Users,
    },
    {
      title: "Total Interviews",
      value: dashboard.totalInterviews || 0,
      icon: Mic,
    },
    {
      title: "Average Score",
      value: `${dashboard.averageScore || 0}%`,
      icon: TrendingUp,
    },
    {
      title: "Top Performer",
      value:
        dashboard.topPerformer?.name ||
        "No Data",
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white">

      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <BarChart3
                  size={22}
                  className="text-white"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  Admin Dashboard
                </h1>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  AI Interview Platform
                </p>
              </div>

            </div>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </div>

      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                      {stat.value}
                    </h2>

                  </div>

                  <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Icon
                      size={22}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>

                </div>

              </div>
            );
          })}

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6">

            <div className="flex items-center gap-2 mb-5">

              <BarChart3
                size={20}
                className="text-blue-600"
              />

              <h2 className="text-lg font-bold">
                Interview Categories
              </h2>

            </div>

            <div className="h-72">

              {categories.labels?.length > 0 ? (
                <Bar
                  data={categoryChartData}
                  options={categoryChartOptions}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No interview data available
                </div>
              )}

            </div>

          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6">

            <h2 className="text-lg font-bold mb-5">
              Top Performer
            </h2>

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">

                <Trophy
                  size={28}
                  className="text-yellow-600"
                />

              </div>

              <div>

                <p className="font-bold text-lg">
                  {dashboard.topPerformer?.name ||
                    "No Data"}
                </p>

                <p className="text-gray-500 dark:text-gray-400">
                  Best Score:{" "}
                  {dashboard.topPerformer?.score ||
                    0}
                  %
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>

              <h2 className="text-lg font-bold">
                Registered Users
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                All users registered in the system
              </p>

            </div>

            <div className="relative w-full sm:w-72">

              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-gray-200 dark:border-slate-800">

                  <th className="px-4 py-3 text-sm font-semibold">
                    User
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Email
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Interviews
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Average
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Best
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-slate-800"
                    >

                      <td className="px-4 py-4 font-medium">
                        {user.name}
                      </td>

                      <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>

                      <td className="px-4 py-4">
                        {user.interviews}
                      </td>

                      <td className="px-4 py-4">
                        {user.average}%
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        {user.best}%
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>

                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No users found.
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6">

          <div className="flex items-center gap-2 mb-6">

            <Mic
              size={20}
              className="text-blue-600"
            />

            <h2 className="text-lg font-bold">
              Recent Interviews
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-gray-200 dark:border-slate-800">

                  <th className="px-4 py-3 text-sm font-semibold">
                    User
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Category
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Score
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Completed
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentInterviews.length > 0 ? (
                  recentInterviews.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-slate-800"
                    >

                      <td className="px-4 py-4 font-medium">
                        {item.userName}
                      </td>

                      <td className="px-4 py-4">
                        {item.category}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        {item.scorePercentage}%
                      </td>

                      <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                        {item.completedAt
                          ? new Date(
                              item.completedAt
                            ).toLocaleString()
                          : "Unknown"}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>

                    <td
                      colSpan="4"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No interviews found.
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Admin;