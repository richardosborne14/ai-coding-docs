---
title: Mockups First
description: Get Claude Design to draw your app and keep changing it until you'd be happy if it existed. Only then talk about code.
---

# Mockups First

## TLDR

After the brainstorm, and before any talk of code, I get mockups. Claude Design draws the screens. I change them by chatting and leaving comments until I can say **"if this existed, I'd be happy"**. Then I hand the design to Claude Code, and only then do we pick a stack and write the tasks.

---

## Why mockups before code

Changing a mockup takes seconds. Changing a built app means new tasks, new tests and new bugs. Most of the "that's not what I meant" moments in a project can happen here, where they're cheap.

Mockups also settle arguments you didn't know you were having. You thought "a list of bookings" was obvious. Then you see one and realise you wanted a calendar. Better to find that out now.

And they make the next step easier. When Claude writes the architecture and the task files, it has real screens to work from instead of a paragraph of description.

---

## Claude Design

Claude Design is Anthropic's tool for mockups, prototypes and slides. It's on the paid plans (Pro, Max, Team and Enterprise), and it's still labelled beta or preview, so expect it to change.

You describe what you want, and it draws it on a canvas. Then you change it:

- **By chatting.** "Make the sidebar narrower and move search to the top."
- **With comments.** Click on part of the canvas and ask for a change to just that bit.
- **By editing directly**, or with sliders Claude makes for you.
- **By asking for options.** "Show me two or three different layouts for this page" is one of the most useful things you can say.

Designs are private until you share them. You can share a link with a colleague or a client (they need a Claude account to view it) and get their reactions before anything is built.

::: tip Bring your brainstorm with you
Start the design conversation with the summary from your brainstorming session: who the app is for, what's in V1 and what isn't. Paste it in. Claude Design doesn't know what you agreed in Chat unless you tell it.
:::

---

## How far to take it

Not every pixel. You're after the **screens** and the **flow**:

- Every page a user will see in V1.
- What happens when they click the main buttons.
- The empty states. What does the dashboard look like before there's any data?
- Mobile, if people will use it on a phone.

Go through the app as if you were a user. Sign up, do the main job, come back the next day. Every time you think "hmm, where would I...", that's a gap. Fix it in the mockup.

The test is simple: **if this mockup were a working app, would you be happy?** If the honest answer is "mostly, but...", keep going. The "but" is cheaper to fix now than at any later point.

::: warning Don't let it pick the tech yet
A mockup tool will happily tell you what framework to use. Ignore that for now. The stack is a separate conversation, and it goes better once the screens are settled.
:::

---

## Handing it to Claude Code

When you're happy, export the design with **Hand off to Claude Code**. Claude Design packs up the design files, the chat and a README that tells Claude Code how to read them. You get a prompt to paste into Claude Code, so it carries on from the actual design instead of starting over from a screenshot.

I don't build straight from the handoff, though. First comes the stack conversation, then the docs:

1. Back in Chat (or in Claude Code with the design in hand), talk through the stack, the data and the hosting.
2. Ask Claude to write the foundation docs and the task files, with the mockups as the reference for every screen. See [Documentation Architecture](/part-2/documentation-architecture).
3. Keep the exported mockups in the repo (a `docs/mockups/` folder works) so every task can point at the screen it's building.

::: everything Existing design systems
If your repo already has a React design system, Claude Code's `/design-sync` command can send it to Claude Design, so new mockups use your real components.
:::

---

## No Claude Design? Other ways to mock up

- **Ask Claude Chat for an artifact.** It can build a clickable HTML mockup in the conversation. Ask for an artifact, not a picture.
- **Sketch on paper** and send Claude a photo. Seriously. It reads sketches well.
- **Screenshots of apps you like**, with notes on what to copy and what to change.

The tool matters less than the rule: settle the screens before you settle the code.

---

**Next:** [Documentation Architecture](/part-2/documentation-architecture)
