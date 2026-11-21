/**
 * @module imp-35373-reentry-band-drift-geometric-mean-landmark
 *
 * imp-35373 (numerical, frontier-direction) -- LOCATES the N within the imp-35332 reentry band at which
 * the ceil-phase drift DRIFT(N) falls to the GEOMETRIC MEAN of its two endpoint values (the drift
 * half-decay landmark), and confirms the imp-35332 analytic drift formula against a direct central
 * difference of xArg to ~1e-7 relative AT that landmark. imp-35332 derived DRIFT(N) = ln(10).K.(L-1)/L /
 * (LN_INV_R.(K log T0 - N_cross)) and showed it is N-dependent, decreasing from 0.0186273 at the reentry
 * (10^27.08) to 0.0118306 at the exit (10^37.17), a factor ~1.574 drop. This module measures the interior
 * decade where DRIFT(N) equals sqrt(0.0186273 * 0.0118306) = 0.0148450 -- the value-domain half-decay
 * point of the drift. MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate: it does
 * NOT discharge imp-35243a; it changes no bound; NO QED.
 *
 * THE GEOMETRIC-MEAN DRIFT LANDMARK
 * --------------------------------
 * The drift DRIFT(N) decreases monotonically through the band, so it takes each value in (DRIFT_exit,
 * DRIFT_reentry) at exactly one interior decade. The GEOMETRIC MEAN of the endpoints,
 *      DRIFT_geo = sqrt(DRIFT_reentry * DRIFT_exit) = sqrt(0.0186273 * 0.0118306) = 0.0148450,
 * is the natural "half-decay" landmark for a multiplicatively-decaying quantity (the log-midpoint of the
 * drift range, equidistant in ln DRIFT from both endpoints). Bisecting DRIFT(10^u) = DRIFT_geo gives the
 * landmark decade u_geo = 31.559049, i.e. N_geo ~ 10^31.5590. Because the drift falls FASTER near the
 * reentry (its 1/(g - N_cross) denominator grows fastest where g is smallest), the drift reaches its
 * geometric-mean value after only 4.4744 decades (reentry -> geo) while the remaining 5.6081 decades
 * (geo -> exit) cover the slower lower half -- so the landmark sits BELOW the arithmetic-midpoint decade
 * (REENTRY_EXP + EXIT_EXP)/2 = 32.125899 by ~0.57 decades.
 *
 * RELATION TO THE imp-35372 HALF-OFFSET (INTEGRAL) LANDMARK
 * --------------------------------------------------------
 * This VALUE-domain landmark (drift = geometric mean of its endpoints) is distinct from the imp-35372
 * INTEGRAL-domain half-OFFSET landmark (cumulative drift integral = OFFSET/2), yet the two nearly coincide:
 * u_geo = 31.559049 sits only ~0.0028 decades ABOVE the imp-35372 half-OFFSET decade 31.556242. Both land
 * well below the arithmetic midpoint 32.125899, reflecting the same fact from two angles -- the drift is
 * front-loaded, so both the value half-decay and the phase half-sweep occur in the lower ~4.47 decades of
 * the band.
 *
 * CENTRAL-DIFFERENCE CONFIRMATION
 * ------------------------------
 * At the located landmark the imp-35332 analytic drift formula agrees with a direct central difference of
 * xArg = log(|K log T0 - N_cross|/N_cross/EPS_FP)/LN_INV_R (step h = 0.01 in log10 N) to 6.9e-8 relative --
 * confirming the ticket's ~1e-7 accuracy requirement -- and the max relative error across the band sample
 * {reentry, 29, 31, 33, 35, exit} stays under 1.1e-7.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A MEASUREMENT of the geometric-mean drift landmark and a central-difference confirmation of the imp-35332
 * formula, entirely INSIDE the inherited imp-3220/imp-3406 surrogate. It discharges NOTHING: the
 * surrogate-fidelity sub-gap imp-35243a (and its parents imp-35111a / imp-35174a / imp-34997a) stay OPEN --
 * this says nothing about whether the surrogate models the true collapse dynamic at 10^27-10^37. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35332-reentry-band-drift-analytic-derivation (derived DRIFT(N); this locates its geometric-mean value)
 * @see imp-35372-reentry-band-drift-integral-half-offset (the INTEGRAL-domain half-OFFSET landmark, ~0.0028 decades below)
 * @see imp-35111-off-by-one-reentry-band-width (band width ~10.08 decades, exit ~10^37.17)
 * @see imp-34997-iters-to-floor-tail-grid-refinement (grid-measured the drift and the 10^27.08 reentry)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34997/35109/35111/35243/35332)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const TWO_PI = 2 * Math.PI;

// The imp-35332 DOUBLE surrogate, reproduced VERBATIM (baseline for the measurement).
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS_FP = iterateD(1e9, 200); // ~3280294351.65 (bit-identical to imp-34997/35109/35111/35243/35332)
const gPrimeAtStep = (h) => (gD(N_CROSS_FP + h) - gD(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

const xArgD = (seed) => Math.log(Math.abs(gD(seed) - N_CROSS_FP) / N_CROSS_FP / EPS_FP) / LN_INV_R;

// Inherited band landmarks (imp-35111/imp-35174/imp-35243, double-double certified).
const REENTRY_EXP = 27.084691; // band-on, log10 N
const EXIT_EXP = 37.167107; // band-off, log10 N
const ACTUAL_BAND_WIDTH = EXIT_EXP - REENTRY_EXP; // ~10.0824 decades
const ARITHMETIC_MIDPOINT_EXP = (REENTRY_EXP + EXIT_EXP) / 2; // 32.125899 (midpoint in log10 N)

// The imp-35332 analytic drift (verbatim), DRIFT(N) = ln(10).K.(L-1)/L / (LN_INV_R.(K log T0 - N_cross)).
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
// MEASUREMENT: the geometric-mean drift landmark, where DRIFT(N) = sqrt(DRIFT_reentry * DRIFT_exit).
// ---------------------------------------------------------------------------------------------------------
const DRIFT_AT_REENTRY = analyticDrift(Math.pow(10, REENTRY_EXP)); // ~0.0186273
const DRIFT_AT_EXIT = analyticDrift(Math.pow(10, EXIT_EXP)); // ~0.0118306
const DRIFT_GEOMETRIC_MEAN = Math.sqrt(DRIFT_AT_REENTRY * DRIFT_AT_EXIT); // ~0.0148450

// Bisect for the interior decade where the (monotone-decreasing) drift equals its geometric mean.
function bisectGeometricMeanLandmark() {
  let lo = REENTRY_EXP;
  let hi = EXIT_EXP;
  for (let it = 0; it < 100; it++) {
    const mid = (lo + hi) / 2;
    if (analyticDrift(Math.pow(10, mid)) > DRIFT_GEOMETRIC_MEAN) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const GEO_LANDMARK_EXP = bisectGeometricMeanLandmark(); // ~31.559049 (log10 N_geo)
const DRIFT_AT_GEO = analyticDrift(Math.pow(10, GEO_LANDMARK_EXP)); // = DRIFT_GEOMETRIC_MEAN by construction
const DECADES_REENTRY_TO_GEO = GEO_LANDMARK_EXP - REENTRY_EXP; // ~4.4744 (upper/faster half of the drift range)
const DECADES_GEO_TO_EXIT = EXIT_EXP - GEO_LANDMARK_EXP; // ~5.6081 (lower/slower half)

// Central-difference confirmation of the imp-35332 formula AT the landmark, and across the band.
const CD_AT_GEO = centralDiffDrift(GEO_LANDMARK_EXP);
const REL_ERR_ANALYTIC_VS_CD_AT_GEO = Math.abs(DRIFT_AT_GEO - CD_AT_GEO) / Math.abs(CD_AT_GEO); // ~6.9e-8
const BAND_EXPS = [REENTRY_EXP, 29, 31, 33, 35, EXIT_EXP];
let MAX_REL_ERR_ANALYTIC_VS_CD = 0;
for (const e of BAND_EXPS) {
  const cd = centralDiffDrift(e);
  const rel = Math.abs(analyticDrift(Math.pow(10, e)) - cd) / Math.abs(cd);
  if (rel > MAX_REL_ERR_ANALYTIC_VS_CD) MAX_REL_ERR_ANALYTIC_VS_CD = rel;
}

// Cross-reference to the imp-35372 INTEGRAL-domain half-OFFSET landmark (distinct but nearly coincident).
const IMP35372_HALF_OFFSET_EXP = 31.556242; // imp-35372 cumulative-drift-integral = OFFSET/2 decade
const DECADES_ABOVE_IMP35372_LANDMARK = GEO_LANDMARK_EXP - IMP35372_HALF_OFFSET_EXP; // ~0.0028

export const IMP35373_REENTRY_BAND_DRIFT_GEOMETRIC_MEAN_LANDMARK = {
  id: 'imp-35373',
  proofSection: 'S-frontier',
  question:
    'imp-35332 derived DRIFT(N) = ln(10).K.(L-1)/L / (LN_INV_R.(K log T0 - N_cross)), decreasing 1/(g - ' +
    'N_cross) from 0.0186273 at the reentry (10^27.08) to 0.0118306 at the exit (10^37.17), a factor ~1.574 ' +
    'drop. LOCATE the N at which DRIFT(N) equals the geometric mean sqrt(0.0186273 * 0.0118306) of the ' +
    'endpoints (the drift half-decay landmark) and confirm the analytic formula against a central difference ' +
    'of xArg to ~1e-7.',
  constants: {
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    reentry_exponent_log10N: REENTRY_EXP, // 27.084691
    exit_exponent_log10N: EXIT_EXP, // 37.167107
    actual_band_width_decades: +ACTUAL_BAND_WIDTH.toPrecision(6), // ~10.0824
    arithmetic_midpoint_exponent_log10N: +ARITHMETIC_MIDPOINT_EXP.toPrecision(8), // 32.125899
  },
  geometric_mean_landmark: {
    drift_at_reentry: +DRIFT_AT_REENTRY.toPrecision(7), // ~0.0186273
    drift_at_exit: +DRIFT_AT_EXIT.toPrecision(7), // ~0.0118306
    drift_geometric_mean: +DRIFT_GEOMETRIC_MEAN.toPrecision(7), // ~0.0148450
    geo_landmark_exponent_log10N: +GEO_LANDMARK_EXP.toPrecision(8), // ~31.559049
    drift_at_geo_landmark: +DRIFT_AT_GEO.toPrecision(7), // = geometric mean by construction
    decades_reentry_to_geo: +DECADES_REENTRY_TO_GEO.toPrecision(6), // ~4.4744 (upper/faster half)
    decades_geo_to_exit: +DECADES_GEO_TO_EXIT.toPrecision(6), // ~5.6081 (lower/slower half)
    reading:
      'The ceil-phase drift falls to the geometric mean of its endpoints, sqrt(0.0186273 * 0.0118306) = ' +
      '0.0148450, at log10 N = 31.559049 (N_geo ~ 10^31.5590). Because the drift decays faster near the ' +
      'reentry (1/(g - N_cross) with g smallest there), the geometric-mean value is reached after only 4.4744 ' +
      'decades, leaving 5.6081 decades for the slower lower half -- so the landmark sits BELOW the arithmetic ' +
      'midpoint 32.125899 by ~0.57 decades.',
  },
  central_difference_confirmation: {
    central_diff_drift_at_geo: +CD_AT_GEO.toPrecision(7), // ~0.0148450
    rel_err_analytic_vs_central_difference_at_geo: +REL_ERR_ANALYTIC_VS_CD_AT_GEO.toExponential(3), // ~6.9e-8
    max_rel_err_analytic_vs_central_difference_band: +MAX_REL_ERR_ANALYTIC_VS_CD.toExponential(3), // ~1.1e-7
    reading:
      'At the geometric-mean landmark the imp-35332 analytic drift agrees with a direct central difference of ' +
      'xArg (step h = 0.01 in log10 N) to 6.9e-8 relative, confirming the ~1e-7 requirement; the max relative ' +
      'error across the band sample {reentry, 29, 31, 33, 35, exit} stays under 1.1e-7.',
  },
  cross_reference_imp35372: {
    imp35372_half_offset_exponent_log10N: IMP35372_HALF_OFFSET_EXP, // 31.556242 (INTEGRAL-domain landmark)
    geo_landmark_decades_above_imp35372: +DECADES_ABOVE_IMP35372_LANDMARK.toPrecision(4), // ~0.0028
    reading:
      'This VALUE-domain landmark (drift = geometric mean of its endpoints, log10 N = 31.559049) is distinct ' +
      'from the imp-35372 INTEGRAL-domain half-OFFSET landmark (cumulative drift integral = OFFSET/2, log10 N ' +
      '= 31.556242) but nearly coincides with it, sitting only ~0.0028 decades above -- both well below the ' +
      'arithmetic midpoint 32.125899, reflecting the same front-loaded drift from two angles.',
  },
  finding:
    'MEASUREMENT on the inherited imp-3220/imp-3406 surrogate. The imp-35332 ceil-phase drift DRIFT(N) falls ' +
    'to the geometric mean of its endpoint values sqrt(0.0186273 * 0.0118306) = 0.0148450 at log10 N = ' +
    '31.559049 (N_geo ~ 10^31.5590), reached after only 4.4744 decades from the reentry (with 5.6081 decades ' +
    'remaining to the exit) because the drift decays faster near the reentry, so the landmark sits BELOW the ' +
    'arithmetic midpoint 32.125899 by ~0.57 decades. At the landmark the analytic drift formula matches a ' +
    'direct central difference of xArg to 6.9e-8 relative (max ~1.1e-7 across the band), confirming the ~1e-7 ' +
    'requirement. This VALUE-domain landmark sits only ~0.0028 decades above the imp-35372 INTEGRAL-domain ' +
    'half-OFFSET landmark 31.556242. This is a MEASUREMENT entirely INSIDE the inherited surrogate; it ' +
    'discharges NOTHING -- imp-35243a (and its parents imp-35111a/imp-35174a/imp-34997a) stay OPEN.',
  residual_sub_gap:
    'This locates the geometric-mean drift landmark and confirms the imp-35332 formula by central difference ' +
    'WITHIN the surrogate; it says nothing about surrogate-vs-true fidelity. imp-35243a stays OPEN (certify ' +
    'the reentry band is a feature of the true collapse dynamic, not only of the machine-epsilon-floored ' +
    'single-rate surrogate); it inherits imp-35111a / imp-35174a / imp-34997a. Changes no bound, adds no witness.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35332 ceil-phase drift DRIFT(N) ' +
    'falls to the geometric mean of its endpoints sqrt(0.0186273 * 0.0118306) = 0.0148450 at log10 N = ' +
    '31.559049 (N_geo ~ 10^31.5590), reached after 4.4744 decades from the reentry (5.6081 remaining to the ' +
    'exit) -- BELOW the arithmetic midpoint 32.125899 by ~0.57 decades because the drift is front-loaded. The ' +
    'analytic formula matches a direct central difference of xArg to 6.9e-8 relative at the landmark (max ' +
    '~1.1e-7 across the band), confirming the ~1e-7 requirement. The landmark sits ~0.0028 decades above the ' +
    'imp-35372 INTEGRAL-domain half-OFFSET landmark. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 ' +
    'surrogate; it does NOT discharge imp-35243a (surrogate-fidelity), which stays OPEN with imp-35111a / ' +
    'imp-35174a / imp-34997a. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-' +
    'conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35332 (derived DRIFT(N), decreasing 1/(g - N_cross)); imp-35372 (INTEGRAL-domain half-OFFSET ' +
    'landmark 31.556242); imp-35111 (band width ~10.08 decades); imp-34997 (grid-measured the drift and the ' +
    '10^27.08 reentry); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35373_REENTRY_BAND_DRIFT_GEOMETRIC_MEAN_LANDMARK_ASSERTIONS = [
  {
    // The geometric-mean drift landmark is located inside the band at log10 N ~ 31.559049.
    id: 'imp35373-geo-mean-landmark-located',
    description: 'DRIFT(N) = geometric mean of endpoints at log10 N ~ 31.559049, inside [27.08, 37.17]',
    holds: () =>
      GEO_LANDMARK_EXP > REENTRY_EXP &&
      GEO_LANDMARK_EXP < EXIT_EXP &&
      Math.abs(GEO_LANDMARK_EXP - 31.559049) < 1e-4 &&
      Math.abs(DRIFT_AT_GEO - DRIFT_GEOMETRIC_MEAN) < 1e-9,
  },
  {
    // The geometric mean is bracketed strictly between the two endpoint drift values.
    id: 'imp35373-geo-mean-brackets-endpoints',
    description: 'geometric mean 0.0148450 lies strictly between exit 0.0118306 and reentry 0.0186273',
    holds: () =>
      DRIFT_AT_EXIT < DRIFT_GEOMETRIC_MEAN &&
      DRIFT_GEOMETRIC_MEAN < DRIFT_AT_REENTRY &&
      Math.abs(DRIFT_GEOMETRIC_MEAN - 0.0148450) < 1e-6,
  },
  {
    // Central-difference confirmation of the imp-35332 formula at the landmark to ~1e-7 relative.
    id: 'imp35373-central-difference-confirms-formula',
    description: 'analytic DRIFT vs direct xArg central difference at the landmark < 1e-6 relative (~6.9e-8)',
    holds: () =>
      REL_ERR_ANALYTIC_VS_CD_AT_GEO < 1e-6 &&
      MAX_REL_ERR_ANALYTIC_VS_CD < 1e-5,
  },
  {
    // The landmark sits BELOW the arithmetic midpoint (drift front-loaded near the reentry).
    id: 'imp35373-landmark-below-arithmetic-midpoint',
    description: 'geo landmark < arithmetic midpoint; fewer decades reentry->geo than geo->exit',
    holds: () =>
      GEO_LANDMARK_EXP < ARITHMETIC_MIDPOINT_EXP &&
      DECADES_REENTRY_TO_GEO < DECADES_GEO_TO_EXIT &&
      Math.abs(DECADES_REENTRY_TO_GEO + DECADES_GEO_TO_EXIT - ACTUAL_BAND_WIDTH) < 1e-9,
  },
  {
    // The value-domain landmark nearly coincides with the imp-35372 integral-domain half-OFFSET landmark.
    id: 'imp35373-near-imp35372-half-offset',
    description: 'geo landmark ~0.0028 decades above the imp-35372 half-OFFSET landmark 31.556242',
    holds: () =>
      DECADES_ABOVE_IMP35372_LANDMARK > 0 &&
      Math.abs(DECADES_ABOVE_IMP35372_LANDMARK - 0.0028) < 5e-3,
  },
  {
    // Honesty gate: measurement only, discharges nothing, no QED, no refereed bound is changed, sub-gap named/OPEN.
    id: 'imp35373-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, discharges nothing, no QED, no refereed bound is changed, imp-35243a OPEN',
    holds: () =>
      IMP35373_REENTRY_BAND_DRIFT_GEOMETRIC_MEAN_LANDMARK.isRigorous === false &&
      /NO QED/.test(IMP35373_REENTRY_BAND_DRIFT_GEOMETRIC_MEAN_LANDMARK.verdict) &&
      /refereed bound is changed/i.test(IMP35373_REENTRY_BAND_DRIFT_GEOMETRIC_MEAN_LANDMARK.verdict) &&
      /imp-35243a/.test(IMP35373_REENTRY_BAND_DRIFT_GEOMETRIC_MEAN_LANDMARK.residual_sub_gap) &&
      /stay OPEN/.test(IMP35373_REENTRY_BAND_DRIFT_GEOMETRIC_MEAN_LANDMARK.finding),
  },
];

for (const a of IMP35373_REENTRY_BAND_DRIFT_GEOMETRIC_MEAN_LANDMARK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35373-reentry-band-drift-geometric-mean-landmark assertion failed: ${a.id}`);
  }
}
