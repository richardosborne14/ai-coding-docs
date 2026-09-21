---
title: Documentation Architecture
description: CLAUDE.md first. Who you are, the rules Claude must never break, what it has learned, and how to stop the docs growing out of control.
---

# Documentation Architecture

## TLDR

Claude starts every session knowing nothing. Your docs are all it has. Get them right and it works on its own. Get them wrong and you explain the same things every day.

The centre of it all is **CLAUDE.md**. Mine always has five things in it:

1. **Who I am**, and how techie I am. That sets how Claude talks to me and how much it does without asking.
2. **Unbreakable rules**, which Claude may suggest changing but never ignores.
3. **Testing rules**, including browser tests that run in the background.
4. **Where lessons go**: a place for bugs and gotchas that it re-reads.
5. **Length rules**, so the docs don't grow until nobody reads them.

Around it sit a README, an ARCHITECTURE.md with real schemas, and a folder of phase plans and task files. Claude writes all of it after the mockups are settled. You review it.

---

## CLAUDE.md: the file Claude reads first

Claude Code loads CLAUDE.md at the start of every session. It's the one file you can be sure it has read.

Where it can live:

| File | Who it's for |
|------|--------------|
| `CLAUDE.md` in the project root (or `.claude/CLAUDE.md`) | Everyone working on this project. Commit it. |
| `CLAUDE.local.md` in the project root | Just you, on this project |
| `~/.claude/CLAUDE.md` | Just you, on every project |

Running `/init` in Claude Code writes a starter CLAUDE.md from what's in your repo. It's a decent first draft. Then add the sections below.

CLAUDE.md can pull in other files with `@path/to/file`. That's handy, but everything you import gets loaded too, so don't import your whole docs folder.

### 1. Who I am

This is the section people skip and the one that changes the most. Chat knows you from earlier conversations. Claude Code doesn't (see [Brainstorming](/part-2/brainstorming)). So write it down.

How techie you are should decide:

- **How Claude talks to you.** Jargon or plain words.
- **How it reports.** A two-line summary or the full technical detail.
- **How much initiative it takes.** Does it go ahead and fix the obvious thing next door, or ask first?
- **How literally it follows instructions.** To the letter, or "do what I meant"?

Two made-up examples:

```markdown
## Who you're working with
Sam runs a yoga studio and has never written code.
- Use plain words. If you need a technical term, explain it once.
- Report in two or three sentences: what changed, what Sam should check, how.
- Don't change anything outside the task without asking.
- When Sam's request is unclear, ask one question before starting.
- Before closing a task, tell Sam exactly what to click to test it.
```

```markdown
## Who you're working with
Priya is a senior developer.
- Be direct and technical. Skip the basics.
- Take initiative on small, obvious fixes. Mention them in the report.
- Recommend things, even ones that feel risky (SSH to the server,
  testing against real data). Say what the risk is and let Priya decide.
- Ask before architectural changes or anything destructive.
```

My own starts: "You are assisting Richard, an experienced CTO and full-stack developer... Direct and technical... Assumes competence." That one paragraph changes every answer I get.

::: tip Tell it to push you
Claude tends to play safe. Whatever your level, add something like: "Think beyond the task. If you see a problem I'll hit later, or something I should be doing and am not, say so." Otherwise it keeps quiet about things it could have warned you about.
:::

### 2. Unbreakable rules

The short list Claude must always follow. Keep it short. A rule it can't find is a rule it doesn't follow.

```markdown
## Unbreakable rules
- No task is done without proof: tests pass, or the user has checked it.
- Plan first. Write the plan, wait for approval, then build.
- One task per session. Side issues become new task files.
- No new dependencies without asking.
- No secrets in code.
- Do not estimate how long tasks will take.
- If the same error happens three times, stop and write up what you tried.

You may propose changes to these rules. Say which rule, why, and what
it should say instead. Never change or skip one without my OK.
```

That last paragraph matters. Rules go out of date. When one keeps getting in the way, I want Claude to tell me, not quietly work around it.

### 3. Testing, including the browser

Ask for tests at both ends:

- **Backend tests** for the logic.
- **Headless browser tests** that click through the app like a user would. "Headless" means the browser runs in the background. You don't sit and watch it.

On one of my projects every game gets a full background playtest after each change. Claude runs it, looks at the screenshots and fixes what broke. Then I play it myself, because a green test alone closes nothing. More in [Testing](/part-4/testing).

### 4. Where lessons go

Claude will hit bugs, find gotchas and learn how your project really works. If that knowledge lives only in one session, it's gone when the session ends. So CLAUDE.md tells Claude where to write lessons down and to read them before it starts.

There are two ways to do it.

**A learnings file.** One `LEARNINGS.md` with short entries. Simple, and fine for a small project.

**One lesson per file, plus an index.** Each lesson is its own small file. A single index file lists them, one line each. Claude reads the index every session and opens a lesson when it's relevant. Claude Code's own auto memory works this way: it writes notes from your corrections and loads the first part of the index every session.

A lesson file looks like this:

```markdown
---
name: store-booking-times-in-utc
description: Bookings showed an hour late after the clocks changed.
  Store UTC, convert only when displaying.
---
Found while fixing the calendar view.

**Why:** times were saved in local time, so the clock change moved them.

**How to apply:** save every date as UTC. Convert to the user's time
zone in the display code only. Test with a date either side of a clock change.
```

