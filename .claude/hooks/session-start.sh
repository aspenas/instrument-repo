#!/usr/bin/env bash
# creator-kit SessionStart hook.
#
# Two-environment behavior:
#   - macOS dev machine (laptop, macstudio): no-op. The user-global hook at
#     ~/.claude/hooks/session-start.sh handles context injection; this hook
#     would only duplicate work or worse.
#   - Linux web/phone sandbox (no agent-browser keychain, no chezmoi-synced
#     dotfiles, ephemeral home): runs web-bootstrap.sh to install + auth the
#     full credential surface (Infisical → gh → Cloudflare → Tailscale).
#
# Hook contract: SessionStart hooks receive a JSON payload on stdin with cwd,
# session_id, source. We pass it through (no transformations) and exit 0 on
# success, non-zero only if the bootstrap itself fails on a Linux sandbox.

set -uo pipefail

INPUT=$(cat 2>/dev/null || true)
HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$(uname)" = "Linux" ]; then
  if ! bash "$HOOK_DIR/web-bootstrap.sh"; then
    rc=$?
    echo "[session-start] web-bootstrap.sh exited $rc — credentials may be incomplete" >&2
    # Don't fail the whole session; warn loudly but proceed. A partial bootstrap
    # is usually better than no session at all (creator can still work read-only).
    exit 0
  fi
fi

# JSON pass-through (no-op for context injection — left to user-global hook).
[ -n "$INPUT" ] && printf '%s' "$INPUT" >/dev/null
exit 0
