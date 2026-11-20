/-
Eq48Pick.lean  (2026-11-16, slug b-lean-eq48)

Lean 4 / Mathlib formalization of the algebraic core of Theorem 2 of
tmp/research-2026-11-16/eq48/RESULT.md (refereed in REFEREE.md):

* the Pick matrix `P_ij = (L(x_i) + L(x_j)) / (x_i + x_j)`,
* the Schur step:  if `P_T` is positive definite then
  `P_{T ∪ {y}}` is PSD  iff  `Delta_T(y) >= 0`   (and PD iff `Delta_T(y) > 0`),
  plus the determinant identity `det P_{T ∪ {y}} = det P_T * Delta_T(y)`,
* Theorem 2, (a) <=> (b):  residual target at every order  <=>  all Pick matrices PSD,
  with the analytic inputs (continuity of `L`, genericity = Lemma B) as named hypotheses,
* Theorem 2, (a') with the referee's prefix-PD requirement:
  strict defects along a sequence  <=>  all prefix Pick matrices PD,  and
  prefix-PD  =>  (b_I) on every `I ⊆ closure (range x) ∩ D`.

Everything is parametric in an arbitrary function `L : ℝ → ℝ`.  No property of xi or zeta
(in particular no Euler product) is used anywhere in this file.
-/
import Mathlib

open Matrix Filter Topology

namespace Eq48

variable {ι κ : Type*}

/-- Pick matrix of `L` at the nodes `x`. -/
noncomputable def pick (L : ℝ → ℝ) (x : ι → ℝ) : Matrix ι ι ℝ :=
  Matrix.of fun i j => (L (x i) + L (x j)) / (x i + x j)

@[simp] lemma pick_apply (L : ℝ → ℝ) (x : ι → ℝ) (i j : ι) :
    pick L x i j = (L (x i) + L (x j)) / (x i + x j) := rfl

lemma pick_isHermitian (L : ℝ → ℝ) (x : ι → ℝ) : (pick L x).IsHermitian := by
  ext i j
  simp [Matrix.conjTranspose_apply, add_comm]

lemma pick_comp (L : ℝ → ℝ) (x : ι → ℝ) (f : κ → ι) :
    pick L (x ∘ f) = (pick L x).submatrix f f := rfl

/-- Border column of the extended Pick matrix: `p_i = (L(t_i) + L(y)) / (t_i + y)`. -/
noncomputable def border (L : ℝ → ℝ) (t : ι → ℝ) (y : ℝ) : ι → ℝ :=
  fun i => (L (t i) + L y) / (t i + y)

/-- Schur defect `Delta_T(y) = L(y)/y - p^T P_T^{-1} p`.  This is the value `Q_L(v_res)` of the
Pick form on the Schur residual `b = (-P_T^{-1} p, 1)`; see `residual_form_eq_defect`. -/
noncomputable def defect [Fintype ι] [DecidableEq ι] (L : ℝ → ℝ) (t : ι → ℝ) (y : ℝ) : ℝ :=
  L y / y - border L t y ⬝ᵥ ((pick L t)⁻¹ *ᵥ border L t y)

/-- Node set `T ∪ {y}` indexed by `ι ⊕ Unit`. -/
def extend (t : ι → ℝ) (y : ℝ) : ι ⊕ Unit → ℝ := Sum.elim t (fun _ => y)

/-- Block form of the extended Pick matrix. -/
lemma pick_extend (L : ℝ → ℝ) (t : ι → ℝ) (y : ℝ) :
    pick L (extend t y) =
      fromBlocks (pick L t) (Matrix.of fun i (_ : Unit) => border L t y i)
        (Matrix.of fun i (_ : Unit) => border L t y i)ᴴ
        (Matrix.of fun (_ _ : Unit) => L y / y) := by
  ext a b
  rcases a with a | a <;> rcases b with b | b
  · simp [extend]
  · simp [extend, border]
  · simp [extend, border, add_comm]
  · simp only [pick_apply, extend, Sum.elim_inr, fromBlocks_apply₂₂, of_apply]
    rw [← two_mul, ← two_mul, mul_div_mul_left _ _ (two_ne_zero)]

/-- The Schur complement of the block form is the `1 x 1` matrix `[Delta_T(y)]`. -/
lemma schur_entry [Fintype ι] [DecidableEq ι] (L : ℝ → ℝ) (t : ι → ℝ) (y : ℝ) :
    ((Matrix.of fun (_ _ : Unit) => L y / y) -
        (Matrix.of fun i (_ : Unit) => border L t y i)ᴴ * (pick L t)⁻¹ *
          (Matrix.of fun i (_ : Unit) => border L t y i)) () () = defect L t y := by
  simp only [defect, sub_apply, of_apply, Matrix.mul_apply, conjTranspose_apply, star_trivial,
    dotProduct, mulVec, Finset.sum_mul, Finset.mul_sum]
  congr 1
  rw [Finset.sum_comm]
  refine Finset.sum_congr rfl fun i _ => Finset.sum_congr rfl fun j _ => ?_
  ring

lemma posSemidef_unit (N : Matrix Unit Unit ℝ) : N.PosSemidef ↔ 0 ≤ N () () := by
  constructor
  · intro h
    have := h.2 (fun _ => 1)
    simpa [dotProduct, mulVec] using this
  · intro h
    refine ⟨by ext a b; simp, fun v => ?_⟩
    simp only [dotProduct, mulVec, Finset.univ_unique, Finset.sum_singleton, star_trivial]
    have : v default * (N default default * v default) = N () () * (v default) ^ 2 := by
      show v () * (N () () * v ()) = N () () * (v ()) ^ 2
      ring
    rw [this]
    exact mul_nonneg h (sq_nonneg _)

lemma posDef_iff_psd_det [Fintype ι] [DecidableEq ι] (M : Matrix ι ι ℝ) :
    M.PosDef ↔ M.PosSemidef ∧ M.det ≠ 0 := by
  constructor
  · exact fun h => ⟨h.posSemidef, h.det_pos.ne'⟩
  · rintro ⟨h, hd⟩
    rw [h.posDef_iff_isUnit, isUnit_iff_isUnit_det]
    exact isUnit_iff_ne_zero.2 hd

/-- **Schur step (PSD).**  If `P_T` is positive definite, then `P_{T ∪ {y}}` is positive
semidefinite iff the Schur defect is `>= 0`. -/
theorem pick_extend_posSemidef_iff [Fintype ι] [DecidableEq ι] (L : ℝ → ℝ) (t : ι → ℝ) (y : ℝ)
    (hT : (pick L t).PosDef) :
    (pick L (extend t y)).PosSemidef ↔ 0 ≤ defect L t y := by
  haveI : Invertible (pick L t) := hT.isUnit.invertible
  rw [pick_extend, PosSemidef.fromBlocks₁₁ _ _ hT, posSemidef_unit, schur_entry]

/-- **Determinant identity.** `det P_{T ∪ {y}} = det P_T * Delta_T(y)` when `P_T` is invertible. -/
theorem det_pick_extend [Fintype ι] [DecidableEq ι] (L : ℝ → ℝ) (t : ι → ℝ) (y : ℝ)
    (hT : IsUnit (pick L t).det) :
    (pick L (extend t y)).det = (pick L t).det * defect L t y := by
  haveI : Invertible (pick L t) := invertibleOfIsUnitDet _ hT
  rw [pick_extend, det_fromBlocks₁₁, Matrix.det_unique (n := Unit), Matrix.invOf_eq_nonsing_inv]
  congr 1
  exact schur_entry L t y

/-- **Schur step (PD).**  If `P_T` is positive definite, then `P_{T ∪ {y}}` is positive definite
iff the Schur defect is `> 0`. -/
theorem pick_extend_posDef_iff [Fintype ι] [DecidableEq ι] (L : ℝ → ℝ) (t : ι → ℝ) (y : ℝ)
    (hT : (pick L t).PosDef) :
    (pick L (extend t y)).PosDef ↔ 0 < defect L t y := by
  have hu : IsUnit (pick L t).det := (isUnit_iff_isUnit_det _).1 hT.isUnit
  have hdet := det_pick_extend L t y hu
  constructor
  · intro h
    have h0 := (pick_extend_posSemidef_iff L t y hT).1 h.posSemidef
    have hne : (pick L (extend t y)).det ≠ 0 := h.det_pos.ne'
    rw [hdet] at hne
    exact lt_of_le_of_ne h0 (Ne.symm (right_ne_zero_of_mul hne))
  · intro h
    have hpsd := (pick_extend_posSemidef_iff L t y hT).2 h.le
    rw [hpsd.posDef_iff_isUnit, isUnit_iff_isUnit_det, hdet]
    exact hu.mul (isUnit_iff_ne_zero.2 h.ne')

/-- **Schur residual identity** (RESULT.md §6, "Schur residual sign"): with
`b = (-P_T^{-1} p, 1)`, `b^T P_{T ∪ {y}} b = L(y)/y - p^T P_T^{-1} p = Delta_T(y)`. -/
theorem residual_form_eq_defect [Fintype ι] [DecidableEq ι] (L : ℝ → ℝ) (t : ι → ℝ) (y : ℝ)
    (hT : IsUnit (pick L t).det) :
    (Sum.elim (-((pick L t)⁻¹ *ᵥ border L t y)) (fun _ : Unit => (1 : ℝ))) ⬝ᵥ
      (pick L (extend t y) *ᵥ
        (Sum.elim (-((pick L t)⁻¹ *ᵥ border L t y)) (fun _ : Unit => (1 : ℝ)))) =
      defect L t y := by
  set p := border L t y with hp
  set A := pick L t with hA
  set u := A⁻¹ *ᵥ p with hu
  have hAu : A *ᵥ u = p := by
    rw [hu, mulVec_mulVec, mul_nonsing_inv _ hT, one_mulVec]
  rw [pick_extend, fromBlocks_mulVec]
  simp only [Sum.elim_comp_inl, Sum.elim_comp_inr]
  rw [sumElim_dotProduct_sumElim]
  have h1 : (Matrix.of fun i (_ : Unit) => p i) *ᵥ (fun _ : Unit => (1 : ℝ)) = p := by
    ext i; simp [mulVec, dotProduct]
  have h2 : (Matrix.of fun i (_ : Unit) => p i)ᴴ *ᵥ (-u) = fun _ : Unit => -(p ⬝ᵥ u) := by
    ext i; simp [mulVec, dotProduct, conjTranspose_apply]
  have h3 : (Matrix.of fun (_ _ : Unit) => L y / y) *ᵥ (fun _ : Unit => (1 : ℝ)) =
      fun _ : Unit => L y / y := by
    ext i; simp [mulVec, dotProduct]
  rw [h1, h2, h3, mulVec_neg, hAu]
  simp [defect, dotProduct, ← hp, ← hu, ← hA]
  ring

/-! ## Theorem 2, (a) <=> (b) -/

/-- Admissible node tuples: all nodes in the domain `D`, pairwise distinct. -/
def Nodes (D : Set ℝ) (x : ι → ℝ) : Prop := (∀ i, x i ∈ D) ∧ Function.Injective x

/-- **(a) Residual target**: for every admissible node tuple `t` with `P_t` positive definite and
every new node `y ∈ D`, the Schur defect is `>= 0`  (eq. (21) of PR #48 on Schur residuals). -/
def ResidualTarget (L : ℝ → ℝ) (D : Set ℝ) : Prop :=
  ∀ (n : ℕ) (t : Fin n → ℝ) (y : ℝ), Nodes D t → y ∈ D → y ∉ Set.range t →
    (pick L t).PosDef → 0 ≤ defect L t y

/-- **(b) Full class**: every Pick matrix at admissible nodes is positive semidefinite. -/
def FullClass (L : ℝ → ℝ) (D : Set ℝ) : Prop :=
  ∀ (n : ℕ) (x : Fin n → ℝ), Nodes D x → (pick L x).PosSemidef

/-- **Analytic input (Lemma B of RESULT.md), as a hypothesis**: nonsingular node configurations
are dense among admissible ones. -/
def GenericNonsingular (L : ℝ → ℝ) (D : Set ℝ) : Prop :=
  ∀ (n : ℕ) (t : Fin n → ℝ), Nodes D t → ∀ U ∈ 𝓝 t, ∃ t' ∈ U, (pick L t').det ≠ 0

lemma nodes_extend {D : Set ℝ} {t : ι → ℝ} {y : ℝ} :
    Nodes D (extend t y) ↔ Nodes D t ∧ y ∈ D ∧ y ∉ Set.range t := by
  constructor
  · rintro ⟨h1, h2⟩
    refine ⟨⟨fun i => h1 (Sum.inl i), fun i j hij => ?_⟩, h1 (Sum.inr ()), ?_⟩
    · exact Sum.inl_injective (h2 (by simpa [extend] using hij))
    · rintro ⟨i, hi⟩
      have := @h2 (Sum.inl i) (Sum.inr ()) (by simpa [extend] using hi)
      exact Sum.inl_ne_inr this
  · rintro ⟨⟨h1, h2⟩, hy, hny⟩
    refine ⟨?_, ?_⟩
    · rintro (i | i)
      · exact h1 i
      · exact hy
    · rintro (i | i) (j | j) hij
      · exact congrArg _ (h2 (by simpa [extend] using hij))
      · exact (hny ⟨i, by simpa [extend] using hij⟩).elim
      · exact (hny ⟨j, by simpa [extend] using hij.symm⟩).elim
      · rfl

/-- Quadratic form of the Pick matrix is continuous in the nodes, at nodes in `D`. -/
lemma continuousAt_pick_form [Fintype ι] {L : ℝ → ℝ} {D : Set ℝ} (hD : IsOpen D)
    (hpos : ∀ x ∈ D, 0 < x) (hL : ContinuousOn L D) (v : ι → ℝ) {z : ι → ℝ}
    (hz : ∀ i, z i ∈ D) :
    ContinuousAt (fun z' : ι → ℝ => v ⬝ᵥ (pick L z' *ᵥ v)) z := by
  have hLi : ∀ i, ContinuousAt (fun z' : ι → ℝ => L (z' i)) z := fun i =>
    ContinuousAt.comp (f := fun z' : ι → ℝ => z' i) (g := L)
      (hL.continuousAt (hD.mem_nhds (hz i))) (continuous_apply i).continuousAt
  have hi : ∀ i, ContinuousAt (fun z' : ι → ℝ => z' i) z := fun i =>
    (continuous_apply i).continuousAt
  simp only [dotProduct, mulVec, pick_apply]
  refine tendsto_finset_sum _ fun i _ => ?_
  refine Tendsto.mul tendsto_const_nhds ?_
  refine tendsto_finset_sum _ fun j _ => ?_
  refine Tendsto.mul ?_ tendsto_const_nhds
  exact ContinuousAt.div ((hLi i).add (hLi j)) ((hi i).add (hi j))
    (add_pos (hpos _ (hz i)) (hpos _ (hz j))).ne'

