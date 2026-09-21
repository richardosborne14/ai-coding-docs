---
title: The Execution Workflow
description: One task per session in Claude Code. Fresh session, right model, plan, build, test, look, score, close.
---

# The Execution Workflow

## TLDR

**One task, one fresh session.** Your docs carry the memory, not the chat.

**Switch to the model the task names.** Each task file says which model should run it.

**Plan first, and read the plan.** Most of my bad days started with "yeah, just do it".

**Tests run in the background.** Claude takes screenshots. You look at them.

**Score it, update the docs, close the session.** Then the next task.

---

## The Cycle

```
1. Start a fresh session (/clear)
2. "Read task 2.3." Check the model it names and switch (/model)
3. Plan mode: Claude reads the docs and proposes an approach
4. You read the plan. Properly. Question it, adjust it
5. Approve. Claude builds
6. Claude runs the tests, including headless browser tests
7. Claude shows you screenshots. You look at them, and send yours
8. Confidence score. Below 8/10, fix before moving on
9. Claude updates the docs and LEARNINGS
10. Close the session. Next task
```

Every task goes round this loop. No exceptions.

::: simple
Everything on this page works in the Code tab of the Claude desktop app. Starting a new session there is the same as `/clear`. You pick plan mode from the mode selector.
:::

---

## 1. A Fresh Session per Task

Long sessions fill up with old debugging tangents, abandoned approaches and decisions you've since changed. Claude has to wade through all of it on every reply. That also burns through your [session limit](/part-0/plans-and-limits) faster.

A fresh session starts clean. Claude reads `CLAUDE.md` and your docs, and that is the continuity. If you stick to one task per session, you'll rarely hit compaction at all.

Type `/clear` in Claude Code, or start a new session in the desktop app.

---

## 2. Read the Top of the Task, Then Switch Model

Every task file names the model that should run it (see [Task Patterns](/part-3/task-patterns)). So the first thing I do is ask Claude to read the task, then check that line and switch.

> "Read task 2.3 and tell me which model it recommends."

Then `/model` to switch (or Option+P on a Mac, Alt+P elsewhere).

How I pick:
- **Opus** runs about 99% of my work.
- **Fable** comes in when the app has a fundamental problem or a design problem Opus keeps circling.
- **On Pro**, alternate. Use Opus to plan and write the tasks. Let Sonnet run the simpler ones.

The model choice is written into the task when you plan the sprint, so you don't have to think about it on the day.

---

## 3. Plan Mode First

Switch to plan mode before Claude touches anything. In the terminal that's Shift+Tab. In VS Code it's the mode indicator, and in the desktop app it's the mode selector.

Then keep the prompt short:

> "Can we plan task 2.3?"

If your docs are good, Claude reads `CLAUDE.md`, the architecture doc, the sprint plan, the task and LEARNINGS, then proposes an approach. You only add context the docs don't have: an API link, a changed requirement, a constraint.

For **bugs and fixes**, plan mode matters even more. Claude's first guess at a bug is often wrong, and changing code on a guess makes new bugs.

```
I need to fix this: [describe the problem, attach a screenshot]

Investigate and propose a plan before changing anything.
```

### Read the plan before you approve it

This is where it goes wrong, and it's usually the human's fault. Claude spells out exactly what it's about to do. You skim it, say "just do it", and an hour later you're unhappy with something the plan told you about in plain words.

Read it. If a line surprises you, ask about it. If you don't understand it, ask Claude to explain it the way your `CLAUDE.md` says you like things explained. Two minutes here saves an evening.

### Push it further

Claude errs on the side of caution. It will happily build what you asked for and keep quiet about the bolder option. So before approving, I often ask:

> "What would you recommend here that you haven't suggested?"

That's how you hear about things it tends to avoid unprompted, like setting up SSH access to your server or testing against real data instead of made-up samples. You don't have to take the advice. You do want to hear it.

---

## 4. Build

Once the plan looks right, approve it and let Claude work. It will create files, edit code and run commands. By default it asks before anything risky. Say yes quickly to the routine stuff (installs, tests). Slow down for anything destructive: deleting files, touching a database, Git operations.

If it heads somewhere you didn't expect, press **Esc** to stop it and talk it through. `/rewind` rolls back to an earlier checkpoint if it has already made a mess.

