import { htmlQuestions } from "./html";
import { cssQuestions } from "./css";
import { javascriptQuestions } from "./javascript";
import { reactQuestions } from "./react";
import { tailwindQuestions } from "./tailwind";

import { frontendQuestions } from "./frontend";
import { backendQuestions } from "./backend";

import { phpQuestions } from "./php";
import { pythonQuestions } from "./python";
import { javaQuestions } from "./java";
import { cQuestions } from "./c";
import { cppQuestions } from "./cpp";
import { csharpQuestions } from "./csharp";

import { aiQuestions } from "./ai";
import { machineLearningQuestions } from "./machineLearning";
import { deepLearningQuestions } from "./deepLearning";

import { hrQuestions } from "./hr";

export const questionsByCategory = {
  html: htmlQuestions,
  css: cssQuestions,
  javascript: javascriptQuestions,
  react: reactQuestions,
  tailwind: tailwindQuestions,

  frontend: frontendQuestions,
  backend: backendQuestions,

  php: phpQuestions,
  python: pythonQuestions,
  java: javaQuestions,
  c: cQuestions,
  cpp: cppQuestions,
  csharp: csharpQuestions,

  ai: aiQuestions,
  "machine-learning": machineLearningQuestions,
  "deep-learning": deepLearningQuestions,

  hr: hrQuestions,
};

function getUserId() {
  try {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    return currentUser?.uid || "guest";
  } catch {
    return "guest";
  }
}

function getUsedQuestionsKey(category) {
  const userId = getUserId();

  return `usedQuestions_${userId}_${category}`;
}

function getUsedQuestionIds(category) {
  try {
    const key = getUsedQuestionsKey(category);

    const usedQuestions =
      JSON.parse(
        localStorage.getItem(key)
      );

    return Array.isArray(usedQuestions)
      ? usedQuestions
      : [];
  } catch {
    return [];
  }
}

function saveUsedQuestionIds(
  category,
  questionIds
) {
  const key = getUsedQuestionsKey(category);

  localStorage.setItem(
    key,
    JSON.stringify(questionIds)
  );
}

export function getRandomQuestions(
  category,
  count = 5
) {
  const questions =
    questionsByCategory[category] ||
    questionsByCategory.html;

  if (!Array.isArray(questions)) {
    return [];
  }

  if (questions.length <= count) {
    return [...questions];
  }

  const usedQuestionIds =
    getUsedQuestionIds(category);

  let availableQuestions =
    questions.filter(
      (question) =>
        !usedQuestionIds.includes(
          question.id
        )
    );

  if (availableQuestions.length < count) {
    availableQuestions = [...questions];
  }

  const shuffledQuestions =
    [...availableQuestions].sort(
      () => Math.random() - 0.5
    );

  return shuffledQuestions.slice(
    0,
    count
  );
}

export function markQuestionsAsUsed(
  category,
  questions
) {
  if (!Array.isArray(questions)) {
    return;
  }

  const currentUsedIds =
    getUsedQuestionIds(category);

  const newQuestionIds =
    questions
      .map((question) => question.id)
      .filter(
        (id) =>
          id !== undefined &&
          id !== null
      );

  const updatedUsedIds = [
    ...new Set([
      ...currentUsedIds,
      ...newQuestionIds,
    ]),
  ];

  saveUsedQuestionIds(
    category,
    updatedUsedIds
  );
}

export function clearUsedQuestions(
  category
) {
  const key =
    getUsedQuestionsKey(category);

  localStorage.removeItem(key);
}

export function getQuestionsByCategory(
  category
) {
  return (
    questionsByCategory[category] ||
    questionsByCategory.html
  );
}

export default questionsByCategory;