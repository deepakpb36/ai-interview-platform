import React, { useMemo } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";

import {
  Target,
  TrendingUp,
  Trophy,
  Clock,
  BookOpen,
  Terminal,
  Code,
  Users,
  ArrowRight,
} from "lucide-react";

import { questionsByCategory } from "../data/questions";
import { getHistory } from "../utils/storage";


ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


// Interview Categories Data
const INTERVIEW_TRACKS = [
  {
    id: "html",
    title: "HTML",
    description: "Master semantic HTML and page structure.",
    icon: BookOpen,
    color: "from-orange-500 to-red-500",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    id: "css",
    title: "CSS",
    description: "Practice layouts, Flexbox, Grid and animations.",
    icon: Code,
    color: "from-sky-500 to-cyan-500",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Practice core JavaScript interview questions.",
    icon: Code,
    color: "from-yellow-500 to-amber-500",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    id: "react",
    title: "React",
    description: "React Hooks, Components and Lifecycle.",
    icon: Code,
    color: "from-cyan-500 to-blue-500",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    id: "tailwind",
    title: "Tailwind",
    description: "Utility-first CSS interview practice.",
    icon: Code,
    color: "from-teal-500 to-cyan-500",
    difficulty: "Intermediate",
    duration: "10 min",
  },
  {
    id: "frontend",
    title: "Frontend",
    description: "Frontend development interview preparation.",
    icon: Code,
    color: "from-indigo-500 to-blue-600",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    id: "backend",
    title: "Backend",
    description: "Backend development interview preparation.",
    icon: Terminal,
    color: "from-slate-600 to-slate-900",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    id: "php",
    title: "PHP",
    description: "PHP interview questions.",
    icon: Terminal,
    color: "from-indigo-500 to-violet-500",
    difficulty: "Intermediate",
    duration: "10 min",
  },
  {
    id: "python",
    title: "Python",
    description: "Python programming interview.",
    icon: Terminal,
    color: "from-blue-500 to-indigo-500",
    difficulty: "Intermediate",
    duration: "10 min",
  },
  {
    id: "java",
    title: "Java",
    description: "Core Java interview preparation.",
    icon: Code,
    color: "from-red-500 to-rose-500",
    difficulty: "Intermediate",
    duration: "10 min",
  },
  {
    id: "c",
    title: "C",
    description: "C programming interview.",
    icon: Code,
    color: "from-gray-600 to-gray-800",
    difficulty: "Intermediate",
    duration: "10 min",
  },
  {
    id: "cpp",
    title: "C++",
    description: "C++ interview preparation.",
    icon: Code,
    color: "from-blue-700 to-indigo-700",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    id: "csharp",
    title: "C#",
    description: "C# interview preparation.",
    icon: Code,
    color: "from-purple-600 to-violet-700",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    id: "ai",
    title: "AI",
    description: "Artificial Intelligence interview questions.",
    icon: Terminal,
    color: "from-pink-500 to-rose-500",
    difficulty: "Advanced",
    duration: "15 min",
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Machine Learning interview questions.",
    icon: Terminal,
    color: "from-green-500 to-emerald-600",
    difficulty: "Advanced",
    duration: "15 min",
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    description: "Deep Learning interview questions.",
    icon: Terminal,
    color: "from-fuchsia-500 to-purple-600",
    difficulty: "Advanced",
    duration: "15 min",
  },
  {
    id: "hr",
    title: "HR",
    description: "HR interview preparation.",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    difficulty: "Easy",
    duration: "8 min",
  },
];
// How many category cards to show on the Dashboard before collapsing
// into a "See More" link. Keep this at 4 to match the current grid
// (grid-cols-1 sm:grid-cols-2 xl:grid-cols-4) regardless of how many
// tracks INTERVIEW_TRACKS grows to in the future.
const MAX_VISIBLE_TRACKS = INTERVIEW_TRACKS.length;

// Route to navigate to when the user wants to see the full list of
// interview categories. Update this if your full category/selection
// page lives at a different path (e.g. "/categories" or
// "/interview-selection").
const ALL_CATEGORIES_ROUTE = "/interview";


// Reusable Statistics Card
function StatCard({ title, value, icon: Icon, color }) {

  return (
    <div className="
      bg-white dark:bg-slate-900
      border border-slate-200 dark:border-slate-800
      rounded-2xl p-6
      shadow-sm
      hover:shadow-lg
      transition-all duration-300
    ">

      <div className="flex items-center justify-between">

        <div>

          <p className="
            text-sm font-medium
            text-slate-500
            dark:text-slate-400
          ">
            {title}
          </p>


          <h2 className="
            mt-2
            text-3xl font-bold
            text-slate-900
            dark:text-white
          ">
            {value}
          </h2>

        </div>


        <div
          className={`
            w-14 h-14
            rounded-xl
            bg-gradient-to-r ${color}
            flex items-center justify-center
            text-white
            shadow-md
          `}
        >
          <Icon size={26} />
        </div>


      </div>

    </div>
  );
}



