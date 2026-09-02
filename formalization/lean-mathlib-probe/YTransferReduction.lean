/-
  YTransferReduction — machine-checked ABSTRACT reduction logic of the
  general-mollifier y-transfer used in the de Bruijn–Newman Λ ≤ 0.1758354
  candidate (the "excision budget" mechanism, Theorem C of
  provenance/Y_TRANSFER_GENMOLL_THEOREM.md).

  CONTEXT.  Polymath15 hypothesis (ii) needs H_{t0}(x+iy) ≠ 0 on the whole
  y-range [y0, √(1−2t0)], but the finite-lane certificate is proven only at the
  single abscissa y = y0.  The direct-Triangle mass M_N(y) is NOT termwise
  nonincreasing in y for the optimized mollifier (a genuine disproof: some
  summands increase, all at n ≳ 2·10⁶ with mass ≤ 1.5·10⁻⁸).  The certificate
  is rescued by EXCISION: the finitely many "bad" summands are dropped and paid
  for by a budget B = Σ_bad mass, giving M_N(y) ≤ M_N(y0) + B, hence
  L_N(y) ≥ L_N(y0) − B.  An Arb verifier (verify_ydini_genmoll.c) certifies
  B ≤ 2.4957·10⁻⁴ < min_N L_N(y0) = 1.8723·10⁻³, closing the gate.

  ## HONEST SCOPE

  What IS machine-checked here (sorry-free): the pure REDUCTION LOGIC —
    • `excision_budget`  (Theorem C): good terms nonincreasing + bad terms
       bounded by their mass + base measure nonincreasing  ⇒  the total mass at
       y exceeds that at y0 by at most B.
    • `certificate_extends`: M(y) ≤ M(y0) + B  together with the certificate
       shape (num = C − M, norm ≥ 1, K nonincreasing, num(y0) > B)  ⇒  the
       normalized lower bound L(y) stays > 0 across the y-range.

  What is DELIBERATELY a hypothesis (the analytic content, months of separate
  interval-analysis infrastructure — NOT proven here):
    • `hgood`: which summands are nonincreasing in y (the per-box Theorem-B
       Dini gate, discharged numerically by the Arb sweep, appears as the
       hypothesis "good i ⇒ f i ≤ f0 i").
    • `hbadb`: the sup-mass bound on each excised summand (also from the Arb
       sweep).
    • The identification of M, num, norm, K with the real H_t machinery.

  So this file reduces the y-transfer to precisely-named numerical hypotheses,
  exactly as BarrierAnalyticSkeleton.lean does for the endpoint/winding steps.
-/
import Mathlib

namespace YTransferReduction

open scoped BigOperators

variable {ι : Type*} [DecidableEq ι]

/-- **Theorem C (excision budget), abstract form.**  `f i` is the summand's
    value at height `y`, `f0 i` its value at the base height `y0`, `mass i` a
    proven upper bound on `f i` over the excised box.  `bad ⊆ s` are the excised
    indices.  With the base term `γ ≤ γ0` and all excised base values
    nonnegative, the total `M = γ + Σ f` is at most `M0 = γ0 + Σ f0` plus the
    budget `B = Σ_bad mass`.  Proven sorry-free. -/
theorem excision_budget
    (s bad : Finset ι) (hbad : bad ⊆ s)
    (f f0 mass : ι → ℝ)
    (γ γ0 B M M0 : ℝ)
    (hgamma : γ ≤ γ0)
    (hgood : ∀ i ∈ s, i ∉ bad → f i ≤ f0 i)
    (hbadb : ∀ i ∈ bad, f i ≤ mass i)
    (hf0 : ∀ i ∈ bad, 0 ≤ f0 i)
    (hM : M = γ + ∑ i ∈ s, f i)
    (hM0 : M0 = γ0 + ∑ i ∈ s, f0 i)
    (hB : B = ∑ i ∈ bad, mass i) :
    M ≤ M0 + B := by
  -- split Σ_s f = Σ_{s\bad} f + Σ_bad f
  have hsplit : ∑ i ∈ s, f i = (∑ i ∈ s \ bad, f i) + ∑ i ∈ bad, f i :=
    (Finset.sum_sdiff hbad).symm
  -- good part: Σ_{s\bad} f ≤ Σ_{s\bad} f0
  have hgood' : ∑ i ∈ s \ bad, f i ≤ ∑ i ∈ s \ bad, f0 i := by
    refine Finset.sum_le_sum ?_
    intro i hi
    rw [Finset.mem_sdiff] at hi
    exact hgood i hi.1 hi.2
  -- extend Σ_{s\bad} f0 ≤ Σ_s f0  (extra indices are in bad, where f0 ≥ 0)
  have hext : ∑ i ∈ s \ bad, f0 i ≤ ∑ i ∈ s, f0 i := by
    refine Finset.sum_le_sum_of_subset_of_nonneg (Finset.sdiff_subset) ?_
    intro i hi hni
    -- i ∈ s, i ∉ s \ bad  ⇒  i ∈ bad
    have : i ∈ bad := by
      by_contra hb
      exact hni (Finset.mem_sdiff.mpr ⟨hi, hb⟩)
    exact hf0 i this
  -- bad part: Σ_bad f ≤ Σ_bad mass = B
  have hbad' : ∑ i ∈ bad, f i ≤ B := by
    rw [hB]; exact Finset.sum_le_sum hbadb
  -- assemble
  have : ∑ i ∈ s, f i ≤ (∑ i ∈ s, f0 i) + B := by
    rw [hsplit]
    calc (∑ i ∈ s \ bad, f i) + ∑ i ∈ bad, f i
        ≤ (∑ i ∈ s \ bad, f0 i) + B := by gcongr
      _ ≤ (∑ i ∈ s, f0 i) + B := by gcongr
  rw [hM, hM0]
  linarith

