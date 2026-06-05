# O1: New Chapter — Observability & Error Tracking

**Status:** BACKLOG
**Sprint:** Phase 3
**Priority:** P0
**Est. effort:** Half day
**Dependencies:** None

---

## Context

The guide has no chapter on error tracking or observability. A recent client app hit production with eight gaps in this area, and the most damaging ones (no source maps, no release tagging) are *irreversible* if they aren't wired in early — you cannot retroactively de-minify a stack trace from a build whose source maps were never captured.

This chapter teaches observability as a **maturity model**: it's frank that most of it is skippable while prototyping, but it draws a hard line under the two or three things that must live in the foundation. It belongs in **Part V: Advanced Topics**, alongside the Control Panel chapter, because it follows the same philosophy — declare conventions up front, let the AI maintain them.

Write this in the established chapter voice: conversational, opinionated, TLDR at the top, sections separated by `---`. Match the tone of `docs/part-5/control-panel.md`.

---

## What to Write

Create `docs/part-5/observability.md` with frontmatter:

```markdown
---
title: Observability & Error Tracking
description: Wire the plumbing that's irreversible if missing — defer the dashboard you can always switch on later
---
```

Then the following sections. Word counts are targets, not hard limits. **Write the prose yourself in the repo voice** — the verbatim blocks below (the maturity table, the phase ladder, the config and deploy snippets) should be reproduced exactly; the discursive text around them is yours to write.

### Section: TLDR (~120 words)

The one idea: **separate the plumbing from the dashboard.** Plumbing (SDK init, source-map upload, release tagging, environment split) is cheap, reversible, and irreversible if *missing*. The dashboard (watching errors, alerting) is optional attention you can defer until you have users. Wire the plumbing in Sprint 1; defer the attention.

State the punchline up front: a client app reached production with eight observability gaps, and two of them couldn't be fixed retroactively because the historical builds never captured what was needed.

### Section: The Trap (~250 words)

Explain *why* this gets skipped. Every item on the list feels like a "production concern," so the instinct is to defer all of them to "when we go to production." That's correct for six of the eight. It's fatal for two:

- **Source maps** must be uploaded at build time. A production error from a build whose maps were never captured is permanently minified gibberish (`a.b.c is not a function at vm:1:12345`). You can't go back and de-minify it.
- **Release/version tagging** must be recorded at deploy time. You can't tag an error against a release that was never recorded, so you can never say "this spiked after v1.1.69" about past builds.

The asymmetry is the whole point: *setup* is cheap and reversible; *absence* is irreversible. That's why these two belong in the foundation even though you won't look at the dashboard for weeks.

### Section: The Eight Gaps, Reframed (~350 words)

List the eight gaps the client found, but reframe them honestly — six are not eight things to build, they're the standard feature set of one error-tracking product. Present as a table mapping each gap to where it's solved and at which maturity phase.

Reproduce this table verbatim:

```markdown
| # | Gap | Solved by | Phase |
|---|-----|-----------|-------|
| 1 | No source maps (minified stack traces) | Error tracker + source-map upload at build | **Foundation** |
| 2 | No grouping (1k users, 1k log lines) | Error tracker groups by exception type/message/stack | Foundation (automatic) |
| 5 | No release tagging | Release/version recorded at deploy | **Foundation** |
| 7 | No environment split (dev + prod mixed) | Environment tag in SDK init | **Foundation** |
| 6 | No user/session/breadcrumb context | Error tracker captures automatically once SDK is in | Early |
| 4 | No alerting | Error-tracker alert → Slack/webhook | Early |
| 8 | No session-replay link | PostHog replay tied to the error | Pre-launch |
| 3 | No native iOS crash reporting | Native SDK layer — **only if the app is a Capacitor build** | Conditional |
```

Make the point in prose: gaps 1, 2, 5, 6, 7, 8 are all one tool. Gap 4 is the same tool. Gap 3 is conditional on the mobile decision. So this isn't eight projects — it's "switch on the error tracker, and wire two things into the build."

### Section: Use the Tool You Already Have (~300 words)

The recommendation: projects in this methodology already run **PostHog** for session replay, and PostHog now has a full error-tracking product. So the move is to switch it on, not to add a second vendor (Sentry).

