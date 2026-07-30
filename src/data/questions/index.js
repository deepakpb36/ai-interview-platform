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

export function getRandomQuestions(category, count = 5) {
  const questions =
    questionsByCategory[category] ||
    questionsByCategory.html;

  return [...questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export default questionsByCategory;