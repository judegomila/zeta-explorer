import RequestProject.Defs

/-!
# Elementary properties of the sharp-mass data

Positivity, differentiability and continuity of `γ_N`, `A_{N,n}`, the weight `n^{-σ_N}`,
and the exponential form of the weight decay coming from gate (G3).
-/

open Filter Set Topology

namespace SharpMass

variable {t : ℝ} {P : Finset ℕ} {N n : ℕ} {y : ℝ}

/-! ### The multiplier `γ_N` -/

lemma gammaN_eq_exp (hq : 0 < qN t N) (y : ℝ) : gammaN t N y = Real.exp (gN t N * y) := by
  rw [gammaN, Real.rpow_def_of_pos hq, ← Real.exp_add, gN]
  ring_nf

lemma gammaN_pos (hq : 0 < qN t N) (y : ℝ) : 0 < gammaN t N y := by
  rw [gammaN_eq_exp hq]; exact Real.exp_pos _

lemma hasDerivAt_gammaN (hq : 0 < qN t N) (y : ℝ) :
    HasDerivAt (gammaN t N) (gN t N * gammaN t N y) y := by
  have hfun : gammaN t N = fun z => Real.exp (gN t N * z) := funext (gammaN_eq_exp hq)
  rw [hfun]
  simpa [mul_comm] using ((hasDerivAt_id y).const_mul (gN t N)).exp

lemma continuous_gammaN (hq : 0 < qN t N) : Continuous (gammaN t N) :=
  continuous_iff_continuousAt.2 fun y => (hasDerivAt_gammaN hq y).continuousAt

/-- `γ_N` is strictly decreasing when `g_N < 0` (gate (G2)). -/
lemma gammaN_strictAnti (hq : 0 < qN t N) (hg : gN t N < 0) : StrictAnti (gammaN t N) := by
  intro a b hab
  rw [gammaN_eq_exp hq, gammaN_eq_exp hq, Real.exp_lt_exp]
  exact (mul_lt_mul_left_of_neg hg).2 hab

lemma gammaN_antitone (hq : 0 < qN t N) (hg : gN t N < 0) : Antitone (gammaN t N) :=
  (gammaN_strictAnti hq hg).antitone

/-! ### The divisor cells -/

lemma pos_of_mem_cellSet {d : ℕ} (hd : d ∈ cellSet P N n) : 0 < d := by
  rw [cellSet, Finset.mem_filter] at hd
  exact Nat.pos_of_mem_divisors hd.1

lemma ratio_pos {d : ℕ} (hn : 2 ≤ n) (hd : d ∈ cellSet P N n) : 0 < (n : ℝ) / (d : ℝ) := by
  have hd' : (0 : ℝ) < d := by exact_mod_cast pos_of_mem_cellSet hd
  have hn' : (0 : ℝ) < n := by
    have : 0 < n := lt_of_lt_of_le (by norm_num) hn
    exact_mod_cast this
  positivity

/-! ### The coefficient `A_{N,n}` -/

lemma hasDerivAt_Acoef (hn : 2 ≤ n) (y : ℝ) :
    HasDerivAt (Acoef t P N n) (Aderiv t P N n y) y := by
  have hfun : Acoef t P N n = fun z => ∑ d ∈ cellSet P N n,
      lam t d * bt t ((n : ℝ) / (d : ℝ)) * ((n : ℝ) / (d : ℝ)) ^ z := rfl
  rw [hfun, Aderiv]
  refine HasDerivAt.fun_sum fun d hd => ?_
  have h : HasDerivAt (fun z => ((n : ℝ) / (d : ℝ)) ^ z)
      (((n : ℝ) / (d : ℝ)) ^ y * Real.log ((n : ℝ) / (d : ℝ))) y :=
    (Real.hasStrictDerivAt_const_rpow (ratio_pos hn hd) y).hasDerivAt
  simpa [mul_assoc] using h.const_mul (lam t d * bt t ((n : ℝ) / (d : ℝ)))