/-- Failing to be PSD is an open condition in the nodes. -/
lemma eventually_not_posSemidef [Fintype ι] {L : ℝ → ℝ} {D : Set ℝ} (hD : IsOpen D)
    (hpos : ∀ x ∈ D, 0 < x) (hL : ContinuousOn L D) {z : ι → ℝ} (hz : ∀ i, z i ∈ D)
    (hneg : ¬ (pick L z).PosSemidef) :
    ∀ᶠ z' in 𝓝 z, ¬ (pick L z').PosSemidef := by
  have : ∃ v : ι → ℝ, v ⬝ᵥ (pick L z *ᵥ v) < 0 := by
    by_contra hcon
    push_neg at hcon
    exact hneg ⟨pick_isHermitian L z, fun v => by simpa using hcon v⟩
  obtain ⟨v, hv⟩ := this
  have hc := continuousAt_pick_form hD hpos hL v hz
  filter_upwards [hc.eventually (gt_mem_nhds hv)] with z' hz' hpsd
  have := hpsd.2 v
  simp only [star_trivial] at this
  linarith

/-- Being an admissible node tuple is an open condition. -/
lemma eventually_nodes [Finite ι] {D : Set ℝ} (hD : IsOpen D) {z : ι → ℝ} (hz : Nodes D z) :
    ∀ᶠ z' in 𝓝 z, Nodes D z' := by
  have h1 : ∀ᶠ z' in 𝓝 z, ∀ i, z' i ∈ D := by
    rw [eventually_all]
    exact fun i => (continuous_apply i).continuousAt.eventually (hD.mem_nhds (hz.1 i))
  have h2 : ∀ᶠ z' in 𝓝 z, ∀ i j, i ≠ j → z' i ≠ z' j := by
    rw [eventually_all]
    intro i
    rw [eventually_all]
    intro j
    by_cases hij : i = j
    · exact Eventually.of_forall fun _ h => (h hij).elim
    · have : ∀ᶠ z' : ι → ℝ in 𝓝 z, z' i ≠ z' j := by
        have hc : ContinuousAt (fun z' : ι → ℝ => z' i - z' j) z :=
          ((continuous_apply i).sub (continuous_apply j)).continuousAt
        have hne : z i - z j ≠ 0 := fun h => hij (hz.2 (sub_eq_zero.1 h))
        exact (hc.eventually_ne hne).mono fun _ h h' => h (sub_eq_zero.2 h')
      exact this.mono fun _ h _ => h
  filter_upwards [h1, h2] with z' a b
  exact ⟨a, fun i j hij => by_contra fun hne => b i j hne hij⟩

