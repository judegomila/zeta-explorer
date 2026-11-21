/**
 * @module imp-35433-reentry-band-landmark-crosscheck
 *
 * imp-35433 (accuracy, frontier-direction) -- INDEPENDENT cross-check that the imp-35372 mid-band
 * landmarks reproduce from the imp-35332 DRIFT(N) closed form and OFFSET = 0.148408, using
 * DELIBERATELY DIFFERENT numerics than imp-35372 so agreement is not a shared-implementation artifact.
 *
 * imp-35372 located, via a MIDPOINT-rule drift integral bisected for the target, the half-OFFSET
 * mid-band decade u_half = 31.556242 (where the cumulative drift from the reentry reaches OFFSET/2 =
 * 0.074204), the width-crossover decade u_cross = 31.7467 (where the local drift equals the
 * band-average OFFSET/ACTUAL = 0.0147195), the local-vs-integral band-width discrepancies (-2.1152 at
 * the reentry, +2.4620 at the exit), and ACTUAL = EXIT_EXP - REENTRY_EXP = 10.0824 decades. This module
 * recomputes each of those numbers by an INDEPENDENT route:
 *   - the cumulative drift integral via COMPOSITE SIMPSON (imp-35372 used the midpoint rule),
 *   - u_half via NEWTON on that Simpson integral (imp-35372 used 80-step bisection),
 *   - u_cross via NEWTON on DRIFT(10^u) - band_average = 0 (imp-35372 used bisection on the same),
 * and asserts every landmark reproduces the imp-35372 stored literal within storage rounding.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A VERIFICATION / accuracy cross-check on the inherited imp-3220/imp-3406 surrogate. It confirms that
 * the imp-35372 landmark table is a faithful readout of the imp-35332 DRIFT(N) closed form and OFFSET,
 * with no drift beyond storage rounding. It discharges NOTHING: the surrogate-fidelity sub-gap imp-35243a
 * (and its parents imp-35111a / imp-35174a / imp-34997a) stay OPEN -- this says nothing about whether the
 * surrogate models the true collapse dynamic at 10^27-10^37. The C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 * untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35372-reentry-band-drift-integral-half-offset (shipped u_half/u_cross and the discrepancy table this reproduces)
 * @see imp-35332-reentry-band-drift-analytic-derivation (derived DRIFT(N), integral = OFFSET)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (sub-gap imp-35243a, stays OPEN)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35332/35372)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness
const TWO_PI = 2 * Math.PI;

// The imp-35332 DOUBLE surrogate, reproduced verbatim (shared baseline; the CROSS-CHECK is in the numerics).
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS_FP = iterateD(1e9, 200); // ~3280294351.65
const gPrimeAtStep = (h) => (gD(N_CROSS_FP + h) - gD(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate

// The off-by-one window width (phase units), a pure ratio of the two machine-precision constants.
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408

// Inherited band landmarks (imp-35111/imp-35174/imp-35243, double-double certified).
const REENTRY_EXP = 27.084691;
const EXIT_EXP = 37.167107;
const ACTUAL_BAND_WIDTH = EXIT_EXP - REENTRY_EXP; // ~10.0824 decades

// The imp-35332 analytic drift, DRIFT(N) = ln(10).K.(L-1)/L / (LN_INV_R.(K log T0 - N_cross)).
function analyticDrift(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0 / TWO_PI); // RvM count exponent
  const g = K_AMPL * Math.log(T0); // g(N)
  const dg_dlog10N = K_AMPL * Math.LN10 * (L - 1) / L; // via RvM inverse slope
  return (1 / LN_INV_R) * dg_dlog10N / (g - N_CROSS_FP);
}

// INDEPENDENT quadrature: composite Simpson (imp-35372 used the midpoint rule).
function cumulativeDriftSimpson(u, M = 10000) {
  if (M % 2 === 1) M += 1;
  const a = REENTRY_EXP;
  const h = (u - a) / M;
  let s = analyticDrift(Math.pow(10, a)) + analyticDrift(Math.pow(10, u));
  for (let i = 1; i < M; i++) s += (i % 2 === 1 ? 4 : 2) * analyticDrift(Math.pow(10, a + i * h));
  return (s * h) / 3;
}

// INDEPENDENT root-finder: Newton on cumulative(u) - target (imp-35372 used 80-step bisection).
const HALF_OFFSET = OFFSET / 2; // ~0.074204
function newtonForCumTarget(target) {
  let u = (REENTRY_EXP + EXIT_EXP) / 2;
  for (let it = 0; it < 60; it++) {
    const f = cumulativeDriftSimpson(u) - target;
    const d = analyticDrift(Math.pow(10, u)); // d/du of the cumulative integral
    u -= f / d;
  }
  return u;
}
const HALF_OFFSET_EXP = newtonForCumTarget(HALF_OFFSET); // ~31.556242

// INDEPENDENT u_cross: Newton on DRIFT(10^u) - band_average = 0 (imp-35372 used bisection).
const BAND_AVERAGE_DRIFT = OFFSET / ACTUAL_BAND_WIDTH; // ~0.0147195
function newtonForBandAverage() {
  let u = 31.7;
  for (let it = 0; it < 80; it++) {
    const f = analyticDrift(Math.pow(10, u)) - BAND_AVERAGE_DRIFT;
    const eps = 1e-6;
    const df = (analyticDrift(Math.pow(10, u + eps)) - analyticDrift(Math.pow(10, u - eps))) / (2 * eps);
    u -= f / df;
  }
  return u;
}
const WIDTH_CROSSING_EXP = newtonForBandAverage(); // ~31.7467

// Local-vs-integral band-width discrepancies at the two edges (localWidth = OFFSET / DRIFT).
const LOCAL_WIDTH_REENTRY = OFFSET / analyticDrift(Math.pow(10, REENTRY_EXP)); // ~7.9673
const LOCAL_WIDTH_EXIT = OFFSET / analyticDrift(Math.pow(10, EXIT_EXP)); // ~12.5444
const DISCREPANCY_REENTRY = LOCAL_WIDTH_REENTRY - ACTUAL_BAND_WIDTH; // ~-2.1152
const DISCREPANCY_EXIT = LOCAL_WIDTH_EXIT - ACTUAL_BAND_WIDTH; // ~+2.4620

// imp-35372 published literals being cross-checked (from the shipped module constants/tables).
const PUBLISHED = {
  offset: 0.148408,
  actual_band_width: 10.0824,
  half_offset_exp: 31.556242,
  width_crossing_exp: 31.7467,
  band_average_drift: 0.0147195,
  discrepancy_reentry: -2.1152,
  discrepancy_exit: 2.462,
};

export const IMP35433_REENTRY_BAND_LANDMARK_CROSSCHECK = {
  id: 'imp-35433',
  proofSection: 'S-frontier',
  question:
    'Do the imp-35372 mid-band landmarks (u_half = 31.556242, u_cross = 31.7467, the reentry/exit ' +
    'localWidth discrepancies -2.1152/+2.4620, and ACTUAL = 10.0824) reproduce from the imp-35332 DRIFT(N) ' +
    'closed form and OFFSET = 0.148408 when recomputed by an INDEPENDENT quadrature and root-finder?',
  method:
    'Recompute OFFSET and ACTUAL directly; integrate DRIFT via composite Simpson (imp-35372 used the ' +
    'midpoint rule); locate u_half by Newton on the Simpson integral (imp-35372 used bisection); locate ' +
    'u_cross by Newton on DRIFT(10^u) - band_average (imp-35372 used bisection); compare every landmark to ' +
    'the imp-35372 stored literal within storage rounding.',
  recomputed: {
    offset: +OFFSET.toPrecision(6),
    actual_band_width_decades: +ACTUAL_BAND_WIDTH.toPrecision(6),
    half_offset_exponent_log10N: +HALF_OFFSET_EXP.toPrecision(8),
    width_crossing_exponent_log10N: +WIDTH_CROSSING_EXP.toPrecision(8),
    band_average_drift: +BAND_AVERAGE_DRIFT.toPrecision(6),
    local_width_reentry_decades: +LOCAL_WIDTH_REENTRY.toPrecision(6),
    local_width_exit_decades: +LOCAL_WIDTH_EXIT.toPrecision(6),
    discrepancy_reentry_decades: +DISCREPANCY_REENTRY.toPrecision(5),
    discrepancy_exit_decades: +DISCREPANCY_EXIT.toPrecision(5),
  },
  published_imp35372: PUBLISHED,
  finding:
    'Every imp-35372 mid-band landmark reproduces from the imp-35332 DRIFT(N) closed form and OFFSET = ' +
    '0.148408 under an independent Simpson quadrature and Newton root-finder: u_half = 31.556242, u_cross = ' +
    '31.746741, the reentry/exit localWidth discrepancies -2.1152/+2.4620, the band-average drift 0.0147195, ' +
    'and ACTUAL = 10.082416 all match the shipped literals within storage rounding. This is a VERIFICATION ' +
    'on the inherited imp-3220/imp-3406 surrogate; it discharges NOTHING -- imp-35243a (and its parents ' +
    'imp-35111a/imp-35174a/imp-34997a) stay OPEN.',
  residual_sub_gap:
    'Cross-check confirms the imp-35372 table is a faithful readout of the surrogate DRIFT(N); it says nothing ' +
    'about surrogate-vs-true fidelity. imp-35243a stays OPEN (certify the reentry band is a feature of the true ' +
    'collapse dynamic, not only of the machine-epsilon-floored single-rate surrogate). Changes no bound.',
  isRigorous: false,
  verdict:
    'VERIFICATION (accuracy cross-check, NOT an RH bound). The imp-35372 mid-band landmarks reproduce from the ' +
    'imp-35332 DRIFT(N) closed form and OFFSET = 0.148408 under an INDEPENDENT Simpson-plus-Newton computation, ' +
    'within storage rounding: u_half = 31.556242, u_cross = 31.7467, discrepancies -2.1152/+2.4620, ACTUAL = ' +
    '10.0824. VERIFICATION ONLY on the inherited imp-3220/imp-3406 surrogate; it does NOT discharge imp-35243a ' +
    '(surrogate-fidelity), which stays OPEN with imp-35111a / imp-35174a / imp-34997a. The C_C = (1/8) sqrt(3 pi) ' +
    'ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35372 (shipped u_half/u_cross and the discrepancy table); imp-35332 (derived DRIFT(N), integral = ' +
    'OFFSET); imp-35243 (sub-gap imp-35243a); lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35433_REENTRY_BAND_LANDMARK_CROSSCHECK_ASSERTIONS = [
  {
    // OFFSET and ACTUAL reproduce the imp-35372 literals within storage rounding.
    id: 'imp35433-offset-and-actual-reproduce',
    description: 'OFFSET ~ 0.148408 and ACTUAL ~ 10.0824 reproduce within storage rounding',
    holds: () =>
      Math.abs(OFFSET - PUBLISHED.offset) < 5e-6 &&
      Math.abs(ACTUAL_BAND_WIDTH - PUBLISHED.actual_band_width) < 5e-4,
  },
  {
    // u_half via independent Simpson+Newton reproduces 31.556242.
    id: 'imp35433-u-half-reproduces',
    description: 'independent Simpson+Newton u_half reproduces imp-35372 31.556242 within storage rounding',
    holds: () =>
      HALF_OFFSET_EXP > REENTRY_EXP &&
      HALF_OFFSET_EXP < EXIT_EXP &&
      Math.abs(HALF_OFFSET_EXP - PUBLISHED.half_offset_exp) < 1e-5,
  },
  {
    // u_cross via independent Newton reproduces 31.7467, and DRIFT there equals the band-average.
    id: 'imp35433-u-cross-reproduces',
    description: 'independent Newton u_cross reproduces imp-35372 31.7467 with DRIFT = band-average',
    holds: () =>
      Math.abs(WIDTH_CROSSING_EXP - PUBLISHED.width_crossing_exp) < 1e-3 &&
      Math.abs(analyticDrift(Math.pow(10, WIDTH_CROSSING_EXP)) - BAND_AVERAGE_DRIFT) < 1e-9,
  },
  {
    // The reentry/exit localWidth discrepancies reproduce -2.1152 / +2.4620 with the sign flip.
    id: 'imp35433-edge-discrepancies-reproduce',
    description: 'reentry disc ~ -2.1152, exit disc ~ +2.4620, sign flip preserved',
    holds: () =>
      DISCREPANCY_REENTRY < 0 &&
      DISCREPANCY_EXIT > 0 &&
      Math.abs(DISCREPANCY_REENTRY - PUBLISHED.discrepancy_reentry) < 1e-3 &&
      Math.abs(DISCREPANCY_EXIT - PUBLISHED.discrepancy_exit) < 1e-3,
  },
  {
    // Honesty gate: verification only, discharges nothing, no QED, no refereed bound is changed, sub-gap named/OPEN.
    id: 'imp35433-honesty-gate-no-qed',
    description: 'Verification only: isRigorous false, no QED, no refereed bound is changed, imp-35243a OPEN',
    holds: () =>
      IMP35433_REENTRY_BAND_LANDMARK_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP35433_REENTRY_BAND_LANDMARK_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35433_REENTRY_BAND_LANDMARK_CROSSCHECK.verdict) &&
      /imp-35243a/.test(IMP35433_REENTRY_BAND_LANDMARK_CROSSCHECK.residual_sub_gap) &&
      /stay OPEN/.test(IMP35433_REENTRY_BAND_LANDMARK_CROSSCHECK.finding),
  },
];

for (const a of IMP35433_REENTRY_BAND_LANDMARK_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35433-reentry-band-landmark-crosscheck assertion failed: ${a.id}`);
  }
}
