import { useState, useEffect } from "react";
import { Mic, Square, CheckCircle, AlertCircle } from "lucide-react";
import { validateAnswer } from "../data/questions";

function QuestionCard({ 
  questionObj = { id: 1, question: "What is HTML?", keywords: ["html", "markup", "elements", "tags", "web", "structure"] }, 
  questionNumber = 1, 
  totalQuestions = 5,
  onSubmitAnswer 
}) {
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Extract question string from prop (handles both object and string formats gracefully)
  const questionText = typeof questionObj === "string" ? questionObj : questionObj?.question || "What is HTML?";

  // Initialize Web Speech API for voice recording
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = "en-US";

      recog.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer((prev) => (prev ? prev + " " + transcript : transcript));
        setErrorMessage(""); // Clear error when recording new input
      };

      recog.onerror = (err) => {
        console.error("Speech recognition error", err);
        setIsRecording(false);
      };

      setRecognition(recog);
    }
  }, []);

  // Handle Recording Toggle
  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      setIsRecording(false);
      recognition.stop();
    }
  };

  // Auto-Save feature
  useEffect(() => {
    const isAutoSaveEnabled = JSON.parse(localStorage.getItem("autoSaveAnswers") ?? "true");
    if (isAutoSaveEnabled && answer.trim().length > 0) {
      const timer = setTimeout(() => {
        localStorage.setItem(`saved_answer_q${questionNumber}`, answer);
      }, 1000); // Debounce auto-saves by 1 second

      return () => clearTimeout(timer);
    }
  }, [answer, questionNumber]);

  // Load saved answer on mount or question change
  useEffect(() => {
    const saved = localStorage.getItem(`saved_answer_q${questionNumber}`);
    if (saved) {
      setAnswer(saved);
    } else {
      setAnswer("");
    }
    setErrorMessage(""); // Reset error state on new question
  }, [questionNumber]);

  // Handle Submit with Keyword and Gibberish Validation
  const handleSubmit = () => {
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      setErrorMessage("Please write or record an answer before submitting.");
      return;
    }

    // Validate using the helper function against question keywords
    const isValid = validateAnswer(trimmedAnswer, questionObj);

    if (!isValid) {
      setErrorMessage(
        "Invalid answer! Please explain the concept using relevant terms. Numeric values (e.g. 1234), random characters (e.g. gudueu), or off-topic responses are not accepted."
      );
      return;
    }

    // Clear error message if validation succeeds
    setErrorMessage("");

    if (onSubmitAnswer) {
      onSubmitAnswer(trimmedAnswer);
    }
  };

  // Calculate Progress Percentage
  const progressPercentage = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Progress Header */}
      <div className="flex justify-between items-center text-sm font-semibold text-gray-600 dark:text-gray-400">
        <span>Question {questionNumber} of {totalQuestions}</span>
        <span>{progressPercentage}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Question Panel */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/50 rounded-xl">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              AI Interview Question
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Read the question carefully and explain using core technical concepts.
            </p>
          </div>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          {questionText}
        </h3>
      </div>

      {/* Answer Panel */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-950 dark:text-white">
            Your Answer
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {answer.length} Characters
          </span>
        </div>

        {/* Input Text Area */}
        <textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="Type your answer here or use the voice recorder below..."
          className="w-full h-48 p-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none font-medium text-base"
        />

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 text-sm">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Answer Validation Failed</p>
              <p className="mt-0.5 text-xs opacity-90">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          
          {/* Audio controls */}
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm shadow-md shadow-blue-500/10"
              >
                <Mic size={18} />
                Start Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm animate-pulse shadow-md shadow-red-500/10"
              >
                <Square size={18} />
                Stop
              </button>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-gray-950 font-bold py-2.5 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm shadow-md shadow-amber-500/10"
          >
            <CheckCircle size={18} />
            Submit Answer
          </button>

        </div>
      </div>

    </div>
  );
}

export default QuestionCard;