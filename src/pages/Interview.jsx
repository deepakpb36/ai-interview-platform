import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import questionsData from "../data/questions";
import { evaluateAnswer } from "../utils/evaluateAnswer";
import { saveInterview } from "../utils/storage";

import {
  ArrowLeft,
  Clock3,
  Mic,
  Square,
  ChevronRight,
  CheckCircle,
  Trophy,
  Brain,
  Target,
} from "lucide-react";

function Interview() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { theme } = useTheme();

  const questions =
    questionsData[category] || questionsData.hr;

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  const recognitionRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(900);
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("");
  const [questionScore, setQuestionScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [canProceed, setCanProceed] = useState(false);

  // Submit & Next functions
  function submitAnswer() {
    if (!answer.trim()) {
      setFeedback("Please write your answer before submitting.");
      setFeedbackColor("red");
      setCanProceed(false);
      return;
    }

    const result = evaluateAnswer(
      answer,
      questions[currentQuestion].keywords
    );

    setQuestionScore(result.score);
    setFeedback(result.message);
    setFeedbackColor(result.color);
    setCanProceed(result.canProceed);
  }

  function nextQuestion() {
    const updatedScore = totalScore + questionScore;
    setTotalScore(updatedScore);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
      setFeedback("");
      setFeedbackColor("");
      setQuestionScore(0);
      setCanProceed(false);
      return;
    }

    const finalScore = Math.round(
      (updatedScore / (questions.length * 5)) * 100
    );

    saveInterview(category, finalScore);

    navigate("/results", {
      state: {
        category,
        score: finalScore,
      },
    });
  }

  // Mutable ref of the latest finishInterview logic to avoid stale closure in the timer interval
  const finishInterviewRef = useRef(finishInterview);
  useEffect(() => {
    finishInterviewRef.current = finishInterview;
  });

  function finishInterview() {
    const updatedScore = totalScore + questionScore;
    const finalScore = Math.round(
      (updatedScore / (questions.length * 5)) * 100
    );

    saveInterview(category, finalScore);

    navigate("/results", {
      state: {
        category,
        score: finalScore,
      },
    });
  }

  // Optimized Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishInterviewRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Speech Recognition Setup
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  function startRecording() {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }
    recognitionRef.current.start();
    setIsRecording(true);
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    /* MATCHES HISTORY.JSX LAYOUT FOR PERFECT THEME COMPATIBILITY */
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={20} />
            Dashboard
          </button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white capitalize">
              {category} Interview
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Answer every question carefully.
            </p>
          </div>

          <div
            className={`flex items-center gap-2 text-lg font-bold px-5 py-3 rounded-xl shadow ${
              timeLeft <= 60
                ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 animate-pulse border border-red-500"
                : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border border-transparent dark:border-green-800"
            }`}
          >
            <Clock3 size={22} />
            {minutes}:{seconds}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-slate-800 transition">
            <div className="flex items-center gap-3">
              <Brain className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current Question</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {currentQuestion + 1}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-slate-800 transition">
            <div className="flex items-center gap-3">
              <Target className="text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current Score</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalScore}/{questions.length * 5}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-slate-800 transition">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-500 dark:text-yellow-400" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Progress</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {Math.round(progress)}%
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden transition">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mt-10 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow p-6 md:p-8 transition">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Interview Question</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Read the question carefully before answering.
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-gray-100 dark:bg-slate-800 p-6 transition">
            <p className="text-2xl leading-10 font-medium text-gray-900 dark:text-gray-100">
              {questions[currentQuestion].question}
            </p>
          </div>
        </div>

        {/* Answer Card */}
        <div className="mt-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow p-6 md:p-8 transition">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Answer</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{answer.length} Characters</span>
          </div>
          <textarea
            rows={10}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here or use the microphone to speak..."
            className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-850 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 p-5 resize-none outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Feedback Panel */}
        {feedback && (
          <div
            className={`mt-8 rounded-2xl border p-6 shadow transition ${
              feedbackColor === "green"
                ? "bg-green-100 dark:bg-green-950/40 border-green-500 text-green-700 dark:text-green-400"
                : feedbackColor === "yellow"
                ? "bg-yellow-100 dark:bg-yellow-950/40 border-yellow-500 text-yellow-700 dark:text-yellow-400"
                : feedbackColor === "orange"
                ? "bg-orange-100 dark:bg-orange-950/40 border-orange-500 text-orange-700 dark:text-orange-400"
                : "bg-red-100 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-400"
            }`}
          >
            <h3 className="text-2xl font-bold">Score : {questionScore}/5</h3>
            <p className="mt-3 text-lg">{feedback}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition w-full sm:w-auto ${
                isRecording
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-102 text-white shadow"
              }`}
            >
              <Mic size={20} />
              {isRecording ? "Recording..." : "Start Recording"}
            </button>

            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition w-full sm:w-auto ${
                !isRecording
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-red-600 hover:bg-red-700 hover:scale-102 text-white shadow"
              }`}
            >
              <Square size={20} />
              Stop
            </button>
          </div>

          <div className="flex flex-wrap gap-4 justify-end w-full md:w-auto">
            {!canProceed && (
              <button
                onClick={submitAnswer}
                disabled={!answer.trim()}
                className={`px-8 py-3 rounded-xl font-semibold transition w-full sm:w-auto ${
                  answer.trim()
                    ? "bg-yellow-500 hover:bg-yellow-600 hover:scale-102 text-black shadow"
                    : "bg-gray-400 cursor-not-allowed text-white"
                }`}
              >
                Submit Answer
              </button>
            )}

            {canProceed && currentQuestion !== questions.length - 1 && (
              <button
                onClick={nextQuestion}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-102 transition text-white shadow w-full sm:w-auto"
              >
                Next Question
                <ChevronRight size={20} />
              </button>
            )}

            {canProceed && currentQuestion === questions.length - 1 && (
              <button
                onClick={finishInterview}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-102 transition text-white shadow w-full sm:w-auto"
              >
                <CheckCircle size={20} />
                Finish Interview
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Interview;