import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Logout Failed");
    }
  };

  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      <div>
        <h2 className="text-white text-2xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-400">
          Welcome back, {user?.displayName || "User"} 👋
        </p>
      </div>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search..."
          className="bg-slate-800 text-white px-4 py-2 rounded-lg outline-none"
        />

        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-11 h-11 rounded-full border-2 border-blue-500"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {user?.displayName
              ? user.displayName.charAt(0).toUpperCase()
              : "U"}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;