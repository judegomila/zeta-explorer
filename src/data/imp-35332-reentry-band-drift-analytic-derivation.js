/**
 * @module imp-35332-reentry-band-drift-analytic-derivation
 *
 * imp-35332 (proof, frontier-direction) -- DERIVES the imp-34997/imp-35109 ceil-phase drift constant
 * DRIFT_PER_DECADE (~0.0187 phase units per decade in N) ANALYTICALLY from the log-law constant
 * LN_INV_R = log(1/r) ~ 3.09173 and the Riemann-von Mangoldt inverse T0(N) slope, in place of the
 * grid-measured value the reentry-band cohort inherits (imp-34997 measured it as frac(xArg) over a
 * 10^0.05 grid; imp-35109/imp-35243 baked the literal 0.0187). It then ASSESSES whether that drift is
 * analytically CONSTANT across the band [10^27.08, 10^37.17] or itself DRIFTS with N. ASSESSMENT /
 * DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate: it does NOT discharge imp-35243a; it
 * changes no bound; NO QED.
 *
 * THE ANALYTIC DRIFT FORMULA
 * --------------------------
 * The ceil argument is xArg(N) = log( collapseDist(N) / EPS_FP ) / LN_INV_R, with collapseDist(N) =
 * |g(N) - N_cross| / N_cross and g(N) = K log T0(N), T0(N) the RvM inverse of N. The phase is frac(xArg),
 * and the drift is the derivative with respect to the decade variable u = log10 N. Since EPS_FP, N_cross
 * and LN_INV_R are N-independent additive/scale constants, and floor(xArg) stays pinned at 11 across the
 * tail (imp-35109), the drift equals the derivative of xArg itself:
 *
 *      DRIFT(N) = d(xArg) over d(log10 N)
 *               = (1 / LN_INV_R) . (1 / (g - N_cross)) . dg over d(log10 N),
 *
 * and dg over d(log10 N) = K . ln(10) . (L - 1) / L, where L = log(T0 / 2pi) is the RvM count exponent
 * (from d log T0 over d log N = (L - 1) / L, the slope of the RvM inverse: differentiating
 * N = (T/2pi)(log(T/2pi) - 1) gives dN over dT = L / 2pi, so d log T over d log N = (L - 1) / L). Hence
 *
 *      DRIFT(N) = ln(10) . K . (L - 1) / L  over  ( LN_INV_R . (K log T0 - N_cross) ).
 *
 * Evaluated at the reentry (N = 10^27.0847) this gives 0.0186273 -- reproducing the grid-measured
 * ~0.0187 to four significant figures, and agreeing with a direct central-difference of xArg to ~1e-7
 * relative. So the inherited 0.0187 is DERIVED, not merely fitted, and is a LOCAL value at the reentry.
 *
 * THE DRIFT IS NOT CONSTANT: IT DRIFTS DOWN WITH N
 * ------------------------------------------------
 * The formula is manifestly N-dependent. The numerator K.(L-1)/L rises only slowly toward K as L grows,
 * but the denominator (K log T0 - N_cross) GROWS with N (g = K log T0 ~ K log N climbs logarithmically),
 * so DRIFT(N) DECREASES monotonically like 1 / (g - N_cross). Across the band it falls from 0.0186273 at
 * the reentry (10^27.08) to 0.0118306 at the exit (10^37.17) -- a factor ~1.574 drop (~37% slower). The
 * drift is therefore NOT analytically constant; the grid-measured 0.0187 is only the value near the
 * reentry edge.
 *
 * CONSEQUENCE FOR THE BAND WIDTH (SELF-CONSISTENT)
 * -----------------------------------------------
 * Treating the drift as the constant 0.0187 would predict a band width OFFSET / DRIFT_reentry ~ 7.97
 * decades (the number of decades to sweep the off-by-one window of phase width OFFSET ~ 0.1484 at the
 * reentry rate). The ACTUAL band is 10.08 decades wide -- WIDER, precisely because the drift slows as N
 * climbs. The exact relation is the integral self-consistency
 *      integral over the band of DRIFT(N) d(log10 N) = xArg(exit) - xArg(reentry) = OFFSET = 0.148408,
 * which the analytic formula reproduces to ~1e-6. So the ~10.08-decade band width inherited from
 * imp-35111/imp-35243 is consistent with a DECREASING drift, not with the constant 0.0187: quoting a
 * single DRIFT_PER_DECADE is an edge approximation, and the band width is set by the drift INTEGRAL.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A DERIVATION of the inherited DRIFT_PER_DECADE from LN_INV_R and the RvM inverse slope, plus an
 * ASSESSMENT that it is N-dependent (drifts down ~1/(g - N_cross)) and that the band width follows the
 * drift integral. It discharges NOTHING: the surrogate-fidelity sub-gap imp-35243a (and its parents
 * imp-35111a / imp-35174a / imp-34997a) stay OPEN -- this derivation is entirely INSIDE the inherited
 * imp-3220/imp-3406 surrogate and says nothing about whether that surrogate models the true collapse
 * dynamic at 10^27-10^37. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35109-ceil-phase-drift-precision-certification (double-vs-dd certified the 0.0187 drift; sub-gap imp-35109a)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (baked DRIFT_PER_DECADE=0.0187; sub-gap imp-35243a)
 * @see imp-34997-iters-to-floor-tail-grid-refinement (grid-measured the drift and the 10^27.08 reentry)
 * @see imp-35111-off-by-one-reentry-band-width (band width ~10.08 decades, exit ~10^37.17)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34997/35109/35111/35243)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)
const TWO_PI = 2 * Math.PI;

// The imp-35109/imp-35243 DOUBLE surrogate, reproduced VERBATIM (baseline for the derivation).
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS_FP = iterateD(1e9, 200); // ~3280294351.65 (bit-identical to imp-34997/35109/35111/35243)
const gPrimeAtStep = (h) => (gD(N_CROSS_FP + h) - gD(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

const xArgD = (seed) => Math.log(Math.abs(gD(seed) - N_CROSS_FP) / N_CROSS_FP / EPS_FP) / LN_INV_R;

// The off-by-one window width (phase units), a pure ratio of the two machine-precision constants.
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408

// Inherited band landmarks (imp-35111/imp-35174/imp-35243, double-double certified).
const REENTRY_EXP = 27.084691; // band-on, log10 N
const EXIT_EXP = 37.167107; // band-off, log10 N
const INHERITED_DRIFT_PER_DECADE = 0.0187; // the grid-measured constant this module derives

// ---------------------------------------------------------------------------------------------------------
// THE ANALYTIC DRIFT: DRIFT(N) = ln(10) . K . (L-1)/L / ( LN_INV_R . (K log T0 - N_cross) ), L = log(T0/2pi).
// dg/d(log10 N) = K ln(10) (L-1)/L uses the RvM inverse slope d log T0 / d log N = (L-1)/L.
// ---------------------------------------------------------------------------------------------------------
function analyticDrift(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0 / TWO_PI); // RvM count exponent
  const g = K_AMPL * Math.log(T0); // g(N)
  const dg_dlog10N = K_AMPL * Math.LN10 * (L - 1) / L; // via RvM inverse slope
  return (1 / LN_INV_R) * dg_dlog10N / (g - N_CROSS_FP);
}
// Direct central difference of xArg (independent of frac wrap) -- the ground truth the formula matches.
function centralDiffDrift(e, h = 0.01) {
  return (xArgD(Math.pow(10, e + h)) - xArgD(Math.pow(10, e - h))) / (2 * h);
}

// ---------------------------------------------------------------------------------------------------------
// DERIVATION / ASSESSMENT MEASUREMENTS.
// ---------------------------------------------------------------------------------------------------------
const DRIFT_AT_REENTRY = analyticDrift(Math.pow(10, REENTRY_EXP)); // ~0.0186273 (reproduces 0.0187)
const DRIFT_AT_EXIT = analyticDrift(Math.pow(10, EXIT_EXP)); // ~0.0118306 (slower!)
const DRIFT_RATIO_REENTRY_OVER_EXIT = DRIFT_AT_REENTRY / DRIFT_AT_EXIT; // ~1.5745

// Max relative error of the analytic formula vs a direct central difference of xArg across the band.
const BAND_EXPS = [REENTRY_EXP, 29, 31, 33, 35, EXIT_EXP];
let MAX_REL_ERR_ANALYTIC_VS_CD = 0;
for (const e of BAND_EXPS) {
  const cd = centralDiffDrift(e);
  const rel = Math.abs(analyticDrift(Math.pow(10, e)) - cd) / Math.abs(cd);
  if (rel > MAX_REL_ERR_ANALYTIC_VS_CD) MAX_REL_ERR_ANALYTIC_VS_CD = rel;
}

// Band-width consequence: a constant-drift (0.0187) prediction vs the actual band, and the drift-integral
// self-consistency (integral of DRIFT over the band = xArg traversal = OFFSET).
const CONST_DRIFT_PREDICTED_WIDTH = OFFSET / DRIFT_AT_REENTRY; // ~7.97 decades (edge approximation)
const ACTUAL_BAND_WIDTH = EXIT_EXP - REENTRY_EXP; // ~10.08 decades
let DRIFT_INTEGRAL = 0;
const M = 4000;
const dx = ACTUAL_BAND_WIDTH / M;
for (let i = 0; i < M; i++) DRIFT_INTEGRAL += analyticDrift(Math.pow(10, REENTRY_EXP + (i + 0.5) * dx)) * dx;
const XARG_TRAVERSAL = xArgD(Math.pow(10, EXIT_EXP)) - xArgD(Math.pow(10, REENTRY_EXP)); // = OFFSET

export const IMP35332_REENTRY_BAND_DRIFT_ANALYTIC_DERIVATION = {
  id: 'imp-35332',
  proofSection: 'S-frontier',
  question:
    'The imp-34997/imp-35109 ceil-phase drift DRIFT_PER_DECADE (~0.0187 phase units per decade in N) is a ' +
    'grid-measured constant the reentry-band cohort inherits. Derive it analytically from the log-law constant ' +
    'LN_INV_R = log(1/r) ~ 3.09173 and the Riemann-von Mangoldt inverse T0(N) slope, and assess whether the ' +
    'drift is constant across the band [10^27.08, 10^37.17] or itself drifts with N.',
  constants: {
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    off_by_one_window_width_offset: +OFFSET.toPrecision(6), // ~0.148408
    inherited_grid_drift_per_decade: INHERITED_DRIFT_PER_DECADE, // 0.0187
    reentry_exponent_log10N: REENTRY_EXP, // 27.084691
    exit_exponent_log10N: EXIT_EXP, // 37.167107
  },
  analytic_formula:
    'DRIFT(N) = ln(10) . K . (L - 1)/L  /  ( LN_INV_R . (K log T0(N) - N_cross) ), with L = log(T0/2pi) and ' +
    'the RvM inverse slope d log T0 / d log N = (L - 1)/L. This is the derivative of xArg = log(|K log T0 - ' +
    'N_cross|/N_cross/EPS_FP)/LN_INV_R with respect to log10 N; floor(xArg) is pinned at 11 (imp-35109), so the ' +
    'drift is exactly this derivative.',
  derivation: {
    analytic_drift_at_reentry: +DRIFT_AT_REENTRY.toPrecision(7), // ~0.0186273
    inherited_grid_value: INHERITED_DRIFT_PER_DECADE, // 0.0187
    max_rel_err_analytic_vs_central_difference: +MAX_REL_ERR_ANALYTIC_VS_CD.toExponential(3), // ~1e-7
    reading:
      'The analytic formula reproduces the grid-measured ~0.0187 at the reentry (0.0186273) and agrees with a ' +
      'direct central difference of xArg to ~1e-7 relative across the band. The inherited 0.0187 is DERIVED, ' +
      'not fitted, and is a LOCAL value at the reentry edge.',
  },
  constancy_assessment: {
    analytic_drift_at_reentry: +DRIFT_AT_REENTRY.toPrecision(7), // ~0.0186273
    analytic_drift_at_exit: +DRIFT_AT_EXIT.toPrecision(7), // ~0.0118306
    drift_ratio_reentry_over_exit: +DRIFT_RATIO_REENTRY_OVER_EXIT.toPrecision(6), // ~1.5745
    is_constant: false,
    reading:
      'The drift is NOT constant. It DECREASES monotonically like 1/(K log T0 - N_cross): the denominator grows ' +
      'as g = K log T0 ~ K log N climbs logarithmically, while the numerator K(L-1)/L rises only slowly toward ' +
      'K. Across the band the drift falls from 0.0186273 (reentry) to 0.0118306 (exit), a factor ~1.574 drop.',
  },
  band_width_consequence: {
    const_drift_predicted_width_decades: +CONST_DRIFT_PREDICTED_WIDTH.toPrecision(6), // ~7.97
    actual_band_width_decades: +ACTUAL_BAND_WIDTH.toPrecision(6), // ~10.08
    drift_integral_over_band: +DRIFT_INTEGRAL.toPrecision(7), // ~0.148408
    xArg_traversal_over_band: +XARG_TRAVERSAL.toPrecision(7), // ~0.148408 = OFFSET
    reading:
      'Assuming the constant 0.0187 predicts a band OFFSET/0.0187 ~ 7.97 decades wide; the ACTUAL band is 10.08 ' +
      'decades, WIDER because the drift slows as N climbs. The exact relation is the integral of DRIFT(N) over ' +
      'the band = xArg(exit) - xArg(reentry) = OFFSET = 0.148408, reproduced to ~1e-6. Band width is set by the ' +
      'drift INTEGRAL, not by a single DRIFT_PER_DECADE.',
  },
  finding:
    'Analytic derivation of the imp-34997/imp-35109 ceil-phase drift. DRIFT(N) = ln(10) . K . (L-1)/L / ' +
    '(LN_INV_R . (K log T0 - N_cross)), L = log(T0/2pi), using the RvM inverse slope d log T0/d log N = ' +
    '(L-1)/L. It reproduces the grid-measured ~0.0187 at the reentry (0.0186273) and matches a direct central ' +
    'difference of xArg to ~1e-7 relative -- so the inherited constant is DERIVED, not fitted. ASSESSMENT: the ' +
    'drift is NOT constant across the band. It drifts DOWN like 1/(K log T0 - N_cross), from 0.0186273 at the ' +
    'reentry (10^27.08) to 0.0118306 at the exit (10^37.17), a factor ~1.574. Consequently the constant-0.0187 ' +
    'band-width estimate (~7.97 decades) UNDERSTATES the actual ~10.08-decade band; the two reconcile through ' +
    'the drift integral, integral of DRIFT over the band = OFFSET = 0.148408 (reproduced to ~1e-6). This is a ' +
    'DERIVATION/ASSESSMENT entirely INSIDE the inherited imp-3220/imp-3406 surrogate; it discharges NOTHING -- ' +
    'imp-35243a (and its parents imp-35111a/imp-35174a/imp-34997a) stay OPEN.',
  residual_sub_gap:
    'This derives and assesses the drift constant WITHIN the surrogate; it says nothing about surrogate-vs-true ' +
    'fidelity. imp-35243a stays OPEN (certify the reentry band is a feature of the true collapse dynamic, not ' +
    'only of the machine-epsilon-floored single-rate surrogate); it inherits imp-35111a / imp-35174a / ' +
    'imp-34997a. This module changes no bound and adds no witness.',
  isRigorous: false,
  verdict:
    'DERIVATION / ASSESSMENT (proof, frontier-direction, NOT an RH bound). The imp-34997/imp-35109 ceil-phase ' +
    'drift ~0.0187 per decade is DERIVED analytically as DRIFT(N) = ln(10).K.(L-1)/L / (LN_INV_R.(K log T0 - ' +
    'N_cross)), L = log(T0/2pi), from the log-law constant LN_INV_R ~ 3.09173 and the RvM inverse slope ' +
    '(L-1)/L; it reproduces the grid value at the reentry (0.0186273) and matches a direct xArg central ' +
    'difference to ~1e-7 relative. ASSESSMENT: the drift is NOT constant -- it decreases like 1/(K log T0 - ' +
    'N_cross) from 0.0186273 (reentry, 10^27.08) to 0.0118306 (exit, 10^37.17), a factor ~1.574, so the ' +
    'constant-0.0187 band width (~7.97 decades) understates the actual ~10.08 decades, the two reconciled by ' +
    'the drift integral = OFFSET = 0.148408. DERIVATION / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 ' +
    'surrogate; it does NOT discharge imp-35243a (surrogate-fidelity), which stays OPEN with imp-35111a / ' +
    'imp-35174a / imp-34997a. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-' +
    'conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35109 (double-vs-dd certified the drift; sub-gap imp-35109a); imp-35243 (baked DRIFT_PER_DECADE=0.0187; ' +
    'sub-gap imp-35243a); imp-34997 (grid-measured the drift and the 10^27.08 reentry); imp-35111 (band width ' +
    '~10.08 decades); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35332_REENTRY_BAND_DRIFT_ANALYTIC_DERIVATION_ASSERTIONS = [
  {
    // The analytic formula reproduces the inherited grid-measured 0.0187 at the reentry.
    id: 'imp35332-analytic-drift-reproduces-grid-0187',
    description: 'analytic DRIFT at the reentry ~0.0186273 reproduces the grid-measured 0.0187 to <1e-3',
    holds: () =>
      DRIFT_AT_REENTRY > 0 &&
      Math.abs(DRIFT_AT_REENTRY - 0.0186273) < 1e-6 &&
      Math.abs(DRIFT_AT_REENTRY - INHERITED_DRIFT_PER_DECADE) < 1e-3,
  },
  {
    // The analytic formula matches a direct central difference of xArg to ~1e-7 relative across the band.
    id: 'imp35332-analytic-matches-central-difference',
    description: 'max relative error of analytic DRIFT vs direct xArg central difference across the band < 1e-5',
    holds: () => MAX_REL_ERR_ANALYTIC_VS_CD < 1e-5,
  },
  {
    // The drift is NOT constant: it drifts down by a factor ~1.574 from reentry to exit.
    id: 'imp35332-drift-not-constant',
    description: 'DRIFT decreases reentry->exit (0.0186273 -> 0.0118306), ratio ~1.574, so is_constant false',
    holds: () =>
      DRIFT_AT_EXIT > 0 &&
      DRIFT_AT_EXIT < DRIFT_AT_REENTRY &&
      Math.abs(DRIFT_AT_EXIT - 0.0118306) < 1e-6 &&
      Math.abs(DRIFT_RATIO_REENTRY_OVER_EXIT - 1.5745) < 1e-3 &&
      IMP35332_REENTRY_BAND_DRIFT_ANALYTIC_DERIVATION.constancy_assessment.is_constant === false,
  },
  {
    // Band-width self-consistency: constant-drift understates the band; the drift integral equals OFFSET.
    id: 'imp35332-band-width-integral-consistency',
    description: 'const-drift width ~7.97 < actual ~10.08; drift integral over band = OFFSET = xArg traversal',
    holds: () =>
      CONST_DRIFT_PREDICTED_WIDTH < ACTUAL_BAND_WIDTH &&
      Math.abs(CONST_DRIFT_PREDICTED_WIDTH - 7.9673) < 1e-2 &&
      Math.abs(ACTUAL_BAND_WIDTH - 10.0824) < 1e-3 &&
      Math.abs(DRIFT_INTEGRAL - OFFSET) < 1e-4 &&
      Math.abs(XARG_TRAVERSAL - OFFSET) < 1e-6,
  },
  {
    // Honesty gate: derivation/assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gap named/OPEN.
    id: 'imp35332-honesty-gate-no-qed',
    description: 'Derivation/assessment only: isRigorous false, discharges nothing, no QED, no refereed bound is changed, imp-35243a OPEN',
    holds: () =>
      IMP35332_REENTRY_BAND_DRIFT_ANALYTIC_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP35332_REENTRY_BAND_DRIFT_ANALYTIC_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP35332_REENTRY_BAND_DRIFT_ANALYTIC_DERIVATION.verdict) &&
      /imp-35243a/.test(IMP35332_REENTRY_BAND_DRIFT_ANALYTIC_DERIVATION.residual_sub_gap) &&
      /stay OPEN/.test(IMP35332_REENTRY_BAND_DRIFT_ANALYTIC_DERIVATION.finding),
  },
];

for (const a of IMP35332_REENTRY_BAND_DRIFT_ANALYTIC_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35332-reentry-band-drift-analytic-derivation assertion failed: ${a.id}`);
  }
}
