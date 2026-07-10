import { useNavigate } from "react-router-dom";

function CategoryCard({ title, interviews, score, color }) {
  const navigate = useNavigate();

  function startInterview() {
    navigate(`/interview/${title.toLowerCase()}`);
  }

  return (
    <div
      onClick={startInterview}
      className={`${color} rounded-2xl p-6 cursor-pointer hover:scale-105 transition duration-300 shadow-lg`}
    >
      <h2 className="text-white text-xl font-bold">
        {title}
      </h2>

      <p className="text-white/90 mt-4">
        {interviews} Interviews
      </p>

      <p className="text-white/80 mt-2">
        Avg Score: {score}
      </p>

      <button className="mt-6 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold">
        Start Practice
      </button>
    </div>
  );
}

export default CategoryCard;