---
title: Tool Selection
description: Choosing the right AI tools for each phase of development
---

# Tool Selection

## TLDR

**Start every project in Claude** (preferably Opus) **inside a Project.** The brainstorming and document generation quality is unmatched. This is non-negotiable.

**Use Cline in VS Code** for execution. It's a surgical coding tool — you watch the reasoning, you control the flow, you learn as it works. This guide is written for the Cline workflow throughout.

**Claude Code is a genuine peer, not a lesser option.** With a good `CLAUDE.md`, it produces quality comparable to Cline with a good `.clinerules` — the same methodology applies. It's dramatically cheaper and can run parallel sessions, but it's slower and hides terminal/browser output unless you run the CLI. **For beginners and tight budgets it's the no-brainer starting point.** See the honest comparison below.

**Use Claude Projects** for ongoing context. Sync your GitHub repo so Claude always knows where the project stands.

---

## Claude Projects: Where It All Begins

Every project starts here. A Claude Project gives you:

- **Persistent file context** — upload docs, sync a repo, Claude reads them every conversation
- **Opus-quality brainstorming** — the initial conversation quality is dramatically better with Opus. The resulting foundation docs will be 10X better than any other tool or model.
- **Multi-turn discussion** — brainstorming should be several turns of back-and-forth, not one prompt and one response

**How to use it:**

1. Create a Project in Claude
2. Optionally add initial files (design mockups, API docs, reference projects)
3. Start a conversation about what you want to build
4. Have a real discussion — multiple turns, questions, push-back, refinement
5. Ask Claude to generate your foundation documents
6. Review, refine, export to your repo

**When to come back:**
- Adding new features (sync the latest GitHub repo first)
- Major scope changes
- Strategic decisions about architecture or direction

---

## Cline: The Recommended Execution Tool

Cline is a VS Code extension and the primary tool this guide is built around. Here's why.

### Why Cline

**Cline is a surgical coding tool.** It works directly on your codebase and you're in control the whole time, watching what it's doing. It has two explicit modes:

**Plan Mode:** AI reads your project, proposes an approach, asks clarifying questions.

**Act Mode:** AI executes the plan, creating/editing files and running commands.

This matches the methodology perfectly:
1. "Can we plan task 3?" → Plan Mode
2. Review the plan, adjust if needed
3. "Proceed" → Act Mode
4. Approve terminal commands as they come
5. Verify the result

**The real power is watching it work.** As you get more experienced, you'll start reading Cline's reasoning in real-time and picking up on potential mistakes — seeing it turn in circles, noticing when it's missing information, catching when it's about to go down the wrong path. You can click **Cancel** at any point without repercussions and insert your advice, clues, or corrections to help it complete the task.

Cline is cleverly navigating the fuzzy world of AI coding:
- It knows how to split things up when tasks are too large
- It knows when its context is maxed out and a new conversation would be more efficient
- It manages token usage and context intelligently
- It gives you terminal command approval so you see every action before it happens

**Why terminal approval matters:**
```
Cline wants to run: rm -rf node_modules && npm install
[Approve] [Reject] [Edit]
```

You see every command before it runs. This prevents disasters.

### Setup

1. Install "Cline" from VS Code extensions
2. Top up credits directly in Cline (the default provider) — or configure with your own Anthropic API key for more control (see [Setting Up Cline & Credits](/part-0/cline-and-credits))
3. Select the latest **Sonnet** model
4. Keep `autoApproveCommands: false` (at least initially)

### Recommended Settings for Beginners

**Disable sub-agents.** In Cline settings, turn off "sub agents." In practice this feature leads to more time wasting and errors than having Cline complete the task in the main chat, even at the expense of the context limit. Advanced users with high-end hardware can experiment with this later, but for most users and most projects, keep it off.

**Disable checkpoints.** Turn off "checkpoints" in Cline settings. This causes Cline to slow down significantly, and only an advanced user would know how to make best use of it. Keep it off until you're comfortable with the basic workflow.

**Enable Background Edit.** In Cline settings, turn on "Background edit." Cline will then edit code files silently in the background rather than visibly rewriting open tabs. This keeps the editor calm, prevents accidental typing mid-edit, and stops edited files from consuming tokens as open tabs. Recommended for all users, especially beginners.

**Set Terminal Execution Mode to Background Exec.** In Cline settings, go to the **Terminal** tab and set "Terminal Execution Mode" to **Background Exec.** This eliminates terminal length limitations, prevents a proliferation of terminal tabs, and gives Cline cleaner access to command output for analysis. Particularly valuable for users who don't want to manually follow terminal output or run their own commands.

**Manage your chat history.** After a dozen or so task conversations, check the conversation history (the history button at the top of the Cline panel). There's a red "Delete all history" button at the bottom that shows the total size of stored conversations — this can reach 100MB+ quickly during a project. If your `.clinerules` are set right and Cline has been documenting its work properly, deleting history is safe to do regularly to free up disk space and memory. If a conversation is only half-finished, go into the history and star it first — clicking "Delete all history" will then show a modal offering "Delete all except favourites" so you can clean out completed conversations without losing work in progress.

