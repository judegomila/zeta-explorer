#!/bin/bash
# scripts/engine-preflight.sh
#
# Start-up check shared by every engine entry point. Source it and call
# engine_preflight; a non-zero return means "do not run":
#
#   . "$SCRIPT_DIR/engine-preflight.sh"
#   engine_preflight || exit 1
#
# Or run it directly to see the result:  bash scripts/engine-preflight.sh
#
# It verifies, for the clone the script lives in:
#   - the git hooks are installed, executable and are this repository's hooks
#     (scripts/install-engine-hooks.sh), and node and gitleaks are available;
#   - the files that implement the checks are unmodified relative to HEAD;
#   - the push remote is the expected public repository;
#   - the checked-out branch is the engine branch, never main;
#   - scripts/.env is git-ignored and untracked.
# It also exports ZETA_ENGINE=1, which switches the hooks to engine mode for
# every child process (including the model's own git commands).

ENGINE_BRANCH="${ENGINE_BRANCH:-engine/work}"
ENGINE_REMOTE="${ENGINE_REMOTE:-origin}"
ENGINE_REPO_SLUG="${ENGINE_REPO_SLUG:-judegomila/zeta-explorer}"
ENGINE_HOOK_MARKER='zeta-explorer-engine-hook v1'
export ENGINE_BRANCH ENGINE_REMOTE ENGINE_REPO_SLUG

# Files that implement or configure the checks. An engine may not run with
# local edits to any of them (and may not commit edits: engine-allowlist.txt).
ENGINE_CONTROL_FILES=(
  scripts/hooks
  scripts/engine-guard.mjs
  scripts/engine-allowlist.txt
  scripts/engine-preflight.sh
  scripts/engine-commit.sh
  scripts/engine-push.sh
  scripts/lib/public-sanitize.mjs
  scripts/check-commit-hygiene.sh
  .gitleaks.toml
  .gitignore
)

engine_repo_root() { (cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd); }

engine_preflight() {
  local root bad=0 hooks_dir name url br f
  root="$(engine_repo_root)"
  export GIT_TRACE2_EVENT=0
  export ZETA_ENGINE=1
  _pf_refuse() { echo "engine-preflight: REFUSE: $*" >&2; bad=1; }

  command -v git >/dev/null 2>&1 || _pf_refuse "git not found"
  command -v node >/dev/null 2>&1 || _pf_refuse "node not found (the commit checks need it)"
  command -v gitleaks >/dev/null 2>&1 || _pf_refuse "gitleaks not found (brew install gitleaks)"

  hooks_dir="$(git -C "$root" rev-parse --git-path hooks 2>/dev/null)"
  case "$hooks_dir" in /*) ;; *) hooks_dir="$root/$hooks_dir" ;; esac
  for name in pre-commit commit-msg pre-push; do
    if [ ! -f "$hooks_dir/$name" ]; then
      _pf_refuse "git hook $name is not installed (run scripts/install-engine-hooks.sh)"
    elif [ ! -x "$hooks_dir/$name" ]; then
      _pf_refuse "git hook $name is not executable (run scripts/install-engine-hooks.sh)"
    elif ! grep -q "$ENGINE_HOOK_MARKER" "$hooks_dir/$name" 2>/dev/null; then
      _pf_refuse "git hook $name is not this repository's hook (run scripts/install-engine-hooks.sh --force)"
    fi
    [ -x "$root/scripts/hooks/$name" ] || _pf_refuse "scripts/hooks/$name is missing or not executable"
  done
  [ -f "$root/scripts/check-commit-hygiene.sh" ] || _pf_refuse "scripts/check-commit-hygiene.sh is missing"
  [ -f "$root/scripts/engine-allowlist.txt" ] || _pf_refuse "scripts/engine-allowlist.txt is missing"

  if ! git -C "$root" diff --quiet HEAD -- "${ENGINE_CONTROL_FILES[@]}" 2>/dev/null; then
    _pf_refuse "the check scripts differ from HEAD: $(git -C "$root" diff --name-only HEAD -- "${ENGINE_CONTROL_FILES[@]}" 2>/dev/null | tr '\n' ' ')"
  fi

  url="$(git -C "$root" remote get-url --push "$ENGINE_REMOTE" 2>/dev/null || true)"
  case "$url" in
    *github.com[:/]"$ENGINE_REPO_SLUG"|*github.com[:/]"$ENGINE_REPO_SLUG".git|*github.com[:/]"$ENGINE_REPO_SLUG"/) ;;
    *) _pf_refuse "remote '$ENGINE_REMOTE' is '${url:-unset}', expected github.com/$ENGINE_REPO_SLUG" ;;
  esac

  br="$(git -C "$root" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  case "$br" in
    "$ENGINE_BRANCH") ;;
    main|legacy-main) _pf_refuse "the working tree is on '$br', which deploys to production; engines run on '$ENGINE_BRANCH'" ;;
    *) _pf_refuse "the working tree is on '${br:-a detached HEAD}', expected '$ENGINE_BRANCH'" ;;
  esac

  for f in scripts/.env scripts/.deploy-hook-url scripts/logs/x.log tmp/x public/fleet-status.json; do
    git -C "$root" check-ignore -q "$f" 2>/dev/null || _pf_refuse "$f is not git-ignored in this clone"
  done
  if git -C "$root" ls-files --error-unmatch scripts/.env >/dev/null 2>&1; then
    _pf_refuse "scripts/.env is tracked by git"
  fi

  if [ "$bad" -ne 0 ]; then
    echo "engine-preflight: this clone is not set up to run engines against the public repository." >&2
    return 1
  fi
  return 0
}

# Number of local commits not yet on the remote engine branch.
engine_unpushed_count() {
  local root base
  root="$(engine_repo_root)"
  if git -C "$root" rev-parse --verify --quiet "refs/remotes/$ENGINE_REMOTE/$ENGINE_BRANCH" >/dev/null; then
    base="refs/remotes/$ENGINE_REMOTE/$ENGINE_BRANCH"
  else
    base="$(git -C "$root" merge-base HEAD "refs/remotes/$ENGINE_REMOTE/main" 2>/dev/null || true)"
  fi
  [ -n "$base" ] || { echo 0; return; }
  git -C "$root" rev-list --count "$base..HEAD" 2>/dev/null || echo 0
}

if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  if engine_preflight; then echo "engine-preflight: OK (branch $ENGINE_BRANCH, remote $ENGINE_REMOTE -> $ENGINE_REPO_SLUG)"; else exit 1; fi
fi
