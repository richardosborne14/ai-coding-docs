# O4: Source-Map Upload + Release Tagging in the Deploy Script Template

**Status:** BACKLOG
**Sprint:** Phase 3
**Priority:** P0
**Est. effort:** 45 min
**Dependencies:** None

---

## Context

This is the irreversible plumbing made concrete. The deploy chapter and `scripts/deploy.sh` template (from the Phase 2 deploy work) need to upload source maps to the error tracker and record a release at deploy time. If a project's deploy script doesn't do this, the Foundation checklist boxes can never honestly be ticked, and historical production errors stay undebuggable.

This task adds the wiring to the **template** and documents it in the deployment chapter. The exact PostHog CLI invocation should be verified against current docs (it changes) — this task specifies the shape and the guarantees, not a frozen command.

---

## What to Add

### 1. Deploy script template (`scripts/deploy.sh`)

Add a source-map + release step to the build phase. Reproduce this as the template shape (Cline should confirm the exact `posthog-cli` flags against https://posthog.com/docs/error-tracking/upload-source-maps and https://posthog.com/docs/error-tracking/releases before finalising):

```bash
# --- Observability: release tagging + source maps (Foundation, irreversible) ---
# Derive a release identifier from git. For mobile builds also pass --build.
RELEASE_VERSION="$(git describe --tags --always)"
RELEASE_COMMIT="$(git rev-parse HEAD)"

# Build WITH source maps generated (do not disable sourcemaps in the prod build).
# SvelteKit: ensure the build emits .map files for this step, then strip them
# from the public artifact after upload (see note below).
npm run build

# Upload source maps to the error tracker and record the release.
# Verify exact flags against current PostHog docs — shape shown:
#   posthog-cli sourcemap upload --directory <build-output-dir> \
#       --release-version "$RELEASE_VERSION" \
#       --release-commit  "$RELEASE_COMMIT"
posthog-cli sourcemap upload --directory build \
  --release-version "$RELEASE_VERSION" \
  --release-commit  "$RELEASE_COMMIT"

# IMPORTANT: do not serve .map files publicly. After upload, exclude them from
# the deployed artifact so source isn't leaked to the browser.
find build -name '*.map' -delete
# --- end observability step ---
```

### 2. Ignore-file hygiene

So source maps are uploaded but never shipped or bloated into build contexts:

- Add `*.map` to the `.dockerignore` template's public-artifact section **only if** maps are stripped before the image is built — otherwise ensure the upload happens before the Docker context is assembled. Document the ordering explicitly: **generate → upload → strip → package.**
- Note in the `.clineignore` template that uploaded/stripped `.map` files and the `node_modules`/build dirs stay ignored (ties into the Phase 2 cost-hygiene work — Cline never needs to load source maps into context).

### 3. Deployment chapter

In the deployment chapter (`docs/part-5/deployment-platforms.md` or the deploy chapter from Phase 2 — search the repo for the canonical one), add a short subsection "Observability wiring (do this in Sprint 1)":

- Explain the **generate → upload → strip → package** ordering and why each step matters.
- State plainly: this is the irreversible step. Skipping it means past production errors can't be de-minified.
- Cross-reference the Observability chapter (O1) for the full reasoning.
- Note the non-polling principle still applies: the deploy script runs the upload once as part of the one-shot deploy, logs the result, and ends the turn — no looping to check upload status.

---

## Files to Modify

- `scripts/deploy.sh` template (project-templates) — add the observability step
- `.dockerignore` template — `*.map` handling note + ordering
- `.clineignore` template — confirm maps/build dirs ignored
- Deployment chapter in `docs/part-5/` — add the "Observability wiring" subsection

---

## Acceptance Criteria

- [ ] `scripts/deploy.sh` template generates source maps, uploads them with a release version + commit, then strips `*.map` from the public artifact
- [ ] The **generate → upload → strip → package** ordering is explicit in both the script comments and the chapter
- [ ] The script does not disable source-map generation in the prod build
- [ ] `.dockerignore` / `.clineignore` templates handle `.map` files without breaking the upload-before-strip ordering
- [ ] Deployment chapter has an "Observability wiring (Sprint 1)" subsection cross-referencing the Observability chapter
- [ ] The non-polling deploy principle is preserved (one-shot upload, log, end turn)
- [ ] Exact `posthog-cli` flags are verified against current PostHog docs, not copied blind

## Notes

- The risk to avoid: a build that strips or disables source maps *before* upload. That produces uploads with nothing to symbolicate. The ordering guarantee is the whole point of this task.
- If a project isn't on PostHog, the same shape applies to any tracker's CLI (e.g. `sentry-cli sourcemaps upload` + `sentry-cli releases`). Keep the template tracker-agnostic in its comments where practical.
