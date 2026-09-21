---
title: "Case Study: NodeGX"
description: How Claude Code took a stalled, half-migrated visual app builder and rebuilt it in two months. 3,865 commits, 91 new phases, and a code export people said wasn't worth attempting.
---

# Case Study: NodeGX

## TLDR

NodeGX is an open-source visual app builder. It started life as Noodl, a commercial product, and it came to me as a big, old, half-upgraded codebase that had been stalled for five months.

On 22 July 2026 I pointed Claude Code at it. In the two months since:

| | Before 22 July 2026 | 21 September 2026 |
|---|---|---|
| Commits | 189, across two and a half years | **3,865 more**, in 61 days |
| Task phase folders | 13 (phases 0 to 11) | **104**, 91 of them new |
| JavaScript and TypeScript files | 1,776 | **4,956** |
| Test files | about 50, and the test runner wouldn't start | **1,502** |
| Releases | none | **12** (v0.1.0 to v0.2.4) |
| Lessons in Claude's memory | none | **1,067** |

About 2.7 million lines added and 1.1 million removed, docs included. 3,642 of those commits are co-authored by Claude.

Big numbers aren't the point, though. How it was done is: a human map first, then docs, then one task at a time, for two months straight.

The code is on GitHub: [The-Low-Code-Foundation/NodeGX](https://github.com/The-Low-Code-Foundation/NodeGX).

---

## What NodeGX is

You build apps by wiring boxes together on a canvas instead of writing code. A box might be a button, a database query or a bit of logic, and the lines between them carry data and events. Behind the canvas sit an Electron editor, a runtime, a React viewer and a cloud backend.

---

## How it got here

### 2024: Noodl closes

Noodl was a commercial no-code product with a loyal community. In 2024 the company behind it closed down. They released the code as open source, with a plan for how the codebase would be looked after.

That follow-up never really happened. To be fair to them, I don't think the community helped. Nobody stepped up to develop it, and nobody could pay a developer to do it for them. Either way, a lot of people had apps built on a tool that suddenly had no one behind it.

### Keeping it alive

So we set up [The Low Code Foundation](https://www.helloasso.com/associations/the-low-code-foundation), a French charity, and kept a fork of the Noodl code alive. We made some very small fixes, mostly with help from early ChatGPT. That was about as far as AI could take a codebase this size back then. The aim was simple: keep the no-code dream going.

### Then AI changed the question

Then Claude got good. Very good. People who once would have reached for a no-code tool started vibe coding instead: describe the app, get the code. The Noodl community went quiet. No-code editors in general started to feel like yesterday's idea, and some shut down altogether.

From December 2025 we tried to revive it and keep it relevant. That was the Cline sprint (see below). But by January the Claude models were so capable that vibe coding had overtaken no-code editors, and in February the push stalled.

### July: the twist

By July the models had got so much better that the question flipped. It wasn't "no-code or AI?" any more. **NodeGX could be the harness for the AI.**

Claude builds the app. You see it as a graph of boxes and wires, and you can open it, understand it and change it yourself. Your apps stop being piles of code only Claude understands. That's why so much of the work since July went into letting AI agents build directly in NodeGX, and into making projects readable by both people and Claude.

That's the moment this case study starts.

### What I was afraid of

Before starting, I wrote down my worry in plain words for Claude. I thought the codebase was:

> "a mishmash of decades of different dev styles, directions, additions and subtractions that might be beyond saving. A mix of jQuery and TypeScript and who knows what all trying to live together in harmony. A monster of dependencies, most of which are dangerously out of date."

I asked Fable to check that with evidence before we committed to anything.

---

## The human who mapped it first

Claude didn't walk into an unknown codebase cold. Before any of this, **[Axel Wretman](https://github.com/SgtSpork)** did the groundwork. He's an expert developer based in Sweden. He brought the Node and React versions up to date, cleaned up some of the type hacks, and worked out how the whole thing fitted together. His changes and his understanding of the codebase became the base the dev docs were written on.

That matters. A map from someone who really understands the code turns "please fix this huge thing" into a list of jobs Claude can actually do. If you've got a legacy codebase of your own and want an expert to look at it, Axel is well worth talking to.

Two other developers built pieces Claude later leaned on heavily. **dishant-kumar-thakur** wrote the schemas and the export and import engines for the new project format. **Tara West** built the styles subsystem.

::: info About that earlier sprint
Between December 2025 and February 2026 there was a first push using Cline, running on Claude models. It produced the codebase map, a roadmap for phases 0 to 11 and about 450 doc files. Then it stalled. I'd have got the same result with Claude Code. The tool matters less than the docs.
:::

---

## Where it stood in July

Fable's first job was a viability report. The verdict:

> **"Can Noodl be saved? Yes. Disposition: Alive-needs-refocus."**

My feared "mishmash" turned out to be jQuery in 14 files, in one package, behind clear boundaries. React 19 and TypeScript 5.9 had already landed in the earlier sprint. The real debts were an Electron version 12 major releases behind, an untyped runtime, 96 security warnings from npm (7 critical), and a test harness that wouldn't boot.

The report's summary is my favourite line in the whole repo: **"mid-flight, not decayed."** Everything that looked broken was a job someone had stopped halfway through, not rot. That changed how we approached it. Finish things, don't rewrite them.

The first commit after that was literally called "the reanimation commit". v0.1.0 was tagged the next day.

---

## Two months, in six stretches

1. **22 July: reanimation.** Fable's viability report and a new roadmap. The editor builds again.
2. **23 July to 2 August: the foundations.** A new project format, an MCP server so AI agents can build NodeGX apps directly, git that understands the app graph, and runtime health checks.
3. **3 to 21 August: alpha, and AI authoring.** Releases v0.1.1 to v0.2.0. Up to 206 commits in a single day.
4. **22 August to 7 September: the big features.** A component library, a site builder, templates, and code export, shipped in v0.2.2.
5. **9 to 21 September: real use.** Templates tested by real people, including [Rocket School](/part-6/case-studies#rocket-school-a-game-tested-by-a-robot-and-a-grown-up), a maths and typing game with background play tests after every change.
6. **Throughout: tests and docs.** Test files went from about 50 to 1,502. Every phase got a README, task files, a progress log and a handoff.

---

## The format change: rewriting what every project is made of

Every Noodl project was one enormous `project.json` file. Every page, every box, every wire, all in one place. That's fine for the editor. It's terrible for anything else. An AI had to take in the whole file to change one button, and a git diff of a small change was unreadable.

The new format splits a project into a folder: a small project file, then a folder per component with its boxes and wires in separate files, plus a registry. Now Claude can open one page without reading the rest, and a diff shows what actually changed.

Changing the format under a live product is the kind of job that makes developers nervous, because every existing project was written in the old one. It went in stages:

- dishant's format engines already existed, but nothing in the app called them yet. **Opus** wired them into the editor.
- **Fable** built the migrator: a safe, reversible engine that turns an old project into the new format, with a backup to roll back to.
- Old projects keep saving in the old format until someone chooses to migrate. New projects are created in the new one.

The whole phase was done by 30 July, eight days after we started.

---

## Code export: the thing nobody thought was worth it

NodeGX apps run on the NodeGX runtime. People had long asked for the obvious thing: "can I export my app as normal code and walk away?"

The answer from the Noodl team and the community, as I remember it, was that you'd always need a layer of Noodl's runtime shipped along with the exported code. The scale of the job put everyone off, more than the difficulty. The project's own study from December 2025 said the same thing in writing:

> "We could spend a year building a compiler that produces questionable code for edge cases, or we could spend a few weeks building an export tool that's honest about what it can and can't do."

What shipped, in about seven weeks:

- **Export as React code.** One menu item produces a normal React and Vite project that builds on its own and talks to your deployed backend.
- **117 of 127 placeable node types export (92.1%).** The other 10 are deliberately out of scope, and the docs say why for each one.
- **The "layer of Noodl" people predicted is real, but tiny.** It's `@nodegx/core`, a small package that keeps the graph's behaviour in plain React. It's **2.8 KB gzipped**, against a budget of 8 KB that the build enforces.

It wasn't a straight line. The phase README records that it was re-scoped after "twelve sessions built the wrong thing well". Twelve sessions of good-looking work pointed at the wrong target. The docs caught it, the plan changed, and the next stretch went in the right direction. That's the method working, not failing.

---

## Fable and Opus: who did what

The commits say which model co-wrote them:

| Model | Commits | What it did |
|---|---|---|
| **Opus 5** | 3,084 | Almost all the building. Features, fixes, tests, docs. |
| **Fable 5 and 5.1** | 333 | The hard thinking. The viability report, the format migrator, the MCP server design, most of code export, the node library audit, template defects. |
| **Opus 4.8** | 172 | The first weeks, before Opus 5. Wiring in the new format. |
| **Sonnet 5** | 50 | Smaller, well-specified tasks. |

That's the pattern I describe in [Plans & Limits](/part-0/plans-and-limits). Opus does the daily work. Fable comes in when the problem is fundamental.

---

## How it actually worked

Nothing exotic. Everything else in this guide, done at scale:

- **Docs first.** Every phase has a README (who it's for, what order, when it's done), task files with a recommended model, a progress log and one handoff for the next session. About 1,440 task files since July.
- **One task per session.** Each session gets one job and a handoff at the end. I rarely hit the context limit.
- **Memory that learns.** 1,067 lessons, one per file, each with a **Why** and a **How to apply**, and an index Claude reads at the start of every session. When Claude got something wrong, the fix went into memory so it didn't happen again.
- **Proof before done.** Tests, headless browser runs and screenshots. And for anything a person uses, a person replays it before it closes.
- **Parallel work where it was safe.** On one phase, six agents built seven tasks at once, each in its own copy of the repo.
- **Rulings via artifacts.** When Claude needed me to decide several things, it built a page with the options. I clicked, and the answers went back to Claude Code.

My job was the talking, the deciding and the testing. Claude's job was pretty much everything else.

---

## What it teaches

- **Get a human map first.** Claude is very good at working through a big codebase, but it goes much faster from a map made by someone who understands it. Axel's groundwork is why the first week wasn't spent guessing.
- **Ask whether it can be saved before you save it.** A day spent on an honest viability report set the direction for two months.
- **"Mid-flight, not decayed."** Old code often looks worse than it is. Finish what was started before you rewrite anything.
- **Save your best model for the hardest problems.** Opus is on about 90% of the commits. Fable cracked the problems that had stopped people for years.
- **The docs grow with the work.** More than 2,000 doc files now. They need length rules, or they bury you. See [Documentation Architecture](/part-2/documentation-architecture).
- **Honest failures belong in the docs.** "Twelve sessions built the wrong thing well" is written down in the repo. That's why it didn't happen a third time.

---

**More case studies:** [Case Studies](/part-6/case-studies)
