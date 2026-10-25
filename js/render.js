import {
  isConfiguredEmail,
  isConfiguredUrl,
} from "../shared/portfolio.js";

function iconSvg(name) {
  const icons = {
    code: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
    spark:
      '<polygon points="12 2 15 8.5 22 9.3 17 14.2 18.4 21 12 17.8 5.6 21 7 14.2 2 9.3 9 8.5 12 2"></polygon>',
    bug: '<rect x="8" y="9" width="8" height="10" rx="2"></rect><path d="M12 9V5M8 13H4M20 13h-4M7 19l-2 2M17 19l2 2M7 9L5 7M17 9l2-2"></path>',
    quiz: '<path d="M9 10a3 3 0 1 1 5.2 2.1C13.2 13.2 12 14 12 16"></path><circle cx="12" cy="19" r="1"></circle><circle cx="12" cy="12" r="9"></circle>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
  };
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.code}</svg>`;
}

function projectButtons(project) {
  const parts = [];
  if (isConfiguredUrl(project.githubUrl)) {
    parts.push(
      `<a class="btn btn-secondary" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub repository</a>`
    );
  } else {
    parts.push(`<p class="missing-link">Repository link to be added</p>`);
  }
  if (isConfiguredUrl(project.liveUrl)) {
    parts.push(
      `<a class="btn btn-primary" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Live application</a>`
    );
  }
  return parts.join("");
}

export function renderPage(data) {
  document.title = `${data.name} | Personal Portfolio`;
  document.getElementById("logo-name").textContent = data.name;
  document.getElementById("hero-name").textContent = data.name;
  document.getElementById("hero-tagline").textContent = data.tagline;
  document.getElementById("hero-intro").textContent = data.introduction;
  document.getElementById("about-copy").textContent = data.about;
  document.getElementById("degree-value").textContent = data.degree;
  document.getElementById("university-value").textContent = data.university;

  const academicNote = data.academicLevelVerified ? "" : ` · ${data.academicLevelNote}`;
  document.getElementById("academic-value").textContent = `${data.academicLevel}${academicNote}`;
  document.getElementById("footer-name").textContent = data.name;

  const photo = document.getElementById("profile-photo");
  if (isConfiguredUrl(data.photo) || (data.photo && data.photo.startsWith("assets/"))) {
    photo.src = data.photo;
    photo.alt = data.photoAlt || `Photograph of ${data.name}`;
  } else {
    photo.src = "assets/avatar.svg";
    photo.alt = `Monogram initials ${data.initials} for ${data.name}. Add a personal photograph in the configuration file to replace this placeholder.`;
  }

  const githubHero = document.getElementById("github-hero");
  if (isConfiguredUrl(data.contact.github)) {
    githubHero.href = data.contact.github;
    githubHero.hidden = false;
  } else {
    githubHero.hidden = true;
  }

  const interests = document.getElementById("interest-list");
  interests.innerHTML = data.interests.map((item) => `<li>${item}</li>`).join("");

  const skills = document.getElementById("skill-grid");
  skills.innerHTML = data.skills
    .map(
      (skill) => `<article class="skill-card">
        <h3>${skill.name}</h3>
        <span class="level">${skill.level}</span>
      </article>`
    )
    .join("");

  renderProjects(data.projects);
  renderContact(data);
}

export function renderProjects(projects) {
  const grid = document.getElementById("project-grid");
  const empty = document.getElementById("no-projects");
  const count = document.getElementById("search-status");
  if (!projects.length) {
    grid.innerHTML = "";
    empty.classList.add("visible");
    count.textContent = "No projects found";
    return;
  }
  empty.classList.remove("visible");
  count.textContent = `${projects.length} project${projects.length === 1 ? "" : "s"} shown`;
  grid.innerHTML = projects
    .map(
      (project) => `<article class="project-card">
        <div class="project-icon">${iconSvg(project.icon)}</div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul class="tech-list">${project.technologies.map((tech) => `<li>${tech}</li>`).join("")}</ul>
        <div class="card-actions">${projectButtons(project)}</div>
      </article>`
    )
    .join("");
}

function renderContact(data) {
  const list = document.getElementById("contact-details");
  const items = [];

  if (isConfiguredEmail(data.contact.email)) {
    items.push(
      `<p><strong>Email</strong><br><a href="mailto:${data.contact.email}">${data.contact.email}</a></p>`
    );
  } else {
    items.push(
      `<p><strong>Email</strong><br><span class="muted">Add your email in <code>shared/portfolio.js</code> to show a contact link.</span></p>`
    );
  }

  if (isConfiguredUrl(data.contact.github)) {
    items.push(
      `<p><strong>GitHub</strong><br><a href="${data.contact.github}" target="_blank" rel="noopener noreferrer">View GitHub profile</a></p>`
    );
  } else {
    items.push(
      `<p><strong>GitHub</strong><br><span class="muted">Add your GitHub URL in <code>shared/portfolio.js</code>.</span></p>`
    );
  }

  if (isConfiguredUrl(data.contact.linkedin)) {
    items.push(
      `<p><strong>LinkedIn</strong><br><a href="${data.contact.linkedin}" target="_blank" rel="noopener noreferrer">View LinkedIn profile</a></p>`
    );
  }

  const contactBtn = document.getElementById("contact-button");
  if (isConfiguredEmail(data.contact.email)) {
    contactBtn.href = `mailto:${data.contact.email}`;
    contactBtn.textContent = "Email me";
    contactBtn.removeAttribute("aria-disabled");
  } else {
    contactBtn.href = "#contact";
    contactBtn.textContent = "Configure email to enable contact";
    contactBtn.setAttribute("aria-disabled", "true");
  }

  list.innerHTML = items.join("");
}
