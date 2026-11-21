/**
 * @module imp-35372-reentry-band-drift-integral-half-offset
 *
 * imp-35372 (numerical, frontier-direction) -- MEASURES two quantities left implicit by the imp-35332
 * drift-integral self-consistency: (1) the MID-BAND N at which the cumulative drift integral from the
 * reentry edge first reaches HALF the off-by-one window OFFSET = 0.148408, and (2) a table of the
 * LOCAL-vs-INTEGRAL band-width discrepancy across the band. imp-35332 established that the ceil-phase
 * drift DRIFT(N) = ln(10).K.(L-1)/L / (LN_INV_R.(K log T0 - N_cross)) is N-dependent (0.0186273 at the
 * reentry falling to 0.0118306 at the exit), so a constant-0.0187 reading predicts a 7.97-decade band
 * while the actual band is 10.08 decades, the true width set by the drift INTEGRAL = OFFSET. This module
 * locates the half-OFFSET landmark and quantifies how far the naive local-drift band width sits from the
 * true integral width at each decade. MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406
 * surrogate: it does NOT discharge imp-35243a; it changes no bound; NO QED.
 *
 * THE HALF-OFFSET MID-BAND LANDMARK
 * ---------------------------------
 * The cumulative drift integral from the reentry edge to a decade u = log10 N is
 *      CumDrift(u) = integral over [REENTRY_EXP, u] of DRIFT(10^v) dv = xArg(10^u) - xArg(10^REENTRY),
 * which climbs monotonically from 0 at the reentry to OFFSET = 0.148408 at the exit (imp-35332). Bisecting
 * for CumDrift(u) = OFFSET/2 = 0.074204 gives the HALF-OFFSET decade u_half = 31.556242, i.e. N_half =
 * 10^31.5562. Because the drift is FASTER near the reentry, the first half of the phase window is swept in
 * only 4.4716 decades (reentry -> half) while the second half takes 5.6109 decades (half -> exit) -- so the
 * half-OFFSET landmark sits BELOW the geometric-midpoint decade (REENTRY_EXP+EXIT_EXP)/2 = 32.1259 by
 * ~0.57 decades. The local drift AT the half-OFFSET point is 0.0148468, close to (but above) the band-
 * average drift OFFSET/width = 0.0147195.
 *
 * THE LOCAL-vs-INTEGRAL BAND-WIDTH DISCREPANCY
 * -------------------------------------------
 * The naive "local" band width treats the drift as the constant local value at a chosen decade e:
 *      localWidth(e) = OFFSET / DRIFT(10^e),
 * to be contrasted with the true INTEGRAL width ACTUAL = EXIT_EXP - REENTRY_EXP = 10.0824 decades. Because
 * DRIFT decreases with N, localWidth GROWS through the band: it UNDERSTATES the true width near the reentry
 * (7.9673 decades, discrepancy -2.1152) and OVERSTATES it near the exit (12.5444 decades, discrepancy
 * +2.4620), crossing the true width at exactly the decade where DRIFT(N) equals the band-average drift
 * OFFSET/ACTUAL = 0.0147195, i.e. u_cross = 31.7467 (~0.19 decades ABOVE the half-OFFSET landmark). So the
 * inherited constant-0.0187 estimate is not merely low: the local-drift band width is only ACCURATE at one
 * interior decade, and only the drift INTEGRAL is width-consistent across the whole band.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A MEASUREMENT of the half-OFFSET mid-band decade and a tabulation of the local-vs-integral band-width
 * discrepancy, entirely INSIDE the inherited imp-3220/imp-3406 surrogate. It discharges NOTHING: the
 * surrogate-fidelity sub-gap imp-35243a (and its parents imp-35111a / imp-35174a / imp-34997a) stay OPEN --
 * this says nothing about whether the surrogate models the true collapse dynamic at 10^27-10^37. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35332-reentry-band-drift-analytic-derivation (derived DRIFT(N), integral = OFFSET; this locates the half-OFFSET point)
 * @see imp-35111-off-by-one-reentry-band-width (band width ~10.08 decades, exit ~10^37.17)
 * @see imp-34997-iters-to-floor-tail-grid-refinement (grid-measured the drift and the 10^27.08 reentry)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (baked DRIFT_PER_DECADE=0.0187; sub-gap imp-35243a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34997/35109/35111/35243/35332)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)
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

// The off-by-one window width (phase units), a pure ratio of the two machine-precision constants.
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408

// Inherited band landmarks (imp-35111/imp-35174/imp-35243, double-double certified).
const REENTRY_EXP = 27.084691; // band-on, log10 N
const EXIT_EXP = 37.167107; // band-off, log10 N
const ACTUAL_BAND_WIDTH = EXIT_EXP - REENTRY_EXP; // ~10.0824 decades

// The imp-35332 analytic drift (verbatim), DRIFT(N) = ln(10).K.(L-1)/L / (LN_INV_R.(K log T0 - N_cross)).
function analyticDrift(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0 / TWO_PI); // RvM count exponent
  const g = K_AMPL * Math.log(T0); // g(N)
  const dg_dlog10N = K_AMPL * Math.LN10 * (L - 1) / L; // via RvM inverse slope
  return (1 / LN_INV_R) * dg_dlog10N / (g - N_CROSS_FP);
}

// Cumulative drift integral from the reentry edge to decade u = log10 N (midpoint rule, M panels).
function cumulativeDriftIntegral(u, M = 8000) {
  const a = REENTRY_EXP;
  const dx = (u - a) / M;
  let s = 0;
  for (let i = 0; i < M; i++) s += analyticDrift(Math.pow(10, a + (i + 0.5) * dx)) * dx;
  return s;
}

// ---------------------------------------------------------------------------------------------------------
// MEASUREMENT 1: the half-OFFSET mid-band decade, where CumDrift = OFFSET/2.
// ---------------------------------------------------------------------------------------------------------
const HALF_OFFSET = OFFSET / 2; // ~0.074204
function bisectHalfOffset() {
  let lo = REENTRY_EXP;
  let hi = EXIT_EXP;
  for (let it = 0; it < 80; it++) {
    const mid = (lo + hi) / 2;
    if (cumulativeDriftIntegral(mid) < HALF_OFFSET) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const HALF_OFFSET_EXP = bisectHalfOffset(); // ~31.556242 (log10 N_half)
const CUM_AT_HALF = cumulativeDriftIntegral(HALF_OFFSET_EXP); // ~0.074204
// Cross-check against the direct xArg traversal (imp-35332 identity CumDrift = xArg difference).
const XARG_CUM_AT_HALF = xArgD(Math.pow(10, HALF_OFFSET_EXP)) - xArgD(Math.pow(10, REENTRY_EXP));
const GEOMETRIC_MIDPOINT_EXP = (REENTRY_EXP + EXIT_EXP) / 2; // 32.125899 (midpoint in log10 N)
const DECADES_BELOW_HALF = HALF_OFFSET_EXP - REENTRY_EXP; // ~4.4716 (first half of OFFSET)
const DECADES_ABOVE_HALF = EXIT_EXP - HALF_OFFSET_EXP; // ~5.6109 (second half of OFFSET)
const DRIFT_AT_HALF = analyticDrift(Math.pow(10, HALF_OFFSET_EXP)); // ~0.0148468

// ---------------------------------------------------------------------------------------------------------
// MEASUREMENT 2: local-vs-integral band-width discrepancy across the band.
// localWidth(e) = OFFSET / DRIFT(10^e); integral width = ACTUAL_BAND_WIDTH. Crossing where DRIFT = band-avg.
// ---------------------------------------------------------------------------------------------------------
const BAND_AVERAGE_DRIFT = OFFSET / ACTUAL_BAND_WIDTH; // ~0.0147195 (the width-consistent drift)
function localWidth(e) {
  return OFFSET / analyticDrift(Math.pow(10, e));
}
const DISCREPANCY_TABLE = [REENTRY_EXP, 29, 31, 33, 35, EXIT_EXP].map((e) => {
  const drift = analyticDrift(Math.pow(10, e));
  const lw = localWidth(e);
  return {
    log10N: +(+e).toPrecision(8),
    local_drift: +drift.toPrecision(6),
    local_width_decades: +lw.toPrecision(6),
    integral_width_decades: +ACTUAL_BAND_WIDTH.toPrecision(6),
    discrepancy_decades: +(lw - ACTUAL_BAND_WIDTH).toPrecision(5),
  };
});
// The single interior decade where the local-drift band width EXACTLY equals the integral width.
function bisectWidthCrossing() {
  let lo = REENTRY_EXP;
  let hi = EXIT_EXP;
  for (let it = 0; it < 80; it++) {
    const mid = (lo + hi) / 2;
    if (analyticDrift(Math.pow(10, mid)) > BAND_AVERAGE_DRIFT) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const WIDTH_CROSSING_EXP = bisectWidthCrossing(); // ~31.7467 (local width == integral width)

export const IMP35372_REENTRY_BAND_DRIFT_INTEGRAL_HALF_OFFSET = {
  id: 'imp-35372',
  proofSection: 'S-frontier',
  question:
    'imp-35332 showed the reentry-band ceil-phase drift is N-dependent so the band width is set by the drift ' +
    'INTEGRAL (= OFFSET = 0.148408), not the constant 0.0187. MEASURE the mid-band N at which the cumulative ' +
    'drift integral from the reentry reaches HALF the OFFSET, and tabulate the local-vs-integral band-width ' +
    'discrepancy across the band [10^27.08, 10^37.17].',
  constants: {
    off_by_one_window_width_offset: +OFFSET.toPrecision(6), // ~0.148408
    half_offset: +HALF_OFFSET.toPrecision(6), // ~0.074204
    reentry_exponent_log10N: REENTRY_EXP, // 27.084691
    exit_exponent_log10N: EXIT_EXP, // 37.167107
    actual_band_width_decades: +ACTUAL_BAND_WIDTH.toPrecision(6), // ~10.0824
    band_average_drift: +BAND_AVERAGE_DRIFT.toPrecision(6), // ~0.0147195
  },
  half_offset_landmark: {
    half_offset_exponent_log10N: +HALF_OFFSET_EXP.toPrecision(8), // ~31.556242
    cumulative_drift_at_half: +CUM_AT_HALF.toPrecision(7), // ~0.074204
    xarg_traversal_at_half_crosscheck: +XARG_CUM_AT_HALF.toPrecision(7), // ~0.074204 (identity check)
    geometric_midpoint_exponent_log10N: +GEOMETRIC_MIDPOINT_EXP.toPrecision(8), // 32.125899
    decades_reentry_to_half: +DECADES_BELOW_HALF.toPrecision(6), // ~4.4716 (first half of OFFSET)
    decades_half_to_exit: +DECADES_ABOVE_HALF.toPrecision(6), // ~5.6109 (second half of OFFSET)
    local_drift_at_half: +DRIFT_AT_HALF.toPrecision(6), // ~0.0148468
    reading:
      'The cumulative drift integral reaches half the OFFSET at log10 N = 31.556242 (N_half ~ 10^31.5562), ' +
      'BELOW the geometric-midpoint decade 32.125899 by ~0.57 decades. Because the drift is faster near the ' +
      'reentry, the first half of the phase window is swept in only 4.4716 decades while the second half takes ' +
      '5.6109 decades. The cumulative integral matches the direct xArg traversal to full precision (imp-35332 ' +
      'identity CumDrift = xArg difference).',
  },
  local_vs_integral_width: {
    discrepancy_table: DISCREPANCY_TABLE,
    width_crossing_exponent_log10N: +WIDTH_CROSSING_EXP.toPrecision(8), // ~31.7467
    reading:
      'The local-drift band width localWidth(e) = OFFSET/DRIFT(10^e) grows monotonically through the band ' +
      '(drift decreases), UNDERSTATING the true 10.0824-decade integral width at the reentry (7.9673, ' +
      'discrepancy -2.1152) and OVERSTATING it at the exit (12.5444, +2.4620). It equals the integral width at ' +
      'exactly one interior decade, log10 N = 31.7467, where DRIFT(N) = the band-average drift 0.0147195 ' +
      '(~0.19 decades above the half-OFFSET landmark). Only the drift INTEGRAL is width-consistent band-wide.',
  },
  finding:
    'MEASUREMENT on the inherited imp-3220/imp-3406 surrogate. The cumulative drift integral from the reentry ' +
    'reaches HALF the OFFSET (0.074204) at log10 N = 31.556242 (N_half ~ 10^31.5562), which sits BELOW the ' +
    'geometric-midpoint decade 32.125899 by ~0.57 decades because the drift is faster near the reentry: the ' +
    'first half of the phase window is swept in 4.4716 decades, the second half in 5.6109 decades. The ' +
    'local-drift band width localWidth = OFFSET/DRIFT grows from 7.9673 decades at the reentry (discrepancy ' +
    '-2.1152 vs the 10.0824-decade integral width) to 12.5444 at the exit (+2.4620), matching the integral ' +
    'width at exactly one interior decade log10 N = 31.7467 where DRIFT = the band-average 0.0147195. This is a ' +
    'MEASUREMENT entirely INSIDE the inherited surrogate; it discharges NOTHING -- imp-35243a (and its parents ' +
    'imp-35111a/imp-35174a/imp-34997a) stay OPEN.',
  residual_sub_gap:
    'This locates the half-OFFSET mid-band point and tabulates the local-vs-integral width discrepancy WITHIN ' +
    'the surrogate; it says nothing about surrogate-vs-true fidelity. imp-35243a stays OPEN (certify the ' +
    'reentry band is a feature of the true collapse dynamic, not only of the machine-epsilon-floored ' +
    'single-rate surrogate); it inherits imp-35111a / imp-35174a / imp-34997a. Changes no bound, adds no witness.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35332 cumulative drift integral ' +
    'reaches HALF the OFFSET (0.074204) at log10 N = 31.556242 (N_half ~ 10^31.5562), BELOW the geometric ' +
    'midpoint 32.125899 by ~0.57 decades (drift faster near the reentry: 4.4716 decades below, 5.6109 above). ' +
    'The local-drift band width OFFSET/DRIFT sweeps from 7.9673 decades at the reentry (discrepancy -2.1152 vs ' +
    'the 10.0824-decade integral width) to 12.5444 at the exit (+2.4620), equalling the integral width at one ' +
    'interior decade log10 N = 31.7467 where DRIFT = the band-average 0.0147195. MEASUREMENT ONLY on the ' +
    'inherited imp-3220/imp-3406 surrogate; it does NOT discharge imp-35243a (surrogate-fidelity), which stays ' +
    'OPEN with imp-35111a / imp-35174a / imp-34997a. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and ' +
    'the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays ' +
    '1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35332 (derived DRIFT(N), integral = OFFSET); imp-35111 (band width ~10.08 decades); imp-34997 ' +
    '(grid-measured the drift and the 10^27.08 reentry); imp-35243 (baked DRIFT_PER_DECADE=0.0187; sub-gap ' +
    'imp-35243a); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35372_REENTRY_BAND_DRIFT_INTEGRAL_HALF_OFFSET_ASSERTIONS = [
  {
    // The half-OFFSET decade is located inside the band and reproduces the target integral value.
    id: 'imp35372-half-offset-decade-located',
    description: 'cumulative drift integral = OFFSET/2 at log10 N ~ 31.5562, inside [27.08, 37.17]',
    holds: () =>
      HALF_OFFSET_EXP > REENTRY_EXP &&
      HALF_OFFSET_EXP < EXIT_EXP &&
      Math.abs(HALF_OFFSET_EXP - 31.556242) < 1e-4 &&
      Math.abs(CUM_AT_HALF - HALF_OFFSET) < 1e-6,
  },
  {
    // The cumulative integral agrees with the direct xArg traversal (imp-35332 identity) at the half point.
    id: 'imp35372-integral-matches-xarg-at-half',
    description: 'cumulative drift integral matches the direct xArg traversal at the half-OFFSET point to <1e-6',
    holds: () => Math.abs(CUM_AT_HALF - XARG_CUM_AT_HALF) < 1e-6,
  },
  {
    // The half-OFFSET point sits BELOW the geometric midpoint (drift faster near the reentry).
    id: 'imp35372-half-below-geometric-midpoint',
    description: 'half-OFFSET decade < geometric midpoint; first half swept in fewer decades than second half',
    holds: () =>
      HALF_OFFSET_EXP < GEOMETRIC_MIDPOINT_EXP &&
      DECADES_BELOW_HALF < DECADES_ABOVE_HALF &&
      Math.abs(DECADES_BELOW_HALF + DECADES_ABOVE_HALF - ACTUAL_BAND_WIDTH) < 1e-9,
  },
  {
    // Local-vs-integral discrepancy: understates at the reentry (-2.11), overstates at the exit (+2.46).
    id: 'imp35372-local-width-discrepancy-sign-flip',
    description: 'local band width understates at reentry (disc<0), overstates at exit (disc>0), crossing at ~31.75',
    holds: () =>
      DISCREPANCY_TABLE[0].discrepancy_decades < 0 &&
      DISCREPANCY_TABLE[DISCREPANCY_TABLE.length - 1].discrepancy_decades > 0 &&
      Math.abs(DISCREPANCY_TABLE[0].discrepancy_decades + 2.1152) < 1e-2 &&
      WIDTH_CROSSING_EXP > REENTRY_EXP &&
      WIDTH_CROSSING_EXP < EXIT_EXP &&
      Math.abs(analyticDrift(Math.pow(10, WIDTH_CROSSING_EXP)) - BAND_AVERAGE_DRIFT) < 1e-6,
  },
  {
    // Honesty gate: measurement only, discharges nothing, no QED, no refereed bound is changed, sub-gap named/OPEN.
    id: 'imp35372-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, discharges nothing, no QED, no refereed bound is changed, imp-35243a OPEN',
    holds: () =>
      IMP35372_REENTRY_BAND_DRIFT_INTEGRAL_HALF_OFFSET.isRigorous === false &&
      /NO QED/.test(IMP35372_REENTRY_BAND_DRIFT_INTEGRAL_HALF_OFFSET.verdict) &&
      /refereed bound is changed/i.test(IMP35372_REENTRY_BAND_DRIFT_INTEGRAL_HALF_OFFSET.verdict) &&
      /imp-35243a/.test(IMP35372_REENTRY_BAND_DRIFT_INTEGRAL_HALF_OFFSET.residual_sub_gap) &&
      /stay OPEN/.test(IMP35372_REENTRY_BAND_DRIFT_INTEGRAL_HALF_OFFSET.finding),
  },
];

for (const a of IMP35372_REENTRY_BAND_DRIFT_INTEGRAL_HALF_OFFSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35372-reentry-band-drift-integral-half-offset assertion failed: ${a.id}`);
  }
}
