/**
 * imp-34435 -- Cross-check the imp-34267 M>=4 endpoint-curvature Taylor-ladder LOCK of the M2-ceiling
 * e^3 D^2 coefficient (c_eff ~ 89.94) against the imp-34345 two-channel split (17 OLS baseline +
 * 72.94 log-T0-drift bump = 89.94), tabulating both routes and any residual IN ONE PLACE.
 *
 * BACKGROUND. Two prior modules each land the same M2-residual sign-change ceiling coefficient by a
 *   DIFFERENT route, but were never cross-tabulated against each other:
 *     - imp-34267 (ROUTE A, endpoint-curvature LOCK): truncates the endpoint sigma_hi at successive
 *       Taylor orders M about the window centre, bisects the residual, and back-solves the effective
 *       single e^3 D^2 coefficient c_eff(M). The ladder is -185.7, +155.2, +59.8, +90.0, +89.94,
 *       +89.94 for M = 0..5 -- it reaches the exact-fit by cubic order M = 3 and LOCKS at c_eff ~ 89.94
 *       by M = 4 (M = 4 and M = 5 identical to the reported precision).
 *     - imp-34345 (ROUTE B, two-channel split): decomposes the exact-fit coefficient into the
 *       imp-34127 OLS-+17 detrend-cubic-bias baseline (17, ~18.9 percent) plus the imp-34211 log-T0-
 *       drift / window-width bump (72.94, ~81.1 percent). The channel SUM 17 + 72.94 = 89.94.
 *   imp-34345 already established that the two underlying MATCHERS (imp-34189 solveMatchingCoeff and
 *   imp-34267 matchCoeffForTarget) return the BIT-IDENTICAL full-precision coefficient 89.940466
 *   against the same bisected root (inter-module difference exactly 0), but it never placed the
 *   imp-34267 M-ladder LOCK value alongside its own channel SUM in a single cross-tabulation.
 *
 * THE CROSS-CHECK (import-light: reuses ONLY the two modules already-published result literals; no
 *   re-derivation, no fresh model, so the two routes cannot silently diverge here).
 *
 *   Route A -- imp-34267 endpoint-curvature LOCK:
 *     c_eff(M = 4) = 89.94, c_eff(M = 5) = 89.94 (stable LOCK), exact_fit_coeff = 89.94.
 *   Route B -- imp-34345 two-channel split:
 *     OLS baseline 17 + log-T0-drift bump 72.9405 = channel SUM 89.9405, exact_fit_coeff = 89.9405.
 *   Full-precision anchor (imp-34345, both matchers): 89.940466, inter-module difference exactly 0.
 *
 * FINDINGS (measurement / cross-check only).
 *   F1 -- BOTH ROUTES RECOVER THE SAME COEFFICIENT. Route A's M>=4 LOCK (89.94), Route B's channel SUM
 *     (89.9405), and the full-precision matcher anchor (89.940466) all agree; the underlying coefficient
 *     is bit-identical between the two modules (imp-34345 inter_module_diff = 0).
 *   F2 -- ROUTE B IS AN IDENTITY, NOT AN INDEPENDENT WITNESS. imp-34345 defines its drift bump as
 *     drift_bump = exact_fit - 17, so channel_SUM = 17 + (exact_fit - 17) reconstructs the exact-fit
 *     coefficient EXACTLY by construction: channel_SUM - imp34345.exact_fit = 0 identically. The
 *     substantive content of Route B is the 19 / 81 percent SPLIT of the coefficient, not a
 *     re-derivation of its value.
 *   F3 -- ROUTE A IS THE GENUINE INDEPENDENT WITNESS. The imp-34267 endpoint-Taylor ladder reaches
 *     89.94 by a DIFFERENT mechanism (order-by-order endpoint curvature) and LOCKS there (M = 4 == M = 5
 *     to the reported precision), confirming the exact-fit coefficient to the toFixed(3) precision
 *     without ever using the two-channel split.
 *   F4 -- THE ONLY NONZERO CROSS-ROUTE RESIDUAL IS REPORTING PRECISION. Route A publishes 89.94
 *     (toFixed(3)); Route B publishes 89.9405 (toFixed(4)); the residual 89.94 - 89.9405 = -0.0005 is a
 *     pure toFixed(3)-vs-toFixed(4) rounding artifact between the two modules, NOT a mechanism. At full
 *     precision both routes sit on 89.940466.
 *
 * VERDICT. The imp-34267 M>=4 curvature LOCK and the imp-34345 two-channel SUM agree to full precision:
 *   both land the exact-fit e^3 D^2 coefficient 89.940466, with a residual of exactly 0 at full
 *   precision and only a +/-0.0005 toFixed reporting-precision artifact between the published readings.
 *   Route B recovers the value by construction (an identity); Route A is the genuine independent
 *   endpoint-curvature witness. imp-34189s practical conclusion (quote the ceiling from the bisection)
 *   stands.
 *
 * Cross-check within the inherited imp-3220/imp-3406/imp-33810 component model only; the component
 * model is NOT a rigorous asymptotic; no bound changes; establishes no operator positivity; C_mb
 * GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-34267-m2-ceiling-exactfit-coeff-endpoint-decomposition (Route A, the M>=4-locked c_eff)
 * @see imp-34345-m2-ceiling-exactfit-90-vs-8994-residual-channel-decomposition (Route B, the two-channel split)
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (the shared matcher, prose "+90")
 */

