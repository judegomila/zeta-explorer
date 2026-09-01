import Mathlib

/-!
# The shear-Gram norm identity (finite-dimensional)

For `p q : EuclideanSpace ℝ (Fin N)` we consider the rank-two hollow antisymmetric matrix
`G i j = p i * q j - q i * p j` (i.e. `G = p qᵀ - q pᵀ`) and the quantity
`μ = √(‖p‖² ‖q‖² - ⟪p, q⟫²)`.

Main results (finite-dimensional, exact algebra):

* `ShearGram.sum_sq_gramMatrix` (G1): `∑ i j, G i j ^ 2 = 2 (‖p‖²‖q‖² - ⟪p,q⟫²) = 2 μ²`,
  with the cross-check `ShearGram.neg_trace_sq_gramMatrix`: `-tr (G²) = ∑ i j, G i j ^ 2`.
* `ShearGram.opNorm_gramMatrix` (G2): the Euclidean operator norm of `G` equals `μ`,
  and `ShearGram.hs_eq_sqrt_two_mul_opNorm`: `‖G‖_HS = √2 ‖G‖_op`.
* `ShearGram.sum_sq_strict_lower_of_antisymm` (G3): for any antisymmetric `A`,
  `∑ i, ∑ j < i, A i j ^ 2 = ½ ∑ i j, A i j ^ 2`.
* `ShearGram.volterra_hs_eq_opNorm` (G4): `(∑ i, ∑ j < i, G i j ^ 2) ^ (1/2) = μ = ‖G‖_op`.
* `ShearGram.gramMatrix_shear` (G5): the discrete shear kernel
  `φ i φ j sinh (a (u j - u i))` is of this rank-two form.
-/

open scoped RealInnerProductSpace

namespace ShearGram

variable {N : ℕ}

/-- The rank-two hollow antisymmetric kernel `G = p qᵀ - q pᵀ`. -/
noncomputable def gramMatrix (p q : EuclideanSpace ℝ (Fin N)) : Matrix (Fin N) (Fin N) ℝ :=
  Matrix.of fun i j => p i * q j - q i * p j

/-- The Gram discriminant `‖p‖² ‖q‖² - ⟪p, q⟫²`, nonnegative by Cauchy–Schwarz. -/
noncomputable def discr (p q : EuclideanSpace ℝ (Fin N)) : ℝ :=
  ‖p‖ ^ 2 * ‖q‖ ^ 2 - ⟪p, q⟫ ^ 2

/-- `μ = √(‖p‖² ‖q‖² - ⟪p, q⟫²)`. -/
noncomputable def mu (p q : EuclideanSpace ℝ (Fin N)) : ℝ := Real.sqrt (discr p q)

/-- The Euclidean (`ℓ²`) operator norm of a square matrix. -/
noncomputable def opNorm (A : Matrix (Fin N) (Fin N) ℝ) : ℝ :=
  ‖Matrix.toEuclideanCLM (𝕜 := ℝ) A‖

section basic

variable (p q : EuclideanSpace ℝ (Fin N))

lemma inner_eq_sum : ⟪p, q⟫ = ∑ i, p i * q i := by
  rw [PiLp.inner_apply]
  exact Finset.sum_congr rfl fun i _ => by simp [RCLike.inner_apply, mul_comm]

lemma norm_sq_eq_sum : ‖p‖ ^ 2 = ∑ i, p i ^ 2 := by
  rw [EuclideanSpace.norm_eq, Real.sq_sqrt (by positivity)]
  exact Finset.sum_congr rfl fun i _ => by simp [sq_abs]

lemma discr_nonneg : 0 ≤ discr p q := by
  have h : |⟪p, q⟫| ≤ ‖p‖ * ‖q‖ := abs_real_inner_le_norm p q
  have h2 : ⟪p, q⟫ ^ 2 ≤ (‖p‖ * ‖q‖) ^ 2 := by
    have := abs_nonneg (⟪p, q⟫ : ℝ)
    nlinarith [sq_abs (⟪p, q⟫ : ℝ), mul_nonneg (norm_nonneg p) (norm_nonneg q)]
  simp only [discr]
  nlinarith [h2]

lemma mu_nonneg : 0 ≤ mu p q := Real.sqrt_nonneg _

