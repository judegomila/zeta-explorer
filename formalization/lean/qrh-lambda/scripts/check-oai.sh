#!/bin/zsh
# Check QrhLambdaOAI/Main78.lean against the openai/math workspace.
# Requires: (1) `lake build` in this directory (QrhLambda, RaymondCore, LeanCert); (2) a built openai/math
# workspace (default $HOME/lean-deps/qrh-verify/lean, Lean 4.34.1, Mathlib d13f23b7; override with OAI_ROOT).
set -e
R=${0:A:h:h}
RC=${R:h}/raymond-core
OAI_ROOT=${OAI_ROOT:-/Users/USER/lean-deps/qrh-verify/lean}
export PATH=$HOME/.elan/toolchains/leanprover--lean4---v4.34.1/bin:$PATH
OAI_PATH=$(cd $OAI_ROOT && lake env printenv LEAN_PATH)
export LEAN_PATH="$R/.lake/build/lib/lean:$RC/.lake/build/lib/lean:$RC/.lake/packages/leancert/.lake/build/lib/lean:$OAI_PATH"
cd $R
exec lean QrhLambdaOAI/Main78.lean
