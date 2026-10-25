# Personal Portfolio Website with API-Based Chatbot Integration

A responsive personal portfolio for **Pranjali Jain**, a B.Tech Computer Science Engineering student at JECRC University. This project was built for a college internal assessment and includes project search, light/dark mode, and a server-side chatbot API.

Live Vercel URL: `_add your deployed URL here after Vercel deployment_`

## Project purpose

The website introduces Pranjali as a student who is learning programming, problem-solving, and software development. It presents education, skills, five required academic projects, contact placeholders, and an API-based chatbot that answers questions using only the information configured for this portfolio.

## Technologies used

- HTML
- CSS
- JavaScript (ES modules)
- Node.js local server for development
- Vercel serverless function for `/api/chat`
- Optional AI providers: Google Gemini, OpenAI, or Groq
- GitHub for source control
- Vercel for hosting

No frontend framework is required.

## Implemented features

- Home, About, Education, Skills, Projects, Contact, and AI Chatbot sections
- Editable personal data in `shared/portfolio.js`
- Five required project cards
- Live project search by title, description, and technology
- Clear-search control and a "No projects found" state
- Light/dark theme toggle with `localStorage` and system preference support
- Responsive layout and mobile navigation
- Chatbot UI with Enter-to-send, loading state, and error handling
- Server-side API route so keys are never exposed in frontend JavaScript
- Local grounded answers when no API key is configured

## How to run locally

1. Install [Node.js](https://nodejs.org/) (v18 or later).
2. Open a terminal in this project folder.
3. Start the site:

```bash
node server.mjs
```

4. Open [http://localhost:3000](http://localhost:3000).

Optional tests:

```bash
node tests/search.test.mjs
node tests/chat-local.test.mjs
```

Or:

```bash
npm test
```

## How to edit personal information

Open `shared/portfolio.js` and update:

- Introduction text
- Academic level (`academicLevelVerified` should stay `false` until you confirm it)
- Profile photograph path (`photo`)
- Email, GitHub, and LinkedIn
- Skill names and levels
- Project GitHub and live URLs

Empty strings are intentional. The website hides fake links until you add real values.

To add a photograph, place the file in `assets/` and set `photo: "assets/your-photo.jpg"`. Do not use someone else's photograph.

## Chatbot environment variables

Copy the example file:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Set `AI_PROVIDER` to the API demonstrated in class:

| `AI_PROVIDER` | Required key | Notes |
| --- | --- | --- |
| `local` | none | Uses portfolio data only. Good for demos without a key. |
| `gemini` | `GEMINI_API_KEY` | Google AI Studio |
| `openai` | `OPENAI_API_KEY` | OpenAI Chat Completions |
| `groq` | `GROQ_API_KEY` | Groq OpenAI-compatible API |

If the key is missing, the chatbot still answers from the configured portfolio data and the UI explains that local mode is active. It does not invent internships, grades, or contact details.

**Ask your instructor which provider was used in class, then set `AI_PROVIDER` to that value.** This project does not assume a classroom secret.

Never commit `.env`. It is listed in `.gitignore`.

## GitHub setup

Git was not available in the environment that built this project. Install Git first, then run these commands from the project folder.

If Git is not initialized yet:

```bash
git init
git add .
git commit -m "Add personal portfolio website with chatbot integration"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

If a repository already exists, inspect it before running extra commands:

```bash
git status
git remote -v
git log -1
```

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your real GitHub values. Do not push API keys.

## Previous project repositories

Add the real GitHub URLs when they exist. Do not publish invented links.

1. Python Programs Collection: `_repository URL to be added_`
2. Messy Python Code Improvement: `_repository URL to be added_`
3. Bug Fixing Using Cursor AI: `_repository URL to be added_`
4. Interactive Quiz Application: `_repository URL to be added_`
5. Book Reading List Application: `_repository URL to be added_`

Also paste those URLs into `shared/portfolio.js` so the website buttons can appear.

## Vercel deployment

Deployment is **not complete** until you connect the GitHub repository and confirm the live site yourself.

1. Push this project to GitHub using the commands above.
2. Open [https://vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New Project** and import the repository.
4. Framework preset: leave as Other. The site is static HTML plus `/api/chat`.
5. In **Environment Variables**, add the same names from `.env.example`:
   - `AI_PROVIDER`
   - the matching API key, if you have one
6. Deploy.
7. Open the Vercel URL and check:
   - all sections load
   - project search works
   - theme toggle survives refresh
   - chatbot replies
8. Paste the live URL at the top of this README and, if required, in the Book Reading List project README.

### After deployment checklist

- Images and CSS load on the Vercel domain
- `/api/chat` responds to a test question
- No API key is visible in the browser Network response for static JS files

## Simple explanation for a viva

- `index.html` is the page structure.
- `css/styles.css` is the visual design, including light and dark colour variables.
- `shared/portfolio.js` is the single place for personal data and the five projects.
- `js/main.js` starts the page: it draws content, search, navigation, theme, and chatbot.
- `js/search.js` filters project cards as the visitor types.
- `js/theme.js` saves light/dark mode in `localStorage`.
- `api/chat.js` is the secure backend. The browser never sees the API key.
- `server.mjs` is a small local server so the chatbot works on `localhost`.

## Academic honesty notes

- No internships, awards, grades, or extra experience were invented.
- Academic year is shown as second year, subject to verification.
- Contact and repository buttons stay hidden or labelled "to be added" until real URLs are configured.
