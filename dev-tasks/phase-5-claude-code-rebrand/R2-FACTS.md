# R2: Verified facts (F1, F2, F3, F5)

**Checked 2026-09-21, Anthropic's own pages only** (claude.com, support.claude.com, code.claude.com, anthropic.com). Pricing and model lines came from fetched page summaries, not raw page text: re-check claude.com/pricing on the day R4 writes `plans-and-limits`, and never print a figure that isn't listed here.

## F1: Does Claude Code see Chat's memory? **No.** (confirmed)

- On 2026-08-25 Chat memory was joined with **Cowork**, not Code: "Starting today, the memory you use in chat is the same as in Claude Cowork." ([claude.com blog](https://claude.com/blog/claudes-memory-works-everywhere-and-you-decide-whats-in-it))
- Claude Code's memory is CLAUDE.md files plus auto memory, and "Auto memory is machine-local … Files are not shared across machines or cloud environments." ([code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory))
- So Richard was right. The blog claiming a Chat/Cowork/Code merge was wrong about Code.
- **For the site:** "Chat knows you, Code knows your repo" is true and worth saying in `brainstorming`.

## F2: Can a non-tech reader build without a terminal? **Yes, but in the Code tab, not Cowork.** (confirmed, one gap)

- "The desktop app includes Claude Code. You don't need to install Node.js or the CLI separately." It has a Browser pane: "When you run your dev server in the desktop, your app opens in the Browser pane." ([desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart))
- The desktop app has three tabs: **Chat** (no file access), **Cowork** (an agent in a sandboxed VM), **Code** (Claude Code with direct access to local files).
- Cowork reads and writes local files and runs "code and shell commands in an isolated environment", "no terminal required". It's paid plans only. ([support: Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork))
- **Gap:** no official page says Cowork runs a local dev server you can click around. The Code tab is the documented route for that.
- **Conflict:** the support page says Cowork's code runs on Anthropic's servers; the desktop quickstart says "On-device Cowork sessions run the VM on your computer." Don't state where Cowork runs.
- Requirements: "Claude Code requires a Pro, Max, Team, or Enterprise subscription." macOS (Intel and Apple Silicon), Windows x64 and ARM64; Linux is beta.
- **Consequence for R3 (the handoff was wrong here):** the non-tech track is *not* "Chat/Cowork end to end". It is "everything inside the Claude desktop app": Chat to talk it through, Design for mockups, the **Code tab** to build and preview. The builder track is Claude Code in VS Code or a terminal, plus Git, Docker and deploys. Both tracks use Claude Code; the difference is the window and how much plumbing you see. Cowork becomes a side note for non-code work. Put to Richard on the ruling page.

## F3: Claude Design → Claude Code (partly confirmed)

- Launched 2026-04-17 "in research preview for Claude Pro, Max, Team, and Enterprise subscribers" ([anthropic.com news](https://www.anthropic.com/news/claude-design-anthropic-labs)). The newer help page says "available in beta … It isn't available on the Free plan" ([support: Claude Design](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)). **Say "paid plans, still in beta/preview". Don't pick one label.**
- Hand-off: "Claude packages everything into a handoff bundle that you can pass to Claude Code with a single instruction" (news). Export options include "Send to local coding agent" and "Send to Claude Code Web" (help page). The product page mentions `/design` and `/design-sync` for moving work between the two.
- **Not confirmed:** exactly what's in the bundle. Before R4 writes `mockups-first`, open the tutorial at claude.com/resources/tutorials/using-claude-design-for-prototypes-and-ux, or have Richard describe what he sees.

## F5: Plans, models, limits (confirmed)

| Plan | Price | Models | Claude Code |
|------|-------|--------|-------------|
| Free | $0 | Sonnet, Haiku (no Opus) | No |
| Pro | $20/mo, or $17/mo billed yearly ($200 up front) | Opus, Sonnet, Haiku; Fable on pay-as-you-go credits | Yes |
| Max 5x | $100/mo (monthly only) | Opus, Sonnet, Haiku; Fable up to 50% of weekly limits at no extra cost | Yes |
| Max 20x | $200/mo (monthly only) | as Max 5x | Yes |

Sources: [claude.com/pricing](https://claude.com/pricing), [support: Max plan](https://support.claude.com/en/articles/11049741-what-is-the-max-plan), [support: Fable on your plan](https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan), [support: Claude Code with Pro/Max](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan).

- Limits: "Your session-based usage limit will reset every five hours." There's also a weekly limit "across all models" that resets "at a fixed time each week that is assigned to your account." Pro has the same structure. **Anthropic doesn't publish the actual numbers**, so the site mustn't either.
- **Correction to R0:** Fable is **not Max-only**. Pro users can use it on pay-as-you-go credits. Richard's "~$100 Max tier" is right (Max 5x). The old "Claude Pro €90/month" line in `tool-selection` is wrong twice over: Pro is $20, and $100 is Max 5x.
