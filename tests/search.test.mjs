import { filterProjects, portfolio } from "../shared/portfolio.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const all = portfolio.projects;
assert(all.length === 5, "There must be exactly five projects.");

const python = filterProjects(all, "Python");
assert(
  python.some((item) => item.id === "python-programs"),
  "Python search should include Python Programs Collection."
);
assert(
  python.some((item) => item.id === "messy-python"),
  "Python search should include Messy Python Code Improvement."
);

const quiz = filterProjects(all, "Quiz");
assert(quiz.length === 1 && quiz[0].id === "quiz-app", "Quiz search should show the quiz app.");

const book = filterProjects(all, "Book");
assert(book.length === 1 && book[0].id === "book-list", "Book search should show the reading list app.");

const cursor = filterProjects(all, "Cursor AI");
assert(
  cursor.some((item) => item.id === "bug-fixing-cursor"),
  "Cursor AI search should show the debugging project."
);

const none = filterProjects(all, "zzzz-not-a-project");
assert(none.length === 0, "Unknown queries should return no projects.");

const mixedCase = filterProjects(all, "pYtHoN");
assert(mixedCase.length >= 2, "Search must be case-insensitive.");

console.log("search tests passed");
