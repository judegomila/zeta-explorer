/**
 * @module imp-3894-endpoint-concavity-slack-measurement
 * @fileoverview imp-3894 (numerical, MEASUREMENT-ONLY): directly MEASURE the
 * endpoint-concavity slack per imp-3725 plateau that imp-3870 relocated the
 * imp-3854 predictionRatio residual to -- after imp-3870 REFUTED the smin/Dmin
 * attribution -- and DECOMPOSE predictionRatio into concavity x proxy-accuracy,
 * testing whether it reproduces predictionRatio in [0.79, 1.56] for BOTH signs.
 *
 * RESULT: endpoint concavity is REAL but SUB-DOMINANT (a uniform ~1% one-sided
 * downward slack); the residual is carried almost entirely by the (H/Dmin)^2
 * PROXY-ACCURACY factor (imp-3870 "dominant-term structure"), which alone sets
 * the SIGN of predictionRatio-1 on all 10 plateaus. This CLOSES the imp-3870
 * open sub-gap imp-3870-sub-concavity-fit by decomposition, not by elimination.
 *
 * SETTING (imp-3725 gap-domination bootstrap, thetaBar = 0.99, unchanged)
 * ----------------------------------------------------------------------
 * With T = H^2/(8*thetaBar), s_l(T) = sqrt(max(g_l(0)^2 - 8T, 0)),
 *   Psi_N(T) = 4 H^2 sum_{j not in pair} 1/D_j(T)^2,  theta_N = 1 - Psi_N/8,
 *   F_mb = (H^2/8)(1/theta_N - 1),  and K_paper a thetaBar-INDEPENDENT monotone
 *   multiple of F_mb, so the relative K change over a thetaBar window EQUALS the
 *   relative F_mb change. imp-3854 STEP-1 gives the EXACT horizon derivative
 *   dPsi_N/dT = 32 H^2 sum_j P_j/D_j^3, hence the EXACT elasticities
 *     d theta_N/d thetaBar = (T/(8 thetaBar)) dPsi_N/dT  (> 0), and
 *     E(thetaBar) = |d ln F_mb/d thetaBar| = (1/(1-theta_N)+1/theta_N) d theta_N/d thetaBar.
 *
 * imp-3854 STEP-4 predicts the relative K change over the feasible window
 * [0.99, thetaBar*] with the LEFT-ENDPOINT elasticity built on the (H/Dmin)^2
 * PROXY (not the exact dPsi/dT):
 *   predictedRelKChange = kElasticityPerUnit * excursion,
 *   kElasticityPerUnit  = (1 + (1-theta)/theta)(H/Dmin)^2 / thetaBar^2,
 * and defines predictionRatio = measuredRelKChange/predictedRelKChange in
 * [0.79, 1.56] (measuredRelKChange = imp-3728 improveFactor - 1). imp-3854
 * credited the residual to smin/Dmin slack (> 1) and endpoint concavity (< 1).
 * imp-3870 REFUTED the smin/Dmin half and relocated the residual to endpoint
 * concavity + dominant-term structure, but did NOT decompose it (named-open
 * sub-gap imp-3870-sub-concavity-fit).
 *
 * WHAT WAS MEASURED (scripts/imp-3894-endpoint-concavity-slack-compute.mjs, node
 * via esbuild bundle over zeros-to-1e6.js, 2026-07-03; same evalAt as imp-3874)
 * ---------------------------------------------------------------------------
 * For each of the 10 plateaus, at the EXACT feasible window [0.99, thetaBar*]
 * (thetaBar* the imp-3728/imp-3890 fixed point, reproduced to rel < 6e-9):
 *   eExactLeft = E(0.99)                    (EXACT left-endpoint K elasticity)
 *   deltaLnFmb = ln(F_mb(0.99)/F_mb(thetaBar*)) > 0   (EXACT finite log K change;
 *                reproduces imp-3728 improveFactor-1 to the improveFactor rounding)
 * from which the residual decomposes EXACTLY as
 *   predictionRatio ~= reconstructed = concavityFactor * proxyAccuracyFactor,
 *   concavityFactor     = deltaLnFmb / (eExactLeft * excursion)   (<= 1: curvature)
 *   proxyAccuracyFactor = eExactLeft / kElasticityPerUnit         (proxy tightness)
 * since concavityFactor * proxyAccuracyFactor = deltaLnFmb / predictedRelKChange.
 *
 * FINDINGS
 * --------
 *  (1) concavityFactor is 0.9901 to 0.9928 on ALL 10 plateaus: a UNIFORM one-sided
 *      downward slack of at most ~1.0% (max slack 9.9e-3). Endpoint concavity is
 *      REAL and its sign is always < 1 (theta_N concave => finite change below the
 *      left-endpoint linear estimate), but it is FAR too small to be the [0.79,
 *      1.56] residual (a +-20% to +56% effect).
 *  (2) proxyAccuracyFactor STRADDLES 1, 0.798 to 1.602: the (H/Dmin)^2 proxy under-
 *      OR over-estimates the exact left-endpoint elasticity, and this factor alone
 *      spans essentially the whole predictionRatio range. sign(predictionRatio-1)
 *      = sign(proxyAccuracyFactor-1) on EVERY plateau -- the sign of the residual
 *      is carried by proxy accuracy (dominant-term structure), NOT by concavity
 *      (which never flips sign) and NOT by smin/Dmin (imp-3870).
 *  (3) reconstructed = concavityFactor * proxyAccuracyFactor reproduces the imp-3854
 *      predictionRatio on every plateau to within imp-3728's improveFactor rounding
 *      (rel < 5e-3 on the finely-resolved plateaus 0 and 2; the larger rels, up to
 *      0.29 on plateau 9, are the 1-2 sig-fig storage of improveFactor = 1.000001).
 *
 * So imp-3870's "endpoint concavity + dominant-term structure" is now DECOMPOSED:
 * dominant-term structure (the (H/Dmin)^2 proxy accuracy) is the ~99% driver and
 * sets the residual sign; endpoint concavity is a genuine but ~1% one-sided slack.
 *
 * HONEST SCOPE
 * ------------
 *  - MEASUREMENT closing the imp-3870-sub-concavity-fit sub-gap by direct
 *    decomposition; eExactLeft and deltaLnFmb baked from the offline scan (like the
 *    imp-3725/imp-3870 rows). excursion, kElasticityPerUnit, predictedRelKChange
 *    and predictionRatio derive LIVE from imp-3854.
 *  - Corrects/sharpens an imp-3870 CHARACTERIZATION (residual = concavity +
 *    dominant-term structure) into a quantitative split; does NOT touch any
 *    imp-3854 INEQUALITY (LEMMA 3854 stays a valid over-bound) nor the certified
 *    K_paper enclosure or its thetaBar-robustness.
 *  - No new Lambda bound; imp-3066 K_a >= 0 positivity UNTOUCHED; no refereed bound is changed
 *    ; NO QED.
 *
 * @see imp-3870-smin-dmin-slack-measurement.js (relocated residual to concavity; sub-gap this closes)
 * @see imp-3854-thetabar-insensitivity-derivation.js (predictionRatio, kElasticityPerUnit source)
 * @see imp-3874-dpsi-sensitivity-verify.js (the exact dPsi/dT evalAt harness reused)
 * @see scripts/imp-3894-endpoint-concavity-slack-compute.mjs (generator)
 */

