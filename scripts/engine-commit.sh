#!/bin/bash
# scripts/engine-commit.sh — the one way an engine creates a commit.
#
#   scripts/engine-commit.sh -m "imp-NNN: summary" -- <path> [<path> ...]
#   scripts/engine-commit.sh -F message.txt        -- <path> [<path> ...]
#   scripts/engine-commit.sh --dry-run -m "..."    -- <path> [<path> ...]
#
# Every path is named explicitly. There is no "everything": ".", "*", "-A",
# "-u" and pathspec magic are refused. A directory may be named; it is expanded
# to the modified, deleted and new non-ignored files under it, and each of them
# is checked against scripts/engine-allowlist.txt before the index is touched.
#
# Steps
#   1. start-up checks (scripts/engine-preflight.sh): hooks installed, engine
#      branch, expected remote;
#   2. path check of every named file (allow-list and built-in deny list);
#   3. sanitise the lines the ticket ledgers gained (home paths, machine paths,
#      key-shaped strings, account identifiers, transcript markers);
#   4. git add of exactly those files (never with -f, so ignored files stay out);
#   5. fail closed if ANYTHING outside the allow-list is staged in the index,
#      whoever staged it; our own staging is rolled back;
#   6. git commit --only -- <files>: the commit contains these files and no
#      others, so a sibling engine's staged work is not swept in;
#   7. the pre-commit and commit-msg hooks run as for any commit (never
#      --no-verify). If they reject, our staging is rolled back.
#
# Exit: 0 committed or nothing to commit, 2 usage, 3 rejected by a check,
#       4 preflight refused, 5 could not take the commit lock.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
cd "$ROOT" || exit 2
# shellcheck disable=SC1091
. "$SCRIPT_DIR/engine-preflight.sh"

die() { echo "engine-commit: $*" >&2; exit "${2:-2}"; }

msg_args=()
paths=()
dry_run="${ENGINE_COMMIT_DRY_RUN:-0}"
seen_dashdash=0
while [ $# -gt 0 ]; do
  if [ "$seen_dashdash" = 1 ]; then paths+=("$1"); shift; continue; fi
  case "$1" in
    -m) [ $# -ge 2 ] || die "-m needs a message"; msg_args+=(-m "$2"); shift 2 ;;
    -F) [ $# -ge 2 ] || die "-F needs a file"; [ -f "$2" ] || die "message file not found: $2"; msg_args+=(-F "$2"); shift 2 ;;
    --dry-run) dry_run=1; shift ;;
    --) seen_dashdash=1; shift ;;
    -A|-a|--all|-u|--update|-f|--force|--no-verify|-n|--amend)
      die "option $1 is not available: name each file to commit after --" ;;
    -*) die "unknown option $1" ;;
    *) die "paths go after --  (usage: engine-commit.sh -m \"message\" -- <path> ...)" ;;
  esac
done
[ "${#msg_args[@]}" -gt 0 ] || die "a commit message is required (-m or -F)"
[ "${#paths[@]}" -gt 0 ] || die "no paths given: name every file to commit after --"

for p in "${paths[@]}"; do
  case "$p" in
    .|./|"*"|/*|-*|:*|..|../*|*/../*|*/..) die "refused path '$p': name files or directories inside the repository explicitly" ;;
    *"*"*|*"?"*|*"["*) die "refused path '$p': glob patterns are not expanded; name the files" ;;
  esac
done

engine_preflight || exit 4

# Expand to a de-duplicated list of files.
list="$(mktemp "${TMPDIR:-/tmp}/engine-commit.XXXXXX")" || die "mktemp failed"
trap 'rm -f "$list" "$list.sorted"' EXIT
for p in "${paths[@]}"; do
  p="${p#./}"; p="${p%/}"
  if [ -d "$p" ]; then
    git ls-files -m -o -d --exclude-standard -- "$p" >> "$list"
  elif [ -e "$p" ] || git ls-files --error-unmatch -- "$p" >/dev/null 2>&1; then
    printf '%s\n' "$p" >> "$list"
  else
    die "path not found: $p"
  fi
done
sort -u "$list" > "$list.sorted"
files=()
while IFS= read -r f; do [ -n "$f" ] && files+=("$f"); done < "$list.sorted"
if [ "${#files[@]}" -eq 0 ]; then echo "engine-commit: nothing to commit under the named paths"; exit 0; fi

# 2. path check before the index is touched
node "$SCRIPT_DIR/engine-guard.mjs" paths --mode engine "${files[@]}" || exit 3
for f in "${files[@]}"; do
  if git check-ignore -q -- "$f" 2>/dev/null && ! git ls-files --error-unmatch -- "$f" >/dev/null 2>&1; then
    echo "engine-commit: REJECTED: $f is git-ignored and is not committed" >&2; exit 3
  fi
done

if [ "$dry_run" = 1 ]; then
  echo "engine-commit: DRY RUN, would commit ${#files[@]} file(s):"; printf '  %s\n' "${files[@]}"; exit 0
fi

# Serialise index writes among the engines that share this working tree.
git_dir="$(git rev-parse --git-common-dir)"
lock="$git_dir/engine-commit.lock.d"
waited=0
until mkdir "$lock" 2>/dev/null; do
  if [ -d "$lock" ] && [ -n "$(find "$lock" -maxdepth 0 -mmin +5 2>/dev/null)" ]; then
    rmdir "$lock" 2>/dev/null || true; continue      # holder died more than 5 minutes ago
  fi
  [ "$waited" -lt 120 ] || { echo "engine-commit: could not take the commit lock after ${waited}s" >&2; exit 5; }
  sleep 2; waited=$((waited + 2))
done
trap 'rmdir "$lock" 2>/dev/null; rm -f "$list" "$list.sorted"' EXIT

# 3. sanitise what the ledgers gained
ledgers=()
for f in "${files[@]}"; do
  case "$f" in src/data/improvement-queue.js|src/data/improvements.js|IMPROVEMENTS.md) ledgers+=("$f") ;; esac
done
if [ "${#ledgers[@]}" -gt 0 ]; then
  node "$SCRIPT_DIR/engine-guard.mjs" fix-added "${ledgers[@]}" || exit 3
fi

# 4. stage exactly these files
git add -- "${files[@]}" || { echo "engine-commit: git add failed" >&2; exit 3; }
unstage() { git restore --staged -- "${files[@]}" >/dev/null 2>&1 || git reset -q HEAD -- "${files[@]}" >/dev/null 2>&1 || true; }

# 5. fail closed on anything else in the index that is outside the allow-list
if ! node "$SCRIPT_DIR/engine-guard.mjs" paths-staged --mode engine; then
  unstage
  echo "engine-commit: the index holds paths outside the allow-list; nothing was committed." >&2
  echo "engine-commit: unstage them with: git restore --staged -- <path>" >&2
  exit 3
fi

if git diff --cached --quiet -- "${files[@]}"; then
  echo "engine-commit: no changes in the named files; nothing to commit"; exit 0
fi

# 6 + 7. commit only these files; hooks run
if ! git commit --only "${msg_args[@]}" -- "${files[@]}"; then
  unstage
  echo "engine-commit: commit rejected; nothing was committed and the files were unstaged." >&2
  exit 3
fi
echo "engine-commit: committed $(git rev-parse --short HEAD) (${#files[@]} file(s))"
