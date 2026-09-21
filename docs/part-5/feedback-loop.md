---
title: The In-App Feedback Loop
description: A dev-only hotkey that turns "this looks wrong" into a bug report Claude can act on, with text, priority, a screenshot and the app's state.
---

# The In-App Feedback Loop

## TLDR

While you use your half-built app, you spot things all the time: a dead button, a wrong heading, a layout that breaks on mobile. Describing each one to Claude is slow, and you always forget which page you were on and what data was loaded.

So bake a feedback hotkey into the app. Press a key and a modal pops up. You type what's wrong and rate it 1 to 5. On submit it grabs a screenshot and a JSON snapshot of everything Claude needs (route, device, browser, params, app state) and writes both to a gitignored `.feedback/` folder.

Then you tell Claude Code: *"Fix the highest-priority open feedback."* It reads the top item, looks at the screenshot, fixes it and marks it done. This is the dev-phase partner to [Observability](/part-5/observability). That page covers production errors. This one is you, filing tickets on your own app.

---

## The Problem

Reporting bugs by hand during development loses detail. You see something wrong, switch to Claude, and rebuild it from memory: "On the pricing page. No wait, the dashboard. The export button did nothing with the March filter on." Claude now has to guess the route, the state and what you saw.

Every missing detail costs a round trip. Claude asks which page, and you answer. It asks what data was loaded, and you answer again. Half the conversation rebuilds context that was on your screen when you hit the bug.

The feedback loop captures all of it at the source, with one keypress.

---

## How It Works

A dev-only overlay mounts on a global hotkey (say `Ctrl+Shift+F`). It shows a small modal with a text box, a 1 to 5 priority selector and a submit button.

On submit, it captures three things:

1. **A screenshot** of the current screen (through the browser's capture API or `html2canvas`).
2. **A context snapshot:** a JSON blob of everything Claude would otherwise have to ask for.
3. **Your text and priority.**

A tiny dev-only endpoint writes them to `.feedback/`. Each report is one JSON file plus its screenshot:

```
.feedback/
  2026-07-17T14-02-11-a3f.json
  2026-07-17T14-02-11-a3f.png
```

```json
{
  "id": "a3f",
  "timestamp": "2026-07-17T14:02:11Z",
  "priority": 5,
  "status": "open",
  "text": "Export button does nothing when the March filter is active.",
  "screenshot": "2026-07-17T14-02-11-a3f.png",
  "context": {
    "route": "/dashboard/reports",
    "device": "MacBook Pro, macOS 15.1",
    "browser": "Chrome 131",
    "viewport": "1512x900",
    "params": { "filter": "2026-03", "view": "table" },
    "state": { "userId": "u_28", "rowsLoaded": 0, "lastError": "422 /api/export" }
  }
}
```

The `context` block is the point. `rowsLoaded: 0` and `lastError: 422` tell Claude more than your sentence did. Put in whatever the app knows that would help: auth state, active feature flags, the last API call, form values. Never secrets or raw tokens (the same rule as `flowLog()` in [the control panel](/part-5/control-panel)).

::: warning Dev-only, always
Guard the whole thing behind a dev-mode check so it never mounts in production. It's a tool for you while you build, not a customer feedback widget. For real user feedback in production, use PostHog or Hotjar.
:::

---

## Feeding It to Claude

The payoff is the prompt. Instead of describing a bug, you say:

> Fix the highest-priority open feedback in `.feedback/`.

Claude reads the `.feedback/*.json` files and skips anything marked `"done"`. It sorts by priority (oldest first on a tie) and opens the top item. It reads the context and **looks at the screenshot**, and at that point it understands the bug better than most hand-written tickets would let it. It fixes the bug, flips `status` to `"done"` and adds a `resolution` note.

The screenshot matters more than you'd expect. "The layout breaks" is vague in text. In an image, Claude sees exactly which element overflowed. I send Claude more screenshots than ever, and this makes them automatic. Pair it with the [fix-and-debug prompt](/part-6/prompts): the feedback file *is* the bug report, so you skip writing one.

Because priority is built in, you triage by rating instead of re-reading everything. Rate the broken checkout 5 and the slightly-off padding 2, and "fix the highest-priority open feedback" always does the important thing first.

---

## The Admin Page (Optional)

Once you have more than a handful of reports, add a dev-only `/dev/feedback` page that reads the folder and lists:

- each report's text, priority and status
- a thumbnail of the screenshot
- a filter for open and resolved, sorted by priority

It's the same idea as the control panel: a convention folder plus a simple page that reads it. The value is seeing the whole backlog at once and spotting when five reports are really one bug.

---

## What to add to CLAUDE.md

Add these so Claude keeps the loop working instead of ignoring it:

1. Feedback reports live in `.feedback/` as `<timestamp>-<id>.json` plus a matching `.png`. The folder is gitignored.
2. When asked to fix feedback, pick the highest-`priority` item with `"status": "open"`. Break ties by oldest `timestamp`.
3. After fixing a report, set `"status": "done"` and add a one-line `"resolution"`. Never delete the file.
4. The feedback overlay and its write endpoint MUST sit behind a dev-mode check. Never ship them to production.
5. The context snapshot MUST NOT include passwords, tokens, API keys or raw JWTs.

Rule 3 keeps a history. Resolved reports become a running log of what broke and how it was fixed, which is handy later for [project memory](/part-5/project-memory) and phase audits.

---

## When to Build It

**Worth it for any app you'll use before it's finished**, which is nearly all of them. The capture part (hotkey, modal, write endpoint) is a 1 to 2 hour task. The admin page is another hour and can wait.

Build it in Sprint 1, straight after the control panel. The two are siblings. The control panel shows you what the *backend* is doing. The feedback loop captures what *you* see wrong in the frontend and hands it to Claude ready to fix.

Skip it only for throwaway prototypes you'll never click through yourself.

::: tip Start with capture, skip the admin page
The hotkey, the modal and the JSON-plus-screenshot write give you nearly all the benefit. "Fix the highest-priority open feedback" works on raw files in a folder. Add the admin page when the backlog is big enough to need one.
:::

---

**Next:** [Accessibility by Default](/part-5/accessibility): changing what Claude writes when nobody asks.
