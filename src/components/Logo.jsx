import { FaRobot } from "react-icons/fa";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-blue-600 p-3 rounded-lg">
        <FaRobot className="text-white text-xl" />
      </div>

      <div>
        <h1 className="text-white text-2xl font-bold">
          AI Interview
        </h1>

        <p className="text-blue-500 font-semibold">
          Prep Platform
        </p>
      </div>
    </div>
  );
}

export default Logo;