---
title: Commenting Philosophy
description: Why heavy commenting pays off when Claude reads your code fresh every session
---

# Commenting Philosophy

## TLDR

Aim for about 50% comments. It sounds excessive. It isn't.

Future you, future developers and Claude in its next session all need to know *why* you made a decision, not just *what* the code does.

---

## The Case for Heavy Comments

The traditional advice is "good code documents itself, so keep comments to a minimum".

That advice assumes:
- The same person maintains the code
- They remember their decisions
- They have the full picture

Building with Claude breaks all three. Each session starts without the last session's conversation. You forget decisions after a few weeks. The reasons behind the code get lost.

Comments are how you keep them.

---

## What to Comment

**The "why" behind a decision:**

```python
# Skills weighted 2x because professional connections
# matter more than hobby overlap at business events.
# Revisit the weighting after user feedback in v1.0.
score = (skills_overlap * 2) + interests_overlap
```

Without that comment, someone later asks "why times two?" and nobody knows.

**Behaviour that isn't obvious:**

```javascript
// Deliberately wait 100ms before redirecting.
// An immediate redirect flashes unstyled content
// on slow connections. See LEARNINGS.md 2024-12-10.
await sleep(100);
window.location.href = '/dashboard';
```

**Trade-offs you weighed:**

```python
# Simple tag matching instead of vector similarity.
# Vectors are more accurate but 10x slower past 1000 users.
# Good enough for the MVP. Upgrade path: Qdrant in v1.0.
def match_users(user1, user2):
    ...
```

**Decisions you put off:**

```javascript
// TODO(v1.0): Add rate limiting here.
// For the MVP we trust our small user base.
// Before public launch, add express-rate-limit.
app.post('/api/login', async (req, res) => {
    ...
});
```

---

## What Not to Comment

**The obvious:**

```python
# Bad: says what, not why
i = i + 1  # increment i

# Also bad
user = get_user(id)  # get the user
```

**Lies:**

```python
# Connects to production database
def connect():
    return connect_to_staging()  # The comment is wrong!
```

An out-of-date comment is worse than none. When the code changes, the comment changes with it. Put that rule in your `CLAUDE.md`.

---

## Function Documentation

Every function gets a docstring that says:
- What it does (one sentence)
- Why it exists (if that isn't obvious)
- Its parameters and return value
- An example, if it helps

```python
def calculate_match_score(user1, user2):
    """
    Calculate the networking match score between two users.

    Higher score = better match for business networking.
    Skills weighted 2x because professional overlap matters more.

    Args:
        user1: User dict with 'skills' and 'interests' lists
        user2: User dict with 'skills' and 'interests' lists

    Returns:
        int: Score from 0-20 (typical range)

    Example:
        >>> calculate_match_score(
        ...     {'skills': ['python'], 'interests': ['hiking']},
        ...     {'skills': ['python', 'js'], 'interests': ['hiking']}
        ... )
        3  # (1 skill * 2) + (1 interest * 1)
    """
    skills_overlap = len(set(user1['skills']) & set(user2['skills']))
    interests_overlap = len(set(user1['interests']) & set(user2['interests']))
    return (skills_overlap * 2) + interests_overlap
```

A minute to write. Hours saved later.

---

## Why Claude Needs This

Every fresh session, Claude reads your code as if for the first time.

**Uncommented:**
```python
def process(data):
    if len(data) > 1000:
        data = data[:1000]
    result = transform(data)
    time.sleep(0.1)
    return result
```

Claude wonders why it cuts off at 1000 and why it sleeps. It guesses, and it often guesses wrong. Then it "tidies up" the sleep and you hit the rate limit.

**Commented:**
```python
def process(data):
    # Cap at 1000 items: the API allows 1000 per minute
    if len(data) > 1000:
        data = data[:1000]

    result = transform(data)

    # Short pause so rapid calls don't trip the rate limit
    time.sleep(0.1)

    return result
```

Now Claude knows what's going on and leaves the important bits alone.

---

## The Three-Month Test

Ask yourself: "Will I understand this in three months?"

If it's clever or odd, you won't remember why. Comment it now.

```javascript
// This regex looks mad but it handles:
// - International formats (+1, +44, etc.)
// - Optional brackets around the area code
// - Spaces, dashes or dots as separators
// Tested against 500 real phone numbers from user data.
const phoneRegex = /^\+?[\d\s\-().]{10,}$/;
```

---

## Make the Code Easy to Find

Comments explain "why". There's a second job: helping Claude find the right code from the words you use.

**The problem:** what you see ("the pricing section on the homepage") and what's in the code (`src/components/landing/FeatureGrid.svelte`) use different words. When you say "the pricing cards are misaligned", Claude has to find the right file, component and CSS rule. In a big project that's harder than it sounds.

**The fix:** build the names in from the start.

**Meaningful IDs and data attributes:**

```html
<!-- Bad: nothing links this to "the pricing section" -->
<div class="grid grid-cols-3 gap-4">

<!-- Good: Claude can search for this -->
<div id="pricing-cards-section" data-component="PricingCards" class="grid grid-cols-3 gap-4">
```

**A comment at the top of each component saying what the user sees:**

```svelte
<!--
  COMPONENT: PricingCards
  USER-FACING: The three pricing tier cards on the homepage (/pricing section)
  DISPLAYS: Free, Pro and Enterprise tiers with feature lists
  DATA SOURCE: static-data/pricing-tiers.json
-->
```

The same names help your browser tests too: a test that clicks `#pricing-cards-section` doesn't break when someone changes the CSS classes. See [Testing](/part-4/testing).

**The control panel works the same way.** With the [Project Control Panel](/part-5/control-panel), `deployment.json`, `flow-registry.js` and `USER_JOURNEYS.json` all build a searchable index of the app that you and Claude can both use.

---

## Quick Checklist

Before a task closes:

- [ ] Every function has a docstring
- [ ] Odd code has an inline comment saying why
- [ ] Trade-offs are written down
- [ ] Every TODO says when (v1.0, Phase 2, and so on)
- [ ] No commented-out code (delete it, Git remembers)

Add this list to your `CLAUDE.md` and Claude will check it for you.

---

## Is It Worth It?

Heavy commenting adds maybe 20% to the time it takes to write the code. In return you get:

- Less time asking "why does this work like that?"
- Less rework from Claude misreading your code
- Faster onboarding for new developers
- Less confusion when you come back after a break

20% more effort for a lot less pain. Good trade.

---

**Next:** [Context Management](/part-5/context-management): keeping Claude focused across sessions.
