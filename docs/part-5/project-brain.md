---
title: The Project Brain
description: Keep your mental model of an AI-built app intact by making the agent render a live, visual model of the code it writes
---

# The Project Brain

## TLDR

Vibe coding trades comprehension for speed. The agent decides, the tests pass, and you inherit an app you never navigated. If you came from visual or low-code tools, comprehension used to come *for free* — you saw the real structure: node graphs, workflow explorers, parsed API responses. Prose and code don't rebuild that map for a visual thinker.

This chapter documents the **Project Brain** method: a fix for the comprehension gap, not another documentation chore. The insight is an inversion of low-code. In a low-code builder, you build visually and code falls out. Here, the agent writes code and a *visual model of it falls out* — derived automatically from the artefacts the code already produces, so it can never drift.

The same brain the human reads is queryable by the agent, so it pulls the few relevant gotchas instead of ingesting a giant learnings file. It ships as three decoupled pieces — an MCP server, a thin per-agent plugin, and a standalone viewer — so adopting it means "add this MCP, install this plugin, run this viewer," not "fork your coding agent."

---

## The Problem: Speed Without a Map

The whole appeal of AI-assisted development is velocity. You describe intent, the agent plans, writes, and verifies, and features land faster than you could type them by hand. The hidden cost is comprehension. Every task the agent completes on its own is a piece of the app *you never navigated*. The tests are green, the feature works — and you couldn't draw the data flow if someone asked.

For developers who came up through visual and low-code tools, this loss is sharper than it sounds. Comprehension in those environments wasn't something you worked for — it was the medium itself:

- **n8n** showed you the actual workflow graph. You didn't read about the automation; you *saw* it, node by node, edge by edge.
- **Node-based editors** made data flow literal — you followed the wire.
- **API explorers** parsed the response and rendered it as a browsable tree, not a wall of JSON.

The structure was the interface. You understood the system because you were looking at a true picture of it.

Prose and code don't recreate that. A well-written `ARCHITECTURE.md` is a *description* of the structure; reading twelve route files is *raw material* for a structure you have to assemble in your head. Neither is the thing itself. For a visual thinker, "the agent will explain it in the summary" is not a substitute for seeing the graph. The map is missing, and no amount of better prose from the agent conjures it back.

---

## The Reframe: A Comprehension Problem, Not a Documentation Problem

The instinctive fix is to ask the agent to document better — longer summaries, more thorough `ARCHITECTURE.md` updates, tidier comments. That treats it as a documentation problem. It isn't.

More prose doesn't rebuild a visual map. It just gives you *more prose to read*, which is the very thing that didn't work the first time. The problem is that your mental model of the app has gone stale, and text is a poor medium for restoring it.

The fix is the same one n8n stumbled into: **render the source of truth visually, and keep it live.** Not a diagram someone drew once and forgot to update — a view *derived from the system as it currently is*, regenerated whenever the system changes. n8n didn't ask you to maintain a picture of your workflow; the picture *was* the workflow. That's the bar. The goal isn't better documentation — it's a living model that always matches the code, because it's computed from the code.

---

## The Inversion: Low-Code, Backwards

State it plainly, because this is the whole idea:

> **The Project Brain is a low-code builder run in reverse.**

In a low-code or visual builder, you work in the visual layer and code falls out the bottom. You drag nodes, wire connections, configure blocks — and the tool generates the executable artefact. Visual is the input; code is the by-product.

The Project Brain flips both ends. The agent works in code — writing routes, migrations, handlers, tests — and a **visual model falls out the bottom.** Code is the input; the visual is the by-product.

