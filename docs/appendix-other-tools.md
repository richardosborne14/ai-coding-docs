---
title: Other AI Coding Tools
description: Cline and the other options, what they cost compared with Claude Code, and when one of them might make sense
---

# Other AI Coding Tools

This whole guide uses Claude Code. That's what I use, and for most people it's the right call. But it isn't the only tool, and earlier versions of this guide were built around a different one. This page is where the others live.

## TLDR

- **Cline** is a VS Code extension that pays per request through an API. In my experience it gets you to a working app **about 4x faster** than Claude Code. It also costs **about 10x more**.
- **Claude Code** on a subscription is slower, and much cheaper. For about 90% of projects today, that's the better deal.
- Other tools exist (DeepSeek, Kimi Code and more). Their prices and features change too fast for me to quote, so check for yourself.
- The method is the same whichever tool you pick: talk it through, mockups, docs, one task per session, test, audit.

---

## Cline: fast, visible, and pay-as-you-go

[Cline](https://cline.bot) is an open-source extension for VS Code. It talks to a model through an API, and you pay for every request. You can top up credits inside Cline itself, or plug in your own API key from a provider such as Anthropic.

I built a lot of projects with it, including [RISE](/part-6/case-studies#rise-a-desktop-app) and the [OpsNest control panel](/part-6/case-studies#opsnest-control-panel-seeing-the-back-end). It's a good tool. I still moved.

### Where it wins

**Speed.** Watching both tools work on the same projects, Cline gets to a working app about four times faster. Same models, same kind of tasks. I don't have a verified explanation for the gap, so I won't invent one.

**You can watch it think.** Cline streams its reasoning, every terminal command and the output straight into the panel. You see it going in circles or missing something, and you hit Cancel and put it right. That's also a great way to learn.

**It's open source.** You can read it, fork it and build on it.

### Where it loses

**Price.** This is the big one. When I moved my own projects from Cline to Claude Code, I was shipping about the same amount of work each week for roughly a tenth of the money. Several of those projects switched mid-build, so it was the same codebase on both sides.

On a Claude subscription you have a session limit and a weekly limit. When you hit one, you wait. With pay-as-you-go, you never wait. You just pay. See [Plans & Limits](/part-0/plans-and-limits).

::: info One person's numbers
The 4x and 10x come from my own daily use of both tools, not from a controlled test. They held across projects, but treat them as a strong hint, not a published figure.
:::

### When Cline makes sense

- You have a hard deadline and the budget to match.
- You want to watch every step, and you know enough to spot a wrong turn.
- Your company already pays for API access and doesn't mind the bill.

If none of those is you, stay with Claude Code.

---

## If you do use Cline

### Set a spending limit first

Before anything else, put a cap on what you can spend. If you use your own API key, set a monthly limit in your provider's console and leave auto-reload off until you know your usage. Inside Cline, look for a per-task cost limit and set it low. A stuck loop with no limit can spend real money while you sleep.

### Settings I used

These are from my own setup. Cline's settings move around between versions, so the names may differ.

- **Auto-approve commands: off.** You see every terminal command before it runs.
- **Sub-agents: off.** They caused more errors than they saved time.
- **Checkpoints: off.** They slowed everything down. Git is your undo button.
- **Background edit: on.** Files are edited quietly instead of being rewritten in front of you.
- **Terminal execution in the background.** Fewer terminal tabs, and Cline reads the output more cleanly.

### Circuit breakers

On pay-as-you-go, a loop is expensive. One of my projects burned about $30 overnight on a deploy that kept polling a server over bad Wi-Fi. None of it did anything useful. Two limits would have stopped it:

1. **A hard cap on requests per task**, set in Cline. Around 20 to 25 for normal work, 10 for anything to do with deploys. The model can't talk its way past it.
2. **"Stop after three failures"** in your rules file. If the same thing fails three times, stop, write up what was tried, and ask. A fourth try is rarely the one that works.

And don't let it sit and watch a long build. Kick it off, come back, check.

### Keep your tabs tidy

Cline sends your open VS Code tabs along with every request. Ten tabs from yesterday add up over a 30-turn task. Close everything you're not working on before you start, and close each file once Cline has moved on.

### One task per conversation

Long conversations cost more because the whole history goes with every request. Finish a task, start a fresh conversation. Clear out Cline's history now and then too, as it gets big.

---

## The Cline rules files

Cline has its own versions of the files this guide builds on.

**`.clinerules`** is Cline's CLAUDE.md. It sits in the project root and Cline reads it every conversation. Everything in [Project Templates](/part-6/templates) about CLAUDE.md applies: who you are, unbreakable rules, the learnings habit, doc-length limits, testing, model per task. Name it exactly `.clinerules`, with the dot, in the root folder. Not `clinerules.md` and not in a subfolder. Files starting with a dot are hidden on some systems, so use `ls -a` to check it's there.

**`.clineignore`** lists paths Cline should leave out of its context. It uses the same format as `.gitignore`. A good starting point:

```
# Dependencies and build output
node_modules/
dist/
build/
.svelte-kit/
.next/

# Big files it never needs to read
package-lock.json
pnpm-lock.yaml
*.log
*.png
*.jpg

# Secrets
.env
.env.*
!.env.example

# Doc-heavy folders (it can still open a file you point it at)
docs/
dev-tasks/
```

The last two lines surprise people. Cline doesn't need every doc on every turn. It can read one when the task needs it. If it can't find something, tell it the path. Don't open up the whole folder.

Both files are moving to `project-templates/other-tools/cline/` in this guide's repo.

---

## Other options

There are plenty of other AI coding tools, and new ones every month. **DeepSeek** and **Kimi Code** come up a lot, and there are others. Some of them may well be cheaper or faster for some jobs.

I'm not going to quote their prices or list their features here. They change too often, and a wrong number on this page is worse than none. If you try one:

- Run it on a small, real task you've already done with Claude Code, and compare.
- Keep the method. Docs, one task per session, plan before building, tests, audits. None of that depends on the tool.
- Don't run two AI coding tools on the same project at once. They'll step on each other.

---

**Back to:** [Tool Selection](/part-1/tool-selection).
