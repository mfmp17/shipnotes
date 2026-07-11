#!/bin/bash
# Daily autonomous founder session for ShipNotes.
# Invoked by launchd (com.shipnotes.daily) every day at 09:00,
# or manually: bash ~/ventures/shipnotes/scripts/daily-run.sh
set -uo pipefail

VENTURE_DIR="$HOME/ventures/shipnotes"
LOG_DIR="$VENTURE_DIR/logs"
RUN_LOG="$LOG_DIR/run-$(date +%Y%m%d-%H%M%S).log"
LOCK_DIR="$VENTURE_DIR/.daily-run.lock"

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

# Skip if a previous session is still running (mkdir is atomic).
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "$(date): previous run still active, skipping" >> "$LOG_DIR/launchd.out.log"
  exit 0
fi
trap 'rmdir "$LOCK_DIR"' EXIT

cd "$VENTURE_DIR"

claude -p "$(cat "$VENTURE_DIR/DAILY_PROMPT.md")" \
  --dangerously-skip-permissions \
  > "$RUN_LOG" 2>&1

echo "$(date): session finished with exit code $? — log: $RUN_LOG" >> "$LOG_DIR/launchd.out.log"
