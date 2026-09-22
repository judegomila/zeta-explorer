import RequestProject.PartialFractions

/-!
# The finite piece

Second display of Lemma PF: for `a > 0` and `0 ≤ T < c`,

`∫_0^T dx/((x+a)^s (c-x)^s) = ∑_{k=1}^s p_k (J_a(k) + J_c(k))`

with `p_k = binom(2s-k-1, s-k) S^{-(2s-k)}`, `S = a + c`, and `J_a`, `J_c` as in `Jfun_a`,
`Jfun_c`.
-/

open MeasureTheory Set Filter
open scoped BigOperators Topology

namespace WeldPF

/-- Antiderivative of `x ↦ (x+a)^{-k}`. -/
noncomputable def Gpiece_a (a : ℝ) (k : ℕ) (x : ℝ) : ℝ :=
  if k = 1 then Real.log (x + a) else (x + a) ^ (1 - (k : ℤ)) / (1 - (k : ℝ))

/-- Antiderivative of `x ↦ (c-x)^{-k}`. -/
noncomputable def Gpiece_c (c : ℝ) (k : ℕ) (x : ℝ) : ℝ :=
  if k = 1 then -Real.log (c - x) else (c - x) ^ (1 - (k : ℤ)) / ((k : ℝ) - 1)

/-- The antiderivative of the finite-piece integrand. -/
noncomputable def Gfin (s : ℕ) (a c : ℝ) (x : ℝ) : ℝ :=
  ∑ k ∈ Finset.Icc 1 s, pCoeff s k (a + c) * (Gpiece_a a k x + Gpiece_c c k x)

lemma Gpiece_a_hasDerivAt {a : ℝ} {k : ℕ} (hk : 1 ≤ k) {x : ℝ} (hx : x + a ≠ 0) :
    HasDerivAt (Gpiece_a a k) ((x + a) ^ (-(k : ℤ))) x := by
  have hd : HasDerivAt (fun x : ℝ => x + a) 1 x := (hasDerivAt_id x).add_const a
  by_cases hk1 : k = 1
  · have hfun : Gpiece_a a k = fun x : ℝ => Real.log (x + a) := by
      funext y; simp [Gpiece_a, hk1]
    rw [hfun, hk1]
    simpa [one_div] using hd.log hx
  · have hfun : Gpiece_a a k = fun x : ℝ => (x + a) ^ (1 - (k : ℤ)) / (1 - (k : ℝ)) := by
      funext y; simp [Gpiece_a, hk1]
    have hkR : (1 - (k : ℝ)) ≠ 0 := by
      have hk2 : 2 ≤ k := by omega
      have : (2 : ℝ) ≤ (k : ℝ) := by exact_mod_cast hk2
      intro hcon; linarith
    rw [hfun]
    have hp : HasDerivAt (fun y : ℝ => (y + a) ^ (1 - (k : ℤ)))
        ((1 - (k : ℝ)) * (x + a) ^ (-(k : ℤ))) x := by
      have h := (hasDerivAt_zpow (1 - (k : ℤ)) (x + a) (Or.inl hx)).comp x hd
      simpa [show (1 - (k : ℤ)) - 1 = -(k : ℤ) by ring] using h
    have h := hp.div_const (1 - (k : ℝ))
    convert h using 1
    field_simp

lemma Gpiece_c_hasDerivAt {c : ℝ} {k : ℕ} (hk : 1 ≤ k) {x : ℝ} (hx : c - x ≠ 0) :
    HasDerivAt (Gpiece_c c k) ((c - x) ^ (-(k : ℤ))) x := by
  have hd : HasDerivAt (fun x : ℝ => c - x) (-1) x := by
    simpa using (hasDerivAt_id x).const_sub c
  by_cases hk1 : k = 1
  · have hfun : Gpiece_c c k = fun x : ℝ => -Real.log (c - x) := by
      funext y; simp [Gpiece_c, hk1]
    rw [hfun, hk1]
    have h := (hd.log hx).neg
    simpa [one_div, neg_div] using h
  · have hfun : Gpiece_c c k = fun x : ℝ => (c - x) ^ (1 - (k : ℤ)) / ((k : ℝ) - 1) := by
      funext y; simp [Gpiece_c, hk1]
    have hkR : ((k : ℝ) - 1) ≠ 0 := by
      have hk2 : 2 ≤ k := by omega
      have : (2 : ℝ) ≤ (k : ℝ) := by exact_mod_cast hk2
      intro hcon; linarith
    rw [hfun]
    have hp : HasDerivAt (fun y : ℝ => (c - y) ^ (1 - (k : ℤ)))
        (-((1 - (k : ℝ)) * (c - x) ^ (-(k : ℤ)))) x := by
      have h := (hasDerivAt_zpow (1 - (k : ℤ)) (c - x) (Or.inl hx)).comp x hd
      simpa [show (1 - (k : ℤ)) - 1 = -(k : ℤ) by ring, mul_comm] using h
    have h := hp.div_const ((k : ℝ) - 1)
    convert h using 1
    field_simp
    ring

