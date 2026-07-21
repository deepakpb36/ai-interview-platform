export const INTERVIEW_QUESTIONS = {
  html: [
    {
      id: 1,
      question: "What is the difference between Block and Inline elements in HTML?",
      keywords: ["block", "inline", "width", "margin", "padding", "line", "div", "span", "display"]
    },
    {
      id: 2,
      question: "What are semantic HTML tags, and why are they important?",
      keywords: ["semantic", "seo", "accessibility", "meaning", "header", "footer", "article", "screen reader"]
    },
    {
      id: 3,
      question: "Explain the purpose and structure of HTML5 'data-' attributes.",
      keywords: ["data-", "dataset", "attribute", "custom", "store", "javascript", "prefix"]
    },
    {
      id: 4,
      question: "How do you optimize an HTML page's loading performance and SEO metadata?",
      keywords: ["meta", "viewport", "async", "defer", "preload", "minify", "alt", "title", "performance"]
    },
    {
      id: 5,
      question: "What is the purpose of the 'alt' attribute on an image tag?",
      keywords: ["alt", "accessibility", "screen reader", "fallback", "broken image", "seo", "description"]
    }
  ],
  python: [
    {
      id: 1,
      question: "What is the difference between Python list and tuple?",
      keywords: ["mutable", "immutable", "tuple", "list", "brackets", "parentheses", "speed", "memory"]
    },
    {
      id: 2,
      question: "How does memory management work in Python?",
      keywords: ["garbage collector", "reference counting", "private heap", "memory", "allocator", "sys", "cycles"]
    },
    {
      id: 3,
      question: "What are decorators in Python and how do you write one?",
      keywords: ["decorator", "function", "wrapper", "modify", "syntactic sugar", "@", "arguments", "return"]
    },
    {
      id: 4,
      question: "What is the difference between deep copy and shallow copy in Python?",
      keywords: ["copy", "deepcopy", "shallow", "reference", "nested", "object", "clone", "address"]
    },
    {
      id: 5,
      question: "Explain generators and the 'yield' keyword in Python.",
      keywords: ["generator", "yield", "iterator", "lazy evaluation", "memory", "next", "state", "stream"]
    }
  ],
  java: [
    {
      id: 1,
      question: "Explain the pillars of Object-Oriented Programming (OOPs) in Java.",
      keywords: ["encapsulation", "inheritance", "polymorphism", "abstraction", "class", "interface", "extend"]
    },
    {
      id: 2,
      question: "What is the difference between JDK, JRE, and JVM?",
      keywords: ["jdk", "jre", "jvm", "development", "runtime", "virtual machine", "compiler", "bytecode"]
    },
    {
      id: 3,
      question: "How does Garbage Collection work in Java?",
      keywords: ["garbage collection", "gc", "heap", "stack", "finalize", "unreachable", "system.gc", "memory"]
    },
    {
      id: 4,
      question: "What is the difference between an Abstract Class and an Interface in Java?",
      keywords: ["abstract", "interface", "multiple inheritance", "implementation", "static", "final", "methods"]
    },
    {
      id: 5,
      question: "What are Java Exceptions? Explain the difference between checked and unchecked exceptions.",
      keywords: ["checked", "unchecked", "exception", "runtime", "try", "catch", "throw", "error"]
    }
  ],
  hr: [
    {
      id: 1,
      question: "Tell me about yourself and why you are interested in this role.",
      keywords: ["experience", "background", "passionate", "align", "career", "skills", "growth", "interest"]
    },
    {
      id: 2,
      question: "Describe a time you faced a difficult challenge in a project and how you resolved it.",
      keywords: ["challenge", "resolve", "problem-solving", "action", "learned", "teamwork", "outcome", "star"]
    },
    {
      id: 3,
      question: "How do you handle tight deadlines or working under intense pressure?",
      keywords: ["prioritize", "schedule", "focus", "planning", "calm", "communication", "delegate", "break"]
    },
    {
      id: 4,
      question: "Why should we hire you over other qualified candidates?",
      keywords: ["unique", "dedication", "culture", "fast learner", "value", "contribution", "skills", "adaptable"]
    },
    {
      id: 5,
      question: "Where do you see yourself in the next 3 to 5 years?",
      keywords: ["growth", "leadership", "expertise", "learning", "contributing", "future", "goals", "long-term"]
    }
  ]
};

// Exporting as default as well, to prevent any imports from failing!
export default INTERVIEW_QUESTIONS;