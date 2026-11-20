import Mathlib

/-!
# Anchor jet matrix of the Pick (bridge) kernel splits into a Stieltjes Hankel pair

Proved copy of `rh-push-anchor-hankel/RequestProject/Main.lean`. The definitions and the seven
theorem statements are unchanged; helper lemmas are added in the namespace `AnchorHankel`.

For a real moment sequence `μ : ℕ → ℝ` put
`H0_K = [μ (i+j)]_{i,j<K}`, `H1_K = [μ (i+j+1)]_{i,j<K}` and let `J_N = [c i j]_{i,j<N}` with
`c i j = 0` for `i + j` odd, `c (2a) (2b) = 2 (-1)^(a+b) μ (a+b)`,
`c (2a+1) (2b+1) = 2 (-1)^(a+b) μ (a+b+1)`.

Claims: `J_N` is positive definite iff `H0_{⌈N/2⌉}` and `H1_{⌊N/2⌋}` are; the same for positive
semidefinite; and the first order at which `J_N` fails to be positive definite is
`min (2 K0 - 1) (2 K1)`, `K0`, `K1` the first orders at which `H0`, `H1` fail.
-/

open Finset BigOperators Matrix

noncomputable section

/-- Jet coefficients of the bridge kernel at the anchor. -/
def jetCoeff (μ : ℕ → ℝ) (i j : ℕ) : ℝ :=
  if i % 2 = 0 ∧ j % 2 = 0 then 2 * (-1 : ℝ) ^ (i / 2 + j / 2) * μ (i / 2 + j / 2)
  else if i % 2 = 1 ∧ j % 2 = 1 then 2 * (-1 : ℝ) ^ (i / 2 + j / 2) * μ (i / 2 + j / 2 + 1)
  else 0

def jetMatrix (μ : ℕ → ℝ) (N : ℕ) : Matrix (Fin N) (Fin N) ℝ :=
  Matrix.of fun i j => jetCoeff μ i j

def hankel0 (μ : ℕ → ℝ) (K : ℕ) : Matrix (Fin K) (Fin K) ℝ :=
  Matrix.of fun i j => μ ((i : ℕ) + (j : ℕ))

def hankel1 (μ : ℕ → ℝ) (K : ℕ) : Matrix (Fin K) (Fin K) ℝ :=
  Matrix.of fun i j => μ ((i : ℕ) + (j : ℕ) + 1)

/-- Pick pair formula for one zero parameter `λ`. -/
theorem pick_pair_identity (x y lam : ℂ) (hx : x ^ 2 + lam ≠ 0) (hy : y ^ 2 + lam ≠ 0)
    (hxy : x + y ≠ 0) :
    (2 * x / (x ^ 2 + lam) + 2 * y / (y ^ 2 + lam)) / (x + y)
      = 2 * (x * y + lam) / ((x ^ 2 + lam) * (y ^ 2 + lam)) := by
  field_simp
  ring

