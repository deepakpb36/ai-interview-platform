import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Mic,
  Square,
} from "lucide-react";

import INTERVIEW_QUESTIONS from "../data/questions";

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



  const questionsList =
    INTERVIEW_QUESTIONS[
      category.toLowerCase()
    ] ||
    INTERVIEW_QUESTIONS.html;



  const [currentIdx, setCurrentIdx] =
    useState(0);


  const [answer, setAnswer] =
    useState("");


  const [isRecording, setIsRecording] =
    useState(false);


  const [evaluation, setEvaluation] =
    useState(null);



  const [skippedCount, setSkippedCount] =
    useState(0);



  const [passedCount, setPassedCount] =
    useState(0);



  // Prevent multiple submissions

  const [isFinished, setIsFinished] =
    useState(false);



  const recognitionRef =
    useRef(null);



  const currentQuestionObj =
    questionsList[currentIdx];



  const db = getFirestore();

  const auth = getAuth();





  // ==========================
  // Speech Recognition
  // ==========================


  useEffect(() => {


    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;



    if (!SpeechRecognition) return;



    const recognition =
      new SpeechRecognition();



    recognition.continuous = true;

    recognition.interimResults = false;

    recognition.lang = "en-US";



    recognition.onresult = (event)=>{


      const text =
        event.results[
          event.results.length - 1
        ][0].transcript;



      setAnswer((prev)=>

        prev
        ? `${prev} ${text}`
        : text

      );


    };



    recognition.onend = ()=>{

      setIsRecording(false);

    };



    recognition.onerror = ()=>{

      setIsRecording(false);

    };



    recognitionRef.current =
      recognition;



    return ()=>{


      if(recognitionRef.current){

        recognitionRef.current.stop();

      }


    };


  }, []);






  // ==========================
  // Recording Controls
  // ==========================



  const startRecording = ()=>{


    if(!recognitionRef.current){

      alert(
        "Speech Recognition is not supported in this browser."
      );

      return;

    }



    try{

      recognitionRef.current.start();

      setIsRecording(true);


    }
    catch(error){

      console.log(error);

    }


  };





  const stopRecording = ()=>{


    if(!recognitionRef.current)
      return;



    recognitionRef.current.stop();


    setIsRecording(false);


  };
  // ==========================
// Evaluate Answer
// ==========================


