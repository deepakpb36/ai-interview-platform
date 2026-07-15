import { Link, useNavigate } from "react-router-dom";
import { Trash2, RotateCcw, ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getHistory,
  deleteInterview,
  clearHistory,
} from "../utils/storage";

function History() {
  const navigate = useNavigate();

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

  const handleDelete = (id) => {
    deleteInterview(id);
    window.location.reload();
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all interview history?")) {
      clearHistory();
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Interview History
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mt-2">
                View all your completed interviews.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <ArrowLeft size={20} />
              Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow">
              <h2 className="text-gray-600 dark:text-gray-400">
                Total Interviews
              </h2>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                {totalInterviews}
              </h1>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow">
              <h2 className="text-gray-600 dark:text-gray-400">
                Average Score
              </h2>

              <h1 className="text-4xl font-bold text-green-500 mt-2">
                {averageScore}%
              </h1>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow">
              <h2 className="text-gray-600 dark:text-gray-400">
                Best Score
              </h2>

              <h1 className="text-4xl font-bold text-yellow-500 mt-2">
                {bestScore}%
              </h1>
            </div>
          </div>

          {/* History */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl mt-10 p-6 shadow">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Interviews
              </h2>

              {history.length > 0 && (
                <button
                  onClick={handleClear}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                >
                  Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl text-gray-700 dark:text-gray-300">
                  No Interview History
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Complete your first interview to see it here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400">
                      <th className="text-left py-3">Category</th>
                      <th className="text-left py-3">Score</th>
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Time</th>
                      <th className="text-left py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history
                      .slice()
                      .reverse()
                      .map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                        >
                          <td className="py-5 text-gray-900 dark:text-white capitalize">
                            {item.category}
                          </td>

                          <td className="text-green-500 font-semibold">
                            {item.score}%
                          </td>

                          <td className="text-gray-700 dark:text-gray-300">
                            {item.date}
                          </td>

                          <td className="text-gray-700 dark:text-gray-300">
                            {item.time}
                          </td>

                          <td>
                            <div className="flex gap-3">
                              <button
                                onClick={() =>
                                  navigate(`/interview/${item.category}`)
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                              >
                                <RotateCcw size={16} />
                                Practice
                              </button>

                              <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;