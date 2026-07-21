import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getHistory } from "../utils/storage";

function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const history = getHistory();

  const totalInterviews = history.length;

  const averageScore =
    totalInterviews > 0
      ? Math.round(
          history.reduce((sum, item) => sum + item.score, 0) /
            totalInterviews
        )
      : 0;

  const bestScore =
    totalInterviews > 0
      ? Math.max(...history.map((item) => item.score))
      : 0;

  const practiceTime = totalInterviews * 15;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="flex bg-gray-100 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View your account information and interview statistics.
          </p>

          {/* Main Card Container */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-10 mt-10 shadow-lg transition">
            
            {/* Header / Avatar Row */}
            <div className="flex items-center gap-8">
              <img
                src={
                  user?.photoURL ||
                  "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover"
              />

              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.displayName || "Guest User"}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {user?.email || "No Email"}
                </p>

                <span className="inline-block mt-4 px-4 py-2 bg-green-600 rounded-full text-white font-medium text-sm">
                  Active User
                </span>
              </div>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200/50 dark:border-none rounded-2xl p-6 text-center transition">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">
                  Interviews
                </h3>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-3">
                  {totalInterviews}
                </h2>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200/50 dark:border-none rounded-2xl p-6 text-center transition">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">
                  Average Score
                </h3>
                <h2 className="text-4xl font-bold text-green-600 dark:text-green-400 mt-3">
                  {averageScore}%
                </h2>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200/50 dark:border-none rounded-2xl p-6 text-center transition">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">
                  Best Score
                </h3>
                <h2 className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mt-3">
                  {bestScore}%
                </h2>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200/50 dark:border-none rounded-2xl p-6 text-center transition">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">
                  Practice Time
                </h3>
                <h2 className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mt-3">
                  {practiceTime} min
                </h2>
              </div>
            </div>

            {/* Details Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Account Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200/50 dark:border-none rounded-xl p-5 transition">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Full Name
                  </p>
                  <h3 className="text-gray-900 dark:text-white text-xl mt-2 font-semibold">
                    {user?.displayName || "Guest User"}
                  </h3>
                </div>

                <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200/50 dark:border-none rounded-xl p-5 transition">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Email Address
                  </p>
                  <h3 className="text-gray-900 dark:text-white text-xl mt-2 font-semibold">
                    {user?.email || "No Email"}
                  </h3>
                </div>

                <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200/50 dark:border-none rounded-xl p-5 transition">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Account Status
                  </p>
                  <h3 className="text-green-600 dark:text-green-400 text-xl mt-2 font-semibold">
                    Active
                  </h3>
                </div>

                <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200/50 dark:border-none rounded-xl p-5 transition">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Interview Platform
                  </p>
                  <h3 className="text-gray-900 dark:text-white text-xl mt-2 font-semibold">
                    AI Interview Prep
                  </h3>
                </div>
              </div>
            </div>

            {/* Logout Action CTA */}
            <div className="mt-12">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all px-8 py-3 rounded-xl text-white font-semibold shadow-md shadow-red-500/10"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;