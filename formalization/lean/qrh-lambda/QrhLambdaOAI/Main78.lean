import QrhLambda
import OAI.NumberTheory.DirichletL.Nonvanishing

/-!
# Final theorems with the zero-free half-plane `Re s > 7/8` discharged

This file is NOT part of the `QrhLambda` lake library: it imports the openai/math theorem
`OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re` (Lean proof released by openai/math, claimed by an
internal OpenAI model, not peer-reviewed; rebuilt locally with only `propext`, `Classical.choice`,
`Quot.sound`). It is checked by `scripts/check-oai.sh` with a search path made of the openai/math
workspace plus the QrhLambda / RaymondCore / LeanCert builds.

Name trap (raymond-core README): `ComparatorChallenges/QuasiRiemannHypothesis.lean` in the openai/math
workspace declares the same name with a `sorry` proof. This file imports the proved module
`OAI.NumberTheory.DirichletL.Nonvanishing`; the `#print axioms` lines below would show `sorryAx`
otherwise.

Remaining hypotheses of the two theorems: `RaymondChainHyps` (head wall, first contact, contact
exclusion) and the table hypotheses (`FloorTableHyps` for F2, `RaymondTableHyps` for Raymond's chain).
-/

namespace QrhLambda

open LeanCert.Analysis.DBN

/-- `ζ(s) ≠ 0` on `Re s > 7/8` (openai/math family 003). -/
theorem zetaZeroFreeRight_seven_eighths : RaymondCore.Substitution.ZetaZeroFreeRight (7 / 8) :=
  fun _ hs => OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re hs

/-- The start condition of the 7/8 path, discharged: every zero of `H_{10⁻⁸}` has `Im(z)² ≤ 9/16`. -/
theorem start78 : StartBound (9 / 16) := start78_of_zeroFree zetaZeroFreeRight_seven_eighths

/-- **Conditional value F2.** Under Raymond's chain hypotheses and the F2 table hypotheses,
`Λ ≤ 116091488672439/10¹⁵ = 0.116091488672439` for the de Bruijn–Newman constant `Λ` of the concrete
`H_t` (LeanCert). -/
theorem lambda_le_of_qrh_raymond (h : RaymondChainHyps) (f : FloorTableHyps) :
    deBruijnNewmanLambda ≤ 116091488672439 / 10 ^ 15 :=
  lambda_le_of_qrh_raymond_of_zeroFree zetaZeroFreeRight_seven_eighths h f

/-- Same, as reality of all zeros: every zero of `H_t` is real for `t ≥ 116091488672439/10¹⁵`. -/
theorem realZeros_of_qrh_raymond (h : RaymondChainHyps) (f : FloorTableHyps) :
    ∀ t : ℝ, 116091488672439 / 10 ^ 15 ≤ t → ∀ z : ℂ, H t z = 0 → z.im = 0 :=
  realZeros_of_qrh_raymond_of_zeroFree zetaZeroFreeRight_seven_eighths h f

/-- **Conditional value, Raymond's chain alone.** Under Raymond's chain hypotheses and the X1 table
hypotheses, `Λ ≤ 118505710922701/10¹⁵ = 0.118505710922701`. -/
theorem lambda_le_of_raymond78 (h : RaymondChainHyps) (f : RaymondTableHyps) :
    deBruijnNewmanLambda ≤ 118505710922701 / 10 ^ 15 :=
  lambda_le_of_raymond78_of_zeroFree zetaZeroFreeRight_seven_eighths h f

end QrhLambda

#print axioms QrhLambda.zetaZeroFreeRight_seven_eighths
#print axioms QrhLambda.start78
#print axioms QrhLambda.lambda_le_of_qrh_raymond
#print axioms QrhLambda.realZeros_of_qrh_raymond
#print axioms QrhLambda.lambda_le_of_raymond78
