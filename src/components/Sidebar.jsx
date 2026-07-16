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
    `group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
        : "text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white"
    }`;

  return (
    // FIXED classes: Changed min-h-screen to h-screen, added flex-shrink-0 and h-full
    <aside className="w-72 h-screen flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 overflow-hidden">

      {/* Logo */}
      <div className="px-7 py-8 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-8 space-y-3 overflow-y-auto">
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard size={21} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/interview" className={navClass}>
          <BriefcaseBusiness size={21} />
          <span>Interview</span>
        </NavLink>

        <NavLink to="/history" className={navClass}>
          <History size={21} />
          <span>History</span>
        </NavLink>

        <NavLink to="/profile" className={navClass}>
          <User size={21} />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/settings" className={navClass}>
          <Settings size={21} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;