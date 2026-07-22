---
title: Claude Code — Setup & Customisation
description: Installing Claude Code, seeing what it's doing, and configuring it to follow your methodology
---

# Claude Code: Setup & Customisation

::: warning This page is for advanced users
The CLI is where Claude Code shows you its live reasoning — but it's a demanding environment (see [Tool Selection](/part-1/tool-selection#which-to-use)). If you're a beginner-to-intermediate builder, stay in the GUI (desktop app or VS Code extension) and skip to the customisation sections below, which apply to both.
:::

## TLDR

Install the standalone CLI and run it **inside VS Code's integrated terminal** — you keep your editor and get Claude Code's **live reasoning, which the GUI hides**. The thinking streams by default; you don't need a keystroke to switch it on.

Then customise in this order: **`CLAUDE.md`** (project rules) → **permissions** (stop the constant prompts) → **hooks** (enforce rules instead of suggesting them) → **skills** (your prompt library as slash commands) → **subagents** → **MCP servers**.

The single highest-value thing here: a **`Stop` hook** can block Claude Code from finishing a task until your documentation is updated. That turns "please remember to update the docs" from a hope into a rule.

---

## Install the CLI

The VS Code extension bundles its own private copy of Claude Code for the chat panel. To run `claude` in a terminal you need the standalone install:

```bash
npm install -g @anthropic-ai/claude-code
```

::: danger Get the package name exactly right
It's `@anthropic-ai/claude-code`. There is an unrelated `claude` package on npm that is **not** the official CLI — its own description says so. Check what you installed with `npm ls -g --depth=0`.
:::

Then, in VS Code, open the integrated terminal (`Ctrl+`` ` ``) and run:

```bash
claude
```

**Why the integrated terminal?** It's the CLI — full live reasoning, full terminal output — but you never leave VS Code. Your file tree and editor are right there, and you keep the IDE integration: Claude Code opens diffs in VS Code's native diff viewer and can read your **Problems** panel for errors.

That said, don't mistake "in VS Code" for "beginner-friendly." Working effectively in the CLI still means being fluent with the file tree, keyboard shortcuts and the terminal itself. It's the advanced surface.

::: warning The terminal and the panel are separate sessions
A CLI session and the extension panel don't share context or history. If you started something in the panel and want to continue it in the terminal, run `claude --resume` and pick the session from the list.
:::

---

## See it think

This is the whole reason to be in the CLI. Unlike the GUI, the CLI **streams the model's reasoning live as it works** — no toggle needed. That's the visibility you came for.

If you want more control over thinking:

| Control | Effect |
|---------|--------|
| `Option+T` (macOS) / `Alt+T` | Toggle extended thinking for this session |
| `/config` → thinking | Set the default without any keystroke (saves `alwaysThinkingEnabled`) |
| `Ctrl+O` | Opens a **read-only transcript** of the steps so far — *not* the live thinking |

::: warning `Ctrl+O` is not the "show me the reasoning" button
It's easy to assume `Ctrl+O` reveals the thinking. It doesn't — the live reasoning is already streaming, and `Ctrl+O` just opens a static, scrollable transcript of what's happened. Different tool for a different job.
:::

::: tip Shortcuts and non-US keyboards
On a French/AZERTY or other non-US layout, some `Ctrl`/`Option` combinations don't reach Claude Code cleanly. Two fixes: use the **`/config`** menu (no keystrokes at all — the safest route for any layout), or run **`/keybindings`** to remap the shortcut to something your keyboard sends reliably.
:::

---

## Attaching files and screenshots

In the GUI you drag a file in. The CLI is fiddlier, and it's worth knowing before you're stuck mid-task.

| To attach… | Do this |
|------------|---------|
| A project file | Type `@` and use the autocomplete to pick it |
| A screenshot / image | Copy it to the clipboard, then paste — `Cmd+V` in iTerm2, `Ctrl+V` in Apple Terminal. You'll see an `[Image #1]` chip |

Two limits to expect:

- **`@` is scoped to the project.** Referencing a file *outside* the repo is awkward — the autocomplete won't help you. Keep what you need inside the working tree.
- **Drag-and-drop into the terminal isn't a documented CLI feature.** If it doesn't work, that's expected — use `@` or clipboard paste instead.

This friction is a real part of why the CLI is the advanced surface. For a beginner pasting browser screenshots to debug the UI all day, the GUI is genuinely the better tool.

---

## CLAUDE.md

Same job as `.clinerules`: the file Claude reads at the start of every session. Build commands, coding standards, architecture rules, "don't estimate timelines."

Where it can live, least to most specific:

| Location | Scope |
|----------|-------|
| `~/.claude/CLAUDE.md` | All your projects |
| `./CLAUDE.md` | The project — commit this, it's your team's rules |
| `./CLAUDE.local.md` | Your personal overrides (git-ignored) |
| `packages/api/CLAUDE.md` | Loaded only when Claude works in that folder |

