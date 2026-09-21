---
title: Common Pitfalls
description: What actually goes wrong when you build with Claude, and how to get back on track
---

# Common Pitfalls

## TLDR

The problems I actually hit aren't the ones people warn you about. Claude rarely claims a job is done when it isn't. It rarely forgets things, as long as you keep to one task per session. What goes wrong is duller than that:

- **The docs get too long.** Claude reads everything, so bloated docs slow it down and muddy its thinking.
- **Claude is too careful.** It avoids things it should be recommending, and you have to push.
- **You don't read the plan.** You say "just do it", then don't like what you get.

Then there are the traps from real projects: the deploy that says it worked when it didn't, the server that quietly fills its disk, and the bug that keeps coming back.

The recovery for most of them is the same: stop, write it down, start a fresh session.

---

## Pitfall 1: The docs get too long

**What happens:** Every session adds a little. A learnings file here, a note there, a phase plan that nobody archives. Six weeks in, CLAUDE.md is 600 lines and the learnings file is 2,000. Claude reads all of it every time. The rule that matters is buried under forty that don't, and Claude starts missing things.

I've watched this happen on my own projects. One learnings file passed 2,000 lines before anyone stopped it.

**Signs:**
- Claude ignores a rule that is definitely written down.
- Sessions take longer to get going.
- You can't find anything in your own docs.
- Old phase plans still sit next to the current one.

**Recovery:** Give it a session of its own. Ask Claude to:
1. Summarise anything long into its main points.
2. Split big files by topic, with a short index that points to each part.
3. Move finished phases and old notes into an `archive/` folder that Claude doesn't read by default.
4. Turn anything it keeps relearning into a short rule.

**Prevention:** Put length rules in CLAUDE.md from day one. Tell Claude how long each doc may grow before it has to condense, split or archive. [Project Memory](/part-5/project-memory) covers how to keep memory small as a project grows.

---

## Pitfall 2: Claude is too careful

**What happens:** You'd think the risk is Claude going wild. In my experience it's the opposite. Claude plays it safe. It won't suggest you SSH into your server to look at the logs. It builds with fake sample data when real data would show the bug in a second. It asks permission for things you'd happily let it do. It solves exactly what you asked and doesn't mention the bigger problem sitting next to it.

**Signs:**
- Every answer ends with a question back to you.
- It works around a problem instead of looking at it directly.
- You find out about an obvious improvement weeks later, by yourself.

**Recovery:** Push. Ask it straight out:
- "What would you do if this were your project?"
- "What am I not asking that I should be?"
- "Would it be faster to SSH in and look?"
- "Can we test this with real data instead of a fake set?"

It usually has a good answer. It was waiting to be asked.

**Prevention:** Write down in CLAUDE.md how techie you are and how much initiative you want. If you're happy for Claude to suggest server access, real data or a bigger rethink, say so. See [Documentation Architecture](/part-2/documentation-architecture).

---

## Pitfall 3: You didn't read the plan

**What happens:** Claude writes a careful plan. It's long, so you skim it and type "just do it". Claude does exactly what the plan said. Then you look at the result and it isn't what you wanted. The plan told you so. You didn't read it.

I'd call this the most common failure of all, and it's a human one.

**Signs:**
- "That's not what I meant" after a task Claude marked as done.
- The plan had a line you'd have objected to, if you'd seen it.
- Rework on something that was never discussed.

**Recovery:** Go back to the plan and find the line where it went wrong. Fix the plan, then fix the code. Don't just say "no, redo it".

**Prevention:**
- Read the plan. If it's too long to read, ask Claude to shorten it to what matters.
- When a plan needs you to decide several things, ask Claude for an artifact you can click through. Your answers come back to Claude Code, and you can't skip a question without noticing.
- Ask Claude to put anything that changes what you'll see at the top of the plan.

---

## Pitfall 4: The same error three times

**What happens:** A bug. Claude tries a fix. The error comes back. Another fix, same error, or a slightly different one. By the fourth attempt Claude is guessing, and the conversation is full of failed attempts that keep pulling it back the same way.

**The rule: same error three times, stop.**

**Recovery:**
1. Ask Claude to write a research task file: what the problem is, what was tried and why each attempt failed, what's still unknown, and what to look into next.
2. End the session.
3. Start a fresh session with that file. Tell it to research before it touches any code.

A fresh session that starts from a clear write-up often solves in minutes what the old one couldn't solve in an hour. For a really stubborn one, I run the research task on Fable instead of Opus.

**Prevention:** Put the three-strikes rule in CLAUDE.md, so Claude stops itself.

---

## Pitfall 5: The side-task spiral

