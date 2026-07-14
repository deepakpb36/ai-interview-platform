import { Link } from "react-router-dom";
import { getHistory } from "../utils/storage";

function RecentInterviews() {
  const interviews = getHistory().slice().reverse().slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-all duration-300">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Interviews
        </h2>

        <Link
          to="/history"
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          View All
        </Link>

      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-5xl mb-3">📋</p>

          <p className="text-gray-600 dark:text-gray-400">
            No interviews completed yet.
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Start your first interview to see your progress.
          </p>
        </div>
      ) : (
        <table className="w-full">

          <thead>

            <tr className="text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">

              <th className="text-left pb-3">Category</th>

              <th className="text-left">Score</th>

              <th className="text-left">Date</th>

              <th className="text-left">Time</th>

              <th className="text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            {interviews.map((item) => (

              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >

                <td className="py-4 text-gray-900 dark:text-white capitalize">
                  {item.category}
                </td>

                <td className="text-blue-600 dark:text-blue-400 font-semibold">
                  {item.score}%
                </td>

                <td className="text-gray-700 dark:text-gray-300">
                  {item.date}
                </td>

                <td className="text-gray-700 dark:text-gray-300">
                  {item.time}
                </td>

                <td>
                  <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                    Completed
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}

export default RecentInterviews;