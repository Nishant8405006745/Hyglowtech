#!/usr/bin/env bash
# One-time: create .pgdata cluster (trust auth, user hyglow, DB hyglow, port 5435).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PGDATA="$ROOT/.pgdata"
export PATH="/opt/homebrew/opt/postgresql@16/bin:${PATH:-}"

if [[ -d "$PGDATA" ]]; then
  echo "Already initialized: $PGDATA"
  exit 0
fi

initdb -D "$PGDATA" -A trust -E UTF-8 --locale=en_US.UTF-8 -U hyglow
echo "port = 5435" >>"$PGDATA/postgresql.conf"
pg_ctl -D "$PGDATA" -l "$PGDATA/server.log" -o "-p 5435" start
createdb -p 5435 -h 127.0.0.1 -U hyglow hyglow
echo "Done. DATABASE_URL (see backend/.env): postgresql+psycopg://hyglow@127.0.0.1:5435/hyglow"
