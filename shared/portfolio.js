/**
 * Central portfolio configuration.
 * Edit this file to update personal details, contact links, skills, and projects.
 *
 * IMPORTANT:
 * - Leave a string empty ("") if you do not have a real value yet.
 * - Do not put invented emails, GitHub URLs, live demo URLs, or LinkedIn URLs here.
 * - Empty or placeholder values are hidden in the website. They are never shown as working links.
 */

export const portfolio = {
  name: "Pranjali Jain",
  shortName: "Pranjali",
  initials: "PJ",
  tagline: "Learning, Building, and Growing Through Code.",
  degree: "B.Tech in Computer Science Engineering",
  university: "JECRC University",
  /**
   * Academic level as supplied for this assessment.
   * Confirm this with your current university records before a viva or public post.
   */
  academicLevel: "Second year",
  academicLevelVerified: false,
  academicLevelNote: "Subject to verification",
  roleLabel: "B.Tech CSE student",
  introduction:
    "Hi, I'm Pranjali Jain, a Computer Science Engineering student passionate about programming, problem-solving, and technology. I am developing my skills in programming, data structures, algorithms, and software development. I enjoy learning new technologies, building practical projects, and improving my coding abilities. My goal is to strengthen my technical foundation and grow into a skilled software developer.",
  about:
    "I am a B.Tech Computer Science Engineering student at JECRC University. I am interested in programming, problem-solving, and software development, and I am building my skills through coursework, practice, and hands-on projects. I am still learning, and this portfolio reflects the work I have completed as a student rather than professional experience.",
  interests: [
    "C programming",
    "C++ programming",
    "Python programming",
    "Data Structures and Algorithms",
    "Problem-solving",
    "Web development",
    "AI-assisted development",
    "Software development",
  ],
  /**
   * CONFIGURE: add a photo file in /assets and set the path, for example "assets/profile.jpg".
   * Leave empty to show an initials monogram. Do not use a photograph of someone else.
   */
  photo: "",
  photoAlt: "Portrait placeholder for Pranjali Jain",
  contact: {
    /**
     * CONFIGURE: replace empty strings with your real details.
     * Example email: "pranjali@example-university.edu" (use your actual address).
     * Example GitHub: "https://github.com/your-username"
     * Example LinkedIn: "https://www.linkedin.com/in/your-profile"
     */
    email: "",
    github: "",
    linkedin: "",
  },
  skills: [
    { name: "C", level: "Learning" },
    { name: "C++", level: "Learning" },
    { name: "Python", level: "Learning" },
    { name: "HTML", level: "Familiar" },
    { name: "CSS", level: "Familiar" },
    { name: "JavaScript", level: "Learning" },
    { name: "Data Structures and Algorithms", level: "Learning" },
    { name: "Git and GitHub", level: "Learning" },
    { name: "Cursor AI", level: "Familiar" },
  ],
  /**
   * Five required assessment projects.
   * Set githubUrl / liveUrl only when you have a real URL.
   * Use "" until then. The site will show "Repository link to be added" instead of a fake button.
   */
  projects: [
    {
      id: "python-programs",
      title: "Python Programs Collection",
      description:
        "A collection of Python programming exercises covering factorial calculation, Fibonacci series, and structure-to-dictionary conversion.",
      technologies: ["Python"],
      githubUrl: "",
      liveUrl: "",
      icon: "code",
      notes: "README should describe each exercise and how to run the scripts.",
    },
    {
      id: "messy-python",
      title: "Messy Python Code Improvement",
      description:
        "A Python code improvement project focused on making an existing script more readable, organized, and maintainable with AI assistance.",
      technologies: ["Python", "AI-assisted development"],
      githubUrl: "",
      liveUrl: "",
      icon: "spark",
      notes: "",
    },
    {
      id: "bug-fixing-cursor",
      title: "Bug Fixing Using Cursor AI",
      description:
        "A debugging project demonstrating how an incorrect or buggy program can be examined, corrected, and tested with the help of Cursor AI.",
      /**
       * CONFIGURE: change the language if this project was not written in Python.
       */
      technologies: ["Python", "Cursor AI"],
      githubUrl: "",
      liveUrl: "",
      icon: "bug",
      notes: "Update the language listed here if the original program used a different language.",
    },
    {
      id: "quiz-app",
      title: "Interactive Quiz Application",
      description:
        "An interactive quiz application developed as part of Lecture 10, designed to let users answer questions through a simple interface.",
      technologies: ["HTML", "CSS", "JavaScript"],
      githubUrl: "",
      liveUrl: "",
      icon: "quiz",
      notes: "Add a live URL only after the quiz is actually deployed.",
    },
    {
      id: "book-list",
      title: "Book Reading List Application",
      description:
        "A reading list application developed as part of Lecture 11 to help users organize and manage their reading list.",
      technologies: ["HTML", "CSS", "JavaScript"],
      githubUrl: "",
      liveUrl: "",
      icon: "book",
      notes: "When a live URL exists, add it here and also add it to that project's README.",
    },
  ],
};

export function isConfiguredValue(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  const fakeMarkers = [
    "your_",
    "replace_",
    "example.com",
    "username",
    "placeholder",
    "todo",
    "coming-soon",
  ];
  if (fakeMarkers.some((marker) => lower.includes(marker))) return false;
  return true;
}

export function isConfiguredUrl(value) {
  if (!isConfiguredValue(value)) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isConfiguredEmail(value) {
  if (!isConfiguredValue(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function filterProjects(projects, query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return projects;
  return projects.filter((project) => {
    const haystack = [
      project.title,
      project.description,
      ...(project.technologies || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function buildPortfolioContext(data = portfolio) {
  const email = isConfiguredEmail(data.contact.email)
    ? data.contact.email
    : "not provided";
  const github = isConfiguredUrl(data.contact.github)
    ? data.contact.github
    : "not provided";
  const linkedin = isConfiguredUrl(data.contact.linkedin)
    ? data.contact.linkedin
    : "not provided";

  const projectLines = data.projects
    .map((project, index) => {
      const githubStatus = isConfiguredUrl(project.githubUrl)
        ? project.githubUrl
        : "repository link not provided";
      const liveStatus = isConfiguredUrl(project.liveUrl)
        ? project.liveUrl
        : "live link not provided";
      return `${index + 1}. ${project.title}
Description: ${project.description}
Technologies: ${project.technologies.join(", ")}
GitHub: ${githubStatus}
Live: ${liveStatus}`;
    })
    .join("\n\n");

  const academic = data.academicLevelVerified
    ? data.academicLevel
    : `${data.academicLevel} (${data.academicLevelNote})`;

  return `You are the portfolio assistant for ${data.name}, a ${data.degree} student at ${data.university}.
Academic level: ${academic}.
Role: student who is learning and developing technical skills. Do not present this person as an experienced professional.

Introduction:
${data.introduction}

About:
${data.about}

Technical interests: ${data.interests.join(", ")}.

Skills (with honesty about level):
${data.skills.map((skill) => `- ${skill.name}: ${skill.level}`).join("\n")}

Contact:
- Email: ${email}
- GitHub: ${github}
- LinkedIn: ${linkedin}

Projects:
${projectLines}

Response rules:
- Answer using only the information above.
- If something is not listed, say that the information is not provided.
- Do not invent internships, jobs, grades, awards, certifications, achievements, or extra projects.
- Do not invent contact details or URLs.
- Keep answers helpful, clear, and concise.
- If asked who you are, explain that you are ${data.name}'s portfolio chatbot.`;
}
