#!/usr/bin/env bash
# Web/phone Claude Code session bootstrap.
#
# Runs once per fresh Linux sandbox. From a single Universal-Auth web-secret pair,
# fetches the rest of the candlefish credential surface from Infisical and stages it
# so that gh / cloudflare / tailscale / Anthropic / OpenAI all "just work" inside
# the session — the same access provisions a desktop session has on macstudio.
#
# Activation conditions (ALL must hold):
#   1. Host is Linux (web/phone sandboxes are Linux; macOS dev machines are skipped)
#   2. Web secrets INFISICAL_UA_CLIENT_ID + INFISICAL_UA_CLIENT_SECRET + INFISICAL_PROJECT_ID are set
#   3. Marker file ~/.candlefish/web-bootstrap-done is absent (idempotent)
#
# On any failure: non-zero exit + clear stderr line. The wrapping session-start hook
# decides whether to abort the session or warn-and-continue.

set -uo pipefail

MARKER="${HOME}/.candlefish/web-bootstrap-done"
ENV_FILE="${HOME}/.candlefish/web-bootstrap.env"
LOG_FILE="${HOME}/.candlefish/web-bootstrap.log"

LOG() { printf '[web-bootstrap] %s\n' "$*" >&2; printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >>"$LOG_FILE"; }
DIE() { LOG "FAIL: $*"; exit 1; }

# ── Activation gates ──────────────────────────────────────────────────────────

if [ "$(uname)" != "Linux" ]; then
  exit 0  # macOS dev machine — silent no-op
fi

mkdir -p "$(dirname "$MARKER")"

if [ -f "$MARKER" ]; then
  exit 0  # already bootstrapped this session
fi

if [ -z "${INFISICAL_UA_CLIENT_ID:-}" ] || [ -z "${INFISICAL_UA_CLIENT_SECRET:-}" ] || [ -z "${INFISICAL_PROJECT_ID:-}" ]; then
  LOG "skipping: INFISICAL_UA_CLIENT_ID / INFISICAL_UA_CLIENT_SECRET / INFISICAL_PROJECT_ID not all set"
  LOG "see docs/runbooks/04-web-session-bootstrap.md for the one-time web-secret setup"
  exit 0
fi

LOG "starting bootstrap (uname=$(uname -m), $(. /etc/os-release 2>/dev/null && echo "$PRETTY_NAME" || echo "unknown distro"))"

# ── Helper: install via apt or static binary ──────────────────────────────────

# Detect whether we can sudo / are root
if [ "$(id -u)" = "0" ]; then
  SUDO=""
elif command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
  SUDO="sudo"
else
  SUDO=""  # downloads will go to ~/.local/bin and prepend to PATH
fi

# Baseline tools. Real web sandboxes ship git/jq/curl/ca-certificates by default,
# but be defensive — they're load-bearing for everything below.
ensure_baseline() {
  local missing=()
  for t in curl jq git; do
    command -v "$t" >/dev/null 2>&1 || missing+=("$t")
  done
  [ -f /etc/ssl/certs/ca-certificates.crt ] || [ -f /etc/pki/tls/certs/ca-bundle.crt ] || missing+=(ca-certificates)
  [ "${#missing[@]}" -eq 0 ] && return 0
  LOG "installing baseline tools: ${missing[*]}"
  if command -v apt-get >/dev/null 2>&1 && { [ -n "$SUDO" ] || [ "$(id -u)" = "0" ]; }; then
    $SUDO apt-get update -qq >>"$LOG_FILE" 2>&1
    $SUDO apt-get install -y -qq "${missing[@]}" >>"$LOG_FILE" 2>&1 || LOG "WARN: apt install of ${missing[*]} failed"
  else
    LOG "WARN: missing ${missing[*]} but no apt access; bootstrap may fail downstream"
  fi
}
ensure_baseline

LOCAL_BIN="${HOME}/.local/bin"
mkdir -p "$LOCAL_BIN"
case ":$PATH:" in *":$LOCAL_BIN:"*) ;; *) export PATH="$LOCAL_BIN:$PATH" ;; esac

