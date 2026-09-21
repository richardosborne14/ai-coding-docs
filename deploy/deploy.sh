#!/usr/bin/env bash
# Build the guide and push it to nexus-1 (Hetzner), served by the shared Caddy.
#
#   ./deploy/deploy.sh              # build + sync files (+ reload if the site block is installed)
#   ./deploy/deploy.sh --go-live    # build + sync, install the Caddy block, get TLS for the domain
#   ./deploy/deploy.sh --rollback   # remove the Caddy block (files stay in /srv)
#
# Caddy runs natively under systemd and also serves nexus, digitalbricks.io and
# others from /etc/caddy/conf.d/*.caddy. This script only ever touches
# /etc/caddy/conf.d/ai-coding.caddy and /srv/ai-coding/.
set -euo pipefail

IP="${DB_HOST:-49.12.102.195}"
DOMAIN="ai-coding.digitalbricks.io"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/nexus_hetzner}"
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$HERE")"
SSH=(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "root@$IP")
CONF=/etc/caddy/conf.d/ai-coding.caddy

build() {
  echo "==> building"
  (cd "$ROOT" && npm run build >/dev/null)
}

sync_files() {
  echo "==> syncing site to $IP"
  "${SSH[@]}" 'mkdir -p /srv/ai-coding/site'
  rsync -az --delete \
    -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new" \
    "$ROOT/docs/.vitepress/dist/" "root@$IP:/srv/ai-coding/site/"
}

reload_caddy() {
  echo "==> validating config"
  if ! "${SSH[@]}" 'caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile' >/dev/null 2>&1; then
    echo "!! config invalid — NOT reloading (other sites stay up on the running config)" >&2
    "${SSH[@]}" 'caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile' >&2 || true
    exit 1
  fi
  echo "==> reloading caddy"
  "${SSH[@]}" 'systemctl reload caddy && sleep 2 && systemctl is-active caddy'
}

verify() {
  echo "==> verifying"
  # Other sites share this box. If a change here breaks them, that is the thing to catch.
  for u in https://nexus.digitalbricks.io/ https://digitalbricks.io/ "https://$DOMAIN/" "https://$DOMAIN/part-1/philosophy"; do
    printf '  %s -> %s\n' "$u" "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 30 "$u" || echo FAIL)"
  done
}

case "${1:-}" in
  --go-live)
    echo "==> checking DNS points here before asking Caddy for a certificate"
    resolved="$(dig +short "$DOMAIN" A | tail -1)"
    if [ "$resolved" != "$IP" ]; then
      echo "!! $DOMAIN resolves to '${resolved:-nothing}', expected $IP." >&2
      echo "   Add an A record (ai-coding -> $IP) and wait for propagation first." >&2
      exit 1
    fi
    build
    sync_files
    scp -q -i "$SSH_KEY" "$HERE/ai-coding.caddy" "root@$IP:$CONF"
    reload_caddy
    sleep 8   # give ACME a moment to complete the challenge
    verify
    ;;
  --rollback)
    "${SSH[@]}" "rm -f $CONF"
    reload_caddy
    ;;
  *)
    build
    sync_files
    if "${SSH[@]}" "test -f $CONF"; then
      scp -q -i "$SSH_KEY" "$HERE/ai-coding.caddy" "root@$IP:$CONF"
      reload_caddy
      verify
    else
      echo "   (site block not installed yet — run with --go-live once DNS is set)"
    fi
    ;;
esac

echo "==> done"
