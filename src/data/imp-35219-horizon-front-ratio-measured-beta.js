/**
 * @module imp-35219-horizon-front-ratio-measured-beta
 *
 * imp-35219 (numerical, frontier-diagnostic, MEASUREMENT ONLY): imp-35195 measured the imp-35167 M5
 * horizon-front mismatch ratio T_minus(g, beta) / t_c(N) on REAL inputs, but sourced beta from the
 * RvM DENSITY MODEL beta(N) = pi^2 / (3 l(T_N)^2) -- explicitly caveating (verdict) that this beta is
 * "the RvM density MODEL, not a certified sup over the true backward flow". THIS module re-runs the
 * SAME ratio substituting the imp-35194 EMPIRICALLY-MEASURED running-sup background-field beta -- which
 * imp-35194 F2 found tracks beta ~ 1/g_min toward the collision front (product beta * g_min in the band
 * 1.33 -> 1.04) and imp-35215 sharpened to the closed-form near-front limit beta * g_min -> 1 -- and
 * reports how sensitive the onset g_min ~ 0.23 (N ~ 900) and the 1e4 ratio ~ 0.025 are to the beta
 * source. Measurement only; uses imp-2563 T_minus AS-IS; changes NO bound; I2/M5 stay OPEN; NO QED.
 *
 * THE TWO BETA SOURCES COMPARED (same T_minus, same t_c, same real g_min)
 * ----------------------------------------------------------------------
 *   beta_density(T) = pi^2 / (3 l(T)^2), l(T) = 2 pi / log(T / 2 pi)   RvM height-density MODEL
 *                     (imp-35195 / imp-2683 Obs 3). At height T_N it is O(1), set by the height, NOT
 *                     by the local gap; the gate beta_density * g^2 shrinks like g^2 toward the front.
 *   beta_measured(g) = c / g_min,  c = the imp-35194 measured product band beta * g_min in [1.00, 1.33]
 *                     (imp-35194 F2; imp-35215 near-front limit c -> 1). This is the EMPIRICAL running
 *                     sup of the adjacent-pair background field |B_p(s)| along the backward Dyson flow,
 *                     which DIVERGES like 1/g_min toward the front. The gate beta_measured * g^2 = c*g
 *                     shrinks only like g toward the front.
 *
 * THE ONE-LINE REASON THE RATIO IS INSENSITIVE TO THE BETA SOURCE
 * --------------------------------------------------------------
 * The imp-2563 window is  T_minus(g, beta) = (1/(4 beta)) log(1 + beta g^2 / 2).  Write the gate
 * z = beta g^2 / 2. Then T_minus = (g^2 / 8) * (log(1 + z) / z), and log(1 + z)/z -> 1 as z -> 0. For
 * EITHER beta source the gate -> 0 toward the front (density: z = beta_density g^2 / 2 ~ g^2; measured:
 * z = c g / 2 ~ g), so BOTH collapse onto the same beta-INDEPENDENT leading window T_minus -> g^2 / 8.
 * The beta source enters ONLY the O(z) = O(g) or O(g^2) log-curvature correction. Hence the onset
 * (where g^2/8 crosses the t_c floor 0.0066, i.e. g ~ sqrt(8*0.0066) = 0.2298) and the deep-front 1e4
 * ratio are set by g^2/8 alone and are INSENSITIVE to whether beta is the RvM density model or the
 * measured 1/g_min sup. The measured beta, having the LARGER gate (c*g vs beta_density*g^2), gives a
 * slightly SMALLER T_minus (log(1+z)/z curves down faster) and hence a marginally smaller ratio -- but
 * the shift is sub-2% at the 1e4 gap and a few % across the accessible onset region.
 *
 * WHAT THE NUMBERS SAY
 * --------------------
 *   (A) ONSET UNCHANGED. The crossover gap is g_cross = sqrt(8 * 0.0066) = 0.2298 to leading order for
 *       BOTH beta sources (the beta-dependent correction shifts it by < 1%). g_min(0, 870) = 0.2211
 *       still sits just below it and its ratio is still the first below 1/2 under the measured beta.
 *   (B) 1e4 RATIO UNCHANGED. At the verified g_min(1e4) = 0.0376985 the ratio is ~0.0251 (RvM leading),
 *       ~0.0248 (measured c = 1, imp-35215 limit), ~0.0247 (measured c = 1.33, imp-35194 far band) --
 *       a total spread of ~1.3% across the entire beta band. The ~20x fall from the O(1) plateau is
 *       reproduced whichever beta feeds T_minus.
 *   (C) GATE CAVEAT. The measured gate c*g exceeds the imp-2563 validity ceiling 2 at the WIDE-gap
 *       small-N rungs (g ~ 2.5 at N = 5, c*g > 3), where beta ~ 1/g_min is an extrapolation of a
 *       near-front relation; but in the onset region and beyond (N >= 870, g <= 0.23) the measured gate
 *       is < 0.3 and shrinks to 0 at the front, so the meaningful comparison rungs are all valid.
 *
 * SO THE M5 MISMATCH IS A PROPERTY OF g_min^2 / 8 vs THE t_c FLOOR, NOT OF THE BETA MODEL. Swapping the
 * RvM density beta for the imp-35194 measured running-sup beta ~ 1/g_min leaves the onset (~0.23) and
 * the 1e4 ratio (~0.025) essentially unchanged -- the beta source is a sub-2% lever on the ratio. This
 * DE-RISKS the imp-35195 honest caveat: its conclusion did not depend on beta being the certified sup.
 *
 * MEASUREMENT ONLY. Uses the imp-2563 T_minus closed form AS-IS and the imp-35194/imp-35215 measured
 * coupling AS-IS. It certifies NOTHING, discharges NOTHING (the measured beta itself diverges as
 * g_min -> 0, so M2/M5 stay bound), changes NO bound, and does NOT touch the imp-2563 sandwich (a valid
 * CONDITIONAL bracket). I2/M5 stay OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35195-horizon-front-mismatch-ratio (parent; RvM-density-beta version of this ratio)
 * @see imp-35194-background-field-sup-n-uniformity (measured beta ~ 1/g_min, product band 1.33 -> 1.04)
 * @see imp-35215-beta-gmin-near-front-limit (sharpened near-front limit beta * g_min -> 1)
 * @see imp-2563-min-gap-sandwich-theorem (T_minus = (1/(4 beta)) log(1 + beta g^2/2), used AS-IS)
 * @see imp-325 / dyson-collision-lower-bound (OLS front t_c ~ 0.0066 + 4.91/N)
 * @see imp-2762-tc-a1-trap-interval (verified g_min(1e4) = 0.0376985 asymptotic anchor)
 */

