/**
 * imp-95218 (route7) - ROUTE VII complete-row cost curve: how the price of a
 * COMPLETE upper-bound row U = t + y^2/2 scales as t decreases toward 0.
 * HONEST STATUS: ANALYSIS (grade: analysis). This module derives the scaling
 * of the minimal tail cutoff N1*(t, y) from the contraction structure of
 * verify_tail_arb.c, calibrates it on the two Arb-measured points
 * (t = 129/800 -> N1 = 3.84e6; t = 10103/80000 -> N1* = 220,495,706,
 * imp-95206), prices complete rows along the diagonal family of paper
 * section 10.7 / Theorem 11.1, and locates the verified-height wall. It
 * derives no bound, certifies nothing, and closes no gap. NO QED.
 * No refereed bound is changed (PT-floor audit: verified
 * height binds).
 *
 * CONTEXT (paper section 10.7 + Theorem 11.1 + section 11). Any sequence of
 * COMPLETE upper-bound rows U_k = t_k + y_k^2/2 -> 0 implies Lambda <= 0
 * (with Lambda >= 0, RH). Each row must be globally complete; improving
 * local pilots have no such implication. The fixed-t0 floor (eq. 49-50):
 * at fixed t0 the endpoint infimum t0 is a target, not a shortcut, and
 * y = 0 is inadmissible (the closed regions would meet actual zeros).
 *
 * (1) WHY N1*(t) IS EXPONENTIAL IN 1/t - DERIVED FROM THE VERIFIER.
 * In verify_tail_arb.c the cutoff N enters the decisive contraction
 * D = P + TR + OV + Mmax*AB through exactly two channels:
 *   (i)  the ladder exponents sigma1/2 = 1/2 + (t/2) ln N - delta_hat
 *        [- kappa_hat] +/- y/2 (lines 420-439): every head sum and every
 *        endpoint cap decreases in sigma, and delta_hat, kappa_hat -> 0
 *        as N grows;
 *   (ii) the kernel G = e^{0.02 y} (N^2 - t/16)^{-y/2} ~ N^{-y}
 *        (lines 586-595) multiplying the A-side.
 * Closing D < 1 therefore requires sigma1 to clear an architecture-fixed
 * threshold sigma_c (set by the P1113 vector, MHEAD, and the cap
 * constants), i.e. (t/2) ln N1* + y/2 ~ sigma_c - 1/2 = const. Since t
 * MULTIPLIES ln N, the cutoff is N1* = exp(Theta(1/t)). This is not only
 * a fit: the verifier's SC3 gate (sigma1, sigma2 > 1 on the extended
 * hull, lines 449-450 - required by the cap-monotonicity reduction that
 * closes the semi-infinite x-range with finitely many checks) forces,
 * with the extended-hull top at beta* = sqrt(1 - 2t),
 *   ln N1* > (1 + sqrt(1 - 2t)) / t  ->  2/t  as t -> 0,
 * a floor internal to this architecture that is already exponential in 1/t.
 *
 * CALIBRATION (two Arb-measured points; both use the P1113 vector verbatim):
 *   A: t = 129/800 = 0.16125, y0 = sqrt(87677/2500000) = 0.187272,
 *      N1 = 3,840,000 (v3 sealed package; contraction slack 1.735e-4, so
 *      N1 is within a hair of minimal), (t/2) ln N1 + y/2 = 1.31599;
 *   B: t = 10103/80000 = 0.1262875, y* = 0.165, N1* = 220,495,706
 *      (imp-95206, exact boundary at 320/512 bits), (t/2) ln N1* + y/2
 *      = 1.29558.
 * The threshold combination is constant to 1.6% across a 57x change in
 * N1* - the exponential model is confirmed; a pure power law would need
 * local exponent d ln N1* / d ln(1/t) = 16.57 and rising (the SC3 floor
 * makes the local exponent -> (2/t)*t-slope, unbounded), so the
 * dependence is exponential in 1/t, not polynomial. Two-parameter
 * calibration (absorbing delta_hat/kappa_hat and the G-channel into an
 * additive offset):
 *   ln N1*(t, y) = (2 c0 - y)/t + L0,  c0 = 1.221852, L0 = 1.167600.
 * Consistency checks (not fit points): the 0.1758354 four-gate package
 * (t = 129/800, y = 0.170795) chose N* = 6e6 >= predicted minimum 4.25e6;
 * PREDICTION for the paper's 0.14 row (t0 = 0.123637595, y0 = 0.1809,
 * the Gate-2 contract): N1* ~ 2.85e8 in this architecture - 5.2x the K2
 * economic line, i.e. the 0.14 contract tail is also economically dead
 * verbatim (falsifiable by a T-P1-style probe at the 0.14 coordinates).
 * CAVEATS: two calibration points; both at y in [0.165, 0.19] (the
 * G ~ N^{-y} channel adds a second wall ln N1 >~ c/y as y -> 0 that the
 * calibration range does not see - the law below is therefore a LOWER
 * estimate of cost at small y); the P1113 mollifier was tuned at
 * t = 129/800, so re-optimizing per-t lowers c0 but cannot remove the
 * (2c0 - y)/t form while the architecture closes through a sigma
 * threshold with sigma_c > 1 (SC3).
 *
 * (2) SLAB / FINITE-LANE VOLUME.
 *   - Slab: O(1) window ([X, X+1], fixed width; the time extent [0, t*]
 *     even shrinks as t falls). Cost is prism count, driven by the BOTTOM
 *     MARGIN at y: 883 prisms at y = 0.1809 (v3), estimated 1e3-1e4 at
 *     y = 0.165 (imp-95201 T1), K3 cutoff line ~1e6 prisms. The slab is the
 *     y-axis wall, not the t-axis wall; y = 0 is inadmissible (eq. 49-50).
 *   - Finite lane, landmark-row technology (lemma_sweep, what v3 used):
 *     Theta(N1*) rows at 1.1432 CPU-s/row (v3: 3,149,013 rows ~ 1e3
 *     core-hours). This lane carries the exponential.
 *   - Finite lane, full-window continuum technology (tier-2 chirp,
 *     imp-95214/95229, the 0.14-row Gate-2 pricing): 21.1 CPU-days for
 *     window 1 (cell+reconstruction floor 14.27 CPU-days). The margins
 *     relax with N (window 1 anchors the per-x-unit maximum), but window
 *     x-width GROWS like 8 pi N, so the family total sits between
 *     Omega(N1*) and O(N1*^2) window-1-priced units - the technology
 *     changes the PREFACTOR (a 1.59e6x spread per unit: 21.1 CPU-days vs
 *     1.14 CPU-s), never the exponent.
 *
 * (3) THE DIAGONAL COST CURVE AND THE SUB-EXPONENTIAL QUESTION.
 * On a complete row at value U = t + y^2/2 the optimal split (minimizing
 * the calibrated lane size) is y_opt(U) = 2c0 - sqrt(4c0^2 - 2U) ~ U/(2c0),
 * giving ln rows_min(U) ~ 2c0/U - 1/(2c0) + L0, i.e.
 *   rows_min(U) ~ 2.14 * exp(2.4437/U).
 * Within the architecture the SC3 floor gives the unconditional version:
 * rows(U) >= exp(2/U - 2) for every admissible (t, y) with t + y^2/2 = U
 * (since t <= U and sqrt(1-2t) >= 1-2t). CONSEQUENCE: there is NO
 * subsequence t_k -> 0 along which complete-row cost stays sub-exponential
 * in 1/U_k - the total cost of any diagonal family is dominated by its
 * last row at exp(2/U - 2) or worse. Route VII under the current
 * mechanisms is therefore COMPUTE-BLOCKED: this is a citable no-go, "the
 * diagonal family is compute-blocked below U ~ 0.14-0.15 (t ~ 0.137)",
 * and reaching Lambda <= 0 through it REQUIRES A NEW MECHANISM. What the
 * new mechanism must change: the coupling sigma - 1/2 = (t/2) ln N, i.e.
 * a tail argument whose abscissa gain is not purchased by the heat lift
 * t ln N (so its cutoff is polynomial in 1/t). That is arithmetic input,
 * not softer analysis - consistent with the flow-blindness no-go (no soft
 * hypothesis proves RH) and with the T3<->zero-free-strip dictionary:
 * as t -> 0 the heat mollification vanishes and the tail problem
 * degenerates to unmollified zero-free control on sigma near 1/2 + y/2.
 *
 * (4) THE VERIFIED-HEIGHT WALL. Verified zeros enter ONLY through the
 * seam anchor: X <= 2*TPT (X/2 = 3,000,000,092,913.5 <= TPT =
 * 3,000,175,332,800, headroom 5.8e-5 relative - the anchor is already
 * pinned at the ceiling), N_seam = sqrt(X/(4 pi)) = 690,988, and the lane
 * is N1*(t,y) - N_seam rows. Height and compute are interchangeable
 * currencies inside one logarithm:
 *   t_min(y; TPT, R) = (2c0 - y) / ( ln( sqrt(TPT/(2 pi)) + R ) - L0 ).
 * Erasing the 0.1399 row's lane by height alone needs TPT >= 2 pi N1*^2
 * = 3.05e17 (1.02e5x current). Raising TPT to 1e18 (3.3e5x) with the same
 * K2-scale compute moves the floor only t: 0.1367 -> 0.1214 (U: 0.150 ->
 * 0.135). The PT-floor audit's "only lever is verified height" therefore
 * re-binds along Route VII logarithmically: every halving of t squares
 * the required height*compute product.
 *
 * HONEST VERDICT (frozen below): under current mechanisms the reachable
 * floor of the entire quantitative program is U ~ 0.150 (t ~ 0.137) at
 * the certified-adjacent slab bottom y = 0.165, or U ~ 0.145 at the
 * calibration-extrapolated optimal y ~ 0.059 (unpriced K3 slab risk).
 * Everything below is compute-blocked; Lambda <= 0 via Route VII needs a
 * new tail mechanism. All rows here are CONDITIONAL-frontier objects;
 * nothing moves the rigorous Lambda <= 0.2. NO QED.
 */

