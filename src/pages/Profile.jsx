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

  const userName =
    user?.displayName?.trim() ||
    (user?.email
      ? user.email.split("@")[0]
      : "Guest User");

  const userEmail =
    user?.email || "No Email";

  const userPhoto =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName
    )}&background=2563eb&color=ffffff&size=256`;

  const totalInterviews = history.length;

  const scores = history.map((item) =>
    Number(item.scorePercentage ?? item.score ?? 0)
  );

  const averageScore =
    totalInterviews > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) /
            totalInterviews
        )
      : 0;

  const bestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  const practiceTime = totalInterviews * 15;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950 overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">

        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          <div className="max-w-7xl mx-auto w-full space-y-8">

            {/* Heading */}

            <div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mt-2">
                View your account information and interview statistics.
              </p>

            </div>

            {/* Profile Card */}

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">

              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">

                <img
                  src={userPhoto}
                  alt={userName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-blue-600 object-cover"
                />

                <div className="text-center lg:text-left flex-1">

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {userName}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mt-2 break-all">
                    {userEmail}
                  </p>

                  <span className="inline-block mt-4 px-4 py-2 bg-green-600 rounded-full text-white text-sm font-medium">
                    Active User
                  </span>

                </div>

              </div>

              {/* Statistics */}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

                <StatCard
                  title="Interviews"
                  value={totalInterviews}
                />

                <StatCard
                  title="Average Score"
                  value={`${averageScore}%`}
                  green
                />

                <StatCard
                  title="Best Score"
                  value={`${bestScore}%`}
                  yellow
                />

                <StatCard
                  title="Practice Time"
                  value={`${practiceTime} min`}
                  cyan
                />

              </div>

              {/* Account Information */}

              <div className="mt-10">

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Account Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <InfoCard
                    title="Full Name"
                    value={userName}
                  />

                  <InfoCard
                    title="Email Address"
                    value={userEmail}
                  />

                  <InfoCard
                    title="Account Status"
                    value="Active"
                  />

                  <InfoCard
                    title="Interview Platform"
                    value="AI Interview Prep"
                  />

                </div>

              </div>

              {/* Logout */}

              <div className="mt-10">

                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl text-white font-semibold transition"
                >
                  Logout
                </button>

              </div>

            </div>          </div>

        </main>

      </div>

    </div>

  );
}

function StatCard({
  title,
  value,
  green,
  yellow,
  cyan,
}) {
  return (

    <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-6 text-center">

      <h3 className="text-gray-500 dark:text-gray-400 font-medium">
        {title}
      </h3>

      <h2
        className={`text-3xl sm:text-4xl font-bold mt-3 ${
          green
            ? "text-green-600"
            : yellow
            ? "text-yellow-600"
            : cyan
            ? "text-cyan-600"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </h2>

    </div>

  );
}

function InfoCard({
  title,
  value,
}) {
  return (

    <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5">

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-2 break-all">
        {value}
      </h3>

    </div>

  );
}

export default Profile;