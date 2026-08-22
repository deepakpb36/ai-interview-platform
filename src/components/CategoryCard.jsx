gimport { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function CategoryCard({ title, interviews, score, color }) {
  const navigate = useNavigate();

  function startInterview() {
    navigate(`/interview/${title.toLowerCase()}`);
  }

  return (
    <div
      onClick={startInterview}
      className={`${color} rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
    >
      <h2 className="text-white text-2xl font-bold">
        {title}
      </h2>

      <p className="text-white/90 mt-5">
        {interviews} Interviews
      </p>

      <p className="text-white/80 mt-2">
    
        Average Score: {score}
      </p>

      <button className="mt-6 flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
        Start Practice
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

export default CategoryCard;