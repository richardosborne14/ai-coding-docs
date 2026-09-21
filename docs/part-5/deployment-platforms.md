---
title: Deployment & Platform Targets
description: Getting your app running locally, on the web, on mobile and on desktop, without letting Claude break production.
---

# Deployment & Platform Targets

## TLDR

Where your app runs shapes how you build it. For a simple frontend, Netlify or Vercel give you free, painless hosting. For a backend, Docker Desktop keeps your own machine clean and Hetzner gives you cheap cloud servers. For mobile, Capacitor wraps your web app for the app stores, and you plan for it from the start. For desktop, Tauri is the modern light option and Electron the established heavy one.

Whatever the target, keep dev and prod apart, never let Claude overwrite production environment variables, and never let it sit polling a long deploy.

::: tip Deploy Verification
This chapter covers _where_ and _how_ to deploy. For checking that your code actually reached production (the failure that bites hardest), see [Deploy Verification](/part-5/deploy-verification).
:::

---

## Local Development with Docker

Install **Docker Desktop**. It gives Claude an easy way to run backend services (databases, APIs, caches) without installing them on your machine. Every dependency runs in a container you can start, stop and rebuild without leaving a trace.

Tell Claude in `CLAUDE.md` to use Docker for all backend work. On any project with a backend, one of the first sprint tasks should be a `docker-compose.yml` with the services you need.

Build the [control panel](/part-5/control-panel) too, even for a simple backend. It's often easiest as a separate little local app: a window onto the backend, the data, the automations and the deploy state.

---

## Simple Frontend Deployment: Netlify and Vercel

For a frontend or landing page with no backend, Netlify or Vercel is the fastest route to a live URL. Both have free tiers that suit prototypes and small production apps.

Ask Claude to walk you through it:

1. **Sign up** for whichever has the better free tier for this project.
2. **Connect the GitHub repo.** Both can watch a repo and deploy on every push.
3. **Set the build settings:** framework preset (SvelteKit, Next.js and so on), build command, output folder.
4. **Custom domain** (optional): buy or connect one and point its DNS at the platform.

Both handle SSL, CDN and preview deploys for you. For most prototypes the free `.netlify.app` or `.vercel.app` address is fine to start with.

---

## Production Hosting: Hetzner and Dev/Prod Separation

For real apps with a backend, a Hetzner VPS (or similar) is cheap and gives you full control. But once you deploy to a server, **keeping dev and prod apart becomes critical.**

### Image Tag Strategy

With a container registry (GHCR, Docker Hub, ECR), `docker-compose.yml` picks images by tag:

```yaml
image: ghcr.io/your-org/backend:${IMAGE_TAG:-latest}
```

The tag decides what code gets deployed:

| Tag | When Updated | Use Case | Risk |
|-----|-------------|----------|------|
| `:latest` | Only on `main` builds | Stable release channel | If you develop on `dev`, `:latest` is always stale |
| `:dev` | Every push to `dev` | Active development | Safe if your CI is reliable |
| `:sha-abc1234` | Every build (never changes) | Rollbacks, pinning | The most precise. Use it to roll back |

**The most common mistake:** CI builds on `dev`, but production's `.env` says `IMAGE_TAG=latest`. Every deploy pulls a months-old image. Everything looks green and the old code runs.

**The fix:** set production to pull the tag your CI actually pushes.

```bash
# .env.production
IMAGE_TAG_BACKEND=dev
IMAGE_TAG_DASHBOARD=dev
```

