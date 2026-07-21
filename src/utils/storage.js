export function saveInterview(category, score) {

  const history =
    JSON.parse(localStorage.getItem("history")) || [];


  const interview = {
    id: crypto.randomUUID(),

    category,

    scorePercentage: score,

    completedAt: new Date().toISOString(),
  };


  history.push(interview);


  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

}



export function getHistory() {

  return (
    JSON.parse(
      localStorage.getItem("history")
    ) || []
  );

}



export function deleteInterview(id) {

  const history = getHistory().filter(
    (item) => item.id !== id
  );


  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

}



export function clearHistory() {

  localStorage.removeItem("history");

}