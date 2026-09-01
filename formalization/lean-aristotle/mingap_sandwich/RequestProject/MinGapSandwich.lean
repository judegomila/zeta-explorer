import Mathlib

/-!
# The min-gap sandwich for the attractive Calogero–Moser flow

This file formalizes:

* `IsCMFlow` : a strictly ordered `C¹` solution of the attractive Calogero–Moser flow
  `dx_k/ds = -2 ∑_{j ≠ k} 1/(x_k - x_j)` on `[0, tc)`;
* `bgStatic` : the background field `B = ∑_{j ≠ lo, hi} 1/((x_hi - x_j)(x_lo - x_j))`
  of a pair `lo < hi`;
* the **exact gap ODE** `r' = -4/r + 2 r B` and, for `u = r²`, `u' = -8 + 4 B u`
  (`IsCMFlow.hasDerivAt_gap`, `IsCMFlow.hasDerivAt_gapSq`);
* **Theorem B** (`minGap_sandwich`): the two-sided pinch
  `T₋ ≤ tc ≤ T₊` with the exact closed forms
  `T₋ = (1/(4β)) log (1 + βg²/2)` and `T₊ = (1/(4β)) log (2/(2 - βg²))`;
* the **unconditional static `s = 0` discharge** (`bgStatic_telescope_bound`,
  `bgStatic_mul_sq_lt_two`): positivity and the telescoping bound `B G² < 2`
  for a global minimal gap `G` of a finite ordered configuration.

Theorem B is a conditional statement: the finiteness of `β = sup_s |B_p(s)|` over all
adjacent pairs and the gate `β g² < 2` are hypotheses. Only the `s = 0` instance of the
gate is discharged here (unconditionally); the corresponding bound at positive times is
not addressed.

The lower bound is obtained without any Dini-derivative machinery: since the differential
inequality `u' ≥ -8 - 4β u` holds for each adjacent pair separately with the same
constants, the comparison can be run pair by pair and then minimised.

`twoParticle_satisfies_sandwich_hypotheses` exhibits an explicit solution meeting every
hypothesis of Theorem B, so the statement is not vacuous.
-/

open scoped BigOperators

namespace MinGap

/-- The background field of the pair `(lo, hi)` for a static configuration `y`:
`B = ∑_{j ≠ lo, hi} 1/((y hi - y j) (y lo - y j))`. -/
noncomputable def bgStatic (N : ℕ) (y : ℕ → ℝ) (lo hi : ℕ) : ℝ :=
  ∑ j ∈ (Finset.range N) \ {lo, hi}, 1 / ((y hi - y j) * (y lo - y j))

/-- A strictly ordered `C¹` solution `x₁(s) < ⋯ < x_N(s)` on `[0, tc)` of the attractive
Calogero–Moser flow `dx_k/ds = -2 ∑_{j ≠ k} 1/(x_k - x_j)`. -/
structure IsCMFlow (N : ℕ) (tc : ℝ) (x : ℕ → ℝ → ℝ) : Prop where
  hasDeriv : ∀ k < N, ∀ s ∈ Set.Ico (0 : ℝ) tc,
    HasDerivAt (x k) (-2 * ∑ j ∈ (Finset.range N).erase k, 1 / (x k s - x j s)) s
  ordered : ∀ s ∈ Set.Ico (0 : ℝ) tc, ∀ i < N, ∀ j < N, i < j → x i s < x j s

/-! ### The exact gap ODE -/

/-- Pure algebra behind the gap ODE: the difference of the two velocity fields of a pair
`lo < hi` is `-4/r + 2 r B`. -/
lemma velocity_diff_eq {N lo hi : ℕ} (hlo : lo < hi) (hhi : hi < N) (y : ℕ → ℝ)
    (hy : ∀ i < N, ∀ j < N, i ≠ j → y i ≠ y j) :
    (-2 * ∑ j ∈ (Finset.range N).erase hi, 1 / (y hi - y j)) -
        (-2 * ∑ j ∈ (Finset.range N).erase lo, 1 / (y lo - y j)) =
      -4 / (y hi - y lo) + 2 * (y hi - y lo) * bgStatic N y lo hi := by
  have hloN : lo < N := lt_trans hlo hhi
  set S : Finset ℕ := (Finset.range N) \ {lo, hi} with hS
  have hlonot : lo ∉ S := by simp [hS]
  have hhinot : hi ∉ S := by simp [hS]
  have e1 : (Finset.range N).erase hi = insert lo S := by
    ext j
    simp only [hS, Finset.mem_erase, Finset.mem_range, Finset.mem_insert, Finset.mem_sdiff,
      Finset.mem_singleton]
    omega
  have e2 : (Finset.range N).erase lo = insert hi S := by
    ext j
    simp only [hS, Finset.mem_erase, Finset.mem_range, Finset.mem_insert, Finset.mem_sdiff,
      Finset.mem_singleton]
    omega
  rw [e1, e2, Finset.sum_insert hlonot, Finset.sum_insert hhinot]
  have hne : y hi - y lo ≠ 0 := by
    have := hy hi hhi lo hloN (by omega)
    intro h; apply this; linarith
  have key : ∀ j ∈ S, 1 / (y lo - y j) - 1 / (y hi - y j)
      = (y hi - y lo) * (1 / ((y hi - y j) * (y lo - y j))) := by
    intro j hj
    have hjN : j < N := by simp [hS] at hj; omega
    have hjlo : j ≠ lo := by simp [hS] at hj; omega
    have hjhi : j ≠ hi := by simp [hS] at hj; omega
    have h1 : y lo - y j ≠ 0 := by
      have := hy lo hloN j hjN (Ne.symm hjlo); intro h; apply this; linarith
    have h2 : y hi - y j ≠ 0 := by
      have := hy hi hhi j hjN (Ne.symm hjhi); intro h; apply this; linarith
    field_simp
    ring
  have hsum : ∑ j ∈ S, (1 / (y lo - y j) - 1 / (y hi - y j))
      = (y hi - y lo) * bgStatic N y lo hi := by
    rw [bgStatic, Finset.mul_sum, ← hS]
    exact Finset.sum_congr rfl key
  rw [Finset.sum_sub_distrib] at hsum
  have hlohi : 1 / (y lo - y hi) = -(1 / (y hi - y lo)) := by
    rw [← one_div_neg_eq_neg_one_div]
    ring_nf
  rw [hlohi]
  have hsplit : (-4 : ℝ) / (y hi - y lo) = -2 * (1/(y hi - y lo)) - 2 * (1/(y hi - y lo)) := by
    field_simp; ring
  rw [hsplit]
  linarith [hsum]

