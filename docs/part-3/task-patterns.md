---
title: Task Patterns
description: How to write task files Claude can pick up cold, and how to record what got done
---

# Task Patterns

## TLDR

Every task gets a file. The top says what it is, how you'll know it's done, and **which model should run it**. When the task is finished, Claude adds a short record of what it built and why.

Keep it brief. This is a reference, not a novel.

---

## The Task Header

This is what Claude reads at the start of every session, so it goes at the top:

```markdown
# Task 2.3: User Authentication

**Status:** Not started
**Recommended model:** Opus (Sonnet is fine if you're on Pro and it's a small change)
**Depends on:** 2.1 (database), 2.2 (API skeleton)

## Goal
A visitor can sign up, log in and stay logged in for a day.

## Done when
- [ ] Sign-up and login work in the browser
- [ ] Wrong password shows a clear message
- [ ] Backend tests and a browser test of the sign-up flow pass
- [ ] Screenshots at laptop and phone width look right
```

The **Recommended model** line is the one people skip, and it's the one that saves your limits. Write it when you plan the sprint, while you're thinking about how hard each task is. On the day, you read it and switch with `/model`. No decision needed.

How I fill it in:
- **Opus** for nearly everything.
- **Fable** for fundamental problems or design problems Opus hasn't cracked.
- **On Pro:** Opus writes the tasks. Sonnet can run the simple ones (copy changes, a new field on a form, a small bug with a known cause). Say so in the line.

---

## When the Task Is Done

Claude adds a short record under the header and flips the status:

```markdown
**Status:** Complete | **Confidence:** 8/10

## What I Built
Login and register endpoints with JWT tokens. Passwords hashed
with bcrypt (cost factor 12). Tokens expire in 24 hours.

## Decisions
- **24h expiry, no refresh tokens:** simpler for the MVP. Users
  log in again daily. Add refresh tokens in v1.0 if people complain.
- **Generic error message:** "Invalid credentials" for both wrong
  email and wrong password, so nobody can fish for accounts.

## Tests
8/8 backend tests passing. Browser test of sign-up passing.

## Notes
- Rate limiting deferred to Phase 2
- Added the bcrypt cost factor finding to LEARNINGS.md
```

That's it. Five minutes, and useful for months.

---

## What to Include

**What was built:** two or three sentences.

**Key decisions:** the non-obvious choices, and why.

**Tests:** passing or not, and what they cover.

**Confidence score:** honest. 8/10 minimum to move on. See [Confidence Scoring](/part-3/confidence-scoring).

**Notes:** gotchas, deferred items, anything the next task needs to know.

## What to Leave Out

- File lists (Git has them)
- Step-by-step implementation (the code is the implementation)
- Anything already in the roadmap (link to it instead)
- "Next steps" (that's the roadmap's job)

---

## Where Task Files Live

For a small project, one folder is enough:

```
docs/
└── tasks/
    ├── 1.1-project-setup.md
    ├── 1.2-database.md
    ├── 2.1-core-feature.md
    └── ...
```

Name them by task number. Done.

### For bigger projects: a folder per phase

Once a project runs to dozens of tasks, I give each phase its own folder. This is the shape I use on OpenNoodl:

```
docs/tasks/phase-07-first-play-test/
├── README.md                # who it's for, the order, the rules, the close condition
├── T-001-text-that-wraps.md
├── T-002-the-look.md
├── T-003-one-screen-per-question.md
├── shots/                   # before and after screenshots
└── NEXT-SESSION-PROMPT.md   # one file, overwritten each session
```

- **README.md** says who the phase is for, the order to do the tasks in, the rules every task inherits, and what "done" means for the whole phase.
- **The task files** follow the header above.
- **shots/** holds the screenshots Claude takes, named so "before" and "after" sit side by side.
- **NEXT-SESSION-PROMPT.md** is the handover for the next session. There is one, and it gets overwritten. I once let a project pile up eighteen numbered handover files. Don't.

---

## For Complex Tasks

If a task had a bumpy ride (a tricky refactor, an odd platform bug), add a short changelog so the next person knows why things ended up this way:

```markdown
## Changelog
- Tried approach A, hit issue X
- Switched to approach B, worked
- Found an edge case with Y, added handling
```

For most tasks you won't need it.

---

## The Point

Task files exist so future you, or Claude in a fresh session, can pick up the work cold and understand what was done and why.

If that takes 15 lines, great. 30 is fine. You probably don't need 100.

---

**Next:** [Confidence Scoring](/part-3/confidence-scoring): the quality gate that keeps everything solid.