// Dashboard Component Start

function Dashboard() {

  const navigate = useNavigate();

  const auth = getAuth();

  const user = auth.currentUser;


  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";



  // Load History Safely

  const rawHistory = getHistory();

  const history = Array.isArray(rawHistory)
    ? rawHistory
    : [];



  // Username

  const userName =
    user?.displayName ||
    user?.providerData?.[0]?.displayName ||
    (user?.email
      ? user.email.split("@")[0]
      : "User");



  // Statistics Calculation

  const stats = useMemo(() => {

    const total = history.length;


    const scores = history.map((item) => (
      Number(
        item.scorePercentage ??
        item.score ??
        0
      )
    ));


    const average =
      total === 0
        ? 0
        : Math.round(
          scores.reduce(
            (sum, score) => sum + score,
            0
          ) / total
        );


    const best =
      scores.length === 0
        ? 0
        : Math.max(...scores);



    return {

      totalInterviews: total,

      averageScore: average,

      bestScore: best,

      practiceMinutes: total * 10,

    };


  }, [history]);



  // Category Count

  const categoryCount = {};

  Object.keys(questionsByCategory).forEach((key) => {
    categoryCount[key] = 0;
  });


  history.forEach((item) => {

    if (
      item?.category &&
      categoryCount[item.category] !== undefined
    ) {

      categoryCount[item.category]++;

    }

  });
  // Filter Interview Tracks

  const filteredTracks = INTERVIEW_TRACKS.filter((track) =>
    track.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Only ever show up to MAX_VISIBLE_TRACKS cards on the Dashboard.
  // If there are more (matching) tracks than that, "See More" appears
  // below the grid and routes to the full category/interview page.
  const visibleTracks = filteredTracks.slice(0, MAX_VISIBLE_TRACKS);

  const hasMoreTracks = filteredTracks.length > MAX_VISIBLE_TRACKS;


  return (

    <div className="
      max-w-7xl
      mx-auto
      w-full
      space-y-10
      pb-12
    ">


      {/* Hero Section */}

      <section className="
        bg-gradient-to-r
        from-blue-50/50
        via-indigo-50/30
        to-transparent
        dark:from-slate-900
        dark:via-slate-800/40
        dark:to-transparent

        p-6 sm:p-8

        rounded-3xl

        border
        border-slate-200/80
        dark:border-slate-800/80

        shadow-sm
      ">


        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between

          gap-6
        ">


          <div>


            <h1 className="
              text-2xl
              sm:text-3xl
              lg:text-4xl

              font-extrabold

              text-slate-900
              dark:text-white

              tracking-tight
            ">

              Welcome Back, {userName} 👋

            </h1>



            <p className="
              mt-3

              text-slate-600
              dark:text-slate-400

              max-w-2xl

              text-base
            ">

              Practice technical interviews,
              improve your confidence,
              and track your progress
              with every assessment.

            </p>



            <button

              onClick={() => navigate("/interview")}

              className="
                mt-6

                px-6
                py-3

                rounded-xl

                bg-blue-600
                hover:bg-blue-700

                text-white

                font-semibold

                shadow-lg
                shadow-blue-500/25

                transition-all
                duration-200
              "
            >

              Start New Interview

            </button>


          </div>





          <div className="
            grid
            grid-cols-2
            gap-4
          ">


            <div className="
              bg-white
              dark:bg-slate-800/80

              border
              border-slate-200/60
              dark:border-slate-700/60

              rounded-2xl

              p-5

              text-center

              shadow-sm
            ">


              <p className="
                text-sm
                font-medium

                text-slate-500
                dark:text-slate-400
              ">

                Average Score

              </p>



              <h2 className="
                mt-2

                text-3xl

                font-bold

                text-blue-600
                dark:text-blue-400
              ">

                {stats.averageScore}%

              </h2>


            </div>





            <div className="
              bg-white
              dark:bg-slate-800/80

              border
              border-slate-200/60
              dark:border-slate-700/60

              rounded-2xl

              p-5

              text-center

              shadow-sm
            ">


              <p className="
                text-sm
                font-medium

                text-slate-500
                dark:text-slate-400
              ">

                Best Score

              </p>



              <h2 className="
                mt-2

                text-3xl

                font-bold

                text-green-600
                dark:text-green-400
              ">

                {stats.bestScore}%

              </h2>


            </div>


          </div>


        </div>


      </section>





      {/* Statistics Cards */}


      <section className="
        grid

        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4

        gap-6
      ">


        <StatCard

          title="Total Interviews"

          value={stats.totalInterviews}

          icon={Target}

          color="from-blue-500 to-blue-700"

        />



        <StatCard

          title="Average Score"

          value={`${stats.averageScore}%`}

          icon={TrendingUp}

          color="from-green-500 to-green-700"

        />



        <StatCard

          title="Highest Score"

          value={`${stats.bestScore}%`}

          icon={Trophy}

          color="from-yellow-500 to-orange-500"

        />



        <StatCard

          title="Practice Time"

          value={`${stats.practiceMinutes} min`}

          icon={Clock}

          color="from-purple-500 to-pink-600"

        />


      </section>
      {/* Interview Categories */}

      <section>


        <div className="
          mb-6

          flex
          flex-col
          sm:flex-row

          sm:items-center
          sm:justify-between

          gap-4
        ">


          <div>


            <h2 className="
              text-2xl
              sm:text-3xl

              font-bold

              text-slate-900
              dark:text-white

              tracking-tight
            ">

              Interview Categories

            </h2>



            <p className="
              mt-1

              text-slate-500
              dark:text-slate-400

              text-sm
              sm:text-base
            ">

              Choose a category to begin your targeted interview track.

            </p>


          </div>


        </div>





        <div className="
          grid

          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4

          gap-6
        ">


          {visibleTracks.map((track) => {


            const Icon = track.icon;


            // Fixed: using questionsByCategory

            const questionCount =
              questionsByCategory[track.id]?.length || 0;



            return (

              <div

                key={track.id}

                className="
                  bg-white

                  dark:bg-slate-900

                  rounded-2xl

                  border

                  border-slate-200

                  dark:border-slate-800

                  p-6

                  shadow-sm

                  hover:shadow-xl

                  hover:border-blue-500/40

                  dark:hover:border-blue-500/40

                  transition-all

                  duration-300

                  flex

                  flex-col

                  justify-between
                "

              >



                <div>


                  <div

                    className={`
                      w-14
                      h-14

                      rounded-xl

                      bg-gradient-to-r
                      ${track.color}

                      flex

                      items-center

                      justify-center

                      text-white

                      shadow-md
                    `}

                  >

                    <Icon size={28} />

                  </div>





                  <h3 className="
                    mt-5

                    text-xl

                    font-bold

                    text-slate-900

                    dark:text-white
                  ">

                    {track.title}

                  </h3>





                  <p className="
                    mt-2

                    text-sm

                    text-slate-500

                    dark:text-slate-400

                    line-clamp-2
                  ">

                    {track.description}

                  </p>





                  <div className="
                    flex

                    flex-wrap

                    gap-2

                    mt-5
                  ">



                    <span className="
                      px-3
                      py-1

                      rounded-full

                      bg-blue-50

                      dark:bg-blue-950/50

                      text-blue-700

                      dark:text-blue-300

                      text-xs

                      font-semibold

                      border

                      border-blue-200/50

                      dark:border-blue-800/50
                    ">

                      {questionCount} Questions

                    </span>





                    <span className="
                      px-3
                      py-1

                      rounded-full

                      bg-green-50

                      dark:bg-green-950/50

                      text-green-700

                      dark:text-green-300

                      text-xs

                      font-semibold

                      border

                      border-green-200/50

                      dark:border-green-800/50
                    ">

                      {track.duration}

                    </span>





                    <span className="
                      px-3
                      py-1

                      rounded-full

                      bg-purple-50

                      dark:bg-purple-950/50

                      text-purple-700

                      dark:text-purple-300

                      text-xs

                      font-semibold

                      border

                      border-purple-200/50

                      dark:border-purple-800/50
                    ">

                      {track.difficulty}

                    </span>


                  </div>


                </div>





                <button

                  onClick={() => navigate(`/interview/${track.id}`)}

                  className="
                    mt-6

                    w-full

                    rounded-xl

                    bg-slate-900

                    hover:bg-blue-600

                    dark:bg-slate-800

                    dark:hover:bg-blue-600

                    text-white

                    py-3

                    font-semibold

                    transition-all

                    duration-200

                    shadow-sm
                  "

                >

                  Start Interview

                </button>



              </div>


            );


          })}


        </div>

        {/* See More — only renders once there are more matching
            tracks than MAX_VISIBLE_TRACKS. Keeps the existing grid
            untouched; this is a new element appended below it. */}
        {hasMoreTracks && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate(ALL_CATEGORIES_ROUTE)}
              className="
                inline-flex
                items-center
                gap-2

                px-6
                py-3

                rounded-xl

                border
                border-slate-200
                dark:border-slate-800

                bg-white
                dark:bg-slate-900

                hover:bg-slate-50
                dark:hover:bg-slate-800

                text-slate-700
                dark:text-slate-300

                font-semibold

                text-sm

                shadow-sm

                transition-all
                duration-200
              "
            >
              See More Categories
              <ArrowRight size={16} />
            </button>
          </div>
        )}


      </section>
      {/* Performance Analytics */}

      <section>


        <div className="mb-6">


          <h2 className="
            text-2xl
            sm:text-3xl

            font-bold

            text-slate-900
            dark:text-white

            tracking-tight
          ">

            Performance Analytics

          </h2>



          <p className="
            mt-1

            text-slate-500

            dark:text-slate-400

            text-sm

            sm:text-base
          ">

            Monitor your distribution breakdown and score trends over time.

          </p>


        </div>





        <div className="
          grid

          grid-cols-1

          xl:grid-cols-3

          gap-6
        ">



          {/* Category Distribution */}

          <div className="
            bg-white

            dark:bg-slate-900

            rounded-2xl

            border

            border-slate-200

            dark:border-slate-800

            p-6

            shadow-sm

            flex

            flex-col

            justify-between
          ">



            <div>


              <h3 className="
                text-lg

                font-bold

                text-slate-900

                dark:text-white
              ">

                Category Distribution

              </h3>



              <p className="
                mt-1

                mb-4

                text-sm

                text-slate-500

                dark:text-slate-400
              ">

                Interviews attempted in each track.

              </p>


            </div>





            <div className="
              h-72

              flex

              items-center

              justify-center
            ">



              <Doughnut

                data={{

                  labels: Object.keys(categoryCount).map(
                    item =>
                      item
                        .replace("-", " ")
                        .toUpperCase()
                  ),


                  datasets: [

                    {

                      label: "Interviews",

                      data: Object.values(categoryCount),

                      backgroundColor: Object.keys(categoryCount).map((key) => {

                        switch (key) {

                          case "html":
                            return "#f97316";

                          case "css":
                            return "#3b82f6";

                          case "javascript":
                            return "#facc15";

                          case "react":
                            return "#06b6d4";

                          case "tailwind":
                            return "#14b8a6";

                          case "frontend":
                            return "#22c55e";

                          case "backend":
                            return "#6366f1";

                          case "php":
                            return "#8b5cf6";

                          case "python":
                            return "#10b981";

                          case "java":
                            return "#dc2626";

                          case "c":
                            return "#ef4444";

                          case "cpp":
                            return "#ec4899";

                          case "csharp":
                            return "#a855f7";

                          case "ai":
                            return "#0ea5e9";

                          case "machine-learning":
                            return "#84cc16";

                          case "deep-learning":
                            return "#f43f5e";

                          case "hr":
                            return "#648b6a";

                          default:
                            return "#94a3b8";

                        }

                      }),

                      borderWidth: 2,

                      borderColor: "transparent",

                    }

                  ]

                }}


                options={{

                  responsive: true,

                  maintainAspectRatio: false,


                  cutout: "70%",


                  plugins: {

                    legend: {

                      position: "bottom",


                      labels: {

                        color: "#64748b",

                        font: {

                          size: 12,

                          family: "inherit"

                        },


                        padding: 16

                      }

                    }

                  }

                }}

              />


            </div>


          </div>







          {/* Score Progress */}


          <div className="
            xl:col-span-2

            bg-white

            dark:bg-slate-900

            rounded-2xl

            border

            border-slate-200

            dark:border-slate-800

            p-6

            shadow-sm

            flex

            flex-col

            justify-between
          ">



            <div>


              <h3 className="
                text-lg

                font-bold

                text-slate-900

                dark:text-white
              ">

                Score Progress

              </h3>



              <p className="
                mt-1

                mb-4

                text-sm

                text-slate-500

                dark:text-slate-400
              ">

                Recent score percentages across completed interviews.

              </p>


            </div>





            <div className="h-72">


              <Line


                data={{


                  labels:

                    history

                      .slice(-7)

                      .map((item) =>

                        item?.completedAt

                          ? new Date(
                            item.completedAt
                          ).toLocaleDateString()

                          : "-"

                      ),



                  datasets: [

                    {

                      label: "Score",


                      data:

                        history

                          .slice(-7)

                          .map((item) =>

                            Number(

                              item?.scorePercentage ??

                              item?.score ??

                              0

                            )

                          ),



                      borderColor: "#3b82f6",


                      backgroundColor:
                        "rgba(59,130,246,0.15)",


                      fill: true,


                      tension: 0.4,


                      pointRadius: 4,


                      pointHoverRadius: 6

                    }

                  ]


                }}



                options={{


                  responsive: true,


                  maintainAspectRatio: false,



                  plugins: {


                    legend: {


                      display: false


                    }


                  },



                  scales: {


                    y: {


                      beginAtZero: true,


                      max: 100,



                      ticks: {


                        color: "#64748b",


                        font: {


                          size: 11


                        }


                      },



                      grid: {


                        color:
                          "rgba(148,163,184,0.1)"


                      }


                    },




                    x: {


                      ticks: {


                        color: "#64748b",


                        font: {


                          size: 11


                        }


                      },



                      grid: {


                        display: false


                      }


                    }


                  }


                }}


              />


            </div>


          </div>


        </div>


      </section>
      {/* Recent Interviews */}

      <section>


        <div className="
          flex

          flex-col

          sm:flex-row

          sm:items-center

          sm:justify-between

          gap-4

          mb-6
        ">


          <div>


            <h2 className="
              text-2xl

              sm:text-3xl

              font-bold

              text-slate-900

              dark:text-white

              tracking-tight
            ">

              Recent Interviews

            </h2>



            <p className="
              mt-1

              text-slate-500

              dark:text-slate-400

              text-sm

              sm:text-base
            ">

              Quick review of your latest evaluation records.

            </p>


          </div>





          <button

            onClick={() => navigate("/history")}

            className="
              px-5

              py-2.5

              rounded-xl

              border

              border-slate-200

              dark:border-slate-800

              hover:bg-slate-50

              dark:hover:bg-slate-800

              text-slate-700

              dark:text-slate-300

              font-semibold

              transition

              text-sm
            "

          >

            View All History

          </button>


        </div>







        <div className="
          bg-white

          dark:bg-slate-900

          rounded-2xl

          border

          border-slate-200

          dark:border-slate-800

          shadow-sm

          overflow-hidden
        ">



          {
            history.length === 0 ? (


              <div className="
                py-16

                text-center
              ">



                <Target

                  size={48}

                  className="
                    mx-auto

                    text-blue-500

                    mb-4

                    opacity-80
                  "

                />



                <h3 className="
                  text-xl

                  font-bold

                  text-slate-900

                  dark:text-white
                ">

                  No Interviews Yet

                </h3>



                <p className="
                  mt-1

                  text-sm

                  text-slate-500

                  dark:text-slate-400

                  max-w-sm

                  mx-auto
                ">

                  Complete your first interview track to populate your logs and performance stats.

                </p>



              </div>


            ) : (



              <div className="
                divide-y

                divide-slate-100

                dark:divide-slate-800/80
              ">


                {
                  history

                    .slice()

                    .reverse()

                    .slice(0, 5)

                    .map((item, index) => {


                      const score = Number(

                        item?.scorePercentage ??

                        item?.score ??

                        0

                      );



                      return (


                        <div

                          key={item?.id || index}

                          className="
                          flex

                          items-center

                          justify-between

                          px-6

                          py-4

                          hover:bg-slate-50/60

                          dark:hover:bg-slate-800/50

                          transition-colors
                        "

                        >



                          <div>


                            <h3 className="
                            font-semibold

                            text-slate-900

                            dark:text-white

                            capitalize

                            text-base
                          ">

                              {item?.category || "General"} Interview

                            </h3>




                            <p className="
                            text-xs

                            text-slate-500

                            dark:text-slate-400

                            mt-0.5
                          ">


                              {
                                item?.completedAt

                                  ? new Date(
                                    item.completedAt
                                  )
                                    .toLocaleDateString(
                                      undefined,
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                      }
                                    )

                                  : "-"
                              }


                            </p>


                          </div>






                          <span

                            className={`
                            px-3.5

                            py-1

                            rounded-full

                            text-xs

                            font-bold


                            ${score >= 80

                                ?
                                "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 border border-green-200/50 dark:border-green-800/50"


                                :

                                score >= 60

                                  ?

                                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300 border border-yellow-200/50 dark:border-yellow-800/50"


                                  :

                                  "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200/50 dark:border-red-800/50"

                              }

                          `}

                          >

                            {score}% Score

                          </span>



                        </div>


                      );


                    })


                }


              </div>


            )


          }



        </div>



      </section>


    </div>

  );

}


export default Dashboard;
