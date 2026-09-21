---
title: Project Templates
description: The starter files I drop into every new repo, with CLAUDE.md at the centre
---

# Project Templates

These are the files I start every project with. They live in the `project-templates/` folder of this guide's repo. Copy the lot into your project, fill in the brackets, and Claude Code has what it needs from the first session.

One file does most of the work: **CLAUDE.md**. Claude Code reads it at the start of every session, whether you're in the desktop app's Code tab, VS Code or a terminal. Everything else is there to keep CLAUDE.md short.

::: simple
You don't have to copy files by hand. Put the `project-templates/` folder next to your project, open the Code tab and say: "Copy the templates into this project and fill them in from our brainstorm notes. Ask me about anything you can't fill in." Then read what it wrote.
:::

---

## What's in the folder

| File | What it's for | How much to change |
|------|---------------|--------------------|
| **CLAUDE.md** | The rules Claude reads every session. The main file. | A lot. It's about you and your project. |
| **TASK_TEMPLATE.md** | The shape of one task file, including the model that should run it | A little |
| **LEARNINGS.md** | Bugs and traps Claude has hit, so it doesn't hit them twice | Nothing. Claude fills it in. |
| **GLOBAL_MEMORY.md** | Starter for your personal, all-projects rules file | Once, then leave it |
| **ARCHITECTURE.md** | Schemas, components, API, key decisions | A lot, and keep it true |
| **SPRINT_PLAN_TEMPLATE.md** | The shape of a sprint or phase plan | A little |
| **SPRINT_RULES.md** | How big a sprint is, how to write a task, what to do with surprise work | Read it, tweak it |
| **README.md** | Vision, scope, stack, setup | A lot |
| **prompts/** | The prompts from [Prompts](/part-6/prompts), one file each | Nothing |
| **convention-files/** | Starter design tokens, text, links and meta for the [Frontend Tweaker](/part-5/frontend-tweaker) | Adjust to your stack |
| **overview/**, **domain.config.js**, **scripts/generate-overview.js** | The [Live Project Overview](/part-2/live-project-overview): a generated map of your app that Claude reads selectively | Declare your real entities |
| **scripts/deploy.sh**, **Dockerfile**, **.dockerignore** | Build-on-the-server deploys with a health check | Set your app's names and paths |

::: tip Using Cline instead?
The Cline rules files (`.clinerules` and `.clineignore`) are moving to `project-templates/other-tools/cline/`. See [Other AI Coding Tools](/appendix-other-tools).
:::

---

## CLAUDE.md: the file that matters

I've said it before and I'll keep saying it: 99% of getting good work out of Claude is the docs. Hooks, MCP servers and plugins are garnish. CLAUDE.md is the main course.

The template has seven parts. Here's what each one does and why it's there.

### 1. Who you are

A short, honest statement of how techie you are. This sets how Claude talks to you, how much it explains, and how much it does without asking.

```markdown
## Who I am
- I run a small events business. I don't code.
- Explain in plain words. No jargon unless you define it.
- Report in three lines: what you did, what you checked, what I need to do.
- Take initiative on anything technical. Ask me about anything a user would see.
```

A CTO would write something very different, and Claude would behave very differently. That's the point.

### 2. Unbreakable rules

The handful of rules Claude must never break. Short, strict and specific. "Tests are mandatory" beats "try to write tests". Claude may propose changes to these rules when it learns something, but it asks first.

```markdown
## Unbreakable rules
- One task per session. No side quests.
- Read the task file before you start. Plan before you build.
- Never declare a task done without proof: tests pass, or I've checked it.
- Never overwrite a production .env.
- Same error three times? Stop, write up what you tried, and ask me.
- You may suggest changes to these rules. Ask before you make them.
```

### 3. The learnings habit

Claude reads `LEARNINGS.md` at the start of each task and adds to it when it finds a trap that would waste a fresh session half an hour. This is how it stops making the same mistake.

### 4. Doc-length rules

This is the one people skip, and it's the one that bites. Docs grow. A 2,000-line learnings file costs you on every read and still gets skimmed. The template sets limits: when a file passes a set length, Claude summarises it, splits it, or moves old material into an `archive/` folder with a one-line pointer left behind. Pick your own numbers. Just have some.

### 5. Testing

Backend tests for the logic, and **headless browser tests** for the screens. Headless means Claude drives a real browser in the background, clicks through your app, takes screenshots and checks them. You don't watch it happen. The template asks for these after every change that touches a screen. More in [Testing](/part-4/testing).

### 6. Model per task

Every task file names the model that should run it. Claude writes that line when it writes the task. You read it at the start of the session and switch model before you begin. I use Opus for nearly everything and Fable when something is fundamentally wrong or the design is fighting me. On Pro, plan and write tasks with Opus, then run the simpler ones on Sonnet. See [Plans & Limits](/part-0/plans-and-limits).

### 7. Rule via artifact

When Claude needs me to decide several things at once, I don't want a wall of questions in the chat. The template tells it to build an artifact I can click through instead. Artifacts can store my answers, so they come back to Claude Code when I'm done.

### Plus your stack's rules

Below those seven, the template has short sections that point at the relevant chapters: [deploy rules](/part-5/deployment-platforms), [observability](/part-5/observability), [accessibility](/part-5/accessibility), the [control panel](/part-5/control-panel), the [Frontend Tweaker](/part-5/frontend-tweaker) and the [Live Project Overview](/part-2/live-project-overview). Keep the ones that apply and delete the rest. Then add a few lines per framework you use.

::: tip Keep CLAUDE.md short
If a section grows past a screen, move the detail into its own file and point to it. Claude Code can import a file into CLAUDE.md with `@path/to/file`, or you can just tell it where to look. A short CLAUDE.md that Claude actually follows beats a long one it skims.
:::

---

## The other files

### TASK_TEMPLATE.md

One task, one file. The header now has a **Recommended model** line:

```markdown
# [TASK-ID]: [Task title]

**Status:** BACKLOG | IN_PROGRESS | DONE
**Recommended model:** Opus | Sonnet | Fable (and one line on why)
**Priority:** P0 | P1 | P2 | P3
**Dependencies:** [Other task IDs, or "None"]
```

Then context (why the task exists), numbered requirements, the technical approach with the files to touch, and acceptance criteria you can check. The criteria include the tests, a screenshot check for anything visual, and "LEARNINGS.md updated if something bit". More in [Task Patterns](/part-3/task-patterns).

### LEARNINGS.md

An empty log with one test for what goes in: "Would a fresh session hitting this waste 30 minutes without this entry?" If yes, it goes in. If no, it doesn't. Fixed traps graduate out, either into CLAUDE.md as a rule or into the archive. The doc-length rules keep it in check.

### GLOBAL_MEMORY.md

The starter for your personal rules, the ones that apply to every project: how you like to be spoken to, never estimate time, stop after three failed attempts. Claude Code reads a user-level file at `~/.claude/CLAUDE.md` in every project, so that's where this content goes. Keep it to half a page.

### ARCHITECTURE.md

The file that saves the most rework. Real table names, real column types, real routes, and a table of key decisions with the reason for each. Claude with a real schema gets it right first time. Claude without one guesses.

### SPRINT_PLAN_TEMPLATE.md and SPRINT_RULES.md

The plan lists the tasks, their order and what "done" means for the whole sprint. The rules say how big a sprint and a task should be, and what to do with work you find along the way (new bug elsewhere? New task file. Don't fix it inline). I still work in sprints and phases, with an [audit](/part-4/phase-audits) at the end of each.

::: everything The deploy and overview files
- `scripts/deploy.sh` runs **on the server**, not on your machine. It pulls, builds and restarts. Set `APP_DIR`, `PM2_NAME` and `BRANCH` at the top.
- `Dockerfile` is a multi-stage Node build with an `/api/health` check. Change the run command for your framework.
- `overview/` is generated. Run the generator before each commit so Claude always has a current map. See [The Live Project Overview](/part-2/live-project-overview).
:::

---

## How to use them

### New project

1. [Talk it through](/part-2/brainstorming) in Chat and get [mockups](/part-2/mockups-first) you'd be happy with.
2. Copy `project-templates/` into your new repo.
3. Use the foundation-docs prompt from [Prompts](/part-6/prompts) to have Claude fill in CLAUDE.md, README, ARCHITECTURE and the first sprint plan.
4. **Read what it wrote.** Push back on vague schemas, soft rules and sprints that are too big. Fix the "Who I am" section yourself: only you know how techie you are.
5. Start the first task in a fresh session.

### Existing project

Run `/init` in Claude Code to get a starter CLAUDE.md from your codebase. Then paste in the seven sections above and fill them in. Add ARCHITECTURE.md next if you don't have one. Then write a sprint plan for your next batch of work.

---

## A real example

The [VH Conference Toolkit](https://github.com/Visual-Hive/vh-conference-toolkit) (an open-source set of event tools) was built with an earlier version of these templates, back when this guide was built around Cline. The public repo holds the finished tools and their READMEs rather than the planning docs, but it shows what one well-scoped tool per folder looks like.

---

**Next:** [Prompts](/part-6/prompts). The prompts I use at each step.
