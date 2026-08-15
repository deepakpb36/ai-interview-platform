export function evaluateAnswer(answer, keywords) {
  const cleanAnswer = answer.trim();

  // ==========================
  // Basic Validation
  // ==========================

  if (!cleanAnswer) {
    return {
      passed: false,
      percentage: 0,
      marks: 0,
      matchedKeywords: [],
      missingKeywords: keywords,
      isSpamDetected: true,
      message:
        "Please provide an answer before continuing.",
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
    [...new Set(
      words.map((word) => word.toLowerCase())
    )].length <
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
      userAnswer.includes(
        keyword.toLowerCase()
      )
    );

  const missingKeywords =
    keywords.filter(
      (keyword) =>
        !matchedKeywords.includes(keyword)
    );

  // ==========================
  // Percentage
  // ==========================

  const percentage =
    keywords.length > 0
      ? Math.round(
          (matchedKeywords.length /
            keywords.length) *
            100
        )
      : 0;

 // ==========================
// PASS RULE
// ==========================
// At least 30% keyword match
// = valid answer
//
// Below 30%
// = invalid answer

const passed =
  percentage >= 30;

  // ==========================
  // Marks
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
  } else if (percentage > 0) {
    marks = 1;
  }
// ==========================
// Feedback Message
// ==========================

let message = "";

if (passed && marks === 5) {
  message =
    "Excellent answer! You covered the important concepts clearly.";
} else if (passed && marks === 4) {
  message =
    "Very good answer. Your response covers most of the important points.";
} else if (passed && marks === 3) {
  message =
    "Good answer. Your response is relevant, but you could explain a few more points.";
} else if (passed && marks === 2) {
  message =
    "Your answer is relevant, but it needs more explanation and detail.";
} else if (passed && marks === 1) {
  message =
    "Your answer is relevant, but please provide a more complete explanation.";
} else {
  message =
    "This answer is not relevant to the question. Please try again.";
}

  // ==========================
  // Final Result
  // ==========================

  return {
    passed,
    percentage,
    marks,
    matchedKeywords,
    missingKeywords,
    isSpamDetected: false,
    message,
  };
}