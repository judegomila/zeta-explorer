/-
Eq48Hadamard.lean  (2026-11-16, slug b-lean-eq48)

Finite algebra behind Theorem 1 / eq. (1.7) of tmp/research-2026-11-16/eq48/RESULT.md and the
direction "RH => (b)" of Theorem 3, on top of `Eq48Pick`.

* `pair_identity`, `pair_identity'` : the Pick pair formula (RESULT.md §6, "(1.6)").
* `finite_zero_sum_identity` : for a FINITE family of zeros `rho_k`, with
  `L_R(z) = sum_k 2 z / (z^2 - rho_k^2)`,
  `sum_ij b_i conj(b_j) (L_R(x_i) + L_R(x_j)) / (x_i + x_j)
     = sum_k [ V(rho_k) conj V(-conj rho_k) + V(-rho_k) conj V(conj rho_k) ]`.
* `finite_zero_sum_on_line` : if all `Re rho_k = 0` the right side is a sum of squared norms.
* `pick_lineTerm_posSemidef`, `fullClass_of_hadamard_on_line` : if `L` is the pointwise limit of
  partial sums `sum_{k<N} 2 x / (x^2 + gamma_k^2)` with REAL `gamma_k` (hypothesis
  `HadamardOnLine`: Hadamard pairing + all zeros on the line), then every Pick matrix is PSD.

No Euler product enters; the hypothesis `HadamardOnLine` is where the location of zeros enters.
-/
import Mathlib
import Eq48Pick

open Matrix Filter Topology Finset
open scoped ComplexConjugate

namespace Eq48

/-- Pick pair formula: for `f(z) = 2z/(z^2 - rho^2)`,
`(f(x)+f(y))/(x+y) = 1/((x+rho)(y-rho)) + 1/((x-rho)(y+rho))`. -/
theorem pair_identity {x y ρ : ℂ} (hxy : x + y ≠ 0) (hx1 : x + ρ ≠ 0) (hx2 : x - ρ ≠ 0)
    (hy1 : y + ρ ≠ 0) (hy2 : y - ρ ≠ 0) :
    (2 * x / (x ^ 2 - ρ ^ 2) + 2 * y / (y ^ 2 - ρ ^ 2)) / (x + y) =
      1 / ((x + ρ) * (y - ρ)) + 1 / ((x - ρ) * (y + ρ)) := by
  have h1 : x ^ 2 - ρ ^ 2 ≠ 0 := by
    have : x ^ 2 - ρ ^ 2 = (x + ρ) * (x - ρ) := by ring
    rw [this]; exact mul_ne_zero hx1 hx2
  have h2 : y ^ 2 - ρ ^ 2 ≠ 0 := by
    have : y ^ 2 - ρ ^ 2 = (y + ρ) * (y - ρ) := by ring
    rw [this]; exact mul_ne_zero hy1 hy2
  field_simp
  ring

/-- Second form: `(f(x)+f(y))/(x+y) = 2 (xy - rho^2) / ((x^2-rho^2)(y^2-rho^2))`. -/
theorem pair_identity' {x y ρ : ℂ} (hxy : x + y ≠ 0) (hx : x ^ 2 - ρ ^ 2 ≠ 0)
    (hy : y ^ 2 - ρ ^ 2 ≠ 0) :
    (2 * x / (x ^ 2 - ρ ^ 2) + 2 * y / (y ^ 2 - ρ ^ 2)) / (x + y) =
      2 * (x * y - ρ ^ 2) / ((x ^ 2 - ρ ^ 2) * (y ^ 2 - ρ ^ 2)) := by
  field_simp
  ring

section finite
variable {ι κ : Type*} [Fintype ι] [Fintype κ]

/-- Finite Hadamard partial sum `L_R(z) = sum_k 2z/(z^2 - rho_k^2)`. -/
noncomputable def LR (ρ : κ → ℂ) (z : ℂ) : ℂ := ∑ k, 2 * z / (z ^ 2 - ρ k ^ 2)

/-- Laplace transform of the exponential test: `V(z) = sum_i b_i / (z + x_i)`. -/
noncomputable def V (b : ι → ℂ) (x : ι → ℝ) (z : ℂ) : ℂ := ∑ i, b i / (z + x i)

lemma conj_V (b : ι → ℂ) (x : ι → ℝ) (z : ℂ) :
    conj (V b x z) = ∑ j, conj (b j) / (conj z + x j) := by
  simp [V, map_sum, map_div₀]

