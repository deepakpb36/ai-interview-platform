import { getHistory } from "../utils/storage";

function InterviewHistory() {
  const history = getHistory().reverse();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-10">

      <h2 className="text-2xl font-bold text-white mb-6">
        Interview History
      </h2>

      {history.length === 0 ? (
        <div className="text-center py-10">

          <p className="text-gray-400 text-lg">
            No interviews yet.
          </p>

          <p className="text-gray-500 mt-2">
            Complete your first interview to see history here.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {history.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 rounded-xl p-5 flex justify-between items-center hover:bg-slate-700 transition"
            >

              <div>

                <h3 className="text-white text-lg font-semibold capitalize">
                  {item.category}
                </h3>

                <p className="text-gray-400 text-sm">
                  {item.date} • {item.time}
                </p>

              </div>

              <div className="text-right">

                <p className="text-green-400 text-2xl font-bold">
                  {item.score}%
                </p>

                <p className="text-gray-400 text-sm">
                  Score
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default InterviewHistory;