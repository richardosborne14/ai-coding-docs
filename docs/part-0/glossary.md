---
title: Concepts Glossary
description: Plain-English explanations of terms you'll hear constantly, from package.json to CLAUDE.md
---

# Concepts Glossary

A no-jargon reference for words that get thrown around in development. Come back whenever you see one you don't recognise.

---

## Project Files and Folders

**`package.json`**: The ID card for your project. Lists its name, what packages it depends on, and what commands are available (like "start the dev server" or "build for production"). When you see `npm install`, it reads this file to know what to download.

**`package-lock.json`**: A detailed record of the exact version of every package that was installed. You don't edit it. npm manages it. It exists so that everyone working on the project gets the exact same package versions.

**`node_modules/`**: The folder where npm puts all the packages your project depends on. It's often enormous (hundreds of MB) and contains thousands of files. This is normal. Never edit files inside it. Never commit it to Git. If something goes wrong, delete it entirely and run `npm install` to regenerate it.

**`.env`**: A file containing secret configuration values: API keys, database passwords, server URLs. The dot prefix means it's a hidden file. This should **never** be committed to Git. Put variable names (without actual values) in `.env.example` so others know what's needed.

**`.gitignore`**: A list of files and folders that Git should not track. Your `.gitignore` should include `node_modules/`, `.env`, and any other files with secrets or generated content. If something sensitive gets into Git, it stays in the history forever, even after you delete it.

**`README.md`**: The front page of your project. Describes what the project does, how to set it up, and how it's structured. GitHub displays this automatically when someone visits your repo.

**`static/` or `public/`**: Where images, fonts, and other files go that should be served as-is. See [Adding Files and Styling Basics](/part-0/files-and-styles) for details.

---

## Git and GitHub

**Git**: Software that tracks every change to every file in your project. Like "Track Changes" in Word, but for an entire folder. Runs on your computer.

**GitHub**: A website where your Git repository lives online. It's the backup, the collaboration hub, and often the deployment source.

**Repository (repo)**: Your project, tracked by Git. It includes all your files plus the complete history of every change.

**Commit**: A snapshot of your project at a specific moment. When you "commit," you're saying "save this state with a description of what changed." Each commit has a message like "Add login form" or "Fix header alignment."

**Push**: Upload your commits from your computer to GitHub. Until you push, your changes only exist locally.

**Pull**: Download the latest changes from GitHub to your computer. Important when collaborating or when you've made changes from multiple machines.

**Clone**: Download an entire repository from GitHub to your computer for the first time.

**Branch**: A parallel version of your code. The main branch (called `main`) is the primary version. You can create branches to experiment without affecting `main`, then merge them back when you're done. For solo projects following this methodology, you'll mostly work on `main` directly.

---

## Development Concepts

**IDE** (Integrated Development Environment): A fancy text editor for code. VS Code is an IDE. It's where you write, edit, and manage your project.

**Terminal / Command Line / Console / Shell**: The text-based interface where you type commands. They're all roughly the same thing. See [Setting Up Your Computer](/part-0/setting-up-your-computer) for getting comfortable with it.

**npm** (Node Package Manager): The tool that installs JavaScript packages. `npm install` downloads packages. `npm run dev` starts your dev server. `npm run build` creates the production version of your app.

**Dependencies**: Packages your project needs to work. Listed in `package.json`. When you see Claude run `npm install some-package`, it's adding a dependency.

**Build**: The process of converting your development code into optimised production code. Development code is easy to read and edit. Built code is compressed, minified, and optimised for speed. You run the dev version locally; the built version goes on the server.

**Dev Server**: A local web server that runs your app during development. It auto-refreshes when you change code (called "hot reload"). It's started with commands like `npm run dev` and runs until you press Ctrl+C to stop it.

**Linter**: A tool that checks your code for common mistakes, like a grammar checker for code. ESLint is the most common for JavaScript. It shows warnings and errors without running the code.

**Formatter**: A tool that makes your code look consistent (indentation, spacing, line breaks). Prettier is the most common. It doesn't change what the code does, just how it looks.

---

## Web Development Concepts

**Frontend**: What the user sees and interacts with. HTML, CSS, JavaScript, the browser. The visual part.

**Backend**: What runs on the server. Handles data, authentication, business logic. The user never sees this directly.

**Full-stack**: Both frontend and backend together.

**API** (Application Programming Interface): A structured way for your frontend to talk to your backend (or to external services). When your app fetches user data, it makes an API call. It's like a waiter taking orders between the kitchen and the dining room.

**Framework**: A pre-built structure that handles common patterns so you don't start from scratch. SvelteKit, Next.js, and Nuxt are web frameworks. They handle routing, server-side rendering, and build configuration.

**Component**: A reusable piece of UI. A button, a navigation bar or a user card can each be a component. Components are like Lego bricks that assemble into pages.

**Route**: A URL path in your app. `/about` is a route, `/users/123` is a route. Frameworks map routes to pages or components.

**Database**: Where your app stores data permanently. PostgreSQL, MySQL, and SQLite are common databases. Data stays in the database even when the server restarts.

