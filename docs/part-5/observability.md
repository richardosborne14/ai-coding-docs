---
title: Observability & Error Tracking
description: Wire in the plumbing you can't add later (source maps, release tags) in Sprint 1. Leave the dashboard until you have users.
---

# Observability & Error Tracking

## TLDR

**Split the plumbing from the dashboard.** The plumbing is error capture in the SDK, source-map upload, release tagging and an environment split. It's cheap to set up and safe to ignore for weeks, but you can't add it after the fact. The dashboard (watching errors, setting alerts, tuning grouping) is attention you can put off until you have real users.

A client app reached production with eight observability gaps. Six were fixable in an afternoon. Two of them, source maps and release tagging, couldn't be fixed after the fact, because the old builds never captured what was needed. Every production error from those builds stayed minified gibberish for good.

Wire the plumbing in Sprint 1 and put off the attention. That's the chapter.

---

## The Trap

Every item on the observability list feels like a "production concern", so the instinct is to leave all of them until launch. That's right for six of the eight. For two it's fatal.

- **Source maps** must be uploaded at build time. A production error points at minified code: `a.b.c is not a function at vm:1:12345`. The only way to read it is the source map from *that exact build*. If the map was never uploaded, you can't debug that error. Ever.

- **Release tagging** must be recorded at deploy time. To answer "did this error start after v1.1.69?", v1.1.69 has to have been tagged when it went out. If it wasn't, you get one long timeline of errors and no way to line them up with deploys.

Setting up the plumbing is cheap and you can always rip it out. Not having it can't be undone, because you can't create data that was never captured. That's why these two go in the foundation even though you won't open the dashboard for weeks.

---

## The Eight Gaps, Reframed

The obvious reading was eight separate projects. It isn't.

| # | Gap | Solved by | Phase |
|---|-----|-----------|-------|
| 1 | No source maps (minified stack traces) | Error tracker plus source-map upload at build | **Foundation** |
| 2 | No grouping (1k users, 1k log lines) | Error tracker groups by exception type, message and stack | Foundation (automatic) |
| 5 | No release tagging | Release/version recorded at deploy | **Foundation** |
| 7 | No environment split (dev and prod mixed) | Environment tag in SDK init | **Foundation** |
| 6 | No user/session/breadcrumb context | Captured automatically once the SDK is in | Early |
| 4 | No alerting | Error-tracker alert to Slack or a webhook | Early |
| 8 | No session-replay link | PostHog replay tied to the error | Pre-launch |
| 3 | No native iOS crash reporting | Native SDK layer, **only for a Capacitor build** | Conditional |

Look at the "Solved by" column. Gaps 1, 2, 5, 6, 7 and 8 are all features of one error-tracking product. Gap 4 is that product's alerting. Gap 3 only matters if you ship to mobile.

So it's one job: switch on the error tracker and wire two things into the build. The table is ordered by *when* each item matters, not by how the client first listed them.

---

## Use the Tool You Already Have

Projects that follow this guide already run **PostHog** for session replay, and PostHog now has full error tracking. Switch it on. Don't add a second vendor.