What PostHog covers (state these as current capabilities — Cline should verify the exact API against the live docs at https://posthog.com/docs/error-tracking before writing code):

- Autocapture of unhandled errors and promise rejections in the browser SDKs.
- Source-map upload for readable stack traces (`posthog-cli sourcemap upload`, or framework configs for Next.js/Nuxt).
- Issue grouping by exception type, message, and stack trace.
- Releases with build numbers (e.g. iOS `CFBundleVersion`, Android `versionCode`), source-linked to the GitHub/GitLab commit.
- Real-time alerts on triggers/filters/trends, into Slack, Discord, Teams, or a webhook.
- Session replay tied to each error.
- An **MCP server** for AI-assisted debugging — Cline/Claude can investigate a grouped issue with the full stack trace.

Call out the MCP angle as the fit for this methodology: an error fires → the AI investigates the grouped issue with the real stack trace → you get a task spec → you fix. That closes the loop the guide is built around.

Fallback note: if a client needs a self-hosted specialist error tracker on their own box, **GlitchTip** (Sentry-compatible, lightweight) is the option. Don't add it by default.

### Section: Errors vs. Infrastructure — Two Axes (~250 words)

The most common confusion, stated plainly. There are two separate concerns people conflate:

- **Application error tracking** — individual exceptions, stack traces, grouping, "this broke for 1,000 users." Tool: PostHog (or another error tracker). *Error alerting lives here.*
- **Infrastructure / uptime monitoring** — CPU, memory, request latency, is-the-container-even-up. Tool: Prometheus + Grafana, or a simpler uptime pinger.

Be explicit and opinionated: pointing Prometheus at your application errors is the wrong tool — you'd ship error *counts* as time-series metrics and throw away every stack trace and breadcrumb. For "tell me when a new error appears or the error rate spikes after a release," the simpler and correct answer is the error tracker's built-in alert → Slack webhook. Zero infra.

Prometheus/Grafana earns its place later, for infra health, and for a solo/small-team Hetzner app it's usually overkill — a simple uptime monitor (Uptime Kuma self-hosted, or any hosted checker) covers most of the need until real scale.

On AI-generated alert conditions: don't over-engineer them. Error alerting has three standard shapes — new issue type, count over threshold in a window, regression after a release. AI doesn't add much authoring those. Point the AI at *investigating* fired alerts (the MCP server), not at generating conditions.

### Section: The Maturity Ladder (~300 words)

The heart of the chapter — *when* each thing happens. Reproduce this ladder verbatim, then add a sentence or two of prose under each phase in the repo voice.

```markdown
### Foundation — Sprint 1 (yes, even in a throwaway prototype)
- Enable error capture in the SDK you already have (PostHog: `capture_exceptions`).
- Wire source-map upload + release/version tagging into the deploy script.
- Tag the environment (dev/staging/prod) so they never mix.
- Cost: ~15 minutes, near-zero ongoing. You do NOT have to look at the dashboard.
- Why now: this is the irreversible plumbing. It makes every error from day one recoverable later.

### Early — first real users
- Turn on alerting: new-issue + error-spike → Slack.
- This is the moment you stop hearing about bugs from user complaints.
- User/session/breadcrumb context comes along automatically once the SDK is in.

### Pre-launch
- Confirm session replay is linked to errors.
- Tune issue grouping if it's noisy.
- If the app is a Capacitor mobile build: add the native crash layer + build-number tagging.
- Add a basic uptime check (separate axis — infra, not errors).

### Scale — only if warranted
- Prometheus/Grafana for infra metrics, if you have infra worth watching.
- Event sampling and quota management.
- Error budgets.
```

### Section: Where It Lives in the Foundation Docs (~150 words)

Tie it back to the methodology. This isn't a runbook you write at launch — it's an **Observability section in the foundation docs** (`CLAUDE.md` / `ARCHITECTURE.md` plus a `.clinerules` entry), present from Sprint 1 with a maturity checklist. Most boxes are unchecked early, but the plan and the current level are *declared*. Same move as the Control Panel conventions: declare it up front, let the AI maintain it. The phase column on the checklist is the "indicator of when" — human or Cline can see at a glance what's deliberately deferred versus actually missing.

Cross-reference: link to the Control Panel chapter (`/part-5/control-panel`) and to the deployment chapter for the deploy-script wiring.

---

## Files to Create/Modify

- `docs/part-5/observability.md` — new chapter (this task)
- (Sidebar + outline handled separately in O6)

---

## Acceptance Criteria

- [ ] `docs/part-5/observability.md` exists with the frontmatter above
- [ ] TLDR leads with the plumbing-vs-dashboard principle
- [ ] The "Trap" section names source maps and release tagging as the two irreversible items and explains the asymmetry
- [ ] The eight-gap table is present and reframes six as one tool
- [ ] PostHog is recommended as the consolidation; Sentry is not the default; GlitchTip mentioned only as self-host fallback
- [ ] The two-axes section explicitly rejects Prometheus for application-error alerting and explains why
- [ ] The maturity ladder has all four phases (Foundation / Early / Pre-launch / Scale) verbatim
- [ ] iOS crash reporting is marked conditional on the Capacitor mobile decision, not Foundation
- [ ] Chapter voice matches `docs/part-5/control-panel.md` (TLDR, `---` dividers, conversational)
- [ ] Cross-references the Control Panel and deployment chapters
- [ ] Site builds without errors

## Notes

- Don't invent exact PostHog SvelteKit source-map commands. State the shape and instruct verification against https://posthog.com/docs/error-tracking — the exact CLI invocation changes. The deploy-script specifics live in O4.
- Keep it honest about what's skippable. The value of this chapter is permission to defer most of it, paired with a hard line under the two things you can't.
