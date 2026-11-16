/-
Eq48Controls.lean  (2026-11-16, slug b-lean-eq48)

Control statements for `Eq48Pick` / `Eq48Generic`:

1. `hypotheses_satisfiable` : the hypothesis set (H-AN), (H-LOW), (H-GROW) is satisfiable
   (`L = 1`), so `residualTarget_iff_fullClass_of_analytic` is not vacuous.
2. `offLine_pair_not_posSemidef`, `offLine_pair_not_residualTarget` : for the toy
   `L(x) = 2x/(x^2 - beta^2)` (one real off-axis zero pair `± beta`, `beta > 0`) every 2-node
   Pick matrix at distinct nodes `> beta` has negative determinant, and the residual target (a)
   fails at order 2.  The same algebra, fed an off-line configuration, returns "false".
3. `literal_a'_gap` : the referee's GAP in (a') => (b_I) is a logical gap at the level of
   abstract `L`: there are a polynomial `L > 0` and a sequence `x` for which the literal statement
   "whenever the prefix is PD the next defect is >= 0" holds for every `n`, while the third
   prefix Pick matrix is not PSD.  Hence a prefix-PD (or generalized-Schur) hypothesis is needed.
-/
import Mathlib
import Eq48Pick
import Eq48Generic

open Matrix Filter Topology

namespace Eq48

/-! ### 1. Satisfiability of the hypotheses -/

theorem hypotheses_satisfiable :
    ResidualTarget (fun _ => (1 : ℝ)) (Set.Ioi (1 / 2)) ↔
      FullClass (fun _ => (1 : ℝ)) (Set.Ioi (1 / 2)) :=
  residualTarget_iff_fullClass_of_analytic (L := fun _ => (1 : ℝ)) (a := 1 / 2) (c := 1)
    (by norm_num) analyticOnNhd_const one_pos (Eventually.of_forall fun _ => le_rfl)
    (tendsto_const_nhds.div_atTop tendsto_id)

/-! ### 2. Off-line toy -/

/-- Toy logarithmic derivative with one real off-axis zero pair `± beta`. -/
noncomputable def offL (β : ℝ) (x : ℝ) : ℝ := 2 * x / (x ^ 2 - β ^ 2)

lemma offL_pick_entry {β x y : ℝ} (hx : β < x) (hy : β < y) (hβ : 0 < β) :
    (offL β x + offL β y) / (x + y) =
      2 * ((x / (x ^ 2 - β ^ 2)) * (y / (y ^ 2 - β ^ 2)) -
        (β / (x ^ 2 - β ^ 2)) * (β / (y ^ 2 - β ^ 2))) := by
  have h1 : x ^ 2 - β ^ 2 ≠ 0 := by nlinarith
  have h2 : y ^ 2 - β ^ 2 ≠ 0 := by nlinarith
  have h3 : x + y ≠ 0 := by linarith
  simp only [offL]
  field_simp
  ring