What PostHog covers today (check the exact APIs in the [PostHog error-tracking docs](https://posthog.com/docs/error-tracking) before writing integration code):

- **Autocapture of unhandled errors** and promise rejections in the browser SDKs. Basic coverage needs no manual code.
- **Source-map upload** for readable stack traces, via `posthog-cli sourcemap upload` or the Next.js/Nuxt configs. The CLI flags change, so check them.
- **Issue grouping** by exception type, message and stack trace. Automatic and tunable.
- **Release tracking** with version numbers and commit SHAs, linked to GitHub or GitLab.
- **Alerts** on new issue types, error-count thresholds and post-release regressions, into Slack, Discord, Teams or a webhook.
- **Session replay tied to each error.** Click from the error to the user's recording.
- **An MCP server**, so Claude Code can investigate a grouped issue with the full stack trace, breadcrumbs and session.

That last one is why it fits this method. An error fires, PostHog groups it with the real stack trace, Claude investigates through the MCP server, you get a task and you fix it. Claude reads the actual error in context, with the user's session, instead of guessing from a minified trace.

**Fallback:** if a client needs a self-hosted error tracker on their own servers, use **GlitchTip** (Sentry-compatible, light, open source). Don't add it by default. A second vendor doubles the integration work and rarely buys you anything.

---

## Errors vs. Infrastructure: Two Axes

People lump two separate things together as "monitoring":

- **Application error tracking:** single exceptions, stack traces, grouping, "this broke for 1,000 users". Tool: PostHog or another error tracker. *Error alerts live here.*
- **Infrastructure and uptime monitoring:** CPU, memory, latency, whether the container is even up. Tool: Prometheus and Grafana, or a simple uptime pinger.

Keep them apart.

Pointing Prometheus at application errors is the wrong tool. You'd ship error *counts* as metrics and throw away every stack trace, breadcrumb and user context. For "tell me when a new error appears" or "alert me when errors spike after a release", use the error tracker's own alert and a Slack webhook. No infrastructure to stand up.

Prometheus and Grafana earn their place later, for infrastructure health. For a solo or small-team app on Hetzner they're usually overkill. A simple uptime monitor ([Uptime Kuma](https://github.com/louislam/uptime-kuma) self-hosted, or any hosted checker) covers "is it up?" until you have real scale.

**Don't over-engineer alert rules.** Error alerts come in three standard shapes:

1. A new issue type appeared.
2. The error count passed a threshold in a time window.
3. Something regressed after a release.

These are config toggles, so Claude adds little by writing them. Point Claude at *investigating* alerts that fire (through the PostHog MCP server), not at writing the conditions.

---

## The Maturity Ladder

This is when each thing happens. It tells you (and Claude) what's deliberately deferred and what's actually missing.

### Foundation: Sprint 1 (yes, even in a throwaway prototype)
- Turn on error capture in the SDK you already have (PostHog: `capture_exceptions`).
- Wire source-map upload and release tagging into the deploy script.
- Tag the environment (dev, staging, prod) so they never mix.
- Cost: about 15 minutes, and almost nothing after. You do NOT have to look at the dashboard.
- Why now: this is the plumbing you can't add later. It makes every error from day one readable.

The second bullet is the reason this chapter exists. The rest can wait until you're ready.

### Early: first real users
- Turn on alerts: new issue and error spike, into Slack.
- From here on you stop hearing about bugs from user complaints.
- User, session and breadcrumb context arrive on their own once the SDK is in.

You still don't need to watch the dashboard. Let the alerts come to you, and when one fires, investigate it in the error tracker instead of guessing.

### Pre-launch
- Check that session replay is linked to errors.
- Tune issue grouping if it's noisy.
- For a Capacitor mobile build, add the native crash layer and build-number tagging.
- Add a basic uptime check (the infra axis, not errors).

This is when you start *using* the dashboard. The plumbing has been collecting data since Sprint 1, and now it pays off.

### Scale: only if warranted
- Prometheus and Grafana for infra metrics, if you have infra worth watching.
- Event sampling and quota management.
- Error budgets.

Most projects never get here, and that's fine. The foundation plumbing was the move that mattered.

---

## Where It Lives in the Foundation Docs

This isn't a runbook you write at launch. It's an **Observability section in the foundation docs**, there from Sprint 1. `ARCHITECTURE.md` holds a maturity checklist, and `CLAUDE.md` holds the non-negotiable rules plus a pointer to that checklist.

What to add to CLAUDE.md:

1. Never disable source maps in the production build. The deploy script uploads them, then strips them.
2. Every deploy records a release (version plus commit SHA) with the error tracker.
3. The SDK init always sets the environment tag. Dev and prod errors never mix.
4. Keep the Observability checklist in `ARCHITECTURE.md` current. Tick items when they're done and leave deferred ones unticked, with their phase.

Most boxes are unticked early on. That's expected. The plan and the current level are *written down*, the same move as the [Control Panel](/part-5/control-panel) conventions. The Phase column shows at a glance what's deferred on purpose and what's missing.

The deploy-script wiring (the **generate, upload, strip, package** order for source maps) lives in [Deployment & Platform Targets](/part-5/deployment-platforms), with the template.

::: tip Start with the deploy script
If you only do one thing from this chapter, add the source-map upload step to your deploy script. It's the one item you can't fix later, it takes 15 minutes, and it saves hours. The rest can wait.
:::
