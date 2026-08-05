---
title: Phase Audits
description: Fresh AI eyes catch what you've stopped seeing
---

# Phase Audits

## TLDR

After finishing a major phase (like MVP), get a fresh AI instance to review your code. It catches accumulated issues you've become blind to.

Takes 30 minutes. Prevents shipping broken code.

---

## When to Audit

Audit at natural boundaries:

- **After MVP complete** — Before showing anyone
- **After v1.0 features done** — Before calling it "done"
- **Before any deployment** — Before it's live
- **When something feels off** — Trust your gut

Don't audit after every task. That's overkill. Audit after completing a meaningful chunk of work.

---

## The Process

**1. Push your code to GitHub**

```bash
git add .
git commit -m "MVP complete - ready for audit"
git push
```

**2. Start a fresh Claude conversation**

Not the same chat you've been working in. Fresh context matters—it sees your code without your assumptions.

**3. Give it the auditor prompt**

```
You're a senior developer reviewing this codebase.

Repo: [link or attach files]
Context: This is the MVP phase of [brief description].

Please review for:
- Bugs or logic errors
- Security issues
- Missing error handling
- Code quality problems
- Test coverage gaps

Rate overall quality 1-10 and list specific issues to fix.
```

**4. Review the findings**

AI will return something like:

```markdown
## Audit Result: 7/10

### Issues Found

**Critical:**
1. API endpoint has no rate limiting - vulnerable to abuse
2. Password reset tokens don't expire

**Important:**
3. Database queries aren't parameterized in 2 places (SQL injection risk)
4. Error messages expose stack traces to users

**Minor:**
5. Some console.log statements left in
6. Inconsistent naming (userID vs UserId vs user_id)
```

**5. Create fix tasks**

Turn issues into tasks:

```markdown
## Audit Fix Tasks

- [ ] 4.A: Add rate limiting to API endpoints
- [ ] 4.B: Add expiration to password reset tokens
- [ ] 4.C: Fix SQL parameterization in user.js and orders.js
- [ ] 4.D: Sanitize error messages for production
- [ ] 4.E: Clean up console.log and naming
```

**6. Fix, then re-audit**

After fixing, run the audit again. Should hit 8/10+ to proceed.

---

## What Auditors Catch

**Things you stopped noticing:**
- That TODO you wrote on day 1 and forgot
- The error handling you meant to add
- The test you skipped "temporarily"

**Accumulated inconsistencies:**
- Early code follows different patterns than late code
- Naming conventions drifted
- Some files commented, others not

**Security issues:**
- Exposed secrets
- Missing validation
- Unsafe queries

**Integration problems:**
- Components that work alone but not together
- Race conditions
- Missing edge case handling

**Accessibility failures:**
- `<div onClick>` where a `<button>` belongs
- `outline: none` with no `:focus-visible` replacement
- Images without `alt`, inputs without labels

---

## The One Thing the AI Auditor Can't Do

An auditor — human or AI — reading source will catch the mechanical accessibility failures above. It cannot tell you whether a button's name is *meaningful*, whether the reading order makes sense, or whether alt text is *right* rather than merely present. Automated tooling detects roughly a third of WCAG failures.

So every audit gets a 10-minute pass you do yourself: unplug the mouse and tab through the main flow, zoom to 200%, then turn on the screen reader and navigate one page. See [Accessibility by Default](/part-5/accessibility).

---

## Good Audit vs Bad Audit

**Good audit prompt:**
```
Review this codebase. Be critical. Find problems.
Rate 1-10 and list specific issues with file/line references.
```

**Bad audit prompt:**
```
Look at my code and tell me it's good.
```

You want the auditor to find problems. That's the point. Don't prime it to be nice.

---

## Handling Audit Results

**If 8/10+:** Nice. Note any minor suggestions for later, continue to next phase.

**If 6-7/10:** Fix the critical and important issues. Minor stuff can wait. Re-audit.

**If below 6/10:** Something went wrong. Review your process. Why did quality slip this much?

**If you disagree with a finding:** That's fine. AI isn't always right. But think about it before dismissing. Usually there's at least a grain of truth.

---

## Audit Frequency

| Project Size | Audit Points |
|--------------|--------------|
| Small MVP | Once, after MVP complete |
| Medium project | After MVP, after v1.0 |
| Large project | After each major phase |
| Team project | Before each merge to main |

Don't over-audit. It's a checkpoint, not a constant activity.

---

## The Fresh Eyes Effect

Why does a new AI instance catch things your working instance missed?

**Your working context accumulates:**
- Assumptions about how things work
- Knowledge of "temporary" workarounds
- Blindness to issues you've seen 100 times

**Fresh context sees:**
- Just the code as it exists
- No assumptions
- No excuses

This is why audits work. The auditor doesn't know your journey. It just sees the destination.

---

**Next:** [Commenting Philosophy](/part-4/commenting-philosophy) — Why 50% comments isn't crazy.