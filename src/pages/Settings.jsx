import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { clearHistory } from "../utils/storage";
import { useTheme } from "../context/ThemeContext";
import {
  Bell,
  Moon,
  Volume2,
  Save,
  Trash2,
  LogOut,
  Shield,
} from "lucide-react";

function Settings() {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Global Theme Context
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [sound, setSound] = useState(() => {
    const saved = localStorage.getItem("soundEffects");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [autoSave, setAutoSave] = useState(() => {
    const saved = localStorage.getItem("autoSaveAnswers");
    return saved !== null ? JSON.parse(saved) : true;
  });


  useEffect(() => {
    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);


  useEffect(() => {
    localStorage.setItem(
      "soundEffects",
      JSON.stringify(sound)
    );
  }, [sound]);


  useEffect(() => {
    localStorage.setItem(
      "autoSaveAnswers",
      JSON.stringify(autoSave)
    );
  }, [autoSave]);



  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };


  const handleClearHistory = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all interview history?"
    );

    if (confirmDelete) {
      clearHistory();
      alert("Interview history cleared successfully.");
    }
  };


  const Toggle = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`w-14 h-8 rounded-full transition-colors duration-300 relative focus:outline-none ${enabled
          ? "bg-blue-600"
          : "bg-gray-300 dark:bg-slate-700"
        }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 ${enabled ? "left-7" : "left-1"
          }`}
      ></div>
    </button>
  );


  return (
    <div className="bg-gray-100 dark:bg-slate-950 min-h-screen transition-colors duration-300">

      <div className="p-8">

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your preferences and account settings.
        </p>


        {/* Account Card */}

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 mt-10 shadow-sm transition-all">

          <div className="flex items-center gap-4">

            <img
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || "User")
                }&background=2563eb&color=fff`
              }
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover"
            />

            <div>

              <h2 className="text-gray-900 dark:text-white text-2xl font-bold">
                {user?.displayName || "User"}
              </h2>

              <p className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>

            </div>

          </div>

        </div>



        {/* Preferences Card */}

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 mt-8 space-y-6 shadow-sm transition-all">

          <h2 className="text-gray-900 dark:text-white text-2xl font-bold">
            Preferences
          </h2>


          <div className="flex justify-between items-center">

            <div className="flex gap-3 items-center">

              <Moon className="text-blue-500 dark:text-blue-400" />

              <span className="text-gray-800 dark:text-white font-medium">
                Dark Mode
              </span>

            </div>


            <Toggle
              enabled={isDarkMode}
              onChange={toggleTheme}
            />

          </div>



          <div className="flex justify-between items-center">

            <div className="flex gap-3 items-center">

              <Bell className="text-yellow-500 dark:text-yellow-400" />

              <span className="text-gray-800 dark:text-white font-medium">
                Notifications
              </span>

            </div>


            <Toggle
              enabled={notifications}
              onChange={() =>
                setNotifications((prev) => !prev)
              }
            />

          </div>



          <div className="flex justify-between items-center">

            <div className="flex gap-3 items-center">

              <Volume2 className="text-green-500 dark:text-green-400" />

              <span className="text-gray-800 dark:text-white font-medium">
                Sound Effects
              </span>

            </div>


            <Toggle
              enabled={sound}
              onChange={() =>
                setSound((prev) => !prev)
              }
            />

          </div>



          <div className="flex justify-between items-center">

            <div className="flex gap-3 items-center">

              <Save className="text-cyan-500 dark:text-cyan-400" />

              <span className="text-gray-800 dark:text-white font-medium">
                Auto Save Answers
              </span>

            </div>


            <Toggle
              enabled={autoSave}
              onChange={() =>
                setAutoSave((prev) => !prev)
              }
            />

          </div>


        </div>




        {/* Danger Zone */}


        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-600/30 rounded-2xl p-6 mt-8 shadow-sm transition-all">


          <h2 className="text-red-600 dark:text-red-400 text-2xl font-bold">
            Danger Zone
          </h2>


          <div className="flex flex-wrap gap-4 mt-6">


            <button
              onClick={handleClearHistory}
              className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all px-6 py-3 rounded-xl text-white flex items-center gap-2 font-semibold shadow-md shadow-red-500/10"
            >

              <Trash2 size={20} />

              Clear Interview History

            </button>



            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 transition-all px-6 py-3 rounded-xl text-gray-800 dark:text-white flex items-center gap-2 font-semibold"
            >

              <LogOut size={20} />

              Logout

            </button>


          </div>


        </div>





        {/* About Card */}


        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 mt-8 shadow-sm transition-all">


          <div className="flex items-center gap-3">

            <Shield className="text-blue-500 dark:text-blue-400" />

            <h2 className="text-gray-900 dark:text-white text-xl font-bold">
              About Application
            </h2>

          </div>


          <div className="mt-4 text-gray-600 dark:text-gray-400 space-y-2 text-sm font-medium">

            <p>
              AI Interview Preparation Platform
            </p>

            <p>
              Version : 1.0.0
            </p>

            <p>
              Developed using React + Firebase + Tailwind CSS
            </p>

          </div>


        </div>


      </div>


    </div>
  );
}


export default Settings;