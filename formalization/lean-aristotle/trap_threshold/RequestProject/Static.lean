import Mathlib

/-!
# Static core of the minimal-gap trap threshold

This file contains the *static* (purely algebraic) core of Theorem B:
the sharp threshold `Θ_b = (√73 - 5)/8` for the boundary rate

  `rate μ = -4 S + S² + 6 ∑ μ_j² + 2 ∑ μ_j³`,  `S = ∑ μ_j`,

for finite families `μ` with `0 ≤ μ_j ≤ 1/2`.

* `ThetaTrap.rate_nonpos_of_sum_le` (TARGET S1): `S ≤ 2Θ_b` implies `rate μ ≤ 0`.
* `ThetaTrap.rate_le_of_sum_ge` : quantitative companion of S1 above the threshold.
* `ThetaTrap.rate_pos_of_gt_ThetaB` (TARGET S3): sharpness of the threshold.
-/

open scoped BigOperators

namespace ThetaTrap

/-- The sharp trap threshold `Θ_b = (√73 - 5)/8 = 0.443…`. -/
noncomputable def ThetaB : ℝ := (Real.sqrt 73 - 5) / 8

/-- The residual `r_b = (√73 - 7)/4 = 0.386…`, the positive root of `2r² + 7r - 3`. -/
noncomputable def rB : ℝ := (Real.sqrt 73 - 7) / 4

/-- The boundary rate `-4S + S² + 6∑μ² + 2∑μ³` of a finite family `μ`. -/
noncomputable def rate {ι : Type*} (s : Finset ι) (mu : ι → ℝ) : ℝ :=
  -4 * (∑ j ∈ s, mu j) + (∑ j ∈ s, mu j) ^ 2
    + 6 * (∑ j ∈ s, (mu j) ^ 2) + 2 * (∑ j ∈ s, (mu j) ^ 3)

lemma sqrt73_sq : Real.sqrt 73 ^ 2 = 73 := by
  rw [sq]; exact Real.mul_self_sqrt (by norm_num)

lemma sqrt73_lower : (8.544 : ℝ) < Real.sqrt 73 := by
  nlinarith [sqrt73_sq, Real.sqrt_nonneg 73]

lemma sqrt73_upper : Real.sqrt 73 < 8.545 := by
  nlinarith [sqrt73_sq, Real.sqrt_nonneg 73]

/-- `Θ_b = 1/4 + r_b/2`. -/
lemma ThetaB_eq_quarter_add : ThetaB = 1 / 4 + rB / 2 := by
  unfold ThetaB rB; ring

/-- `r_b` is a root of `2r² + 7r - 3`. -/
lemma rB_root : 2 * rB ^ 2 + 7 * rB - 3 = 0 := by
  unfold rB; nlinarith [sqrt73_sq]

/-- `S_b = 2Θ_b` is a root of `2S² + 5S - 6`. -/
lemma SB_root : 2 * (2 * ThetaB) ^ 2 + 5 * (2 * ThetaB) - 6 = 0 := by
  unfold ThetaB; nlinarith [sqrt73_sq]

lemma ThetaB_pos : 0 < ThetaB := by
  unfold ThetaB; nlinarith [sqrt73_lower]

lemma ThetaB_lt_half : ThetaB < 1 / 2 := by
  unfold ThetaB; nlinarith [sqrt73_upper]

lemma quarter_lt_ThetaB : (1 : ℝ) / 4 < ThetaB := by
  unfold ThetaB; nlinarith [sqrt73_lower]

/-- Elementary bound: if all members of a family are bounded by `m`, the cubic energy
`∑ (6μ² + 2μ³)` is at most `(6m + 2m²) ∑ μ`. -/
lemma sum_energy_le {ι : Type*} (s : Finset ι) (mu : ι → ℝ) (m : ℝ)
    (h0 : ∀ j ∈ s, 0 ≤ mu j) (hm : ∀ j ∈ s, mu j ≤ m) :
    ∑ j ∈ s, (6 * (mu j) ^ 2 + 2 * (mu j) ^ 3) ≤ (6 * m + 2 * m ^ 2) * ∑ j ∈ s, mu j := by
  rw [Finset.mul_sum]
  refine Finset.sum_le_sum fun j hj => ?_
  have h1 := h0 j hj
  have h2 := hm j hj
  nlinarith [sq_nonneg (mu j), sq_nonneg (m - mu j)]

