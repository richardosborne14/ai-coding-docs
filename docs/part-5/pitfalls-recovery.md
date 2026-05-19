---
title: Common Pitfalls
description: What goes wrong and how to recover
---

# Common Pitfalls

## TLDR

Even with solid methodology, things go wrong. The difference between a successful project and a failed one is recognizing problems early and knowing the recovery pattern — which is usually: stop, write a task doc, start fresh.

---

## Pitfall 1: The Side-Task Spiral

**What happens:**
You're working on auth. You notice the header component has a bug. "Quick fix while I'm here." The quick fix reveals a state management issue. Now you're refactoring stores while your auth task sits half-done.

**Signs:**
- Current task paused for "just one more thing"
- Conversation context includes 3+ unrelated topics
- You've lost track of what the original task was
- Token costs are climbing but progress isn't

**Recovery:**
Stop. Ask AI to write a task doc for the side issue. Get back to the original task. Handle the side issue in a fresh conversation.

**Prevention:**
When AI mentions something outside the current task: "Good catch. Write a task doc for it. Let's stay on [current task]."

**The rule:** You cannot be too strict about starting fresh conversations. It's 9/10 the better choice.

---

## Pitfall 2: Overloading Conversations

**What happens:**
You pile multiple unrelated tasks into one conversation. "While we're here, also fix X and add Y and refactor Z." The conversation balloons to 100+ messages. AI is confused. Every response costs a fortune in input tokens because it's processing the entire bloated history.

**Signs:**
- Conversation has been going for hours
- You're paying for context that's only 20% relevant
- AI is mixing up details from different tasks
- Quality of output is declining

**Recovery:**
Close the conversation. For each remaining task, start a fresh conversation with just the relevant context.

**Prevention:**
One task = one conversation. Always. The cost of reloading docs in a fresh conversation is trivial compared to carrying 80 messages of irrelevant context.

---

## Pitfall 3: Going in Circles on Bugs

**What happens:**
You hit a bug. AI suggests a fix. Doesn't work. Another fix. Still broken. New error. AI suggests reverting. You've been at this for an hour.

**Signs:**
- Same error keeps appearing or morphing
- Fixes create new bugs
- AI is guessing rather than reasoning
- You're frustrated and throwing tokens at it

**Recovery:**
1. Stop immediately
2. Ask AI to write a task doc: what was the problem, what was tried, what's the current state, what should be tried next
3. Start a completely fresh conversation with the task doc
4. The fresh conversation often solves it in minutes because it doesn't have failed attempts polluting its reasoning

**Prevention:**
Set a 30-minute rule. If a bug isn't solved in 30 minutes, the approach is wrong, not just the code. Stop, document, restart.

---

## Pitfall 4: Skipping Plan Mode for Fixes

**What happens:**
"It's just a small fix, I'll skip plan mode." AI dives in, makes changes, breaks something else, tries to fix that, cascade of changes.

**Signs:**
- "Quick fix" turned into 20 minutes of changes
- Files modified that weren't related to the original fix
- Tests that were passing now fail
- Scope of changes far exceeds what you expected

**Recovery:**
Revert the changes. Start fresh. Use plan mode.

**Prevention:**
Plan mode for fixes is MORE important than plan mode for new features. New features have a task spec guiding them. Fixes don't — plan mode is the only checkpoint.

---

## Pitfall 5: Scope Creep

**What happens:**
You're building login. AI suggests "while we're here, let's add password reset, OAuth, 2FA..." Three days later you're still on "authentication."

**Signs:**
- Tasks keep expanding
- "Quick additions" pile up
- Original timeline is blown
- MVP features keep growing

**Recovery:**
Return to your sprint plan. Is this task done as originally scoped? Yes → close it. New ideas → new tasks for later.

**Prevention:**
"Good idea. Add it to the backlog. For now, let's finish the original scope."

---

## Pitfall 6: Weak Documentation Leading to Bad Output

**What happens:**
Your .clinerules says "try to write tests." Your ARCHITECTURE.md has vague descriptions instead of schemas. AI takes the path of least resistance: skips tests, guesses at schemas, produces mediocre code.

**Signs:**
- AI output quality feels inconsistent
- Schema mismatches between what AI writes and what exists
- Tests are superficial or missing
- Different parts of the code use different patterns

