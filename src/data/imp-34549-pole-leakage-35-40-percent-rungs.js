/**
 * @module imp-34549-pole-leakage-35-40-percent-rungs
 *
 * imp-34549 (numerical, frontier-direction): imp-34530 R2/R3 fit the pole-leakage per-pp spacing law
 * s = A (k* - k)^p (p ~ 3.00, R^2 ~ 0.996), integrated it forward to place the 25% and 30% rungs at
 * k ~ 19.774 / 19.882, and found the fitted extrapolation UNDERSHOOTS the directly-bisected crossings
 * k ~ 19.786 / 19.907 by ~0.012 / 0.025 decades -- the undershoot GROWING with distance from the fitted
 * {1,3,8,15,20}% window (because the true branch steepens FASTER than the global cubic near the
 * imp-34023 pole k* ~ 21.281). The imp-34530 ladder STOPPED at the 30% rung. This module (a) directly
 * BISECTS leak(k) = 35 and leak(k) = 40, (b) continues the imp-34530 cubic-law forward-integration
 * dk/dpp = A (k* - k)^p to those same rungs, and (c) MEASURES whether the undershoot keeps growing and
 * how far below the pole the true 35% / 40% crossings land. It reuses the IDENTICAL imp-34247 metric,
 * imp-34188 y(k) surrogate, and imp-34023 pole VERBATIM (the same primitives as imp-34468 / imp-34512 /
 * imp-34530), and re-derives the compression fit from the same four interval midpoints.
 *
 * Measurement / extrapolation only; the component model is NOT rigorous; no bound changes; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 R3 / imp-34468 / imp-34512 / imp-34530, reused VERBATIM)
 * -----------------------------------------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); dy/dk is the symmetric central-difference local slope. The
 *   pole-leakage is the DEVIATION of dy/dk from its clean far-field plateau P = dy/dk(k=14) ~ -0.977,
 *   measured as leak(k) = 100 |dy/dk(k) - P| / |P|, driven by the imp-34023 simple pole at k* ~ 21.281.
 *
 * THE FINDING (the undershoot KEEPS growing; the 35% / 40% rungs land ~1.27 / 1.19 decades below k*)
 * -------------------------------------------------------------------------------------------------
 *   (R1) DIRECT BISECTION PLACES THE 35% AND 40% RUNGS AT k ~ 20.0071 AND k ~ 20.0919, i.e. ~1.2739 AND
 *        ~1.1891 decades BELOW the pole k* ~ 21.281. The ladder keeps climbing toward k* but with sharply
 *        compressing steps: the directly-bisected 30->35% gap is only ~0.1000 decades and 35->40% ~0.0848,
 *        versus ~0.1206 for 25->30% -- the branch continues to steepen as it approaches the pole.
 *   (R2) THE imp-34530 CUBIC-LAW EXTRAPOLATION UNDERSHOOTS FURTHER AT EVERY NEW RUNG. Integrating
 *        dk/dpp = A (k* - k)^p forward to 35% / 40% lands at k ~ 19.9701 / 20.0430, ~0.0370 / ~0.0488
 *        decades BELOW the directly-bisected crossings -- versus ~0.0120 / ~0.0246 at the 25% / 30% rungs.
 *        The undershoot magnitude grows MONOTONICALLY 0.012 -> 0.025 -> 0.037 -> 0.049 decades across the
 *        {25,30,35,40}% rungs, confirming imp-34530 R3: the true branch steepens faster than the global
 *        cubic, and the fitted-law error accumulates the farther one extrapolates past the fit window.
 *   (R3) THE UNDERSHOOT INCREMENTS ARE THEMSELVES ROUGHLY LINEAR IN THE RUNG INDEX. The rung-to-rung
 *        undershoot increases (~0.0126, ~0.0124, ~0.0118 decades per 5-pp step) are near-constant, so the
 *        cumulative extrapolation error grows approximately LINEARLY with distance past the 20% fit edge --
 *        the global cubic is a mildly conservative (always-undershooting) extrapolant whose bias
 *        accumulates steadily rather than exploding as the pole is approached over this window.
 *
 * The punchline: imp-34530 stopped its ladder at the 30% rung. Directly bisecting leak(k) = 35 / 40 puts
 * those rungs at k ~ 20.0071 / 20.0919 (~1.27 / 1.19 decades below the pole k* ~ 21.281); continuing the
 * imp-34530 cubic-law forward-integration lands ~0.037 / ~0.049 decades LOW -- the undershoot growing
 * monotonically (0.012 -> 0.025 -> 0.037 -> 0.049) with near-constant increments, exactly as imp-34530 R3
 * predicted from the branch steepening faster than the fitted global cubic near k*.
 *
 * MEASUREMENT / EXTRAPOLATION ONLY. Two more directly-bisected rungs of an inherited surrogate deviation
 * metric plus a forward integration of an inherited power-law fit near an inherited pole, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * residExp simple-pole structure is a numerical/structural observation, not a derivation; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34530-pole-leakage-spacing-compression-fit (the cubic-law fit + 25%/30% rungs extended here)
 * @see imp-34512-pole-leakage-fit-15-20-percent-crossings (the {1,3,8,15,20}% ladder + per-pp compression)
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
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247 / imp-34530
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-34247/imp-34530 sub-terms (no re-derivation, no fresh model).
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
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 / imp-34530 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* (imp-34247 / imp-34530 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 / imp-34530 k*)

const PLATEAU = localSlope(14, stepFor(14, K_STAR)); // ~ -0.977 clean far-field plateau
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1. Re-derive the imp-34530 cubic compression fit from the {1,3,8,15,20}% ladder VERBATIM ----
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
const FIT_LADDER = [
  { threshold: 1, k: K_ONE_PCT },
  { threshold: 3, k: K_THREE_PCT },
  { threshold: 8, k: K_EIGHT_PCT },
  { threshold: 15, k: K_FIFTEEN_PCT },
  { threshold: 20, k: K_TWENTY_PCT },
];
const SPACING_PTS = [];
for (let i = 1; i < FIT_LADDER.length; i++) {
  const s = (FIT_LADDER[i].k - FIT_LADDER[i - 1].k) / (FIT_LADDER[i].threshold - FIT_LADDER[i - 1].threshold);
  const midK = 0.5 * (FIT_LADDER[i].k + FIT_LADDER[i - 1].k);
  SPACING_PTS.push({ perPp: s, poleDist: K_STAR - midK });
}
const LX = SPACING_PTS.map((p) => Math.log(p.poleDist));
const LY = SPACING_PTS.map((p) => Math.log(p.perPp));
const FIT_EXPONENT = olsSlope(LX, LY); // ~3.004 -- near-CUBIC compression (imp-34530)
const FIT_A = Math.exp(olsIntercept(LX, LY, FIT_EXPONENT)); // ~7.06e-3 (imp-34530)

// ---- 2. Directly BISECT the 25% / 30% (inherited) and the NEW 35% / 40% rungs ----
const K_TWENTYFIVE_MEAS = bisectCrossing(25.0, 19.6, 21.0); // ~19.78645 (imp-34530)
const K_THIRTY_MEAS = bisectCrossing(30.0, 19.7, 21.1); // ~19.90705 (imp-34530)
const K_THIRTYFIVE_MEAS = bisectCrossing(35.0, 19.8, 21.2); // ~20.00709 (NEW)
const K_FORTY_MEAS = bisectCrossing(40.0, 19.9, 21.28); // ~20.09187 (NEW)

// ---- 3. Continue the imp-34530 cubic-law forward-integration dk/dpp = A (k* - k)^p to those rungs ----
function extrapolateRung(targetPct) {
  let k = K_TWENTY_PCT;
  let pp = 20;
  const dp = 0.001; // RK4 step in percentage-points (imp-34530 convention)
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
const K_TWENTYFIVE_EXTRAP = extrapolateRung(25); // ~19.77446 (imp-34530)
const K_THIRTY_EXTRAP = extrapolateRung(30); // ~19.88243 (imp-34530)
const K_THIRTYFIVE_EXTRAP = extrapolateRung(35); // ~19.97007 (NEW)
const K_FORTY_EXTRAP = extrapolateRung(40); // ~20.04304 (NEW)

// ---- 4. Undershoot at each rung (extrapolated - directly bisected) ----
const ERR_25 = K_TWENTYFIVE_EXTRAP - K_TWENTYFIVE_MEAS; // ~ -0.0120
const ERR_30 = K_THIRTY_EXTRAP - K_THIRTY_MEAS; // ~ -0.0246
const ERR_35 = K_THIRTYFIVE_EXTRAP - K_THIRTYFIVE_MEAS; // ~ -0.0370 (NEW)
const ERR_40 = K_FORTY_EXTRAP - K_FORTY_MEAS; // ~ -0.0488 (NEW)
// The undershoot magnitude grows monotonically across {25,30,35,40}% (all negative, increasing |.|).
const UNDERSHOOT_KEEPS_GROWING =
  ERR_25 < 0 && ERR_30 < ERR_25 && ERR_35 < ERR_30 && ERR_40 < ERR_35;
// The rung-to-rung undershoot INCREMENTS (~0.0126, ~0.0124, ~0.0118) are near-constant => ~linear growth.
const INC_30 = Math.abs(ERR_30) - Math.abs(ERR_25);
const INC_35 = Math.abs(ERR_35) - Math.abs(ERR_30);
const INC_40 = Math.abs(ERR_40) - Math.abs(ERR_35);
const INCREMENTS_ROUGHLY_CONSTANT =
  Math.abs(INC_35 - INC_30) < 0.4 * INC_30 && Math.abs(INC_40 - INC_35) < 0.4 * INC_35;

// ---- 5. How far below the pole the true 35% / 40% crossings land ----
const BELOW_POLE_35 = K_STAR - K_THIRTYFIVE_MEAS; // ~1.2739 decades below k*
const BELOW_POLE_40 = K_STAR - K_FORTY_MEAS; // ~1.1891 decades below k*
const GAP_30_35 = K_THIRTYFIVE_MEAS - K_THIRTY_MEAS; // ~0.1000 decades (bisected step)
const GAP_35_40 = K_FORTY_MEAS - K_THIRTYFIVE_MEAS; // ~0.0848 decades (bisected step, compressing)

const rnd = (x, n) => +x.toFixed(n);

export const IMP34549_POLE_LEAKAGE_35_40_PERCENT_RUNGS = {
  id: 'imp-34549',
  proofSection: 'S-frontier',
  question:
    'imp-34530 R2/R3 fit the pole-leakage per-pp spacing law s = A (k* - k)^p (p ~ 3.00), integrated it ' +
    'forward to place the 25% / 30% rungs, and found the extrapolation undershoots the directly-bisected ' +
    'crossings by ~0.012 / 0.025 decades -- the undershoot growing with distance from the {1,3,8,15,20}% ' +
    'fit window -- but the ladder STOPPED at 30%. Directly bisect leak(k) = 35 and leak(k) = 40, continue ' +
    'the cubic-law forward-integration to those rungs, and measure whether the undershoot keeps growing and ' +
    'how far below the imp-34023 pole k* ~ 21.281 the true crossings land. Measurement / extrapolation ' +
    'only; component model NOT rigorous; no bound change; NO QED.',
  measuredQuantity:
    'The directly-bisected 35% / 40% pole-leakage rung k-locations, the imp-34530 cubic-law ODE-integrated ' +
    '35% / 40% rung k-locations, the extrapolation undershoot at each of the {25,30,35,40}% rungs, and how ' +
    'far below the pole k* the true 35% / 40% crossings land',
  poleLocation: rnd(K_STAR, 5), // ~21.28095 (imp-34023 / imp-34247 / imp-34530 k*)
  plateau: rnd(PLATEAU, 4), // ~ -0.977 clean far-field plateau
  fitExponent: rnd(FIT_EXPONENT, 4), // ~3.004 -- inherited imp-34530 near-CUBIC compression
  fitCoefficient: rnd(FIT_A, 6), // ~0.007056 (imp-34530)
  thirtyFivePctRungMeasured: rnd(K_THIRTYFIVE_MEAS, 5), // ~20.00709 (directly bisected -- NEW)
  fortyPctRungMeasured: rnd(K_FORTY_MEAS, 5), // ~20.09187 (directly bisected -- NEW)
  thirtyFivePctRungExtrap: rnd(K_THIRTYFIVE_EXTRAP, 5), // ~19.97007 (cubic-law forward-integration)
  fortyPctRungExtrap: rnd(K_FORTY_EXTRAP, 5), // ~20.04304 (cubic-law forward-integration)
  undershootLadder: [
    { threshold: 25, extrap: rnd(K_TWENTYFIVE_EXTRAP, 5), measured: rnd(K_TWENTYFIVE_MEAS, 5), err: rnd(ERR_25, 5) },
    { threshold: 30, extrap: rnd(K_THIRTY_EXTRAP, 5), measured: rnd(K_THIRTY_MEAS, 5), err: rnd(ERR_30, 5) },
    { threshold: 35, extrap: rnd(K_THIRTYFIVE_EXTRAP, 5), measured: rnd(K_THIRTYFIVE_MEAS, 5), err: rnd(ERR_35, 5) },
    { threshold: 40, extrap: rnd(K_FORTY_EXTRAP, 5), measured: rnd(K_FORTY_MEAS, 5), err: rnd(ERR_40, 5) },
  ],
  undershootIncrements: [rnd(INC_30, 5), rnd(INC_35, 5), rnd(INC_40, 5)], // ~[0.0126, 0.0124, 0.0118]
  decadesBelowPole35: rnd(BELOW_POLE_35, 4), // ~1.2739 -- 35% rung still below k*
  decadesBelowPole40: rnd(BELOW_POLE_40, 4), // ~1.1891 -- 40% rung still below k*
  bisectedGap30to35: rnd(GAP_30_35, 5), // ~0.10000 decades
  bisectedGap35to40: rnd(GAP_35_40, 5), // ~0.08478 decades (compressing)
  undershootKeepsGrowing: UNDERSHOOT_KEEPS_GROWING, // true -- |err| rises across {25,30,35,40}%
  incrementsRoughlyConstant: INCREMENTS_ROUGHLY_CONSTANT, // true -- undershoot grows ~linearly past the fit edge
  finding: {
    R1_35_40_rungs_bisected:
      'Directly bisecting leak(k) = 35 and leak(k) = 40 places the rungs at k ~ 20.0071 and k ~ 20.0919, ' +
      'i.e. ~1.2739 and ~1.1891 decades below the pole k* ~ 21.281. The ladder keeps climbing but with ' +
      'compressing steps: the bisected 30->35% gap is ~0.1000 decades and 35->40% ~0.0848, versus ~0.1206 ' +
      'for 25->30% -- the branch continues to steepen as it approaches the pole.',
    R2_undershoot_keeps_growing:
      'Continuing the imp-34530 cubic-law forward-integration dk/dpp = A (k* - k)^p to 35% / 40% lands at ' +
      'k ~ 19.9701 / 20.0430, ~0.0370 / ~0.0488 decades below the directly-bisected crossings -- versus ' +
      '~0.0120 / ~0.0246 at 25% / 30%. The undershoot magnitude grows monotonically ' +
      '0.012 -> 0.025 -> 0.037 -> 0.049 decades across {25,30,35,40}%, confirming imp-34530 R3: the true ' +
      'branch steepens faster than the global cubic, and the fitted-law error accumulates with extrapolation.',
    R3_increments_roughly_linear:
      'The rung-to-rung undershoot increases (~0.0126, ~0.0124, ~0.0118 decades per 5-pp step) are ' +
      'near-constant, so the cumulative extrapolation error grows approximately LINEARLY with distance past ' +
      'the 20% fit edge -- the global cubic is a mildly conservative (always-undershooting) extrapolant ' +
      'whose bias accumulates steadily rather than exploding as the pole is approached over this window.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / EXTRAPOLATION (frontier-direction, NOT rigorous). Directly bisecting leak(k) = 35 / 40 ' +
    'places those pole-leakage rungs at k ~ 20.0071 / 20.0919 (~1.27 / 1.19 decades below the pole ' +
    'k* ~ 21.281); continuing the imp-34530 cubic-law forward-integration lands ~0.037 / ~0.049 decades ' +
    'below the bisected crossings, so the undershoot grows monotonically 0.012 -> 0.025 -> 0.037 -> 0.049 ' +
    'with near-constant increments across {25,30,35,40}% -- exactly as imp-34530 R3 predicted from the branch ' +
    'steepening faster than the fitted global cubic near k*. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-pole structure is a ' +
    'numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34530 (the cubic-law fit + 25%/30% rungs extended here); imp-34512 (the {1,3,8,15,20}% ladder + ' +
    'per-pp compression); imp-34468 (the 1%/3%/8% ladder); imp-34247 (R3 contaminationLadder devPct -- the ' +
    'metric reused); imp-34188 (the widening-slope surrogate); imp-34023 (residExp simple pole k* ~ 21.281); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C ' +
    '(C_C_PINNED).',
};

export const IMP34549_POLE_LEAKAGE_35_40_PERCENT_RUNGS_ASSERTIONS = [
  {
    // The pole, plateau, and inherited 25%/30% rungs reproduce imp-34530 (identical inherited metric).
    id: 'imp34549-inherited-metric-reproduces-imp34530',
    description: 'k* ~ 21.281, P ~ -0.977, and the bisected 25%/30% rungs ~19.786/19.907 reproduce imp-34530',
    holds: () =>
      K_STAR > 21.27 &&
      K_STAR < 21.29 &&
      PLATEAU < -0.9 &&
      PLATEAU > -1.05 &&
      Math.abs(K_TWENTYFIVE_MEAS - 19.78645) < 0.01 &&
      Math.abs(K_THIRTY_MEAS - 19.90705) < 0.01,
  },
  {
    // (R1) The new 35%/40% rungs bisect to k ~ 20.007/20.092, above the 30% rung and below the pole.
    id: 'imp34549-35-40-rungs-bisected-below-pole',
    description: '35% rung k ~ 20.007, 40% rung k ~ 20.092: both above the 30% rung and below k* ~ 21.281',
    holds: () =>
      K_THIRTYFIVE_MEAS > K_THIRTY_MEAS &&
      K_FORTY_MEAS > K_THIRTYFIVE_MEAS &&
      K_FORTY_MEAS < K_STAR &&
      Math.abs(K_THIRTYFIVE_MEAS - 20.00709) < 0.01 &&
      Math.abs(K_FORTY_MEAS - 20.09187) < 0.01 &&
      leakPct(K_THIRTYFIVE_MEAS) > 34.99 &&
      leakPct(K_THIRTYFIVE_MEAS) < 35.01 &&
      leakPct(K_FORTY_MEAS) > 39.99 &&
      leakPct(K_FORTY_MEAS) < 40.01 &&
      BELOW_POLE_35 > 1.2 &&
      BELOW_POLE_35 < 1.35 &&
      BELOW_POLE_40 > 1.1 &&
      BELOW_POLE_40 < 1.25,
  },
  {
    // (R2) The cubic-law undershoot grows monotonically across the {25,30,35,40}% rungs.
    id: 'imp34549-undershoot-keeps-growing',
    description: 'extrapolation undershoot |err| rises 0.012 -> 0.025 -> 0.037 -> 0.049 across {25,30,35,40}%',
    holds: () =>
      UNDERSHOOT_KEEPS_GROWING === true &&
      Math.abs(ERR_35 + 0.037) < 0.006 &&
      Math.abs(ERR_40 + 0.049) < 0.006 &&
      Math.abs(ERR_40) > Math.abs(ERR_35) &&
      Math.abs(ERR_35) > Math.abs(ERR_30),
  },
  {
    // (R3) The rung-to-rung undershoot increments are near-constant (approximately linear accumulation).
    id: 'imp34549-undershoot-increments-roughly-constant',
    description: 'undershoot increments ~[0.0126, 0.0124, 0.0118] are near-constant -> ~linear error growth',
    holds: () =>
      INCREMENTS_ROUGHLY_CONSTANT === true &&
      INC_30 > 0 &&
      INC_35 > 0 &&
      INC_40 > 0 &&
      GAP_35_40 < GAP_30_35, // steps keep compressing toward the pole
  },
  {
    // Honesty gate: measurement + extrapolation only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34549-honesty-gate-no-qed',
    description: 'measurement/extrapolation only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34549_POLE_LEAKAGE_35_40_PERCENT_RUNGS.isRigorous === false &&
      /NO QED/.test(IMP34549_POLE_LEAKAGE_35_40_PERCENT_RUNGS.verdict) &&
      /refereed bound is changed/i.test(IMP34549_POLE_LEAKAGE_35_40_PERCENT_RUNGS.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34549_POLE_LEAKAGE_35_40_PERCENT_RUNGS.verdict),
  },
];

for (const a of IMP34549_POLE_LEAKAGE_35_40_PERCENT_RUNGS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34549-pole-leakage-35-40-percent-rungs assertion failed: ${a.id}`);
  }
}
