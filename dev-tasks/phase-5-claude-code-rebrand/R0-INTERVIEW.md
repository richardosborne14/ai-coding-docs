# R0 — Interview with Richard (2026-09-21)

Answers recorded close to verbatim. These override anything in the old chapters. Where Richard asked a factual question, it is listed under **Open facts** with what was found. None of those findings are verified yet.

---

## Decisions (settled, don't re-ask)

| # | Question | Answer |
|---|----------|--------|
| D1 | Swearing on the live site | **Tone only.** Cheeky and confident, no swear words. |
| D2 | Cline | **Appendix.** One of many AI coding tools (also mention DeepSeek, Kimi Code, etc.). ~~Say it can use a Claude subscription~~ **Dropped by Richard: "forget Cline with Claude Code, it's a fringe case". Cline = pay-as-you-go pure API, fast; Claude Code = slow but cheap.** Be honest about the maths: pay-as-you-go API through Cline gets an app built about **4× faster but 10× more expensive**, so it's not advisable for about 90% of use cases right now. |
| D3 | Reader | **Two tracks.** The reader picks a track on the first page, and the site shows or hides content to match. Working names: *non-tech* (Claude Desktop / Chat / Cowork end to end) and *builder* (Claude Code). |
| D4 | digitalbricks.io link | Approved, then **"Ship the redesign"** once told that deploy.sh ships the new 12-page EN/FR site. Done this session (see TASK_INDEX). |
| D5 | Old `ai-coding.visualhive.co` | Not approved this session. Leave it. |
| D6 | Rename GitHub repo | Not approved this session. Leave it. |

## How Richard works now

**The workflow (the spine of the new guide):**
1. Discuss as much as possible with Claude first. For non-tech people that's usually Claude Chat / Desktop, which is more conversational and brainstorm-minded than Claude Code and knows the user.
2. Ask for **mockups** (Claude Design, Figma-style) and go through the functionality until "if this mockup existed, I'd be happy". Only then talk about stacks, dev tasks and cloud deployment.
3. Build a simple **V1 running locally**, test it, then have lots of bug-fix discussions.
4. Only then deploy to a live cloud server and domain.

**What carries the weight: "99% docs."** An extensively documented repo beats fancy hooks and MCPs. "The rest is just garnish." The docs should make Claude:
- keep the docs up to date
- follow certain unbreakable rules, and update those rules when needed
- learn from its mistakes, saving bugs it finds somewhere it re-reads regularly
- think outside the box about problems the user may hit, and suggest extra things to do
- work from a written statement of **how techie the user is**, and let that set how it talks, reports, takes initiative, or follows instructions to the letter

Reference repos: the NodeGX / OpenNoodl repos and the "rocket school" NodeGX template ("some of the most ridiculously extensive docs I have").

**Features that matter:** CLAUDE.md + memory, skills + slash commands. Skills are worth it for **copywriting** in particular: Claude is "absolutely WOEFUL" at prose and copy, and the long dashes and melodramatic tone give it away. Set up a copywriting skill as early as possible.

**Still doing (not dropped):** confidence scoring, sprint/phase plans, one task per session. If you stick to one task per session you normally never hit compaction.

**Dropped:** token/credit counting. What replaces it: **watch your session and weekly limits** for your plan.

**Plans and models (write honestly):**
- Free plan: tough. Sonnet only and very limited.
- Pro ($20/mo): fine to get your feet wet, but full project development on it is hard.
- Max (~$100 tier): worth provisioning once you're serious and need higher limits for improvements and maintenance.
- Richard does 99% of dev tasks on **Opus**, and calls in **Fable** when the app is suffering from something fundamental or from design problems (Max only).
- Pro users: alternate between Opus and Sonnet. Richard uses Opus to plan and write the tasks, and has **each task state which model should run it**. Start each session by reading the top of the task and switching model before you begin.

**New practices to teach:**
- Screenshots to Claude matter even more than before.
- CLAUDE.md should encourage **headless browser tests** as well as backend tests. Rocket school runs a full background playtest of every game after changes ("beep… boop… beep"). With Claude most of this runs in the background, unlike Cline where you watch the browser, though Claude sometimes drives Chrome to show you things.
- When Claude needs you to **rule on several points, ask for an artifact.** Artifacts can hold a small database, so your clicks and typed answers come back to Claude Code.
- A copywriting skill (above).

**Failure modes: what Richard actually sees**
- *Not* "claims done when it isn't": Claude insists on user testing and visual checks before closing, and keeps chasing ("Still waiting on your ruling on this…").
- *Not* docs drift. The real problem is **docs getting too long.** Claude needs rules on how long a doc may grow before it summarises, condenses, splits, or moves old material to an archive folder.
- *Not* context loss, as long as it's one task per session.
- *Not* overreach, but the **opposite**: Claude errs on the side of caution. You have to push it to think further and recommend things it avoids (SSH, real user data). The real risk is the **user**: saying "just get it done" without reading what was spelled out, then being unhappy with the result.

---

## Open facts (Richard asked; must be verified against primary sources before R4)

A background research pass on 2026-09-21 returned the following. Most of it came from third-party blogs, so **treat all of it as unverified**. Check each against code.claude.com, support.claude.com or claude.com before it goes on the site.

| # | Question | What the research pass said | Status |
|---|----------|-----------------------------|--------|
| F1 | Does Claude Code use the memory Claude Chat has about you? | Claimed a memory merge across Chat / Cowork / Code "as of August 2026". Source: a mindstudio.ai blog. | **Unverified.** Richard believes it doesn't. Needs an official source. |
| F2 | Can a non-tech user do the whole build in Claude Desktop (Cowork), with no Claude Code install? | Said Cowork (Desktop, Jan 2026) has file access and a sandboxed shell, and hands dev work to Code sessions. | Plausible. Verify on the support.claude.com Cowork page; it decides the non-tech track. |
| F3 | Claude Design: do mockups feed Claude Code? | Said it launched Apr 2026 as a research preview and that its outputs are artifacts Claude Code can build from. | Plausible. Verify the hand-off mechanics. |
| F4 | Can Cline use a Claude subscription? | Said **no** since Apr 2026: subscriptions don't cover third-party tools. **This contradicts Richard.** Cline's docs have a "Claude Code" provider page (docs.cline.bot/provider-config/claude-code). | **Closed.** Richard: don't cover it, it's a fringe case. |
| F5 | Plan prices | Pro $20/mo. Max quoted as $200 only. Richard says ~$90–100 (there is a lower Max tier). | Check claude.com/pricing. Don't print any figure unchecked. |

Also: `part-1/tool-selection.md` says "Claude Pro subscription at €90/month". Pro is $20, so that was Max. Fix it in R4.
