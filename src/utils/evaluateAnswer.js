export function evaluateAnswer(answer, keywords) {
  const cleanAnswer = answer.trim();

  // 1. Spam/Validation check
  const nonLetters = cleanAnswer.replace(/[a-zA-Z\s]/g, "").length;
  const spamRatio = nonLetters / (cleanAnswer.length || 1);
  const words = cleanAnswer.split(/\s+/);
  
  if (spamRatio > 0.4 || words.some(w => w.length > 25) || cleanAnswer.length < 8) {
    return { passed: false, percentage: 0, marks: 0, matchedKeywords: [], missingKeywords: keywords, isSpamDetected: true };
  }

  // 2. Keyword Matching
  const userAnswerLower = cleanAnswer.toLowerCase();
  const matched = keywords.filter((kw) => new RegExp(`\\b${kw.toLowerCase()}\\b`, "g").test(userAnswerLower));
  
  const percentage = Math.round((matched.length / keywords.length) * 100);

  // 3. Scoring
  let marks = 1;
  if (percentage >= 80) marks = 5;
  else if (percentage >= 60) marks = 4;
  else if (percentage >= 40) marks = 3;
  else if (percentage >= 20) marks = 2;

  return {
    passed: marks >= 3,
    percentage,
    marks,
    matchedKeywords: matched,
    missingKeywords: keywords.filter((kw) => !matched.includes(kw)),
    isSpamDetected: false
  };
}