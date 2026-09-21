---
title: Accessibility by Default
description: Claude writes inaccessible code by default. Here's how to change the default with CLAUDE.md rules, a linter and a 10-minute check.
---

# Accessibility by Default

::: warning Opinionated by design
Accessibility isn't a polish task or a settings page. It's a property of what your tooling writes. The rules below are defaults for every project with a UI. Override them if you have a reason, but the burden of proof sits with the override.
:::

## TLDR

Ask an AI for a button and you'll get `<div onClick>`. The model knows better. Nothing in your loop ever asks. Accessibility is the one quality that gives **no feedback signal at all**. A missing `alt` doesn't fail a type check or a test. It doesn't throw, doesn't change a screenshot and doesn't look wrong. People and agents both chase the signals they can check, so it gets skipped every time.

The fix is three cheap moves, all in Sprint 1. Put the rules in `CLAUDE.md`, where Claude reads them every session. Install a linter that turns the invisible into a warning. Then do one 10-minute manual pass per phase. The European Accessibility Act has applied since 28 June 2025, so for a lot of projects this stopped being optional.

---

## Why AI Writes Inaccessible Code

There are three reasons. Only one is about anyone not caring, and it's the least important.

**1. The training data is the broken web.** WebAIM scans the top million home pages every year. Detectable WCAG failures turn up on roughly 95% of them, and that number has barely moved in five years. Every model that writes front-end code learned from that and reproduces its median. The median is `<div onClick>`.

**2. Accessibility is invisible to every signal you have.** Your type checker, tests, smoke test and screenshot can't see it. Everything else in this guide works by giving Claude a target it can check. Here you have to *build* the target first.

**3. `<div onClick>` is a genuine local optimum.** It's shorter, has no browser styling to reset, works in the demo and matches every framework tutorial. It only fails for someone who isn't in the room.

At the moment of writing, being right costs more than being wrong. That's exactly the kind of problem a rules file is for.

The good news: a 2025 ACM Web4All study found that asking for accessibility in the prompt clearly improves WCAG compliance in AI-generated UIs. The knowledge is in the model. Nothing asks for it. That gap is cheap to close.

---

## Defaults Over Documentation

The test for every rule in this chapter: **does a task that never mentions accessibility still come out right?**

If the accessible version only happens when you remember to ask, you haven't shipped it. You'll remember for the first three components and never again. So the rules go in `CLAUDE.md`, which Claude reads at the start of every session, not in a doc you open once.

It's the same pattern as [i18n in the Frontend Tweaker](/part-5/frontend-tweaker): one rule, and Claude does it every time without you thinking about it. And it's one rule set for both authors. Claude is held to what you'd expect of a human developer on the codebase.

---

## Make It Checkable

You can't rely on review for something a reviewer can't see. Turn it into a signal.

**Sprint 1: the linter.** Install the a11y linter for your stack and treat its output like any other warning. (Your `CLAUDE.md` should already say "don't ignore linter warnings". This gives that rule teeth.)

| Stack | Tool |
|-------|------|
| React / Next | `eslint-plugin-jsx-a11y` |
| Svelte / SvelteKit | Built into the compiler, a11y warnings on by default. **Do not silence them.** |
| Vue | `eslint-plugin-vuejs-accessibility` |
| Angular | Built into the template compiler, plus `@angular-eslint` |

**Sprint 1: axe-core in the test run.** One test per route, about five lines each with `@axe-core/playwright` or `jest-axe`. This is the best-value item in the chapter. It turns "did anyone check?" into a red build. If your `CLAUDE.md` already asks for headless browser tests (it should, see [Testing](/part-4/testing)), the axe check rides along in the same run, in the background.

**Warnings, not blockers, with an opt-in gate.** Let violations fail loudly in CI without blocking local work. A check nobody can ship past gets switched off. A check that never blocks anything gets ignored. Warnings by default, with a `--strict` flag on the release build, survives both.

---

## The Number at the Point of Decision

