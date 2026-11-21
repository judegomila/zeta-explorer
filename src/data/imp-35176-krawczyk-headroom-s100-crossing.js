/**
 * @module imp-35176-krawczyk-headroom-s100-crossing
 *
 * imp-34996 (heuristically) placed the sub-100x regime of the Krawczyk contraction-validity headroom
 * S(N) = star_over_H2(N) = G/((1+G) delta FP_LO) at SMALL N (bounded gain G/(1+G) ~ 0.02, a ~ 0.96), reasoning
 * "gain ~ 0.02 => S ~ 100". imp-35110 SHARPENED that: at the gain-0.02 edge S is actually ~4947 (NOT ~100),
 * because the "S ~ 100" step silently assumed FP_LO ~ 1, whereas FP_LO = 1 - a(N(1-delta)) COLLAPSES in
 * lockstep with the gain near a = 1, so S DIVERGES to +infinity at the FP_LO pole rather than descending to
 * 100. imp-35110 stopped at that observation and concluded "the sub-100x regime does not exist as an S = 100
 * crossing on the admissible branch." This module CLOSES the loop the ticket asks for: it scans the small-N
 * surrogate for the ACTUAL S(N) = 100 crossing with the full FP_LO = 1 - a(N(1-delta)) dependence and reports
 * exactly WHERE (if anywhere) the headroom first reaches the 100x safety factor.
 *
 * WHAT THE MEASUREMENT FINDS (a HONEST CORRECTION of the ticket premise inherited from imp-34996)
 * ---------------------------------------------------------------------------------------------
 * There is NO genuine S(N) = 100 crossing anywhere on the physical, admissible (a < 1) branch:
 *   (A) PHYSICAL BRANCH IS FLOORED AT 2500. Sweeping the whole physical branch (a < 1, N above the FP_LO pole
 *       out to N = 1e13) the headroom minimum is S ~ 2500.02 -- it descends toward the closed-form floor
 *       S_inf = 1/(2 delta) = 2500 from above and NEVER approaches 100. Since 100 sits ~25x BELOW that floor,
 *       the S(N) = 100 level is simply not in the range of S on the admissible branch. There is no small-N N
 *       at which the headroom "first reaches" 100 -- the ticket premise (that such a crossing exists at small
 *       N) is an FP_LO ~ 1 artifact of the imp-34996 heuristic, exactly as imp-35110 warned.
 *   (B) THE ONLY S = 100 LEVEL LIES DEEP IN THE UNPHYSICAL a > 1 REGION AS A POLE SIGN-FLIP. Scanning S(N)
 *       across ~5.5 decades (N from 1e6.5 to 1e12) turns up EXACTLY ONE value of N where the surrogate
 *       expression equals 100, at log10 N ~ 7.867 where a(N) ~ 1.998 -- i.e. deep in the unphysical a > 1
 *       region. It is not a smooth crossing: S jumps by ~2.7e7 across that point, a SIGN-FLIP through the gain
 *       pole 1 + G = 2 - a = 0 (a = 2). That gain pole sits at N ~ 7.354e7, ~1.63 decades below the imp-34693
 *       band-bottom N_bot ~ 3.109e9 and ~0.30 decades below the FP_LO pole (N ~ 1.475e8). So the S = 100 level
 *       is reached only by the surrogate racing through +/- infinity at an unphysical pole, never by a physical
 *       descent of the headroom.
 *
 * CONSEQUENCE: THE 100x SAFETY FACTOR IS NEVER "FIRST REACHED" -- IT IS UNREACHABLE ON THE ADMISSIBLE BRANCH
 * -----------------------------------------------------------------------------------------------------------
 * imp-34996 gave the large-N floor S_inf = 2500; imp-35110 gave the small-N direction (S rises to a pole, not
 * down to 100). This module supplies the crossing search the ticket names and returns the direct answer: the
 * S(N) = 100 crossing does NOT exist on the physical branch (S is floored at 2500 there), and the single
 * N where the expression equals 100 lies at a ~ 2, deep in the unphysical a > 1 region below the band-bottom,
 * as a pole sign-flip rather than a smooth crossing. The "S first reaches 100" event the imp-34996 heuristic
 * imagined has no admissible-branch realization once FP_LO is carried in full.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35110/imp-34996 machinery
 * (identical K, delta, N_cross, band). The imp-34714a machine certificate REMAINS OPEN; F(m) = 0 stays a
 * double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35110-krawczyk-headroom-small-n-edge (the small-N edge + FP_LO pole this closes the crossing search on)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) large-N floor + the S ~ 100 heuristic)
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form dS/dN < 0; strictly decreasing S)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band; supplies the band-bottom N_bot)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34996/imp-35110)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const SAFETY_FACTOR = 100; // the imp-34799/34817 contraction-validity safety factor
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35110).
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
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883/34929/34996)
const BAND_BOTTOM = N_CROSS - rho(1, WIDEST_BAND_K); // smallest admissible N (imp-34693 seed band-bottom)

// star_over_H2(N) = G/((1+G) delta FP_LO), the contraction-validity headroom (imp-34929/34996) with FULL FP_LO.
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

// Physical-branch floor: sweep from just above the FP_LO pole (a(N(1-delta)) = 1) out to N = 1e13 on a < 1,
// confirming S is floored at ~2500 and NEVER approaches the 100x factor.
const N_AT_A1 = nForA(1.0, 1e6, BAND_BOTTOM);
const N_FP_LO_POLE = N_AT_A1 / (1 - DELTA); // headroom -> +infinity here (FP_LO -> 0)
let MIN_S_PHYSICAL = Infinity;
{
  const lo = Math.log10(N_FP_LO_POLE * 1.0005);
  const hi = 13;
  const pts = 80000;
  for (let i = 0; i <= pts; i++) {
    const N = Math.pow(10, lo + ((hi - lo) * i) / pts);
    if (aOf(N) >= 1) continue; // physical branch only
    const S = headroomAt(N);
    if (Number.isFinite(S) && S < MIN_S_PHYSICAL) MIN_S_PHYSICAL = S;
  }
}
const PHYSICAL_BRANCH_HAS_NO_S100_CROSSING = MIN_S_PHYSICAL > SAFETY_FACTOR; // true: min ~2500 >> 100
const PHYSICAL_MIN_AT_FLOOR = Math.abs(MIN_S_PHYSICAL - S_INF) < 1; // ~2500.02, sits on the S_inf floor

// The gain pole 1 + G = 2 - a = 0 <=> a = 2: the single place S = 100 is reached, as a sign-flip through
// +/- infinity in the unphysical a > 1 region.
const N_GAIN_POLE = nForA(2.0, 1e6, N_FP_LO_POLE); // a(N) = 2
const A_AT_GAIN_POLE = aOf(N_GAIN_POLE); // ~2.000000
const GAIN_POLE_DECADES_BELOW_BAND = Math.log10(BAND_BOTTOM) - Math.log10(N_GAIN_POLE); // ~1.63
const GAIN_POLE_DECADES_BELOW_FP_LO = Math.log10(N_FP_LO_POLE) - Math.log10(N_GAIN_POLE); // ~0.30

// Scan the whole small-N range for genuine S = 100 crossings and record a(N) at each -- confirm the ONLY one
// is deep in the unphysical a > 1 region (a ~ 2) and arrives as a large sign-flip jump, not a smooth descent.
const S100_CROSSINGS = [];
{
  let prevS = null;
  for (let ln = 6.5; ln <= 12; ln += 0.0005) {
    const N = Math.pow(10, ln);
    const S = headroomAt(N);
    if (prevS !== null && Number.isFinite(S) && Number.isFinite(prevS.S) && (prevS.S - 100) * (S - 100) < 0) {
      S100_CROSSINGS.push({ log10N: ln, a: aOf(N), jump: Math.abs(S - prevS.S) });
    }
    prevS = { S };
  }
}
const ONLY_S100_CROSSING = S100_CROSSINGS.length ? S100_CROSSINGS[0] : null;
const ALL_CROSSINGS_UNPHYSICAL = S100_CROSSINGS.length > 0 && S100_CROSSINGS.every((c) => c.a > 1);

export const IMP35176_KRAWCZYK_HEADROOM_S100_CROSSING = {
  id: 'imp-35176',
  proofSection: 'S-frontier',
  question:
    'imp-35110 corrected the imp-34996 "gain ~ 0.02 => S ~ 100" heuristic (headroom S(N) = G/((1+G) delta ' +
    'FP_LO)) by showing FP_LO collapses with the gain so S diverges rather than descending to 100, but did not ' +
    'locate the actual S(N) = 100 crossing. Scan the small-N surrogate for the true crossing given the full ' +
    'FP_LO = 1 - a(N(1-delta)) dependence and confirm where it sits relative to the imp-34693 band-bottom. ' +
    'Measurement only; surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'There is NO genuine S(N) = 100 crossing on the physical, admissible (a < 1) branch. Sweeping the whole ' +
    'physical branch (a < 1) out to N = 1e13, the headroom minimum is S ~ 2500.02 -- it descends toward the ' +
    'closed-form floor S_inf = 1/(2 delta) = 2500 from ABOVE and never approaches 100 (which sits ~25x BELOW ' +
    'the floor), so the S = 100 level is not in the range of S on the admissible branch and there is no ' +
    'small-N N at which the headroom "first reaches" the 100x factor. The ONLY N where the surrogate ' +
    'expression equals 100 lies at log10 N ~ 7.867 with a(N) ~ 1.998 -- deep in the UNPHYSICAL a > 1 region ' +
    '-- and it arrives as a SIGN-FLIP (S jumps by ~2.7e7) through the gain pole 1 + G = 2 - a = 0 (a = 2, ' +
    'N ~ 7.354e7, ~1.63 decades below the band-bottom N_bot ~ 3.109e9, ~0.30 decades below the FP_LO pole), ' +
    'not a smooth descent. So the S = 100 level is reached only by the surrogate racing through +/- infinity ' +
    'at an unphysical pole below the band, CONFIRMING and completing the imp-35110 conclusion: the sub-100x ' +
    'regime does not exist as an S = 100 crossing on the admissible branch. EVIDENCE / measurement, NOT a ' +
    'machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    delta: DELTA,
    safety_factor: SAFETY_FACTOR,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    physical_branch_min_headroom_S: +MIN_S_PHYSICAL.toFixed(4), // ~2500.02 (the floor, never near 100)
    physical_branch_has_no_S100_crossing: PHYSICAL_BRANCH_HAS_NO_S100_CROSSING, // true
    physical_min_sits_on_S_inf_floor: PHYSICAL_MIN_AT_FLOOR, // true
    num_S100_crossings_scanned: S100_CROSSINGS.length, // 1 (the pole sign-flip)
    only_S100_crossing_log10N: ONLY_S100_CROSSING ? +ONLY_S100_CROSSING.log10N.toFixed(4) : null, // ~7.867
    only_S100_crossing_a: ONLY_S100_CROSSING ? +ONLY_S100_CROSSING.a.toFixed(4) : null, // ~1.998 (unphysical)
    only_S100_crossing_is_pole_sign_flip: ONLY_S100_CROSSING ? ONLY_S100_CROSSING.jump > 1e5 : false, // true
    all_S100_crossings_unphysical_a_gt_1: ALL_CROSSINGS_UNPHYSICAL, // true
    gain_pole_a2_N: +N_GAIN_POLE.toPrecision(12), // ~7.3544e7
    gain_pole_a: +A_AT_GAIN_POLE.toFixed(6), // ~2.000000
    gain_pole_decades_below_band_bottom: +GAIN_POLE_DECADES_BELOW_BAND.toFixed(4), // ~1.6261
    gain_pole_decades_below_fp_lo_pole: +GAIN_POLE_DECADES_BELOW_FP_LO.toFixed(4), // ~0.3023
    gain_pole_below_band_bottom: N_GAIN_POLE < BAND_BOTTOM, // true
  },
  subGap:
    'imp-34714a REMAINS OPEN. Confirming the physical branch is floored at 2500 (no S = 100 crossing) and the ' +
    'single S = 100 level is an unphysical a ~ 2 pole sign-flip below the band-bottom does NOT prove a ' +
    'directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the gamma(n)/k eps ' +
    'surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM S = 100 CROSSING, SEARCHED + RESOLVED (frontier, NOT an RH bound). The ticket asked to ' +
    'locate the true S(N) = 100 crossing given the full FP_LO = 1 - a(N(1-delta)) dependence and check it ' +
    'against the imp-34693 band-bottom. RESULT: there is NO genuine crossing on the physical (a < 1) ' +
    'admissible branch -- the headroom is floored there at S_inf = 2500 (physical-branch minimum ~2500.02, ' +
    'descending toward 2500 from above), and 100 sits ~25x below that floor, so the headroom NEVER "first ' +
    'reaches" the 100x factor at any admissible N. The ONLY N where the surrogate expression equals 100 lies ' +
    'at log10 N ~ 7.867 with a ~ 1.998, deep in the UNPHYSICAL a > 1 region, and arrives as a sign-flip ' +
    '(jump ~2.7e7) through the gain pole 1 + G = 2 - a = 0 (a = 2, N ~ 7.354e7, ~1.63 decades below the ' +
    'band-bottom, ~0.30 decades below the FP_LO pole), not a smooth descent. This CONFIRMS and completes the ' +
    'imp-35110 conclusion (the sub-100x regime does not exist as an admissible-branch crossing) and CORRECTS ' +
    'the imp-34996 heuristic premise the ticket inherited. EVIDENCE, NOT a machine certificate. SUB-GAP ' +
    'imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a ' +
    'directed-rounding layer, and F(m) = 0 remains a double-precision artifact. Measurement only on the ' +
    'inherited imp-3220/imp-3406 surrogate; reproduces the imp-35110/imp-34996 machinery (identical K, delta, ' +
    'N_cross, band); the C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; ' +
    'imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-35110 (small-N edge + FP_LO pole; the S ~ 100 heuristic is an FP_LO ~ 1 artifact); imp-34996 ' +
    '(S_inf = 1/(2 delta) large-N floor, small-N heuristic); imp-34929 (closed-form dS/dN < 0); imp-34817 ' +
    '(n_op* = G/((1+G) eps) contraction-validity ceiling); imp-34693 (admissible seed band + band-bottom); ' +
    'imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). Root-finding / level-set search of a rational form: standard.',
};

export const IMP35176_KRAWCZYK_HEADROOM_S100_CROSSING_ASSERTIONS = [
  {
    // The physical (a < 1) branch is floored at ~2500 and has NO S = 100 crossing (100 is ~25x below the floor).
    id: 'imp35176-physical-branch-no-s100-crossing',
    description: 'physical-branch S is floored at ~2500 (S_inf) -- there is no S = 100 crossing on a < 1',
    holds: () =>
      PHYSICAL_BRANCH_HAS_NO_S100_CROSSING === true &&
      PHYSICAL_MIN_AT_FLOOR === true &&
      MIN_S_PHYSICAL > 20 * SAFETY_FACTOR,
  },
  {
    // Exactly one S = 100 level exists over the scanned small-N range, and it is deep in the unphysical a > 1 region.
    id: 'imp35176-only-crossing-is-unphysical',
    description: 'the only S = 100 level (log10 N ~ 7.867) sits at a ~ 2, deep in the unphysical a > 1 region',
    holds: () =>
      S100_CROSSINGS.length === 1 &&
      ALL_CROSSINGS_UNPHYSICAL === true &&
      ONLY_S100_CROSSING.a > 1.9 &&
      ONLY_S100_CROSSING.a < 2.1 &&
      Math.abs(ONLY_S100_CROSSING.log10N - 7.867) < 0.02,
  },
  {
    // That level is reached as a pole sign-flip (large jump), not a smooth descent, through the a = 2 gain pole.
    id: 'imp35176-crossing-is-pole-sign-flip',
    description: 'the S = 100 level is a sign-flip through the a = 2 gain pole (1 + G = 0), not a smooth descent',
    holds: () =>
      ONLY_S100_CROSSING.jump > 1e5 &&
      Math.abs(A_AT_GAIN_POLE - 2) < 1e-4 &&
      N_GAIN_POLE < BAND_BOTTOM &&
      Math.abs(GAIN_POLE_DECADES_BELOW_BAND - 1.626) < 0.05,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35176-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35176_KRAWCZYK_HEADROOM_S100_CROSSING.isRigorous === false &&
      /imp-34714a/.test(IMP35176_KRAWCZYK_HEADROOM_S100_CROSSING.subGap) &&
      /REMAINS OPEN/.test(IMP35176_KRAWCZYK_HEADROOM_S100_CROSSING.subGap) &&
      /NO QED/.test(IMP35176_KRAWCZYK_HEADROOM_S100_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP35176_KRAWCZYK_HEADROOM_S100_CROSSING.verdict),
  },
];

for (const a of IMP35176_KRAWCZYK_HEADROOM_S100_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35176-krawczyk-headroom-s100-crossing assertion failed: ${a.id}`);
  }
}
