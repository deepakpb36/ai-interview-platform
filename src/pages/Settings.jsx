import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { clearHistory } from "../utils/storage";
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

  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

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
      onClick={() => onChange(!enabled)}
      className={`w-14 h-8 rounded-full transition ${
        enabled ? "bg-blue-600" : "bg-slate-700"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full mt-1 transition ${
          enabled ? "ml-7" : "ml-1"
        }`}
      ></div>
    </button>
  );

  return (
    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <h1 className="text-4xl font-bold text-white">
            Settings
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your preferences and account settings.
          </p>

          {/* Account */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-10">

            <div className="flex items-center gap-4">

              <img
                src={
                  user?.photoURL ||
                  "https://ui-avatars.com/api/?name=User"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-blue-500"
              />

              <div>

                <h2 className="text-white text-2xl font-bold">
                  {user?.displayName || "User"}
                </h2>

                <p className="text-gray-400">
                  {user?.email}
                </p>

              </div>

            </div>

          </div>

          {/* Preferences */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8 space-y-6">

            <h2 className="text-white text-2xl font-bold">
              Preferences
            </h2>

            <div className="flex justify-between items-center">

              <div className="flex gap-3 items-center">

                <Moon className="text-blue-400" />

                <span className="text-white">
                  Dark Mode
                </span>

              </div>

              <Toggle enabled={darkMode} onChange={setDarkMode} />

            </div>

            <div className="flex justify-between items-center">

              <div className="flex gap-3 items-center">

                <Bell className="text-yellow-400" />

                <span className="text-white">
                  Notifications
                </span>

              </div>

              <Toggle enabled={notifications} onChange={setNotifications} />

            </div>

            <div className="flex justify-between items-center">

              <div className="flex gap-3 items-center">

                <Volume2 className="text-green-400" />

                <span className="text-white">
                  Sound Effects
                </span>

              </div>

              <Toggle enabled={sound} onChange={setSound} />

            </div>

            <div className="flex justify-between items-center">

              <div className="flex gap-3 items-center">

                <Save className="text-cyan-400" />

                <span className="text-white">
                  Auto Save Answers
                </span>

              </div>

              <Toggle enabled={autoSave} onChange={setAutoSave} />

            </div>

          </div>

          {/* Danger Zone */}

          <div className="bg-slate-900 border border-red-600 rounded-2xl p-6 mt-8">

            <h2 className="text-red-400 text-2xl font-bold">
              Danger Zone
            </h2>

            <div className="flex flex-wrap gap-4 mt-6">

              <button
                onClick={handleClearHistory}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-white flex items-center gap-2"
              >
                <Trash2 size={20} />
                Clear Interview History
              </button>

              <button
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl text-white flex items-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </button>

            </div>

          </div>

          {/* About */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">

            <div className="flex items-center gap-3">

              <Shield className="text-blue-400" />

              <h2 className="text-white text-xl font-bold">
                About Application
              </h2>

            </div>

            <div className="mt-4 text-gray-400 space-y-2">

              <p>AI Interview Preparation Platform</p>
              <p>Version : 1.0.0</p>
              <p>Developed using React + Firebase + Tailwind CSS</p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;