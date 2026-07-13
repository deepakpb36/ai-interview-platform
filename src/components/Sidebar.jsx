import {
  LayoutDashboard,
  BriefcaseBusiness,
  History,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Logo from "./Logo";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);

      localStorage.removeItem("isLoggedIn");

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-blue-600 hover:text-white"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col">

      <Logo />

      <nav className="mt-10 space-y-2">

        <NavLink
          to="/dashboard"
          className={navClass}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/interview"
          className={navClass}
        >
          <BriefcaseBusiness size={20} />
          Interview
        </NavLink>

        <NavLink
          to="/history"
          className={navClass}
        >
          <History size={20} />
          History
        </NavLink>

        <NavLink
          to="/profile"
          className={navClass}
        >
          <User size={20} />
          Profile
        </NavLink>

        <NavLink
          to="/settings"
          className={navClass}
        >
          <Settings size={20} />
          Settings
        </NavLink>

      </nav>

      <div className="mt-auto">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition duration-300"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;