/-- Two-part (capped-greedy) bound at the threshold: the exact two-part boundary value is
nonpositive when the total mass is at most `S_b = 2Θ_b`. -/
lemma two_part_bound (m R : ℝ) (hR0 : 0 ≤ R) (hRm : R ≤ m) (hm : m ≤ 1 / 2)
    (hS : 2 * (m + R) ^ 2 + 5 * (m + R) ≤ 6) :
    2 * m ^ 3 + 6 * m ^ 2 + 2 * R ^ 3 + 6 * R ^ 2 + (m + R) ^ 2 - 4 * (m + R) ≤ 0 := by
  nlinarith [sq_nonneg (m - R), sq_nonneg (m + R),
    mul_nonneg (sub_nonneg.mpr hm) (sub_nonneg.mpr hRm), mul_nonneg hR0 (sub_nonneg.mpr hRm),
    mul_nonneg hR0 (sub_nonneg.mpr hm), sq_nonneg (m + R - 1 / 2)]

/-- Capped-greedy majorization for two parts: pushing mass from the smaller part onto a
saturated cap increases the cubic energy. -/
lemma greedy_two (m R : ℝ) (hRm : R ≤ m) (hd0 : 0 ≤ 1 / 2 - m) (hRd : 0 ≤ R - (1 / 2 - m)) :
    2 * m ^ 3 + 6 * m ^ 2 + 2 * R ^ 3 + 6 * R ^ 2
      ≤ 2 * (1 / 2 : ℝ) ^ 3 + 6 * (1 / 2) ^ 2 + 2 * (m + R - 1 / 2) ^ 3
        + 6 * (m + R - 1 / 2) ^ 2 := by
  have h : R - (1 / 2 - m) = m + R - 1 / 2 := by ring
  rw [← h]
  nlinarith [sq_nonneg (m - R), mul_nonneg hd0 hRd, sq_nonneg (m + R)]

/-- One-variable boundary algebra: the greedy boundary value `r(2r² + 7r - 3)` at
`S = 1/2 + r` grows at most linearly in the excess `r - r_b` past the root `r_b`. -/
lemma one_var_boundary (Rp rb : ℝ) (h0 : 0 ≤ rb) (hrb : 2 * rb ^ 2 + 7 * rb - 3 = 0)
    (hge : rb ≤ Rp) (hle : Rp ≤ 1 / 2) :
    Rp * (2 * Rp ^ 2 + 7 * Rp - 3) ≤ 8 * (Rp - rb) := by
  have hrbu : rb ≤ 0.4 := by nlinarith
  nlinarith [mul_nonneg (sub_nonneg.mpr hge) (sub_nonneg.mpr hle), sq_nonneg Rp]

/-- Quantitative two-part bound above the threshold. -/
lemma two_part_bound_quant (m R SB : ℝ) (hR0 : 0 ≤ R) (hRm : R ≤ m) (hm : m ≤ 1 / 2)
    (hSge : SB ≤ m + R) (hSB : 2 * SB ^ 2 + 5 * SB - 6 = 0) (hSB0 : 0 < SB) :
    2 * m ^ 3 + 6 * m ^ 2 + 2 * R ^ 3 + 6 * R ^ 2 + (m + R) ^ 2 - 4 * (m + R)
      ≤ 8 * ((m + R) - SB) := by
  have hSBlb : 1 / 2 < SB := by nlinarith
  have step1 := greedy_two m R hRm (by linarith) (by linarith)
  have hrb : 2 * (SB - 1 / 2) ^ 2 + 7 * (SB - 1 / 2) - 3 = 0 := by nlinarith [hSB]
  have step2 := one_var_boundary (m + R - 1 / 2) (SB - 1 / 2) (by linarith) hrb (by linarith)
    (by linarith)
  nlinarith [step1, step2]

