---
title: Observability & Error Tracking
description: Wire the plumbing that's irreversible if missing — defer the dashboard you can always switch on later
---

# Observability & Error Tracking

## TLDR

**Separate the plumbing from the dashboard.** The plumbing — SDK error capture, source-map upload, release tagging, environment split — is cheap to set up, safe to ignore for weeks, and irreversible if *missing*. The dashboard — watching errors, setting up alerts, tuning grouping — is optional attention you can defer until you have real users.

A client app reached production with eight observability gaps. Six of them were fixable in an afternoon. Two of them — source maps and release tagging — couldn't be fixed retroactively, because the historical builds never captured what was needed. Every production error from those builds was permanently minified gibberish.

Wire the plumbing in Sprint 1. Defer the attention. That's the whole chapter.

---

## The Trap

Every item on the observability list feels like a "production concern." The natural instinct is to defer all of them to "when we go to production." That instinct is correct for six of the eight. It's fatal for two:

- **Source maps** must be uploaded at build time. When your production app throws an error, the stack trace points at minified code — `a.b.c is not a function at vm:1:12345`. The only way to make that readable is a source map from *that specific build*. If the map was never uploaded, the error is permanently undebuggable. You can't go back and de-minify it.

- **Release/version tagging** must be recorded at deploy time. When you need to know "did this error start after v1.1.69?", the answer requires that v1.1.69 was tagged as a release when it was deployed. If it wasn't, you're looking at an undifferentiated timeline of errors with no way to correlate them to deploys.

The asymmetry is the whole point: *setting up* the plumbing is cheap and reversible — you can always rip out a source-map upload step. But *not having it* is irreversible — you cannot retroactively create data that was never captured. That's why these two belong in the foundation even though you won't look at the dashboard for weeks.

---

## The Eight Gaps, Reframed

A client app hit production launch before anyone noticed eight observability gaps. The instinct was to treat this as eight separate projects. It isn't.

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

Look at the "Solved by" column. Gaps 1, 2, 5, 6, 7, and 8 are all features of one error-tracking product. Gap 4 is the same product's alerting feature. Gap 3 is conditional on the mobile decision — not even relevant for web-only apps.

So this isn't eight projects. It's "switch on the error tracker, and wire two things into the build." The table's numbered out of order deliberately — sorted by *when* each matters, not by how the client originally listed them.

---

## Use the Tool You Already Have

Projects following this methodology already run **PostHog** for session replay. PostHog now has a full error-tracking product. The move is to switch it on — not to add a second vendor.