import { IMP_3854_THETABAR_INSENSITIVITY_DERIVATION } from './imp-3854-thetabar-insensitivity-derivation.js';

const SRC54 = IMP_3854_THETABAR_INSENSITIVITY_DERIVATION.rows; // excursion, kElasticityPerUnit, predictedRelKChange, predictionRatio
const THETA_BAR = 0.99;

// Directly-measured EXACT left-endpoint elasticity eExactLeft = E(0.99) and the
// EXACT finite log change deltaLnFmb = ln(F_mb(0.99)/F_mb(thetaBar*)) over the
// feasible window, baked from scripts/imp-3894-endpoint-concavity-slack-compute.mjs
// (esbuild bundle over zeros-to-1e6.js, 2026-07-03). thetaBarStar is baked for
// provenance display only; excursion derives LIVE from imp-3854 so the algebra
// stays single-source. DO NOT hand-edit; regenerate via the script.
const MEASURED = Object.freeze([
  { plateauIndex: 0, thetaBarStar: 0.99822707, eExactLeft: 1.46404419e-3, deltaLnFmb: 1.19453774e-5 },
  { plateauIndex: 1, thetaBarStar: 0.99715949, eExactLeft: 1.93692439e-3, deltaLnFmb: 1.37677116e-5 },
  { plateauIndex: 2, thetaBarStar: 0.99852951, eExactLeft: 1.30416339e-3, deltaLnFmb: 1.10287152e-5 },
  { plateauIndex: 3, thetaBarStar: 0.99847693, eExactLeft: 1.35909823e-3, deltaLnFmb: 1.14229184e-5 },
  { plateauIndex: 4, thetaBarStar: 0.99883762, eExactLeft: 8.08168178e-4, deltaLnFmb: 7.07905699e-6 },
  { plateauIndex: 5, thetaBarStar: 0.99904525, eExactLeft: 9.66809634e-4, deltaLnFmb: 8.66565352e-6 },
  { plateauIndex: 6, thetaBarStar: 0.99949216, eExactLeft: 4.55394177e-4, deltaLnFmb: 4.28160066e-6 },
  { plateauIndex: 7, thetaBarStar: 0.99932382, eExactLeft: 4.64020406e-4, deltaLnFmb: 4.28606065e-6 },
  { plateauIndex: 8, thetaBarStar: 0.99975429, eExactLeft: 1.94296781e-4, deltaLnFmb: 1.87673289e-6 },
  { plateauIndex: 9, thetaBarStar: 0.9998958,  eExactLeft: 7.24038663e-5, deltaLnFmb: 7.09404442e-7 },
]);

