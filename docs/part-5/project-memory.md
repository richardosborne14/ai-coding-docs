---
title: Project Memory & Self-Improvement
description: Give Cline long-term memory across sessions, across projects, and the ability to improve its own instructions
---

# Project Memory & Self-Improvement

## TLDR

Cline has amnesia. Every session starts from zero. The only continuity is whatever markdown files it reads at the top — and those files either bloat into uselessness or stay too slim to help.

This chapter introduces a **tiered memory architecture** — hot, warm, and cold — that gives Cline persistent memory across sessions and across projects, keeps your dev-docs folder manageable, and creates a self-improvement loop where Cline audits its own failures and updates its own rules.

The system uses markdown for always-loaded essentials, an MCP-backed database for queryable session history and solutions, and a document lifecycle that archives completed work instead of letting it pile up forever. The more you use it, the smarter Cline gets.

---

## The Problem: Three Kinds of Amnesia

### 1. Session Amnesia

You spend 45 minutes debugging a CORS issue on the webhook endpoint. Cline finds the fix: a missing `Access-Control-Allow-Origin` header in the API route. Session ends.

Three weeks later, you hit a CORS issue on a different endpoint. New session. Cline has no idea you've solved this before. It starts from scratch, tries the same wrong approaches, and takes another 45 minutes.

**The fix existed in your project's history. Cline just couldn't access it.**

### 2. The Groundhog Day Bug

You've had three sessions trying to fix the same authentication bug. Each session, Cline tries similar approaches, hits similar walls, and the conversation ends with a partial fix or a workaround. There's no connection between sessions saying: *"We've been here before. Three times. Maybe the problem isn't the code — maybe it's the architecture, or maybe it's these `.clinerules` that are guiding me down the wrong path."*

Cline never suggests auditing its own instructions. It just keeps following them into the same wall.

### 3. The Stranger Problem

Session 1 and session 100 treat you identically. Cline doesn't know you prefer SvelteKit, that you hate verbose explanations, that you always want Plan mode first, that your projects tend to use Drizzle over Prisma. Every project starts cold. Every `.clinerules` file is written from scratch. Nothing carries over.

---

## The Memory Architecture: Hot / Warm / Cold

Not all project knowledge needs to be in front of Cline at all times. Right now, everything is either "in a markdown file Cline reads every session" (expensive, noisy) or "lost forever" (no continuity). The fix is layers:

| Layer | What Lives Here | Where It's Stored | When Cline Reads It |
|-------|----------------|-------------------|-------------------|
| **🔴 Hot** | Rules, architecture, active gotchas, user identity | Markdown files in repo + `GLOBAL_MEMORY.md` | **Every session, automatically** |
| **🟡 Warm** | Session history, solutions, patterns, user preferences | MCP-backed database (SQLite or Postgres) | **On demand**, when Cline hits a problem or wants context |
| **🟢 Cold** | Completed task docs, old sprint plans, archived sessions | MCP-backed database (archived tables) | **Rarely**, only when explicitly searching deep history |

### Why This Matters

**Hot memory** is what Cline reads at the start of every session. It must be small, focused, and current. If it's too big, every session wastes tokens loading stale information. If it's too small, Cline lacks critical context.

**Warm memory** is the game-changer. It's the "have we seen this before?" layer. Cline doesn't load it automatically — it *queries* it when relevant. Hit a bug? Search for similar errors. Starting a new auth task? Check for auth-related solutions from previous sessions.

**Cold memory** is your archive. Completed sprint docs, old task specs, session summaries from months ago. You don't need them cluttering the repo, but they're there if you need to dig something up.

---

## Hot Memory: What Stays as Markdown

These files are loaded every session. They must earn their place.

| File | Purpose | Stays Hot Because |
|------|---------|-------------------|
| `.clinerules` / `CLAUDE.md` | Quality rules, development workflow | Rules apply to every task |
| `ARCHITECTURE.md` | System design, schemas, patterns | Every code change needs architectural context |
| `README.md` | Project scope, current phase, tech stack | Every session needs project context |
| `LEARNINGS.md` | **Active** gotchas and solutions | Prevents known mistakes from recurring |
| `GLOBAL_MEMORY.md` | User preferences, universal rules | Personalises every session across every project |
| Current sprint plan | Active task index and dependencies | Guides what to work on next |
| Current task specs | The tasks being worked on right now | Direct execution context |

