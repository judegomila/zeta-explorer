-- lean/lakefile.lean
-- imp-454: Lake project manifest for the ZPO / RH-attack Lean 4 proof artifact.
-- Without this file, `lake build` cannot locate the Mathlib dependency and
-- third-party reviewers cannot reproducibly type-check the proof.
--
-- Usage:
--   cd lean && lake update && lake build LambdaAttack.CompositionCheck
--
-- After `lake update` a lean-toolchain file is auto-generated from the
-- Mathlib toolchain.  Pin the revision in the `require` line below once
-- the proof is submission-ready (replace "v4.9.0" with a stable commit SHA).
--
-- Module dependency graph:
--   Foundation  <-- BridgeTheorem  <-- CompositionCheck
--                   Constants      <-/
--   Foundation  <-- Capstone       <-- CompositionCheck
--
-- Remaining follow-up (imp-454 sub-gap):
--   BC_ vs C_ constant naming unification in BridgeTheorem.lean.
--   BridgeTheorem.lean still defines BC_H/BC_KH/BC_C/BC_T/BC_F locally;
--   the follow-on will add `import LambdaAttack.Constants` and rename to
--   C_H/C_KH/C_C/C_T/C_F so that a simultaneous import of both files
--   does not produce INCOMPATIBILITY 3 from the imp-441 static report.

import Lake
open Lake DSL

package «LambdaAttack» where
  name := "LambdaAttack"

require mathlib from git
  "https://github.com/leanprover-community/mathlib4" @ "v4.9.0"

@[default_target]
lean_lib «LambdaAttack» where
  -- Lean modules live under lean/LambdaAttack/*.lean (package root = lean/).
  -- `lake build` elaborates all five modules:
  --   LambdaAttack.Foundation       (imp-448, canonical axioms)
  --   LambdaAttack.Constants        (imp-410, bridge constants C_H/C_T/C_F/C_C)
  --   LambdaAttack.BridgeTheorem    (imp-412, G6 bridge; BC_ naming pending)
  --   LambdaAttack.Capstone         (imp-421, asymptotic_lambda_eq_zero)
  --   LambdaAttack.CompositionCheck (imp-441, type-compatibility driver)