---

## Claude Code vs Cline: An Honest Comparison

The old advice was "Cline for real work, Claude Code if you want to sit back and vibe." That's wrong, and it's worth correcting.

**With the right `CLAUDE.md`, Claude Code produces quality comparable to Cline with a good `.clinerules`.** Same methodology — plan first, one task per conversation, task docs, confidence scoring. Claude Code reads `CLAUDE.md` automatically, exactly as Cline reads `.clinerules`. This isn't a lesser tool; it's a different set of trade-offs.

::: info Field experience, not a benchmark
The cost and speed figures below come from daily full-time use of both tools since January 2026 — not from controlled testing. They're consistent and they held across projects, but they're one practitioner's numbers on one set of projects. Treat them as a strong signal, not a published statistic. Proper empirical comparison is still needed.
:::

### Where Claude Code wins

**Price.** This is the headline, and it's not a small margin — it's roughly **10x**.

Real numbers from a working setup: a Claude Pro subscription at **€90/month** (~€22.50/week) shipping about the same number of features per week that was previously averaging **~$1000/month** (~$250/week) in Cline. Same developer, same projects — several of them started in Cline and switched mid-build, so the comparison is on identical codebases.

If cost is the thing stopping you from building, nothing else in this comparison matters as much.

**Parallel sessions.** You can run several Claude Code sessions at once on distinct tasks that don't step on each other. On a project with independent workstreams, that's a big time saver Cline can't easily match.

**Confidence and explanation.** When a decision comes up, Claude Code's recommendations are sharp, and it's genuinely good at explaining the choice so you understand the trade-off rather than just rubber-stamping it.

### Where Cline wins

**Speed.** Claude Code is slow. Watching both tools work all day, Cline is comfortably **5x faster minimum** on the same tasks — often more.

This is a like-for-like comparison, not a model mismatch: Sonnet for coding and Opus for planning on *both* sides, the same medium-to-high reasoning effort on both, no fast mode and no 1M context on either. Same models, same settings, same tasks — Claude Code just takes far longer to think and build. We don't have a verified explanation for why, so we won't invent one.

When time is of the essence, this is the deciding factor.

**You can see it think.** This is the sharpest difference, and it's easy to underrate until you've worked both ways.

Cline streams the reasoning, the terminal commands, and their output directly into the panel. You read *why* it's doing something as it happens — which is how you catch it turning in circles, missing information, or heading down the wrong path, and hit Cancel before it wastes your money.

Claude Code's GUI doesn't give you that. It exposes its plan and some of the ephemeral files it writes during a session, but the actual reasoning is hidden behind a `Clauding… Jiggling… Gibberting…` spinner. You can't watch it think.

The **CLI does stream the live reasoning by default** — that's the one place you get Cline-style visibility. But the CLI is an advanced environment (see below), so this is a real trade: the friendly surface hides the thinking, and the surface that shows the thinking is the demanding one.

**Open source.** Cline's real edge here is that it's open source — you can read it, fork it, and build your own extensions on top. Claude Code isn't, and you can't.

But "Cline is more customisable" is too broad a claim. Claude Code is deeply configurable through `CLAUDE.md`, hooks, skills, subagents, MCP servers and `settings.json` — in some respects it's *more* programmable, just not forkable. See [Claude Code: Setup & Customisation](/part-0/claude-code-setup).

**Documentation discipline.** With identical system instructions, Claude Code tends to be less strict about documentation than Cline — it sometimes needs a reminder to finish the docs when executing or wrapping up a task.