/-- Every 2-node Pick matrix of the off-line toy (distinct nodes `> beta`) fails to be PSD. -/
theorem offLine_pair_not_posSemidef {β x₁ x₂ : ℝ} (hβ : 0 < β) (h₁ : β < x₁) (h₂ : β < x₂)
    (hne : x₁ ≠ x₂) : ¬ (pick (offL β) ![x₁, x₂]).PosSemidef := by
  intro h
  have hdet := h.det_nonneg
  rw [det_fin_two] at hdet
  simp only [pick_apply, Matrix.cons_val_zero, Matrix.cons_val_one] at hdet
  rw [offL_pick_entry h₁ h₁ hβ, offL_pick_entry h₂ h₂ hβ, offL_pick_entry h₁ h₂ hβ,
    offL_pick_entry h₂ h₁ hβ] at hdet
  have d1 : 0 < x₁ ^ 2 - β ^ 2 := by nlinarith
  have d2 : 0 < x₂ ^ 2 - β ^ 2 := by nlinarith
  set u₁ := x₁ / (x₁ ^ 2 - β ^ 2) with hu₁
  set u₂ := x₂ / (x₂ ^ 2 - β ^ 2) with hu₂
  set w₁ := β / (x₁ ^ 2 - β ^ 2) with hw₁
  set w₂ := β / (x₂ ^ 2 - β ^ 2) with hw₂
  have hcross : u₁ * w₂ - u₂ * w₁ = β * (x₁ - x₂) / ((x₁ ^ 2 - β ^ 2) * (x₂ ^ 2 - β ^ 2)) := by
    rw [hu₁, hu₂, hw₁, hw₂]
    field_simp
    ring
  have hcne : u₁ * w₂ - u₂ * w₁ ≠ 0 := by
    rw [hcross]
    exact div_ne_zero (mul_ne_zero hβ.ne' (sub_ne_zero.2 hne)) (mul_pos d1 d2).ne'
  have hsq : 0 < (u₁ * w₂ - u₂ * w₁) ^ 2 := by positivity
  nlinarith

/-- The residual target (a) fails for the off-line toy. -/
theorem offLine_pair_not_residualTarget {β : ℝ} (hβ : 0 < β) :
    ¬ ResidualTarget (offL β) (Set.Ioi β) := by
  intro ha
  have hpos : ∀ x ∈ Set.Ioi β, 0 < offL β x / x := by
    intro x hx
    have hx' : β < x := hx
    have : 0 < x ^ 2 - β ^ 2 := by nlinarith
    have hx0 : 0 < x := by linarith
    simp only [offL]
    positivity
  -- T = {beta + 1}, new node beta + 2
  let t : Fin 1 → ℝ := fun _ => β + 1
  have ht : Nodes (Set.Ioi β) t :=
    ⟨fun _ => by simp [t], fun i j _ => Subsingleton.elim _ _⟩
  have hPD : (pick (offL β) t).PosDef := by
    refine ⟨pick_isHermitian _ _, fun v hv => ?_⟩
    have hv0 : v 0 ≠ 0 := fun h0 => hv (by ext i; rw [Subsingleton.elim i 0]; simpa using h0)
    have he : (offL β (β + 1) + offL β (β + 1)) / (β + 1 + (β + 1)) = offL β (β + 1) / (β + 1) := by
      rw [← two_mul, ← two_mul, mul_div_mul_left _ _ two_ne_zero]
    simp only [dotProduct, mulVec, Fin.sum_univ_one, star_trivial, pick_apply, t, he]
    have hp := hpos (β + 1) (by simp)
    have : 0 < v 0 ^ 2 := by positivity
    nlinarith
  have hd := ha 1 t (β + 2) ht (by simp) (by simp [t]) hPD
  have hpsd := (pick_extend_posSemidef_iff (offL β) t (β + 2) hPD).2 hd
  have h2 := hpsd.submatrix (![Sum.inl 0, Sum.inr ()] : Fin 2 → Fin 1 ⊕ Unit)
  refine offLine_pair_not_posSemidef (x₁ := β + 1) (x₂ := β + 2) hβ (by linarith) (by linarith)
    (by intro h; linarith) ?_
  convert h2 using 1
  ext i j
  fin_cases i <;> fin_cases j <;> simp [extend, t]

/-! ### 3. The gap in the literal reading of (a') -/

/-- A polynomial with `L(1) = 1, L(2) = 2, L(3) = 4`; `L = (x^2 - x + 2)/2 > 0` on `ℝ`. -/
noncomputable def gapL (x : ℝ) : ℝ := x + (x - 1) * (x - 2) / 2

/-- The node sequence `1, 2, 3, ...`. -/
def gapX (n : ℕ) : ℝ := n + 1

lemma gapL_pos (x : ℝ) : 0 < gapL x := by
  unfold gapL; nlinarith [sq_nonneg (x - 1 / 2)]

/-- The third prefix Pick matrix of `gapL` along `gapX` is not PSD. -/
lemma gap_prefix3_not_posSemidef : ¬ (pick gapL (pre gapX 3)).PosSemidef := by
  intro h
  have := h.2 ![1, -1, -1 / 20]
  simp [dotProduct, mulVec, Fin.sum_univ_three, pre, gapX, gapL] at this
  norm_num at this

/-- For `n >= 2` the prefix Pick matrix of `gapL` along `gapX` is not PD (the vector
`e_0 - e_1` is isotropic). -/
lemma gap_prefix_not_posDef (m : ℕ) : ¬ (pick gapL (pre gapX (m + 2))).PosDef := by
  intro h
  let v : Fin (m + 2) → ℝ := Pi.single 0 1 - Pi.single 1 1
  have hv : v ≠ 0 := by
    intro hv
    have := congrFun hv 0
    simp [v] at this
  have h0 := h.2 v hv
  have hform : star v ⬝ᵥ (pick gapL (pre gapX (m + 2)) *ᵥ v) = 0 := by
    simp only [star_trivial, v, mulVec_sub, dotProduct_sub, sub_dotProduct,
      mulVec_single_one, single_one_dotProduct, col_apply, pick_apply, pre, gapX, gapL]
    simp
    norm_num
  rw [hform] at h0
  exact lt_irrefl _ h0

/-- **The referee's gap, machine-checked.**  For `gapL`, `gapX`:
the literal (a') holds at every order (whenever the prefix is PD, the next defect is `>= 0`),
yet the third prefix Pick matrix is not PSD. -/
theorem literal_a'_gap :
    (∀ n, (pick gapL (pre gapX n)).PosDef → 0 ≤ defect gapL (pre gapX n) (gapX n)) ∧
      ¬ (pick gapL (pre gapX 3)).PosSemidef := by
  refine ⟨fun n hPD => ?_, gap_prefix3_not_posSemidef⟩
  rcases n with _ | _ | m
  · -- empty prefix: defect = L(1)/1 = 1
    simp [defect, dotProduct, gapX, gapL]
  · -- one node: extended matrix is the all-ones 2 x 2 matrix, PSD, so defect >= 0
    rw [← pick_extend_posSemidef_iff gapL _ _ hPD]
    refine ⟨pick_isHermitian _ _, fun v => ?_⟩
    have key : ∀ a b, pick gapL (extend (pre gapX 1) (gapX 1)) a b = 1 := by
      intro a b
      rcases a with a | a <;> rcases b with b | b <;>
        simp [extend, pre, gapX, gapL, Subsingleton.elim _ (0 : Fin 1)] <;> norm_num
    simp only [dotProduct, mulVec, key, star_trivial, one_mul]
    rw [← Finset.sum_mul]
    exact mul_self_nonneg _
  · exact (gap_prefix_not_posDef m hPD).elim

end Eq48