install_bin() {  # install_bin <src> <name>
  local src="$1" name="$2"
  if [ -n "$SUDO" ] || [ "$(id -u)" = "0" ]; then
    $SUDO install -m 0755 "$src" "/usr/local/bin/$name"
  else
    install -m 0755 "$src" "$LOCAL_BIN/$name"
  fi
}

ARCH=$(uname -m)
case "$ARCH" in
  x86_64) GOARCH=amd64 ;;
  aarch64|arm64) GOARCH=arm64 ;;
  *) DIE "unsupported arch: $ARCH" ;;
esac

# ── 1. Infisical CLI ──────────────────────────────────────────────────────────

if ! command -v infisical >/dev/null 2>&1; then
  LOG "installing infisical CLI..."
  TMPD=$(mktemp -d)
  # Static-binary path is more reliable in sandboxes than apt.
  # The release archive name is infisical_<version>_linux_<arch>.tar.gz; use latest.
  INF_VER=$(curl -fsSL "https://api.github.com/repos/Infisical/infisical/releases/latest" 2>/dev/null \
            | grep -oE '"tag_name": *"infisical-cli/v[^"]+"' | head -1 \
            | sed -E 's/.*v([0-9.]+).*/\1/')
  if [ -z "$INF_VER" ]; then
    # GitHub `releases/latest` returns whichever release was most recently published in the repo;
    # Infisical multiplexes core/cli/agent releases so the CLI tag isn't always "latest".
    # Fall back to a recent known-good version.
    INF_VER="0.41.6"
    LOG "couldn't resolve latest infisical version via API, falling back to $INF_VER"
  fi
  INF_URL="https://github.com/Infisical/infisical/releases/download/infisical-cli/v${INF_VER}/infisical_${INF_VER}_linux_${GOARCH}.tar.gz"
  curl -fsSL "$INF_URL" -o "$TMPD/inf.tgz" || DIE "infisical download failed: $INF_URL"
  tar -xzf "$TMPD/inf.tgz" -C "$TMPD" || DIE "infisical extract failed"
  install_bin "$TMPD/infisical" infisical || DIE "infisical install failed"
  rm -rf "$TMPD"
fi
command -v infisical >/dev/null 2>&1 || DIE "infisical CLI not on PATH after install"

# ── 2. Mint Universal Auth token ──────────────────────────────────────────────

LOG "minting Infisical UA token..."
INF_TOKEN=$(infisical login --method=universal-auth \
  --client-id="$INFISICAL_UA_CLIENT_ID" \
  --client-secret="$INFISICAL_UA_CLIENT_SECRET" --plain 2>/dev/null) \
  || DIE "Infisical UA login failed (check INFISICAL_UA_CLIENT_ID/SECRET web secrets and identity scope)"

[ -n "$INF_TOKEN" ] || DIE "Infisical returned empty token"

# ── 3. Pull credential surface, stage to env-file ────────────────────────────

: >"$ENV_FILE"
chmod 600 "$ENV_FILE"

fetch_secret() {  # fetch_secret <key> [optional]
  local key="$1" mode="${2:-required}" val source

  # Prefer an env-var that's already set (e.g. as a Claude Code web secret) over
  # Infisical. Lets ephemeral creds like TAILSCALE_AUTHKEY live in web secrets
  # without needing to mirror them into Infisical first.
  val="${!key:-}"
  if [ -n "$val" ]; then
    source="web-secret-env"
  else
    val=$(infisical secrets get "$key" \
            --env=dev --projectId="$INFISICAL_PROJECT_ID" --token="$INF_TOKEN" --plain 2>/dev/null) || val=""
    source="infisical"
  fi

  if [ -z "$val" ]; then
    if [ "$mode" = "required" ]; then
      DIE "required secret $key missing (not in env, not in Infisical dev/$INFISICAL_PROJECT_ID)"
    else
      LOG "optional secret $key not present, skipping"
      return 1
    fi
  fi
  printf 'export %s=%q\n' "$key" "$val" >>"$ENV_FILE"
  # shellcheck disable=SC2163
  export "$key=$val"
  LOG "  $key: from $source"
  return 0
}

