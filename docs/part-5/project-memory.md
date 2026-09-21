---
title: Project Memory & Self-Improvement
description: CLAUDE.md for the rules, auto memory for the lessons, and a plan for when a project outgrows both
---

# Project Memory & Self-Improvement

## TLDR

Every Claude Code session starts with a blank conversation. What carries over is what's written down. Two things do that job:

- **CLAUDE.md** holds the rules. Claude Code loads it at the start of every session.
- **Auto memory** holds the lessons. Claude writes these itself when you correct it or it finds a trap, and it reads the index every session.

I keep lessons one per file, each with a **Why:** and a **How to apply:** line, and a short `MEMORY.md` index pointing to them. Claude loads the index and opens only the lessons it needs.

The real risk is size, not forgetting. Memory that grows without limits turns into the thing Claude can't find anything in. So this page is mostly about keeping it small. For big or long projects, there's a section at the end on scaling memory up.

::: tip Chat knows you, Code knows your repo
Claude Code doesn't see the memory Claude Chat keeps about you. Chat's memory is shared with Cowork only. So anything Code should know about you, such as how techie you are, has to go in CLAUDE.md or its own memory.
:::

---

## Hot, warm and cold

Not everything needs to be in front of Claude all the time. I think of project knowledge in three layers.

| Layer | What lives there | Where | When Claude reads it |
|-------|------------------|-------|----------------------|
| **Hot** | Rules, who you are, the current task | CLAUDE.md, the task file, the handoff | Every session |
| **Warm** | Lessons, traps, past fixes | Auto memory: the index every session, each lesson when relevant | On demand |
| **Cold** | Finished phases, old plans, retired notes | An `archive/` folder | Almost never |

Hot has to be small and current, because Claude reads all of it every time. Warm can be large, as long as the index is good. Cold is for things you might one day want to look up, kept out of Claude's way.

---

## CLAUDE.md: the rules

CLAUDE.md is the file Claude Code reads at the start of every session. It can live in a few places:

| File | Who it applies to |
|------|-------------------|
| `~/.claude/CLAUDE.md` | You, in every project |
| `./CLAUDE.md` or `./.claude/CLAUDE.md` | Everyone on this project |
| `./CLAUDE.local.md` | You, on this project only |

Run `/init` in a new project and Claude writes a starter CLAUDE.md for you. You can pull other files in with `@path/to/file`, which keeps the main file short.

What belongs in it:

- Who you are and how techie you are, so Claude pitches its answers right.
- The rules that apply to every task: tests, plan first, how to report back.
- Where the other docs live.
- Length limits for your docs (see below).

What doesn't: lessons from one bug, notes on one task, anything that's only true this week. Those go in memory or the task file.

[Documentation Architecture](/part-2/documentation-architecture) covers the full set of project docs.

---

## Auto memory: the lessons

Auto memory is where Claude keeps notes it writes itself: your corrections, your preferences, traps it walked into. It's stored on your machine, per project, and doesn't go into your repo. At the start of every session Claude loads the first 200 lines (or 25KB) of the index. Anything past that isn't loaded.

That limit is why I keep memory as **one lesson per file**, with the index holding only a one-line pointer to each. Claude reads the index, sees which lessons match the task, and opens those.

A lesson file looks like this:

```markdown
---
name: check-the-server-terminal-for-500s
description: A 500 in the browser hides the real error. It is in the server terminal.
type: feedback
---

The browser shows "Internal Error" and nothing else. The stack trace is in
the terminal running the dev server.

**Why:** Twice now a session spent half an hour guessing from the browser
message when the answer was printed in the terminal all along.

**How to apply:** On any 500, read the server output first, before changing code.
```

The **Why:** line is what makes a lesson useful. Without it, Claude follows the rule blindly, or drops it the moment it seems inconvenient. With it, Claude can tell when the rule applies and when it doesn't.

And the index line that points to it:

```markdown
- [500s: read the server terminal](check-the-server-terminal-for-500s.md): the browser message hides the real error
```

You don't write these yourself. Tell Claude how you want memory kept, once, in CLAUDE.md. It follows the pattern from then on.

### What earns a lesson

Before Claude saves a lesson, it should pass one test:

> **Would a fresh session waste half an hour without this?**

If yes, save it. If no, leave it out.

Good lessons are traps: the migration that silently uses the old schema, the setting that only works in one browser, the deploy step that has to come before another. Poor lessons are general knowledge ("React uses JSX"), progress notes ("finished the login page") and decisions that belong in the architecture doc.

When a lesson turns into a rule that applies to everything, move it into CLAUDE.md and delete the memory. When the trap is fixed for good, archive the lesson.

### Keeping the index small

The index is the only memory file Claude always loads. That has two effects:

1. **An unlinked memory is invisible.** If you delete a line from the index, the lesson file is still on disk, but Claude will never find it. That's deletion in practice, just a quiet one. Before trimming the index, check whether each linked lesson is still true. Move the ones that are into another section first.
2. **The index needs a budget.** Give it a limit well under what gets loaded. When it's near the limit, move old lines into a dated archive file and link that file once from the index.

