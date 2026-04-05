#!/usr/bin/env bash
# Start the Hyglow dev Postgres cluster (port 5435, data in repo .pgdata/).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PGDATA="$ROOT/.pgdata"
export PATH="/opt/homebrew/opt/postgresql@16/bin:${PATH:-}"

if [[ ! -d "$PGDATA" ]]; then
  echo "No cluster at $PGDATA — run once from repo root:"
  echo "  $(dirname "$0")/init-local-postgres.sh"
  exit 1
fi

if pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
  echo "Postgres already running ($PGDATA, port 5435)"
  exit 0
fi

pg_ctl -D "$PGDATA" -l "$PGDATA/server.log" -o "-p 5435" start
echo "Started Postgres on 127.0.0.1:5435"
