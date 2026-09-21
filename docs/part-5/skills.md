---
title: Skills
description: Write an instruction once, reuse it forever. The skills worth making early, starting with one that stops Claude sounding like Claude.
---

# Skills

## TLDR

A skill is a folder with a `SKILL.md` file in it. The file holds instructions for one job, plus a short description of when to use it. Claude loads the skill when the job comes up, or you call it yourself by typing `/skill-name`.

The first three I'd make:

1. **A copywriting skill.** Claude's prose is recognisable, and not in a good way. Fix that before you write a single page of copy.
2. **Handoff skills.** `/next` closes a session and writes a handoff. `/next-go` picks it up in a fresh one.
3. **A skill to launch and inspect your app,** once starting it takes more than one command.

The rule for when to make one: if you've typed the same instructions three times, it's a skill.

---

## What a skill looks like

A skill lives in one of two places:

| Where | Who gets it |
|-------|-------------|
| `~/.claude/skills/<name>/SKILL.md` | You, in every project |
| `.claude/skills/<name>/SKILL.md` | Everyone working on this project |

The file starts with a small header, then plain instructions:

```markdown
---
name: release-notes
description: Write release notes from recent changes. Use when asked for release notes or a changelog entry.
---

Read the commits since the last release.
Group them into New, Fixed and Changed.
Write for customers, not developers. No commit hashes.
```

The `description` is the important bit. It's what Claude reads to decide whether this skill fits the job in front of it, so say plainly what it does and when to use it. The `name` is optional and defaults to the folder name.

You don't have to make the folder yourself. Tell Claude what you keep repeating and ask it to turn that into a skill. That works just as well in the desktop app's Code tab as in a terminal.

::: tip Old-style commands still work
You may see `.claude/commands/<name>.md` files in older projects. Those still run as slash commands. Skills are the newer, preferred format, so make new ones as skills.
:::

---

## Skill one: copywriting

Claude writes code well. Its prose gives it away. Long dashes everywhere. Everything is a "game-changer". Every list has exactly three items. A settings page gets written up like a film trailer. Anyone who has read enough AI text spots it in a sentence, and your customers have read plenty.

So the first skill I set up on any project is a copywriting skill. It's your house voice, written down once, and loaded whenever Claude writes anything a human will read: page copy, emails, error messages, release notes.

A short one to start from:

```markdown
---
name: copywriting
description: House voice for any text a customer or user will read. Use when writing or editing page copy, emails, UI text, error messages or docs.
---

# Voice

- Plain words, short sentences. If a sentence needs a second comma, split it.
- British spelling.
- No long dashes (the em dash). Use a full stop, comma, colon or brackets.
- No hype words: game-changer, unlock, supercharge, seamless, powerful.
- No "It's not X, it's Y". No list of three unless there really are three.
- Say what the thing does for the reader. Skip the build-up.

# Before you finish

Search your draft for the em dash character and remove every one.
Read it once more and cut anything a real person wouldn't say out loud.
```

Make it yours. Add the words your brand uses and the ones it never does. Paste in a paragraph you like and write "sound like this". When Claude slips, add the slip to the list. The skill gets better every time you correct it.

---

## Skills two and three: handing off between sessions

I run one task per session. When a task is done, or a session gets long, I want to close it cleanly and start fresh without losing the thread. Two skills do that.

**`/next`** closes out the session. It works out what the session was doing, then writes a handoff note: what's finished, what's only written but not yet seen working, what was decided and why, and what to do next in order. Anything that needs a human decision goes in its own list, so the next session doesn't guess.

**`/next-go`** runs in a cleared session. It reads the handoff and carries on from the "what to do next" list. It treats every claim in the handoff as something to check, because a handoff can be confidently wrong. It leaves the human-decision items for you.

A cut-down version of the first one:

```markdown
---
name: next
description: Close out this session and write a handoff for a cleared session.
---

1. Name the task this session worked on.
2. Find its handoff file. If there isn't one, write it now.
   Overwrite it. Don't add a dated copy next to it.
3. The handoff must say:
   - what is done and seen working, versus only written
   - what was decided, including where the plan turned out wrong
   - what to do next, in order
   - what needs a human decision, listed separately
4. Tell me to run /clear, then /next-go.
```

::: tip One handoff file, overwritten
A folder full of `HANDOVER-SESSION-1.md` to `HANDOVER-SESSION-18.md` is the pattern to avoid. Keep one handoff per task or phase and overwrite it each time. [Context Management](/part-5/context-management) covers sessions and handoffs in more detail.
:::

---

## A skill to launch and inspect the app

Once your app has a back end, a database and a build step, "start the app and check it works" stops being one command. Claude will work it out each time, slowly and a little differently. Write it down once.

In OpenNoodl (my visual app builder, which is a desktop app) there's a skill called `run-editor`. Its description tells Claude to use it whenever it's asked to run, debug or screenshot the editor, or to confirm a change works in the real app and not only in tests. Inside it covers:

- **How to launch** the full stack in the background, and how long to wait before it's ready.
- **How to stop it** cleanly, and a firm rule to always stop it when finished.
- **How to inspect it without looking at it:** run code in the page, stream the console and errors, take screenshots, read what's on screen, click buttons.
- **The traps** that have bitten before, written as short warnings.

The result is that Claude checks its own work in the real app, headlessly, in the background, and shows me a screenshot. I don't watch a browser.

Yours can be much smaller. How to start the app, which address it runs on, how to run the tests, how to stop it. Ten lines is a fine start.

::: everything Where this pays off most
This is the skill that makes headless browser tests practical. If your CLAUDE.md asks for browser tests as well as back-end tests (it should), a launch skill means Claude can run them without asking you how to start anything. See [Testing](/part-4/testing).
:::

---

## When to make a skill

**Three times.** The third time you type the same instructions, stop and ask Claude to make a skill from them.

Good candidates:

- Anything with a voice or a house style.
- Anything with steps you always forget one of, or do at the start or end of every session.

Bad candidates are one-off jobs and rules that apply to everything. A rule that applies to every session belongs in CLAUDE.md instead. [Prompt Library](/part-6/prompts) marks the prompts worth turning into skills.

::: warning Keep skills short too
The same problem that hits docs hits skills: they grow. When a skill passes a page or two, ask Claude to trim it back to what actually changes its behaviour.
:::

---

## What to add to CLAUDE.md

```markdown
## Skills
- Use the copywriting skill for any text a user will read.
- If I give you the same instructions a third time, offer to turn them into a skill.
- Use /next to close a session. Keep one handoff file per task and overwrite it.
```

---

**Next:** [Common Pitfalls](/part-5/pitfalls-recovery).
