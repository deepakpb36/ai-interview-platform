import { useState, useEffect } from "react";

import {
  Calendar,
  Trophy,
  Target,
  Clock,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function History() {

  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const loadHistory = () => {

      const data =
        JSON.parse(
          localStorage.getItem("history")
        ) || [];


      const sortedData = data.sort(
        (a, b) =>
          new Date(b.completedAt || 0) -
          new Date(a.completedAt || 0)
      );


      setHistoryList(sortedData);

      setLoading(false);

    };


    loadHistory();


  }, []);





  const totalInterviews = historyList.length;



  const averageScore =
    totalInterviews > 0
      ? Math.round(
          historyList.reduce(
            (sum, item) =>
              sum + Number(item.scorePercentage || item.score || 0),
            0
          ) / totalInterviews
        )
      : 0;



  const bestScore =
    totalInterviews > 0
      ? Math.max(
          ...historyList.map(
            (item) =>
              Number(
                item.scorePercentage ||
                item.score ||
                0
              )
          )
        )
      : 0;





  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-gray-100
        dark:bg-slate-950
        flex
        items-center
        justify-center
      ">

        <p className="
          text-gray-600
          dark:text-gray-400
          font-semibold
          animate-pulse
        ">

          Loading history...

        </p>

      </div>

    );

  }






  return (

    <div className="
      flex
      h-screen
      overflow-hidden
      bg-gray-100
      dark:bg-slate-950
      text-gray-900
      dark:text-white
    ">


      <Sidebar />



      <div className="
        flex-1
        flex
        flex-col
        overflow-hidden
      ">


        <Navbar />



        <main className="
          flex-1
          overflow-y-auto
          p-6
        ">


          <div className="
            max-w-6xl
            mx-auto
          ">



            {/* Header */}


            <div className="
              flex
              flex-col
              md:flex-row
              justify-between
              gap-5
              mb-8
            ">


              <div>

                <h1 className="
                  text-3xl
                  md:text-4xl
                  font-bold
                ">

                  Interview History

                </h1>


                <p className="
                  text-gray-500
                  dark:text-gray-400
                  mt-2
                ">

                  Track your previous interview performance.

                </p>


              </div>



              <button

                onClick={() =>
                  navigate("/dashboard")
                }

                className="
                  px-5
                  py-3
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                "

              >

                ← Dashboard

              </button>


            </div>






            {/* Statistics */}


            <div className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-6
              mb-10
            ">


              <StatCard
                title="Total Interviews"
                value={totalInterviews}
                icon={<Clock />}
              />



              <StatCard
                title="Average Score"
                value={`${averageScore}%`}
                icon={<Target />}
              />



              <StatCard
                title="Best Score"
                value={`${bestScore}%`}
                icon={<Trophy />}
              />


            </div>







            {
              historyList.length === 0 ?


              (

                <div className="
                  bg-white
                  dark:bg-slate-900
                  rounded-3xl
                  p-10
                  text-center
                ">


                  <Calendar
                    size={50}
                    className="mx-auto text-blue-500"
                  />


                  <h2 className="
                    text-2xl
                    font-bold
                    mt-5
                  ">

                    No Interviews Found

                  </h2>


                  <p className="
                    text-gray-500
                    mt-2
                  ">

                    Complete an interview to see results here.

                  </p>


                </div>

              )


              :


              (

                <div className="space-y-5">


                  {
                    historyList.map((item)=>(


                      <div

                        key={item.id}

                        className="
                          bg-white
                          dark:bg-slate-900
                          rounded-3xl
                          p-6
                          shadow-lg
                          flex
                          flex-col
                          md:flex-row
                          justify-between
                          gap-5
                        "

                      >



                        <div>


                          <span className="
                            px-4
                            py-1
                            rounded-full
                            bg-indigo-100
                            text-indigo-700
                            dark:bg-indigo-500/10
                            dark:text-indigo-400
                            text-sm
                            font-semibold
                          ">

                            {item.category}

                          </span>



                          <h2 className="
                            text-xl
                            font-bold
                            mt-4
                          ">

                            {item.category} Interview

                          </h2>



                          <p className="
                            text-gray-500
                            dark:text-gray-400
                            mt-2
                          ">

                            {
                              item.completedAt
                              ?
                              new Date(
                                item.completedAt
                              ).toLocaleString()
                              :
                              item.date || "Unknown date"
                            }

                          </p>


                        </div>






                        <div className="text-center">


                          <div className="
                            bg-gray-100
                            dark:bg-slate-800
                            rounded-2xl
                            px-8
                            py-5
                          ">


                            <p className="
                              text-3xl
                              font-bold
                            ">

                              {
                                item.scorePercentage ||
                                item.score ||
                                0
                              }%

                            </p>


                            <p className="
                              text-xs
                              text-gray-500
                            ">

                              SCORE

                            </p>


                          </div>


                        </div>



                      </div>


                    ))
                  }


                </div>

              )

            }



          </div>


        </main>


      </div>


    </div>

  );

}




function StatCard({
  title,
  value,
  icon
}) {


  return (

    <div className="
      bg-white
      dark:bg-slate-900
      rounded-3xl
      p-6
      shadow-lg
    ">


      <div className="
        flex
        justify-between
        items-center
      ">


        <div>

          <p className="
            text-gray-500
            dark:text-gray-400
          ">

            {title}

          </p>


          <h2 className="
            text-3xl
            font-bold
            mt-2
          ">

            {value}

          </h2>


        </div>



        <div className="
          p-3
          rounded-xl
          bg-blue-100
          dark:bg-blue-500/10
          text-blue-600
        ">

          {icon}

        </div>


      </div>


    </div>

  );

}



export default History;