import {
  PROBE_SETUP,
  N1_STAR_RESULT,
  IMP95206_TAIL_REPRICING,
} from './imp-95206-t-p1-tail-repricing.js';
import {
  COORDS_01399,
  REFERENCE_CLOSURE_01787854,
} from './imp-95201-01399-certification-campaign.js';

// ── the two Arb-measured calibration points (frozen literals, cross-tied) ────
export const MEASURED_POINTS = Object.freeze([
  Object.freeze({
    key: 'v3_01787854',
    t: 129 / 800, // 0.16125
    y: Math.sqrt(87677 / 2500000), // 0.187272 (half-strip bottom)
    n1: 3840000, // sealed v3 cutoff; slack 1.735e-4 => within a hair of minimal
    lnN1: Math.log(3840000),
    thresholdCombo: (129 / 800 / 2) * Math.log(3840000) + Math.sqrt(87677 / 2500000) / 2, // 1.31599
    source: 'review-01787854-v3 (imp-95201 REFERENCE_CLOSURE literals)',
  }),
  Object.freeze({
    key: 'probe_01399',
    t: 10103 / 80000, // 0.1262875
    y: 33 / 200, // 0.165
    n1: 220495706, // imp-95206 exact boundary (320 + 512 bits)
    lnN1: Math.log(220495706),
    thresholdCombo: (10103 / 80000 / 2) * Math.log(220495706) + 33 / 200 / 2, // 1.29558
    source: 'imp-95206 N1_STAR_RESULT',
  }),
]);

