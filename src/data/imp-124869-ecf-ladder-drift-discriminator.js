/**
 * @module imp-124869-ecf-ladder-drift-discriminator
 *
 * imp-124869 (numerical/cross-validation, frontier delineation): imp-124836 formalized a GENERAL round-off-vs-
 * truncation drift discriminator with the invariant-product model P = |reldiff|*|X| = (D + tau)*|X| + R and the
 * certifiable sensitivity floor D_min = max(R/|X|_max, tau), but re-derived it on only ONE collapsing quantity --
 * the imp-124811 pair-ratio E_CF/E_ET = E_flow/E_trunc, which sat in the ROUND-OFF-LIMITED (valid) regime
 * (D_min ~ R/|X|_max ~ 9.3e-12, tau ~ 3.33e-14 swamped). This leaf applies the SAME discriminator to an
 * INDEPENDENT collapsing quantity: the DIRECT central-difference E_CF elasticity ladder of imp-124769/imp-124849,
 * where the identity under test is the closed-form reconstruction E_CF^direct = E_CF^recon = K*(-E_flow*sigma/E_N)
 * across the landmarks L2..L6. All anchor numbers are BAKED VERBATIM from the imp-124769 sibling ladder (imported,
 * not recomputed). Measurement/cross-validation only; conditional-share diagnostic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE MAPPING ONTO THE imp-124836 MODEL
 * -------------------------------------
 * The collapsing axis is the E_CF elasticity itself: |X|_i = |E_CF|(L_i), descending 2.516e-1 -> 2.393e-7 across
 * L2..L6. The finite-difference cross-check error of the DIRECT 2-point reconstruction is
 *   errCF = |E_CF^direct - E_CF^recon|,  reldiff = errCF/|X| = relTrunc,
 * so the invariant product is exactly the absolute error P = |reldiff|*|X| = errCF. The imp-124769 decomposition
 * gives the two floors directly:
 *   tau = relTrunc_mean ~ 3.25e-7  (the O(eps^2) 2-point stencil truncation floor at the headline eps = 1e-3),
 *   R   = 4.46e-13                 (the landmark-bisection round-off floor, the L5 errCF minimum),
 *   |X|_max = |E_CF|(L2) = 2.516e-1 (the flow-heavy rung, least round-off-contaminated).
 *
 * THE REGIME PLACEMENT (the deliverable, and the contrast with imp-124811)
 * -----------------------------------------------------------------------
 * Comparing the two floor terms of D_min = max(R/|X|_max, tau):
 *   R/|X|_max = 4.46e-13 / 2.516e-1 ~ 1.77e-12   (subordinate here),
 *   tau       = 3.25e-7                            (dominant here).
 * So for THIS collapsing quantity tau DOMINATES: the direct E_CF ladder sits in the TRUNCATION-LIMITED regime --
 * the imp-124836 FAILURE regime for certifying drift-freeness -- across L2..L5, the OPPOSITE regime from the
 * imp-124811 pair-ratio (round-off-limited). The signature confirms it: the invariant product P = errCF DECREASES
 * across L2..L5 (7.50e-8, 1.33e-9, 2.53e-11, 4.46e-13; log-log P-vs-|X| slope +0.98 over L2..L4, spread 1.68e5 --
 * NOT flat), while reldiff is FLAT (log-log slope -0.02 over L2..L4, i.e. the |X|-independent tau plateau). Per
 * imp-124836 F3 a DECREASING P is AMBIGUOUS: a genuine drift D and a pure truncation floor tau enter identically as
 * the sum (D + tau)*|X|, so the flat-P discriminator CANNOT certify drift-freeness on this ladder above the
 * crossover. The reason the two instances land in opposite regimes is the stencil order: the pair-ratio identity
 * truncation cancels to O(eps^4) (tau ~ 3.33e-14), whereas the direct 2-point reconstruction carries the full
 * O(eps^2) truncation (tau ~ 3.25e-7), seven orders larger -- swamping R/|X|_max instead of being swamped by it.
 *
 * THE CERTIFIED DRIFT CAP AND WHERE THE VALID REGIME BEGINS
 * --------------------------------------------------------
 * The certifiable sensitivity floor is D_min = max(R/|X|_max, tau) = tau ~ 3.25e-7 -- FIVE orders WEAKER than the
 * imp-124811 pair-ratio cap (~9.3e-12), because truncation, not round-off, sets the floor. The test therefore
 * reports only D <= 3.25e-7 on the direct ladder (consistent with D = 0, but far less sensitive). The ladder DOES
 * enter the round-off-limited (valid, flat-P) regime, but only BELOW the imp-124769 crossover |E_CF|_crit ~ 1.37e-6
 * / sigma_crit ~ 0.0127 -- i.e. at L6 (errCF turns back UP to 3.40e-12 as round-off takes over) and deeper, exactly
 * where imp-124849 confirmed the extended-precision floor. Above the crossover (L2..L5) the discriminator is in its
 * failure regime; below it, the flat-P certification would apply but the drift cap it could certify there is set by
 * R/|X| at those tiny |X|, itself much weaker than the pair-ratio's.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * enter only through the imported imp-124769 anchor literals; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124836-invariant-product-discriminator-general-test (the general discriminator + D_min applied here)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the direct E_CF ladder + tau/R crossover -- anchor source)
 * @see imp-124849-extprec-ecf-floor-sigmacrit (extended-precision E_CF floor / sigma_crit confirmation)
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law (the FIRST instance -- round-off-limited, opposite regime)
 */

import { IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER as SRC } from './imp-124769-ecf-stencil-noise-floor-crossover.js';

// --- Anchor ladder BAKED VERBATIM from the imp-124769 sibling (imported, not recomputed) --------------------
// Each rung: the collapsing axis |X| = |E_CF| and the invariant product P = |reldiff|*|X| = errCF (absolute FD
// cross-check error of E_CF^direct vs E_CF^recon at the shared headline step eps = 1e-3).
const LADDER = SRC.ladder.map((r) => ({
  key: r.key,
  sigma: r.sigma,
  absX: Math.abs(r.E_CF), // |E_CF| (the collapsing quantity)
  product: r.errCF_at_1em3, // P = |reldiff|*|X| = errCF
  reldiff: r.relTrunc_at_1em3, // |reldiff| = errCF/|X|
}));
const byKey = Object.fromEntries(LADDER.map((r) => [r.key, r]));

// The two floors, read straight from the imp-124769 decomposition.
const TAU = SRC.truncationPlateau.relTrunc_mean; // relative O(eps^2) 2-point truncation floor ~ 3.25e-7
const R = SRC.roundoffFloor.R_abs; // absolute landmark-bisection round-off floor ~ 4.46e-13 (L5 minimum)
const X_MAX = Math.max(...LADDER.map((r) => r.absX)); // |E_CF|(L2), the flow-heavy rung

// The imp-124769 crossover: where truncation meets round-off (valid-regime boundary for the flat-P test).
const ECF_CRIT = SRC.crossover.E_CF_crit;
const SIGMA_CRIT = SRC.crossover.sigma_crit;

// The imp-124836 sensitivity floor and its dominant term.
const R_OVER_XMAX = R / X_MAX;
const D_MIN = Math.max(R_OVER_XMAX, TAU);
const TRUNCATION_LIMITED = TAU > R_OVER_XMAX; // true here => imp-124836 FAILURE regime

// The imp-124811 pair-ratio comparison (round-off-limited: the OPPOSITE regime).
const IMP124811_DMIN = 9.3e-12; // R/|X|_max there (imp-124836 sensitivity floor)
const IMP124811_TAU = 3.333e-14; // O(eps^4) pair-ratio identity truncation floor (imp-124828)