/-- Particles of an ordered configuration are pairwise distinct. -/
lemma IsCMFlow.distinct {N : ℕ} {tc : ℝ} {x : ℕ → ℝ → ℝ} (h : IsCMFlow N tc x)
    {s : ℝ} (hs : s ∈ Set.Ico (0:ℝ) tc) : ∀ i < N, ∀ j < N, i ≠ j → x i s ≠ x j s := by
  intro i hi j hj hij
  rcases lt_or_gt_of_ne hij with hlt | hgt
  · exact ne_of_lt (h.ordered s hs i hi j hj hlt)
  · exact ne_of_gt (h.ordered s hs j hj i hi hgt)

/-- **Exact gap ODE.** For any pair `lo < hi` (adjacency is not needed), the gap
`r = x_hi - x_lo` satisfies `r' = -4/r + 2 r B`. -/
lemma IsCMFlow.hasDerivAt_gap {N : ℕ} {tc : ℝ} {x : ℕ → ℝ → ℝ} (h : IsCMFlow N tc x)
    {lo hi : ℕ} (hlo : lo < hi) (hhi : hi < N) {s : ℝ} (hs : s ∈ Set.Ico (0 : ℝ) tc) :
    HasDerivAt (fun t => x hi t - x lo t)
      (-4 / (x hi s - x lo s) +
        2 * (x hi s - x lo s) * bgStatic N (fun i => x i s) lo hi) s := by
  have hd := (h.hasDeriv hi hhi s hs).sub (h.hasDeriv lo (lt_trans hlo hhi) s hs)
  rw [velocity_diff_eq hlo hhi (fun i => x i s) (h.distinct hs)] at hd
  exact hd

/-- **Exact gap ODE, squared form.** With `u = r²` one has `u' = -8 + 4 B u`. -/
lemma IsCMFlow.hasDerivAt_gapSq {N : ℕ} {tc : ℝ} {x : ℕ → ℝ → ℝ} (h : IsCMFlow N tc x)
    {lo hi : ℕ} (hlo : lo < hi) (hhi : hi < N) {s : ℝ} (hs : s ∈ Set.Ico (0 : ℝ) tc) :
    HasDerivAt (fun t => (x hi t - x lo t) ^ 2)
      (-8 + 4 * bgStatic N (fun i => x i s) lo hi * (x hi s - x lo s) ^ 2) s := by
  have hne : x hi s - x lo s ≠ 0 := by
    have := h.ordered s hs lo (lt_trans hlo hhi) hi hhi hlo
    intro hc; linarith [hc]
  have hd := (h.hasDerivAt_gap hlo hhi hs).pow 2
  convert hd using 1
  field_simp
  ring

/-! ### Gronwall-type comparison lemmas -/

