import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import questionsData from "../data/questions";
import {
  ArrowLeft,
  Clock3,
  Mic,
  Square,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

function Interview() {
  const navigate = useNavigate();
  const { category } = useParams();

  const questions =
    questionsData[category] || questionsData.hr;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          navigate("/results", {
            state: {
              category,
            },
          });

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, category]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
    } else {
      navigate("/results", {
        state: {
          category,
        },
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      <div className="flex justify-between items-center">

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white hover:text-blue-400"
        >
          <ArrowLeft size={20} />
          Dashboard
        </button>

        <h1 className="text-3xl font-bold text-white capitalize">
          {category} Interview
        </h1>

        <div className="flex items-center gap-2 text-green-400">
          <Clock3 size={20} />
          {minutes}:{seconds}
        </div>

      </div>

      <div className="mt-10">

        <div className="flex justify-between text-gray-400 mb-2">

          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>

          <span>
            {Math.round(
              ((currentQuestion + 1) / questions.length) * 100
            )}
            %
          </span>

        </div>

        <div className="w-full bg-slate-800 rounded-full h-3">

          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${
                ((currentQuestion + 1) / questions.length) * 100
              }%`,
            }}
          />

        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mt-10">

        <h2 className="text-blue-400 text-xl font-semibold mb-6">
          AI Question
        </h2>

        <p className="text-white text-2xl">
          {questions[currentQuestion]}
        </p>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mt-8">

        <h2 className="text-xl text-white mb-5">
          Your Answer
        </h2>

        <textarea
          rows="8"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full bg-slate-800 rounded-xl p-5 text-white resize-none outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div className="flex justify-between mt-8">

        <div className="flex gap-4">

          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white flex items-center gap-2">
            <Mic size={20} />
            Start Recording
          </button>

          <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-white flex items-center gap-2">
            <Square size={20} />
            Stop
          </button>

        </div>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={nextQuestion}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl text-white flex items-center gap-2"
          >
            <CheckCircle size={20} />
            Finish Interview
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl text-white flex items-center gap-2"
          >
            Next Question
            <ChevronRight size={20} />
          </button>
        )}

      </div>

    </div>
  );
}

export default Interview;