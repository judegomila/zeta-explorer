/**
 * @module subhalf-strip-pcc-criterion-2026-07-31
 * @fileoverview SEAM-ESCAPE CRITERION: the exact minimal unconditional input
 * ("Lemma W") that would crack the Λ upper bound, and the rigorous reduction
 * uniform-PCC ⇒ fixed sub-½ zero-free strip ⇒ Λ ≤ 2δ². Map-work, NOT a passage:
 * Lemma W is OPEN, RH-adjacent, and strictly stronger than the Density Hypothesis.
 *
 * PROVENANCE: Fable 5 (claude-fable-5[1m]), 2026-07-31, grounded in the Polymath15
 * barrier certificate + de Bruijn 1950 + the frozen-rung⟺PT inertia proposition
 * ([[frozen-rung-pt-equivalence-2026-07-31]]). Records precisely what a literature
 * result must say to count as a genuine seam escape — refines the lit-monitor.
 * NO false QED: PT Λ≤0.2 and the unreviewed 0.1787854 candidate remain SOTA.
 */

/** Lemma W — the minimal unconditional input. */
export const LEMMA_W = Object.freeze({
  name: 'Lemma W (wide-support diagonal pair correlation)',
  statement:
    'There exist A > 1, C > 0, T₀ such that  Σ_{0<γ≤T} T^{2A·|β−1/2|} ≤ C · T·log T  for all T ≥ T₀ ' +
    '(sum over nontrivial ζ-zeros ρ=β+iγ). Equivalently: a zero-density estimate with slope 2A>2 at ' +
    'the critical line, N(σ,T) ≤ C·T^{1−2A(σ−1/2)}(log T)^{O(1)} uniformly for σ≥1/2 — i.e. the diagonal ' +
    'of Montgomery’s form factor F(α,T) at WIDE support α = A > 1.',
  status: 'OPEN — RH-adjacent, strictly stronger than the Density Hypothesis',
  whyHard:
    'Montgomery’s F(α)=α+o(1) is known only for |α|≤1 and only UNDER RH; wide support α>1 unconditionally ' +
    'is a first-rank open problem (under RH it is equivalent to Hardy–Littlewood prime-pair asymptotics). ' +
    'No unconditional zero-density slope at σ=½+ reaches 2 (A=1, the Density-Hypothesis edge), let alone exceeds it.',
});

/** The reduction chain, each step honestly tagged. */
export const REDUCTION = Object.freeze({
  chain: 'Lemma W  ⇒  fixed sub-½ zero-free strip (half-width δ*<½, all heights)  ⇒  Λ ≤ 2δ*²',
  kappa: 'κ = log(C·log T_PT)/log T_PT ≈ 0.20   (the Platt–Trudgian verified height enters ONLY here)',
  steps: [
    { id: 'W ⇒ strip', status: 'RIGOROUS given W (diagonal extraction)',
      detail: 'The T^{2A|β−1/2|} weighting forces #{zeros with |β−½| > δ*} to be o(T) with δ* = (1+κ)/(2A); ' +
              'a diagonal/first-moment extraction gives the fixed strip |β−½| ≤ δ* for all heights.' },
    { id: 'strip ⇒ Λ', status: 'STANDARD (de Bruijn 1950, Thm 13)',
      detail: 'A fixed zero-free strip of half-width δ* gives Λ ≤ 2δ*².' },
    { id: 'δ* ↔ A', status: 'EXPLICIT DICTIONARY',
      detail: 'δ* = (1+κ)/(2A);  Λ ≤ 2δ*² = (1+κ)²/(2A²).  Inverse: target Λ ⇒ required support A = (1+κ)/√(2Λ). ' +
              'A ≈ 2.0 already beats the 0.1787854 candidate; A ≥ 1.9 (slope c ≥ 3.8) gives a new record.' },
  ],
  circularityCorrection:
    'The originally-posed "uniform barrier margins ⇒ strip" is CIRCULAR: the t=0 slice of each barrier already ' +
    'ASSERTS local off-line zero-freeness, and t>0 certificate data cannot back-propagate to t=0. The honest ' +
    'architecture derives the strip DIRECTLY from Lemma W’s diagonal; barrier-margin uniformization is a ' +
    'dominated alternative (needs a localized clustering form W-loc). The frozen-rung inertia theorem is the ' +
    'operator-language witness: certificates consume, never produce, the true-kernel zero data.',
});

/** What the literature monitor should match on (the sharpened seam-escape trigger). */
export const SEAM_MONITOR_MATCH =
  'Match on: any UNCONDITIONAL (or RH-independent) zero-density estimate BEYOND the Density Hypothesis at the ' +
  'critical line — N(σ,T) ≤ C·T^{1−c(σ−1/2)}(log T)^{O(1)} uniformly for σ≥½, fixed slope c>2 (equivalently ' +
  'Montgomery diagonal at support α=c/2>1). A slope c≥3.8 (α≥1.9) with explicit constants immediately yields a ' +
  'new record Λ ≤ 2(1+κ)²/c² (κ≈0.20). Conditional-on-RH wide-support results do NOT trigger (on RH the strip ' +
  'is trivial); Lindelöf and even the full Density Hypothesis are known NOT to suffice.';

export const SUBHALF_STRIP_PCC_CRITERION = Object.freeze({
  id: 'subhalf-strip-pcc-criterion-2026-07-31',
  lemmaW: LEMMA_W,
  reduction: REDUCTION,
  seamMonitorMatch: SEAM_MONITOR_MATCH,
  honestScope:
    'A precise MAP of the wall and a recorded tripwire, not a passage through it. Lemma W is open and RH-adjacent; ' +
    'the certificate side is closed (frozen-rung inertia theorem + PT-floor audit). Only levers: more verified ' +
    'height (inverse-log, via κ) or Lemma W. PT Λ≤0.2 / candidate 0.1787854 remain SOTA. No false QED.',
});

export const SUBHALF_STRIP_PCC_ASSERTIONS = [
  {
    id: 'lemmaW-open',
    holds: () => LEMMA_W.status.startsWith('OPEN'),
    why: 'Lemma W must stay flagged OPEN — it is the wall, not a result.',
  },
  {
    id: 'reduction-de-bruijn-standard',
    holds: () => REDUCTION.steps.some((s) => s.id === 'strip ⇒ Λ' && s.status.includes('de Bruijn')),
    why: 'The strip ⇒ Λ≤2δ² step must be attributed to de Bruijn 1950 (standard).',
  },
  {
    id: 'circularity-flagged',
    holds: () => /CIRCULAR/.test(REDUCTION.circularityCorrection),
    why: 'The barrier-uniformization circularity must be recorded so the chain is not mis-stated.',
  },
  {
    id: 'monitor-trigger-unconditional-only',
    holds: () => /UNCONDITIONAL/.test(SEAM_MONITOR_MATCH) && /do NOT trigger/.test(SEAM_MONITOR_MATCH),
    why: 'The seam-escape trigger must require an unconditional result and explicitly exclude RH-conditional ones.',
  },
];