What PostHog covers today (verify exact APIs against [PostHog error-tracking docs](https://posthog.com/docs/error-tracking) before writing integration code):

- **Autocapture of unhandled errors** and promise rejections in the browser SDKs — no manual instrumentation needed for basic coverage.
- **Source-map upload** for readable stack traces — via `posthog-cli sourcemap upload` or framework-specific configs for Next.js/Nuxt. Check the current CLI flags; they evolve.
- **Issue grouping** by exception type, message, and stack trace — automatic, tunable.
- **Release tracking** with version numbers and commit SHAs, linked to GitHub/GitLab.
- **Alerts** on new issue types, error-count thresholds, and post-release regressions — into Slack, Discord, Teams, or a webhook.
- **Session replay tied to each error** — click from the error to the user's recording and see exactly what happened.
- **An MCP server for AI-assisted debugging** — Cline or Claude Code can investigate a grouped issue with the full stack trace, breadcrumbs, and session context.

That last point is the fit for this methodology. The loop closes: an error fires → PostHog groups it with the real stack trace → the AI investigates via the MCP server → you get a task spec → you fix. No more guessing at minified stack traces. No more "I think this might be related to..." — the AI reads the actual error, in context, with the user's session.

**Fallback:** If a client requires a self-hosted, specialist error tracker on their own infrastructure, **GlitchTip** (Sentry-compatible, lightweight, open source) is the option. Don't add it by default — PostHog covers the need, and adding a second vendor doubles the integration surface for no gain in most cases.

---

## Errors vs. Infrastructure — Two Axes

The most common confusion, stated plainly. There are two separate concerns people conflate under "monitoring":

- **Application error tracking** — individual exceptions, stack traces, issue grouping, "this broke for 1,000 users." Tool: PostHog (or another error tracker). *Error alerting lives here.*
- **Infrastructure / uptime monitoring** — CPU, memory, request latency, is-the-container-even-up. Tool: Prometheus + Grafana, or a simpler uptime pinger.

These are different axes. Don't cross them.

Pointing Prometheus at your application errors is the wrong tool for the job. You'd ship error *counts* as time-series metrics and throw away every stack trace, breadcrumb, and user context. For "tell me when a new error appears" or "alert me when the error rate spikes after a release," the simpler and correct answer is the error tracker's built-in alert → Slack webhook. Zero infra to stand up.

Prometheus/Grafana earns its place later, for infrastructure health — and for a solo/small-team Hetzner app, it's usually overkill. A simple uptime monitor ([Uptime Kuma](https://github.com/louislam/uptime-kuma) self-hosted, or any hosted checker) covers most of the "is it up?" need until real scale.

**On AI-generated alert conditions:** don't over-engineer them. Error alerting has three standard shapes:

1. New issue type appeared
2. Error count over threshold in a time window
3. Regression after a release

AI doesn't add much authoring those — they're config toggles. Point the AI at *investigating* fired alerts (via the PostHog MCP server), not at generating the conditions.

---

## The Maturity Ladder

This is when each thing happens. The ladder is the heart of the chapter — it tells you (and the AI) what's deliberately deferred versus actually missing.

### Foundation — Sprint 1 (yes, even in a throwaway prototype)
- Enable error capture in the SDK you already have (PostHog: `capture_exceptions`).
- Wire source-map upload + release/version tagging into the deploy script.
- Tag the environment (dev/staging/prod) so they never mix.
- Cost: ~15 minutes, near-zero ongoing. You do NOT have to look at the dashboard.
- Why now: this is the irreversible plumbing. It makes every error from day one recoverable later.

Two of those bullets are the entire reason this chapter exists. Everything else is "nice to have, do it when you're ready." These two are "do it now or regret it later."

### Early — first real users
- Turn on alerting: new-issue + error-spike → Slack.
- This is the moment you stop hearing about bugs from user complaints.
- User/session/breadcrumb context comes along automatically once the SDK is in.

You don't need to actively watch the dashboard yet. Just let the alerts come to you. When one fires, investigate it properly — via the error tracker, not by guessing.

### Pre-launch
- Confirm session replay is linked to errors.
- Tune issue grouping if it's noisy.
- If the app is a Capacitor mobile build: add the native crash layer + build-number tagging.
- Add a basic uptime check (separate axis — infra, not errors).

This is when you actually start *using* the dashboard. The plumbing has been collecting data since Sprint 1 — now you benefit from it.

### Scale — only if warranted
- Prometheus/Grafana for infra metrics, if you have infra worth watching.
- Event sampling and quota management.
- Error budgets.

Most projects in this methodology never reach this phase. That's fine. The Foundation plumbing was the critical move, and you already made it.

---

## Where It Lives in the Foundation Docs

This isn't a runbook you write at launch. It's an **Observability section in the foundation docs** — `ARCHITECTURE.md` gets a maturity checklist, `CLAUDE.md` gets a pointer, and `.clinerules` gets the non-negotiable rules — all present from Sprint 1.

Most boxes on the checklist are unchecked early. That's expected. The plan and the current maturity level are *declared*. Same move as the [Control Panel](/part-5/control-panel) conventions: declare it up front, let the AI maintain it. The Phase column on the checklist is the "indicator of when" — human or AI can see at a glance what's deliberately deferred versus actually missing.

The deploy script wiring — the **generate → upload → strip → package** ordering for source maps — lives in the deployment chapter. See [Deployment & Platform Targets](/part-5/deployment-platforms) for the deploy-script template and the ordering guarantee that makes source-map upload work.

::: tip Start with the deploy script
If you only do one thing from this chapter, add the source-map upload step to your deploy script. It's the single irreversible item that costs 15 minutes now and saves hours later. Everything else can wait.
:::