The **Why** stops Claude applying the rule blindly. The **How to apply** tells it what to actually do. My biggest project has over a thousand of these, and they work far better than one long file. More in [Project Memory](/part-5/project-memory).

```markdown
## Lessons
- Before starting a task, read memory/MEMORY.md.
- When you fix a bug that could happen again, write a lesson file
  and add one line to the index.
- If a lesson turns out to be wrong, fix it or delete it.
```

### 5. Length rules

This is the problem nobody warns you about: docs get **too long**.

Every session adds a bit. Nobody removes anything. My OpenNoodl repo has a learnings file that reached **2,231 lines**, and a main rules file of 1,246 lines. At that size Claude can't take it all in, and the important rules get buried under old ones. A long doc is a doc nobody reads, human or AI.

So CLAUDE.md needs rules for when a doc gets too big:

```markdown
## Doc length
- CLAUDE.md stays under 200 lines. Anything longer moves to its own
  file, with a one-line link here.
- Any other doc over 400 lines: summarise it, split it by topic,
  or move old material to docs/archive/ with a dated file name.
- When a phase is finished, move its task files to the archive.
  Keep only what's still true in the main docs.
- The memory index has a size budget. Whoever adds a line trims
  another in the same edit.
```

Pick your own numbers. What matters is having a number.

::: warning An unlinked memory is invisible
When you archive or trim, check what you're cutting. Claude only reads what's loaded or linked. If you delete the line that points to a lesson, the lesson is gone in practice, even though the file is still on disk. I learned this the hard way when a tidy-up nearly unlinked a dozen lessons that still mattered. Before removing a pointer, ask: "is this still true?" If so, move it somewhere that stays linked.
:::

---

## The other foundation docs

| Doc | What's in it | Updated |
|-----|--------------|---------|
| **README.md** | What the app is, the current phase, the stack | Each phase |
| **ARCHITECTURE.md** | Schemas, pages, how auth works, how it's deployed, key decisions and why | When the structure changes |
| **Phase plans** | The tasks in a phase, their order, what "done" means | Each phase |
| **Task files** | One per task: context, requirements, files to touch, checks, which model runs it | Written once, used once |
| **docs/mockups/** | The screens from [Mockups First](/part-2/mockups-first) | When the design changes |

### ARCHITECTURE.md needs real schemas

Descriptions aren't enough. Give it actual tables:

```markdown
### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| role | ENUM('user','admin') | DEFAULT 'user' |
| created_at | TIMESTAMP | DEFAULT NOW() |
```

With this, Claude writes the right queries first time. Without it, it guesses column names and you spend an afternoon on mismatches. See the [VH Conference Toolkit](https://github.com/Visual-Hive/vh-conference-toolkit) for a full real example.

### Phase plans and task files

A phase plan lists the tasks, their order and when the phase counts as finished. Each task gets its own file, and the top line says which model should run it:

```markdown
# TASK 003: Login page
**Recommended model:** Sonnet (simple, well specified)

## Context
## Requirements
## Files to touch
## How to check it's done
```

A clear task file is what lets Claude get on with it without twenty questions. The full format is in [Task Documentation](/part-3/task-patterns).

::: everything A typical layout
```
CLAUDE.md
README.md
docs/
├── ARCHITECTURE.md
├── mockups/
├── archive/
└── phases/
    └── phase-01-foundations/
        ├── README.md          # the plan
        ├── TASK-001-setup.md
        ├── TASK-002-layout.md
        └── TASK-003-login.md
memory/
├── MEMORY.md                  # the index
└── store-booking-times-in-utc.md
```
:::

---

## Writing them quickly

Once the mockups are settled and you've talked through the stack, ask Claude Code (Opus) to write the lot:

```
Based on the brainstorm summary and the mockups in docs/mockups/,
write the foundation docs for this project:

1. CLAUDE.md with: who I am (see the note below), unbreakable
   rules you may propose changes to, where lessons go, doc length
   rules, and what to read before each task
2. README.md
3. ARCHITECTURE.md with full database schemas
4. A plan for phase 1 and one task file per task, each naming
   the model that should run it

Who I am: [paste the note Chat wrote for you]
```

Then read what it wrote. Push back on:

- Vague schemas. "Flexible data structure" should become column names.
- Soft rules. "Try to test" should be "tests are required".
- Oversized phases. If it's more than a dozen tasks, split it.
- Task files you couldn't hand to someone else without questions.

---

## How Claude uses them

Each new session:

1. Reads CLAUDE.md: who you are, the rules, where everything is.
2. Reads the memory index: lessons from earlier work.
3. Reads the phase plan: what's next.
4. Reads the task file: exactly what to build and how to check it.
5. Opens ARCHITECTURE.md and specific lessons when the task needs them.

That's why one task per session works. Starting fresh costs nothing, because the docs bring Claude up to speed.

---

## Not too little, not too much

**Too little:** five thin docs, no schemas, vague rules. Claude guesses, and guesses wrong.

**Too much:** a 1,200-line rules file and a learnings file nobody has pruned in months. Claude can't find what matters.

**About right:** a short CLAUDE.md that links to everything else, real schemas, a task file per task, lessons kept small and pruned, and an archive for the old stuff.

---

**Next:** [The Execution Workflow](/part-3/execution-workflow)

Building with VS Code or a terminal? There's an extra step first: [The Live Project Overview](/part-2/live-project-overview).
