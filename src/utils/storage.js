export function saveInterview(category, score) {
  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  const interview = {
    id: crypto.randomUUID(),
    category,
    score,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };

  history.push(interview);

  localStorage.setItem("history", JSON.stringify(history));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem("history")) || [];
}

export function deleteInterview(id) {
  const history = getHistory().filter((item) => item.id !== id);

  localStorage.setItem("history", JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem("history");
}