import Mathlib

/-!
# Part 1: negative indices, Sylvester's law of inertia, and compression monotonicity

This file formalizes the unconditional linear-algebra content of Part 1 of
`frozen-rung-pt-equivalence.tex`:

* `FrozenRung.negIndex` — the negative index `ind₋(M)` of a Hermitian matrix, defined
  (equivalently to the eigenvalue count, see `FrozenRung.negIndex_diagonal`) as the maximal
  dimension of a subspace on which the associated Hermitian form is negative definite;
* `FrozenRung.negIndex_fromBlocks_schur` — Proposition 2.6 (Sylvester–Schur inertia identity):
  `ind₋(Q) = ind₋(C) + ind₋(Q_eff)` for `Q = [[A, B], [Bᴴ, C]]` with `C` invertible and
  `Q_eff = A - B C⁻¹ Bᴴ` the Schur complement (the "frozen effective form");
* `FrozenRung.negIndex_schur_of_posDef` — the passive case `C ≻ 0`, where freezing preserves
  the negative index exactly;
* `FrozenRung.negSquares` — Definition 2.5, the number of negative squares `sq₋(K)` of a
  Hermitian kernel;
* `FrozenRung.negIndex_gram_le_negSquares` and `FrozenRung.negIndex_compress_le_negSquares` —
  Proposition 2.7 (compression monotonicity).
-/

namespace FrozenRung

open Matrix Module
open scoped ComplexOrder

variable {m n k : Type*} [Fintype m] [Fintype n] [Fintype k]

/-! ## The negative index of a Hermitian form -/

/-- The (real) Hermitian form associated with a matrix: `x ↦ Re (xᴴ M x)`. -/
noncomputable def qform (M : Matrix n n ℂ) (x : n → ℂ) : ℝ :=
  (star x ⬝ᵥ M *ᵥ x).re

/-- A subspace on which the Hermitian form of `M` is negative definite. -/
def IsNegDefOn (M : Matrix n n ℂ) (V : Submodule ℂ (n → ℂ)) : Prop :=
  ∀ x ∈ V, x ≠ 0 → qform M x < 0

/-- A subspace on which the Hermitian form of `M` is nonnegative. -/
def IsNonnegOn (M : Matrix n n ℂ) (W : Submodule ℂ (n → ℂ)) : Prop :=
  ∀ x ∈ W, 0 ≤ qform M x

/-- The set of dimensions of negative-definite subspaces for `M`. -/
def negDims (M : Matrix n n ℂ) : Set ℕ :=
  {d | ∃ V : Submodule ℂ (n → ℂ), finrank ℂ V = d ∧ IsNegDefOn M V}

/-- The negative index `ind₋(M)`: the number of negative eigenvalues of a Hermitian matrix,
defined here as the maximal dimension of a subspace on which the form is negative definite. -/
noncomputable def negIndex (M : Matrix n n ℂ) : ℕ := sSup (negDims M)

theorem negDims_bddAbove (M : Matrix n n ℂ) : BddAbove (negDims M) := by
  refine ⟨finrank ℂ (n → ℂ), ?_⟩
  rintro d ⟨V, rfl, -⟩
  exact Submodule.finrank_le V

theorem zero_mem_negDims (M : Matrix n n ℂ) : 0 ∈ negDims M := by
  refine ⟨⊥, by simp, ?_⟩
  intro x hx hx0
  simp only [Submodule.mem_bot] at hx
  exact absurd hx hx0

theorem le_negIndex {M : Matrix n n ℂ} {V : Submodule ℂ (n → ℂ)} (hV : IsNegDefOn M V) :
    finrank ℂ V ≤ negIndex M :=
  le_csSup (negDims_bddAbove M) ⟨V, rfl, hV⟩

theorem negIndex_le {M : Matrix n n ℂ} {p : ℕ}
    (h : ∀ V : Submodule ℂ (n → ℂ), IsNegDefOn M V → finrank ℂ V ≤ p) : negIndex M ≤ p := by
  refine csSup_le ⟨0, zero_mem_negDims M⟩ ?_
  rintro d ⟨V, rfl, hV⟩
  exact h V hV

theorem exists_negDef_finrank_eq_negIndex (M : Matrix n n ℂ) :
    ∃ V : Submodule ℂ (n → ℂ), finrank ℂ V = negIndex M ∧ IsNegDefOn M V :=
  Nat.sSup_mem ⟨0, zero_mem_negDims M⟩ (negDims_bddAbove M)

