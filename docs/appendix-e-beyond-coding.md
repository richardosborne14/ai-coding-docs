---
title: Appendix E - Beyond Coding
description: Using the same method for courses, campaigns, process docs and research, with a worked example built in Claude Code and Cowork
---

# Appendix E: Beyond Coding

## TLDR

This method isn't really about code. It's about getting something big and complicated out of an AI without it turning to mush. That problem shows up everywhere: courses, marketing, process docs, research.

The same moves work in every one of them:

- Talk it through before you make anything.
- Build one small piece and check it before you build forty.
- Write down the standards, so every session works to the same rules.
- One piece of work per session.
- Score each piece honestly, and have an expert audit the batch.

Only the vocabulary changes. Code becomes lessons. Tests become assessments. Deploying becomes delivering to students.

---

## Why it works outside code

Ask an AI for a whole 40-hour course in one go and you get the course equivalent of a demo app. It looks complete. The activities don't connect, the grammar doesn't build from one lesson to the next, and you spend 50 hours fixing it. You'd have been quicker writing it yourself.

The causes are the same as in software:

- The job is too big for one conversation.
- Nothing checks the quality, so mediocre work sails through.
- Nobody wrote the decisions down, so each session reinvents them.
- Nothing gets tested until the end, when everything is wrong at once.

So are the fixes:

| Idea | In code | In a course | In marketing |
|------|---------|-------------|--------------|
| Small first | One core feature | One pilot lesson | One week on one channel |
| Written standards | CLAUDE.md, ARCHITECTURE.md | Teaching approach, lesson template | Brand voice, audience personas |
| Confidence score | Does it work? Tests pass? | Does it hit the learning objective? | On brand? Clear call to action? |
| Audit | A senior developer | An experienced teacher | The brand manager |
| One task per session | One feature | One activity | One asset |

---

## Worked example: a Business French course

This is my other trade: interactive language training. Here's the method applied to it, start to finish.

### The trap

A training company wants a 40-hour Business French course: interactive activities, grammar adapted to level, cultural notes, pronunciation, real business scenarios, assessments, progress tracking, and content tailored to each learner's industry.

The usual approach is one big prompt. The AI produces a generic outline and activities that don't build on each other. The trainer finds out what's wrong only after reviewing all of it.

### Step 1: talk it through

> **Where:** Claude Chat, Opus. Chat knows you, which helps here.

```markdown
I want to create a 40-hour Business French course for professionals.

The full vision:
- 20 lessons of 2 hours
- Interactive HTML activities (drag and drop, fill the gap, matching)
- Grammar from A2 to B2
- Business scenarios: meetings, presentations, emails, negotiations
- Industry vocabulary (finance, tech, healthcare)
- Cultural notes, pronunciation, assessments, personalisation

My situation:
- I'm an experienced language trainer. I don't code.
- I need a pilot lesson to test with learners soon.
- Delivery: HTML activities and PDF handouts, through our LMS.

Don't plan it yet. Talk it through with me. What's the core value?
What's the smallest thing that would prove it works? What am I missing?
```

After a few rounds, the useful answer looks like this:

```markdown
## Core value
One coherent lesson that teaches one business skill through
interactive activities with grammar support. Everything else is
an extension of that.

## Pilot: one 2-hour lesson, "Taking part in a business meeting" (B1)
- Grammar: pouvoir, devoir, falloir for making suggestions
- 20 meeting terms
- Four activities: vocabulary warm-up, grammar practice,
  reading a meeting transcript, a role-play
- Support: one-page grammar sheet, vocabulary list, a paragraph
  on French meeting etiquette
- Assessment: a 5-question quiz and a self-assessment rubric

## Deferred
- The other 19 lessons (only if the pilot works)
- Industry versions, audio, personalisation, LMS packaging,
  progress tracking, the final exam

## Success looks like
An experienced trainer reviews it and says "this would work
with real students".

## Questions for you
1. Is one pilot lesson enough to tell?
2. Is "meetings" the right topic to start with?
3. Anything I deferred that you can't live without?
```

That cut is the most valuable thing in the whole process. Nineteen lessons just moved to "later", and nobody had to argue about them.

### Step 2: mock up one activity

Before writing anything, ask [Claude Design](/part-2/mockups-first) to mock up what one activity looks like on a laptop and a phone. Push it until you'd be happy to put it in front of a learner. It's much cheaper to argue about a mockup than about 200 lines of finished HTML.

### Step 3: write the standards down

The coding documents all have a course equivalent:

| Code project | Course project |
|--------------|----------------|
| README.md | COURSE_VISION.md |
| Sprint plan | CURRICULUM_ROADMAP.md |
| CLAUDE.md rules | CONTENT_STANDARDS.md |
| TASK_TEMPLATE.md | ACTIVITY_TEMPLATE.md |
| LEARNINGS.md | LEARNINGS.md (same idea) |

Put them all in one project folder. If you build in Claude Code, add a short CLAUDE.md that says who you are and tells it to read CONTENT_STANDARDS.md before every task. (Claude Code can pull a file in with `@CONTENT_STANDARDS.md`.)

**CURRICULUM_ROADMAP.md** breaks the pilot into small tasks:

```markdown
## Pilot lesson

### Phase 1: Teaching framework
- 1.1 Teaching principles
- 1.2 Lesson template
- 1.3 Activity standards

### Phase 2: Lesson structure
- 2.1 Learning objectives
- 2.2 Vocabulary (20 terms)
- 2.3 Grammar progression
- 2.4 Activity sequence

### Phase 3: Activities
- 3.1 Vocabulary warm-up (matching)
- 3.2 Grammar practice (fill the gap)
- 3.3 Reading: meeting transcript
- 3.4 Role-play prompts

### Phase 4: Support materials
- 4.1 Grammar sheet   4.2 Vocabulary list   4.3 Cultural notes

### Phase 5: Assessment and review
- 5.1 Quiz   5.2 Self-assessment rubric   5.3 Pilot review
```

**CONTENT_STANDARDS.md** does the job CLAUDE.md's unbreakable rules do in code:

```markdown
# Content standards

## Every activity must
- Have one clear learning objective, tied to a CEFR descriptor
- Use a real business situation
- Scaffold: support first, then independence
- Give immediate feedback that teaches, not just "right/wrong"
- Fit B1 and take 15 to 30 minutes

## French
- Natural, current French in a business register
- Instructions in French, at B1 level
- No false friends, no cultural mistakes

## HTML activities
- One self-contained file, no outside dependencies
- Works on a phone
- Keyboard-friendly and screen-reader friendly

## Confidence score (8/10 minimum)
Objective met, instructions clear, French correct, culture accurate,
it works, and the timing is realistic.

## Ask me before going on if
- You're unsure the level is right
- A cultural point might be wrong
- A grammar explanation feels unclear
- Your score is below 8
```

**ACTIVITY_TEMPLATE.md** is the task file for one activity: objective, level, type, time, the business situation, the instructions learners will see, the content, the feedback, the scaffolding, then tests (does it work on a phone? is it doable in the time?) and the confidence score with evidence.

**LEARNINGS.md** catches what you'd otherwise rediscover every session:

```markdown
## Vocabulary matching
Learners get lost with more than 10 items.
Fix: two sets of 8, grouped by theme.

## Grammar
B1 learners need the example before the rule.
Always: example, pattern, rule, practice.

## Drag and drop
Native drag and drop is poor for keyboard users.
Fix: click to select, with keyboard support.

## "Réunion" or "rendez-vous"?
"Réunion" for internal meetings, "rendez-vous" for clients.
Check every meeting activity for this.
```

### Step 4: build it, one task per session

Here the work splits in two, and so do the tools.

**The interactive activities are code**, even if they're small. Build them in Claude Code. In the desktop app, that's the Code tab: no terminal, and the activity opens in the Browser pane so you can click through it as it's built.

**The documents** (the grammar sheet, the vocabulary list, the cultural notes, the rubric) aren't code. Claude Code can write them fine. So can **Cowork**, the desktop app's tab for general work on your files, and if you already do your document work there, stay there. Cowork shares Chat's memory, so it already knows you. Start each Cowork session by pointing it at the project folder and telling it to read CONTENT_STANDARDS.md first.

Either way: a fresh session per task, and a plan before anything gets made.

**Task 3.1 in Claude Code:**

```
Plan task 3.1: the vocabulary warm-up.
Read CURRICULUM_ROADMAP.md, ACTIVITY_TEMPLATE.md and LEARNINGS.md first.
```

**The plan that comes back (shortened):**

