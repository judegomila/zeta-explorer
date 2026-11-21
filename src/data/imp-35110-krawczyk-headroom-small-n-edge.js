/**
 * @module imp-35110-krawczyk-headroom-small-n-edge
 *
 * imp-35110 (numerical, frontier): imp-34996 carried the strictly-decreasing Krawczyk contraction-validity
 * headroom S(N) = star_over_H2(N) = G/((1+G) delta FP_LO) to N -> infinity and found the closed-form floor
 * S_inf = 1/(2 delta) = 2500, concluding the 100x safety factor is NEVER exhausted in the monotone-decreasing
 * large-N tail. imp-34996 ALSO asserted (heuristically) that falling below 100x would need the gain
 * G/(1+G) ~ 0.02 (a ~ 0.96) which "occurs only at SMALL N outside the admissible regime" -- but it never
 * LOCATED that small-N edge. This module locates it explicitly on the SAME surrogate and checks it sits below
 * the imp-34693 admissible seed band-bottom.
 *
 * WHAT THE MEASUREMENT FINDS (a HONEST SHARPENING of the imp-34996 heuristic)
 * -------------------------------------------------------------------------
 * The contraction factor a(N) = 2 pi K/(T0 u) is strictly DECREASING in N, so decreasing N drives a UP toward
 * 1. Two small-N landmarks, both strictly below the band-bottom, bracket the degenerate regime:
 *   (1) THE GAIN-0.02 EDGE. The bounded gain G/(1+G) = (1-a)/(2-a) reaches 0.02 at a ~ 0.97959, i.e.
 *       N_gain ~ 1.5058e8 -- ~1.31 decades below the imp-34693 band-bottom N_bot ~ 3.1090e9. So the gain edge
 *       the imp-34996 heuristic pointed at IS real and IS strictly outside the admissible band, CONFIRMING the
 *       spatial claim: the only direction that could touch the safety factor is small-N, below the band.
 *   (2) THE FP_LO POLE. BUT at the gain-0.02 edge the headroom is NOT ~100x -- it is S ~ 4947x (still 49x the
 *       safety factor). The reason: the imp-34996 "gain ~ 0.02 => S ~ 100" step silently assumed FP_LO ~ 1,
 *       which FAILS near a = 1, because FP_LO = 1 - a(N(1-delta)) COLLAPSES in lockstep with the gain. As N
 *       falls toward a = 1, gain and FP_LO shrink TOGETHER and their ratio stays O(1), so S does NOT descend
 *       to 100 -- instead S DIVERGES to +infinity at the pole N_pole ~ 1.4753e8 where a(N(1-delta)) = 1
 *       exactly (a(N_pole) ~ 0.99980), then flips negative in the unphysical a > 1 region. The pole is ~1.32
 *       decades below the band-bottom.
 *
 * CONSEQUENCE: THE 100x FACTOR IS UNREACHABLE IN BOTH DIRECTIONS ON THE PHYSICAL BRANCH
 * ------------------------------------------------------------------------------------
 * On the entire physical (a < 1, admissible) branch, S(N) is monotone-decreasing in N from a +infinity pole
 * at N_pole down to the floor S_inf = 2500 -- it NEVER dips below 2500. imp-34996 showed this for the large-N
 * tail; this module shows the small-N direction does NOT expose a sub-100x crossing either: S rises (toward
 * ~5000 and then a pole) rather than falling. So the sub-safety-factor regime the imp-34996 heuristic imagined
 * does NOT exist as an S = 100 crossing anywhere on the admissible branch. The literal gain-0.02 landmark
 * exists and is below the band (confirming the spatial claim), but the S-below-100 conclusion drawn from it is
 * an FP_LO ~ 1 artifact -- the true small-N failure mode of the surrogate is an FP_LO pole (dg_kstar/dN
 * evaluation degeneracy), not a smooth descent below the safety factor.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; reproduces the imp-34996
 * machinery (identical K, delta, N_cross, band). The imp-34714a machine certificate REMAINS OPEN; F(m) = 0
 * stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (the S_inf = 1/(2 delta) large-N floor this pairs)
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form dS/dN < 0; strictly decreasing S)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band; supplies the band-bottom N_bot)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34883/34929/34996)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const SAFETY_FACTOR = 100; // the imp-34799/34817 contraction-validity safety factor

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-34996).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
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

const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883/34929/34996)
const R_HALF = rho(1, WIDEST_BAND_K);
const BAND_BOTTOM = N_CROSS - R_HALF; // smallest admissible N (imp-34693 seed band-bottom)

// The bounded contraction gain G/(1+G) = (1-a)/(2-a) in [0, 1/2] (imp-34817/34929).
const gainAt = (N) => {
  const G = 1 - aOf(N);
  return G / (1 + G);
};
// star_over_H2(N) = G/((1+G) delta FP_LO), the contraction-validity headroom (imp-34929/34996).
function headroomAt(N) {
  const G = 1 - aOf(N);
  const FP_LO = 1 - aOf(N * (1 - DELTA));
  return G / ((1 + G) * DELTA * FP_LO);
}

// a(N) is strictly decreasing in N: bisect for the N at which a(N) = target.
function nForA(target, lo, hi) {
  for (let i = 0; i < 300; i++) {
    const m = Math.sqrt(lo * hi);
    if (aOf(m) > target) lo = m;
    else hi = m;
  }
  return Math.sqrt(lo * hi);
}

// Landmark (2): the FP_LO pole. FP_LO = 1 - a(N(1-delta)) = 0 <=> a(N(1-delta)) = 1 <=> N(1-delta) = nForA(1).
const N_AT_A1 = nForA(1.0, 1e6, BAND_BOTTOM); // N where a(N) = 1 exactly
const N_POLE = N_AT_A1 / (1 - DELTA); // headroom S(N) -> +infinity here (FP_LO -> 0)
const A_AT_POLE = aOf(N_POLE); // ~0.99980 (physical, a < 1) at the pole
const POLE_DECADES_BELOW_BAND = Math.log10(BAND_BOTTOM) - Math.log10(N_POLE); // ~1.32

// Landmark (1): the gain-0.02 edge. gain increases with N (a decreases), so bisect above the pole.
function nForGain(target, lo, hi) {
  for (let i = 0; i < 300; i++) {
    const m = Math.sqrt(lo * hi);
    if (gainAt(m) < target) lo = m;
    else hi = m;
  }
  return Math.sqrt(lo * hi);
}
const N_GAIN_002 = nForGain(0.02, N_POLE * 1.001, BAND_BOTTOM); // ~1.5058e8
const A_AT_GAIN_002 = aOf(N_GAIN_002); // ~0.97959
const S_AT_GAIN_002 = headroomAt(N_GAIN_002); // ~4947 (NOT ~100 -- the FP_LO ~ 1 heuristic fails)
const GAIN_EDGE_DECADES_BELOW_BAND = Math.log10(BAND_BOTTOM) - Math.log10(N_GAIN_002); // ~1.31

// Physical-branch minimum of S: sweep from just above the pole to 1e12; confirm S never dips below 2500.
const S_INF = 1 / (2 * DELTA); // 2500 exactly
let MIN_S_PHYSICAL = Infinity;
const SWEEP_LO = Math.log10(N_POLE * 1.0005);
const SWEEP_HI = 12;
const SWEEP_POINTS = 60000;
for (let i = 0; i <= SWEEP_POINTS; i++) {
  const logN = SWEEP_LO + ((SWEEP_HI - SWEEP_LO) * i) / SWEEP_POINTS;
  const N = Math.pow(10, logN);
  const S = headroomAt(N);
  if (Number.isFinite(S) && S < MIN_S_PHYSICAL) MIN_S_PHYSICAL = S;
}
const PHYSICAL_BRANCH_NEVER_BELOW_SAFETY = MIN_S_PHYSICAL > SAFETY_FACTOR;
const PHYSICAL_BRANCH_NEVER_BELOW_FLOOR = MIN_S_PHYSICAL > S_INF - 1e-2;

export const IMP35110_KRAWCZYK_HEADROOM_SMALL_N_EDGE = {
  id: 'imp-35110',
  proofSection: 'S-frontier',
  question:
    'imp-34996 asserted the sub-100x regime for the Krawczyk headroom S(N) = G/((1+G) delta FP_LO) lies at ' +
    'SMALL N (gain G/(1+G) ~ 0.02, a ~ 0.96) outside the imp-34693 admissible band, but never located that ' +
    'edge. Locate it explicitly on the same surrogate and check it sits below the band-bottom. Measurement ' +
    'only; surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The gain-0.02 landmark IS real and IS strictly below the imp-34693 band-bottom (N_gain ~ 1.506e8, ~1.31 ' +
    'decades below N_bot ~ 3.109e9), CONFIRMING the imp-34996 spatial claim that the degenerate direction is ' +
    'small-N outside the admissible band. HOWEVER the headroom at that edge is S ~ 4947 (49x the safety ' +
    'factor), NOT ~100: the imp-34996 "gain ~ 0.02 => S ~ 100" step assumed FP_LO ~ 1, which fails near a = 1 ' +
    'because FP_LO = 1 - a(N(1-delta)) collapses in lockstep with the gain. As N falls toward a = 1 the ratio ' +
    'gain/FP_LO stays O(1), so S does NOT descend to 100 -- it DIVERGES to +infinity at the pole ' +
    'N_pole ~ 1.475e8 (a(N(1-delta)) = 1, ~1.32 decades below the band-bottom) then flips negative in the ' +
    'unphysical a > 1 region. On the whole physical (a < 1) branch S is monotone-decreasing in N from the ' +
    '+infinity pole down to the floor 2500 and NEVER dips below 2500 -- so the 100x factor is unreachable in ' +
    'BOTH the large-N tail (imp-34996) AND the small-N direction. The sub-100x regime does not exist as an ' +
    'S = 100 crossing on the admissible branch; the true small-N failure mode is an FP_LO pole, not a smooth ' +
    'descent below the safety factor. EVIDENCE / measurement, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    delta: DELTA,
    safety_factor: SAFETY_FACTOR,
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    gain_002_edge_N: +N_GAIN_002.toPrecision(12), // ~1.5058e8
    gain_002_edge_a: +A_AT_GAIN_002.toFixed(6), // ~0.979592
    gain_002_edge_headroom_S: +S_AT_GAIN_002.toFixed(2), // ~4947.32 (NOT ~100)
    gain_002_edge_decades_below_band_bottom: +GAIN_EDGE_DECADES_BELOW_BAND.toFixed(4), // ~1.3148
    gain_002_edge_below_band_bottom: N_GAIN_002 < BAND_BOTTOM, // true
    fp_lo_pole_N: +N_POLE.toPrecision(12), // ~1.4753e8
    fp_lo_pole_a: +A_AT_POLE.toFixed(6), // ~0.999801
    fp_lo_pole_decades_below_band_bottom: +POLE_DECADES_BELOW_BAND.toFixed(4), // ~1.3238
    fp_lo_pole_below_band_bottom: N_POLE < BAND_BOTTOM, // true
    physical_branch_min_headroom_S: +MIN_S_PHYSICAL.toFixed(4), // ~2500 (the floor, never below)
    physical_branch_never_below_safety_factor: PHYSICAL_BRANCH_NEVER_BELOW_SAFETY, // true
    physical_branch_never_below_floor: PHYSICAL_BRANCH_NEVER_BELOW_FLOOR, // true
  },
  subGap:
    'imp-34714a REMAINS OPEN. Locating the gain-0.02 edge and the FP_LO pole below the band-bottom, and ' +
    'confirming S never dips below 2500 on the physical branch, does NOT prove a directed-rounding ' +
    '[g](m)/[F-prime] evaluation yields valid enclosures: it rests on the gamma(n)/k eps surrogate models of ' +
    'the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a double-precision ' +
    'artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM SMALL-N EDGE, LOCATED + SHARPENED (frontier, NOT an RH bound). imp-34996 asserted the ' +
    'sub-100x direction is small-N outside the imp-34693 band but never located it. This module locates two ' +
    'landmarks, both strictly below the band-bottom N_bot ~ 3.109e9: the gain-0.02 edge (N ~ 1.506e8, ' +
    'a ~ 0.9796, ~1.31 decades below) and the FP_LO pole (N ~ 1.475e8, a ~ 0.9998, ~1.32 decades below), ' +
    'CONFIRMING the spatial claim. But it CORRECTS the S-below-100 conclusion: at the gain-0.02 edge S ~ 4947 ' +
    '(49x safety), NOT ~100, because the imp-34996 heuristic assumed FP_LO ~ 1 whereas FP_LO collapses with ' +
    'the gain near a = 1, so S diverges at the pole rather than descending to 100. On the whole physical ' +
    '(a < 1) branch S is monotone-decreasing from a +infinity pole to the 2500 floor and NEVER dips below ' +
    '2500 -- the 100x factor is unreachable in BOTH the large-N tail and the small-N direction; the sub-100x ' +
    'regime does not exist as an S = 100 crossing on the admissible branch. EVIDENCE, NOT a machine ' +
    'certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the ' +
    'imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision artifact. Measurement only ' +
    'on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-34996 machinery (identical K, delta, ' +
    'N_cross, band); the C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; ' +
    'imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; far-tail exponent ' +
    'stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34996 (S_inf = 1/(2 delta) large-N floor, small-N heuristic); imp-34929 (closed-form dS/dN < 0); ' +
    'imp-34817 (n_op* = G/((1+G) eps) contraction-validity ceiling); imp-34799 ((H2)-margin ceiling); ' +
    'imp-34693 (admissible seed band + band-bottom); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 ' +
    '(C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Root-finding / limit of a ' +
    'rational form: standard.',
};

export const IMP35110_KRAWCZYK_HEADROOM_SMALL_N_EDGE_ASSERTIONS = [
  {
    // The gain-0.02 edge exists on the physical branch at a ~ 0.9796 and is strictly below the band-bottom.
    id: 'imp35110-gain-002-edge-below-band-bottom',
    description: 'the gain-0.02 edge (a ~ 0.9796) is real and lies strictly below the imp-34693 band-bottom',
    holds: () =>
      Math.abs(gainAt(N_GAIN_002) - 0.02) < 1e-6 &&
      A_AT_GAIN_002 > 0.97 &&
      A_AT_GAIN_002 < 0.99 &&
      N_GAIN_002 < BAND_BOTTOM &&
      Math.abs(GAIN_EDGE_DECADES_BELOW_BAND - 1.315) < 0.05,
  },
  {
    // At the gain-0.02 edge the headroom is ~4947, NOT ~100: the FP_LO ~ 1 heuristic fails near a = 1.
    id: 'imp35110-gain-002-edge-headroom-not-100',
    description: 'headroom at the gain-0.02 edge is ~4947 (49x safety), NOT ~100 (FP_LO collapses with gain)',
    holds: () => S_AT_GAIN_002 > 4000 && S_AT_GAIN_002 < 6000 && S_AT_GAIN_002 > 40 * SAFETY_FACTOR,
  },
  {
    // The FP_LO pole sits at a ~ 0.9998, strictly below the band-bottom, ~1.32 decades down.
    id: 'imp35110-fp-lo-pole-below-band-bottom',
    description: 'the FP_LO = 0 pole (a ~ 0.9998) is strictly below the band-bottom, ~1.32 decades down',
    holds: () =>
      Math.abs(aOf(N_POLE * (1 - DELTA)) - 1) < 1e-4 &&
      A_AT_POLE > 0.999 &&
      A_AT_POLE < 1 &&
      N_POLE < BAND_BOTTOM &&
      Math.abs(POLE_DECADES_BELOW_BAND - 1.324) < 0.05,
  },
  {
    // On the physical (a < 1) branch S never dips below the 2500 floor, hence never below the 100x factor.
    id: 'imp35110-physical-branch-never-below-safety',
    description: 'physical-branch S stays at or above the 2500 floor -- never below the 100x safety factor',
    holds: () =>
      PHYSICAL_BRANCH_NEVER_BELOW_SAFETY === true &&
      PHYSICAL_BRANCH_NEVER_BELOW_FLOOR === true &&
      MIN_S_PHYSICAL > SAFETY_FACTOR,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35110-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35110_KRAWCZYK_HEADROOM_SMALL_N_EDGE.isRigorous === false &&
      /imp-34714a/.test(IMP35110_KRAWCZYK_HEADROOM_SMALL_N_EDGE.subGap) &&
      /REMAINS OPEN/.test(IMP35110_KRAWCZYK_HEADROOM_SMALL_N_EDGE.subGap) &&
      /NO QED/.test(IMP35110_KRAWCZYK_HEADROOM_SMALL_N_EDGE.verdict) &&
      /refereed bound is changed/i.test(IMP35110_KRAWCZYK_HEADROOM_SMALL_N_EDGE.verdict),
  },
];

for (const a of IMP35110_KRAWCZYK_HEADROOM_SMALL_N_EDGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35110-krawczyk-headroom-small-n-edge assertion failed: ${a.id}`);
  }
}
