#!/bin/zsh
# Check RaymondCoreOAI/Instance78.lean against the openai/math workspace.
# Requires: (1) `lake build` of RaymondCore in this directory; (2) a built openai/math workspace
# (default /tmp/qrh-verify/lean, Lean 4.34.1, Mathlib d13f23b7; override with OAI_ROOT).
set -e
R=${0:A:h:h}
OAI_ROOT=${OAI_ROOT:-/tmp/qrh-verify/lean}
OAI_PATH=$(cd $OAI_ROOT && lake env printenv LEAN_PATH)
export LEAN_PATH="$R/.lake/build/lib/lean:$R/.lake/packages/leancert/.lake/build/lib/lean:$OAI_PATH"
cd $R
exec lean RaymondCoreOAI/Instance78.lean
