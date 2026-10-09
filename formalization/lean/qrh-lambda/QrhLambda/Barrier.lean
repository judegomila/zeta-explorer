import QrhLambda.Hyps
import QrhLambda.Flow

/-!
# The substep barrier lemma, derived from first contact (FC) and contact exclusion (CE)

`barrier_step`: if the tail zeros of `H_{t₀}` are strictly below `b` (`t₀ > 0`), `c` is a valid
single-pair rate at a stored level `Q ≥ b` on cell `i`, the substep `[t₀, t₀ + τ]` lies in cell `i` and
before `41/250`, and the barrier stays `≥ q_e`, then the tail zeros of `H_{t₀+τ}` are strictly below
`flow b c τ`. This is the stored-barrier form of Lemma FB(θ) step 3 (review B §4.2, §8): each substep
restarts from the rounded-up stored value.

Proof (in Lean): the barrier `β(u) = flow b c (u − t₀)` is continuous and `≥ q_e > 0` on the substep;
if the conclusion failed, FC would give a first contact time `s ∈ (t₀, t₀+τ]` with a tail zero on
`β(s)` and strict separation before `s`, which CE excludes.
-/

namespace QrhLambda

open LeanCert.Analysis.DBN

lemma qEr_pos : (0 : ℝ) < qEr := by norm_num [qEr]

lemma TailBelow.mono {t b b' : ℝ} (h : TailBelow t b) (hb : b ≤ b') : TailBelow t b' :=
  fun z hz hx => lt_of_lt_of_le (h z hz hx) hb

theorem barrier_step (hR : RaymondChainHyps) {i : ℕ} {t₀ τ b Q c : ℝ} (h₀ : 0 < t₀)
    (hi : (i : ℝ) / 4000 ≤ t₀) (hτ : 0 ≤ τ) (hcell : t₀ + τ ≤ ((i : ℝ) + 1) / 4000)
    (hhor : t₀ + τ ≤ 41 / 250) (hb : 0 < b) (hbQ : b ≤ Q) (hP : PairRate i Q c) (hc : 0 < c)
    (hqe : qEr ≤ flow b c τ) (hT : TailBelow t₀ b) : TailBelow (t₀ + τ) (flow b c τ) := by
  have hb2 : 0 ≤ b + 2 / c := by positivity
  have hanti := flow_antitone hc hb2
  set β : ℝ → ℝ := fun u => flow b c (u - t₀) with hβ
  have hβcont : ContinuousOn β (Set.Icc t₀ (t₀ + τ)) :=
    ((continuous_flow b c).comp (continuous_sub_right t₀)).continuousOn
  have hβge : ∀ s ∈ Set.Icc t₀ (t₀ + τ), qEr ≤ β s := by
    intro s hs
    have : flow b c τ ≤ flow b c (s - t₀) := hanti (by linarith [hs.2])
    exact le_trans hqe this
  have hβpos : ∀ s ∈ Set.Icc t₀ (t₀ + τ), 0 < β s := fun s hs => lt_of_lt_of_le qEr_pos (hβge s hs)
  have hβ0 : β t₀ = b := by simp [hβ, flow_zero]
  have hend : β (t₀ + τ) = flow b c τ := by simp [hβ]
  by_contra hcon
  have hex : ∃ s ∈ Set.Icc t₀ (t₀ + τ), ¬ TailBelow s (β s) :=
    ⟨t₀ + τ, ⟨by linarith, le_refl _⟩, by rw [hend]; exact hcon⟩
  obtain ⟨s, hs, hbefore, z, hz, hzx, hzim⟩ :=
    hR.first_contact t₀ (t₀ + τ) β h₀ (by linarith) hhor hβcont hβpos (by rw [hβ0]; exact hT) hex
  have hsle : s ≤ t₀ + τ := hs.2
  have hqe' : qEr ≤ flow b c (s - t₀) := hβge s ⟨le_of_lt hs.1, hsle⟩
  exact hR.contact_exclusion i t₀ s b Q c h₀ hs.1 hi (by linarith) (by linarith) hb hbQ hP hc hqe'
    hbefore z hz hzx hzim

end QrhLambda