**Everything else has a lifecycle.** It starts hot (markdown in the repo), serves its purpose, then moves to warm/cold storage in the database. The repo stays clean.

---

## LEARNINGS.md Discipline

This is the file that bloats fastest and becomes useless quickest. Cline loves adding entries. "I learned that `npm install` installs packages!" Great, thanks.

### The Litmus Test

Before adding an entry to LEARNINGS.md, apply this test:

> **"Would a fresh Cline session hitting this same problem waste 30+ minutes without this entry?"**

If yes → it belongs in LEARNINGS.md.
If no → it belongs in the warm database (session log) or nowhere.

### What DOES Belong (Active Gotchas)

```markdown
## 2026-05-15: SvelteKit 500 errors show generic message in browser

**Problem:** Frontend shows "Internal Error" with no useful information.
**Solution:** Check the SERVER terminal output — the real error is there.
**Apply to:** Any SvelteKit debugging — always check server terminal first.
```

```markdown
## 2026-05-18: Drizzle migration silently uses old schema

**Problem:** Changed schema in code, ran migration, but queries still use old column names.
**Solution:** After migration, ALWAYS run the seed script. Also delete `.drizzle/` cache.
**Apply to:** Any schema change — migration alone is not enough.
```

These are **traps**. Without these entries, Cline will walk into the same trap again. They save real time.

### What DOESN'T Belong (Database Fodder)

- ❌ "Learned that React uses JSX syntax" — general knowledge, not a gotcha
- ❌ "Successfully implemented login endpoint" — that's a task completion note, not a learning
- ❌ "Used bcrypt with cost factor 12" — that's an architectural decision, belongs in ARCHITECTURE.md
- ❌ "The user prefers dark mode in VS Code" — that's a user preference, belongs in GLOBAL_MEMORY.md
- ❌ "Fixed the button alignment on the dashboard" — that's a session note, belongs in warm memory

### Graduation Rule

When a LEARNINGS.md entry is no longer an active trap — maybe the underlying issue was fixed architecturally, or the pattern was absorbed into `.clinerules` as a rule — it **graduates** out of LEARNINGS.md and into the warm database. LEARNINGS.md should never exceed ~30 entries. If it's longer, it's time to graduate resolved entries.

**The `.clinerules` rule:**
```markdown
### LEARNINGS.md Hygiene
- Apply the 30-minute test: would a fresh session waste 30+ minutes without this entry?
- Maximum 30 active entries. If approaching the limit, suggest graduating resolved entries.
- Do NOT add general observations, progress updates, or architectural decisions.
- If an entry is about a pattern that should become a permanent rule, suggest adding it to .clinerules instead.
```

---

## The MCP Memory Server

The warm and cold layers are powered by an MCP server that Cline accesses naturally through tool calls. No raw SQL, no terminal noise — just clean tool invocations.

### What It Does

The memory server exposes tools in three categories:

**Session tracking:**
- `memory_store_session` — log what happened (summary, outcome, files touched, errors)
- `memory_query_sessions` — search recent sessions by tag, area, or outcome
- `memory_check_patterns` — "am I repeating a failure?" (self-audit trigger)

**Solutions and learnings:**
- `memory_store_solution` — log a problem/solution pair with tags
- `memory_query_solutions` — search for solutions matching current problem (full-text search)
- `memory_global_store` — save a learning that applies to ALL projects
- `memory_global_query` — search global learnings by tag or category

**Lifecycle management:**
- `memory_archive_sprint` — move completed sprint docs to cold storage
- `memory_archive_docs` — move specific completed docs to cold storage
- `memory_graduation_check` — which LEARNINGS.md entries should move to warm?
- `memory_export_summary` — generate a clean markdown summary for Claude Chat audits

**User preferences:**
- `memory_user_preferences` — read/write preferences about the user
- `memory_suggest_rules` — based on accumulated learnings, suggest `.clinerules` improvements

### Storage Backend

**Default: SQLite with FTS5** — zero dependencies, zero infrastructure, works everywhere.

The MCP server creates two databases:
- `~/.cline/global_memory.db` — cross-project learnings and user preferences
- `.cline/memory.db` — per-project session history and solutions (gitignored)

