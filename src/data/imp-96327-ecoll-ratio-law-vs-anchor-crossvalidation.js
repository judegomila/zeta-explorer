/**
 * @module data/imp-96327-ecoll-ratio-law-vs-anchor-crossvalidation
 * @fileoverview imp-96327 -- cross-validate the imp-96311 cross-column E_coll
 *   ratio law against the two INDEPENDENT imp-96290 baked anchor values.
 *
 *   imp-96311 claims the cross-column ratio is a C_H-only constant, exact and
 *   N-independent:
 *
 *       E_coll(C_H_a, N) / E_coll(C_H_b, N) = C_H_a / C_H_b .
 *
 *   Its own prefactor check verifies this against its recomputed rate factor
 *   R(N) (so the equality is structurally guaranteed by E_coll = C_H * R(N)).
 *   What had NEVER been done is the external cross-check: do the two anchors
 *   that imp-96290 baked INDEPENDENTLY,
 *
 *       E_coll(1/8,  1e4) = 0.0108806   (C_H = 0.125)
 *       E_coll(0.127, 1e4) = 0.0110547   (C_H = 0.127),
 *
 *   themselves satisfy the ratio law? This module measures the anchor ratio
 *   0.0110547 / 0.0108806 and compares it with the target 0.127 / 0.125.
 *
 *   RESULT. anchor ratio = 1.0160009558; target = 1.0160000000; residual =
 *   9.558e-7. The two anchors were each stored to 7 significant figures, so the
 *   ratio inherits a rounding-limited uncertainty of ~9.26e-6 (half-ULP in each
 *   of the two 7-sig-fig operands). The measured residual (9.56e-7) sits WELL
 *   INSIDE that rounding band, so the independently baked anchors satisfy the
 *   imp-96311 ratio law to the full precision the anchors carry.
 *
 *   SLOPE ANNIHILATION at the anchors. The two anchors live at a single common
 *   N = 1e4, so they cannot MEASURE a log-log slope. But the mechanism behind
 *   the imp-96311 slope-annihilation claim is exactly the additive-offset
 *   structure log E_coll = log C_H + log R(N): at fixed N the two columns differ
 *   by the pure constant log(C_H_a / C_H_b), which is what a constant ratio at
 *   fixed N demonstrates. The anchor cross-check therefore confirms the additive
 *   log-C_H offset that makes dg_{logE}/dg_{logN} drop the C_H term; it does not
 *   (and cannot from one N) independently re-measure the slope profile.
 *
 *   MUTUAL CONSISTENCY. The two modules are mutually consistent: imp-96311
 *   reproduces both anchors to <1e-6 (its own imp96311-consistent-with-imp96290
 *   assertion) and the anchors, taken raw, satisfy imp-96311 ratio law to their
 *   rounding precision. No discrepancy.
 *
 *   ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves no constant,
 *   does not close G6_polymath15_bridge. The conditional bound C_H <= 0.127
 *   stays UNPROVEN; C_H isRigorousUpperBound remains false (imp-2642 / imp-2701);
 *   the imp-2640 Gronwall discharge of C_Lip stays NEGATIVE. RH remains open.
 *   NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96290-step4-bridge-subconstant-inventory.js: the two E_coll anchors
 *     0.0108806 (C_H = 1/8) and 0.0110547 (C_H = 0.127) at N = 1e4.
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: the ratio law
 *     E_coll(C_H_a, N) / E_coll(C_H_b, N) = C_H_a / C_H_b and its C_H values.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{logE}/dg_{logN}
 *   and this header avoids the close-comment terminator sequence inside prose.
 */

// The two INDEPENDENTLY baked imp-96290 anchors at N = 1e4 (7 sig figs each).
const ANCHOR_E_COLL_C_H_1OVER8 = 0.0108806; // C_H = 0.125
const ANCHOR_E_COLL_C_H_HYP = 0.0110547; // C_H = 0.127

// The C_H magnitudes those anchors use (imp-96311 columns).
const C_H_1OVER8 = 0.125;
const C_H_HYP = 0.127;

// Measured anchor ratio and the imp-96311 target it must equal.
const ANCHOR_RATIO = ANCHOR_E_COLL_C_H_HYP / ANCHOR_E_COLL_C_H_1OVER8;
const TARGET_RATIO = C_H_HYP / C_H_1OVER8;
const RESIDUAL = ANCHOR_RATIO - TARGET_RATIO;
const REL_RESIDUAL = RESIDUAL / TARGET_RATIO;

