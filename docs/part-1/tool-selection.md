---
title: Which Claude, Where
description: Chat for talking it through, Claude Design for mockups, Claude Code for building. Which window to use, and which model.
---

# Which Claude, Where

## TLDR

- **Chat** (the Claude desktop app or claude.ai) is where I talk the idea through.
- **Claude Design** is where I get mockups.
- **Claude Code** is where the building happens. You can run it in the **Code tab** of the desktop app with no terminal, or in **VS Code or a terminal** if you want to see everything.
- I use **Opus** for nearly all of it.

You need a paid plan for Claude Design and Claude Code. Pro is $20 a month. The details are in [Plans & Limits](/part-0/plans-and-limits).

---

## Chat: talking it through

Chat is the conversational one. It's good at brainstorming, pushing back and asking questions, and it remembers things about you from earlier conversations. That makes it the right place to start a project.

I use it for:

- The first brainstorm about what to build and for whom.
- Big decisions later on, like a new feature or a change of direction.
- Asking for an artifact when I need to make several decisions at once (more in [Brainstorming](/part-2/brainstorming)).

One thing to know: Chat's memory about you doesn't carry over into Claude Code. **Chat knows you, Code knows your repo.** Anything Claude Code should know about you has to be written into your project's CLAUDE.md.

---

## Claude Design: mockups

Claude Design draws your screens on a canvas and changes them as you chat. It's on the paid plans and still labelled beta or preview. When you're happy, it hands the design to Claude Code.

I don't talk about stacks or code until the mockups are right. See [Mockups First](/part-2/mockups-first).

---

## Claude Code: building

Claude Code reads your project, writes the code, runs it and tests it. It reads your docs at the start of every session, which is why the docs matter so much.

There are two ways to run it. Same Claude Code, different window.

::: simple The Code tab
The Claude desktop app has three tabs: Chat, Cowork and Code. The **Code tab** is Claude Code with no terminal and nothing extra to install. It has a Browser pane, so when your app is running you can see it right there.

If you've never used a terminal, start here. You can build a real app this way.
:::

::: everything VS Code or a terminal
Install the Claude Code extension from the VS Code marketplace, or run it in a terminal. You see every file, every command and every bit of output. You also get Git, Docker and deploys to real servers, which is where a project ends up sooner or later.

Setup is in [Claude Code: Setup & Customisation](/part-0/claude-code-setup).
:::

Everything in this guide works the same either way: CLAUDE.md, task files, skills, one task per session.

::: info What about Cowork?
Cowork is the third tab in the desktop app. It's an agent that works with your files on jobs that aren't coding. It's handy, but it isn't where I build apps. For code, use the Code tab. There's more on non-coding uses in [Beyond Coding](/appendix-e-beyond-coding).
:::

---

## The tool for each step

| Step | Where | Why |
|------|-------|-----|
| First brainstorm | Chat, Opus | Conversational, knows you |
| Mockups | Claude Design | Cheap to change, hands off to Claude Code |
| Stack, docs and tasks | Chat or Claude Code | Claude Code can write the docs straight into the repo |
| Building, one task at a time | Claude Code | Reads your docs, runs and tests the app |
| Bug fixing | Claude Code | Send it screenshots of what's wrong |
| New features, big decisions | Chat first, then Claude Code | Talk it over before you build |
| Phase audits | Claude Code, fresh session | Fresh eyes, no leftover context |

---

## Which model

Short version:

- **Opus** for almost everything. About 99% of my work.
- **Fable** when something fundamental is wrong or the design isn't working.
- **Sonnet** for small, clear tasks, especially on Pro when you want your limits to last.

On Pro, a good pattern is Opus to plan and write the task files, then Sonnet to run the simpler tasks. Every task file says which model should run it. The full picture, including what each plan includes, is in [Plans & Limits](/part-0/plans-and-limits).

---

## A note on time estimates

::: warning Don't trust AI time estimates
AI is terrible at guessing how long things take. A task Claude finishes in half an hour will often be estimated at "2 to 3 days", which is what a human developer might take on their own.

That's why this guide has no time estimates. Take any timeline in an AI-written plan with a big pinch of salt. How long a task takes depends on how hard it is, how much you know and how good your docs are.

**Put this in your CLAUDE.md:** "Do not estimate how long tasks will take. AI time predictions are wildly inaccurate."
:::

---

## Other tools

There are other AI coding tools, and this guide used to be built around one of them. If you're wondering how they compare on speed and price, see [Other AI Coding Tools](/appendix-other-tools).

---

**Next:** [The Brainstorming Session](/part-2/brainstorming)