**SQLite FTS5** (full-text search) is built into SQLite — no extra setup. It handles "find sessions where we dealt with authentication errors" surprisingly well because your project vocabulary is small and domain-specific.

**Advanced option: Postgres + pgvector** — for semantic search. Same MCP tools, different backend. Configure `MEMORY_BACKEND=postgres` in the MCP server config. This adds vector embeddings via a local model (e.g., `nomic-embed-text` via Ollama) so you can search by *meaning*, not just keywords. "Find sessions similar to what I'm dealing with right now" becomes a cosine similarity query.

The choice is a configuration detail, not a project decision. SQLite is the default and handles 95% of cases. Postgres is there for power users who want semantic search across large, long-running projects.

### Schema (SQLite Default)

```sql
-- What happened in each session
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    project TEXT,                -- project name/path
    task_ref TEXT,               -- "task-2.3" or "ad-hoc: fix login bug"
    summary TEXT,                -- 2-3 sentence summary
    outcome TEXT,                -- 'completed', 'partial', 'failed', 'abandoned'
    files_touched TEXT,          -- JSON array of file paths
    errors_encountered TEXT,     -- JSON array of error descriptions
    approaches_tried TEXT,       -- JSON array of what was attempted
    learnings TEXT,              -- anything worth remembering
    confidence_score INTEGER,    -- 1-10
    tags TEXT                    -- JSON array: ['auth', 'database', 'css']
);

-- Specific problems and their solutions (the real gold)
CREATE TABLE solutions (
    id INTEGER PRIMARY KEY,
    session_id INTEGER REFERENCES sessions(id),
    problem TEXT,            -- what went wrong
    solution TEXT,           -- what fixed it
    root_cause TEXT,         -- why it happened
    tags TEXT,               -- JSON array for searchability
    reusable BOOLEAN         -- would this help future sessions?
);

-- Full-text search on solutions
CREATE VIRTUAL TABLE solutions_fts USING fts5(
    problem, solution, root_cause, tags,
    content='solutions',
    content_rowid='id'
);

-- Self-audit trail
CREATE TABLE self_audits (
    id INTEGER PRIMARY KEY,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trigger_reason TEXT,     -- "3 sessions on same area", "repeated failure pattern"
    findings TEXT,           -- what was found
    changes_made TEXT,       -- what rules/docs were updated
    effective BOOLEAN        -- did it help? (filled in later)
);
```

**Global database** (`~/.cline/global_memory.db`) adds:

```sql
-- Learnings that apply across all projects
CREATE TABLE global_learnings (
    id INTEGER PRIMARY KEY,
    project_origin TEXT,     -- which project discovered this
    category TEXT,           -- 'framework', 'tool', 'pattern', 'gotcha', 'preference'
    content TEXT,
    tags TEXT,               -- JSON array: ['sveltekit', 'deployment', 'docker']
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences with confidence
CREATE TABLE user_preferences (
    key TEXT PRIMARY KEY,
    value TEXT,
    confidence REAL,         -- 0.0-1.0
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## How Cline Uses Memory

### Session Start Protocol

Add this to `.clinerules`:

```markdown
### Session Start Protocol
1. Read hot files: .clinerules, ARCHITECTURE.md, README.md, LEARNINGS.md
2. Read GLOBAL_MEMORY.md for user preferences and universal rules
3. Call memory_check_patterns to see if current task area has recent failures
4. Call memory_query_solutions with current task tags for relevant prior solutions
5. If memory_check_patterns returns 2+ failures in same area:
   → STOP. Suggest a self-audit before proceeding.
   → The problem may be in the instructions, not the code.
