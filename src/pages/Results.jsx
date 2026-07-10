import { Trophy, RotateCcw, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { saveInterview } from "../utils/storage";
  history.push({
    id: Date.now(),
    category,
    score,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  localStorage.setItem("history", JSON.stringify(history));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem("history")) || [];
}

function Results() {
  const location = useLocation();

const category = location.state?.category || "HR";
const score = Math.floor(Math.random() * 21) + 80;
useEffect(() => {
    saveInterview(category, score);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 w-full max-w-3xl">

        <div className="flex justify-center">

          <div className="bg-yellow-500 p-5 rounded-full">
            <Trophy size={45} className="text-white" />
          </div>

        </div>

        <h1 className="text-4xl font-bold text-white text-center mt-6">
          Interview Completed 🎉
        </h1>

        <p className="text-gray-400 text-center mt-3">
          Great Job! Here is your interview performance.
        </p>

        <div className="bg-slate-800 rounded-2xl p-8 mt-10 text-center">

          <h2 className="text-gray-400">
            Overall Score
          </h2>

          <h1 className="text-6xl text-green-400 font-bold mt-4">
            {score}%
          </h1>

        </div>

        <div className="grid grid-cols-3 gap-6 mt-10">

          <div className="bg-slate-800 rounded-xl p-5 text-center">

            <h3 className="text-white font-semibold">
              Communication
            </h3>

            <p className="text-yellow-400 text-2xl mt-2">
              ⭐⭐⭐⭐☆
            </p>

          </div>

          <div className="bg-slate-800 rounded-xl p-5 text-center">

            <h3 className="text-white font-semibold">
              Technical
            </h3>

            <p className="text-yellow-400 text-2xl mt-2">
              ⭐⭐⭐⭐⭐
            </p>

          </div>

          <div className="bg-slate-800 rounded-xl p-5 text-center">

            <h3 className="text-white font-semibold">
              Confidence
            </h3>

            <p className="text-yellow-400 text-2xl mt-2">
              ⭐⭐⭐⭐☆
            </p>

          </div>

        </div>

        <div className="bg-slate-800 rounded-xl p-6 mt-10">

          <h2 className="text-white text-xl font-bold mb-4">
            Suggestions
          </h2>

          <ul className="text-gray-300 space-y-2">
            <li>✔ Speak with confidence.</li>
            <li>✔ Explain your projects with examples.</li>
            <li>✔ Improve technical communication.</li>
          </ul>

        </div>

        <div className="flex justify-center gap-5 mt-10">

          <Link to="/dashboard">

            <button className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-xl text-white flex items-center gap-2">

              <Home />

              Dashboard

            </button>

          </Link>

          <Link to="/interview">

            <button className="bg-green-600 hover:bg-green-700 transition px-8 py-3 rounded-xl text-white flex items-center gap-2">

              <RotateCcw />

              Practice Again

            </button>

          </Link>

        </div>

      </div>

    </div>
  );
}

export default Results;