// ── calibrated scaling law: ln N1*(t, y) = (2 c0 - y)/t + L0 ─────────────────
const P_A = MEASURED_POINTS[0];
const P_B = MEASURED_POINTS[1];
const L0 = (P_A.t * P_A.lnN1 - P_B.t * P_B.lnN1 + P_A.y - P_B.y) / (P_A.t - P_B.t);
const C0 = (P_A.t / 2) * (P_A.lnN1 - L0) + P_A.y / 2;

export function lnN1Star(t, y) {
  return (2 * C0 - y) / t + L0;
}
export function n1Star(t, y) {
  return Math.exp(lnN1Star(t, y));
}
// SC3 structural floor internal to the endpoint-cap architecture:
// sigma2 > 1 on the extended hull (top beta* = sqrt(1-2t)) forces
// (t/2) ln N1* > 1/2 + beta*/2 (up to delta_hat, kappa_hat > 0).
export function sc3FloorLnN1(t) {
  return (1 + Math.sqrt(1 - 2 * t)) / t;
}

export const SCALING_LAW = Object.freeze({
  form: 'ln N1*(t, y) = (2*c0 - y)/t + L0  (exponential in 1/t; NOT polynomial)',
  c0: C0, // 1.2218525 (effective closing threshold sigma_c - 1/2 ~ c0 net of y/2)
  L0, // 1.1676005 (absorbed delta_hat/kappa_hat + G-channel offset)
  derivation:
    'verify_tail_arb.c: N enters D = P + TR + OV + Mmax*AB only through sigma1/2 = ' +
    '1/2 + (t/2) ln N - delta_hat [- kappa_hat] +/- y/2 and G ~ N^{-y}; closing D < 1 ' +
    'requires (t/2) ln N1* + y/2 to clear an architecture-fixed threshold, and the SC3 gate ' +
    '(sigma > 1 on the extended hull with top sqrt(1-2t)) forces ln N1* > (1 + sqrt(1-2t))/t ' +
    'unconditionally within the architecture',
  thresholdComboDriftPct: 1.6, // 1.31599 vs 1.29558 across a 57x change in N1*
  localPowerLawExponent:
    (P_B.lnN1 - P_A.lnN1) / (Math.log(1 / P_B.t) - Math.log(1 / P_A.t)), // 16.573
  powerLawVerdict:
    'a power-law fit needs local exponent 16.57 and RISING (the SC3 floor makes it unbounded ' +
    'as t falls) - the dependence is exponential in 1/t',
  consistencyChecks: Object.freeze([
    Object.freeze({
      what: 'four-gate 0.1758354 package (t = 129/800, y = 0.170795): chosen N* = 6e6',
      predictedMinimum: n1Star(129 / 800, Math.sqrt(2 * (0.1758354 - 129 / 800))), // 4.25e6
      consistent: 'chosen N* sits above the predicted minimum (upper-bound-shaped check, not a fit point)',
    }),
    Object.freeze({
      what: 'SC3 floor below both measured points',
      floorAtA: Math.exp(sc3FloorLnN1(P_A.t)), // 8.13e4 < 3.84e6
      floorAtB: Math.exp(sc3FloorLnN1(P_B.t)), // 2.58e6 < 2.20e8
    }),
  ]),
  prediction014Row: Object.freeze({
    t0: 24727519 / 200000000, // 0.123637595 (imp-95012 Gate-2 frozen row)
    y0: 0.1809,
    predictedN1Star: n1Star(24727519 / 200000000, 0.1809), // 2.854e8
    vsK2Line: n1Star(24727519 / 200000000, 0.1809) / 5.5e7, // 5.19x
    note:
      'FALSIFIABLE: the paper-contract 0.14 row tail, repriced in the verbatim endpoint-cap ' +
      'architecture, lands ~2.85e8 - above even the measured 0.1399 cutoff 2.20e8 (earlier t ' +
      'outweighs the higher y) and 5.2x the K2 economic line; a T-P1-style probe at ' +
      '(t0, y0) = (24727519/200000000, 1809/10000) decides it',
  }),
  caveats: Object.freeze([
    'two calibration points; both with the P1113 vector tuned at t = 129/800 (per-t mollifier re-optimization lowers c0 but keeps the (2c0 - y)/t form while closure runs through a sigma threshold with SC3 requiring sigma > 1)',
    'calibration range y in [0.165, 0.19]: the G ~ N^{-y} channel adds a second wall ln N1 >~ c/y as y -> 0 that this law does not include - small-y extrapolations UNDERSTATE cost',
    'the v3 point is an upper bound on its minimal cutoff (slack 1.735e-4, near-minimal)',
  ]),
});

