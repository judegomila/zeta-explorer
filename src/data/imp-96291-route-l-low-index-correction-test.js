/**
 * @module imp-96291-route-l-low-index-correction-test
 *
 * imp-96291 (numerical): test whether a low-index (small-gamma) correction term reconciles the
 * imp-96269 Route L detector power law (N_det = 0.364336 gamma^1.271686) and the genuine
 * Christoffel-saturation reach law (N_C = 0.396870 gamma^1.248736) to <1% per-row across the full
 * shared gamma range -- and decide whether the low-index gap is a genuine curvature effect or
 * integer node-counting granularity.
 *
 * INPUTS (baked literals from imp-96269 IMP96269_REACH_LAW_CROSSCHECK, no heavy run):
 *   - sharedGamma      = [14.1347, 25.0109, 37.5862, 49.7738, 77.1448]
 *   - measuredNdet     = [12, 20, 33, 48, 107]   (imp-96149 detector column)
 *   - christoffelEps1e4= [12, 21, 33, 48, 104]   (imp-96182 analytic reach column)
 *   - detectorFit  N_det = 0.364336 gamma^1.271686
 *   - christoffelFit N_C = 0.396870 gamma^1.248736
 *
 * METHOD. (i) Recompute the signed per-row power-law residual d_k = N_det(gamma_k)/N_C(gamma_k) - 1
 * across the shared range. (ii) Test the two candidate small-gamma correction forms named in the
 * ticket -- an additive offset N0 and a gamma^b(1 + c/gamma) reciprocal bend -- both of which
 * vanish as gamma -> infinity. (iii) Compare the raw integer columns against the fitted-law gap to
 * separate a genuine curvature term from integer node-counting granularity.
 *
 * RESULT -- NO small-gamma correction reconciles the two laws to <1% per-row; the discrepancy is a
 * whole-band exponent (slope) mismatch, and at the low-index end it is below the node-counting
 * granularity floor.
 *   - The signed residual d_k is MONOTONE in gamma and CHANGES SIGN: d_1 = -2.444% (detector below
 *     Christoffel at small gamma), d_5 = +1.430% (detector above at large gamma), crossing zero at
 *     gamma ~ 41.55. This is the exact signature of the fitted-exponent difference
 *     b_det - b_C = +0.022950 (ratio = (A_det/A_C) gamma^(b_det - b_C)), NOT a small-gamma-localized
 *     offset. The largest gap is at BOTH ends, not the low-index end alone.
 *   - IMPOSSIBILITY: because d_k has OPPOSITE signs at the two ends, any correction C(gamma) that
 *     vanishes as gamma -> infinity (additive N0 or gamma^b(1 + c/gamma)) leaves the large-gamma
 *     k=5 residual untouched at +1.430%. Hence the min achievable max-row gap under ANY such
 *     small-gamma correction is >= 1.430% > 1%. The <1% target is unreachable by a small-gamma term.
 *   - NODE-COUNTING GRANULARITY at the low-index end: the raw integer columns AGREE exactly there
 *     (N_det = N_C = 12 at k=1, diff 0); the 2.444% k=1 power-law gap is a fitted-law artifact, not
 *     a raw-data curvature. One integer node is 8.33% of the order at k=1 (vs 0.96% at k=5), so a
 *     sub-1% reconciliation is below the intrinsic integer resolution at the low-index end and is
 *     not even measurable there.
 *
 * VERDICT. The imp-96269 low-index (k=1) discrepancy is NOT a genuine small-gamma curvature term a
 * correction could absorb: it is (a) one end of a two-sided, sign-changing exponent (slope) mismatch
 * between the detector and Christoffel power laws, and (b) at the low-index end specifically, integer
 * node-counting granularity (one node = 8.33% of the order at gamma_1). A small-gamma correction is
 * therefore neither sufficient (large-gamma end floors the max-row gap at 1.430% > 1%) nor even
 * resolvable (below the node-counting floor). The two laws remain consistent to the 2.44% imp-96269
 * already reported; nothing reconciles them to <1% without changing the fitted exponent. Measurement
 * on baked literals only; changes NO bound; RH open; no refereed bound is changed; NO QED.
 *
 * Reproduce: tmp/imp-96291-scratch.mjs (pure-JS residual + impossibility-floor recomputation).
 *
 * @see imp-96269-route-l-reach-law-crosscheck.js (source cross-check + power-law literals)
 * @see imp-96149-route-l-detector-reach-law-fit.js (detector power-law fit)
 * @see imp-96182-christoffel-reach-law.js (genuine Christoffel reach column)
 *
 * Ticket: imp-96291 (numerical, low). Import-light: pure exported literals, no zeros-bundle import,
 * no self-executing throw.
 */