```

**What this looks like in practice:**

**You say:**
```
Can we please plan task 3.2 — the webhook integration?
```

**Cline does (internally):**
1. Reads `.clinerules`, `ARCHITECTURE.md`, `README.md`, `LEARNINGS.md`
2. Reads `GLOBAL_MEMORY.md`
3. Calls `memory_check_patterns({ area: "webhooks" })` → returns: "1 previous session on webhooks, outcome: completed"
4. Calls `memory_query_solutions({ tags: ["webhooks", "api"] })` → returns: "Previous webhook task needed CORS headers on the endpoint"
5. Incorporates this into the plan

**Cline responds:**
```
I see from our project memory that the last webhook task required adding 
CORS headers to the API endpoint. I'll include that in the plan from the 
start. Here's the approach...
```

No more rediscovering the same issues.

### During Debugging

```markdown
### When Stuck on a Bug
Before attempting a 3rd approach:
1. Call memory_query_solutions with the error message or description
2. If a prior solution exists → try it first
3. If no prior solution exists → continue debugging
4. After 3 failed attempts → call memory_check_patterns
5. If pattern shows repeated failures → suggest self-audit
```

### Session End Protocol

```markdown
### Session End Protocol
1. Call memory_store_session with:
   - Task reference (or "ad-hoc: [description]" for spontaneous work)
   - Summary of what happened
   - Outcome (completed/partial/failed)
   - Files touched
   - Errors encountered
   - Approaches tried
2. If any reusable solutions were discovered → call memory_store_solution
3. If the session discovered something that applies to ALL projects 
   → call memory_global_store
4. If a LEARNINGS.md entry was resolved by this session 
   → suggest graduating it to warm storage
```

**The key insight:** Ad-hoc sessions — "just fix this bug" without a task doc — are now captured. Previously, these were invisible. The session log creates continuity even for spontaneous work.

---

## The Document Lifecycle

This is how dev-docs stop bloating.

### How Documents Flow

```
Task doc created (markdown in dev-docs/ → HOT)
    ↓
Task executed by Cline, session data stored (→ WARM)
    ↓
Task completed → confidence score logged
    ↓
Key gotchas → LEARNINGS.md (HOT, if they pass the 30-min test)
Solutions → MCP database (WARM)
    ↓
Sprint completed → sprint plan + task docs archived
    ↓
memory_archive_sprint called:
  - Task docs → database (COLD)
  - Sprint summary generated → database (WARM)
  - Markdown files deleted or moved to .archive/
    ↓
Phase audit:
  - Claude Chat gets clean repo (only active sprint materials)
  - Auditor can query memory_export_summary for historical context
    ↓
Project complete:
  - Global learnings promoted to global database
  - Project-specific learnings stay in project database
```

### What This Means for Your Dev-Docs Folder

**Before (current pain):**
```
dev-docs/
├── sprints/
│   ├── sprint-01/
│   │   ├── SPRINT-PLAN.md
│   │   ├── TASK-1.1.md
│   │   ├── TASK-1.2.md
│   │   ├── TASK-1.3.md
│   │   ├── ...
│   │   └── TASK-1.12.md      ← 12 files, never referenced again
│   ├── sprint-02/
│   │   ├── SPRINT-PLAN.md
│   │   ├── TASK-2.1.md
│   │   ├── ...
│   │   └── TASK-2.10.md      ← 10 more stale files
│   └── sprint-03/            ← now 30+ task docs, repo is bloated
└── ...
```

**After (with lifecycle management):**
```
dev-docs/
└── sprints/
    └── sprint-03/            ← ONLY the active sprint
        ├── SPRINT-PLAN.md
        ├── TASK-3.1.md
        └── TASK-3.2.md       ← the task you're currently working on

.cline/
└── memory.db                 ← everything from sprints 1-2 is here, queryable
```

When you need to sync with Claude Chat for a phase audit, you're syncing a clean repo with 5-10 active files — not 40 stale task docs.

### Claude Chat Audit Integration

The `memory_export_summary` tool generates a clean markdown summary of any sprint or phase:

```
Export sprint 2 summary for Claude Chat audit
```

Returns something like:
```markdown
## Sprint 2 Summary (auto-generated from project memory)

### Sessions: 14 total (12 completed, 1 partial, 1 failed)