// ── lane volume and per-unit prices (question 2) ─────────────────────────────
export const LANE_VOLUME = Object.freeze({
  slab: Object.freeze({
    windows: 1, // [X, X+1], fixed width; time extent [0, t*] shrinks as t falls
    prismCountByBottomEdge: Object.freeze([
      Object.freeze({ y: 0.1809, prisms: 883, status: 'v3 sealed' }),
      Object.freeze({ y: 0.165, prisms: '1e3-1e4 (imp-95201 T1 estimate)', status: 'unpriced' }),
      Object.freeze({ y: 'K3 eliminate', prisms: '~1e6 adaptive-march trend', status: 'eliminate line' }),
    ]),
    axis: 'the slab is the y-axis wall (bottom-edge margin), not the t-axis wall; y = 0 inadmissible (paper eq. 49-50)',
  }),
  landmarkRowLane: Object.freeze({
    rowsAtRow: 'N1*(t, y) - 690988',
    cpuSecondsPerRow: (1000 * 3600) / 3149013, // 1.14322 (v3: 3,149,013 rows ~ 1e3 core-hours)
    carries: 'the exponential; per-row cost measured ~constant across the v3 range',
  }),
  tier2WindowLane: Object.freeze({
    window1CpuDays: 21.1, // imp-95214 tier-2 chirp price (identical window-1 certificate)
    window1CellReconFloorCpuDays: 14.27, // imp-95229 (panel super-pass removed)
    marginsRelaxWithN:
      'window 1 anchors the per-x-unit maximum; but window x-width grows like 8*pi*N, so the ' +
      'family total sits between Omega(N1*) and O(N1*^2) window-1-priced units',
    prefactorSpreadVsLandmarkRow: (21.1 * 86400) / ((1000 * 3600) / 3149013), // 1.595e6
    conclusion:
      'lane technology moves the PREFACTOR by up to ~1.6e6x; the exponent (2c0 - y)/t is ' +
      'technology-independent within the architecture',
  }),
});

// ── the diagonal cost curve (question 3) ─────────────────────────────────────
export function yOptimal(U) {
  return 2 * C0 - Math.sqrt(4 * C0 * C0 - 2 * U);
}
export function rowsAtOptimalRow(U) {
  const y = yOptimal(U);
  const t = U - (y * y) / 2;
  return n1Star(t, y) - 690988;
}

const SEC_PER_ROW = (1000 * 3600) / 3149013;
function cpuDays(rows) {
  return (rows * SEC_PER_ROW) / 86400;
}

// frozen table: U, optimal split, lane rows, lane CPU-days (landmark-row price)
export const COST_CURVE = Object.freeze(
  [0.1787854, 0.1758354, 0.16, 0.15, 0.1448, 0.14, 0.13, 0.12, 0.1, 0.08, 0.05, 0.02].map((U) => {
    const y = yOptimal(U);
    const t = U - (y * y) / 2;
    const rows = n1Star(t, y) - 690988;
    return Object.freeze({
      U,
      yOpt: Number(y.toFixed(6)),
      tOpt: Number(t.toFixed(6)),
      rows: Number(rows.toExponential(6)),
      laneCpuDays: Number(cpuDays(rows).toExponential(6)),
      status:
        rows <= 5.5e7 ? 'inside K2 economic line' : rows <= 1e12 ? 'K2-dead (compute-blocked at project scale)' : 'unreachable (beyond any plausible budget)',
    });
  })
);

