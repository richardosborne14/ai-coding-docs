---
title: The Project Brain
description: Keep your picture of an AI-built app intact by having the agent produce a live, visual model of the code it writes
---

# The Project Brain

## TLDR

Building with an agent trades understanding for speed. The agent decides, the tests pass, and you end up owning an app you never walked through. If you came from visual or low-code tools, you used to get that understanding for free. You could see the node graph, the workflow, the parsed API response. Prose and code don't give a visual thinker that map back.

The **Project Brain** is my fix for that gap. It flips low-code round. In a low-code builder you build visually and code comes out. Here the agent writes code and a *visual model of it* comes out. The model is worked out from files the code already produces, so it can't drift.

The agent can query the same brain you read. So it pulls the two or three relevant gotchas instead of reading a giant learnings file. It comes as three separate pieces: an MCP server, a thin plugin for your agent, and a standalone viewer.

---

## The problem: speed without a map

The appeal of building with AI is speed. You describe what you want, the agent plans, writes and checks, and features land faster than you could type them. The hidden cost is understanding. Every task the agent finishes on its own is a part of the app you never looked at. The tests are green, the feature works, and you couldn't draw the data flow if someone asked.

For people who learnt on visual tools, this hurts more than it sounds. In those tools, understanding came with the medium:

- **n8n** showed you the workflow graph, node by node.
- **Node-based editors** made data flow literal. You followed the wire.
- **API explorers** turned a response into a tree you could click through.

You understood the system because you were looking at a true picture of it.

Prose and code don't recreate that. A good `ARCHITECTURE.md` *describes* the structure. Twelve route files are raw material you have to assemble in your head. Neither is the picture itself.

---

## More docs won't fix it

The obvious fix is to ask the agent for better docs: longer summaries, fuller architecture notes, tidier comments. That treats it as a documentation problem.

It doesn't work. More prose gives you more prose to read, which is what didn't work the first time. Your mental model of the app has gone stale, and text is a poor way to restore it.

The fix n8n got right is to **draw the real thing, and keep the drawing live.** Not a diagram someone made once and forgot. A view computed from the system as it is now, and recomputed whenever it changes.

---

## Low-code, backwards

> **The Project Brain is a low-code builder run in reverse.**

In a low-code builder you work in the visual layer and code falls out the bottom. The Project Brain swaps the ends. The agent works in code, and a visual model falls out the bottom.

| | Low-code builder | Project Brain |
|---|---|---|
| You provide | The visual graph | What you want (the agent writes the code) |
| The tool produces | Code | A visual model of the code |
| Direction | Visual to code | Code to visual |
| Who keeps the picture up to date | You | Nobody. It's computed. |

That's why it suits building with an agent. You were never going to build the app node by node. You still need the understanding the visual layer used to give you. So the agent writes code fast, and you get back the picture you lost.

---

## Three separate pieces

The method comes as three pieces, kept apart on purpose. Only the middle one knows which agent you use.

### 1. The spine: a per-project MCP server and a `.brain/` folder

Each project gets its own brain: a small MCP server plus a `.brain/` folder holding the project's data. It gives the agent tools to write down decisions and to look things up. It's per project because decisions, history and gotchas belong to one project.

### 2. The adapter: small, one per agent

This is the only piece that knows about your coding agent. For Claude Code it's a hook that fires around the end of a task and makes sure the agent writes to the brain. For another agent, you'd write another small adapter and nothing else would change.

### 3. The viewer: one app for every project

A standalone app that opens any project's `.brain/` and draws its views from the repo. It doesn't touch your agent at all. You run one viewer and point it at whichever project you want to understand.

::: tip Why keep them apart
The viewer knows nothing about agents. The spine is per project but works with any agent. Only the adapter changes. Supporting a new agent means writing one small adapter, and you never have to fork your agent to get any of this.
:::

---

## Computed versus written

This is the rule that keeps the whole thing honest. Split every fact into one of two kinds, and keep it where it actually comes from.

### Computed from files the code already produces

The structural views are never written by hand:

| View | Computed from |
|------|---------------|
| API surface | The OpenAPI or schema file the app already produces |
| Database schema | The migrations already in the repo |
| Workflow or engine graphs | Graph exports the engine already produces |

Two things follow:

1. **They can't drift.** There's no second copy of the truth. Recompute the view and it matches the code.
2. **They cost the agent nothing.** It isn't asked to describe the API or redraw the schema, so it can't invent a column that isn't there.

### Written: the story only

The only things written down (by the agent, at your direction) are the things no file can compute:

- **Decisions.** Why session cookies and not tokens. Why polling and not WebSockets.
- **Timeline.** What happened, in what order, and why.
- **Tests.** What's covered and what deliberately isn't.
- **Gotchas.** The traps that would cost a fresh session real time.

> **Keep each fact where it's actually known.** The schema knows the schema, so don't ask the agent to restate it. Only your conversations with the agent know *why*, so that's the only part anyone writes.

If you tried to write the structural views by hand too, they'd drift within a week, and you'd be back to a stale map.

---

## The agent reads it too

The brain you read is the same brain the agent can query. When the agent starts a task, it doesn't read a giant learnings file and spend its attention on the 95% that doesn't apply. It calls a tool and gets back only what's relevant.

```
Agent about to change the login flow
  → query_context({ area: "auth" })
  → returns: 2 decisions and 1 gotcha about auth
  → agent carries on with the right context and nothing more
```

Writing costs a little per task: a decision, a gotcha if one turned up. Reading gets more valuable as the project ages. An old project is where a fresh session would waste most time rediscovering things, and that's where a targeted lookup saves most.

This is the visual, queryable cousin of [Project Memory](/part-5/project-memory). Same instinct, aimed at understanding rather than recall.

---

## Start with a rule, not a gate

The brain only helps if the agent actually writes to it. There are two ways to make sure of that.

### A rule (start here)

A line in CLAUDE.md telling the agent to write to the brain at the end of each task. It usually does.

- Nothing gets in your way.
- Takes a minute to add.
- Now and then a task lands without its notes.

### A hook (the strict option)

A hook in the adapter that won't let a task finish until the brain write has landed.

- The brain is never behind.
- More friction, and a broken hook can block you.

**Start with the rule.** Run it for a while and see how often the agent skips the write. For most solo and small-team projects, the rule is enough. Add the hook only if you can see notes going missing.

---

## Adopting it

You don't rebuild your tools, and you don't fork your agent. Three installs, one per piece:

1. **An MCP server** (the spine). Add it to your project.
2. **An agent plugin** (the adapter). For Claude Code, a hook.
3. **A standalone viewer.** One app you run and point at any project.

> **Add this MCP, install this plugin, run this viewer.**

That's the whole setup.

::: tip Reference implementation
A reference implementation of the Project Brain (the MCP server, the agent plugin and the viewer) is on its way. **[Reference implementation: coming soon](#)** *(this link will point to the published packages once they're out).*
:::

---

## Why I care about this one

Most of this guide is about working with the agent well: plan first, score confidence, write sharp task files. That all works, and plenty of people write about it.

Keeping *your* understanding of the app intact while the agent does the building is the part hardly anyone has solved. It's the difference between shipping an app you can reason about and shipping one you merely own.

Every task makes the codebase bigger. Without a brain, your understanding shrinks relative to it. With one, every task also updates a live picture and adds a few lines of notes you can query. The app grows and your understanding keeps up.

---

**Next:** [Team Workflows](/part-5/team-workflows)