/-- Double power series of the one-`λ` kernel: the coefficients are `jetCoeff` for the moment
sequence `μ k = λ^{-(k+1)}`. -/
theorem pick_pair_expansion (x y lam : ℂ) (hlam : lam ≠ 0)
    (hx : ‖x‖ ^ 2 < ‖lam‖) (hy : ‖y‖ ^ 2 < ‖lam‖) :
    HasSum (fun ab : ℕ × ℕ =>
        2 * (-1 : ℂ) ^ (ab.1 + ab.2) * (lam⁻¹) ^ (ab.1 + ab.2 + 1) * x ^ (2 * ab.1) * y ^ (2 * ab.2)
        + 2 * (-1 : ℂ) ^ (ab.1 + ab.2) * (lam⁻¹) ^ (ab.1 + ab.2 + 2)
            * x ^ (2 * ab.1 + 1) * y ^ (2 * ab.2 + 1))
      (2 * (x * y + lam) / ((x ^ 2 + lam) * (y ^ 2 + lam))) := by
  have hl : 0 < ‖lam‖ := norm_pos_iff.mpr hlam
  have key : ∀ z : ℂ, ‖z‖ ^ 2 < ‖lam‖ → ‖-(z ^ 2 * lam⁻¹)‖ < 1 ∧ z ^ 2 + lam ≠ 0 := by
    intro z hz
    have h1 : ‖-(z ^ 2 * lam⁻¹)‖ < 1 := by
      rw [norm_neg, norm_mul, norm_pow, norm_inv, ← div_eq_mul_inv, div_lt_one hl]
      exact hz
    refine ⟨h1, fun h0 => ?_⟩
    have : -(z ^ 2 * lam⁻¹) = 1 := by
      have : z ^ 2 = -lam := eq_neg_of_add_eq_zero_left h0
      rw [this]; field_simp
    rw [this] at h1
    simp at h1
  obtain ⟨hu, hx0⟩ := key x hx
  obtain ⟨hv, hy0⟩ := key y hy
  have Hu := hasSum_geometric_of_norm_lt_one hu
  have Hv := hasSum_geometric_of_norm_lt_one hv
  have Su : Summable fun n : ℕ => ‖(-(x ^ 2 * lam⁻¹)) ^ n‖ := by
    simpa [norm_pow] using summable_geometric_of_lt_one (norm_nonneg _) hu
  have Sv : Summable fun n : ℕ => ‖(-(y ^ 2 * lam⁻¹)) ^ n‖ := by
    simpa [norm_pow] using summable_geometric_of_lt_one (norm_nonneg _) hv
  have H := (Hu.mul Hv (summable_mul_of_summable_norm Su Sv)).mul_left
    (2 * lam⁻¹ + 2 * lam⁻¹ ^ 2 * x * y)
  have hval : (2 * lam⁻¹ + 2 * lam⁻¹ ^ 2 * x * y) *
      ((1 - -(x ^ 2 * lam⁻¹))⁻¹ * (1 - -(y ^ 2 * lam⁻¹))⁻¹)
      = 2 * (x * y + lam) / ((x ^ 2 + lam) * (y ^ 2 + lam)) := by
    have e1 : (1 - -(x ^ 2 * lam⁻¹)) = (x ^ 2 + lam) * lam⁻¹ := by field_simp; ring
    have e2 : (1 - -(y ^ 2 * lam⁻¹)) = (y ^ 2 + lam) * lam⁻¹ := by field_simp; ring
    rw [e1, e2]
    field_simp
    ring
  rw [hval] at H
  convert H using 1
  funext ab
  have p1 : (-(x ^ 2 * lam⁻¹)) ^ ab.1 = (-1 : ℂ) ^ ab.1 * x ^ (2 * ab.1) * lam⁻¹ ^ ab.1 := by
    rw [neg_eq_neg_one_mul, mul_pow, mul_pow, ← pow_mul]
    ring
  have p2 : (-(y ^ 2 * lam⁻¹)) ^ ab.2 = (-1 : ℂ) ^ ab.2 * y ^ (2 * ab.2) * lam⁻¹ ^ ab.2 := by
    rw [neg_eq_neg_one_mul, mul_pow, mul_pow, ← pow_mul]
    ring
  rw [p1, p2]
  ring

namespace AnchorHankel

/-! ### Entries of the jet matrix -/

lemma jc_ee (μ : ℕ → ℝ) (a b : ℕ) :
    jetCoeff μ (2 * a) (2 * b) = 2 * (-1 : ℝ) ^ (a + b) * μ (a + b) := by
  have h1 : (2 * a) % 2 = 0 := by omega
  have h2 : (2 * b) % 2 = 0 := by omega
  have h3 : (2 * a) / 2 = a := by omega
  have h4 : (2 * b) / 2 = b := by omega
  simp [jetCoeff, h1, h2, h3, h4]