export const SUBEXPONENTIAL_VERDICT = Object.freeze({
  question: 'is there a subsequence t_k -> 0 with sub-exponential total row cost?',
  answer: 'NO - within the endpoint-cap architecture',
  architectureFloor:
    'rows(U) >= exp(2/U - 2) for every admissible (t, y) on the row (t <= U and the SC3 gate ' +
    'forces ln N1* > (1 + sqrt(1-2t))/t >= 2/t - 2); the total cost of any diagonal family is ' +
    'dominated by its last row',
  calibratedCurve: 'rows_min(U) ~ 2.14 * exp(2.4437/U) at the optimal split y_opt(U) ~ U/(2 c0)',
  budgetFloors: Object.freeze([
    // U_floor(R): the smallest complete-row value reachable with R lane rows (optimal split)
    Object.freeze({ rowBudget: 5.5e7, uFloor: 0.1448, note: 'K2 economic line (~730 CPU-days of lane)' }),
    Object.freeze({ rowBudget: 1e9, uFloor: 0.1236, note: '~13,000 CPU-days' }),
    Object.freeze({ rowBudget: 1e12, uFloor: 0.0916, note: '~36 CPU-millennia: already beyond the program' }),
    Object.freeze({ rowBudget: 1e15, uFloor: 0.0728, note: 'HPC-fantasy scale' }),
    Object.freeze({ rowBudget: 1e18, uFloor: 0.0604, note: 'planet scale for years' }),
    Object.freeze({ rowBudget: 1e24, uFloor: 0.045, note: 'cosmic; U = 0.045 still not near 0' }),
  ]),
  scalingSignature: 'each halving of U squares the row count (up to the e^{L0} prefactor)',
  newMechanismMustChange:
    'the coupling sigma - 1/2 = (t/2) ln N: a tail argument whose abscissa gain is not bought ' +
    'by the heat lift t ln N, so that the cutoff is polynomial in 1/t. As t -> 0 the heat ' +
    'mollification vanishes and the tail degenerates to unmollified zero-free control near ' +
    'sigma = 1/2 + y/2 - arithmetic input, per the flow-blindness no-go and the ' +
    'T3<->zero-free-strip dictionary',
  citableNoGo:
    'the diagonal t -> 0 family is compute-blocked below U ~ 0.14-0.15 under the endpoint-cap ' +
    '/ exact-convolution architecture; no subsequence of complete rows reaches Lambda <= 0 at ' +
    'sub-exponential cost without a new tail mechanism',
});

// ── the verified-height wall (question 4) ────────────────────────────────────
const TPT = 3000175332800; // verified zero height (free input, imp-95201)
const X_SEAM = 6000000185827; // slab right edge; X/2 <= TPT with 5.8e-5 headroom

export function tMin(y, tpt, rowBudget) {
  return (2 * C0 - y) / (Math.log(Math.sqrt(tpt / (2 * Math.PI)) + rowBudget) - L0);
}

export const VERIFIED_HEIGHT_WALL = Object.freeze({
  entryPoint:
    'verified zeros enter ONLY through the seam anchor: X <= 2*TPT (currently pinned at the ' +
    'ceiling, headroom 5.8e-5 relative), N_seam = sqrt(X/(4 pi)) = 690,988; the lane is ' +
    'N1*(t, y) - N_seam rows',
  tpt: TPT,
  xSeam: X_SEAM,
  nSeam: 690988,
  interchangeLaw:
    't_min(y; TPT, R) = (2 c0 - y) / ( ln( sqrt(TPT/(2 pi)) + R ) - L0 ): height and compute ' +
    'are interchangeable currencies inside one logarithm',
  eraseLaneByHeightAlone: Object.freeze({
    atRow: '0.1399 (t = 0.1262875)',
    tptNeeded: 2 * Math.PI * 220495706 * 220495706, // 3.055e17
    ratioToCurrent: (2 * Math.PI * 220495706 * 220495706) / TPT, // 1.018e5
  }),
  floors: Object.freeze([
    Object.freeze({
      tpt: TPT,
      rowBudget: 5.5e7,
      y: 0.165,
      tFloor: Number(tMin(0.165, TPT, 5.5e7).toFixed(6)), // 0.136714
      uFloor: Number((tMin(0.165, TPT, 5.5e7) + (0.165 * 0.165) / 2).toFixed(6)), // 0.150326
      note: 'current height + K2-scale compute, certified-adjacent slab bottom',
    }),
    Object.freeze({
      tpt: 1e18,
      rowBudget: 5.5e7,
      y: 0.165,
      tFloor: Number(tMin(0.165, 1e18, 5.5e7).toFixed(6)), // 0.121428
      uFloor: Number((tMin(0.165, 1e18, 5.5e7) + (0.165 * 0.165) / 2).toFixed(6)), // 0.135041
      note: '3.3e5x more verified height buys only U: 0.150 -> 0.135',
    }),
  ]),
  bindingStatement:
    'below U ~ 0.150 (t ~ 0.137) no finite certification proceeds at current verified height ' +
    'plus K2-scale compute; every halving of t squares the required height*compute product - ' +
    'the PT-floor audit wall (only lever = verified height) re-binds along Route VII ' +
    'logarithmically',
});