/-- A negative-definite subspace and a nonnegative subspace intersect trivially, so their
dimensions add up to at most the ambient dimension. -/
theorem finrank_add_finrank_le_card {M : Matrix n n ℂ} {V W : Submodule ℂ (n → ℂ)}
    (hV : IsNegDefOn M V) (hW : IsNonnegOn M W) :
    finrank ℂ V + finrank ℂ W ≤ Fintype.card n := by
  have hdisj : V ⊓ W = ⊥ := by
    rw [Submodule.eq_bot_iff]
    intro x hx
    by_contra hx0
    exact absurd (hW x hx.2) (not_le.2 (hV x hx.1 hx0))
  have h1 := Submodule.finrank_sup_add_finrank_inf_eq V W
  rw [hdisj] at h1
  simp only [finrank_bot, add_zero] at h1
  have h2 : finrank ℂ ↥(V ⊔ W) ≤ Fintype.card n := by
    simpa using Submodule.finrank_le (V ⊔ W)
  omega

/-- An inertia splitting of `M` at `p`: a `p`-dimensional negative-definite subspace together
with a nonnegative subspace of complementary dimension. -/
def HasInertiaSplit (M : Matrix n n ℂ) (p : ℕ) : Prop :=
  (∃ V : Submodule ℂ (n → ℂ), finrank ℂ V = p ∧ IsNegDefOn M V) ∧
  (∃ W : Submodule ℂ (n → ℂ), finrank ℂ W = Fintype.card n - p ∧ IsNonnegOn M W)

theorem negIndex_eq_of_split {M : Matrix n n ℂ} {p : ℕ} (h : HasInertiaSplit M p) :
    negIndex M = p := by
  obtain ⟨⟨V, hVrank, hV⟩, ⟨W, hWrank, hW⟩⟩ := h
  have hp : p ≤ Fintype.card n := by
    have h2 : finrank ℂ ↥V ≤ Fintype.card n := by simpa using Submodule.finrank_le V
    omega
  refine le_antisymm ?_ (hVrank ▸ le_negIndex hV)
  obtain ⟨V', hV'rank, hV'⟩ := exists_negDef_finrank_eq_negIndex M
  have := finrank_add_finrank_le_card hV' hW
  omega

