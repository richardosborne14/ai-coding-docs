---
title: Context Management
description: One task per session, a handoff between sessions, and a clean start every time
---

# Context Management

## TLDR

Claude works best with a short, focused conversation. So I run **one task per session**. When the task is done, I write a handoff, clear the session and start the next one fresh.

Two skills do the handoff for me. `/next` writes it. `/next-go` picks it up in a cleared session. There's one handoff file per phase, and it gets overwritten each time.

Work this way and you'll rarely see Claude compact a conversation, because no conversation lives long enough to need it.

**The most useful habit in this whole guide is knowing when to start a new session.**

---

## Why long sessions go wrong

Everything in the conversation stays in front of Claude: every message, every file it read, every failed attempt. As that pile grows, the task you care about gets a smaller share of Claude's attention.

You'll recognise the signs:

- Claude contradicts a decision it made an hour ago.
- It asks a question you already answered.
- It drifts back to an approach you rejected.
- The answers get vaguer.

Long sessions also eat into your plan's session limit faster, because every new reply carries the whole history with it. You don't need to count anything. Just know that a fresh session is cheaper as well as sharper. See [Plans and Limits](/part-0/plans-and-limits).

---

## One task, one session

```
Task 1: Database setup    → fresh session → done → handoff → /clear
Task 2: Login page        → fresh session → done → handoff → /clear
Task 3: Settings screen   → fresh session → done → handoff → /clear
```

Each task gets Claude's full attention, with nothing left over from the last one.

**What about continuity?** That's the job of your docs. CLAUDE.md, the architecture doc, the task file and the handoff carry everything the next session needs. Decisions live in files, not in chat history. Claude reads them at the start and it's back up to speed in a minute.

### Why you rarely hit compaction

When a conversation gets very long, Claude Code compacts it: it replaces the older part with a summary and carries on. That works, but a summary always loses detail. You don't choose which detail.

With one task per session, you almost never get there. A well-sized task finishes long before the conversation fills up. If you do see compaction happening often, your tasks are too big. Split them.

### Sizing a task for one session

- It touches a handful of files, not the whole app.
- It has a clear "done" you can check.
- Claude doesn't have to hold two unrelated problems in mind.

"Build the whole login system" is too big. "Build the login form with validation and tests" is about right. [Task Patterns](/part-3/task-patterns) goes into this properly.

---

## When to start fresh

Nine times out of ten, starting fresh beats carrying on.

**The task is done.** Hand off and clear, even if the next task looks related.

**You spot a side issue.** You're on the login page and notice the footer is broken. Don't fix it here. Ask Claude to write a short task file for the footer, stay on the login page, and do the footer in its own session.

**You're going round in circles.** If the same error has come back three times, stop. Ask Claude to write down what was tried and what's left, then start a fresh session with that note. The new session isn't weighed down by the failed attempts, and it often solves it quickly. [Common Pitfalls](/part-5/pitfalls-recovery) has more on this.

**The answers are getting worse.** Adding more messages won't fix a muddled conversation. It makes it worse. Start fresh.

The one exception: a quick follow-up straight after finishing a task. "Also make that button blue" can stay in the same session.

---

## Handoffs between sessions

A handoff is a short note from one session to the next. It says what's done, what isn't, what was decided and what to do next.

I don't write these by hand. I use two skills (see [Skills](/part-5/skills) for how they're built):

- **`/next`** closes out the session. It works out what the session was doing and writes or updates the handoff file for that phase.
- **`/next-go`** runs in the cleared session. It reads the handoff, checks the claims in it against the code, and carries on from the "what to do next" list.

So the end of every session looks like this:

1. Type `/next`. Read the handoff it writes.
2. Type `/clear` to start a fresh conversation.
3. Type `/next-go`.

A good handoff says:

```markdown
# Next session: Phase 3, settings screen

## Done and seen working
- Profile form saves and reloads (checked in the browser)

## Written but not yet seen working
- Password change endpoint (tests pass, not tried in the app)

## Decided
- Email changes need a confirmation link. The plan said instant, that was wrong.

## Next, in order
1. Try the password change in the browser
2. Build the delete-account button

## Needs a human decision
- Should deleting an account keep invoices for tax reasons?
```

The split between "seen working" and "only written" is the bit that matters most. Passing tests and working in the app are two different claims.

### One handoff file per phase, overwritten

Keep one handoff file per phase, for example `dev-docs/tasks/phase-3/NEXT-SESSION.md`, and overwrite it each time.

Don't let it stack up. I've seen a folder with `HANDOVER-SESSION-1.md` all the way to `HANDOVER-SESSION-18.md`. Nobody reads eighteen handoffs. Claude reads the wrong one, or all of them, and gets confused by advice that stopped being true a week ago. The latest state is all the next session needs. Anything worth keeping for longer belongs in [project memory](/part-5/project-memory) or the phase's README.

::: simple In the desktop app
The Code tab works the same way. Type `/next`, then `/clear`, then `/next-go` in the message box. Skills live in your project folder, so they're there whichever way you run Claude Code.
:::

---

## What to load, what to skip

Claude doesn't need your whole codebase for every task.

**Always there:** CLAUDE.md, which Claude Code loads by itself at the start of every session. Point it at the other docs that matter: the architecture doc, the current task file and the handoff.

**Found as needed:** source files, tests and dependencies for the task in hand. Claude is good at finding these.

**Leave out:** old task files, finished phases and whole folders "just in case". If Claude reads a finished phase's plan, it may follow it.

---

## Quick reference

| Situation | What to do |
|-----------|------------|
| Starting a new task | Fresh session |
| Task finished | `/next`, `/clear`, `/next-go` |
| Same error three times | Write a research note, fresh session |
| Side issue spotted | Task file for it, handle it later |
| Answers getting worse | Fresh session now |
| Compaction keeps happening | Tasks are too big, split them |
| Tiny follow-up to the task you just finished | Stay put |

## What to add to CLAUDE.md

```markdown
## Sessions
- One task per session. If I raise something unrelated, offer to write a task file for it instead.
- At the end of a task, remind me to run /next.
- Keep one handoff file per phase. Overwrite it. Never add a numbered or dated copy.
- In the handoff, keep "seen working" separate from "written but not yet seen working".
- If the same error comes back three times, stop and write a research note before trying again.
```

---

**Next:** [Skills](/part-5/skills)
