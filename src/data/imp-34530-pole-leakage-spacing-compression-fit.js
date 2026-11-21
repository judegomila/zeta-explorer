/**
 * @module imp-34530-pole-leakage-spacing-compression-fit
 *
 * imp-34530 (numerical, frontier-direction): imp-34512 R2 measured that the pole-leakage ladder's
 * inter-threshold spacing, normalized per threshold percentage-point, falls monotonically
 * ~0.196 -> 0.108 -> 0.058 -> 0.039 decades/pp across the {1,3,8,15,20}% rungs
 * {18.106, 18.497, 19.034, 19.443, 19.637} as the branch steepens toward the imp-34023 pole
 * k* ~ 21.281 -- but it never FIT that compression nor used it to extrapolate the next rungs. This
 * module (a) FITS the per-pp spacing s to a power law in the pole distance, s = A (k* - k)^p, over the
 * four interval-midpoint distances, (b) EXTRAPOLATES the 25% and 30% rung k-locations by integrating
 * the fitted spacing ODE dk/dpp = A (k* - k)^p forward from the 20% rung, and (c) VALIDATES the
 * extrapolation against the directly-bisected 25% and 30% crossings, reporting how far below k* they
 * land. It reuses the IDENTICAL imp-34247 metric, imp-34188 y(k) surrogate, and imp-34023 pole VERBATIM
 * (the same primitives as imp-34468 / imp-34512).
 *
 * Measurement / fit + threshold extrapolation only; the component model is NOT rigorous; no bound
 * changes; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 R3 / imp-34468 / imp-34512, reused VERBATIM)
 * ----------------------------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); dy/dk is the symmetric central-difference local slope. The
 *   pole-leakage is the DEVIATION of dy/dk from its clean far-field plateau P = dy/dk(k=14) ~ -0.977,
 *   measured as leak(k) = 100 |dy/dk(k) - P| / |P|, driven by the imp-34023 simple pole at k* ~ 21.281.
 *
 * THE FINDING (the per-pp spacing compression is a near-CUBIC power law in the pole distance)
 * ------------------------------------------------------------------------------------------
 *   (R1) THE PER-PP SPACING FITS s = A (k* - k)^p WITH p ~ 3.00, A ~ 7.06e-3, R^2 ~ 0.996. Assigning
 *        each of the four {1-3, 3-8, 8-15, 15-20}% interval spacings (~0.1954, 0.1075, 0.0584, 0.0387
 *        decades/pp) to its interval-midpoint pole distance k* - k_mid (~2.980, 2.515, 2.042, 1.741)
 *        and fitting log s vs log(k* - k) recovers a near-CUBIC compression law: the spacing collapses
 *        like the CUBE of the shrinking pole distance as the branch steepens toward k*.
 *   (R2) INTEGRATING dk/dpp = A (k* - k)^p FORWARD FROM THE 20% RUNG PLACES THE 25% AND 30% RUNGS AT
 *        k ~ 19.774 AND k ~ 19.882, i.e. ~1.507 AND ~1.400 decades BELOW the pole k* ~ 21.281. The
 *        rungs keep climbing but with sharply compressing steps: the 20->25% gap is only ~0.137 decades
 *        and the 25->30% gap ~0.108, versus ~0.194 for 15->20%.
 *   (R3) THE POWER-LAW EXTRAPOLATION IS ACCURATE BUT SLIGHTLY UNDERSHOOTS THE TRUE CROSSINGS. Directly
 *        bisecting leak(k) = 25 and leak(k) = 30 gives k ~ 19.786 and k ~ 19.907; the fitted-law
 *        extrapolation lands ~0.012 and ~0.025 decades LOW (further below k* than reality), because the
 *        true branch steepens FASTER than the fitted global cubic as k -> k* -- consistent with imp-34512
 *        R3, where leak's effective pole exponent itself rises (~2.12 over the wide window). The
 *        near-cubic spacing law is thus an EXCELLENT interpolant of the measured window and a mildly
 *        conservative (undershooting) extrapolant one to two rungs beyond it.
 *
 * The punchline: imp-34512 R2 quantified the 0.196 -> 0.039 decades/pp compression but never fit it.
 * Fitting s = A (k* - k)^p gives a near-CUBIC law (p ~ 3.00, R^2 ~ 0.996); integrating it forward puts
 * the 25% and 30% rungs at k ~ 19.774 / 19.882 (~1.51 / 1.40 decades below the pole), matching the
 * directly-bisected crossings k ~ 19.786 / 19.907 to within ~0.012 / 0.025 decades (a slight
 * undershoot, since the true branch steepens faster than the global cubic near k*).
 *
 * MEASUREMENT / FIT + THRESHOLD EXTRAPOLATION ONLY. A power-law fit of an inherited surrogate deviation
 * metric's spacing and a two-rung extrapolation near an inherited pole, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp
 * simple-pole structure is a numerical/structural observation, not a derivation; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34512-pole-leakage-fit-15-20-percent-crossings (R2 per-pp spacing compression fit here; the {1,3,8,15,20}% ladder)
 * @see imp-34468-pole-leakage-3-8-percent-crossings (the 1%/3%/8% ladder {18.106,18.497,19.034})
 * @see imp-34247-widening-slope-pole-divergence (R3 contaminationLadder devPct -- the metric reused here)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the widening-slope surrogate the pole leakage corrupts)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the residExp sign-change simple pole k* ~ 21.281)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247 / imp-34512
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-34247/imp-34512 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function olsIntercept(xs, ys, slope) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  return my - slope * mx;
}
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  return -olsSlope(xs, ys);
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
function yAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return Math.log(eflowAttr / residExp);
}
function residExpAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}
function localSlope(k, h) {
  return (yAtK(k + h) - yAtK(k - h)) / (2 * h);
}
function stepFor(k, kStar) {
  const gap = kStar - k;
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 / imp-34512 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* (imp-34247 / imp-34512 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 / imp-34512 k*)

const PLATEAU = localSlope(14, stepFor(14, K_STAR)); // ~ -0.977 clean far-field plateau
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1. Reproduce the imp-34512 five-rung {1,3,8,15,20}% ladder VERBATIM ----
function bisectCrossing(target, a, b) {
  for (let it = 0; it < 100; it++) {
    const m = 0.5 * (a + b);
    if (leakPct(m) < target) a = m;
    else b = m;
  }
  return 0.5 * (a + b);
}
const K_ONE_PCT = bisectCrossing(1.0, 17.8, 19.0); // ~18.10597 -- imp-34512 1% rung
const K_THREE_PCT = bisectCrossing(3.0, 18.1, 19.5); // ~18.49677 -- imp-34512 3% rung
const K_EIGHT_PCT = bisectCrossing(8.0, 18.5, 20.0); // ~19.03440 -- imp-34512 8% rung
const K_FIFTEEN_PCT = bisectCrossing(15.0, 19.0, 20.5); // ~19.44328 -- imp-34512 15% rung
const K_TWENTY_PCT = bisectCrossing(20.0, 19.5, 20.8); // ~19.63682 -- imp-34512 20% rung
const LADDER = [
  { threshold: 1, k: K_ONE_PCT },
  { threshold: 3, k: K_THREE_PCT },
  { threshold: 8, k: K_EIGHT_PCT },
  { threshold: 15, k: K_FIFTEEN_PCT },
  { threshold: 20, k: K_TWENTY_PCT },
];

// ---- 2. Per-pp spacing s vs interval-midpoint pole distance (k* - k_mid) ----
const SPACING_PTS = [];
for (let i = 1; i < LADDER.length; i++) {
  const s = (LADDER[i].k - LADDER[i - 1].k) / (LADDER[i].threshold - LADDER[i - 1].threshold);
  const midK = 0.5 * (LADDER[i].k + LADDER[i - 1].k);
  SPACING_PTS.push({ perPp: s, poleDist: K_STAR - midK });
} // perPp ~ [0.1954, 0.1075, 0.0584, 0.0387], poleDist ~ [2.980, 2.515, 2.042, 1.741]

// ---- 3. FIT the compression law s = A (k* - k)^p (log-log OLS) ----
const LX = SPACING_PTS.map((p) => Math.log(p.poleDist));
const LY = SPACING_PTS.map((p) => Math.log(p.perPp));
const FIT_EXPONENT = olsSlope(LX, LY); // ~3.004 -- near-CUBIC compression
const FIT_LN_A = olsIntercept(LX, LY, FIT_EXPONENT);
const FIT_A = Math.exp(FIT_LN_A); // ~7.06e-3
// R^2 of the log-log fit
const meanLY = LY.reduce((a, b) => a + b, 0) / LY.length;
let ssRes = 0;
let ssTot = 0;
for (let i = 0; i < LX.length; i++) {
  const pred = FIT_LN_A + FIT_EXPONENT * LX[i];
  ssRes += (LY[i] - pred) ** 2;
  ssTot += (LY[i] - meanLY) ** 2;
}
const FIT_R2 = 1 - ssRes / ssTot; // ~0.996

// ---- 4. EXTRAPOLATE the 25% / 30% rungs by integrating dk/dpp = A (k* - k)^p from the 20% rung ----
// The per-pp spacing IS the derivative dk/dpp, so the fitted law is an ODE in the threshold pct.
function extrapolateRung(targetPct) {
  let k = K_TWENTY_PCT;
  let pp = 20;
  const dp = 0.001; // RK4 step in percentage-points
  const f = (kk) => FIT_A * Math.pow(K_STAR - kk, FIT_EXPONENT);
  while (pp < targetPct - 1e-9) {
    const k1 = f(k);
    const k2 = f(k + 0.5 * dp * k1);
    const k3 = f(k + 0.5 * dp * k2);
    const k4 = f(k + dp * k3);
    k = k + (dp / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    pp += dp;
  }
  return k;
}
const K_TWENTYFIVE_EXTRAP = extrapolateRung(25); // ~19.774
const K_THIRTY_EXTRAP = extrapolateRung(30); // ~19.882
const BELOW_POLE_25 = K_STAR - K_TWENTYFIVE_EXTRAP; // ~1.507 decades below k*
const BELOW_POLE_30 = K_STAR - K_THIRTY_EXTRAP; // ~1.400 decades below k*

// ---- 5. VALIDATE against the directly-bisected 25% / 30% crossings ----
const K_TWENTYFIVE_MEAS = bisectCrossing(25.0, 19.6, 21.0); // ~19.786
const K_THIRTY_MEAS = bisectCrossing(30.0, 19.7, 21.1); // ~19.907
const EXTRAP_ERR_25 = K_TWENTYFIVE_EXTRAP - K_TWENTYFIVE_MEAS; // ~ -0.012 (undershoots)
const EXTRAP_ERR_30 = K_THIRTY_EXTRAP - K_THIRTY_MEAS; // ~ -0.025 (undershoots)
// Extrapolation undershoots (lands below the true k) because the true branch steepens faster than the
// global cubic as k -> k*, consistent with imp-34512 R3s rising effective leak exponent.
const EXTRAP_UNDERSHOOTS = EXTRAP_ERR_25 < 0 && EXTRAP_ERR_30 < 0;
const EXTRAP_ACCURATE = Math.abs(EXTRAP_ERR_25) < 0.03 && Math.abs(EXTRAP_ERR_30) < 0.05;

const rnd = (x, n) => +x.toFixed(n);

export const IMP34530_POLE_LEAKAGE_SPACING_COMPRESSION_FIT = {
  id: 'imp-34530',
  proofSection: 'S-frontier',
  question:
    'imp-34512 R2 measured that the pole-leakage ladders per-pp spacing falls monotonically ' +
    '~0.196 -> 0.108 -> 0.058 -> 0.039 decades/pp across the {1,3,8,15,20}% rungs as the branch steepens ' +
    'toward the imp-34023 pole k* ~ 21.281, but never fit that compression nor extrapolated further rungs. ' +
    'Fit the compression law s = A (k* - k)^p, integrate it forward to extrapolate the 25% and 30% rung ' +
    'k-locations, and validate against the directly-bisected crossings. Measurement / fit + threshold ' +
    'extrapolation only; component model NOT rigorous; no bound change; NO QED.',
  measuredQuantity:
    'The power-law fit (exponent p, coefficient A, R^2) of the per-pp spacing s vs the interval-midpoint ' +
    'pole distance k* - k, the ODE-integrated 25% / 30% rung k-locations, and the extrapolation error ' +
    'against the directly-bisected 25% / 30% crossings',
  poleLocation: rnd(K_STAR, 5), // ~21.28095 (imp-34023 / imp-34247 / imp-34512 k*)
  plateau: rnd(PLATEAU, 4), // ~ -0.977 clean far-field plateau
  ladder: LADDER.map((r) => ({ threshold: r.threshold, k: rnd(r.k, 5) })), // {1,3,8,15,20}% rungs (imp-34512)
  spacingPoints: SPACING_PTS.map((p) => ({ perPp: rnd(p.perPp, 5), poleDist: rnd(p.poleDist, 5) })),
  fitExponent: rnd(FIT_EXPONENT, 4), // ~3.004 -- near-CUBIC compression in the pole distance
  fitCoefficient: rnd(FIT_A, 6), // ~0.007056
  fitR2: rnd(FIT_R2, 5), // ~0.99584
  twentyFivePctRungExtrap: rnd(K_TWENTYFIVE_EXTRAP, 5), // ~19.77446 (ODE-integrated from the 20% rung)
  thirtyPctRungExtrap: rnd(K_THIRTY_EXTRAP, 5), // ~19.88243
  decadesBelowPole25: rnd(BELOW_POLE_25, 4), // ~1.5065 -- 25% rung still below k*
  decadesBelowPole30: rnd(BELOW_POLE_30, 4), // ~1.3985 -- 30% rung still below k*
  twentyFivePctRungMeasured: rnd(K_TWENTYFIVE_MEAS, 5), // ~19.78645 (directly bisected -- validation)
  thirtyPctRungMeasured: rnd(K_THIRTY_MEAS, 5), // ~19.90705
  extrapError25: rnd(EXTRAP_ERR_25, 5), // ~ -0.012 decades (undershoots the true crossing)
  extrapError30: rnd(EXTRAP_ERR_30, 5), // ~ -0.025 decades (undershoots)
  extrapUndershoots: EXTRAP_UNDERSHOOTS, // true -- true branch steepens faster than the global cubic
  extrapAccurate: EXTRAP_ACCURATE, // true -- fit reproduces the direct crossings to ~0.01-0.03 decades
  finding: {
    R1_spacing_is_near_cubic_power_law:
      'Assigning each {1-3, 3-8, 8-15, 15-20}% interval spacing (~0.1954, 0.1075, 0.0584, 0.0387 ' +
      'decades/pp) to its interval-midpoint pole distance k* - k_mid (~2.980, 2.515, 2.042, 1.741) and ' +
      'fitting log s vs log(k* - k) gives s = A (k* - k)^p with p ~ 3.00, A ~ 7.06e-3, R^2 ~ 0.996 -- ' +
      'the per-pp spacing collapses like the CUBE of the shrinking pole distance as the branch steepens.',
    R2_extrapolated_25_30_rungs:
      'Integrating dk/dpp = A (k* - k)^p forward from the 20% rung (k ~ 19.637) places the 25% and 30% ' +
      'rungs at k ~ 19.774 and k ~ 19.882, i.e. ~1.507 and ~1.400 decades below the pole k* ~ 21.281. ' +
      'The steps compress sharply: 20->25% ~0.137 decades, 25->30% ~0.108, versus ~0.194 for 15->20%.',
    R3_extrapolation_validated_slight_undershoot:
      'Directly bisecting leak(k) = 25 and leak(k) = 30 gives k ~ 19.786 and k ~ 19.907; the fitted-law ' +
      'extrapolation lands ~0.012 and ~0.025 decades LOW (further below k* than reality) because the true ' +
      'branch steepens faster than the fitted global cubic as k -> k*, consistent with imp-34512 R3s ' +
      'rising effective leak exponent. The near-cubic spacing law is an excellent interpolant and a ' +
      'mildly conservative (undershooting) extrapolant one to two rungs beyond the measured window.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / FIT + THRESHOLD EXTRAPOLATION (frontier-direction, NOT rigorous). Fitting the ' +
    'imp-34512 per-pp spacing compression s vs pole distance gives a near-CUBIC law s = A (k* - k)^p ' +
    '(p ~ 3.004, A ~ 7.06e-3, R^2 ~ 0.996); integrating it forward from the 20% rung places the 25% and ' +
    '30% pole-leakage rungs at k ~ 19.774 and k ~ 19.882 (~1.51 and ~1.40 decades below the pole ' +
    'k* ~ 21.281), matching the directly-bisected crossings k ~ 19.786 / 19.907 to within ~0.012 / 0.025 ' +
    'decades -- a slight undershoot, since the true branch steepens faster than the global cubic near k*. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'residExp simple-pole structure is a numerical/structural observation, not a derivation; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34512 (R2 per-pp spacing compression fit here; the {1,3,8,15,20}% ladder); imp-34468 (the ' +
    '1%/3%/8% ladder); imp-34247 (R3 contaminationLadder devPct -- the metric reused); imp-34188 (the ' +
    'widening-slope surrogate); imp-34023 (residExp simple pole k* ~ 21.281); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34530_POLE_LEAKAGE_SPACING_COMPRESSION_FIT_ASSERTIONS = [
  {
    // The pole, plateau, and 20% rung reproduce imp-34512 (identical inherited metric).
    id: 'imp34530-inherited-metric-reproduces-imp34512',
    description: 'k* ~ 21.281, P ~ -0.977, and the 20% rung k ~ 19.637 reproduce imp-34512',
    holds: () =>
      K_STAR > 21.27 &&
      K_STAR < 21.29 &&
      PLATEAU < -0.9 &&
      PLATEAU > -1.05 &&
      Math.abs(K_TWENTY_PCT - 19.63682) < 0.01,
  },
  {
    // (R1) The per-pp spacing fits a near-cubic power law in the pole distance with high R^2.
    id: 'imp34530-spacing-near-cubic-power-law',
    description: 'per-pp spacing s = A (k* - k)^p fits p ~ 3.00, A ~ 7.06e-3 with R^2 ~ 0.996',
    holds: () =>
      FIT_EXPONENT > 2.7 &&
      FIT_EXPONENT < 3.3 &&
      FIT_A > 0.004 &&
      FIT_A < 0.011 &&
      FIT_R2 > 0.98,
  },
  {
    // (R2) The extrapolated 25% / 30% rungs climb above the 20% rung but stay below the pole.
    id: 'imp34530-extrapolated-25-30-rungs-below-pole',
    description: '25% rung k ~ 19.774 and 30% rung k ~ 19.882, both above 20% and below k* ~ 21.281',
    holds: () =>
      K_TWENTYFIVE_EXTRAP > K_TWENTY_PCT &&
      K_THIRTY_EXTRAP > K_TWENTYFIVE_EXTRAP &&
      K_THIRTY_EXTRAP < K_STAR &&
      Math.abs(K_TWENTYFIVE_EXTRAP - 19.7745) < 0.02 &&
      Math.abs(K_THIRTY_EXTRAP - 19.8824) < 0.02 &&
      BELOW_POLE_25 > 1.4 &&
      BELOW_POLE_25 < 1.6,
  },
  {
    // (R3) The extrapolation matches the directly-bisected crossings, slightly undershooting.
    id: 'imp34530-extrapolation-validated-slight-undershoot',
    description: 'ODE extrapolation reproduces the bisected 25%/30% crossings within ~0.03 decades, undershooting',
    holds: () =>
      leakPct(K_TWENTYFIVE_MEAS) > 24.99 &&
      leakPct(K_TWENTYFIVE_MEAS) < 25.01 &&
      leakPct(K_THIRTY_MEAS) > 29.99 &&
      leakPct(K_THIRTY_MEAS) < 30.01 &&
      EXTRAP_UNDERSHOOTS === true &&
      EXTRAP_ACCURATE === true,
  },
  {
    // Honesty gate: measurement + fit only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34530-honesty-gate-no-qed',
    description: 'measurement/fit only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34530_POLE_LEAKAGE_SPACING_COMPRESSION_FIT.isRigorous === false &&
      /NO QED/.test(IMP34530_POLE_LEAKAGE_SPACING_COMPRESSION_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34530_POLE_LEAKAGE_SPACING_COMPRESSION_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34530_POLE_LEAKAGE_SPACING_COMPRESSION_FIT.verdict),
  },
];

for (const a of IMP34530_POLE_LEAKAGE_SPACING_COMPRESSION_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34530-pole-leakage-spacing-compression-fit assertion failed: ${a.id}`);
  }
}