**What happens:** You're working on login. Claude notices the header is broken. "Quick fix while I'm here." The quick fix turns up a deeper problem. An hour later you're refactoring something else and login is half done.

**Recovery:** Stop. Ask Claude to write a task file for the side issue. Get back to login. Do the side issue in its own session.

**Prevention:** When Claude spots something outside the current task: "Good catch. Write a task file for it. Let's finish this first." [Context Management](/part-5/context-management) covers one task per session.

---

## Pitfall 6: The phantom deploy

**What happens:** You deploy. The output says success. The health check passes. Claude reports the deploy is done. But the old code is still running. Every signal says success, which is why it's so hard to catch.

**Why:** There are plenty of ways a deploy can fail silently. The image tag doesn't match. Docker used a cached layer. The build never ran. Each one still prints "success". A health check only asks "is something running?". It doesn't ask "is the right version running?". A container with months-old code passes it perfectly.

Claude reads "Started" in the output and reasonably concludes it worked. It has no way to know otherwise unless you give it one.

**Recovery:**
1. Add a build-info endpoint that returns the git commit baked into the build. See [Deploy Verification](/part-5/deploy-verification#the-build-info-pattern).
2. Add a rule to CLAUDE.md: Claude must check that endpoint and compare commits before it calls a deploy done.
3. Use the [deploy checklist](/part-5/deploy-verification#the-deploy-verification-checklist) every time.

**Prevention:** Never accept "container started" as proof. Check something that only the new code could return.

---

## Pitfall 7: The server disk fills up

**What happens:** After weeks of deploys that pull images onto the server, things start failing. Containers won't start. Logs stop. The database refuses writes. Nothing changed since the last deploy that worked.

**Signs:**
- `no space left on device` when containers start.
- `df -h /` shows 95% or more.

**Why:** Every pull downloads a new image, and Docker never deletes the old one. Each image might be a few hundred megabytes. Fifty deploys later, that adds up to many gigabytes of images you'll never use.

::: everything Terminal route
**Recovery:**
1. SSH into the server.
2. See the damage: `docker system df` and `df -h /`.
3. Remove unused images: `docker image prune -f`.
4. Still full? `docker system prune -f --filter "until=72h"`.
5. Check with `df -h /`, then `docker compose up -d`.

**Prevention:** Make `docker image prune -f` the last line of your deploy script. Add a weekly cleanup job as a backstop:

```bash
# /etc/cron.d/docker-cleanup (runs every Sunday at 3am)
0 3 * * 0 root docker system prune -f --filter "until=168h" >> /var/log/docker-prune.log 2>&1
```

Add `df -h /` to your deploy checklist. If it's above 80%, prune first. [Deployment Platforms](/part-5/deployment-platforms#docker-image-cleanup-the-silent-disk-killer) has the full pattern.
:::

---

## Pitfall 8: The groundhog-day bug

**What happens:** Three sessions, three attempts at the same bug. Each one tries much the same thing, hits the same wall and ends with a workaround. The bug comes back. Nobody asks why.

This is different from Pitfall 4. That one happens inside a session. This one happens across sessions, and you only notice if something remembers the earlier attempts.

**The real cause is often the instructions, not the code.** A rule in CLAUDE.md that no longer matches the code. An architecture doc describing how things worked two months ago. A lesson that's written down but never applied. Claude follows them faithfully, straight into the same wall.

**Recovery:** Ask for a self-audit. "We've tried to fix this three times. Before touching code, check CLAUDE.md, the architecture doc and your memory for anything that contradicts the code or might be steering us wrong." Fix the rule or the doc, then fix the bug.

**Prevention:** Keep [project memory](/part-5/project-memory) so the earlier attempts are on record, and give Claude a rule to suggest a self-audit when the same area fails twice.

---

## Quick recovery checklist

When a project feels off track:

1. Are my docs too long? Condense, split, archive.
2. Have I pushed Claude for its real opinion?
3. Did I actually read the plan?
4. Same error three times? Research task file, fresh session.
5. Am I on a side task? Task file, back to the main one.
6. Did the deploy really work? Check the build-info commit.
7. Is this the same bug as last week? Self-audit.

Most problems end the same way: **stop, write it down, start a fresh session.**

## What to add to CLAUDE.md

```markdown
## When things go wrong
- If the same error comes back three times, stop. Write a research task file and suggest a fresh session.
- If an area has failed in two sessions, suggest a self-audit of CLAUDE.md and the docs before more fixes.
- Recommend things even if I didn't ask: server access, real test data, a bigger rethink. Say why.
- Put anything that changes what I'll see at the top of every plan.
- Never call a deploy done until the build-info commit matches.
- Keep docs short. When a file passes its length limit, condense, split or archive it.
```

---

**Next:** [Project Memory](/part-5/project-memory)
