# Prompt: Generate Foundation Documents

> **When to use:** After the brainstorming conversation has converged on a clear MVP scope. Still in the same Claude Project conversation.

## Before You Prompt

**Sync the AI Coding Docs repo first.** Use the `+` icon on the chat input, select "GitHub", paste `https://github.com/Visual-Hive/ai-coding-docs`, and wait for the sync to finish (the send button will be disabled until the repo is synced). This gives Claude access to the project templates and methodology, so it generates docs that follow the structure rather than improvising.

You need to have the Claude GitHub integration set up first (Settings → Integrations → GitHub).

## The Prompt

```
Based on everything we've discussed, please create the foundational files for Cline and VSCode to get the prototype built using the AI Coding Docs repo in project files.

Generate all of the following:

1. **README.md** — Project overview, vision, current phase (MVP), tech stack with rationale, setup instructions, project structure
2. **ARCHITECTURE.md** — System design, database schema with all tables/columns/types/constraints, component architecture, API design, auth flow, deployment architecture, key technical decisions, and (if the project has a UI) the Accessibility section with its WCAG 2.2 AA target and Sprint 1 checklist
3. **LEARNINGS.md** — Empty template ready to be filled during development
4. **.clinerules** (for Cline) AND/OR **CLAUDE.md** (for Claude Code) — Iron-clad developer rules including:
   - Mandatory reading list before every task
   - Quality standards (unit tests mandatory, smoke tests after every change, browser testing for UI)
   - Development workflow rules (plan mode first, one task at a time, commit working code, ask questions when unclear, never start serious dev without a task doc)
   - Architecture rules (follow existing patterns, no unauthorized dependencies, use import aliases)
   - Accessibility conventions if the project has a UI (real elements not `<div onClick>`, never remove focus indicators without a `:focus-visible` replacement, alt on every image, labels on every input, semantic headings and landmarks, never colour alone, 4.5:1 contrast, 24×24px targets, `prefers-reduced-motion`, focus moves on client-side route change, a11y linter + axe-core before any UI task is complete, no overlay widgets) — copy the full section from the templates
   - Prohibited behaviors (no skipping tests, no scope creep, no untyped code, no installing deps without checking latest versions first)
   - Git & security hygiene (.gitignore from the start, no secrets in code, .env.example maintenance)
   - Dev/prod environment separation rules
   - Project Memory & Self-Improvement rules: LEARNINGS.md hygiene (30-minute test, max ~30 entries, graduation to database), session end protocol (log sessions via MCP memory server), self-audit triggers (2+ failures in same area → audit rules and docs, not just code), document lifecycle (archive completed sprints to cold storage)
   - Confidence scoring format (8/10 minimum)
   - When to ask the human
    - Tech-specific rules for our chosen stack (use the SvelteKit and Drizzle examples from the templates if applicable)
    - SvelteKit cache and staleness prevention (hooks.server.ts cache headers, nginx config, clean builds, service worker cleanup, build versioning)
5. **GLOBAL_MEMORY.md** — Cross-project user preferences and universal rules. This file lives at `~/.cline/GLOBAL_MEMORY.md` and is referenced by every project's .clinerules/CLAUDE.md. Include: user communication preferences, universal development rules, global gotchas from past experience. See the Project Memory & Self-Improvement chapter for the full architecture.
6. **SPRINT_RULES.md** — Rules for sizing sprints, writing tasks, handling discovered work, finishing tasks
7. **TASK_TEMPLATE.md** — Template for individual task specifications
8. **Sprint 1 Plan** — The initial sprint plan with task index, execution order, dependencies, and definition of done

Also generate any foundational code files that you know should exist from the start to avoid common mistakes — things like:
- Project config files (tsconfig, eslint, prettier, etc.)
- Database schema/migration files
- Environment variable templates (.env.example)
- Base layout or app shell components (with `<html lang>` set from the project locale, a skip link, and a single `<main>` landmark)
- `design-tokens.css` with `@tweak` annotations, `@contrast` pairs, focus-ring tokens, and the `prefers-reduced-motion` guard
- The a11y linter for the chosen stack, wired into the lint script
- Auth utility stubs
- Docker configuration (docker-compose.yml) if the project has a backend
- .gitignore covering all sensitive files
- Any other boilerplate that, if not set up correctly from the start, causes painful refactoring later

For the sprint plan, break the MVP into tasks that each take 30 minutes to half a day. Each task should have clear acceptance criteria. Order them by dependency so Cline/Claude Code can just start at task 1 and work through them sequentially.
```

## After Foundation Docs: Generate Task Specs

Once Claude has produced the foundation docs and sprint plan, ask it to generate the individual task files:

```
Now please generate the detailed task specifications for each task in the Sprint 1 plan. One file per task, with enough detail that Cline can read the task doc and start working without any clarifying questions.
```

This may take several turns depending on the number of tasks. If you hit your daily usage limit, a $5 USD top-up is typically enough to finish. It's worth the investment — detailed Opus-generated task docs mean Cline executes faster, cheaper, and with fewer errors.

## Important Notes

- **Sync the AI Coding Docs repo before prompting.** This is what makes Claude use the methodology's templates instead of inventing its own structure.
- Review every document Claude generates. Push back on anything that doesn't feel right.
- The `.clinerules` / `CLAUDE.md` file is the most critical — this is the "quality contract" that prevents sloppy AI output.
- Make sure the ARCHITECTURE.md has actual database schemas, not just descriptions. Column names, types, constraints.
- The sprint plan should be realistic. If Claude lists 20+ tasks for a 2-week sprint, push back.
- **Check the `.clinerules` filename** when you download — Claude sometimes creates it as `clinerules.md` by mistake. Rename to `.clinerules` (with dot prefix) and place in the project root.
