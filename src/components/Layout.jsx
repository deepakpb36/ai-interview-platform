import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="h-screen flex bg-slate-100 dark:bg-slate-950 overflow-hidden">

      {/* Sidebar */}
      {!isAdminPage && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      {/* Mobile Overlay */}
      {!isAdminPage && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col min-w-0 ${
          isAdminPage ? "" : "lg:ml-72"
        }`}
      >

        {/* Navbar */}
        {!isAdminPage && (
          <Navbar setSidebarOpen={setSidebarOpen} />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default Layout;