// ── the honest verdict (frozen) ──────────────────────────────────────────────
export const IMP95218_ROUTE7_COST_CURVE = Object.freeze({
  ticket: 'imp-95218-route7',
  title: 'Route VII diagonal t -> 0 family: complete-row cost curve and reachable floor',
  proofSection: 'paper section 10.7 / Theorem 11.1 / section 11 (fixed-t0 floor)',
  source:
    'verify_tail_arb.c contraction structure (a74738de); imp-95206 measured N1* boundary; ' +
    'imp-95201 row economics; imp-95012 Gate-2 0.14 contract; imp-95214/95229 tier-2 window ' +
    'price; pt-floor-sensitivity-audit (verified height binds)',
  grade: 'analysis',
  measuredPoints: MEASURED_POINTS,
  scalingLaw: SCALING_LAW,
  laneVolume: LANE_VOLUME,
  costCurve: COST_CURVE,
  subexponentialVerdict: SUBEXPONENTIAL_VERDICT,
  verifiedHeightWall: VERIFIED_HEIGHT_WALL,
  reachableFloor: Object.freeze({
    conservative: Object.freeze({ U: 0.150326, t: 0.136714, y: 0.165, basis: 'certified-adjacent slab bottom + K2-scale compute' }),
    stretch: Object.freeze({ U: 0.1448, t: 0.14144, y: 0.059, basis: 'calibration-extrapolated optimal split; K3 slab-margin risk at y ~ 0.059 UNPRICED' }),
  }),
  provesBound: false,
  isRigorous: false,
  movesRigorousBound: false,
  changesConditionalFrontier: false,
  verdict:
    'ANALYSIS: the Route VII complete-row cost curve is exponential in 1/t. Derived from the ' +
    'verify_tail_arb.c contraction structure (sigma = 1/2 + (t/2) ln N +/- y/2 must clear an ' +
    'architecture-fixed threshold; the SC3 gate alone forces ln N1* > (1 + sqrt(1-2t))/t) and ' +
    'calibrated on the two Arb-measured points ((t/2) ln N1* + y/2 constant to 1.6% across a ' +
    '57x change in N1*): ln N1*(t, y) = (2*1.221852 - y)/t + 1.1676. Complete rows at value U ' +
    'cost rows_min(U) ~ 2.14 e^{2.4437/U} >= e^{2/U - 2}; no subsequence t_k -> 0 has ' +
    'sub-exponential cost, so the diagonal family is compute-blocked below U ~ 0.14-0.15 ' +
    '(t ~ 0.137 at y = 0.165) and Lambda <= 0 via Route VII requires a NEW tail mechanism ' +
    '(cutoff polynomial in 1/t; the (t/2) ln N heat-lift coupling must be replaced by ' +
    'arithmetic input). Verified height enters only inside the same logarithm (t_min = ' +
    '(2c0 - y)/(ln(sqrt(TPT/2pi) + R) - L0)): erasing the 0.1399 lane by height alone needs ' +
    '1.02e5x more verified zeros, and 3.3e5x more height buys only U: 0.150 -> 0.135. ' +
    'Falsifiable side-prediction: the paper-contract 0.14 row tail reprices to N1* ~ 2.85e8 ' +
    'in this architecture (5.2x the K2 line - also economically dead verbatim). This module ' +
    'derives no bound and certifies nothing; all rows are conditional-frontier objects; ' +
    'NO QED; no refereed bound is changed.',
});

