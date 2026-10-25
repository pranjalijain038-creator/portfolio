import { filterProjects } from "../shared/portfolio.js";
import { renderProjects } from "./render.js";

export function initSearch(allProjects) {
  const input = document.getElementById("project-search");
  const clear = document.getElementById("clear-search");
  if (!input || !clear) return;

  const apply = () => {
    const results = filterProjects(allProjects, input.value);
    renderProjects(results);
  };

  input.addEventListener("input", apply);
  clear.addEventListener("click", () => {
    input.value = "";
    input.focus();
    apply();
  });
}
