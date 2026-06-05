# O2: Add Observability Section to the ARCHITECTURE.md Template

**Status:** BACKLOG
**Sprint:** Phase 3
**Priority:** P1
**Est. effort:** 30 min
**Dependencies:** None

---

## Context

`project-templates/ARCHITECTURE.md` is what new projects copy to document their system design. It needs an Observability section so every new project declares its error-tracking plan and current maturity level from the start — even when most of it is deferred. The phase column is the "indicator of when" each item should be addressed.

This mirrors the Control Panel section added in Phase 1 (`if applicable`, table-driven, AI-maintained).

---

## What to Add

Add a new section at the end of `project-templates/ARCHITECTURE.md`, after the Control Panel section. Reproduce verbatim:

```markdown
## Observability & Error Tracking

> Declare the plan from Sprint 1. Most boxes stay unchecked early — that's expected.
> The Phase column tells you (and the AI) when each item should be addressed.
> The two items marked **irreversible** must be wired before the builds you'll later need to debug.

**Error tracker:** [PostHog | GlitchTip (self-hosted) | other] — [project URL]
**Current maturity level:** [Foundation | Early | Pre-launch | Scale]

| Item | Phase | Status | Irreversible if missing |
|------|-------|--------|------------------------|
| SDK error capture enabled | Foundation | [ ] | — |
| Source-map upload wired into deploy | Foundation | [ ] | **Yes** |
| Release / version tagging at deploy | Foundation | [ ] | **Yes** |
| Environment split (dev/staging/prod) | Foundation | [ ] | — |
| Alerting → Slack/webhook | Early | [ ] | — |
| User/session/breadcrumb context | Early | [ ] | — |
| Session replay linked to errors | Pre-launch | [ ] | — |
| Issue grouping tuned | Pre-launch | [ ] | — |
| Native crash reporting (Capacitor only) | Conditional | [ ] | — |
| Infra/uptime monitoring (separate axis) | Pre-launch / Scale | [ ] | — |

### Two axes — keep separate
- **Application errors** (exceptions, stack traces, grouping, error alerting): [error tracker]
- **Infrastructure / uptime** (CPU, memory, latency, container health): [uptime pinger | Prometheus+Grafana if at scale]

### AI rule
Update this table's Status column whenever an observability item is wired. When an error fires in production, investigate it via the error tracker (PostHog MCP server) before guessing.
```

---

## Files to Modify

- `project-templates/ARCHITECTURE.md` — add the section above
- `docs/part-6/templates.md` — in the "ARCHITECTURE.md (Key Sections)" block, add a line noting the Observability section exists and is `if applicable`

---

## Acceptance Criteria

- [ ] ARCHITECTURE.md template has an "Observability & Error Tracking" section
- [ ] The maturity table is present with the Phase column and the "Irreversible if missing" column
- [ ] Source-map upload and release tagging are both flagged irreversible
- [ ] The two-axes note is present
- [ ] Native crash reporting row is marked Capacitor-only / Conditional
- [ ] `docs/part-6/templates.md` mentions the new section
- [ ] Placeholders use `[bracket]` syntax consistent with the rest of the template

## Notes

This is a template, not a live doc — leave everything as unchecked placeholders. The `.clinerules`/`CLAUDE.md` defaults (O4 wiring, O3 rules) are what make a new project actually check the Foundation boxes in Sprint 1.