lemma mu_sq : mu p q ^ 2 = discr p q := Real.sq_sqrt (discr_nonneg p q)

end basic

/-! ### G1: Frobenius / Hilbert–Schmidt mass -/

/-- **G1**: the Frobenius mass of the rank-two kernel. -/
theorem sum_sq_gramMatrix (p q : EuclideanSpace ℝ (Fin N)) :
    ∑ i, ∑ j, (gramMatrix p q i j) ^ 2 = 2 * (‖p‖ ^ 2 * ‖q‖ ^ 2 - ⟪p, q⟫ ^ 2) := by
  have hP : ‖p‖ ^ 2 = ∑ i, p i ^ 2 := norm_sq_eq_sum p
  have hQ : ‖q‖ ^ 2 = ∑ i, q i ^ 2 := norm_sq_eq_sum q
  have hC : ⟪p, q⟫ = ∑ i, p i * q i := inner_eq_sum p q
  have expand : ∀ i : Fin N, ∑ j, (gramMatrix p q i j) ^ 2
      = p i ^ 2 * (∑ j, q j ^ 2) + q i ^ 2 * (∑ j, p j ^ 2)
        - (p i * q i) * (2 * ∑ j, p j * q j) := by
    intro i
    simp only [Finset.mul_sum, ← Finset.sum_add_distrib, ← Finset.sum_sub_distrib]
    exact Finset.sum_congr rfl fun j _ => by simp [gramMatrix]; ring
  rw [Finset.sum_congr rfl fun i (_ : i ∈ Finset.univ) => expand i, hP, hQ, hC,
    Finset.sum_sub_distrib, Finset.sum_add_distrib]
  simp only [← Finset.sum_mul]
  ring

/-- **G1** (cross-check): the Frobenius mass equals `-tr (G²)`. -/
theorem neg_trace_sq_gramMatrix (p q : EuclideanSpace ℝ (Fin N)) :
    -Matrix.trace ((gramMatrix p q) ^ 2) = ∑ i, ∑ j, (gramMatrix p q i j) ^ 2 := by
  rw [pow_two, Matrix.trace, ← Finset.sum_neg_distrib]
  refine Finset.sum_congr rfl fun i _ => ?_
  rw [Matrix.diag_apply, Matrix.mul_apply, ← Finset.sum_neg_distrib]
  exact Finset.sum_congr rfl fun j _ => by simp [gramMatrix]; ring

theorem sum_sq_gramMatrix_eq_two_mul_mu_sq (p q : EuclideanSpace ℝ (Fin N)) :
    ∑ i, ∑ j, (gramMatrix p q i j) ^ 2 = 2 * mu p q ^ 2 := by
  rw [mu_sq, discr, sum_sq_gramMatrix]

/-- If the Gram discriminant vanishes the kernel is identically zero. -/
theorem gramMatrix_eq_zero_of_discr_eq_zero {p q : EuclideanSpace ℝ (Fin N)}
    (h : discr p q = 0) : gramMatrix p q = 0 := by
  have hsum : ∑ i, ∑ j, (gramMatrix p q i j) ^ 2 = 0 := by
    rw [sum_sq_gramMatrix, ← discr, h, mul_zero]
  ext i j
  have h1 : ∀ i ∈ (Finset.univ : Finset (Fin N)),
      (0:ℝ) ≤ ∑ j, (gramMatrix p q i j) ^ 2 := fun i _ => by positivity
  have h2 := (Finset.sum_eq_zero_iff_of_nonneg h1).1 hsum i (Finset.mem_univ i)
  have h3 := (Finset.sum_eq_zero_iff_of_nonneg
    (fun j (_ : j ∈ (Finset.univ : Finset (Fin N))) => sq_nonneg (gramMatrix p q i j))).1 h2 j
      (Finset.mem_univ j)
  simpa using pow_eq_zero_iff (n := 2) (by norm_num) |>.1 h3

/-! ### G2: the Euclidean operator norm -/

lemma toEuclideanCLM_gramMatrix_apply (p q x : EuclideanSpace ℝ (Fin N)) :
    (Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) x = ⟪q, x⟫ • p - ⟪p, x⟫ • q := by
  ext i
  have h : ((Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) x).ofLp i
      = (Matrix.mulVec (gramMatrix p q) (WithLp.ofLp x)) i := by
    rw [Matrix.ofLp_toEuclideanCLM]
  rw [h]
  simp [gramMatrix, Matrix.mulVec, dotProduct, PiLp.inner_apply, RCLike.inner_apply,
    Finset.sum_sub_distrib, Finset.mul_sum, sub_mul, mul_comm, mul_assoc, mul_left_comm]

