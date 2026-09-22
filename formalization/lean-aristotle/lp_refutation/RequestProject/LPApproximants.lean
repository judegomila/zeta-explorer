import Mathlib

/-!
# Type-controlled real-rooted approximants of Laguerre–Pólya functions

This file formalizes the target of `job33_lp_approximants.tex`:

* the definitions `MathlibBridge.HasOnlyRealRoots`, `EntireLP.toEntire`,
  `EntireLP.IsLaguerrePolya` and the new predicate `EntireLP.HeatMajorized`
  (reproduced verbatim from the job description), and
* the requested theorem `EntireLP.exists_LP_approx_heatMajorized`.

**The requested theorem is false.**  The job description explicitly flags the
Gaussian factor as the danger point ("if the analysis forces a restriction on
`t`, REPORT it") and that is exactly what happens: for the Laguerre–Pólya
function `f z = exp (-z ^ 2)` and `t = 1` *no* sequence of polynomials
converging locally uniformly to `f` can be heat-majorized.

Indeed, if `P n → f` locally uniformly then all iterated derivatives converge
locally uniformly as well, so `HeatMajorized t P` forces
`t ^ k / k ! * ‖iteratedDeriv (2 * k) f 0‖ ≤ u k` with `u` summable.  For the
Gaussian `‖iteratedDeriv (2 * k) f 0‖ = (2 * k)! / k !`, so the left-hand side
is at least `(2 * k)! / (k !) ^ 2 ≥ 1` when `t = 1`; a summable `u` cannot
dominate a sequence bounded below by `1`.

Accordingly this file contains:

* `EntireLP.not_exists_heatMajorized_gaussian` : the counterexample, in the
  strong form that even without the real-rootedness requirement no majorized
  approximating sequence exists;
* `EntireLP.not_forall_exists_LP_approx_heatMajorized` : the requested theorem,
  stated as a universally quantified proposition, is refuted;
* `EntireLP.not_forall_exists_LP_approx_heatMajorized_of_pos` : the failure is not
  confined to large `t`.  Rescaling the Gaussian to `z ↦ exp (-(c * z) ^ 2)` with
  `t * c ^ 2 ≥ 1` refutes the statement for *every* `t > 0`;
* `EntireLP.exists_LP_approx_heatMajorized_zero` : the requested statement *is*
  true for `t = 0`, which by the previous item is the only value of `t` for which
  it holds for all Laguerre–Pólya `f`.

So the honest form of the seam statement is: it holds exactly for `t = 0`.  This is
not a defect of the approximants but of the predicate `HeatMajorized`: for a function
of order two and positive type, the sum `∑ t ^ k / k ! * ‖f ^ (2 k) (0)‖` already
diverges, and any locally uniform limit inherits that divergence.

The original requested statement is preserved verbatim, commented out, at the
end of the file.
-/

open Filter Polynomial
open scoped Topology Nat

namespace MathlibBridge

/-- A real polynomial has only real roots if the number of its roots, counted with
multiplicity, equals its degree. -/
def HasOnlyRealRoots (p : ℝ[X]) : Prop := Multiset.card p.roots = p.natDegree

theorem hasOnlyRealRoots_of_splits {p : ℝ[X]} (hp : Polynomial.Splits p) :
    HasOnlyRealRoots p :=
  Polynomial.splits_iff_card_roots.1 hp

end MathlibBridge

namespace EntireLP

/-- The entire function attached to a real polynomial. -/
noncomputable def toEntire (p : ℝ[X]) : ℂ → ℂ := fun z => Polynomial.aeval z p

/-- The Laguerre–Pólya class: real-symmetric locally uniform limits of real-rooted
real polynomials. -/
def IsLaguerrePolya (f : ℂ → ℂ) : Prop :=
  (∀ z : ℂ, f (starRingEnd ℂ z) = starRingEnd ℂ (f z)) ∧
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop

/-- The uniform-in-`n` summable heat majorant condition. -/
def HeatMajorized (t : ℝ) (P : ℕ → ℝ[X]) : Prop :=
  ∀ r : ℝ, 0 < r → ∃ u : ℕ → ℝ, Summable u ∧
    ∀ n k, ∀ z : ℂ, ‖z‖ ≤ r →
      t ^ k / (k.factorial : ℝ) * ‖iteratedDeriv (2 * k) (toEntire (P n)) z‖ ≤ u k

/-! ### Iterated derivatives of entire functions -/

theorem differentiable_deriv_of_entire {g : ℂ → ℂ} (hg : Differentiable ℂ g) :
    Differentiable ℂ (deriv g) :=
  (hg.contDiff (n := 2)).differentiable_deriv_two

theorem differentiable_iteratedDeriv {g : ℂ → ℂ} (hg : Differentiable ℂ g) (j : ℕ) :
    Differentiable ℂ (iteratedDeriv j g) := by
  induction j with
  | zero => simpa [iteratedDeriv_zero] using hg
  | succ j ih =>
    simpa [iteratedDeriv_succ] using differentiable_deriv_of_entire ih

/-- Locally uniform convergence of entire functions passes to iterated derivatives. -/
theorem tendstoLocallyUniformly_iteratedDeriv : ∀ (m : ℕ) {F : ℕ → ℂ → ℂ} {f : ℂ → ℂ},
    (∀ n, Differentiable ℂ (F n)) → TendstoLocallyUniformly F f atTop →
    TendstoLocallyUniformly (fun n => iteratedDeriv m (F n)) (iteratedDeriv m f) atTop := by
  intro m
  induction m with
  | zero => intro F f _ h; simpa [iteratedDeriv_zero] using h
  | succ m ih =>
    intro F f hF h
    have hderiv : TendstoLocallyUniformly (fun n => deriv (F n)) (deriv f) atTop := by
      rw [← tendstoLocallyUniformlyOn_univ] at h ⊢
      exact h.deriv (.of_forall fun n => (hF n).differentiableOn) isOpen_univ
    have H := ih (F := fun n => deriv (F n)) (f := deriv f)
      (fun n => differentiable_deriv_of_entire (hF n)) hderiv
    simpa [iteratedDeriv_succ'] using H

/-! ### The Gaussian -/

/-- The Gaussian `z ↦ exp (-z ^ 2)`, a Laguerre–Pólya function of order two. -/
noncomputable def gaussian : ℂ → ℂ := fun z => Complex.exp (-z ^ 2)

/-- The real-rooted approximants `(1 - X ^ 2 / n) ^ n` of the Gaussian. -/
noncomputable def gaussianPoly (n : ℕ) : ℝ[X] :=
  (C (-(1 : ℝ) / n) * (X - C (Real.sqrt n)) * (X + C (Real.sqrt n))) ^ n

theorem gaussianPoly_hasOnlyRealRoots (n : ℕ) :
    MathlibBridge.HasOnlyRealRoots (gaussianPoly n) :=
  MathlibBridge.hasOnlyRealRoots_of_splits <|
    Polynomial.Splits.pow
      (((Polynomial.Splits.C _).mul (Polynomial.Splits.X_sub_C _)).mul
        (Polynomial.Splits.X_add_C _)) _

theorem toEntire_gaussianPoly {n : ℕ} (hn : n ≠ 0) (z : ℂ) :
    toEntire (gaussianPoly n) z = (1 - z ^ 2 / n) ^ n := by
  have hs : ((Real.sqrt n : ℝ) : ℂ) ^ 2 = (n : ℂ) := by
    rw [← Complex.ofReal_pow, Real.sq_sqrt (by positivity)]
    simp
  have hn' : (n : ℂ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  simp only [toEntire, gaussianPoly, map_pow, map_mul, map_sub, map_add, Polynomial.aeval_C,
    Polynomial.aeval_X, Complex.coe_algebraMap]
  congr 1
  push_cast
  field_simp
  ring_nf
  rw [hs]

/-! ### Uniform convergence of the approximants -/

theorem norm_pow_succ_sub_pow_succ_le {a b : ℂ} {M : ℝ} (ha : ‖a‖ ≤ M) (hb : ‖b‖ ≤ M) (n : ℕ) :
    ‖a ^ (n + 1) - b ^ (n + 1)‖ ≤ (n + 1) * M ^ n * ‖a - b‖ := by
  have hM : 0 ≤ M := le_trans (norm_nonneg a) ha
  induction n with
  | zero => simp
  | succ n ih =>
    have key : a ^ (n + 2) - b ^ (n + 2)
        = a * (a ^ (n + 1) - b ^ (n + 1)) + (a - b) * b ^ (n + 1) := by ring
    have hb' : ‖b ^ (n + 1)‖ ≤ M ^ (n + 1) := by
      calc ‖b ^ (n + 1)‖ = ‖b‖ ^ (n + 1) := by rw [norm_pow]
        _ ≤ M ^ (n + 1) := by gcongr
    calc ‖a ^ (n + 2) - b ^ (n + 2)‖
        ≤ ‖a‖ * ‖a ^ (n + 1) - b ^ (n + 1)‖ + ‖a - b‖ * ‖b ^ (n + 1)‖ := by
          rw [key]
          simpa [norm_mul] using norm_add_le (a * (a ^ (n + 1) - b ^ (n + 1)))
            ((a - b) * b ^ (n + 1))
      _ ≤ M * ((n + 1) * M ^ n * ‖a - b‖) + ‖a - b‖ * M ^ (n + 1) := by
          have h1 : ‖a‖ * ‖a ^ (n + 1) - b ^ (n + 1)‖ ≤ M * ((n + 1) * M ^ n * ‖a - b‖) :=
            mul_le_mul ha ih (norm_nonneg _) hM
          have h2 : ‖a - b‖ * ‖b ^ (n + 1)‖ ≤ ‖a - b‖ * M ^ (n + 1) :=
            mul_le_mul_of_nonneg_left hb' (norm_nonneg _)
          linarith
      _ = ((n + 1 : ℕ) + 1 : ℝ) * M ^ (n + 1) * ‖a - b‖ := by push_cast; ring

/-- Explicit rate of convergence of `(1 - z ^ 2 / n) ^ n` to the Gaussian on `‖z‖ ≤ r`. -/
theorem norm_approx_sub_gaussian_le {r : ℝ} (hr : 0 < r) {n : ℕ} (hn : r ^ 2 ≤ n) {z : ℂ}
    (hz : ‖z‖ ≤ r) : ‖(1 - z ^ 2 / n) ^ n - gaussian z‖ ≤ Real.exp (r ^ 2) * r ^ 4 / n := by
  have hnpos : (0 : ℝ) < n := lt_of_lt_of_le (by positivity) hn
  have hn0 : n ≠ 0 := by rintro rfl; simp at hnpos
  obtain ⟨m, rfl⟩ : ∃ m, n = m + 1 := ⟨n - 1, by omega⟩
  set N : ℝ := (m : ℝ) + 1 with hN
  have hcast : ((m + 1 : ℕ) : ℝ) = N := by push_cast [hN]; ring
  have hNpos : 0 < N := by positivity
  rw [hcast] at hn hnpos ⊢
  set w : ℂ := -z ^ 2 with hw
  have hnC : ((m + 1 : ℕ) : ℂ) ≠ 0 := Nat.cast_ne_zero.mpr (by omega)
  have hnormN : ‖((m + 1 : ℕ) : ℂ)‖ = N := by rw [Complex.norm_natCast, hcast]
  have hwn : ‖w‖ ≤ r ^ 2 := by
    rw [hw]; simp only [norm_neg, norm_pow]; gcongr
  have hwdiv : ‖w / ((m + 1 : ℕ) : ℂ)‖ ≤ r ^ 2 / N := by
    rw [norm_div, hnormN]; gcongr
  have hle1 : ‖w / ((m + 1 : ℕ) : ℂ)‖ ≤ 1 := hwdiv.trans (by rw [div_le_one hNpos]; exact hn)
  set a : ℂ := 1 + w / ((m + 1 : ℕ) : ℂ) with ha'
  set b : ℂ := Complex.exp (w / ((m + 1 : ℕ) : ℂ)) with hb'
  have hbn : b ^ (m + 1) = gaussian z := by
    rw [hb', ← Complex.exp_nat_mul, gaussian]
    congr 1
    field_simp
    exact hw
  have haval : (1 - z ^ 2 / ((m + 1 : ℕ) : ℂ)) = a := by rw [ha', hw]; ring
  have hMa : ‖a‖ ≤ Real.exp (r ^ 2 / N) := by
    calc ‖a‖ ≤ ‖(1 : ℂ)‖ + ‖w / ((m + 1 : ℕ) : ℂ)‖ := norm_add_le _ _
      _ ≤ 1 + r ^ 2 / N := by simp only [norm_one]; gcongr
      _ ≤ Real.exp (r ^ 2 / N) := by have := Real.add_one_le_exp (r ^ 2 / N); linarith
  have hMb : ‖b‖ ≤ Real.exp (r ^ 2 / N) := by
    rw [hb', Complex.norm_exp]
    exact Real.exp_le_exp.mpr (le_trans (Complex.re_le_norm _) hwdiv)
  have hab : ‖a - b‖ ≤ (r ^ 2 / N) ^ 2 := by
    have hd : a - b = -(Complex.exp (w / ((m + 1 : ℕ) : ℂ)) - 1 - w / ((m + 1 : ℕ) : ℂ)) := by
      rw [ha', hb']; ring
    rw [hd, norm_neg]
    exact (Complex.norm_exp_sub_one_sub_id_le hle1).trans (by gcongr)
  have hexp : (Real.exp (r ^ 2 / N)) ^ m ≤ Real.exp (r ^ 2) := by
    rw [← Real.exp_nat_mul]
    apply Real.exp_le_exp.mpr
    rw [mul_div_assoc', div_le_iff₀ hNpos]
    have hm : (m : ℝ) ≤ N := by rw [hN]; linarith
    nlinarith [sq_nonneg r]
  have hstep : ((m : ℝ) + 1) * (Real.exp (r ^ 2 / N)) ^ m ≤ N * Real.exp (r ^ 2) :=
    mul_le_mul_of_nonneg_left hexp hNpos.le
  rw [haval, ← hbn]
  calc ‖a ^ (m + 1) - b ^ (m + 1)‖ ≤ ((m : ℝ) + 1) * (Real.exp (r ^ 2 / N)) ^ m * ‖a - b‖ :=
        norm_pow_succ_sub_pow_succ_le hMa hMb m
    _ ≤ N * Real.exp (r ^ 2) * ((r ^ 2 / N) ^ 2) :=
        mul_le_mul hstep hab (norm_nonneg _) (by positivity)
    _ = Real.exp (r ^ 2) * r ^ 4 / N := by field_simp

theorem tendstoUniformlyOn_gaussianPoly_closedBall {r : ℝ} (hr : 0 < r) :
    TendstoUniformlyOn (fun n => toEntire (gaussianPoly n)) gaussian atTop
      (Metric.closedBall 0 r) := by
  rw [Metric.tendstoUniformlyOn_iff]
  intro ε hε
  have h1 : ∀ᶠ n : ℕ in atTop, r ^ 2 ≤ (n : ℝ) :=
    (tendsto_natCast_atTop_atTop (R := ℝ)).eventually_ge_atTop _
  have h2 : ∀ᶠ n : ℕ in atTop, Real.exp (r ^ 2) * r ^ 4 / n < ε :=
    (tendsto_const_div_atTop_nhds_zero_nat _).eventually (gt_mem_nhds hε)
  filter_upwards [h1, h2, eventually_ne_atTop 0] with n hn1 hn2 hn3 z hz
  have hz' : ‖z‖ ≤ r := by simpa [Complex.dist_eq] using hz
  rw [Complex.dist_eq, toEntire_gaussianPoly hn3]
  calc ‖gaussian z - (1 - z ^ 2 / n) ^ n‖ = ‖(1 - z ^ 2 / n) ^ n - gaussian z‖ := norm_sub_rev _ _
    _ ≤ Real.exp (r ^ 2) * r ^ 4 / n := norm_approx_sub_gaussian_le hr hn1 hz'
    _ < ε := hn2

theorem tendstoLocallyUniformly_gaussianPoly :
    TendstoLocallyUniformly (fun n => toEntire (gaussianPoly n)) gaussian atTop := by
  rw [tendstoLocallyUniformly_iff_forall_isCompact]
  intro K hK
  obtain ⟨r, hKr⟩ := hK.isBounded.subset_closedBall (0 : ℂ)
  have hr : (0 : ℝ) < max r 1 := lt_of_lt_of_le one_pos (le_max_right _ _)
  exact (tendstoUniformlyOn_gaussianPoly_closedBall hr).mono
    (hKr.trans (Metric.closedBall_subset_closedBall (le_max_left _ _)))

theorem gaussian_isLaguerrePolya : IsLaguerrePolya gaussian := by
  refine ⟨fun z => ?_, ⟨gaussianPoly, gaussianPoly_hasOnlyRealRoots,
    tendstoLocallyUniformly_gaussianPoly⟩⟩
  simp only [gaussian]
  rw [← Complex.exp_conj]
  congr 1
  simp [map_pow]

/-! ### Derivatives of the Gaussian at the origin -/

theorem hasDerivAt_gaussian (z : ℂ) : HasDerivAt gaussian (z * (-2 * gaussian z)) z := by
  have h : HasDerivAt (fun z : ℂ => -z ^ 2) (-(2 * z)) z := by
    simpa using (hasDerivAt_pow 2 z).neg
  simpa [gaussian, mul_comm, mul_assoc, mul_left_comm] using h.cexp

theorem differentiable_gaussian : Differentiable ℂ gaussian :=
  fun z => (hasDerivAt_gaussian z).differentiableAt

theorem deriv_gaussian : deriv gaussian = fun z => z * (-2 * gaussian z) :=
  funext fun z => (hasDerivAt_gaussian z).deriv

/-- Leibniz rule for multiplication by the identity. -/
theorem iteratedDeriv_id_mul {g : ℂ → ℂ} (hg : Differentiable ℂ g) (k : ℕ) :
    iteratedDeriv (k + 1) (fun z => z * g z) =
      fun z => z * iteratedDeriv (k + 1) g z + (k + 1 : ℂ) * iteratedDeriv k g z := by
  induction k with
  | zero =>
    funext z
    have h : HasDerivAt (fun z : ℂ => z * g z) (1 * g z + z * deriv g z) z :=
      (hasDerivAt_id z).mul (hg z).hasDerivAt
    rw [iteratedDeriv_one, iteratedDeriv_one, iteratedDeriv_zero, h.deriv]
    push_cast
    ring
  | succ k ih =>
    funext z
    have h1 : Differentiable ℂ (iteratedDeriv (k + 1) g) := differentiable_iteratedDeriv hg _
    have h2 : Differentiable ℂ (iteratedDeriv k g) := differentiable_iteratedDeriv hg _
    have h : HasDerivAt
        (fun z : ℂ => z * iteratedDeriv (k + 1) g z + (k + 1 : ℂ) * iteratedDeriv k g z)
        ((1 * iteratedDeriv (k + 1) g z + z * deriv (iteratedDeriv (k + 1) g) z)
          + (k + 1 : ℂ) * deriv (iteratedDeriv k g) z) z :=
      ((hasDerivAt_id z).mul (h1 z).hasDerivAt).add ((h2 z).hasDerivAt.const_mul _)
    rw [iteratedDeriv_succ, ih, h.deriv, ← iteratedDeriv_succ, ← iteratedDeriv_succ]
    push_cast
    ring

theorem iteratedDeriv_gaussian_zero_rec (k : ℕ) :
    iteratedDeriv (k + 2) gaussian 0 = -2 * (k + 1 : ℂ) * iteratedDeriv k gaussian 0 := by
  have hg : Differentiable ℂ (fun z : ℂ => -2 * gaussian z) := differentiable_gaussian.const_mul _
  have h1 : iteratedDeriv (k + 2) gaussian = iteratedDeriv (k + 1) (deriv gaussian) := by
    rw [iteratedDeriv_succ']
  rw [h1, deriv_gaussian, iteratedDeriv_id_mul hg k]
  simp [iteratedDeriv_const_mul_field]
  ring

theorem iteratedDeriv_gaussian_zero (k : ℕ) :
    iteratedDeriv (2 * k) gaussian 0 = (-1 : ℂ) ^ k * ((2 * k).factorial / k.factorial : ℝ) := by
  induction k with
  | zero => simp [gaussian]
  | succ k ih =>
    have h : 2 * (k + 1) = 2 * k + 2 := by ring
    rw [h, iteratedDeriv_gaussian_zero_rec, ih]
    have e1 : (2 * k + 2).factorial = (2 * k + 2) * ((2 * k + 1) * (2 * k).factorial) := by
      rw [Nat.factorial_succ, Nat.factorial_succ]
    have e2 : (k + 1).factorial = (k + 1) * k.factorial := Nat.factorial_succ k
    have hkf : ((k.factorial : ℝ)) ≠ 0 := Nat.cast_ne_zero.mpr (Nat.factorial_ne_zero k)
    rw [e1, e2]
    push_cast
    have hkf' : ((k.factorial : ℝ) : ℂ) ≠ 0 := Complex.ofReal_ne_zero.mpr hkf
    field_simp
    ring

theorem one_le_norm_iteratedDeriv_gaussian_zero_div (k : ℕ) :
    1 ≤ ‖iteratedDeriv (2 * k) gaussian 0‖ / k.factorial := by
  have hfac : (k.factorial * k.factorial : ℕ) ≤ (2 * k).factorial := by
    have hdvd : k.factorial * k.factorial ∣ (k + k).factorial :=
      Nat.factorial_mul_factorial_dvd_factorial_add k k
    have h := Nat.le_of_dvd (Nat.factorial_pos _) hdvd
    simpa [two_mul] using h
  have hpos : (0 : ℝ) < k.factorial := by exact_mod_cast Nat.factorial_pos k
  have hnorm : ‖iteratedDeriv (2 * k) gaussian 0‖ = ((2 * k).factorial : ℝ) / k.factorial := by
    rw [iteratedDeriv_gaussian_zero, norm_mul, norm_pow, norm_neg, norm_one, one_pow, one_mul,
      Complex.norm_real, Real.norm_eq_abs, abs_of_nonneg (by positivity)]
  rw [hnorm, le_div_iff₀ hpos, le_div_iff₀ hpos]
  have hcast : ((k.factorial : ℝ) * k.factorial) ≤ ((2 * k).factorial : ℝ) := by exact_mod_cast hfac
  linarith

/-! ### The counterexample -/

theorem differentiable_toEntire (p : ℝ[X]) : Differentiable ℂ (toEntire p) := by
  have h : toEntire p = fun z : ℂ => (p.map (algebraMap ℝ ℂ)).eval z := by
    funext z
    simp only [toEntire, Polynomial.eval_map_algebraMap]
  rw [h]
  exact Polynomial.differentiable _

/-- The obstruction to heat majorization: if the even derivatives of `f` at the origin
are so large that `t ^ k / k ! * ‖f ^ (2 k) (0)‖ ≥ 1` for every `k`, then no sequence of
polynomials converging locally uniformly to `f` can be heat majorized at `t`. -/
theorem not_exists_heatMajorized_of_one_le {f : ℂ → ℂ} {t : ℝ}
    (hlow : ∀ k, 1 ≤ t ^ k / k.factorial * ‖iteratedDeriv (2 * k) f 0‖) :
    ¬ ∃ P : ℕ → ℝ[X],
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧ HeatMajorized t P := by
  rintro ⟨P, hconv, hmaj⟩
  obtain ⟨u, hu, hbound⟩ := hmaj 1 one_pos
  have hdiff : ∀ n, Differentiable ℂ (toEntire (P n)) := fun n => differentiable_toEntire _
  have hk : ∀ k, 1 ≤ u k := by
    intro k
    have hloc := tendstoLocallyUniformly_iteratedDeriv (2 * k) hdiff hconv
    have hlim : Tendsto (fun n => iteratedDeriv (2 * k) (toEntire (P n)) 0) atTop
        (𝓝 (iteratedDeriv (2 * k) f 0)) :=
      (tendstoLocallyUniformlyOn_univ.2 hloc).tendsto_at (Set.mem_univ 0)
    have hlim2 : Tendsto
        (fun n => t ^ k / k.factorial * ‖iteratedDeriv (2 * k) (toEntire (P n)) 0‖) atTop
        (𝓝 (t ^ k / k.factorial * ‖iteratedDeriv (2 * k) f 0‖)) := hlim.norm.const_mul _
    exact le_trans (hlow k)
      (le_of_tendsto hlim2 (Eventually.of_forall fun n => hbound n k 0 (by simp)))
  obtain ⟨k, hkk⟩ := (hu.tendsto_atTop_zero.eventually (gt_mem_nhds one_pos)).exists
  linarith [hk k]

/-- **No heat-majorized approximating sequence for the Gaussian at `t = 1`.**
Real-rootedness is not even needed: no sequence of real polynomials converging
locally uniformly to `z ↦ exp (-z ^ 2)` is heat majorized at `t = 1`. -/
theorem not_exists_heatMajorized_gaussian :
    ¬ ∃ P : ℕ → ℝ[X],
      TendstoLocallyUniformly (fun n => toEntire (P n)) gaussian atTop ∧ HeatMajorized 1 P := by
  refine not_exists_heatMajorized_of_one_le fun k => ?_
  simpa [div_eq_mul_inv, mul_comm] using one_le_norm_iteratedDeriv_gaussian_zero_div k

/-- **The requested theorem is false.** -/
theorem not_forall_exists_LP_approx_heatMajorized :
    ¬ ∀ (f : ℂ → ℂ) (t : ℝ), 0 ≤ t → IsLaguerrePolya f →
      ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧ HeatMajorized t P := by
  intro h
  obtain ⟨P, -, hconv, hmaj⟩ := h gaussian 1 zero_le_one gaussian_isLaguerrePolya
  exact not_exists_heatMajorized_gaussian ⟨P, hconv, hmaj⟩

/-! ### Scaled Gaussians: the statement fails for every `t > 0` -/

/-- The real-rooted approximants `(1 - (c * X) ^ 2 / n) ^ n` of `z ↦ exp (-(c * z) ^ 2)`. -/
noncomputable def gaussianPolyScaled (c : ℝ) (n : ℕ) : ℝ[X] :=
  (C (-(1 : ℝ) / n) * (C c * X - C (Real.sqrt n)) * (C c * X + C (Real.sqrt n))) ^ n

theorem gaussianPolyScaled_hasOnlyRealRoots {c : ℝ} (hc : c ≠ 0) (n : ℕ) :
    MathlibBridge.HasOnlyRealRoots (gaussianPolyScaled c n) := by
  refine MathlibBridge.hasOnlyRealRoots_of_splits (Polynomial.Splits.pow ?_ _)
  refine ((Polynomial.Splits.C _).mul ?_).mul ?_
  · refine Polynomial.Splits.of_degree_eq_one ?_
    have h : C c * X - C (Real.sqrt n) = C c * X + C (-(Real.sqrt n)) := by
      rw [map_neg, sub_eq_add_neg]
    rw [h, Polynomial.degree_linear hc]
  · exact Polynomial.Splits.of_degree_eq_one (Polynomial.degree_linear hc)

theorem toEntire_gaussianPolyScaled (c : ℝ) {n : ℕ} (hn : n ≠ 0) (z : ℂ) :
    toEntire (gaussianPolyScaled c n) z = (1 - ((c : ℂ) * z) ^ 2 / n) ^ n := by
  have hs : ((Real.sqrt n : ℝ) : ℂ) ^ 2 = (n : ℂ) := by
    rw [← Complex.ofReal_pow, Real.sq_sqrt (by positivity)]
    simp
  have hn' : (n : ℂ) ≠ 0 := Nat.cast_ne_zero.mpr hn
  simp only [toEntire, gaussianPolyScaled, map_pow, map_mul, map_sub, map_add, Polynomial.aeval_C,
    Polynomial.aeval_X, Complex.coe_algebraMap]
  congr 1
  push_cast
  field_simp
  ring_nf
  rw [hs]

theorem tendstoLocallyUniformly_gaussianPolyScaled (c : ℝ) :
    TendstoLocallyUniformly (fun n => toEntire (gaussianPolyScaled c n))
      (fun z => gaussian ((c : ℂ) * z)) atTop := by
  rw [tendstoLocallyUniformly_iff_forall_isCompact]
  intro K hK
  obtain ⟨r, hKr⟩ := hK.isBounded.subset_closedBall (0 : ℂ)
  set R : ℝ := max (|c| * max r 1) 1 with hRdef
  have hR : (0 : ℝ) < R := lt_of_lt_of_le one_pos (le_max_right _ _)
  rw [Metric.tendstoUniformlyOn_iff]
  intro ε hε
  have h1 : ∀ᶠ n : ℕ in atTop, R ^ 2 ≤ (n : ℝ) :=
    (tendsto_natCast_atTop_atTop (R := ℝ)).eventually_ge_atTop _
  have h2 : ∀ᶠ n : ℕ in atTop, Real.exp (R ^ 2) * R ^ 4 / n < ε :=
    (tendsto_const_div_atTop_nhds_zero_nat _).eventually (gt_mem_nhds hε)
  filter_upwards [h1, h2, eventually_ne_atTop 0] with n hn1 hn2 hn3 z hz
  have hz0 : ‖z‖ ≤ max r 1 := by
    have := hKr hz
    simp only [Metric.mem_closedBall, Complex.dist_eq, sub_zero] at this
    exact this.trans (le_max_left _ _)
  have hz2 : ‖(c : ℂ) * z‖ ≤ R := by
    rw [norm_mul, Complex.norm_real, Real.norm_eq_abs]
    refine le_trans ?_ (le_max_left _ _)
    exact mul_le_mul_of_nonneg_left hz0 (abs_nonneg c)
  rw [Complex.dist_eq, toEntire_gaussianPolyScaled c hn3]
  calc ‖gaussian ((c : ℂ) * z) - (1 - ((c : ℂ) * z) ^ 2 / n) ^ n‖
      = ‖(1 - ((c : ℂ) * z) ^ 2 / n) ^ n - gaussian ((c : ℂ) * z)‖ := norm_sub_rev _ _
    _ ≤ Real.exp (R ^ 2) * R ^ 4 / n := norm_approx_sub_gaussian_le hR hn1 hz2
    _ < ε := hn2

theorem gaussian_conj (z : ℂ) : gaussian (starRingEnd ℂ z) = starRingEnd ℂ (gaussian z) := by
  simp only [gaussian]
  rw [← Complex.exp_conj]
  congr 1
  simp [map_pow]

theorem gaussianScaled_isLaguerrePolya {c : ℝ} (hc : c ≠ 0) :
    IsLaguerrePolya (fun z => gaussian ((c : ℂ) * z)) := by
  refine ⟨fun z => ?_, ⟨gaussianPolyScaled c, gaussianPolyScaled_hasOnlyRealRoots hc,
    tendstoLocallyUniformly_gaussianPolyScaled c⟩⟩
  have h : (c : ℂ) * starRingEnd ℂ z = starRingEnd ℂ ((c : ℂ) * z) := by
    simp [map_mul, Complex.conj_ofReal]
  show gaussian ((c : ℂ) * starRingEnd ℂ z) = starRingEnd ℂ (gaussian ((c : ℂ) * z))
  rw [h, gaussian_conj]

theorem norm_iteratedDeriv_gaussianScaled_zero (c : ℝ) (k : ℕ) :
    ‖iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0‖
      = (c ^ 2) ^ k * ‖iteratedDeriv (2 * k) gaussian 0‖ := by
  rw [iteratedDeriv_comp_const_mul differentiable_gaussian.contDiff (c : ℂ)]
  simp only [mul_zero, norm_mul, norm_pow, Complex.norm_real, Real.norm_eq_abs, pow_mul, sq_abs]

theorem one_le_heatTerm_gaussianScaled {c t : ℝ} (h : 1 ≤ t * c ^ 2) (k : ℕ) :
    1 ≤ t ^ k / k.factorial * ‖iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0‖ := by
  have hfac := one_le_norm_iteratedDeriv_gaussian_zero_div k
  have hpos : (0 : ℝ) < k.factorial := by exact_mod_cast Nat.factorial_pos k
  rw [norm_iteratedDeriv_gaussianScaled_zero]
  have hkey : t ^ k / k.factorial * ((c ^ 2) ^ k * ‖iteratedDeriv (2 * k) gaussian 0‖)
      = (t * c ^ 2) ^ k * (‖iteratedDeriv (2 * k) gaussian 0‖ / k.factorial) := by
    rw [mul_pow]
    field_simp
  rw [hkey]
  have h1 : (1 : ℝ) ≤ (t * c ^ 2) ^ k := one_le_pow₀ h
  nlinarith [hfac, h1]

/-- **For every positive `t` the requested statement fails**: the scaled Gaussian
`z ↦ exp (-(c * z) ^ 2)` with `t * c ^ 2 ≥ 1` admits no heat-majorized approximating
sequence. -/
theorem not_exists_heatMajorized_gaussianScaled {c t : ℝ} (h : 1 ≤ t * c ^ 2) :
    ¬ ∃ P : ℕ → ℝ[X],
      TendstoLocallyUniformly (fun n => toEntire (P n)) (fun z => gaussian ((c : ℂ) * z)) atTop ∧
        HeatMajorized t P :=
  not_exists_heatMajorized_of_one_le (one_le_heatTerm_gaussianScaled h)

/-- **The requested statement fails for every `t > 0`**, not merely for large `t`. -/
theorem not_forall_exists_LP_approx_heatMajorized_of_pos {t : ℝ} (ht : 0 < t) :
    ¬ ∀ f : ℂ → ℂ, IsLaguerrePolya f →
      ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧ HeatMajorized t P := by
  intro hall
  set c : ℝ := Real.sqrt (1 / t) with hcdef
  have hc2 : c ^ 2 = 1 / t := Real.sq_sqrt (by positivity)
  have hc : c ≠ 0 := by
    intro h0
    rw [h0] at hc2
    have : (0 : ℝ) < 1 / t := by positivity
    simp at hc2
    linarith
  have hprod : 1 ≤ t * c ^ 2 := by
    rw [hc2, mul_one_div, div_self ht.ne']
  obtain ⟨P, -, hconv, hmaj⟩ := hall _ (gaussianScaled_isLaguerrePolya hc)
  exact not_exists_heatMajorized_gaussianScaled hprod ⟨P, hconv, hmaj⟩

/-! ### The positive result at `t = 0` -/

/-- A locally uniformly convergent sequence of entire functions is uniformly bounded
on every closed ball. -/
theorem exists_uniform_bound_of_tendstoLocallyUniformly {F : ℕ → ℂ → ℂ} {f : ℂ → ℂ}
    (hF : ∀ n, Continuous (F n)) (h : TendstoLocallyUniformly F f atTop) {r : ℝ} (hr : 0 < r) :
    ∃ C : ℝ, ∀ n, ∀ z : ℂ, ‖z‖ ≤ r → ‖F n z‖ ≤ C := by
  have hK : IsCompact (Metric.closedBall (0 : ℂ) r) := isCompact_closedBall _ _
  have hmem : ∀ z : ℂ, ‖z‖ ≤ r → z ∈ Metric.closedBall (0 : ℂ) r := by
    intro z hz; simpa [Complex.dist_eq] using hz
  have hcont : Continuous f := h.continuous (.of_forall hF)
  obtain ⟨Mf, hMf⟩ := hK.exists_bound_of_continuousOn hcont.continuousOn
  have hMf0 : 0 ≤ Mf := le_trans (norm_nonneg (f 0)) (hMf 0 (by simp [hr.le]))
  have huc : TendstoUniformlyOn F f atTop (Metric.closedBall 0 r) :=
    (tendstoLocallyUniformly_iff_forall_isCompact.1 h) _ hK
  rw [Metric.tendstoUniformlyOn_iff] at huc
  obtain ⟨N, hN⟩ := Filter.eventually_atTop.1 (huc 1 one_pos)
  choose c hc using fun n => hK.exists_bound_of_continuousOn (hF n).continuousOn
  refine ⟨Mf + 1 + ∑ i ∈ Finset.range N, |c i|, fun n z hz => ?_⟩
  have hsum0 : 0 ≤ ∑ i ∈ Finset.range N, |c i| := Finset.sum_nonneg fun i _ => abs_nonneg _
  rcases le_or_gt N n with hn | hn
  · have h1 : dist (f z) (F n z) < 1 := hN n hn z (hmem z hz)
    have h2 : ‖F n z‖ ≤ ‖f z‖ + 1 := by
      have hlt : ‖F n z - f z‖ < 1 := by
        rw [← Complex.dist_eq, dist_comm]; exact h1
      calc ‖F n z‖ = ‖f z + (F n z - f z)‖ := by ring_nf
        _ ≤ ‖f z‖ + ‖F n z - f z‖ := norm_add_le _ _
        _ ≤ ‖f z‖ + 1 := by linarith
    have h3 : ‖f z‖ ≤ Mf := hMf z (hmem z hz)
    linarith
  · have h1 : ‖F n z‖ ≤ c n := hc n z (hmem z hz)
    have h2 : c n ≤ ∑ i ∈ Finset.range N, |c i| :=
      le_trans (le_abs_self _)
        (Finset.single_le_sum (f := fun i => |c i|) (fun i _ => abs_nonneg _)
          (Finset.mem_range.2 hn))
    linarith

/-- At `t = 0` the requested statement is true, with the majorant supported at `k = 0`. -/
theorem exists_LP_approx_heatMajorized_zero {f : ℂ → ℂ} (hf : IsLaguerrePolya f) :
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧ HeatMajorized 0 P := by
  obtain ⟨-, P, hroots, hconv⟩ := hf
  refine ⟨P, hroots, hconv, ?_⟩
  intro r hr
  obtain ⟨C, hC⟩ := exists_uniform_bound_of_tendstoLocallyUniformly
    (fun n => (differentiable_toEntire (P n)).continuous) hconv hr
  refine ⟨fun k => if k = 0 then max C 0 else 0, ?_, ?_⟩
  · refine summable_of_ne_finset_zero (s := {0}) ?_
    intro k hk
    simp only [Finset.mem_singleton] at hk
    simp [hk]
  · intro n k z hz
    rcases Nat.eq_zero_or_pos k with rfl | hk
    · simp only [pow_zero, Nat.factorial_zero, Nat.cast_one, div_one, one_mul, Nat.mul_zero,
        iteratedDeriv_zero, if_pos]
      exact le_trans (hC n z hz) (le_max_left _ _)
    · have hk0 : k ≠ 0 := by omega
      simp [hk0, zero_pow hk0]

/-
Requested (and refuted) statement, reproduced verbatim from
`job33_lp_approximants.tex`:

theorem exists_LP_approx_heatMajorized {f : ℂ → ℂ} {t : ℝ} (ht : 0 ≤ t)
    (hf : IsLaguerrePolya f) :
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧
      HeatMajorized t P

It is false: see `not_forall_exists_LP_approx_heatMajorized` above.
-/

end EntireLP
