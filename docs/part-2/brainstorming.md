---
title: The Brainstorming Session
description: Every project starts with a proper conversation in Chat, with Opus, before any mockups or code
---

# The Brainstorming Session

## TLDR

Every project starts with a **conversation with Opus in Chat**, ideally inside a Project. Not a single prompt. A real back-and-forth of 30 to 60 minutes. You describe the idea, Claude pushes back, asks questions and helps you cut it down to a V1. Nothing else you do on the project pays back as well.

When you're done, you take a short summary into [Mockups First](/part-2/mockups-first). The stack and the code come later.

---

## Why Opus, why Chat, why a Project

**Opus** thinks harder about scope and challenges your assumptions better. This is the conversation everything else is built on, so use the best model you have.

**Chat** (the desktop app or claude.ai) is the conversational Claude. It's better at open-ended discussion than Claude Code, and it already knows a fair bit about you from earlier chats.

**A Project** keeps the files and instructions for one idea together. Every new conversation in it starts with the same context. You can add reference files: screenshots of apps you like, competitor pages, API docs.

### Chat knows you, Code knows your repo

Chat's memory of you (your job, your preferences, how you like things explained) stays in Chat. Claude Code doesn't see it. Claude Code knows your project through the files in your repo, and nothing else.

So anything you want Claude Code to know about you has to be written down. That's the "who I am" section of your CLAUDE.md, covered in [Documentation Architecture](/part-2/documentation-architecture). A good trick: at the end of the brainstorm, ask Chat to write that section for you. It knows you better than you'd describe yourself.

---

## The conversation

**Turn 1: say everything.** Don't hold back. Tell Claude the whole vision:

> "I want to build a community platform for event professionals. They can browse open-source tools, add their branding and deploy them. Plus guides and video tutorials. Eventually an AI assistant that knows the platform..."

**Turn 2: Claude asks questions.** It should find the core value, ask about your technical level, time and budget, and point out what you're underestimating.

**Turns 3 to 5: argue.** This is where the value is.
- "Is that really small enough for a V1?"
- "What if we cut the AI assistant and just do tools and guides?"
- "Do we need user accounts, or can we do email login links?"

**Turn 6 onwards: converge.** Agree what's in V1, what waits and why. Leave the tech stack loose for now. You'll settle it after the mockups, when you know what the screens need.

---

## What makes a good brainstorm

**Claude should be recommending, not just agreeing.** If it never pushes back, you're not getting the value. Ask for it:

> "Be honest. Is this realistic for a first version? What would you cut?"

**Push it past caution.** Claude tends to play safe. If you suspect there's a bolder option it isn't mentioning, ask: "What would you do if this were your project?"

**Make it check facts with a web search.** Its training data can be months old. Library versions, model names and pricing are where this bites. Say: "Search the web for the current version of X before you recommend it."

**Talk about platforms early.** Where the app will run shapes everything:

- **Web only?** Simplest.
- **Phone app stores?** Say so now. It changes how the app is built from day one.
- **Installable web app (PWA)?** A good middle ground for testing on phones without the app stores.
- **Desktop app?** Possible, but harder to debug and ship. Plan for good logging from the start.

**Sketch the main entities.** Members, events, bookings: what are the main things the app stores, and how do they connect? You don't need a schema yet. A plain list stops a lot of rework later.

---

## When you have lots to decide: ask for an artifact

Brainstorms throw up a pile of questions. Answering ten of them in one chat message gets messy. Instead, ask:

> "Make me an artifact with each open question, your recommendation first, and a way for me to pick an answer."

You click through it at your own pace. Artifacts can store your answers, so they can come back to Claude later, including in Claude Code. I use this all the time when Claude needs me to rule on several things at once.

Ask for artifacts rather than inline previews for anything you'll want to keep or share.

---

## Red flags while scoping

**"Everything is essential."**
> "We need tools and guides and an assistant and messaging or it won't work."

Push back: can we check that organisers want the tools first? Everything else supports that.

**"It's not that complex."**
> "The AI assistant is just a chatbot, how hard can it be?"

In one of my projects that "chatbot" turned into eleven tasks. Put it in V2.

**"Users won't understand without X."**
> "We need a full onboarding wizard or people will be lost."

Ship something simple. If people get confused, you'll learn what to explain. Don't guess.

---

## What you walk away with

1. **V1 scope** in one clear paragraph.
2. **How you'll know it works**: two or three things you can check.
3. **What's deferred**, and why.
4. **The main entities** and how they relate.
5. **Platforms**: web, phone, desktop.
6. **A "who I am" note** for your CLAUDE.md.

For example, from a conference toolkit project:

> **Core:** make open-source event tools usable by organisers who aren't technical. Guides support that. The AI assistant is V2.
>
> **V1:** member sign-up, a tool library with filters, branding per tool, hosted widgets, a guides section, an admin panel.
>
> **Later:** the AI assistant, real-time collaboration, third-party integrations.

---

## Next: mockups

Ask Claude to write the summary above as one message you can copy. Then take it to Claude Design and start drawing screens. Claude Design doesn't know what you agreed in Chat unless you paste it in.

Don't pick the stack or write tasks yet. That comes after the mockups, when you know exactly what you're building.

---

## Common mistakes

**Using a smaller model for this.** Use Opus. It's the conversation that sets up everything else.

**One prompt, one answer.** If you got a good answer first time, you probably didn't explore enough.

**Skipping it.** Starting with "build me X" instead of "let's talk about X" is the most expensive shortcut in the whole process.

**Assuming Claude Code heard it.** It didn't. Write the decisions down and take them with you.

---

**Next:** [Mockups First](/part-2/mockups-first)