import { IMP34267_M2_CEILING_EXACTFIT_COEFF_ENDPOINT_DECOMPOSITION as ROUTE_A } from './imp-34267-m2-ceiling-exactfit-coeff-endpoint-decomposition.js';
import { IMP34345_M2_CEILING_EXACTFIT_90_VS_8994_RESIDUAL_CHANNEL_DECOMPOSITION as ROUTE_B } from './imp-34345-m2-ceiling-exactfit-90-vs-8994-residual-channel-decomposition.js';

// Route A -- imp-34267 endpoint-curvature LOCK (already-published literals; no re-derivation).
const A_LADDER = ROUTE_A.result.coeff_ladder;
const A_LOCK_M4 = A_LADDER[4].cEff; // 89.94 (M = 4 lock)
const A_LOCK_M5 = A_LADDER[5].cEff; // 89.94 (M = 5, stable)
const A_EXACT_FIT = ROUTE_A.result.exact_fit_coeff; // 89.94 (toFixed 3)

// Route B -- imp-34345 two-channel split (already-published literals).
const B_OLS_BASELINE = ROUTE_B.result.ols_baseline_share; // 17
const B_DRIFT_BUMP = ROUTE_B.result.drift_bump_share; // 72.9405
const B_CHANNEL_SUM = +(B_OLS_BASELINE + B_DRIFT_BUMP).toFixed(4); // 89.9405
const B_EXACT_FIT = ROUTE_B.result.exact_fit_coeff; // 89.9405 (toFixed 4)

// Full-precision anchor from imp-34345 (both matchers, inter-module difference exactly 0).
const FULLPREC_ANCHOR = ROUTE_B.result.coeff_imp34267_matcher; // 89.940466
const INTER_MODULE_DIFF = ROUTE_B.result.inter_module_diff; // 0 (bit-identical, per imp-34345)

// Cross-route residuals.
const RESID_CHANNELSUM_VS_FIT = +(B_CHANNEL_SUM - B_EXACT_FIT).toFixed(6); // 0 -- identity, by construction
const RESID_M4LOCK_VS_CHANNELSUM = +(A_LOCK_M4 - B_CHANNEL_SUM).toFixed(6); // -0.0005 -- toFixed(3)-vs-(4) reporting artifact
const RESID_AFIT_VS_BFIT = +(A_EXACT_FIT - B_EXACT_FIT).toFixed(6); // -0.0005 -- same reporting artifact
const RESID_LOCK_STABILITY = +(A_LOCK_M5 - A_LOCK_M4).toFixed(6); // 0 -- M = 4 == M = 5 lock

