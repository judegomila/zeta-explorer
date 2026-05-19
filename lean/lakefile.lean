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
--   (standalone) ManyBody          (imp-480, many-body correction closure)
--
-- imp-461 APPLIED: BC_ vs C_ constant naming unification complete.
--   BridgeTheorem.lean now imports LambdaAttack.Constants and uses
--   C_H/C_KH/C_C/C_T/C_F. INCOMPATIBILITY 3 from the imp-441 static report
--   is RESOLVED. All three static incompatibilities are now closed.

import Lake
open Lake DSL

package «LambdaAttack» where
  -- imp-1095 (2026-05-18): removed the redundant `name := "LambdaAttack"` field.
  -- Lake v5 (Lean 4.9.0) infers the package name from the `package «...»`
  -- literal above; setting it explicitly raised the elaboration error
  -- `field 'name' has already been specified` and prevented `lake update`
  -- from running. Removing the line unblocks the toolchain demo without
  -- changing the effective package name (still "LambdaAttack").

require mathlib from git
  "https://github.com/leanprover-community/mathlib4" @ "v4.9.0"

@[default_target]
lean_lib «LambdaAttack» where
  -- Lean modules live under lean/LambdaAttack/*.lean (package root = lean/).
  -- `lake build` elaborates all six modules:
  --   LambdaAttack.Foundation       (imp-448, canonical axioms)
  --   LambdaAttack.Constants        (imp-410, bridge constants C_H/C_T/C_F/C_C)
  --   LambdaAttack.BridgeTheorem    (imp-412, G6 bridge; imp-461: C_ naming unified)
  --   LambdaAttack.Capstone         (imp-421, asymptotic_lambda_eq_zero)
  --   LambdaAttack.CompositionCheck (imp-441, type-compatibility driver)
  --   LambdaAttack.ManyBody         (imp-480, many-body correction closure port)