lemma jc_oo (μ : ℕ → ℝ) (a b : ℕ) :
    jetCoeff μ (2 * a + 1) (2 * b + 1) = 2 * (-1 : ℝ) ^ (a + b) * μ (a + b + 1) := by
  have h1 : (2 * a + 1) % 2 = 1 := by omega
  have h2 : (2 * b + 1) % 2 = 1 := by omega
  have h3 : (2 * a + 1) / 2 = a := by omega
  have h4 : (2 * b + 1) / 2 = b := by omega
  simp [jetCoeff, h1, h2, h3, h4]

lemma jc_eo (μ : ℕ → ℝ) (a b : ℕ) : jetCoeff μ (2 * a) (2 * b + 1) = 0 := by
  have h1 : (2 * a) % 2 = 0 := by omega
  have h2 : (2 * b + 1) % 2 = 1 := by omega
  simp [jetCoeff, h1, h2]

lemma jc_oe (μ : ℕ → ℝ) (a b : ℕ) : jetCoeff μ (2 * a + 1) (2 * b) = 0 := by
  have h1 : (2 * a + 1) % 2 = 1 := by omega
  have h2 : (2 * b) % 2 = 0 := by omega
  simp [jetCoeff, h1, h2]

lemma jetCoeff_symm (μ : ℕ → ℝ) (i j : ℕ) : jetCoeff μ i j = jetCoeff μ j i := by
  simp only [jetCoeff, and_comm (a := j % 2 = 0), and_comm (a := j % 2 = 1), add_comm (j / 2)]

lemma jetMatrix_isHermitian (μ : ℕ → ℝ) (N : ℕ) : (jetMatrix μ N).IsHermitian := by
  ext i j
  simp [jetMatrix, jetCoeff_symm μ (j : ℕ) (i : ℕ)]

lemma hankel0_isHermitian (μ : ℕ → ℝ) (K : ℕ) : (hankel0 μ K).IsHermitian := by
  ext i j
  simp [hankel0, add_comm]

lemma hankel1_isHermitian (μ : ℕ → ℝ) (K : ℕ) : (hankel1 μ K).IsHermitian := by
  ext i j
  simp [hankel1, add_comm]

/-! ### The parity bijection `Fin ⌈N/2⌉ ⊕ Fin ⌊N/2⌋ ≃ Fin N` -/

/-- Even indices `2a` from the left summand, odd indices `2b+1` from the right summand. -/
def parityFun (N : ℕ) : Fin ((N + 1) / 2) ⊕ Fin (N / 2) → Fin N :=
  Sum.elim (fun a => ⟨2 * (a : ℕ), by omega⟩) (fun b => ⟨2 * (b : ℕ) + 1, by omega⟩)

lemma parityFun_bijective (N : ℕ) : Function.Bijective (parityFun N) := by
  rw [Fintype.bijective_iff_injective_and_card]
  constructor
  · rintro (a | a) (b | b) h <;>
      simp only [parityFun, Sum.elim_inl, Sum.elim_inr, Fin.mk.injEq] at h
    · exact congrArg _ (Fin.ext (by omega))
    · omega
    · omega
    · exact congrArg _ (Fin.ext (by omega))
  · simp only [Fintype.card_sum, Fintype.card_fin]
    omega

def parityEquiv (N : ℕ) : Fin ((N + 1) / 2) ⊕ Fin (N / 2) ≃ Fin N :=
  Equiv.ofBijective (parityFun N) (parityFun_bijective N)

@[simp] lemma parityEquiv_inl (N : ℕ) (a : Fin ((N + 1) / 2)) :
    ((parityEquiv N (Sum.inl a) : Fin N) : ℕ) = 2 * (a : ℕ) := rfl

@[simp] lemma parityEquiv_inr (N : ℕ) (b : Fin (N / 2)) :
    ((parityEquiv N (Sum.inr b) : Fin N) : ℕ) = 2 * (b : ℕ) + 1 := rfl

/-- Signed even part of a vector. -/
def uPart (N : ℕ) (x : Fin N → ℝ) : Fin ((N + 1) / 2) → ℝ :=
  fun a => (-1 : ℝ) ^ (a : ℕ) * x (parityEquiv N (Sum.inl a))

