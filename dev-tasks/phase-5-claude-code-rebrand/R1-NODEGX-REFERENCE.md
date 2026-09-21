# Reference: how the NodeGX repos document themselves (for R2/R4/R5)

Richard pointed at these as "some of the most ridiculously extensive docs I have". Surveyed 2026-09-21 by a read-only pass; paths are evidence, quotes are short. Use as source material for `documentation-architecture`, `project-memory`, `testing`, and the `project-templates/CLAUDE.md` rewrite.

**Where:** `~/vscode_projects/OpenNoodl`. Rocket School is a generated template at `OpenNoodl/templates/rocket-school/` (built by `npm run template:rocket`), not a separate repo.

## What's worth teaching

| Practice | Evidence | Chapter it feeds |
|----------|----------|------------------|
| **Who the user is, and how to talk to them** is written down: "experienced CTO… direct and technical… casual and humorous", plus a "When to Ask Richard" list | `OpenNoodl/.clinerules` (top) | documentation-architecture → the "user-techiness profile" |
| **Ask for rulings in plain words**: no option letters or task IDs; say what each choice does to a person, recommendation first | memory `ask-richard-a-ruling-in-plain-words.md` | execution-workflow |
| **Proof before done**: "Code written ≠ Feature working", "NEVER declare done without proof — tests pass or user confirms" | `.clinerules` | philosophy, execution-workflow |
| **Break loops**: same error 3+ times → write a research task doc | `.clinerules` | pitfalls |
| **One lesson per file** with frontmatter + **Why:** + **How to apply:** + dated follow-ups; `MEMORY.md` as the index | `~/.claude/projects/-…-OpenNoodl/memory/` (~1066 files) | project-memory (the modern replacement for LEARNINGS.md + MCP server) |
| **Doc-length budget**: MEMORY.md has a hard character budget; old index lines move to a dated archive file; "an unlinked memory is invisible, not archived" | memory `MEMORY.md`, `an-unlinked-memory-is-invisible-not-archived.md` | documentation-architecture → the "docs get too long" rules |
| **Handoffs overwritten, not stacked**: 18 `HANDOVER-SESSION-N.md` files were named "the pattern to avoid"; one `NEXT-SESSION-PROMPT.md` per phase | `dev-docs/tasks/phase-*/` | context-management |
| **Model per task in the header**: "Recommended executor: 🟢 Sonnet … / 🟠 Opus …" | e.g. `dev-docs/tasks/phase-23-visual-refresh/UIX-003-CONTROL-KIT.md` | task-patterns, TASK_TEMPLATE |
| **Phase folder shape**: README (who it's for, order, inherited rules, close condition) + task files + `shots/` + one next-session prompt | `dev-docs/tasks/phase-NN-*/` | task-patterns |
| **Headless playtests**: a driver script per feature using real browser mouse/keyboard (CDP), exit 0/1, screenshots, 5 viewports incl. a French/AZERTY one; "Reproduce before fixing", "Look at the screenshot"; a green gate alone closes nothing, the human replays it | `dev-docs/tasks/phase-87-the-first-play-test/README.md` §5–6, `scripts/devtools/drive-tpl007-rocket.js` | new `testing` chapter |
| **A skill to launch and inspect the app headlessly** | `OpenNoodl/.claude/skills/run-editor/SKILL.md` | skills |
| **Session handoff commands** | `~/.claude/commands/next.md`, `next-go.md` | context-management, skills |

## Caveats

- OpenNoodl's main rules file is still `.clinerules` (1,246 lines) with **no root CLAUDE.md**. The living knowledge is in auto-memory. The guide should teach what works (memory + short rules), not copy a 1,246-line rules file.
- The LEARNINGS files there (`dev-docs/reference/LEARNINGS.md`, 2,231 lines) are the "docs too long" problem in action. Use them as the cautionary example, not the model.
- No hooks, no project slash commands. This backs up Richard's "the rest is garnish".