**Recovery:**
Invest a session in strengthening your docs. Add real schemas to ARCHITECTURE.md. Make .clinerules iron-clad ("tests are mandatory" not "try to test"). Add patterns and conventions.

**Prevention:**
Invest in documentation quality upfront. The time spent writing thorough ARCHITECTURE.md and strict .clinerules pays back 50x in consistent AI output.

---

## Pitfall 7: Not Using Claude Projects for New Features

**What happens:**
You want to add a feature. Instead of going back to Claude with the repo synced in a Project, you just tell Cline "add feature X." Without the strategic brainstorming, the implementation is narrow, misses edge cases, and doesn't fit well with the existing architecture.

**Signs:**
- New feature feels bolted-on rather than integrated
- Architectural inconsistencies
- Missing pieces discovered during testing
- Rework needed to fit with existing code

**Recovery:**
Stop. Go to Claude (Opus, Project with repo synced). Have the brainstorming conversation. Generate proper task specs. Then execute.

**Prevention:**
New features always start with a conversation in Claude. Fixes and tweaks can go straight to Cline. Know the difference.

---

## Pitfall 8: Confidence Inflation

**What happens:**
AI rates everything 8/10. You don't verify. Later, bugs emerge in production.

**Signs:**
- Every task is 8/10+ with thin justification
- You're not manually testing
- "Tests pass" but tests are superficial
- Bugs appear during integration

**Recovery:**
For the next few tasks, verify everything yourself. Run the code. Try edge cases. Read the tests — do they test real behavior?

**Prevention:**
Trust but verify. AI's confidence score is a starting point. Your manual testing confirms it.

---

## Pitfall 9: The Phantom Deploy

**What it looks like:** You run a deploy. The output says success. Health checks pass. The AI declares "✅ Deploy complete." But the old code is still running. This is the hardest failure to catch because _every signal says success_.

**Why it happens:** There are at least nine ways a deploy can silently fail — image tag mismatches, Docker cache lies, CI builds that never triggered, bind-mount blind spots. Each one produces "success" output. The AI sees "success" and moves on. You see "success" and trust it.

**The core problem:** Health checks verify "is the process alive?" — not "is the _right_ process alive?" A container running months-old code passes health checks perfectly.