/-- Splitting bound: singling out one member `j₀`, the cubic energy of the family is at most
the two-part energy of `(μ j₀, S - μ j₀)`. -/
lemma sum_energy_split {ι : Type*} [DecidableEq ι] (s : Finset ι) (mu : ι → ℝ) (j0 : ι)
    (hj0 : j0 ∈ s) (h0 : ∀ j ∈ s, 0 ≤ mu j) :
    ∑ j ∈ s, (6 * (mu j) ^ 2 + 2 * (mu j) ^ 3)
      ≤ (6 * (mu j0) ^ 2 + 2 * (mu j0) ^ 3)
        + (6 * (∑ j ∈ s.erase j0, mu j) ^ 2 + 2 * (∑ j ∈ s.erase j0, mu j) ^ 3) := by
  have hsplit : ∑ j ∈ s, (6 * (mu j) ^ 2 + 2 * (mu j) ^ 3)
      = (6 * (mu j0) ^ 2 + 2 * (mu j0) ^ 3)
        + ∑ j ∈ s.erase j0, (6 * (mu j) ^ 2 + 2 * (mu j) ^ 3) :=
    (Finset.add_sum_erase _ _ hj0).symm
  rw [hsplit]
  have hle : ∀ j ∈ s.erase j0, mu j ≤ ∑ i ∈ s.erase j0, mu i := fun j hj =>
    Finset.single_le_sum (f := mu) (fun i hi => h0 i (Finset.mem_of_mem_erase hi)) hj
  have key := Finset.sum_le_sum (s := s.erase j0)
    (f := fun j => 6 * (mu j) ^ 2 + 2 * (mu j) ^ 3)
    (g := fun j => (6 * (∑ i ∈ s.erase j0, mu i) + 2 * (∑ i ∈ s.erase j0, mu i) ^ 2) * mu j)
    (fun j hj => by
      have h1 := h0 j (Finset.mem_of_mem_erase hj)
      have h2 := hle j hj
      dsimp only
      nlinarith [mul_nonneg h1 (sub_nonneg.mpr h2),
        mul_nonneg (mul_nonneg h1 (sub_nonneg.mpr h2))
          (by linarith : (0 : ℝ) ≤ (∑ i ∈ s.erase j0, mu i) + mu j)])
  rw [← Finset.mul_sum] at key
  nlinarith [key]

/-- The boundary rate split into its linear-quadratic part and its cubic energy. -/
lemma rate_eq {ι : Type*} (s : Finset ι) (mu : ι → ℝ) :
    rate s mu = -4 * (∑ j ∈ s, mu j) + (∑ j ∈ s, mu j) ^ 2
      + ∑ j ∈ s, (6 * (mu j) ^ 2 + 2 * (mu j) ^ 3) := by
  simp only [rate, Finset.sum_add_distrib, Finset.mul_sum]
  ring

