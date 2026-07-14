  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-6 md:p-8 transition-colors duration-300">

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 w-full max-w-3xl shadow-lg">


        {/* Trophy */}

        <div className="flex justify-center">

          <div className="bg-yellow-500 p-5 rounded-full">

            <Trophy size={45} className="text-white" />

          </div>

        </div>


        {/* Heading */}

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mt-6">

          Interview Completed 🎉

        </h1>


        <p className="text-gray-600 dark:text-gray-400 text-center mt-3">

          Great job! Here is your interview performance.

        </p>


        {/* Category */}

        <div className="text-center mt-6">

          <span className="bg-blue-600 text-white px-5 py-2 rounded-full capitalize font-semibold">

            {category} Interview

          </span>

        </div>
        id="q7m2kc"
        {/* Score */}

        <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-8 mt-10 text-center transition">


          <h2 className="text-gray-600 dark:text-gray-400">

            Overall Score

          </h2>


          <h1 className="text-6xl text-green-500 font-bold mt-4">

            {score}%

          </h1>


          <p className={`text-2xl font-bold mt-4 ${performanceColor}`}>

            {performance}

          </p>


        </div>



        {/* Ratings */}


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">



          <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5 text-center">


            <h3 className="text-gray-900 dark:text-white font-semibold">

              Communication

            </h3>


            <p className="text-yellow-500 text-2xl mt-2">


              {score >= 90

                ? "⭐⭐⭐⭐⭐"

                : score >= 75

                ? "⭐⭐⭐⭐☆"

                : score >= 60

                ? "⭐⭐⭐☆☆"

                : "⭐⭐☆☆☆"}


            </p>


          </div>





          <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5 text-center">


            <h3 className="text-gray-900 dark:text-white font-semibold">

              Technical

            </h3>


            <p className="text-yellow-500 text-2xl mt-2">


              {score >= 90

                ? "⭐⭐⭐⭐⭐"

                : score >= 75

                ? "⭐⭐⭐⭐☆"

                : score >= 60

                ? "⭐⭐⭐☆☆"

                : "⭐⭐☆☆☆"}


            </p>


          </div>





          <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5 text-center">


            <h3 className="text-gray-900 dark:text-white font-semibold">

              Confidence

            </h3>


            <p className="text-yellow-500 text-2xl mt-2">


              {score >= 90

                ? "⭐⭐⭐⭐⭐"

                : score >= 75

                ? "⭐⭐⭐⭐☆"

                : score >= 60

                ? "⭐⭐⭐☆☆"

                : "⭐⭐☆☆☆"}


            </p>


          </div>


        </div>
        id="h3k8ps"
        {/* Suggestions */}

        <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-6 mt-10">


          <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-4">

            Suggestions

          </h2>



          <ul className="text-gray-700 dark:text-gray-300 space-y-2">


            {suggestions.map((item, index) => (

              <li key={index}>

                ✔ {item}

              </li>

            ))}


          </ul>


        </div>




        {/* Buttons */}


        <div className="flex flex-col md:flex-row justify-center gap-5 mt-10">


          <Link to="/dashboard">


            <button className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-xl text-white flex items-center justify-center gap-2 w-full">


              <Home size={20} />


              Dashboard


            </button>


          </Link>




          <Link to={`/interview/${category}`}>


            <button className="bg-green-600 hover:bg-green-700 transition px-8 py-3 rounded-xl text-white flex items-center justify-center gap-2 w-full">


              <RotateCcw size={20} />


              Practice Again


            </button>


          </Link>


        </div>



      </div>


    </div>

  );


  export default Results;