/-- **Finite form of eq. (1.7).**  The Pick form of a finite Hadamard partial sum is the finite
zero sum `sum_k [ V(rho_k) conj V(-conj rho_k) + V(-rho_k) conj V(conj rho_k) ]`.
Hypothesis `hne`: no node is `± rho_k`; `hxy`: `x_i + x_j ≠ 0`. -/
theorem finite_zero_sum_identity (ρ : κ → ℂ) (b : ι → ℂ) (x : ι → ℝ)
    (hxy : ∀ i j, (x i : ℂ) + x j ≠ 0)
    (hne1 : ∀ i k, (x i : ℂ) + ρ k ≠ 0) (hne2 : ∀ i k, (x i : ℂ) - ρ k ≠ 0) :
    ∑ i, ∑ j, b i * conj (b j) * ((LR ρ (x i) + LR ρ (x j)) / ((x i : ℂ) + x j)) =
      ∑ k, (V b x (ρ k) * conj (V b x (-conj (ρ k))) +
        V b x (-ρ k) * conj (V b x (conj (ρ k)))) := by
  have hpair : ∀ i j, (LR ρ (x i) + LR ρ (x j)) / ((x i : ℂ) + x j) =
      ∑ k, (1 / (((x i : ℂ) + ρ k) * ((x j : ℂ) - ρ k)) +
        1 / (((x i : ℂ) - ρ k) * ((x j : ℂ) + ρ k))) := by
    intro i j
    simp only [LR]
    rw [← Finset.sum_add_distrib, Finset.sum_div]
    refine Finset.sum_congr rfl fun k _ => ?_
    exact pair_identity (hxy i j) (hne1 i k) (hne2 i k) (hne1 j k) (hne2 j k)
  have hrhs : ∀ k, V b x (ρ k) * conj (V b x (-conj (ρ k))) +
        V b x (-ρ k) * conj (V b x (conj (ρ k))) =
      ∑ i, ∑ j, b i * conj (b j) * (1 / (((x i : ℂ) + ρ k) * ((x j : ℂ) - ρ k)) +
        1 / (((x i : ℂ) - ρ k) * ((x j : ℂ) + ρ k))) := by
    intro k
    rw [conj_V, conj_V]
    simp only [V, map_neg, Complex.conj_conj, Finset.sum_mul_sum]
    rw [← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl fun i _ => ?_
    rw [← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl fun j _ => ?_
    have e1 : ρ k + (x i : ℂ) = (x i : ℂ) + ρ k := add_comm _ _
    have e2 : -ρ k + (x j : ℂ) = (x j : ℂ) - ρ k := by ring
    have e3 : -ρ k + (x i : ℂ) = (x i : ℂ) - ρ k := by ring
    have e4 : ρ k + (x j : ℂ) = (x j : ℂ) + ρ k := add_comm _ _
    rw [e1, e2, e3, e4]
    have := hne1 i k; have := hne2 i k; have := hne1 j k; have := hne2 j k
    field_simp
    ring
  simp only [hpair, hrhs]
  rw [Finset.sum_comm (s := (Finset.univ : Finset κ))]
  refine Finset.sum_congr rfl fun i _ => ?_
  rw [Finset.sum_comm (s := (Finset.univ : Finset κ))]
  refine Finset.sum_congr rfl fun j _ => ?_
  rw [Finset.mul_sum]

/-- On the line (`Re rho_k = 0`, so `-conj rho_k = rho_k`) the finite zero sum is a sum of
squared norms; in particular the Pick form is a nonnegative real. -/
theorem finite_zero_sum_on_line (ρ : κ → ℂ) (hρ : ∀ k, (ρ k).re = 0) (b : ι → ℂ) (x : ι → ℝ)
    (hxy : ∀ i j, (x i : ℂ) + x j ≠ 0)
    (hne1 : ∀ i k, (x i : ℂ) + ρ k ≠ 0) (hne2 : ∀ i k, (x i : ℂ) - ρ k ≠ 0) :
    ∑ i, ∑ j, b i * conj (b j) * ((LR ρ (x i) + LR ρ (x j)) / ((x i : ℂ) + x j)) =
      ((∑ k, (‖V b x (ρ k)‖ ^ 2 + ‖V b x (-ρ k)‖ ^ 2) : ℝ) : ℂ) := by
  rw [finite_zero_sum_identity ρ b x hxy hne1 hne2]
  have hc : ∀ k, conj (ρ k) = -ρ k := by
    intro k
    apply Complex.ext <;> simp [hρ k]
  push_cast
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [hc k, neg_neg, Complex.mul_conj, Complex.mul_conj, Complex.normSq_eq_norm_sq,
    Complex.normSq_eq_norm_sq]
  push_cast
  ring

end finite

/-! ## Real form on the line and passage to the limit -/

section line
variable {ι : Type*}

/-- One on-line zero pair `± i gamma` contributes `2x/(x^2 + gamma^2)` to `L`. -/
noncomputable def lineTerm (γ : ℝ) (x : ℝ) : ℝ := 2 * x / (x ^ 2 + γ ^ 2)

/-- The Pick matrix of one on-line term is `2 (u u^T + w w^T)`, hence PSD. -/
theorem pick_lineTerm_posSemidef [Fintype ι] (γ : ℝ) (x : ι → ℝ) (hx : ∀ i, 0 < x i) :
    (pick (lineTerm γ) x).PosSemidef := by
  refine ⟨pick_isHermitian _ _, fun v => ?_⟩
  have hd : ∀ i, x i ^ 2 + γ ^ 2 ≠ 0 := fun i => by have := hx i; positivity
  have key : ∀ i j, pick (lineTerm γ) x i j =
      2 * ((x i / (x i ^ 2 + γ ^ 2)) * (x j / (x j ^ 2 + γ ^ 2)) +
        (γ / (x i ^ 2 + γ ^ 2)) * (γ / (x j ^ 2 + γ ^ 2))) := by
    intro i j
    have h1 := hd i; have h2 := hd j
    have h3 : x i + x j ≠ 0 := (add_pos (hx i) (hx j)).ne'
    simp only [pick_apply, lineTerm]
    field_simp
    ring
  have : star v ⬝ᵥ (pick (lineTerm γ) x *ᵥ v) =
      2 * ((∑ i, v i * (x i / (x i ^ 2 + γ ^ 2))) ^ 2 +
        (∑ i, v i * (γ / (x i ^ 2 + γ ^ 2))) ^ 2) := by
    simp only [dotProduct, mulVec, star_trivial, key]
    rw [sq (∑ i, v i * (x i / (x i ^ 2 + γ ^ 2))), sq (∑ i, v i * (γ / (x i ^ 2 + γ ^ 2))),
      Finset.sum_mul_sum, Finset.sum_mul_sum, ← Finset.sum_add_distrib,
      Finset.mul_sum]
    refine Finset.sum_congr rfl fun i _ => ?_
    rw [← Finset.sum_add_distrib, Finset.mul_sum, Finset.mul_sum]
    refine Finset.sum_congr rfl fun j _ => ?_
    ring
  rw [this]
  positivity

lemma pick_zero (x : ι → ℝ) : pick (fun _ => (0 : ℝ)) x = 0 := by
  ext i j; simp

lemma pick_add (L₁ L₂ : ℝ → ℝ) (x : ι → ℝ) :
    pick (fun y => L₁ y + L₂ y) x = pick L₁ x + pick L₂ x := by
  ext i j
  simp only [pick_apply, Matrix.add_apply]
  ring

/-- Finite sums of on-line terms have PSD Pick matrices. -/
theorem pick_lineSum_posSemidef [Fintype ι] (γ : ℕ → ℝ) (x : ι → ℝ) (hx : ∀ i, 0 < x i)
    (N : ℕ) :
    (pick (fun y => ∑ k ∈ Finset.range N, lineTerm (γ k) y) x).PosSemidef := by
  induction N with
  | zero => simpa [pick_zero] using (PosSemidef.zero : (0 : Matrix ι ι ℝ).PosSemidef)
  | succ N ih =>
    simp only [Finset.sum_range_succ]
    rw [pick_add]
    exact ih.add (pick_lineTerm_posSemidef (γ N) x hx)

/-- **Hypothesis (Hadamard pairing with all zeros on the line).**  `L` is, on `D`, the pointwise
limit of the partial sums `sum_{k<N} 2x/(x^2 + gamma_k^2)` with real ordinates `gamma_k`
(repetitions encode multiplicity).  For `L = xi'/xi(1/2 + .)` this is the Hadamard product
(CLASSICAL) together with RH (OPEN). -/
def HadamardOnLine (L : ℝ → ℝ) (D : Set ℝ) (γ : ℕ → ℝ) : Prop :=
  ∀ x ∈ D, Tendsto (fun N => ∑ k ∈ Finset.range N, lineTerm (γ k) x) atTop (𝓝 (L x))

/-- **RH-shaped hypothesis => (b).**  Under `HadamardOnLine`, every Pick matrix at nodes in
`D ⊆ (0,∞)` is positive semidefinite. -/
theorem fullClass_of_hadamardOnLine {L : ℝ → ℝ} {D : Set ℝ} (hpos : ∀ x ∈ D, 0 < x)
    {γ : ℕ → ℝ} (hH : HadamardOnLine L D γ) : FullClass L D := by
  intro n x hx
  refine ⟨pick_isHermitian _ _, fun v => ?_⟩
  have hx0 : ∀ i, 0 < x i := fun i => hpos _ (hx.1 i)
  have hlim : Tendsto (fun N => star v ⬝ᵥ
      (pick (fun y => ∑ k ∈ Finset.range N, lineTerm (γ k) y) x *ᵥ v)) atTop
      (𝓝 (star v ⬝ᵥ (pick L x *ᵥ v))) := by
    simp only [dotProduct, mulVec, pick_apply]
    refine tendsto_finset_sum _ fun i _ => ?_
    refine Tendsto.mul tendsto_const_nhds ?_
    refine tendsto_finset_sum _ fun j _ => ?_
    refine Tendsto.mul ?_ tendsto_const_nhds
    exact Tendsto.div_const ((hH _ (hx.1 i)).add (hH _ (hx.1 j))) _
  exact ge_of_tendsto' hlim fun N => (pick_lineSum_posSemidef γ x hx0 N).2 v

/-- Consequence: under `HadamardOnLine` the residual target (a) holds. -/
theorem residualTarget_of_hadamardOnLine {L : ℝ → ℝ} {D : Set ℝ} (hpos : ∀ x ∈ D, 0 < x)
    {γ : ℕ → ℝ} (hH : HadamardOnLine L D γ) : ResidualTarget L D :=
  residualTarget_of_fullClass (fullClass_of_hadamardOnLine hpos hH)

end line

/-! ## Complex coefficients -/

/-- A real PSD matrix gives a nonnegative Hermitian form on complex coefficient vectors:
`sum_ij b_i conj(b_j) P_ij = (Re b)^T P (Re b) + (Im b)^T P (Im b)`.
("Complex `b` is allowed because `P_S` is real symmetric", RESULT.md §3.) -/
theorem complex_form_eq {ι : Type*} [Fintype ι] {P : Matrix ι ι ℝ} (hP : P.IsHermitian)
    (b : ι → ℂ) :
    ∑ i, ∑ j, b i * conj (b j) * (P i j : ℂ) =
      (((fun i => (b i).re) ⬝ᵥ (P *ᵥ fun i => (b i).re) +
        (fun i => (b i).im) ⬝ᵥ (P *ᵥ fun i => (b i).im) : ℝ) : ℂ) := by
  have hsym : ∀ i j, P i j = P j i := fun i j => by
    have := congrFun (congrFun hP j) i
    simpa [conjTranspose_apply] using this
  apply Complex.ext
  · simp only [Complex.re_sum, Complex.ofReal_re, dotProduct, mulVec, Finset.mul_sum]
    rw [← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl fun i _ => ?_
    rw [← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl fun j _ => ?_
    simp only [Complex.mul_im, Complex.mul_re, Complex.conj_re, Complex.conj_im,
      Complex.ofReal_re, Complex.ofReal_im]
    ring
  · simp only [Complex.im_sum, Complex.ofReal_im]
    have h1 : ∀ i j, (b i * conj (b j) * (P i j : ℂ)).im =
        ((b i).im * (b j).re - (b i).re * (b j).im) * P i j := by
      intro i j
      simp only [Complex.mul_im, Complex.mul_re, Complex.conj_re, Complex.conj_im,
        Complex.ofReal_re, Complex.ofReal_im]
      ring
    simp only [h1]
    have h2 : ∑ i, ∑ j, ((b i).im * (b j).re - (b i).re * (b j).im) * P i j =
        -∑ i, ∑ j, ((b i).im * (b j).re - (b i).re * (b j).im) * P i j := by
      conv_rhs => rw [Finset.sum_comm]
      rw [← Finset.sum_neg_distrib]
      refine Finset.sum_congr rfl fun i _ => ?_
      rw [← Finset.sum_neg_distrib]
      refine Finset.sum_congr rfl fun j _ => ?_
      rw [hsym j i]; ring
    linarith

theorem complex_form_nonneg {ι : Type*} [Fintype ι] {P : Matrix ι ι ℝ} (hP : P.PosSemidef)
    (b : ι → ℂ) :
    ∃ r : ℝ, 0 ≤ r ∧ ∑ i, ∑ j, b i * conj (b j) * (P i j : ℂ) = (r : ℂ) := by
  refine ⟨_, ?_, complex_form_eq hP.1 b⟩
  have h1 := hP.2 (fun i => (b i).re)
  have h2 := hP.2 (fun i => (b i).im)
  simp only [star_trivial] at h1 h2
  linarith

end Eq48