/-- The squared norm of `G x` as a quadratic form in `(⟪p,x⟫, ⟪q,x⟫)`. -/
lemma norm_sq_gramMatrix_apply (p q x : EuclideanSpace ℝ (Fin N)) :
    ‖(Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) x‖ ^ 2
      = ‖q‖ ^ 2 * ⟪p, x⟫ ^ 2 + ‖p‖ ^ 2 * ⟪q, x⟫ ^ 2 - 2 * ⟪p, q⟫ * ⟪p, x⟫ * ⟪q, x⟫ := by
  rw [← real_inner_self_eq_norm_sq, toEuclideanCLM_gramMatrix_apply]
  simp only [inner_sub_left, inner_sub_right, real_inner_smul_left, real_inner_smul_right]
  rw [show (⟪q, p⟫ : ℝ) = ⟪p, q⟫ from real_inner_comm p q,
    real_inner_self_eq_norm_sq p, real_inner_self_eq_norm_sq q]
  ring

/-- Gram determinant inequality for the three vectors `p, q, x`. -/
lemma discr_mul_quadratic_nonneg (p q x : EuclideanSpace ℝ (Fin N)) :
    0 ≤ discr p q * (discr p q * ‖x‖ ^ 2
      - (‖q‖ ^ 2 * ⟪p, x⟫ ^ 2 + ‖p‖ ^ 2 * ⟪q, x⟫ ^ 2 - 2 * ⟪p, q⟫ * ⟪p, x⟫ * ⟪q, x⟫)) := by
  set D := discr p q with hD
  set z : EuclideanSpace ℝ (Fin N) := D • x - (‖q‖ ^ 2 * ⟪p, x⟫ - ⟪p, q⟫ * ⟪q, x⟫) • p
      - (‖p‖ ^ 2 * ⟪q, x⟫ - ⟪p, q⟫ * ⟪p, x⟫) • q with hz
  have h0 : (0 : ℝ) ≤ ⟪z, z⟫ := real_inner_self_nonneg
  have hexp : (⟪z, z⟫ : ℝ) = D * (D * ‖x‖ ^ 2
      - (‖q‖ ^ 2 * ⟪p, x⟫ ^ 2 + ‖p‖ ^ 2 * ⟪q, x⟫ ^ 2 - 2 * ⟪p, q⟫ * ⟪p, x⟫ * ⟪q, x⟫)) := by
    simp only [hz, inner_sub_left, inner_sub_right, real_inner_smul_left, real_inner_smul_right]
    rw [show (⟪x, p⟫ : ℝ) = ⟪p, x⟫ from real_inner_comm p x,
      show (⟪x, q⟫ : ℝ) = ⟪q, x⟫ from real_inner_comm q x,
      show (⟪q, p⟫ : ℝ) = ⟪p, q⟫ from real_inner_comm p q,
      real_inner_self_eq_norm_sq p, real_inner_self_eq_norm_sq q,
      real_inner_self_eq_norm_sq x, hD, discr]
    ring
  linarith

lemma norm_gramMatrix_apply_le (p q x : EuclideanSpace ℝ (Fin N)) :
    ‖(Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) x‖ ≤ mu p q * ‖x‖ := by
  have hsq : ‖(Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) x‖ ^ 2 ≤ (mu p q * ‖x‖) ^ 2 := by
    rw [norm_sq_gramMatrix_apply, mul_pow, mu_sq]
    rcases eq_or_lt_of_le (discr_nonneg p q) with h | h
    · have hG : gramMatrix p q = 0 := gramMatrix_eq_zero_of_discr_eq_zero h.symm
      have hz : ‖(Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) x‖ ^ 2 = 0 := by
        rw [hG]; simp
      rw [norm_sq_gramMatrix_apply] at hz
      rw [← h]
      linarith
    · nlinarith [discr_mul_quadratic_nonneg p q x]
  nlinarith [norm_nonneg ((Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) x),
    mul_nonneg (mu_nonneg p q) (norm_nonneg x)]

