import {
  Trophy,
  RotateCcw,
  Home,
  CheckCircle,
  Target,
  MessageCircle,
  Brain,
  Mic,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

function Results() {
  const location = useLocation();

  const category = location.state?.category || "HR";
  const score = location.state?.score ?? 0;

  let performance = "";
  let performanceColor = "";
  let performanceBg = "";
  let suggestions = [];

  if (score >= 90) {
    performance = "Excellent";
    performanceColor = "text-green-500";
    performanceBg = "bg-green-100 dark:bg-green-500/10";

    suggestions = [
      "Outstanding performance!",
      "Your answers show strong understanding.",
      "Maintain consistency with regular practice.",
      "You are ready for real interviews.",
    ];
  } else if (score >= 75) {
    performance = "Very Good";
    performanceColor = "text-blue-500";
    performanceBg = "bg-blue-100 dark:bg-blue-500/10";

    suggestions = [
      "Good understanding of interview concepts.",
      "Add more examples while explaining answers.",
      "Improve confidence during speaking.",
      "Continue practicing advanced questions.",
    ];
  } else if (score >= 60) {
    performance = "Good";
    performanceColor = "text-yellow-500";
    performanceBg = "bg-yellow-100 dark:bg-yellow-500/10";

    suggestions = [
      "Your basic concepts are clear.",
      "Focus on improving technical knowledge.",
      "Practice explaining answers clearly.",
      "Attempt more mock interviews.",
    ];
  } else {
    performance = "Needs Improvement";
    performanceColor = "text-red-500";
    performanceBg = "bg-red-100 dark:bg-red-500/10";

    suggestions = [
      "Start with fundamental concepts.",
      "Practice common interview questions.",
      "Improve answer structure and confidence.",
      "Try another mock interview.",
    ];
  }

  const rating =
    score >= 90
      ? "⭐⭐⭐⭐⭐"
      : score >= 75
      ? "⭐⭐⭐⭐☆"
      : score >= 60
      ? "⭐⭐⭐☆☆"
      : "⭐⭐☆☆☆";


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-300 p-5 md:p-8">

      <div className="max-w-6xl mx-auto w-full">

        {/* Header Section */}

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-lg p-4 sm:p-6 lg:p-10">

          <div className="flex flex-col items-center text-center">

            <div className="bg-yellow-500 p-5 rounded-full shadow-lg">
              <Trophy 
                size={45}
                className="text-white"
              />
            </div>


            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-6">
              Interview Completed 🎉
            </h1>


            <p className="text-gray-600 dark:text-gray-400 mt-3">
              Your interview report has been generated successfully.
            </p>


            <div className="mt-5">

              <span className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold capitalize">
                {category} Interview
              </span>

            </div>

          </div>


          {/* Score Section */}

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">


            <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-8 text-center">

              <p className="text-gray-500 dark:text-gray-400">
                Overall Score
              </p>

<div className="mt-5 relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
              

              <div className="w-full h-full rounded-full border-[10px] sm:border-[14px] border-blue-500 flex items-center justify-center">

                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    {score}%
                  </h2>

                </div>

              </div>


            </div>


           <div className={`${performanceBg} rounded-2xl p-6 sm:p-8 flex flex-col justify-center text-center`}>

              <p className="text-gray-500 dark:text-gray-400">
                Performance Level
              </p>


              <h2 className={`text-3xl font-bold mt-4 ${performanceColor}`}>
                {performance}
              </h2>


              <p className="text-3xl mt-4">
                {rating}
              </p>


            </div>


          </div>
          {/* Performance Analysis */}

          <div className="mt-10">

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-5">
              Performance Analysis
            </h2>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


              {/* Communication */}

              <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-6 hover:scale-105 transition">

                <div className="flex justify-center">
                  <MessageCircle 
                    size={35}
                    className="text-blue-500"
                  />
                </div>


                <h3 className="text-center text-gray-900 dark:text-white font-semibold mt-4">
                  Communication
                </h3>


                <p className="text-center text-yellow-500 text-xl mt-3">
                  {rating}
                </p>


                <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-3">
                  Ability to explain answers clearly and confidently.
                </p>

              </div>



              {/* Technical */}

              <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-6 hover:scale-105 transition">

                <div className="flex justify-center">
                  <Brain 
                    size={35}
                    className="text-green-500"
                  />
                </div>


                <h3 className="text-center text-gray-900 dark:text-white font-semibold mt-4">
                  Technical Knowledge
                </h3>


                <p className="text-center text-yellow-500 text-xl mt-3">
                  {rating}
                </p>


                <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-3">
                  Understanding of concepts related to the selected category.
                </p>

              </div>




              {/* Confidence */}

              <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-6 hover:scale-105 transition">


                <div className="flex justify-center">

                  <Mic 
                    size={35}
                    className="text-purple-500"
                  />

                </div>



                <h3 className="text-center text-gray-900 dark:text-white font-semibold mt-4">
                  Confidence
                </h3>



                <p className="text-center text-yellow-500 text-xl mt-3">
                  {rating}
                </p>



                <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-3">
                  Speaking practice and interview response confidence.
                </p>


              </div>


            </div>

          </div>





          {/* Quick Statistics */}

          <div className="mt-10">

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-5">
              Interview Summary
            </h2>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">


              <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5">

                <div className="flex items-center gap-3">

                  <Target className="text-blue-500"/>

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Accuracy
                  </h3>

                </div>


                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                  {score}%
                </p>


              </div>





              <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5">

                <div className="flex items-center gap-3">

                  <CheckCircle className="text-green-500"/>

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Status
                  </h3>

                </div>


                <p className="text-xl font-bold text-green-500 mt-3">
                  Completed
                </p>


              </div>





              <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5">


                <div className="flex items-center gap-3">

                  <Trophy className="text-yellow-500"/>

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Category
                  </h3>

                </div>



                <p className="text-xl font-bold text-gray-900 dark:text-white mt-3 capitalize">
                  {category}
                </p>


              </div>



            </div>


          </div>
                    {/* Suggestions Section */}

          <div className="mt-10 bg-gray-100 dark:bg-slate-800 rounded-2xl p-6 md:p-8">

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-5">
              Improvement Suggestions
            </h2>


            <div className="space-y-4">

              {suggestions.map((item, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700"
                >

                  <CheckCircle
                    size={22}
                    className="text-green-500 mt-1 shrink-0"
                  />


                  <p className="text-gray-700 dark:text-gray-300">
                    {item}
                  </p>


                </div>

              ))}


            </div>


          </div>





          {/* Action Buttons */}

          <div className="mt-10 flex flex-col md:flex-row gap-5 justify-center">


            <Link
              to="/dashboard"
              className="w-full md:w-auto"
            >

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >

                <Home size={20}/>

                Back To Dashboard

              </button>


            </Link>





            <Link
              to={`/interview/${category}`}
              className="w-full md:w-auto"
            >

              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >

                <RotateCcw size={20}/>

                Practice Again

              </button>


            </Link>



          </div>


        </div>


      </div>


    </div>
  );
}


export default Results;