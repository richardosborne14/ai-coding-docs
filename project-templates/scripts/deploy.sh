#!/usr/bin/env bash
# scripts/deploy.sh
# Build-on-server deploy script. Run this ON THE SERVER, not on AI's machine.
# AI's involvement should be a single SSH command that triggers this script
# and returns immediately. AI must never poll for the build to finish.
#
# See: docs/part-5/deployment-platforms (The Non-Polling Deploy Pattern)

set -euo pipefail

# --- CONFIGURE THESE ---------------------------------------------------------
APP_DIR="/var/www/your-app"
PM2_NAME="your-app"
BRANCH="main"
NODE_ENV="production"
# ----------------------------------------------------------------------------

echo "▸ Deploy starting at $(date -Iseconds)"
cd "$APP_DIR"

echo "▸ Pulling latest from origin/$BRANCH"
git fetch --quiet origin
git reset --hard "origin/$BRANCH"

echo "▸ Installing dependencies (npm ci)"
npm ci --no-audit --no-fund

echo "▸ Cleaning stale build artefacts"
rm -rf .svelte-kit build

echo "▸ Building (with source maps for error tracking)"
NODE_ENV="$NODE_ENV" npm run build

# --- Observability: release tagging + source maps (Foundation, irreversible) ---
# Ordering guarantee: generate → upload → strip → package.
# Source maps MUST be uploaded BEFORE they are stripped from the build output.
# Skipping this step means production errors from this build are permanently
# undebuggable — minified stack traces with no way to de-minify them.
RELEASE_VERSION="$(git describe --tags --always)"
RELEASE_COMMIT="$(git rev-parse HEAD)"

echo "▸ Uploading source maps (release: $RELEASE_VERSION, commit: $RELEASE_COMMIT)"
# Verify exact flags against current PostHog docs before first use:
#   https://posthog.com/docs/error-tracking/upload-source-maps
# The shape below works for posthog-cli — adapt if using a different tracker
# (e.g. sentry-cli sourcemaps upload + sentry-cli releases).
posthog-cli sourcemap upload --directory build \
  --release-version "$RELEASE_VERSION" \
  --release-commit  "$RELEASE_COMMIT"

echo "▸ Stripping source maps from public artifact"
# IMPORTANT: do not serve .map files publicly — they leak source code.
# Maps have already been uploaded; now remove them from the deployed build.
find build -name '*.map' -delete
# --- end observability step ---

echo "▸ Restarting pm2 process: $PM2_NAME"
# Use restart, not reload — clean process switch avoids stale-response window
pm2 restart "$PM2_NAME" --update-env

echo "✓ Deploy complete at $(date -Iseconds)"
echo ""
echo "  Status check:"
echo "    pm2 logs $PM2_NAME --lines 50"
echo "    curl https://your-domain.example.com/api/health"