lemma norm_gramMatrix_apply_self (p q : EuclideanSpace ℝ (Fin N)) :
    ‖(Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) p‖ = mu p q * ‖p‖ := by
  have h : ‖(Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) p‖ ^ 2 = (mu p q * ‖p‖) ^ 2 := by
    rw [norm_sq_gramMatrix_apply, mul_pow, mu_sq, discr,
      show (⟪q, p⟫ : ℝ) = ⟪p, q⟫ from real_inner_comm p q, real_inner_self_eq_norm_sq p]
    ring
  have h1 : (0:ℝ) ≤ ‖(Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)) p‖ := norm_nonneg _
  have h2 : (0:ℝ) ≤ mu p q * ‖p‖ := mul_nonneg (mu_nonneg p q) (norm_nonneg p)
  nlinarith

/-- **G2**: the Euclidean operator norm of the rank-two antisymmetric kernel is `μ`. -/
theorem opNorm_gramMatrix (p q : EuclideanSpace ℝ (Fin N)) :
    opNorm (gramMatrix p q) = mu p q := by
  refine le_antisymm ?_ ?_
  · exact ContinuousLinearMap.opNorm_le_bound _ (mu_nonneg p q) (norm_gramMatrix_apply_le p q)
  · rcases eq_or_ne p 0 with hp | hp
    · have : mu p q = 0 := by
        simp [mu, discr, hp]
      rw [this]
      exact norm_nonneg _
    · have hpn : 0 < ‖p‖ := norm_pos_iff.2 hp
      have h1 : mu p q * ‖p‖ ≤ opNorm (gramMatrix p q) * ‖p‖ := by
        rw [← norm_gramMatrix_apply_self p q]
        exact (Matrix.toEuclideanCLM (𝕜 := ℝ) (gramMatrix p q)).le_opNorm p
      exact le_of_mul_le_mul_right h1 hpn

/-- Combining G1 and G2: `‖G‖_HS = √2 ‖G‖_op`. -/
theorem hs_eq_sqrt_two_mul_opNorm (p q : EuclideanSpace ℝ (Fin N)) :
    Real.sqrt (∑ i, ∑ j, (gramMatrix p q i j) ^ 2) = Real.sqrt 2 * opNorm (gramMatrix p q) := by
  rw [sum_sq_gramMatrix_eq_two_mul_mu_sq, opNorm_gramMatrix, Real.sqrt_mul (by norm_num),
    Real.sqrt_sq (mu_nonneg p q)]

/-! ### G3: Volterra half-mass for antisymmetric matrices -/

/-- **G3**: for an antisymmetric matrix, the strict lower triangle carries half the mass. -/
theorem sum_sq_strict_lower_of_antisymm (A : Matrix (Fin N) (Fin N) ℝ) (hA : A.transpose = -A) :
    ∑ i, ∑ j ∈ Finset.Iio i, (A i j) ^ 2 = (1 / 2) * ∑ i, ∑ j, (A i j) ^ 2 := by
  have hsymm : ∀ i j, (A i j) ^ 2 = (A j i) ^ 2 := by
    intro i j
    have : A j i = -A i j := by
      have := congrFun (congrFun hA i) j
      simpa [Matrix.transpose_apply] using this
    rw [this]; ring
  have hdiag : ∀ i, (A i i) ^ 2 = 0 := by
    intro i
    have : A i i = -A i i := by
      have := congrFun (congrFun hA i) i
      simpa [Matrix.transpose_apply] using this
    have : A i i = 0 := by linarith
    rw [this]; ring
  have hsplit : ∀ i : Fin N, ∑ j, (A i j) ^ 2
      = ∑ j ∈ Finset.Iio i, (A i j) ^ 2 + ∑ j ∈ Finset.Ioi i, (A i j) ^ 2 := by
    intro i
    rw [← Finset.sum_add_sum_compl {i} (fun j => (A i j) ^ 2),
      ← Finset.Ioi_disjUnion_Iio i, Finset.sum_disjUnion]
    simp [hdiag i]
    ring
  have hswap : ∑ i, ∑ j ∈ Finset.Ioi i, (A i j) ^ 2 = ∑ i, ∑ j ∈ Finset.Iio i, (A i j) ^ 2 := by
    have h1 : ∑ i, ∑ j ∈ Finset.Iio i, (A i j) ^ 2
        = ∑ j, ∑ i ∈ Finset.Ioi j, (A i j) ^ 2 := by
      apply Finset.sum_comm'
      intro x y
      simp [Finset.mem_Iio, Finset.mem_Ioi]
    rw [h1]
    exact Finset.sum_congr rfl fun i _ =>
      Finset.sum_congr rfl fun j _ => (hsymm j i).symm
  have : ∑ i, ∑ j, (A i j) ^ 2 = 2 * ∑ i, ∑ j ∈ Finset.Iio i, (A i j) ^ 2 := by
    rw [Finset.sum_congr rfl fun i (_ : i ∈ Finset.univ) => hsplit i, Finset.sum_add_distrib,
      hswap]
    ring
  rw [this]
  ring

