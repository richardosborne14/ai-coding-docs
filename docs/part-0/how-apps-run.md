---
title: "How Apps Run: Local vs Cloud"
description: Localhost, ports, servers, SSH keys, and what "deployment" actually means
---

# How Apps Run: Local vs Cloud

## TLDR

When you build an app, it first runs on your own computer ("locally"). To let other people use it, you put it on a server ("deploy to the cloud"). The `:5173` or `:5000` in the address bar is a port number. Think of it as a door number on your computer. SSH keys are digital keys that prove to a server you're allowed in. This page covers all of that in plain English, including why port conflicts happen and why you should keep deploying from the same machine.

---

## Running Locally: What "localhost" Means

When Claude builds your app and runs it, you'll see a message like:

```
Server running at http://localhost:5173
```

**localhost** means "this computer." It's a special address that always points back to the machine you're sitting at. When you open `http://localhost:5173`, you're not going out to the internet. You're looking at something running right here.

Nobody else can see it. If you sent that link to a friend, it wouldn't work. Their `localhost` is their own computer.

This is **local development.** Your computer is both the builder and the viewer. It's fast and private, and it's where everything happens before anything goes live.

::: simple
In the Code tab of the Claude desktop app, the Browser pane shows your running app. That's localhost, you just don't have to type it.
:::

---

## What Are Ports? (The :5173 Thing)

Think of your computer as a building with thousands of doors. Each door has a number. When a program wants to talk over the network (even locally), it picks a door. That number is the **port**.

- `http://localhost:5173` means "talk to the program behind door 5173 on this computer"
- `http://localhost:3000` means "door 3000"
- `http://localhost:8080` means "door 8080"

Different tools use different default ports:

| Tool/Framework | Default Port |
|---------------|-------------|
| Vite / SvelteKit | 5173 |
| React (Create React App) | 3000 |
| Next.js | 3000 |
| Express.js | 3000 |
| Python Flask | 5000 |
| Docker services | Varies |
| PostgreSQL | 5432 |

### Why Port Conflicts Happen

Only one program can use a port at a time. Start a React app on 3000, then an Express server also on 3000, and the second one fails with something like:

```
Error: listen EADDRINUSE: address already in use :::3000
```

That just means "something else is already behind door 3000."

The usual cause: you started your app, closed the browser tab and forgot the server was still running. Later you start it again and hit a conflict with the old copy. The easy fix is to tell Claude: "port 3000 is already in use, find what's on it and stop it." It will.

::: everything Fixing it by hand
**Find and stop the other program.** On Mac/Linux:
```bash
lsof -i :3000
```
Note the PID (process ID), then:
```bash
kill -9 12345
```
(Replace 12345 with the real PID.)

On Windows (PowerShell):
```powershell
netstat -ano | findstr :3000
taskkill /PID 12345 /F
```

**Or use a different port.** Most tools let you pick one:
```bash
npm run dev -- --port 5174
```
Or in `vite.config.js`:
```javascript
export default {
  server: {
    port: 5174
  }
}
```

**Or close the terminal** that's running the old server. Better still, press Ctrl+C in it to stop the server before you start it again.
:::

---

## The Cloud: What "Deployment" Means

Deployment means taking the app that works on your computer and putting it on a computer somewhere else (a "server"), so other people can reach it at a real address like `https://myapp.com`.

There are two kinds.

### Static / Front-end Deployment (Easy)

If your app is just HTML, CSS and JavaScript with no server-side logic, you can deploy it to services like **Netlify** or **Vercel** for free. They:

1. Watch your GitHub repository
2. Build and publish your site whenever you push new code
3. Give you an address like `https://myapp.netlify.app`
4. Handle the rest: security certificates, global distribution, caching

This really is push-button. Connect your GitHub repo, set the build command (Claude can walk you through it) and you're live.

### Back-end / Full-Stack Deployment (More Involved)

If your app has a server, a database or any back-end logic, it needs a real server. That's a computer that's always on, always online, and managed by you (or a hosting company).

Common options:
- **Hetzner.** Affordable European cloud servers, from about €4 a month
- **DigitalOcean.** Similar, US-based
- **Railway.** Dearer but simpler, handles Docker for you
- **AWS / Google Cloud / Azure.** Overkill for most projects at this stage, and fiddly to set up

With these you're renting a computer in a data centre. You connect to it remotely (over SSH, more below), install your app and it runs around the clock.