To roll back, pin a SHA: `IMAGE_TAG_BACKEND=sha-abc1234`. [Deploy Verification](/part-5/deploy-verification#the-ten-failure-modes) lists the other ways this goes wrong.

### Claude deploys to dev. You promote to prod.

Claude may push to the **dev** server. Promoting dev to prod is your job: through the control panel, a GitHub merge, or a deliberate deploy step. That way Claude can't break production by accident.

### The .env problem

This one is real and it keeps happening. Claude uses SSH to add new environment variables on the server. But dev and prod usually have different API keys, database URLs and settings. I've had an AI coder overwrite the server's `.env` with stale local values that were only ever meant for testing. On a live app, that's a very bad day.

The rules for `CLAUDE.md` are in the [list at the end](#what-to-add-to-claude-md). In short: never touch the production `.env`, keep separate dev and prod env files, and always confirm the target environment first.

---

## The Non-Polling Deploy Pattern

::: warning The $30 night
The OpsNest deploy went wrong on unstable WiFi. The AI kept polling the server for build status. The WiFi kept dropping, so the loop never finished. That was back when I ran on the pay-as-you-go API, where every poll sent the whole conversation again, and it cost about $30 overnight for nothing. On a Claude plan the same loop costs no extra money, but it burns through your [session and weekly limits](/part-0/plans-and-limits) just the same.
:::

The worst habit an AI has with deploys is **polling a long-running job**. Builds, deploys, migrations and image pulls take minutes, sometimes tens of minutes. Ask an AI to "wait until the deploy finishes" and it will run the deploy, then a status check, then wait and check again, forever. Go to bed mid-deploy and that's exactly when it happens.

The fix is structural: **Claude never polls long-running operations.**

### The Pattern

1. **Build on the server, not on your machine.** SSH in, start `git pull && npm ci && npm run build && pm2 restart`, and leave. The build runs on the server on its own.
2. **Return as soon as the job has started.** Claude's work for that turn ends when the command is sent.
3. **Hand the human a one-line status command.** Something you can run in five seconds: `pm2 logs <app-name> --lines 50`, `docker logs <container> --tail 100` or `curl https://your-domain/api/health`.

### Example: a Hetzner SvelteKit Deploy

**Before:**

```
You: "Deploy the latest main to production."

Claude: ssh prod "cd /app && git pull && npm run build && pm2 restart app"
[2 minutes pass]
Claude: ssh prod "pm2 logs app --lines 20"
Claude: "Still building. Let me check again."
Claude: ssh prod "pm2 logs app --lines 20"
[10 minutes pass, the network drops, Claude retries...]
```

**After:**

```
You: "Deploy the latest main to production."

Claude: ssh prod "cd /app && git pull && npm ci && npm run build && pm2 restart app"
Claude: "Deploy started on prod. The build runs on the server.
         To check on it:
           pm2 logs app --lines 50                    # build and runtime output
           curl https://app.example.com/api/health    # is it serving?
         Paste me the output if you want me to look."
```

The deploy still happens. The wasted usage stops.

### Why build on the server

"Build locally, then `scp` the files up" is worse for AI-driven deploys. The build runs where Claude is watching, so there's more polling. The build output can run to hundreds of megabytes, and uploading that from a laptop on bad WiFi is its own long job. And your laptop's Node version or native modules may not match the server's.

Building on the server after a `git pull` is the standard for almost every VPS. Put it in a script. Drop this in your repo as `scripts/deploy.sh` (full version in [Project Templates](/part-6/templates)) and make it executable:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /var/www/your-app
git pull origin main
npm ci --production=false
npm run build
pm2 restart your-app --update-env
echo "✓ Deploy complete at $(date -Iseconds)"
```

Claude's command from your laptop becomes one line:

```bash
ssh deploy@prod 'bash /var/www/your-app/scripts/deploy.sh'
```

Claude is done in under 30 seconds. You check `pm2 logs` later.

### Errors, and when polling is fine

If the deploy fails, Claude shouldn't be polling to find out. You'll see it when you run the status command. Then start a fresh session: "Here's what `pm2 logs` showed, please diagnose." Now Claude reads a finished log instead of watching an unfinished job.

Short jobs are fine to wait on: a 30-second test suite, `prisma migrate dev` on a local database, `tsc --noEmit`. The rule is for jobs that can take more than a minute, where a bad network can stretch them without limit: deploys, container builds, image pulls, big migrations, provisioning.

---

## Docker Image Cleanup: The Silent Disk Killer

Every `docker compose pull` downloads a new image and never deletes the old one. After a few weeks of deploys, unused images fill the server's disk. When it's full, everything breaks at once: containers won't start, builds fail, databases crash, and logs can't write.

It's one of the easiest disasters to avoid.

### Why Docker doesn't clean up

When Docker pulls a new `:dev` image, the old one loses its tag but stays on disk as a "dangling" image. `docker ps` doesn't show it. A typical image is 200 to 800MB, so 50 deploys can eat 10 to 40GB. `docker system df` shows the real numbers:

```bash
docker system df
# TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
# Images          47        3         18.3GB    17.9GB (97%)
# Containers      3         3         1.2MB     0B
# Local Volumes   2         2         4.1GB     0B
# Build Cache     0         0         0B        0B
```

That 17.9GB reclaimable is the problem, and it grows with every deploy.

### The fix at deploy time

End every registry-pull deploy with `docker image prune -f`:

```bash
docker compose pull backend
docker compose up -d --force-recreate backend
docker image prune -f   # remove dangling images from old pulls
```

`-f` skips the confirmation prompt, which is what you want in a script. (`--force-recreate` matters too: see [Docker Cache Lies](/part-5/deploy-verification#docker-cache-lies).)

::: warning Don't use `docker system prune -f` here
`docker system prune -f` also removes stopped containers and unused networks. That's fine for scheduled cleanup, but mid-deploy it can remove things you still want. Stick with `docker image prune -f` in deploy scripts.
:::

### The weekly cron safety net

In case the per-deploy prune gets skipped, add a weekly job on the server:

```bash
# /etc/cron.d/docker-cleanup
# Runs every Sunday at 3am. Removes unused images older than 7 days.
0 3 * * 0 root docker system prune -f --filter "until=168h" >> /var/log/docker-prune.log 2>&1
```

Ask Claude to set it up over SSH, or create the file yourself with `sudo nano /etc/cron.d/docker-cleanup`.

### Check the disk before deploying

```bash
df -h /                                        # overall disk usage
docker system df                               # Docker's share
df -h / | awk 'NR==2 {print $5}' | tr -d '%'   # just the percentage
```

Over 80% used? Clean up before you pull anything new:

```bash
docker system prune -f --filter "until=72h"
```

Add the disk check to the control panel's health view as well.

---

## Cache, Staleness, and "My Changes Aren't Showing"

This is the most common complaint with SvelteKit apps on a VPS. You deploy a change, visit the site and see the old version. A hard refresh fixes it, sometimes. Log out and back in and it's back. It gets worse on cloud servers, and it's almost certain to show up once Claude deploys for you.

The cause is layers. Vite gives SvelteKit's JS and CSS files content-hashed names, so a code change produces a new filename like `chunk-abc123.js` and the cache sorts itself out. But the HTML page that *points to* those files isn't hashed. If anything between your server and the browser (the browser cache, nginx, a CDN) serves an old copy of the HTML, the browser loads the old JS. The server has the new build. The user sees last week's app.

**Why it seems random:** it depends on when each browser last cached the HTML compared with when you deployed. A hard refresh skips the browser cache, which is why it "fixes" things until the next navigation caches a stale page again.

**Why cloud deploys make it worse:** locally there's one layer between Node and the browser. On a VPS there are at least two, nginx and the browser. If nginx isn't told how to cache SSR responses, it uses its own defaults, which usually cache the HTML. Put Cloudflare in front and that's three layers.

### The Fix: Cache Headers in hooks.server.ts

This change does the most. In every SvelteKit project, add a `hooks.server.ts` that sets `Cache-Control`:

```ts
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);

    // Hashed assets: safe to cache forever
    if (event.url.pathname.startsWith('/_app/immutable/')) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        );
    }
    // HTML and SSR responses: browser must revalidate every time
    else if (!event.url.pathname.startsWith('/api/')) {
        response.headers.set('Cache-Control', 'no-cache');
    }

    return response;
};
```

`no-cache` doesn't mean "don't cache". It means "cache it, but check with the server before using it". You keep the speed of 304 Not Modified responses, and the browser always checks for fresh HTML after a deploy.

### The Fix: nginx Configuration

When Claude sets up nginx for a SvelteKit app, the config must set cache headers explicitly. The defaults will cache SSR responses:

```nginx
# Inside your server block
location /_app/immutable/ {
    proxy_pass http://localhost:3000;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location / {
    proxy_pass http://localhost:3000;
    # Do NOT cache HTML responses from SSR
    add_header Cache-Control "no-cache";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### The Fix: Clean Build on Every Deploy

`rm -rf .svelte-kit` shouldn't be a troubleshooting step. Make it the default. Stale `.svelte-kit` files can quietly slip old code into a new build:

```bash
rm -rf .svelte-kit build
npm run build
pm2 restart app-name    # restart, not reload
```

Use `pm2 restart`, not `pm2 reload`. Reload keeps the old process serving while the new one boots. That's great for APIs, but for a frontend it means some requests get the old HTML during the switch, which is exactly the on-and-off staleness users report.

### The Fix: Kill Orphan Service Workers

If a service worker was ever registered (a PWA experiment, a library that adds one, or an old task that added offline support and later removed it), it keeps caching the app shell and serving stale content whatever your server says. Service workers sit *in front of* the network, so they override your cache headers.

If your project doesn't use service workers on purpose, add this to `+layout.svelte`:

```svelte
<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    onMount(() => {
        if (browser && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(r => r.unregister());
            });
        }
    });
</script>
```

### The Fix: Visible Build Version

When someone says "my changes aren't showing", the first question is always "is the new code running?" A visible build version answers it. In `vite.config.ts`:

```ts
export default defineConfig({
    define: {
        '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
    }
});
```

Show it in a footer, an admin page or a `console.log` at startup. If the version is old, it's a cache or deploy problem. If it's current, the code change itself didn't work. The control panel's Deployment Centre can show it too, so a stale deploy appears as a version mismatch.

**Using Cloudflare?** Its default edge caching will cache your SSR responses even when your server sends the right headers. Set a rule that bypasses the cache for HTML, or tell Cloudflare to respect origin headers.

---

## Observability Wiring (Do This in Sprint 1)

Your deploy script must upload source maps and record a release at build time. This is the plumbing you can't add later. If a build ships without its source maps captured, every production error from that build stays minified gibberish for good.

The order is: **generate, upload, strip, package.**

1. **Generate:** build with source maps on (don't turn them off in the prod config).
2. **Upload:** send the `.map` files and a release ID (version plus commit SHA) to your error tracker.
3. **Strip:** delete the `.map` files from the build so they're never served publicly.
4. **Package:** deploy the stripped build (Docker image, pm2 restart, whatever you use).

Get the order wrong and it breaks. Strip or disable maps *before* uploading and there's nothing to upload. Ship the `.map` files publicly and you leak your source code.

The `scripts/deploy.sh` template includes this step with `posthog-cli sourcemap upload`. Check the flags against the [current PostHog docs](https://posthog.com/docs/error-tracking/upload-source-maps) before first use. With a different tracker (Sentry, GlitchTip) the shape is the same: `sentry-cli sourcemaps upload` plus `sentry-cli releases`.

The non-polling rule still applies. The upload runs once inside the one-shot deploy script, logs its result, and the script carries on.

[Observability & Error Tracking](/part-5/observability) explains why source maps and release tagging belong in the foundation and why the rest can wait.

---

## Mobile: Capacitor, PWA, and App Store Deployment

If there's any chance you'll go to the app stores, **plan for it while brainstorming, not after.** Retrofitting mobile is painful.

**Capacitor** is the route I recommend for wrapping a web app in a native mobile shell. It works with any frontend framework (Svelte, React, Vue) and reaches native device features (camera, files, push notifications) through plugins. The decisions it forces (how routing works, how assets are bundled, how plugins are reached) need to be in the project from Sprint 1.

**A PWA (Progressive Web App)** is a good halfway house for testing a prototype without the app store pain. If you're not sure you need the stores, start here. You get home-screen install, offline use and push notifications on most platforms, with no Apple or Google review.

**Fastlane** automates store submission: screenshots, metadata, code signing and upload. If you do need the stores, ask Claude to set it up as part of the deploy tooling.

**Framework choice matters.** Svelte gives smaller bundles and cleaner code, which means faster mobile apps. With no framework preference and mobile as a target, I'd pick Svelte with Capacitor. Include the SDKs for any outside services (payments, analytics, auth) from the start.

---

## Desktop: Electron vs Tauri

Desktop apps need a framework that connects web tech to the operating system.

**Electron** is the established choice. VS Code, Slack and Discord all run on it. It bundles a full Chromium browser and Node.js, so rendering is the same everywhere. The costs are real: apps start at 100 to 150MB, use hundreds of MB of RAM, and every instance runs its own Chromium.

**Tauri** is the modern alternative, built on Rust. It uses the operating system's own webview instead of bundling Chromium, so apps are often under 10MB and use about half the RAM. Tauri 2.0 went stable in late 2024 and added iOS and Android from one codebase. The trade-off is small webview differences between platforms (WebKit on macOS, Chromium-based WebView2 on Windows), which rarely matter for typical apps. You don't need to know Rust well. Most logic stays in your JavaScript, and Tauri's plugins cover the common native features.

**For AI-built projects,** Tauri's smaller surface helps: fewer things to break, simpler builds, and native features stay off until you switch them on, which heads off a class of Electron problems.

**Whichever you pick,** desktop work can turn into a loop of rebuild, reinstall, rerun, same bug. Cut it short from the start:

- a control panel or companion log viewer
- plenty of console logging and error reporting
- rebuild and reinstall scripts Claude can run quickly

Raise the desktop target while brainstorming so the architecture, build tooling and debugging setup are planned from Sprint 1.

---

## Dependency Versions

Claude's training data can be months old, so it doesn't always install the latest stable versions. That leads to compatibility problems, deprecation warnings and sometimes outright failures. The fix is a rule telling it to search the web for current versions before installing anything (it's in the list below).

---

## What to add to CLAUDE.md

The deploy rules from this chapter, in one place:

1. Use Docker for all backend services. Never install them directly on the machine.
2. Never overwrite the production `.env`. When prod needs a new variable, add it to `.env.example` with a note and tell me to set it on the server myself.
3. Keep separate `.env.development` and `.env.production` files (or your framework's equivalent), and always know which environment you're targeting.
4. Before any deploy action, confirm the target environment with me. You may deploy to dev. Only I promote to prod.
5. Never poll a long-running job (deploys, container builds, image pulls, big migrations). Start it, return, and give me a one-line command to check on it.
6. After every `docker compose up -d --force-recreate`, run `docker image prune -f`.
7. For SvelteKit: `hooks.server.ts` sets `no-cache` on HTML and `immutable` on `/_app/immutable/`. nginx sets cache headers explicitly. Deploys do a clean build (`rm -rf .svelte-kit build`) and use `pm2 restart`, not `pm2 reload`. Unregister service workers unless the app is a PWA on purpose. Show the build version in the UI.
8. Before any `npm install`, `pip install` or similar, search the web for the latest stable version of each package. Don't trust your training data for version numbers.

---

## Quick Reference

| Target | Tool | Key point |
|--------|------|-----------|
| **Static frontend** | Netlify / Vercel | Free tier, deploys from GitHub |
| **Backend services** | Docker Desktop (local), Hetzner (cloud) | Always containerise, always separate dev and prod |
| **Mobile (app store)** | Capacitor + Fastlane | Plan from Sprint 1, not after |
| **Mobile (prototype)** | PWA | Quick to ship, no store review |
| **Desktop (light)** | Tauri | Smaller, faster, locked down by default |
| **Desktop (established)** | Electron | Bigger ecosystem, same rendering everywhere |

Before any registry-pull deploy, check that CI actually built the image: `gh run list --branch dev -L 3`. If the latest run failed or never started, you'll deploy a stale image. [Deploy Verification](/part-5/deploy-verification#ci-cd-pre-flight-checks) has the full pre-deploy script.

---

**Next:** [Deploy Verification](/part-5/deploy-verification): confirming your code actually reached production.
