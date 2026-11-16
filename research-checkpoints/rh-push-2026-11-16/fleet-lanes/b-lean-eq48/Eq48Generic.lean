/-
Eq48Generic.lean  (2026-11-16, slug b-lean-eq48)

Discharges the genericity hypothesis `GenericNonsingular` (Lemma B of
tmp/research-2026-11-16/eq48/RESULT.md) of `Eq48Pick` from three one-variable hypotheses on `L`:

  (H-AN)   `L` is real-analytic on `(a, ∞)`,  `a >= 0`;
  (H-LOW)  `L(y) >= c > 0` for all large `y`;
  (H-GROW) `L(y)/y -> 0` as `y -> ∞`.

The proof is a one-variable induction on the number of nodes (add one node at a time, use
`det P_{T ∪ {y}} = det P_T * Delta_T(y)`, show `Delta_T(y) > 0` for large `y`, and apply the
identity theorem in `y`).  It does not use the Gershgorin / several-variable analyticity
argument of RESULT.md, and it does not use monotonicity of `L`.

Also: a `3 x 3` real symmetric matrix showing that the linear-algebra skeleton alone (without a
genericity input) does not give the induction.
-/
import Mathlib
import Eq48Pick

open Matrix Filter Topology

namespace Eq48

section analytic
variable {ι : Type*} [Fintype ι] [DecidableEq ι] {L : ℝ → ℝ}

/-- The Schur defect is analytic in the new node. -/
lemma analyticAt_defect (t : ι → ℝ) (ht : ∀ i, 0 < t i) {y : ℝ} (hy : 0 < y)
    (hL : AnalyticAt ℝ L y) : AnalyticAt ℝ (fun y => defect L t y) y := by
  have hb : ∀ i, AnalyticAt ℝ (fun y => (L (t i) + L y) / (t i + y)) y := fun i =>
    (analyticAt_const.add hL).div (analyticAt_const.add analyticAt_id)
      (add_pos (ht i) hy).ne'
  have h0 : AnalyticAt ℝ (fun y => L y / y) y := hL.div analyticAt_id hy.ne'
  have h1 : AnalyticAt ℝ (fun y => ∑ i, (L (t i) + L y) / (t i + y) *
      ∑ j, (pick L t)⁻¹ i j * ((L (t j) + L y) / (t j + y))) y :=
    Finset.analyticAt_fun_sum _ fun i _ => (hb i).fun_mul
      (Finset.analyticAt_fun_sum _ fun j _ => analyticAt_const.fun_mul (hb j))
  exact h0.sub h1

