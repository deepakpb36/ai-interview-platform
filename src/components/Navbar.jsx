import { getAuth } from "firebase/auth";
import { Sun, Moon, Search, CalendarDays } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const auth = getAuth();
  const user = auth.currentUser;

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Username
  const userName =
    user?.displayName?.trim() ||
    (user?.email ? user.email.split("@")[0] : "User");

  // Avatar
  const userPhoto =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName
    )}&background=2563eb&color=ffffff&size=128`;

  const handleSearchChange = (e) => {
    const value = e.target.value;

    if (location.pathname !== "/dashboard") {
      navigate(`/dashboard?search=${encodeURIComponent(value)}`);
    } else {
      if (value) {
        navigate(`/dashboard?search=${encodeURIComponent(value)}`, {
          replace: true,
        });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  };

  return (
   <header className="min-h-[80px] px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">

      {/* Left */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Welcome back,{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {userName}
          </span>{" "}
          👋
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">

        {/* Date */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">

          <CalendarDays
            size={18}
            className="text-blue-600 dark:text-blue-400"
          />

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Today
            </p>

            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              {today}
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 w-52 lg:w-72">

          <Search
            size={18}
            className="text-slate-500"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="bg-transparent w-full ml-3 outline-none text-slate-800 dark:text-white placeholder:text-slate-500"
          />

        </div>

        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-sm"
        >
          {theme === "dark" ? (
            <Sun
              className="text-yellow-500"
              size={20}
            />
          ) : (
            <Moon
              className="text-slate-700"
              size={20}
            />
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
         className="
flex
items-center
gap-2
bg-slate-100
dark:bg-slate-800
rounded-xl
px-2
sm:px-3
py-2
hover:scale-105
transition
cursor-pointer
"
        >

          <img
            src={userPhoto}
            alt={userName}
           className="
w-9
h-9
sm:w-10
sm:h-10
rounded-full
border-2
border-blue-500
object-cover
"
          />

         <div className="hidden xl:block text-left">

            <h3 className="font-semibold text-slate-800 dark:text-white">
              {userName}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Student
            </p>

          </div>

        </button>

      </div>

    </header>
  );
}

export default Navbar;