---
title: Phase Audits
description: A fresh Claude Code session or subagent reviews the code at the end of each phase and catches what you've stopped seeing
---

# Phase Audits

## TLDR

At the end of a major phase (like the MVP), have a fresh Claude review the code. Either a new Claude Code session or a subagent. It catches the problems you and your working session have gone blind to.

It takes about half an hour, and it stops you shipping broken code.

---

## When to Audit

Audit at natural boundaries:

- **After the MVP**, before you show anyone
- **After the v1.0 features**, before you call it done
- **Before any deployment**, before it's live
- **When something feels off**. Trust your gut.

Not after every task. That's overkill. Audit after a meaningful chunk of work.

---

## The Process

::: everything Save your work first
Commit before the audit, so you can see exactly what the fixes changed afterwards:

```bash
git add .
git commit -m "MVP complete, ready for audit"
```
:::

**1. Start fresh**

Two options, both fine:
- **A new Claude Code session** (`/clear`, or a new session in the desktop app). The auditor starts with nothing but your repo and your docs.
- **A subagent.** From your working session, ask: "Use a subagent to audit the code for this phase." The subagent gets its own clean context and reports back.

What matters is that the auditor didn't build the thing. It sees your code without your assumptions.

**2. Give it the auditor prompt**

```
You're a senior developer reviewing this codebase.
Context: this is the end of the MVP phase of [one-line description].

Review for:
- Bugs or logic errors
- Security issues
- Missing error handling
- Code quality problems
- Test coverage gaps, including missing browser tests

Be critical. Rate overall quality 1-10 and list specific issues
with file and line references. Don't change any code.
```

That last line matters. You want a report, not a surprise refactor.

**3. Read the findings**

You'll get something like this:

```markdown
## Audit Result: 7/10

### Critical
1. API has no rate limiting, open to abuse
2. Password reset tokens never expire

### Important
3. Two database queries aren't parameterised (SQL injection risk)
4. Error messages show stack traces to users

### Minor
5. Leftover console.log statements
6. Inconsistent naming (userID vs UserId vs user_id)
```

**4. Turn the issues into tasks**

```markdown
## Audit Fix Tasks

- [ ] 4.A: Add rate limiting to API endpoints
- [ ] 4.B: Expire password reset tokens
- [ ] 4.C: Parameterise queries in user.js and orders.js
- [ ] 4.D: Hide error details in production
- [ ] 4.E: Clean up console.log and naming
```

Each fix task runs like any other: one per session, with the model named in its header. See [Task Patterns](/part-3/task-patterns).

**5. Fix, then re-audit**

After the fixes, run the audit again in another fresh session. 8/10 or better to move on.

---

## What Auditors Catch

**Things you stopped noticing:**
- The TODO from day one
- The error handling you meant to add
- The test you skipped "for now"

**Drift:**
- Early code follows different patterns from late code
- Naming conventions wandered
- Some files commented, others not

**Security:**
- Exposed secrets
- Missing validation
- Unsafe queries

**Integration problems:**
- Parts that work alone but not together
- Race conditions
- Missing edge cases

**Accessibility failures:**
- `<div onClick>` where a `<button>` belongs
- `outline: none` with no `:focus-visible` replacement
- Images without `alt`, inputs without labels

---

## What the Auditor Can't Do

An auditor reading source code will catch the mechanical accessibility failures above. It can't tell you whether a button's name makes sense to a person, whether the reading order works, or whether alt text is right rather than just present. Automated tools catch roughly a third of WCAG failures.

So every audit gets a 10-minute pass you do yourself. Unplug the mouse and tab through the main flow. Zoom to 200%. Then turn on the screen reader and get round one page. See [Accessibility by Default](/part-5/accessibility).

---

## Good Prompt, Bad Prompt

**Good:**
```
Review this codebase. Be critical. Find problems.
Rate 1-10 and list specific issues with file/line references.
```

**Bad:**
```
Look at my code and tell me it's good.
```

You want the auditor to find problems. Don't prime it to be nice.

---

## Handling the Results

**8/10 or more:** note the minor suggestions for later and move on.

**6-7/10:** fix the critical and important issues. The minor ones can wait. Re-audit.

**Below 6/10:** something went wrong in the process. Work out why quality slipped this far before you carry on.

**You disagree with a finding:** fine, Claude isn't always right. Think about it before you dismiss it, though. There's usually a grain of truth.

---

## How Often

| Project size | Audit points |
|--------------|--------------|
| Small MVP | Once, after the MVP |
| Medium project | After the MVP, after v1.0 |
| Large project | After each major phase |
| Team project | Before each merge to main |

It's a checkpoint, not a hobby.

---

## Why Fresh Eyes Work

**Your working session builds up:**
- Assumptions about how things work
- Knowledge of the "temporary" workarounds
- Blindness to issues it's seen a hundred times

**A fresh auditor sees:**
- The code as it is
- No assumptions
- No excuses

It doesn't know the journey. It only sees where you ended up.

---

**Next:** [Testing](/part-4/testing): backend tests and browser tests that run while you get on with your day.
