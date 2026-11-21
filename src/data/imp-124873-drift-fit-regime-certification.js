/**
 * @module imp-124873-drift-fit-regime-certification
 *
 * imp-124873 (accuracy / cross-validation, frontier cross-check): imp-124836 formalized the invariant-product
 * discriminator P = |reldiff|*|X| = (D + tau)*|X| + R and proved it only certifies drift-freeness on the
 * ROUND-OFF-LIMITED side (R dominates the linear term across the ladder, so P is flat and reldiff ~ R/|X| has
 * log-log slope -1); in the TRUNCATION-LIMITED / linear-dominated regime a DECREASING P is ambiguous (the
 * truncation floor tau mimics a genuine drift D, both giving P slope +1), so a flat-P certification is invalid
 * there -- the very regime the imp-124828 extended-precision re-run entered when R was lifted. The imp-124850
 * OLS drift-slope fit read a statistically-zero slope D = -8.05e-12 +/- 1.27e-11 off the SAME L2..L7 ladder and
 * capped the drift at D <= D_min, but never checked the imp-124836 validity condition against its own ladder.
 * This leaf CROSS-VALIDATES that the imp-124850 ladder sits in the round-off-limited (valid) regime: it consumes
 * the imp-124850 published L2..L7 |E_CF|, |reldiff| and product P = |reldiff|*|E_CF| VERBATIM and measures
 * (1) the P-vs-|E_CF| log-log slope (round-off-limited => flat ~0; failure => +1), (2) the reldiff-vs-|E_CF|
 * log-log slope (round-off-limited => -1; failure => 0), (3) the round-off-limited condition R vs the genuine
 * linear term (D + tau)*|X|_max, and (4) the certifiable sensitivity floor D_min = max(R/|X|_max, tau). It then
 * confirms the imp-124850 cap D <= D_min is a VALID certification, NOT the ambiguous decreasing-P signature.
 * Accuracy/cross-validation only; conditional-share diagnostic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; no bound moves; NO QED.
 *
 * WHY THE REGIME MATTERS (the imp-124836 validity condition applied to the imp-124850 fit)
 * --------------------------------------------------------------------------------------
 * imp-124836 F2/F3: flatness of P certifies drift-freeness ONLY in the round-off-limited regime
 * R >> (D + tau)*|X|_max, where reldiff ~ R/|X| (log-log slope -1) and P is flat (log-log slope 0); there the
 * cap |D| <= R/|X|_max + tau is meaningful. In the linear/truncation-limited regime ((D + tau)*|X| >> R) P
 * DECREASES (slope +1) and reldiff flattens (slope 0), and a genuine drift (regime B) is algebraically
 * indistinguishable from a pure truncation floor with D = 0 (regime C) -- so a decreasing P is NOT proof of
 * drift and a flat-P cap is not a valid certification. imp-124828 exhibited the failure numerically: at raised
 * precision R collapsed, the P slope flipped to +0.121 and reldiff plateaued at the |X|-independent stencil
 * floor tau = 3.333e-14. The open question this leaf answers: does the imp-124850 double-precision L2..L7 ladder
 * sit on the VALID (round-off-limited) side, so its D <= D_min cap is a genuine certification?
 *
 * THE MEASUREMENT (on the imp-124850 published ladder, consumed verbatim)
 * ---------------------------------------------------------------------
 *   LANDMARK   sigma    |E_CF|         |reldiff|      P = |reldiff|*|E_CF|
 *   L2         0.9      2.5163e-1      5.8038e-12     1.4604e-12
 *   L3         0.5      3.9989e-3      4.7537e-10     1.9009e-12
 *   L4         0.1      7.3778e-5      2.2670e-8      1.6725e-12
 *   L5         0.02     3.2456e-6      2.8841e-7      9.3608e-13
 *   L6         0.005    2.3935e-7      2.0083e-5      4.8069e-12
 *   L7         0.001    1.1655e-8      6.8013e-4      7.9271e-12
 *   P-vs-|E_CF| log-log slope       = -0.085   (flat, |slope| < 0.15  => round-off-limited, NOT the +1 failure)
 *   reldiff-vs-|E_CF| log-log slope = -1.085   (within 0.15 of -1     => R/|X| signature, NOT the 0 failure)
 *   R = 3.46e-12 (imp-124850 fitted intercept);  tau = 3.333e-14 (imp-124828);  |X|_max = |E_CF|(L2) = 0.2516
 *   genuine linear term (tau)*|X|_max = 8.39e-15;  R / [(tau)*|X|_max] = 412.6  (R >> linear => round-off-limited)
 *   D_min = max(R/|X|_max, tau) = 1.375e-11  (round-off-limited: R/|X|_max dominates tau)
 *
 * THE FINDING (accuracy / cross-validation only)
 * ---------------------------------------------
 *   (M1) THE LADDER SITS IN THE ROUND-OFF-LIMITED (VALID) REGIME. The P-vs-|E_CF| log-log slope is -0.085 (flat,
 *        |slope| < 0.15, product spread only 8.5x across six rungs) and the reldiff-vs-|E_CF| slope is -1.085
 *        (within 0.15 of -1). These are precisely the imp-124836 regime-A signatures (flat P, reldiff ~ R/|X|),
 *        NOT the failure signature (P slope +1, reldiff slope 0). The imp-124850 fit reads a FLAT floor, so its
 *        cap is on the valid side of the discriminator.
 *   (M2) THE ROUND-OFF FLOOR DOMINATES THE GENUINE LINEAR TERM. With the identity drift D = 0 (imp-124808) the
 *        genuine linear coefficient is the truncation floor tau = 3.333e-14, and (tau)*|X|_max = 8.39e-15 is
 *        smaller than the round-off floor R = 3.46e-12 by a factor 412.6 -- the round-off-limited condition
 *        R >> (D + tau)*|X|_max holds with three orders of margin. Even the noise-inflated fitted slope's linear
 *        term |D_fit|*|X|_max = 2.03e-12 stays BELOW R, i.e. the fitted slope is buried under the round-off
 *        floor, confirming the fit cannot resolve any drift below D_min and is not detecting a linear structure.
 *   (M3) THE imp-124850 CAP D <= D_min IS A VALID CERTIFICATION, NOT AN AMBIGUOUS DECREASING-P SIGNATURE. Because
 *        the ladder is round-off-limited (M1) and R dominates the linear term (M2), the imp-124850 statistically-
 *        zero slope and its D <= D_min = 1.375e-11 cap certify drift-freeness in the sense imp-124836 F2 makes
 *        rigorous, consistent with the imp-124808 dps=100 D = 0. The imp-124828 truncation-limited failure
 *        regime is NOT entered at double precision; the certification is genuine, not a truncation artifact.
 *
 * ACCURACY / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486,
 * the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are
 * UNTOUCHED and enter only via the imp-124850 published ladder; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124850-pairratio-drift-slope-fit (the L2..L7 P = D*|E_CF| + R OLS drift fit certified here)
 * @see imp-124836-invariant-product-discriminator-general-test (the valid-vs-failure regime condition applied here)
 * @see imp-124828-extprec-pairratio-Pladder (the truncation-limited failure regime this leaf rules out at dp)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath dps=100 proof that the identity drift D = 0)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (the EXACT pair-ratio identity under test)
 */

import { IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT as FIT } from './imp-124850-pairratio-drift-slope-fit.js';

// The imp-124828 O(eps^4) stencil truncation floor (dps-invariant across 30/50/80), baked as in imp-124836.
const TAU = 3.333e-14;

// Consume the imp-124850 published L2..L7 ladder VERBATIM (its rounded absE_CF / absReldiff / product outputs).
const ROWS = FIT.ladder.map((r) => ({
  key: r.key,
  sigma: r.sigma,
  x: r.absE_CF, // |E_CF| (the collapsing axis)
  reldiff: r.absReldiff, // pair-ratio |reldiff|
  product: r.product_reldiff_times_absECF, // P = |reldiff|*|E_CF|
}));

// The imp-124850 fitted round-off floor intercept and best-fit (noise) drift slope.
const R_FLOOR = FIT.fit.roundoff_floor_R; // 3.46e-12
const D_FIT = FIT.fit.drift_slope_D; // -8.05e-12 (statistically zero, t = -0.64)
const X_MAX = Math.max(...ROWS.map((r) => r.x)); // |E_CF|(L2) = 0.2516 (least round-off-contaminated rung)

// log-log ordinary-least-squares slope of |y| against x over the ladder rows (imp-124836 loglogSlope, verbatim).
function loglogSlope(rows, ykey) {
  const xs = rows.map((r) => Math.log(r.x));
  const ys = rows.map((r) => Math.log(Math.abs(r[ykey])));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  return sxy / sxx;
}

