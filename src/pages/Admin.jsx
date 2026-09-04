import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDashboardStats,
  getUserPerformance,
  getCategoryStatistics,
  getRecentInterviews,
  getScoreDistribution,
} from "../utils/adminStorage";

import {
  Users,
  User,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Search,
  BarChart3,
  TrendingUp,
  Mic,
  LogOut,
  Trophy,
  RefreshCw,
  X,
  Mail,
  Calendar,
  Shield,
  Activity,
  Award,
  Clock,
  CheckCircle2,
  Ban,
  ChevronRight,
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

// ======================================================
// Helpers
// ======================================================

const formatDate = (date) => {
  if (!date) return "Not available";

  try {
    return new Date(date).toLocaleString();
  } catch {
    return "Not available";
  }
};

const getInitials = (name = "") => {
  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 0) return "U";

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[words.length - 1].charAt(0)
  ).toUpperCase();
};

const getScoreColor = (score) => {
  const value = Number(score || 0);

  if (value >= 90) {
    return {
      text: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    };
  }

  if (value >= 75) {
    return {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    };
  }

  if (value >= 50) {
    return {
      text: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    };
  }

  return {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  };
};

// ======================================================
// Admin Component
// ======================================================

function Admin() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  // ====================================================
  // Get Dashboard Data
  // ====================================================

  const dashboard = useMemo(() => {
    return getDashboardStats() || {};
  }, [refreshKey]);

  const users = useMemo(() => {
    return getUserPerformance() || [];
  }, [refreshKey]);

  const categories = useMemo(() => {
    return (
      getCategoryStatistics() || {
        labels: [],
        data: [],
      }
    );
  }, [refreshKey]);

  const scoreDistribution = useMemo(() => {
    return (
      getScoreDistribution() || {
        labels: [],
        data: [],
      }
    );
  }, [refreshKey]);

  const recentInterviews = useMemo(() => {
    return getRecentInterviews(10) || [];
  }, [refreshKey]);

  // ====================================================
  // Search
  // ====================================================

  const filteredUsers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return users;
    }

    return users.filter((user) => {
      const name = (user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();

      return (
        name.includes(searchText) ||
        email.includes(searchText)
      );
    });
  }, [users, search]);

  // ====================================================
  // Refresh Dashboard
  // ====================================================

  const handleRefresh = () => {
    setRefreshKey((previous) => previous + 1);
  };

  // ====================================================
  // Admin Logout
  // ====================================================

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdmin");

    navigate("/admin-login", {
      replace: true,
    });
  };

  // ====================================================
  // Delete User
  // ====================================================

  const handleDeleteUser = (user) => {
    if (!user?.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${user.name}"?\n\nThis will remove the user's local account data and interview history from this browser.`
    );

    if (!confirmed) return;

    setActionLoading(true);

    try {
      const storedUsers = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const updatedUsers = storedUsers.filter(
        (item) => item?.uid !== user.id
      );

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      // Remove interview history belonging to user
      localStorage.removeItem(
        `history_${user.id}`
      );

      // Close modal if currently open
      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
      }

      setRefreshKey((previous) => previous + 1);

      alert("User deleted successfully.");
    } catch (error) {
      console.error("Unable to delete user:", error);
      alert("Unable to delete user.");
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // Block / Unblock User
  // ====================================================

  const handleToggleBlock = (user) => {
    if (!user?.id) return;

    setActionLoading(true);

    try {
      const storedUsers = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const updatedUsers = storedUsers.map((item) => {
        if (item?.uid !== user.id) {
          return item;
        }

        return {
          ...item,
          blocked: !item.blocked,
        };
      });

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      // Update currently opened modal
      if (selectedUser?.id === user.id) {
        setSelectedUser({
          ...selectedUser,
          blocked: !selectedUser.blocked,
        });
      }

      setRefreshKey((previous) => previous + 1);

      alert(
        user.blocked
          ? "User has been unblocked."
          : "User has been blocked."
      );
    } catch (error) {
      console.error("Unable to update user:", error);
      alert("Unable to update user.");
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // Category Chart
  // ====================================================

  const categoryChartData = {
    labels: categories.labels || [],

    datasets: [
      {
        label: "Interviews",

        data: categories.data || [],

        backgroundColor: [
          "#3B82F6",
          "#8B5CF6",
          "#06B6D4",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#EC4899",
          "#6366F1",
          "#14B8A6",
          "#F97316",
        ],

        borderColor: [
          "#60A5FA",
          "#A78BFA",
          "#22D3EE",
          "#34D399",
          "#FBBF24",
          "#F87171",
          "#F472B6",
          "#818CF8",
          "#2DD4BF",
          "#FB923C",
        ],

        borderWidth: 1,

        borderRadius: 8,

        borderSkipped: false,

        barPercentage: 0.65,

        categoryPercentage: 0.7,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#020617",

        titleColor: "#ffffff",

        bodyColor: "#CBD5E1",

        borderColor: "#334155",

        borderWidth: 1,

        padding: 12,

        displayColors: true,

        callbacks: {
          label: (context) => {
            return ` ${context.raw} interview${
              context.raw === 1 ? "" : "s"
            }`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#94A3B8",

          font: {
            size: 11,
          },
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,

          color: "#94A3B8",

          font: {
            size: 11,
          },
        },

        grid: {
          color: "rgba(148, 163, 184, 0.08)",
        },
      },
    },
  };

  // ====================================================
  // Score Doughnut
  // ====================================================

  const scoreChartData = {
    labels: scoreDistribution.labels || [],

    datasets: [
      {
        data: scoreDistribution.data || [],

        backgroundColor: [
          "#22C55E",
          "#3B82F6",
          "#F59E0B",
          "#EF4444",
        ],

        hoverBackgroundColor: [
          "#4ADE80",
          "#60A5FA",
          "#FBBF24",
          "#F87171",
        ],

        borderColor: "#0F172A",

        borderWidth: 4,

        hoverOffset: 10,
      },
    ],
  };

  const scoreChartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "68%",

    animation: {
      animateRotate: true,

      animateScale: true,

      duration: 1400,
    },

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#CBD5E1",

          padding: 18,

          usePointStyle: true,

          pointStyle: "circle",

          font: {
            size: 11,
          },
        },
      },

      tooltip: {
        backgroundColor: "#020617",

        titleColor: "#ffffff",

        bodyColor: "#CBD5E1",

        borderColor: "#334155",

        borderWidth: 1,

        padding: 12,

        callbacks: {
          label: function (context) {
            const value = context.raw || 0;

            const total =
              context.dataset.data.reduce(
                (sum, item) =>
                  sum + Number(item || 0),
                0
              );

            const percentage =
              total > 0
                ? Math.round(
                    (value / total) * 100
                  )
                : 0;

            return ` ${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // ====================================================
  // Stats Cards
  // ====================================================

  const stats = [
    {
      title: "Total Users",

      value: dashboard.totalUsers || 0,

      subtitle: "Registered accounts",

      icon: Users,

      iconClass:
        "text-blue-400 bg-blue-500/10",
    },

    {
      title: "Total Interviews",

      value: dashboard.totalInterviews || 0,

      subtitle: "Completed interviews",

      icon: Mic,

      iconClass:
        "text-violet-400 bg-violet-500/10",
    },

    {
      title: "Average Score",

      value: `${dashboard.averageScore || 0}%`,

      subtitle: "Overall performance",

      icon: TrendingUp,

      iconClass:
        "text-emerald-400 bg-emerald-500/10",
    },

    {
      title: "Top Performer",

      value:
        dashboard.topPerformer?.name ||
        "No Data",

      subtitle: `Best score: ${
        dashboard.topPerformer?.score || 0
      }%`,

      icon: Trophy,

      iconClass:
        "text-yellow-400 bg-yellow-500/10",
    },
  ];

  // ====================================================
  // Render
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex items-center justify-between gap-4">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">

                <BarChart3
                  size={23}
                  className="text-white"
                />

              </div>

              <div>

                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  Admin Dashboard
                </h1>

                <div className="flex items-center gap-2">

                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                  <p className="text-xs text-slate-400">
                    AI Interview Platform
                  </p>

                </div>

              </div>

            </div>

            {/* Actions */}

            <div className="flex items-center gap-2">

              <button
                onClick={handleRefresh}
                title="Refresh dashboard"
                className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:rotate-180"
              >
                <RefreshCw size={18} />
              </button>

              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-red-600/10"
              >

                <LogOut size={17} />

                <span className="hidden sm:inline">
                  Logout
                </span>

              </button>

            </div>

          </div>

        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

        {/* Header description */}

        <div className="mb-7 animate-[fadeIn_0.5s_ease-out]">

          <div className="flex items-center justify-between gap-4">

            <div>

              <h2 className="text-2xl sm:text-3xl font-bold">
                Overview
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Monitor users, interviews and candidate
                performance from one place.
              </p>

            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">

              <Activity size={15} />

              Live local data

            </div>

          </div>

        </div>

        {/* ==================================================
            STAT CARDS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-950/20 animate-[fadeUp_0.6s_ease-out]"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >

                {/* Glow */}

                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all duration-500" />

                <div className="relative flex items-start justify-between">

                  <div className="min-w-0">

                    <p className="text-sm text-slate-400">
                      {stat.title}
                    </p>

                    <h2 className="text-2xl font-bold mt-2 truncate">
                      {stat.value}
                    </h2>

                    <p className="text-xs text-slate-500 mt-2">
                      {stat.subtitle}
                    </p>

                  </div>

                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${stat.iconClass}`}
                  >

                    <Icon size={21} />

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* ==================================================
            CHARTS
        ================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-5 mb-7">

          {/* Category Chart */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 animate-[fadeUp_0.7s_ease-out]">

            <div className="flex items-start justify-between mb-5">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">

                    <BarChart3
                      size={18}
                      className="text-blue-400"
                    />

                  </div>

                  <h2 className="text-base sm:text-lg font-bold">
                    Interview Categories
                  </h2>

                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Number of interviews completed by
                  category
                </p>

              </div>

              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">
                All time
              </span>

            </div>

            <div className="h-72">

              {categories.labels?.length > 0 ? (
                <Bar
                  data={categoryChartData}
                  options={categoryChartOptions}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">

                  <BarChart3
                    size={35}
                    className="mb-3 opacity-40"
                  />

                  <p className="text-sm">
                    No interview data available
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* Score Distribution */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 animate-[fadeUp_0.8s_ease-out]">

            <div className="flex items-center gap-3 mb-2">

              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">

                <Award
                  size={18}
                  className="text-violet-400"
                />

              </div>

              <div>

                <h2 className="text-base sm:text-lg font-bold">
                  Score Distribution
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Candidate performance overview
                </p>

              </div>

            </div>

            <div className="h-72">

              {scoreDistribution.data?.some(
                (value) => Number(value) > 0
              ) ? (
                <Doughnut
                  data={scoreChartData}
                  options={scoreChartOptions}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">

                  <Award
                    size={35}
                    className="mb-3 opacity-40"
                  />

                  <p className="text-sm">
                    No score data available
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* ==================================================
            TOP PERFORMER
        ================================================== */}

        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/10 bg-gradient-to-r from-slate-900 to-slate-900/70 p-5 sm:p-6 mb-7 animate-[fadeUp_0.9s_ease-out]">

          <div className="absolute right-0 top-0 w-64 h-32 bg-yellow-500/5 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>

              <div className="flex items-center gap-2 text-yellow-400 mb-2">

                <Trophy size={17} />

                <span className="text-xs font-bold uppercase tracking-wider">
                  Top Performer
                </span>

              </div>

              <h2 className="text-xl font-bold">
                {dashboard.topPerformer?.name ||
                  "No Data"}
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Highest interview score on the
                platform
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">

                <Trophy
                  size={24}
                  className="text-yellow-400"
                />

              </div>

              <div>

                <p className="text-xs text-slate-500">
                  Best Score
                </p>

                <p className="text-2xl font-bold text-yellow-400">
                  {dashboard.topPerformer?.score ||
                    0}
                  %
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            USERS
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden mb-7 animate-[fadeUp_1s_ease-out]">

          {/* Users Header */}

          <div className="p-5 sm:p-6 border-b border-slate-800">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <Users
                    size={19}
                    className="text-blue-400"
                  />

                  <h2 className="text-lg font-bold">
                    Registered Users
                  </h2>

                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
                    {users.length}
                  </span>

                </div>

                <p className="text-xs text-slate-500 mt-1">
                  Manage registered accounts and
                  performance
                </p>

              </div>

              {/* Search */}

              <div className="relative w-full lg:w-80">

                <Search
                  size={17}
                  className="absolute left-3 top-3 text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
                />

              </div>

            </div>

          </div>

          {/* User Table */}

          <div className="overflow-x-auto">

            <table className="w-full text-left min-w-[900px]">

              <thead>

                <tr className="border-b border-slate-800 bg-slate-950/40">

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Email
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Interviews
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Average
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Best
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length > 0 ? (
                  filteredUsers.map(
                    (user, index) => {
                      const scoreColor =
                        getScoreColor(
                          user.average
                        );

                      return (
                        <tr
                          key={user.id}
                          className="border-b border-slate-800/70 hover:bg-slate-800/30 transition-all duration-300 animate-[fadeIn_0.4s_ease-out]"
                          style={{
                            animationDelay: `${
                              index * 50
                            }ms`,
                          }}
                        >

                          {/* User */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700 flex items-center justify-center text-sm font-bold text-blue-300">

                                {getInitials(
                                  user.name
                                )}

                              </div>

                              <div className="min-w-0">

                                <p className="font-semibold truncate max-w-[180px]">
                                  {user.name ||
                                    "Unknown User"}
                                </p>

                                <p className="text-xs text-slate-500">
                                  ID:{" "}
                                  {String(
                                    user.id
                                  ).slice(
                                    0,
                                    12
                                  )}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Email */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm text-slate-400">

                              <Mail
                                size={14}
                                className="text-slate-600"
                              />

                              {user.email ||
                                "No email"}

                            </div>

                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">

                            {user.blocked ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">

                                <Ban size={12} />

                                Blocked

                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">

                                <CheckCircle2
                                  size={12}
                                />

                                Active

                              </span>
                            )}

                          </td>

                          {/* Interviews */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <Mic
                                size={15}
                                className="text-violet-400"
                              />

                              <span className="font-medium">
                                {user.interviews ||
                                  0}
                              </span>

                            </div>

                          </td>

                          {/* Average */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreColor.text} ${scoreColor.bg} ${scoreColor.border}`}
                            >
                              {user.average ||
                                0}
                              %
                            </span>

                          </td>

                          {/* Best */}

                          <td className="px-5 py-4">

                            <span className="font-bold text-white">
                              {user.best || 0}%
                            </span>

                          </td>

                          {/* Actions */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end items-center gap-2">

                              <button
                                onClick={() =>
                                  setSelectedUser(
                                    user
                                  )
                                }
                                title="View details"
                                className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:scale-105 transition-all"
                              >

                                <Eye
                                  size={16}
                                  className="mx-auto"
                                />

                              </button>

                              <button
                                onClick={() =>
                                  handleToggleBlock(
                                    user
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                title={
                                  user.blocked
                                    ? "Unblock user"
                                    : "Block user"
                                }
                                className={`w-9 h-9 rounded-lg border hover:scale-105 transition-all ${
                                  user.blocked
                                    ? "bg-green-500/10 border-green-500/10 text-green-400 hover:bg-green-500/20"
                                    : "bg-yellow-500/10 border-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                                }`}
                              >

                                {user.blocked ? (
                                  <UserCheck
                                    size={16}
                                    className="mx-auto"
                                  />
                                ) : (
                                  <UserX
                                    size={16}
                                    className="mx-auto"
                                  />
                                )}

                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    user
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                title="Delete user"
                                className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all"
                              >

                                <Trash2
                                  size={16}
                                  className="mx-auto"
                                />

                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>

                    <td
                      colSpan="7"
                      className="px-5 py-14 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <Users
                          size={38}
                          className="text-slate-700 mb-3"
                        />

                        <p className="text-sm text-slate-400">
                          No users found
                        </p>

                        <p className="text-xs text-slate-600 mt-1">
                          Try another search term.
                        </p>

                      </div>

                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ==================================================
            RECENT INTERVIEWS
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden animate-[fadeUp_1.1s_ease-out]">

          <div className="p-5 sm:p-6 border-b border-slate-800">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">

                <Mic
                  size={18}
                  className="text-violet-400"
                />

              </div>

              <div>

                <h2 className="text-lg font-bold">
                  Recent Interviews
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Latest completed interviews
                </p>

              </div>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left min-w-[700px]">

              <thead>

                <tr className="border-b border-slate-800 bg-slate-950/40">

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Score
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Completed
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentInterviews.length > 0 ? (
                  recentInterviews.map(
                    (item, index) => {
                      const scoreColor =
                        getScoreColor(
                          item.scorePercentage
                        );

                      return (
                        <tr
                          key={
                            item.id ||
                            `${item.userId}-${index}`
                          }
                          className="border-b border-slate-800/70 hover:bg-slate-800/30 transition"
                        >

                          <td className="px-5 py-4">

                            <p className="font-medium">
                              {item.userName ||
                                "Unknown User"}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              {item.email || ""}
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold">
                              {item.category ||
                                "Unknown"}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreColor.text} ${scoreColor.bg} ${scoreColor.border}`}
                            >
                              {Number(
                                item.scorePercentage ||
                                  0
                              )}
                              %
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm text-slate-400">

                              <Clock
                                size={14}
                                className="text-slate-600"
                              />

                              {formatDate(
                                item.completedAt
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>

                    <td
                      colSpan="4"
                      className="px-5 py-12 text-center text-sm text-slate-500"
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

      {/* ==================================================
          USER DETAILS MODAL
      ================================================== */}

      {selectedUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedUser(null)}
        >

          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 animate-[modalIn_0.3s_ease-out]"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="sticky top-0 z-10 p-5 sm:p-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700 flex items-center justify-center text-lg font-bold text-blue-300">

                    {getInitials(
                      selectedUser.name
                    )}

                  </div>

                  <div>

                    <h2 className="text-xl font-bold">
                      {selectedUser.name ||
                        "Unknown User"}
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                      {selectedUser.email ||
                        "No email"}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    setSelectedUser(null)
                  }
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
                >

                  <X size={18} />

                </button>

              </div>

            </div>

            {/* Modal Body */}

            <div className="p-5 sm:p-6 space-y-5">

              {/* Account Status */}

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">

                      <Shield
                        size={18}
                        className="text-blue-400"
                      />

                    </div>

                    <div>

                      <p className="font-semibold">
                        Account Status
                      </p>

                      <p className="text-xs text-slate-500">
                        Current account access
                      </p>

                    </div>

                  </div>

                  {selectedUser.blocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">

                      <Ban size={13} />

                      Blocked

                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">

                      <CheckCircle2
                        size={13}
                      />

                      Active

                    </span>
                  )}

                </div>

              </div>

              {/* Information Grid */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">

                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">

                    <User size={14} />

                    Name

                  </div>

                  <p className="font-semibold break-words">
                    {selectedUser.name ||
                      "Not available"}
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">

                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">

                    <Mail size={14} />

                    Email

                  </div>

                  <p className="font-semibold text-sm break-all">
                    {selectedUser.email ||
                      "Not available"}
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">

                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">

                    <Calendar size={14} />

                    Joined

                  </div>

                  <p className="font-semibold text-sm">
                    {formatDate(
                      selectedUser.joined
                    )}
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">

                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">

                    <Shield size={14} />

                    User ID

                  </div>

                  <p className="font-semibold text-xs break-all text-slate-300">
                    {selectedUser.id ||
                      "Not available"}
                  </p>

                </div>

              </div>

              {/* Performance */}

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <Activity
                    size={17}
                    className="text-violet-400"
                  />

                  <h3 className="font-bold">
                    Performance
                  </h3>

                </div>

                <div className="grid grid-cols-3 gap-3">

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-center">

                    <Mic
                      size={18}
                      className="mx-auto text-violet-400 mb-2"
                    />

                    <p className="text-xl font-bold">
                      {selectedUser.interviews ||
                        0}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Interviews
                    </p>

                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-center">

                    <TrendingUp
                      size={18}
                      className="mx-auto text-blue-400 mb-2"
                    />

                    <p className="text-xl font-bold">
                      {selectedUser.average ||
                        0}
                      %
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Average
                    </p>

                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-center">

                    <Trophy
                      size={18}
                      className="mx-auto text-yellow-400 mb-2"
                    />

                    <p className="text-xl font-bold">
                      {selectedUser.best || 0}%
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Best
                    </p>

                  </div>

                </div>

              </div>

              {/* Password Notice */}

              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">

                <div className="flex items-start gap-3">

                  <Shield
                    size={18}
                    className="text-yellow-400 mt-0.5 shrink-0"
                  />

                  <div>

                    <p className="text-sm font-semibold text-yellow-300">
                      Password
                    </p>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Passwords are intentionally not
                      displayed in the admin dashboard.
                      Admins should not have access to
                      users' passwords.
                    </p>

                  </div>

                </div>

              </div>

              {/* Actions */}

              <div className="flex flex-col sm:flex-row gap-3 pt-1">

                <button
                  onClick={() =>
                    handleToggleBlock(
                      selectedUser
                    )
                  }
                  disabled={actionLoading}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition ${
                    selectedUser.blocked
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-yellow-600 hover:bg-yellow-500"
                  }`}
                >

                  {selectedUser.blocked ? (
                    <>
                      <UserCheck size={17} />

                      Unblock User
                    </>
                  ) : (
                    <>
                      <UserX size={17} />

                      Block User
                    </>
                  )}

                </button>

                <button
                  onClick={() =>
                    handleDeleteUser(
                      selectedUser
                    )
                  }
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold transition"
                >

                  <Trash2 size={17} />

                  Delete User

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          ANIMATIONS
      ================================================== */}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

    </div>
  );
}

export default Admin;