import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);
  const { theme } = useTheme();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
        <h1 className="text-2xl font-bold animate-pulse">
          Loading...
        </h1>
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;