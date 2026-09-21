# R1: Content Audit (signed off)

**Date:** 2026-09-21 · **Base:** `7c16e88` · **Inputs:** [R0-INTERVIEW.md](R0-INTERVIEW.md)

**Status: SIGNED OFF by Richard 2026-09-21, with one change (below).** R2 onward can proceed on this basis.

**Richard's change (project-memory):** Don't drop scalable memory. For long-running projects with lots of open issues or very complex docs, you don't want the model grepping through pages of text files and burning usage. Keep a section that offers two routes: **(a)** an MCP memory server with vector-similarity search, or **(b)** a well-designed Markdown file tree (Richard: "almost smacks of data lakes or lakehouses") that lets Claude load only what it needs. Either keeps context down and accuracy up. **NDA:** Richard's example of (b) is a sibling repo that must **never be named or quoted**, and none of its content may be used. Describe the pattern generically, with invented examples. Everything else in project-memory can go as proposed.

## Numbers (checked 2026-09-21, not copied from the handoff)

- 39 source pages under `docs/` (the build output in `docs/.vitepress/dist` is excluded). **33 mention Cline**, which matches the handoff's claim.
- The heaviest Cline page is **`part-5/project-memory.md` (60 mentions)**, and the handoff's hot-spot list missed it. Next: `cline-and-credits` 44, `tool-selection` 39, `token-economics` 26, `setup-guide` 23, `deployment-platforms` 19.
- **855 em dashes** across the source pages. Richard says long dashes are the giveaway of Claude-written copy, so the R4 voice pass has to strip most of them. The same applies to our own writing from here on.
- `project-templates/` ships **both** `.clinerules` (405 lines) and `CLAUDE.md` (356 lines), plus `.clineignore`. Under D2 (Cline goes to an appendix), CLAUDE.md becomes the only rules file.

## Tracks

Per D3, the reader picks **Non-tech** (Claude Desktop / Chat / Cowork end to end) or **Builder** (Claude Code) on the first page. Tags below: **N** = non-tech track only, **B** = builder only, **Both** = both tracks, with track-specific blocks inside the page where marked.

Mechanism for R3: a small VitePress theme component. It stores the choice in localStorage (wrapped in try/catch; the default is to show everything), sets a `data-track` attribute on `<html>`, and uses `::: track-n` / `::: track-b` custom containers plus a sidebar filter. The site must still read correctly with nothing stored.

## Verdicts

