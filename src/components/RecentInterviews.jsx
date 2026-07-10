function RecentInterviews() {
  const interviews = [
    {
      title: "Frontend React",
      category: "Frontend",
      score: "92%",
      status: "Completed",
    },
    {
      title: "Java OOP",
      category: "Java",
      score: "85%",
      status: "Completed",
    },
    {
      title: "Python Basics",
      category: "Python",
      score: "78%",
      status: "Pending",
    },
    {
      title: "HR Interview",
      category: "HR",
      score: "90%",
      status: "Completed",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-bold">
          Recent Interviews
        </h2>

        <button className="text-blue-500 hover:text-blue-400">
          View All
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-gray-400 border-b border-slate-700">
            <th className="text-left pb-3">Interview</th>
            <th className="text-left">Category</th>
            <th className="text-left">Score</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {interviews.map((item, index) => (
            <tr
              key={index}
              className="border-b border-slate-800 hover:bg-slate-800"
            >
              <td className="py-4 text-white">{item.title}</td>

              <td className="text-gray-300">
                {item.category}
              </td>

              <td className="text-blue-400 font-semibold">
                {item.score}
              </td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === "Completed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentInterviews;