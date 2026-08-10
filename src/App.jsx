import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import InterviewSelection from "./pages/InterviewSelection";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function AdminProtectedRoute({ children }) {
  const isAdmin =
    localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/interview"
          element={<InterviewSelection />}
        />

        <Route
          path="/interview/:category"
          element={<Interview />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;