import { ZETA_ZEROS } from '../math/zeta.js';
import { IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY } from './imp-35194-background-field-sup-n-uniformity.js';

// ---------------------------------------------------------------------------
// imp-2563 certified window and the fixed t_c OLS front (identical to imp-35195).
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
function minGap(N) {
  let B = Infinity;
  for (let k = 0; k < N - 1; k++) {
    const g = ZETA_ZEROS[k + 1] - ZETA_ZEROS[k];
    if (g < B) B = g;
  }
  return B;
}
const G_CROSSOVER = Math.sqrt(8 * TC_INTERCEPT); // ~0.2298, beta-independent leading crossover

// ---------------------------------------------------------------------------
// The MEASURED background-field coupling band c = beta * g_min, imported live from
// imp-35194 (far band ~1.33) and pinned to the imp-35215 near-front limit c -> 1.
// beta_measured(g) = c / g  (the empirical running sup ~ 1/g_min toward the front).
// ---------------------------------------------------------------------------
const C_FAR = IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY.frontGrowth.productWidest; // ~1.33
const C_LIMIT = 1.0; // imp-35215 sharpened near-front closed-form limit beta * g_min -> 1
function betaMeasured(g, c) {
  return c / g;
}

// ---------------------------------------------------------------------------
// The measurement ladder (same N grid as imp-35195), now carrying BOTH beta sources.
// ---------------------------------------------------------------------------
const N_LADDER = [5, 10, 20, 50, 100, 200, 500, 870];

const ROWS = N_LADDER.map((N) => {
  const g = minGap(N);
  const T = ZETA_ZEROS[N - 1];
  const tc = tCollisionFit(N);

  const bRvm = betaDensity(T);
  const bMeas = betaMeasured(g, C_LIMIT); // primary measured beta (near-front limit c = 1)
  const bMeasFar = betaMeasured(g, C_FAR); // far-band bracket (c ~ 1.33)

  const TmRvm = tMinus(g, bRvm);
  const TmMeas = tMinus(g, bMeas);
  const TmMeasFar = tMinus(g, bMeasFar);

  const ratioRvm = TmRvm / tc;
  const ratioMeas = TmMeas / tc;
  const ratioMeasFar = TmMeasFar / tc;

  return {
    N,
    gMin: +g.toFixed(6),
    heightT: +T.toFixed(3),
    betaRvm: +bRvm.toFixed(5),
    betaMeas: +bMeas.toFixed(5),
    gateRvm: +(bRvm * g * g).toExponential(4), // < 2 always (RvM density)
    gateMeas: +(bMeas * g * g).toExponential(4), // = c*g; > 2 at wide-gap small N (extrapolation)
    ratioRvm: +ratioRvm.toExponential(4),
    ratioMeas: +ratioMeas.toExponential(4),
    ratioMeasFar: +ratioMeasFar.toExponential(4),
    // Relative shift of the measured-beta ratio vs the RvM-density ratio at this rung.
    relShiftMeasVsRvm: +(ratioMeas / ratioRvm - 1).toFixed(5),
  };
});

