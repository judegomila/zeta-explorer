/**
 * @module imp-34548-pole-leakage-local-spacing-exponent
 *
 * imp-34548 (numerical, frontier-direction): imp-34530 R1 fit the pole-leakage per-pp threshold spacing
 * to a single GLOBAL power law s = A (k* - k)^p with p ~ 3.00 (R^2 ~ 0.996), but R3 found it UNDERSHOOTS
 * the directly-bisected 25%/30% crossings because the branch steepens near the imp-34023 pole k* ~ 21.281.
 * That global fit averages the exponent over the whole window and never reports how the LOCAL exponent
 * varies across the four interval midpoints. This module computes the LOCAL exponent p_local between each
 * adjacent pair of the four imp-34530 interval-midpoint spacing points (a finite-difference of log s vs
 * log(k* - k)) and MEASURES whether p_local rises monotonically as the pole distance shrinks -- directly
 * quantifying the exponent variation the single global cubic averages over. It reuses the IDENTICAL
 * imp-34247 metric, imp-34188 y(k) surrogate, and imp-34023 pole VERBATIM (the same primitives as
 * imp-34468 / imp-34512 / imp-34530).
 *
 * Measurement only; the component model is NOT rigorous; no bound changes; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 R3 / imp-34468 / imp-34512 / imp-34530, reused VERBATIM)
 * -----------------------------------------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); dy/dk is the symmetric central-difference local slope. The
 *   pole-leakage is the DEVIATION of dy/dk from its clean far-field plateau P = dy/dk(k=14) ~ -0.977,
 *   measured as leak(k) = 100 |dy/dk(k) - P| / |P|, driven by the imp-34023 simple pole at k* ~ 21.281.
 *   The per-pp spacing over an interval [k_i, k_{i+1}] is s = (k_{i+1} - k_i) / (pct_{i+1} - pct_i),
 *   assigned to the interval-midpoint pole distance k* - k_mid (imp-34530 convention).
 *
 * THE FINDING (the LOCAL spacing exponent FALLS across the window -- it does NOT rise toward k*)
 * --------------------------------------------------------------------------------------------
 *   (R1) THE THREE ADJACENT-PAIR LOCAL EXPONENTS ARE p_local ~ [3.527, 2.928, 2.578], FALLING
 *        MONOTONICALLY as the pair-midpoint pole distance shrinks (2.747 -> 2.279 -> 1.892). So the
 *        LOCAL exponent does NOT rise toward the pole across the measured window; it DECREASES. The
 *        global cubic p ~ 3.004 is a window-average sitting BETWEEN the far-field local value (~3.53)
 *        and the near-edge local value (~2.58).
 *   (R2) THE NEAR-EDGE LOCAL EXPONENT (~2.578, the 8-15 / 15-20 pair nearest the 20% rung) LIES BELOW
 *        THE GLOBAL CUBIC (~3.004). A local exponent below the fitted cubic means the true spacing near
 *        the 20% rung decays SLOWER than the global law predicts, so the true steps stay larger and the
 *        rungs climb faster than the fit -- which is exactly the direction of imp-34530 R3s observed
 *        forward-integration UNDERSHOOT of the directly-bisected 25%/30% crossings.
 *   (R3) THEREFORE THE NEAR-k* STEEPENING THAT DRIVES THE imp-34530 R3 UNDERSHOOT IS NOT VISIBLE IN THE
 *        IN-WINDOW MIDPOINT LOCAL EXPONENTS, WHICH FALL. Any faster-than-cubic steepening can only onset
 *        in the extrapolation region BEYOND the 20% rung (pole distance below ~1.74), which these four
 *        interval midpoints do not resolve. The single global cubic thus conflates a falling in-window
 *        local exponent with a distinct beyond-window steepening.
 *
 * The punchline: measuring the LOCAL per-pp spacing exponent between the four imp-34530 interval
 * midpoints gives p_local ~ [3.527, 2.928, 2.578] -- FALLING monotonically toward the pole, NOT rising.
 * The near-edge local exponent (~2.58) is BELOW the global cubic (~3.00), which is precisely the sign
 * that makes imp-34530 R3s forward integration UNDERSHOOT the true 25%/30% crossings. The global cubic
 * averages a falling in-window exponent; the faster steepening it undershoots must live beyond the 20% rung.
 *
 * MEASUREMENT ONLY. A finite-difference local exponent of an inherited surrogate deviation metrics
 * per-pp spacing near an inherited pole, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-pole structure is a
 * numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34530-pole-leakage-spacing-compression-fit (the GLOBAL cubic fit whose local structure is resolved here)
 * @see imp-34512-pole-leakage-fit-15-20-percent-crossings (R2 per-pp spacing compression; the {1,3,8,15,20}% ladder)
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

// ---- 2. Per-pp spacing s vs interval-midpoint pole distance (imp-34530 VERBATIM) ----
const SPACING_PTS = [];
for (let i = 1; i < LADDER.length; i++) {
  const s = (LADDER[i].k - LADDER[i - 1].k) / (LADDER[i].threshold - LADDER[i - 1].threshold);
  const midK = 0.5 * (LADDER[i].k + LADDER[i - 1].k);
  SPACING_PTS.push({ perPp: s, poleDist: K_STAR - midK });
} // perPp ~ [0.19540, 0.10752, 0.05841, 0.03871], poleDist ~ [2.97958, 2.51536, 2.04211, 1.74090]

// ---- 3. GLOBAL cubic fit s = A (k* - k)^p (imp-34530 R1, reproduced for the window-average baseline) ----
const LX = SPACING_PTS.map((p) => Math.log(p.poleDist));
const LY = SPACING_PTS.map((p) => Math.log(p.perPp));
const GLOBAL_EXPONENT = olsSlope(LX, LY); // ~3.004 -- the single window-average cubic

// ---- 4. LOCAL exponent between each adjacent pair of the four midpoints (this module) ----
// p_local = d(log s) / d(log(k* - k)) as a finite difference of consecutive spacing points, assigned
// to the pair-midpoint pole distance. Ordering is by increasing k, i.e. SHRINKING pole distance:
// index 0 (1-3 vs 3-8 pair) is farthest from k*, index 2 (8-15 vs 15-20 pair) is nearest the 20% rung.
const LOCAL_EXPONENTS = [];
for (let i = 1; i < SPACING_PTS.length; i++) {
  const dLogS = Math.log(SPACING_PTS[i].perPp) - Math.log(SPACING_PTS[i - 1].perPp);
  const dLogD = Math.log(SPACING_PTS[i].poleDist) - Math.log(SPACING_PTS[i - 1].poleDist);
  const pLocal = dLogS / dLogD;
  const midPoleDist = 0.5 * (SPACING_PTS[i].poleDist + SPACING_PTS[i - 1].poleDist);
  LOCAL_EXPONENTS.push({ pLocal, midPoleDist });
} // pLocal ~ [3.527, 2.928, 2.578] at midPoleDist ~ [2.747, 2.279, 1.892]

// ---- 5. Monotonicity + relation to the global cubic ----
// "Toward k*" == shrinking pole distance == increasing index. The hypothesised RISE would be
// pLocal strictly increasing with index; we MEASURE the actual direction.
let risesTowardPole = true;
let fallsTowardPole = true;
for (let i = 1; i < LOCAL_EXPONENTS.length; i++) {
  if (!(LOCAL_EXPONENTS[i].pLocal > LOCAL_EXPONENTS[i - 1].pLocal)) risesTowardPole = false;
  if (!(LOCAL_EXPONENTS[i].pLocal < LOCAL_EXPONENTS[i - 1].pLocal)) fallsTowardPole = false;
}
const NEAR_FIELD_EXPONENT = LOCAL_EXPONENTS[0].pLocal; // ~3.527 -- farthest from k*
const NEAR_EDGE_EXPONENT = LOCAL_EXPONENTS[LOCAL_EXPONENTS.length - 1].pLocal; // ~2.578 -- nearest 20% rung
// The near-edge local exponent lying BELOW the global cubic is the sign that drives the imp-34530 R3
// forward-integration undershoot (true spacing decays slower than the global law => rungs climb faster).
const NEAR_EDGE_BELOW_GLOBAL = NEAR_EDGE_EXPONENT < GLOBAL_EXPONENT;
const GLOBAL_BETWEEN_LOCAL = GLOBAL_EXPONENT < NEAR_FIELD_EXPONENT && GLOBAL_EXPONENT > NEAR_EDGE_EXPONENT;

const rnd = (x, n) => +x.toFixed(n);

export const IMP34548_POLE_LEAKAGE_LOCAL_SPACING_EXPONENT = {
  id: 'imp-34548',
  proofSection: 'S-frontier',
  question:
    'imp-34530 R1 fit the pole-leakage per-pp threshold spacing to a single GLOBAL power law ' +
    's = A (k* - k)^p with p ~ 3.00, but R3 found it undershoots the directly-bisected 25%/30% crossings ' +
    'as the branch steepens toward the imp-34023 pole k* ~ 21.281. Compute the LOCAL exponent p_local ' +
    'between each adjacent pair of the four imp-34530 interval-midpoint spacing points (finite-difference ' +
    'of log s vs log(k* - k)) and measure whether p_local rises monotonically toward k* -- quantifying the ' +
    'exponent variation the single global cubic averages over. Measurement only; component model NOT ' +
    'rigorous; no bound change; NO QED.',
  measuredQuantity:
    'The three adjacent-pair local spacing exponents p_local = d(log s)/d(log(k* - k)) across the four ' +
    'imp-34530 interval midpoints, their monotonicity direction as the pole distance shrinks, and their ' +
    'relation to the single global cubic exponent p ~ 3.004',
  poleLocation: rnd(K_STAR, 5), // ~21.28095 (imp-34023 / imp-34247 / imp-34530 k*)
  plateau: rnd(PLATEAU, 4), // ~ -0.977 clean far-field plateau
  ladder: LADDER.map((r) => ({ threshold: r.threshold, k: rnd(r.k, 5) })), // {1,3,8,15,20}% rungs (imp-34512)
  spacingPoints: SPACING_PTS.map((p) => ({ perPp: rnd(p.perPp, 5), poleDist: rnd(p.poleDist, 5) })),
  globalExponent: rnd(GLOBAL_EXPONENT, 4), // ~3.004 -- the single window-average cubic (imp-34530 R1)
  localExponents: LOCAL_EXPONENTS.map((e) => ({
    pLocal: rnd(e.pLocal, 4),
    midPoleDist: rnd(e.midPoleDist, 4),
  })), // ~[{3.527,2.747},{2.928,2.279},{2.578,1.892}]
  nearFieldExponent: rnd(NEAR_FIELD_EXPONENT, 4), // ~3.527 -- farthest from k*
  nearEdgeExponent: rnd(NEAR_EDGE_EXPONENT, 4), // ~2.578 -- nearest the 20% rung
  risesTowardPole: risesTowardPole, // false -- the hypothesised monotone rise does NOT occur
  fallsTowardPole: fallsTowardPole, // true -- p_local FALLS monotonically as the pole distance shrinks
  nearEdgeBelowGlobal: NEAR_EDGE_BELOW_GLOBAL, // true -- near-edge local exponent < global cubic
  globalBetweenLocal: GLOBAL_BETWEEN_LOCAL, // true -- the cubic sits between the near-field and near-edge locals
  finding: {
    R1_local_exponent_falls_not_rises:
      'The three adjacent-pair local exponents are p_local ~ [3.527, 2.928, 2.578], FALLING monotonically ' +
      'as the pair-midpoint pole distance shrinks (2.747 -> 2.279 -> 1.892). The local spacing exponent ' +
      'does NOT rise toward the pole across the measured window; it DECREASES. The global cubic p ~ 3.004 ' +
      'is a window-average sitting between the far-field local value (~3.53) and the near-edge value (~2.58).',
    R2_near_edge_below_global_drives_undershoot:
      'The near-edge local exponent (~2.578, the 8-15 / 15-20 pair nearest the 20% rung) lies BELOW the ' +
      'global cubic (~3.004). A local exponent below the fitted cubic means the true spacing near the 20% ' +
      'rung decays slower than the global law predicts, so the true steps stay larger and the rungs climb ' +
      'faster than the fit -- exactly the direction of imp-34530 R3s forward-integration undershoot of the ' +
      'directly-bisected 25%/30% crossings.',
    R3_steepening_is_beyond_window:
      'The near-k* steepening that drives the imp-34530 R3 undershoot is therefore NOT visible in the ' +
      'in-window midpoint local exponents, which fall. Any faster-than-cubic steepening can only onset in ' +
      'the extrapolation region beyond the 20% rung (pole distance below ~1.74), unresolved by these four ' +
      'interval midpoints. The single global cubic conflates a falling in-window local exponent with a ' +
      'distinct beyond-window steepening.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Computing the LOCAL per-pp spacing exponent between ' +
    'the four imp-34530 interval midpoints gives p_local ~ [3.527, 2.928, 2.578] -- FALLING monotonically ' +
    'as the pole distance shrinks (2.747 -> 2.279 -> 1.892), NOT rising toward k*. The global cubic ' +
    'p ~ 3.004 is a window-average sitting between the far-field (~3.53) and near-edge (~2.58) local ' +
    'exponents; the near-edge value below the cubic is precisely the sign that makes imp-34530 R3s forward ' +
    'integration UNDERSHOOT the directly-bisected 25%/30% crossings, so the faster near-k* steepening must ' +
    'live beyond the 20% rung, unresolved by these midpoints. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-pole structure is a ' +
    'numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34530 (the GLOBAL cubic fit whose local structure is resolved here); imp-34512 (R2 per-pp ' +
    'spacing compression; the {1,3,8,15,20}% ladder); imp-34468 (the 1%/3%/8% ladder); imp-34247 (R3 ' +
    'contaminationLadder devPct -- the metric reused); imp-34188 (the widening-slope surrogate); ' +
    'imp-34023 (residExp simple pole k* ~ 21.281); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34548_POLE_LEAKAGE_LOCAL_SPACING_EXPONENT_ASSERTIONS = [
  {
    // The pole, plateau, and 20% rung reproduce imp-34530 (identical inherited metric).
    id: 'imp34548-inherited-metric-reproduces-imp34530',
    description: 'k* ~ 21.281, P ~ -0.977, and the 20% rung k ~ 19.637 reproduce imp-34530',
    holds: () =>
      K_STAR > 21.27 &&
      K_STAR < 21.29 &&
      PLATEAU < -0.9 &&
      PLATEAU > -1.05 &&
      Math.abs(K_TWENTY_PCT - 19.63682) < 0.01,
  },
  {
    // The global window-average cubic reproduces imp-34530 R1 (~3.004).
    id: 'imp34548-global-cubic-reproduces-imp34530',
    description: 'the single window-average exponent reproduces imp-34530 R1 p ~ 3.004',
    holds: () => GLOBAL_EXPONENT > 2.7 && GLOBAL_EXPONENT < 3.3,
  },
  {
    // (R1) The three local exponents fall monotonically toward the pole -- they do NOT rise.
    id: 'imp34548-local-exponent-falls-not-rises',
    description: 'p_local ~ [3.527, 2.928, 2.578] falls monotonically as pole distance shrinks; does not rise',
    holds: () =>
      LOCAL_EXPONENTS.length === 3 &&
      fallsTowardPole === true &&
      risesTowardPole === false &&
      Math.abs(LOCAL_EXPONENTS[0].pLocal - 3.527) < 0.05 &&
      Math.abs(LOCAL_EXPONENTS[1].pLocal - 2.928) < 0.05 &&
      Math.abs(LOCAL_EXPONENTS[2].pLocal - 2.578) < 0.05,
  },
  {
    // (R2) The near-edge local exponent lies below the global cubic (the undershoot sign) and the
    // cubic sits between the near-field and near-edge local values.
    id: 'imp34548-near-edge-below-global-cubic',
    description: 'near-edge local exponent (~2.58) < global cubic (~3.00); cubic sits between the local extremes',
    holds: () =>
      NEAR_EDGE_BELOW_GLOBAL === true &&
      GLOBAL_BETWEEN_LOCAL === true &&
      NEAR_EDGE_EXPONENT < NEAR_FIELD_EXPONENT,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34548-honesty-gate-no-qed',
    description: 'measurement only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34548_POLE_LEAKAGE_LOCAL_SPACING_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP34548_POLE_LEAKAGE_LOCAL_SPACING_EXPONENT.verdict) &&
      /refereed bound is changed/i.test(IMP34548_POLE_LEAKAGE_LOCAL_SPACING_EXPONENT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34548_POLE_LEAKAGE_LOCAL_SPACING_EXPONENT.verdict),
  },
];

for (const a of IMP34548_POLE_LEAKAGE_LOCAL_SPACING_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34548-pole-leakage-local-spacing-exponent assertion failed: ${a.id}`);
  }
}
