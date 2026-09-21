# R2: Voice & positioning spec

**Date:** 2026-09-21 · **Status:** RULED by Richard 2026-09-21 (picks at the bottom). This is the spec R3/R4 write to.
**Facts it relies on:** [R2-FACTS.md](R2-FACTS.md). No copy here states a price, a limit or a feature that isn't confirmed there.

## Voice rules (apply to every line on the site)

- First person, Richard talking. Cheeky, confident, a bit self-aware about the "you don't need me" joke.
- **No em dashes.** Use a full stop, a comma or brackets. Check every draft with `grep -c "—"` before it ships.
- No melodrama: no "game-changer", "unlock", "supercharge", "revolutionise", "the secret", "here's the thing".
- No swearing (D1). No "It's not X, it's Y" constructions, and no automatic lists of three.
- Short sentences. Plain words. If a sentence needs a second comma, it probably wants to be two sentences.
- Honest about cost and effort. When the guide doesn't know, it says so.
- The joke is told once per page at most. The CTA is where it lands.

## Options (Richard picks one per row; recommendation first)

### Hero (home page)

| # | Big name | Line under it | Tagline |
|---|----------|---------------|---------|
| **H1** (rec.) | Learn AI | Everything I know about building with Claude. | Written down, for free, so you don't need me. ...Or do you? |
| H2 | Build it with Claude | I wrote the manual so you wouldn't have to call me. | You'll probably call anyway. That's fine. |
| H3 | Learn AI | How I build real apps with Claude, start to finish. | Idea, mockup, working app, live site. All of it, free. |

### Meta description (search results and link previews)

- **M1** (rec.): How I build real apps with Claude, from first chat to live site. Free, practical, and honest about what it costs.
- M2: Everything I know about building apps with Claude, written down so you can do it without me. Mostly.

### Feature cards (keep or drop each)

1. **Pick your track.** Track wording set in R2-FACTS / F2 (see ruling page).
2. **Talk first, build later.** Most of the work happens before any code. Chat it through, get mockups, and only build once you'd be happy if it already existed.
3. **99% docs.** A well-documented repo beats every clever plugin. I'll show you the files that make Claude behave, and how to stop them growing out of control.
4. **One task per session.** Fresh session, one job, close it, move on. Do that and you'll rarely hit the context wall.
5. **What it really costs.** What Free, Pro and Max get you, which model to use when, and when paying more is worth it.

### About intro

- **A1** (rec.): I'm Richard. I build apps with Claude most days, and I teach founders and teams to do the same. This site is everything I've learned, written down for free. In theory, once you've read it you won't need me. In practice, people read half of it and book a call. I'm fine with either.
- A2: I'm Richard, and I build things with Claude for a living. I wrote this so you can do it too. If it works, you'll never need to call me. I can live with that.

### CTA (the punchline to "...or do you?")

| # | Heading | Body | Button |
|---|---------|------|--------|
| **C1** (rec.) | ...or do you? | You've got the whole method. What the guide can't do is look at your project. I can, and a short call is often enough to get you moving again. | Book a call |
| C2 | OK, maybe you need me a little | No shame in it. Bring your project, your mockups or your mess, and we'll work out the next step together. | Book a call |

### Track names

F2 changed what the non-tech track is (see R2-FACTS): it builds in the desktop app's **Code tab**, not Cowork. Richard confirms that first (ruling "ntrack").

- **T1** (rec.): "I don't code (yet)" / "I'm happy in a terminal"
- T2: "Just the Claude app" / "Claude Code, the full kit"
- T3: "Keep it simple" / "Show me everything"

Card 1 text for T1: *Don't code yet? Build and run your app inside the Claude desktop app, no terminal needed. Happy in a terminal? Get the full kit. The site hides the bits you don't need.*

## Richard's picks (2026-09-21, from the ruling page, no notes added)

| Item | Pick | Final copy |
|------|------|-----------|
| Hero | **H2** | Big name "Build it with Claude". Line: "I wrote the manual so you wouldn't have to call me." Tagline: "You'll probably call anyway. That's fine." |
| CTA | **C1** | Heading "...or do you?" Body: "You've got the whole method. What the guide can't do is look at your project. I can, and a short call is often enough to get you moving again." Button "Book a call" |
| About intro | **A2** | I'm Richard, and I build things with Claude for a living. I wrote this so you can do it too. If it works, you'll never need to call me. I can live with that. |
| Meta description | **M1** | How I build real apps with Claude, from first chat to live site. Free, practical, and honest about what it costs. |
| Feature cards | **All 5 kept** | Card 1 (T3 wording): "Keep it simple and build inside the Claude desktop app, or see everything, terminal included. The site hides the bits you don't need." Cards 2 to 5 as listed above. |
| Non-tech track | **Code tab** | Everything inside the Claude desktop app: Chat, then Design, then the Code tab to build and preview. Cowork is a side note. Builder track = Claude Code in VS Code or a terminal, plus Git, Docker, deploys. |
| Track names | **T3** | "Keep it simple" / "Show me everything" |

**Note for R3 on T3:** "Show me everything" suggests the builder track shows *all* content, including the simple-track blocks. Build it that way: the simple track hides builder-only content, and "everything" hides nothing. That also matches R1's rule that the default, with nothing stored, shows everything.

**Note on the hero with H2:** the "...or do you?" line is no longer in the hero, so the CTA heading carries the joke alone. It reads fine because the hero already sets up "you wouldn't have to call me".
