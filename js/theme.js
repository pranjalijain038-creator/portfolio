const STORAGE_KEY = "portfolio-theme";

export function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    const next = theme === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", `Switch to ${next} mode`);
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    toggle.querySelector("[data-theme-icon]").textContent = theme === "dark" ? "Light" : "Dark";
  }
}

export function initTheme() {
  applyTheme(getPreferredTheme());
  const toggle = document.getElementById("theme-toggle");
  toggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });
}
