---
title: Accessibility by Default
description: AI writes inaccessible code by default — here's how to change the default
---

# Accessibility by Default

::: warning Opinionated by design
Accessibility is not a polish task and it is not a settings page. It's a property of what your tooling emits. The rules below are defaults for every project with a UI. Override them if you have a reason, but the burden of proof is on the override.
:::

## TLDR

Ask an AI for a button and you'll get `<div onClick>`. Not because the model doesn't know better — it does — but because nothing in your loop ever asks. Accessibility is the one quality dimension that produces **no feedback signal at all**: a missing `alt` doesn't fail a type check, doesn't fail a test, doesn't throw, doesn't change a screenshot, and doesn't look wrong. Both humans and agents optimise hard against checkable signals, so it gets skipped every time.

The fix is three moves, all cheap, all in Sprint 1: put the rules where the AI actually reads them, install a linter that turns the invisible into a warning, and do one 10-minute manual pass per phase. The European Accessibility Act has applied since 28 June 2025, so for a lot of projects this stopped being optional.

---

## Why AI Writes Inaccessible Code

Three mechanisms. Only one is about anyone not caring, and it's the least important.

**1. The training data is the broken web.** WebAIM scans the top million home pages every year. Detectable WCAG failures turn up on roughly 95% of them, and that number has barely moved in five years. Every model that writes front-end code learned from that corpus and reproduces its median. The median is `<div onClick>`.

**2. Accessibility is invisible to every signal you have.** Your type checker, your tests, your smoke test, your screenshot — none of them can see it. Everything else in this guide works by giving the AI a checkable target. This is the one area where you have to *build* the target first.

**3. `<div onClick>` is a genuine local optimum.** Fewer characters, no user-agent styling to reset, works perfectly in the demo, matches every framework tutorial ever written. It only fails for someone who isn't in the room.

Being right costs more than being wrong at the moment of writing — exactly the shape of problem your rules file exists to absorb on your behalf.

The encouraging half: a 2025 ACM Web4All study found that accessibility-oriented prompting materially improves WCAG compliance in LLM-generated UIs. The knowledge is present in the model. Nothing in the loop asks for it. That's a seam, and seams are cheap to close.

---

## Defaults Over Documentation

The test for every rule in this chapter: **does a task that never mentions accessibility still produce the right result?**

If the accessible thing only happens when you remember to ask, you haven't shipped it. You'll remember on the first three components and never again. So it goes in `.clinerules` / `CLAUDE.md`, where it's read before every task, not in a doc you open once.

Same pattern as [i18n in the Frontend Tweaker](/part-5/frontend-tweaker): one rule, and the AI does it automatically forever without you thinking about it.

One rule set, both authors — the agent is held to exactly what you'd expect of a human developer on this codebase.

---

## Make It Checkable

You cannot rely on review for something a reviewer can't see. Convert it into a signal.

