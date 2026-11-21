/**
 * @module imp-35195-horizon-front-mismatch-ratio
 *
 * imp-35195 (numerical, frontier-direction, MEASUREMENT ONLY): imp-35167 identified M5
 * (horizon-reaches-front) as the STRUCTURAL binding obstruction to a certified non-collision
 * g_min(t) > 0 along the whole backward Dyson trajectory: the imp-2563 certified non-collision
 * window T_minus(g, beta) = (1/(4 beta)) log(1 + beta g^2 / 2) ~ g^2/8 collapses far below the
 * O(1) collision front t_c(N). imp-35167 only illustrated this with a g = 1/N PROXY gap and a
 * t_front = 1 PROXY front. THIS module measures the mismatch on REAL inputs across small N:
 * the actual initial min-gap g_min(0, N) of the first N Riemann zero ordinates, an empirical
 * height-density beta(N) (RvM), and the established empirical collision front
 * t_c(N) ~ 0.0066 + 4.91/N. It quantifies the ratio T_minus / t_c(N) and its N-scaling.
 *
 * THE THREE MEASURED INPUTS (all real, none a bare proxy)
 * ------------------------------------------------------
 *   g_min(0, N)  = min_k ( gamma_{k+1} - gamma_k ), k < N, on the first N zero ordinates
 *                  (ZETA_ZEROS, the same light 870-zero list dyson-collision-lower-bound.js uses).
 *   beta(N)      = pi^2 / (3 l(T_N)^2), l(T) = 2 pi / log(T / 2 pi), the RvM local-density field
 *                  strength at the height T_N = gamma_N of the N-th zero (imp-2683 Observation 3,
 *                  the same estimator imp-mingap-beta-bound.js carries). Empirical, height-derived.
 *   t_c(N)       = 0.0066 + 4.91/N, the established OLS collision-front fit (dyson-collision-
 *                  lower-bound.js docstring; dyson-ladder-measured.js OLS line). O(1) intercept
 *                  0.0066 with a 4.91/N small-N inflation.
 *
 * WHAT THE MEASUREMENT FINDS (the honest, and slightly surprising, reading)
 * -----------------------------------------------------------------------
 * The M5 scoping predicts T_minus / t_c -> 0. On the ACCESSIBLE zero range that collapse is NOT
 * yet visible: across N = 5..870 the ratio stays O(1), ranging ~0.49..1.01 (it even crosses 1
 * near N = 100, where the density-beta T_minus marginally exceeds the OLS front). The reason is
 * that both scales are still O(1) here: g_min(0, N) has only fallen from ~2.5 (N=5) to ~0.22
 * (N=870), so g_min^2/8 is still comparable to the O(1) front.
 *
 * THE COLLAPSE IS ASYMPTOTIC, AND ITS ONSET IS AT THE EDGE OF THE ACCESSIBLE RANGE. The front
 * has a floor: t_c(N) -> 0.0066 as N -> infinity. So the ratio is governed by
 *
 *     T_minus / t_c(N)  ~  ( g_min(0, N)^2 / 8 ) / ( 0.0066 + 4.91/N ),
 *
 * which stays O(1) while g_min^2/8 >~ 0.0066, i.e. while g_min >~ sqrt(8 * 0.0066) = 0.2298, and
 * only then decays like g_min(0, N)^2. The accessible range REACHES that onset: g_min(0, 870) =
 * 0.2211 is just below the crossover 0.2298, and the N=870 ratio (~0.485) is the first to dip
 * below 1/2. Extending to the verified g_min(0, 1e4) = 0.0376985 (imp-2762 literal) drives the
 * ratio to ~0.025 -- a ~20x drop from the small-N O(1) plateau, purely from g_min shrinking
 * against the fixed 0.0066 front floor. So the M5 mismatch is real but ASYMPTOTIC: the certified
 * window is a WITNESS comparable to the front at accessible N and falls parametrically short only
 * once g_min drops well below ~0.23.
 *
 * MEASUREMENT ONLY. Confirms the imp-35167 M5 obstruction is asymptotic in character and locates
 * its onset (g_min ~ 0.23, N ~ 900) rather than it being visible across the whole accessible range.
 * Uses the imp-2563 T_minus closed form AS-IS; derives nothing new; the sandwich stays a valid
 * CONDITIONAL bracket; beta(N) is the RvM density MODEL, not a certified sup over the true backward
 * flow, and t_c(N) is an empirical OLS fit, so this changes NO bound and certifies nothing. I2/M5
 * stay OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-35167-g-min-non-collision-certificate-scope (named M5 the binding obstruction; parent)
 * @see imp-2563-min-gap-sandwich-theorem (T_minus closed form, used AS-IS)
 * @see imp-mingap-beta-bound (imp-2849; RvM density beta estimator, same as here)
 * @see dyson-collision-lower-bound (imp-325; the OLS front fit t_c ~ 0.0066 + 4.91/N)
 * @see imp-2762-tc-a1-trap-interval (verified g_min(1e4) = 0.0376985 asymptotic anchor)
 */

