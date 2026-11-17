import LeanCert.Analysis.DBN.Threshold
import LeanCert.Analysis.DBN.XiIdentity

open LeanCert.Analysis.DBN

#print LeanCert.Analysis.DBN.kernelTerm
#print LeanCert.Analysis.DBN.Phi
#print LeanCert.Analysis.DBN.heatIntegrand
#print LeanCert.Analysis.DBN.H
#print LeanCert.Analysis.DBN.realZeroTimes
#print LeanCert.Analysis.DBN.Lambda
#print LeanCert.Analysis.DBN.riemannXi
#check @H_zero_eq_riemannXi
#check @riemannXi_eq_mul_completed
#check @real_zeros_iff_Lambda_le
#check @Lambda_unique

/-- LeanCert's `H 0` in terms of Mathlib's completed zeta: for `s = 1/2 + i z/2 ∉ {0, 1}`,
`H_0(z) = s (s - 1) Λ(s) / 16`, i.e. `ξ(s)/8` with `ξ(s) = s(s-1)π^{-s/2}Γ(s/2)ζ(s)/2`. -/
theorem H_zero_eq_completedZeta (z : ℂ)
    (h0 : (1/2 + Complex.I*z/2 : ℂ) ≠ 0) (h1 : (1/2 + Complex.I*z/2 : ℂ) ≠ 1) :
    H 0 z = (1/2 + Complex.I*z/2) * ((1/2 + Complex.I*z/2) - 1) *
      completedRiemannZeta (1/2 + Complex.I*z/2) / 16 := by
  rw [H_zero_eq_riemannXi, riemannXi_eq_mul_completed h0 h1]
  ring

/-- `Lambda` is the least `t` such that `H_t` has only real zeros (Newman's definition). -/
theorem Lambda_isLeast_realZeros :
    IsLeast {t : ℝ | ∀ z : ℂ, H t z = 0 → z.im = 0} Lambda := Lambda_isLeast

#print axioms H_zero_eq_riemannXi
#print axioms real_zeros_iff_Lambda_le
#print axioms Lambda_le_half
#print axioms H_zero_eq_completedZeta
#print axioms Lambda_isLeast_realZeros
