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

# Product LLM key lives in the macOS login Keychain — never as a file in this
# (public) repo tree. One-time setup:
#   security add-generic-password -a "$USER" -s shipnotes-anthropic -w
ANTHROPIC_API_KEY="$(security find-generic-password -s shipnotes-anthropic -w 2>/dev/null || true)"
if [ -n "$ANTHROPIC_API_KEY" ]; then
  export ANTHROPIC_API_KEY
fi

claude -p "$(cat "$VENTURE_DIR/DAILY_PROMPT.md")" \
  --dangerously-skip-permissions \
  > "$RUN_LOG" 2>&1
STATUS=$?

# claude exits 0 even when auth fails, which hid four dead runs (Jul 15-19)
# behind "exit code 0" — detect the failure text so this log tells the truth.
if grep -q "Failed to authenticate" "$RUN_LOG"; then
  echo "$(date): session FAILED — auth error, see $RUN_LOG" >> "$LOG_DIR/launchd.out.log"
  exit 1
fi
echo "$(date): session finished with exit code $STATUS — log: $RUN_LOG" >> "$LOG_DIR/launchd.out.log"