The good news: you can stop relying on reminders. A **`Stop` hook** can block Claude Code from finishing a task until the docs are updated — enforcement rather than guidance. [Details here](/part-0/claude-code-setup#enforce-your-own-rules-with-hooks).

### Want to see it think? Run the CLI — but know what you're signing up for

The reasoning that's hidden in the GUI streams live in the **CLI**, by default. Run it inside VS Code's integrated terminal and you keep your editor and file tree:

```bash
npm install -g @anthropic-ai/claude-code   # the extension bundles its own private copy
claude
```

::: warning The CLI is an advanced environment, not a friendlier GUI
Don't sell this to a beginner as "the GUI but with more output." Living in the CLI means being fluent with VS Code, file-tree navigation, keyboard shortcuts and the terminal. Attaching a file is real work — you `@`-mention it, and that autocomplete is **scoped to the project** (referencing something outside the repo is awkward at best). Some shortcuts don't behave on non-US keyboard layouts. It's a place for people who want to see the heart of the beast and are happy to trade convenience for it — not the on-ramp.

`Ctrl+O`, by the way, opens a **read-only transcript** of steps so far — it does *not* toggle the live thinking (that's already streaming). Full setup, file-attach and keyboard notes in [Claude Code: Setup & Customisation](/part-0/claude-code-setup).
:::

### Which to use

The cleanest way to think about it:

- **Claude Code GUI (desktop / VS Code extension)** — for **beginner-to-intermediate** builders. Cheap, calm, simple. The right on-ramp. Its cost is that you can't watch it reason.
- **Claude Code CLI** — for **advanced** users who want to see it think and are fluent enough to live in the terminal.
- **Cline** — when speed and full inline visibility matter more than cost, and you have the budget for it.

**Beginner?** Start with the Claude Code GUI. The price and simplicity let you build without being scared off by terminal output and streaming code changes.

**Time-critical, and fluent enough to monitor the tool as it codes?** Run the **Claude Code CLI**, or switch to **Cline** and prepare a healthy budget.

::: tip Same methodology, both tools
Everything in this guide — plan mode first, one task per conversation, task docs, confidence scoring, phase audits — works in Claude Code too. Wherever the guide says `.clinerules`, Claude Code reads `CLAUDE.md` instead. The templates in [Part VI](/part-6/templates) ship both.
:::

---

## The Tool for Each Phase

| Phase | Tool | Why |
|-------|------|-----|
| **Initial brainstorm** | Claude Chat (Opus, in a Project) | Best reasoning, persistent context |
| **Foundation docs** | Claude Chat (same conversation) | Keeps brainstorm context |
| **Task execution** | Cline in VS Code | Plan → Act → Verify cycle with full visibility |
| **Fixes & debugging** | Cline in VS Code | Plan mode first, watch the reasoning |
| **New features** | Claude Chat (Project with repo synced) | Strategic discussion first |
| **Phase audits** | Claude Chat (fresh conversation) | Fresh eyes, no dev context |
| **Quick tweaks** | Cline in VS Code | Fast, low overhead, full control |

Wherever this table says "Cline in VS Code," **Claude Code works just as well** — same Plan → Act → Verify cycle, reading `CLAUDE.md` instead of `.clinerules`. Pick based on the trade-offs above: Claude Code for cost and parallelism, Cline for speed and visibility.

---

## Extended Thinking: Non-Negotiable

Extended thinking is when AI reasons through a problem before responding. Without it:

**Simple prompt → shallow answer:**
> "Design a matching algorithm"
>
> AI: "Here's cosine similarity..." [generic solution]

**With extended thinking:**
> AI reasons: "1000 users, needs to be fast, budget constraints, vector DB might be overkill for MVP..."
>
> AI: "For your MVP scale, simple tag overlap will be faster and cheaper. Here's why, and here's when you'd upgrade..."

Extended thinking catches problems before they become expensive.

---

## Cost Expectations

| Task Type | Approx. Cost |
|-----------|-------------|
| Simple task (small fix, minor feature) | $1–$2 |
| Medium task (new feature, moderate complexity) | $2–$5 |
| Complex task (major feature, lots of files) | $5–$10 |
| Brainstorming session | Free — use Claude Chat with your Pro subscription |

::: tip Brainstorming is covered by your subscription
All brainstorming and document generation happens in Claude Chat (claude.ai), which is covered by your Claude Pro subscription ($20/month). You only pay per-token costs for the **execution** work in Cline. This keeps the expensive part (Opus-quality brainstorming) essentially free, and the high-volume part (task execution with Sonnet) affordable.
:::

These figures are for Cline. **Running the same work through Claude Code typically costs 5–10x less** for the same Anthropic models — the trade-off is that it's correspondingly slower. If budget is the constraint, that changes the maths a lot.

The methodology adds some overhead (documentation, scoring, audits). It saves many times that in avoided rework.

---

## A Note on Time Estimates

::: warning Don't trust AI time predictions
AI is hilariously bad at estimating how long tasks will take. A task that takes 30 minutes of focused Cline work will routinely be estimated at "2-3 days" by the AI — which is what a traditional developer might take, but bears no resemblance to the AI-assisted workflow.

**We don't include time estimates in this guide for that reason.** When you see AI-generated project plans or task docs predicting timelines, take them with a huge grain of salt. The methodology works on a "task by task" basis — how long each one takes varies wildly based on complexity, your experience, and how good your documentation is.

**Add this to your `.clinerules` and `CLAUDE.md`:** "Do not estimate how long tasks will take. AI time predictions are wildly inaccurate." This prevents misleading estimates from cluttering your project documentation.
:::

---

## Proof It Works

This methodology built [RISE](https://github.com/The-Low-Code-Foundation/rise) — a desktop Electron app — for ~$400 in token costs. And the [VH Conference Toolkit](https://github.com/Visual-Hive/vh-conference-toolkit) — a suite of open-source event tools — using the same process with thorough sprint-based documentation.

---

**Next:** [The Brainstorming Session](/part-2/brainstorming) — The conversation that prevents expensive mistakes.