/-- **The certificate extends across the y-range.**  With the certificate
    numerator shape `num y = C − M y` (heat-flow numerator), the mass transfer
    `M y ≤ M y0 + B`, and the certified separation `num y0 > B` (the base floor
    exceeds the excision budget), the numerator at height `y` is bounded below by
    `num y0 − B` and stays strictly positive — so the finite-lane non-vanishing
    certificate proven at `y0` holds throughout `[y0, √(1−2t0)]`.  Proven
    sorry-free.  (The normalized floor `L = num/‖λ‖ − corr` with `‖λ‖ ≥ 1`
    preserves this positivity; that monotone rescaling is `floor_ge` below.) -/
theorem certificate_extends
    (C B My My0 numy numy0 : ℝ)
    (hnum  : numy  = C - My)
    (hnum0 : numy0 = C - My0)
    (hmass : My ≤ My0 + B)
    (hsep  : B < numy0) :
    numy0 - B ≤ numy ∧ 0 < numy := by
  refine ⟨by rw [hnum, hnum0]; linarith, ?_⟩
  have h1 : numy0 - B ≤ numy := by rw [hnum, hnum0]; linarith
  linarith

/-- **Normalized-floor transfer.**  The certified per-window floor is
    `L = num/‖λ‖ − corr` with `‖λ‖ ≥ 1`, `‖λ‖` and `corr` both nonincreasing in
    `y`, and the excision budget `B ≥ 0`.  From the numerator transfer
    `num0 − B ≤ num` with `0 ≤ num0 − B`, the floor obeys `L y ≥ L y0 − B` — so
    the certified base floor minus the budget lower-bounds every height.  Proven
    sorry-free. -/
theorem floor_ge
    (B numy numy0 normy normy0 corry corry0 Ly Ly0 : ℝ)
    (hB0    : 0 ≤ B)
    (htrans : numy0 - B ≤ numy)
    (hnn    : 0 ≤ numy0 - B)
    (hnorm  : 1 ≤ normy)
    (hnorm0 : 1 ≤ normy0)
    (hnle   : normy ≤ normy0)          -- ‖λ‖ nonincreasing in y
    (hcorr  : corry ≤ corry0)          -- correction/rate gate nonincreasing
    (hL     : Ly  = numy  / normy  - corry)
    (hL0    : Ly0 = numy0 / normy0 - corry0) :
    Ly0 - B ≤ Ly := by
  have hn0  : (0:ℝ) < normy  := lt_of_lt_of_le one_pos hnorm
  have hn0' : (0:ℝ) < normy0 := lt_of_lt_of_le one_pos hnorm0
  -- (num0 − B)/normy ≤ num/normy      (monotone in the numerator, normy > 0)
  have s1 : (numy0 - B) / normy ≤ numy / normy :=
    div_le_div_of_nonneg_right htrans hn0.le
  -- num0/normy0 ≤ (num0 − B)/normy0 + B/normy0, and normy ≤ normy0 gives
  -- num0/normy0 ≤ (num0 − B)/normy + B/normy0    via (num0−B)/· antitone-in-denom
  have s2 : (numy0 - B) / normy0 ≤ (numy0 - B) / normy :=
    div_le_div_of_nonneg_left hnn hn0 hnle
  -- B/normy0 ≤ B     (normy0 ≥ 1, B ≥ 0)
  have s3 : B / normy0 ≤ B := by
    calc B / normy0 ≤ B / 1 := by
            apply div_le_div_of_nonneg_left hB0 one_pos hnorm0
      _ = B := by ring
  -- L y = num/normy − corry ≥ (num0−B)/normy − corry
  --      ≥ (num0−B)/normy0 − corry0  (s2, hcorr)
  --      = num0/normy0 − B/normy0 − corry0 ≥ L y0 − B  (s3)
  have hnum0split : (numy0 - B) / normy0 = numy0 / normy0 - B / normy0 := by
    rw [sub_div]
  rw [hL, hL0]
  have chain : numy0 / normy0 - B / normy0 ≤ numy / normy := by
    calc numy0 / normy0 - B / normy0
        = (numy0 - B) / normy0 := by rw [hnum0split]
      _ ≤ (numy0 - B) / normy := s2
      _ ≤ numy / normy := s1
  -- combine with s3 (B/normy0 ≤ B) and hcorr (corry ≤ corry0)
  have : numy0 / normy0 - B ≤ numy / normy := by
    have := s3; linarith
  linarith

end YTransferReduction

#print axioms YTransferReduction.excision_budget
#print axioms YTransferReduction.certificate_extends
#print axioms YTransferReduction.floor_ge