/-- Differential comparison, upper form: `u' ≤ c + k u` on `[0, T)` implies
`u s + c/k ≤ (u 0 + c/k) exp (k s)`. -/
lemma gronwall_le {k c T : ℝ} {u u' : ℝ → ℝ} (hk : k ≠ 0)
    (hd : ∀ s ∈ Set.Ico (0 : ℝ) T, HasDerivAt u (u' s) s)
    (hineq : ∀ s ∈ Set.Ico (0 : ℝ) T, u' s ≤ c + k * u s) :
    ∀ s ∈ Set.Ico (0 : ℝ) T, u s + c / k ≤ (u 0 + c / k) * Real.exp (k * s) := by
  intro s hs
  obtain ⟨hs0, hsT⟩ := hs
  set w : ℝ → ℝ := fun t => (u t + c / k) * Real.exp (-(k * t)) with hw
  have hsub : Set.Icc (0:ℝ) s ⊆ Set.Ico (0:ℝ) T := fun t ht => ⟨ht.1, lt_of_le_of_lt ht.2 hsT⟩
  have hderiv : ∀ t ∈ Set.Icc (0:ℝ) s,
      HasDerivAt w ((u' t - k * u t - c) * Real.exp (-(k*t))) t := by
    intro t ht
    have h1 : HasDerivAt (fun t => u t + c / k) (u' t) t := (hd t (hsub ht)).add_const _
    have h2 : HasDerivAt (fun t : ℝ => Real.exp (-(k*t))) (Real.exp (-(k*t)) * (-k)) t := by
      have : HasDerivAt (fun t : ℝ => -(k*t)) (-k) t := by
        simpa using ((hasDerivAt_id t).const_mul k).neg
      simpa using this.exp
    have hmul := h1.mul h2
    convert hmul using 1
    field_simp
    ring
  have hcont : ContinuousOn w (Set.Icc (0:ℝ) s) := fun t ht =>
    ((hderiv t ht).continuousAt).continuousWithinAt
  have hanti : AntitoneOn w (Set.Icc (0:ℝ) s) := by
    apply antitoneOn_of_deriv_nonpos (convex_Icc _ _) hcont
    · intro t ht
      rw [interior_Icc] at ht
      exact ((hderiv t ⟨ht.1.le, ht.2.le⟩).differentiableAt).differentiableWithinAt
    · intro t ht
      rw [interior_Icc] at ht
      have htI : t ∈ Set.Icc (0:ℝ) s := ⟨le_of_lt ht.1, le_of_lt ht.2⟩
      rw [(hderiv t htI).deriv]
      have hle := hineq t (hsub htI)
      have hexp : 0 < Real.exp (-(k*t)) := Real.exp_pos _
      nlinarith [hexp]
  have hmain := hanti (Set.left_mem_Icc.2 hs0) (Set.right_mem_Icc.2 hs0) hs0
  simp only [hw] at hmain
  have e0 : Real.exp (-(k*0)) = 1 := by simp
  rw [e0, mul_one] at hmain
  have hmul : Real.exp (-(k*s)) * Real.exp (k*s) = 1 := by
    rw [← Real.exp_add]; simp
  have h2 := mul_le_mul_of_nonneg_right hmain (Real.exp_pos (k*s)).le
  rw [mul_assoc, hmul, mul_one] at h2
  exact h2

/-- Differential comparison, lower form: `u' ≥ c + k u` on `[0, T)` implies
`u s + c/k ≥ (u 0 + c/k) exp (k s)`. -/
lemma gronwall_ge {k c T : ℝ} {u u' : ℝ → ℝ} (hk : k ≠ 0)
    (hd : ∀ s ∈ Set.Ico (0 : ℝ) T, HasDerivAt u (u' s) s)
    (hineq : ∀ s ∈ Set.Ico (0 : ℝ) T, c + k * u s ≤ u' s) :
    ∀ s ∈ Set.Ico (0 : ℝ) T, (u 0 + c / k) * Real.exp (k * s) ≤ u s + c / k := by
  intro s hs
  obtain ⟨hs0, hsT⟩ := hs
  set w : ℝ → ℝ := fun t => (u t + c / k) * Real.exp (-(k * t)) with hw
  have hsub : Set.Icc (0:ℝ) s ⊆ Set.Ico (0:ℝ) T := fun t ht => ⟨ht.1, lt_of_le_of_lt ht.2 hsT⟩
  have hderiv : ∀ t ∈ Set.Icc (0:ℝ) s,
      HasDerivAt w ((u' t - k * u t - c) * Real.exp (-(k*t))) t := by
    intro t ht
    have h1 : HasDerivAt (fun t => u t + c / k) (u' t) t := (hd t (hsub ht)).add_const _
    have h2 : HasDerivAt (fun t : ℝ => Real.exp (-(k*t))) (Real.exp (-(k*t)) * (-k)) t := by
      have : HasDerivAt (fun t : ℝ => -(k*t)) (-k) t := by
        simpa using ((hasDerivAt_id t).const_mul k).neg
      simpa using this.exp
    have hmul := h1.mul h2
    convert hmul using 1
    field_simp
    ring
  have hcont : ContinuousOn w (Set.Icc (0:ℝ) s) := fun t ht =>
    ((hderiv t ht).continuousAt).continuousWithinAt
  have hmono : MonotoneOn w (Set.Icc (0:ℝ) s) := by
    apply monotoneOn_of_deriv_nonneg (convex_Icc _ _) hcont
    · intro t ht
      rw [interior_Icc] at ht
      exact ((hderiv t ⟨ht.1.le, ht.2.le⟩).differentiableAt).differentiableWithinAt
    · intro t ht
      rw [interior_Icc] at ht
      have htI : t ∈ Set.Icc (0:ℝ) s := ⟨le_of_lt ht.1, le_of_lt ht.2⟩
      rw [(hderiv t htI).deriv]
      have hle := hineq t (hsub htI)
      have hexp : 0 < Real.exp (-(k*t)) := Real.exp_pos _
      nlinarith [hexp]
  have hmain := hmono (Set.left_mem_Icc.2 hs0) (Set.right_mem_Icc.2 hs0) hs0
  simp only [hw] at hmain
  have e0 : Real.exp (-(k*0)) = 1 := by simp
  rw [e0, mul_one] at hmain
  have hmul : Real.exp (-(k*s)) * Real.exp (k*s) = 1 := by
    rw [← Real.exp_add]; simp
  have h2 := mul_le_mul_of_nonneg_right hmain (Real.exp_pos (k*s)).le
  rw [mul_assoc, hmul, mul_one] at h2
  exact h2

/-! ### Theorem B: the min-gap sandwich -/

/-- Upper comparison for a fixed pair: `u = r²` obeys `u ≤ (u 0 - 2/β) e^{4βs} + 2/β`. -/
lemma gapSq_le_comparison {N : ℕ} {tc beta : ℝ} {x : ℕ → ℝ → ℝ} (h : IsCMFlow N tc x)
    (hbeta_pos : 0 < beta) {lo hi : ℕ} (hlo : lo < hi) (hhi : hi < N)
    (hb : ∀ s ∈ Set.Ico (0 : ℝ) tc, |bgStatic N (fun i => x i s) lo hi| ≤ beta) :
    ∀ s ∈ Set.Ico (0 : ℝ) tc,
      (x hi s - x lo s) ^ 2 ≤
        ((x hi 0 - x lo 0) ^ 2 - 2 / beta) * Real.exp (4 * beta * s) + 2 / beta := by
  intro s hs
  have hk : (4*beta) ≠ 0 := by positivity
  have key := gronwall_le (k := 4*beta) (c := -8) (T := tc)
      (u := fun t => (x hi t - x lo t)^2)
      (u' := fun t => -8 + 4 * bgStatic N (fun i => x i t) lo hi * (x hi t - x lo t)^2)
      hk (fun t ht => h.hasDerivAt_gapSq hlo hhi ht) ?_ s hs
  · have hc : (-8 : ℝ) / (4*beta) = -(2/beta) := by field_simp; ring
    rw [hc] at key
    linarith [key]
  · intro t ht
    have hB := abs_le.1 (hb t ht)
    have hsq : (0:ℝ) ≤ (x hi t - x lo t)^2 := sq_nonneg _
    simp only
    nlinarith [hB.2, hsq]

/-- Lower comparison for a fixed pair: `u = r²` obeys `u ≥ (u 0 + 2/β) e^{-4βs} - 2/β`. -/
lemma gapSq_ge_comparison {N : ℕ} {tc beta : ℝ} {x : ℕ → ℝ → ℝ} (h : IsCMFlow N tc x)
    (hbeta_pos : 0 < beta) {lo hi : ℕ} (hlo : lo < hi) (hhi : hi < N)
    (hb : ∀ s ∈ Set.Ico (0 : ℝ) tc, |bgStatic N (fun i => x i s) lo hi| ≤ beta) :
    ∀ s ∈ Set.Ico (0 : ℝ) tc,
      ((x hi 0 - x lo 0) ^ 2 + 2 / beta) * Real.exp (-(4 * beta * s)) - 2 / beta ≤
        (x hi s - x lo s) ^ 2 := by
  intro s hs
  have hk : (-(4*beta)) ≠ 0 := by simp; positivity
  have key := gronwall_ge (k := -(4*beta)) (c := -8) (T := tc)
      (u := fun t => (x hi t - x lo t)^2)
      (u' := fun t => -8 + 4 * bgStatic N (fun i => x i t) lo hi * (x hi t - x lo t)^2)
      hk (fun t ht => h.hasDerivAt_gapSq hlo hhi ht) ?_ s hs
  · have hc : (-8 : ℝ) / (-(4*beta)) = 2/beta := by field_simp; ring
    rw [hc] at key
    have hneg : -(4*beta) * s = -(4*beta*s) := by ring
    rw [hneg] at key
    linarith [key]
  · intro t ht
    have hB := abs_le.1 (hb t ht)
    have hsq : (0:ℝ) ≤ (x hi t - x lo t)^2 := sq_nonneg _
    simp only
    nlinarith [hB.1, hsq]

/-- **Theorem B (min-gap sandwich).**

Standing hypotheses: `x` is a strictly ordered `C¹` Calogero–Moser flow on `[0, tc)`
(`hflow`); `g` is the smallest initial gap, realised by the adjacent pair `(p, p+1)`
(`hgpos`, `hg_le`, `hgp`); `(h_β)` `beta` bounds `|B_p|` over all adjacent pairs `p`
and all times (`hbeta`, with `hbeta_pos : 0 < beta`, needed for the closed forms to
make sense); `(h_gate)` `beta * g² < 2`; `(h_tc)` `tc` is the first collision time, used
here through the consequence that the minimal gap gets arbitrarily small somewhere on
`[0, tc)` (`htc`).

Conclusion: `T₋ ≤ tc ≤ T₊` with the exact closed forms of the source. -/
theorem minGap_sandwich {N : ℕ} {tc g beta : ℝ} {x : ℕ → ℝ → ℝ}
    (hflow : IsCMFlow N tc x)
    (hbeta_pos : 0 < beta)
    (hbeta : ∀ k, k + 1 < N → ∀ s ∈ Set.Ico (0 : ℝ) tc,
      |bgStatic N (fun i => x i s) k (k + 1)| ≤ beta)
    (hgpos : 0 < g)
    (hg_le : ∀ k, k + 1 < N → g ≤ x (k + 1) 0 - x k 0)
    (p : ℕ) (hp : p + 1 < N) (hgp : x (p + 1) 0 - x p 0 = g)
    (hgate : beta * g ^ 2 < 2)
    (htc : ∀ ε > 0, ∃ s ∈ Set.Ico (0 : ℝ) tc, ∃ k, k + 1 < N ∧ x (k + 1) s - x k s < ε) :
    (1 / (4 * beta)) * Real.log (1 + beta * g ^ 2 / 2) ≤ tc ∧
      tc ≤ (1 / (4 * beta)) * Real.log (2 / (2 - beta * g ^ 2)) := by
  have hbne : beta ≠ 0 := ne_of_gt hbeta_pos
  have hg2 : 0 < g ^ 2 := by positivity
  have hden : 0 < 2 - beta * g ^ 2 := by linarith
  constructor
  · -- lower bound `T₋ ≤ tc`
    by_contra hcon
    push_neg at hcon
    set Tm := (1 / (4 * beta)) * Real.log (1 + beta * g ^ 2 / 2) with hTm
    have hL : (0:ℝ) < 1 + beta * g ^ 2 / 2 := by positivity
    have hexpTm : Real.exp (-(4 * beta * Tm)) = 1 / (1 + beta * g ^ 2 / 2) := by
      have harg : 4 * beta * Tm = Real.log (1 + beta * g ^ 2 / 2) := by
        rw [hTm]; field_simp
      rw [harg, Real.exp_neg, Real.exp_log hL, one_div]
    have hlt : Real.exp (-(4 * beta * Tm)) < Real.exp (-(4 * beta * tc)) := by
      apply Real.exp_lt_exp.2
      nlinarith [hcon, hbeta_pos]
    set m := (g ^ 2 + 2 / beta) * Real.exp (-(4 * beta * tc)) - 2 / beta with hm
    have hcoef : (0:ℝ) < g ^ 2 + 2 / beta := by positivity
    have hmpos : 0 < m := by
      have h1 : (g ^ 2 + 2 / beta) * (1 / (1 + beta * g ^ 2 / 2)) - 2 / beta = 0 := by
        field_simp; ring
      rw [hexpTm] at hlt
      nlinarith [hlt, hcoef, h1]
    obtain ⟨s, hs, k, hk, hgapk⟩ := htc (Real.sqrt m) (Real.sqrt_pos.2 hmpos)
    have hcmp := gapSq_ge_comparison hflow hbeta_pos (lo := k) (hi := k + 1) (by omega) hk
      (fun t ht => hbeta k hk t ht) s hs
    have h0 : g ≤ x (k + 1) 0 - x k 0 := hg_le k hk
    have hsq0 : g ^ 2 ≤ (x (k + 1) 0 - x k 0) ^ 2 := by nlinarith
    have hexpmono : Real.exp (-(4 * beta * tc)) ≤ Real.exp (-(4 * beta * s)) := by
      apply Real.exp_le_exp.2
      nlinarith [hs.2.le, hbeta_pos]
    have hchain : m ≤ (x (k + 1) s - x k s) ^ 2 := by
      have hEpos : 0 < Real.exp (-(4 * beta * tc)) := Real.exp_pos _
      have hstep : m ≤ ((x (k + 1) 0 - x k 0) ^ 2 + 2 / beta) * Real.exp (-(4 * beta * s))
          - 2 / beta := by
        rw [hm]
        have h1 : (g ^ 2 + 2 / beta) * Real.exp (-(4 * beta * tc))
            ≤ ((x (k + 1) 0 - x k 0) ^ 2 + 2 / beta) * Real.exp (-(4 * beta * s)) := by
          apply mul_le_mul (by linarith) hexpmono hEpos.le (by nlinarith)
        linarith
      linarith [hcmp]
    have hgpos2 : 0 < x (k + 1) s - x k s := by
      have := hflow.ordered s hs k (by omega) (k + 1) hk (by omega); linarith
    have hsqrt : Real.sqrt m ≤ x (k + 1) s - x k s := by
      have := Real.sqrt_le_sqrt hchain
      rwa [Real.sqrt_sq hgpos2.le] at this
    linarith
  · -- upper bound `tc ≤ T₊`
    by_contra hcon
    push_neg at hcon
    set Tp := (1 / (4 * beta)) * Real.log (2 / (2 - beta * g ^ 2)) with hTp
    have hratio : (1:ℝ) ≤ 2 / (2 - beta * g ^ 2) := by
      rw [le_div_iff₀ hden]; nlinarith [mul_pos hbeta_pos hg2]
    have hTp0 : 0 ≤ Tp := mul_nonneg (by positivity) (Real.log_nonneg hratio)
    have hmem : Tp ∈ Set.Ico (0:ℝ) tc := ⟨hTp0, hcon⟩
    have hcmp := gapSq_le_comparison hflow hbeta_pos (lo := p) (hi := p + 1) (by omega) hp
      (fun t ht => hbeta p hp t ht) Tp hmem
    have hexp : Real.exp (4 * beta * Tp) = 2 / (2 - beta * g ^ 2) := by
      have harg : 4 * beta * Tp = Real.log (2 / (2 - beta * g ^ 2)) := by
        rw [hTp]; field_simp
      rw [harg, Real.exp_log (by positivity)]
    rw [hexp, hgp] at hcmp
    have hzero : (g ^ 2 - 2 / beta) * (2 / (2 - beta * g ^ 2)) + 2 / beta = 0 := by
      have hne2 : (2 - beta * g ^ 2) ≠ 0 := ne_of_gt hden
      have hne3 : (2 - g ^ 2 * beta) ≠ 0 := by intro h; apply hne2; linarith
      field_simp
      ring
    rw [hzero] at hcmp
    have hpos : 0 < x (p + 1) Tp - x p Tp := by
      have := hflow.ordered Tp hmem p (by omega) (p + 1) hp (by omega); linarith
    nlinarith [hcmp, hpos]

/-- Optional consistency corollary: `T₊ ≤ g² / (8 (1 - β g²/2))`. -/
lemma Tplus_le {g beta : ℝ} (hbeta_pos : 0 < beta) (hgate : beta * g ^ 2 < 2) :
    (1 / (4 * beta)) * Real.log (2 / (2 - beta * g ^ 2)) ≤
      g ^ 2 / (8 * (1 - beta * g ^ 2 / 2)) := by
  have hbne : beta ≠ 0 := ne_of_gt hbeta_pos
  have hden : (0:ℝ) < 2 - beta * g ^ 2 := by linarith
  have hdne : (2 - beta * g ^ 2) ≠ 0 := ne_of_gt hden
  have hlog : Real.log (2 / (2 - beta * g ^ 2)) ≤ 2 / (2 - beta * g ^ 2) - 1 :=
    Real.log_le_sub_one_of_pos (by positivity)
  have hstep : (1 / (4 * beta)) * Real.log (2 / (2 - beta * g ^ 2)) ≤
      (1 / (4 * beta)) * (2 / (2 - beta * g ^ 2) - 1) := by
    apply mul_le_mul_of_nonneg_left hlog (by positivity)
  have heq : (1 / (4 * beta)) * (2 / (2 - beta * g ^ 2) - 1)
      = g ^ 2 / (8 * (1 - beta * g ^ 2 / 2)) := by
    have h8 : (8 : ℝ) * (1 - beta * g ^ 2 / 2) ≠ 0 := by
      intro h
      apply hdne
      linarith
    field_simp
    ring
  linarith [hstep, heq]

/-! ### The unconditional static `s = 0` discharge -/

/-- The telescoping sum `∑_{k<n} 1/((k+1)(k+2)) = 1 - 1/(n+1)`. -/
lemma sum_telescope (n : ℕ) :
    ∑ k ∈ Finset.range n, (1 : ℝ) / (((k : ℝ) + 1) * ((k : ℝ) + 2)) = 1 - 1 / ((n : ℝ) + 1) := by
  induction n with
  | zero => simp
  | succ n ih =>
    rw [Finset.sum_range_succ, ih]
    have h1 : ((n : ℝ) + 1) ≠ 0 := by positivity
    have h2 : ((n : ℝ) + 2) ≠ 0 := by positivity
    push_cast
    field_simp
    ring

/-- Ordered configurations with all gaps at least `G` spread out linearly: the `d`-th
particle out from `i` is at distance at least `d G`. -/
lemma le_sub_of_index_le {N : ℕ} {y : ℕ → ℝ} {G : ℝ}
    (hmin : ∀ k, k + 1 < N → G ≤ y (k + 1) - y k) :
    ∀ d i : ℕ, i + d < N → (d : ℝ) * G ≤ y (i + d) - y i := by
  intro d
  induction d with
  | zero => intro i _; simp
  | succ d ih =>
    intro i hi
    have h1 : (d : ℝ) * G ≤ y (i + d) - y i := ih i (by omega)
    have h2 : G ≤ y (i + d + 1) - y (i + d) := hmin (i + d) (by omega)
    have he : i + (d + 1) = (i + d) + 1 := by omega
    rw [he]
    push_cast
    linarith

/-- **Positivity.** No particle lies strictly between the adjacent pair `(lo, lo+1)`,
so every term of `B` is positive. -/
lemma bgStatic_term_pos {N lo : ℕ} {y : ℕ → ℝ} (hN : lo + 1 < N)
    (hmono : ∀ i < N, ∀ j < N, i < j → y i < y j) :
    ∀ j ∈ (Finset.range N) \ {lo, lo + 1},
      0 < 1 / ((y (lo + 1) - y j) * (y lo - y j)) := by
  intro j hj
  simp only [Finset.mem_sdiff, Finset.mem_range, Finset.mem_insert, Finset.mem_singleton] at hj
  obtain ⟨hjN, hjne⟩ := hj
  push_neg at hjne
  have hcase : j < lo ∨ lo + 1 < j := by omega
  rcases hcase with hlt | hgt
  · have h1 : y j < y lo := hmono j hjN lo (by omega) hlt
    have h2 : y j < y (lo + 1) := hmono j hjN (lo + 1) (by omega) (by omega)
    have hprod : 0 < (y (lo + 1) - y j) * (y lo - y j) := mul_pos (by linarith) (by linarith)
    positivity
  · have h1 : y lo < y j := hmono lo (by omega) j hjN (by omega)
    have h2 : y (lo + 1) < y j := hmono (lo + 1) (by omega) j hjN hgt
    have hprod : 0 < (y (lo + 1) - y j) * (y lo - y j) :=
      mul_pos_of_neg_of_neg (by linarith) (by linarith)
    positivity

/-- The background field of an adjacent pair is nonnegative. -/
lemma bgStatic_nonneg {N lo : ℕ} {y : ℕ → ℝ} (hN : lo + 1 < N)
    (hmono : ∀ i < N, ∀ j < N, i < j → y i < y j) :
    0 ≤ bgStatic N y lo (lo + 1) :=
  Finset.sum_nonneg (fun j hj => (bgStatic_term_pos hN hmono j hj).le)

/-- **Telescope.** For a globally minimal adjacent gap `G = y (lo+1) - y lo`, with `lo`
particles on the left flank and `N - lo - 2` on the right flank,
`B ≤ (1/G²)((1 - 1/(lo+1)) + (1 - 1/(N-lo-1)))`. -/
theorem bgStatic_telescope_bound {N lo : ℕ} {y : ℕ → ℝ} {G : ℝ} (hN : lo + 1 < N)
    (hmono : ∀ i < N, ∀ j < N, i < j → y i < y j)
    (hG : G = y (lo + 1) - y lo)
    (hmin : ∀ k, k + 1 < N → G ≤ y (k + 1) - y k) :
    bgStatic N y lo (lo + 1) ≤
      (1 / G ^ 2) * ((1 - 1 / ((lo : ℝ) + 1)) + (1 - 1 / ((N - lo - 1 : ℕ) : ℝ))) := by
  obtain ⟨M, rfl⟩ : ∃ M, N = lo + 2 + M := ⟨N - lo - 2, by omega⟩
  have hGpos : 0 < G := by
    rw [hG]; linarith [hmono lo (by omega) (lo + 1) (by omega) (by omega)]
  have hGne : G ≠ 0 := ne_of_gt hGpos
  have hcast : (lo + 2 + M - lo - 1 : ℕ) = M + 1 := by omega
  rw [hcast]
  have spread := le_sub_of_index_le hmin
  have hsplit : (Finset.range (lo + 2 + M)) \ {lo, lo + 1}
      = (Finset.range lo) ∪ (Finset.Ico (lo + 2) (lo + 2 + M)) := by
    ext j
    simp only [Finset.mem_sdiff, Finset.mem_range, Finset.mem_insert, Finset.mem_singleton,
      Finset.mem_union, Finset.mem_Ico]
    omega
  have hdisj : Disjoint (Finset.range lo) (Finset.Ico (lo + 2) (lo + 2 + M)) := by
    rw [Finset.disjoint_left]
    intro a ha hb
    simp only [Finset.mem_range] at ha
    simp only [Finset.mem_Ico] at hb
    omega
  rw [bgStatic, hsplit, Finset.sum_union hdisj]
  have hleft : ∑ j ∈ Finset.range lo, 1 / ((y (lo + 1) - y j) * (y lo - y j))
      ≤ (1 / G ^ 2) * (1 - 1 / ((lo : ℝ) + 1)) := by
    rw [← Finset.sum_range_reflect (fun j => 1 / ((y (lo + 1) - y j) * (y lo - y j))) lo]
    have hb : ∀ k ∈ Finset.range lo,
        1 / ((y (lo + 1) - y (lo - 1 - k)) * (y lo - y (lo - 1 - k)))
          ≤ (1 / G ^ 2) * (1 / (((k : ℝ) + 1) * ((k : ℝ) + 2))) := by
      intro k hk
      simp only [Finset.mem_range] at hk
      have h1 : ((k : ℝ) + 1) * G ≤ y lo - y (lo - 1 - k) := by
        have hs := spread (k + 1) (lo - 1 - k) (by omega)
        have he : (lo - 1 - k) + (k + 1) = lo := by omega
        rw [he] at hs; push_cast at hs ⊢; linarith
      have h2 : ((k : ℝ) + 2) * G ≤ y (lo + 1) - y (lo - 1 - k) := by
        have hs := spread (k + 2) (lo - 1 - k) (by omega)
        have he : (lo - 1 - k) + (k + 2) = lo + 1 := by omega
        rw [he] at hs; push_cast at hs ⊢; linarith
      have hp1 : (0:ℝ) < ((k : ℝ) + 1) * G := by positivity
      have hprod : ((k : ℝ) + 2) * G * (((k : ℝ) + 1) * G)
          ≤ (y (lo + 1) - y (lo - 1 - k)) * (y lo - y (lo - 1 - k)) :=
        mul_le_mul h2 h1 hp1.le (by linarith)
      have hrhs : (1 / G ^ 2) * (1 / (((k : ℝ) + 1) * ((k : ℝ) + 2)))
          = 1 / ((((k : ℝ) + 2) * G) * (((k : ℝ) + 1) * G)) := by
        field_simp
      rw [hrhs]
      exact one_div_le_one_div_of_le (by positivity) hprod
    calc ∑ k ∈ Finset.range lo, 1 / ((y (lo + 1) - y (lo - 1 - k)) * (y lo - y (lo - 1 - k)))
        ≤ ∑ k ∈ Finset.range lo, (1 / G ^ 2) * (1 / (((k : ℝ) + 1) * ((k : ℝ) + 2))) :=
          Finset.sum_le_sum hb
      _ = (1 / G ^ 2) * ∑ k ∈ Finset.range lo, (1 : ℝ) / (((k : ℝ) + 1) * ((k : ℝ) + 2)) := by
          rw [Finset.mul_sum]
      _ = (1 / G ^ 2) * (1 - 1 / ((lo : ℝ) + 1)) := by rw [sum_telescope]
  have hright : ∑ j ∈ Finset.Ico (lo + 2) (lo + 2 + M), 1 / ((y (lo + 1) - y j) * (y lo - y j))
      ≤ (1 / G ^ 2) * (1 - 1 / ((M : ℝ) + 1)) := by
    rw [Finset.sum_Ico_eq_sum_range]
    have hM : lo + 2 + M - (lo + 2) = M := by omega
    rw [hM]
    have hb : ∀ k ∈ Finset.range M,
        1 / ((y (lo + 1) - y (lo + 2 + k)) * (y lo - y (lo + 2 + k)))
          ≤ (1 / G ^ 2) * (1 / (((k : ℝ) + 1) * ((k : ℝ) + 2))) := by
      intro k hk
      simp only [Finset.mem_range] at hk
      have h1 : ((k : ℝ) + 1) * G ≤ y (lo + 2 + k) - y (lo + 1) := by
        have hs := spread (k + 1) (lo + 1) (by omega)
        have he : (lo + 1) + (k + 1) = lo + 2 + k := by omega
        rw [he] at hs; push_cast at hs ⊢; linarith
      have h2 : ((k : ℝ) + 2) * G ≤ y (lo + 2 + k) - y lo := by
        have hs := spread (k + 2) lo (by omega)
        have he : lo + (k + 2) = lo + 2 + k := by omega
        rw [he] at hs; push_cast at hs ⊢; linarith
      have heq : (y (lo + 1) - y (lo + 2 + k)) * (y lo - y (lo + 2 + k))
          = (y (lo + 2 + k) - y (lo + 1)) * (y (lo + 2 + k) - y lo) := by ring
      have hprod : ((k : ℝ) + 1) * G * (((k : ℝ) + 2) * G)
          ≤ (y (lo + 2 + k) - y (lo + 1)) * (y (lo + 2 + k) - y lo) :=
        mul_le_mul h1 h2 (by positivity) (by nlinarith)
      have hrhs : (1 / G ^ 2) * (1 / (((k : ℝ) + 1) * ((k : ℝ) + 2)))
          = 1 / ((((k : ℝ) + 1) * G) * (((k : ℝ) + 2) * G)) := by
        field_simp
      rw [heq, hrhs]
      exact one_div_le_one_div_of_le (by positivity) hprod
    calc ∑ k ∈ Finset.range M, 1 / ((y (lo + 1) - y (lo + 2 + k)) * (y lo - y (lo + 2 + k)))
        ≤ ∑ k ∈ Finset.range M, (1 / G ^ 2) * (1 / (((k : ℝ) + 1) * ((k : ℝ) + 2))) :=
          Finset.sum_le_sum hb
      _ = (1 / G ^ 2) * ∑ k ∈ Finset.range M, (1 : ℝ) / (((k : ℝ) + 1) * ((k : ℝ) + 2)) := by
          rw [Finset.mul_sum]
      _ = (1 / G ^ 2) * (1 - 1 / ((M : ℝ) + 1)) := by rw [sum_telescope]
  have hfin : (1 / G ^ 2) * (1 - 1 / ((lo : ℝ) + 1)) + (1 / G ^ 2) * (1 - 1 / ((M : ℝ) + 1))
      = (1 / G ^ 2) * ((1 - 1 / ((lo : ℝ) + 1)) + (1 - 1 / (((M + 1 : ℕ) : ℝ)))) := by
    push_cast
    ring
  linarith [hleft, hright, hfin]

/-- **The gate holds rigorously at `s = 0`:** `B G² < 2`, uniformly in `N`. -/
theorem bgStatic_mul_sq_lt_two {N lo : ℕ} {y : ℕ → ℝ} {G : ℝ} (hN : lo + 1 < N)
    (hmono : ∀ i < N, ∀ j < N, i < j → y i < y j)
    (hG : G = y (lo + 1) - y lo)
    (hmin : ∀ k, k + 1 < N → G ≤ y (k + 1) - y k) :
    bgStatic N y lo (lo + 1) * G ^ 2 < 2 := by
  have hGpos : 0 < G := by
    rw [hG]; linarith [hmono lo (by omega) (lo + 1) (by omega) (by omega)]
  have hGne : G ≠ 0 := ne_of_gt hGpos
  have hbound := bgStatic_telescope_bound hN hmono hG hmin
  have hnat : (0:ℝ) < ((N - lo - 1 : ℕ) : ℝ) := by
    have h : 0 < N - lo - 1 := by omega
    exact_mod_cast h
  have hmul := mul_le_mul_of_nonneg_right hbound (sq_nonneg G)
  have hsimp : (1 / G ^ 2) * ((1 - 1 / ((lo : ℝ) + 1)) + (1 - 1 / ((N - lo - 1 : ℕ) : ℝ)))
      * G ^ 2 = (1 - 1 / ((lo : ℝ) + 1)) + (1 - 1 / ((N - lo - 1 : ℕ) : ℝ)) := by
    field_simp
  rw [hsimp] at hmul
  have h1 : (0:ℝ) < 1 / ((lo : ℝ) + 1) := by positivity
  have h2 : (0:ℝ) < 1 / ((N - lo - 1 : ℕ) : ℝ) := by positivity
  linarith

/-! ### Non-vacuity: an explicit two-particle solution -/

/-- The explicit two-particle solution `x₀(s) = -√(g² - 8s)/2`, `x₁(s) = √(g² - 8s)/2`
of the attractive Calogero–Moser flow, with initial gap `g` and collision time `g²/8`. -/
noncomputable def twoParticle (g : ℝ) : ℕ → ℝ → ℝ
  | 0 => fun s => -Real.sqrt (g ^ 2 - 8 * s) / 2
  | _ => fun s => Real.sqrt (g ^ 2 - 8 * s) / 2

/-- The two-particle configuration really is a Calogero–Moser flow on `[0, g²/8)`. -/
lemma twoParticle_isCMFlow (g : ℝ) : IsCMFlow 2 (g ^ 2 / 8) (twoParticle g) := by
  have hposarg : ∀ s ∈ Set.Ico (0:ℝ) (g ^ 2 / 8), 0 < g ^ 2 - 8 * s := by
    intro s hs; have := hs.2; linarith
  have hsqrtpos : ∀ s ∈ Set.Ico (0:ℝ) (g ^ 2 / 8), 0 < Real.sqrt (g ^ 2 - 8 * s) :=
    fun s hs => Real.sqrt_pos.2 (hposarg s hs)
  have hderiv : ∀ s ∈ Set.Ico (0:ℝ) (g ^ 2 / 8),
      HasDerivAt (fun t => Real.sqrt (g ^ 2 - 8 * t)) (-4 / Real.sqrt (g ^ 2 - 8 * s)) s := by
    intro s hs
    have hne : g ^ 2 - 8 * s ≠ 0 := ne_of_gt (hposarg s hs)
    have h1 : HasDerivAt (fun t : ℝ => g ^ 2 - 8 * t) (-8) s := by
      simpa using ((hasDerivAt_id s).const_mul (8:ℝ)).const_sub (g ^ 2)
    have h2 := (Real.hasDerivAt_sqrt hne).comp s h1
    convert h2 using 1
    have := hsqrtpos s hs
    field_simp
    ring
  constructor
  · intro k hk s hs
    have hsp := hsqrtpos s hs
    have hne : Real.sqrt (g ^ 2 - 8 * s) ≠ 0 := ne_of_gt hsp
    interval_cases k
    · have he : (Finset.range 2).erase 0 = {1} := by decide
      rw [he, Finset.sum_singleton]
      show HasDerivAt (fun s => -Real.sqrt (g ^ 2 - 8 * s) / 2) _ s
      have hd := ((hderiv s hs).neg).div_const 2
      convert hd using 1
      show -2 * (1 / (-Real.sqrt (g ^ 2 - 8 * s) / 2 - Real.sqrt (g ^ 2 - 8 * s) / 2)) = _
      field_simp
      ring
    · have he : (Finset.range 2).erase 1 = {0} := by decide
      rw [he, Finset.sum_singleton]
      show HasDerivAt (fun s => Real.sqrt (g ^ 2 - 8 * s) / 2) _ s
      have hd := (hderiv s hs).div_const 2
      convert hd using 1
      show -2 * (1 / (Real.sqrt (g ^ 2 - 8 * s) / 2 - -Real.sqrt (g ^ 2 - 8 * s) / 2)) = _
      field_simp
      ring
  · intro s hs i hi j hj hij
    have hsp := hsqrtpos s hs
    have hi0 : i = 0 := by omega
    have hj1 : j = 1 := by omega
    subst hi0; subst hj1
    show -Real.sqrt (g ^ 2 - 8 * s) / 2 < Real.sqrt (g ^ 2 - 8 * s) / 2
    linarith

/-- **Non-vacuity of Theorem B.** For every initial gap `g > 0` and every `β > 0` passing
the gate, the explicit two-particle flow satisfies all hypotheses of `minGap_sandwich`. -/
theorem twoParticle_satisfies_sandwich_hypotheses {g beta : ℝ} (hg : 0 < g)
    (hbeta_pos : 0 < beta) :
    IsCMFlow 2 (g ^ 2 / 8) (twoParticle g) ∧
      (∀ k, k + 1 < 2 → ∀ s ∈ Set.Ico (0:ℝ) (g ^ 2 / 8),
        |bgStatic 2 (fun i => twoParticle g i s) k (k + 1)| ≤ beta) ∧
      (∀ k, k + 1 < 2 → g ≤ twoParticle g (k + 1) 0 - twoParticle g k 0) ∧
      twoParticle g (0 + 1) 0 - twoParticle g 0 0 = g ∧
      (∀ ε > 0, ∃ s ∈ Set.Ico (0:ℝ) (g ^ 2 / 8), ∃ k, k + 1 < 2 ∧
        twoParticle g (k + 1) s - twoParticle g k s < ε) := by
  have hgap0 : twoParticle g (0 + 1) 0 - twoParticle g 0 0 = g := by
    show Real.sqrt (g ^ 2 - 8 * 0) / 2 - -Real.sqrt (g ^ 2 - 8 * 0) / 2 = g
    rw [show g ^ 2 - 8 * (0:ℝ) = g ^ 2 by ring, Real.sqrt_sq hg.le]
    ring
  refine ⟨twoParticle_isCMFlow g, ?_, ?_, hgap0, ?_⟩
  · intro k hk s _
    have hk0 : k = 0 := by omega
    subst hk0
    have hempty : (Finset.range 2) \ {0, 1} = (∅ : Finset ℕ) := by decide
    rw [bgStatic, hempty, Finset.sum_empty, abs_zero]
    exact hbeta_pos.le
  · intro k hk
    have hk0 : k = 0 := by omega
    subst hk0
    exact le_of_eq hgap0.symm
  · intro ε hε
    set e := min ε g / 2 with he
    have hepos : 0 < e := by positivity
    have heg : e < g := by
      have : min ε g ≤ g := min_le_right _ _
      simp only [he]; linarith
    have heeps : e < ε := by
      have : min ε g ≤ ε := min_le_left _ _
      simp only [he]; linarith
    refine ⟨(g ^ 2 - e ^ 2) / 8, ⟨by nlinarith, by nlinarith⟩, 0, by omega, ?_⟩
    show Real.sqrt (g ^ 2 - 8 * ((g ^ 2 - e ^ 2) / 8)) / 2
        - -Real.sqrt (g ^ 2 - 8 * ((g ^ 2 - e ^ 2) / 8)) / 2 < ε
    rw [show g ^ 2 - 8 * ((g ^ 2 - e ^ 2) / 8) = e ^ 2 by ring, Real.sqrt_sq hepos.le]
    linarith

/-- Theorem B instantiated at the explicit two-particle flow, whose collision time is
exactly `g²/8`. -/
theorem twoParticle_sandwich {g beta : ℝ} (hg : 0 < g) (hbeta_pos : 0 < beta)
    (hgate : beta * g ^ 2 < 2) :
    (1 / (4 * beta)) * Real.log (1 + beta * g ^ 2 / 2) ≤ g ^ 2 / 8 ∧
      g ^ 2 / 8 ≤ (1 / (4 * beta)) * Real.log (2 / (2 - beta * g ^ 2)) := by
  obtain ⟨hflow, hbeta, hg_le, hgp, htc⟩ :=
    twoParticle_satisfies_sandwich_hypotheses (beta := beta) hg hbeta_pos
  exact minGap_sandwich hflow hbeta_pos hbeta hg hg_le 0 (by omega) hgp hgate htc

end MinGap