const sign = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);

// Per-plateau decomposition of predictionRatio into concavity x proxy-accuracy.
// Only eExactLeft, deltaLnFmb are baked; everything else derives LIVE from imp-3854.
const ROWS = MEASURED.map((m, i) => {
  const r54 = SRC54[i];
  const excursion = r54.excursion;                       // thetaBar* - 0.99, live
  const kElasticityPerUnit = r54.kElasticityPerUnit;     // (H/Dmin)^2 proxy elasticity, live
  const predictedRelKChange = r54.predictedRelKChange;   // proxy * excursion, live
  const predictionRatio = r54.predictionRatio;           // imp-3854 residual, live
  const linearEstimate = m.eExactLeft * excursion;       // exact left slope * window width
  const concavityFactor = m.deltaLnFmb / linearEstimate; // <= 1: endpoint-concavity slack
  const proxyAccuracyFactor = m.eExactLeft / kElasticityPerUnit; // exact-left / proxy
  const reconstructedPredictionRatio = m.deltaLnFmb / predictedRelKChange; // = concavity * proxyAccuracy
  return Object.freeze({
    plateauIndex: m.plateauIndex,
    startN: r54.startN,
    endN: r54.endN,
    H: r54.H,
    thetaBarStar: m.thetaBarStar,
    excursion,
    eExactLeft: m.eExactLeft,
    kElasticityPerUnit,
    deltaLnFmb: m.deltaLnFmb,
    concavityFactor,
    concavitySlack: 1 - concavityFactor,                 // fraction lost to curvature
    proxyAccuracyFactor,
    reconstructedPredictionRatio,
    predictionRatio,
    signMatch: sign(predictionRatio - 1) === sign(proxyAccuracyFactor - 1),
  });
});

const cf = ROWS.map((r) => r.concavityFactor);
const pa = ROWS.map((r) => r.proxyAccuracyFactor);
const MIN_CONCAVITY = Math.min(...cf);
const MAX_CONCAVITY = Math.max(...cf);
const MAX_CONCAVITY_SLACK = Math.max(...ROWS.map((r) => r.concavitySlack));
const MIN_PROXY_ACCURACY = Math.min(...pa);
const MAX_PROXY_ACCURACY = Math.max(...pa);
const ALL_SIGNS_MATCH = ROWS.every((r) => r.signMatch);

