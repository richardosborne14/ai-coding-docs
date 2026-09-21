# R4 writer's brief (shared by every page rewrite)

Repo: /Users/richardosborne/vscode_projects/ai-coding-docs (VitePress site "Build it with Claude", live at learn-ai.digitalbricks.io). Owner: Richard Osborne, Digital Bricks.

Before writing, read these (they are the spec; this brief summarises them):
- dev-tasks/phase-5-claude-code-rebrand/R1-AUDIT.md  (the verdict row for each of your pages is the instruction)
- dev-tasks/phase-5-claude-code-rebrand/R0-INTERVIEW.md (how Richard works now: the source of truth for method)
- dev-tasks/phase-5-claude-code-rebrand/R2-FACTS.md (the only facts about plans, prices, Chat/Code/Cowork/Design you may state)
- dev-tasks/phase-5-claude-code-rebrand/R1-NODEGX-REFERENCE.md (practices to teach; paths are evidence you may read)

## What changed
The guide used to be built around Cline (a VS Code AI extension). It is now **Claude-first**:
- Claude Chat (desktop app or claude.ai) for discussion. Claude Design for mockups. **Claude Code** for building.
- Cline appears ONLY in the new appendix `/appendix-other-tools` (pay-as-you-go API, about 4x faster but about 10x dearer, not advisable for ~90% of cases). Everywhere else, replace Cline with Claude / Claude Code, or delete the Cline-specific material. A one-line pointer to the appendix is fine where a reader might wonder.
- `.clinerules` becomes `CLAUDE.md`. `.clineignore` goes away (mention only in the appendix). "The .clinerules Additions" sections become "What to add to CLAUDE.md".
- Token/credit counting is dropped. It is replaced by "watch your session and weekly limits" (page `/part-0/plans-and-limits`).
- The method: talk it through in Chat -> mockups in Claude Design until "if this existed I'd be happy" -> only then stack, docs and tasks -> build a V1 locally, one task per session -> lots of bug-fix rounds -> deploy to a real server and domain.
- "99% docs": a well-documented repo beats hooks, MCPs and plugins ("the rest is garnish").
- Still in use: confidence scoring, sprint/phase plans, one task per session, phase audits.
- Model per task: Richard uses Opus for ~99% of work, Fable for fundamental or design problems. Each task file names the model that should run it. Pro users alternate Opus (plan, write tasks) and Sonnet (execute simpler tasks).
- New practices: screenshots to Claude matter more than ever; CLAUDE.md should ask for headless browser tests as well as backend tests (they run in the background, you don't watch a browser); when Claude needs you to rule on several points, ask it for an artifact you can click through (artifacts can store your answers so they come back to Claude Code); a copywriting skill early.
- Real failure modes: docs getting too long (need length rules: summarise, split, archive); Claude too cautious (push it to recommend things like SSH or using real data); the user saying "just do it" without reading the plan. NOT "claims done when it isn't", NOT docs drift, NOT context loss (if one task per session).

## Facts you may state (from R2-FACTS, do not go beyond)
- Claude Code does NOT see Chat memory. Chat memory is shared with Cowork only. "Chat knows you, Code knows your repo."
- The Claude desktop app has Chat, Cowork and Code tabs. The Code tab is Claude Code with no terminal and no Node install, and has a Browser pane that shows your running app.
- Claude Code needs a Pro, Max, Team or Enterprise plan. Free = Sonnet and Haiku, no Claude Code. Pro $20/mo (or $17/mo billed yearly). Max 5x $100/mo. Max 20x $200/mo. Fable: Pro on pay-as-you-go credits; Max up to 50% of weekly limits at no extra cost.
- Limits: a session limit that resets every five hours, plus a weekly limit. Anthropic does not publish the numbers, so never print any.
- Claude Design: paid plans, still beta/preview (don't pick one label). It hands off to Claude Code.
If a page needs a fact not listed here, leave it vague or leave it out. Never invent commands, flags or UI names.

## Two tracks (already built, don't touch config.ts or theme files)
- "Keep it simple": everything inside the Claude desktop app (Chat, Design, Code tab). No terminal.
- "Show me everything": Claude Code in VS Code or a terminal, plus Git, Docker, deploys. Hides nothing.
- Markdown containers you can use:
  - `::: everything` ... `:::` hidden from simple-track readers. Optional custom label: `::: everything Terminal route`.
  - `::: simple` ... `:::` always shown, labelled "Keep it simple". Optional custom label too.
- Page-level tags live in config.ts (`track: 'everything'`). Do NOT edit config.ts. Instead, in your final report, say for each page whether it should be builder-only (`everything`) or for both tracks. Note: the simple track IS Claude Code (Code tab), so CLAUDE.md, task files and skills apply to simple readers too. Prefer: page for both tracks, with the terminal/Git/Docker/server bits wrapped in `::: everything`.

## Voice rules (Richard's, strict)
- First person, Richard talking ("I"). Cheeky, confident, plain. British spelling.
- **Zero em dashes (—).** Also avoid en dashes used as dashes. Use a full stop, comma, colon or brackets. `grep -c "—" file` must print 0. This includes frontmatter, tables and code blocks.
- No melodrama: no "game-changer", "unlock", "supercharge", "revolutionise", "the secret", "here's the thing", "magic", "powerful", "seamless", "crucial", "dive in", "robust", "leverage".
- No swearing. No "It's not X, it's Y" constructions. No automatic lists of three.
- Short sentences, plain words. If a sentence needs a second comma, make it two sentences.
- Honest about cost and effort. When unsure, say so.
- The "you don't need me... or do you?" joke: at most once per page, and usually not at all. Don't add Book-a-call CTAs; leave existing `db-cta` blocks alone unless your page verdict says otherwise.
- Keep existing emoji use sparse. Keep VitePress features that already work (`::: tip`, `::: warning`, `::: details`).
- Keep useful technical content. Cut padding, repetition and Cline-specific material. Shorter is better: a rewritten page should normally be shorter than the original.
- Update each page's frontmatter `title`/`description` to match.

## Confidentiality
Richard has a private sibling repo whose Markdown "lakehouse" memory tree he likes. Never name any private client repo or client. Describe such patterns generically with invented examples. You may cite OpenNoodl / NodeGX / Rocket School (public, Richard's own) as examples.

## Links (site IA; these URLs will all exist when R4 is done)
/start-here /introduction /part-0/setting-up-your-computer /part-0/plans-and-limits /part-0/claude-code-setup /part-0/browser-devtools /part-0/how-apps-run /part-0/files-and-styles /part-0/glossary /part-1/philosophy /part-1/tool-selection /part-2/brainstorming /part-2/mockups-first /part-2/documentation-architecture /part-2/live-project-overview /part-3/execution-workflow /part-3/task-patterns /part-3/confidence-scoring /part-4/phase-audits /part-4/testing /part-4/commenting-philosophy /part-5/context-management /part-5/skills /part-5/pitfalls-recovery /part-5/project-memory /part-5/project-brain /part-5/team-workflows /part-5/control-panel /part-5/observability /part-5/feedback-loop /part-5/accessibility /part-5/frontend-tweaker /part-5/deployment-platforms /part-5/deploy-verification /part-6/templates /part-6/prompts /part-6/case-studies /appendix-e-beyond-coding /appendix-other-tools /about
These are being CUT; never link to them: /part-0/cline-and-credits /part-5/token-economics /part-6/setup-guide /part-3/cline-workflow

## Rules for you as a writer
- Only edit the files assigned to you. Other agents are editing other pages at the same time.
- Don't run git commands that change state (no commit, no checkout, no stash). Don't run the build.
- When done, for each file run `grep -c "—" <file>` (must be 0) and `grep -ci cline <file>` (should be 0 outside the appendix; explain any left).
- Final report (under 300 words): per page, the new line count vs old, the track recommendation, anything you were unsure of or left out, and any fact you needed but couldn't state.

## Extra verified facts (checked 2026-09-21 on code.claude.com / support.claude.com / academy.claude.com)
Claude Code:
- Desktop app includes Claude Code; "You don't need to install Node.js or the CLI separately." (code.claude.com/docs/en/desktop-quickstart)
- Native install: macOS/Linux/WSL `curl -fsSL https://claude.ai/install.sh | bash`; Windows PowerShell `irm https://claude.ai/install.ps1 | iex`. (docs/en/setup). There is also a VS Code extension (don't give install steps beyond "install the Claude Code extension from the VS Code marketplace").
- Needs Pro, Max, Team, Enterprise or Console account; Free plan has no Claude Code.
- CLAUDE.md locations: user `~/.claude/CLAUDE.md`; project `./CLAUDE.md` or `./.claude/CLAUDE.md`; personal-per-project `./CLAUDE.local.md`. `/init` generates a starter CLAUDE.md. Imports with `@path/to/file`.
- Auto memory: notes Claude writes itself from your corrections and preferences; the first 200 lines or 25KB of the index is loaded every session. Machine-local.
- Permission modes: default (asks), acceptEdits, plan, auto, dontAsk, bypassPermissions. Switch with Shift+Tab in the CLI, the mode indicator in VS Code, the mode selector in the desktop app. `/permissions` manages allow/deny rules.
- Skills: `~/.claude/skills/<name>/SKILL.md` (personal) or `.claude/skills/<name>/SKILL.md` (project). Frontmatter: `description` (what makes Claude load it automatically), `name` (defaults to folder name). Invoke with `/skill-name` or Claude loads it when relevant. Old `.claude/commands/*.md` still work, skills preferred.
- Commands: /clear (fresh conversation), /compact, /model, /usage (usage and limits), /status, /resume, /rewind (roll back to a checkpoint), /context, /init. Esc interrupts; Esc Esc opens rewind. Option+P (mac) / Alt+P switches model.
- Do not name model versions; say Opus, Sonnet, Haiku, Fable.
Claude Design:
- Paid plans (Pro, Max, Team, Enterprise). Help centre says "beta", launch post says "research preview".
- Iterate by chatting, inline comments on the canvas, direct edits, sliders Claude makes; ask for 2-3 alternative layouts. Private until shared; share by link (viewers need a Claude account).
- Handoff: Export -> "Hand off to Claude Code". The bundle holds the project's design files, the chat, and a README telling the model how to interpret the designs. You get a prompt to paste into local Claude Code; there's also a Claude Code Web option. Claude Code carries on from the design instead of starting from a screenshot.
- Also exports to PDF, PPTX, Canva, standalone HTML.
