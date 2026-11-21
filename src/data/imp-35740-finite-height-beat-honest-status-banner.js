/**
 * @module imp-35740-finite-height-beat-honest-status-banner
 *
 * imp-35740 (content, S-frontier): imp-35678 records that Reading 1 (the
 * imp-452/459 finite-height beat L_pt ~ 0.121 < 0.2) is C_H-gated -- the
 * dominant E_coll term rests on the shock modulus C_H = C_shock*C_Lip/4 whose
 * N-uniform bound is RH-HARD, and the "measured" C_mb is an OLS fit
 * (imp-2632), not a rigorous N-uniform bound. That caveat is already on
 * record (roadmap CORRECTION 2026-07-03) but has no dedicated standalone
 * banner of its own -- imp-35711 banners the RECIPROCAL reading (asymptotic
 * parity, no beat) but the finite-height-beat conditionality caveat has none.
 * This module IS that companion banner: a standalone, prominent,
 * self-asserting statement that L_pt ~ 0.121 < 0.2 is a CONDITIONAL / C_H
 * -gated ESTIMATE, NOT an unconditional beat, restated without the
 * surrounding derivation so a reader who lands only on this module gets the
 * correction first.
 *
 * DOCUMENTATION ONLY. Ports nothing; discharges nothing; changes no bound;
 * establishes no operator positivity; adds no new claim beyond imp-35678
 * Reading 1 / imp-452/459 / the roadmap CORRECTION 2026-07-03; C_mb
 * GUE-conditional (imp-486) UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE BANNER (restated from imp-35678 Reading 1; no new derivation)
 * -----------------------------------------------------------------------------
 *   "L_pt ~ 0.121 < 0.2" IS NOT AN UNCONDITIONAL BEAT OF LAMBDA <= 0.2.
 *   The imp-452/459 finite-height numeric value is real but:
 *     (i)   it is a CONDITIONAL / C_H-GATED ESTIMATE -- the dominant E_coll
 *           term rests on the shock modulus C_H = C_shock*C_Lip/4, whose
 *           N-uniform bound is RH-HARD (roadmap CORRECTION 2026-07-03);
 *    (ii)   the "measured" C_mb feeding it is an OLS FIT (imp-2632), not a
 *           rigorous N-uniform bound;
 *   (iii)   it holds only at a FINITE N -- as the far-tail share sigma -> 0
 *           this GUE-conditional beat carrier vanishes and the reading hands
 *           off to the imp-35711 asymptotic parity-with-PT (imp-35678 A3).
 *
 * The punchline: read "L_pt ~ 0.121 < 0.2" as an honest CONDITIONAL, FINITE-N
 * ESTIMATE, NOT as an unconditional-RH beat. No bound changes; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35678-finite-height-beat-vs-parity-regime-boundary (source: Reading 1 conditionality + regime-boundary handoff)
 * @see imp-35711-postport-parity-no-beat-honest-status-banner (reciprocal: the standalone asymptotic-parity no-beat banner)
 * @see imp-2632 (measured C_mb is an OLS fit, not a rigorous N-uniform bound)
 * @see imp-486 (C_mb GUE-conditional -- untouched)
 * @see lambda-roadmap currentStatus (imp-452/459 finite-height beat L_pt ~ 0.121; CORRECTION 2026-07-03 C_H-gated)
 */

const L_PT = 0.2; // Platt-Trudgian 2021 bound -- the threshold Reading 1 estimates falling below
const L_BEAT_FINITE = 0.121; // imp-452/459 finite-height beat (roadmap currentStatus); CONDITIONAL / C_H-gated
const L_BEAT_N1E4 = 0.02; // sibling finite-N estimate L_pt(N* = 1e4) (imp-440/963); ALSO C_H-gated

