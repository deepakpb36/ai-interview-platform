import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Mic,
  Square,
} from "lucide-react";

import { questionsByCategory } from "../data/questions";

import {
  evaluateAnswer,
} from "../utils/evaluateAnswer";

import {
  saveInterview,
} from "../utils/storage";

import {
  getFirestore,
  collection,
  addDoc,
} from "firebase/firestore";

import {
  getAuth,
} from "firebase/auth";


function Interview() {

  const navigate = useNavigate();

  const { category = "html" } = useParams();


  // ==========================
  // Questions Setup
  // ==========================

  const QUESTIONS_PER_INTERVIEW = 10;


  const questionsList = useMemo(() => {

    const allQuestions =
      questionsByCategory[
      category.toLowerCase()
      ] ||
      questionsByCategory.html;


    const shuffled =
      [...allQuestions].sort(
        () => Math.random() - 0.5
      );


    return shuffled.slice(
      0,
      Math.min(
        QUESTIONS_PER_INTERVIEW,
        shuffled.length
      )
    );


  }, [category]);



  // ==========================
  // States
  // ==========================

  const [currentIdx, setCurrentIdx] =
    useState(0);


  const [answer, setAnswer] =
    useState("");


  const [evaluation, setEvaluation] =
    useState(null);


  const [isRecording, setIsRecording] =
    useState(false);


  const [passedCount, setPassedCount] =
    useState(0);


  const [skippedCount, setSkippedCount] =
    useState(0);


  const [isFinished, setIsFinished] =
    useState(false);



  const recognitionRef =
    useRef(null);



  const currentQuestionObj =
    questionsList[currentIdx];



  const db =
    getFirestore();


  const auth =
    getAuth();

  // ==========================
  // Speech Recognition
  // ==========================

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }


    const recognition =
      new SpeechRecognition();


    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";


    recognition.onresult = (event) => {

      const transcript =
        event.results[
          event.results.length - 1
        ][0].transcript;


      setAnswer((previous) =>
        previous
          ? `${previous} ${transcript}`
          : transcript
      );

    };



    recognition.onend = () => {

      setIsRecording(false);

    };



    recognition.onerror = () => {

      setIsRecording(false);

    };



    recognitionRef.current =
      recognition;



    return () => {

      if (recognitionRef.current) {

        recognitionRef.current.stop();

      }

    };


  }, []);



  // ==========================
  // Recording Controls
  // ==========================

  const startRecording = () => {

    if (!recognitionRef.current) {

      alert(
        "Speech Recognition is not supported in this browser."
      );

      return;

    }


    try {

      recognitionRef.current.start();

      setIsRecording(true);

    }

    catch (error) {

      console.log(
        "Recording Error:",
        error
      );

    }

  };



  const stopRecording = () => {

    if (!recognitionRef.current) {
      return;
    }


    recognitionRef.current.stop();

    setIsRecording(false);

  };



  // ==========================
  // Evaluate Answer
  // ==========================

  const handleEvaluateAnswer = () => {

    if (!answer.trim()) {

      alert(
        "Please enter or record an answer first!"
      );

      return;

    }


    const result =
      evaluateAnswer(
        answer,
        currentQuestionObj.keywords
      );


    setEvaluation(result);

  };



  // ==========================
  // Save Interview History
  // ==========================

  const saveInterviewToHistory = async (
    finalSkipped,
    finalPassed
  ) => {

    if (isFinished) {
      return;
    }


    setIsFinished(true);


    const totalQuestions =
      questionsList.length;


    const score =
      Math.round(
        (finalPassed / totalQuestions) * 100
      );


    saveInterview(
      category,
      score
    );


    const user =
      auth.currentUser;


    if (!user) {
      return;
    }



    try {

      await addDoc(

        collection(
          db,
          "users",
          user.uid,
          "history"
        ),

        {

          category,

          score,

          totalQuestions,

          passedQuestions:
            finalPassed,

          skippedQuestions:
            finalSkipped,

          completedAt:
            new Date().toISOString(),

          status:
            "Completed",

        }

      );

    }

    catch (error) {

      console.log(
        "Firebase History Error:",
        error
      );

    }

  };
  // ==========================
  // Next Question
  // ==========================

  const handleNextQuestion = async () => {


    let updatedPassed =
      passedCount;



    if (evaluation?.passed) {

      updatedPassed =
        passedCount + 1;


      setPassedCount(
        updatedPassed
      );

    }



    if (
      currentIdx <
      questionsList.length - 1
    ) {


      setCurrentIdx(
        (previous) =>
          previous + 1
      );


      setAnswer("");

      setEvaluation(null);


      return;

    }



    const finalScore =
      Math.round(
        (
          updatedPassed /
          questionsList.length
        ) * 100
      );



    await saveInterviewToHistory(

      skippedCount,

      updatedPassed

    );



    navigate(
      "/results",
      {

        state: {

          category,

          score:
            finalScore,

        },

      }

    );


  };



  // ==========================
  // Skip Question
  // ==========================

  const handleSkipQuestion = async () => {


    const updatedSkipped =
      skippedCount + 1;



    setSkippedCount(
      updatedSkipped
    );



    if (
      currentIdx <
      questionsList.length - 1
    ) {


      setCurrentIdx(
        (previous) =>
          previous + 1
      );


      setAnswer("");

      setEvaluation(null);


      return;

    }



    const finalScore =
      Math.round(
        (
          passedCount /
          questionsList.length
        ) * 100
      );



    await saveInterviewToHistory(

      updatedSkipped,

      passedCount

    );



    navigate(
      "/results",
      {

        state: {

          category,

          score:
            finalScore,

        },

      }

    );


  };



  // ==========================
  // Progress Calculation
  // ==========================

  const progressPercent =
    Math.round(

      (
        (currentIdx + 1) /
        questionsList.length
      ) * 100

    );



  return (

    <div
      className="
      min-h-screen
      bg-gray-100
      dark:bg-slate-950
      transition-colors
      duration-300
      py-8
      px-4
      "
    >

      <div
        className="
        max-w-5xl
        mx-auto
        "
      >


        {/* Header */}

        <div
          className="
          flex
          flex-col
          md:flex-row
          justify-between
          md:items-center
          gap-4
          mb-8
          "
        >

          <div>

            <p
              className="
              text-sm
              uppercase
              tracking-widest
              font-semibold
              text-blue-600
              "
            >
              AI Interview Platform
            </p>


            <h1
              className="
              text-3xl
              font-bold
              text-gray-900
              dark:text-white
              mt-2
              "
            >

              {category.toUpperCase()} Interview

            </h1>


            <p
              className="
              mt-2
              text-gray-500
              dark:text-gray-400
              "
            >

              Question {currentIdx + 1} of {questionsList.length}

            </p>

          </div>



          <button

            onClick={() =>
              navigate("/dashboard")
            }

            className="
            bg-red-500
            hover:bg-red-600
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            transition
            "

          >

            Quit Interview

          </button>


        </div>
        {/* Progress Bar */}

        <div className="mb-8">

          <div
            className="
            flex
            justify-between
            mb-2
            text-sm
            "
          >

            <span
              className="
              font-medium
              text-gray-700
              dark:text-gray-300
              "
            >

              Progress

            </span>

            <span
              className="
              font-bold
              text-blue-600
              "
            >

              {progressPercent}%

            </span>

          </div>

          <div
            className="
            w-full
            h-3
            rounded-full
            overflow-hidden
            bg-gray-200
            dark:bg-slate-800
            "
          >

            <div

              className="
              h-full
              bg-gradient-to-r
              from-blue-500
              to-indigo-600
              transition-all
              duration-500
              "

              style={{
                width: `${progressPercent}%`,
              }}

            />

          </div>

        </div>



        {/* Question Card */}

        <div
          className="
          bg-white
          dark:bg-slate-900
          border
          border-gray-200
          dark:border-slate-800
          rounded-3xl
          shadow-lg
          p-6
          lg:p-8
          "
        >

          <h2
            className="
            text-2xl
            font-bold
            text-gray-900
            dark:text-white
            leading-relaxed
            "
          >

            {currentQuestionObj?.question}

          </h2>

        </div>



        {/* Answer Input */}

        <div className="mt-8">

          <textarea

            value={answer}

            onChange={(e) =>
              setAnswer(e.target.value)
            }

            disabled={
              evaluation !== null
            }

            placeholder="
            Type your answer here or use microphone...
            "

            className="
            w-full
            h-52
            resize-none
            rounded-2xl
            border
            border-gray-300
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            text-gray-900
            dark:text-white
            p-5
            outline-none
            focus:ring-2
            focus:ring-blue-500
            "

          />

        </div>



        {/* Action Buttons */}

        {!evaluation && (

          <div
            className="
            flex
            flex-col
            sm:flex-row
            gap-4
            mt-6
            "
          >

            <button

              onClick={
                isRecording
                  ? stopRecording
                  : startRecording
              }

              className={`

              flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-xl
              text-white
              font-semibold
              transition

              ${isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
                }

              `}

            >

              {
                isRecording
                  ?
                  <>
                    <Square size={18} />
                    Stop Recording
                  </>
                  :
                  <>
                    <Mic size={18} />
                    Start Recording
                  </>
              }

            </button>

            <button

              onClick={handleSkipQuestion}

              className="
              px-6
              py-3
              rounded-xl
              bg-gray-200
              hover:bg-gray-300
              dark:bg-slate-800
              dark:hover:bg-slate-700
              font-semibold
              transition
              "

            >

              Skip Question

            </button>

            <button

              onClick={handleEvaluateAnswer}

              className="
              px-6
              py-3
              rounded-xl
              bg-yellow-500
              hover:bg-yellow-600
              text-white
              font-semibold
              transition
              "

            >

              Evaluate Answer

            </button>

          </div>

        )}



        {/* Evaluation Result */}

        {evaluation && (

          <div
            className="
            mt-8
            bg-white
            dark:bg-slate-900
            border
            border-gray-200
            dark:border-slate-800
            rounded-3xl
            shadow-lg
            p-6
            lg:p-8
            "
          >

            <div
              className="
              flex
              flex-col
              sm:flex-row
              justify-between
              gap-6
              "
            >

              <div>

                <h2
                  className={`

                  text-2xl
                  font-bold

                  ${evaluation.passed
                      ? "text-green-600"
                      : "text-red-600"
                    }

                  `}
                >

                  {
                    evaluation.passed
                      ? "✅ Answer Approved"
                      : "❌ Needs Improvement"
                  }

                </h2>

                <p
                  className="
                  mt-2
                  text-gray-600
                  dark:text-gray-400
                  "
                >

                  AI Evaluation Result

                </p>

              </div>

              <div
                className="
                text-right
                "
              >

                <p
                  className="
                  text-sm
                  text-gray-500
                  "
                >

                  Score

                </p>

                <h3
                  className="
                  text-3xl
                  font-bold
                  text-blue-600
                  "
                >

                  {evaluation.marks}/5

                </h3>

              </div>

            </div>

            <div
              className="
              flex
              gap-2
              mt-6
              text-3xl
              "
            >

              {[1, 2, 3, 4, 5].map((star) => (

                <span

                  key={star}

                  className={
                    star <= evaluation.marks
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }

                >

                  ★

                </span>

              ))}

            </div>

            <div className="mt-6">

              <h3
                className="
                font-semibold
                text-lg
                text-gray-900
                dark:text-white
                "
              >

                Feedback

              </h3>

              <p
                className="
                mt-2
                text-gray-600
                dark:text-gray-400
                leading-7
                "
              >

                {evaluation.message}

              </p>

            </div>

            <div
              className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
              mt-8
              "
            >

              <div
                className="
                bg-blue-50
                dark:bg-slate-800
                rounded-xl
                p-5
                text-center
                "
              >

                <p className="text-gray-500">
                  Passed
                </p>

                <h2
                  className="
                  text-3xl
                  font-bold
                  text-green-600
                  mt-2
                  "
                >

                  {passedCount}

                </h2>

              </div>

              <div
                className="
                bg-blue-50
                dark:bg-slate-800
                rounded-xl
                p-5
                text-center
                "
              >

                <p className="text-gray-500">
                  Skipped
                </p>

                <h2
                  className="
                  text-3xl
                  font-bold
                  text-orange-500
                  mt-2
                  "
                >

                  {skippedCount}

                </h2>

              </div>

            </div>

            <button

              disabled={isFinished}

              onClick={handleNextQuestion}

              className={`

              w-full
              mt-8
              py-4
              rounded-2xl
              text-white
              font-bold
              text-lg
              transition

              ${isFinished
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }

              `}

            >

              {
                currentIdx === questionsList.length - 1
                  ? "Finish Interview"
                  : "Next Question"
              }

            </button>

          </div>

        )}

      </div>

    </div>

  );

}

export default Interview;