/-- **(b) => (a)**: trivial direction, via the Schur step. -/
theorem residualTarget_of_fullClass {L : ℝ → ℝ} {D : Set ℝ} (hb : FullClass L D) :
    ResidualTarget L D := by
  intro n t y ht hy hny hPD
  rw [← pick_extend_posSemidef_iff L t y hPD]
  have hN : Nodes D (extend t y) := nodes_extend.2 ⟨ht, hy, hny⟩
  let e : Fin (n + 1) ≃ Fin n ⊕ Unit := (finSumFinEquiv (m := n) (n := 1)).symm.trans
    (Equiv.sumCongr (Equiv.refl _) (Equiv.equivPUnit (Fin 1)))
  have h := hb (n + 1) (extend t y ∘ e) ⟨fun i => hN.1 _, hN.2.comp e.injective⟩
  rw [pick_comp] at h
  exact (posSemidef_submatrix_equiv e).1 h

/-- **(a) => (b)**: Theorem 2 of RESULT.md.  Analytic inputs are the hypotheses
`hL` (continuity of `L` on the open domain `D ⊆ (0,∞)`) and `hgen` (Lemma B: genericity).
The `n = 0` instance of `ha` is `0 <= L(y)/y`, which is Lemma A. -/
theorem fullClass_of_residualTarget {L : ℝ → ℝ} {D : Set ℝ} (hD : IsOpen D)
    (hpos : ∀ x ∈ D, 0 < x) (hL : ContinuousOn L D) (hgen : GenericNonsingular L D)
    (ha : ResidualTarget L D) : FullClass L D := by
  intro n
  induction n with
  | zero =>
    intro x _
    exact ⟨pick_isHermitian L x, fun v => by simp [dotProduct]⟩
  | succ n ih =>
    intro x hx
    by_contra hneg
    let e : Fin n ⊕ Unit ≃ Fin (n + 1) := (Equiv.sumCongr (Equiv.refl _)
      (Equiv.equivPUnit (Fin 1)).symm).trans (finSumFinEquiv (m := n) (n := 1))
    set z : Fin n ⊕ Unit → ℝ := x ∘ e with hzdef
    have hzN : Nodes D z := ⟨fun i => hx.1 _, hx.2.comp e.injective⟩
    have hzneg : ¬ (pick L z).PosSemidef := by
      rw [hzdef, pick_comp, posSemidef_submatrix_equiv]
      exact hneg
    set t0 : Fin n → ℝ := fun i => z (Sum.inl i) with ht0
    set y : ℝ := z (Sum.inr ()) with hy
    have hzext : extend t0 y = z := by
      ext a
      rcases a with a | a <;> simp [extend, ht0, hy]
    have hev : ∀ᶠ z' in 𝓝 (extend t0 y), Nodes D z' ∧ ¬ (pick L z').PosSemidef := by
      rw [hzext]
      exact (eventually_nodes hD hzN).and (eventually_not_posSemidef hD hpos hL hzN.1 hzneg)
    have hcont : ContinuousAt (fun t : Fin n → ℝ => extend t y) t0 := by
      refine Continuous.continuousAt ?_
      refine continuous_pi fun a => ?_
      rcases a with a | a
      · exact continuous_apply a
      · exact continuous_const
    have ht0N : Nodes D t0 := by
      have := (nodes_extend (D := D) (t := t0) (y := y)).1 (hzext ▸ hzN)
      exact this.1
    obtain ⟨t', ht'U, hdet⟩ := hgen n t0 ht0N _ (hcont.eventually hev)
    obtain ⟨hN', hneg'⟩ := ht'U
    obtain ⟨ht'N, hyD, hyn⟩ := nodes_extend.1 hN'
    have hPSD : (pick L t').PosSemidef := ih t' ht'N
    have hPD : (pick L t').PosDef := by
      rw [hPSD.posDef_iff_isUnit, isUnit_iff_isUnit_det]
      exact isUnit_iff_ne_zero.2 hdet
    exact hneg' ((pick_extend_posSemidef_iff L t' y hPD).2 (ha n t' y ht'N hyD hyn hPD))

/-- **Theorem 2, (a) <=> (b).** -/
theorem residualTarget_iff_fullClass {L : ℝ → ℝ} {D : Set ℝ} (hD : IsOpen D)
    (hpos : ∀ x ∈ D, 0 < x) (hL : ContinuousOn L D) (hgen : GenericNonsingular L D) :
    ResidualTarget L D ↔ FullClass L D :=
  ⟨fullClass_of_residualTarget hD hpos hL hgen, residualTarget_of_fullClass⟩

/-- (a) restricted to NONEMPTY node sets `T` (the reading in which the one-node case is supplied
separately by Lemma A). -/
def ResidualTargetPos (L : ℝ → ℝ) (D : Set ℝ) : Prop :=
  ∀ (n : ℕ) (t : Fin n → ℝ) (y : ℝ), 0 < n → Nodes D t → y ∈ D → y ∉ Set.range t →
    (pick L t).PosDef → 0 ≤ defect L t y

lemma defect_empty (L : ℝ → ℝ) (t : Fin 0 → ℝ) (y : ℝ) : defect L t y = L y / y := by
  simp [defect, dotProduct]

/-- With Lemma A positivity (`L >= 0` on `D ⊆ (0,∞)`), the nonempty-`T` residual target gives the
residual target including the empty `T`. -/
theorem residualTarget_of_pos {L : ℝ → ℝ} {D : Set ℝ} (hpos : ∀ x ∈ D, 0 < x)
    (hLnn : ∀ x ∈ D, 0 ≤ L x) (h : ResidualTargetPos L D) : ResidualTarget L D := by
  intro n t y ht hy hny hPD
  rcases Nat.eq_zero_or_pos n with rfl | hn
  · rw [defect_empty]
    exact div_nonneg (hLnn y hy) (hpos y hy).le
  · exact h n t y hn ht hy hny hPD

/-! ## Theorem 2, (a') along one nested sequence, with the referee's prefix-PD requirement -/

/-- Prefix node tuple `(x_0, ..., x_{n-1})`. -/
def pre (x : ℕ → ℝ) (n : ℕ) : Fin n → ℝ := fun i => x i

/-- The equivalence `Fin n ⊕ Unit ≃ Fin (n+1)` sending `inl i` to `castSucc i`, `inr ()` to `last`. -/
def snocEquiv (n : ℕ) : Fin n ⊕ Unit ≃ Fin (n + 1) :=
  (Equiv.sumCongr (Equiv.refl _) (Equiv.equivPUnit (Fin 1)).symm).trans
    (finSumFinEquiv (m := n) (n := 1))

lemma pre_succ (x : ℕ → ℝ) (n : ℕ) : pre x (n + 1) ∘ snocEquiv n = extend (pre x n) (x n) := by
  ext a
  rcases a with a | a
  · simp [pre, snocEquiv, extend]
  · simp [pre, snocEquiv, extend]

lemma pick_pre_succ_posDef_iff (L : ℝ → ℝ) (x : ℕ → ℝ) (n : ℕ) :
    (pick L (pre x (n + 1))).PosDef ↔ (pick L (extend (pre x n) (x n))).PosDef := by
  rw [← pre_succ, pick_comp, posDef_iff_psd_det, posDef_iff_psd_det, posSemidef_submatrix_equiv,
    det_submatrix_equiv_self]

/-- **Positive-definiteness induction.**  If, whenever the prefix matrix `P_n` is positive
definite, the next Schur defect is strictly positive, then every prefix matrix is positive
definite.  (For `n = 0` the hypothesis reads `0 < L(x_0)/x_0`.) -/
theorem prefix_posDef_of_strict_defects (L : ℝ → ℝ) (x : ℕ → ℝ)
    (h : ∀ n, (pick L (pre x n)).PosDef → 0 < defect L (pre x n) (x n)) :
    ∀ n, (pick L (pre x n)).PosDef := by
  intro n
  induction n with
  | zero =>
    refine ⟨pick_isHermitian L _, fun v hv => ?_⟩
    exact (hv (Subsingleton.elim _ _)).elim
  | succ n ih =>
    rw [pick_pre_succ_posDef_iff, pick_extend_posDef_iff L _ _ ih]
    exact h n ih

/-- The prefix-PD hypothesis required by the referee is the same statement as
"all Schur defects along the sequence are strictly positive". -/
theorem prefix_posDef_iff_strict_defects (L : ℝ → ℝ) (x : ℕ → ℝ) :
    (∀ n, (pick L (pre x n)).PosDef) ↔ ∀ n, 0 < defect L (pre x n) (x n) := by
  constructor
  · intro h n
    have := h (n + 1)
    rwa [pick_pre_succ_posDef_iff, pick_extend_posDef_iff L _ _ (h n)] at this
  · intro h
    exact prefix_posDef_of_strict_defects L x fun n _ => h n

/-- (a') in the non-strict form of RESULT.md plus the referee's hypothesis that all prefixes are
PD: the defect condition is then automatically strict. -/
theorem strict_of_prefix_posDef (L : ℝ → ℝ) (x : ℕ → ℝ)
    (hPD : ∀ n, (pick L (pre x n)).PosDef) (n : ℕ) : 0 < defect L (pre x n) (x n) :=
  (prefix_posDef_iff_strict_defects L x).1 hPD n

/-- All prefixes PSD implies PSD of the Pick matrix at any finite selection of sequence points
(repetitions allowed). -/
theorem posSemidef_of_prefix_posSemidef (L : ℝ → ℝ) (x : ℕ → ℝ)
    (hP : ∀ n, (pick L (pre x n)).PosSemidef) {m : ℕ} (k : Fin m → ℕ) :
    (pick L (x ∘ k)).PosSemidef := by
  obtain ⟨N, hN⟩ : ∃ N, ∀ i, k i < N := by
    refine ⟨(Finset.univ.sup k) + 1, fun i => ?_⟩
    exact Nat.lt_succ_of_le (Finset.le_sup (f := k) (Finset.mem_univ i))
  have : x ∘ k = pre x N ∘ (fun i => (⟨k i, hN i⟩ : Fin N)) := by
    ext i; simp [pre]
  rw [this, pick_comp]
  exact (hP N).submatrix _

/-- **Theorem 2, (a') => (b_I), generalized-Schur reading (referee fix 1).**  If every prefix Pick
matrix along the sequence `x` is positive SEMIdefinite, then for every finite tuple `s` with
entries in `closure (range x) ∩ D` the Pick matrix is positive semidefinite.
Analytic input: continuity of `L` on the open set `D ⊆ (0,∞)`. -/
theorem bI_of_prefix_posSemidef {L : ℝ → ℝ} {D : Set ℝ} (hD : IsOpen D)
    (hpos : ∀ x ∈ D, 0 < x) (hL : ContinuousOn L D) (x : ℕ → ℝ)
    (hP : ∀ n, (pick L (pre x n)).PosSemidef) {m : ℕ} (s : Fin m → ℝ)
    (hsD : ∀ i, s i ∈ D) (hsI : ∀ i, s i ∈ closure (Set.range x)) :
    (pick L s).PosSemidef := by
  by_contra hneg
  have hev := eventually_not_posSemidef hD hpos hL hsD hneg
  have hcl : s ∈ closure (Set.pi Set.univ fun _ : Fin m => Set.range x) := by
    rw [closure_pi_set]
    exact fun i _ => hsI i
  obtain ⟨z', hz'U, hz'R⟩ := mem_closure_iff_nhds.1 hcl _ hev
  choose k hk using fun i => hz'R i (Set.mem_univ i)
  have : z' = x ∘ k := by
    ext i; exact (hk i).symm
  exact hz'U (this ▸ posSemidef_of_prefix_posSemidef L x hP k)

/-- **Theorem 2, (a') => (b_I), prefix-PD reading (referee fix 2).**  Same conclusion from
"all prefix Pick matrices are positive definite". -/
theorem bI_of_prefix_posDef {L : ℝ → ℝ} {D : Set ℝ} (hD : IsOpen D)
    (hpos : ∀ x ∈ D, 0 < x) (hL : ContinuousOn L D) (x : ℕ → ℝ)
    (hPD : ∀ n, (pick L (pre x n)).PosDef) {m : ℕ} (s : Fin m → ℝ)
    (hsD : ∀ i, s i ∈ D) (hsI : ∀ i, s i ∈ closure (Set.range x)) :
    (pick L s).PosSemidef :=
  bI_of_prefix_posSemidef hD hpos hL x (fun n => (hPD n).posSemidef) s hsD hsI

/-- **Theorem 2, (a') => (b_I), in the defect form.**  Strictly positive Schur defects along the
sequence (equivalently: (a') together with prefix-PD) give (b_I). -/
theorem bI_of_strict_defects {L : ℝ → ℝ} {D : Set ℝ} (hD : IsOpen D)
    (hpos : ∀ x ∈ D, 0 < x) (hL : ContinuousOn L D) (x : ℕ → ℝ)
    (hdef : ∀ n, 0 < defect L (pre x n) (x n)) {m : ℕ} (s : Fin m → ℝ)
    (hsD : ∀ i, s i ∈ D) (hsI : ∀ i, s i ∈ closure (Set.range x)) :
    (pick L s).PosSemidef :=
  bI_of_prefix_posDef hD hpos hL x ((prefix_posDef_iff_strict_defects L x).2 hdef) s hsD hsI

end Eq48
