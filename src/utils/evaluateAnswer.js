export function evaluateAnswer(answer, keywords) {
  const cleanAnswer = answer.trim();

  // ==========================
  // Basic Validation
  // ==========================

  if (cleanAnswer.length < 15) {
    return {
      passed: false,
      percentage: 0,
      marks: 0,
      matchedKeywords: [],
      missingKeywords: keywords,
      isSpamDetected: true,
      message:
        "Your answer is too short. Please explain your answer in more detail.",
    };
  }

  // ==========================
  // Spam Detection
  // ==========================

  const nonLetters =
    cleanAnswer.replace(/[a-zA-Z\s]/g, "").length;

  const spamRatio =
    nonLetters / cleanAnswer.length;

  const words =
    cleanAnswer.split(/\s+/);

  const repeatedWords =
    [...new Set(words)].length <
    words.length / 2;

  if (
    spamRatio > 0.40 ||
    repeatedWords ||
    words.some((word) => word.length > 25)
  ) {
    return {
      passed: false,
      percentage: 0,
      marks: 0,
      matchedKeywords: [],
      missingKeywords: keywords,
      isSpamDetected: true,
      message:
        "Spam or invalid answer detected. Please answer properly.",
    };
  }

  // ==========================
  // Keyword Matching
  // ==========================

  const userAnswer =
    cleanAnswer.toLowerCase();

  const matchedKeywords =
    keywords.filter((keyword) =>
      userAnswer.includes(keyword.toLowerCase())
    );

  const missingKeywords =
    keywords.filter(
      (keyword) =>
        !matchedKeywords.includes(keyword)
    );

  const percentage = Math.round(
    (matchedKeywords.length /
      keywords.length) *
      100
  );

  // ==========================
  // Marks Calculation
  // ==========================

  let marks = 0;

  if (percentage >= 90) {
    marks = 5;
  } else if (percentage >= 70) {
    marks = 4;
  } else if (percentage >= 50) {
    marks = 3;
  } else if (percentage >= 30) {
    marks = 2;
  } else if (percentage >= 10) {
    marks = 1;
  }

  // ==========================
  // Feedback Message
  // ==========================

  let message = "";

  if (marks === 5) {
    message =
      "Excellent answer! You covered almost every important concept.";
  } else if (marks === 4) {
    message =
      "Very good answer. Only a few important points are missing.";
  } else if (marks === 3) {
    message =
      "Good answer, but you should explain more concepts.";
  } else if (marks === 2) {
    message =
      "Basic understanding shown, but several important points are missing.";
  } else {
    message =
      "Your answer needs significant improvement. Try explaining the topic in more detail.";
  }

  // ==========================
  // Final Result
  // ==========================

  return {
    passed: marks >= 3,
    percentage,
    marks,
    matchedKeywords,
    missingKeywords,
    isSpamDetected: false,
    message,
  };
}