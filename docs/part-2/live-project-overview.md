---
title: The Live Project Overview
description: A generated folder that tells Claude, and you, what the app actually contains right now
---

# The Live Project Overview

## TLDR

`ARCHITECTURE.md` says what you *planned*. The `overview/` folder says what's *actually there*: the entities, routes and automations in the code right now.

It's a set of small generated Markdown files (`stack.md`, `entities.md`, `routes.md`, `automations.md`, plus dated decision notes), committed to the repo. One Node script keeps them current. Claude reads only the file the task needs instead of one huge doc. And someone who isn't technical can open `entities.md` and understand the app in a minute.

I build it in the first phase, like the [control panel](/part-5/control-panel). Regenerating it is free: it's a local script, no AI involved.

---

## Why generated, and why a folder

Docs written by hand fall behind. You add a column, change a route, wire up a webhook, and `ARCHITECTURE.md` doesn't hear about it. A good CLAUDE.md with "keep the docs up to date" in it helps a lot. A generated overview means you don't have to rely on it.

I tried two other ways first. **Diagrams** looked great in the README and were out of date within a week. **One big `OVERVIEW.md`** stayed current for a while, then grew to 2,000 lines that Claude read in full on every task. That's the "docs too long" problem from [Documentation Architecture](/part-2/documentation-architecture) all over again.

Two principles fix it:

1. **Generate from the code.** Read `package.json` for the stack, `domain.config.js` for entities, `src/routes/` for routes. The code is the truth. If the script and the code disagree, the code wins and the script shows it.
2. **Split into small files.** Adding a route? Claude reads `routes.md`. Adding a column? `entities.md`. Neither? Just the one-page `README.md`.

It works alongside `ARCHITECTURE.md`, which still holds the intent and the reasons behind the design.

---

## The folder

```
overview/                     ← generated, committed
├── README.md                 ← one page: what the app is + recent decisions
├── stack.md                  ← from package.json + deployment.json
├── entities.md               ← from domain.config.js / the database
├── routes.md                 ← from a scan of src/routes/ + one-line descriptions
├── automations.md            ← from flow-registry.js
├── decisions/                ← short dated notes, one per non-obvious call
│   ├── 2026-04-12-svelte-flow-for-flows.md
│   └── 2026-04-18-cache-headers-default.md
└── DRIFT.md                  ← only exists when the code and ARCHITECTURE.md disagree
```

**`README.md`** is the only file Claude reads on every task. One page: what the app is, a few counts (entities, routes, automations), the last three decisions and a link to each other file.

**`stack.md`** lists frameworks, services and hosting, from `package.json` (with versions) and `deployment.json`. Claude reads it when adding a dependency, chasing a version bug or deploying.

**`entities.md`** lists every kind of data the app stores, with a plain-English description, the key fields and what it links to. It comes from `domain.config.js`, optionally checked against the live database. Claude reads it when adding fields, writing queries or building forms.

**`routes.md`** lists every URL the app has, each with a one-line description taken from a comment at the top of the route file.

**`automations.md`** lists every webhook, scheduled job and pipeline, with what triggers it and what it does. It uses the same `flow-registry.js` as the [control panel](/part-5/control-panel).

**`decisions/`** holds three-to-five-line notes: what changed, why, what else was considered. Claude adds one whenever it makes a call that isn't obvious.

**`DRIFT.md`** only appears when the script finds the code contradicting `ARCHITECTURE.md`. If it's there, stop and sort it out before anything else.

---

## The script

One Node script, `pnpm generate:overview`. It reads:

- `package.json` for the stack and versions
- `deployment.json` for services and hosting
- `domain.config.js` for entities
- `src/routes/` for routes and their descriptions
- `src/lib/config/flow-registry.js` (if there is one) for automations
- optionally, the live database schema, to cross-check `domain.config.js`

Run it whenever you like, and always as the last step of a task before committing.

Here's the part that writes `entities.md`:

```javascript
// scripts/generate-overview.js (excerpt)
import fs from 'node:fs';
import domain from '../domain.config.js';

const lines = [
  '# Entities',
  '',
  '> Generated from `domain.config.js`. Edit there, regenerate here.',
  '',
  '## Summary',
  '',
  '| Entity | What it is | Key fields | Related to |',
  '|---|---|---|---|',
];

for (const e of domain.entities) {
  const fieldNames = e.fields.slice(0, 3).map(f => f.name).join(', ');
  const related = (e.relationships ?? []).join('; ') || '-';
  lines.push(`| ${e.name} | ${e.description} | ${fieldNames} | ${related} |`);
}

fs.mkdirSync('overview', { recursive: true });
fs.writeFileSync('overview/entities.md', lines.join('\n') + '\n');
console.log(`✓ entities.md (${domain.entities.length} entities)`);
```

That's the whole idea: read the source, turn it into a table with a plain-English column, write the file. Each output is 30 to 50 lines of code. No libraries, no templates, no AI. The full script is usually under 200 lines.

---

## What to add to CLAUDE.md

The script only works if a few habits stick. Put them in CLAUDE.md as rules:

- **Read `overview/README.md` at the start of every task.** It's one page.
- **Read other `overview/*.md` files only when the task touches them.** Adding a route means `routes.md`. Don't read them all.
- **Update `domain.config.js` whenever entities change.** A new field, a new link, a new entity: change it there as well as in the code.
- **Give every new route file a one-line description comment.** The script builds `routes.md` from them.
- **Add a note to `overview/decisions/` for any non-obvious call.** Name it `YYYY-MM-DD-short-slug.md`. Three lines: what changed, why, what else you considered.
- **Run `pnpm generate:overview` before committing,** and commit the result.
- **If `overview/DRIFT.md` exists, read it before doing anything else.**

The exact wording is in the [project templates](/part-6/templates).

---

## When to build it

In the first phase of any project with a backend or a real data model. The empty files and the script come with the project scaffolding, like the [control panel](/part-5/control-panel) and the [cache-header rules](/part-5/deployment-platforms).

The first phase usually wires up entities and routes. Automations and decisions fill in as they appear. An empty `automations.md` is fine: the script skips anything it has no source for.

**What it costs:** one task to build the script. After that, nothing. It runs locally, and Claude reading a one-page README at the start of a task is barely noticeable against your [limits](/part-0/plans-and-limits).

**What it saves:** explaining the app to Claude at the start of every task, and bugs where Claude trusts an out-of-date description of an entity.

---

## What non-technical people see

Open `overview/entities.md` and you get something like this:

```markdown
# Entities

## Summary

| Entity | What it is | Key fields | Related to |
|---|---|---|---|
| Member | A person who has signed up. Members register for events, complete courses, receive newsletters. | id, email, name | Registrations; Enrolments |
| Event | A workshop or talk a member can register for. Has a date, location, and capacity. | id, title, starts_at | Registrations; Speakers |
| Course | A multi-week programme a member can enrol in. Tracks progress per module. | id, title, modules | Enrolments |
```

A consultant in for a week, you coming back after three months, a client asking what the system does: they all open this one file and get the shape of the app in a minute. No code, no diagrams, no jargon. Just the things the business cares about, in its own words.

The control panel does this for what's happening at runtime. The overview folder does it for what the app is made of.

::: tip Changes show up in the diff
Because `overview/` is committed, every change to entities, routes or automations shows up next to the code change that caused it. If the code changed and the overview didn't, either the script wasn't run or something else is wrong.
:::

---

**Next:** [The Execution Workflow](/part-3/execution-workflow)
