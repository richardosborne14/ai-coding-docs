# Phase 5: Claude-Code-First Audit & Voice Rebrand

**Status:** IN PROGRESS. R0 to R4 are done (2026-09-21). **The next session starts at R5.** R3 + R4 are **live** (deployed 2026-09-21 at Richard's request, from `3cb0c4a`). R6 is still due after R5: the full screenshot pass and a redeploy.

**The brief, in Richard's words:** rebrand the whole thing as *"I know so much about Claude I made a whole docs site to show you how to use it, so you don't even need me... or do you?"* The "Book a call" CTA is the punchline to "...or do you?". **Tone only, no swearing on the site** (ruled 2026-09-21).

**Read first, in this order:**
1. [R0-INTERVIEW.md](R0-INTERVIEW.md): how Richard works now. Its decisions D1–D6 are settled. Open facts F1–F5 are there too.
2. [R1-AUDIT.md](R1-AUDIT.md): the signed-off page-by-page verdicts, the two-track mechanism, and Richard's change to project-memory (**includes an NDA rule**).
3. [R1-NODEGX-REFERENCE.md](R1-NODEGX-REFERENCE.md): documentation practices in Richard's NodeGX repos, with paths. Source material for R4/R5.
4. [R2-FACTS.md](R2-FACTS.md): F1, F2, F3, F5 checked on Anthropic's own pages. **Overrides R0's "open facts" and parts of R1** (see "Where the earlier plan was wrong").
5. [R2-VOICE.md](R2-VOICE.md): voice rules and the copy options Richard is picking from.
6. [R4-WRITER-BRIEF.md](R4-WRITER-BRIEF.md): the brief every R4 page writer followed (method, facts incl. verified Claude Code commands, track containers, voice rules, NDA). Reuse it for R5.

---

## Tasks

| Task | Title | Status |
|------|-------|--------|
| R0 | Interview Richard | ✅ 2026-09-21 → R0-INTERVIEW.md |
| R1 | Content audit → written findings, signed off | ✅ 2026-09-21 → R1-AUDIT.md |
| R2 | Verify F1–F3 + F5, then the voice & positioning spec (hero, tagline, meta, About, CTA punchline, **track names**) | ✅ 2026-09-21 → R2-FACTS.md, R2-VOICE.md (picks recorded at the bottom) |
| R3 | Restructure IA / sidebar, and build the two-track show/hide mechanism | ✅ 2026-09-21 (see "R3: what was built") |
| R4 | Rewrite chapters per the audit (incl. 6 new pages, 3 cuts) | ✅ 2026-09-21 (see "R4: what was done"). Written and build-checked, **not yet read by Richard** |
| R5 | `project-templates/` → CLAUDE.md-only; rewrite `WRITING_GUIDE.md`; replace repo `.clinerules` with a repo `CLAUDE.md` | ⬜ **next** |
| R6 | Build, screenshot (light + dark, both tracks, phone width), deploy with `./deploy/deploy.sh`, verify live | ⬜ |

### R2: start here

1. ✅ **Facts verified** 2026-09-21 → [R2-FACTS.md](R2-FACTS.md). Only Anthropic pages were used.
2. ✅ **Voice spec drafted** → [R2-VOICE.md](R2-VOICE.md). Richard is choosing on the ruling page **https://claude.ai/artifact/55MeBnxb4CGwgnGETAp4Qs**. Recommendations are pre-selected.
3. ✅ **Picks read** 2026-09-21 and recorded in R2-VOICE.md › Richard's picks. (How it was done: The page saves them to the artifact's database: `ArtifactData` → action `get`, url above, collection/doc `rulings/r2`. Fields are `hero`, `cta`, `ntrack`, `tracks`, `cards` (a list of the kept cards), `about`, `meta`, plus `<field>Note` and `otherNote` if he wrote any. If the doc is missing, he hasn't sent it: ask, and don't guess. Record the picks under "Richard's picks" in R2-VOICE.md.)
4. **Voice rules** (Richard's) are listed in R2-VOICE.md. No em dashes, no melodrama, no swearing, first person. Keep the Digital Bricks look (`custom.css` palette untouched).

### Where the earlier plan was wrong (settled by R2-FACTS)
- **The non-tech track is not "Chat/Cowork end to end".** The Claude desktop app has Claude Code built in (the Code tab), with no terminal and no Node install, and it has a Browser pane showing the running app. No official page says Cowork runs a local app. The recommended N track is therefore "everything in the desktop app: Chat → Design → Code tab". Richard confirms this with the `ntrack` pick. R1's N-track notes for `setting-up-your-computer` and `tool-selection` need adjusting in R3/R4 to match.
- **Fable is not Max-only.** Pro users can run it on pay-as-you-go credits. On Max it can use up to 50% of the weekly limit at no extra cost.
- F1: Claude Code does **not** see Chat memory (Chat memory is shared with Cowork only, since 2026-08-25). Richard was right.
- F3: Claude Design is on paid plans. It is labelled beta in one place and research preview in another. It hands off to Claude Code as a bundle. The bundle's contents were confirmed in R4 (design files, chat, README): see R2-FACTS › F3.

### R3: what was built (2026-09-21, verified in a browser, not deployed)

- **The IA lives in one list:** `IA` at the top of `docs/.vitepress/config.ts`. The sidebar and the builder-only page list are both built from it. Each page has an optional `track: 'everything'`, which means builder-only.
- **New pages already have a sidebar slot.** An entry whose `.md` file doesn't exist is left out of the sidebar. So in R4, writing `part-0/plans-and-limits.md`, `part-2/mockups-first.md`, `part-4/testing.md`, `part-5/skills.md` or `appendix-other-tools.md` makes it appear. No config edit needed.
- **Cut pages are out of the sidebar and nav but still on disk** (`part-0/cline-and-credits`, `part-5/token-economics`, `part-6/setup-guide`). R4 folds their content in, deletes them, and adds `redir` lines to `deploy/learn-ai.caddy` (suggested targets: appendix-other-tools, plans-and-limits, setting-up-your-computer).
- **Rename done:** `part-3/cline-workflow.md` → `execution-workflow.md` (git mv, content untouched; the R4 rewrite is still due). Internal links fixed. A 301 for the old URL is in `deploy/learn-ai.caddy`, and `deploy.sh` copies that file on a normal deploy. The repo `.clinerules` still links the old URL; R5 replaces that file anyway.
- **Mechanism:** `docs/.vitepress/theme/track.ts` (state, localStorage key `db-learn-track`, every read and write in try/catch). `TrackSwitch.vue` sits at the top of the sidebar and in the mobile menu. `TrackChooser.vue` is the two-card chooser for markdown (`<TrackChooser />`). `TrackPageNote.vue` shows a note on a builder-only page when the reader is on "Keep it simple". A head script in `config.ts` sets `<html data-track>` before first paint. With nothing stored, nothing is hidden.
- **For R4 writers, two containers:** `::: everything` (hidden on the simple track) and `::: simple` (always shown, labelled "Keep it simple"). Both take an optional custom label: `::: everything Terminal route`.
- **Copy already in place:** the site title is "Build it with Claude", the meta and OG description is M1, `<TrackChooser />` is at the top of `start-here.md` (under a new "Pick your track" heading), and "Setup Guide" is gone from the nav. The `index.md` hero and frontmatter were done in R4.
- **Checks taken 2026-09-21** (Chrome via Playwright, against `vitepress preview`): with nothing stored it shows everything. Choosing simple sets the attribute and stores it, and the choice survives a reload. The sidebar goes from 21 to 16 visible items. Builder-only blocks hide, and the page note shows on `/part-5/observability` and switches back. The sidebar switch and chooser stay in sync. Desktop and 390px phone: no horizontal scroll and no console errors. With localStorage throwing, the switch still works for the session (the only error is VitePress's own appearance script). Dark mode looked right. `npm run build` passes. Its >500 kB warning is the local search index and isn't new.

### R4: what was done (2026-09-21)

- **Every page in the audit is rewritten or edited.** 40 files, about 6,000 lines out and 3,100 in. Home, introduction, about, plans-and-limits and mockups-first were written by the lead session. The rest came from parallel writers working to [R4-WRITER-BRIEF.md](R4-WRITER-BRIEF.md).
- **New pages:** `part-0/plans-and-limits`, `part-2/mockups-first`, `part-4/testing`, `part-5/skills`, `appendix-other-tools` (5 of the audit's 6; the sixth "new" item was the execution-workflow rename, rewritten here).
- **Cut and deleted:** `part-0/cline-and-credits`, `part-5/token-economics`, `part-6/setup-guide`. 301s to appendix-other-tools, plans-and-limits and setting-up-your-computer are in `deploy/learn-ai.caddy`.
- **Retagged for both tracks** (the simple track is the Code tab, so it is Claude Code too): `claude-code-setup`, `task-patterns` (sidebar label now "Task Patterns"), `testing`, `project-memory`, `templates`. Still builder-only: live-project-overview, commenting-philosophy, project-brain, team-workflows, the part-5 builder pages, appendix-other-tools.
- **F3 closed** in R2-FACTS: the Design → Code bundle holds the design files, the chat and a README. Still unknown whether it holds HTML/CSS or screenshots, and the site doesn't claim either.
- **Checks taken 2026-09-21 on the working tree (before the R4 commit):** `grep` finds **0** em or en dashes in `docs/**/*.md` (was 855). "Cline" appears only in appendix-other-tools (21), case-studies (4, "built in the Cline era"), templates (3, pointer to other-tools/cline) and glossary (1). `npm run build` passes (no dead links). A script checked every `](...#anchor)` against the built HTML: 0 broken. Chrome via Playwright on `vitepress preview`: 8 pages × both tracks × 1280/390px, no horizontal scroll, no console errors, `::: everything` blocks hidden on simple and shown otherwise, the builder-only page note shows on the appendix. Phone screenshots of home and setting-up looked right.
- **Added after R4 (2026-09-21, `1f69a60`, live):** an anonymised case study, "The meeting record: task management in reverse", from Richard's NDA sibling project. He relaxed the NDA to allow the concept and structure, with no names; he approved the wording on a local preview before deploy. See memory `nda-sibling-repo`.
- **Not checked:** a human read of the copy. Dark mode wasn't re-screenshotted (R6 does the full screenshot pass).

### R5: start here

1. `project-templates/`: rewrite `CLAUDE.md` as the primary template (user-techiness profile, unbreakable rules, learnings habit, doc-length rules, testing incl. headless browser, model-per-task, "rule via artifact"). Add a "Recommended model" line to `TASK_TEMPLATE.md`. Move `.clinerules` and `.clineignore` to `project-templates/other-tools/cline/`. **`docs/part-6/templates.md` already describes the set as it will be after R5**, so match it (read it first).
2. Rewrite `WRITING_GUIDE.md` for the new voice (R2-VOICE rules).
3. Replace the repo `.clinerules` with a repo `CLAUDE.md` (it still links the old `/part-3/cline-workflow` URL).
4. Then R6: build, screenshots (light + dark, both tracks, phone), `./deploy/deploy.sh`, verify live.

**Deploy readings 2026-09-21 (commit 3cb0c4a, `./deploy/deploy.sh`):** Caddy validated and reloaded. nexus, digitalbricks.io, the learn-ai home and philosophy all returned 200. The live home shows the H2 hero and the C1 CTA. The 5 new pages return 200. All four old URLs 301 to their targets (`/part-0/cline-and-credits`, `/part-5/token-economics`, `/part-6/setup-guide` incl. `.html`, `/part-3/cline-workflow`). Richard asked to deploy before reading the copy, so the "Read the R4 copy" item below now means fixing it live.

---

## Done and observed working

| Item | Evidence |
|------|----------|
| Fork, Digital Bricks rebrand, live at **https://learn-ai.digitalbricks.io** (earlier sessions) | Re-checked 2026-09-21: `git log` shows `a04019e` directly under the handoff commit `7c16e88`; `curl -sI` → 200 with an HSTS header; `~/.ssh/nexus_hetzner` exists. |
| Claim "33 of 39 pages mention Cline" | Re-counted 2026-09-21: true. The handoff's hot-spot list missed the worst page, `part-5/project-memory.md` (60 mentions). |
| **digitalbricks.io "The guide" card → learn-ai.digitalbricks.io** (2026-09-21) | The source was already fixed in `digitalbricks-site` commit `98d125e` but never deployed; the live site was still the old root `index.html`. Richard chose to **ship the redesign** (12-page EN/FR build). Ran `digitalbricks-site/deploy/deploy.sh`: Caddy config validated and reloaded. Checked after the deploy: `/`, www, `/fr/`, `/contact/`, `/pricing/`, `/training/`, `/partners/`, `/legal/`, `/terms.html` and the rate-card PDF all return 200; nexus and learn-ai return 200; the live homepage now links only to `learn-ai.digitalbricks.io`. |

**Side effects of that deploy (Richard's to pick up; not this phase):**
- The redesign has **10 links to pages that aren't written yet** (EN/FR home → founders, about, work; partners → cv, claude). The build lists them as "Not yet written".
- The live homepage **no longer has the Data Spine or GEO Playbook cards** that the old one-pager had.
- `digitalbricks-site/index.html` (the old one-pager, still at the repo root) no longer feeds the build. It still has the old `ai-coding.visualhive.co` link, which doesn't matter unless someone deploys it by hand.

## Settled — don't relitigate
- Domain is `learn-ai.digitalbricks.io`. Deploy = `./deploy/deploy.sh` (build locally → rsync to `/srv/learn-ai/site` → Caddy block `/etc/caddy/conf.d/learn-ai.caddy`). There is no Vercel.
- The VH Conference Toolkit and RISE case-study links stay.
- Cline → appendix only. It's the pay-as-you-go, fast option; Claude Code is slow but cheap. **Don't cover Cline running on a Claude subscription** (Richard: fringe case).
- Keep confidence scoring, sprint/phase plans, and one task per session. Drop token counting in favour of plan limits.
- **NDA:** the Markdown "lakehouse" memory pattern Richard likes comes from a sibling repo that must never be named or quoted. Describe the pattern generically.

## Still Richard's call (not asked or not approved yet)
1. Redirect or take down the old `ai-coding.visualhive.co` (not approved 2026-09-21).
2. Rename the GitHub repo (not approved 2026-09-21).
3. **Read the R4 copy** before R6 deploys it. The points below are where writers had to guess:
   - `part-6/case-studies`: three case studies ("simple dashboard", "legacy refactor", "failed project") have no name or link, and the writer couldn't confirm they're real. Keep, rename or cut?
   - `part-2/documentation-architecture`: the doc-length budgets (CLAUDE.md under 200 lines, other docs under 400) are the writer's examples, not Richard's numbers.
   - `part-5/project-memory`: "Given the choice, I'd start with Route B" (Markdown tree over an MCP vector server) is written in Richard's voice.
   - `part-5/pitfalls-recovery`: the 2,000-line learnings file is told as Richard's own (it's OpenNoodl's; no repo named).
   - `part-6/case-studies`: VH Toolkit is marked "built in the Cline era" from its March 2026 date, not from its repo. RISE keeps its "about $400 of pay-as-you-go API spend" as history.
3. (Ruled 2026-09-21: voice, track names and N-track shape. See R2-VOICE.md.)

## Verify before trusting
- `git log --oneline -3`: the phase-5 folder (R0, R1, R2 files) is committed.
- `curl -sI https://learn-ai.digitalbricks.io/` → 200.
- `curl -s https://digitalbricks.io/ | grep -o 'https://learn-ai[^"]*'` → the guide link.
- `dev-tasks/phase-4-observability/DOCS-TASK-project-brain.md` is untracked, predates this phase and is Richard's. Leave it.
