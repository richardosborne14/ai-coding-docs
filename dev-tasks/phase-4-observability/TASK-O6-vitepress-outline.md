# O6: VitePress Sidebar + COMPLETE_OUTLINE Update

**Status:** BACKLOG
**Sprint:** Phase 3
**Priority:** P2
**Est. effort:** 10 min
**Dependencies:** O1 (chapter file must exist)

---

## Context

The new Observability chapter needs to appear in the Part V sidebar in `docs/.vitepress/config.ts`, and `COMPLETE_OUTLINE.md` needs to record it as written. Same mechanical step as the control-panel chapter's D5 task.

---

## What to Change

In `docs/.vitepress/config.ts`, find the Part V: Advanced Topics sidebar section and add the new entry. After the change it should look like:

```typescript
{
  text: 'Part V: Advanced Topics',
  collapsed: true,
  items: [
    { text: 'Context Management', link: '/part-5/context-management' },
    { text: 'Common Pitfalls', link: '/part-5/pitfalls-recovery' },
    { text: 'Team Workflows', link: '/part-5/team-workflows' },
    { text: 'The Project Control Panel', link: '/part-5/control-panel' },
    { text: 'Observability & Error Tracking', link: '/part-5/observability' },  // ← NEW
    { text: 'Deployment & Platform Targets', link: '/part-5/deployment-platforms' },
  ]
},
```

Place it after the Control Panel entry. If the live ordering differs from the above (e.g. Deployment sits elsewhere), keep Observability adjacent to the Control Panel chapter since they share the "declare conventions up front" philosophy.

Also update `COMPLETE_OUTLINE.md`: add the Observability chapter to the Part V section with a ✅ status.

---

## Files to Modify

- `docs/.vitepress/config.ts` — add sidebar entry
- `COMPLETE_OUTLINE.md` — add chapter to Part V with ✅

---

## Acceptance Criteria

- [ ] "Observability & Error Tracking" appears in the Part V sidebar
- [ ] It sits next to "The Project Control Panel"
- [ ] Clicking it navigates to `/part-5/observability`
- [ ] The site builds without errors after the change
- [ ] `COMPLETE_OUTLINE.md` reflects the new chapter

## Notes

Verify the exact current contents of the Part V `items` array before editing — don't assume the snippet above matches the live file line-for-line. Add the one entry; don't reorder the rest.
