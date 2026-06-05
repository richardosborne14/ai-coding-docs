# Sprint: Add Observability to the AI Coding Docs

**Sprint:** Phase 3
**Goal:** Add error-tracking / observability as a first-class topic in the guide, framed as a *maturity model* — what must be wired into the foundation (irreversible if missing), versus what can be deferred. Bake the irreversible plumbing into the project templates and `.clinerules` as Sprint 1 defaults.

---

## Why this sprint exists

A recent client app reached production launch with eight observability gaps. Most of them don't matter while prototyping — but two of them (source maps and release tagging) have to exist *before* the builds you'll later need to debug. Defer them to "when we go to production" and you're already too late: a minified production stack trace from a build whose source maps were never captured is permanently undebuggable.

The guide currently says nothing about this. New projects built from the templates inherit the same trap. This sprint fixes that.

## The core principle the sprint teaches

**Separate the plumbing from the dashboard.** The plumbing (SDK init, source-map upload, release tagging, environment split) is cheap to set up, reversible, and irreversible if *missing*. The dashboard (actually watching errors, alerting, tuning) is optional attention you can defer. Wire the plumbing in Sprint 1; defer the attention until you have users.

## Key technical stance (decided in planning)

- **PostHog is the consolidation, not a new vendor.** Projects in this methodology already run PostHog for session replay. PostHog now has a full error-tracking product (autocapture, source maps, issue grouping, release/build tagging, Slack/Discord/webhook alerts, replay-linked errors, and an MCP server for AI-assisted debugging). Recommend switching it on rather than adding Sentry. GlitchTip is the fallback only if a client needs a self-hosted specialist.
- **Two separate axes — do not conflate them.** *Application error tracking* (exceptions, stack traces, grouping) = PostHog. *Infrastructure / uptime monitoring* (CPU, memory, latency, is-the-container-up) = Prometheus/Grafana, or a simpler uptime pinger. Error alerting lives on the first axis, not the second. Prometheus/Grafana is a later-stage, separate concern and is overkill for a solo/small-team Hetzner app.
- **iOS / native crash reporting is conditional**, gated behind the existing Capacitor mobile decision — not a "Foundation" item for web-only apps.
- **Don't over-engineer AI-generated alert conditions.** Error alerting has three standard shapes (new issue, count threshold, post-release regression). Point the AI at *investigating* fired alerts (via the PostHog MCP server), not at authoring the conditions.

---

## Tasks

| ID | Title | Priority | Effort | Depends on |
|----|-------|----------|--------|-----------|
| O1 | New chapter: `docs/part-5/observability.md` | P0 | half day | None |
| O2 | Add Observability section to `ARCHITECTURE.md` template | P1 | 30 min | None |
| O3 | Observability defaults in `.clinerules` + `CLAUDE.md` | P0 | 45 min | None |
| O4 | Source-map upload + release tagging in deploy script template | P0 | 45 min | None |
| O5 | Case study: the 8-gap production launch | P2 | 20 min | O1 |
| O6 | VitePress sidebar + `COMPLETE_OUTLINE.md` update | P2 | 10 min | O1 |

## Dependency graph

```
O1 ──┬── O5
     └── O6
O2  (independent)
O3  (independent)
O4  (independent)
```

O1, O2, O3, O4 can all run in parallel. O5 and O6 wait on O1 (they reference the chapter).

## Suggested order

1. **O1** first — it's the source of truth the others cross-reference.
2. **O2 / O3 / O4** in parallel after (or alongside) O1 — these are the "make it actually happen in new projects" tasks.
3. **O5 / O6** last — they link to the finished chapter.

## Acceptance for the whole sprint

- [ ] A reader can find, from the foundation docs alone, *when* each observability concern should be addressed (Foundation / Early / Launch / Scale).
- [ ] A new project built from the templates has the irreversible plumbing (source maps + release tagging + environment split) wired in Sprint 1 by default, without anyone remembering to ask for it.
- [ ] The guide is honest that most of this is skippable while prototyping, and explicit about the two items that aren't.
