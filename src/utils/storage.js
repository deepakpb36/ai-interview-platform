import { getAuth } from "firebase/auth";

function getStorageKey() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return "history_guest";
  }

  return `history_${user.uid}`;
}

export function saveInterview(category, score) {
  const auth = getAuth();
  const user = auth.currentUser;

  const key = getStorageKey();

  const history =
    JSON.parse(localStorage.getItem(key)) || [];

  const interview = {
    id: crypto.randomUUID(),

    // User Information
    userId: user?.uid || "guest",
    userName: user?.displayName || "Guest User",
    email: user?.email || "guest@example.com",

    // Interview Information
    category,
    scorePercentage: score,
    completedAt: new Date().toISOString(),
  };

  history.push(interview);

  localStorage.setItem(
    key,
    JSON.stringify(history)
  );

  return interview;
}

export function getHistory() {
  const key = getStorageKey();

  const history =
    JSON.parse(localStorage.getItem(key)) || [];

  history.sort((a, b) => {
    return (
      new Date(b.completedAt) -
      new Date(a.completedAt)
    );
  });

  return history;
}

export function deleteInterview(id) {
  const key = getStorageKey();

  const history = getHistory().filter(
    (item) => item.id !== id
  );

  localStorage.setItem(
    key,
    JSON.stringify(history)
  );
}

export function getStatistics() {
  const history = getHistory();

  const totalInterviews =
    history.length;

  const scores = history.map(
    (item) => Number(item.scorePercentage || 0)
  );

  const averageScore =
    totalInterviews === 0
      ? 0
      : Math.round(
          scores.reduce(
            (sum, score) => sum + score,
            0
          ) / totalInterviews
        );

  const highestScore =
    scores.length === 0
      ? 0
      : Math.max(...scores);

  return {
    totalInterviews,
    averageScore,
    highestScore,
    practiceMinutes:
      totalInterviews * 10,
  };
}

export function clearHistory() {
  const key = getStorageKey();

  localStorage.removeItem(key);
}

export function updateInterview(id, updatedData) {
  const key = getStorageKey();

  const history = getHistory();

  const updatedHistory =
    history.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...updatedData,
        };
      }

      return item;
    });

  localStorage.setItem(
    key,
    JSON.stringify(updatedHistory)
  );
}