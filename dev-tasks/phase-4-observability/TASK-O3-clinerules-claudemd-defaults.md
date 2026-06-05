# O3: Observability Defaults in `.clinerules` + `CLAUDE.md`

**Status:** BACKLOG
**Sprint:** Phase 3
**Priority:** P0
**Est. effort:** 45 min
**Dependencies:** None

---

## Context

The maturity model only helps if new projects actually wire the Foundation plumbing in Sprint 1 without anyone remembering to ask. That means it has to be a non-negotiable default in `.clinerules` (the living project memory) and surfaced in `CLAUDE.md` (the planning brief). This is the "put up or shut up" pattern — conventions baked in from Sprint 1, not optional suggestions.

The rule has to be precise about the *irreversible* items, because those are the ones that can't be fixed after the fact.

---

## What to Add

### 1. `.clinerules` template

Add this block to the `.clinerules` template (the project-templates copy, and reference it in the docs that describe `.clinerules`):

```markdown
## Observability (Sprint 1 defaults — non-negotiable)

These are Foundation-phase items. Wire them in Sprint 1 even for a prototype.
You do NOT need to build dashboards or alerts yet — only the plumbing.

1. **Enable error capture** in the existing analytics SDK. For PostHog, set
   `capture_exceptions` in `posthog.init(...)`. Do not add a second error vendor
   (Sentry) unless ARCHITECTURE.md explicitly calls for a self-hosted tracker.

2. **Source maps are IRREVERSIBLE.** The deploy script MUST upload source maps to
   the error tracker at build time. A production error from a build whose maps were
   never uploaded cannot be de-minified later. Never skip this to "do it at launch."

3. **Release/version tagging is IRREVERSIBLE.** Every deploy MUST record a release
   identifier (version + commit SHA, plus build number for mobile). You cannot tag
   an error against a release that was never recorded.

4. **Split environments.** Tag every event with dev/staging/prod. Never let prod and
   dev errors land in the same bucket.

5. **Do NOT use Prometheus/Grafana for application-error alerting.** That is infra
   monitoring — a different axis. Application errors and alerts live in the error
   tracker. Infra/uptime monitoring, if any, is a separate, later concern.

6. **When an error fires, investigate before guessing.** Use the error tracker's
   grouped issue (PostHog MCP server) to read the real stack trace. Do not invent
   a cause from the minified message.

7. **Update the Observability table in ARCHITECTURE.md** whenever you wire one of
   these items.
```

### 2. `CLAUDE.md` template

Add a short pointer in the planning brief so it surfaces during design, not just execution. Reproduce verbatim:

```markdown
## Observability

This project tracks errors in [PostHog | other]. Observability is a maturity model:
wire the Foundation plumbing (error capture, source-map upload, release tagging,
environment split) in Sprint 1 — these are cheap and the source-map/release items
are irreversible if skipped. Defer alerting, replay-linking, and infra monitoring
until there are real users. See ARCHITECTURE.md → Observability for the current
level, and Part V → Observability in the methodology guide for the full reasoning.
```

---

## Files to Modify

- `project-templates/.clinerules` (or wherever the canonical `.clinerules` template lives) — add the Observability block
- `project-templates/CLAUDE.md` — add the Observability pointer
- The docs page(s) that document `.clinerules` and `CLAUDE.md` contents — mention the new block exists (search the repo for where `.clinerules` structure is described, likely in Part II Documentation Architecture or Part III)

---

## Acceptance Criteria

- [ ] `.clinerules` template has the Observability block with all 7 rules
- [ ] Source maps and release tagging are both explicitly marked IRREVERSIBLE
- [ ] The block explicitly forbids Prometheus/Grafana for application-error alerting
- [ ] The block tells the AI to investigate via the error tracker before guessing a cause
- [ ] `CLAUDE.md` template has the Observability pointer cross-referencing ARCHITECTURE.md and the Part V chapter
- [ ] The relevant docs page notes these additions
- [ ] Wording matches the existing `.clinerules` voice (imperative, terse, rule-style)

## Notes

Keep the `.clinerules` block terse and imperative — it's read on every task, so it costs tokens. The reasoning belongs in the chapter (O1); `.clinerules` just states the rule.
