#!/bin/bash
# scripts/promote-engine-work.sh — the reviewed step between engine work and production.
#
# Engines push to the branch engine/work. main deploys to production and is
# advanced only by a pull request that a person merges. This script prepares
# that pull request; it never pushes to main and never merges.
#
#   scripts/promote-engine-work.sh check   report on origin/engine/work vs origin/main (default)
#   scripts/promote-engine-work.sh pr      run the check, then open the pull request
#                                          engine/work -> main if none is open
#   scripts/promote-engine-work.sh sync    bring merged main back into the local
#                                          engine branch (run in the engine clone,
#                                          with the engines stopped)
#
# Run by a person (it refuses when ZETA_ENGINE=1). The check uses the copy of
# the guard that is on origin/main, not the one on the engine branch, so a
# change to the guard on the engine branch cannot approve itself.
#
# Merge the pull request with "Create a merge commit". Two reasons:
#   - the Vercel build-skip rule compares HEAD^ with HEAD. For a merge commit
#     that is the whole merged range. With a fast-forward or a rebase merge it
#     is only the last engine commit, so a range that changed src/ could be
#     skipped (or a ledger-only range built) depending on its last commit.
#   - engine/work can then fast-forward to main (sync), so the two never diverge.
set -uo pipefail
export GIT_TRACE2_EVENT=0

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
cd "$ROOT" || exit 1

ENGINE_BRANCH="${ENGINE_BRANCH:-engine/work}"
REMOTE="${ENGINE_REMOTE:-origin}"
MAIN="${PROMOTE_BASE:-main}"
# The Vercel project's "Ignored Build Step" paths (builds only when one of these changed).
BUILD_PATHS=(src public index.html package.json package-lock.json vite.config.js vercel.json observatory
             ':!src/data/improvements.js' ':!src/data/improvement-queue.js')

[ "${ZETA_ENGINE:-0}" != "1" ] || { echo "promote-engine-work: this is a person's step; it does not run inside an engine"; exit 1; }
cmd="${1:-check}"

do_check() {
  git fetch --quiet "$REMOTE" "$MAIN" "$ENGINE_BRANCH" || { echo "fetch failed"; return 1; }
  local base head n rc=0 guard tmp
  head="$(git rev-parse "refs/remotes/$REMOTE/$ENGINE_BRANCH")" || return 1
  base="$(git merge-base "refs/remotes/$REMOTE/$MAIN" "$head")" || { echo "no merge base with $MAIN"; return 1; }
  n="$(git rev-list --count "$base..$head")"
  echo "== engine work: $n commit(s) on $REMOTE/$ENGINE_BRANCH not on $REMOTE/$MAIN =="
  [ "$n" -gt 0 ] || { echo "nothing to promote"; return 2; }
  git log --format='  %h %ad %s' --date=short "$base..$head" | cut -c1-140 | head -40
  [ "$n" -le 40 ] || echo "  ... ($((n - 40)) more)"

  # the guard as it is on main
  tmp="$(mktemp -d "${TMPDIR:-/tmp}/promote-guard.XXXXXX")" || return 1
  if git archive "refs/remotes/$REMOTE/$MAIN" scripts/engine-guard.mjs scripts/lib/public-sanitize.mjs scripts/engine-allowlist.txt 2>/dev/null | tar -x -C "$tmp" 2>/dev/null; then
    guard="$tmp/scripts/engine-guard.mjs"
  else
    echo "note: $REMOTE/$MAIN has no engine-guard yet; using this checkout's copy"
    guard="$SCRIPT_DIR/engine-guard.mjs"
  fi

  echo; echo "== 1. every commit: allow-list, deny list, sanitiser rules, commit messages =="
  node "$guard" range "$base" "$head" --mode engine || rc=1
  echo; echo "== 2. net change as a whole (what the merge adds to main) =="
  node "$guard" tree "$base" "$head" --mode engine && echo "ok" || rc=1
  echo; echo "== 3. gitleaks over the range =="
  if command -v gitleaks >/dev/null 2>&1; then
    gitleaks git --redact --no-banner --log-level warn -c .gitleaks.toml --log-opts="$base..$head" . && echo "ok" || rc=1
  else echo "gitleaks not found"; rc=1; fi
  rm -rf "$tmp"

  echo; echo "== 4. files to look at by eye (new binary, PDF or large files) =="
  git diff --diff-filter=A --numstat "$base" "$head" | awk '$1 == "-" { print "  binary  " $3 }' | head -40
  git diff --diff-filter=A --name-only "$base" "$head" | grep -Ei '\.(pdf|zip|gz|mp4|png|jpe?g|bin|dat|npy|npz|pkl)$' | sed 's/^/  type    /' | head -40
  git diff --diff-filter=AM --name-only -z "$base" "$head" | while IFS= read -r -d '' f; do
    sz="$(git cat-file -s "$head:$f" 2>/dev/null || echo 0)"
    [ "$sz" -gt 5242880 ] && [ "$f" != "src/data/improvements.js" ] && [ "$f" != "src/data/improvement-queue.js" ] && [ "$f" != "IMPROVEMENTS.md" ] && echo "  >5MB    $f ($sz bytes)"
  done

  echo; echo "== 5. production build =="
  if git diff --quiet "$base" "$head" -- "${BUILD_PATHS[@]}"; then
    echo "The range changes only ticket ledgers, research directories, scripts or markdown:"
    echo "merging it with a merge commit does NOT start a production build."
  else
    echo "The range changes site sources; merging it with a merge commit STARTS a production build. Changed build paths:"
    git diff --name-only "$base" "$head" -- "${BUILD_PATHS[@]}" | sed 's/^/  /' | head -30
  fi
  if git diff --quiet "$head^" "$head" -- "${BUILD_PATHS[@]}" 2>/dev/null; then tip=skip; else tip=build; fi
  echo "(For a fast-forward or rebase merge Vercel would look at the last commit only: $tip.)"

  echo
  if [ "$rc" -eq 0 ]; then echo "CHECK PASSED for $base..$head"; else echo "CHECK FAILED: do not merge. Fix on $ENGINE_BRANCH (see the runbook, 'a rejected range')."; fi
  return "$rc"
}