/-- Signed odd part of a vector. -/
def vPart (N : ℕ) (x : Fin N → ℝ) : Fin (N / 2) → ℝ :=
  fun b => (-1 : ℝ) ^ (b : ℕ) * x (parityEquiv N (Sum.inr b))

/-- The decoupling identity for the quadratic form: `xᵀ J_N x = 2 uᵀ H0 u + 2 vᵀ H1 v`. -/
lemma form_eq (μ : ℕ → ℝ) (N : ℕ) (x : Fin N → ℝ) :
    x ⬝ᵥ (jetMatrix μ N *ᵥ x)
      = 2 * (uPart N x ⬝ᵥ (hankel0 μ ((N + 1) / 2) *ᵥ uPart N x))
        + 2 * (vPart N x ⬝ᵥ (hankel1 μ (N / 2) *ᵥ vPart N x)) := by
  simp only [dotProduct, mulVec, Finset.mul_sum]
  have step : ∀ f : Fin N → Fin N → ℝ, ∑ i, ∑ j, f i j
      = ∑ s, ∑ t, f (parityEquiv N s) (parityEquiv N t) := by
    intro f
    rw [← (parityEquiv N).sum_comp]
    exact Fintype.sum_congr _ _ fun s => ((parityEquiv N).sum_comp _).symm
  rw [step]
  simp only [Fintype.sum_sum_type, jetMatrix, hankel0, hankel1, Matrix.of_apply,
    parityEquiv_inl, parityEquiv_inr, jc_ee, jc_oo, jc_eo, jc_oe, uPart, vPart,
    zero_mul, mul_zero, Finset.sum_const_zero, add_zero, zero_add]
  congr 1
  · exact Fintype.sum_congr _ _ fun a => Fintype.sum_congr _ _ fun b => by
      rw [pow_add]; ring
  · exact Fintype.sum_congr _ _ fun a => Fintype.sum_congr _ _ fun b => by
      rw [pow_add]; ring

/-- Vector with prescribed signed even and odd parts. -/
def glue (N : ℕ) (u : Fin ((N + 1) / 2) → ℝ) (v : Fin (N / 2) → ℝ) : Fin N → ℝ :=
  fun i => Sum.elim (fun a : Fin ((N + 1) / 2) => (-1 : ℝ) ^ (a : ℕ) * u a)
      (fun b : Fin (N / 2) => (-1 : ℝ) ^ (b : ℕ) * v b)
    ((parityEquiv N).symm i)

lemma sign_sq (n : ℕ) (t : ℝ) : (-1 : ℝ) ^ n * ((-1 : ℝ) ^ n * t) = t := by
  rw [← mul_assoc, ← mul_pow]; simp

lemma uPart_glue (N : ℕ) (u : Fin ((N + 1) / 2) → ℝ) (v : Fin (N / 2) → ℝ) :
    uPart N (glue N u v) = u := by
  funext a
  simp [uPart, glue, sign_sq]

lemma vPart_glue (N : ℕ) (u : Fin ((N + 1) / 2) → ℝ) (v : Fin (N / 2) → ℝ) :
    vPart N (glue N u v) = v := by
  funext b
  simp [vPart, glue, sign_sq]

lemma uPart_zero (N : ℕ) : uPart N 0 = 0 := by funext a; simp [uPart]
lemma vPart_zero (N : ℕ) : vPart N 0 = 0 := by funext b; simp [vPart]

lemma eq_zero_of_parts (N : ℕ) (x : Fin N → ℝ) (hu : uPart N x = 0) (hv : vPart N x = 0) :
    x = 0 := by
  funext i
  obtain ⟨s, rfl⟩ := (parityEquiv N).surjective i
  rcases s with a | b
  · have := congrFun hu a
    simpa [uPart] using this
  · have := congrFun hv b
    simpa [vPart] using this

lemma posDef_iff_real {n : Type*} [Fintype n] (M : Matrix n n ℝ) :
    M.PosDef ↔ M.IsHermitian ∧ ∀ x : n → ℝ, x ≠ 0 → 0 < x ⬝ᵥ (M *ᵥ x) := by
  rw [Matrix.posDef_iff_dotProduct_mulVec]
  simp

