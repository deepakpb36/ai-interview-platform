import { ArrowUpRight } from "lucide-react";

function StatsCard({ title, value, subtitle, iconBg }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition duration-300">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-400 text-sm">
            {title}
          </p>

          <h2 className="text-white text-4xl font-bold mt-3">
            {value}
          </h2>

          <p className="text-green-400 text-sm mt-2">
            {subtitle}
          </p>
        </div>

        <div className={`${iconBg} p-3 rounded-xl`}>
          <ArrowUpRight className="text-white" size={22} />
        </div>

      </div>

    </div>
  );
}

export default StatsCard;