export const IMP96291_LOW_INDEX_CORRECTION_TEST = Object.freeze({
  sharedGamma: Object.freeze([14.1347, 25.0109, 37.5862, 49.7738, 77.1448]),
  measuredNdet: Object.freeze([12, 20, 33, 48, 107]),
  christoffelEps1e4: Object.freeze([12, 21, 33, 48, 104]),
  detectorFit: Object.freeze({ A: 0.364336, b: 1.271686 }),
  christoffelFit: Object.freeze({ A: 0.396870, b: 1.248736 }),
  // signed per-row power-law residual d_k = N_det/N_C - 1 (percent)
  signedResidualPct: Object.freeze([-2.444, -1.158, 0.230, 0.415, 1.430]),
  residualMonotone: true,
  residualSignChanges: true,               // d_1 < 0 < d_5: two-sided, not low-index-localized
  zeroCrossingGamma: 41.55,                // ratio = 1 where gamma^(b_det - b_C) = A_C/A_det
  exponentDiffBdetMinusBc: 0.022950,       // the slope mismatch driving the whole-band gap
  // impossibility of a small-gamma-vanishing correction reaching <1% per-row
  largeGammaResidualPct: 1.430,            // k=5, untouched by any C(gamma) -> 0 as gamma -> inf
  minAchievableMaxRowGapPct: 1.430,        // >= |d_5|; > 1% target
  smallGammaCorrectionReconcilesBelow1Pct: false,
  correctionFormsTested: Object.freeze(['additive offset N0', 'gamma^b (1 + c/gamma) reciprocal bend']),
  // node-counting granularity at the low-index end
  rawColumnDiffAtK1: 0,                    // N_det = N_C = 12 exactly; power-law gap is a fit artifact
  oneNodePctOfOrder: Object.freeze({ k1: 8.33, k5: 0.96 }),  // integer resolution floor per row
  lowIndexGapClassification: 'exponent-slope mismatch + integer node-counting granularity, NOT genuine curvature',
  changesBound: false,
  rhOpen: true,
});

export const IMP96291_VERDICT =
  'Route L low-index correction test: the imp-96269 detector-vs-Christoffel per-row gap is a '
  + 'MONOTONE, SIGN-CHANGING residual (d_1 = -2.44% at small gamma, d_5 = +1.43% at large gamma, '
  + 'zero-crossing gamma ~ 41.55) driven by the fitted-exponent difference b_det - b_C = +0.02295 -- '
  + 'a whole-band slope mismatch, not a small-gamma-localized offset. Because the residual has '
  + 'opposite signs at the two ends, any correction that vanishes as gamma -> infinity (additive N0 '
  + 'or gamma^b(1 + c/gamma)) leaves the large-gamma end at +1.43%, so the min achievable max-row gap '
  + 'is >= 1.43% > 1%: NO small-gamma correction reconciles the two laws to <1% per-row. The '
  + 'low-index k=1 gap is not genuine curvature -- the raw integer columns agree exactly there '
  + '(N_det = N_C = 12), and one integer node is 8.33% of the order at gamma_1, so a sub-1% '
  + 'reconciliation sits below the node-counting granularity floor and is not measurable at the '
  + 'low-index end. The two laws stay consistent to the 2.44% imp-96269 reported; measurement on '
  + 'baked literals only; changes no bound; RH open; no refereed bound is changed; NO QED.';

export const IMP96291_SCRIPTS = Object.freeze(['tmp/imp-96291-scratch.mjs']);