// log-log ordinary-least-squares slope of y (a row key) against |X| over the given rungs.
function loglogSlope(rows, ykey) {
  const xs = rows.map((r) => Math.log(r.absX));
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
const spread = (rows) => {
  const ps = rows.map((r) => r.product);
  return Math.max(...ps) / Math.min(...ps);
};
const round = (x, s = 4) => +x.toExponential(s);

// The truncation-limited arm (L2..L5): P tracks tau*|X| (decreasing), reldiff is flat at tau.
const TRUNC_ARM = ['L2', 'L3', 'L4', 'L5'].map((k) => byKey[k]);
const CLEAN_ARM = ['L2', 'L3', 'L4'].map((k) => byKey[k]); // the clean O(eps^2) plateau (before the floor)
const P_SLOPE_CLEAN = loglogSlope(CLEAN_ARM, 'product'); // ~ +1 (decreasing P, linear-dominated)
const RELDIFF_SLOPE_CLEAN = loglogSlope(CLEAN_ARM, 'reldiff'); // ~ 0 (flat reldiff = tau plateau)
const P_SPREAD_TRUNC = spread(TRUNC_ARM); // >> 1 (NOT flat: not round-off-limited)

export const IMP124869_ECF_LADDER_DRIFT_DISCRIMINATOR = {
  id: 'imp-124869',
  proofSection: 'S-frontier',
  question:
    'imp-124836 formalized a general round-off-vs-truncation drift discriminator with sensitivity floor ' +
    'D_min = max(R/|X|_max, tau) but re-derived it on only ONE collapsing quantity (the imp-124811 pair-ratio). ' +
    'Apply the SAME discriminator to an independent collapsing quantity -- the direct central-difference E_CF ' +
    'elasticity ladder of imp-124769/imp-124849 -- reporting R, tau, |X|_max, the regime placement, and the ' +
    'certified drift cap D <= D_min there. Cross-validation only; no bound moves; no QED.',
  method:
    'Map the imp-124769 direct-reconstruction cross-check onto the imp-124836 model: the collapsing axis is ' +
    '|X| = |E_CF| across L2..L6, the invariant product is P = |reldiff|*|X| = errCF (the absolute FD error of ' +
    'E_CF^direct vs E_CF^recon at eps = 1e-3), the relative truncation floor is tau = relTrunc_mean, and the ' +
    'round-off floor is R = the L5 errCF minimum. Read the ladder shape of P vs |X|, compare R/|X|_max against ' +
    'tau to place the regime, and read off D_min = max(R/|X|_max, tau). All anchor numbers baked from imp-124769.',
  anchors_from_imp124769: {
    ladder_absX_L2_to_L6: LADDER.map((r) => round(r.absX)),
    invariant_product_P_L2_to_L6: LADDER.map((r) => r.product),
    tau_relative_truncation_floor: round(TAU),
    R_roundoff_floor: round(R),
    X_max_at_L2: round(X_MAX),
    crossover_E_CF_crit: ECF_CRIT,
    crossover_sigma_crit: SIGMA_CRIT,
  },
  regime_placement: {
    R_over_Xmax: round(R_OVER_XMAX),
    tau: round(TAU),
    truncation_limited: TRUNCATION_LIMITED,
    P_loglog_slope_clean_arm: +P_SLOPE_CLEAN.toFixed(3),
    reldiff_loglog_slope_clean_arm: +RELDIFF_SLOPE_CLEAN.toFixed(3),
    P_spread_max_over_min_L2_to_L5: round(P_SPREAD_TRUNC),
    note:
      'tau ~ 3.25e-7 DOMINATES R/|X|_max ~ 1.77e-12, so the direct E_CF ladder sits in the imp-124836 ' +
      'TRUNCATION-LIMITED (FAILURE) regime across L2..L5 -- the OPPOSITE regime from the imp-124811 pair-ratio ' +
      '(round-off-limited). P = errCF DECREASES (P-vs-|X| slope +0.98, spread 1.68e5, NOT flat) while reldiff is ' +
      'FLAT (slope -0.02): the truncation-limited signature. Per imp-124836 F3 a decreasing P is AMBIGUOUS between ' +
      'a drift D and a truncation floor tau, so the flat-P discriminator CANNOT certify drift-freeness here.',
  },
  sensitivity_floor: {
    D_min: round(D_MIN),
    dominant_term: TRUNCATION_LIMITED ? 'tau (truncation)' : 'R/|X|_max (round-off)',
    formula: 'D_min = max(R/|X|_max, tau)',
    valid_regime_boundary: {
      E_CF_crit: ECF_CRIT,
      sigma_crit: SIGMA_CRIT,
      note:
        'the round-off-limited (valid, flat-P) regime begins only BELOW the imp-124769 crossover ' +
        '|E_CF|_crit ~ 1.37e-6 / sigma_crit ~ 0.0127 (at L6, where errCF turns back UP to the round-off floor, ' +
        'and deeper, per imp-124849); above it (L2..L5) the discriminator is in its failure regime.',
    },
    comparison_to_imp124811: {
      imp124811_D_min: IMP124811_DMIN,
      imp124811_tau: IMP124811_TAU,
      ratio_weaker: round(D_MIN / IMP124811_DMIN),
      note:
        'D_min ~ 3.25e-7 is ~3.5e4x WEAKER than the imp-124811 pair-ratio cap ~9.3e-12: there R/|X|_max set the ' +
        'floor (round-off-limited, tau ~ 3.33e-14 from the O(eps^4) identity-truncation cancellation), here tau ' +
        'sets it (the direct 2-point O(eps^2) reconstruction carries seven orders more truncation).',
    },
  },
  finding: {
    M1_floors_and_Xmax:
      'From imp-124769: tau = relTrunc_mean ~ ' + TAU.toExponential(2) + ' (O(eps^2) 2-point truncation at ' +
      'eps = 1e-3), R ~ ' + R.toExponential(2) + ' (landmark-bisection round-off, the L5 errCF minimum), and ' +
      '|X|_max = |E_CF|(L2) = ' + X_MAX.toExponential(3) + ', giving R/|X|_max ~ ' + R_OVER_XMAX.toExponential(2) + '.',
    M2_truncation_limited_regime:
      'tau (' + TAU.toExponential(2) + ') DOMINATES R/|X|_max (' + R_OVER_XMAX.toExponential(2) + '), placing the ' +
      'direct E_CF ladder in the imp-124836 TRUNCATION-LIMITED (FAILURE) regime across L2..L5 -- the OPPOSITE ' +
      'regime from the imp-124811 pair-ratio. P = errCF DECREASES (P-vs-|X| log-log slope ' +
      P_SLOPE_CLEAN.toFixed(2) + ' over L2..L4, spread ' + P_SPREAD_TRUNC.toExponential(2) + ' over L2..L5, NOT ' +
      'flat) while reldiff is FLAT (slope ' + RELDIFF_SLOPE_CLEAN.toFixed(2) + '): a decreasing P is AMBIGUOUS, so ' +
      'the flat-P discriminator cannot certify drift-freeness here.',
    M3_certified_drift_cap:
      'The certifiable sensitivity floor is D_min = max(R/|X|_max, tau) = tau ~ ' + D_MIN.toExponential(2) + ', ' +
      '~' + round(D_MIN / IMP124811_DMIN, 1) + 'x WEAKER than the imp-124811 pair-ratio cap ~' +
      IMP124811_DMIN.toExponential(1) + ' (round-off-limited). The ladder enters the valid round-off-limited ' +
      'regime only below the imp-124769 crossover |E_CF|_crit ~ ' + ECF_CRIT.toExponential(2) + ' / sigma_crit ~ ' +
      SIGMA_CRIT.toExponential(2) + ' (L6 and deeper).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier delineation, NOT rigorous). Applying the imp-124836 general drift ' +
    'discriminator to a SECOND collapsing quantity -- the direct central-difference E_CF elasticity ladder of ' +
    'imp-124769/imp-124849 (identity under test: E_CF^direct = E_CF^recon across L2..L6) -- gives tau ~ ' +
    TAU.toExponential(2) + ' (O(eps^2) 2-point truncation floor), R ~ ' + R.toExponential(2) + ' (landmark-' +
    'bisection round-off floor), and |X|_max = |E_CF|(L2) = ' + X_MAX.toExponential(3) + ', so R/|X|_max ~ ' +
    R_OVER_XMAX.toExponential(2) + '. Because tau DOMINATES R/|X|_max, this ladder sits in the TRUNCATION-LIMITED ' +
    '(imp-124836 FAILURE) regime across L2..L5 -- the OPPOSITE regime from the imp-124811 pair-ratio ' +
    '(round-off-limited): the invariant product P = errCF DECREASES (P-vs-|X| slope ' + P_SLOPE_CLEAN.toFixed(2) +
    ', spread ' + P_SPREAD_TRUNC.toExponential(2) + ', NOT flat) while reldiff is flat (slope ' +
    RELDIFF_SLOPE_CLEAN.toFixed(2) + '), so a decreasing P is ambiguous and the flat-P discriminator CANNOT ' +
    'certify drift-freeness here. The certified drift cap is D <= D_min = max(R/|X|_max, tau) = tau ~ ' +
    D_MIN.toExponential(2) + ', ~' + round(D_MIN / IMP124811_DMIN, 1) + 'x weaker than the imp-124811 pair-ratio ' +
    'cap ~' + IMP124811_DMIN.toExponential(1) + ' (the difference is the stencil order: the pair-ratio identity ' +
    'truncation cancels to O(eps^4), tau ~ 3.33e-14, while the direct 2-point reconstruction carries the full ' +
    'O(eps^2) truncation). The ladder enters the valid round-off-limited regime only below the imp-124769 ' +
    'crossover |E_CF|_crit ~ ' + ECF_CRIT.toExponential(2) + ' / sigma_crit ~ ' + SIGMA_CRIT.toExponential(2) +
    ' (L6 and deeper, per imp-124849). This is a second, independent instance of the discriminator that lands in ' +
    'the failure regime -- confirming that regime is real, not hypothetical. Conditional-share diagnostic on the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, ' +
    'the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (enter only ' +
    'through the imported imp-124769 anchors); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124836 (the general discriminator + D_min applied here); imp-124769 (the direct E_CF ladder + tau/R ' +
    'crossover, anchor source); imp-124849 (extended-precision E_CF floor / sigma_crit); imp-124811 (the first ' +
    'instance, round-off-limited, opposite regime); imp-486 (C_mb GUE-conditional).',
};

export const IMP124869_ECF_LADDER_DRIFT_DISCRIMINATOR_ASSERTIONS = [
  {
    // The ladder covers L2..L6 with the collapsing |E_CF| axis and the invariant product P = errCF.
    id: 'imp124869-ladder-covers-L2-through-L6',
    description: 'ladder has 5 rungs L2..L6 with strictly decreasing |X| = |E_CF| down the ladder',
    holds: () =>
      LADDER.length === 5 &&
      LADDER.every((r, i) => i === 0 || r.absX < LADDER[i - 1].absX),
  },
  {
    // (M1): the two floors and |X|_max are read from imp-124769 in the expected ranges.
    id: 'imp124869-floors-in-range',
    description: 'tau ~ 3.25e-7 in [1e-7,1e-6], R ~ 4.46e-13 in [1e-13,1e-12], |X|_max ~ 0.25 in [0.1,0.3]',
    holds: () =>
      TAU > 1e-7 && TAU < 1e-6 && R > 1e-13 && R < 1e-12 && X_MAX > 0.1 && X_MAX < 0.3,
  },
  {
    // (M2): tau dominates R/|X|_max -> the truncation-limited (imp-124836 failure) regime.
    id: 'imp124869-truncation-limited-regime',
    description: 'tau > R/|X|_max (truncation-limited): D_min is set by tau, the imp-124836 failure regime',
    holds: () => TRUNCATION_LIMITED === true && TAU > R_OVER_XMAX && D_MIN === TAU,
  },
  {
    // (M2): the invariant product DECREASES (P-vs-|X| slope ~ +1) -- NOT the flat round-off-limited signature.
    id: 'imp124869-P-decreasing-not-flat',
    description: 'P-vs-|X| log-log slope over L2..L4 is within 0.15 of +1 and P spread over L2..L5 exceeds 1e3',
    holds: () => Math.abs(P_SLOPE_CLEAN - 1) < 0.15 && P_SPREAD_TRUNC > 1e3,
  },
  {
    // (M2): reldiff is FLAT (log-log slope ~ 0) -- the truncation-limited signature (reldiff = tau plateau).
    id: 'imp124869-reldiff-flat-truncation-signature',
    description: 'reldiff log-log slope over L2..L4 is within 0.15 of 0 (the |X|-independent tau plateau)',
    holds: () => Math.abs(RELDIFF_SLOPE_CLEAN) < 0.15,
  },
  {
    // (M3): the certified drift cap is far WEAKER than the imp-124811 round-off-limited pair-ratio cap.
    id: 'imp124869-cap-weaker-than-imp124811',
    description: 'D_min ~ 3.25e-7 is at least 1e3x weaker (larger) than the imp-124811 pair-ratio cap ~9.3e-12',
    holds: () => D_MIN / IMP124811_DMIN > 1e3,
  },
  {
    // (M3): the valid round-off-limited regime begins only below the imp-124769 crossover (L6 and deeper).
    id: 'imp124869-valid-regime-below-crossover',
    description: 'the valid-regime boundary is the imp-124769 crossover: sigma_crit in (0.005, 0.02), |E_CF|_crit > 1e-6',
    holds: () => SIGMA_CRIT > 0.005 && SIGMA_CRIT < 0.02 && ECF_CRIT > 1e-6,
  },
  {
    // Honesty gate: measurement/cross-validation only, no QED, PT stays SOTA.
    id: 'imp124869-honesty-gate-no-qed',
    description: 'Measurement/cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124869_ECF_LADDER_DRIFT_DISCRIMINATOR.isRigorous === false &&
      /NO QED/.test(IMP124869_ECF_LADDER_DRIFT_DISCRIMINATOR.verdict) &&
      /remains SOTA/.test(IMP124869_ECF_LADDER_DRIFT_DISCRIMINATOR.verdict),
  },
];

for (const a of IMP124869_ECF_LADDER_DRIFT_DISCRIMINATOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124869-ecf-ladder-drift-discriminator assertion failed: ${a.id}`);
  }
}
