import { localPortfolioAnswer } from "../api/local-answers.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const who = localPortfolioAnswer("Who are you?");
assert(who.includes("Pranjali Jain"), "Identity answers should include the student name.");

const skills = localPortfolioAnswer("What are your technical skills?");
assert(skills.toLowerCase().includes("python"), "Skills answers should mention Python.");

const projects = localPortfolioAnswer("What projects have you completed?");
assert(projects.includes("Python Programs Collection"), "Project list should include project 1.");
assert(projects.includes("Book Reading List Application"), "Project list should include project 5.");

const python = localPortfolioAnswer("Explain your Python Programs Collection.");
assert(python.includes("factorial"), "Python project answers should use the configured description.");

const bug = localPortfolioAnswer("What is the Bug Fixing Using Cursor AI project?");
assert(bug.includes("Cursor AI"), "Bug-fixing answers should mention Cursor AI.");

const books = localPortfolioAnswer("What does your Book Reading List Application do?");
assert(books.toLowerCase().includes("reading list"), "Book app answers should mention the reading list.");

const missing = localPortfolioAnswer("What internship did you complete at Google?");
assert(missing.toLowerCase().includes("not provided"), "Unknown personal claims must not be invented.");

console.log("local chatbot tests passed");
