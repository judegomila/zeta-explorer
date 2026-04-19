#!/usr/bin/env bash
# imp-880 follow-up: shared pre/post hooks for the 4 auto-improve*.sh engines
# to consult and log against scripts/channel-quota.mjs.
#
# Usage (from each auto-improve*.sh, before and after the claude invocation):
#   source "$SCRIPT_DIR/engine-channel-hook.sh"
#   engine_channel_preflight "$log_file"  # sets CHANNEL_RECOMMEND; may sleep
#   # ...run claude here...
#   engine_channel_log "$log_file"        # reads token counts, appends to window

BACKOFF_WAIT_S="${BACKOFF_WAIT_S:-300}"

engine_channel_preflight() {
  local log_file="$1"
  ENGINE_SKIP=0
  if [ ! -f "$SCRIPT_DIR/channel-quota.mjs" ]; then
    CHANNEL_RECOMMEND="subscription"
    return 0
  fi
  CHANNEL_RECOMMEND=$(node "$SCRIPT_DIR/channel-quota.mjs" recommend 2>/dev/null || echo "subscription")
  echo "channel-quota: recommend=$CHANNEL_RECOMMEND" >> "$log_file"
  case "$CHANNEL_RECOMMEND" in
    wait)
      echo "channel-quota: window exhausted and no ANTHROPIC_API_KEY; sleeping ${BACKOFF_WAIT_S}s" >> "$log_file"
      sleep "$BACKOFF_WAIT_S"
      ENGINE_SKIP=1
      ;;
    api)
      if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
        echo "channel-quota: recommend=api but ANTHROPIC_API_KEY unset; treating as wait" >> "$log_file"
        sleep "$BACKOFF_WAIT_S"
        ENGINE_SKIP=1
      else
        echo "channel-quota: downgrading to api channel for this run" >> "$log_file"
      fi
      ;;
    subscription|*)
      :
      ;;
  esac
}

engine_channel_log() {
  local log_file="$1"
  if [ ! -f "$SCRIPT_DIR/channel-quota.mjs" ]; then
    return 0
  fi
  local tokens_in
  local tokens_out
  tokens_in=$(grep -oE 'Input tokens?:[^0-9]*[0-9]+' "$log_file" 2>/dev/null | tail -1 | grep -oE '[0-9]+$' || echo "")
  tokens_out=$(grep -oE 'Output tokens?:[^0-9]*[0-9]+' "$log_file" 2>/dev/null | tail -1 | grep -oE '[0-9]+$' || echo "")
  if [ -z "$tokens_in" ] || [ -z "$tokens_out" ]; then
    local bytes
    bytes=$(wc -c < "$log_file" 2>/dev/null | tr -d ' ')
    tokens_in="${tokens_in:-$(( bytes / 4 ))}"
    tokens_out="${tokens_out:-$(( bytes / 16 ))}"
  fi
  node "$SCRIPT_DIR/channel-quota.mjs" log "$tokens_in" "$tokens_out" >> "$log_file" 2>&1 || true
}
