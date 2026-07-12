import { Trophy, RotateCcw, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { saveInterview } from "../utils/storage";

function Results() {
  const location = useLocation();

  const category = location.state?.category || "HR";
  const score = Math.floor(Math.random() * 21) + 80;

  useEffect(() => {
    saveInterview(category, score);
  }, [category, score]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 w-full max-w-3xl">

        {/* Trophy */}
        <div className="flex justify-center">
          <div className="bg-yellow-500 p-5 rounded-full">
            <Trophy size={45} className="text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-white text-center mt-6">
          Interview Completed 🎉
        </h1>

        <p className="text-gray-400 text-center mt-3">
          Great Job! Here is your interview performance.
        </p>

        {/* Category */}
        <div className="text-center mt-6">
          <span className="bg-blue-600 text-white px-5 py-2 rounded-full capitalize font-semibold">
            {category} Interview
          </span>
        </div>

        {/* Score */}
        <div className="bg-slate-800 rounded-2xl p-8 mt-10 text-center">
          <h2 className="text-gray-400">
            Overall Score
          </h2>

          <h1 className="text-6xl text-green-400 font-bold mt-4">
            {score}%
          </h1>
        </div>

        {/* Ratings */}
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

        {/* Suggestions */}
        <div className="bg-slate-800 rounded-xl p-6 mt-10">

          <h2 className="text-white text-xl font-bold mb-4">
            Suggestions
          </h2>

          <ul className="text-gray-300 space-y-2">
            <li>✔ Speak with confidence.</li>
            <li>✔ Explain your projects with real-life examples.</li>
            <li>✔ Maintain eye contact while answering.</li>
            <li>✔ Keep improving your technical concepts.</li>
          </ul>

        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-5 mt-10">

          <Link to="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-xl text-white flex items-center gap-2">
              <Home size={20} />
              Dashboard
            </button>
          </Link>

          <Link to="/dashboard">
            <button className="bg-green-600 hover:bg-green-700 transition px-8 py-3 rounded-xl text-white flex items-center gap-2">
              <RotateCcw size={20} />
              Practice Again
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Results;