# Phase 5: Claude-Code-First Audit & Voice Rebrand

**Status:** NOT STARTED (handed off 2026-09-21)
**Source:** Richard now works almost entirely in Claude Code. The guide still centres Cline + Claude Projects + `.clinerules` — 33 of the 39 pages under `docs/` mention Cline (counted 2026-09-21 at `a04019e`).

**The brief, in Richard's words:** rebrand the whole thing as *"I know so fucking much about Claude I made a whole docs site to show you how to use it, so you don't even need me... or do you?"*

Read that as: cheeky, confident, self-aware, first person (matches digitalbricks.io's voice), Claude-Code-first. The "Book a call" CTA is the punchline to the "...or do you?" — not a sales block bolted on. How far the swearing goes on the live site is Richard's call (see Decisions).

---

## What the previous session did (done AND observed working)

| Item | Evidence |
|------|----------|
| Forked `Visual-Hive/ai-coding-docs` → `richardosborne14/ai-coding-docs` | Remotes: `origin` = personal fork, `upstream` = Visual-Hive. Visual-Hive's repo is itself a fork of `The-Low-Code-Foundation/vibe-coding-docs`. |
| Rebranded to Digital Bricks (palette, logo, favicons, CTAs, About, footer) | Commit `48ad618`. Screenshotted dark + light locally. CTAs use `.db-cta` classes and Richard's booking link `https://calendar.app.google/HH5FyJKogsLQc2kC8`. LCF + Visual Hive credited in About › History. |
| Live at **https://learn-ai.digitalbricks.io** on nexus-1 (Hetzner, 49.12.102.195) | Commit `a04019e`. `./deploy/deploy.sh --go-live` returned 200 for `/`, `/part-1/philosophy`, nexus.digitalbricks.io and digitalbricks.io; unknown path → 404; HSTS header present. |

**Settled — don't relitigate:**
- Domain is `learn-ai.digitalbricks.io` (Richard changed it from `ai-coding.` — plan of record was wrong, all refs updated).
- Deploy = `./deploy/deploy.sh` (build locally → rsync to `/srv/learn-ai/site` → Caddy block `/etc/caddy/conf.d/learn-ai.caddy`). Vercel is gone from this repo.
- VH Conference Toolkit + RISE case-study links stay (real projects Richard built).
- Internal planning files (`META-ROADMAP.md`, `WRITING_GUIDE.md`, `.clinerules`, older `dev-tasks/`) were not rebranded — they are the repo's AI working files, not the site. `WRITING_GUIDE.md` and `.clinerules` WILL need updating for the new voice/Claude Code (task R5).

**Loose ends from last session:**
- `digitalbricks-site/index.html` (sibling repo, ~line 615) still links "The guide" card to `https://ai-coding.visualhive.co`. Needs → `https://learn-ai.digitalbricks.io` + redeploy via `digitalbricks-site/deploy/deploy.sh`. Richard hasn't approved touching that repo yet — ask.
- The old Visual Hive Vercel deployment (`ai-coding.visualhive.co`) is still up. Redirect/takedown is Richard's call.
- `dev-tasks/phase-4-observability/DOCS-TASK-project-brain.md` is untracked and predates this work — Richard's, leave it.

---

## Tasks (in order)

| Task | Title | Status |
|------|-------|--------|
| R0 | **Interview Richard** before touching content | ⬜ |
| R1 | Content audit → written findings | ⬜ |
| R2 | Voice & positioning spec (hero, tagline, About, CTA punchline) | ⬜ |
| R3 | Restructure IA / sidebar for Claude-Code-first | ⬜ |
| R4 | Rewrite chapters per audit | ⬜ |
| R5 | Update `project-templates/`, `WRITING_GUIDE.md`, `.clinerules` → CLAUDE.md-first | ⬜ |
| R6 | Build, screenshot, deploy, verify live | ⬜ |

### R0 — Interview first (human input needed)

Do NOT rewrite from assumptions. Ask Richard (AskUserQuestion or plain questions), e.g.:
- What does a typical build look like now, start to finish? Still brainstorm in Claude.ai Projects, or straight into Claude Code?
- Which Claude Code features carry the weight: plan mode, subagents, skills, hooks, CLAUDE.md/memory, slash commands, `/next` handoffs, worktrees, workflows, MCP, artifacts?
- What has he stopped doing (confidence scoring? sprint plans? one-task-per-conversation? `.clinerules`?)
- What new failure modes / pitfalls has he hit?
- Is Cline dropped entirely, kept as an appendix, or kept as "if you want model choice / cheaper"?
- How rude can the live site be? (see Decisions)

### R1 — Audit

Page-by-page table: keep / rewrite / merge / cut / new, with reason. Known hot spots: `part-0/cline-and-credits.md`, `part-0/claude-code-setup.md`, `part-1/tool-selection.md`, `part-3/cline-workflow.md`, `part-5/context-management.md`, `part-5/token-economics.md`, `part-6/setup-guide.md`, `part-6/prompts.md`, `project-templates/.clinerules` + `CLAUDE.md`. The home page features still say "Strict .clinerules" and "Point Cline or Claude Code at it". Deliver the audit to Richard for sign-off before R3/R4.

### R2 — Voice

Hero, tagline, meta description, About, and the CTA. The joke is "you don't need me — ...or do you?" so the CTA should land as its payoff. Keep the Digital Bricks look (don't touch `custom.css` palette).

---

## Decisions needing Richard (not an agent's call)

1. How literal is "so fucking much" on the live site — verbatim in the hero, softened (f***), or tone-only?
2. Cline: cut, appendix, or alternative-path?
3. Update the digitalbricks.io link and redeploy that site?
4. Redirect / take down `ai-coding.visualhive.co`?
5. Rename the GitHub repo (`ai-coding-docs` → e.g. `learn-ai`)? Would need remote + link updates.

## Verify before trusting

- `git log --oneline -3` should show `a04019e` at or near HEAD.
- `curl -sI https://learn-ai.digitalbricks.io/` → 200.
- Deploy needs `~/.ssh/nexus_hetzner`; the script refuses to reload Caddy on an invalid config and checks the co-hosted sites after reload.
