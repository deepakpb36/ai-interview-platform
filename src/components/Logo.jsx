import { FaRobot } from "react-icons/fa";

function Logo() {
  return (
    <div className="flex items-center gap-4 select-none">

      {/* Logo Icon */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <FaRobot className="text-white text-2xl" />
      </div>

      {/* Logo Text */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          AI Interview
        </h1>

        {/* Updated text to show the full name requested */}
        <p className="text-xs font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400">
          AI Interview Prep Platform
        </p>
      </div>

    </div>
  );
}

export default Logo;