#!/usr/bin/env bash
# scripts/setup-new-machine.sh — one-command bootstrap for a fresh machine.
#
# Idempotent: re-running is safe. Does not touch any committed file; only
# installs into ~/Library/LaunchAgents (macOS-specific).
#
# Usage:
#   ./scripts/setup-new-machine.sh                 # verify + install
#   ./scripts/setup-new-machine.sh --no-launchd    # skip LaunchAgent install
#   ./scripts/setup-new-machine.sh --check         # verify only, no install
#
# What it does:
#   1. Verifies node, npm, claude CLI are on PATH.
#   2. Runs `npm install` if node_modules is missing.
#   3. Warns if scripts/.env (API key) is missing.
#   4. Substitutes __REPO_PATH__ / __HOME__ in the LaunchAgent templates
#      under scripts/launchd/*.plist.template and installs the result into
#      ~/Library/LaunchAgents/, then loads them via launchctl.
#   5. Reports the engine status.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
LAUNCH_TEMPLATES="$SCRIPT_DIR/launchd"
LAUNCH_INSTALL="$HOME/Library/LaunchAgents"

NO_LAUNCHD=0
CHECK_ONLY=0
for arg in "$@"; do
    case "$arg" in
        --no-launchd) NO_LAUNCHD=1 ;;
        --check)      CHECK_ONLY=1 ;;
        -h|--help)
            head -19 "$0" | tail -18
            exit 0
            ;;
    esac
done

color_red()   { printf '\033[31m%s\033[0m\n' "$*"; }
color_green() { printf '\033[32m%s\033[0m\n' "$*"; }
color_yellow(){ printf '\033[33m%s\033[0m\n' "$*"; }

echo "=== Mathexplorer new-machine setup ==="
echo "Repo: $REPO_DIR"
echo "Home: $HOME"
echo

# ── 1. Verify prerequisites ──────────────────────────────────────────────
missing=0
verify_cmd() {
    local cmd="$1"
    local hint="$2"
    if command -v "$cmd" >/dev/null 2>&1; then
        color_green "  ✓ $cmd: $(command -v "$cmd")"
    else
        color_red   "  ✗ $cmd NOT FOUND — $hint"
        missing=1
    fi
}

echo "[1/5] Prerequisites"
verify_cmd node "install via brew or nvm"
verify_cmd npm  "ships with node"
verify_cmd claude "install Claude CLI to ~/.local/bin/claude (per https://docs.anthropic.com/claude-code)"
verify_cmd git  "install via Xcode CLT or brew"

if [ "$missing" -eq 1 ]; then
    color_red "Some prerequisites missing. Install them and re-run."
    exit 1
fi
echo

# ── 2. node_modules ──────────────────────────────────────────────────────
echo "[2/5] npm install"
if [ "$CHECK_ONLY" -eq 1 ]; then
    if [ -d "$REPO_DIR/node_modules" ]; then
        color_green "  ✓ node_modules present"
    else
        color_yellow "  - node_modules missing (would run npm install)"
    fi
else
    if [ -d "$REPO_DIR/node_modules" ]; then
        color_green "  ✓ node_modules already present (skipping npm install)"
    else
        (cd "$REPO_DIR" && npm install)
        color_green "  ✓ npm install complete"
    fi
fi
echo

# ── 3. scripts/.env (API key) ────────────────────────────────────────────
echo "[3/5] scripts/.env (engine API key)"
if [ -f "$REPO_DIR/scripts/.env" ]; then
    color_green "  ✓ scripts/.env present"
else
    color_yellow "  ! scripts/.env MISSING. Engine will fall back to subscription channel."
    color_yellow "    To run on API billing: echo 'ANTHROPIC_API_KEY=sk-...' > $REPO_DIR/scripts/.env"
fi
echo

# ── 3b. Claude conversational memory ─────────────────────────────────────
echo "[3b/5] Claude conversational memory"
MEMORY_SRC="$REPO_DIR/.claude-memory"
MEMORY_DST="$HOME/.claude/projects/-Users-USER-Code-Experiments-mathexplorer/memory"
if [ ! -d "$MEMORY_SRC" ]; then
    color_yellow "  - $MEMORY_SRC not present in repo; skipping memory restore."
elif [ "$CHECK_ONLY" -eq 1 ]; then
    if [ -d "$MEMORY_DST" ] && [ -n "$(ls -A "$MEMORY_DST" 2>/dev/null)" ]; then
        color_green "  ✓ memory already present at $MEMORY_DST"
    else
        color_yellow "  - memory would be restored from $MEMORY_SRC"
    fi
else
    mkdir -p "$MEMORY_DST"
    cp "$MEMORY_SRC"/*.md "$MEMORY_DST/" 2>/dev/null
    color_green "  ✓ memory restored to $MEMORY_DST ($(ls "$MEMORY_DST"/*.md 2>/dev/null | wc -l | tr -d ' ') files)"
fi
echo

# ── 4. LaunchAgents ──────────────────────────────────────────────────────
echo "[4/5] LaunchAgents"
if [ "$NO_LAUNCHD" -eq 1 ]; then
    color_yellow "  - --no-launchd: skipping LaunchAgent install."
elif [ "$CHECK_ONLY" -eq 1 ]; then
    if [ -f "$LAUNCH_INSTALL/com.mathexplorer.auto-improve.plist" ]; then
        color_green "  ✓ com.mathexplorer.auto-improve.plist already installed"
    else
        color_yellow "  - auto-improve.plist would be installed"
    fi
    if [ -f "$LAUNCH_INSTALL/com.mathexplorer.daily-health.plist" ]; then
        color_green "  ✓ com.mathexplorer.daily-health.plist already installed"
    else
        color_yellow "  - daily-health.plist would be installed"
    fi
else
    mkdir -p "$LAUNCH_INSTALL"
    install_one() {
        local label="$1"
        local template="$LAUNCH_TEMPLATES/${label}.plist.template"
        local target="$LAUNCH_INSTALL/${label}.plist"
        if [ ! -f "$template" ]; then
            color_red "  ✗ template missing: $template"
            return 1
        fi
        # Substitute placeholders.
        sed -e "s|__REPO_PATH__|$REPO_DIR|g" \
            -e "s|__HOME__|$HOME|g" \
            "$template" > "$target"
        # Unload first if already loaded (idempotent).
        launchctl unload "$target" 2>/dev/null || true
        if launchctl load -w "$target" 2>&1 | grep -q .; then
            # Print only if non-empty (launchd returns silent on success).
            color_yellow "  ! launchctl reported a message; check $target"
        fi
        color_green "  ✓ installed + loaded: $target"
    }
    install_one com.mathexplorer.auto-improve
    install_one com.mathexplorer.daily-health
fi
echo

# ── 5. Engine status ─────────────────────────────────────────────────────
echo "[5/5] Engine status"
"$SCRIPT_DIR/auto-improve.sh" status 2>&1 | head -3
echo

color_green "Setup complete."
echo
echo "Next steps:"
echo "  - Tail logs:        tail -f $REPO_DIR/scripts/logs/launchd-auto-improve.log"
echo "  - Manual restart:   $SCRIPT_DIR/auto-improve.sh stop && $SCRIPT_DIR/auto-improve.sh start"
echo "  - Dev server:       cd $REPO_DIR && npm run dev"
echo "  - Check queue:      $SCRIPT_DIR/auto-improve.sh status"
