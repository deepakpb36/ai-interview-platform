import { useState, useEffect, useRef } from "react";
import { Mic, Square, AlertCircle, Sparkles, LogOut, SkipForward, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import INTERVIEW_QUESTIONS from "../data/questions"; // Importing default export directly
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Interview() {
  const navigate = useNavigate();
  const { category = "html" } = useParams(); 
  const questionsList = INTERVIEW_QUESTIONS[category.toLowerCase()] || INTERVIEW_QUESTIONS["html"];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [evaluation, setEvaluation] = useState(null); 
  const recognitionRef = useRef(null);
  
  // Track metrics for dynamic results history
  const [skippedCount, setSkippedCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [totalScorePercentage, setTotalScorePercentage] = useState(0);

  const audioCtxRef = useRef(null);
  const currentQuestionObj = questionsList[currentIdx];

  const db = getFirestore();
  const auth = getAuth();

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = false;
      recog.lang = "en-US";

      recog.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setAnswer((prev) => (prev ? `${prev.trim()} ${transcript}` : transcript));
      };

      recog.onerror = (err) => {
        console.error("Speech recognition error:", err);
        setIsRecording(false);
      };

      recog.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Interaction Sound Feedback
  const playInteractionSound = (type) => {
    const soundEnabled = JSON.parse(localStorage.getItem("soundEffects") ?? "true");
    if (!soundEnabled) return;

    try {
      const audioCtx = initAudioContext();
      let osc = audioCtx.createOscillator();
      let gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); 
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === "fail") {
        osc.frequency.setValueAtTime(330, audioCtx.currentTime); 
        osc.frequency.setValueAtTime(220, audioCtx.currentTime + 0.15); 
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === "click") {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch (e) {
      console.warn("Audio Context blocked: ", e);
    }
  };

  // Save Mock Session to Firebase Firestore
  const saveInterviewToHistory = async (finalSkippedCount, finalPassedCount) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const totalQs = questionsList.length;
      // Use the live aggregated matching score percentages
      const calculatedScore = Math.min(100, Math.round((finalPassedCount / totalQs) * 100));

      await addDoc(collection(db, "users", user.uid, "history"), {
        category: category,
        completedAt: new Date().toISOString(),
        totalQuestions: totalQs,
        skippedQuestions: finalSkippedCount,
        scorePercentage: calculatedScore,
        status: "Completed"
      });
      console.log("Session saved to Firestore successfully!");
    } catch (error) {
      console.error("Error writing history to database: ", error);
    }
  };

  // Auto-load drafts
  useEffect(() => {
    const saved = localStorage.getItem(`saved_answer_${category}_q_${currentIdx}`);
    setAnswer(saved || "");
    setEvaluation(null);
  }, [currentIdx, category]);

  // Debounce Auto-save
  useEffect(() => {
    const isAutoSaveEnabled = JSON.parse(localStorage.getItem("autoSaveAnswers") ?? "true");
    if (!isAutoSaveEnabled || !answer.trim() || evaluation) return;

    const saveTimer = setTimeout(() => {
      localStorage.setItem(`saved_answer_${category}_q_${currentIdx}`, answer);
    }, 800);

    return () => clearTimeout(saveTimer);
  }, [answer, currentIdx, category, evaluation]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    initAudioContext();
    playInteractionSound("click");
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      initAudioContext();
      playInteractionSound("click");
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Evaluate matching keywords and award 1-5 marks credit
  const handleEvaluateAnswer = () => {
    const cleanAnswer = answer.trim();

    if (!cleanAnswer) {
      alert("Please enter or record an answer first!");
      return;
    }

    // 1. GIBBERISH / SPAM DETECTION GUARD
    const nonLetters = cleanAnswer.replace(/[a-zA-Z\s]/g, "").length;
    const spamRatio = nonLetters / cleanAnswer.length;
    const words = cleanAnswer.split(/\s+/);
    const hasImpossiblyLongWord = words.some(word => word.length > 25);

    if (spamRatio > 0.4 || hasImpossiblyLongWord || cleanAnswer.length < 8) {
      initAudioContext();
      playInteractionSound("fail");
      
      setEvaluation({
        passed: false,
        percentage: 0,
        marks: 0, // 0 marks for invalid input
        matchedKeywords: [],
        missingKeywords: currentQuestionObj.keywords,
        isSpamDetected: true
      });
      return;
    }

    // 2. CORE KEYWORD MATCHING
    initAudioContext();
    const userAnswerLower = cleanAnswer.toLowerCase();
    const targetKeywords = currentQuestionObj.keywords;

    // Check keywords (supporting multiple word substrings)
    const matched = targetKeywords.filter((kw) => {
      const regex = new RegExp(`\\b${kw.toLowerCase()}\\b|${kw.toLowerCase()}`, "g");
      return regex.test(userAnswerLower);
    });

    const matchPercentage = Math.round((matched.length / targetKeywords.length) * 100);
    
    // 3. SCALE OUT OF 5 MARKS
    let marksAwarded = 1;
    if (matchPercentage >= 80) {
      marksAwarded = 5;
    } else if (matchPercentage >= 60) {
      marksAwarded = 4;
    } else if (matchPercentage >= 40) {
      marksAwarded = 3;
    } else if (matchPercentage >= 20) {
      marksAwarded = 2;
    } else {
      marksAwarded = 1;
    }

    const passed = marksAwarded >= 3;
    playInteractionSound(passed ? "success" : "fail");

    if (passed) {
      setPassedCount((prev) => prev + 1);
    }

    setEvaluation({
      passed,
      percentage: matchPercentage,
      marks: marksAwarded,
      matchedKeywords: matched,
      missingKeywords: targetKeywords.filter((kw) => !matched.includes(kw)),
      isSpamDetected: false
    });
  };

  // Handle standard progression steps asynchronously
  const handleNextQuestion = async () => {
    localStorage.removeItem(`saved_answer_${category}_q_${currentIdx}`);

    if (currentIdx < questionsList.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      try {
        await saveInterviewToHistory(skippedCount, passedCount);
      } catch (err) {
        console.error("Failed to write to database on complete step:", err);
      } finally {
        alert("Interview Completed Successfully!");
        navigate("/dashboard");
      }
    }
  };

  // Handle skipping step asynchronously
  const handleSkipQuestion = async () => {
    initAudioContext();
    playInteractionSound("click");

    localStorage.removeItem(`saved_answer_${category}_q_${currentIdx}`);
    const updatedSkipped = skippedCount + 1;
    setSkippedCount(updatedSkipped);

    if (currentIdx < questionsList.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      try {
        await saveInterviewToHistory(updatedSkipped, passedCount);
      } catch (err) {
        console.error("Failed to write skip to database on complete step:", err);
      } finally {
        alert("Interview Completed! Your results have been saved to history.");
        navigate("/dashboard");
      }
    }
  };

  const progressPercent = Math.round(((currentIdx + 1) / questionsList.length) * 100);

  return (
    <div className="bg-gray-100 dark:bg-slate-950 min-h-screen w-screen overflow-y-auto flex flex-col justify-center items-center p-6 md:p-12 transition-colors duration-300">
      
      {/* Immersive Top Control bar */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          🔴 Live Mock Room : {category}
        </span>
        <button
          type="button"
          onClick={() => {
            if (confirm("Are you sure you want to quit? Progress will be lost.")) {
              navigate("/dashboard");
            }
          }}
          className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:opacity-80 transition-opacity font-bold text-sm"
        >
          <LogOut size={16} />
          Quit Room
        </button>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Progress Tracker */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold text-gray-600 dark:text-gray-400">
            <span>Question {currentIdx + 1} of {questionsList.length}</span>
            <span>{progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/60 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Active Assessment
              </h2>
            </div>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2 leading-relaxed font-sans">
            {currentQuestionObj?.question}
          </h3>
        </div>

        {/* Writing Response Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Transcript</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
              {answer.length} Characters
            </span>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={evaluation !== null}
            placeholder="Type your response here or use 'Start Recording'..."
            className="w-full h-56 p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 transition-all duration-300 resize-none text-base font-medium leading-relaxed"
          />

          {!evaluation ? (
            <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
              <div className="flex gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-md"
                  >
                    <Mic size={18} />
                    Start Recording
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-sm animate-pulse shadow-md"
                  >
                    <Square size={18} />
                    Stop
                  </button>
                )}

                {/* Skip Button */}
                <button
                  type="button"
                  onClick={handleSkipQuestion}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 font-semibold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-sm border border-gray-200 dark:border-slate-750"
                >
                  <SkipForward size={16} />
                  Skip Question
                </button>
              </div>

              <button
                type="button"
                onClick={handleEvaluateAnswer}
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-gray-950 font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 text-sm shadow-md shadow-amber-500/10"
              >
                <Sparkles size={18} />
                Evaluate Answer
              </button>
            </div>
          ) : null}
        </div>

        {/* AI Feedback Overlay featuring 1-5 Marks Credit Evaluation */}
        {evaluation && (
          <div className={`p-8 rounded-2xl border transition-all duration-300 ${
            evaluation.passed
              ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40"
              : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40"
          }`}>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className={`text-2xl font-bold flex items-center gap-2 ${
                  evaluation.passed ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                }`}>
                  {evaluation.isSpamDetected 
                    ? "⚠ Invalid Answer Format" 
                    : evaluation.passed 
                      ? "✓ Answer Approved" 
                      : "✗ Needs Technical Terms"
                  }
                </h4>
                {!evaluation.isSpamDetected && (
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
                    Keyword Similarity Match: {evaluation.percentage}%
                  </p>
                )}
              </div>

              {/* Dynamic 1-5 Star Marks Badge */}
              {!evaluation.isSpamDetected && (
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-sm self-start md:self-auto">
                  <span className="text-xs text-gray-500 font-bold uppercase">Credit:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`text-lg font-bold ${
                          star <= evaluation.marks 
                            ? "text-amber-500" 
                            : "text-gray-300 dark:text-gray-750"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-extrabold text-gray-800 dark:text-white ml-1">
                    {evaluation.marks}/5
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
              {evaluation.isSpamDetected 
                ? "The evaluation engine detected random numbers, keyboard spam, or unstructured expressions. Please provide a real English response."
                : evaluation.marks === 5
                  ? "Outstanding attempt! Your solution hit nearly every technical keyword target perfectly."
                  : evaluation.marks === 4
                    ? "Excellent! Your answer details most of the target concepts perfectly."
                    : evaluation.marks === 3
                      ? "Passed. You hit enough keywords to construct a valid response, but could write more detail."
                      : "This explanation is sparse. Look at the missing keywords below to see what terms your explanation omitted."
              }
            </p>

            {/* Keyword breakdown */}
            {!evaluation.isSpamDetected && (
              <>
                <div className="mt-5 flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Recognized Terms:</span>
                  {evaluation.matchedKeywords.length > 0 ? (
                    evaluation.matchedKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-lg">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">None matched</span>
                  )}
                </div>

                {evaluation.missingKeywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Missed Recommendations:</span>
                    {evaluation.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 text-xs font-bold bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-lg">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="bg-gray-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 text-sm shadow-md"
              >
                Next Question
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Interview;