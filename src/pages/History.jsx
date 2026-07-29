import { useState, useEffect } from "react";
import {
  Calendar,
  Trophy,
  Target,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div
      className="
        bg-white
        dark:bg-slate-900
        rounded-3xl
        p-5
        sm:p-6
        shadow-sm
        border
        border-slate-200
        dark:border-slate-800
      "
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h2 className="
            text-2xl
            sm:text-3xl
            font-bold
            mt-2
            text-slate-900
            dark:text-white
          ">
            {value}
          </h2>
        </div>


        <div
          className="
            p-3
            rounded-xl
            bg-blue-100
            dark:bg-blue-500/10
            text-blue-600
          "
        >
          {icon}
        </div>

      </div>
    </div>
  );
}



function History() {

  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    let data = [];


    try {

      data =
        JSON.parse(
          localStorage.getItem("history")
        ) || [];

    }

    catch(error){

      console.log(
        "History loading error:",
        error
      );

    }


    if(!Array.isArray(data)){
      data = [];
    }



    const sorted =
      data.sort(
        (a,b)=>
          new Date(
            b.completedAt || 0
          )
          -
          new Date(
            a.completedAt || 0
          )
      );


    setHistoryList(sorted);

    setLoading(false);


  },[]);




  const totalInterviews =
    historyList.length;



  const scores =
    historyList.map(item =>
      Number(
        item.scorePercentage ??
        item.score ??
        0
      )
    );



  const averageScore =
    totalInterviews > 0
    ?
      Math.round(
        scores.reduce(
          (sum,score)=>
            sum + score,
          0
        )
        /
        totalInterviews
      )
    :
      0;



  const bestScore =
    scores.length > 0
    ?
      Math.max(...scores)
    :
      0;




  if(loading){

    return(

      <div className="
        flex
        justify-center
        items-center
        min-h-[70vh]
      ">

        <p className="
          text-slate-500
          animate-pulse
        ">
          Loading history...
        </p>

      </div>

    );

  }



return (

<div className="
  max-w-7xl
  mx-auto
  w-full
  space-y-8
">


{/* Header */}

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
text-3xl
lg:text-4xl
font-bold
text-slate-900
dark:text-white
">

Interview History

</h1>


<p className="
mt-2
text-slate-500
dark:text-slate-400
">

Track your previous interview performance and progress.

</p>


</div>



<button

onClick={()=>
navigate("/dashboard")
}

className="
px-6
py-3
rounded-xl
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
transition
"

>

← Dashboard

</button>


</div>





{/* Stats */}


<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
gap-6
">


<StatCard

title="Total Interviews"

value={totalInterviews}

icon={<Clock/>}

/>



<StatCard

title="Average Score"

value={`${averageScore}%`}

icon={<Target/>}

/>



<StatCard

title="Best Score"

value={`${bestScore}%`}

icon={<Trophy/>}

/>


</div>





{/* Empty State */}


{
historyList.length === 0
?

<div className="
bg-white
dark:bg-slate-900
rounded-3xl
p-10
text-center
border
border-slate-200
dark:border-slate-800
">


<Calendar

size={60}

className="
mx-auto
text-blue-500
"

/>



<h2 className="
text-2xl
font-bold
mt-5
text-slate-900
dark:text-white
">

No Interviews Found

</h2>


<p className="
mt-3
text-slate-500
dark:text-slate-400
">

Complete your first interview to see history.

</p>


</div>


:


<div className="space-y-6">


{
historyList.map(
(item,index)=>{


const score =
Number(
item.scorePercentage ??
item.score ??
0
);



return (

<div

key={
item.id || index
}

className="
bg-white
dark:bg-slate-900
rounded-3xl
border
border-slate-200
dark:border-slate-800
shadow-sm
hover:shadow-lg
transition
p-6
"

>



<div className="
flex
flex-col
lg:flex-row
lg:justify-between
gap-6
">


<div>


<span className="
inline-block
px-4
py-1
rounded-full
bg-indigo-100
dark:bg-indigo-500/10
text-indigo-700
dark:text-indigo-400
capitalize
text-sm
font-semibold
">

{
item.category || "General"
}

</span>




<h2 className="
text-xl
font-bold
mt-4
text-slate-900
dark:text-white
">

{
item.category || "General"
} Interview

</h2>



<p className="
mt-3
text-slate-500
dark:text-slate-400
">

{
item.completedAt
?
new Date(
item.completedAt
)
.toLocaleString()
:
"Unknown date"
}

</p>



</div>





<div className="
bg-gray-100
dark:bg-slate-800
rounded-2xl
px-8
py-6
text-center
">


<p className="
text-4xl
font-bold
text-blue-600
">

{score}%

</p>



<p className="
text-xs
uppercase
tracking-widest
text-slate-500
mt-2
">

Score

</p>




<div className="mt-4">


{
score >= 80
?

<span className="
px-4
py-2
rounded-full
bg-green-100
text-green-700
text-sm
font-semibold
">

Excellent

</span>


:

score >=60

?

<span className="
px-4
py-2
rounded-full
bg-yellow-100
text-yellow-700
text-sm
font-semibold
">

Good

</span>


:


<span className="
px-4
py-2
rounded-full
bg-red-100
text-red-700
text-sm
font-semibold
">

Improve

</span>


}


</div>


</div>



</div>



</div>

);


}

)

}


</div>


}


</div>

);

}



export default History;