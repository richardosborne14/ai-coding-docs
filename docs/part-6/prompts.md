---
title: Prompts
description: The prompts I use at each step, from the first chat to the audit, and which ones to turn into skills
---

# Prompts

These are the prompts I actually use, in the order you'll need them. Most are also in `project-templates/prompts/` as separate files.

Some are marked **Skill candidate**. Those are the ones you'll type so often that it's worth saving them as a [skill](/part-5/skills), so a short slash command does the job. Make them skills once you've used them a few times and know how you like them. Not before.

Keep your prompts short. The docs carry the context, so you don't have to.

---

## 1. Talk it through

> **Where:** Claude Chat (desktop app or claude.ai), Opus. Not Claude Code. Chat knows you. Code knows your repo, and right now there isn't one.

```
I want to build [describe the whole idea, don't hold back].

About me:
- How techie I am: [I don't code / I've built a few things / I'm a developer]
- Who it's for: [the people who'll use it]
- What I already have: [designs, data, an old app, a spreadsheet]

Don't give me a plan yet. Talk it through with me first.
Ask me questions. Challenge the bits you think are weak.
Tell me what I've forgotten.
```

Follow-ups I use a lot:

```
That's still a lot. What's the smallest version that would tell me
whether [the core idea] works?
```

```
What will the people using this get stuck on that I haven't thought of?
```

---

## 2. Mockups

> **Where:** [Claude Design](/part-2/mockups-first). Keep going until you'd be happy if this existed.

```
Mock up the main screens for what we discussed: [list them].
Show me two or three different layouts for [the most important screen]
so I can pick a direction.
```

```
Walk me through what happens when a [type of user] does [main job],
screen by screen. Show me any screen we haven't drawn yet.
```

Don't talk about stacks or hosting yet. If the mockups aren't right, nothing after them will be.

---

## 3. Docs and tasks

> **Where:** Claude Code, in the new repo with the [templates](/part-6/templates) copied in. Opus.

**Foundation docs:**

```
Read the design handoff and my brainstorm notes in [path].
Fill in the templates for this project: CLAUDE.md, README.md,
ARCHITECTURE.md and a Sprint 1 plan.

Recommend a stack and say why, with one alternative.
Make the schemas real: table names, column types, constraints.
Make the rules strict. Fill in "Who I am" as a draft and I'll correct it.
Ask me about anything you'd otherwise guess.
```

**Task files** (Skill candidate):

```
Write a task file for each Sprint 1 task, using TASK_TEMPLATE.md.
Each one needs numbered requirements, the files to touch,
acceptance criteria I can check, and a Recommended model line.
A fresh session should be able to run it without asking me anything.
```

---

## 4. Build

> **Where:** Claude Code. One task per session. Switch to the model the task file names before you start.

**Start a task** (Skill candidate):

```
Plan task [ID] - [name].
```

That's usually all it takes. The docs do the rest. Then **read the plan**. The most common way people get a result they don't like is saying "just do it" without reading what Claude spelled out.

**When it plays safe:**

Claude tends to err on the side of caution. If it's avoiding something that would make life easier, push it.

```
You're being cautious. What would you recommend if I said yes to
[SSH access / using the real data / changing the schema]?
What's the actual risk?
```

**When it needs several decisions from you:**

```
You've got several questions for me. Put them in an artifact I can
click through, recommendation first, and I'll send the answers back.
```

**Handing off at the end of a session** (Skill candidate):

```
We're stopping here. Update the task file with what's done, what's
left and what the next session should read first. Overwrite the
handoff note, don't add a new one.
```

---

## 5. Fix

> **Where:** Claude Code. Plan first. A screenshot is worth ten paragraphs.

**A normal bug:**

```
This is broken: [what you expected, what happened].
[paste the screenshot or the error]
Steps: [1, 2, 3]

Reproduce it first, then tell me the cause and your plan.
Don't change anything yet.
```

**Going round in circles:**

```
We've tried this three times. Stop. Write a task file with the
original problem, what we tried, why each attempt failed, and what
you'd try next. I'll pick it up in a fresh session.
```

**Round of feedback after testing** (Skill candidate):

```
I've been through the app. Here's my list: [paste it].
For each one, find the actual cause in the code before proposing
anything. Group them into tasks and put the plan in an artifact.
```

---

## 6. Deploy

> **Where:** Claude Code. Only once V1 works locally and you've been through a few rounds of fixes.

::: everything
```
We're ready to put this on a real server. Recommend a host and a setup
for [expected users, budget, where they are]. Include the domain, HTTPS,
backups and how I'll see errors. Write it up as a deploy task.
```

```
Deploy the current version to [dev / production] using deploy.sh.
Don't sit and watch the build. Kick it off, then give me one command
to check it's done. Then check the live version matches the commit.
```

More in [Deployment & Platforms](/part-5/deployment-platforms) and [Deploy Verification](/part-5/deploy-verification).
:::

---

## 7. Audit

> **Where:** A fresh Claude Code session (or a subagent) that didn't build the thing. Fresh eyes find more.

**Phase audit** (Skill candidate):

```
You're a senior developer auditing this repo. You didn't write it.
Phase just finished: [name]. Read CLAUDE.md and ARCHITECTURE.md first.

Look for bugs, security holes, missing error handling, missing tests,
rules in CLAUDE.md that the code breaks, and docs that are too long
or out of date.

For each finding: how bad, which file, what's wrong, the fix.
Give it an overall score out of 10. Be hard on it.
```

More in [Phase Audits](/part-4/phase-audits).

---

## Prompts that don't work

**Too vague:** "Fix the bug." "Make it better." "Do whatever you think."

**Too long:** 500 words of context that's already in your docs.

**Setting it up to cut corners:** "This is probably easy." "Just quickly." "Tell me it's fine."

**Skipping the plan:** "Just get it done." Claude will. Then you'll find out what it thought you meant.

---

## Your first skill: copywriting

One more that isn't a prompt so much as a standing order. Claude writes prose you can spot a mile off: long dashes everywhere and a tone that treats a login page like a moon landing. Make a copywriting skill early with your own voice rules in it, and have Claude use it for every word a user will read. See [Skills](/part-5/skills).

---

**Next:** [Case Studies](/part-6/case-studies). Real projects built this way.
