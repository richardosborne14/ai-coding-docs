---
title: Confidence Scoring
description: The 8/10 rule that stops a shaky task from breaking everything built on top of it
---

# Confidence Scoring

## TLDR

After every task, Claude rates its confidence from 1 to 10. Below 8, you fix it before moving on.

This one habit stops broken foundations from quietly wrecking everything you build on top.

---

## How It Works

At the end of each task, Claude answers one question:

> "How confident are you that this is done right?"

**8/10:** it works, it's tested, errors are handled, the code is clean. Solid enough to build on.

**9/10:** all of that, and it's good work. You'd show it to someone.

**7/10:** something's off. Thin tests, unhandled edge cases, or a decision nobody's sure about. Fix it.

**6/10 or below:** stop. Something is fundamentally wrong.

Put the rule in your `CLAUDE.md` so every task ends with a score without you asking.

---

## The Format

Keep it simple:

```markdown
## Confidence: 8/10

**Must-haves (met):**
- [x] Core functionality works
- [x] Errors handled
- [x] Tests pass (backend and browser)
- [x] Code readable

**Deferred:**
- [ ] Rate limiting (Phase 2)
- [ ] Advanced validation (v1.0)
```

Ten lines. Don't over-engineer it.

---

## What Counts as 8/10

The bar is "solid enough to build on", not perfection.

**8/10 code:**
- Does what it's supposed to do
- Handles the obvious error cases
- Has tests for the important paths
- Can be read by someone else (or by Claude next session)
- Has no known bugs you're ignoring

**8/10 doesn't need:**
- Every edge case handled
- 100% test coverage
- Perfect performance
- Production hardening

Those are 9s and 10s. For an MVP, 8 is the target.

---

## When You're Below 8

Don't haggle with yourself. At 7/10, something's wrong.

**Common gaps:**
- "Tests pass but I'm not sure they test the right things." Write better tests.
- "It works but the error handling is sketchy." Add error handling.
- "I'm not sure about this architectural decision." Think it through, or ask.
- "There's a bug I haven't fixed." Fix the bug.

**How it sounds:**
```
Claude: "Confidence: 7/10. Login works, but I haven't
tested what happens when the database is down."

You: "Add that test and the handling before we move on."

Claude: [adds test, adds handling]

Claude: "Confidence: 8/10. Database errors now return 503
with a retry message. Test added."
```

Now you can move on.

---

## Why It Matters

Without scoring, broken code piles up:

```
Task 1: Auth (buggy) → "good enough, carry on"
Task 2: Database (built on buggy auth) → "some issues, carry on"
Task 3: API (built on buggy database) → "not sure why this fails"
Task 4: UI (nothing works) → "everything is broken"
```

With scoring:

```
Task 1: Auth → 7/10 → Fix → 8/10 → Carry on
Task 2: Database → 8/10 → Carry on
Task 3: API → 8/10 → Carry on
Task 4: UI → Works, because the foundation is solid
```

The extra hour on Task 1 saves days of debugging on Task 4.

---

## Be Honest

The score only works if it's honest.

**Temptation:** "It's probably fine. Call it 8 and move on."

**Reality check:** would you bet £100 this task is solid? If not, it isn't an 8.

**Don't take the number on trust.** When Claude says 8/10, look at the screenshots, try it yourself, and poke at the edge cases. The score is Claude's view. Your replay is the one that counts.

---

## Quick Reference

| Score | Meaning | Action |
|-------|---------|--------|
| 9-10 | Excellent | Carry on, maybe celebrate |
| 8 | Solid | Carry on |
| 7 | Gaps | Fix before carrying on |
| 6 | Real problems | Stop and fix |
| 5 or less | Fundamentally broken | Rethink the approach |

---

**Next:** [Phase Audits](/part-4/phase-audits): fresh eyes between major milestones.