lemma Gfin_hasDerivAt {s : ℕ} (hs : 0 < s) {a c : ℝ} {x : ℝ} (ha : x + a ≠ 0) (hc : c - x ≠ 0)
    (hS : a + c ≠ 0) :
    HasDerivAt (Gfin s a c) (((x + a) ^ s * (c - x) ^ s)⁻¹) x := by
  have hterm : ∀ k ∈ Finset.Icc 1 s,
      HasDerivAt (fun y : ℝ => pCoeff s k (a + c) * (Gpiece_a a k y + Gpiece_c c k y))
        (pCoeff s k (a + c) * ((x + a) ^ (-(k : ℤ)) + (c - x) ^ (-(k : ℤ)))) x := by
    intro k hk
    simp only [Finset.mem_Icc] at hk
    exact ((Gpiece_a_hasDerivAt hk.1 ha).add (Gpiece_c_hasDerivAt hk.1 hc)).const_mul _
  have hsum := HasDerivAt.sum hterm
  have hfun : (∑ k ∈ Finset.Icc 1 s, fun y : ℝ =>
        pCoeff s k (a + c) * (Gpiece_a a k y + Gpiece_c c k y)) = Gfin s a c := by
    funext y
    simp [Gfin]
  rw [hfun] at hsum
  rw [pf_finite hs ha hc hS]
  exact hsum

/-- **Lemma PF, second display.** The exact closed form of the finite piece. -/
theorem finite_piece_eq {s : ℕ} (hs : 0 < s) {T a c : ℝ} (ha : 0 < a) (hT : 0 ≤ T) (hTc : T < c) :
    ∫ x in (0 : ℝ)..T, ((x + a) ^ s * (c - x) ^ s)⁻¹
      = ∑ k ∈ Finset.Icc 1 s, pCoeff s k (a + c) * (Jfun_a T a k + Jfun_c T c k) := by
  have hc0 : 0 < c := lt_of_le_of_lt hT hTc
  have hS : a + c ≠ 0 := by positivity
  have hmem : ∀ x ∈ uIcc (0 : ℝ) T, 0 < x + a ∧ 0 < c - x := by
    intro x hx
    rw [uIcc_of_le hT] at hx
    obtain ⟨hx0, hxT⟩ := hx
    exact ⟨by linarith, by linarith⟩
  have hderiv : ∀ x ∈ uIcc (0 : ℝ) T,
      HasDerivAt (Gfin s a c) (((x + a) ^ s * (c - x) ^ s)⁻¹) x := by
    intro x hx
    obtain ⟨h1, h2⟩ := hmem x hx
    exact Gfin_hasDerivAt hs (ne_of_gt h1) (ne_of_gt h2) hS
  have hcont : ContinuousOn (fun x : ℝ => ((x + a) ^ s * (c - x) ^ s)⁻¹) (uIcc (0 : ℝ) T) := by
    refine ContinuousOn.inv₀ ?_ ?_
    · exact (((continuous_id.add continuous_const).pow s).mul
        ((continuous_const.sub continuous_id).pow s)).continuousOn
    · intro x hx
      obtain ⟨h1, h2⟩ := hmem x hx
      exact ne_of_gt (mul_pos (pow_pos h1 s) (pow_pos h2 s))
  have hint : IntervalIntegrable (fun x : ℝ => ((x + a) ^ s * (c - x) ^ s)⁻¹) volume 0 T :=
    hcont.intervalIntegrable
  rw [intervalIntegral.integral_eq_sub_of_hasDerivAt hderiv hint]
  simp only [Gfin, ← Finset.sum_sub_distrib, ← mul_sub]
  refine Finset.sum_congr rfl fun k hk => ?_
  simp only [Finset.mem_Icc] at hk
  congr 1
  have hTa : (0 : ℝ) < T + a := by linarith
  have hcT : (0 : ℝ) < c - T := by linarith
  by_cases hk1 : k = 1
  · subst hk1
    simp only [Gpiece_a, Gpiece_c, Jfun_a, Jfun_c, if_true, zero_add, sub_zero]
    rw [Real.log_div (ne_of_gt hTa) (ne_of_gt ha), Real.log_div (ne_of_gt hc0) (ne_of_gt hcT)]
    ring
  · have hkR : ((k : ℝ) - 1) ≠ 0 := by
      have hk2 : 2 ≤ k := by omega
      have : (2 : ℝ) ≤ (k : ℝ) := by exact_mod_cast hk2
      intro hcon; linarith
    have h1k : (1 - (k : ℝ)) ≠ 0 := by
      intro hcon; apply hkR; linarith
    simp only [Gpiece_a, Gpiece_c, Jfun_a, Jfun_c, if_neg hk1, zero_add, sub_zero]
    field_simp
    ring

end WeldPF
