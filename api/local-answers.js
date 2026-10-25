import { isConfiguredEmail, isConfiguredUrl, portfolio } from "../shared/portfolio.js";

function normalize(text) {
  return String(text || "").toLowerCase();
}

function findProject(question) {
  const q = normalize(question);
  return portfolio.projects.find((project) => {
    const hay = `${project.title} ${project.id} ${project.technologies.join(" ")}`.toLowerCase();
    if (q.includes("python programs") || q.includes("factorial") || q.includes("fibonacci")) {
      return project.id === "python-programs";
    }
    if (q.includes("messy") || q.includes("readable") || q.includes("maintainable")) {
      return project.id === "messy-python";
    }
    if (q.includes("bug") || q.includes("cursor") || q.includes("debug")) {
      return project.id === "bug-fixing-cursor";
    }
    if (q.includes("quiz")) return project.id === "quiz-app";
    if (q.includes("book") || q.includes("reading list")) return project.id === "book-list";
    return hay.split(" ").some((word) => word.length > 3 && q.includes(word));
  });
}

function formatProject(project) {
  const github = isConfiguredUrl(project.githubUrl)
    ? project.githubUrl
    : "a GitHub repository link has not been provided yet";
  const live = isConfiguredUrl(project.liveUrl)
    ? project.liveUrl
    : "a live application link has not been provided yet";
  return `${project.title}: ${project.description} Technologies: ${project.technologies.join(", ")}. GitHub: ${github}. Live demo: ${live}.`;
}

export function localPortfolioAnswer(question) {
  const q = normalize(question);

  if (q.includes("who are you") || q.includes("your name") || q.includes("about you")) {
    return `I am the portfolio assistant for ${portfolio.name}, a ${portfolio.degree} student at ${portfolio.university}. ${portfolio.introduction}`;
  }

  if (q.includes("skill") || q.includes("technolog")) {
    const skills = portfolio.skills.map((skill) => `${skill.name} (${skill.level})`).join(", ");
    return `${portfolio.name} is developing skills in ${skills}. These are student learning areas, not claims of professional expertise.`;
  }

  if (q.includes("project") && !findProject(question)) {
    return `${portfolio.name} has five academic projects on this website: ${portfolio.projects
      .map((project) => project.title)
      .join("; ")}.`;
  }

  const project = findProject(question);
  if (project) return formatProject(project);

  if (q.includes("github") || q.includes("contact") || q.includes("email") || q.includes("linkedin")) {
    const email = isConfiguredEmail(portfolio.contact.email)
      ? portfolio.contact.email
      : "not provided";
    const github = isConfiguredUrl(portfolio.contact.github)
      ? portfolio.contact.github
      : "not provided";
    const linkedin = isConfiguredUrl(portfolio.contact.linkedin)
      ? portfolio.contact.linkedin
      : "not provided";
    return `Contact details currently configured: email ${email}; GitHub ${github}; LinkedIn ${linkedin}. Missing values must be added in shared/portfolio.js.`;
  }

  if (q.includes("education") || q.includes("university") || q.includes("college") || q.includes("student")) {
    const note = portfolio.academicLevelVerified ? "" : ` ${portfolio.academicLevelNote}.`;
    return `${portfolio.name} is studying ${portfolio.degree} at ${portfolio.university}. Academic level: ${portfolio.academicLevel}.${note}`;
  }

  return "That detail is not provided in this portfolio. I can answer questions about Pranjali Jain's introduction, education, skills, contact configuration, and the five listed projects.";
}
