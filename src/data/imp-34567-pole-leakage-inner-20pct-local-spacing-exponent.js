/**
 * @module imp-34567-pole-leakage-inner-20pct-local-spacing-exponent
 *
 * imp-34567 (numerical, frontier-direction): imp-34548 measured the LOCAL per-pp spacing exponent
 * p_local = d(log s)/d(log(k* - k)) between each adjacent pair of the four imp-34530 interval midpoints
 * and found it FALLING monotonically toward the imp-34023 pole k* ~ 21.281 -- p_local ~ [3.527, 2.928,
 * 2.578] at pair-midpoint pole distances [2.747, 2.279, 1.892] -- with the near-edge value (~2.578, the
 * pair nearest the 20% rung) lying BELOW the global cubic (~3.004). That below-cubic sign is the driver
 * of the imp-34530 R3 forward-integration undershoot (true spacing decays SLOWER than the global law so
 * rungs climb faster). But the imp-34548 ladder STOPS at the nearest 20% rung, so the trend just inside
 * that edge -- does p_local keep descending below the cubic toward k*, or does it turn back up? -- is
 * never resolved.
 *
 * This module adds ONE tighter rung INSIDE the 20% edge (a 25% leak-crossing, verbatim imp-34548
 * bisection machinery) so a NEW spacing point (the 20-25% interval) and a NEW near-pole local exponent
 * (between the 15-20% and 20-25% pairs) can be measured, and reports whether p_local keeps falling below
 * the global cubic toward the pole or turns. It reuses the IDENTICAL imp-34247 metric, imp-34188 y(k)
 * surrogate, and imp-34023 pole VERBATIM (the same primitives as imp-34468 / imp-34512 / imp-34530 /
 * imp-34548), reproducing the imp-34548 {1,3,8,15,20}% ladder and its three inherited local exponents.
 *
 * Measurement only; the component model is NOT rigorous; no bound changes; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 R3 / imp-34468 / imp-34512 / imp-34530 / imp-34548, reused VERBATIM)
 * -----------------------------------------------------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); dy/dk is the symmetric central-difference local slope. The
 *   pole-leakage is the DEVIATION of dy/dk from its clean far-field plateau P = dy/dk(k=14) ~ -0.977,
 *   measured as leak(k) = 100 |dy/dk(k) - P| / |P|, driven by the imp-34023 simple pole at k* ~ 21.281.
 *   The per-pp spacing over an interval [k_i, k_{i+1}] is s = (k_{i+1} - k_i) / (pct_{i+1} - pct_i),
 *   assigned to the interval-midpoint pole distance k* - k_mid (imp-34530 convention). p_local between two
 *   adjacent spacing points is d(log s)/d(log(k* - k)) as a finite difference.
 *
 * THE FINDING (p_local KEEPS FALLING below the global cubic just inside the 20% edge -- it does NOT turn)
 * ---------------------------------------------------------------------------------------------------
 *   (R1) THE NEW 25% RUNG SITS AT k ~ 19.7864 (own pole distance ~1.4945), just inside the 20% rung
 *        (k ~ 19.6368, own pole distance ~1.6441). Its 20-25% per-pp spacing is ~0.02993 decades/pp
 *        (at interval-midpoint pole distance ~1.5693), below the 15-20% spacing (~0.03871), continuing
 *        the monotone compression toward the pole.
 *   (R2) THE NEW NEAR-POLE LOCAL EXPONENT (between the 15-20% and 20-25% pairs) IS p_local ~ 2.480 at
 *        pair-midpoint pole distance ~1.655 -- BELOW the previous near-edge value (~2.578) and well below
 *        the global cubic (~3.00). So p_local KEEPS DESCENDING below the cubic toward k*; it does NOT turn
 *        back up at this rung. The imp-34548 "falling toward k*" trend PERSISTS just inside the 20% edge.
 *   (R3) THE DESCENT IS DECELERATING. The successive pair-to-pair drops in p_local are ~[0.599, 0.349,
 *        0.099] (3.527 -> 2.928 -> 2.578 -> 2.480); the newest drop (~0.099) is far smaller than the two
 *        before it. So while p_local has not yet turned, its rate of fall is collapsing -- consistent with
 *        a floor/turn onsetting just beyond this rung, but that turn is NOT yet resolved in-window. The
 *        near-k* faster-than-cubic steepening the imp-34530 R3 undershoot needs is still not visible here.
 *
 * The punchline: adding a 25% rung inside the 20% edge extends the imp-34548 local-exponent ladder to
 * p_local ~ [3.527, 2.928, 2.578, 2.480]. The near-pole local exponent KEEPS FALLING below the global
 * cubic toward k* (2.578 -> 2.480), so the imp-34548 downtrend persists just inside the 20% edge and does
 * NOT turn; but the fall is DECELERATING sharply (drops ~[0.599, 0.349, 0.099]), so any turn or floor --
 * and the faster steepening the imp-34530 R3 undershoot requires -- must still live even closer to k*.
 *
 * MEASUREMENT ONLY. One extra finite-difference local exponent of an inherited surrogate deviation
 * metric's per-pp spacing near an inherited pole, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-pole structure is a
 * numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34548-pole-leakage-local-spacing-exponent (the four-midpoint local-exponent ladder extended here)
 * @see imp-34530-pole-leakage-spacing-compression-fit (the GLOBAL cubic fit)
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
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247 / imp-34548
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-34247/imp-34548 sub-terms (no re-derivation, no fresh model).
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
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 / imp-34548 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* (imp-34247 / imp-34548 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 / imp-34548 k*)

const PLATEAU = localSlope(14, stepFor(14, K_STAR)); // ~ -0.977 clean far-field plateau
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1. Reproduce the imp-34548 five-rung {1,3,8,15,20}% ladder VERBATIM, then add the inner 25% rung ----
function bisectCrossing(target, a, b) {
  for (let it = 0; it < 100; it++) {
    const m = 0.5 * (a + b);
    if (leakPct(m) < target) a = m;
    else b = m;
  }
  return 0.5 * (a + b);
}
const K_ONE_PCT = bisectCrossing(1.0, 17.8, 19.0); // ~18.10597 -- imp-34548 1% rung
const K_THREE_PCT = bisectCrossing(3.0, 18.1, 19.5); // ~18.49677 -- imp-34548 3% rung
const K_EIGHT_PCT = bisectCrossing(8.0, 18.5, 20.0); // ~19.03440 -- imp-34548 8% rung
const K_FIFTEEN_PCT = bisectCrossing(15.0, 19.0, 20.5); // ~19.44328 -- imp-34548 15% rung
const K_TWENTY_PCT = bisectCrossing(20.0, 19.5, 20.8); // ~19.63682 -- imp-34548 20% rung
const K_TWENTYFIVE_PCT = bisectCrossing(25.0, 19.63, 20.5); // ~19.78645 -- NEW inner-20% rung (this module)
const LADDER = [
  { threshold: 1, k: K_ONE_PCT },
  { threshold: 3, k: K_THREE_PCT },
  { threshold: 8, k: K_EIGHT_PCT },
  { threshold: 15, k: K_FIFTEEN_PCT },
  { threshold: 20, k: K_TWENTY_PCT },
  { threshold: 25, k: K_TWENTYFIVE_PCT }, // NEW rung inside the 20% edge
];

// ---- 2. Per-pp spacing s vs interval-midpoint pole distance (imp-34530 / imp-34548 VERBATIM, +1 point) ----
const SPACING_PTS = [];
for (let i = 1; i < LADDER.length; i++) {
  const s = (LADDER[i].k - LADDER[i - 1].k) / (LADDER[i].threshold - LADDER[i - 1].threshold);
  const midK = 0.5 * (LADDER[i].k + LADDER[i - 1].k);
  SPACING_PTS.push({ perPp: s, poleDist: K_STAR - midK });
} // perPp ~ [0.19540, 0.10752, 0.05841, 0.03871, 0.02993], poleDist ~ [2.97958, 2.51536, 2.04211, 1.74090, 1.56932]

// ---- 3. GLOBAL cubic fit s = A (k* - k)^p over all spacing points (window-average baseline) ----
const LX = SPACING_PTS.map((p) => Math.log(p.poleDist));
const LY = SPACING_PTS.map((p) => Math.log(p.perPp));
const GLOBAL_EXPONENT = olsSlope(LX, LY); // ~2.906 with the inner rung (window-average, cubic-ish)

// ---- 4. LOCAL exponent between each adjacent pair of spacing midpoints (imp-34548, +1 near-pole pair) ----
// p_local = d(log s) / d(log(k* - k)) as a finite difference of consecutive spacing points, assigned to
// the pair-midpoint pole distance. Ordering is by increasing k, i.e. SHRINKING pole distance: index 0
// (1-3 vs 3-8 pair) is farthest from k*, the new final index (15-20 vs 20-25 pair) is nearest k*.
const LOCAL_EXPONENTS = [];
for (let i = 1; i < SPACING_PTS.length; i++) {
  const dLogS = Math.log(SPACING_PTS[i].perPp) - Math.log(SPACING_PTS[i - 1].perPp);
  const dLogD = Math.log(SPACING_PTS[i].poleDist) - Math.log(SPACING_PTS[i - 1].poleDist);
  const pLocal = dLogS / dLogD;
  const midPoleDist = 0.5 * (SPACING_PTS[i].poleDist + SPACING_PTS[i - 1].poleDist);
  LOCAL_EXPONENTS.push({ pLocal, midPoleDist });
} // pLocal ~ [3.527, 2.928, 2.578, 2.480] at midPoleDist ~ [2.747, 2.279, 1.892, 1.655]

// ---- 5. Does the near-pole local exponent keep falling below the cubic, or turn? ----
const INHERITED_NEAR_EDGE = LOCAL_EXPONENTS[LOCAL_EXPONENTS.length - 2].pLocal; // ~2.578 (imp-34548 near-edge)
const NEW_NEAR_POLE = LOCAL_EXPONENTS[LOCAL_EXPONENTS.length - 1].pLocal; // ~2.480 (this module, inside 20%)
const KEEPS_FALLING = NEW_NEAR_POLE < INHERITED_NEAR_EDGE; // true -- p_local keeps descending toward k*
const STILL_BELOW_GLOBAL = NEW_NEAR_POLE < GLOBAL_EXPONENT; // true -- new near-pole exponent below the cubic
const TURNS_UP = NEW_NEAR_POLE > INHERITED_NEAR_EDGE; // false -- it does NOT turn back up at this rung
// Successive pair-to-pair drops; the descent is DECELERATING if the newest drop is the smallest.
const DROPS = [];
for (let i = 1; i < LOCAL_EXPONENTS.length; i++) {
  DROPS.push(LOCAL_EXPONENTS[i - 1].pLocal - LOCAL_EXPONENTS[i].pLocal);
} // ~[0.599, 0.349, 0.099]
const NEWEST_DROP = DROPS[DROPS.length - 1]; // ~0.099
const PREV_DROP = DROPS[DROPS.length - 2]; // ~0.349
const DESCENT_DECELERATING = NEWEST_DROP < PREV_DROP && NEWEST_DROP > 0; // true -- fall is collapsing, not yet a turn

const rnd = (x, n) => +x.toFixed(n);

export const IMP34567_POLE_LEAKAGE_INNER_20PCT_LOCAL_SPACING_EXPONENT = {
  id: 'imp-34567',
  proofSection: 'S-frontier',
  question:
    'imp-34548 measured the LOCAL per-pp spacing exponent p_local = d(log s)/d(log(k* - k)) between the ' +
    'four imp-34530 interval midpoints as FALLING toward the imp-34023 pole k* ~ 21.281 -- p_local ~ ' +
    '[3.527, 2.928, 2.578], with the near-edge value (~2.578) below the global cubic (~3.00) -- but the ' +
    'ladder STOPS at the nearest 20% rung. Add one tighter rung INSIDE the 20% edge (a 25% leak-crossing, ' +
    'verbatim imp-34548 machinery) and measure whether p_local keeps falling below the cubic toward k* or ' +
    'turns back up, sharpening the imp-34530 R3 undershoot driver. Measurement only; component model NOT ' +
    'rigorous; no bound change; NO QED.',
  measuredQuantity:
    'The 25% leak-crossing rung inside the 20% edge, its 20-25% per-pp spacing point, the NEW near-pole ' +
    'local spacing exponent p_local between the 15-20% and 20-25% pairs, and whether p_local keeps falling ' +
    'below the global cubic toward k* or turns -- with the successive pair-to-pair drops quantifying the trend',
  poleLocation: rnd(K_STAR, 5), // ~21.28095 (imp-34023 / imp-34247 / imp-34548 k*)
  plateau: rnd(PLATEAU, 4), // ~ -0.977 clean far-field plateau
  ladder: LADDER.map((r) => ({ threshold: r.threshold, k: rnd(r.k, 5) })), // {1,3,8,15,20,25}% rungs
  innerRung: { threshold: 25, k: rnd(K_TWENTYFIVE_PCT, 5), poleDist: rnd(K_STAR - K_TWENTYFIVE_PCT, 5) }, // ~19.78645 / own pole dist ~1.4945
  spacingPoints: SPACING_PTS.map((p) => ({ perPp: rnd(p.perPp, 5), poleDist: rnd(p.poleDist, 5) })),
  globalExponent: rnd(GLOBAL_EXPONENT, 4), // ~2.906 -- window-average cubic-ish over all six rungs
  localExponents: LOCAL_EXPONENTS.map((e) => ({
    pLocal: rnd(e.pLocal, 4),
    midPoleDist: rnd(e.midPoleDist, 4),
  })), // ~[{3.527,2.747},{2.928,2.279},{2.578,1.892},{2.480,1.655}]
  inheritedNearEdgeExponent: rnd(INHERITED_NEAR_EDGE, 4), // ~2.578 -- imp-34548 near-edge (15-20 pair)
  newNearPoleExponent: rnd(NEW_NEAR_POLE, 4), // ~2.480 -- NEW inside the 20% edge (15-20 / 20-25 pair)
  drops: DROPS.map((d) => rnd(d, 4)), // ~[0.599, 0.349, 0.099] -- successive pair-to-pair descents
  keepsFalling: KEEPS_FALLING, // true -- p_local keeps descending below the cubic toward k*
  turnsUp: TURNS_UP, // false -- it does NOT turn back up at this rung
  stillBelowGlobalCubic: STILL_BELOW_GLOBAL, // true -- new near-pole exponent below the global cubic
  descentDecelerating: DESCENT_DECELERATING, // true -- the fall is collapsing (newest drop is smallest), not yet a turn
  finding: {
    R1_inner_rung_and_spacing:
      'The new 25% rung sits at k ~ 19.7864 (own pole distance ~1.4945), just inside the 20% rung ' +
      '(k ~ 19.6368, own pole distance ~1.6441); its 20-25% per-pp spacing ~0.02993 decades/pp (at ' +
      'interval-midpoint pole distance ~1.5693) lies below the 15-20% spacing (~0.03871), continuing the ' +
      'monotone compression toward the pole.',
    R2_local_exponent_keeps_falling_below_cubic:
      'The NEW near-pole local exponent (between the 15-20% and 20-25% pairs) is p_local ~ 2.480 at ' +
      'pair-midpoint pole distance ~1.655 -- BELOW the inherited near-edge value (~2.578) and well below the ' +
      'global cubic (~2.91/3.00). So p_local KEEPS DESCENDING below the cubic toward k*; it does NOT turn back ' +
      'up at this rung. The imp-34548 falling-toward-k* trend PERSISTS just inside the 20% edge.',
    R3_descent_decelerating_turn_not_yet_resolved:
      'The successive pair-to-pair drops in p_local are ~[0.599, 0.349, 0.099] (3.527 -> 2.928 -> 2.578 -> ' +
      '2.480); the newest drop (~0.099) is far smaller than the two before it, so the descent is DECELERATING ' +
      'sharply. p_local has not yet turned, but its rate of fall is collapsing -- consistent with a floor/turn ' +
      'onsetting just beyond this rung, unresolved in-window; the faster-than-cubic steepening the imp-34530 R3 ' +
      'undershoot requires is still not visible here.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Adding one tighter rung inside the 20% edge (a 25% ' +
    'leak-crossing at k ~ 19.786, own pole distance ~1.494) extends the imp-34548 local-exponent ladder to ' +
    'p_local ~ [3.527, 2.928, 2.578, 2.480]. The NEW near-pole local exponent (~2.480) KEEPS FALLING below ' +
    'the inherited near-edge value (~2.578) and well below the global cubic (~2.91/3.00), so the imp-34548 ' +
    'downtrend PERSISTS just inside the 20% edge and does NOT turn back up at this rung; but the fall is ' +
    'DECELERATING sharply (successive drops ~[0.599, 0.349, 0.099]), so any turn or floor -- and the faster ' +
    'near-k* steepening the imp-34530 R3 forward-integration undershoot requires -- must live even closer to ' +
    'k*, unresolved by this rung. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the residExp simple-pole structure is a numerical/structural observation, not a ' +
    'derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34548 (the four-midpoint local-exponent ladder extended here); imp-34530 (the GLOBAL cubic fit); ' +
    'imp-34512 (R2 per-pp spacing compression; the {1,3,8,15,20}% ladder); imp-34468 (the 1%/3%/8% ladder); ' +
    'imp-34247 (R3 contaminationLadder devPct -- the metric reused); imp-34188 (the widening-slope surrogate); ' +
    'imp-34023 (residExp simple pole k* ~ 21.281); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34567_POLE_LEAKAGE_INNER_20PCT_LOCAL_SPACING_EXPONENT_ASSERTIONS = [
  {
    // The pole, plateau, and 20% rung reproduce imp-34548 (identical inherited metric).
    id: 'imp34567-inherited-metric-reproduces-imp34548',
    description: 'k* ~ 21.281, P ~ -0.977, and the 20% rung k ~ 19.637 reproduce imp-34548',
    holds: () =>
      K_STAR > 21.27 &&
      K_STAR < 21.29 &&
      PLATEAU < -0.9 &&
      PLATEAU > -1.05 &&
      Math.abs(K_TWENTY_PCT - 19.63682) < 0.01,
  },
  {
    // The three inherited adjacent-pair local exponents reproduce imp-34548 (~[3.527, 2.928, 2.578]).
    id: 'imp34567-inherited-local-exponents-reproduce-imp34548',
    description: 'the first three local exponents reproduce imp-34548 ~[3.527, 2.928, 2.578]',
    holds: () =>
      LOCAL_EXPONENTS.length === 4 &&
      Math.abs(LOCAL_EXPONENTS[0].pLocal - 3.527) < 0.05 &&
      Math.abs(LOCAL_EXPONENTS[1].pLocal - 2.928) < 0.05 &&
      Math.abs(LOCAL_EXPONENTS[2].pLocal - 2.578) < 0.05,
  },
  {
    // (R1) The new 25% rung sits inside the 20% edge: above the 20% rung k and below k*, pole dist < 1.741.
    id: 'imp34567-inner-25pct-rung-inside-20-edge',
    description: 'the 25% rung k ~ 19.786 lies above the 20% rung and below k*, pole distance ~1.569 < 1.741',
    holds: () =>
      K_TWENTYFIVE_PCT > K_TWENTY_PCT &&
      K_TWENTYFIVE_PCT < K_STAR &&
      Math.abs(K_TWENTYFIVE_PCT - 19.78645) < 0.02 &&
      K_STAR - K_TWENTYFIVE_PCT < K_STAR - K_TWENTY_PCT,
  },
  {
    // (R2) The new near-pole local exponent keeps falling below the inherited near-edge and the global cubic.
    id: 'imp34567-near-pole-exponent-keeps-falling-below-cubic',
    description: 'new near-pole p_local ~2.480 < inherited near-edge ~2.578 and < global cubic; does NOT turn up',
    holds: () =>
      KEEPS_FALLING === true &&
      TURNS_UP === false &&
      STILL_BELOW_GLOBAL === true &&
      Math.abs(NEW_NEAR_POLE - 2.48) < 0.05,
  },
  {
    // (R3) The descent is decelerating: newest pair-to-pair drop is the smallest positive one.
    id: 'imp34567-descent-decelerating-not-yet-turned',
    description: 'successive drops ~[0.599, 0.349, 0.099]; the newest is smallest but positive (not a turn)',
    holds: () =>
      DESCENT_DECELERATING === true &&
      DROPS.length === 3 &&
      NEWEST_DROP > 0 &&
      NEWEST_DROP < PREV_DROP,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34567-honesty-gate-no-qed',
    description: 'measurement only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34567_POLE_LEAKAGE_INNER_20PCT_LOCAL_SPACING_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP34567_POLE_LEAKAGE_INNER_20PCT_LOCAL_SPACING_EXPONENT.verdict) &&
      /refereed bound is changed/i.test(IMP34567_POLE_LEAKAGE_INNER_20PCT_LOCAL_SPACING_EXPONENT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34567_POLE_LEAKAGE_INNER_20PCT_LOCAL_SPACING_EXPONENT.verdict),
  },
];

for (const a of IMP34567_POLE_LEAKAGE_INNER_20PCT_LOCAL_SPACING_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34567-pole-leakage-inner-20pct-local-spacing-exponent assertion failed: ${a.id}`);
  }
}