case "$cmd" in
  check) do_check ;;
  pr)
    do_check || { echo "not opening a pull request"; exit 1; }
    command -v gh >/dev/null 2>&1 || { echo "gh not found"; exit 1; }
    existing="$(gh pr list --head "$ENGINE_BRANCH" --base "$MAIN" --state open --json url -q '.[0].url' 2>/dev/null || true)"
    if [ -n "$existing" ]; then
      echo "An open pull request already tracks $ENGINE_BRANCH: $existing"
    else
      n="$(git rev-list --count "refs/remotes/$REMOTE/$MAIN..refs/remotes/$REMOTE/$ENGINE_BRANCH")"
      gh pr create --base "$MAIN" --head "$ENGINE_BRANCH" \
        --title "Engine work: $n commits to $(date -u +%Y-%m-%d)" \
        --body "Automated engine commits from \`$ENGINE_BRANCH\`. \`scripts/promote-engine-work.sh check\` passed locally at $(git rev-parse --short "refs/remotes/$REMOTE/$ENGINE_BRANCH"). Merge with **Create a merge commit** (see the header of scripts/promote-engine-work.sh)."
    fi
    ;;
  sync)
    br="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
    [ "$br" = "$ENGINE_BRANCH" ] || { echo "sync runs on $ENGINE_BRANCH (this checkout is on '${br:-detached}')"; exit 1; }
    if pgrep -f "auto-improve.*\.sh start" >/dev/null 2>&1 || pgrep -f "claude --print --strict-mcp-config" >/dev/null 2>&1; then
      echo "engines appear to be running; stop them first (a merge rewrites files they are editing)"; exit 1
    fi
    git fetch --quiet "$REMOTE" "$MAIN" || exit 1
    if git merge --ff-only "refs/remotes/$REMOTE/$MAIN" 2>/dev/null; then
      echo "fast-forwarded $ENGINE_BRANCH to $REMOTE/$MAIN"
    else
      echo "not a fast-forward; merging $REMOTE/$MAIN into $ENGINE_BRANCH"
      git merge --no-edit "refs/remotes/$REMOTE/$MAIN" || { echo "merge stopped on conflicts; resolve them by hand"; exit 1; }
    fi
    echo "now push with: scripts/engine-push.sh"
    ;;
  *) echo "usage: $0 {check|pr|sync}"; exit 1 ;;
esac