---

## 5. Tests, Including Headless Browser Tests

After the build, Claude runs the tests. Backend tests, and headless browser tests that click through the app the way a person would. They run in the background, so you won't see a browser window pop up. That's normal.

Your `CLAUDE.md` should ask for both. See [Testing](/part-4/testing) for how I set this up.

---

## 6. Screenshots, Both Ways

Screenshots matter more with Claude Code than with anything I've used before.

**Claude's screenshots.** Ask Claude to capture the screens it changed. Then actually look at them. A test can pass while a button sits off the edge of a phone screen.

**Your screenshots.** When something looks wrong, take a screenshot and paste or drag it into the chat. A picture of a broken layout beats three paragraphs of "the thing on the left is sort of squashed". For small cosmetic tweaks (font sizes, colours, labels) the [Frontend Tweaker](/part-5/frontend-tweaker) conventions let you skip Claude entirely.

**Console errors.** When the page misbehaves, open the browser's developer tools (see [Browser DevTools](/part-0/browser-devtools)), copy what the Console tab says and paste it in. A screenshot of what's wrong plus the actual error message usually gets a fix in one round instead of three.

::: simple
The Code tab has a Browser pane that shows your running app. It's the easiest way to see what Claude just built without leaving the app.
:::

---

## 7. The Confidence Score

When Claude finishes, it should report something like this:

```markdown
## Confidence: 8/10

**Done:**
- Login and register endpoints working
- Tests passing (8/8), browser test of the sign-up flow passing
- Screenshots of the login page at laptop and phone width

**Deferred:**
- Rate limiting (Sprint 2 per roadmap)

**Notes:**
- 24h token expiry as discussed
- Added the bcrypt cost factor finding to LEARNINGS
```

Your job: try it yourself, check the score makes sense, and don't move on below 8/10. More on this in [Confidence Scoring](/part-3/confidence-scoring).

In my experience Claude won't let a task close quietly. It insists on you testing it and keeps chasing ("still waiting on your ruling on this"). Let it.

---

## When Claude Needs Several Rulings

Sometimes Claude comes back with five questions at once. Answering them in one long chat message is a mess.

Instead, ask it for an artifact:

> "Make me an artifact where I can click through these decisions one by one."

You get a small page with each question and its options. You click and type your answers, the artifact stores them, and they come back to Claude Code. Much easier than scrolling a wall of text, and nothing gets lost.

It also helps to have a line in `CLAUDE.md` asking Claude to put rulings in plain words: what each choice does for the person using the app, with its recommendation first.

---

## 8. Update the Docs, Then Close

Before you close, Claude updates what changed: the task file, the sprint plan, and LEARNINGS if it hit a gotcha worth remembering (see [Project Memory](/part-5/project-memory)). Your `CLAUDE.md` should say this happens at the end of every task, so you don't have to ask.

Then close the session. The next task gets a fresh one.

---

## When Things Go Wrong

**Claude seems confused.** Your docs may be incomplete or contradict each other. Check them.

**Claude does something unexpected.** Esc, back to plan mode, talk it through.

**Confidence below 8.** Ask what's missing and fix it.

**The task is taking forever.** It's probably too big. Split it.

**Going in circles on a bug.** Stop. Ask Claude to write a task doc of what's been tried and what's left, then start a fresh session. See [Context Management](/part-5/context-management).

---

## The Side-Task Trap

Halfway through a task, you or Claude spot something else that needs fixing somewhere else.

**Don't:** "While we're here, let's fix that too."

**Do:** "Good catch. Write a task doc for it and let's stay on this one."

Piling unrelated work into one session mixes concerns, makes changes you didn't plan, and eats your limits. Write the task doc and give it its own session later.

---

## Quick Reference

| Step | What happens |
|------|--------------|
| Fresh session | `/clear`. Claude reads the docs |
| Model | Read the task header, `/model` to switch |
| Plan mode | Claude proposes, you read and question |
| Build | Claude works, you approve risky commands |
| Test | Backend and headless browser tests in the background |
| Look | Screenshots both ways |
| Score | 8/10 or better to move on |
| Close | Docs updated, session closed |

---

**Next:** [Task Patterns](/part-3/task-patterns): how to write the task files Claude works from.
