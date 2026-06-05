# O5: Case Study — The Eight-Gap Production Launch

**Status:** BACKLOG
**Sprint:** Phase 3
**Priority:** P2
**Est. effort:** 20 min
**Dependencies:** O1 (chapter must exist to cross-reference)

---

## Context

`docs/part-6/case-studies.md` collects real project stories. The client app that triggered this sprint is a strong cautionary tale: it reached production launch before anyone noticed the observability gaps, and the source-map and release-tagging gaps couldn't be fixed retroactively. This grounds the Observability chapter in a real consequence, matching the OpsNest control-panel case study format.

---

## What to Add

Add a section to `docs/part-6/case-studies.md`, under 300 words, conversational voice matching the existing case studies. Cover:

- The setup: an app built fast for early testing, approaching production launch, when the client identified eight observability gaps.
- The honest framing: most of the eight didn't matter during prototyping — and that's exactly why they were never set up.
- The bite: two of them (source maps, release tagging) were the kind you can't fix after the fact. Stack traces from the builds already shipped were minified gibberish, and there was no way to say which release a bug started in.
- The fix going forward: switch on PostHog error tracking (already present for session replay), wire source-map upload + release tagging into the deploy script, split environments. ~15 minutes of plumbing that should have been Sprint 1.
- The lesson, stated as the principle: separate the plumbing from the dashboard; the plumbing is irreversible if missing.

Include a small numbers table in the same style as the OpsNest case study, e.g.:

```markdown
| Metric | Value |
|--------|-------|
| Observability gaps found at launch | 8 |
| Irreversible (couldn't be fixed retroactively) | 2 |
| Foundation plumbing setup cost (had it been Sprint 1) | ~15 min |
| Builds shipped with undebuggable stack traces | [fill from project] |
```

Cross-reference the Observability chapter (`/part-5/observability`).

---

## Files to Modify

- `docs/part-6/case-studies.md` — add the section above

---

## Acceptance Criteria

- [ ] Case study appears in the case studies page
- [ ] Under 300 words
- [ ] Names the two irreversible gaps (source maps, release tagging) specifically
- [ ] Makes the "most of it didn't matter while prototyping" point honestly
- [ ] Ends on the plumbing-vs-dashboard principle
- [ ] Includes the numbers table
- [ ] Cross-references the Observability chapter
- [ ] Conversational voice matching existing case studies

## Notes

Keep client details generic/anonymised unless Richard supplies specifics he's happy to publish. Leave `[fill from project]` placeholders where exact numbers aren't known.
