import {
  LayoutDashboard,
  BriefcaseBusiness,
  History,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import Logo from "./Logo";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
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

  const closeSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const navClass = ({ isActive }) =>
    `group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
      : "text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white"
    }`;

  return (
    <aside
  className={`
    fixed
    inset-y-0
    left-0
    z-50
    w-72
    bg-white
    dark:bg-slate-900
    border-r
    border-slate-200
    dark:border-slate-800
    flex
    flex-col
    shadow-xl
    transition-transform
    duration-300
    ease-in-out

    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full"
    }

    lg:translate-x-0
    lg:fixed
  `}
    >
      {/* Mobile Close */}
      <div className="lg:hidden flex justify-end p-4">
        <button
          onClick={closeSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={22} />
        </button>
      </div>

      {/* Logo */}
      <div className="px-7 py-7 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-8 space-y-3 overflow-y-auto">

        <NavLink
          to="/dashboard"
          className={navClass}
          onClick={closeSidebar}
        >
          <LayoutDashboard size={21} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/interview"
          className={navClass}
          onClick={closeSidebar}
        >
          <BriefcaseBusiness size={21} />
          <span>Interview</span>
        </NavLink>

        <NavLink
          to="/history"
          className={navClass}
          onClick={closeSidebar}
        >
          <History size={21} />
          <span>History</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={navClass}
          onClick={closeSidebar}
        >
          <User size={21} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={navClass}
          onClick={closeSidebar}
        >
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