Claude tends to play it safe here. It may suggest a managed platform or tell you to do the server steps yourself. If you want it to set up SSH and deploy for you, say so. Push it to recommend what it would actually do.

---

## SSH Keys: Your Digital ID Card

When you deploy to a server, you need to prove you're allowed in. Passwords work, but they're weak and a pain to type. The standard answer is **SSH keys**.

### How SSH Keys Work (Simplified)

An SSH key is a pair of files:

1. **Private key.** Lives on your computer and is never shared. It's the actual key
2. **Public key.** Goes on the server. It's the lock only your key opens

When you connect, the server checks whether your private key matches the public key it has on file. If it does, you're in. No password.

::: everything Creating and adding keys
### Creating an SSH Key

In your terminal:

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

It will ask:
- **Where to save it:** Press Enter for the default (`~/.ssh/id_ed25519`)
- **Passphrase:** Set one for extra security, or press Enter twice to skip (simpler, still secure)

That creates two files:
- `~/.ssh/id_ed25519`, your private key (NEVER share this)
- `~/.ssh/id_ed25519.pub`, your public key (this is what you give to servers and GitHub)

### Adding Your SSH Key to GitHub

1. Copy your public key:
   - Mac: `cat ~/.ssh/id_ed25519.pub | pbcopy` (copies it to your clipboard)
   - Windows: `cat ~/.ssh/id_ed25519.pub`, then select and copy it
   - Or open the `.pub` file in a text editor and copy the contents
2. Go to GitHub > Settings > SSH and GPG Keys > New SSH Key
3. Paste the public key and save

Now you can push and pull from GitHub without typing your password.

### Adding Your SSH Key to a Server

When you create a cloud server (Hetzner, DigitalOcean and so on), the setup wizard usually asks for your public key. Paste the same `.pub` contents there.

If the server is already running, Claude can add the key for you with:

```bash
ssh-copy-id user@your-server-ip
```
:::

### Why You Should Deploy from the Same Machine

**SSH keys are tied to the machine they're on.** Your private key lives in `~/.ssh/` on your computer. If you switch computers or reinstall your operating system, the new setup won't have your private key. The server will turn you away. You'd need to copy the key across or add a new key pair.

When Claude deploys your app, it uses the SSH key on your computer. So keep deploying from that computer, or move your keys over carefully. And **back up your `.ssh` folder**. Lose your private key and you lose access to your server.

::: everything Moving keys to a new machine
Copy the whole `~/.ssh/` folder to the same place on the new machine. On Mac/Linux, set the permissions:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

Windows handles file permissions differently. Search "SSH key permissions Windows" if you need to do this.
:::

---

## Dev vs Production: Two Separate Worlds

Once you have a server, you have two environments:

**Development (dev).** Your own computer. This is where you build and test. Break things freely, nobody else is affected.

**Production (prod).** The live server. This is what real users see. Breaking things here is bad.

My rule: **Claude pushes to dev. You promote to production yourself.** Claude can happily deploy to a test server, but going live is always a conscious human decision.

### The .env Problem

Your app almost certainly has settings that differ between dev and production: database passwords, API keys, URLs. These live in `.env` files (short for "environment variables").

The danger is that Claude overwrites your production `.env` with your local values. It happens. For example:

- Your local database might be `localhost:5432/myapp_dev`
- Your production database is `db.myserver.com:5432/myapp_prod`
- If the local `.env` lands on production, your live app tries to talk to the database on your laptop. It can't reach it, and the site breaks

So keep dev and prod `.env` files separate. Put a rule in your `CLAUDE.md` saying never to copy or overwrite the production `.env`. And read what Claude plans to do before any deploy step. "Just do it" is how this goes wrong.

---

## Quick Mental Model

```
Your Computer (localhost)          The Internet (production)
┌──────────────────────┐          ┌──────────────────────┐
│                      │          │                      │
│  Your app :5173   ───┼── SSH ──▶│  Your app :443       │
│  Database :5432      │  deploy  │  Database :5432      │
│  API server :3000    │          │  API server :3000    │
│                      │          │                      │
│  Only YOU can see    │          │  EVERYONE can see    │
│  this                │          │  this                │
└──────────────────────┘          └──────────────────────┘
```

Port `:443` is the standard port for HTTPS (secure web traffic). When someone visits `https://myapp.com`, they're really going to port 443. The browser hides it because it's the default. Locally you use ports like 5173 or 3000 because 443 is usually reserved for system use.

---

**Next:** [Adding Files and Styling Basics](/part-0/files-and-styles). Images, colours and making things look right.
