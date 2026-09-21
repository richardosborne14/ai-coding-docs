# Phase 5: Claude-Code-First Audit & Voice Rebrand

**Status:** IN PROGRESS. R0 to R3 are done (2026-09-21). **The next session starts at R4.** Nothing from R3 is deployed yet: deploying is R6.

**The brief, in Richard's words:** rebrand the whole thing as *"I know so much about Claude I made a whole docs site to show you how to use it, so you don't even need me... or do you?"* The "Book a call" CTA is the punchline to "...or do you?". **Tone only, no swearing on the site** (ruled 2026-09-21).

**Read first, in this order:**
1. [R0-INTERVIEW.md](R0-INTERVIEW.md): how Richard works now. Its decisions D1–D6 are settled. Open facts F1–F5 are there too.
2. [R1-AUDIT.md](R1-AUDIT.md): the signed-off page-by-page verdicts, the two-track mechanism, and Richard's change to project-memory (**includes an NDA rule**).
3. [R1-NODEGX-REFERENCE.md](R1-NODEGX-REFERENCE.md): documentation practices in Richard's NodeGX repos, with paths. Source material for R4/R5.
4. [R2-FACTS.md](R2-FACTS.md): F1, F2, F3, F5 checked on Anthropic's own pages. **Overrides R0's "open facts" and parts of R1** (see "Where the earlier plan was wrong").
5. [R2-VOICE.md](R2-VOICE.md): voice rules and the copy options Richard is picking from.

---

## Tasks

| Task | Title | Status |
|------|-------|--------|
| R0 | Interview Richard | ✅ 2026-09-21 → R0-INTERVIEW.md |
| R1 | Content audit → written findings, signed off | ✅ 2026-09-21 → R1-AUDIT.md |
| R2 | Verify F1–F3 + F5, then the voice & positioning spec (hero, tagline, meta, About, CTA punchline, **track names**) | ✅ 2026-09-21 → R2-FACTS.md, R2-VOICE.md (picks recorded at the bottom) |
| R3 | Restructure IA / sidebar, and build the two-track show/hide mechanism | ✅ 2026-09-21 (see "R3: what was built") |
| R4 | Rewrite chapters per the audit (incl. 6 new pages, 3 cuts) | ⬜ **next** |
| R5 | `project-templates/` → CLAUDE.md-only; rewrite `WRITING_GUIDE.md`; replace repo `.clinerules` with a repo `CLAUDE.md` | ⬜ |
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
- F3: Claude Design is on paid plans. It is labelled beta in one place and research preview in another. It hands off to Claude Code as a bundle. **What the bundle contains is still unconfirmed**: check this before R4 writes `mockups-first`.

### R3: what was built (2026-09-21, verified in a browser, not deployed)

- **The IA lives in one list:** `IA` at the top of `docs/.vitepress/config.ts`. The sidebar and the builder-only page list are both built from it. Each page has an optional `track: 'everything'`, which means builder-only.
- **New pages already have a sidebar slot.** An entry whose `.md` file doesn't exist is left out of the sidebar. So in R4, writing `part-0/plans-and-limits.md`, `part-2/mockups-first.md`, `part-4/testing.md`, `part-5/skills.md` or `appendix-other-tools.md` makes it appear. No config edit needed.
- **Cut pages are out of the sidebar and nav but still on disk** (`part-0/cline-and-credits`, `part-5/token-economics`, `part-6/setup-guide`). R4 folds their content in, deletes them, and adds `redir` lines to `deploy/learn-ai.caddy` (suggested targets: appendix-other-tools, plans-and-limits, setting-up-your-computer).
- **Rename done:** `part-3/cline-workflow.md` → `execution-workflow.md` (git mv, content untouched; the R4 rewrite is still due). Internal links fixed. A 301 for the old URL is in `deploy/learn-ai.caddy`, and `deploy.sh` copies that file on a normal deploy. The repo `.clinerules` still links the old URL; R5 replaces that file anyway.
- **Mechanism:** `docs/.vitepress/theme/track.ts` (state, localStorage key `db-learn-track`, every read and write in try/catch). `TrackSwitch.vue` sits at the top of the sidebar and in the mobile menu. `TrackChooser.vue` is the two-card chooser for markdown (`<TrackChooser />`). `TrackPageNote.vue` shows a note on a builder-only page when the reader is on "Keep it simple". A head script in `config.ts` sets `<html data-track>` before first paint. With nothing stored, nothing is hidden.
- **For R4 writers, two containers:** `::: everything` (hidden on the simple track) and `::: simple` (always shown, labelled "Keep it simple"). Both take an optional custom label: `::: everything Terminal route`.
- **Copy already in place:** the site title is "Build it with Claude", the meta and OG description is M1, `<TrackChooser />` is at the top of `start-here.md` (under a new "Pick your track" heading), and "Setup Guide" is gone from the nav. **Not done:** `index.md` frontmatter still has the old description and hero. That's the R4 home rewrite.
- **Checks taken 2026-09-21** (Chrome via Playwright, against `vitepress preview`): with nothing stored it shows everything. Choosing simple sets the attribute and stores it, and the choice survives a reload. The sidebar goes from 21 to 16 visible items. Builder-only blocks hide, and the page note shows on `/part-5/observability` and switches back. The sidebar switch and chooser stay in sync. Desktop and 390px phone: no horizontal scroll and no console errors. With localStorage throwing, the switch still works for the session (the only error is VitePress's own appearance script). Dark mode looked right. `npm run build` passes. Its >500 kB warning is the local search index and isn't new.

### R4: start here

1. Rewrite pages in the audit's order (R1-AUDIT › Verdicts). Home first, because it carries the R2 picks (hero H2, 5 cards, CTA C1, M1 in the frontmatter). Put `<TrackChooser />` or card 1 on it.
2. **Retag while you rewrite.** The `track: 'everything'` tags were copied from R1, which assumed the simple track was Cowork. It's now the desktop app's Code tab, which *is* Claude Code, so CLAUDE.md, task headers and skills apply to simple readers too. Pages worth re-judging: `claude-code-setup`, `task-patterns`, `live-project-overview`, `templates`. Where only part of a page is builder-only, untag the page and wrap that part in `::: everything`.
3. F3 is still open: check what the Claude Design → Claude Code handoff bundle contains before writing `mockups-first`.
4. Voice rules from R2-VOICE apply everywhere: `grep -c "—"` must come back 0 on each rewritten page.

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
3. (Ruled 2026-09-21: voice, track names and N-track shape. See R2-VOICE.md.)

## Verify before trusting
- `git log --oneline -3`: the phase-5 folder (R0, R1, R2 files) is committed.
- `curl -sI https://learn-ai.digitalbricks.io/` → 200.
- `curl -s https://digitalbricks.io/ | grep -o 'https://learn-ai[^"]*'` → the guide link.
- `dev-tasks/phase-4-observability/DOCS-TASK-project-brain.md` is untracked, predates this phase and is Richard's. Leave it.