lemma continuous_Acoef (hn : 2 ≤ n) : Continuous (Acoef t P N n) :=
  continuous_iff_continuousAt.2 fun y => (hasDerivAt_Acoef hn y).continuousAt

/-! ### The weight -/

lemma wgt_eq_exp (hn : 2 ≤ n) (y : ℝ) :
    wgt t N n y = Real.exp (-(sigmaN t N y) * Real.log n) := by
  have hn' : (0 : ℝ) < n := by
    have : 0 < n := lt_of_lt_of_le (by norm_num) hn
    exact_mod_cast this
  rw [wgt, Real.rpow_def_of_pos hn']
  ring_nf

lemma wgt_pos (hn : 2 ≤ n) (y : ℝ) : 0 < wgt t N n y := by
  rw [wgt_eq_exp hn]; exact Real.exp_pos _

lemma continuous_sigmaN : Continuous (sigmaN t N) := by
  unfold sigmaN; fun_prop

lemma continuous_wgt (hn : 2 ≤ n) : Continuous (wgt t N n) := by
  have hfun : wgt t N n = fun y => Real.exp (-(sigmaN t N y) * Real.log n) :=
    funext (wgt_eq_exp hn)
  rw [hfun]
  exact Real.continuous_exp.comp (continuous_sigmaN.neg.mul continuous_const)

lemma log_nat_pos (hn : 2 ≤ n) : 0 < Real.log n := by
  have : (1 : ℝ) < n := by exact_mod_cast lt_of_lt_of_le (by norm_num) hn
  exact Real.log_pos this

/-- The weight decays at least like `exp(-(L/2)(z-y))` to the right, by gate (G3). -/
lemma wgt_le_of_G3 {ylo yhi : ℝ} (hG3 : G3 t N ylo yhi) (hn : 2 ≤ n)
    {y z : ℝ} (hy : ylo ≤ y) (hyz : y ≤ z) (hz : z ≤ yhi) :
    wgt t N n z ≤ wgt t N n y * Real.exp (-(Real.log n / 2 * (z - y))) := by
  rw [wgt_eq_exp hn, wgt_eq_exp hn, ← Real.exp_add, Real.exp_le_exp]
  have hL : 0 ≤ Real.log n := (log_nat_pos hn).le
  have hs := hG3 y z hy hyz hz
  nlinarith [hs, hL]

/-! ### `c(γ_N(·))` -/

lemma cfun_nonneg {g : ℝ} (h0 : 0 < g) (h1 : g < 1) : 0 ≤ cfun g :=
  div_nonneg (by linarith) (by linarith)

lemma hasDerivAt_cfun_gammaN (hq : 0 < qN t N) (y : ℝ) :
    HasDerivAt (fun z => cfun (gammaN t N z)) (cdotN t N y) y := by
  have hγ := hasDerivAt_gammaN hq y
  have hpos : (0 : ℝ) < 1 + gammaN t N y := by linarith [gammaN_pos hq y]
  have hne : (1 : ℝ) + gammaN t N y ≠ 0 := ne_of_gt hpos
  have h1 : HasDerivAt (fun z => 1 - gammaN t N z) (-(gN t N * gammaN t N y)) y :=
    ((hasDerivAt_const y (1:ℝ)).sub hγ).congr_deriv (by ring)
  have h2 : HasDerivAt (fun z => 1 + gammaN t N z) (gN t N * gammaN t N y) y :=
    ((hasDerivAt_const y (1:ℝ)).add hγ).congr_deriv (by ring)
  have := h1.div h2 hne
  refine this.congr_deriv ?_
  rw [cdotN]
  field_simp
  ring

lemma continuous_cfun_gammaN (hq : 0 < qN t N) :
    Continuous (fun z => cfun (gammaN t N z)) :=
  continuous_iff_continuousAt.2 fun y => (hasDerivAt_cfun_gammaN hq y).continuousAt

end SharpMass
