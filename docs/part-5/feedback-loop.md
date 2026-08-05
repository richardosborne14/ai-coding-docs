---
title: The In-App Feedback Loop
description: A dev-only hotkey that turns "this looks wrong" into an AI-ready bug report — text, priority, screenshot, and full app state
---

# The In-App Feedback Loop

## TLDR

While using your half-built app, you spot things constantly — a broken button, a heading that's wrong, a layout that breaks on mobile. Describing each one back to your AI coder is slow, and you always forget which page you were on and what data was loaded.

Bake a feedback hotkey into the app. Press a key, a modal pops up, you type what's wrong and rate it 1–5. On submit it auto-captures a screenshot and a JSON snapshot of everything the AI needs — route, device, browser, params, current app state — and writes both to a gitignored `.feedback/` folder.

Then you tell Claude Code: *"Fix the highest-priority open feedback."* It reads the top item, looks at the screenshot, understands the context, fixes it, and marks it done. This is the dev-phase counterpart to [Observability](/part-5/observability) — that's production error tracking; this is you, ticketing your own app for the AI.

---

## The Problem

Manual bug reporting during development is lossy. You see something wrong, switch to Cline, and try to reconstruct it from memory: "On the pricing page — no wait, it was the dashboard — the export button did nothing when I had the March filter on." The AI now has to guess the route, the state, and what you actually saw.

Every missing detail is a round-trip. The AI asks which page, you answer. It asks what data was loaded, you answer. Half the conversation is rebuilding context that was on your screen the moment you hit the bug.

The feedback loop captures all of it at the source, the instant you notice, with one keypress.

---

## How It Works

A dev-only overlay component mounts on a global hotkey (say `Ctrl+Shift+F`). It renders a small modal: a textarea for the feedback, a 1–5 priority selector, and a submit button.

On submit, three things get captured automatically:

1. **A screenshot** of the current screen (via the browser's capture API or `html2canvas`).
2. **A context snapshot** — a JSON blob of everything the AI would otherwise have to ask for.
3. **Your text and priority.**

All three write to a gitignored `.feedback/` folder through a tiny dev-only endpoint. Each report is one JSON file plus its matching screenshot:

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

The `context` block is the whole point. `rowsLoaded: 0` and `lastError: 422` tell the AI more than your sentence did. Include whatever your app knows that would help diagnose the problem — auth state, active feature flags, the last API call, form values. Never include secrets or raw tokens (same rule as `flowLog()` in [the control panel](/part-5/control-panel)).

::: warning Dev-only, always
Guard the whole thing behind a dev-mode check so it never mounts in production. This is a vibe-coding tool for you, not a customer feedback widget. If you want real user feedback in production, that's PostHog or Hotjar — a different job.
:::

---

## Feeding It to the AI

The payoff is the prompt. Instead of describing a bug, you say:

> Fix the highest-priority open feedback in `.feedback/`.

The AI globs `.feedback/*.json`, filters out anything with `"status": "done"`, sorts by priority (then oldest first), and opens the top item. It reads the context, **looks at the screenshot**, and now understands the bug better than most hand-written tickets. It fixes it, then flips `status` to `"done"` and drops in a `resolution` note.

The screenshot matters more than you'd expect. "The layout breaks" is ambiguous in text; in an image the AI sees exactly which element overflowed. Pair this with the [fix-and-debug prompt](/part-6/prompts) workflow — the feedback file *is* the bug report, so you skip writing one.

Because priority is baked in, you triage by rating, not by re-reading everything. Rate the broken checkout 5 and the slightly-off padding 2, and "fix the highest-priority open feedback" always does the most important thing first.

---

## The Admin Page (Optional)

Once you have more than a handful of reports, add a dev-only page — `/dev/feedback` — that reads the folder and lists everything:

- Each report's text, priority, and open/done status
- A thumbnail of the screenshot
- A filter for open vs resolved, sorted by priority

It's the same idea as the control panel's tabs: a convention folder plus a simple page that reads it. No AI loop needed to build the listing — it's a directory read and a grid. The value is seeing your whole backlog at a glance and spotting when five separate reports are really the same underlying bug.

---

## The .clinerules Additions

Add these so the AI maintains the loop instead of ignoring it:

1. Feedback reports live in `.feedback/` as `<timestamp>-<id>.json` + matching `.png`; the folder is gitignored
2. When asked to fix feedback, select the highest-`priority` item with `"status": "open"`, breaking ties by oldest `timestamp`
3. After resolving a report, set `"status": "done"` and add a one-line `"resolution"` — never delete the file
4. The feedback overlay and its write endpoint MUST be guarded behind a dev-mode check — never ship them to production
5. The context snapshot MUST NOT include passwords, tokens, API keys, or raw JWTs

Rule 3 keeps a history. Resolved reports are a running log of what broke and how it was fixed — useful later for [project memory](/part-5/project-memory) and phase audits.

---

## When to Build It

**Worth it for any app you'll use before it's finished** — which is almost all of them. The capture piece (hotkey + modal + write endpoint) is a 1–2 hour task. The admin page is another hour and can wait until you have a backlog.

Build it in Sprint 1, right after the control panel. The two are siblings: the control panel shows you what the *backend* is doing; the feedback loop captures what *you* see wrong in the frontend and hands it to the AI ready to fix.

Skip it only for throwaway prototypes you'll never click through yourself.

::: tip Start with capture, skip the admin page
The hotkey, the modal, and the JSON-plus-screenshot write give you the entire benefit. "Fix the highest-priority open feedback" works against raw files in a folder — you don't need a UI to read them. Add the admin page later, when the backlog is big enough to need a view.
:::

---

**Next:** [Accessibility by Default](/part-5/accessibility) — changing what the AI emits when nobody asks.