/-- For large `y` the Schur defect is strictly positive (any fixed positive nodes `t`, any value
of `(pick L t)⁻¹`). -/
lemma eventually_defect_pos (t : ι → ℝ) (ht : ∀ i, 0 < t i) {c : ℝ} (hc : 0 < c)
    (hlow : ∀ᶠ y in atTop, c ≤ L y) (hgrow : Tendsto (fun y => L y / y) atTop (𝓝 0)) :
    ∀ᶠ y in atTop, 0 < defect L t y := by
  set B := (pick L t)⁻¹ with hB
  set S : ℝ := ∑ i, ∑ j, |B i j| with hS
  set K : ℝ := ∑ i, (|L (t i)| / c + 1) with hK
  have hS0 : 0 ≤ S := Finset.sum_nonneg fun i _ => Finset.sum_nonneg fun j _ => abs_nonneg _
  have hK0 : 0 ≤ K := Finset.sum_nonneg fun i _ => by positivity
  have hε : (0 : ℝ) < 1 / (S * K ^ 2 + 1) := by positivity
  filter_upwards [hlow, eventually_gt_atTop (0 : ℝ), hgrow.eventually (gt_mem_nhds hε)]
    with y h1 h2 h3
  have hLy : 0 < L y := lt_of_lt_of_le hc h1
  set q := L y / y with hq
  have hq0 : 0 < q := div_pos hLy h2
  have hp : ∀ i, |border L t y i| ≤ K * q := by
    intro i
    have hden : 0 < t i + y := add_pos (ht i) h2
    have e1 : |border L t y i| = |L (t i) + L y| / (t i + y) := by
      simp only [border, abs_div, abs_of_pos hden]
    have e2 : |L (t i) + L y| ≤ |L (t i)| + L y := by
      calc |L (t i) + L y| ≤ |L (t i)| + |L y| := abs_add _ _
        _ = |L (t i)| + L y := by rw [abs_of_pos hLy]
    have e3 : |L (t i)| ≤ |L (t i)| / c * L y := by
      calc |L (t i)| = |L (t i)| / c * c := by field_simp
        _ ≤ |L (t i)| / c * L y := mul_le_mul_of_nonneg_left h1 (by positivity)
    have e4 : (|L (t i)| / c + 1) ≤ K :=
      Finset.single_le_sum (f := fun i => |L (t i)| / c + 1) (fun i _ => by positivity)
        (Finset.mem_univ i)
    calc |border L t y i| = |L (t i) + L y| / (t i + y) := e1
      _ ≤ (|L (t i)| + L y) / y :=
        div_le_div₀ (by positivity) e2 h2 (by linarith [ht i])
      _ ≤ (|L (t i)| / c * L y + L y) / y := by gcongr
      _ = (|L (t i)| / c + 1) * q := by rw [hq]; ring
      _ ≤ K * q := mul_le_mul_of_nonneg_right e4 hq0.le
  have hKq : 0 ≤ K * q := mul_nonneg hK0 hq0.le
  have hsum : |border L t y ⬝ᵥ (B *ᵥ border L t y)| ≤ S * (K * q) ^ 2 := by
    simp only [dotProduct, mulVec]
    calc |∑ i, border L t y i * ∑ j, B i j * border L t y j|
        ≤ ∑ i, |border L t y i * ∑ j, B i j * border L t y j| := Finset.abs_sum_le_sum_abs _ _
      _ ≤ ∑ i, (K * q) * ∑ j, |B i j| * (K * q) := by
        refine Finset.sum_le_sum fun i _ => ?_
        rw [abs_mul]
        refine mul_le_mul (hp i) ?_ (abs_nonneg _) hKq
        calc |∑ j, B i j * border L t y j| ≤ ∑ j, |B i j * border L t y j| :=
              Finset.abs_sum_le_sum_abs _ _
          _ ≤ ∑ j, |B i j| * (K * q) := by
            refine Finset.sum_le_sum fun j _ => ?_
            rw [abs_mul]
            exact mul_le_mul_of_nonneg_left (hp j) (abs_nonneg _)
      _ = S * (K * q) ^ 2 := by
        simp only [hS, Finset.sum_mul, Finset.mul_sum]
        refine Finset.sum_congr rfl fun i _ => Finset.sum_congr rfl fun j _ => ?_
        ring
  have hlt : S * K ^ 2 * q < 1 := by
    have h4 : (S * K ^ 2 + 1) * q < 1 := by
      have hpos : 0 < S * K ^ 2 + 1 := by positivity
      have := mul_lt_mul_of_pos_left h3 hpos
      rwa [mul_one_div_cancel hpos.ne'] at this
    nlinarith [mul_nonneg hS0 (sq_nonneg K)]
  have hfin : 0 < q - S * (K * q) ^ 2 := by
    have : q - S * (K * q) ^ 2 = q * (1 - S * K ^ 2 * q) := by ring
    rw [this]
    exact mul_pos hq0 (by linarith)
  have := (abs_le.1 hsum).2
  simp only [defect]
  rw [← hB, ← hq]
  linarith

/-- Near any `y0 > a` there is a node `y` with nonzero Schur defect (identity theorem). -/
lemma exists_defect_ne_zero {a : ℝ} (ha : 0 ≤ a) (hLa : AnalyticOnNhd ℝ L (Set.Ioi a))
    {c : ℝ} (hc : 0 < c) (hlow : ∀ᶠ y in atTop, c ≤ L y)
    (hgrow : Tendsto (fun y => L y / y) atTop (𝓝 0))
    (t : ι → ℝ) (ht : ∀ i, t i ∈ Set.Ioi a) {y0 : ℝ} (hy0 : y0 ∈ Set.Ioi a)
    {W : Set ℝ} (hW : W ∈ 𝓝 y0) :
    ∃ y ∈ W, y ∈ Set.Ioi a ∧ defect L t y ≠ 0 := by
  by_contra hcon
  push_neg at hcon
  have ht0 : ∀ i, 0 < t i := fun i => lt_of_le_of_lt ha (ht i)
  have hf : AnalyticOnNhd ℝ (fun y => defect L t y) (Set.Ioi a) := fun y hy =>
    analyticAt_defect t ht0 (lt_of_le_of_lt ha hy) (hLa y hy)
  have hev : ∀ᶠ z in 𝓝 y0, defect L t z = 0 := by
    filter_upwards [hW, Ioi_mem_nhds hy0] with z hz1 hz2 using hcon z hz1 hz2
  have hfreq : ∃ᶠ z in 𝓝[≠] y0, defect L t z = 0 :=
    (hev.filter_mono nhdsWithin_le_nhds).frequently
  have hzero := hf.eqOn_zero_of_preconnected_of_frequently_eq_zero isPreconnected_Ioi hy0 hfreq
  obtain ⟨y, hy1, hy2⟩ :=
    ((eventually_defect_pos t ht0 hc hlow hgrow).and (eventually_gt_atTop a)).exists
  have := hzero hy2
  simp only [Pi.zero_apply] at this
  linarith

end analytic

/-- **Lemma B, machine-checked from one-variable hypotheses.**  If `L` is analytic on `(a,∞)`
(`a >= 0`), bounded below by a positive constant near `+∞`, and `L(y)/y -> 0`, then nonsingular
node configurations are dense among admissible ones. -/
theorem genericNonsingular_of_analytic {L : ℝ → ℝ} {a : ℝ} (ha : 0 ≤ a)
    (hLa : AnalyticOnNhd ℝ L (Set.Ioi a)) {c : ℝ} (hc : 0 < c)
    (hlow : ∀ᶠ y in atTop, c ≤ L y) (hgrow : Tendsto (fun y => L y / y) atTop (𝓝 0)) :
    GenericNonsingular L (Set.Ioi a) := by
  have key : ∀ (n : ℕ) (t : Fin n → ℝ), Nodes (Set.Ioi a) t → ∀ U ∈ 𝓝 t,
      ∃ t' ∈ U, Nodes (Set.Ioi a) t' ∧ (pick L t').det ≠ 0 := by
    intro n
    induction n with
    | zero =>
      intro t ht U hU
      exact ⟨t, mem_of_mem_nhds hU, ht, by simp⟩
    | succ n ih =>
      intro t ht U hU
      let e := snocEquiv n
      let F : (Fin n → ℝ) × ℝ → (Fin (n + 1) → ℝ) := fun q => extend q.1 q.2 ∘ e.symm
      have hF : Continuous F := by
        refine continuous_pi fun i => ?_
        cases h : e.symm i with
        | inl j =>
          have : (fun q : (Fin n → ℝ) × ℝ => F q i) = fun q => q.1 j := by
            funext q; simp [F, extend, h]
          rw [this]
          exact (continuous_apply j).comp continuous_fst
        | inr u =>
          have : (fun q : (Fin n → ℝ) × ℝ => F q i) = fun q => q.2 := by
            funext q; simp [F, extend, h]
          rw [this]
          exact continuous_snd
      set t0 : Fin n → ℝ := fun i => t (e (Sum.inl i)) with ht0
      set y0 : ℝ := t (e (Sum.inr ())) with hy0
      have hFt : F (t0, y0) = t := by
        funext i
        obtain ⟨b, rfl⟩ := e.surjective i
        rcases b with b | b <;> simp [F, extend, ht0, hy0]
      have hU' : U ∩ {z | Nodes (Set.Ioi a) z} ∈ 𝓝 t :=
        inter_mem hU (eventually_nodes isOpen_Ioi ht)
      have hpre : F ⁻¹' (U ∩ {z | Nodes (Set.Ioi a) z}) ∈ 𝓝 (t0, y0) :=
        hF.continuousAt.preimage_mem_nhds (by rw [hFt]; exact hU')
      rw [nhds_prod_eq, Filter.mem_prod_iff] at hpre
      obtain ⟨V, hV, W, hW, hVW⟩ := hpre
      have ht0N : Nodes (Set.Ioi a) t0 :=
        ⟨fun i => ht.1 _, fun i j hij => Sum.inl_injective (e.injective (ht.2 hij))⟩
      obtain ⟨s', hs'V, hs'N, hdet⟩ := ih t0 ht0N V hV
      obtain ⟨y', hy'W, _, hdef⟩ :=
        exists_defect_ne_zero ha hLa hc hlow hgrow s' hs'N.1 (ht.1 _ : y0 ∈ Set.Ioi a) hW
      have hmem := hVW (Set.mk_mem_prod hs'V hy'W)
      refine ⟨F (s', y'), hmem.1, hmem.2, ?_⟩
      have : pick L (F (s', y')) = (pick L (extend s' y')).submatrix e.symm e.symm := rfl
      rw [this, det_submatrix_equiv_self, det_pick_extend L s' y' (isUnit_iff_ne_zero.2 hdet)]
      exact mul_ne_zero hdet hdef
  intro n t ht U hU
  obtain ⟨t', h1, _, h3⟩ := key n t ht U hU
  exact ⟨t', h1, h3⟩

/-- **Theorem 2, (a) <=> (b), with Lemma B discharged.**  Remaining hypotheses on `L`:
(H-AN) analytic on `(a,∞)`, (H-LOW) `L >= c > 0` near `+∞`, (H-GROW) `L(y)/y -> 0`. -/
theorem residualTarget_iff_fullClass_of_analytic {L : ℝ → ℝ} {a : ℝ} (ha : 0 ≤ a)
    (hLa : AnalyticOnNhd ℝ L (Set.Ioi a)) {c : ℝ} (hc : 0 < c)
    (hlow : ∀ᶠ y in atTop, c ≤ L y) (hgrow : Tendsto (fun y => L y / y) atTop (𝓝 0)) :
    ResidualTarget L (Set.Ioi a) ↔ FullClass L (Set.Ioi a) :=
  residualTarget_iff_fullClass isOpen_Ioi (fun _ hx => lt_of_le_of_lt ha hx)
    hLa.continuousOn (genericNonsingular_of_analytic ha hLa hc hlow hgrow)

/-! ## The linear-algebra skeleton alone is not enough -/

/-- A real symmetric `3 x 3` matrix with unit diagonal. -/
def M3 : Matrix (Fin 3) (Fin 3) ℝ := !![1, 1, 1; 1, 1, -1; 1, -1, 1]

/-- `M3` is not PSD, every `2 x 2` principal submatrix of `M3` is PSD, and every one of them is
singular.  So for abstract symmetric matrices the Schur step "PD `(n-1)`-block + defect >= 0"
can be vacuous at a non-PSD matrix whose proper principal submatrices are all PSD: an input
such as `GenericNonsingular` is needed.  (`M3` has a negative entry, so it is not a Pick matrix
of a positive `L` at positive nodes; this is a statement about the abstract skeleton only.) -/
theorem M3_skeleton_counterexample :
    ¬ M3.PosSemidef ∧
    (∀ f ∈ ({![0, 1], ![0, 2], ![1, 2]} : Set (Fin 2 → Fin 3)),
      (M3.submatrix f f).PosSemidef ∧ (M3.submatrix f f).det = 0) := by
  constructor
  · intro h
    have := h.2 ![1, -1, -1]
    simp [M3, dotProduct, mulVec, Fin.sum_univ_three] at this
    linarith
  · intro f hf
    have hquad : ∀ (N : Matrix (Fin 2) (Fin 2) ℝ) (s : ℝ), (s = 1 ∨ s = -1) →
        N = !![1, s; s, 1] → N.PosSemidef ∧ N.det = 0 := by
      rintro N s hs rfl
      refine ⟨⟨by ext i j; fin_cases i <;> fin_cases j <;> simp, fun v => ?_⟩, ?_⟩
      · simp only [dotProduct, mulVec, Fin.sum_univ_two, star_trivial]
        simp
        rcases hs with rfl | rfl
        · nlinarith [sq_nonneg (v 0 + v 1)]
        · nlinarith [sq_nonneg (v 0 - v 1)]
      · rcases hs with rfl | rfl <;> simp [det_fin_two]
    rcases hf with rfl | rfl | rfl
    · exact hquad _ 1 (Or.inl rfl) (by ext i j; fin_cases i <;> fin_cases j <;> simp [M3])
    · exact hquad _ 1 (Or.inl rfl) (by ext i j; fin_cases i <;> fin_cases j <;> simp [M3])
    · exact hquad _ (-1) (Or.inr rfl) (by ext i j; fin_cases i <;> fin_cases j <;> simp [M3])

end Eq48
