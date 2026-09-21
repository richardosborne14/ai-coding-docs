---
title: Plans & Limits
description: What the Claude plans cost, what each one gets you, how the usage limits work, and which model to use for what.
---

# Plans & Limits

## TLDR

You need a paid plan to build with Claude Code. **Pro** ($20 a month) is fine to get your feet wet. **Max** ($100 or $200 a month) is worth it once you're serious. You don't count tokens any more: you keep an eye on two limits, one that resets every five hours and one that resets weekly. I use **Opus** for almost everything, and every task file says which model should run it.

Prices were checked on [claude.com/pricing](https://claude.com/pricing) in September 2026. Check there before you buy, because they change.

---

## The plans

| Plan | Price | Models | Claude Code? |
|------|-------|--------|--------------|
| **Free** | $0 | Sonnet, Haiku | No |
| **Pro** | $20/month, or $17/month paid yearly | Opus, Sonnet, Haiku. Fable on pay-as-you-go credits | Yes |
| **Max 5x** | $100/month | Opus, Sonnet, Haiku. Fable can use up to half your weekly limit at no extra cost | Yes |
| **Max 20x** | $200/month | As Max 5x, with more room | Yes |

Team and Enterprise plans exist too, and they include Claude Code. If your company already pays for one, ask.

### What I'd tell a friend

- **Free** is tough. You get Sonnet only, not much of it, and no Claude Code. It's fine for asking questions, not for building.
- **Pro** is where to start. You can do the whole process on it, from brainstorming to a running V1. On a real project you will hit the limits, and you'll spend some time waiting for them to reset.
- **Max 5x** is what I'd get once you've decided the project is real. The higher limits matter most after launch, when you're fixing bugs, adding features and maintaining the thing week after week.
- **Max 20x** is for people who work with Claude all day, every day.

---

## How the limits work

There are no credits to top up and no per-message bill. Instead there are two limits:

- **A session limit.** It resets every five hours.
- **A weekly limit** across all models. It resets at a fixed time each week, set for your account.

Anthropic doesn't publish exact numbers, so I won't guess at them here. What matters is the habit: check where you are before you start a big task. In Claude Code, `/usage` shows how much you've used.

What eats your limits fastest:

- **Long sessions.** Everything in the conversation is re-read on every turn. One task per session keeps each session short (see [Context Management](/part-5/context-management)).
- **Going round in circles.** If the same bug has come back three times, stop. Write down what you know and start fresh.
- **Big models on small jobs.** Renaming a button doesn't need Opus.

::: tip Plan around the reset
If you're near the session limit, don't start a big task. Use the time to read the plan Claude wrote, test what it built, or write the next task file in Chat. By the time you're ready, the limit has reset.
:::

---

## Which model for what

| Model | What I use it for |
|-------|-------------------|
| **Opus** | Nearly everything. Brainstorming, architecture, writing the task files, and building. About 99% of my work. |
| **Fable** | When the app has a fundamental problem, or the design isn't working and I need a fresh, deeper look. |
| **Sonnet** | Small, well-specified tasks, especially on Pro when I want my limits to last. |
| **Haiku** | Quick questions. I rarely use it for building. |

### Put the model in the task

Every task file I write starts with a line like this:

```markdown
**Recommended model:** Opus (Sonnet is fine if you're on Pro and short on limit)
```

At the start of each session, read the top of the task and switch model before you begin. In Claude Code that's `/model`.

On **Pro**, the pattern that works is: Opus plans the sprint and writes detailed task files, and Sonnet runs the simpler tasks. A clear task file lets a smaller model do good work. More in [Task Documentation](/part-3/task-patterns).

::: warning Cheaper models from other companies
Some people switch to cheaper models from other providers to save money. It can work, but this guide relies on how well Claude plans and how honestly it says "I'm not sure". Different tools also fail in different ways. For most people it isn't worth it. If you're curious, see [Other AI Coding Tools](/appendix-other-tools).
:::

---

## What happened to token counting?

Earlier versions of this guide spent a lot of time on token costs, because the tools I used back then billed per request. On a Claude subscription you pay a flat monthly price and watch your limits instead. The habits that saved money then still save limits now: short sessions, clear task files, and stopping early when something goes round in circles.

---

**Next:** [Claude Code: Setup & Customisation](/part-0/claude-code-setup)
