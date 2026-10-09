import QrhLambda.Sound
import QrhLambda.F2Chunks
import QrhLambda.R78Chunks

/-!
# Main theorems: conditional bounds on the de Bruijn–Newman constant

* `lambda_le_of_qrh_raymond_of_zeroFree`: if `ζ(s) ≠ 0` for `Re s > 7/8`, then under
  `RaymondChainHyps` (head wall, first contact, contact exclusion) and `FloorTableHyps` (the 468 floor
  entries and 59 kernel rows used by F2 are valid), `Λ ≤ 116091488672439/10¹⁵`.
* `lambda_le_of_raymond78_of_zeroFree`: the same for Raymond's chain alone (476 floor entries of the X1
  tables at PLAN heights, catalogue kernels 4 and 5): `Λ ≤ 118505710922701/10¹⁵`.

The zero-free half-plane is discharged by the openai/math theorem in `QrhLambdaOAI/Main78.lean`,
which gives `QrhLambda.lambda_le_of_qrh_raymond` and `QrhLambda.lambda_le_of_raymond78` with only the
two hypothesis structures as arguments.

Both are CONDITIONAL statements. PT's `Λ ≤ 0.2` is the accepted bound; RH is open.
-/

open Complex

namespace QrhLambda

open LeanCert.Analysis.DBN

/-- The quantity being bounded (the constant `Λ` itself, not an upper bound for it; renamed from
`deBruijnNewmanUpper` after the referee pass): the de Bruijn–Newman constant of the concrete heat-flow integral
`H t z = ∫₀^∞ e^{tu²} Φ(u) cos(zu) du` (`H 0 z = ξ(1/2 + iz/2)/8`), namely LeanCert's
`Lambda = sInf {t | every zero of H_t is real}`; `real_zeros_iff_Lambda_le` (LeanCert) states
`(∀ z, H t z = 0 → z.im = 0) ↔ Lambda ≤ t`. -/
noncomputable abbrev deBruijnNewmanLambda : ℝ := Lambda

/-- The table values asserted by the F2 run (mixed certification: Arb tables, route-3 tables, and 89
r2 entries resting on a measured 0.0023 time-box allowance and the unreviewed L-slope lemma; see README): every one of its 468 floor entries satisfies (J)
and every one of its 59 kernel rows satisfies (K). -/
abbrev FloorTableHyps : Prop := TableHyps F2.cert

/-- The table values asserted by Raymond's chain alone (476 X1 floor entries at PLAN heights,
catalogue kernels 4 and 5). -/
abbrev RaymondTableHyps : Prop := TableHyps R78.cert

/-- Start condition from the zero-free half-plane `Re s > 7/8` (substitution lemma, RaymondCore):
at `t = 10⁻⁸` every zero of `H_t` has `Im(z)² ≤ max(9/16 − 2·10⁻⁸, 0) ≤ 9/16`. -/
theorem start78_of_zeroFree (hZ : RaymondCore.Substitution.ZetaZeroFreeRight (7 / 8)) :
    StartBound (9 / 16) := by
  intro z hz
  have h := RaymondCore.Substitution.substitution (by norm_num : (1 / 2 : ℝ) ≤ 7 / 8) hZ
    (by norm_num [tS] : (0 : ℝ) ≤ tS) hz
  have hm : max ((2 * (7 / 8 : ℝ) - 1) ^ 2 - 2 * tS) 0 ≤ 9 / 16 := by
    rw [max_le_iff]; constructor <;> norm_num [tS]
  linarith

theorem F2_qb : ((F2.cert.qb : ℚ) : ℝ) = 9 / 16 := by
  rw [show F2.cert.qb = mkQ 9 16 from rfl, mkQ_cast]; norm_num

theorem F2_U : ((F2.cert.U : ℚ) : ℝ) = 116091488672439 / 10 ^ 15 := by
  rw [show F2.cert.U = mkQ 116091488672439 1000000000000000 from rfl, mkQ_cast]; norm_num

theorem R78_qb : ((R78.cert.qb : ℚ) : ℝ) = 9 / 16 := by
  rw [show R78.cert.qb = mkQ 9 16 from rfl, mkQ_cast]; norm_num

theorem R78_U : ((R78.cert.U : ℚ) : ℝ) = 118505710922701 / 10 ^ 15 := by
  rw [show R78.cert.U = mkQ 118505710922701 1000000000000000 from rfl, mkQ_cast]; norm_num

/-- **F2 (route-P re-tuned consumer, 59,439 substeps), conditional.** Given the zero-free half-plane
`Re s > 7/8`, Raymond's chain hypotheses and the F2 table hypotheses,
`Λ ≤ 116091488672439/10¹⁵ = 0.116091488672439`. -/
theorem lambda_le_of_qrh_raymond_of_zeroFree (hZ : RaymondCore.Substitution.ZetaZeroFreeRight (7 / 8))
    (h : RaymondChainHyps) (f : FloorTableHyps) :
    deBruijnNewmanLambda ≤ 116091488672439 / 10 ^ 15 := by
  have hb := Cert.lambda_le F2.cert F2.frame11_ok F2.all_chunks_ok h f
    (by rw [F2_qb]; exact start78_of_zeroFree hZ)
  rw [F2_U] at hb
  exact hb

/-- Equivalent form: every zero of `H_t` is real for `t ≥ 116091488672439/10¹⁵`. -/
theorem realZeros_of_qrh_raymond_of_zeroFree (hZ : RaymondCore.Substitution.ZetaZeroFreeRight (7 / 8))
    (h : RaymondChainHyps) (f : FloorTableHyps) :
    ∀ t : ℝ, 116091488672439 / 10 ^ 15 ≤ t → ∀ z : ℂ, H t z = 0 → z.im = 0 := by
  intro t ht
  exact (real_zeros_iff_Lambda_le t).2 ((lambda_le_of_qrh_raymond_of_zeroFree hZ h f).trans ht)

/-- **Raymond's chain alone (60,675 substeps), conditional.** Given the zero-free half-plane
`Re s > 7/8`, Raymond's chain hypotheses and the X1 table hypotheses,
`Λ ≤ 118505710922701/10¹⁵ = 0.118505710922701`. -/
theorem lambda_le_of_raymond78_of_zeroFree (hZ : RaymondCore.Substitution.ZetaZeroFreeRight (7 / 8))
    (h : RaymondChainHyps) (f : RaymondTableHyps) :
    deBruijnNewmanLambda ≤ 118505710922701 / 10 ^ 15 := by
  have hb := Cert.lambda_le R78.cert R78.frame11_ok R78.all_chunks_ok h f
    (by rw [R78_qb]; exact start78_of_zeroFree hZ)
  rw [R78_U] at hb
  exact hb

end QrhLambda
