import {
  LayoutDashboard,
  BriefcaseBusiness,
  History,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";
import Logo from "./Logo";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">

      <div>

        <Logo />

        <nav className="mt-10 space-y-2">

          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/interview/frontend"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition"
          >
            <BriefcaseBusiness size={20} />
            Interview
          </Link>

          <Link
            to="/history"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition"
          >
            <History size={20} />
            History
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition"
          >
            <User size={20} />
            Profile
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition"
          >
            <Settings size={20} />
            Settings
          </Link>

        </nav>

      </div>

      <div>

        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition"
        >
          <LogOut size={20} />
          Logout
        </Link>

      </div>

    </aside>
  );
}

export default Sidebar;