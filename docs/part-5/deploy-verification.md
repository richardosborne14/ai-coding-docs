---
title: Deploy Verification
description: How to prove your code actually reached production, when every signal says the deploy worked.
---

# Deploy Verification

## TLDR

- The most dangerous deploy failure isn't a crash. It's when everything looks green and the old code is still running. Health checks pass, CI shows a tick, Docker says "Started", and your changes aren't live.
- The causes: image tag mix-ups, Docker's layer cache, bind mounts, and the gap between "container started" and "new code is running".
- The fix: a **build-info endpoint** baked into every image, **pre-flight checks** on CI before you deploy, `--force-recreate` on every restart, and **deploy rules in CLAUDE.md** so Claude never calls a deploy done without proof.
- Copy-paste templates for all of it are below. If you deploy Docker containers to production, read this before your next deploy.

---

## The Problem: Everything Looks Green But Nothing Changed

You push to your `dev` branch. GitHub Actions builds a new Docker image and pushes it to GHCR (or Docker Hub, or ECR). You run the deploy script, or the control panel runs it for you. The output says:

```
✅ Pulled latest image
✅ Container recreated
✅ Health check passed
✅ Done
```

You tell everyone it's live. An hour later someone reports the bug is still there. You SSH in, grep the running code, and **it's the old version.**

That's the phantom deploy. CI was green, Docker said "Started", the health check returned 200, and none of your changes are running.

A deploy pipeline has several places to fail silently, and each one looks like success on its own. Claude sees Docker say "Started" and reasonably concludes the deploy worked. It can't know the container runs old code unless you give it a way to check. This chapter gives it one.

---

## The Ten Failure Modes

Each of these produces "success" output, and each has bitten a real project.

### FM-1: The CI That Never Ran

**What happens:** your CI workflow has `paths:` filters. You changed a file outside them (a config file, a deploy script, a shared utility), so no build ran. The registry still holds the last build, possibly days old. The deploy pulls it and says "Done".

**Why it's silent:** there IS an image to pull, just the old one. Docker doesn't know it lacks your latest commit, and old code passes health checks fine.

