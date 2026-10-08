/-
Route 40 (b9) — Theorem BB (lemma-B-two-band.md §6.1.5), set-valued first-contact logic.

`Z t ⊆ ℂ` is the set of zeros of H_t in the cell C_i.  The analytic inputs of Steps 2–5 are named
hypotheses:
 * `hclosed`  — Step 2: the contact set F = {t : some zero has (Im z)² ≥ B(t)} is closed
                (paper: (S), walls/B.1, (F2), lower semicontinuity of B);
 * `hhurwitz` — Step 3: a zero strictly above the barrier at time t persists, with a margin η > 0,
                at times s < t arbitrarily close to t (paper: Hurwitz (F4));
 * `hcontact` — Steps 4–5: a first contact (all earlier zeros strictly below, all zeros at time t
                at most at the barrier) cannot touch the barrier (paper: backward Hermite splitting
                [P15-3.1(ii)] for multiple zeros; Lemma C + the scalar first-contact comparison,
                `Route40.first_contact`, for simple zeros).
Conclusion: every zero stays strictly below the barrier on [τ₀, tₑ].
Compiled against Mathlib d13f23b7 / Lean 4.34.1 (tree /tmp/qrh-verify/lean).
-/
import Mathlib

open Set Filter Topology

namespace Route40

theorem first_contact_set (Z : ℝ → Set ℂ) (B b' : ℝ → ℝ) (τ₀ tₑ : ℝ)
    (hBd : ∀ t ∈ Ioc τ₀ tₑ, HasDerivWithinAt B (b' t) (Iic t) t)
    (hclosed : IsClosed {t ∈ Icc τ₀ tₑ | ∃ z ∈ Z t, B t ≤ z.im ^ 2})
    (hstart : ∀ z ∈ Z τ₀, z.im ^ 2 < B τ₀)
    (hhurwitz : ∀ t ∈ Ioc τ₀ tₑ, ∀ z ∈ Z t, B t < z.im ^ 2 →
      ∃ η > 0, ∀ ε > 0, ∃ s ∈ Ioo (t - ε) t, ∃ z' ∈ Z s, B t + η < z'.im ^ 2)
    (hcontact : ∀ t ∈ Ioc τ₀ tₑ, (∀ s ∈ Ico τ₀ t, ∀ z ∈ Z s, z.im ^ 2 < B s) →
      (∀ z ∈ Z t, z.im ^ 2 ≤ B t) → ∀ z ∈ Z t, z.im ^ 2 = B t → False) :
    ∀ t ∈ Icc τ₀ tₑ, ∀ z ∈ Z t, z.im ^ 2 < B t := by
  by_contra hcon
  push Not at hcon
  obtain ⟨t₁, ht₁, z₁, hz₁, hle₁⟩ := hcon
  set F := {t ∈ Icc τ₀ tₑ | ∃ z ∈ Z t, B t ≤ z.im ^ 2} with hF
  have hne : F.Nonempty := ⟨t₁, ht₁, z₁, hz₁, hle₁⟩
  have hbdd : BddBelow F := ⟨τ₀, fun t ht => ht.1.1⟩
  set ts := sInf F with hts
  have hts_mem : ts ∈ F := hclosed.csInf_mem hne hbdd
  obtain ⟨⟨hts0, htse⟩, zs, hzs, hBzs⟩ := hts_mem
  have hts_ne : ts ≠ τ₀ := by
    intro h; rw [h] at hzs hBzs; have := hstart zs hzs; linarith
  have hts_gt : τ₀ < ts := lt_of_le_of_ne hts0 (Ne.symm hts_ne)
  have hIoc : ts ∈ Ioc τ₀ tₑ := ⟨hts_gt, htse⟩
  -- strictly before ts every zero is below the barrier
  have hbefore : ∀ s ∈ Ico τ₀ ts, ∀ z ∈ Z s, z.im ^ 2 < B s := by
    intro s hs z hz
    by_contra hc
    push Not at hc
    have hsF : s ∈ F := ⟨⟨hs.1, by linarith [hs.2]⟩, z, hz, hc⟩
    have := csInf_le hbdd hsF
    linarith [hs.2]
  -- at ts no zero is strictly above the barrier (Step 3)
  have hatmost : ∀ z ∈ Z ts, z.im ^ 2 ≤ B ts := by
    intro z hz
    by_contra hc
    push Not at hc
    obtain ⟨η, hη, hpers⟩ := hhurwitz ts hIoc z hz hc
    -- left continuity of B at ts
    have hBc : ContinuousWithinAt B (Iic ts) ts := (hBd ts hIoc).continuousWithinAt
    have hev : ∀ᶠ s in 𝓝[Iic ts] ts, B s < B ts + η :=
      hBc.eventually (gt_mem_nhds (by linarith))
    rw [eventually_nhdsWithin_iff, Metric.eventually_nhds_iff] at hev
    obtain ⟨ε, hε, hball⟩ := hev
    obtain ⟨s, hs, z', hz', hz'big⟩ := hpers (min ε (ts - τ₀)) (lt_min hε (by linarith))
    have hs1 : ts - ε < s := lt_of_le_of_lt (by linarith [min_le_left ε (ts - τ₀)]) hs.1
    have hs2 : τ₀ < s := by linarith [min_le_right ε (ts - τ₀), hs.1]
    have hdist : dist s ts < ε := by
      rw [Real.dist_eq, abs_sub_lt_iff]; constructor <;> linarith [hs.2]
    have hBs := hball hdist (mem_Iic.mpr hs.2.le)
    have hbelow := hbefore s ⟨hs2.le, hs.2⟩ z' hz'
    linarith
  have heq : zs.im ^ 2 = B ts := le_antisymm (hatmost zs hzs) hBzs
  exact hcontact ts hIoc hbefore hatmost zs hzs heq

end Route40