export const IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER = {
  id: 'imp-35740',
  proofSection: 'S-frontier',
  bannerLevel: 'PROMINENT',
  headline: 'L_PT ~ 0.121 < 0.2 IS A CONDITIONAL ESTIMATE, NOT AN UNCONDITIONAL BEAT OF LAMBDA <= 0.2',
  statements: {
    S1_c_h_gated_estimate: {
      claim:
        'The imp-452/459 finite-height beat L_pt ~ 0.121 < 0.2 (sibling estimate L_pt(N* = 1e4) ~ 0.02) is a ' +
        'CONDITIONAL / C_H-GATED ESTIMATE, not an unconditional beat: the dominant E_coll term rests on the ' +
        'shock modulus C_H = C_shock*C_Lip/4, whose N-uniform bound is RH-HARD (roadmap CORRECTION 2026-07-03).',
      L_beat_finite: L_BEAT_FINITE,
      L_beat_n1e4: L_BEAT_N1E4,
    },
    S2_ols_fit_not_rigorous_bound: {
      claim:
        'The "measured" C_mb feeding this estimate is an OLS FIT (imp-2632), not a rigorous N-uniform bound -- ' +
        'the sub-0.2 numeric value is an empirical fit result, not a proved inequality.',
    },
    S3_finite_n_only_hands_off_to_parity: {
      claim:
        'The beat holds only at a FINITE N: it is carried by the dominant E_coll (GUE-conditional) term whose ' +
        'far-tail share is exactly sigma; as sigma -> 0 that carrier vanishes and the reading hands off to the ' +
        'imp-35711 asymptotic parity-with-PT (imp-35678 A3) -- the same assembly at opposite ends of sigma.',
    },
  },
  isRigorous: false,
  verdict:
    'HONEST-STATUS BANNER (documentation, NOT a new claim). Restates imp-35678 Reading 1 prominently so ' +
    '"L_pt ~ 0.121 < 0.2" is never mistaken for an unconditional-RH beat: it is a CONDITIONAL / C_H-gated ' +
    'ESTIMATE (roadmap CORRECTION 2026-07-03) whose "measured" C_mb is an OLS fit (imp-2632), not a rigorous ' +
    'N-uniform bound, and it holds only at a finite N -- as sigma -> 0 the GUE-conditional beat carrier ' +
    'vanishes and the reading hands off to the imp-35711 asymptotic parity-with-PT. Ports nothing; discharges ' +
    'nothing; changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35678 (source: Reading 1 conditionality assessment and regime-boundary handoff); imp-452/459 ' +
    '(finite-height beat L_pt ~ 0.121); imp-2632 (measured C_mb OLS fit, C_H RH-hard); imp-35711 (reciprocal ' +
    'asymptotic-parity no-beat banner); imp-486 (C_mb GUE-conditional, untouched); lambda-roadmap ' +
    'currentStatus + CORRECTION 2026-07-03.',
};

export const IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER_ASSERTIONS = [
  {
    // The banner must be flagged prominent and carry the conditional-not-beat headline verbatim.
    id: 'imp35740-banner-is-prominent',
    description: 'Banner is flagged PROMINENT with a headline stating conditional-not-beat',
    holds: () =>
      IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.bannerLevel === 'PROMINENT' &&
      /NOT AN UNCONDITIONAL BEAT OF LAMBDA/.test(IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.headline),
  },
  {
    // S1: C_H-gated estimate statement carries the correct beat values and L_PT threshold.
    id: 'imp35740-c-h-gated-values',
    description: 'S1 states the C_H-gated beat values, both strictly below L_PT = 0.2',
    holds: () =>
      Math.abs(
        IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S1_c_h_gated_estimate.L_beat_finite - 0.121,
      ) < 1e-15 &&
      Math.abs(
        IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S1_c_h_gated_estimate.L_beat_n1e4 - 0.02,
      ) < 1e-15 &&
      IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S1_c_h_gated_estimate.L_beat_finite < L_PT &&
      IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S1_c_h_gated_estimate.L_beat_n1e4 < L_PT &&
      /CONDITIONAL \/ C_H-GATED ESTIMATE/.test(
        IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S1_c_h_gated_estimate.claim,
      ),
  },
  {
    // S2: OLS-fit caveat references imp-2632 and states it is not a rigorous bound.
    id: 'imp35740-ols-fit-caveat',
    description: 'S2 states the measured C_mb is an OLS fit (imp-2632), not a rigorous bound',
    holds: () =>
      /imp-2632/.test(IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S2_ols_fit_not_rigorous_bound.claim) &&
      /OLS FIT/.test(IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S2_ols_fit_not_rigorous_bound.claim) &&
      /not a rigorous/.test(
        IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S2_ols_fit_not_rigorous_bound.claim,
      ),
  },
  {
    // S3: finite-N-only / hands-off-to-parity claim references the imp-35678 regime boundary.
    id: 'imp35740-finite-n-hands-off',
    description: 'S3 states the beat is finite-N only and hands off to parity as sigma -> 0',
    holds: () =>
      /FINITE N/.test(
        IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S3_finite_n_only_hands_off_to_parity.claim,
      ) &&
      /hands off to/.test(
        IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S3_finite_n_only_hands_off_to_parity.claim,
      ) &&
      /imp-35678/.test(
        IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.statements.S3_finite_n_only_hands_off_to_parity.claim,
      ),
  },
  {
    // Honesty gate: documentation only, no QED, no refereed bound is changed.
    id: 'imp35740-honesty-gate-no-qed',
    description: 'Documentation only: no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.isRigorous === false &&
      /HONEST-STATUS BANNER/.test(IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.verdict) &&
      /NOT a new claim/.test(IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.verdict) &&
      /NO QED/.test(IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.verdict) &&
      /refereed bound is changed/i.test(IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER.verdict),
  },
];

for (const a of IMP35740_FINITE_HEIGHT_BEAT_HONEST_STATUS_BANNER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35740-finite-height-beat-honest-status-banner assertion failed: ${a.id}`);
  }
}