**Migration**: A script that changes the database structure (adding tables, renaming columns, etc.). Migrations track database changes the same way Git tracks code changes.

**Docker Container**: A lightweight, isolated environment that runs a specific service. Instead of installing PostgreSQL directly on your computer, you run it in a Docker container. It works the same way but doesn't touch the rest of your system.

**Environment Variables**: Configuration values that change between environments (development vs production). Stored in `.env` files. Your development database URL is different from production, but the app code is the same. Environment variables handle the difference.

---

## Claude and Its Tools

**Chat**: The Claude app you talk to, on the desktop or at claude.ai. Where I talk an idea through before anything gets built. Chat has its own memory of you, which Claude Code can't see. Chat knows you, Code knows your repo.

**Claude Code**: The version of Claude that builds. It reads your project, writes code, runs commands and tests. You can use it in the Code tab of the desktop app, in VS Code, or in a terminal. It needs a paid plan.

**Code tab**: Claude Code inside the Claude desktop app. No terminal, nothing extra to install. It has a Browser pane that shows your running app. This is the "Keep it simple" route.

**Cowork**: Another tab in the desktop app. An agent for non-code work that can read and write files on your computer. It shares Chat's memory. For building apps, use the Code tab instead.

**Claude Design**: Claude's mockup tool, on paid plans and still in preview. You shape screens by chatting and commenting until you're happy, then hand the design to Claude Code. See [Mockups First](/part-2/mockups-first).

**Artifact**: A page Claude makes for you, like a document, a small app or a set of choices you click through. When Claude needs you to rule on several points, ask it for an artifact. It can store your answers so they come back to Claude Code.

**`CLAUDE.md`**: A Markdown file in your project that Claude Code reads at the start of every session. It's Claude's employee handbook: what the project is, what to read first, which standards to follow, what never to do. Run `/init` and Claude writes a starter one for you.

**Auto memory**: Notes Claude Code writes to itself about your corrections and preferences, so it doesn't repeat mistakes. They stay on your machine. Separate from Chat's memory.

**Skill**: A saved set of instructions for one kind of job, like "write copy in my voice" or "run a phase audit". It lives in a folder with a `SKILL.md` file. Claude loads it when it's relevant, or you call it with `/skill-name`. See [Skills](/part-5/skills).

**Plan mode**: A mode where Claude Code reads your project and proposes a plan without changing anything. Read the plan before you let it build. Switch modes with Shift+Tab in a terminal, or the mode selector in the desktop app.

**Opus, Sonnet, Haiku, Fable**: Claude's models. I use Opus for nearly everything and Fable for fundamental or design problems. On Pro, plan with Opus and run simpler tasks on Sonnet. Each task file says which model should run it.

**Session limit**: How much you can use Claude in a stretch before you have to wait. It resets every five hours. See [Plans and Limits](/part-0/plans-and-limits).

**Weekly limit**: A second cap across the whole week, on top of the session limit. Anthropic doesn't publish the numbers. `/usage` in Claude Code shows where you are.

**Context window**: How much text Claude can hold in its head at once. Long conversations fill it up, which is why I start a fresh session for each task.

**Tokens**: The units AI uses to measure text. Roughly 1 token = 0.75 words. On a Claude plan you don't count them. You watch your session and weekly limits instead.

**Cline**: A VS Code AI extension this guide used to be built on. It's pay-as-you-go and dearer. See [Other Tools](/appendix-other-tools).

---

## Method Terms

**Confidence score**: After finishing a task, Claude rates its confidence in the work out of 10. 8/10 is the minimum to move on. Below 8, fix things first.

**Sprint**: A batch of related tasks that together finish a feature or phase. Borrowed from Agile, simplified for working with AI.

**MVP** (Minimum Viable Product): The simplest version of your app that works and is useful. Build this first, add features later.

**Hot reload**: Your dev server refreshes the browser by itself when you save a change. No manual reload needed.

---

## Things That Sound Scary But Aren't

**"Compile error"**: The code has a syntax mistake. Like a typo in a recipe: the oven doesn't know what "bke at 350°" means. Fix the typo and it works.

**"Dependency conflict"**: Two packages need different versions of a third package. Usually fixed by updating packages or using specific versions.

**"Deprecated"**: A feature or package that still works but is being phased out. The replacement is usually suggested in the warning message.

**"Breaking change"**: An update to a package that changes how it works in a way that could break your existing code. This is why locking dependency versions matters.

**"Runtime error"**: Something that goes wrong while the app is running (as opposed to while it's being built). Usually means a variable is empty that shouldn't be, or a file is missing.

**"404"**: The thing you're looking for doesn't exist at that URL. Not a crash, just a wrong address.

**"500"**: Something went wrong on the server side. The server knows something is broken but can't tell you exactly what in the browser for security reasons. Check the server logs (or terminal output) for details.

---

This glossary will grow. When Claude or an error message uses a word you don't know, search this page first. If it's not here, ask Claude: *"What does [term] mean in plain English?"*