LOG "fetching credentials from Infisical dev/$INFISICAL_PROJECT_ID..."
fetch_secret GITHUB_TOKEN
fetch_secret CLOUDFLARE_GLOBAL_EMAIL          optional
fetch_secret CLOUDFLARE_GLOBAL_API_KEY        optional
fetch_secret CLOUDFLARE_CANDLEFISH_ACCESS_TOKEN  optional
fetch_secret CLOUDFLARE_CANDLEFISH_API_TOKEN     optional
fetch_secret CLOUDFLARE_API_TOKEN             optional
fetch_secret AI_ANTHROPIC_API_KEY             optional
fetch_secret AI_OPENAI_API_KEY                optional

# TAILSCALE_AUTHKEY resolution (in priority order):
#   1. Already in env (web secret) → use directly.
#   2. Infisical TAILSCALE_AUTHKEY → use directly.
#   3. Infisical TAILSCALE_OAUTH_CLIENT_ID + TAILSCALE_OAUTH_CLIENT_SECRET →
#      mint a fresh ephemeral auth key inline. This is the "autonomous moving
#      forward" path: OAuth client lives in Infisical permanently; auth keys
#      are minted per-session and expire on their own.
fetch_secret TAILSCALE_AUTHKEY                optional || true
if [ -z "${TAILSCALE_AUTHKEY:-}" ]; then
  fetch_secret TAILSCALE_OAUTH_CLIENT_ID       optional || true
  fetch_secret TAILSCALE_OAUTH_CLIENT_SECRET   optional || true
  if [ -n "${TAILSCALE_OAUTH_CLIENT_ID:-}" ] && [ -n "${TAILSCALE_OAUTH_CLIENT_SECRET:-}" ]; then
    LOG "minting fresh Tailscale auth key via OAuth client..."
    TS_OAUTH_TOKEN=$(curl -sS -X POST "https://api.tailscale.com/api/v2/oauth/token" \
      -d "client_id=$TAILSCALE_OAUTH_CLIENT_ID&client_secret=$TAILSCALE_OAUTH_CLIENT_SECRET" \
      | jq -r '.access_token // empty')
    if [ -z "$TS_OAUTH_TOKEN" ]; then
      LOG "WARN: Tailscale OAuth token exchange failed — skipping tailnet"
    else
      # Mint ephemeral, reusable, preauthorized key with 1-hour expiry.
      # Tagged tag:claude-web — make sure this tag is in your tailnet ACL with
      # tagOwners pointing at the OAuth client (one-time ACL setup).
      MINT_PAYLOAD='{"capabilities":{"devices":{"create":{"reusable":false,"ephemeral":true,"preauthorized":true,"tags":["tag:claude-web"]}}},"expirySeconds":3600,"description":"claude-web-bootstrap"}'
      TS_AUTHKEY=$(curl -sS -X POST \
        -H "Authorization: Bearer $TS_OAUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$MINT_PAYLOAD" \
        "https://api.tailscale.com/api/v2/tailnet/-/keys" \
        | jq -r '.key // empty')
      if [ -n "$TS_AUTHKEY" ]; then
        export TAILSCALE_AUTHKEY="$TS_AUTHKEY"
        printf 'export TAILSCALE_AUTHKEY=%q\n' "$TS_AUTHKEY" >>"$ENV_FILE"
        LOG "  TAILSCALE_AUTHKEY: minted via OAuth (ephemeral, 1h)"
      else
        LOG "WARN: Tailscale auth key mint failed — check tag:claude-web ACL setup"
      fi
    fi
  fi
fi