import { ZETA_ZEROS } from '../math/zeta.js';

// ---------------------------------------------------------------------------
// Inputs, all carried as light functions / literals (no heavy bundle import):
//   T_minus(g, beta) = (1/(4 beta)) log(1 + beta g^2/2)     imp-2563 certified window
//   beta_density(T)  = pi^2 / (3 l(T)^2), l(T) = 2 pi / log(T/2 pi)   RvM field strength
//   t_c(N)           = 0.0066 + 4.91/N                       OLS collision-front fit
// ---------------------------------------------------------------------------
function tMinus(g, beta) {
  return (1 / (4 * beta)) * Math.log(1 + (beta * g * g) / 2);
}
function meanSpacing(T) {
  return (2 * Math.PI) / Math.log(T / (2 * Math.PI));
}
function betaDensity(T) {
  const l = meanSpacing(T);
  return (Math.PI * Math.PI) / (3 * l * l);
}
const TC_INTERCEPT = 0.0066; // O(1) collision-front floor (OLS)
const TC_SLOPE = 4.91; // small-N inflation coefficient (OLS)
function tCollisionFit(N) {
  return TC_INTERCEPT + TC_SLOPE / N;
}

// Initial min-gap of the first N zero ordinates (real data; k < N).
function minGap(N) {
  let B = Infinity;
  for (let k = 0; k < N - 1; k++) {
    const g = ZETA_ZEROS[k + 1] - ZETA_ZEROS[k];
    if (g < B) B = g;
  }
  return B;
}

// The crossover gap below which g^2/8 falls under the O(1) front floor 0.0066.
const G_CROSSOVER = Math.sqrt(8 * TC_INTERCEPT); // ~0.2298

// ---------------------------------------------------------------------------
// The measurement ladder across small N (bounded by the 870-zero light list).
// ---------------------------------------------------------------------------
const N_LADDER = [5, 10, 20, 50, 100, 200, 500, 870];

const ROWS = N_LADDER.map((N) => {
  const g = minGap(N);
  const T = ZETA_ZEROS[N - 1]; // height of the N-th zero
  const beta = betaDensity(T);
  const Tm = tMinus(g, beta);
  const tc = tCollisionFit(N);
  const gate = beta * g * g; // must be < 2 for T_minus to be well-defined
  return {
    N,
    gMin: +g.toFixed(6),
    heightT: +T.toFixed(3),
    beta: +beta.toFixed(5),
    gate: +gate.toExponential(4),
    Tminus: +Tm.toExponential(4),
    tcFit: +tc.toExponential(4),
    ratio: +(Tm / tc).toExponential(4), // T_minus / t_c(N)
  };
});

// Accessible-range readings: the ratio stays O(1); the min-gap has only reached
// the crossover onset at the top rung.
const RATIOS = ROWS.map((r) => r.ratio);
const RATIO_MIN = Math.min(...RATIOS);
const RATIO_MAX = Math.max(...RATIOS);
const TOP = ROWS[ROWS.length - 1]; // N = 870
const ALL_GATE_OK = ROWS.every((r) => r.gate < 2);

// Empirical N-scaling of the ratio over the accessible range (log-log slope,
// first-to-last rung) -- a shallow slope, NOT the asymptotic collapse.
const F = ROWS[0];
const ACCESSIBLE_RATIO_SLOPE =
  (Math.log(TOP.ratio) - Math.log(F.ratio)) /
  (Math.log(TOP.N) - Math.log(F.N));

// Asymptotic anchor: the verified g_min(1e4) = 0.0376985 (imp-2762) against the
// front floor. Uses the leading T_minus ~ g^2/8 (exact to <1% since the gate is
// tiny here), showing the ~20x drop from the accessible O(1) plateau.
const G_MIN_1E4 = 0.0376985;
const N_ANCHOR = 1e4;
const TM_1E4_LEADING = (G_MIN_1E4 * G_MIN_1E4) / 8;
const TC_1E4 = tCollisionFit(N_ANCHOR);
const RATIO_1E4 = TM_1E4_LEADING / TC_1E4; // ~0.025