```markdown
# Plan: vocabulary warm-up

## Vocabulary
8 terms, not 10 (LEARNINGS says more than 10 loses people).
Nouns first, then verbs.
l'ordre du jour, le compte-rendu, la réunion, le participant,
présider, convoquer, reporter, prendre des notes

## Design
French term to English meaning. Click to select (LEARNINGS:
drag and drop is poor on a keyboard). Order shuffled each time.
A "Check" button rather than instant marking, so learners think first.
Feedback shows the right answer and a short encouraging line.

## Build
One HTML file, no dependencies. Works on a phone.
Keyboard navigation and screen-reader labels.

## Checks
A headless browser run at laptop and phone width: complete it
by keyboard only, screenshot each state, and I'll look at the shots.

## Confidence target: 8/10

## Questions
1. Instructions in French only? (I'd say yes, it's B1.)
2. One worked example at the top? (I'd say yes.)
```

**Read it before you say yes.** The plan is where you catch "that term is too formal for B1" or "we said 8, not 10". Once you've answered:

```
French only is fine. Yes to the example. Go ahead.
```

Claude builds the file, runs the check in the background, looks at the screenshots, scores it, and notes anything new in LEARNINGS.md. You open it in the Browser pane and try it yourself. It isn't done until you have.

### Step 5: audit the pilot

When all four activities are done, open a fresh session that didn't build any of it, and ask for a proper review:

```markdown
You're a Business French teacher with 10 years' experience.
Review the pilot lesson in this folder: four activities and their support material.

Check:
1. Teaching: clear objectives, sensible scaffolding
2. Level: is it really B1?
3. Culture: are the business situations accurate?
4. Sequence: does each activity build on the last?
5. French: natural and correct?
6. Would learners stay interested?

Score it out of 10. Below 9, give me specific fix tasks.
```

A typical result:

```markdown
## Score: 8/10

Strengths: clear objectives, good progression, natural French.

Fix before the pilot:
- A: "le procès-verbal" is too formal for B1. Swap it for "prendre des notes".
- B: The modal verbs explanation assumes the subjunctive. Keep it indicative.
- C: Four role-play scenarios is too many for 40 minutes. Keep the best two.
- D: The note on "tu" at work needs two lines on when it's acceptable.

Expected after fixes: 9/10.
```

Each fix is a small task in its own session. Then a real trainer reviews it, and then real learners try it. That's your deploy.

---

## Other domains, briefly

### Marketing

**The trap:** "A year of content for five channels." Overwhelming, inconsistent, generic.
**Small first:** one week on one channel, to prove the tone works.
**Standards:** brand voice, audience personas, content pillars, a post template, a learnings log.
**Score:** on brand? Clear call to action? Evidence from similar posts?
**Audit:** the brand manager reviews the week before anything scales.

### Process documentation

**The trap:** "Document all our processes." It never finishes, and it's out of date by the time it does.
**Small first:** one critical process, fully written up with a flowchart.
**Standards:** how we document a process, a glossary, a process template.
**Score:** checked with the team? Do the people involved understand the flowchart? Are the usual exceptions covered?
**Audit:** the process owner signs it off before the next one starts.

### A research literature review

**The trap:** "Review 200 papers." The analysis drifts and the connections get missed.
**Small first:** 20 papers, properly analysed against a framework.
**Standards:** what we're looking for, how each paper is analysed, how papers link up.
**Score:** key findings pulled out? Limits noted? Links to other papers found?
**Audit:** a senior researcher reviews the first 20 before you go to 200.

---

## Adapting it to your field

1. **Name your "code".** What are you actually making? Lessons, campaigns, reports, processes.
2. **Say what "good" means.** Write the criteria down. That's your standards file, and it's the most important document you'll write.
3. **Map the documents.** Vision, roadmap, standards, a template for one unit of work, a learnings log.
4. **Define 8/10.** Five or six checks a piece of work must pass before you move on.
5. **Find your auditor.** Who in your field would spot what's wrong? If you can't get that person, have a fresh Claude session play them. Then get the person anyway before it goes live.
6. **Keep the loop.** One piece per session: plan, make, check, score, note what you learned.

A blank to fill in:

```markdown
# [Your project]

What I'm making:
What "good" looks like:
Who reviews it:

Full vision:
The small first version (a few weeks at most):
How I'll know it worked:

| Purpose | File | What goes in it |
|---------|------|-----------------|
| Vision | | |
| Roadmap | | |
| Standards | | |
| One unit of work | | |
| Learnings | | |

8/10 means:
-
-
-
```

---

::: tip It works for me in both trades
I use this for software (RISE, Rocket School, client apps) and for language training (lessons and interactive activities). Same process, different output.
:::

::: warning The real test
If your project is too big for one conversation and has lots of parts that depend on each other, this method will help, whatever the field. It's about managing complexity. The code is just where I learned it.
:::
