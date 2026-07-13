import { getAuth } from "firebase/auth";

function Navbar() {
  const auth = getAuth();
  const user = auth.currentUser;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      {/* Left */}

      <div>
        <h2 className="text-white text-2xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-400 mt-1">
          Welcome back, {user?.displayName || "Deepak"} 👋
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <div className="hidden md:block text-right">

          <p className="text-gray-400 text-sm">
            Today
          </p>

          <p className="text-white font-semibold">
            {today}
          </p>

        </div>

        <input
          type="text"
          placeholder="Search..."
          className="bg-slate-800 text-white px-4 py-2 rounded-lg outline-none border border-slate-700 focus:border-blue-500"
        />

        <img
          src={
            user?.photoURL ||
            "https://ui-avatars.com/api/?name=Deepak&background=2563eb&color=ffffff"
          }
          alt="Profile"
          className="w-11 h-11 rounded-full border-2 border-blue-500 object-cover"
        />

      </div>

    </header>
  );
}

export default Navbar;