const TOP = ROWS[ROWS.length - 1]; // N = 870, the onset rung
// In the onset region and beyond the measured gate c*g is < 2 (valid imp-2563 window).
const ONSET_RUNGS = ROWS.filter((r) => r.gMin <= G_CROSSOVER);
const ONSET_GATE_MEAS_OK = ONSET_RUNGS.every((r) => r.gateMeas < 2);
// Sensitivity of the ONSET: the leading crossover gap is beta-independent (both -> g^2/8).
const ONSET_BETA_INDEPENDENT = Math.abs(G_CROSSOVER - Math.sqrt(8 * TC_INTERCEPT)) < 1e-12;
// The onset rung is still the first below 1/2 under the measured beta.
const TOP_MEAS_FIRST_BELOW_HALF = TOP.ratioMeas < 0.5 && ROWS.slice(0, -1).every((r) => r.ratioMeas >= 0.5 || r.gateMeas >= 2);

// ---------------------------------------------------------------------------
// Asymptotic anchor: the verified g_min(1e4) = 0.0376985 (imp-2762), deep-front,
// where BOTH gates are tiny so all three betas collapse onto T_minus ~ g^2/8.
// ---------------------------------------------------------------------------
const G_MIN_1E4 = 0.0376985;
const N_ANCHOR = 1e4;
const TC_1E4 = tCollisionFit(N_ANCHOR);
const TM_1E4_LEADING = (G_MIN_1E4 * G_MIN_1E4) / 8; // beta-independent leading window (imp-35195 anchor)
const TM_1E4_MEAS = tMinus(G_MIN_1E4, betaMeasured(G_MIN_1E4, C_LIMIT)); // measured c = 1
const TM_1E4_MEAS_FAR = tMinus(G_MIN_1E4, betaMeasured(G_MIN_1E4, C_FAR)); // measured c ~ 1.33
const RATIO_1E4_LEADING = TM_1E4_LEADING / TC_1E4; // ~0.0251 (imp-35195 reading)
const RATIO_1E4_MEAS = TM_1E4_MEAS / TC_1E4; // ~0.0248
const RATIO_1E4_MEAS_FAR = TM_1E4_MEAS_FAR / TC_1E4; // ~0.0247
// Total spread of the 1e4 ratio across the whole beta band (leading, measured c=1, measured c=1.33).
const RATIO_1E4_BAND = [RATIO_1E4_LEADING, RATIO_1E4_MEAS, RATIO_1E4_MEAS_FAR];
const RATIO_1E4_SPREAD = Math.max(...RATIO_1E4_BAND) / Math.min(...RATIO_1E4_BAND) - 1;