| | Low-code builder | Project Brain |
|---|---|---|
| You provide | The visual graph | Intent (the agent writes the code) |
| The tool produces | Executable code | A visual model of the code |
| Direction | Visual → code | Code → visual |
| Who maintains the picture | You (it's your input) | Nobody — it's derived |

This is why it fits AI-assisted development so precisely. You were never going to hand-build the app node by node — that's the point of using an agent. But you still need the comprehension that the visual layer used to give you. So you let the agent do what it's good at (writing code fast) and you get back the thing you actually lost (a true picture of what it built).

---

## The Three-Layer Architecture

The method is delivered as three deliberately decoupled layers. The decoupling is the design, not an implementation detail: only the thin middle layer knows anything about which agent you use.

### 1. The Spine — a per-project MCP server + `.brain/` data

Each project gets its own brain: a small MCP server plus a `.brain/` directory that holds the project's data. This is the source of truth the method revolves around. It exposes tools the agent calls (to write narrative and to query context) and it owns the project's authored knowledge. It is per-project because a project's decisions, timeline, and gotchas are specific to that project.

### 2. The Enforcement Adapter — thin, per-agent

This is the *only* layer that is aware of your coding agent. It's a small shim that makes your agent actually talk to the spine:

- For **Cline**, a plugin / hook that fires around task completion.
- For **Claude Code**, a hook wired into its lifecycle.
- For any future agent, a new thin adapter — and nothing else changes.

Keep this layer as small as possible. Its only job is to connect a specific agent's lifecycle to the spine's tools. All the actual intelligence lives in the spine and the viewer.

### 3. The Viewer — one app, opens any project

A single standalone application that opens *any* project's `.brain/` and renders its structural views from the repo. It is agent-agnostic — it touches no coding agent at all. You run one viewer and point it at whichever project you want to understand.

::: tip The decoupling is the point
Only the **adapter** changes per agent. The **viewer** touches no agent whatsoever, and the **spine** is per-project but agent-neutral. That means supporting a new coding agent is a small, isolated piece of work — you write one thin adapter and everything else is untouched. You are never forking your agent to get this.
:::

---

## Authored vs Derived — The Key Principle

This is the principle that makes the whole thing sustainable, so it deserves its own section.

**Not everything in the brain is written by hand.** Split every fact into one of two categories and put it in the layer that actually knows it:

### Derived — computed from artefacts the code already produces

Structural views are *derived*, never authored:

| View | Derived from |
|------|--------------|
| API surface | The OpenAPI / schema the app already emits |
| Database schema | Migrations already in the repo |
| Engine / workflow graphs | Graph exports the engine already produces |

Because these are computed from artefacts the code *already* produces, two things follow:

1. **They can't drift.** There's no separate copy of the truth to fall out of date. Regenerate the view and it matches the code, by construction.
2. **They cost the agent nothing.** The agent isn't asked to describe the API surface or redraw the schema — those fall out of the OpenAPI doc and the migrations automatically. No tokens spent, no chance of a hallucinated column.

### Authored — the narrative only

The only things written by hand (by the agent, at your direction) are the things no artefact can compute:

- **Decisions** — why session cookies over JWT, why polling over WebSockets.
- **Timeline** — what happened, in what order, and why.
- **Tests** — what's covered, what's deliberately not.
- **Gotchas** — the traps that would cost a fresh session real time.

> **Put each fact in the layer that actually knows it.** The schema knows the schema — don't ask the agent to restate it. Only the human-and-agent conversation knows *why* — so that's the only part anyone authors.

This is what keeps the write cost small and the model trustworthy. If you tried to author the structural views too, they'd drift within a week and you'd be back to a stale map — the exact problem you started with.

---

## The Context Flywheel

Here's the compounding benefit, and the reason the small authoring cost is worth paying.

The brain the human reads is the *same* brain the agent can query. When the agent starts a task, it doesn't ingest a giant `LEARNINGS.md` and burn context on the 95% that's irrelevant. It calls a tool — `query_context` — and pulls back only the few gotchas and decisions relevant to what it's about to touch.

```
Agent about to modify the auth flow
  → query_context({ area: "auth" })
  → returns: 2 decisions + 1 gotcha relevant to auth
  → agent proceeds with the right context, nothing more
```

The economics are the point:

- **Write cost is small and constant.** Each task appends a little narrative — a decision, a gotcha if one was found. It doesn't grow per-read.
- **Read savings compound.** As the project ages, the brain gets richer, but the agent still pulls only the relevant slice. An older project is where a fresh session would waste the most time rediscovering things — and that's exactly where `query_context` saves the most.

So the mechanism pays for itself and then keeps paying. The same artefact that restores *your* mental model also sharpens the *agent's* context, and the older the project gets, the more that matters. (This is the visual, queryable companion to the tiered-memory approach in [Project Memory & Self-Improvement](/part-5/project-memory) — same instinct, applied to comprehension rather than recall.)

---

## Enforcement Posture: Soft First

The brain only helps if it actually gets written. There are two ways to make that happen, and they trade off differently.

### Soft enforcement (recommended default)

A **rule** in `.clinerules` / `CLAUDE.md` instructing the agent to write to the brain at the end of a task. The model usually complies — modern agents follow well-placed rules most of the time.

- ✅ Zero friction, nothing to block your workflow.
- ✅ Trivial to adopt — it's just a rule.
- ⚠️ Occasionally the agent forgets, and a task lands without its narrative.

### Hard enforcement (the stricter option)

A **hook** in the enforcement adapter that *blocks task completion* until the brain write has actually landed. The task literally cannot be marked done until the narrative is recorded.

- ✅ The brain is never out of date — the write is guaranteed.
- ⚠️ Adds friction, and a broken hook can get in your way.

**Start soft.** Add the rule, run it for a while, and see how often the agent actually skips the write. For most solo and small-team projects, soft enforcement is enough and stays out of your way. Reach for the hard gate only if you find the narrative is drifting because writes are being skipped — it's the fix for a problem you've *measured*, not the default posture.

---

## Adopt It

The distribution story is deliberately un-invasive. You are not rebuilding your toolchain and you are certainly not forking your coding agent. Three installable pieces, matching the three layers:

1. **An MCP server** — the spine. Add it to your project.
2. **A publishable agent plugin** — the thin enforcement adapter for your agent (Cline plugin / hook, Claude Code hook).
3. **A standalone viewer** — one app you run and point at any project.

The adoption sentence is meant to be this short:

> **Add this MCP, install this plugin, run this viewer.**

That's the entire onboarding. Nothing about your agent's internals changes; the adapter is the only agent-aware piece and it's a small, published plugin. The viewer is a separate app you already have running once and reuse across every project.

::: tip Reference implementation
A reference implementation of the Project Brain — the MCP server, the agent plugin, and the viewer — is being published. **[Reference implementation → coming soon](#)** *(this link will point to the published packages once they land).*
:::

---

## Why This Chapter Matters

Most of this guide is about prompting the agent better — planning first, scoring confidence, writing sharp task docs. Those techniques are real and they work, but they're also the part nearly everyone writes about.

The Project Brain is the differentiated piece. **Keeping the human's mental model intact — while the agent does the building — is the part almost nobody has solved.** It's the difference between shipping an app you can reason about and shipping one you merely own. Treat it as the centrepiece it is, not a footnote to the prompting chapters.

---

::: tip The Comprehension Flywheel
Every task the agent completes makes the codebase bigger — and, without a brain, your mental model *smaller* relative to it. With a brain, every task also updates a living, derived picture and appends a little queryable narrative. The app grows and your comprehension grows with it, instead of falling behind. That's the whole game: velocity without losing the map.
:::

**Next:** [Common Pitfalls](/part-5/pitfalls-recovery) — What goes wrong and how to recover.