// ── assertions (self-executing; import-light; throw on violation) ────────────
export const IMP95218_ROUTE7_COST_CURVE_ASSERTIONS = [
  {
    id: 'imp95218r7-calibration-points-match-sources',
    description: 'the two calibration points equal the imp-95206/imp-95201 frozen literals',
    holds: () =>
      P_B.n1 === N1_STAR_RESULT.n1Star &&
      Math.abs(P_B.t - PROBE_SETUP.tStar.value) < 1e-15 &&
      Math.abs(P_B.y - PROBE_SETUP.yStar.value) < 1e-15 &&
      P_A.n1 === REFERENCE_CLOSURE_01787854.pieces[2].literals.N1 &&
      Math.abs(P_A.t - REFERENCE_CLOSURE_01787854.t0.value) < 1e-15 &&
      Math.abs(P_A.y - REFERENCE_CLOSURE_01787854.y0) < 1e-15,
  },
  {
    id: 'imp95218r7-law-reproduces-both-points-exactly',
    description: 'the two-parameter law interpolates both measured points (by construction) and c0/L0 match frozen decimals',
    holds: () =>
      Math.abs(lnN1Star(P_A.t, P_A.y) - P_A.lnN1) < 1e-10 &&
      Math.abs(lnN1Star(P_B.t, P_B.y) - P_B.lnN1) < 1e-10 &&
      Math.abs(C0 - 1.2218525) < 1e-6 &&
      Math.abs(L0 - 1.1676005) < 1e-6,
  },
  {
    id: 'imp95218r7-threshold-combo-near-constant',
    description: '(t/2) ln N1* + y/2 drifts < 1.6% across a > 50x change in N1* (the exponential-model confirmation)',
    holds: () =>
      Math.abs(P_A.thresholdCombo - ((P_A.t / 2) * P_A.lnN1 + P_A.y / 2)) < 1e-12 &&
      Math.abs(P_B.thresholdCombo - ((P_B.t / 2) * P_B.lnN1 + P_B.y / 2)) < 1e-12 &&
      Math.abs(P_A.thresholdCombo - P_B.thresholdCombo) / P_A.thresholdCombo < 0.016 &&
      P_B.n1 / P_A.n1 > 50,
  },
  {
    id: 'imp95218r7-sc3-floor-below-measurements',
    description: 'the SC3 structural floor exp((1+sqrt(1-2t))/t) sits below both measured cutoffs and exceeds exp(2/t - 2)',
    holds: () =>
      Math.exp(sc3FloorLnN1(P_A.t)) < P_A.n1 &&
      Math.exp(sc3FloorLnN1(P_B.t)) < P_B.n1 &&
      sc3FloorLnN1(P_A.t) > 2 / P_A.t - 2 &&
      sc3FloorLnN1(P_B.t) > 2 / P_B.t - 2,
  },
  {
    id: 'imp95218r7-not-polynomial',
    description: 'a power-law fit needs local exponent ~16.57; the exponential law explains both points with a near-constant threshold',
    holds: () =>
      Math.abs(SCALING_LAW.localPowerLawExponent - 16.573) < 0.01 &&
      SCALING_LAW.localPowerLawExponent > 10,
  },
  {
    id: 'imp95218r7-fourgate-consistency',
    description: 'the four-gate 0.1758354 chosen N* = 6e6 sits above the predicted minimum ~4.25e6 (upper-bound-shaped check)',
    holds: () => {
      const pred = SCALING_LAW.consistencyChecks[0].predictedMinimum;
      return pred > 4.2e6 && pred < 4.3e6 && pred < 6e6;
    },
  },
  {
    id: 'imp95218r7-014-contract-prediction',
    description: 'the 0.14 row (t0 = 0.123637595, y0 = 0.1809) reprices to ~2.85e8, above the measured 0.1399 cutoff and > 5x the K2 line',
    holds: () => {
      const p = SCALING_LAW.prediction014Row;
      return (
        Math.abs(p.t0 + (p.y0 * p.y0) / 2 - 0.14) < 1e-12 &&
        p.predictedN1Star > 2.8e8 &&
        p.predictedN1Star < 2.9e8 &&
        p.predictedN1Star > N1_STAR_RESULT.n1Star &&
        p.vsK2Line > 5 && p.vsK2Line < 5.5
      );
    },
  },
  {
    id: 'imp95218r7-cost-curve-monotone-and-anchored',
    description: 'lane rows increase monotonically as U falls; the K2 line is crossed between U = 0.15 and U = 0.14; U = 0.05 exceeds 1e21 rows',
    holds: () => {
      const rows = COST_CURVE.map((r) => r.rows);
      const monotone = rows.every((r, i) => i === 0 || r > rows[i - 1]);
      const u15 = COST_CURVE.find((r) => r.U === 0.15);
      const u14 = COST_CURVE.find((r) => r.U === 0.14);
      const u005 = COST_CURVE.find((r) => r.U === 0.05);
      return monotone && u15.rows < 5.5e7 && u14.rows > 5.5e7 && u005.rows > 1e21;
    },
  },
  {
    id: 'imp95218r7-halving-squares',
    description: 'the scaling signature: rows(U/2) ~ rows(U)^2 / e^{L0} within 20% over the optimal-y curve (small-U regime)',
    holds: () => {
      const U = 0.08;
      const a = rowsAtOptimalRow(U) + 690988;
      const b = rowsAtOptimalRow(U / 2) + 690988;
      const predicted = (a * a) / Math.exp(L0);
      return Math.abs(Math.log(b / predicted)) < Math.log(1.6); // within 60% in ratio (y_opt shift)
    },
  },
  {
    id: 'imp95218r7-budget-floors-recompute',
    description: 'each frozen U_floor(R) satisfies rows(U_floor) ~ R (bisection recomputation, 1% tolerance in ln)',
    holds: () =>
      SUBEXPONENTIAL_VERDICT.budgetFloors.every((f) => {
        let lo = 0.02, hi = 0.3;
        for (let i = 0; i < 100; i++) {
          const m = (lo + hi) / 2;
          if (rowsAtOptimalRow(m) > f.rowBudget) lo = m;
          else hi = m;
        }
        return Math.abs(lo - f.uFloor) < 5e-4;
      }),
  },
  {
    id: 'imp95218r7-seam-anchor-geometry',
    description: 'N_seam = sqrt(X/(4 pi)) rounds to 690988, X/2 <= TPT with < 1e-4 relative headroom, and sqrt(TPT/(2 pi)) ~ N_seam',
    holds: () =>
      Math.round(Math.sqrt(X_SEAM / (4 * Math.PI))) === 690988 &&
      X_SEAM / 2 <= TPT &&
      (TPT - X_SEAM / 2) / TPT < 1e-4 &&
      Math.abs(Math.sqrt(TPT / (2 * Math.PI)) - 690988) < 30 &&
      TPT === COORDS_01399.verifiedHeightTPT,
  },
  {
    id: 'imp95218r7-height-wall-arithmetic',
    description: 'erase-lane TPT = 2 pi N1*^2 ~ 1.02e5x current; t_min floors recompute from the interchange law',
    holds: () => {
      const w = VERIFIED_HEIGHT_WALL;
      return (
        Math.abs(w.eraseLaneByHeightAlone.ratioToCurrent - 1.018e5) / 1.018e5 < 5e-3 &&
        Math.abs(tMin(0.165, TPT, 5.5e7) - w.floors[0].tFloor) < 1e-5 &&
        Math.abs(tMin(0.165, 1e18, 5.5e7) - w.floors[1].tFloor) < 1e-5 &&
        w.floors[1].uFloor < w.floors[0].uFloor
      );
    },
  },
  {
    id: 'imp95218r7-lane-price-anchors',
    description: 'per-row price = 1e3 core-hours / 3,149,013 rows ~ 1.1432 s; tier-2 window-1 vs landmark-row prefactor spread ~1.59e6x; recon floor < total',
    holds: () =>
      Math.abs(LANE_VOLUME.landmarkRowLane.cpuSecondsPerRow - 1.14322) < 1e-4 &&
      Math.abs(LANE_VOLUME.tier2WindowLane.prefactorSpreadVsLandmarkRow - 1.5947e6) / 1.5947e6 < 1e-3 &&
      LANE_VOLUME.tier2WindowLane.window1CellReconFloorCpuDays < LANE_VOLUME.tier2WindowLane.window1CpuDays,
  },
  {
    id: 'imp95218r7-k2-cross-tie',
    description: 'the measured 0.1399 verdict (K2 fires) is consistent with the frozen curve: its row sits above the K2 line, and the reachable floor sits above it',
    holds: () =>
      IMP95206_TAIL_REPRICING.killVerdicts.K2.fires === true &&
      P_B.n1 > 5.5e7 &&
      IMP95218_ROUTE7_COST_CURVE.reachableFloor.conservative.U > 0.1399 &&
      IMP95218_ROUTE7_COST_CURVE.reachableFloor.stretch.U > 0.1399,
  },
  {
    id: 'imp95218r7-hygiene',
    description: 'grade analysis, no bound claimed, no QED, no refereed bound is changed, no-go language present, frontier unchanged',
    holds: () =>
      IMP95218_ROUTE7_COST_CURVE.grade === 'analysis' &&
      IMP95218_ROUTE7_COST_CURVE.provesBound === false &&
      IMP95218_ROUTE7_COST_CURVE.isRigorous === false &&
      IMP95218_ROUTE7_COST_CURVE.movesRigorousBound === false &&
      IMP95218_ROUTE7_COST_CURVE.changesConditionalFrontier === false &&
      /NO QED/.test(IMP95218_ROUTE7_COST_CURVE.verdict) &&
      /refereed bound is changed/i.test(IMP95218_ROUTE7_COST_CURVE.verdict) &&
      /NEW tail mechanism/.test(IMP95218_ROUTE7_COST_CURVE.verdict) &&
      /compute-blocked/.test(SUBEXPONENTIAL_VERDICT.citableNoGo),
  },
];

for (const a of IMP95218_ROUTE7_COST_CURVE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95218-route7-cost-curve assertion failed: ${a.id}`);
  }
}

export default IMP95218_ROUTE7_COST_CURVE;
