# Phase 5: Claude-Code-First Audit & Voice Rebrand

**Status:** IN PROGRESS. R0 and R1 are done and signed off. R2 is done: facts verified and voice picked (2026-09-21). **The next session starts at R3.**

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
| R3 | Restructure IA / sidebar, and build the two-track show/hide mechanism | ⬜ **next** |
| R4 | Rewrite chapters per the audit (incl. 6 new pages, 3 cuts, redirect for `/part-3/cline-workflow`) | ⬜ |
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

### R3 notes
- Track names are **"Keep it simple" / "Show me everything"** (T3). "Everything" hides nothing; "simple" hides builder-only blocks. The simple track is the desktop app's Code tab (Richard ruled `ntrack` = code-tab), so adjust R1's N-track notes for `setting-up-your-computer` and `tool-selection` to match.
- Two tracks, chosen on the first page, with show/hide. The proposed mechanism is in R1-AUDIT › Tracks: localStorage wrapped in try/catch, the default shows everything, and the pages must read fine with nothing stored.

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