The same goes for every doc Claude reads by default. Set length rules early. See [Common Pitfalls](/part-5/pitfalls-recovery#pitfall-1-the-docs-get-too-long).

---

## The self-audit loop

This is the part that lets Claude improve its own instructions.

When the same area fails in two sessions, the problem is often not the code. It's a rule in CLAUDE.md that no longer matches the code. Or an architecture doc that's out of date. Or a lesson that's written down but never applied. Claude follows those faithfully into the same wall each time.

So I give Claude a trigger. If an area has failed twice, or the same error turns up in three sessions, it stops and suggests a self-audit before trying another fix:

1. Read CLAUDE.md. Does any rule point the wrong way?
2. Read the architecture doc. Does it still describe the code?
3. Search memory. Is there a lesson that should have been applied?
4. Look at the last attempts. Was a fix undone later?

Then it reports what it found, proposes the changes to the rules or docs, and waits for me to agree. Once the docs are right, the bug usually falls over quickly.

The findings become lessons too, so the next audit starts from them.

---

## Scaling memory for big projects

A handful of lesson files and a tidy index will carry most projects a long way. But on a big, long-running project, with hundreds of lessons, lots of open issues or very complex docs, you hit a new problem. Claude spends its time searching through pages of text files to find the three lines that matter. That burns your usage and still misses things.

At that point you want memory where Claude loads only what it needs. There are two good routes. Either one keeps context down and accuracy up.

### Route A: an MCP memory server with vector search

An MCP server is a small program that gives Claude extra tools. A memory server stores lessons, past fixes and session notes in a database, and gives Claude a tool to search them.

The part that makes it worth it is **vector similarity search**. Each note is stored with an embedding, a numeric fingerprint of its meaning. When Claude searches, it finds notes that *mean* the same thing, even with different words. You're debugging "webhook payload never reaches the handler". The search turns up an old note about "API route not receiving the POST body". Different words, same problem, and the fix comes straight back.

**Good for:** very large histories, teams sharing one memory, questions like "have we seen something like this before?".

**The cost:** something to run and keep running, usually a database in Docker. The notes live in a database, so you can't read or edit them as easily as plain files.

### Route B: a well-designed Markdown tree

The other route is plain files, arranged so Claude can walk straight to what it needs. It's a bit like a data lakehouse: raw material at the bottom, tidied and organised layers above it, and a catalogue on top that tells you where everything is.

An invented example:

```
memory/
├── INDEX.md                  ← the catalogue: one line per area, always loaded
├── areas/
│   ├── billing/
│   │   ├── INDEX.md          ← one line per lesson in billing
│   │   ├── invoice-rounding.md
│   │   └── webhook-retries.md
│   ├── auth/
│   │   ├── INDEX.md
│   │   └── session-cookie-samesite.md
│   └── deploy/
│       ├── INDEX.md
│       └── prune-images-after-pull.md
├── decisions/
│   ├── INDEX.md
│   └── 2026-03-cookies-not-jwt.md
└── archive/
    └── 2026-q1/              ← closed phases, never loaded by default
```

The rules that make it work:

- **Every folder has an index.** One line per file, saying what's in it and when to read it.
- **Claude starts at the top.** The top index is short. It says "billing lessons are in `areas/billing/`". Claude opens that folder's index, then the one or two files it needs.
- **One subject per file.** Small files mean Claude reads what it needs and nothing else.
- **Every file has a line in an index.** A file no index points to won't be found.
- **Old material moves down to `archive/`.** Archived material is still there if you go looking, but it's out of the default path.

**Good for:** anyone who wants to read, edit and review memory as ordinary files in Git. No server to run.

**The cost:** discipline. The indexes have to stay accurate, and someone has to archive. Write the rules into CLAUDE.md and Claude does most of that for you.

Given the choice, I'd start with Route B. Plain files are easy to fix when something's wrong, and Claude is very good at following a well-signposted folder tree.

::: tip Related
[The Project Brain](/part-5/project-brain) takes the same idea further: a queryable store of decisions and gotchas, plus a live visual map of the code.
:::

---

## What to add to CLAUDE.md

```markdown
## Memory
- Save one lesson per memory file, with frontmatter, a **Why:** line and a **How to apply:** line.
- Add a one-line pointer to MEMORY.md for every lesson. A lesson with no pointer is lost.
- Only save a lesson if a fresh session would waste half an hour without it.
- If a lesson becomes a rule for everything, suggest moving it into CLAUDE.md.
- Keep MEMORY.md under [your limit]. When it's close, move old lines to a dated archive file.
- Before removing an index line, check the lesson is really finished. Move live ones first.

## Self-audit
- If an area has failed in two sessions, stop and suggest a self-audit of CLAUDE.md,
  the architecture doc and memory before trying another fix.
```

---

**Next:** [The Project Brain](/part-5/project-brain)
