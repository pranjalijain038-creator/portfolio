import { portfolio } from "../shared/portfolio.js";
import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { renderPage } from "./render.js";
import { initSearch } from "./search.js";
import { initChatbot } from "./chatbot.js";

initTheme();
initNav();
renderPage(portfolio);
initSearch(portfolio.projects);
initChatbot();
