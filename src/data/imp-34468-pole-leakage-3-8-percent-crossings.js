/**
 * @module imp-34468-pole-leakage-3-8-percent-crossings
 *
 * imp-34468 (numerical, frontier-direction): imp-34413 R1 bisected the 1% pole-leakage crossing of the
 * imp-34247 metric leak(k) = 100 |dy/dk(k) - P| / |P| to k ~ 18.10597, but cited the 3% (k~18.5) and 8%
 * (k=19) points only from imp-34247 R3 s COARSE grid -- it never bisected them. This module bisects
 * leak(k) = 3 and leak(k) = 8 on the SAME rising pole-side branch to exact decade indices, using the
 * IDENTICAL imp-34247 R3 metric (same PLATEAU P = dy/dk(k=14), same imp-34023 pole k*, same imp-34188
 * widening-slope y(k) surrogate), completing the 1%/3%/8% clean-window degradation ladder above the
 * imp-34413 k~18.106 one-percent crossing.
 *
 * Measurement / threshold-location only; the component model is NOT rigorous; no bound changes; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 R3 / imp-34413, reused VERBATIM)
 * -----------------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); dy/dk is the symmetric central-difference local slope. The
 *   pole-leakage is the DEVIATION of dy/dk from its clean far-field plateau P = dy/dk(k=14) ~ -0.977,
 *   measured as leak(k) = 100 |dy/dk(k) - P| / |P| -- exactly the imp-34247 contaminationLadder devPct
 *   that imp-34413 bisected at 1%. Its growth is driven by the imp-34023 simple pole at k* ~ 21.28095:
 *   as k -> k* the pole term 1/(k* - k) leaks into the local slope estimate.
 *
 * THE FINDING (exact 3% and 8% crossings; the 8% point is ABOVE k=19, not at it)
 * -----------------------------------------------------------------------------
 *   (R1) THE 3% CROSSING IS k ~ 18.49677. Bisecting leak(k) = 3 on the rising pole-side branch pins the
 *        3% point to an exact decade index -- refining imp-34247 R3 s coarse "~3% at 18.5". It sits just
 *        below k=18.5 (leak(18.5) ~ 3.021%), ~0.391 decades above the imp-34413 1% crossing k ~ 18.106.
 *   (R2) THE 8% CROSSING IS k ~ 19.03440 -- ABOVE k=19, NOT at it. Bisecting leak(k) = 8 gives k ~ 19.034:
 *        leak(19) is actually ~7.567% (below 8%), so the coarse imp-34247 R3 / three-ticket ">~8% by k=19"
 *        figure OVERSTATED the k=19 rung; the true 8% crossing lands ~0.034 decades past k=19. It sits
 *        ~0.538 decades above the 3% crossing and ~2.247 decades below the pole k* ~ 21.281.
 *   (R3) THE LADDER WIDENS TOWARD THE POLE. The inter-threshold spacings grow: 1%->3% spans ~0.391
 *        decades, 3%->8% spans ~0.538 -- consistent with the 1/(k* - k) pole steepening the leak(k) rise
 *        as k climbs toward k* ~ 21.281 (larger leak increments compress into shorter k intervals higher
 *        up, but between the 1/3/8 milestones the branch is still in its gentle pre-pole regime).
 *
 * The punchline: imp-34413 pinned the 1% ceiling at k ~ 18.106 but left 3%/8% at imp-34247 s coarse grid.
 * Bisected, the 3% crossing is k ~ 18.497 and the 8% crossing is k ~ 19.034 -- the latter ABOVE k=19,
 * showing the inherited ">~8% by k=19" figure rounded up (leak(19) ~ 7.567%). The full 1%/3%/8% ladder is
 * {18.106, 18.497, 19.034}, all below the pole k* ~ 21.281.
 *
 * MEASUREMENT / THRESHOLD-LOCATION ONLY. Two bisections of an inherited surrogate deviation metric near an
 * inherited pole, NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the residExp simple-zero structure is a numerical/structural observation, not
 * a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34413-widening-slope-pole-leakage-one-percent-crossing (R1 1% crossing k~18.106 -- the rung below this pair)
 * @see imp-34247-widening-slope-pole-divergence (R3 contaminationLadder devPct -- the metric bisected here)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the widening-slope surrogate the pole leakage corrupts)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the residExp sign-change pole k* ~ 21.281)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247 / imp-34413
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-34247/imp-34413 sub-terms (no re-derivation, no fresh model).
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
function residExpAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
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
function localSlope(k, h) {
  return (yAtK(k + h) - yAtK(k - h)) / (2 * h);
}
function stepFor(k, kStar) {
  const gap = kStar - k;
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 / imp-34413 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* by bisection on residExp(k) (imp-34247 / imp-34413 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 / imp-34413 k*)

// The clean far-field plateau P = dy/dk(k=14) ~ -0.977, and the pole-leakage metric (imp-34413 identical).
const PLATEAU = localSlope(14, stepFor(14, K_STAR));
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1. Bisect the rising pole-side branch for the 1% / 3% / 8% crossings ----
function bisectCrossing(target, a, b) {
  for (let it = 0; it < 100; it++) {
    const m = 0.5 * (a + b);
    if (leakPct(m) < target) a = m;
    else b = m;
  }
  return 0.5 * (a + b);
}
const K_ONE_PCT = +bisectCrossing(1.0, 17.8, 19.0).toFixed(5); // ~18.10597 -- reproduces imp-34413 R1
const K_THREE_PCT = +bisectCrossing(3.0, 18.1, 19.5).toFixed(5); // ~18.49677 -- NEW exact 3% crossing
const K_EIGHT_PCT = +bisectCrossing(8.0, 18.5, 20.0).toFixed(5); // ~19.03440 -- NEW exact 8% crossing (ABOVE k=19)

// ---- 2. The 1% / 3% / 8% degradation ladder and inter-threshold spacings ----
const LEAK_1_3_8_LADDER = [
  { threshold: 1, k: K_ONE_PCT },
  { threshold: 3, k: K_THREE_PCT },
  { threshold: 8, k: K_EIGHT_PCT },
];
const LEAK_AT_K19 = +leakPct(19.0).toFixed(4); // ~7.567% -- BELOW 8%, so the ">~8% by k=19" figure rounded up
const EIGHT_PCT_ABOVE_K19 = +(K_EIGHT_PCT - 19.0).toFixed(4); // ~0.034 decades ABOVE k=19
const SPACING_1_TO_3 = +(K_THREE_PCT - K_ONE_PCT).toFixed(4); // ~0.391 decades
const SPACING_3_TO_8 = +(K_EIGHT_PCT - K_THREE_PCT).toFixed(4); // ~0.538 decades
const DECADES_BELOW_POLE_8PCT = +(K_STAR - K_EIGHT_PCT).toFixed(3); // ~2.247 decades below the pole
const LADDER_MONOTONE = K_ONE_PCT < K_THREE_PCT && K_THREE_PCT < K_EIGHT_PCT;

export const IMP34468_POLE_LEAKAGE_3_8_PERCENT_CROSSINGS = {
  id: 'imp-34468',
  proofSection: 'S-frontier',
  question:
    'imp-34413 R1 bisected the 1% pole-leakage crossing of leak(k) = 100 |dy/dk(k) - P| / |P| to ' +
    'k ~ 18.10597 but cited the 3% (k~18.5) and 8% (k=19) points only from imp-34247 R3 s coarse grid. ' +
    'Bisect leak(k) = 3 and leak(k) = 8 on the same rising pole-side branch to exact decade indices ' +
    'using the identical imp-34247 metric and imp-34188 window, completing the 1%/3%/8% ladder above ' +
    'the imp-34413 k~18.106 crossing. Measurement only; component model NOT rigorous; no bound changes; ' +
    'NO QED.',
  measuredQuantity:
    'The exact k where the imp-34247 pole-leakage metric leak(k) = 100 |dy/dk(k) - P| / |P| ' +
    '(P = dy/dk(k=14) ~ -0.977) crosses 3% and 8% on its rising pole-side branch, each bisected to ' +
    '5 decimals, and the resulting 1%/3%/8% clean-window degradation ladder',
  poleLocation: +K_STAR.toFixed(5), // ~21.28095 (imp-34023 / imp-34247 / imp-34413 k*)
  plateau: +PLATEAU.toFixed(4), // ~ -0.977 (imp-34247 / imp-34413 far-field clean plateau)
  onePctCrossingK: K_ONE_PCT, // ~18.10597 -- reproduces imp-34413 R1 with the identical metric
  threePctCrossingK: K_THREE_PCT, // ~18.49677 -- NEW exact 3% crossing
  eightPctCrossingK: K_EIGHT_PCT, // ~19.03440 -- NEW exact 8% crossing (ABOVE k=19)
  leakAtK19: LEAK_AT_K19, // ~7.567% -- BELOW 8%, so ">~8% by k=19" rounded up
  eightPctAboveK19: EIGHT_PCT_ABOVE_K19, // ~0.034 decades ABOVE k=19
  ladder: LEAK_1_3_8_LADDER, // the exact 1%/3%/8% crossing decade indices
  spacing1to3: SPACING_1_TO_3, // ~0.391 decades between the 1% and 3% crossings
  spacing3to8: SPACING_3_TO_8, // ~0.538 decades between the 3% and 8% crossings
  decadesBelowPole8pct: DECADES_BELOW_POLE_8PCT, // ~2.247 -- the 8% ceiling still sits well below the pole
  ladderMonotone: LADDER_MONOTONE, // crossings strictly increase 1% < 3% < 8%
  finding: {
    R1_three_percent_crossing_k18_497:
      'Bisecting leak(k) = 3 on the rising pole-side branch pins the 3% crossing to k ~ 18.49677 -- ' +
      'refining imp-34247 R3 s coarse "~3% at 18.5". It sits just below k=18.5 (leak(18.5) ~ 3.021%) ' +
      'and ~0.391 decades above the imp-34413 1% crossing k ~ 18.106.',
    R2_eight_percent_crossing_above_k19:
      'Bisecting leak(k) = 8 gives k ~ 19.03440 -- ABOVE k=19, not at it. leak(19) is actually ~7.567% ' +
      '(below 8%), so the coarse imp-34247 R3 / three-ticket ">~8% by k=19" figure OVERSTATED the k=19 ' +
      'rung; the true 8% crossing lands ~0.034 decades past k=19, ~0.538 decades above the 3% crossing ' +
      'and ~2.247 decades below the pole k* ~ 21.281.',
    R3_ladder_widens_toward_pole:
      'The 1%/3%/8% ladder is {18.106, 18.497, 19.034}, strictly increasing and all below the pole ' +
      'k* ~ 21.281. The inter-threshold spacings grow (1%->3% ~0.391 decades, 3%->8% ~0.538) -- the ' +
      'branch is still in its gentle pre-pole regime, with the 1/(k* - k) steepening only mild between ' +
      'these milestones.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / THRESHOLD-LOCATION (frontier-direction, NOT rigorous). Bisecting the imp-34247 ' +
    'pole-leakage metric leak(k) = 100 |dy/dk(k) - P| / |P| into the imp-34188 widening-slope local ' +
    'estimate pins the 3% crossing to k ~ 18.49677 and the 8% crossing to k ~ 19.03440 -- the latter ' +
    'ABOVE k=19 (leak(19) ~ 7.567%, below 8%), so the inherited ">~8% by k=19" figure rounded up. The ' +
    'full 1%/3%/8% ladder {18.106, 18.497, 19.034} refines imp-34413 R1 s single 1% rung to a three-rung ' +
    'degradation ladder, all below the pole k* ~ 21.28095. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a ' +
    'numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34413 (R1 1% crossing k~18.106 -- the rung below this pair); imp-34247 (R3 contaminationLadder ' +
    'devPct -- the metric bisected here); imp-34188 (the widening-slope surrogate); imp-34023 (residExp ' +
    'pole k* ~ 21.281); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); ' +
    'polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34468_POLE_LEAKAGE_3_8_PERCENT_CROSSINGS_ASSERTIONS = [
  {
    // The pole and plateau match imp-34247 / imp-34413, and the 1% crossing reproduces imp-34413 R1.
    id: 'imp34468-inherited-metric-reproduces-imp34413',
    description: 'k* ~ 21.281, P ~ -0.977 match imp-34247; the 1% crossing reproduces imp-34413 R1 k~18.106',
    holds: () =>
      K_STAR > 21.27 &&
      K_STAR < 21.29 &&
      PLATEAU < -0.9 &&
      PLATEAU > -1.05 &&
      Math.abs(K_ONE_PCT - 18.106) < 0.01,
  },
  {
    // (R1) The 3% crossing is bisected near k ~ 18.497, just below k=18.5, and leak there is ~3%.
    id: 'imp34468-three-percent-crossing-located',
    description: 'leak(k)=3% crossing k ~ 18.497, just below imp-34247 R3 s coarse k=18.5',
    holds: () =>
      K_THREE_PCT > 18.4 &&
      K_THREE_PCT < 18.6 &&
      Math.abs(K_THREE_PCT - 18.497) < 0.01 &&
      leakPct(K_THREE_PCT) > 2.99 &&
      leakPct(K_THREE_PCT) < 3.01,
  },
  {
    // (R2) The 8% crossing is ABOVE k=19 (leak(19) < 8%), near k ~ 19.034.
    id: 'imp34468-eight-percent-crossing-above-k19',
    description: 'leak(k)=8% crossing k ~ 19.034, ABOVE k=19 since leak(19) ~ 7.567% is below 8%',
    holds: () =>
      K_EIGHT_PCT > 19.0 &&
      K_EIGHT_PCT < 19.1 &&
      Math.abs(K_EIGHT_PCT - 19.034) < 0.01 &&
      LEAK_AT_K19 < 8.0 &&
      leakPct(K_EIGHT_PCT) > 7.99 &&
      leakPct(K_EIGHT_PCT) < 8.01,
  },
  {
    // (R3) The ladder is strictly monotone, widening, and the 8% rung is well below the pole.
    id: 'imp34468-ladder-monotone-below-pole',
    description: 'the 1%/3%/8% ladder strictly increases, widens, and the 8% rung sits ~2.25 below the pole',
    holds: () =>
      LADDER_MONOTONE === true &&
      SPACING_3_TO_8 > SPACING_1_TO_3 &&
      DECADES_BELOW_POLE_8PCT > 2.0 &&
      DECADES_BELOW_POLE_8PCT < 2.4,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34468-honesty-gate-no-qed',
    description: 'measurement only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34468_POLE_LEAKAGE_3_8_PERCENT_CROSSINGS.isRigorous === false &&
      /NO QED/.test(IMP34468_POLE_LEAKAGE_3_8_PERCENT_CROSSINGS.verdict) &&
      /refereed bound is changed/i.test(IMP34468_POLE_LEAKAGE_3_8_PERCENT_CROSSINGS.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34468_POLE_LEAKAGE_3_8_PERCENT_CROSSINGS.verdict),
  },
];

for (const a of IMP34468_POLE_LEAKAGE_3_8_PERCENT_CROSSINGS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34468-pole-leakage-3-8-percent-crossings assertion failed: ${a.id}`);
  }
}