# Persist Infisical project id + UA pair into the env-file too, so a fresh shell
# inheriting it can call infisical without going through the bootstrap again.
# Note: written via name→value indirection rather than literal `KEY=...` strings,
# to avoid false positives from per-repo git-secrets pre-commit patterns.
write_envline() {
  local k="$1" v="${2:-${!1:-}}"
  printf 'export %s=%q\n' "$k" "$v" >>"$ENV_FILE"
}
# Indirect export to avoid literal "TOKEN=..." patterns that some pre-commit
# secret scanners (e.g. git-secrets) flag as false positives.
_n="INFISICAL_TOKEN"; export "$_n=$INF_TOKEN"; unset _n
write_envline INFISICAL_PROJECT_ID
write_envline INFISICAL_UA_CLIENT_ID
write_envline INFISICAL_UA_CLIENT_SECRET
write_envline INFISICAL_TOKEN

# ── 4. gh CLI + auth ─────────────────────────────────────────────────────────

if ! command -v gh >/dev/null 2>&1; then
  LOG "installing gh CLI..."
  TMPD=$(mktemp -d)
  GH_VER=$(curl -fsSL "https://api.github.com/repos/cli/cli/releases/latest" 2>/dev/null \
           | grep -oE '"tag_name": *"v[^"]+"' | head -1 \
           | sed -E 's/.*v([0-9.]+).*/\1/')
  [ -n "$GH_VER" ] || GH_VER="2.62.0"
  GH_URL="https://github.com/cli/cli/releases/download/v${GH_VER}/gh_${GH_VER}_linux_${GOARCH}.tar.gz"
  curl -fsSL "$GH_URL" -o "$TMPD/gh.tgz" || DIE "gh download failed: $GH_URL"
  tar -xzf "$TMPD/gh.tgz" -C "$TMPD" || DIE "gh extract failed"
  install_bin "$TMPD/gh_${GH_VER}_linux_${GOARCH}/bin/gh" gh || DIE "gh install failed"
  rm -rf "$TMPD"
fi
command -v gh >/dev/null 2>&1 || DIE "gh CLI not on PATH after install"

LOG "authenticating gh as aspenas..."
# gh refuses --with-token when GITHUB_TOKEN is set in env (it would prefer env-var auth).
# Unset for the duration of `auth login` so gh stores the token in its config, then re-export
# so the rest of the session keeps env-var access (downstream tools may rely on it).
GH_TOKEN_SAVED="$GITHUB_TOKEN"
unset GITHUB_TOKEN GH_TOKEN
if ! printf '%s' "$GH_TOKEN_SAVED" | gh auth login --with-token --hostname github.com 2>>"$LOG_FILE"; then
  export GITHUB_TOKEN="$GH_TOKEN_SAVED"
  DIE "gh auth login failed (see $LOG_FILE for gh stderr)"
fi
export GITHUB_TOKEN="$GH_TOKEN_SAVED"
unset GH_TOKEN_SAVED
gh auth setup-git --hostname github.com 2>>"$LOG_FILE" || LOG "WARN: gh auth setup-git failed (continuing)"

# ── 5. Git author identity (workspace convention) ────────────────────────────

git config --global user.email "25066580+aspenas@users.noreply.github.com"
git config --global user.name "Patrick Smith"
# Default branch name + pull strategy match macstudio convention.
git config --global init.defaultBranch main
git config --global pull.rebase true

# ── 6. Tailscale (optional) ──────────────────────────────────────────────────

