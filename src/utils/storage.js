export function saveInterview(category, score) {
  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  history.push({
    id: Date.now(),
    category,
    score,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  localStorage.setItem("history", JSON.stringify(history));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem("history")) || [];
}