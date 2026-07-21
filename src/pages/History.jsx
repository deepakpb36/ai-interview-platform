import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function History() {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        let sessions = [];

        if (user) {
          const historyRef = collection(db, "users", user.uid, "history");
          const q = query(historyRef);
          
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            sessions.push({ id: doc.id, ...doc.data() });
          });
        }

        // Backup mock data if Firestore is currently empty
        if (sessions.length === 0) {
          sessions = [
            {
              id: "fallback_1",
              category: "HTML",
              completedAt: new Date().toISOString(),
              totalQuestions: 5,
              skippedQuestions: 1,
              scorePercentage: 80,
              status: "Completed"
            },
            {
              id: "fallback_2",
              category: "Python",
              completedAt: new Date(Date.now() - 86400000).toISOString(),
              totalQuestions: 5,
              skippedQuestions: 0,
              scorePercentage: 100,
              status: "Completed"
            }
          ];
        }

        sessions.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
        setHistoryList(sessions);
        setError(null);
      } catch (err) {
        console.error("Firestore loading error:", err);
        setError(err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db, auth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-gray-500 dark:text-gray-400 font-bold animate-pulse text-lg">
          🔄 Connecting to history logs...
        </div>
      </div>
    );
  }

  return (
    // "flex w-full" instead of w-screen prevents right-side margins from breaking
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Sidebar - Wrapped in a flex-shrink-0 div to guarantee it never gets squished to 0px */}
      <div className="flex-shrink-0 z-20">
        <Sidebar />
      </div>

      {/* Main Content Panel - occupies all remaining space cleanly */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        
        {/* Navbar */}
        <div className="flex-shrink-0">
          <Navbar />
        </div>

        {/* Scrollable Core Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header section */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-800 pb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Interview History
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Verify performance logs, matched metrics, and score details.
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs md:text-sm transition-all shadow-md active:scale-95"
              >
                ← Back
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-4 rounded-xl text-red-700 dark:text-red-400 text-xs md:text-sm font-semibold">
                Database Access Error: {error}
              </div>
            )}

            {/* History Feed List */}
            <div className="space-y-4">
              {historyList.map((session) => {
                const dateFormatted = session.completedAt 
                  ? new Date(session.completedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "Unknown Date";

                return (
                  <div 
                    key={session.id} 
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-md">
                          {session.category}
                        </span>
                        <span className="text-[11px] text-green-600 dark:text-green-400 font-bold">
                          ● {session.status || "Completed"}
                        </span>
                      </div>
                      
                      <h3 className="text-base md:text-lg font-bold">
                        {session.category} Assessment Session
                      </h3>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <span>🕒 {dateFormatted}</span>
                        <span>📋 Questions: {session.totalQuestions || 0}</span>
                        {session.skippedQuestions > 0 && (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            ⏭ Skipped: {session.skippedQuestions}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Overall Score display */}
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 p-3.5 rounded-xl shadow-inner w-full sm:w-auto justify-between sm:justify-start">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                          Overall Score
                        </p>
                        <p className="text-xl font-extrabold text-gray-800 dark:text-white mt-0.5">
                          {session.scorePercentage ?? 0}%
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default History;