lemma gramMatrix_transpose (p q : EuclideanSpace ℝ (Fin N)) :
    (gramMatrix p q).transpose = -gramMatrix p q := by
  ext i j
  simp [gramMatrix, Matrix.transpose_apply]
  ring

/-! ### G4: the headline identity -/

/-- **G4**: the Hilbert–Schmidt mass of the strict lower (Volterra) triangle equals `μ`,
which equals the Euclidean operator norm of the full kernel. -/
theorem volterra_hs_eq_mu (p q : EuclideanSpace ℝ (Fin N)) :
    Real.sqrt (∑ i, ∑ j ∈ Finset.Iio i, (gramMatrix p q i j) ^ 2) = mu p q := by
  rw [sum_sq_strict_lower_of_antisymm _ (gramMatrix_transpose p q),
    sum_sq_gramMatrix_eq_two_mul_mu_sq]
  rw [show (1 / 2 : ℝ) * (2 * mu p q ^ 2) = mu p q ^ 2 by ring]
  exact Real.sqrt_sq (mu_nonneg p q)

/-- **G4**: `‖V‖_HS = ‖G‖_op`. -/
theorem volterra_hs_eq_opNorm (p q : EuclideanSpace ℝ (Fin N)) :
    Real.sqrt (∑ i, ∑ j ∈ Finset.Iio i, (gramMatrix p q i j) ^ 2) = opNorm (gramMatrix p q) := by
  rw [volterra_hs_eq_mu, opNorm_gramMatrix]

/-! ### G5: the shear instantiation -/

/-- **G5**: the discrete shear-Gram kernel `φ i φ j sinh (a (u j - u i))` is exactly the
rank-two kernel built from `p i = φ i cosh (a u i)` and `q i = φ i sinh (a u i)`. -/
theorem gramMatrix_shear (a : ℝ) (phi u : Fin N → ℝ) (p q : EuclideanSpace ℝ (Fin N))
    (hp : ∀ i, p i = phi i * Real.cosh (a * u i))
    (hq : ∀ i, q i = phi i * Real.sinh (a * u i)) (i j : Fin N) :
    gramMatrix p q i j = phi i * phi j * Real.sinh (a * (u j - u i)) := by
  rw [show a * (u j - u i) = a * u j - a * u i by ring, Real.sinh_sub]
  simp only [gramMatrix, Matrix.of_apply, hp, hq]
  ring

/-- **G5 + G4**: for the discrete shear kernel `K i j = φ i φ j sinh (a (u j - u i))`, the
Hilbert–Schmidt mass of its strict lower triangle equals the Euclidean operator norm of the
full kernel, and both equal `μ`. -/
theorem shear_volterra_hs_eq_opNorm (a : ℝ) (phi u : Fin N → ℝ) (p q : EuclideanSpace ℝ (Fin N))
    (hp : ∀ i, p i = phi i * Real.cosh (a * u i))
    (hq : ∀ i, q i = phi i * Real.sinh (a * u i)) :
    Real.sqrt (∑ i, ∑ j ∈ Finset.Iio i, (phi i * phi j * Real.sinh (a * (u j - u i))) ^ 2)
      = opNorm (gramMatrix p q) := by
  rw [← volterra_hs_eq_opNorm p q]
  congr 1
  exact Finset.sum_congr rfl fun i _ => Finset.sum_congr rfl fun j _ => by
    rw [gramMatrix_shear a phi u p q hp hq i j]

end ShearGram