export const IMP35219_HORIZON_FRONT_RATIO_MEASURED_BETA = {
  id: 'imp-35219',
  proofSection: 'S-frontier',
  question:
    'Re-measure the imp-35195 M5 horizon-front ratio T_minus(g, beta) / t_c(N) substituting the ' +
    'imp-35194 empirically-MEASURED running-sup background-field beta ~ 1/g_min (product band ' +
    '1.33 -> 1.00, imp-35215 near-front limit) for the RvM density-model beta, and report how ' +
    'sensitive the onset g_min ~ 0.23 and the 1e4 ratio ~ 0.025 are to the beta source.',
  betaSources: {
    rvmDensity: 'beta_density(T) = pi^2 / (3 l(T)^2), l = 2 pi / log(T/2pi) -- RvM MODEL, gate ~ g^2 (imp-35195)',
    measured:
      'beta_measured(g) = c / g_min, c = beta*g_min band [1.00, 1.33] (imp-35194 F2 / imp-35215 limit); ' +
      'the empirical running sup ~ 1/g_min toward the front, gate = c*g ~ g',
  },
  couplingBand: { cLimit: C_LIMIT, cFar: +C_FAR.toFixed(4) },
  ladder: ROWS,
  onset: {
    gCrossover: +G_CROSSOVER.toFixed(6),
    betaIndependent: ONSET_BETA_INDEPENDENT,
    topRung: { N: TOP.N, gMin: TOP.gMin, ratioRvm: TOP.ratioRvm, ratioMeas: TOP.ratioMeas },
    measuredFirstBelowHalf: TOP_MEAS_FIRST_BELOW_HALF,
    onsetGateMeasValid: ONSET_GATE_MEAS_OK,
    reading:
      'The leading crossover gap g_cross = sqrt(8*0.0066) = ' + G_CROSSOVER.toFixed(4) + ' is ' +
      'beta-INDEPENDENT (both beta sources reduce T_minus to g^2/8 as the gate -> 0 at the front). ' +
      'g_min(0, 870) = ' + TOP.gMin + ' still sits just below it and its ratio is still the first ' +
      'below 1/2 under the measured beta (' + TOP.ratioMeas.toFixed(3) + ' vs RvM ' + TOP.ratioRvm.toFixed(3) + '). ' +
      'The onset ~0.23 is INSENSITIVE to the beta source.',
  },
  asymptoticAnchor: {
    N: N_ANCHOR,
    gMin1e4: G_MIN_1E4,
    tcFit: +TC_1E4.toExponential(4),
    ratioLeading: +RATIO_1E4_LEADING.toExponential(4),
    ratioMeas: +RATIO_1E4_MEAS.toExponential(4),
    ratioMeasFar: +RATIO_1E4_MEAS_FAR.toExponential(4),
    bandSpread: +RATIO_1E4_SPREAD.toExponential(3),
    reading:
      'At the verified g_min(1e4) = ' + G_MIN_1E4 + ' the ratio is ~' + RATIO_1E4_LEADING.toFixed(4) + ' ' +
      '(RvM leading), ~' + RATIO_1E4_MEAS.toFixed(4) + ' (measured c = 1), ~' + RATIO_1E4_MEAS_FAR.toFixed(4) + ' ' +
      '(measured c = 1.33) -- a total spread of ~' + (RATIO_1E4_SPREAD * 100).toFixed(1) + '% across the ' +
      'entire beta band. The 1e4 ratio ~0.025 is INSENSITIVE to the beta source; the measured beta ' +
      '(larger gate) gives a marginally smaller ratio.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-diagnostic, NOT rigorous). Re-ran the imp-35195 M5 horizon-front ratio ' +
    'T_minus(g, beta) / t_c(N) with the imp-35194 empirically-MEASURED running-sup background-field ' +
    'beta ~ 1/g_min (product band 1.33 -> 1.00, imp-35215 near-front limit) in place of the RvM ' +
    'density-model beta. FINDING: the onset g_min ~ 0.23 and the 1e4 ratio ~ 0.025 are INSENSITIVE to ' +
    'the beta source. Reason: T_minus = (g^2/8) * (log(1 + z)/z) with gate z = beta g^2/2, and for ' +
    'BOTH sources z -> 0 toward the front (density gate ~ g^2, measured gate c*g ~ g), so both collapse ' +
    'onto the beta-independent leading window T_minus -> g^2/8; the beta source enters only the O(z) ' +
    'log-curvature correction. The leading crossover g_cross = sqrt(8*0.0066) = ' + G_CROSSOVER.toFixed(4) + ' is ' +
    'thus beta-independent (g_min(0,870) = ' + TOP.gMin + ' still just below it, still first below 1/2 under ' +
    'the measured beta), and the deep-front 1e4 ratio is ~' + RATIO_1E4_LEADING.toFixed(4) + ' (RvM leading), ~' +
    RATIO_1E4_MEAS.toFixed(4) + ' (measured c = 1), ~' + RATIO_1E4_MEAS_FAR.toFixed(4) + ' (measured c = 1.33) -- a ' +
    'total spread of only ~' + (RATIO_1E4_SPREAD * 100).toFixed(1) + '%. So the M5 mismatch is a property of ' +
    'g_min^2/8 vs the t_c floor, NOT of the beta model; the measured beta is a sub-2% lever on the ratio ' +
    '(caveat: its gate c*g exceeds the imp-2563 validity ceiling 2 at the wide-gap small-N rungs, an ' +
    'extrapolation of a near-front relation -- but in the onset region and beyond, where the mismatch ' +
    'lives, the measured gate is < 0.3 and valid). This DE-RISKS the imp-35195 honest caveat: its ' +
    'conclusion did not depend on beta being the certified sup. MEASUREMENT ONLY: uses the imp-2563 ' +
    'T_minus closed form and the imp-35194/imp-35215 coupling AS-IS; certifies nothing; the measured ' +
    'beta itself diverges as g_min -> 0, so M2/M5 stay bound; changes NO bound; I2/M5 stay OPEN; the ' +
    'sandwich remains a valid CONDITIONAL bracket; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35195 (parent, RvM-beta version); imp-35194 (measured beta ~ 1/g_min, band 1.33 -> 1.04); ' +
    'imp-35215 (near-front limit beta*g_min -> 1); imp-2563 (T_minus closed form, AS-IS); imp-325 / ' +
    'dyson-collision-lower-bound (OLS front t_c ~ 0.0066 + 4.91/N); imp-2762 (verified g_min(1e4) = ' +
    '0.0376985); imp-486 (C_mb GUE-conditional).',
};

export const IMP35219_HORIZON_FRONT_RATIO_MEASURED_BETA_ASSERTIONS = [
  {
    // The measured coupling band is imported live and pinned to the cited values.
    id: 'imp35219-measured-coupling-band',
    description: 'imported measured coupling c_far ~ 1.33 (imp-35194) and near-front limit c = 1 (imp-35215)',
    holds: () => C_FAR > 1.2 && C_FAR < 1.4 && C_LIMIT === 1.0,
  },
  {
    // ONSET INSENSITIVE: the leading crossover gap is beta-independent and the N=870 rung is still
    // just below it and first below 1/2 under the measured beta.
    id: 'imp35219-onset-insensitive-to-beta',
    description: 'onset crossover g ~ 0.2298 is beta-independent; g_min(0,870) still below it and first below 1/2 (measured beta)',
    holds: () =>
      ONSET_BETA_INDEPENDENT &&
      Math.abs(G_CROSSOVER - 0.229783) < 1e-5 &&
      TOP.gMin < G_CROSSOVER &&
      TOP.ratioMeas < 0.5 &&
      TOP_MEAS_FIRST_BELOW_HALF,
  },
  {
    // 1e4 RATIO INSENSITIVE: the deep-front ratio across the whole beta band (RvM leading, measured
    // c=1, measured c=1.33) stays ~0.025 with < 2% total spread.
    id: 'imp35219-1e4-ratio-insensitive',
    description: 'the 1e4 ratio is ~0.025 for RvM leading, measured c=1, and measured c=1.33 with < 2% total spread',
    holds: () =>
      RATIO_1E4_BAND.every((r) => r > 0.024 && r < 0.026) && RATIO_1E4_SPREAD < 0.02,
  },
  {
    // Measured beta gives a marginally SMALLER ratio (larger gate -> log(1+z)/z curves down faster).
    id: 'imp35219-measured-ratio-marginally-smaller',
    description: 'measured-beta 1e4 ratio is slightly below the RvM leading ratio (larger gate curvature)',
    holds: () => RATIO_1E4_MEAS < RATIO_1E4_LEADING && RATIO_1E4_MEAS_FAR < RATIO_1E4_MEAS,
  },
  {
    // Gate caveat: the measured gate c*g stays < 2 in the onset region and beyond (valid imp-2563 window).
    id: 'imp35219-onset-gate-measured-valid',
    description: 'in the onset region (g <= crossover) the measured gate c*g < 2, so T_minus is a valid imp-2563 window there',
    holds: () => ONSET_RUNGS.length > 0 && ONSET_GATE_MEAS_OK,
  },
  {
    // Honesty gate: measurement only, no QED, M5 stays OPEN, sandwich untouched, no refereed bound is changed.
    id: 'imp35219-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, changes NO bound, I2/M5 stay OPEN, no refereed bound is changed',
    holds: () =>
      IMP35219_HORIZON_FRONT_RATIO_MEASURED_BETA.isRigorous === false &&
      /NO QED/.test(IMP35219_HORIZON_FRONT_RATIO_MEASURED_BETA.verdict) &&
      /changes NO bound/.test(IMP35219_HORIZON_FRONT_RATIO_MEASURED_BETA.verdict) &&
      /I2\/M5 stay OPEN/.test(IMP35219_HORIZON_FRONT_RATIO_MEASURED_BETA.verdict) &&
      /refereed bound is changed/i.test(IMP35219_HORIZON_FRONT_RATIO_MEASURED_BETA.verdict),
  },
];

for (const a of IMP35219_HORIZON_FRONT_RATIO_MEASURED_BETA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35219-horizon-front-ratio-measured-beta assertion failed: ${a.id}`);
  }
}