// Rounding-limited uncertainty of the anchor ratio: each anchor is good to a
// half-ULP of its 7th significant figure (abs ~ 0.5e-7), so the ratio carries
// ratio * (dA / A + dB / B) of relative slack. The residual must sit inside it
// for the anchors to be judged consistent with the ratio law.
const HALF_ULP = 0.5e-7;
const ROUNDING_UNCERTAINTY =
  ANCHOR_RATIO *
  (HALF_ULP / ANCHOR_E_COLL_C_H_1OVER8 + HALF_ULP / ANCHOR_E_COLL_C_H_HYP);

export const IMP96327_ECOLL_RATIO_LAW_VS_ANCHOR = {
  id: 'imp-96327',
  title:
    'Cross-validation: the two independently baked imp-96290 E_coll anchors ' +
    'satisfy the imp-96311 cross-column ratio law E_coll(C_H_a)/E_coll(C_H_b) ' +
    '= C_H_a/C_H_b to their stored precision',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  anchors: {
    E_coll_at_1over8: ANCHOR_E_COLL_C_H_1OVER8,
    E_coll_at_hyp: ANCHOR_E_COLL_C_H_HYP,
    C_H_1over8: C_H_1OVER8,
    C_H_hyp: C_H_HYP,
    source: 'imp-96290-step4-bridge-subconstant-inventory.js (N = 1e4)',
  },
  ratioCheck: {
    anchorRatio: ANCHOR_RATIO,
    targetRatio: TARGET_RATIO,
    residual: RESIDUAL,
    relResidual: REL_RESIDUAL,
    roundingUncertainty: ROUNDING_UNCERTAINTY,
    withinRoundingBand: Math.abs(RESIDUAL) < ROUNDING_UNCERTAINTY,
    note:
      'anchor ratio 1.0160009558 vs target 1.016; residual 9.558e-7 sits inside ' +
      'the ~9.26e-6 rounding band of the two 7-sig-fig anchors, so the raw ' +
      'anchors satisfy the imp-96311 ratio law to the precision they carry.',
  },
  slopeAnnihilation: {
    measurable: false,
    why:
      'Both anchors live at the single N = 1e4, so no log-log slope can be ' +
      'measured from them. The constant ratio at fixed N confirms the additive ' +
      'log-C_H offset (log E_coll = log C_H + log R(N)) that makes ' +
      'dg_{logE}/dg_{logN} drop the C_H term -- the mechanism behind the ' +
      'imp-96311 slope-annihilation claim -- but does not re-measure the slope.',
  },
  mutualConsistency:
    'CONSISTENT. imp-96311 reproduces both anchors to <1e-6 (its own ' +
    'imp96311-consistent-with-imp96290 assertion) and the raw anchors satisfy ' +
    'the imp-96311 ratio law to their rounding precision. No discrepancy.',
  verdict:
    'CROSS-VALIDATION COMPLETE. The two independently baked imp-96290 E_coll ' +
    'anchors satisfy the imp-96311 cross-column ratio law to the full 7-sig-fig ' +
    'precision they carry (residual 9.56e-7 inside a 9.26e-6 rounding band). ' +
    'The modules are mutually consistent. Accuracy audit only: no gap closed, ' +
    'no bound changed, G6_polymath15_bridge not closed, conditional C_H <= ' +
    '0.127 stays UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701), ' +
    'imp-2640 Gronwall discharge of C_Lip NEGATIVE. RH open. NO QED.',
  provenance:
    'imp-96290-step4-bridge-subconstant-inventory.js (baked E_coll anchors); ' +
    'imp-96311-ecoll-rate-ch-independence-tabulation.js (ratio law, C_H values).',
};

export const IMP96327_ECOLL_RATIO_LAW_VS_ANCHOR_ASSERTIONS = [
  {
    id: 'imp96327-anchor-ratio-matches-c-h-ratio',
    holds: () => Math.abs(RESIDUAL) < ROUNDING_UNCERTAINTY,
    why:
      'The independently baked anchor ratio 0.0110547 / 0.0108806 must equal ' +
      'the C_H ratio 0.127 / 0.125 to within the rounding band of the two ' +
      '7-sig-fig anchors, confirming the imp-96311 cross-column ratio law ' +
      'against imp-96290 raw data. Residual 9.56e-7 < band 9.26e-6.',
  },
  {
    id: 'imp96327-residual-is-tiny',
    holds: () => Math.abs(REL_RESIDUAL) < 1e-5,
    why:
      'The relative residual of the anchor ratio versus the C_H ratio must be ' +
      'at the 1e-6 rounding scale of 7-sig-fig storage, not a real O(1) or ' +
      'even 1e-3 discrepancy that would signal the two modules disagree.',
  },
  {
    id: 'imp96327-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96327_ECOLL_RATIO_LAW_VS_ANCHOR.verdict,
      ) && IMP96327_ECOLL_RATIO_LAW_VS_ANCHOR.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
];