const handleEvaluateAnswer = ()=>{


  if(!answer.trim()){


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
)=>{


  // Prevent duplicate save

  if(isFinished)
    return;



  setIsFinished(true);



  const totalQuestions =
    questionsList.length;



  const score =
    Math.round(
      (finalPassed / totalQuestions) * 100
    );




  // Local Storage Save
  // Dashboard and History use this


  saveInterview(
    category,
    score
  );





  // Firebase backup only


  const user =
    auth.currentUser;



  if(!user)
    return;




  try{


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
  catch(error){


    console.log(
      "Firebase history error:",
      error
    );


  }



};






// ==========================
// Next Question
// ==========================


const handleNextQuestion = async ()=>{


  let updatedPassed =
    passedCount;



  if(evaluation?.passed){


    updatedPassed =
      passedCount + 1;


    setPassedCount(
      updatedPassed
    );


  }





  // Move to next question


  if(
    currentIdx <
    questionsList.length - 1
  ){


    setCurrentIdx(
      (prev)=>prev + 1
    );


    setAnswer("");

    setEvaluation(null);


    return;


  }







  // Final score


  const finalScore =
    Math.round(
      (updatedPassed /
      questionsList.length) * 100
    );





  await saveInterviewToHistory(

    skippedCount,

    updatedPassed

  );






  // Go directly to result


  navigate(
    "/results",
    {

      state:{

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


const handleSkipQuestion = async ()=>{


  const updatedSkipped =
    skippedCount + 1;



  setSkippedCount(
    updatedSkipped
  );





  if(
    currentIdx <
    questionsList.length - 1
  ){


    setCurrentIdx(
      (prev)=>prev + 1
    );


    setAnswer("");

    setEvaluation(null);


    return;


  }





  const finalScore =
    Math.round(
      (passedCount /
      questionsList.length) * 100
    );





  await saveInterviewToHistory(

    updatedSkipped,

    passedCount

  );





  navigate(
    "/results",
    {

      state:{

        category,

        score:
          finalScore,

      },

    }

  );

};





// ==========================
// Progress
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
            text-gray-500
            dark:text-gray-400
            mt-1
            "
          >

            Question {currentIdx + 1} of {questionsList.length}

          </p>


        </div>





        <button

          onClick={()=>navigate("/dashboard")}

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







      {/* Progress */}



      <div
        className="
        mb-8
        "
      >


        <div
          className="
          flex
          justify-between
          text-sm
          mb-2
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
          bg-gray-200
          dark:bg-slate-800
          rounded-full
          overflow-hidden
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
              width:`${progressPercent}%`
            }}

          />


        </div>



      </div>









      {/* Question Card */}



      <div
       className="
bg-white
dark:bg-slate-900
rounded-3xl
shadow-lg
border
border-gray-200
dark:border-slate-800
p-5
sm:p-6
lg:p-8
"
      >


        <h2
          className="
          text-2xl
          font-bold
          leading-relaxed
          text-gray-900
          dark:text-white
          "
        >

          {currentQuestionObj.question}

        </h2>


      </div>








      {/* Answer Box */}



      <div
        className="
        mt-8
        "
      >


        <textarea

          value={answer}

          onChange={(e)=>
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
h-44
sm:h-52
lg:h-56
resize-none
          rounded-2xl
          border
          border-gray-300
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
          p-5
          text-gray-900
          dark:text-white
          outline-none
          focus:ring-2
          focus:ring-blue-500
          "

        />


      </div>









      {/* Buttons Before Evaluation */}



      {!evaluation && (


        <div
          className="
flex
flex-col
sm:flex-row
flex-wrap
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
            gap-2
            px-6
            py-3
            rounded-xl
            font-semibold
            text-white
            transition

            ${
              isRecording
              ?
              "bg-red-600 hover:bg-red-700"
              :
              "bg-blue-600 hover:bg-blue-700"
            }

            `}

          >



            {
              isRecording
              ?

              <>

                <Square size={18}/>

                Stop Recording

              </>


              :


              <>

                <Mic size={18}/>

                Start Recording

              </>


            }


          </button>







          <button

            onClick={handleSkipQuestion}

            className="
w-full
sm:w-auto
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
rounded-3xl
shadow-lg
border
border-gray-200
dark:border-slate-800
p-5
sm:p-6
lg:p-8
"
        >



          <div
            className="
            flex
            items-center
            justify-between
            flex-wrap
            gap-4
            "
          >


            <div>


              <h2
                className={`
                text-2xl
                font-bold

                ${
                  evaluation.passed
                  ?
                  "text-green-600"
                  :
                  "text-red-600"
                }

                `}
              >


                {
                  evaluation.passed
                  ?
                  "✅ Answer Approved"
                  :
                  "❌ Needs Improvement"
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







          {/* Stars */}


          <div
            className="
            flex
            gap-2
            text-3xl
            mt-6
            "
          >


            {
              [1,2,3,4,5].map((star)=>(


                <span

                  key={star}

                  className={
                    star <= evaluation.marks
                    ?
                    "text-yellow-500"
                    :
                    "text-gray-300"
                  }

                >

                  ★

                </span>


              ))
            }


          </div>








          {/* Feedback */}


          <div
            className="
            mt-6
            "
          >


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
              leading-7
              text-gray-600
              dark:text-gray-400
              "
            >

              {evaluation.message}

            </p>


          </div>









          {/* Stats */}


          <div
            className="
           grid
grid-cols-1
sm:grid-cols-2
gap-4"
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


              <p
                className="
                text-gray-500
                "
              >

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


              <p
                className="
                text-gray-500
                "
              >

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









          {/* Next / Finish Button */}



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


            ${
              isFinished
              ?
              "bg-gray-500 cursor-not-allowed"
              :
              "bg-blue-600 hover:bg-blue-700"
            }


            `}


          >


            {
              currentIdx === questionsList.length - 1
              ?
              "Finish Interview"
              :
              "Next Question"
            }


          </button>



        </div>


      )}





    </div>


  </div>


);

}


export default Interview;