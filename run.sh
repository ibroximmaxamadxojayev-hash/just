#!/usr/bin/env bash
set -euo pipefail
PY=${PY:-python3}
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
echo "Starting HelperBox server..."
exec "$PY" server.py
