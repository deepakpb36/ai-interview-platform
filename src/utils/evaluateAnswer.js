export function evaluateAnswer(answer, keywords) {
  if (!answer.trim()) {
    return {
      score: 0,
      message: "Please enter your answer.",
      color: "red",
      canProceed: false,
    };
  }

  const userAnswer = answer.toLowerCase();

  let matchedKeywords = 0;

  keywords.forEach((keyword) => {
    if (userAnswer.includes(keyword.toLowerCase())) {
      matchedKeywords++;
    }
  });

  const percentage = (matchedKeywords / keywords.length) * 100;

  if (percentage >= 80) {
    return {
      score: 5,
      message: "Excellent answer! Great job.",
      color: "green",
      canProceed: true,
    };
  }

  if (percentage >= 60) {
    return {
      score: 4,
      message: "Very good answer. You covered most concepts.",
      color: "green",
      canProceed: true,
    };
  }

  if (percentage >= 40) {
    return {
      score: 3,
      message: "Good answer, but add more details.",
      color: "yellow",
      canProceed: true,
    };
  }

  if (percentage >= 20) {
    return {
      score: 2,
      message: "Partially correct. Try explaining more clearly.",
      color: "orange",
      canProceed: true,
    };
  }

  return {
    score: 0,
    message:
      "Your answer doesn't appear to be related to the question. Please answer again.",
    color: "red",
    canProceed: false,
  };
}