lemma posSemidef_iff_real {n : Type*} [Fintype n] (M : Matrix n n ℝ) :
    M.PosSemidef ↔ M.IsHermitian ∧ ∀ x : n → ℝ, 0 ≤ x ⬝ᵥ (M *ᵥ x) := by
  rw [Matrix.posSemidef_iff_dotProduct_mulVec]
  simp

end AnchorHankel

open AnchorHankel

/-- Decoupling, positive definite form. -/
theorem jetMatrix_posDef_iff (μ : ℕ → ℝ) (N : ℕ) :
    (jetMatrix μ N).PosDef ↔ (hankel0 μ ((N + 1) / 2)).PosDef ∧ (hankel1 μ (N / 2)).PosDef := by
  simp only [posDef_iff_real]
  constructor
  · rintro ⟨-, h⟩
    refine ⟨⟨hankel0_isHermitian μ _, fun u hu => ?_⟩, ⟨hankel1_isHermitian μ _, fun v hv => ?_⟩⟩
    · have hne : glue N u 0 ≠ 0 := fun h0 => hu (by rw [← uPart_glue N u 0, h0, uPart_zero])
      have := h _ hne
      rw [form_eq, uPart_glue, vPart_glue] at this
      simp only [zero_dotProduct, mul_zero, add_zero] at this
      linarith
    · have hne : glue N 0 v ≠ 0 := fun h0 => hv (by rw [← vPart_glue N 0 v, h0, vPart_zero])
      have := h _ hne
      rw [form_eq, uPart_glue, vPart_glue] at this
      simp only [zero_dotProduct, mul_zero, zero_add] at this
      linarith
  · rintro ⟨⟨-, h0⟩, ⟨-, h1⟩⟩
    refine ⟨jetMatrix_isHermitian μ N, fun x hx => ?_⟩
    rw [form_eq]
    have nn0 : 0 ≤ uPart N x ⬝ᵥ (hankel0 μ ((N + 1) / 2) *ᵥ uPart N x) := by
      by_cases hu : uPart N x = 0
      · simp [hu]
      · exact (h0 _ hu).le
    have nn1 : 0 ≤ vPart N x ⬝ᵥ (hankel1 μ (N / 2) *ᵥ vPart N x) := by
      by_cases hv : vPart N x = 0
      · simp [hv]
      · exact (h1 _ hv).le
    by_cases hu : uPart N x = 0
    · have hv : vPart N x ≠ 0 := fun hv => hx (eq_zero_of_parts N x hu hv)
      have := h1 _ hv
      linarith
    · have := h0 _ hu
      linarith

/-- Decoupling, positive semidefinite form. -/
theorem jetMatrix_posSemidef_iff (μ : ℕ → ℝ) (N : ℕ) :
    (jetMatrix μ N).PosSemidef ↔
      (hankel0 μ ((N + 1) / 2)).PosSemidef ∧ (hankel1 μ (N / 2)).PosSemidef := by
  simp only [posSemidef_iff_real]
  constructor
  · rintro ⟨-, h⟩
    refine ⟨⟨hankel0_isHermitian μ _, fun u => ?_⟩, ⟨hankel1_isHermitian μ _, fun v => ?_⟩⟩
    · have := h (glue N u 0)
      rw [form_eq, uPart_glue, vPart_glue] at this
      simp only [zero_dotProduct, mul_zero, add_zero] at this
      linarith
    · have := h (glue N 0 v)
      rw [form_eq, uPart_glue, vPart_glue] at this
      simp only [zero_dotProduct, mul_zero, zero_add] at this
      linarith
  · rintro ⟨⟨-, h0⟩, ⟨-, h1⟩⟩
    refine ⟨jetMatrix_isHermitian μ N, fun x => ?_⟩
    rw [form_eq]
    have := h0 (uPart N x)
    have := h1 (vPart N x)
    linarith