/-- **TARGET S1** (static core).  For every finite family `μ ∈ [0,1/2]^K` whose total mass is
at most `2Θ_b`, the boundary rate `-4S + S² + 6∑μ² + 2∑μ³` is nonpositive.
The inequality is *not* strict: equality holds at the capped-greedy profile with `S = 2Θ_b`,
and already at `μ = (1/2)`. -/
theorem rate_nonpos_of_sum_le {ι : Type*} [DecidableEq ι] (s : Finset ι) (mu : ι → ℝ)
    (h0 : ∀ j ∈ s, 0 ≤ mu j) (hcap : ∀ j ∈ s, mu j ≤ 1 / 2)
    (hS : ∑ j ∈ s, mu j ≤ 2 * ThetaB) :
    rate s mu ≤ 0 := by
  rcases s.eq_empty_or_nonempty with rfl | hne
  · simp [rate]
  obtain ⟨j0, hj0, hmax⟩ := Finset.exists_max_image s mu hne
  have hS0 : 0 ≤ ∑ j ∈ s, mu j := Finset.sum_nonneg h0
  have hquad : 2 * (∑ j ∈ s, mu j) ^ 2 + 5 * (∑ j ∈ s, mu j) - 6 ≤ 0 := by
    have hB := SB_root
    have hBpos : 0 < 2 * ThetaB := by have := ThetaB_pos; linarith
    nlinarith [hS, hS0]
  rw [rate_eq]
  by_cases hcase : 2 * mu j0 ≤ ∑ j ∈ s, mu j
  · -- the maximal member carries at most half the mass: a uniform linear bound suffices
    have hE := sum_energy_le s mu (mu j0) h0 hmax
    have hm0 : 0 ≤ mu j0 := h0 j0 hj0
    nlinarith [hE, hS0, hquad, hcase, hm0, sq_nonneg (∑ j ∈ s, mu j)]
  · -- otherwise the profile is dominated by the two-part (capped-greedy) profile
    push_neg at hcase
    have hR : ∑ j ∈ s.erase j0, mu j = (∑ j ∈ s, mu j) - mu j0 := Finset.sum_erase_eq_sub hj0
    have hR0 : 0 ≤ ∑ j ∈ s.erase j0, mu j :=
      Finset.sum_nonneg fun j hj => h0 j (Finset.mem_of_mem_erase hj)
    have hsplit := sum_energy_split s mu j0 hj0 h0
    rw [hR] at hsplit hR0
    have hsum : mu j0 + ((∑ j ∈ s, mu j) - mu j0) = ∑ j ∈ s, mu j := by ring
    have h2 := two_part_bound (mu j0) ((∑ j ∈ s, mu j) - mu j0) hR0 (by linarith)
      (hcap j0 hj0) (by rw [hsum]; linarith)
    rw [hsum] at h2
    linarith [hsplit, h2]

/-- Quantitative companion of S1: above the threshold (and below total mass `1`) the boundary
rate grows at most linearly in the excess mass. -/
theorem rate_le_of_sum_ge {ι : Type*} [DecidableEq ι] (s : Finset ι) (mu : ι → ℝ)
    (h0 : ∀ j ∈ s, 0 ≤ mu j) (hcap : ∀ j ∈ s, mu j ≤ 1 / 2)
    (hSge : 2 * ThetaB ≤ ∑ j ∈ s, mu j) (hS1 : ∑ j ∈ s, mu j ≤ 1) :
    rate s mu ≤ 8 * ((∑ j ∈ s, mu j) - 2 * ThetaB) := by
  have hBpos : 0 < 2 * ThetaB := by have := ThetaB_pos; linarith
  rcases s.eq_empty_or_nonempty with rfl | hne
  · simp only [Finset.sum_empty] at hSge; linarith
  obtain ⟨j0, hj0, hmax⟩ := Finset.exists_max_image s mu hne
  have hS0 : 0 ≤ ∑ j ∈ s, mu j := Finset.sum_nonneg h0
  rw [rate_eq]
  by_cases hcase : 2 * mu j0 ≤ ∑ j ∈ s, mu j
  · have hE := sum_energy_le s mu (mu j0) h0 hmax
    have hm0 : 0 ≤ mu j0 := h0 j0 hj0
    have hBub : 2 * ThetaB ≤ 0.887 := by
      unfold ThetaB; nlinarith [sqrt73_upper]
    nlinarith [hE, hS0, hcase, hm0, sq_nonneg (∑ j ∈ s, mu j)]
  · push_neg at hcase
    have hR : ∑ j ∈ s.erase j0, mu j = (∑ j ∈ s, mu j) - mu j0 := Finset.sum_erase_eq_sub hj0
    have hR0 : 0 ≤ ∑ j ∈ s.erase j0, mu j :=
      Finset.sum_nonneg fun j hj => h0 j (Finset.mem_of_mem_erase hj)
    have hsplit := sum_energy_split s mu j0 hj0 h0
    rw [hR] at hsplit hR0
    have hsum : mu j0 + ((∑ j ∈ s, mu j) - mu j0) = ∑ j ∈ s, mu j := by ring
    have h2 := two_part_bound_quant (mu j0) ((∑ j ∈ s, mu j) - mu j0) (2 * ThetaB) hR0
      (by linarith) (hcap j0 hj0) (by rw [hsum]; exact hSge) SB_root hBpos
    rw [hsum] at h2
    linarith [hsplit, h2]

