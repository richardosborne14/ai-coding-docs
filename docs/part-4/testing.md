---
title: Testing
description: Backend tests plus headless browser playtests that Claude runs in the background after every change
---

# Testing

## TLDR

Ask Claude for two kinds of test: **backend tests** for the logic, and **headless browser tests** that click through the app like a person would.

Both run in the background after every change. You won't see a browser window. Claude takes screenshots instead, and you look at them.

Green tests mean Claude can show you the work. You still play it yourself before a task closes.

---

## Two Kinds of Test

**Backend tests** check the logic: does the login endpoint reject a wrong password, does the score add up, does saving twice pay out twice. They're fast and Claude writes them without being asked much.

**Browser tests** (I call them playtests) open the real app in a browser, click the real buttons, type in the real boxes and check what appears. They catch the things backend tests can't: a button hidden under another element, a form that never submits, text that runs off a phone screen.

You want both. Plenty of apps pass every backend test and still don't work when a person tries them.

---

## Why You Don't See a Browser

A headless browser is a normal browser with no window. It loads your app, clicks and types, and reads the page, all out of sight. Claude runs it from a script, reads the result, and saves screenshots along the way.

So after a change you might see nothing happen for a minute, then a report: 17 of 17 checks passed, screenshots saved. That's the test running. Now and then Claude may open a visible browser to show you something. Most of the time it doesn't need to.

It works in your favour. You can get on with something else while it runs, and it plays through the same flows every time without getting bored.

::: simple
In the desktop app, the Code tab has a Browser pane that shows your running app. The tests still run out of sight, but that pane is where you do your own replay.
:::

---

## A Worked Example: Rocket School

Rocket School is a maths and typing game for children, built as a template in my OpenNoodl project. After my first play of it I wrote down ten complaints: text that didn't wrap, a "show me how" button that showed nothing, French keyboards needing Shift for every digit, and so on. Each became a task in one phase folder.

Every feature has a **driver script** that plays the game the way a child would:

- It makes a player, starts a race, answers a question, reads the verdict, switches language and reloads the page.
- Clicks are real mouse events at the button's centre, and typing goes into a focused box. A script that calls the click handler directly only proves the handler exists, not that a person can reach it.
- It runs at five screen sizes: two laptops, a tablet both ways round, and a phone. French with an AZERTY keyboard is the main run, English second.
- It saves before and after screenshots into the phase's `shots/` folder.
- It exits with 0 if every check passed and 1 if any failed, so Claude knows at once.

After every change, Claude rebuilds the game and runs the drive in the background. Beep, boop, beep, and a report comes back.

---

## Three Rules I Learned the Hard Way

### Reproduce before fixing

The first check in every task must **fail on today's build**. If you can't make the bug show up in a test, you can't prove you fixed it. You also can't be sure you fixed the thing the user actually saw.

### Look at the screenshot

Text checks miss things. On Rocket School a script checked the words on the page and passed, while the screenshot showed a pill drawn twice and a second banner open on top of the first. Checks that read text won't see a clipped line either. Claude should look at every screenshot it takes, and so should you.

### A green test alone closes nothing

This is the big one. All ten of my Rocket School complaints had shipped past 140 passing backend tests and a 17 out of 17 browser drive. The tests were green. The game was still annoying to play.

So the close condition for that phase was me replaying the race on a tablet and on a French laptop, with none of the ten problems coming back. Tests tell Claude it's safe to show you. Your replay says it's done.

One more trap from the same project: twice a build script failed quietly, and the drive happily tested the **old** version and passed. Make Claude check the build succeeded before it believes a test result.

---

## Logged-In Pages

Most apps need a login before anything interesting happens. Don't let every test waste its time on the login screen.

Set up a test account, and tell Claude to go straight to the page under test. It should only log in if the app bounces it to the login page. For sign-up or password-reset tests, it logs out first on purpose.

---

## What to Add to CLAUDE.md

This is what makes Claude do all of the above without being asked each time:

```markdown
## Testing

- After every change, run the backend tests AND the browser tests.
  Run them in the background. Don't ask me to watch.
- Browser tests use real clicks and typing, not direct function calls.
- Test at laptop, tablet and phone width.
- Save before/after screenshots to the phase's shots/ folder.
  Look at every screenshot yourself and tell me what you see.
- Before fixing a bug, write a test that fails on the current build.
- Check the build succeeded before trusting a test result.
- Assume a logged-in test session. Only log in if redirected.
- Never call a task done on green tests alone. Show me the
  screenshots and ask me to replay it before closing.
```

Adjust the screen sizes and languages to whoever uses your app. If your users are on phones, make the phone run the main one.

::: everything Tools
Claude will pick a browser testing tool that suits your stack. Playwright and Puppeteer are common choices. Rocket School drives Chrome directly through its DevTools Protocol. Any of them run headless, and any of them can take screenshots. Let Claude choose, and write the choice into your architecture doc so it doesn't switch halfway through.

Keep one driver script per feature, in a folder like `scripts/tests/`. Each should be runnable on its own from the terminal with a clear pass or fail exit code.
:::

---

## The Point

Tests let Claude check its own work hundreds of times without you. They don't replace you playing the app. Let the background tests catch the obvious breakage, look at the screenshots, then spend your five minutes on the part only a person can judge.

---

**Next:** [Commenting Philosophy](/part-4/commenting-philosophy): why heavy commenting pays off.