const P_SLOPE = loglogSlope(ROWS, 'product'); // ~0 flat (round-off-limited) vs +1 (linear/truncation-limited)
const RELDIFF_SLOPE = loglogSlope(ROWS, 'reldiff'); // ~ -1 (round-off-limited) vs ~0 (truncation-limited)
const P_SPREAD = Math.max(...ROWS.map((r) => r.product)) / Math.min(...ROWS.map((r) => r.product));

// The round-off-limited condition R >> (D + tau)*|X|_max, evaluated with the genuine coefficient (D = 0 => tau).
const GENUINE_LINEAR_AT_XMAX = TAU * X_MAX; // (D_true + tau)*|X|_max with D_true = 0 (imp-124808)
const R_OVER_LINEAR = R_FLOOR / GENUINE_LINEAR_AT_XMAX; // >> 1 => round-off-limited (valid)
const FIT_LINEAR_AT_XMAX = Math.abs(D_FIT) * X_MAX; // the noise-inflated fitted slope's linear term at |X|_max
const R_OVER_FIT_LINEAR = R_FLOOR / FIT_LINEAR_AT_XMAX; // > 1 => even the fitted slope is buried under R

// The certifiable sensitivity floor D_min = max(R/|X|_max, tau) (imp-124836).
const D_MIN = Math.max(R_FLOOR / X_MAX, TAU);
const ROUNDOFF_LIMITED = R_FLOOR / X_MAX > TAU; // D_min set by round-off, not truncation

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124873_DRIFT_FIT_REGIME_CERTIFICATION = {
  id: 'imp-124873',
  proofSection: 'S-frontier',
  question:
    'imp-124836 proved the invariant-product discriminator P = |reldiff|*|X| = (D + tau)*|X| + R certifies ' +
    'drift-freeness ONLY on the round-off-limited side (flat P, reldiff ~ R/|X| slope -1); in the truncation- ' +
    'limited regime a decreasing P is ambiguous (tau mimics a drift D). The imp-124850 OLS drift fit read a ' +
    'statistically-zero slope off the SAME L2..L7 ladder but never checked that validity condition. Does the ' +
    'imp-124850 ladder sit in the round-off-limited (valid) regime, so its cap D <= D_min is a genuine ' +
    'certification and not an ambiguous decreasing-P signature? Cross-validation only; no bound moves; no QED.',
  method:
    'Consume the imp-124850 published L2..L7 |E_CF|, |reldiff| and product P = |reldiff|*|E_CF| verbatim. ' +
    'Measure the P-vs-|E_CF| log-log slope (round-off-limited => flat ~0; failure => +1) and the ' +
    'reldiff-vs-|E_CF| log-log slope (round-off-limited => -1; failure => 0). Evaluate the round-off-limited ' +
    'condition R >> (D + tau)*|X|_max with the genuine coefficient (D = 0 per imp-124808, so tau), and the ' +
    'sensitivity floor D_min = max(R/|X|_max, tau). Confirm the imp-124850 cap D <= D_min is a valid ' +
    'certification, matching the imp-124836 regime A and excluding the imp-124828 truncation-limited failure.',
  ladder: ROWS.map((r) => ({
    key: r.key,
    sigma: r.sigma,
    absE_CF: round(r.x),
    absReldiff: round(r.reldiff),
    product_reldiff_times_absECF: round(r.product),
  })),
  regime_signatures: {
    P_vs_absECF_loglog_slope: round(P_SLOPE, 3),
    reldiff_vs_absECF_loglog_slope: round(RELDIFF_SLOPE, 3),
    P_spread_max_over_min: +P_SPREAD.toFixed(3),
    round_off_limited_reference: 'P slope ~0 flat, reldiff slope ~ -1 (imp-124836 regime A / valid)',
    failure_reference: 'P slope ~ +1, reldiff slope ~0 (imp-124836 regime B/C / truncation-limited failure)',
  },
  validity_condition: {
    R_roundoff_floor: round(R_FLOOR),
    tau_truncation_floor: round(TAU),
    X_max: round(X_MAX),
    genuine_linear_term_at_Xmax: round(GENUINE_LINEAR_AT_XMAX),
    R_over_genuine_linear: +R_OVER_LINEAR.toFixed(1),
    fit_slope_linear_term_at_Xmax: round(FIT_LINEAR_AT_XMAX),
    R_over_fit_linear: +R_OVER_FIT_LINEAR.toFixed(3),
    note:
      'R = ' + round(R_FLOOR) + ' exceeds the genuine linear term (D=0 => tau)*|X|_max = ' +
      round(GENUINE_LINEAR_AT_XMAX) + ' by a factor ' + R_OVER_LINEAR.toFixed(1) + ' (round-off-limited ' +
      'condition R >> (D + tau)*|X|_max holds with three orders of margin); even the noise-inflated fitted ' +
      'slope linear term |D_fit|*|X|_max = ' + round(FIT_LINEAR_AT_XMAX) + ' stays below R (ratio ' +
      R_OVER_FIT_LINEAR.toFixed(2) + '), so the fit is buried under the round-off floor.',
  },
  sensitivity_floor: {
    D_min: round(D_MIN),
    formula: 'D_min = max(R/|X|_max, tau)',
    round_off_limited: ROUNDOFF_LIMITED,
    imp124850_two_sigma_bound: round(FIT.fit.drift_bound_2sigma),
    imp124811_single_rung_cap: round(FIT.fit.single_rung_cap_L2),
  },
  finding: {
    M1_round_off_limited_valid_regime:
      'The P-vs-|E_CF| log-log slope is ' + P_SLOPE.toFixed(3) + ' (flat, |slope| < 0.15, product spread only ' +
      P_SPREAD.toFixed(1) + 'x across six rungs) and the reldiff-vs-|E_CF| slope is ' + RELDIFF_SLOPE.toFixed(3) +
      ' (within 0.15 of -1): the imp-124836 regime-A round-off-limited signatures (flat P, reldiff ~ R/|X|), ' +
      'NOT the failure signature (P slope +1, reldiff slope 0). The imp-124850 fit reads a flat floor.',
    M2_roundoff_floor_dominates_linear:
      'With D = 0 (imp-124808) the genuine linear coefficient is tau = ' + TAU.toExponential(3) + ', so ' +
      '(D + tau)*|X|_max = ' + GENUINE_LINEAR_AT_XMAX.toExponential(3) + ' is smaller than R = ' +
      R_FLOOR.toExponential(3) + ' by a factor ' + R_OVER_LINEAR.toFixed(1) + ' -- the round-off-limited ' +
      'condition R >> (D + tau)*|X|_max holds with three orders of margin. Even |D_fit|*|X|_max = ' +
      FIT_LINEAR_AT_XMAX.toExponential(3) + ' stays below R, so the fitted slope is buried under the floor.',
    M3_cap_is_valid_certification:
      'Because the ladder is round-off-limited (M1) and R dominates the linear term (M2), the imp-124850 ' +
      'statistically-zero slope and its D <= D_min = ' + D_MIN.toExponential(3) + ' cap certify drift-freeness ' +
      'in the sense imp-124836 F2 makes rigorous, consistent with the imp-124808 dps=100 D = 0. The imp-124828 ' +
      'truncation-limited failure regime is NOT entered at double precision -- the certification is genuine, ' +
      'not an ambiguous decreasing-P (truncation) signature.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Applying the imp-124836 valid-regime ' +
    'discriminator to the imp-124850 L2..L7 drift-fit ladder: the P-vs-|E_CF| log-log slope is ' +
    P_SLOPE.toFixed(3) + ' (flat, product spread ' + P_SPREAD.toFixed(1) + 'x) and the reldiff-vs-|E_CF| slope ' +
    'is ' + RELDIFF_SLOPE.toFixed(3) + ' (~ -1) -- the imp-124836 regime-A round-off-limited signatures, NOT the ' +
    'linear/truncation-limited failure (P slope +1, reldiff slope 0). The round-off-limited condition ' +
    'R >> (D + tau)*|X|_max holds: R = ' + R_FLOOR.toExponential(3) + ' exceeds the genuine linear term ' +
    '(D = 0 => tau)*|X|_max = ' + GENUINE_LINEAR_AT_XMAX.toExponential(3) + ' by ' + R_OVER_LINEAR.toFixed(1) +
    'x, and even the noise-inflated |D_fit|*|X|_max = ' + FIT_LINEAR_AT_XMAX.toExponential(3) + ' stays below R. ' +
    'The sensitivity floor D_min = max(R/|X|_max, tau) = ' + D_MIN.toExponential(3) + ' is round-off-limited, so ' +
    'the imp-124850 statistically-zero slope and its D <= D_min cap are a VALID certification of drift-freeness ' +
    '(imp-124836 F2), consistent with the imp-124808 dps=100 D = 0; the imp-124828 truncation-limited failure ' +
    'regime is NOT entered at double precision. Conditional-share diagnostic on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (enter only ' +
    'via the imp-124850 published ladder); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124850 (the L2..L7 P = D*|E_CF| + R OLS drift fit certified here); imp-124836 (the valid-vs-failure ' +
    'regime condition applied here); imp-124828 (the truncation-limited failure regime ruled out at double ' +
    'precision); imp-124808 (mpmath dps=100 proof D = 0); imp-97665 (the EXACT pair-ratio identity under test); ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP124873_DRIFT_FIT_REGIME_CERTIFICATION_ASSERTIONS = [
  {
    // The consumed ladder is the imp-124850 L2..L7 ladder with strictly collapsing |E_CF|.
    id: 'imp124873-ladder-matches-imp124850',
    description: 'ladder has L2..L7 with strictly decreasing |E_CF| (consumes the imp-124850 published ladder)',
    holds: () =>
      ROWS.length === 6 &&
      ROWS.every((r, i) => i === 0 || r.x < ROWS[i - 1].x),
  },
  {
    // (M1): P is flat (round-off-limited), NOT the +1 slope of the linear/truncation-limited failure regime.
    id: 'imp124873-P-slope-flat-roundoff-limited',
    description: 'the P-vs-|E_CF| log-log slope is flat (|slope| < 0.15): round-off-limited, not the +1 failure',
    holds: () => Math.abs(P_SLOPE) < 0.15,
  },
  {
    // (M1): reldiff ~ R/|X| (slope -1), the round-off-limited signature, NOT the ~0 truncation-limited plateau.
    id: 'imp124873-reldiff-slope-minus-one',
    description: 'the reldiff-vs-|E_CF| log-log slope is within 0.15 of -1 (R/|X| signature, not the 0 plateau)',
    holds: () => Math.abs(RELDIFF_SLOPE - -1) < 0.15,
  },
  {
    // (M1): the product stays a flat floor across the ladder (imp-124836 regime-A spread bound).
    id: 'imp124873-P-spread-flat-floor',
    description: 'the invariant product stays within a factor 20 across the ladder (a flat floor, regime A)',
    holds: () => P_SPREAD < 20,
  },
  {
    // (M2): the round-off-limited condition R >> (D + tau)*|X|_max holds with a large margin (D = 0 => tau).
    id: 'imp124873-roundoff-dominates-genuine-linear',
    description: 'R exceeds the genuine linear term (D=0 => tau)*|X|_max by a factor > 100 (round-off-limited)',
    holds: () => R_OVER_LINEAR > 100,
  },
  {
    // (M2): even the noise-inflated fitted slope linear term at |X|_max stays below the round-off floor R.
    id: 'imp124873-fit-slope-buried-under-floor',
    description: 'even |D_fit|*|X|_max stays below R (ratio > 1): the fitted slope is buried under the round-off floor',
    holds: () => R_OVER_FIT_LINEAR > 1,
  },
  {
    // (M3): the sensitivity floor is round-off-limited (R/|X|_max dominates tau), so D_min = R/|X|_max.
    id: 'imp124873-Dmin-roundoff-limited',
    description: 'D_min = max(R/|X|_max, tau) is set by R/|X|_max (round-off-limited) and lands in [1e-12, 1e-10]',
    holds: () => ROUNDOFF_LIMITED && D_MIN > 1e-12 && D_MIN < 1e-10,
  },
  {
    // Honesty gate: accuracy/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp124873-honesty-gate-no-qed',
    description: 'Accuracy/cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124873_DRIFT_FIT_REGIME_CERTIFICATION.isRigorous === false &&
      /NO QED/.test(IMP124873_DRIFT_FIT_REGIME_CERTIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP124873_DRIFT_FIT_REGIME_CERTIFICATION.verdict),
  },
];

for (const a of IMP124873_DRIFT_FIT_REGIME_CERTIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124873-drift-fit-regime-certification assertion failed: ${a.id}`);
  }
}
