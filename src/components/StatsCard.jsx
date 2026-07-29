import React from "react";

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

export default StatCard;