---
title: Team Workflows
description: Adapting the method for more than one person building with Claude
---

# Team Workflows

## TLDR

The method works for teams with a few additions: shared standards in CLAUDE.md, clear ownership of each task, and Claude as the first reviewer on every pull request.

---

## What changes with a team

On your own, you own everything, the docs serve you and Claude, and there's nobody to coordinate with.

On a team, ownership is shared, the docs serve everyone, and you have to coordinate. The principles don't change. The docs just matter more.

---

## Shared documentation

**CLAUDE.md becomes the team contract.** It's committed to the repo, so everyone's Claude reads the same rules. The code comes out consistent whoever is prompting.

```markdown
# Team standards

## Code style
- Prettier for formatting (automatic)
- ESLint for linting (automatic)
- Comment every function and any logic that isn't obvious

## Git
- Branch names: feature/task-X.X-short-description
- Commit messages: "Task X.X: Description"
- Pull requests need passing tests, one human approval and a Claude review

## Task ownership
- One person per task
- Update the roadmap when you start or finish a task
- Don't work on someone else's active task
```

Personal preferences go in each person's own `CLAUDE.local.md` or `~/.claude/CLAUDE.md`, not the shared file.

**The roadmap shows who owns what:**

```markdown
### Task 2.1: User authentication
Owner: Sarah
Status: In progress
Branch: feature/task-2.1-auth

### Task 2.2: Database schema
Owner: Mike
Status: Done
Confidence: 8/10

### Task 2.3: API endpoints
Owner: Unassigned
Status: Not started
```

Everyone knows who's doing what, so nobody treads on anyone.

---

## Handing out tasks

**Keep tasks independent where you can.**

```
├── Task 2.1: Auth (Sarah), standalone
├── Task 2.2: Database (Mike), standalone
├── Task 2.3: API (unassigned), needs 2.1 and 2.2
└── Task 2.4: UI (unassigned), needs 2.3
```

Sarah and Mike work in parallel. Task 2.3 waits for both.

**When tasks have to overlap, agree the interface first.**

```markdown
## Interface agreement: Auth to API

Auth (Sarah) will export:
- requireAuth middleware
- User type
- Token validation function

API (Mike) will expect:
- req.user.id after the auth middleware
- 401 responses shaped as { error: string }

Agreed: 2026-03-10
```

Both sides build to the agreement, and the pieces fit when they meet.

---

## Claude as first reviewer

Before a human looks at a pull request, Claude does. Something like:

```
Review this pull request for:
- Bugs or logic errors
- Security problems
- Anything that breaks the rules in CLAUDE.md
- Missing tests

Be specific. Give file names and line numbers.
```

Claude catches the mechanical problems. The human reviewer can then focus on what Claude can't judge:

- Does this solve the right problem?
- Is the approach sensible?
- Do I understand this code well enough to maintain it?

**A pull request template:**

```markdown
## Task
Task X.X: [Name]

## Changes
[Short description]

## Confidence
X/10: [Short reason]

## Testing
- [ ] Unit tests pass
- [ ] Browser tests pass
- [ ] Checked by hand
- [ ] Claude review done

## Notes for the reviewer
[Anything they should know]
```

---

## Handling conflicts

**Two people edit the roadmap at once.** You get a Git merge conflict. Pick one source of truth. A task board (Linear, Notion, GitHub Projects) works well as the master, and you can generate the roadmap file from it if Claude needs one.

**Two people disagree on an approach.** Sarah wants A, Mike wants B. Often either would work. Pick one, write it down, and stick with it:

```markdown
## 2026-03-10: API response format
Decided: always return { data, error, message }.
Considered: just { data }, or { result }.
Decided by: the team
Why: the client can handle every response the same way.
```

Keep these in a decisions file in the repo, not in someone's personal memory. Claude's auto memory lives on one person's machine, so the rest of the team (and their Claude) won't see it.

---

## Bringing someone new in

**Day one:**
1. Read the README.
2. Read CLAUDE.md.
3. Set up the project and get it running.
4. Read one finished task file end to end.

**First task:** something small and standalone. Pair with someone for the first session, and review their task file carefully.

**Ramp-up:** small tasks with review in week one, medium tasks with lighter review in week two, the normal flow from week three.

Good docs make this quick. The new person reads them, understands the context, and contributes early. So does their Claude.

---

## How to communicate

**Write by default.** Task files hold decisions. The decisions file holds what the team agreed. Pull requests carry their context in the description. Questions go in pull request comments or chat.

**Talk when you need to decide something:** architecture, interface agreements, blocked tasks, a nasty bug.

Don't hold a meeting to share something that could be written down. Meet to decide.

---

## Quality across the team

**Each person** scores confidence on their own tasks. Anything under 8/10 doesn't go up for review.

**The team** does phase audits together. Everyone reads the findings, and the follow-up tasks get shared out.

**The lead** spot-checks confidence scores. Are people being honest? Are the standards holding?

---

## Before you go from solo to team

- [ ] CLAUDE.md covers the team standards
- [ ] The roadmap or task board tracks ownership
- [ ] The Git workflow is written down
- [ ] There's a pull request template
- [ ] There's a Claude review prompt (or a review skill)
- [ ] There's an onboarding doc

Most of the method stays the same. The docs just have to be clear enough for several people, and several Claudes, to follow.

---

**Next:** [The Project Control Panel](/part-5/control-panel)
