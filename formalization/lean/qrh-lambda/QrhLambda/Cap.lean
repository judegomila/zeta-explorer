import QrhLambda.Defs

/-!
# The self-pair cap (AF §10; review B §3.2)

`s_r(v) = 2u/(u² + 4av)`, `u = 1 + a − v`, `a = r² > 0`. The three sufficient conditions checked by
`QrhLambda.capOK` each give `cap ≥ s_r(w)` for every `0 ≤ w ≤ v < 1`:

* (a) `3a ≥ 1` and `cap ≥ 2/(1+a) = s_r(0)`: `s_r` is decreasing (`(1+a)·2u − 2(u² + 4aw) = −2w(3a−1+w)`);
* (b) `(1+a−v)² ≥ 4a(1+a)`, `v ≤ 1 + a`, `cap ≥ s_r(v)`: `s_r` is increasing on `[0, v]`
  (`u_v(u_w² + 4aw) − u_w(u_v² + 4av) = (u_w − u_v)(u_w u_v − 4a(1+a))`);
* (c) `2cap ≥ 1` and `a(2cap − 1)² ≥ a + 1` (cap at least the global maximum `(1 + √(1+1/a))/2`):
  `cap(cap(u² + 4aw) − 2u) = (cap·u − 2a·cap − 1)² + (a(2cap−1)² − a − 1)`.
-/

namespace QrhLambda

lemma selfTerm_le_two_div {a w : ℝ} (ha : 0 < a) (h3 : 1 ≤ 3 * a) (hw0 : 0 ≤ w) (hw1 : w < 1 + a) :
    selfTerm a w ≤ 2 / (1 + a) := by
  unfold selfTerm
  have hu : 0 < 1 + a - w := by linarith
  have hden : 0 < (1 + a - w) ^ 2 + 4 * a * w := by
    have := pow_pos hu 2
    have := mul_nonneg (mul_nonneg (by norm_num : (0 : ℝ) ≤ 4) ha.le) hw0
    linarith
  rw [div_le_div_iff₀ hden (by linarith)]
  nlinarith [mul_nonneg hw0 (by linarith : (0 : ℝ) ≤ 3 * a - 1 + w)]

lemma selfTerm_mono_of_incr {a v w : ℝ} (ha : 0 < a) (hw0 : 0 ≤ w) (hwv : w ≤ v) (hv : v ≤ 1 + a)
    (hK : 4 * a * (1 + a) ≤ (1 + a - v) ^ 2) : selfTerm a w ≤ selfTerm a v := by
  unfold selfTerm
  have hK0 : 0 < 4 * a * (1 + a) := by positivity
  have huv0 : 0 ≤ 1 + a - v := by linarith
  have huv : 0 < 1 + a - v := by
    rcases huv0.eq_or_lt with h | h
    · rw [← h] at hK; nlinarith
    · exact h
  have hv0 : 0 ≤ v := le_trans hw0 hwv
  have huw : 0 < 1 + a - w := by linarith
  have hdw : 0 < (1 + a - w) ^ 2 + 4 * a * w := by
    have := pow_pos huw 2
    have := mul_nonneg (mul_nonneg (by norm_num : (0 : ℝ) ≤ 4) ha.le) hw0
    linarith
  have hdv : 0 < (1 + a - v) ^ 2 + 4 * a * v := by
    have := pow_pos huv 2
    have := mul_nonneg (mul_nonneg (by norm_num : (0 : ℝ) ≤ 4) ha.le) hv0
    linarith
  rw [div_le_div_iff₀ hdw hdv]
  have hprod : 4 * a * (1 + a) ≤ (1 + a - w) * (1 + a - v) := by
    nlinarith [mul_le_mul_of_nonneg_right (by linarith : 1 + a - v ≤ 1 + a - w) huv0]
  nlinarith [mul_nonneg (by linarith : (0 : ℝ) ≤ v - w) (by linarith : (0 : ℝ) ≤ (1 + a - w) * (1 + a - v) - 4 * a * (1 + a))]

lemma selfTerm_le_global {a w cap : ℝ} (ha : 0 < a) (hw0 : 0 ≤ w) (hw1 : w < 1 + a)
    (hc1 : 1 ≤ 2 * cap) (hc2 : a + 1 ≤ a * (2 * cap - 1) ^ 2) : selfTerm a w ≤ cap := by
  unfold selfTerm
  have hu : 0 < 1 + a - w := by linarith
  have hden : 0 < (1 + a - w) ^ 2 + 4 * a * w := by
    have := pow_pos hu 2
    have := mul_nonneg (mul_nonneg (by norm_num : (0 : ℝ) ≤ 4) ha.le) hw0
    linarith
  have hcap : 0 < cap := by linarith
  rw [div_le_iff₀ hden]
  have key : 0 ≤ cap * (cap * ((1 + a - w) ^ 2 + 4 * a * w) - 2 * (1 + a - w)) := by
    nlinarith [sq_nonneg (cap * (1 + a - w) - 2 * a * cap - 1)]
  have := (mul_nonneg_iff_of_pos_left hcap).mp key
  linarith

/-- The cap lemma used by `PairRate`: any of the three `capOK` conditions at the stored `v` bounds
`s_r` on all of `[0, v]`. -/
theorem selfTerm_le_cap {a v w cap : ℝ} (ha : 0 < a) (hw0 : 0 ≤ w) (hwv : w ≤ v) (hv1 : v < 1)
    (h : (1 ≤ 3 * a ∧ 2 / (1 + a) ≤ cap) ∨
      (4 * a * (1 + a) ≤ (1 + a - v) ^ 2 ∧ v ≤ 1 + a ∧ selfTerm a v ≤ cap) ∨
      (1 ≤ 2 * cap ∧ a + 1 ≤ a * (2 * cap - 1) ^ 2)) :
    selfTerm a w ≤ cap := by
  have hw1 : w < 1 + a := by linarith
  rcases h with ⟨h3, hc⟩ | ⟨hK, hv, hc⟩ | ⟨hc1, hc2⟩
  · exact (selfTerm_le_two_div ha h3 hw0 hw1).trans hc
  · exact (selfTerm_mono_of_incr ha hw0 hwv hv hK).trans hc
  · exact selfTerm_le_global ha hw0 hw1 hc1 hc2

end QrhLambda
