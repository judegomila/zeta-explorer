#!/bin/bash
# Rejects staged paths and staged content that must not enter a public repository.
# Run by pre-commit (see .pre-commit-config.yaml) or directly: scripts/check-commit-hygiene.sh
set -u
fail=0
staged=$(git diff --cached --name-only --diff-filter=ACMR)
[ -z "$staged" ] && exit 0

bad_paths='^(tmp/|\.vercel/|\.claude/|\.claude-memory/|\.superpowers/|\.aider|logs/|out/|thinking/|test-results/|public/fleet-status\.json$|-Users-)|(^|/)\.DS_Store$|(^|/)\.env($|\.)|(^|/)__pycache__/|(^|/)\.lake/|^scripts/\.|\.pid$|\.pyc$'
while IFS= read -r f; do
  case "$f" in scripts/.env.example) continue ;; esac
  if printf '%s\n' "$f" | grep -Eq "$bad_paths"; then
    echo "hygiene: path must not be committed: $f"; fail=1
  fi
  if [ -f "$f" ]; then
    size=$(wc -c < "$f" | tr -d ' ')
    if [ "$size" -gt 52428800 ]; then echo "hygiene: file over 50 MB: $f"; fail=1; fi
  fi
done <<< "$staged"

bad_content='/Users/[A-Za-z0-9._-]+/|/home/[a-z][a-z0-9._-]+/|-Users-[A-Za-z0-9]+-|sk-ant-[A-Za-z0-9]{8}|gh[pousr]_[A-Za-z0-9]{20}|github_pat_|api\.vercel\.com/v1/integrations/deploy|BEGIN [A-Z ]*PRIVATE KEY|<system-reminder>|claude --resume|\b192\.168\.[0-9]+\.[0-9]+|\b(prj|team)_[A-Za-z0-9]{20}'
hits=$(git diff --cached -U0 --no-color --diff-filter=ACMR -- . ':(exclude)scripts/check-commit-hygiene.sh' ':(exclude)CONTRIBUTING.md' ':(exclude).gitleaks.toml' \
  | grep -E '^\+[^+]' | grep -E -n "$bad_content" | grep -vE '/Users/(USER|Shared|xxxxxxxxxx)/|/home/(USER|user|runner)/|-Users-USER-' | cut -c1-160 | head -20)
if [ -n "$hits" ]; then
  echo "hygiene: staged content contains a home path, credential-shaped string or transcript marker:"
  echo "$hits"; fail=1
fi
exit $fail