/-- **TARGET S3** (sharpness).  For every level `Θ* ∈ (Θ_b, 1/2]` the two-part profile
`μ = (1/2, 2Θ* - 1/2)` lies in `[0,1/2]²`, has total mass `S = 2Θ*`, and makes the boundary
rate strictly positive.  Hence the threshold `Θ_b` is exact. -/
theorem rate_pos_of_gt_ThetaB (Ts : ℝ) (h1 : ThetaB < Ts) (h2 : Ts ≤ 1 / 2) :
    (∀ j : Fin 2, 0 ≤ (![1 / 2, 2 * Ts - 1 / 2] : Fin 2 → ℝ) j) ∧
    (∀ j : Fin 2, (![1 / 2, 2 * Ts - 1 / 2] : Fin 2 → ℝ) j ≤ 1 / 2) ∧
    (∑ j : Fin 2, (![1 / 2, 2 * Ts - 1 / 2] : Fin 2 → ℝ) j) = 2 * Ts ∧
    0 < rate Finset.univ (![1 / 2, 2 * Ts - 1 / 2] : Fin 2 → ℝ) := by
  have hq := quarter_lt_ThetaB
  have hr0 : 0 < 2 * Ts - 1 / 2 := by linarith
  have hrhalf : 2 * Ts - 1 / 2 ≤ 1 / 2 := by linarith
  refine ⟨?_, ?_, ?_, ?_⟩
  · intro j
    fin_cases j
    · norm_num
    · simpa using hr0.le
  · intro j
    fin_cases j
    · norm_num
    · simpa using hrhalf
  · simp [Fin.sum_univ_two]
  · -- the boundary value is `r (2r² + 7r - 3)` at `r = 2Θ* - 1/2 > r_b`
    have hrB : 2 * (2 * Ts - 1 / 2) ^ 2 + 7 * (2 * Ts - 1 / 2) - 3 > 0 := by
      have hroot := SB_root
      nlinarith [ThetaB_pos, h1]
    rw [rate]
    simp only [Fin.sum_univ_two, Matrix.cons_val_zero, Matrix.cons_val_one]
    nlinarith [hr0, hrB]

/-- The capped-greedy profile at total mass `S = 1/2 + r`: its boundary value is exactly
`r (2r² + 7r - 3)`. -/
lemma greedy_rate_formula (r : ℝ) :
    rate Finset.univ (![1 / 2, r] : Fin 2 → ℝ) = r * (2 * r ^ 2 + 7 * r - 3) := by
  rw [rate]
  simp only [Fin.sum_univ_two, Matrix.cons_val_zero, Matrix.cons_val_one]
  ring

/-- The greedy boundary value is nonpositive exactly up to the residual threshold `r_b`,
i.e. exactly up to `Θ = Θ_b`. -/
lemma greedy_rate_nonpos_iff {r : ℝ} (hr : 0 ≤ r) :
    rate Finset.univ (![1 / 2, r] : Fin 2 → ℝ) ≤ 0 ↔ r ≤ rB := by
  have hrB0 : 0 < rB := by unfold rB; nlinarith [sqrt73_lower]
  have hroot := rB_root
  have hfac : r * (2 * r ^ 2 + 7 * r - 3) = r * ((r - rB) * (2 * r + 2 * rB + 7)) := by
    nlinarith [hroot]
  rw [greedy_rate_formula, hfac]
  constructor
  · intro h
    by_contra hcon
    push_neg at hcon
    have h1 : 0 < r - rB := by linarith
    have h2 : 0 < 2 * r + 2 * rB + 7 := by linarith
    have h3 : 0 < r := lt_of_le_of_lt hrB0.le hcon
    exact absurd h (not_le.mpr (mul_pos h3 (mul_pos h1 h2)))
  · intro h
    have h2 : 0 < 2 * r + 2 * rB + 7 := by linarith
    have h1 : r - rB ≤ 0 := by linarith
    have hq : (r - rB) * (2 * r + 2 * rB + 7) ≤ 0 :=
      mul_nonpos_of_nonpos_of_nonneg h1 h2.le
    have := mul_nonneg hr (neg_nonneg.mpr hq)
    nlinarith [this]

end ThetaTrap