**How to recover:**
1. **Implement the build-info pattern** — a `/api/build-info` endpoint that returns the git SHA baked into the image. See [Deploy Verification — The Build-Info Pattern](/part-5/deploy-verification#the-build-info-pattern).
2. **Add AI deploy rules** to your `.clinerules` / `CLAUDE.md` — the AI must check `/api/build-info` and compare SHAs before declaring "done." See [Deploy Verification — AI Deploy Rules](/part-5/deploy-verification#ai-deploy-rules).
3. **Use the pre-flight checklist** before every deploy. See [Deploy Verification — The Deploy Verification Checklist](/part-5/deploy-verification#the-deploy-verification-checklist).

**Prevention:**
- Never trust "container started" as proof of a successful deploy
- Always verify with a code-level check (build-info SHA, grep a known string, check a version endpoint)
- Add `--force-recreate` to every registry-pull deploy command
- Check CI build status _before_ deploying, not after

::: tip
This pitfall is uniquely dangerous in AI-assisted workflows because the AI is _designed_ to report success confidently. It sees Docker output saying "Started" and concludes the deploy worked. The AI has no way to know the container is running old code unless you give it a verification mechanism.
:::

---

## Pitfall 10: Docker Disk Space Exhaustion

**What happens:**
After weeks or months of registry-pull deploys (e.g. pulling from GHCR on a Hetzner VM), the server runs out of disk space. Containers fail to start with errors like `no space left on device`. Logs stop writing. Builds fail halfway. Databases refuse new inserts. Everything was working perfectly on the last deploy — nothing obviously changed.

**Signs:**
- Containers unexpectedly failing to start or restart
- `docker compose up` exits with `no space left on device`
- Server logs stop updating
- CI pulls succeed but the container won't run
- `df -h /` shows 95%+ disk usage

**Why it happens:**
Every `docker compose pull` downloads a new image but Docker never deletes the old one. Old images become "dangling" — no longer tagged, no longer used — but they stay on disk. Each image is typically 200–800MB. After 50 deploys, that's potentially 40GB of images you'll never use.

**Recovery:**
1. SSH into the server
2. Check the damage: `docker system df` and `df -h /`
3. Remove dangling images: `docker image prune -f`
4. If still full, remove all unused resources: `docker system prune -f --filter "until=72h"`
5. Verify free space is restored: `df -h /`
6. Restart containers: `docker compose up -d`

**Prevention:**
Add `docker image prune -f` as the last line of every deploy script. Add a weekly cleanup cron job to catch anything that slips through:

```bash
# /etc/cron.d/docker-cleanup — runs every Sunday at 3am
0 3 * * 0 root docker system prune -f --filter "until=168h" >> /var/log/docker-prune.log 2>&1
```

Add disk space to your pre-deploy checklist: `df -h /` — if above 80%, prune before pulling.

See [Docker Image Cleanup: The Silent Disk Killer](/part-5/deployment-platforms#docker-image-cleanup-the-silent-disk-killer) for the full pattern and cron setup.

---

## Pitfall 11: The Groundhog Day Bug

**What happens:**
You've had three separate Cline sessions trying to fix the same bug. Each session, Cline tries similar approaches, hits similar walls, and ends with a partial fix or workaround. There's no connection between sessions — Cline doesn't know it's been here before. It never occurs to Cline to question whether its own instructions or the project architecture might be the root cause.

**Signs:**
- Same bug keeps reappearing across multiple sessions
- Cline tries similar (failing) approaches each time
- The fix works temporarily but the problem comes back
- Nobody's questioning *why* this keeps happening

**Why it's different from Pitfall 3:**
Pitfall 3 (going in circles) is within a single session. The Groundhog Day Bug is across sessions — the kind of problem that only becomes visible when you have memory between conversations.

**Recovery:**
1. If you have the [MCP memory server](/part-5/project-memory) set up, `memory_check_patterns` will catch this automatically after 2+ failed sessions on the same area
2. Trigger a **self-audit**: Cline reviews `.clinerules`, `ARCHITECTURE.md`, `LEARNINGS.md`, and prior session solutions
3. The problem is often in the instructions, not the code — contradictory rules, outdated architecture docs, or a LEARNINGS.md entry that's not being applied
4. Fix the root cause (update rules/docs), not just the symptom

**Prevention:**
Set up [project memory](/part-5/project-memory). The self-audit trigger catches this pattern before it costs you five sessions instead of two.

---

## Pitfall 12: Dev-Docs Bloat

**What happens:**
Your project is on Sprint 4. The `dev-docs/` folder has 40+ files — old sprint plans, completed task specs, changelogs. You try to sync the repo with Claude Chat for a phase audit, but there's too much noise. The audit is shallow because Claude is processing 40 stale task docs alongside the 5 that matter.

**Signs:**
- `dev-docs/` folder has more than 15 files
- Claude Chat audits feel unfocused or surface-level
- You can't remember which sprint plan is current
- Old task docs that will never be referenced again still sit in the repo
- `.clineignore` has to exclude dev-docs to control token costs

**Recovery:**
1. Set up the [MCP memory server](/part-5/project-memory) and run `memory_archive_sprint` for completed sprints
2. Move completed sprint folders to `.archive/` or delete them (their content lives in the database)
3. Only the active sprint's materials should remain as markdown

**Prevention:**
Build document lifecycle management into your workflow from Sprint 1. When a sprint completes, archive it. See [Project Memory — The Document Lifecycle](/part-5/project-memory#the-document-lifecycle) for the full pattern.

---

## Quick Recovery Checklist

When a project feels off-track:

1. [ ] Am I in a conversation that's too long? → Start fresh
2. [ ] Am I working on a side task? → Write task doc, refocus
3. [ ] Am I going in circles? → Write task doc, start fresh
4. [ ] Are my docs up to date? → Quick review and update
5. [ ] Am I actually testing? → Be honest
6. [ ] Did I skip plan mode? → Go back to plan mode
7. [ ] Is scope still reasonable? → Check sprint plan
8. [ ] Did my deploy actually work? → Check `/api/build-info` SHA
9. [ ] Is this the same bug from a previous session? → Check project memory, trigger self-audit
10. [ ] Is my dev-docs folder bloated? → Archive completed sprints

Most problems resolve with: **stop, write a task doc, start a fresh conversation.**

---

**Next:** [Team Workflows](/part-5/team-workflows) — Adapting this for multiple people.
