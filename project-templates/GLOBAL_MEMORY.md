# Global Memory

Your identity card for Cline. Referenced by every project's `.clinerules`.
Keep this file short — half a page maximum. Only things that should influence **every session across every project**.

Deeper preferences, detailed learnings, and project-specific history live in the MCP global database — queryable on demand but not loaded every session.

**Location:** `~/.cline/GLOBAL_MEMORY.md`

---

## User Preferences

<!-- How you like to work. Cline adapts its communication and workflow to match. -->

- Communication style: [e.g., Direct, no fluff. Skip the preamble.]
- Plan mode: [e.g., Always use Plan mode before Act mode. No exceptions.]
- Time estimates: [e.g., Never estimate how long tasks will take.]
- Explanation depth: [e.g., I'm a CTO, not a junior dev. Skip basic explanations.]
- Framework preferences: [e.g., Prefer SvelteKit for web projects, Drizzle for ORM.]
- Approval style: [e.g., Auto-approve stays OFF. I review every command.]

## Universal Rules

<!-- Rules that apply to EVERY project regardless of stack or scope. -->

- LEARNINGS.md entries must pass the 30-minute test before being added.
- Hard stop after 3 failed attempts on the same bug — report, don't retry.
- Every session must be logged to project memory via MCP.
- Check project memory for prior solutions before debugging from scratch.
- If 2+ sessions fail on the same area, suggest a self-audit before continuing.
- Never start serious development without a task document.

## Global Gotchas

<!-- Learnings from past projects that apply everywhere. Keep only the critical ones here — detailed global learnings go in the MCP global database. -->

- [e.g., SvelteKit 500 errors: always check the server terminal, not the browser.]
- [e.g., Docker deploys: always run `docker image prune -f` after pulling new images.]
- [e.g., Never trust "container started" as proof of successful deploy — check build-info SHA.]
- [e.g., AI time estimates are wildly inaccurate — omit them from all plans and task docs.]