export const IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK = {
  id: 'imp-34435',
  proofSection: 'S-frontier',
  question:
    'imp-34345 reports the two-channel split sums to the exact-fit 89.940466 and that both imp-34189 ' +
    'and imp-34267 back-solve the same bisected ceiling to a bit-identical coefficient, but never ' +
    'tabulates the imp-34267 M-ladder LOCK value against the imp-34345 channel SUM in one place. ' +
    'Cross-check that the M>=4 curvature lock (89.94) and the +17 / +72.94 channel sum agree to full ' +
    'precision and report any residual. Cross-check within the component model only; NO QED.',
  measuredQuantity:
    'The imp-34267 endpoint-curvature LOCK value c_eff(M = 4) and c_eff(M = 5), its exact_fit_coeff, ' +
    'the imp-34345 OLS baseline + drift-bump channel SUM and its exact_fit_coeff, the full-precision ' +
    'matcher anchor and its inter-module difference, and the cross-route residuals -- all reused from ' +
    'the two modules already-published result literals (no re-derivation).',
  crossTabulation: [
    { route: 'A (imp-34267 endpoint LOCK)', quantity: 'c_eff(M = 4) lock', value: A_LOCK_M4 },
    { route: 'A (imp-34267 endpoint LOCK)', quantity: 'c_eff(M = 5) stable', value: A_LOCK_M5 },
    { route: 'A (imp-34267 endpoint LOCK)', quantity: 'exact_fit_coeff (toFixed 3)', value: A_EXACT_FIT },
    { route: 'B (imp-34345 channel split)', quantity: 'OLS baseline', value: B_OLS_BASELINE },
    { route: 'B (imp-34345 channel split)', quantity: 'log-T0-drift bump', value: B_DRIFT_BUMP },
    { route: 'B (imp-34345 channel split)', quantity: 'channel SUM (17 + 72.94)', value: B_CHANNEL_SUM },
    { route: 'B (imp-34345 channel split)', quantity: 'exact_fit_coeff (toFixed 4)', value: B_EXACT_FIT },
    { route: 'both (imp-34345 matchers)', quantity: 'full-precision anchor', value: FULLPREC_ANCHOR },
    { route: 'both (imp-34345 matchers)', quantity: 'inter-module difference', value: INTER_MODULE_DIFF },
  ],
  residuals: {
    channelSum_minus_fit: RESID_CHANNELSUM_VS_FIT, // 0 -- identity (drift bump = fit - 17)
    m4lock_minus_channelSum: RESID_M4LOCK_VS_CHANNELSUM, // -0.0005 -- reporting precision
    aFit_minus_bFit: RESID_AFIT_VS_BFIT, // -0.0005 -- reporting precision
    lock_stability_m5_minus_m4: RESID_LOCK_STABILITY, // 0 -- M = 4 == M = 5 lock
    fullprecision_inter_module_diff: INTER_MODULE_DIFF, // 0 -- bit-identical
  },
  finding: {
    F1_both_routes_recover_same_coeff:
      'Route As M>=4 LOCK (' + A_LOCK_M4 + '), Route Bs channel SUM (' + B_CHANNEL_SUM + '), and the ' +
      'full-precision matcher anchor (' + FULLPREC_ANCHOR + ') all agree; the underlying coefficient is ' +
      'bit-identical between the two modules (imp-34345 inter-module difference ' + INTER_MODULE_DIFF + ').',
    F2_routeB_is_an_identity:
      'imp-34345 defines drift_bump = exact_fit - 17, so the channel SUM = 17 + (exact_fit - 17) ' +
      'reconstructs the exact-fit coefficient EXACTLY by construction (channel_SUM - exact_fit = ' +
      RESID_CHANNELSUM_VS_FIT + '). Route Bs substantive content is the ~19 / ~81 percent SPLIT, NOT an ' +
      'independent re-derivation of the value.',
    F3_routeA_is_the_independent_witness:
      'The imp-34267 endpoint-Taylor ladder reaches ' + A_LOCK_M4 + ' by a DIFFERENT mechanism ' +
      '(order-by-order endpoint curvature) and LOCKS there (M = 4 == M = 5, residual ' +
      RESID_LOCK_STABILITY + '), confirming the exact-fit coefficient to the toFixed(3) precision ' +
      'without using the two-channel split.',
    F4_only_residual_is_reporting_precision:
      'Route A publishes ' + A_EXACT_FIT + ' (toFixed 3); Route B publishes ' + B_EXACT_FIT +
      ' (toFixed 4); the residual ' + RESID_M4LOCK_VS_CHANNELSUM + ' is a pure toFixed(3)-vs-toFixed(4) ' +
      'rounding artifact between the two modules, NOT a mechanism. At full precision both routes sit on ' +
      FULLPREC_ANCHOR + '.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CROSS-CHECK (frontier-direction, NOT rigorous). Placing the imp-34267 M>=4 endpoint-' +
    'curvature LOCK (c_eff(M = 4) = c_eff(M = 5) = ' + A_LOCK_M4 + ') alongside the imp-34345 two-channel ' +
    'SUM (17 + ' + B_DRIFT_BUMP + ' = ' + B_CHANNEL_SUM + ') in one table shows both routes recover the ' +
    'exact-fit e^3 D^2 coefficient ' + FULLPREC_ANCHOR + ' with a full-precision inter-module difference ' +
    'of exactly ' + INTER_MODULE_DIFF + '. The channel-SUM route recovers the value by construction ' +
    '(drift_bump = exact_fit - 17, so channel_SUM - exact_fit = ' + RESID_CHANNELSUM_VS_FIT + '); the ' +
    'endpoint-curvature LOCK is the genuine independent witness, reaching ' + A_LOCK_M4 + ' by an ' +
    'order-by-order Taylor mechanism and locking (M = 4 == M = 5). The only nonzero cross-route residual ' +
    'in the published readings is ' + RESID_M4LOCK_VS_CHANNELSUM + ', a toFixed(3)-vs-toFixed(4) ' +
    'reporting-precision artifact, not a mechanism. imp-34189s practical conclusion (no nearby low-order ' +
    'closed form; quote the ceiling from the bisection) stands. The inherited imp-3220/imp-3406 component ' +
    'model is NOT a rigorous asymptotic; descriptive within the model only; changes no bound; establishes ' +
    'no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34267 (Route A, the M>=4-locked endpoint-curvature c_eff ~ 89.94); imp-34345 (Route B, the ' +
    'two-channel 17 + 72.94 split and the bit-identical full-precision matcher anchor 89.940466); ' +
    'imp-34189 (the shared single-coefficient matcher and the prose "+90" descriptor).',
};

export const IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK_ASSERTIONS = [
  {
    // (A) Route A M>=4 lock is ~89.94 and stable (M = 4 == M = 5).
    id: 'imp34435-routeA-lock-stable-near-89p94',
    description: 'the imp-34267 endpoint LOCK c_eff(M = 4) is ~89.94 and equals c_eff(M = 5)',
    holds: () =>
      Math.abs(A_LOCK_M4 - 89.94) < 0.05 && RESID_LOCK_STABILITY === 0,
  },
  {
    // (B) Route B channel SUM reconstructs the exact-fit exactly (identity, by construction).
    id: 'imp34435-routeB-channelsum-is-identity',
    description: 'the imp-34345 channel SUM equals its exact_fit_coeff exactly (residual 0)',
    holds: () =>
      RESID_CHANNELSUM_VS_FIT === 0 && Math.abs(B_CHANNEL_SUM - 89.9405) < 1e-9,
  },
  {
    // (C) Both routes recover the bit-identical full-precision anchor (inter-module diff exactly 0).
    id: 'imp34435-fullprecision-bit-identical',
    description: 'both matchers land 89.940466 with inter-module difference exactly 0',
    holds: () =>
      INTER_MODULE_DIFF === 0 && Math.abs(FULLPREC_ANCHOR - 89.940466) < 1e-6,
  },
  {
    // (D) The only nonzero cross-route residual is the ~0.0005 toFixed(3)-vs-(4) reporting artifact.
    id: 'imp34435-only-residual-is-reporting-precision',
    description: 'the M>=4 lock vs channel SUM residual is a ~0.0005 reporting-precision artifact',
    holds: () =>
      Math.abs(RESID_M4LOCK_VS_CHANNELSUM) < 1e-3 &&
      Math.abs(RESID_M4LOCK_VS_CHANNELSUM) > 1e-5 &&
      RESID_AFIT_VS_BFIT === RESID_M4LOCK_VS_CHANNELSUM,
  },
  {
    // (E) The cross-tabulation is present in one place (>= 9 rows spanning both routes).
    id: 'imp34435-cross-tabulation-present',
    description: 'the cross-tabulation table has both routes and the full-precision anchor in one place',
    holds: () =>
      IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK.crossTabulation.length >= 9 &&
      IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK.crossTabulation.some((r) => /^A /.test(r.route)) &&
      IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK.crossTabulation.some((r) => /^B /.test(r.route)),
  },
  {
    // Honesty gate: cross-check only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34435-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK.verdict),
  },
];

for (const a of IMP34435_M2_CEILING_LOCK_VS_CHANNELSUM_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34435-m2-ceiling-lock-vs-channelsum-crosscheck assertion failed: ${a.id}`);
  }
}