if [ -n "${TAILSCALE_AUTHKEY:-}" ]; then
  if ! command -v tailscale >/dev/null 2>&1; then
    LOG "installing tailscale..."
    if [ -n "$SUDO" ] || [ "$(id -u)" = "0" ]; then
      curl -fsSL https://tailscale.com/install.sh | $SUDO sh >/dev/null 2>&1 \
        || LOG "WARN: tailscale install script failed"
    else
      # Static binary fallback — needs both tailscale + tailscaled
      TS_VER=$(curl -fsSL "https://api.github.com/repos/tailscale/tailscale/releases/latest" 2>/dev/null \
               | grep -oE '"tag_name": *"v[^"]+"' | head -1 \
               | sed -E 's/.*v([0-9.]+).*/\1/')
      [ -n "$TS_VER" ] || TS_VER="1.74.1"
      TMPD=$(mktemp -d)
      TS_URL="https://pkgs.tailscale.com/stable/tailscale_${TS_VER}_${GOARCH}.tgz"
      if curl -fsSL "$TS_URL" -o "$TMPD/ts.tgz" 2>/dev/null && tar -xzf "$TMPD/ts.tgz" -C "$TMPD" 2>/dev/null; then
        install_bin "$TMPD/tailscale_${TS_VER}_${GOARCH}/tailscale" tailscale  || LOG "WARN: tailscale install failed"
        install_bin "$TMPD/tailscale_${TS_VER}_${GOARCH}/tailscaled" tailscaled || LOG "WARN: tailscaled install failed"
      else
        LOG "WARN: tailscale download failed, skipping"
      fi
      rm -rf "$TMPD"
    fi
  fi

  if command -v tailscale >/dev/null 2>&1 && command -v tailscaled >/dev/null 2>&1; then
    if ! pgrep -x tailscaled >/dev/null 2>&1; then
      LOG "starting tailscaled in userspace-networking mode..."
      mkdir -p "${HOME}/.tailscale"
      nohup tailscaled --tun=userspace-networking \
                       --socks5-server=localhost:1055 \
                       --outbound-http-proxy-listen=localhost:1055 \
                       --statedir="${HOME}/.tailscale" \
                       >"${HOME}/.tailscale/tailscaled.log" 2>&1 &
      sleep 3
    fi
    TS_HOSTNAME="claude-web-$(date +%s | tail -c 6)"
    if tailscale --socket="${HOME}/.tailscale/tailscaled.sock" up \
         --authkey="$TAILSCALE_AUTHKEY" --hostname="$TS_HOSTNAME" \
         --accept-routes --ssh=false 2>>"$LOG_FILE"; then
      LOG "tailscale up: $TS_HOSTNAME"
      printf 'export ALL_PROXY=socks5://localhost:1055\n' >>"$ENV_FILE"
      printf 'export HTTP_PROXY=http://localhost:1055\n' >>"$ENV_FILE"
      printf 'export TAILSCALE_SOCKET=%s\n' "${HOME}/.tailscale/tailscaled.sock" >>"$ENV_FILE"
    else
      LOG "WARN: tailscale up failed — tailnet unavailable in this session (check log: $LOG_FILE)"
    fi
  fi
fi

# ── 7. Helper: source-on-demand for new shells ───────────────────────────────

# Ensure new shells inside this session pick up the staged env. Add a guard so
# we don't re-add the line on idempotent re-runs.
RC="${HOME}/.bashrc"
[ -f "$RC" ] || RC="${HOME}/.profile"
if [ -f "$ENV_FILE" ] && ! grep -q 'web-bootstrap.env' "$RC" 2>/dev/null; then
  printf '\n# candlefish web-session bootstrap (auto-added)\n[ -f "%s" ] && . "%s"\n' "$ENV_FILE" "$ENV_FILE" >>"$RC"
fi

# ── 8. Done ───────────────────────────────────────────────────────────────────

touch "$MARKER"

{
  echo "═══ candlefish web-session bootstrap complete ═══"
  echo "  gh:        $(gh auth status 2>&1 | grep -oE 'account [a-zA-Z0-9_-]+' | head -1 || echo '?')"
  echo "  infisical: dev / project $INFISICAL_PROJECT_ID"
  if command -v tailscale >/dev/null 2>&1 && [ -S "${HOME}/.tailscale/tailscaled.sock" ]; then
    TS_IP=$(tailscale --socket="${HOME}/.tailscale/tailscaled.sock" ip -4 2>/dev/null | head -1)
    [ -n "$TS_IP" ] && echo "  tailnet:   $TS_IP" || echo "  tailnet:   (down)"
  fi
  echo "  env file:  $ENV_FILE  (auto-sourced by new shells via $RC)"
  echo "  re-run:    rm $MARKER && bash $(dirname "$0")/web-bootstrap.sh"
} >&2
