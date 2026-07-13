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
    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <h1 className="text-4xl font-bold text-white">
            My Profile
          </h1>

          <p className="text-gray-400 mt-2">
            View your account information and interview statistics.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 mt-10">

            <div className="flex items-center gap-8">

              <img
                src={
                  user?.photoURL ||
                  "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-600"
              />

              <div>

                <h2 className="text-3xl font-bold text-white">
                  {user?.displayName || "Guest User"}
                </h2>

                <p className="text-gray-400 mt-2">
                  {user?.email || "No Email"}
                </p>

                <span className="inline-block mt-4 px-4 py-2 bg-green-600 rounded-full text-white">
                  Active User
                </span>

              </div>

            </div>

            <div className="grid grid-cols-4 gap-6 mt-12">

              <div className="bg-slate-800 rounded-2xl p-6 text-center">
                <h3 className="text-gray-400">
                  Interviews
                </h3>

                <h2 className="text-4xl font-bold text-white mt-3">
                  {totalInterviews}
                </h2>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6 text-center">
                <h3 className="text-gray-400">
                  Average Score
                </h3>

                <h2 className="text-4xl font-bold text-green-400 mt-3">
                  {averageScore}%
                </h2>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6 text-center">
                <h3 className="text-gray-400">
                  Best Score
                </h3>

                <h2 className="text-4xl font-bold text-yellow-400 mt-3">
                  {bestScore}%
                </h2>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6 text-center">
                <h3 className="text-gray-400">
                  Practice Time
                </h3>

                <h2 className="text-4xl font-bold text-cyan-400 mt-3">
                  {practiceTime} min
                </h2>
              </div>

            </div>

            <div className="mt-12">

              <h2 className="text-2xl font-bold text-white mb-6">
                Account Information
              </h2>

              <div className="grid grid-cols-2 gap-6">

                <div className="bg-slate-800 rounded-xl p-5">
                  <p className="text-gray-400">
                    Full Name
                  </p>

                  <h3 className="text-white text-xl mt-2">
                    {user?.displayName || "Guest User"}
                  </h3>
                </div>

                <div className="bg-slate-800 rounded-xl p-5">
                  <p className="text-gray-400">
                    Email Address
                  </p>

                  <h3 className="text-white text-xl mt-2">
                    {user?.email || "No Email"}
                  </h3>
                </div>

                <div className="bg-slate-800 rounded-xl p-5">
                  <p className="text-gray-400">
                    Account Status
                  </p>

                  <h3 className="text-green-400 text-xl mt-2">
                    Active
                  </h3>
                </div>

                <div className="bg-slate-800 rounded-xl p-5">
                  <p className="text-gray-400">
                    Interview Platform
                  </p>

                  <h3 className="text-white text-xl mt-2">
                    AI Interview Prep
                  </h3>
                </div>

              </div>

            </div>

            <div className="mt-12">

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 transition px-8 py-3 rounded-xl text-white font-semibold"
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