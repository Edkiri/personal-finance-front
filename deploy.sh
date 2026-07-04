#!/usr/bin/env bash
#
# Deploy the personal-finance front (static SPA) on the VPS.
# Run this ON THE SERVER from inside the repo:  ./deploy.sh
# (or remotely via the workspace Makefile:  make deploy-front)
#
# NOTE: VITE_API_BASE_URL is baked in at BUILD time from this repo's .env on the
# server. That .env must contain:
#     VITE_API_BASE_URL=https://tracker-api.eduardok.space
# otherwise the production bundle will call http://localhost:3000.
#
set -euo pipefail

# --- config (override via env) ------------------------------------------------
DEST="${DEST:-/var/www/personal-finance}"   # Caddy `root` for money.eduardok.space
# -----------------------------------------------------------------------------

# ssh <host> 'cmd' runs a non-login shell, which doesn't source ~/.bashrc, so
# nvm (and npm/node/pm2 with it) wouldn't be on PATH without this.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")"

echo "==> [front] git pull"
git pull --ff-only

echo "==> [front] npm ci"
npm ci

echo "==> [front] build"
npm run build

echo "==> [front] publish -> $DEST (atomic swap)"
# Build into a staging dir next to DEST (same filesystem) then swap with mv,
# so Caddy never serves a half-copied site.
PARENT="$(dirname "$DEST")"
STAGE="$(mktemp -d "$PARENT/.pf-front.XXXXXX")"
OLD="$DEST.old"

# use sudo only if DEST's parent isn't writable by us
SUDO=""
[ -w "$PARENT" ] || SUDO="sudo"

$SUDO cp -r dist/. "$STAGE/"
$SUDO rm -rf "$OLD"
[ -e "$DEST" ] && $SUDO mv "$DEST" "$OLD" || true
$SUDO mv "$STAGE" "$DEST"
$SUDO rm -rf "$OLD"

echo "==> [front] done"
