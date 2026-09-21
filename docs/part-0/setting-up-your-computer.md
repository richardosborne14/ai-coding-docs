---
title: Setting Up Your Computer
description: Install the Claude desktop app and you're mostly done. Builders also get VS Code, Git, Node, Docker and Claude Code in a terminal.
---

# Setting Up Your Computer

## TLDR

If you picked **Keep it simple**, you install one app. The Claude desktop app has Claude Code built in, so there's no terminal, no Node and nothing else to install. Sign in on a paid plan, open the Code tab, pick a folder. Done.

If you picked **Show me everything**, you also get VS Code, Git, Node.js and (for back-end projects) Docker, plus Claude Code in a terminal or in VS Code. It takes about an hour the first time. After that you never do it again.

---

## The Claude desktop app (everyone)

Both tracks start here. Even if you end up living in a terminal, you'll want the desktop app for Chat and Claude Design.

1. **Download the Claude desktop app** from [claude.com/download](https://claude.com/download). It runs on macOS (Intel and Apple Silicon) and Windows (x64 and ARM64). Linux is in beta.
2. **Sign in on a paid plan.** Claude Code needs Pro, Max, Team or Enterprise. The Free plan doesn't include it. Pro is $20 a month and is fine to get your feet wet. [Plans and Limits](/part-0/plans-and-limits) covers which plan to pick and when to move up.
3. **Open the Code tab.** The app has three tabs: Chat, Cowork and Code. Chat is for talking things through. Code is Claude Code, the thing that actually builds your app. Cowork is handy for non-code jobs, but you won't need it for this guide.
4. **Pick a folder.** Make an empty folder for your project (something like `Documents/my-first-app`) and point the Code tab at it. Claude works inside that folder and nowhere else.

That's it. When Claude starts your app, it opens in the **Browser pane** next to the conversation, so you can click around without typing a single address.

::: tip One folder per project
Keep each app in its own folder. Claude reads everything in the folder you give it, so a tidy folder means a Claude that knows what it's looking at.
:::

**Next for simple-track readers:** [Plans and Limits](/part-0/plans-and-limits), then [Claude Code Setup](/part-0/claude-code-setup). The setup page applies to you too, because the Code tab *is* Claude Code.

::::: everything The full kit

## The full kit (Show me everything)

This is the builder's setup: an editor you'll live in, version control, and the tools your app actually runs on. None of it is hard. Most of it is clicking "Next".

**What each tool does, in plain English:**

- **VS Code** is a free code editor from Microsoft. It's where you see your files. Don't confuse it with "Visual Studio", which is a much bigger program.
- **Claude Code** runs in VS Code's terminal, a plain terminal, or as a VS Code extension. Same Claude Code as the desktop app's Code tab, with more knobs showing.
- **Git** tracks every change to your project, like Track Changes in Word but for a whole folder. **GitHub** is the website where the project lives online.
- **Node.js** runs JavaScript outside a browser. Most web tools need it. It comes with **npm**, which installs code libraries.
- **Docker Desktop** runs databases and back-end services in sealed boxes (containers), so they don't scatter files all over your machine. Only needed when your project has a back end.

### Step 1: VS Code

Go to [code.visualstudio.com](https://code.visualstudio.com) and download it.

- **Mac:** open the `.zip`, drag Visual Studio Code into Applications, open it. macOS will warn that it was downloaded from the internet. Click **Open**. That's normal for anything outside the App Store.
- **Windows:** run the `.exe`. Tick **Add to PATH** and **Add "Open with Code" to context menu**. If Windows Defender says "Windows protected your PC", click **More info**, then **Run anyway**. VS Code is Microsoft's own app.

### Step 2: Claude Code

Pick one route. You can add the other later.

**In a terminal.** On macOS, Linux or WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

On Windows, in PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Then open your project folder in VS Code, open its built-in terminal (`` Ctrl+` ``) and type `claude`. The first time, it asks you to sign in with your Claude account.

**As a VS Code extension.** Install the Claude Code extension from the VS Code marketplace. You get a chat panel inside the editor instead of a terminal.

Either way you need the same paid plan as the desktop app. [Claude Code Setup](/part-0/claude-code-setup) covers what to do once it's running.

::: tip No Node needed for this bit
Some older guides install Claude Code with npm. The native installer above is Anthropic's documented route, and it doesn't need Node.
:::

### Step 3: Git and GitHub

- **Mac:** open Terminal and run `xcode-select --install`. Click **Install** in the popup and wait (5 to 15 minutes). If it says the tools are already installed, you already have Git.
- **Windows:** download from [git-scm.com](https://git-scm.com/download/win) and run the installer. There are a lot of screens. The defaults are fine on every one. If VS Code is already installed, you can pick it as Git's default editor.
- **Linux:** `sudo apt install git`

Check it worked with `git --version`. Then make a free account at [github.com](https://github.com). You'll need it to store your code online and to deploy.

### Step 4: Node.js

Go to [nodejs.org](https://nodejs.org) and download the **LTS** version.

- **Mac:** run the `.pkg` and click through. It asks for your Mac login password. That's normal.
- **Windows:** run the `.msi`. The defaults are fine. You can leave the "Tools for Native Modules" (Chocolatey) box unticked.

Open a new terminal and check both:

```bash
node --version
npm --version
```

Two version numbers back means you're good.

### Step 5: Docker Desktop (back-end projects only)

Skip this if you're building a plain website or front end. Come back when your project needs a database or an API.

Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/).

- **Mac:** choose **Apple Silicon** for an M-series Mac, **Intel** for older ones (Apple menu > About This Mac tells you). Drag it to Applications and open it. It asks for a lot of permissions. Allow them: it's running small virtual computers inside yours, so it genuinely needs network and file access. The free account is all you need, or skip sign-in if it offers.
- **Windows:** run the installer. If it says you need WSL 2, open PowerShell as Administrator, run `wsl --install`, restart, and open Docker again. If it mentions Hyper-V or virtualisation in the BIOS, follow the link it gives you for your machine.

### Your first time in a terminal

The terminal is a text box that tells your computer what to do. On a Mac, press Cmd+Space and type **Terminal**. On Windows, open **PowerShell**. In VS Code, `` Ctrl+` `` opens one already pointed at your project, and that's the one you'll use most.

You only need a handful of commands:

| Command | What it does |
|---------|-------------|
| `pwd` | Shows which folder you're in |
| `ls` (or `dir` on Windows) | Lists what's in the folder |
| `cd folder-name` | Moves into a folder |
| `cd ..` | Goes up one folder |
| `clear` (or `cls` on Windows) | Clears the screen |

You're very unlikely to break anything by mistyping. The worst you'll usually get is an error message, and it's normally telling you exactly what went wrong. Paste it to Claude if it isn't.

When Claude runs `npm install something`, it downloads a library into a `node_modules` folder in your project. That folder gets big. That's normal. It belongs in your `.gitignore` so it never goes to GitHub, and Claude normally sets that up.

### When things go wrong

**"command not found" or "'X' is not recognized".** Either it isn't installed, or your terminal hasn't noticed yet. Close the terminal (or VS Code) completely and open a new one. On Windows, if it still can't find it, the installer didn't add it to your PATH. Search Windows settings for "Environment Variables" and add the install folder (usually `C:\Program Files\nodejs\` for Node and `C:\Program Files\Git\cmd\` for Git).

**"Permission denied" or "EACCES" on a Mac.** Avoid `sudo npm install -g`. Point npm at a folder you own instead:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
```

Then restart the terminal.

**Antivirus or firewall blocking things.** Very common on Windows. Antivirus can quietly stop Node downloading packages, Docker reaching the network or Git talking to GitHub. Check its notifications, then add exclusions for your project folder and the Node, Git and Docker install folders (Windows Security > Virus & Threat Protection > Manage Settings > Exclusions). On a work laptop you may need IT.

**"ECONNREFUSED".** Something is trying to reach a server that isn't running. Usually Docker isn't started yet, or the app hasn't been launched.

**"Port already in use" (EADDRINUSE).** Another program has the port your app wants. [How Apps Run](/part-0/how-apps-run) explains ports and how to fix this.

**`npm install` seems frozen.** Give it two or three minutes. If it's really stuck, press Ctrl+C, delete `node_modules` and `package-lock.json`, and try again.

**"xcrun: error: invalid active developer path" (Mac).** A macOS update removed the developer tools. Run `xcode-select --install` again.

### Which security prompts are normal

If you started the action (you clicked install, you typed the command, you approved it in Claude Code), the prompt is expected. That covers VS Code opening your folders, Docker asking for network access, and macOS warning about downloaded apps.

Be suspicious of a password prompt you didn't cause, or an unexpected browser extension. Read those before clicking anything.

### Checklist

- VS Code opens
- `claude` starts in the VS Code terminal (or the extension panel works)
- `git --version`, `node --version` and `npm --version` all print a number
- You have a GitHub account
- Docker Desktop is installed, if your project has a back end

:::::

---

**Next:** [Plans and Limits](/part-0/plans-and-limits). What each plan gets you, and how to keep an eye on your session and weekly limits.
