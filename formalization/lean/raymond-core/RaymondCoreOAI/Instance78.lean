import RaymondCore.Substitution
import OAI.NumberTheory.DirichletL.Nonvanishing

/-!
# The substitution lemma at `θ = 7/8` (openai/math family 003)

This file is NOT part of the `RaymondCore` lake library: it imports the openai/math theorem
`OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re` (Lean proof released by openai/math, claimed by an
internal OpenAI model, not peer-reviewed; rebuilt locally with only `propext`, `Classical.choice`,
`Quot.sound`). It is checked by `scripts/check-instance78.sh`, which runs `lean` with a search path
made of the openai/math workspace plus the RaymondCore build.

Conclusions (given the openai/math theorem):
* every zero of `H_t`, `t ≥ 0`, satisfies `Im(z)² ≤ max(9/16 − 2t, 0)`;
* `Λ ≤ 9/32` (the classical de Bruijn implication from the 7/8 half-plane; this is the
  `deBruijn78` value of `openai-math-integration-2026-10-08.js`, which is ABOVE the PT bound 0.2 —
  the half-plane alone does not improve `Λ ≤ 0.2`; it enters Raymond's chain as the start
  `q0 = (2θ − 1)² = 9/16 < 1`).
-/

namespace RaymondCore.Instance78

open RaymondCore.Substitution LeanCert.Analysis.DBN

theorem zetaZeroFreeRight_seven_eighths : ZetaZeroFreeRight (7 / 8) :=
  fun _ hs => OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re hs

theorem H_zero_strip_78 {t : ℝ} (ht : 0 ≤ t) {z : ℂ} (hz : H t z = 0) :
    z.im ^ 2 ≤ max (9 / 16 - 2 * t) 0 := by
  have h := substitution (by norm_num : (1 / 2 : ℝ) ≤ 7 / 8) zetaZeroFreeRight_seven_eighths ht hz
  norm_num at h ⊢
  exact h

theorem Lambda_le_nine_thirtyseconds : Lambda ≤ 9 / 32 := by
  have h := Lambda_le_of_zeroFree (by norm_num : (1 / 2 : ℝ) ≤ 7 / 8)
    zetaZeroFreeRight_seven_eighths
  norm_num at h ⊢
  exact h

end RaymondCore.Instance78

#print axioms RaymondCore.Instance78.H_zero_strip_78
#print axioms RaymondCore.Instance78.Lambda_le_nine_thirtyseconds