**Sprint 1 — the linter.** Install the a11y linter for your stack and treat its output like any other linter warning (the rules file already says don't ignore linter warnings — this makes that rule mean something):

| Stack | Tool |
|-------|------|
| React / Next | `eslint-plugin-jsx-a11y` |
| Svelte / SvelteKit | Built into the compiler — a11y warnings are on by default. **Do not silence them.** |
| Vue | `eslint-plugin-vuejs-accessibility` |
| Angular | Built into the template compiler + `@angular-eslint` |

**Sprint 1 — axe-core in the test run.** One test per route, ~5 lines each with `@axe-core/playwright` or `jest-axe`. This is the highest-leverage thing in the chapter: it turns "did anyone check?" into a red build.

**Warnings, not blockers — with an opt-in gate.** Let violations fail loudly in CI but don't block local development. A check nobody can ship past gets disabled; a check that never blocks anything gets ignored. Warning-by-default with a `--strict` flag on the release build survives both failure modes.

---

## The Number at the Point of Decision

The single highest-value piece of tooling here is a contrast ratio shown **while you're picking the colour**, not in a report afterwards.

You already have the place to put it. [`design-tokens.css`](/part-5/frontend-tweaker) is where every colour in the app is defined, so it's where the check belongs — annotate the pairs that must pass and let the tweaker panel (or a 20-line test) compute them:

```css
/* @contrast --text-primary on --bg-surface | min: 4.5 */
/* @contrast --btn-primary-text on --btn-primary-bg | min: 4.5 */
/* @contrast --border-default on --bg-surface | min: 3 */
```

A linter that runs afterwards asks you to undo a decision you've already committed to emotionally. A number visible during the decision changes the decision itself, silently, for people who have never heard of WCAG.

---

## What Automated Tooling Cannot See

Automated tools catch a minority of WCAG failures — commonly cited at around a third. They are structurally blind to the ones that matter most: whether a name is *meaningful*, whether the reading order makes sense, whether alt text is *right* rather than merely present.

So: never describe an app as "accessible" on the strength of a green axe run. The honest phrasing is "no detected issues."

**The 10-minute manual pass, once per phase** (add it to your [phase audit](/part-4/phase-audits)):

1. Unplug the mouse. Tab through the main flow. Can you complete it? Can you always *see* where you are?
2. Zoom to 200%. Does anything overlap, clip, or scroll horizontally?
3. Turn on the built-in screen reader (VoiceOver: `Cmd+F5`. Narrator: `Ctrl+Win+Enter`). Navigate one page. Are the buttons announced as buttons, with names that mean something?

That's it. Three checks, no training required, catches most of what axe can't.

::: danger Never use an accessibility overlay
Overlay widgets — the ones that promise instant compliance from one script tag — are widely opposed by disabled users, don't achieve compliance, and directly contradict everything above. Don't ship one, don't recommend one, don't let an AI install one.
:::

---

## The .clinerules Additions

Add these. They're non-negotiable defaults for any project with a UI:

1. Interactive elements MUST be real elements — `<button>`, `<a href>`, `<input>`. Never a `<div>` or `<span>` with a click handler.
2. Never remove focus indicators. `outline: none` requires a `:focus-visible` replacement in the same change.
3. Every image needs `alt` — descriptive if meaningful, `alt=""` if decorative. Every input needs an associated `<label>`.
4. Semantic structure by default: one `<h1>` per page, no skipped heading levels, landmark elements (`<main>`, `<nav>`, `<header>`) over `<div>`.
5. Never colour alone as an information carrier — pair it with text, an icon, or a shape.
6. Client-side route changes must move focus to the new page heading and announce it.
7. Target size ≥ 24×24px for anything clickable (WCAG 2.5.8).
8. Respect `prefers-reduced-motion` on every animation and transition.
9. A visible button's text must match its accessible name (WCAG 2.5.3 — voice control depends on it).
10. Run the a11y linter and axe tests before declaring any UI task complete. Report the result in the confidence score.

Rule 10 is the one that makes the other nine real.

---

## Quick Reference

| Move | When | Cost |
|------|------|------|
| a11y linter installed, warnings not silenced | Sprint 1 | 10 minutes |
| Accessibility rules in `.clinerules` / `CLAUDE.md` | Sprint 1 | Copy-paste |
| `@contrast` annotations in `design-tokens.css` | Sprint 1 | 10 minutes |
| axe-core test per route | Sprint 1–2 | ~5 lines per route |
| Keyboard + zoom + screen-reader pass | Every phase audit | 10 minutes |
| CI gate flipped to blocking | Before launch | One flag |

**Target: WCAG 2.2 Level AA.** It's the level every regulation references. AAA isn't a coherent whole-product target — don't claim it.

**The argument that wins when the others don't:** every fix here is used constantly by people who aren't disabled and don't notice. Focus rings help anyone who tabs. Captions are used overwhelmingly by hearing people. Contrast is what makes a phone readable outdoors. You are building for bright sunlight, one free hand, a broken wrist, and a noisy train — which is to say, for all of your users, some of the time.

---

**Next:** [The Frontend Tweaker](/part-5/frontend-tweaker) — Baking editability into your frontend.
