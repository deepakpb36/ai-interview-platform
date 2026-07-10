function Navbar() {
  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      <div>
        <h2 className="text-white text-2xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-400">
          Welcome back, Deepak 👋
        </p>
      </div>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search..."
          className="bg-slate-800 text-white px-4 py-2 rounded-lg outline-none"
        />

        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          D
        </div>

      </div>

    </header>
  );
}

export default Navbar;