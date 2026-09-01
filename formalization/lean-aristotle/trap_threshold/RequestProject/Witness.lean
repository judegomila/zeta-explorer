import RequestProject.Static
import RequestProject.Flow

/-!
# The four-particle witness of sharpness

The configuration `{-g, 0, g, g + d₂}` with tracked pair `(0, g)`: the near neighbour at
distance `d₁ = g` saturates the cap `μ = 1/2`, and the second neighbour sits at distance `d₂`
on the opposite side.  Its trapping functional is

  `Θ = 1/4 + 1/(2 d̂₂ (d̂₂ + 1))`,  `d̂₂ = d₂ / g`,

so the threshold value `Θ = Θ_b` is attained exactly when `d̂₂ (d̂₂ + 1) = 1/r_b`, i.e. at
`d̂₂ ≈ 1.1854`.  Since `d̂₂ > 1` there, the tracked pair really does realise the global minimal
gap of the configuration, so the sharpness profile of TARGET S3 is realisable.
-/

open scoped BigOperators

namespace ThetaTrap

/-- The four-particle configuration `{-g, 0, g, g + d₂}`. -/
noncomputable def witness (g d2 : ℝ) : ℕ → ℝ :=
  fun i => if i = 0 then -g else if i = 1 then 0 else if i = 2 then g else g + d2

lemma witness_ordered {g d2 : ℝ} (hg : 0 < g) (hd : 0 < d2) : Ordered 4 (witness g d2) := by
  intro i j hij hj
  have hi : i < 4 := by omega
  interval_cases i <;> interval_cases j <;> simp_all [witness] <;> linarith

lemma witness_gap {g d2 : ℝ} : gapv (witness g d2) 1 = g := by
  simp [gapv, witness]

/-- The tracked pair realises the global minimal gap as soon as `g ≤ d₂`. -/
lemma witness_minimal_gap {g d2 : ℝ} (hgd : g ≤ d2) :
    ∀ i, i + 1 < 4 → gapv (witness g d2) 1 ≤ gapv (witness g d2) i := by
  intro i hi
  have hi3 : i < 3 := by omega
  interval_cases i
  · simp [gapv, witness]
  · simp [gapv, witness]
  · simp [gapv, witness]; linarith

lemma witness_envIdx : envIdx 4 1 = {0, 3} := by decide

/-- The trapping functional of the four-particle witness. -/
lemma witness_Theta {g d2 : ℝ} (hg : 0 < g) (hd : 0 < d2) :
    Thetav 4 (witness g d2) 1 = 1 / 4 + 1 / (2 * ((d2 / g) * ((d2 / g) + 1))) := by
  have h03 : (0 : ℕ) ≠ 3 := by decide
  rw [Thetav, envE, witness_envIdx, Finset.sum_pair h03, witness_gap]
  have e0 : Tv (witness g d2) 1 0 = 1 / (2 * g ^ 2) := by
    simp only [Tv, witness]
    norm_num
    ring_nf
  have e3 : Tv (witness g d2) 1 3 = 1 / (d2 * (g + d2)) := by
    simp only [Tv, witness]
    norm_num
    rw [show (-d2 + -g) = -(d2 + g) by ring, inv_neg]
    field_simp
    ring
  rw [e0, e3]
  have hgd : g + d2 ≠ 0 := by positivity
  field_simp
  ring

/-- At the sharp threshold the second neighbour sits at `d̂₂ (d̂₂ + 1) = 1/r_b`, and this forces
`d̂₂ > 1`: the tracked pair does realise the global minimal gap, so the threshold profile is
realisable. -/
lemma witness_threshold {g d2 : ℝ} (hg : 0 < g) (hd : 0 < d2)
    (hroot : (d2 / g) * ((d2 / g) + 1) = 1 / rB) :
    Thetav 4 (witness g d2) 1 = ThetaB ∧ g < d2 := by
  have hrB0 : 0 < rB := by
    unfold rB; nlinarith [sqrt73_lower]
  have hrBlt : rB < 1 / 2 := by
    unfold rB; nlinarith [sqrt73_upper]
  have hdg : 0 < d2 / g := by positivity
  refine ⟨?_, ?_⟩
  · rw [witness_Theta hg hd, hroot, ThetaB_eq_quarter_add]
    have hrB : rB ≠ 0 := by
      have : 0 < rB := by unfold rB; nlinarith [sqrt73_lower]
      exact ne_of_gt this
    field_simp
  · have h2 : (2 : ℝ) < 1 / rB := by
      rw [lt_div_iff₀ hrB0]; linarith
    have hgt : 1 < d2 / g := by nlinarith [hroot, h2]
    rw [lt_div_iff₀ hg] at hgt
    linarith

end ThetaTrap