The single most useful tool here is a contrast ratio shown **while you're picking the colour**, not in a report afterwards.

You already have the place for it. [`design-tokens.css`](/part-5/frontend-tweaker) defines every colour in the app, so the check belongs there. Annotate the pairs that must pass and let the tweaker panel (or a 20-line test) compute them:

```css
/* @contrast --text-primary on --bg-surface | min: 4.5 */
/* @contrast --btn-primary-text on --btn-primary-bg | min: 4.5 */
/* @contrast --border-default on --bg-surface | min: 3 */
```

A linter that runs afterwards asks you to undo a choice you've already fallen for. A number you can see while choosing changes the choice itself, even for people who've never heard of WCAG.

---

## What Automated Tooling Cannot See

Automated tools catch a minority of WCAG failures, commonly put at around a third. They can't judge the ones that matter most: whether a name *means* anything, whether the reading order makes sense, whether alt text is *right* and not just present.

So never call an app "accessible" because axe went green. The honest phrase is "no detected issues".

**The 10-minute manual pass, once per phase** (add it to your [phase audit](/part-4/phase-audits)):

1. Unplug the mouse. Tab through the main flow. Can you finish it? Can you always *see* where you are?
2. Zoom to 200%. Does anything overlap, clip or scroll sideways?
3. Turn on the built-in screen reader (VoiceOver: `Cmd+F5`. Narrator: `Ctrl+Win+Enter`) and move through one page. Are buttons announced as buttons, with names that mean something?

Three checks, no training needed, and they catch most of what axe can't.

::: danger Never use an accessibility overlay
Overlay widgets (the ones promising instant compliance from one script tag) are widely opposed by disabled users and don't achieve compliance. They contradict everything above. Don't ship one, don't recommend one, and don't let Claude install one.
:::

---

## What to add to CLAUDE.md

These are non-negotiable defaults for any project with a UI:

1. Interactive elements MUST be real elements: `<button>`, `<a href>`, `<input>`. Never a `<div>` or `<span>` with a click handler.
2. Never remove focus indicators. `outline: none` needs a `:focus-visible` replacement in the same change.
3. Every image needs `alt`: descriptive if it means something, `alt=""` if decorative. Every input needs a `<label>`.
4. Semantic structure by default. One `<h1>` per page, no skipped heading levels, and landmark elements (`<main>`, `<nav>`, `<header>`) over `<div>`.
5. Never use colour alone to carry information. Pair it with text, an icon or a shape.
6. Client-side route changes move focus to the new page heading and announce it.
7. Anything clickable is at least 24×24px (WCAG 2.5.8).
8. Respect `prefers-reduced-motion` on every animation and transition.
9. A visible button's text must match its accessible name (WCAG 2.5.3, which voice control depends on).
10. Run the a11y linter and axe tests before calling any UI task complete, and report the result in the confidence score.

Rule 10 is the one that makes the other nine real.

---

## Quick Reference

| Move | When | Cost |
|------|------|------|
| a11y linter installed, warnings not silenced | Sprint 1 | 10 minutes |
| Accessibility rules in `CLAUDE.md` | Sprint 1 | Copy and paste |
| `@contrast` annotations in `design-tokens.css` | Sprint 1 | 10 minutes |
| axe-core test per route | Sprint 1 or 2 | About 5 lines per route |
| Keyboard, zoom and screen-reader pass | Every phase audit | 10 minutes |
| CI gate switched to blocking | Before launch | One flag |

**Target: WCAG 2.2 Level AA.** It's the level every regulation points to. AAA isn't a sensible whole-product target, so don't claim it.

**The argument that wins when the others don't:** people who aren't disabled use every one of these fixes all the time without noticing. Focus rings help anyone who tabs. Captions are mostly used by hearing people. Contrast is what makes a phone readable outdoors. You're building for bright sunlight, one free hand, a broken wrist and a noisy train. That's all of your users, some of the time.

---

**Next:** [The Frontend Tweaker](/part-5/frontend-tweaker): baking editability into your frontend.
