#!/bin/bash
# Installs the repository's git hooks into this clone:
#   pre-commit, commit-msg, pre-push  ->  scripts/hooks/<name>
# Run once per clone (and once per linked worktree set; hooks live in the
# common git directory). Engines refuse to start until this has been run.
#
#   scripts/install-engine-hooks.sh          install
#   scripts/install-engine-hooks.sh --check  verify only (exit 1 if not installed)
#   scripts/install-engine-hooks.sh --force  replace foreign hooks (kept as <name>.replaced-<time>)
#
# Requires: node, gitleaks (brew install gitleaks). The pre-commit framework is
# not required. Its hook stashes unstaged files and checks the tree out again,
# which is unsafe when several engines share one working tree, so an engine
# clone uses these hooks instead. They run the same two checks (gitleaks and
# scripts/check-commit-hygiene.sh) plus scripts/engine-guard.mjs.
set -u
export GIT_TRACE2_EVENT=0
MARKER='zeta-explorer-engine-hook v1'
root="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "not in a git work tree"; exit 1; }
cd "$root" || exit 1
hooks_dir="$(git rev-parse --git-path hooks)"
mode="${1:-install}"
rc=0

for name in pre-commit commit-msg pre-push; do
  target="$hooks_dir/$name"
  body="scripts/hooks/$name"
  if [ "$mode" = "--check" ]; then
    if [ -x "$target" ] && grep -q "$MARKER" "$target" 2>/dev/null && [ -x "$body" ]; then
      echo "ok: $name"
    else
      echo "MISSING: $name (run scripts/install-engine-hooks.sh)"; rc=1
    fi
    continue
  fi
  [ -f "$body" ] || { echo "missing $body"; rc=1; continue; }
  chmod +x "$body"
  if [ -e "$target" ] && ! grep -q "$MARKER" "$target" 2>/dev/null; then
    if [ "$mode" = "--force" ]; then
      mv "$target" "$target.replaced-$(date +%Y%m%d%H%M%S)"
    else
      echo "refusing to replace existing $target (not ours); re-run with --force to replace it"; rc=1; continue
    fi
  fi
  mkdir -p "$hooks_dir"
  cat > "$target" <<SHIM
#!/bin/bash
# $MARKER (installed by scripts/install-engine-hooks.sh; do not edit)
root="\$(git rev-parse --show-toplevel)" || exit 1
exec "\$root/scripts/hooks/$name" "\$@"
SHIM
  chmod +x "$target"
  echo "installed: $target -> $body"
done

if [ "$mode" != "--check" ]; then
  command -v gitleaks >/dev/null 2>&1 || { echo "WARNING: gitleaks not found; commits will be rejected until it is installed (brew install gitleaks)"; rc=1; }
  command -v node >/dev/null 2>&1 || { echo "WARNING: node not found; commits will be rejected until it is installed"; rc=1; }
fi
exit "$rc"
