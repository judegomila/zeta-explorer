/**
 * @module imp-34512-pole-leakage-fit-15-20-percent-crossings
 *
 * imp-34512 (numerical, frontier-direction): imp-34468 bisected the pole-leakage degradation ladder
 * leak(k) = 100 |dy/dk(k) - P| / |P| to {1%: k~18.106, 3%: k~18.497, 8%: k~19.034} but only established
 * three rungs and never fit leak(k) to the pole functional form leak(k) = A/(k* - k) + P nor located
 * rungs above 8%. This module (a) FITS leak(k) to the single-pole form over the rising branch and checks
 * the recovered k* against the inherited imp-34023 pole k* ~ 21.28095, and (b) bisects the NEXT 15% and
 * 20% rungs on the same branch, extending the ladder toward the pole. It reuses the IDENTICAL imp-34247
 * metric, imp-34188 y(k) surrogate, and imp-34023 pole VERBATIM (same primitives as imp-34468).
 *
 * Measurement / threshold-location + fit only; the component model is NOT rigorous; no bound changes;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 R3 / imp-34413 / imp-34468, reused VERBATIM)
 * ----------------------------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); dy/dk is the symmetric central-difference local slope. The
 *   pole-leakage is the DEVIATION of dy/dk from its clean far-field plateau P = dy/dk(k=14) ~ -0.977,
 *   measured as leak(k) = 100 |dy/dk(k) - P| / |P|. Its growth is driven by the imp-34023 simple pole at
 *   k* ~ 21.28095: as k -> k* the pole term 1/(k* - k) leaks into the local slope estimate.
 *
 * THE FINDING (single-pole fit is only ASYMPTOTIC; new 15%/20% rungs)
 * ------------------------------------------------------------------
 *   (R1) THE 15% AND 20% CROSSINGS ARE k ~ 19.44328 AND k ~ 19.63682. Bisecting leak(k) = 15 and
 *        leak(k) = 20 on the rising pole-side branch extends the imp-34468 ladder to five rungs
 *        {1: 18.106, 3: 18.497, 8: 19.034, 15: 19.443, 20: 19.637}, strictly increasing, all below the
 *        pole k* ~ 21.281 (the 20% rung still ~1.644 decades below it).
 *   (R2) THE INTER-THRESHOLD SPACINGS COMPRESS PER PERCENTAGE-POINT AS k CLIMBS. Decade spacings are
 *        1->3: ~0.391, 3->8: ~0.538, 8->15: ~0.409, 15->20: ~0.194. Normalised by threshold increment
 *        (pp) the spacing falls monotonically (~0.196, ~0.108, ~0.058, ~0.039 decades/pp) -- the branch
 *        is steepening toward the pole, so ever-larger leak increments compress into shorter k intervals.
 *   (R3) A SINGLE SIMPLE POLE A/(k* - k) + P DOES NOT FIT THE MEASURED 1%-20% WINDOW; the pole is only
 *        the ASYMPTOTIC (k -> k*) driver. Over the measured branch k in [18.5, 20.9] the effective local
 *        exponent p in leak ~ (k* - k)^(-p) is ~2.12 (steeper than a first-order pole), and a naive
 *        1/leak linear-root estimate of the pole undershoots badly (k*_fit ~ 19.98, ~1.30 below the true
 *        21.281). BUT the effective exponent collapses MONOTONICALLY toward 1 as k -> k* (2.12 over
 *        [18.5,20.9] -> 1.39 over [20.0,21.1] -> 1.14 over [20.8,21.2]), and the 1/leak root recovers the
 *        pole as the window tightens onto it (19.98 -> 21.22 over [20.7,21.15] -> 21.26 over [21.0,21.18]),
 *        CONFIRMING the imp-34023 residExp singularity is a genuine SIMPLE pole and IS the k -> k* driver,
 *        consistent with the inherited 21.28095. The single-pole form is an asymptotic statement, not a
 *        global fit of the pre-pole window.
 *
 * The punchline: imp-34468 pinned {1,3,8}% at {18.106, 18.497, 19.034}. Adding the 15% and 20% rungs
 * gives {18.106, 18.497, 19.034, 19.443, 19.637}; fitting leak(k) shows a single simple pole A/(k*-k)+P
 * is only the ASYMPTOTIC (k->k*) behaviour -- the measured 1%-20% window has effective exponent ~2 and a
 * naive pole fit undershoots to ~19.9, but the exponent -> 1 and the recovered pole -> 21.28 as k -> k*,
 * confirming the inherited simple pole organizes the divergence.
 *
 * MEASUREMENT / THRESHOLD-LOCATION + FIT ONLY. Two more bisections and a fit of an inherited surrogate
 * deviation metric near an inherited pole, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a
 * numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO
 * QED. No refereed bound is changed.
 *
 * @see imp-34468-pole-leakage-3-8-percent-crossings (the 1%/3%/8% ladder {18.106,18.497,19.034} extended here)
 * @see imp-34413-widening-slope-pole-leakage-one-percent-crossing (R1 1% crossing k~18.106)
 * @see imp-34247-widening-slope-pole-divergence (R3 contaminationLadder devPct -- the metric fit here)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the widening-slope surrogate the pole leakage corrupts)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the residExp sign-change simple pole k* ~ 21.281)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247 / imp-34468
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-34247/imp-34468 sub-terms (no re-derivation, no fresh model).
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
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 / imp-34468 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* (imp-34247 / imp-34468 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 / imp-34468 k*)

const PLATEAU = localSlope(14, stepFor(14, K_STAR)); // ~ -0.977 clean far-field plateau
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1. Bisect the rising pole-side branch for the NEW 15% / 20% crossings (imp-34468 convention) ----
function bisectCrossing(target, a, b) {
  for (let it = 0; it < 100; it++) {
    const m = 0.5 * (a + b);
    if (leakPct(m) < target) a = m;
    else b = m;
  }
  return 0.5 * (a + b);
}
const K_ONE_PCT = +bisectCrossing(1.0, 17.8, 19.0).toFixed(5); // ~18.10597 -- reproduces imp-34413 / imp-34468
const K_THREE_PCT = +bisectCrossing(3.0, 18.1, 19.5).toFixed(5); // ~18.49677 -- imp-34468 3% rung
const K_EIGHT_PCT = +bisectCrossing(8.0, 18.5, 20.0).toFixed(5); // ~19.03440 -- imp-34468 8% rung
const K_FIFTEEN_PCT = +bisectCrossing(15.0, 19.0, 20.5).toFixed(5); // ~19.44328 -- NEW exact 15% crossing
const K_TWENTY_PCT = +bisectCrossing(20.0, 19.5, 20.8).toFixed(5); // ~19.63682 -- NEW exact 20% crossing

// ---- 2. The extended 1%/3%/8%/15%/20% ladder and per-pp spacing compression ----
const LADDER = [
  { threshold: 1, k: K_ONE_PCT },
  { threshold: 3, k: K_THREE_PCT },
  { threshold: 8, k: K_EIGHT_PCT },
  { threshold: 15, k: K_FIFTEEN_PCT },
  { threshold: 20, k: K_TWENTY_PCT },
];
const SPACING_8_TO_15 = +(K_FIFTEEN_PCT - K_EIGHT_PCT).toFixed(4); // ~0.4089 decades
const SPACING_15_TO_20 = +(K_TWENTY_PCT - K_FIFTEEN_PCT).toFixed(4); // ~0.1935 decades
// spacing per threshold percentage-point falls monotonically toward the pole
const PER_PP = [];
for (let i = 1; i < LADDER.length; i++) {
  PER_PP.push(
    +((LADDER[i].k - LADDER[i - 1].k) / (LADDER[i].threshold - LADDER[i - 1].threshold)).toFixed(4),
  );
} // ~[0.1954, 0.1075, 0.0584, 0.0387] decades/pp -- strictly decreasing
let PER_PP_MONOTONE_DECREASING = true;
for (let i = 1; i < PER_PP.length; i++) {
  if (PER_PP[i] >= PER_PP[i - 1]) PER_PP_MONOTONE_DECREASING = false;
}
const DECADES_BELOW_POLE_20PCT = +(K_STAR - K_TWENTY_PCT).toFixed(3); // ~1.644 -- 20% rung still below the pole
const LADDER_MONOTONE =
  K_ONE_PCT < K_THREE_PCT &&
  K_THREE_PCT < K_EIGHT_PCT &&
  K_EIGHT_PCT < K_FIFTEEN_PCT &&
  K_FIFTEEN_PCT < K_TWENTY_PCT;

// ---- 3. Fit leak(k) to the single-pole form: effective exponent p and 1/leak-root pole recovery ----
// log leak vs log(k* - k): a pure order-p pole gives slope -p. Sample rising branches at 3 windows.
function poleExponent(kLo, kHi, dk) {
  const lx = [];
  const ly = [];
  for (let k = kLo; k <= kHi + 1e-9; k += dk) {
    lx.push(Math.log(K_STAR - k));
    ly.push(Math.log(leakPct(k)));
  }
  return -olsSlope(lx, ly);
}
const P_EXP_WIDE = +poleExponent(18.5, 20.9, 0.05).toFixed(4); // ~2.124 -- measured window is steeper than order 1
const P_EXP_MID = +poleExponent(20.0, 21.1, 0.02).toFixed(4); // ~1.3907 -- exponent collapsing toward 1
const P_EXP_NEAR = +poleExponent(20.8, 21.2, 0.01).toFixed(4); // ~1.1442 -- approaches a SIMPLE (order-1) pole at k*
// 1/leak linear root: pure simple pole leak = B/(k* - k) => 1/leak linear in k with root at k = k*.
function invLeakRoot(kLo, kHi, dk) {
  const xs = [];
  const ys = [];
  for (let k = kLo; k <= kHi + 1e-9; k += dk) {
    xs.push(k);
    ys.push(1 / leakPct(k));
  }
  const s = olsSlope(xs, ys);
  return -olsIntercept(xs, ys, s) / s;
}
const KSTAR_FIT_WINDOW = +invLeakRoot(18.0, 20.6, 0.1).toFixed(5); // ~19.981 -- naive pre-pole fit UNDERSHOOTS
const KSTAR_FIT_NEAR = +invLeakRoot(20.7, 21.15, 0.01).toFixed(5); // ~21.224 -- recovers the pole as window tightens
const KSTAR_FIT_CLOSEST = +invLeakRoot(21.0, 21.18, 0.005).toFixed(5); // ~21.263 -- -> inherited 21.28095
const EXPONENT_COLLAPSES_TO_ONE = P_EXP_WIDE > P_EXP_MID && P_EXP_MID > P_EXP_NEAR && P_EXP_NEAR < 1.2;
const FIT_RECOVERS_POLE = KSTAR_FIT_WINDOW < KSTAR_FIT_NEAR && KSTAR_FIT_NEAR < KSTAR_FIT_CLOSEST;

export const IMP34512_POLE_LEAKAGE_FIT_15_20_PERCENT_CROSSINGS = {
  id: 'imp-34512',
  proofSection: 'S-frontier',
  question:
    'imp-34468 bisected the pole-leakage ladder to {1%: k~18.106, 3%: k~18.497, 8%: k~19.034} but never ' +
    'fit leak(k) = 100 |dy/dk(k) - P| / |P| to the pole form A/(k* - k) + P nor located rungs above 8%. ' +
    'Fit leak(k) to the single-pole form, check the recovered k* against the inherited imp-34023 pole ' +
    'k* ~ 21.28095, and bisect the next 15% and 20% rungs to extend the ladder toward the pole. ' +
    'Measurement / threshold-location + fit only; component model NOT rigorous; no bound change; NO QED.',
  measuredQuantity:
    'The exact k where leak(k) crosses 15% and 20% on its rising pole-side branch (each bisected to ' +
    '5 decimals), plus the effective pole exponent p of leak(k) ~ (k* - k)^(-p) across three windows and ' +
    'the 1/leak-root recovery of the pole, characterising how well a single simple pole fits leak(k)',
  poleLocation: +K_STAR.toFixed(5), // ~21.28095 (imp-34023 / imp-34247 / imp-34468 k*)
  plateau: +PLATEAU.toFixed(4), // ~ -0.977 clean far-field plateau
  fifteenPctCrossingK: K_FIFTEEN_PCT, // ~19.44328 -- NEW exact 15% crossing
  twentyPctCrossingK: K_TWENTY_PCT, // ~19.63682 -- NEW exact 20% crossing
  ladder: LADDER, // {1,3,8,15,20}% crossings {18.106, 18.497, 19.034, 19.443, 19.637}
  spacing8to15: SPACING_8_TO_15, // ~0.4089 decades
  spacing15to20: SPACING_15_TO_20, // ~0.1935 decades
  spacingPerPp: PER_PP, // ~[0.1954, 0.1075, 0.0584, 0.0387] decades/pp -- strictly decreasing
  spacingPerPpMonotoneDecreasing: PER_PP_MONOTONE_DECREASING, // true -- branch steepens toward the pole
  decadesBelowPole20pct: DECADES_BELOW_POLE_20PCT, // ~1.644 -- the 20% rung still sits below the pole
  ladderMonotone: LADDER_MONOTONE, // 1% < 3% < 8% < 15% < 20%
  poleExponentWide: P_EXP_WIDE, // ~2.124 over [18.5,20.9] -- measured window steeper than order 1
  poleExponentMid: P_EXP_MID, // ~1.3907 over [20.0,21.1] -- collapsing toward 1
  poleExponentNear: P_EXP_NEAR, // ~1.1442 over [20.8,21.2] -- approaching a SIMPLE pole at k*
  kStarFitWindow: KSTAR_FIT_WINDOW, // ~19.981 -- naive pre-pole 1/leak fit UNDERSHOOTS the true pole
  kStarFitNear: KSTAR_FIT_NEAR, // ~21.224 -- recovers the pole as window tightens onto k*
  kStarFitClosest: KSTAR_FIT_CLOSEST, // ~21.263 -- -> inherited 21.28095
  exponentCollapsesToOne: EXPONENT_COLLAPSES_TO_ONE, // p: 2.12 -> 1.39 -> 1.14 as k -> k*
  fitRecoversPole: FIT_RECOVERS_POLE, // recovered k*: 19.98 -> 21.22 -> 21.26 as window tightens
  finding: {
    R1_fifteen_twenty_percent_crossings:
      'Bisecting leak(k) = 15 and leak(k) = 20 on the rising pole-side branch gives k ~ 19.44328 and ' +
      'k ~ 19.63682, extending the imp-34468 ladder to five rungs {1: 18.106, 3: 18.497, 8: 19.034, ' +
      '15: 19.443, 20: 19.637}, strictly increasing, all below the pole k* ~ 21.281 (the 20% rung still ' +
      '~1.644 decades below it).',
    R2_spacing_compresses_per_pp:
      'Decade spacings 1->3 ~0.391, 3->8 ~0.538, 8->15 ~0.409, 15->20 ~0.194; normalised per threshold ' +
      'percentage-point they fall monotonically (~0.195, 0.108, 0.058, 0.039 decades/pp) -- the branch is ' +
      'steepening toward the pole, so ever-larger leak increments compress into shorter k intervals.',
    R3_single_pole_only_asymptotic:
      'A single simple pole A/(k* - k) + P does NOT fit the measured 1%-20% window: the effective ' +
      'exponent p in leak ~ (k* - k)^(-p) is ~2.12 over [18.5,20.9] (steeper than order 1) and a naive ' +
      '1/leak linear-root undershoots to k*_fit ~ 19.98. BUT p collapses monotonically toward 1 as ' +
      'k -> k* (2.12 -> 1.39 -> 1.14) and the 1/leak root recovers the pole as the window tightens onto ' +
      'it (19.98 -> 21.22 -> 21.26), confirming the imp-34023 residExp singularity is a genuine SIMPLE ' +
      'pole and IS the k -> k* driver, consistent with the inherited 21.28095. The single-pole form is an ' +
      'ASYMPTOTIC statement, not a global fit of the pre-pole window.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / THRESHOLD-LOCATION + FIT (frontier-direction, NOT rigorous). Bisecting the imp-34247 ' +
    'pole-leakage metric leak(k) = 100 |dy/dk(k) - P| / |P| extends the imp-34468 {1,3,8}% ladder with a ' +
    '15% crossing k ~ 19.44328 and a 20% crossing k ~ 19.63682, giving {18.106, 18.497, 19.034, 19.443, ' +
    '19.637}, all below the pole k* ~ 21.28095. Fitting leak(k) to A/(k* - k) + P shows the single simple ' +
    'pole is only the ASYMPTOTIC (k -> k*) behaviour: the measured window has effective exponent ~2.12 and ' +
    'a naive 1/leak-root undershoots to ~19.98, but the exponent collapses toward 1 (2.12 -> 1.39 -> 1.14) ' +
    'and the recovered pole -> 21.26 as the window tightens onto k*, confirming the imp-34023 residExp ' +
    'singularity is a genuine simple pole and the k -> k* driver. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a ' +
    'numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34468 (the 1%/3%/8% ladder {18.106,18.497,19.034} extended here); imp-34413 (R1 1% crossing ' +
    'k~18.106); imp-34247 (R3 contaminationLadder devPct -- the metric fit here); imp-34188 (the ' +
    'widening-slope surrogate); imp-34023 (residExp simple pole k* ~ 21.281); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34512_POLE_LEAKAGE_FIT_15_20_PERCENT_CROSSINGS_ASSERTIONS = [
  {
    // The pole and plateau match imp-34247 / imp-34468, and the 1% crossing reproduces imp-34413 / imp-34468.
    id: 'imp34512-inherited-metric-reproduces-imp34468',
    description: 'k* ~ 21.281, P ~ -0.977 match imp-34247; the 1% crossing reproduces imp-34468 k~18.106',
    holds: () =>
      K_STAR > 21.27 &&
      K_STAR < 21.29 &&
      PLATEAU < -0.9 &&
      PLATEAU > -1.05 &&
      Math.abs(K_ONE_PCT - 18.106) < 0.01,
  },
  {
    // (R1) The 15% crossing is bisected near k ~ 19.443, and leak there is ~15%.
    id: 'imp34512-fifteen-percent-crossing-located',
    description: 'leak(k)=15% crossing k ~ 19.443, above the imp-34468 8% rung k~19.034',
    holds: () =>
      K_FIFTEEN_PCT > 19.3 &&
      K_FIFTEEN_PCT < 19.6 &&
      Math.abs(K_FIFTEEN_PCT - 19.443) < 0.01 &&
      K_FIFTEEN_PCT > K_EIGHT_PCT &&
      leakPct(K_FIFTEEN_PCT) > 14.99 &&
      leakPct(K_FIFTEEN_PCT) < 15.01,
  },
  {
    // (R1) The 20% crossing is bisected near k ~ 19.637, and leak there is ~20%; still below the pole.
    id: 'imp34512-twenty-percent-crossing-located',
    description: 'leak(k)=20% crossing k ~ 19.637, ~1.644 decades below the pole k* ~ 21.281',
    holds: () =>
      K_TWENTY_PCT > 19.5 &&
      K_TWENTY_PCT < 19.8 &&
      Math.abs(K_TWENTY_PCT - 19.637) < 0.01 &&
      leakPct(K_TWENTY_PCT) > 19.99 &&
      leakPct(K_TWENTY_PCT) < 20.01 &&
      DECADES_BELOW_POLE_20PCT > 1.5 &&
      DECADES_BELOW_POLE_20PCT < 1.8,
  },
  {
    // (R2) The five-rung ladder is strictly monotone and the per-pp spacing compresses toward the pole.
    id: 'imp34512-ladder-monotone-spacing-compresses',
    description: 'the {1,3,8,15,20}% ladder strictly increases and the per-pp spacing decreases monotonically',
    holds: () =>
      LADDER_MONOTONE === true &&
      PER_PP_MONOTONE_DECREASING === true &&
      SPACING_8_TO_15 > SPACING_15_TO_20,
  },
  {
    // (R3) The single-pole fit is only asymptotic: exponent -> 1 and recovered k* -> 21.28 as k -> k*.
    id: 'imp34512-single-pole-only-asymptotic',
    description: 'effective exponent collapses 2.12->1.39->1.14 toward 1 and 1/leak root recovers k* toward 21.28',
    holds: () =>
      P_EXP_WIDE > 1.8 &&
      EXPONENT_COLLAPSES_TO_ONE === true &&
      FIT_RECOVERS_POLE === true &&
      KSTAR_FIT_WINDOW < 20.5 &&
      Math.abs(KSTAR_FIT_CLOSEST - K_STAR) < 0.05,
  },
  {
    // Honesty gate: measurement + fit only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34512-honesty-gate-no-qed',
    description: 'measurement/fit only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34512_POLE_LEAKAGE_FIT_15_20_PERCENT_CROSSINGS.isRigorous === false &&
      /NO QED/.test(IMP34512_POLE_LEAKAGE_FIT_15_20_PERCENT_CROSSINGS.verdict) &&
      /refereed bound is changed/i.test(IMP34512_POLE_LEAKAGE_FIT_15_20_PERCENT_CROSSINGS.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34512_POLE_LEAKAGE_FIT_15_20_PERCENT_CROSSINGS.verdict),
  },
];

for (const a of IMP34512_POLE_LEAKAGE_FIT_15_20_PERCENT_CROSSINGS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34512-pole-leakage-fit-15-20-percent-crossings assertion failed: ${a.id}`);
  }
}