/-- First-failure rule `N* = min (2 K0 - 1) (2 K1)`. -/
theorem jetMatrix_first_failure (μ : ℕ → ℝ) (K0 K1 : ℕ)
    (h0 : ¬ (hankel0 μ K0).PosDef) (h0' : ∀ k < K0, (hankel0 μ k).PosDef)
    (h1 : ¬ (hankel1 μ K1).PosDef) (h1' : ∀ k < K1, (hankel1 μ k).PosDef) :
    ¬ (jetMatrix μ (min (2 * K0 - 1) (2 * K1))).PosDef ∧
      ∀ N < min (2 * K0 - 1) (2 * K1), (jetMatrix μ N).PosDef := by
  have hK0 : 0 < K0 := by
    rcases Nat.eq_zero_or_pos K0 with h | h
    · subst h
      exact absurd ((posDef_iff_real _).2 ⟨hankel0_isHermitian μ 0,
        fun x hx => absurd (Subsingleton.elim x 0) hx⟩) h0
    · exact h
  constructor
  · rw [jetMatrix_posDef_iff]
    rintro ⟨a, b⟩
    rcases le_total (2 * K0 - 1) (2 * K1) with h | h
    · rw [min_eq_left h] at a
      have : (2 * K0 - 1 + 1) / 2 = K0 := by omega
      rw [this] at a
      exact h0 a
    · rw [min_eq_right h] at b
      have : (2 * K1) / 2 = K1 := by omega
      rw [this] at b
      exact h1 b
  · intro N hN
    rw [jetMatrix_posDef_iff]
    have := lt_min_iff.mp hN
    exact ⟨h0' _ (by omega), h1' _ (by omega)⟩

/-- First-failure rule when only the `H0` ladder fails. -/
theorem jetMatrix_first_failure_H0_only (μ : ℕ → ℝ) (K0 : ℕ)
    (h0 : ¬ (hankel0 μ K0).PosDef) (h0' : ∀ k < K0, (hankel0 μ k).PosDef)
    (h1 : ∀ k, (hankel1 μ k).PosDef) :
    ¬ (jetMatrix μ (2 * K0 - 1)).PosDef ∧ ∀ N < 2 * K0 - 1, (jetMatrix μ N).PosDef := by
  have hK0 : 0 < K0 := by
    rcases Nat.eq_zero_or_pos K0 with h | h
    · subst h
      exact absurd ((posDef_iff_real _).2 ⟨hankel0_isHermitian μ 0,
        fun x hx => absurd (Subsingleton.elim x 0) hx⟩) h0
    · exact h
  constructor
  · rw [jetMatrix_posDef_iff]
    rintro ⟨a, -⟩
    have : (2 * K0 - 1 + 1) / 2 = K0 := by omega
    rw [this] at a
    exact h0 a
  · intro N hN
    rw [jetMatrix_posDef_iff]
    exact ⟨h0' _ (by omega), h1 _⟩

/-- First-failure rule when only the `H1` ladder fails. -/
theorem jetMatrix_first_failure_H1_only (μ : ℕ → ℝ) (K1 : ℕ)
    (h0 : ∀ k, (hankel0 μ k).PosDef)
    (h1 : ¬ (hankel1 μ K1).PosDef) (h1' : ∀ k < K1, (hankel1 μ k).PosDef) :
    ¬ (jetMatrix μ (2 * K1)).PosDef ∧ ∀ N < 2 * K1, (jetMatrix μ N).PosDef := by
  constructor
  · rw [jetMatrix_posDef_iff]
    rintro ⟨-, b⟩
    have : (2 * K1) / 2 = K1 := by omega
    rw [this] at b
    exact h1 b
  · intro N hN
    rw [jetMatrix_posDef_iff]
    exact ⟨h0 _, h1' _ (by omega)⟩

end

#print axioms pick_pair_identity
#print axioms pick_pair_expansion
#print axioms jetMatrix_posDef_iff
#print axioms jetMatrix_posSemidef_iff
#print axioms jetMatrix_first_failure
#print axioms jetMatrix_first_failure_H0_only
#print axioms jetMatrix_first_failure_H1_only
