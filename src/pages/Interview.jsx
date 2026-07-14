import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
} from "lucide-react";


function Interview() {

  const navigate = useNavigate();
  const { category } = useParams();

  const questions =
    questionsData[category] || questionsData.hr;


  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");

  const [timeLeft, setTimeLeft] = useState(900);

  const [feedback, setFeedback] = useState("");

  const [feedbackColor, setFeedbackColor] = useState("");

  const [questionScore, setQuestionScore] = useState(0);

  const [totalScore, setTotalScore] = useState(0);

  const [canProceed, setCanProceed] = useState(false);


  // Timer

  useEffect(() => {

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          clearInterval(timer);


          const finalScore = Math.round(
            (totalScore / (questions.length * 5)) * 100
          );


          saveInterview(category, finalScore);


          navigate("/results", {
            state: {
              category,
              score: finalScore,
            },
          });


          return 0;
        }


        return prev - 1;

      });


    },1000);


    return () => clearInterval(timer);


  }, [
    navigate,
    category,
    totalScore,
    questions.length
  ]);


  const minutes = String(
    Math.floor(timeLeft / 60)
  ).padStart(2,"0");


  const seconds = String(
    timeLeft % 60
  ).padStart(2,"0");
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


    const updatedScore =
      totalScore + questionScore;


    setTotalScore(updatedScore);



    if (
      currentQuestion < questions.length - 1
    ) {


      setCurrentQuestion(
        currentQuestion + 1
      );


      setAnswer("");

      setFeedback("");

      setFeedbackColor("");

      setQuestionScore(0);

      setCanProceed(false);


    } else {


      const finalScore = Math.round(
        (updatedScore / (questions.length * 5)) * 100
      );


      saveInterview(
        category,
        finalScore
      );


      navigate("/results", {

        state: {

          category,

          score: finalScore,

        },

      });


    }

  }
    return (

    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 p-6 md:p-8 transition-colors duration-300">


      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-5">


        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-700 dark:text-white hover:text-blue-500 transition"
        >

          <ArrowLeft size={20} />

          Dashboard

        </button>



        <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">

          {category} Interview

        </h1>



        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">

          <Clock3 size={20} />

          {minutes}:{seconds}

        </div>


      </div>




      {/* Progress */}

      <div className="mt-10">


        <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">


          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>


          <span>

            {Math.round(
              ((currentQuestion + 1) / questions.length) * 100
            )}%

          </span>


        </div>




        <div className="w-full bg-gray-300 dark:bg-slate-800 rounded-full h-3">


          <div

            className="bg-blue-600 h-3 rounded-full transition-all duration-500"

            style={{

              width: `${
                ((currentQuestion + 1) / questions.length) * 100
              }%`

            }}

          />


        </div>


      </div>




      {/* Question Card */}


      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 mt-10 shadow-lg">


        <h2 className="text-blue-600 dark:text-blue-400 text-xl font-semibold mb-6">

          AI Question

        </h2>



        <p className="text-gray-900 dark:text-white text-2xl">

          {questions[currentQuestion].question}

        </p>


      </div>




      {/* Answer Card */}


      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 mt-8 shadow-lg">


        <h2 className="text-xl text-gray-900 dark:text-white mb-5">

          Your Answer

        </h2>



        <textarea

          rows="8"

          value={answer}

          onChange={(e)=>setAnswer(e.target.value)}

          placeholder="Type your answer here..."

          className="
          w-full
          bg-gray-100
          dark:bg-slate-800
          text-gray-900
          dark:text-white
          rounded-xl
          p-5
          resize-none
          outline-none
          focus:ring-2
          focus:ring-blue-500
          transition
          "

        />


      </div>
            {/* Feedback */}

      {feedback && (

        <div

          className={`mt-6 p-5 rounded-xl border ${
            
            feedbackColor === "green"

            ? "bg-green-100 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"

            : feedbackColor === "yellow"

            ? "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-400"

            : feedbackColor === "orange"

            ? "bg-orange-100 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-400"

            : "bg-red-100 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"

          }`}

        >

          <h2 className="text-xl font-bold">

            Score : {questionScore}/5

          </h2>


          <p className="mt-2">

            {feedback}

          </p>


        </div>

      )}




      {/* Buttons */}


      <div className="flex flex-col md:flex-row justify-between gap-6 mt-8">



        <div className="flex gap-4">


          <button

            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white flex items-center gap-2 transition"

          >

            <Mic size={20} />

            Start Recording

          </button>



          <button

            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-white flex items-center gap-2 transition"

          >

            <Square size={20} />

            Stop

          </button>


        </div>




        <div className="flex gap-4">



          {!canProceed && (

            <button

              onClick={submitAnswer}

              className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-xl text-black font-semibold transition"

            >

              Submit Answer

            </button>

          )}






          {canProceed && currentQuestion !== questions.length - 1 && (


            <button

              onClick={nextQuestion}

              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl text-white flex items-center gap-2 transition"

            >

              Next Question

              <ChevronRight size={20}/>


            </button>


          )}






          {canProceed && currentQuestion === questions.length - 1 && (


            <button

              onClick={nextQuestion}

              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl text-white flex items-center gap-2 transition"

            >

              <CheckCircle size={20}/>

              Finish Interview


            </button>


          )}



        </div>


      </div>


    </div>

  );

}


export default Interview;