| Page | Verdict | Track | Why / what changes |
|------|---------|-------|--------------------|
| `index.md` (home) | **Rewrite** | Both | New hero/tagline/features (R2). Drop "Strict .clinerules" and "Point Cline or Claude Code at it". Add the two-track chooser. Rework the CTA as the "…or do you?" punchline. |
| `start-here.md` | **Rewrite (light)** | Both → chooser | Keep the plain-English explainer. Add the track choice at the top. Replace "Claude, Cline and Claude Code" with Claude / Claude Code. |
| `introduction.md` | **Rewrite** | Both | The process becomes Richard's current flow: discuss → mockups → "if this existed I'd be happy" → stack/tasks → local V1 → bug-fix rounds → deploy. Drop the Cline steps at lines 32–64. |
| `about.md` | **Rewrite (voice)** | Both | New first-person voice (R2). Keep the History credits (LCF, Visual Hive). |
| `part-0/setting-up-your-computer.md` | **Rewrite** | Both, split | N: install the Claude Desktop app, and that's about it (**depends on F2**). B: VS Code, Node, Git, Docker, Claude Code. Cline removed. |
| `part-0/cline-and-credits.md` | **Cut → Appendix** | B | Becomes part of the new "Other AI coding tools" appendix. Its credit/cost setup is replaced by the new "Plans & limits" page. |
| `part-0/claude-code-setup.md` | **Rewrite** | B | It's currently framed as "advanced users only" and "the CLI shows thinking, the GUI hides it". Richard now wants Claude Code as the default builder tool. Keep CLAUDE.md, permissions, skills. Demote hooks, MCP and subagents to "garnish" (his word). Re-check every shortcut and claim against current docs. |
| `part-0/browser-devtools.md` | **Keep, edit** | Both | Replace "give it to Cline" with Claude. Add "screenshots matter more than ever". |
| `part-0/how-apps-run.md` | **Keep, edit** | Both | Replace the Cline references. The dev/prod `.env` rules stay. |
| `part-0/files-and-styles.md` | **Keep, edit** | Both | Rename "Telling Cline What You Want" to "Telling Claude…". |
| `part-0/glossary.md` | **Keep, edit** | Both | Add CLAUDE.md, skill, artifact, Cowork, session/weekly limit, plan mode. Cline moves into the appendix entry. |
| **NEW** `part-0/plans-and-limits.md` | **New** | Both | Replaces token counting. Covers Free (Sonnet only, tough), Pro (feet wet, hard for full builds), Max (worth it once serious), session and weekly limits, which model for what, and the model named in each task. **Prices must be verified (F5).** |
| `part-1/philosophy.md` | **Rewrite** | Both | New centre of gravity: "99% docs, the rest is garnish". Keep validate-first and fresh session per task. Keep confidence scoring (Richard still uses it). |
| `part-1/tool-selection.md` | **Rewrite** | Both | Becomes "Which Claude, where": Chat/Desktop for discussion and mockups, Cowork (N) or Claude Code (B) for building. The Cline comparison moves to the appendix, with the corrected maths from D2 (4× faster, 10× dearer). Fix the "Claude Pro €90/month" error (that's Max). Keep the "don't trust AI time estimates" box. |
| `part-2/brainstorming.md` | **Rewrite (medium)** | Both | Opus in Chat/Desktop still stands. Add "Chat knows you better than Code" (**depends on F1**). Hand off into the mockup step. |
| **NEW** `part-2/mockups-first.md` | **New** | Both | Claude Design mockups. Iterate until you'd be happy if it existed, and only then talk stack. **Depends on F3.** |
| `part-2/documentation-architecture.md` | **Rewrite** | Both (B-heavy) | CLAUDE.md-first. Add: the **user-techiness profile** (how Claude talks, reports, takes initiative); **unbreakable rules that Claude may update**; a **LEARNINGS/bugs file** it re-reads; **doc-length rules** (summarise, split, archive once past N lines). Material from the NodeGX / rocket school study goes here. |
| `part-2/live-project-overview.md` | **Keep, edit** | B | Replace the 3 Cline references. |
| `part-3/cline-workflow.md` | **Rewrite + rename** → `execution-workflow.md` | Both, split | Claude Code cycle: read the task header, switch to the recommended model, plan mode, build, tests incl. headless browser, screenshot check, confidence, close. Add "rule on several points via an artifact". Add the user-responsibility warning: read the plan before you say "just do it". Needs a redirect for the old URL. |
| `part-3/task-patterns.md` | **Keep, edit** | B | Add a **"Recommended model"** field to the task header. |
| `part-3/confidence-scoring.md` | **Keep** | Both | Still in use. Voice pass only. |
| `part-4/phase-audits.md` | **Keep, edit** | Both | Voice pass. Point audits at a fresh Claude Code session or subagent. |
| `part-4/commenting-philosophy.md` | **Keep** | B | 1 Cline mention. Voice pass. |
| **NEW** `part-4/testing.md` | **New** | B | Backend tests plus **headless browser tests / playtests** that run in the background after changes (rocket school as the example). Explain why you don't see a browser. |
| `part-5/context-management.md` | **Rewrite (medium)** | Both | Keep one task per session. Drop the token-cost maths. Add handoffs (`/next`-style skills) and "why you rarely hit compaction". |
| `part-5/project-memory.md` | **Rewrite (heavy) + cut ~60%** | B | 679 lines, built around Cline. Retarget the hot/warm/cold idea, LEARNINGS discipline and self-audit loop to CLAUDE.md + auto-memory (one lesson per file + index, see R1-NODEGX-REFERENCE). **Keep a "scaling memory" section** for big or long projects, per Richard's change above: MCP + vector search, **or** a Markdown "lakehouse" tree. Cut the Cline session protocols and the long schema dumps. |
| `part-5/project-brain.md` | **Keep, edit** | B | 3 Cline mentions. |
| `part-5/pitfalls-recovery.md` | **Rewrite** | Both | Reframe around Richard's real failure modes: **docs too long**, **Claude too cautious** (push it), **user not reading the plan**. Keep the phantom deploy, Docker disk and groundhog-day bug. Drop the Cline-specific ones. |
| `part-5/team-workflows.md` | **Keep** | B | 0 Cline mentions. Voice pass. |
| `part-5/control-panel.md`, `observability.md`, `feedback-loop.md`, `accessibility.md`, `frontend-tweaker.md` | **Keep, edit** | B | Each has a "The .clinerules Additions" section. Rename to CLAUDE.md, check the content. |
| `part-5/token-economics.md` | **Cut** | – | All about Cline payloads, `.clineignore` and per-request spend. Replaced by `plans-and-limits`. The multi-model note moves there, and the circuit-breaker idea goes to the appendix. |
| `part-5/deployment-platforms.md` | **Keep, edit (medium)** | B | 527 lines, 19 Cline mentions. Change "Cline pushes to dev" to Claude. Consider splitting the mobile/desktop sections out for length (practise the doc-length rule we're preaching). |
| `part-5/deploy-verification.md` | **Keep, edit** | B | 584 lines. Consider trimming. |
| **NEW** `part-5/skills.md` | **New** | B (N lighter) | Skills worth making early: **copywriting first**, because Claude's prose is recognisable. Also handoff skills (`/next`, `/next-go`). Absorbs the skills section from claude-code-setup. |
| `part-6/templates.md` | **Rewrite** | B | CLAUDE.md-only set. `.clinerules` / `.clineignore` / `GLOBAL_MEMORY at ~/.cline` go to the appendix. |
| `part-6/prompts.md` | **Rewrite** | Both | Prompts reorganised by phase for the new flow. Mark the ones worth turning into skills. |
| `part-6/case-studies.md` | **Keep, edit** | Both | Real projects (VH Toolkit, RISE, OpsNest) stay. Note which were built in the Cline era. A rocket school case study is worth adding. |
| `part-6/setup-guide.md` | **Merge → cut** | – | Duplicates Part 0 setup and is Cline-centred. Fold what's useful into setting-up / plans-and-limits. |
| `appendix-e-beyond-coding.md` | **Keep, edit** | Both | 1,111 lines. The worked example's execution phase uses Cline; retarget it to Claude Code or Cowork. The length is a candidate for trimming. |
| **NEW** `appendix-other-tools.md` | **New** | B | Cline as the **pay-as-you-go, pure-API, fast** option (Claude Code = slow but cheap). **Don't** cover running Cline on a Claude subscription: Richard calls it a fringe case (F4 closed), DeepSeek, Kimi Code, pay-as-you-go maths (4× faster, 10× dearer, not advisable for ~90%). Carries over the best of cline-and-credits and tool-selection's comparison. |

**Counts:** 1 page kept as-is apart from a voice pass, 17 keep+edit, 11 rewrite, 3 cut/merge, 6 new (plus the renamed execution-workflow).

## Outside `docs/` (R5)

| File | Verdict |
|------|---------|
| `project-templates/CLAUDE.md` | Rewrite as the primary template: user-techiness profile, unbreakable rules, LEARNINGS, doc-length rules, testing (incl. headless), model-per-task, "rule via artifact". |
| `project-templates/.clinerules`, `.clineignore` | Move to `project-templates/other-tools/cline/`, or delete. |
| `project-templates/GLOBAL_MEMORY.md`, `LEARNINGS.md`, `TASK_TEMPLATE.md` | Edit. TASK_TEMPLATE gets a "Recommended model" line. |
| `WRITING_GUIDE.md` | Rewrite for the new voice: first person, cheeky, **no em dashes, no melodrama**, no swearing (D1). |
| repo `.clinerules` | Replace with a repo `CLAUDE.md` (this repo has none). |
| `docs/.vitepress/config.ts` | Title, description and OG text (R2); new sidebar (R3); redirect for `/part-3/cline-workflow`. |

## Rulings (answered 2026-09-21)

1. Verdict table: **signed off**, with the project-memory change above.
2. Track names: **let the voice pass (R2) propose them**; Richard picks.
3. F4: **closed**, drop Cline-with-subscription. F1, F2, F3, F5: **verify on Anthropic's official pages** at the start of R2 (Richard didn't overrule the default).

## Original questions (kept for the record)

1. **Sign off the verdict table**, or mark changes. In particular: cutting `token-economics` and `setup-guide`, and gutting `project-memory` by about 60%.
2. **Track names** as the reader sees them: "I don't code" / "I'm happy in a terminal"? Or something cheekier (R2)?
3. **F1–F5** in R0-INTERVIEW. F2 (can the non-tech track live entirely in Claude Desktop?) decides whether the N track is real or a thin on-ramp into B. I'll verify these from official docs at the start of R2 unless you already know the answers.
