/**
 * @module imp-34993-krawczyk-margin-infimum-xvalidate
 *
 * imp-34993 (accuracy, frontier): CROSS-VALIDATE the imp-34949 exact closed-form Krawczyk monotonicity-margin
 * infimum m(N) ~ 0.488 (a band-lo boundary-attained value) against ADDITIONAL INDEPENDENT N rungs and BOTH
 * endpoints of the imp-34693 admissible seed band, confirming the 4000-point imp-34929 sweep minimum is a
 * genuinely ATTAINED BOUNDARY VALUE and not an interior sampling artifact. imp-34949 established, on a single
 * widest-k=10 40001-point sweep, that the exact margin
 *   m(N) = 1 - a-prime(N)(1-a(M)) / [ a-prime(M)(1-delta)(1-a(N))(2-a(N)) ],  M = N(1-delta),
 * has delta -> 0 limit m_0(N) = (1-a)/(2-a) = G/(1+G) = V/(1+V), strictly increasing in N, so its infimum on
 * any closed band is the band-lo endpoint. This module re-derives the SAME kernels verbatim (import-light) and
 * subjects the infimum to four independent stress axes that a single sweep cannot rule out.
 *
 * AXIS 1 -- SIX INDEPENDENT SEED-BAND RUNGS (k = 0,2,4,6,8,10)
 * -----------------------------------------------------------
 * The imp-34693 admissible seed band half-width is rho(1,k) = (1-L)/[(1-L_c) L^k], widening by 1/L ~ 6.73 per
 * Picard iterate. For EACH rung k the band [N_cross - rho, N_cross + rho] is swept independently: the minimum
 * is attained at the band-lo node (argmin index 0) in every rung, and the per-rung band-lo infimum is NESTED-
 * DECREASING in k -- a narrower band (smaller k) sits closer to N_cross, so its band-lo margin is LARGER. The
 * global infimum across all six rungs is therefore the widest k=10 band-lo value ~0.4878337, reproducing the
 * imp-34949 / imp-34929 worst case from six separate bands rather than one. (The k=0 band is only +-0.89 wide,
 * so m varies by < 1e-9 across it -- below float noise -- and strict monotonicity is asserted only for k >= 2;
 * argmin is still the band-lo node at k=0.)
 *
 * AXIS 2 -- RESOLUTION INDEPENDENCE (an interior minimum would move argmin; it does not)
 * -------------------------------------------------------------------------------------
 * The widest k=10 band is swept at six resolutions -- 4000, 7919, 12007, 40000, 65537, 131071 points. The
 * prime counts 7919/12007/65537/131071 place sample nodes that do NOT coincide with the imp-34929 4000-point or
 * imp-34949 40001-point grids, so any interior sub-node minimum missed by the original grids would surface as a
 * shifted argmin at finer resolution. It does not: argmin stays pinned at the leftmost (band-lo) node and the
 * infimum is stable at 0.4878337 across all six resolutions. That is the decisive discriminator between an
 * attained boundary value and an interior sampling artifact.
 *
 * AXIS 3 -- PHASE-SHIFTED OFF-GRID SWEEPS
 * ---------------------------------------
 * Four sweeps with interior nodes deliberately offset by fractional-step shifts {0.13, 0.37, 0.61, 0.83} place
 * every interior sample at a location distinct from any prior grid; the minimum remains the leftmost node and
 * the infimum stays 0.4878337 in all four.
 *
 * AXIS 4 -- BOTH BAND ENDPOINTS + NO INTERIOR STATIONARY POINT
 * -----------------------------------------------------------
 * Evaluated directly at both endpoints of the widest admissible seed band and at the fixed point:
 *   m(band_lo) = 0.487833681 < m(N_cross) = 0.488487120 < m(band_top) = 0.489074388.
 * An independent monotonicity witness -- the minimum forward difference m(N_{i+1}) - m(N_i) over 5000
 * subintervals -- is +2.2302e-7 > 0, i.e. the discrete derivative is strictly positive EVERYWHERE on the band,
 * so there is no interior stationary point where an interior minimum could hide. The infimum is the attained
 * left boundary value.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; reproduces
 * the imp-34949/imp-34929 ~0.4878337 band-lo infimum from independent rungs, resolutions, and grids; changes NO
 * bound. star_over_H2 rests on the same gamma(n)/k eps surrogate models of the imp-34687a directed-rounding
 * layer, not the layer itself; F(m) = 0 remains a double-precision artifact and the machine certificate
 * imp-34714a REMAINS OPEN. C_C = 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34949-krawczyk-margin-infimum-band-endpoint (the exact closed form + single-sweep infimum this cross-validates)
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form d/dN sign; the 4000-point sweep worst case 0.487834)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band rho(1,k) = (1-L)/[(1-L_c) L^k])
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse; slope dN/dT0 = u/2pi)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34929/34949)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width

// Banach map g(N) = K log T0(N), local contraction a(N), closed-form a-prime(N) (verbatim from imp-34949).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const aPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (-4 * Math.PI * Math.PI * K_AMPL * (u + 1)) / (T * T * u * u * u);
};

function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883/34929/34949)
const R_HALF = rho(1, WIDEST_BAND_K);
const BAND_LO = N_CROSS - R_HALF;
const BAND_TOP = N_CROSS + R_HALF;

// Exact closed-form relative monotonicity margin m(N) = 1 - up/down (verbatim from imp-34949).
function marginExact(N) {
  const a = aOf(N);
  const ap = aPrime(N);
  const M = N * (1 - DELTA);
  const aM = aOf(M);
  const apM = aPrime(M);
  const up = -ap / ((1 - a) * (2 - a)); // G-prime/(G(1+G)), with 1+G = 2-a
  const down = (-apM * (1 - DELTA)) / (1 - aM); // FP_LO-prime/FP_LO
  return 1 - up / down;
}

// Generic band sweep helper: returns {min, argminIndex, max, monotoneIncreasing}.
function sweepBand(lo, top, pts) {
  let min = Infinity;
  let argmin = -1;
  let max = -Infinity;
  let mono = true;
  let prev = -Infinity;
  for (let i = 0; i <= pts; i++) {
    const N = lo + ((top - lo) * i) / pts;
    const me = marginExact(N);
    if (me < min) {
      min = me;
      argmin = i;
    }
    if (me > max) max = me;
    if (i > 0 && !(me > prev)) mono = false;
    prev = me;
  }
  return { min, argmin, max, mono };
}

// AXIS 1 -- six independent seed-band rungs; each min at band-lo, infimum nested-decreasing in k.
const RUNG_KS = [0, 2, 4, 6, 8, 10];
const RUNG_RESULTS = RUNG_KS.map((k) => {
  const R = rho(1, k);
  const s = sweepBand(N_CROSS - R, N_CROSS + R, 20000);
  return { k, halfWidth: R, infimum: s.min, argminAtBandLo: s.argmin === 0, monotone: s.mono };
});
const ALL_RUNGS_MIN_AT_BAND_LO = RUNG_RESULTS.every((r) => r.argminAtBandLo);
const RUNGS_MONOTONE_FOR_K_GE_2 = RUNG_RESULTS.filter((r) => r.k >= 2).every((r) => r.monotone);
let RUNG_INFIMA_NESTED_DECREASING = true;
for (let i = 1; i < RUNG_RESULTS.length; i++) {
  if (!(RUNG_RESULTS[i].infimum <= RUNG_RESULTS[i - 1].infimum)) RUNG_INFIMA_NESTED_DECREASING = false;
}
const GLOBAL_INFIMUM = RUNG_RESULTS[RUNG_RESULTS.length - 1].infimum; // widest k=10 band-lo

// AXIS 2 -- resolution independence on the widest band (primes place off-grid nodes).
const RESOLUTIONS = [4000, 7919, 12007, 40000, 65537, 131071];
const RES_RESULTS = RESOLUTIONS.map((pts) => {
  const s = sweepBand(BAND_LO, BAND_TOP, pts);
  return { pts, min: s.min, argminAtBandLo: s.argmin === 0 };
});
const ALL_RES_MIN_AT_BAND_LO = RES_RESULTS.every((r) => r.argminAtBandLo);
let RES_INFIMUM_SPREAD = 0;
{
  const vals = RES_RESULTS.map((r) => r.min);
  RES_INFIMUM_SPREAD = Math.max(...vals) - Math.min(...vals);
}

// AXIS 3 -- phase-shifted off-grid sweeps (interior nodes distinct from any prior grid).
const PHASE_SHIFTS = [0.13, 0.37, 0.61, 0.83];
const PHASE_PTS = 9973; // prime
const PHASE_RESULTS = PHASE_SHIFTS.map((frac) => {
  let min = Infinity;
  let argmin = -1;
  for (let i = 0; i <= PHASE_PTS; i++) {
    const shifted = i > 0 && i < PHASE_PTS ? i + frac : i;
    const t = Math.min(1, shifted / PHASE_PTS);
    const N = BAND_LO + (BAND_TOP - BAND_LO) * t;
    const me = marginExact(N);
    if (me < min) {
      min = me;
      argmin = i;
    }
  }
  return { frac, min, argminAtBandLo: argmin === 0 };
});
const ALL_PHASE_MIN_AT_BAND_LO = PHASE_RESULTS.every((r) => r.argminAtBandLo);

// AXIS 4 -- both band endpoints + strictly-positive interior forward difference (no stationary point).
const M_LO = marginExact(BAND_LO); // ~0.4878337 (the infimum)
const M_CENTER = marginExact(N_CROSS); // ~0.4884871
const M_TOP = marginExact(BAND_TOP); // ~0.4890744
let MIN_FORWARD_DIFF = Infinity;
{
  const P = 5000;
  for (let i = 0; i < P; i++) {
    const N1 = BAND_LO + ((BAND_TOP - BAND_LO) * i) / P;
    const N2 = BAND_LO + ((BAND_TOP - BAND_LO) * (i + 1)) / P;
    const d = marginExact(N2) - marginExact(N1);
    if (d < MIN_FORWARD_DIFF) MIN_FORWARD_DIFF = d;
  }
}
const NO_INTERIOR_STATIONARY_POINT = MIN_FORWARD_DIFF > 0;

export const IMP34993_KRAWCZYK_MARGIN_INFIMUM_XVALIDATE = {
  id: 'imp-34993',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-34949 exact closed-form Krawczyk monotonicity-margin infimum m(N) ~ 0.488 ' +
    '(boundary-attained) against additional independent N rungs and both endpoints of the imp-34693 admissible ' +
    'seed band, confirming the 4000-point imp-34929 sweep minimum is a genuinely ATTAINED BOUNDARY VALUE and ' +
    'not an interior sampling artifact. Measurement on the gamma(n)/k eps surrogate; imp-34714a stays OPEN; ' +
    'adds no RH bound; NO QED.',
  method: {
    axis1_seed_band_rungs:
      'Six independent imp-34693 seed-band rungs k = 0,2,4,6,8,10 with half-width rho(1,k) = (1-L)/[(1-L_c) ' +
      'L^k]; each band swept separately. In every rung the argmin is the band-lo node; the per-rung band-lo ' +
      'infima are nested-decreasing in k (a narrower band sits closer to N_cross with a larger margin), so the ' +
      'global infimum is the widest k=10 band-lo value.',
    axis2_resolution_independence:
      'The widest k=10 band swept at 4000/7919/12007/40000/65537/131071 points; the prime counts place nodes ' +
      'off the imp-34929 4000-point and imp-34949 40001-point grids, so any interior sub-node minimum would ' +
      'shift the argmin. It does not -- argmin stays leftmost and the infimum is stable across all six.',
    axis3_phase_shifted_grids:
      'Four sweeps with interior nodes offset by fractional-step shifts {0.13,0.37,0.61,0.83}, distinct from ' +
      'any prior grid; the minimum remains the leftmost node in all four.',
    axis4_endpoints_and_derivative:
      'Both endpoints of the widest admissible seed band evaluated directly (m(band_lo) < m(N_cross) < ' +
      'm(band_top)); the minimum forward difference over 5000 subintervals is strictly positive, so the ' +
      'discrete derivative is > 0 everywhere and no interior stationary point exists.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    delta: DELTA, // 2e-4
    widest_band_k: WIDEST_BAND_K, // 10
    band_lo_N: +BAND_LO.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
  },
  measurement: {
    rung_ks: RUNG_KS, // [0,2,4,6,8,10]
    rung_infima: RUNG_RESULTS.map((r) => +r.infimum.toFixed(7)), // nested-decreasing to the k=10 band-lo
    all_rungs_min_at_band_lo: ALL_RUNGS_MIN_AT_BAND_LO, // true
    rungs_monotone_for_k_ge_2: RUNGS_MONOTONE_FOR_K_GE_2, // true
    rung_infima_nested_decreasing: RUNG_INFIMA_NESTED_DECREASING, // true
    global_infimum_exact: +GLOBAL_INFIMUM.toFixed(7), // ~0.4878337 (matches imp-34949 0.4878337 / imp-34929 0.487834)
    resolutions: RESOLUTIONS, // [4000,7919,12007,40000,65537,131071]
    all_resolutions_min_at_band_lo: ALL_RES_MIN_AT_BAND_LO, // true
    resolution_infimum_spread: +RES_INFIMUM_SPREAD.toExponential(4), // ~0 (resolution-independent)
    phase_shifts: PHASE_SHIFTS, // [0.13,0.37,0.61,0.83]
    all_phase_shifts_min_at_band_lo: ALL_PHASE_MIN_AT_BAND_LO, // true
    margin_exact_band_lo: +M_LO.toFixed(9), // 0.487833681
    margin_exact_center: +M_CENTER.toFixed(9), // 0.488487120
    margin_exact_band_top: +M_TOP.toFixed(9), // 0.489074388
    min_forward_difference: +MIN_FORWARD_DIFF.toExponential(4), // ~2.2302e-7 (> 0 everywhere)
    no_interior_stationary_point: NO_INTERIOR_STATIONARY_POINT, // true
  },
  finding:
    'The imp-34949 boundary-attained margin infimum ~0.4878337 is confirmed by four independent stress axes. ' +
    '(1) Across six separate imp-34693 seed-band rungs k = 0,2,4,6,8,10 the minimum is the band-lo node in ' +
    'every rung and the per-rung infima are nested-decreasing in k, so the global infimum is the widest k=10 ' +
    'band-lo ~0.4878337 -- reproduced from six bands, not one sweep. (2) Sweeping the widest band at ' +
    '4000/7919/12007/40000/65537/131071 points (prime counts placing off-grid nodes) leaves the argmin pinned ' +
    'at the leftmost node with a resolution-independent infimum: an interior minimum would move the argmin at ' +
    'finer resolution; it does not. (3) Four phase-shifted off-grid sweeps agree. (4) Directly, m(band_lo) = ' +
    '0.487833681 < m(N_cross) = 0.488487120 < m(band_top) = 0.489074388, and the minimum forward difference ' +
    'over the band is +2.2302e-7 > 0, so there is no interior stationary point. So the 4000-point imp-34929 ' +
    'sweep minimum is a genuinely ATTAINED BOUNDARY VALUE, not an interior sampling artifact. EVIDENCE the ' +
    'surrogate margin infimum is robust; NOT a machine certificate.',
  subGap:
    'imp-34714a REMAINS OPEN. Cross-validating that the ~0.488 margin infimum is an attained boundary value ' +
    'across independent rungs, resolutions, and grids strengthens the imp-34949 single-sweep evidence, but it ' +
    'does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: the headroom ' +
    'rests on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, ' +
    'and F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK MONOTONICITY-MARGIN INFIMUM CROSS-VALIDATED, ATTAINED BOUNDARY VALUE (frontier, NOT an RH ' +
    'bound). imp-34949 located the exact-margin infimum ~0.4878337 at the widest k=10 band-lo on a single ' +
    '40001-point sweep. This module confirms it is an ATTAINED BOUNDARY VALUE, not an interior sampling ' +
    'artifact, on four independent axes: six separate imp-34693 seed-band rungs (k=0..10, argmin at band-lo in ' +
    'each, infima nested-decreasing to the k=10 band-lo); six sweep resolutions including prime off-grid node ' +
    'counts (argmin pinned leftmost, infimum resolution-independent); four phase-shifted off-grid sweeps; and ' +
    'both band endpoints with a strictly-positive interior forward difference (+2.2302e-7) ruling out any ' +
    'interior stationary point. m(band_lo) = 0.487833681 < m(N_cross) = 0.488487120 < m(band_top) = ' +
    '0.489074388. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: star_over_H2 rests on ' +
    'the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Measurement/cross-validation only on the inherited imp-3220/imp-3406 surrogate ' +
    'crossover map; reproduces the imp-34949/imp-34929 ~0.4878337 infimum; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34949 (exact closed-form margin + single-sweep infimum); imp-34929 (closed-form d/dN sign + 4000-' +
    'point sweep worst case 0.487834); imp-34906 (2555/2558 reconciliation); imp-34883 (k=10 band-min ' +
    '2555.18x); imp-34693 (admissible seed band rho(1,k)); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 ' +
    '(C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse; slope dN/dT0 = u/2 pi). ' +
    'Independent-rung / multi-resolution boundary-infimum cross-validation: standard.',
};

export const IMP34993_KRAWCZYK_MARGIN_INFIMUM_XVALIDATE_ASSERTIONS = [
  {
    // Six independent seed-band rungs each attain their minimum at the band-lo node.
    id: 'imp34993-all-rungs-min-at-band-lo',
    description: 'across k = 0,2,4,6,8,10 the exact-margin minimum is the band-lo node in every rung',
    holds: () => ALL_RUNGS_MIN_AT_BAND_LO === true,
  },
  {
    // Per-rung band-lo infima are nested-decreasing in k, so the global infimum is the widest k=10 band-lo.
    id: 'imp34993-rung-infima-nested-decreasing',
    description: 'per-rung band-lo infima are nested-decreasing in k and are strictly monotone for k >= 2',
    holds: () => RUNG_INFIMA_NESTED_DECREASING === true && RUNGS_MONOTONE_FOR_K_GE_2 === true,
  },
  {
    // The cross-validated global infimum reproduces the imp-34949/imp-34929 band-lo worst case ~0.4878337.
    id: 'imp34993-global-infimum-reproduces-imp34949',
    description: 'the k=10 band-lo global infimum reproduces the imp-34949 0.4878337 / imp-34929 0.487834',
    holds: () => Math.abs(GLOBAL_INFIMUM - 0.487834) < 1e-5,
  },
  {
    // Resolution independence: argmin stays leftmost and the infimum is stable across six resolutions.
    id: 'imp34993-resolution-independent-boundary-infimum',
    description: 'six sweep resolutions (incl. primes / off-grid nodes) keep argmin leftmost with a stable infimum',
    holds: () => ALL_RES_MIN_AT_BAND_LO === true && RES_INFIMUM_SPREAD < 1e-9,
  },
  {
    // Phase-shifted off-grid sweeps also pin the minimum at the band-lo node.
    id: 'imp34993-phase-shifted-grids-agree',
    description: 'four phase-shifted off-grid sweeps also attain their minimum at the band-lo node',
    holds: () => ALL_PHASE_MIN_AT_BAND_LO === true,
  },
  {
    // Both endpoints ordered and a strictly-positive interior forward difference => no interior stationary point.
    id: 'imp34993-endpoints-ordered-no-interior-stationary-point',
    description: 'm(band_lo) < m(N_cross) < m(band_top) and the min forward difference is > 0 (no interior stationary point)',
    holds: () =>
      M_LO < M_CENTER &&
      M_CENTER < M_TOP &&
      NO_INTERIOR_STATIONARY_POINT === true &&
      MIN_FORWARD_DIFF > 0,
  },
  {
    // Honesty gate: cross-validation / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34993-honesty-gate-no-qed',
    description: 'cross-validation: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34993_KRAWCZYK_MARGIN_INFIMUM_XVALIDATE.isRigorous === false &&
      /imp-34714a/.test(IMP34993_KRAWCZYK_MARGIN_INFIMUM_XVALIDATE.subGap) &&
      /REMAINS OPEN/.test(IMP34993_KRAWCZYK_MARGIN_INFIMUM_XVALIDATE.subGap) &&
      /NO QED/.test(IMP34993_KRAWCZYK_MARGIN_INFIMUM_XVALIDATE.verdict) &&
      /refereed bound is changed/i.test(IMP34993_KRAWCZYK_MARGIN_INFIMUM_XVALIDATE.verdict),
  },
];

for (const a of IMP34993_KRAWCZYK_MARGIN_INFIMUM_XVALIDATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34993-krawczyk-margin-infimum-xvalidate assertion failed: ${a.id}`);
  }
}
