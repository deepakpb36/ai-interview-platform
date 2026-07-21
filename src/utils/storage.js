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
  const key = getStorageKey();

  const history =
    JSON.parse(localStorage.getItem(key)) || [];

  history.push({
    id: crypto.randomUUID(),
    category,
    scorePercentage: score,
    completedAt: new Date().toISOString(),
  });

  localStorage.setItem(
    key,
    JSON.stringify(history)
  );
}

export function getHistory() {
  const key = getStorageKey();

  return JSON.parse(localStorage.getItem(key)) || [];
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

export function clearHistory() {
  const key = getStorageKey();

  localStorage.removeItem(key);
}