theorem qform_smul (M : Matrix n n ℂ) (c : ℂ) (x : n → ℂ) :
    qform M (c • x) = ‖c‖ ^ 2 * qform M x := by
  have h : star (c • x) ⬝ᵥ M *ᵥ (c • x) = ((‖c‖ ^ 2 : ℝ) : ℂ) * (star x ⬝ᵥ M *ᵥ x) := by
    rw [Matrix.mulVec_smul, star_smul, smul_dotProduct, dotProduct_smul,
      smul_smul, smul_eq_mul, RCLike.star_def, Complex.conj_mul']
    push_cast
    ring
  unfold qform
  rw [h, Complex.re_ofReal_mul]

/-- A single negative direction already forces the negative index to be at least one. -/
theorem one_le_negIndex_of_qform_neg {M : Matrix n n ℂ} {x : n → ℂ} (hx : x ≠ 0)
    (h : qform M x < 0) : 1 ≤ negIndex M := by
  have hspan : Module.finrank ℂ (Submodule.span ℂ {x}) = 1 := finrank_span_singleton hx
  refine hspan ▸ le_negIndex ?_
  intro y hy hy0
  obtain ⟨c, rfl⟩ := Submodule.mem_span_singleton.1 hy
  have hc : c ≠ 0 := by
    rintro rfl; exact hy0 (by simp)
  rw [qform_smul]
  have : (0:ℝ) < ‖c‖ ^ 2 := by positivity
  nlinarith

/-! ## Congruence and compression -/

theorem qform_conjTranspose_mul_mul (M : Matrix n n ℂ) (L : Matrix n m ℂ) (x : m → ℂ) :
    qform (Lᴴ * M * L) x = qform M (L *ᵥ x) := by
  unfold qform
  congr 1
  have hv : (Lᴴ * M * L) *ᵥ x = Lᴴ *ᵥ (M *ᵥ (L *ᵥ x)) := by
    rw [Matrix.mulVec_mulVec, Matrix.mulVec_mulVec, Matrix.mul_assoc]
  rw [hv, Matrix.dotProduct_mulVec, ← Matrix.star_mulVec]

/-- Compression can never create negative directions: `ind₋(Vᴴ M V) ≤ ind₋(M)`
(Proposition 2.7). -/
theorem negIndex_conjTranspose_mul_mul_le (M : Matrix n n ℂ) (L : Matrix n m ℂ) :
    negIndex (Lᴴ * M * L) ≤ negIndex M := by
  refine negIndex_le fun V hV => ?_
  set f : (m → ℂ) →ₗ[ℂ] (n → ℂ) := Matrix.mulVecLin L with hf
  have hker : LinearMap.ker (f.domRestrict V) = ⊥ := by
    rw [Submodule.eq_bot_iff]
    rintro ⟨x, hx⟩ hx0
    simp only [LinearMap.mem_ker, LinearMap.domRestrict_apply] at hx0
    by_contra hne
    have hx0' : x ≠ 0 := by
      intro h; exact hne (Subtype.ext h)
    have hlt := hV x hx hx0'
    rw [qform_conjTranspose_mul_mul] at hlt
    have hLx : L *ᵥ x = 0 := hx0
    rw [hLx] at hlt
    rw [show qform M 0 = 0 by simp [qform]] at hlt
    exact absurd hlt (lt_irrefl 0)
  have hrange : LinearMap.range (f.domRestrict V) = V.map f := LinearMap.range_domRestrict V f
  have hrk := LinearMap.finrank_range_add_finrank_ker (f.domRestrict V)
  rw [hker, hrange] at hrk
  simp only [finrank_bot, add_zero] at hrk
  refine hrk ▸ le_negIndex (M := M) ?_
  rintro y hy hy0
  obtain ⟨x, hxV, rfl⟩ := hy
  have hx0 : x ≠ 0 := by rintro rfl; simp [hf] at hy0
  have := hV x hxV hx0
  rwa [qform_conjTranspose_mul_mul] at this

theorem hasInertiaSplit_congr [DecidableEq n] {M L : Matrix n n ℂ} {p : ℕ} (hL : IsUnit L.det)
    (h : HasInertiaSplit M p) : HasInertiaSplit (Lᴴ * M * L) p := by
  classical
  set e : (n → ℂ) ≃ₗ[ℂ] (n → ℂ) :=
    { Matrix.mulVecLin L with
      invFun := fun y => L⁻¹ *ᵥ y
      left_inv := by
        intro x
        simp [Matrix.mulVec_mulVec, Matrix.nonsing_inv_mul _ hL]
      right_inv := by
        intro y
        simp [Matrix.mulVec_mulVec, Matrix.mul_nonsing_inv _ hL] } with he
  have hemap : ∀ x, e x = L *ᵥ x := fun x => rfl
  obtain ⟨⟨V, hVrank, hV⟩, ⟨W, hWrank, hW⟩⟩ := h
  constructor
  · refine ⟨V.comap (e : (n → ℂ) →ₗ[ℂ] (n → ℂ)), ?_, ?_⟩
    · rw [Submodule.comap_equiv_eq_map_symm, LinearEquiv.finrank_map_eq, hVrank]
    · intro x hx hx0
      rw [qform_conjTranspose_mul_mul]
      refine hV _ hx ?_
      rw [← hemap]
      exact fun hc => hx0 (by simpa using e.injective (by simpa using hc))
  · refine ⟨W.comap (e : (n → ℂ) →ₗ[ℂ] (n → ℂ)), ?_, ?_⟩
    · rw [Submodule.comap_equiv_eq_map_symm, LinearEquiv.finrank_map_eq, hWrank]
    · intro x hx
      rw [qform_conjTranspose_mul_mul]
      exact hW _ hx

/-! ## The diagonal case and existence of inertia splittings -/

/-- The coordinate subspace `{x : x i = 0 whenever ¬ P i}`. -/
noncomputable def coordSub (P : n → Prop) [DecidablePred P] : Submodule ℂ (n → ℂ) :=
  LinearMap.ker
    (LinearMap.pi fun i : {i // ¬ P i} => LinearMap.proj (R := ℂ) (φ := fun _ : n => ℂ) (i : n))

omit [Fintype n] in
theorem mem_coordSub {P : n → Prop} [DecidablePred P] {x : n → ℂ} :
    x ∈ coordSub P ↔ ∀ i, ¬ P i → x i = 0 := by
  simp [coordSub, LinearMap.mem_ker, funext_iff, Subtype.forall]

theorem finrank_coordSub (P : n → Prop) [DecidablePred P] :
    finrank ℂ (coordSub P) = Fintype.card {i // P i} := by
  set f : (n → ℂ) →ₗ[ℂ] ({i : n // ¬ P i} → ℂ) :=
    LinearMap.pi fun i : {i // ¬ P i} =>
      LinearMap.proj (R := ℂ) (φ := fun _ : n => ℂ) (i : n) with hf
  have hcs : coordSub P = LinearMap.ker f := rfl
  have hsurj : Function.Surjective f := by
    intro y
    refine ⟨fun i => if h : ¬ P i then y ⟨i, h⟩ else 0, ?_⟩
    funext i
    simp [hf, i.2]
  have h1 := LinearMap.finrank_range_add_finrank_ker f
  rw [LinearMap.range_eq_top.2 hsurj] at h1
  have h2 : finrank ℂ (⊤ : Submodule ℂ ({i : n // ¬ P i} → ℂ)) = Fintype.card {i : n // ¬ P i} := by
    simp
  have h3 : finrank ℂ (n → ℂ) = Fintype.card n := by simp
  have h4 := Fintype.card_subtype_compl (fun i : n => P i)
  have h5 := Fintype.card_subtype_le (fun i : n => P i)
  rw [hcs]
  omega

theorem qform_diagonal [DecidableEq n] (d : n → ℝ) (x : n → ℂ) :
    qform (diagonal fun i => (d i : ℂ)) x = ∑ i, d i * ‖x i‖ ^ 2 := by
  rw [qform, dotProduct, Complex.re_sum]
  refine Finset.sum_congr rfl fun i _ => ?_
  rw [mulVec_diagonal]
  have h : ‖x i‖ ^ 2 = (x i).re ^ 2 + (x i).im ^ 2 := by
    rw [Complex.sq_norm, Complex.normSq_apply]; ring
  simp [Pi.star_apply, Complex.mul_re, h]
  ring

theorem hasInertiaSplit_diagonal [DecidableEq n] (d : n → ℝ) :
    HasInertiaSplit (diagonal fun i => (d i : ℂ)) (Fintype.card {i // d i < 0}) := by
  classical
  constructor
  · refine ⟨coordSub (fun i => d i < 0), finrank_coordSub _, ?_⟩
    intro x hx hx0
    rw [qform_diagonal]
    rw [mem_coordSub] at hx
    obtain ⟨i₀, hi₀⟩ : ∃ i, x i ≠ 0 := by
      by_contra hc
      push_neg at hc
      exact hx0 (funext hc)
    have hi₀neg : d i₀ < 0 := by
      by_contra hc
      exact hi₀ (hx i₀ hc)
    have : ∑ i, d i * ‖x i‖ ^ 2 < ∑ _i : n, (0 : ℝ) := by
      refine Finset.sum_lt_sum (fun i _ => ?_) ⟨i₀, Finset.mem_univ _, ?_⟩
      · by_cases hd : d i < 0
        · exact mul_nonpos_of_nonpos_of_nonneg hd.le (by positivity)
        · rw [hx i hd]; simp
      · have : (0:ℝ) < ‖x i₀‖ ^ 2 := by positivity
        exact mul_neg_of_neg_of_pos hi₀neg this
    simpa using this
  · refine ⟨coordSub (fun i => ¬ (d i < 0)), ?_, ?_⟩
    · rw [finrank_coordSub]
      have h4 := Fintype.card_subtype_compl (fun i : n => d i < 0)
      simpa using h4
    · intro x hx
      rw [qform_diagonal]
      rw [mem_coordSub] at hx
      refine Finset.sum_nonneg fun i _ => ?_
      by_cases hd : d i < 0
      · rw [hx i (by simpa using hd)]; simp
      · exact mul_nonneg (not_lt.1 hd) (by positivity)

theorem exists_hasInertiaSplit [DecidableEq n] {M : Matrix n n ℂ} (hM : M.IsHermitian) :
    ∃ p, HasInertiaSplit M p := by
  classical
  set U : Matrix n n ℂ := (hM.eigenvectorUnitary : Matrix n n ℂ) with hU
  have hspec : M = (star U)ᴴ * (diagonal (RCLike.ofReal ∘ hM.eigenvalues)) * (star U) := by
    have := hM.spectral_theorem
    rw [Unitary.conjStarAlgAut_apply] at this
    simpa [hU, Matrix.star_eq_conjTranspose] using this
  have hmul : (star U) * U = 1 := (Unitary.mem_iff.1 hM.eigenvectorUnitary.2).1
  have hUunit : IsUnit (star U).det := by
    refine IsUnit.of_mul_eq_one U.det ?_
    rw [← Matrix.det_mul, hmul, Matrix.det_one]
  refine ⟨Fintype.card {i // hM.eigenvalues i < 0}, ?_⟩
  have := hasInertiaSplit_congr (L := star U) hUunit
    (hasInertiaSplit_diagonal (n := n) hM.eigenvalues)
  have hdiag : (diagonal fun i => ((hM.eigenvalues i : ℝ) : ℂ)) =
      diagonal (RCLike.ofReal ∘ hM.eigenvalues) := rfl
  rw [hdiag, ← hspec] at this
  exact this

theorem negIndex_diagonal [DecidableEq n] (d : n → ℝ) :
    negIndex (diagonal fun i => (d i : ℂ)) = Fintype.card {i // d i < 0} :=
  negIndex_eq_of_split (hasInertiaSplit_diagonal d)

/-- Sylvester's law of inertia: `*`-congruence by an invertible matrix preserves the negative
index. -/
theorem negIndex_congr [DecidableEq n] {M L : Matrix n n ℂ} (hM : M.IsHermitian)
    (hL : IsUnit L.det) : negIndex (Lᴴ * M * L) = negIndex M := by
  obtain ⟨p, hp⟩ := exists_hasInertiaSplit hM
  rw [negIndex_eq_of_split hp, negIndex_eq_of_split (hasInertiaSplit_congr hL hp)]

/-! ## Block-diagonal additivity -/

/-- The product of two submodules is linearly equivalent to the product of their carriers. -/
noncomputable def prodSubEquiv {R M N : Type*} [Ring R] [AddCommGroup M] [Module R M]
    [AddCommGroup N] [Module R N] (P : Submodule R M) (Q : Submodule R N) :
    (P.prod Q) ≃ₗ[R] (P × Q) where
  toFun x := (⟨x.1.1, x.2.1⟩, ⟨x.1.2, x.2.2⟩)
  map_add' _ _ := rfl
  map_smul' _ _ := rfl
  invFun y := ⟨(y.1.1, y.2.1), ⟨y.1.2, y.2.2⟩⟩
  left_inv x := by ext <;> rfl
  right_inv y := by ext <;> rfl

theorem finrank_prod_submodule {R M N : Type*} [Field R] [AddCommGroup M] [Module R M]
    [AddCommGroup N] [Module R N] [FiniteDimensional R M] [FiniteDimensional R N]
    (P : Submodule R M) (Q : Submodule R N) :
    finrank R (P.prod Q) = finrank R P + finrank R Q := by
  rw [(prodSubEquiv P Q).finrank_eq, Module.finrank_prod]

theorem qform_fromBlocks_zero (A : Matrix m m ℂ) (C : Matrix k k ℂ) (x : m → ℂ) (y : k → ℂ) :
    qform (fromBlocks A 0 0 C) (Sum.elim x y) = qform A x + qform C y := by
  unfold qform
  rw [← Complex.add_re]
  congr 1
  simp [dotProduct, Fintype.sum_sum_type, Matrix.mulVec]

/-- Additivity of the negative index over block-diagonal sums. -/
theorem negIndex_fromBlocks_zero [DecidableEq m] [DecidableEq k]
    {A : Matrix m m ℂ} {C : Matrix k k ℂ} (hA : A.IsHermitian) (hC : C.IsHermitian) :
    negIndex (fromBlocks A 0 0 C) = negIndex A + negIndex C := by
  classical
  obtain ⟨p, ⟨VA, hVArank, hVA⟩, ⟨WA, hWArank, hWA⟩⟩ := exists_hasInertiaSplit hA
  obtain ⟨q, ⟨VC, hVCrank, hVC⟩, ⟨WC, hWCrank, hWC⟩⟩ := exists_hasInertiaSplit hC
  have hpA : negIndex A = p := negIndex_eq_of_split ⟨⟨VA, hVArank, hVA⟩, ⟨WA, hWArank, hWA⟩⟩
  have hqC : negIndex C = q := negIndex_eq_of_split ⟨⟨VC, hVCrank, hVC⟩, ⟨WC, hWCrank, hWC⟩⟩
  rw [hpA, hqC]
  refine negIndex_eq_of_split ?_
  set e : (m ⊕ k → ℂ) ≃ₗ[ℂ] (m → ℂ) × (k → ℂ) := LinearEquiv.sumArrowLequivProdArrow m k ℂ ℂ
    with he
  have hcard : Fintype.card (m ⊕ k) = Fintype.card m + Fintype.card k := by simp
  have hpm : p ≤ Fintype.card m := by
    have : finrank ℂ ↥VA ≤ Fintype.card m := by simpa using Submodule.finrank_le VA
    omega
  have hqk : q ≤ Fintype.card k := by
    have : finrank ℂ ↥VC ≤ Fintype.card k := by simpa using Submodule.finrank_le VC
    omega
  have key : ∀ (P : Submodule ℂ (m → ℂ)) (Q : Submodule ℂ (k → ℂ)),
      finrank ℂ ((P.prod Q).comap (e : (m ⊕ k → ℂ) →ₗ[ℂ] (m → ℂ) × (k → ℂ))) =
        finrank ℂ P + finrank ℂ Q := by
    intro P Q
    rw [Submodule.comap_equiv_eq_map_symm, LinearEquiv.finrank_map_eq, finrank_prod_submodule]
  have hmem : ∀ (P : Submodule ℂ (m → ℂ)) (Q : Submodule ℂ (k → ℂ)) (z : m ⊕ k → ℂ),
      z ∈ (P.prod Q).comap (e : (m ⊕ k → ℂ) →ₗ[ℂ] (m → ℂ) × (k → ℂ)) ↔
        (z ∘ Sum.inl) ∈ P ∧ (z ∘ Sum.inr) ∈ Q := by
    intro P Q z
    simp [he, LinearEquiv.sumArrowLequivProdArrow, Equiv.sumArrowEquivProdArrow,
      Submodule.mem_prod, Function.comp_def]
  constructor
  · refine ⟨(VA.prod VC).comap (e : (m ⊕ k → ℂ) →ₗ[ℂ] (m → ℂ) × (k → ℂ)), ?_, ?_⟩
    · rw [key, hVArank, hVCrank]
    · intro z hz hz0
      rw [hmem] at hz
      have hz' : z = Sum.elim (z ∘ Sum.inl) (z ∘ Sum.inr) := (Sum.elim_comp_inl_inr z).symm
      rw [hz', qform_fromBlocks_zero]
      rcases eq_or_ne (z ∘ Sum.inl) 0 with h1 | h1
      · have h2 : (z ∘ Sum.inr) ≠ 0 := by
          intro h2
          exact hz0 (by rw [hz', h1, h2]; funext i; cases i <;> simp)
        have := hVC _ hz.2 h2
        have hnn : qform A (z ∘ Sum.inl) = 0 := by rw [h1]; simp [qform]
        linarith
      · have := hVA _ hz.1 h1
        rcases eq_or_ne (z ∘ Sum.inr) 0 with h2 | h2
        · have hnn : qform C (z ∘ Sum.inr) = 0 := by rw [h2]; simp [qform]
          linarith
        · have := hVC _ hz.2 h2
          linarith
  · refine ⟨(WA.prod WC).comap (e : (m ⊕ k → ℂ) →ₗ[ℂ] (m → ℂ) × (k → ℂ)), ?_, ?_⟩
    · rw [key, hWArank, hWCrank]; omega
    · intro z hz
      rw [hmem] at hz
      have hz' : z = Sum.elim (z ∘ Sum.inl) (z ∘ Sum.inr) := (Sum.elim_comp_inl_inr z).symm
      rw [hz', qform_fromBlocks_zero]
      exact add_nonneg (hWA _ hz.1) (hWC _ hz.2)

/-! ## Proposition 2.6: the Sylvester–Schur inertia identity -/

/-- **Proposition 2.6 (Sylvester–Schur inertia identity).** For a Hermitian block matrix
`Q = [[A, B], [Bᴴ, C]]` with `C` invertible, the negative index splits as
`ind₋(Q) = ind₋(C) + ind₋(Q_eff)`, where `Q_eff = A - B C⁻¹ Bᴴ` is the Schur complement
(the "frozen effective form"). -/
theorem negIndex_fromBlocks_schur [DecidableEq m] [DecidableEq k]
    {A : Matrix m m ℂ} {B : Matrix m k ℂ} {C : Matrix k k ℂ}
    (hA : A.IsHermitian) (hC : C.IsHermitian) (hCu : IsUnit C.det) :
    negIndex (fromBlocks A B Bᴴ C) = negIndex C + negIndex (A - B * C⁻¹ * Bᴴ) := by
  classical
  set S : Matrix m m ℂ := A - B * C⁻¹ * Bᴴ with hS
  set L : Matrix (m ⊕ k) (m ⊕ k) ℂ :=
    fromBlocks (1 : Matrix m m ℂ) 0 (C⁻¹ * Bᴴ) (1 : Matrix k k ℂ) with hL
  have hCinvH : (C⁻¹)ᴴ = C⁻¹ := by
    rw [Matrix.conjTranspose_nonsing_inv, hC.eq]
  have hLH : Lᴴ = fromBlocks 1 (B * C⁻¹) 0 1 := by
    rw [hL, Matrix.fromBlocks_conjTranspose]
    congr 1 <;> simp [Matrix.conjTranspose_mul, hCinvH]
  have hcong : Lᴴ * (fromBlocks S 0 0 C) * L = fromBlocks A B Bᴴ C := by
    rw [hLH, hL]
    rw [Matrix.fromBlocks_multiply, Matrix.fromBlocks_multiply]
    have h1 : C * (C⁻¹ * Bᴴ) = Bᴴ := by
      rw [← Matrix.mul_assoc, Matrix.mul_nonsing_inv _ hCu, Matrix.one_mul]
    have h2 : B * C⁻¹ * C = B := by
      rw [Matrix.mul_assoc, Matrix.nonsing_inv_mul _ hCu, Matrix.mul_one]
    simp only [Matrix.mul_one, Matrix.one_mul, Matrix.mul_zero, Matrix.zero_mul, add_zero,
      zero_add, h1, h2, hS]
    rw [Matrix.mul_assoc B C⁻¹ Bᴴ]
    congr 1
    abel
  have hSH : S.IsHermitian := by
    have : (B * C⁻¹ * Bᴴ).IsHermitian := by
      unfold Matrix.IsHermitian
      rw [Matrix.conjTranspose_mul, Matrix.conjTranspose_mul, Matrix.conjTranspose_conjTranspose,
        hCinvH, Matrix.mul_assoc]
    exact hA.sub this
  have hLdet : IsUnit L.det := by
    have : L.det = 1 := by
      rw [hL, Matrix.det_fromBlocks_one₂₂]
      simp
    rw [this]; exact isUnit_one
  have hblock : (fromBlocks S 0 0 C).IsHermitian := by
    rw [Matrix.isHermitian_fromBlocks_iff]
    exact ⟨hSH, by simp, by simp, hC⟩
  calc negIndex (fromBlocks A B Bᴴ C) = negIndex (Lᴴ * (fromBlocks S 0 0 C) * L) := by rw [hcong]
    _ = negIndex (fromBlocks S 0 0 C) := negIndex_congr hblock hLdet
    _ = negIndex S + negIndex C := negIndex_fromBlocks_zero hSH hC
    _ = negIndex C + negIndex S := Nat.add_comm _ _

/-- If the form is positive definite there are no negative directions. -/
theorem negIndex_eq_zero_of_posDef {C : Matrix k k ℂ} (hC : C.PosDef) : negIndex C = 0 := by
  refine Nat.le_zero.1 (negIndex_le fun V hV => ?_)
  have hVbot : V = ⊥ := by
    rw [Submodule.eq_bot_iff]
    intro x hx
    by_contra hx0
    have h1 := hV x hx hx0
    have h2 : 0 < qform C x := by
      have h3 := hC.dotProduct_mulVec_pos hx0
      have h4 := Complex.lt_def.1 h3
      simpa [qform] using h4.1
    linarith
  simp [hVbot]

/-- **Passive freezing preserves inertia.** If the frozen block `C` is positive definite, the
Schur complement (frozen effective form) has exactly the negative index of the full matrix. -/
theorem negIndex_schur_of_posDef [DecidableEq m] [DecidableEq k]
    {A : Matrix m m ℂ} {B : Matrix m k ℂ} {C : Matrix k k ℂ}
    (hA : A.IsHermitian) (hC : C.PosDef) :
    negIndex (A - B * C⁻¹ * Bᴴ) = negIndex (fromBlocks A B Bᴴ C) := by
  rw [negIndex_fromBlocks_schur hA hC.1 ((Matrix.isUnit_iff_isUnit_det C).1 hC.isUnit),
    negIndex_eq_zero_of_posDef hC, Nat.zero_add]

/-! ## Definition 2.5 and Proposition 2.7: kernels, negative squares, compression -/

/-- The Gram matrix of a Hermitian kernel `K` on a finite mesh `z`. -/
def gramMatrix {ι : Type*} (K : ℂ → ℂ → ℂ) (z : ι → ℂ) : Matrix ι ι ℂ := fun i j => K (z i) (z j)

/-- Definition 2.5: the number of negative squares `sq₋(K)` of a Hermitian kernel `K` on a
set `Ω`, i.e. the supremum of `ind₋(G_K(Z))` over finite meshes `Z ⊆ Ω`. -/
noncomputable def negSquares (K : ℂ → ℂ → ℂ) (Ω : Set ℂ) : ℕ∞ :=
  sSup {d : ℕ∞ | ∃ (N : ℕ) (z : Fin N → ℂ), (∀ i, z i ∈ Ω) ∧ Function.Injective z ∧
    d = (negIndex (gramMatrix K z) : ℕ∞)}

/-- **Proposition 2.7 (compression monotonicity), first part.** The negative index of any
finite-mesh Gram matrix is at most the number of negative squares of the kernel. -/
theorem negIndex_gram_le_negSquares (K : ℂ → ℂ → ℂ) (Ω : Set ℂ) {N : ℕ} (z : Fin N → ℂ)
    (hz : ∀ i, z i ∈ Ω) (hinj : Function.Injective z) :
    (negIndex (gramMatrix K z) : ℕ∞) ≤ negSquares K Ω :=
  le_sSup ⟨N, z, hz, hinj, rfl⟩

/-- **Proposition 2.7 (compression monotonicity), second part.** Compressing a Gram matrix by
any matrix `V` cannot create negative directions. -/
theorem negIndex_compress_le_negSquares (K : ℂ → ℂ → ℂ) (Ω : Set ℂ) {N : ℕ} (z : Fin N → ℂ)
    (hz : ∀ i, z i ∈ Ω) (hinj : Function.Injective z) {ι : Type*} [Fintype ι]
    (V : Matrix (Fin N) ι ℂ) :
    (negIndex (Vᴴ * gramMatrix K z * V) : ℕ∞) ≤ negSquares K Ω :=
  le_trans (by exact_mod_cast negIndex_conjTranspose_mul_mul_le (gramMatrix K z) V)
    (negIndex_gram_le_negSquares K Ω z hz hinj)

/-! ## Theorem 2.1(a): soundness of the Gram acceptance gate -/

/-- **Theorem 2.1(a), Gram gate soundness.** If the frozen approximation `Gfr` has all its
Hermitian form values at least `lam * ‖x‖²` and the error `E = G - Gfr` is bounded in the sense
that its form values are at most `e * ‖x‖²` in absolute value with `e < lam`, then the true Gram
matrix `G` is positive definite as a form. -/
theorem gram_gate_sound {G Gfr : Matrix n n ℂ} {lam e : ℝ}
    (hfr : ∀ x : n → ℂ, lam * ‖x‖ ^ 2 ≤ qform Gfr x)
    (herr : ∀ x : n → ℂ, |qform G x - qform Gfr x| ≤ e * ‖x‖ ^ 2)
    (hlt : e < lam) {x : n → ℂ} (hx : x ≠ 0) : 0 < qform G x := by
  have hnorm : 0 < ‖x‖ ^ 2 := by
    have : ‖x‖ ≠ 0 := norm_ne_zero_iff.2 hx
    positivity
  have h1 := hfr x
  have h2 := (abs_le.1 (herr x)).1
  nlinarith [hnorm]

end FrozenRung
