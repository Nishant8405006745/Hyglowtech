#!/usr/bin/env bash
# One-off push to GitHub when Cursor/CI cannot prompt for HTTPS credentials.
# Token is not written to disk or git config; use env or a macOS dialog.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE_PATH="Nishant8405006745/Hyglowtech.git"
AUTH_URL="https://github.com/${REMOTE_PATH}"

get_token() {
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    printf '%s' "$GITHUB_TOKEN"
    return
  fi
  if [[ -n "${GH_TOKEN:-}" ]]; then
    printf '%s' "$GH_TOKEN"
    return
  fi
  if [[ "$(uname -s)" != "Darwin" ]]; then
    echo "No GITHUB_TOKEN or GH_TOKEN set, and macOS dialog is only available on Darwin." >&2
    echo "Create a classic PAT with 'repo' scope: https://github.com/settings/tokens" >&2
    echo "Then run:  export GITHUB_TOKEN=ghp_xxxx   &&  $0" >&2
    exit 1
  fi
  # Hidden-answer dialog (macOS 10.13+); falls back to visible field if unsupported.
  local out
  out=$(osascript 2>/dev/null <<'APPLESCRIPT' || true
tell application "System Events"
  activate
  try
    set d to display dialog "GitHub Personal Access Token (classic → repo scope). Used only for this push." default answer "" buttons {"Cancel", "Push"} default button "Push" with title "Hyglow → GitHub" with hidden answer
    return text returned of d
  on error number -128
    return ""
  end try
end tell
APPLESCRIPT
)
  if [[ -z "${out}" ]]; then
    out=$(osascript 2>/dev/null <<'APPLESCRIPT' || true
tell application "System Events"
  activate
  try
    set d to display dialog "GitHub Personal Access Token (paste token; avoid shoulder-surfing)." default answer "" buttons {"Cancel", "Push"} default button "Push" with title "Hyglow → GitHub"
    return text returned of d
  on error number -128
    return ""
  end try
end tell
APPLESCRIPT
)
  fi
  if [[ -z "${out}" ]]; then
    echo "No token entered." >&2
    exit 1
  fi
  printf '%s' "$out"
}

TOKEN="$(get_token)"
PUSH_URL="https://x-access-token:${TOKEN}@github.com/${REMOTE_PATH}"

echo "Pushing main → ${AUTH_URL} …"
if ! git push "$PUSH_URL" HEAD:main; then
  echo "" >&2
  echo "Push failed. If you saw HTTP 403, the token can log in but cannot write to this repo:" >&2
  echo "  • Classic PAT: enable scope 'repo' (full control of private repositories)." >&2
  echo "  • Fine-grained PAT: Repository access → Hyglowtech, Permissions → Contents: Read and write." >&2
  echo "  • Organization repo: authorize the token for SSO (GitHub → token settings)." >&2
  echo "Create or fix a token: https://github.com/settings/tokens" >&2
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  git branch --set-upstream-to=origin/main main 2>/dev/null || true
fi

echo "Done. Verify: https://github.com/${REMOTE_PATH%.git}"