export const IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT = Object.freeze({
  id: 'imp-3894',
  title:
    'Direct measurement of the endpoint-concavity slack per imp-3725 plateau: ' +
    'concavity is a UNIFORM ~1% one-sided slack, so the imp-3870 [0.79,1.56] ' +
    'predictionRatio residual is carried by the (H/Dmin)^2 proxy-accuracy factor ' +
    '(dominant-term structure), which alone sets its sign',
  status: 'measurement-only',
  rhFree: true,
  semantics: 'decomposition of an existing residual; closes the imp-3870 concavity sub-gap, no new bound',

  thetaBar: THETA_BAR,
  rows: ROWS,

  headline: {
    plateauCount: ROWS.length,
    concavityFactorRange: [MIN_CONCAVITY, MAX_CONCAVITY],       // ~[0.9901, 0.9928]
    maxConcavitySlack: MAX_CONCAVITY_SLACK,                     // ~9.9e-3 (~1%)
    proxyAccuracyFactorRange: [MIN_PROXY_ACCURACY, MAX_PROXY_ACCURACY], // ~[0.798, 1.602]
    imp3854PredictionRatioRange: IMP_3854_THETABAR_INSENSITIVITY_DERIVATION.headline.predictionRatioRange,
    signCarriedByProxyAccuracy: ALL_SIGNS_MATCH,               // true on all 10 plateaus
    finding:
      'Endpoint concavity, measured DIRECTLY as deltaLnFmb/(E(0.99)*excursion), is ' +
      '0.9901-0.9928 on ALL 10 plateaus -- a uniform one-sided downward slack of at ' +
      'most ~1.0%, far too small to be the [0.79,1.56] predictionRatio residual. The ' +
      'residual is carried by the (H/Dmin)^2 proxy-accuracy factor E(0.99)/kElastic, ' +
      'which straddles 1 (0.798-1.602) and whose sign matches sign(predictionRatio-1) ' +
      'on EVERY plateau. reconstructed = concavity * proxyAccuracy reproduces the ' +
      'imp-3854 predictionRatio to within imp-3728 improveFactor rounding. This ' +
      'DECOMPOSES imp-3870 "endpoint concavity + dominant-term structure": the ' +
      'dominant-term (proxy) part is the ~99% driver and sets the sign; concavity is ' +
      'a real but ~1% one-sided slack. Necessary but not sufficient; no refereed bound is changed' +
      '; imp-3066 untouched; NO QED.',
  },

  closesImp3870SubGap:
    'imp-3870-sub-concavity-fit asked for a quantitative endpoint-concavity model ' +
    'rather than attribution by elimination. This measures the concavity slack ' +
    'directly (concavityFactor = deltaLnFmb/(E(0.99)*excursion), 0.9901-0.9928 ~ 1%) ' +
    'and separates it from the (H/Dmin)^2 proxy-accuracy factor (0.798-1.602), whose ' +
    'sign matches sign(predictionRatio-1) on all 10 plateaus. Concavity is thus shown ' +
    'to be SUB-DOMINANT (~1%) and the residual is the dominant-term proxy accuracy.',

  provenance: {
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9, imp-359/imp-514)',
    generator: 'scripts/imp-3894-endpoint-concavity-slack-compute.mjs',
    generatedAt: '2026-07-03',
    note: 'eExactLeft, deltaLnFmb baked from the offline scan; excursion, kElasticityPerUnit, predictionRatio derive live from imp-3854.',
  },

  scope: {
    measurementOnly: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'No refereed bound is changed',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) -----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT_ASSERTIONS = [
  {
    id: 'imp3894-derives-live-from-imp3854-and-identity',
    holds: () =>
      ROWS.length === 10 &&
      ROWS.every(
        (r, i) =>
          r.H === SRC54[i].H &&
          r.excursion === SRC54[i].excursion &&
          r.predictionRatio === SRC54[i].predictionRatio &&
          // exact algebraic identity: reconstructed = concavity * proxyAccuracy
          rel(r.reconstructedPredictionRatio, r.concavityFactor * r.proxyAccuracyFactor) < 1e-9,
      ),
    why:
      'Only eExactLeft and deltaLnFmb are baked; excursion, kElasticityPerUnit and ' +
      'predictionRatio come from imp-3854. The decomposition reconstructed = ' +
      'concavityFactor * proxyAccuracyFactor is an exact identity (both equal ' +
      'deltaLnFmb/predictedRelKChange); any drift signals a source change.',
  },
  {
    id: 'imp3894-concavity-uniform-small-one-sided-slack',
    holds: () =>
      ROWS.every((r) => r.concavityFactor > 0.98 && r.concavityFactor <= 1) &&
      MAX_CONCAVITY_SLACK < 1.1e-2 &&
      MIN_CONCAVITY > 0.985,
    why:
      'Central measurement: endpoint concavity is a UNIFORM one-sided downward slack ' +
      'of at most ~1% (concavityFactor 0.9901-0.9928, <= 1 on every plateau), because ' +
      'theta_N is concave so the finite change sits just below the left-endpoint linear ' +
      'estimate. It is an order of magnitude too small to be the [0.79,1.56] residual.',
  },
  {
    id: 'imp3894-proxy-accuracy-straddles-one-and-carries-sign',
    holds: () =>
      MIN_PROXY_ACCURACY < 0.85 &&
      MAX_PROXY_ACCURACY > 1.55 &&
      ALL_SIGNS_MATCH === true &&
      ROWS.every((r) => r.signMatch),
    why:
      'The (H/Dmin)^2 proxy-accuracy factor E(0.99)/kElasticityPerUnit straddles 1 ' +
      '(0.798-1.602) and spans essentially the whole predictionRatio range, and ' +
      'sign(predictionRatio-1) = sign(proxyAccuracyFactor-1) on EVERY plateau. So the ' +
      'residual SIGN is carried by dominant-term proxy accuracy, not concavity (which ' +
      'never flips sign) and not smin/Dmin (imp-3870).',
  },
  {
    id: 'imp3894-reconstruction-reproduces-predictionRatio',
    holds: () =>
      ROWS.every(
        (r) =>
          r.reconstructedPredictionRatio > 0.7 &&
          r.reconstructedPredictionRatio < 1.7 &&
          // reproduces imp-3854 predictionRatio up to imp-3728 improveFactor rounding
          rel(r.reconstructedPredictionRatio, r.predictionRatio) < 0.3,
      ) &&
      // on the two finely-resolved plateaus the agreement is tight
      rel(ROWS[0].reconstructedPredictionRatio, ROWS[0].predictionRatio) < 1e-2 &&
      rel(ROWS[2].reconstructedPredictionRatio, ROWS[2].predictionRatio) < 1e-2,
    why:
      'reconstructed = concavityFactor * proxyAccuracyFactor reproduces the imp-3854 ' +
      'predictionRatio on every plateau to within imp-3728 improveFactor rounding ' +
      '(rel < 5e-3 on plateaus 0 and 2; larger rels are the 1-2 sig-fig storage of ' +
      'improveFactor ~ 1.000001). The concavity x proxy-accuracy split is complete.',
  },
  {
    id: 'imp3894-closes-imp3870-subgap-measurement-only',
    holds: () =>
      IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT.scope.measurementOnly === true &&
      IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT.scope.noNewLambdaBound === true &&
      IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT.scope.noQED === true &&
      IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT.scope.imp3066Untouched === true &&
      typeof IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT.closesImp3870SubGap === 'string',
    why:
      'Honesty guard: this measurement decomposes the imp-3870 residual and closes its ' +
      'concavity-fit sub-gap. It must not assert a new Lambda bound or a QED, imp-3066 ' +
      'stays untouched, and no refereed bound is changed.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3894-endpoint-concavity-slack-measurement assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3894_ENDPOINT_CONCAVITY_SLACK_MEASUREMENT;
