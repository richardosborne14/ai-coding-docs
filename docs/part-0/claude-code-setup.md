---
title: Claude Code Setup
description: The handful of Claude Code settings that matter. CLAUDE.md, memory, permission modes, models and a few commands. The rest is garnish.
---

# Claude Code Setup

## TLDR

Claude Code is the tool that builds your app. It's the Code tab in the Claude desktop app, and it's also what runs in a terminal or in VS Code. Same engine, different windows. Everything on this page applies to both tracks unless it's marked otherwise.

What's worth setting up, in order of how much it matters:

1. **CLAUDE.md.** The rules file Claude reads at the start of every session. This is where most of the value is.
2. **Permission modes.** How much Claude asks before it acts, and plan mode for "show me first".
3. **Models.** Opus for almost everything. Switch when a task says so.
4. **A few commands.** `/clear`, `/usage`, `/rewind` and the Esc key.

Hooks, MCP servers and subagents exist. Most people don't need them early. A well-documented repo does more than all three put together.

---

## CLAUDE.md: the file that makes Claude behave

CLAUDE.md is a plain Markdown file. Claude reads it at the start of every session, so anything in it is a standing instruction: how to run the app, what the rules are, who you are and how you like to be spoken to.

It can live in a few places:

| Where | What it's for |
|-------|---------------|
| `~/.claude/CLAUDE.md` | You, across every project |
| `./CLAUDE.md` or `./.claude/CLAUDE.md` | This project. Commit it so it travels with the code |
| `./CLAUDE.local.md` | Your personal notes for this project, kept out of Git |

**Start with `/init`.** Type it in a new session and Claude writes a starter CLAUDE.md from what it finds in your folder. It's a first draft. Read it and fix what's wrong.

**Use imports so it stays short.** You can pull other files in with `@path`, instead of pasting everything into one file:

```markdown
The architecture is in @docs/ARCHITECTURE.md.
Follow the house style in @docs/CONVENTIONS.md.
```

**Keep it short on purpose.** The failure I actually see is docs getting too long. Put a rule in CLAUDE.md about it: when a doc passes a certain length, Claude summarises it, splits it, or moves old material to an archive folder. [Documentation Architecture](/part-2/documentation-architecture) covers what goes in and how to keep it lean. Each chapter in this guide ends with "What to add to CLAUDE.md".

---

## Auto memory: notes Claude keeps for itself

Separately from CLAUDE.md, Claude Code writes its own notes as you work. Correct it, or tell it how you like things done, and it can save that for next time. The first 200 lines (or 25KB) of its memory index load at the start of every session.

Two things to know:

- **It's machine-local.** It lives on this computer. It isn't shared with your other machines or with anyone else on the project. Anything the whole project needs belongs in CLAUDE.md.
- **It isn't Chat's memory.** Claude Chat remembers you. Claude Code doesn't see any of that. Chat knows you, Code knows your repo. If something you told Chat matters for the build, write it into the repo.

[Project Memory](/part-5/project-memory) goes further with this.

---

## Permission modes: how much Claude asks first

The three you'll use:

| Mode | What it does |
|------|--------------|
| `default` | Asks before it edits files or runs commands |
| `acceptEdits` | Edits files without asking, still asks before running commands |
| `plan` | Reads and plans only. Changes nothing until you approve the plan |

There are also `auto`, `dontAsk` and `bypassPermissions`. They cut down the questions in different ways. Leave them until you know exactly what you're letting through.

Switch modes with the **mode selector** in the desktop app or the **mode indicator** in VS Code.

::: everything In the terminal
Press **Shift+Tab** to cycle through the modes. `/permissions` manages allow and deny rules, so you can stop approving the same safe command fifty times and block things like reading your `.env` file.
:::

**Use plan mode for anything bigger than a small fix.** Claude writes out what it's going to do and waits. Then *read the plan*. The most common way I see projects go wrong is the person saying "just do it" without reading what Claude spelled out, and then being unhappy with the result. The plan is your chance to catch that for free.

---

## Models: which one, and how to switch

I use **Opus** for about 99% of my work. I call in **Fable** when an app has a fundamental problem or a design problem that Opus keeps going round in circles on. **Sonnet** and **Haiku** are the lighter models.

On the **Pro** plan, alternate. Use Opus to plan and write the tasks, and Sonnet to run the simpler ones. That makes your limits go further. Each task file should say which model runs it, so the first thing you do in a session is read the top of the task and switch. [Plans and Limits](/part-0/plans-and-limits) explains what each plan includes.

Switch with **`/model`**.

::: everything Keyboard shortcut
In the terminal, **Option+P** (Mac) or **Alt+P** switches model without typing a command.
:::

---

## Commands worth knowing on day one

| Command | What it does | When I use it |
|---------|--------------|---------------|
| `/clear` | Starts a fresh conversation | Between tasks. One task per session |
| `/usage` | Shows your usage and limits | When a session feels long |
| `/rewind` | Rolls back to an earlier checkpoint | When Claude went off in the wrong direction |
| **Esc** | Stops Claude mid-step | The moment you see it doing the wrong thing |
| **Esc Esc** | Opens rewind | Same as `/rewind`, faster |
| `/init` | Writes a starter CLAUDE.md | Once, at the start of a project |

A few more for later: `/compact` squashes a long conversation, `/context` shows what's taking up space, `/resume` reopens an earlier session and `/status` shows your setup.

If a command doesn't respond in the desktop app, look for the matching button. I haven't checked every one there, so treat the table as the terminal version.

**One more habit: send screenshots.** Drop them into the conversation constantly. A screenshot of the bug beats a paragraph describing it.

---

## Skills: instructions you'd otherwise retype

A skill is a small folder with a `SKILL.md` file inside. It holds instructions for one job, plus a description of when to use it. Claude loads it when the job comes up, or you call it by name with `/skill-name`. The first one worth making is a copywriting skill, because Claude's own prose is easy to spot. [Skills](/part-5/skills) shows how, with examples.

---

## Garnish: hooks, MCP servers and subagents

You'll read a lot about these. They're real and they work. You don't need any of them to build your first few apps.

- **Hooks** run a script automatically at set moments, for example when Claude finishes a turn.
- **MCP servers** connect Claude to outside tools and services.
- **Subagents** are extra Claude workers with their own context, handy for big searches.

My projects that run best have almost none of this. What they have is extensive docs: a CLAUDE.md with clear rules, task files, and notes Claude re-reads. Get that right first. Come back to the garnish when you hit a specific problem it solves.

---

**Next:** [Browser DevTools](/part-0/browser-devtools).
