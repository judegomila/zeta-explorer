#!/bin/bash
# Vercel "Ignored Build Step" (wired via vercel.json "ignoreCommand").
#
# Vercel semantics: exit 0 => SKIP the build (no deploy); exit 1 => BUILD.
#
# WHY: the autonomous auto-improve fleet (api-pool + sonnet engines) commits an
# `imp-NNNNN ...` research ticket to main every 1-3 minutes and push-watcher
# pushes it — hundreds of pushes/day. With Vercel's default git integration that
# is hundreds of production builds/day, and the shared-worktree commit cadence
# occasionally lands a transient state that fails the clean-checkout build (the
# "● Error" deployments). None of that internal research churn needs to deploy.
#
# POLICY: skip deploys for fleet commits (HEAD message begins with `imp-`).
# Real/feature commits (any other HEAD message — e.g. the human/interactive
# session's descriptive commits) build and deploy as normal. To force a deploy
# that bundles accumulated fleet content, push a non-`imp-` commit or run
# `vercel --prod` manually.

set -uo pipefail

msg=$(git log -1 --pretty=%s 2>/dev/null || echo "")

if printf '%s' "$msg" | grep -qE '^imp-[0-9]+'; then
  echo "🛈 Skipping deploy — fleet research commit: $msg"
  exit 0   # skip build
fi

echo "✔ Proceeding with deploy — non-fleet commit: $msg"
exit 1     # run build
