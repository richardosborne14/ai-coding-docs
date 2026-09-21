---
title: Philosophy & Approach
description: Why 99% of building with Claude is documentation, and the few habits that make the rest work
---

# Philosophy & Approach

## TLDR

**99% of it is docs.** A well-documented repo beats every hook, plugin and MCP server you could install. The rest is garnish.

**Talk before you build.** Discuss the idea in Chat, settle the screens in mockups, and only then pick a stack and write tasks.

**One task per session.** Finish a task, then start a fresh session for the next one. Stick to that and you'll rarely lose context.

**Proof before done.** Code written is not a feature working. Claude proves it with tests, or you confirm it yourself.

---

## 99% docs, the rest is garnish

People ask me which hooks, plugins and MCP servers they should set up. My honest answer: hardly any, at first. What makes Claude good on a project is a repo that explains itself.

Claude starts every session knowing nothing about your project. Everything it knows comes from what it reads. So I write down:

- **Who I am** and how I want to be talked to. How techie I am decides how Claude explains things and how much it does without asking.
- **The rules it must never break**, like "no task is done without tests".
- **The architecture**, with real schemas, so it doesn't guess at column names.
- **What went wrong before**, so the same bug doesn't bite twice.
- **The plan**: phases, and one task file per job.

Give Claude that and it does excellent work. Skip it and you'll spend your evenings explaining the same things over and over.

My biggest project has no hooks and no project slash commands. It does have a lot of docs. How to set them up is in [Documentation Architecture](/part-2/documentation-architecture).

::: tip Your job
Be the architect. Set the direction, write down the standards, check the result. You don't write the code. You write what the code has to do.
:::

---

## The process, and why each step is there

1. **Talk it through in Chat.** Opus, a real conversation, lots of pushback. See [Brainstorming](/part-2/brainstorming).
2. **Mockups until you'd be happy.** Claude Design draws the screens. Keep changing them until "if this existed, I'd be happy". See [Mockups First](/part-2/mockups-first).
3. **Then the stack, the docs and the tasks.** Now that the screens are settled, the technical choices get easier.
4. **Build a V1 locally.** One task per session, tested as you go.
5. **Lots of bug-fix rounds.** This is normal. The first version is never the last.
6. **Deploy to a real server and domain.** Only once the local version works.

Each step is cheaper than the one after it. Changing your mind in a chat costs nothing. Changing it after deploy costs a week.

---

## Validate first, build second

Most AI projects go wrong because people try to build everything at once.

**The pattern that fails:**
> "Build me a platform with tools, resources, an AI assistant, a community..."
>
> *Eight weeks later: a half-built mess.*

**The pattern that works:**
> "I want to build a community platform for event professionals."
>
> Claude: "That's broad. What's the one thing that makes this different?"
>
> "Easy access to open-source event tools with custom branding."
>
> Claude: "Let's build just the tool library first. If organisers love it, add the community features."

Build the core, put it in front of real people, then decide. If they don't want it, you found out cheaply.

---

## One task per session

A long session collects noise: old debugging tangents, decisions you've since changed, half-abandoned approaches. Claude reads all of it on every turn. It also eats your [limits](/part-0/plans-and-limits) faster.

**The rules:**
- One task, one session. When it's done, start a fresh one.
- Going in circles? Write down what you know in a task file and start fresh.
- Found a side issue? Write it up as its own task. Don't fix it here.

Starting fresh is cheap, because Claude re-reads your docs in a few seconds. That's the whole point of having them.

---

## Proof before done

"Code written" and "feature working" are two different things. My rules file says it plainly:

> NEVER declare "done" without proof. Either tests pass or the user confirms it works.

In practice Claude is good at this now. It asks me to test things and chases me when I haven't ("still waiting on your check of the login page"). The bigger risk is me. If I say "just get it done" without reading the plan it wrote, I usually end up unhappy with the result. Read the plan.

Claude also errs on the cautious side. It will avoid things like connecting to your server over SSH or testing with real data unless you tell it that's fine. If you want it to go further, say so.

---

## Confidence scoring

Every finished task gets a score out of 10.

```markdown
## Confidence: 8/10

**Met:**
- [x] Login endpoint works
- [x] Error message for a wrong password
- [x] Unit tests passing (6/6)
- [x] Checked in the browser

**Deferred:**
- [ ] Rate limiting (Phase 2)
```

**8 out of 10 is the minimum to move on.** Below that, fix it first. A shaky login breaks everything built on top of it, and you want to catch that now. More in [Confidence Scoring](/part-3/confidence-scoring).

---

## Quick reference

| Principle | What it means |
|-----------|---------------|
| 99% docs | A repo that explains itself beats extra tooling |
| Talk, then mock up, then build | Settle the idea and the screens before the code |
| Validate first | Build the core, test it on people, then grow |
| One task per session | Fresh session for each task |
| Proof before done | Tests pass or you've checked it yourself |
| Confidence scoring | 8/10 minimum before moving on |
| Phase audits | A fresh look between big milestones ([Phase Audits](/part-4/phase-audits)) |

---

**Next:** [Which Claude, Where](/part-1/tool-selection)