Two features worth using:

**Imports.** Pull other files in with `@path`, so you don't duplicate content:

```markdown
See @docs/ARCHITECTURE.md for the schema.
Follow the conventions in @docs/CONVENTIONS.md.
```

**Nested files.** In a monorepo, put a `CLAUDE.md` in each package. Frontend rules load when Claude edits the frontend, not before.

Run `/memory` to browse and edit everything Claude is currently remembering.

📄 [Official docs — CLAUDE.md](https://code.claude.com/docs/en/claude-md.md)

---

## Stop the permission prompts

If you're approving `npm test` for the fiftieth time, allowlist it in `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run test)",
      "Bash(npm run lint)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./secrets/**)"
    ]
  }
}
```

Deny rules always beat allow rules. Denying `.env` and secrets is worth doing on day one.

Settings live at `~/.claude/settings.json` (you, everywhere), `.claude/settings.json` (the project, committed), and `.claude/settings.local.json` (you, this project, git-ignored).

📄 [Official docs — Settings](https://code.claude.com/docs/en/settings.md)

---

## Enforce your own rules with hooks

This is the answer to Claude Code being loose about documentation.

`CLAUDE.md` *asks*. Hooks *enforce* — they're shell commands that fire on lifecycle events, and some of them can block.

| Event | Fires | Can block? |
|-------|-------|-----------|
| `PreToolUse` | Before a tool runs | Yes |
| `PostToolUse` | After a tool succeeds | No |
| `Stop` | When Claude finishes a turn | **Yes** |
| `SubagentStop` | When a subagent finishes | Yes |

A `Stop` hook that refuses to let a task finish undocumented:

```bash
#!/bin/bash
# .claude/hooks/require-docs.sh
if git diff --name-only | grep -q '^src/' && \
   git diff --name-only | grep -qv '\.md$'; then
  echo '{"decision":"block","reason":"Update the task doc before finishing."}'
fi
exit 0
```

Wire it up in `settings.json`:

```json
{
  "hooks": {
    "Stop": [
      { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/require-docs.sh" }
    ]
  }
}
```

Now the methodology's documentation requirement is a rule, not a reminder.

📄 [Official docs — Hooks](https://code.claude.com/docs/en/hooks.md)

---

## Skills: your prompt library as slash commands

Every prompt in [the prompt library](/part-6/prompts) can become a slash command.

Create `.claude/skills/phase-audit/SKILL.md`:

```markdown
---
name: phase-audit
description: Run a fresh-eyes audit of the completed phase. Use when a sprint finishes.
---

## Changes since last tag
!`git log --oneline $(git describe --tags --abbrev=0)..HEAD`

## Instructions
Audit the work above against ARCHITECTURE.md. Flag scope creep,
missing tests, and undocumented decisions. Score confidence /10.
```

Now `/phase-audit` runs it. The `` !`command` `` line injects live output *before* Claude reads the skill, so it starts with the real git log in hand.

Put skills in `.claude/skills/` to share with your team, or `~/.claude/skills/` for yourself.

📄 [Official docs — Skills](https://code.claude.com/docs/en/skills.md)

---

## Worth knowing later

**Subagents** — specialist agents with their own context window, defined in `.claude/agents/<name>.md`. Useful when research floods your main conversation. Setting `isolation: worktree` gives an agent its own copy of the repo, so parallel sessions can't collide.
📄 [Docs](https://code.claude.com/docs/en/sub-agents.md)

**MCP servers** — connect Claude to GitHub, Jira, Figma, databases, or a browser for real UI testing. `claude mcp add`, then `/mcp` to manage.
📄 [Docs](https://code.claude.com/docs/en/mcp.md)

**Statusline** — a script that shows live session cost, context usage, and git branch at the bottom of the screen. Given how much this guide cares about budget, seeing `total_cost_usd` tick up in real time is more useful than it sounds.
📄 [Docs](https://code.claude.com/docs/en/statusline.md)

---

## Quick Reference

| Want to… | Use |
|----------|-----|
| See the live reasoning | Just run the CLI — it streams by default |
| Toggle extended thinking | `Option+T` / `Alt+T`, or `/config` |
| Read a transcript of steps so far | `Ctrl+O` |
| Fix a dead shortcut (AZERTY etc.) | `/keybindings`, or use `/config` |
| Attach a project file | `@` autocomplete |
| Paste a screenshot | `Cmd+V` (iTerm2) / `Ctrl+V` (Apple Terminal) |
| Give Claude project rules | `CLAUDE.md` |
| Stop repeated approvals | `permissions.allow` |
| **Force docs to be written** | **`Stop` hook** |
| Reuse a prompt | Skill (`/name`) |
| Keep research out of context | Subagent |
| Connect external tools | MCP server |
| Watch your spend | Statusline |

---

**Next:** [Tool Selection](/part-1/tool-selection) — how Claude Code and Cline actually compare.