export const IMP35195_HORIZON_FRONT_MISMATCH_RATIO = {
  id: 'imp-35195',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-35167 M5 horizon-front mismatch ratio T_minus(g, beta) / t_c(N) across small ' +
    'N on REAL inputs -- the actual initial min-gap g_min(0, N) of the first N Riemann zero ' +
    'ordinates, an empirical RvM height-density beta(N), and the OLS collision front ' +
    't_c(N) ~ 0.0066 + 4.91/N -- to quantify how far the certified non-collision window falls short ' +
    'of the O(1) collision front and its N-scaling.',
  inputs: {
    gMin: 'g_min(0, N) = min adjacent gap of the first N zero ordinates (real ZETA_ZEROS)',
    beta: 'beta(N) = pi^2 / (3 l(T_N)^2), l(T) = 2 pi / log(T/2 pi) at height T_N = gamma_N (RvM, imp-2683 Obs 3)',
    tCollision: 't_c(N) = ' + TC_INTERCEPT + ' + ' + TC_SLOPE + '/N (OLS front fit; dyson-collision-lower-bound / dyson-ladder-measured)',
    tMinus: 'T_minus(g, beta) = (1/(4 beta)) log(1 + beta g^2/2) ~ g^2/8 (imp-2563 certified window, AS-IS)',
  },
  ladder: ROWS,
  accessibleRange: {
    Nrange: [N_LADDER[0], N_LADDER[N_LADDER.length - 1]],
    ratioMin: RATIO_MIN,
    ratioMax: RATIO_MAX,
    ratioSlopeLogLog: +ACCESSIBLE_RATIO_SLOPE.toFixed(4),
    allGateBelowTwo: ALL_GATE_OK,
    reading:
      'Across N = ' + N_LADDER[0] + '..' + N_LADDER[N_LADDER.length - 1] + ' the ratio T_minus/t_c ' +
      'stays O(1) (~' + RATIO_MIN.toFixed(3) + '..' + RATIO_MAX.toFixed(3) + '), even crossing 1 near ' +
      'N = 100. The M5 collapse is NOT yet visible on the accessible zero range: both g_min^2/8 and ' +
      't_c are still O(1) here. Log-log slope of the ratio is only ~' + ACCESSIBLE_RATIO_SLOPE.toFixed(3) + '.',
  },
  crossover: {
    gCrossover: +G_CROSSOVER.toFixed(6),
    statement:
      'The ratio stays O(1) while g_min^2/8 >~ t_c floor 0.0066, i.e. while g_min >~ sqrt(8*0.0066) = ' +
      G_CROSSOVER.toFixed(4) + ', then decays like g_min(0, N)^2. Onset is AT the edge of the accessible ' +
      'range: g_min(0, 870) = ' + TOP.gMin + ' is just below the crossover, and the N=870 ratio ' +
      '(~' + TOP.ratio.toFixed(3) + ') is the first to dip below 1/2.',
    topRung: { N: TOP.N, gMin: TOP.gMin, ratio: TOP.ratio },
  },
  asymptoticAnchor: {
    N: N_ANCHOR,
    gMin1e4: G_MIN_1E4,
    tMinusLeading: +TM_1E4_LEADING.toExponential(4),
    tcFit: +TC_1E4.toExponential(4),
    ratio: +RATIO_1E4.toExponential(4),
    dropFromAccessiblePlateau: +(RATIO_MAX / RATIO_1E4).toFixed(1),
    reading:
      'At the verified g_min(1e4) = ' + G_MIN_1E4 + ' (imp-2762) the ratio drops to ~' +
      RATIO_1E4.toFixed(4) + ', a ~' + (RATIO_MAX / RATIO_1E4).toFixed(0) + 'x fall from the small-N ' +
      'O(1) plateau -- entirely from g_min shrinking against the fixed 0.0066 front floor.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Measured the imp-35167 M5 horizon-front ' +
    'mismatch ratio T_minus(g, beta) / t_c(N) on REAL inputs -- g_min(0, N) from the first N zero ' +
    'ordinates, RvM density beta(N), OLS front t_c(N) = 0.0066 + 4.91/N. FINDING: across the ' +
    'accessible zero range N = 5..870 the ratio stays O(1) (~' + RATIO_MIN.toFixed(3) + '..' +
    RATIO_MAX.toFixed(3) + '), even crossing 1 near N = 100 -- so the M5 collapse is NOT visible ' +
    'across the accessible range: both g_min^2/8 and t_c are still O(1) there. The collapse is ' +
    'ASYMPTOTIC: t_c(N) -> 0.0066 (an O(1) floor) while T_minus ~ g_min(0, N)^2/8 -> 0, so the ratio ' +
    'stays O(1) only while g_min >~ sqrt(8*0.0066) = ' + G_CROSSOVER.toFixed(4) + ' and then decays ' +
    'like g_min^2. The accessible range REACHES that onset (g_min(0, 870) = ' + TOP.gMin + ' just ' +
    'below the crossover, ratio ~' + TOP.ratio.toFixed(3) + ' first below 1/2); extending to the ' +
    'verified g_min(1e4) = ' + G_MIN_1E4 + ' drops the ratio to ~' + RATIO_1E4.toFixed(4) + ', a ~' +
    (RATIO_MAX / RATIO_1E4).toFixed(0) + 'x fall. So the certified window is a WITNESS comparable to ' +
    'the front at accessible N and falls parametrically short only once g_min drops well below ~0.23. ' +
    'MEASUREMENT ONLY: uses the imp-2563 T_minus closed form AS-IS; beta(N) is the RvM density MODEL ' +
    '(not a certified sup) and t_c(N) is an empirical OLS fit, so this changes NO bound and certifies ' +
    'nothing; I2/M5 stay OPEN; the sandwich remains a valid CONDITIONAL bracket; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35167 (M5 binding obstruction; parent); imp-2563 (T_minus closed form, AS-IS); imp-2849 / ' +
    'imp-mingap-beta-bound (RvM density beta); imp-325 / dyson-collision-lower-bound (OLS front ' +
    't_c ~ 0.0066 + 4.91/N); imp-2762 (verified g_min(1e4) = 0.0376985); imp-486 (C_mb GUE-conditional).',
};

export const IMP35195_HORIZON_FRONT_MISMATCH_RATIO_ASSERTIONS = [
  {
    // T_minus is well-defined at every measured rung: the gate beta g^2 < 2 holds.
    id: 'imp35195-gate-holds-all-rungs',
    description: 'beta(N) g_min(0,N)^2 < 2 at every measured N, so the imp-2563 T_minus is well-defined',
    holds: () => ROWS.every((r) => r.gate > 0 && r.gate < 2),
  },
  {
    // Accessible-range finding: the ratio stays O(1) (no collapse visible on real zeros).
    id: 'imp35195-accessible-ratio-order-one',
    description: 'across N = 5..870 the mismatch ratio T_minus/t_c stays O(1) (in [0.4, 1.1]), not collapsing',
    holds: () => RATIO_MIN > 0.4 && RATIO_MAX < 1.1 && RATIO_MAX > 0.9,
  },
  {
    // The ratio is a shallow function of N over the accessible range (not the asymptotic slope).
    id: 'imp35195-accessible-slope-shallow',
    description: 'the accessible log-log ratio slope is shallow (|slope| < 0.2), confirming O(1) not power-law collapse here',
    holds: () => Math.abs(ACCESSIBLE_RATIO_SLOPE) < 0.2,
  },
  {
    // Crossover onset is real and sits at the edge of the accessible range.
    id: 'imp35195-crossover-onset-at-top-rung',
    description: 'g_min(0,870) sits just below the crossover sqrt(8*0.0066)=0.2298 and its ratio is the first below 1/2',
    holds: () =>
      TOP.gMin < G_CROSSOVER && TOP.ratio < 0.5 && TOP.gMin > 0.2 &&
      Math.abs(G_CROSSOVER - 0.229783) < 1e-5,
  },
  {
    // Asymptotic anchor: the verified g_min(1e4) drops the ratio ~20x below the plateau.
    id: 'imp35195-asymptotic-anchor-collapses',
    description: 'at the verified g_min(1e4)=0.0376985 the ratio falls to ~0.025, a ~20x drop from the accessible O(1) plateau',
    holds: () => RATIO_1E4 > 0.02 && RATIO_1E4 < 0.03 && RATIO_MAX / RATIO_1E4 > 15,
  },
  {
    // Honesty gate: measurement only, no QED, sandwich untouched, no refereed bound is changed.
    id: 'imp35195-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, changes no bound, M5 stays OPEN, no refereed bound is changed',
    holds: () =>
      IMP35195_HORIZON_FRONT_MISMATCH_RATIO.isRigorous === false &&
      /NO QED/.test(IMP35195_HORIZON_FRONT_MISMATCH_RATIO.verdict) &&
      /changes NO bound/.test(IMP35195_HORIZON_FRONT_MISMATCH_RATIO.verdict) &&
      /M5 stay OPEN/.test(IMP35195_HORIZON_FRONT_MISMATCH_RATIO.verdict) &&
      /refereed bound is changed/i.test(IMP35195_HORIZON_FRONT_MISMATCH_RATIO.verdict),
  },
];

for (const a of IMP35195_HORIZON_FRONT_MISMATCH_RATIO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35195-horizon-front-mismatch-ratio assertion failed: ${a.id}`);
  }
}
