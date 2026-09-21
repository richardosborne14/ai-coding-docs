---
title: The Frontend Tweaker
description: Stop asking Claude to change padding. Bake editability into your frontend from Sprint 1 with four convention files and a dev-mode panel.
---

# The Frontend Tweaker

::: warning Opinionated by design
I don't give you three options and let you pick. I tell you what works and why. The conventions below are defaults for every project. Override them if you have a reason, but the burden of proof sits with the override.
:::

## TLDR

After every big build you'll want to tweak a dozen small things: a font size, a button colour, a heading that's too long, a link to the wrong URL. Each one takes five seconds if you can just *edit it*. Through Claude it's a full round trip: describe it, wait while Claude searches the codebase, and hope nothing else changes. It also eats into your session limit for a one-line change.

The fix is to bake editability into the frontend, the same way the [control panel](/part-5/control-panel) bakes visibility into the backend. You need four convention files and one simple dev-mode panel. Cosmetic changes then need no Claude at all.

---

## The Pattern

Same approach as the control panel. Set conventions, write them into `CLAUDE.md` so Claude maintains them, and build a simple tool that reads them.

The backend version shows you automations and deploys. The frontend version gives you direct control of the four things people tweak constantly after a build: styles, text, links and SEO.

| Layer | Convention file | Tweaker control | What it covers |
|-------|----------------|-----------------|----------------|
| Styles | CSS custom properties with `@tweak` annotations | Sliders, colour pickers | Spacing, sizes, colours, borders, shadows |
| Contrast | `@contrast` annotations on colour pairs | Live ratio next to the picker | WCAG contrast, checked as you choose |
| Text | i18n JSON locale files | Text inputs, textareas | Every visible string in the app |
| Links | `links.json` | URL inputs | Social links, CTAs, footer links, external hrefs |
| SEO | `meta.json` | Text inputs with character counts | Page titles, meta descriptions, OG content |

---

## Styles: CSS Custom Properties with @tweak Annotations

Instead of hardcoding values in component CSS, Claude pulls every tweakable property into a named CSS custom property with a structured comment.

```css
:root {
  /* @tweak Hero title size | range: 1rem, 4rem */
  --hero-title-font-size: 2.5rem;
  /* @tweak Hero title colour | type: color */
  --hero-title-color: #1a1a2e;
  /* @tweak Primary button hover background | type: color | state: hover */
  --btn-primary-hover-bg: #e6e82b;
  /* @tweak Card padding mobile | range: 0.5rem, 3rem | breakpoint: 768px */
  --card-padding-mobile: 1rem;
}
```

Components use the variables: `font-size: var(--hero-title-font-size)`. The tweaker panel scans for `@tweak` comments, reads the metadata and shows the right control: a slider for a range, a colour picker for a colour. Controls are grouped by component and state.

Changes apply live through `document.documentElement.style.setProperty()`. Hit save and the values write back to the CSS file. No Claude, no side effects, no codebase search.

**Brand colours cascade.** Structure tokens in layers: brand, then semantic, then component. Change `--brand-primary` in the tweaker and everything that uses it updates. Dark mode is a second set of the same variables under `.dark {}`.

**Show the contrast ratio while the colour is being picked.** Annotate the pairs that must pass and let the panel compute them live:

```css
/* @contrast --text-primary on --bg-surface | min: 4.5 */
```

This is the most useful control in the panel. A linter that runs afterwards asks you to undo a choice you've already made. A number you can see while choosing changes the choice. See [Accessibility by Default](/part-5/accessibility).

---

## Text: i18n as a Text Management Layer

Most people miss this one. i18next (or any i18n library) isn't only for translation. It's a way to manage text. Every visible string in the app lives in structured JSON:

```json
{
  "hero": {
    "title": "Welcome to OpsNest",
    "subtitle": "Your operations dashboard",
    "cta_button": "Get Started Free"
  },
  "nav": {
    "home": "Home",
    "dashboard": "Dashboard",
    "settings": "Settings"
  }
}
```

Components use `{t('hero.title')}` instead of hardcoded strings. The tweaker reads the JSON, shows a text input for every key and writes the new values back. Change a button label, a heading or a menu item without touching component code.

**Use i18n even in a one-language app.** The "too much overhead" argument falls apart when Claude writes the code. One line in `CLAUDE.md` and Claude wraps every string. You get all your text in one place, and if you ever need translations, the structure is already there.

**Placeholders stay safe.** A key like `"Welcome back, {{name}}"` shows `{{name}}` in the tweaker as a locked pill. You can edit the text around it but can't delete it by accident.

---

## Links: Centralised URL Management

Social links, CTA destinations, footer links, "book a call" URLs and terms-of-service paths aren't text (i18n doesn't catch them) and they aren't styles. They live in `links.json`:

```json
{
  "social": {
    "twitter": "https://twitter.com/yourcompany",
    "linkedin": "https://linkedin.com/company/yourcompany"
  },
  "cta": {
    "primary": "https://calendly.com/yourcompany/consult",
    "secondary": "/pricing"
  },
  "footer": {
    "terms": "/legal/terms",
    "privacy": "/legal/privacy"
  }
}
```

Components import from this file and the tweaker shows URL fields. Changing your Calendly link or adding a social profile is one edit in one file.

---

## SEO: Per-Page Meta Configuration

Page titles, meta descriptions and OG images are invisible on the page, and people fiddle with them endlessly after launch. They don't belong in i18n because components don't render them. `meta.json` holds them per page:

```json
{
  "home": {
    "title": "OpsNest: Operations Dashboard for Small Teams",
    "description": "Monitor deployments, track automations, and manage data from one dashboard.",
    "og_image": "/images/og-home.png"
  },
  "pricing": {
    "title": "Pricing | OpsNest",
    "description": "Simple, transparent pricing for teams of all sizes."
  }
}
```

The tweaker has an SEO tab with a text input per page and a character count. Meta descriptions work best at around 155 characters, and seeing the count as you type saves the "Google cut it off" round trip.

---

## What to add to CLAUDE.md

These are non-negotiable defaults:

1. All user-facing text MUST use i18n keys. No hardcoded strings in components.
2. i18n keys MUST be grouped by page or feature (`dashboard.header.title`, not `text1`).
3. All tweakable styles (spacing, font sizes, colours, border radii, hover and disabled states) MUST use CSS custom properties with `@tweak` annotations.
4. Layer style tokens: brand, then semantic, then component.
5. All external URLs and internal nav links MUST come from `links.json`. No hardcoded hrefs in components.
6. All page meta (title, description, OG image) MUST come from `meta.json`. No hardcoded meta tags.
7. When adding a page or component, update the matching convention files in the same task.
8. Every colour pair that carries text or a UI boundary MUST have a `@contrast` annotation with its minimum ratio.

Rule 7 matches the control panel's "update deployment.json whenever a service changes". Without it the convention files go stale.

---

## When to Build It

**The conventions: always.** They cost nothing. They're structured data that Claude maintains. Set them up in Sprint 1 alongside the control panel.

The tweaker panel itself (the dev-mode page that reads these files and shows the controls) is a half-day task. Build it after Sprint 1, once there's enough UI to tweak. Or skip it. Even without the panel, the convention files make every value easy to find and change by hand. The panel is a convenience. The conventions are where the value is.

::: tip Start with i18n
If you only adopt one convention from this chapter, make it i18n for all text. It costs the least and changes the most about how you maintain content.
:::

---

**Next:** [Deployment & Platform Targets](/part-5/deployment-platforms): getting your app running everywhere.