### Key Decisions:
- Switched from JWT to session cookies (session #8, rationale: simpler for MVP)
- Added rate limiting after load test revealed bottleneck (session #11)

### Solutions Discovered:
- SvelteKit form actions need `use:enhance` for progressive enhancement
- Drizzle ORM requires explicit `.returning()` for INSERT to get the new row

### Failed Approaches:
- Tried WebSocket for real-time updates, fell back to polling (too complex for MVP)

### Files Most Touched: src/routes/api/*, src/lib/server/db/*
```

Paste this into Claude Chat along with the current codebase — the auditor gets full context without the bloat.

---

## Global Memory: The Cross-Project Layer

Two tiers, matching the hot/warm pattern:

### GLOBAL_MEMORY.md (Hot — Always Loaded)

Lives at `~/.cline/GLOBAL_MEMORY.md` (or wherever you configure it). Referenced in every project's `.clinerules`:

```markdown
Read ~/.cline/GLOBAL_MEMORY.md for user preferences and universal rules.
```

This file is your **identity card** for Cline. It stays short — half a page maximum. Only the things that should influence *every single session* across *every project*:

```markdown
# Global Memory

## User Preferences
- Communication style: Direct, no fluff. Skip the preamble.
- Always use Plan mode before Act mode. No exceptions.
- Never estimate how long tasks will take.
- Prefer SvelteKit for web projects, Drizzle for ORM.
- I'm a CTO, not a junior dev. Skip basic explanations.

## Universal Rules
- LEARNINGS.md entries must pass the 30-minute test.
- Hard stop after 3 failed attempts on the same bug.
- Every session must be logged to project memory.
- Check project memory for prior solutions before debugging from scratch.
- If 2+ sessions fail on the same area, suggest a self-audit.

## Global Gotchas
- SvelteKit 500 errors: always check the server terminal, not the browser.
- Docker deploys: always run `docker image prune -f` after pulling new images.
- Never trust "container started" as proof of successful deploy.
```

### Global Database (Warm — MCP Queryable)

The richer, deeper knowledge that's available *if Cline needs it*:

- "On Project X we discovered that Hetzner VPS needs a Docker cleanup cron job"
- "SvelteKit cache-control headers must be set in hooks.server.ts — learned on OpsNest"
- "User prefers Drizzle over Prisma" (confidence: 0.85)
- "Monorepo projects with shared types: always build the shared package first"

Cline queries this when context is relevant:

```
Starting a SvelteKit project → memory_global_query({ tags: ['sveltekit'] })
→ Returns 5 learnings from previous SvelteKit projects
→ Cline incorporates them into the plan before you hit any of those issues
```

The more projects you complete, the richer the global database gets. Every project benefits from accumulated wisdom.

---

## The Self-Improvement Loop

This is what turns Cline from "follows instructions" into "improves its own instructions."

### The Trigger

```markdown
### Self-Audit Triggers
If memory_check_patterns shows ANY of these, suggest a self-audit:
1. 2+ sessions failed in the same code area
2. Same error appeared in 3+ sessions
3. A solution was applied but the problem recurred
4. User expressed frustration with repeated issues
```

### What a Self-Audit Looks Like

**Cline detects the pattern:**
```
I've checked project memory and found that we've had 3 sessions 
working on authentication issues, with 2 of them ending in partial 
fixes. This suggests the problem might not be in the code — it 
might be in our approach or our rules.

I'd like to suggest a self-audit before we continue. I'll review:
1. .clinerules — are any rules causing me to approach this wrong?
2. ARCHITECTURE.md — is the auth architecture sound?
3. LEARNINGS.md — are there entries I'm not applying correctly?
4. Previous session solutions — did a fix get reverted or overwritten?

Shall I proceed with the audit?
```

**After the audit:**
```
## Self-Audit Results

### Finding 1: .clinerules says "use JWT tokens" but the architecture 
has moved to session cookies. The rules are contradicting the current code.
→ Recommendation: Update .clinerules to reflect session-based auth.

### Finding 2: LEARNINGS.md has an entry about cookie SameSite settings 
that I haven't been applying. This is likely the recurring issue.
→ Recommendation: Apply the SameSite fix and verify.

### Finding 3: Previous sessions tried fixing the symptom (401 errors) 
without addressing the root cause (cookie not being sent cross-origin).
→ Recommendation: Fix the CORS + cookie configuration, not the auth logic.

Shall I update .clinerules and proceed with the root cause fix?
```

### The Audit Trail

Every self-audit is logged to the database:

```sql
INSERT INTO self_audits (trigger_reason, findings, changes_made)
VALUES (
    '3 sessions on authentication with 2 failures',
    'Rules contradicted architecture, LEARNINGS entry not applied',
    'Updated .clinerules auth section, applied SameSite cookie fix'
);
```

Later, the `effective` field gets updated based on whether the problem recurred. Over time, this creates a record of which self-corrections actually worked.

---

## Advanced: Semantic Search with Postgres + pgvector

For users running Docker who want deeper search capabilities.

### The Upgrade

Same MCP tools, different storage backend. Configure once:

```json
{
  "memory_backend": "postgres",
  "postgres_url": "postgresql://localhost:5432/cline_memory",
  "embedding_model": "nomic-embed-text",
  "embedding_provider": "ollama"
}
```

### What It Adds

**Vector embeddings** of session summaries and solutions. Instead of keyword matching, you get semantic search:

```sql
-- "Find sessions similar to what I'm dealing with right now"
SELECT s.summary, s.outcome, sol.solution,
       se.embedding <=> $current_embedding AS distance
FROM session_embeddings se
JOIN sessions s ON s.id = se.id
LEFT JOIN solutions sol ON sol.session_id = s.id
ORDER BY distance
LIMIT 5;
```

**Example:** You're debugging "webhook payload not arriving at the handler." Semantic search finds a session from 3 weeks ago about "API route not receiving POST body" — different words, same concept. The solution (missing `Content-Type` header) surfaces immediately.

### When It's Worth It

- Projects running longer than 3 months with 50+ sessions
- Teams where multiple people use Cline on the same project
- Complex codebases where keyword search misses conceptual matches
- You're already running Docker for the project anyway

For most projects, SQLite + FTS5 is more than enough. The semantic upgrade is there for power users, not as a requirement.

---

## Setting It Up

### Step 1: Install the MCP Memory Server

```bash
# Install globally
npm install -g @cline-memory/mcp-server

# Or add to your VS Code MCP configuration
```

The server creates `~/.cline/global_memory.db` on first run and `.cline/memory.db` in each project when first accessed.

### Step 2: Add `.cline/` to `.gitignore`

```
# Project memory (local only, not committed)
.cline/
```

### Step 3: Create `GLOBAL_MEMORY.md`

Create `~/.cline/GLOBAL_MEMORY.md` with your preferences. Start small — it grows as you use it:

```markdown
# Global Memory

## User Preferences
- [Your communication preferences]
- [Your framework preferences]
- [Your workflow preferences]

## Universal Rules
- [Rules that apply to every project]

## Global Gotchas
- [Things you've learned that apply everywhere]
```

### Step 4: Update `.clinerules`

Add the session start/end protocols and self-audit triggers documented in this chapter. See the [template](/part-6/templates) for the complete rules block.

### Step 5: Reference Global Memory in `.clinerules`

```markdown
## Before EVERY Task
Read these files first:
1. `ARCHITECTURE.md` — system design and schema
2. `README.md` — project scope and current phase
3. `LEARNINGS.md` — known gotchas and solutions
4. `~/.cline/GLOBAL_MEMORY.md` — user preferences and universal rules
5. Current sprint plan in `dev-docs/sprints/`

Then query project memory:
6. `memory_check_patterns` — any repeated failures in this area?
7. `memory_query_solutions` — any relevant prior solutions?
```

---

## Quick Reference

| What | Where | Hot/Warm/Cold | Loaded When |
|------|-------|---------------|-------------|
| Development rules | `.clinerules` | 🔴 Hot | Every session |
| System design | `ARCHITECTURE.md` | 🔴 Hot | Every session |
| Active gotchas | `LEARNINGS.md` (≤30 entries) | 🔴 Hot | Every session |
| User identity | `GLOBAL_MEMORY.md` | 🔴 Hot | Every session |
| Active task specs | `dev-docs/current-sprint/` | 🔴 Hot | Every session |
| Session history | MCP database | 🟡 Warm | On query |
| Solutions & patterns | MCP database | 🟡 Warm | On query |
| Global learnings | MCP database | 🟡 Warm | On query |
| User preferences (detailed) | MCP database | 🟡 Warm | On query |
| Archived task docs | MCP database | 🟢 Cold | Rare search |
| Old sprint plans | MCP database | 🟢 Cold | Rare search |

---

::: tip The Memory Flywheel
The more sessions you complete, the richer the memory database gets. The richer the database, the faster Cline solves problems. The faster it solves problems, the more sessions you complete. This is the flywheel that makes Cline genuinely improve over time — not through model updates, but through accumulated project intelligence.
:::

**Next:** [Common Pitfalls](/part-5/pitfalls-recovery) — What goes wrong and how to recover.
