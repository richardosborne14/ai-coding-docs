---
title: The Project Control Panel
description: A local admin page that shows you what your AI-built backend is doing. Four tabs, six convention files, built in Sprint 1.
---

# The Project Control Panel

## TLDR

An AI-built backend is a black box. The data schema, the automation flows and the deploy status are all in the code, and you can't see any of them unless you know where to look.

The control panel fixes that. It's a localhost admin page with four tabs: Deployment, Data, Automations and Security. Each tab reads a convention file that Claude keeps up to date. Build it in Sprint 1.

I built one for OpsNest in Sprint 3 as an experiment. It caught three bugs in the first hour after deployment. One was code that had never been deployed. One was a set of invented environment variable names that passed review and failed at runtime. The last was missing type narrowing in the security checks.

Build it once, keep the conventions in CLAUDE.md, and the project stays visible for its whole life.

---

## The Problem

People who come from n8n, Directus, Pocketbase or Bubble are used to seeing their backend. They click around, inspect data, watch automations run and check what's deployed. It's all in the UI.

When Claude writes your backend, that view disappears. The same things exist, but they live in files, environment variables and terminal logs. If you don't know how to look, you're flying blind.

Four questions come up on every backend project:

- "Is my app actually running?" → Deployment Centre
- "What data did Claude create?" → Data Browser
- "What are the automations doing?" → Automation Visualiser
- "Is this thing secure? How do I test it?" → Security & Testing

The control panel answers all four from a browser tab.

---

## The Four Tabs

### Deployment Centre

Convention: a `deployment.json` at the project root. It lists every service with its URL, health endpoint and deploy method.

```json
{
  "services": [
    { "name": "SvelteKit", "url": "http://localhost:5173", "health": "/api/health", "deploy": "git push + pm2 restart" },
    { "name": "Directus", "url": "http://localhost:8055", "health": "/server/health", "deploy": "docker compose up -d" }
  ]
}
```

The dashboard pings each health endpoint and shows green, amber or red. The rule for Claude: update `deployment.json` whenever a service changes.

**What it caught in OpsNest:** the Sprint 3 code had never been deployed. The new `/api/health` endpoint returned 404 on the live server because the build was stale. Without the dashboard I'd have found out when a user hit the new feature.

### Data Browser

Convention: the page reads your database schema and shows tables and rows. Option sets (the things Bubble calls "options") live as `static-data/*.json` files.

```
static-data/
  membership-tiers.json
  event-categories.json
  notification-types.json
```

The rule for Claude: check `static-data/` before creating a dropdown in code. If the file exists, use it. If it doesn't, create it and check with you before inventing values.

The data browser carries a permanent banner: "Schema changes go through Claude Code, not here." Browse and edit data freely. Schema changes stay in code.

### Automation Visualiser

Convention: every backend automation gets a `@flow` JSDoc annotation, an entry in `flow-registry.js`, and `flowLog()` calls at each step.

```javascript
/**
 * @flow
 * @name ac-webhook-sync
 * @trigger POST /api/webhooks/activecampaign
 * @steps validate → find-member → update-directus → send-confirmation
 */
export async function handleACWebhook(event) {
  flowLog('validate', { contactId: event.contact_id });
  // ...
}
```

The visualiser draws the registry as a step diagram and lays the live logs on top: green for success, red for error, grey for not reached. Click any run to see where it failed.

A technology note. For simple linear flows, plain CSS step diagrams beat Svelte Flow or React Flow. They're simpler, need no dependency, and Claude makes fewer mistakes with them. Reach for a flow library only when you need expandable data panels inside the nodes.

### Security & Testing

Two tools in one tab.

**Security runner:** automated checks written as functions. It scans for hardcoded secrets and checks auth guards, cookie settings and error leakage. You run it from the browser, not CI. It catches runtime config problems that static analysis misses.

**User journey testing:** `USER_JOURNEYS.json` defines step-by-step test flows. The dashboard shows them as pass/fail checklists. A failed step produces a bug report you can paste straight into Claude Code, with the context already filled in.

The rule for Claude: add a journey to `USER_JOURNEYS.json` after every user-facing feature.

**What it caught in OpsNest:** Claude had used `DIRECTUS_URL` instead of `VITE_DIRECTUS_URL` all through the monitoring code. Both names look right and both follow the conventions. Only one exists in `.env`. The code passed review and would have failed silently at runtime. See [Documentation Architecture](/part-2/documentation-architecture) for why grounding Claude in real files matters.

---

## The Conventions

These are the files the control panel needs. Claude maintains all of them.

| File | Purpose | Rule for Claude |
|------|---------|-----------------|
| `deployment.json` | Service registry with health endpoints | Update when services change |
| `static-data/*.json` | Option sets for forms and dropdowns | Check before creating dropdowns |
| `src/lib/config/flow-registry.js` | Automation flow declarations | Add an entry for every new flow |
| `USER_JOURNEYS.json` | Interactive test checklists | Append after every feature |
| `src/lib/utils/flowLog.js` | Step logging utility | Call at each automation step |
| `src/lib/utils/securityChecks.js` | Security check functions | Add checks for new patterns |

---

## What to add to CLAUDE.md

These rules came out of OpsNest Sprint 3. Paste them into your project's `CLAUDE.md`:

1. Every automation MUST have a `@flow` annotation, a registry entry and `flowLog()` calls.
2. `flowLog()` NEVER logs passwords, tokens, API keys or raw JWTs.
3. `flowLog()` NEVER crashes the flow it's logging. Always wrap it in try/catch.
4. After any user-facing feature, add a journey to `USER_JOURNEYS.json`.
5. Before writing an env var name in any monitoring or check code, read `.env.example`. Never invent names from conventions.

Rule 5 matters most. It stops a whole class of plausible mistakes: names that look right and follow the conventions but don't exist.

---

## When to Build It

**Minimum (2 to 3 hours):** the Deployment Centre and the security runner. Those two catch the worst problems: stale deploys and runtime config failures. Worth it even on simple projects.

**Full panel (a 1 to 2 day sprint):** all four tabs. Do this for any backend that non-technical people will run, or that you'll maintain after the first build.

Projects with no backend (static sites, client-only apps) don't need it.

Build it in Sprint 1, once the basic backend runs. Later still works, but by then you'll have shipped bugs it would have caught. See [The Execution Workflow](/part-3/execution-workflow) for where it fits in a sprint.

---

## What OpsNest Taught Me

1. **The panel caught bugs that code review missed.** Three in the first hour: a stale deploy, invented env vars and missing type narrowing. Reading the code found none of them.

2. **Plain CSS step diagrams beat Svelte Flow** for linear flows. Svelte Flow only earns its place when you need data panels inside the nodes.

3. **Write the learnings down during the task.** Each task had an "observations for docs" section, and the details faded fast when I left it until later. Fill it in while the code is in front of you.

4. **`flow-registry.js` became the most-read file in the project.** The visualiser used it, and so did every new Claude session wanting to know which automations exist.

5. **The single biggest rule:** always check env var names against `.env.example`. One line in `CLAUDE.md` stops a whole category of silent failure.

See [Phase Audits](/part-4/phase-audits) for using the security runner's output as audit evidence.

::: tip Start with deployment.json
If you only do one thing from this chapter, add a `deployment.json` to the project root and a `/api/health` endpoint. The next time a deploy doesn't take, you'll know in five seconds instead of thirty minutes.
:::

For the frontend version (tweaking styles, text, links and SEO without asking Claude), see [The Frontend Tweaker](/part-5/frontend-tweaker).