**The fix:** check CI status before every deploy. See [CI/CD Pre-Flight Checks](#ci-cd-pre-flight-checks).

### FM-2: The CI That Failed Silently

**What happens:** the build went red and nobody looked. The `:latest` (or `:dev`) tag still points at the last _successful_ build. The deploy pulls it. "Done."

**The fix:** the same pre-flight check. Make sure the build for your latest commit is green, not just that _a_ build exists.

### FM-3: The Docker Cache Lie

**What happens:** you pull the new image, and `docker compose up -d myservice` says "up-to-date" or "Running" instead of "Recreated". Because of its local cache, Docker thinks nothing changed. The container never restarts and the old code stays in memory.

**The fix:** always use `--force-recreate`. See [Docker Cache Lies](#docker-cache-lies).

### FM-4: The Bind-Mount Blind Spot

**What happens:** the image has the code baked in. But the production `docker-compose.yml` bind-mounts a folder from the host over it (for example `./packages/ingestion:/app/ingestion:ro`). The container runs the HOST copy. You updated the image and forgot the host files.

**Why it's silent:** it starts and runs fine. It's just the wrong code, and Docker's output doesn't say where the code came from.

**The fix:** rsync bind-mounted folders before restarting. See [Bind-Mount Gotchas](#bind-mount-gotchas).

### FM-5: The Volume That Didn't Refresh

**What happens:** static files (widget bundles, SPA builds) live in a named volume filled by an init container. That container exited on an earlier deploy, and Docker reuses it instead of running it again. The volume keeps the old files.

**The fix:** `docker compose rm -f <init-container>` before `up -d`, then check the volume's contents.

### FM-6: The Browser Cache

**What happens:** the server side is perfect, but the browser has cached the old JavaScript, HTML or API response. The user sees the old UI and every server-side check passes.

**The fix:** content-hashed filenames for JS and CSS (Vite and Webpack do this by default), `Cache-Control: no-cache` on HTML, and short cache times on API responses. See [Cache, Staleness, and "My Changes Aren't Showing"](/part-5/deployment-platforms#cache-staleness-and-my-changes-aren-t-showing).

### FM-7: The Forgotten Push

**What happens:** the code was committed locally but never pushed, or pushed to the wrong branch. No CI build ran, so the deploy pulled the old image.

**Why it's silent:** `git log` shows the commit. Only `git log origin/main..HEAD` would reveal it was never pushed, and nobody ran it.

**The fix:** a rule in CLAUDE.md: `git log origin/main..HEAD` must be empty before anything is called ready to deploy. See [AI Deploy Rules](#ai-deploy-rules).

### FM-8: The Env File Overwrite

**What happens:** the deploy script rsyncs config to the server and picks up `.env.production` by accident. It overwrites the server's variables (tag pins, secrets, API keys), and the container restarts with the wrong config.

**Why it's silent:** the container starts, and may pass health checks if the health endpoint doesn't use the overwritten values. The damage shows up later as odd API errors.

**The fix:** exclude `.env*` from every rsync and copy, and never automate env file deployment. [Deployment & Platform Targets](/part-5/deployment-platforms) already has this rule. It's here too because it's so easy to get wrong.

### FM-9: No Way to Ask "What Are You Running?"

**What happens:** after a deploy you can't ask the container which commit it's running without SSHing in and grepping. The control panel can't check either.

**Why it's silent:** it isn't a failure as such. It's the missing check that makes every other failure invisible.

**The fix:** the build-info endpoint. See [The Build-Info Pattern](#the-build-info-pattern).

### FM-10: The Disk That Filled Up

**What happens:** the server runs out of space. Containers fail with `no space left on device`, logs can't write, builds die half-way and databases refuse new data. Yesterday it was fine.

**Why it's silent:** every `docker compose pull` downloads a new image (often 200 to 800MB) and never removes the old one. After months of deploys, dozens of dangling images pile up where `docker ps` can't show them.

**The fix:** `docker system df` and `df -h /` to see the damage, then `docker image prune -f`. Prevent it with a prune at the end of every deploy, a weekly cron job, and a disk check before deploying. [Docker Image Cleanup: The Silent Disk Killer](/part-5/deployment-platforms#docker-image-cleanup-the-silent-disk-killer) has the full pattern.

---

## The Build-Info Pattern

This is the most important check in the chapter. It takes about 15 minutes to add and saves hours of debugging.

**The idea:** bake the git SHA and build time into the image when it's built. Expose them at `/api/build-info`. After every deploy, call it and compare the SHA with what you pushed. If they match, your code is live. If they don't, the deploy failed silently.

### Template: Dockerfile Build Args

```dockerfile
FROM python:3.12-slim AS runtime
# Bake git metadata into the image at build time
ARG GIT_SHA=unknown
ARG BUILD_DATE=unknown
# Expose them to the running process
ENV GIT_SHA=${GIT_SHA}
ENV BUILD_DATE=${BUILD_DATE}
# ... rest of your Dockerfile
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Template: Build-Info Endpoint (Python/FastAPI)

```python
@app.get("/api/build-info")
async def build_info():
    """Build metadata baked into the Docker image at build time.
    Used to verify deploys actually propagated."""
    import os
    return {
        "git_sha": os.environ.get("GIT_SHA", "unknown"),
        "build_date": os.environ.get("BUILD_DATE", "unknown"),
        "image_tag": os.environ.get("IMAGE_TAG", "unknown"),
        "environment": os.environ.get("ENVIRONMENT", "unknown"),
    }
```

The same in Node.js/Express:

```javascript
app.get('/api/build-info', (req, res) => {
  res.json({
    git_sha: process.env.GIT_SHA || 'unknown',
    build_date: process.env.BUILD_DATE || 'unknown',
    image_tag: process.env.IMAGE_TAG || 'unknown',
    environment: process.env.NODE_ENV || 'unknown',
  });
});
```

### Template: GitHub Actions Build Args

Pass the SHA and build time to the Docker build in CI:

```yaml
- name: Build and push backend image
  uses: docker/build-push-action@v5
  with:
    context: ./packages/backend
    file: ./packages/backend/Dockerfile
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    build-args: |
      GIT_SHA=${{ github.sha }}
      BUILD_DATE=${{ github.event.head_commit.timestamp }}
```

### Verification After Deploy

```bash
# After any deploy:
curl -s https://your-domain.com/api/build-info | jq .

# Expected:
# {
#   "git_sha": "abc1234def5678...",
#   "build_date": "2026-05-05T10:30:00Z",
#   "image_tag": "dev",
#   "environment": "production"
# }

# Compare git_sha with what you pushed:
git rev-parse HEAD
# These MUST match. If they don't, the deploy failed silently.
```

::: tip
If `git_sha` comes back `"unknown"`, the image was built before you added this pattern. Trigger a fresh CI build with the updated Dockerfile and redeploy.
:::

---

## CI/CD Pre-Flight Checks

Before pulling images, check that CI actually built them. This catches FM-1 (CI never ran) and FM-2 (CI failed).

The quick version is one prompt: *"Before deploying, check the latest GitHub Actions build for the dev branch succeeded."* Claude runs:

```bash
gh run list --branch dev -L 5
# The most recent run for each workflow must be a success.
# If it failed or is still running, do NOT deploy.
```

The `gh` CLI asks GitHub directly. If the latest build failed, the `:dev` tag still points at the _previous_ good build, and deploying it gives you old code with a success message.

### Template: Pre-Flight Check Script

Run this before any production deploy. Replace `dev` with your branch.

```bash
#!/bin/bash
# pre-deploy-check.sh: run before any production deploy
set -e
BRANCH=dev

echo "=== Pre-Deploy Checks ==="

# 1. Verify all changes are pushed
UNPUSHED=$(git log origin/$BRANCH..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')
if [ "$UNPUSHED" -gt 0 ]; then
  echo "❌ $UNPUSHED unpushed commit(s). Push first."
  git log origin/$BRANCH..HEAD --oneline
  exit 1
fi
echo "✅ All commits pushed"

# 2. Check latest CI build status (requires gh CLI)
LATEST_RUN=$(gh run list --branch $BRANCH -L 1 --json conclusion,name,headSha -q '.[0]')
CONCLUSION=$(echo "$LATEST_RUN" | jq -r '.conclusion')
SHA=$(echo "$LATEST_RUN" | jq -r '.headSha' | cut -c1-7)

if [ "$CONCLUSION" != "success" ]; then
  echo "❌ Latest CI build: $CONCLUSION (sha-$SHA)"
  echo "   Fix the build before deploying."
  exit 1
fi
echo "✅ Latest CI build: success (sha-$SHA)"

echo "=== All pre-flight checks passed ==="
```

---

## Docker Cache Lies

`docker compose up -d` skips recreating a container if it thinks the image hasn't changed. The tag may point at a new image, but Docker's local cache disagrees.

**The rule:** always use `--force-recreate` when deploying from a registry.

```bash
# ❌ WRONG: may skip the restart if Docker's cache thinks the image is the same
docker compose up -d backend

# ✅ RIGHT: always restarts the container
docker compose pull backend
docker compose up -d --force-recreate backend
```

`--force-recreate` skips Docker's comparison. The container is stopped, removed and started fresh from the pulled image. You pay a few seconds of extra downtime for certainty.

::: warning
If Docker says "up-to-date" or "Running" instead of "Recreated" after a pull, your new code is NOT running. This is the most common cause of phantom deploys, so read the output every time.
:::

---

## Bind-Mount Gotchas

If `docker-compose.yml` bind-mounts folders into the container, those folders come from the **host**, not the image.

```yaml
# docker-compose.yml
services:
  backend:
    image: ghcr.io/your-org/backend:dev
    volumes:
      - ../ingestion:/app/ingestion:ro  # ← This overrides what's in the image!
```

**The trap:** you push new ingestion code, CI bakes it into a new image, you deploy the image, and the container still reads the old code from the host mount.

**The fix:** rsync bind-mounted folders to the server BEFORE restarting containers:

```bash
# In your deploy script, BEFORE docker compose up:
rsync -az --delete packages/ingestion/ user@server:/opt/app/packages/ingestion/
```

::: tip
Go through `docker-compose.yml` for ALL bind mounts. For each one, ask: "Is this folder also rsynced during deploy?" If not, it's a blind spot waiting to bite.
:::

---

## The GOTCHAS.md Pattern

Every project should have a `GOTCHAS.md` (or `docs/GOTCHAS.md`): a curated list of things that have already caused real incidents and will bite again tomorrow.

It isn't a README or a session log. A README is for onboarding and goes stale. A session log grows forever until nobody reads it. `GOTCHAS.md` is curated. Every entry uses the same format and earned its place by **already costing real time**.

Watch its length like any other doc. When it gets long, ask Claude to group related entries and move ones that no longer apply to an archive file.

### Template: GOTCHAS.md Entry

```markdown
### G[NUMBER]: [SHORT MEMORABLE TITLE]

**Symptom:** [What you see when this bites you]
**Cause:** [Why it happens]
**Fix:** [Concrete steps]
**Verify:** [A command or check that confirms the fix worked]
```

A filled-in example:

```markdown
### G33: GHCR pull deploys: --force-recreate is mandatory

**Symptom:** `docker compose up -d backend` after `docker pull` reports "up to date" and the old code is still running.
**Cause:** `up -d` skips recreation if it thinks the image digest is unchanged. The local layer cache disagrees with the registry.
**Fix:** Always use `--force-recreate` on registry-pull deploys.
**Verify:** `docker inspect deploy-backend-1 --format '{{.Created}}'` shows a recent timestamp.
```

The rule for CLAUDE.md:

> After any session where you discover a production gotcha, add it to GOTCHAS.md in the G[N] format. Never delete entries. Only I mark an entry "resolved" or "no longer applies".

---

## AI Deploy Rules

These go in your project's `CLAUDE.md`. They stop Claude calling a deploy done without evidence.

Without them, Claude runs the deploy, sees Docker say "Started" and reports success. It isn't lying. Every signal it can see says the deploy worked. It just has no way to check that the _right_ code is running. These rules give it one.

### Template: Deploy Verification Rules

```markdown
## Deploy Verification: MANDATORY

### Before saying "ready to deploy":
1. Verify push: `git log origin/[BRANCH]..HEAD` must be empty.
2. Verify CI: `gh run list --branch [BRANCH] -L 3` must show the latest run succeeded.
3. If no build ran (paths filter), warn me: "No build triggered: file not in CI paths. Consider a manual trigger."

### After ANY production deploy:
1. Check the running build:
   curl -s https://[YOUR_DOMAIN]/api/build-info | jq .
2. Compare `git_sha` with `git rev-parse HEAD`. They must match.
3. Never say a deploy is done without showing me the verification output.
4. If they don't match, report: "Deploy verification FAILED: code not live. Expected SHA XXX, got YYY."
```

[Project Templates](/part-6/templates) has the full `CLAUDE.md` template with these rules included.

---

## The Deploy Verification Checklist

A quick checklist for every deploy. Pin it or print it from your deploy script.

```
╔══════════════════════════════════════════════════════════╗
║              DEPLOY VERIFICATION CHECKLIST               ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  PRE-DEPLOY:                                             ║
║  □ All changes committed and pushed                      ║
║  □ CI/CD build is green for latest commit                ║
║  □ No unpushed commits: git log origin/X..HEAD           ║
║  □ Bind-mounted directories rsynced to server            ║
║  □ Server disk space adequate: docker system df          ║
║                                                          ║
║  DEPLOY:                                                 ║
║  □ Used --force-recreate (not bare up -d)                ║
║  □ Init containers rm -f'd before re-run                 ║
║  □ DB migrations ran successfully                        ║
║  □ Reverse proxy restarted (nginx/caddy/traefik)         ║
║                                                          ║
║  POST-DEPLOY:                                            ║
║  □ /api/build-info returns expected git_sha              ║
║  □ Health endpoint returns 200                           ║
║  □ Static assets accessible (not 404)                    ║
║  □ Quick smoke test in browser                           ║
║                                                          ║
║  IF ANY CHECK FAILS: Do NOT declare "deploy done"        ║
║  Report: "Deploy verification FAILED: [which check]"     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## Quick Reference

| Problem | Fix | One-liner |
|---------|-----|-----------|
| CI didn't trigger | Check the GHA paths filter | `gh run list --branch dev -L 3` |
| CI build failed | Fix the build before deploying | `gh run list --branch dev -L 1 --json conclusion` |
| Docker cache lie | Force-recreate | `docker compose up -d --force-recreate backend` |
| Bind mount stale | Rsync before restart | `rsync -az packages/X/ user@host:/opt/app/packages/X/` |
| Volume not refreshed | Remove the init container first | `docker compose rm -f init-container && docker compose up -d` |
| Browser cache | Content hashes plus no-cache HTML | Check nginx `Cache-Control` headers |
| Forgot to push | Check for unpushed commits | `git log origin/main..HEAD --oneline` |
| Env file overwritten | Never rsync .env files | Audit the deploy script for `.env*` in rsync |
| Can't verify deploy | Build-info endpoint | `curl -s https://domain/api/build-info \| jq .git_sha` |
| Disk full | Prune dangling images | `docker image prune -f` then `docker system df` |

---

## See Also

- [Deployment & Platform Targets](/part-5/deployment-platforms): where and how to deploy, including the non-polling pattern and the cache fixes.
- [The Project Control Panel](/part-5/control-panel): the Deployment Centre should show the running SHA from `/api/build-info`.
- [Common Pitfalls](/part-5/pitfalls-recovery): Pitfall 6 (the phantom deploy) covers recovery when this goes wrong.
- [Plans and Limits](/part-0/plans-and-limits): why a Claude session left polling a deploy eats your usage limits.

---

**Next:** [Common Pitfalls](/part-5/pitfalls-recovery): what goes wrong and how to recover.
