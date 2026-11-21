/**
 * @module imp-34044-sawtooth-phase-realignment-schedule
 *
 * imp-34044 (numerical): MEASURE the imp-33983 sawtooth phase-realignment SCHEDULE. imp-33983
 * verified that the imp-33942 P3 sawtooth-residue closed form gap(step) = min(frac, 1 - frac) * step
 * (frac = frac((k* - 6)/step)) survives below the imp-33878 ladder floor of 1/128, and observed that
 * the argmax gap is FROZEN at 7.795e-4 through 1/256 and 1/512 (because the coarse-grid argmax point
 * 8.8203125 = 6 + 361/128 is a terminating dyadic that survives every finer dyadic refinement), then
 * spot-checked two out-of-ladder rungs (1/2048 -> gap 1.97e-4, 1/4096 -> gap 4.71e-5). But imp-33983
 * never tabulated the FULL dyadic ladder or characterized WHEN and BY HOW MUCH the frozen gap resumes
 * its descent. This module extends the imp-33878 resid_exp(k) argmax ladder systematically across the
 * whole dyadic range 1/128 .. 1/32768 (exponents e = 7 .. 15), tabulates at each level the nearest
 * grid point to the continuum argmax k* ~ 8.821092 and the resulting gap, and characterizes the
 * phase-realignment schedule as a closed-form dyadic-distance (doubling-map) sequence.
 *
 * THE MEASUREMENT (re-runs the imp-33878 resid_exp(k) argmax verbatim across 9 dyadic rungs)
 * -----------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual over
 *   the sliding window [10^k, 10^(k+1)] -- the EXACT imp-33878/imp-33810 quantity, re-implemented
 *   here identically (E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N),
 *   E_flow = C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN(N)); no fresh model. For each
 *   dyadic step 1/2^e the discrete argmax over the k = 6..11 grid is recomputed, the actual gap
 *   distToKStar = |argmaxK - k*| is compared with the sawtooth prediction min(frac, 1 - frac) * step,
 *   and the doubling-map phase frac_e = frac(2^e (k* - 6)) is tracked. k* is read verbatim from the
 *   imp-33878 continuum argmax (ternary search, ~8.821092).
 *
 * THE FINDING (measurement only -- a closed-form doubling-map schedule; corrects imp-33983 by one rung)
 * ---------------------------------------------------------------------------------------------------
 *   (V1) THE SAWTOOTH CLOSED FORM HOLDS EXACTLY AT ALL 9 RUNGS. The re-run discrete argmax gap equals
 *        min(frac, 1 - frac) * step to < 1e-6 across the whole dyadic ladder 1/128 .. 1/32768, and the
 *        gap stays bounded by step/2 at every rung -- the imp-33942 P3 identity is grid-wide, not a
 *        floor artifact.
 *   (V2) THE PHASE IS A DOUBLING-MAP (DYADIC-SHIFT) ORBIT. The sawtooth phase obeys
 *        frac_{e+1} = frac(2 * frac_e) exactly (to < 1e-9), i.e. the successive-refinement phase is
 *        the Bernoulli doubling map of the fixed continuum phase (k* - 6), seeded at
 *        frac_7 = frac(2^7 (k* - 6)) ~ 0.099776. The whole schedule is the orbit of that one phase.
 *   (V3) CLOSED-FORM REALIGNMENT RULE. The frozen gap resumes its descent at level e+1 IFF the
 *        current phase frac_e lands in the reflection band (1/4, 3/4); it FREEZES (gap unchanged,
 *        min(frac, 1 - frac) doubling exactly to cancel the step halving) iff frac_e is in
 *        [0, 1/4] union [3/4, 1). Applied to the measured orbit this predicts descents exactly at
 *        e = 10, 12, 14 (steps 1/1024, 1/4096, 1/16384) and freezes at e = 8, 9, 11, 13, 15 -- which
 *        matches the tabulated gaps rung-for-rung.
 *   (V4) THE FIRST DESCENT RESUMES AT 1/1024, NOT 1/2048 -- A ONE-RUNG CORRECTION TO imp-33983.
 *        imp-33983 skipped 1/1024 (its out-of-ladder check used steps [1/2048, 1/4096]) and reported
 *        the first descent at 1/2048. The full ladder shows the realignment actually occurs at 1/1024
 *        (argmax 8.8212890625, gap 1.9706e-4); 1/2048 merely INHERITS (freezes) that same argmax
 *        because 8.8212890625 = 6 + 2887/1024 is itself a terminating dyadic. The two imp-33983
 *        out-of-ladder numbers are correct; their level attribution was off by one rung.
 *
 * THE TABULATED SCHEDULE (gap = |argmaxK - k*|, k* ~ 8.821092)
 * -----------------------------------------------------------
 *   e=7  1/128    argmax 8.8203125          gap 7.795e-4  (initial, frozen from coarser ladder)
 *   e=8  1/256    argmax 8.8203125          gap 7.795e-4  frozen  (frac_7 ~0.100 in [0,1/4])
 *   e=9  1/512    argmax 8.8203125          gap 7.795e-4  frozen  (frac_8 ~0.200 in [0,1/4])
 *   e=10 1/1024   argmax 8.8212890625       gap 1.971e-4  DESCENT (frac_9 ~0.399 in (1/4,3/4))
 *   e=11 1/2048   argmax 8.8212890625       gap 1.971e-4  frozen  (frac_10 ~0.798 in [3/4,1))
 *   e=12 1/4096   argmax 8.821044921875     gap 4.708e-5  DESCENT (frac_11 ~0.596 in (1/4,3/4))
 *   e=13 1/8192   argmax 8.821044921875     gap 4.708e-5  frozen  (frac_12 ~0.193 in [0,1/4])
 *   e=14 1/16384  argmax 8.82110595703125   gap 1.396e-5  DESCENT (frac_13 ~0.386 in (1/4,3/4))
 *   e=15 1/32768  argmax 8.82110595703125   gap 1.396e-5  frozen  (frac_14 ~0.771 in [3/4,1))
 *   per-realignment gap-drop ratios ~ 3.96, 4.19, 3.37 (envelope ~ 1/4 per realignment, ~ 1/2 per level).
 *
 * The punchline: the imp-33983 "phase-gated" freeze is now a fully CLOSED-FORM schedule -- the frozen
 * argmax gap is the dyadic distance of the fixed continuum phase (k* - 6) to the grid, its successive
 * refinements are the Bernoulli doubling-map orbit of the seed phase ~0.099776, and the gap resumes
 * descent at exactly the levels where that orbit enters the reflection band (1/4, 3/4). This puts the
 * first realignment at 1/1024 (one rung earlier than imp-33983 reported), with 1/2048 an inherited
 * freeze, and predicts every subsequent descent (1/4096, 1/16384) from the orbit alone.
 *
 * MEASUREMENT ONLY. A closed-form characterization of an inherited surrogate argmax gap, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33983-sawtooth-residue-finer-grid-verification (the frozen gap and out-of-ladder rungs, scheduled here)
 * @see imp-33942-hump-argmax-gap-step-proportionality (P3 sawtooth-residue closed form, scheduled here)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* and the resid_exp model, extended here)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder storing resid_exp(k), reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33983/imp-33878/imp-33810 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade (imp-33582/imp-33730, verbatim).
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// p_ecoll = -d log E_coll / d log N over endpoints (imp-33620/imp-33727, verbatim).
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) over window [10^k, 10^(k+1)] (imp-33810/imp-33878 defn, verbatim).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

// Discrete argmax of resid_exp over the k=6..11 grid at a given step (imp-33878/imp-33983 argmaxGrid).
function argmaxGrid(step) {
  let bestK = 6;
  let bestV = -Infinity;
  for (let k = 6; k <= 11 + 1e-9; k += step) {
    const kk = +k.toFixed(10);
    const v = residExp(kk);
    if (v > bestV) {
      bestV = v;
      bestK = kk;
    }
  }
  return { k: bestK, v: bestV };
}

// k* read verbatim from the imp-33878 continuum argmax (ternary search, ~8.821092).
const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar;
const GRID_ORIGIN = 6; // the k-grid runs 6..11 stepping by `step` from k=6
const PHASE = K_STAR - GRID_ORIGIN; // fixed continuum phase (k* - 6) ~ 2.821092

// Sawtooth prediction: distance from k* to the nearest grid point 6 + j*step (imp-33942 defn).
function distToNearestGridPoint(step) {
  const off = PHASE / step;
  const frac = off - Math.floor(off);
  return Math.min(frac, 1 - frac) * step;
}

// The full dyadic ladder: exponents e = 7 .. 15, i.e. steps 1/128 .. 1/32768.
const LADDER_EXPONENTS = [7, 8, 9, 10, 11, 12, 13, 14, 15];
const REFLECTION_LO = 0.25; // frac in (1/4, 3/4) => the doubling crosses 1/2 => descent resumes
const REFLECTION_HI = 0.75;

function rungFor(exponent) {
  const step = 1 / Math.pow(2, exponent);
  const a = argmaxGrid(step);
  const gap = Math.abs(a.k - K_STAR);
  const saw = distToNearestGridPoint(step);
  // nearest grid point 6 + j*step (the sawtooth-defining point) and the doubling-map phase.
  const j = Math.round(PHASE / step);
  const nearestGridPoint = GRID_ORIGIN + j * step;
  const scaled = Math.pow(2, exponent) * PHASE;
  const frac = scaled - Math.floor(scaled);
  return {
    exponent,
    step,
    argmaxK: +a.k.toFixed(12),
    nearestGridPoint: +nearestGridPoint.toFixed(12),
    gap: +gap.toExponential(4), // = |argmaxK - k*|
    gapOverHalfStep: +(gap / (step / 2)).toFixed(4), // in (0,1] iff bounded by step/2
    frac: +frac.toFixed(6), // doubling-map phase frac(2^e (k* - 6))
    minFrac: +Math.min(frac, 1 - frac).toFixed(6),
    inReflectionBand: frac > REFLECTION_LO && frac < REFLECTION_HI, // predicts descent at e+1
    sawtoothPredicted: +saw.toExponential(4),
    sawtoothMatches: Math.abs(saw - gap) < 1e-6,
  };
}

const RUNGS = LADDER_EXPONENTS.map(rungFor);

// Per-transition classification: a level e+1 REALIGNS (gap strictly drops) or FREEZES.
const TRANSITIONS = [];
for (let i = 1; i < RUNGS.length; i++) {
  const prev = RUNGS[i - 1];
  const cur = RUNGS[i];
  const drop = prev.gap - cur.gap;
  TRANSITIONS.push({
    fromExponent: prev.exponent,
    toExponent: cur.exponent,
    step: cur.step,
    gapDrop: +drop.toExponential(4),
    realigned: cur.gap < prev.gap - 1e-12,
    predictedByPrevPhase: prev.inReflectionBand, // frac_prev in (1/4,3/4) => descent predicted
  });
}

// Levels (exponents) at which the frozen gap resumes its descent, and the frozen levels.
const REALIGNMENT_LEVELS = TRANSITIONS.filter((t) => t.realigned).map((t) => t.toExponent);
const FROZEN_LEVELS = TRANSITIONS.filter((t) => !t.realigned).map((t) => t.toExponent);
// Gap-drop ratios across successive realignments (envelope decay).
const REALIGNMENT_GAPS = RUNGS.filter((r, i) => i === 0 || r.gap < RUNGS[i - 1].gap - 1e-12).map((r) => r.gap);
const REALIGNMENT_DROP_RATIOS = REALIGNMENT_GAPS.slice(1).map((g, i) => +(REALIGNMENT_GAPS[i] / g).toFixed(4));

// (V1) Sawtooth closed form matches the re-run argmax gap at every rung, bounded by step/2.
const SAWTOOTH_MATCHES_ALL = RUNGS.every((r) => r.sawtoothMatches);
const BOUNDED_BY_HALF_STEP_ALL = RUNGS.every((r) => r.gapOverHalfStep <= 1 + 1e-9 && r.gap > 0);
// (V2) Doubling-map: frac_{e+1} = frac(2 * frac_e) to < 1e-9 across the ladder.
const DOUBLING_MAP_HOLDS = RUNGS.slice(1).every((r, i) => {
  const doubled = 2 * RUNGS[i].frac;
  const expected = doubled - Math.floor(doubled);
  return Math.abs(expected - r.frac) < 1e-9;
});
// (V3) Realignment rule: level e+1 realigns IFF frac_e in (1/4,3/4); freezes otherwise.
const REALIGNMENT_RULE_HOLDS = TRANSITIONS.every((t) => t.realigned === t.predictedByPrevPhase);
const REALIGNMENT_LEVELS_AS_PREDICTED =
  REALIGNMENT_LEVELS.length === 3 &&
  REALIGNMENT_LEVELS[0] === 10 &&
  REALIGNMENT_LEVELS[1] === 12 &&
  REALIGNMENT_LEVELS[2] === 14;
// (V4) First descent is at 1/1024 (e=10), NOT 1/2048 (e=11): a one-rung correction to imp-33983.
const R10 = RUNGS.find((r) => r.exponent === 10);
const R11 = RUNGS.find((r) => r.exponent === 11);
const FIRST_DESCENT_AT_1024 =
  REALIGNMENT_LEVELS[0] === 10 &&
  R10.gap < RUNGS[0].gap - 1e-12 &&
  R11.gap === R10.gap && // 1/2048 inherits (freezes) the 1/1024 realignment
  Math.abs(R10.argmaxK - 8.8212890625) < 1e-9;

export const IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE = {
  id: 'imp-34044',
  proofSection: 'S-frontier',
  question:
    'imp-33983 verified the imp-33942 sawtooth-residue closed form below the imp-33878 floor and ' +
    'observed the frozen argmax gap 7.795e-4 through 1/512, with out-of-ladder descent at 1/2048 ' +
    '(1.97e-4) and 1/4096 (4.71e-5), but never tabulated the full phase-realignment schedule. ' +
    'Extend the imp-33878 resid_exp(k) argmax ladder systematically across 1/128 .. 1/32768, ' +
    'tabulate the nearest grid point to k* and the resulting gap at each level, and characterize ' +
    'the schedule -- the levels at which descent resumes and the sawtooth prediction at each -- as a ' +
    'closed-form dyadic-distance sequence. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the re-run imp-33878 sliding-window resid_exp(k) discrete argmax gap distToKStar = |argmaxK - k*| ' +
    'across the full dyadic ladder 1/128 .. 1/32768 (k* ~ 8.821092), each compared with the imp-33942 ' +
    'sawtooth min(frac,1-frac)*step and the doubling-map phase frac(2^e (k*-6)), together with the ' +
    'per-transition realignment/freeze classification',
  continuumArgmax: K_STAR, // ~8.821092 (imp-33878, verbatim)
  continuumPhase: +PHASE.toFixed(6), // (k* - 6) ~ 2.821092 -- the fixed phase whose doubling-map orbit drives the schedule
  seedPhaseFrac7: RUNGS[0].frac, // frac(2^7 (k*-6)) ~ 0.099776 -- the orbit seed
  ladderRungs: RUNGS, // exponent, step, argmaxK, nearestGridPoint, gap, gapOverHalfStep, frac, minFrac, inReflectionBand, sawtoothMatches
  transitions: TRANSITIONS, // per level: gapDrop, realigned, predictedByPrevPhase (frac in (1/4,3/4))
  realignmentLevels: REALIGNMENT_LEVELS, // exponents where the frozen gap resumes descent: [10, 12, 14]
  frozenLevels: FROZEN_LEVELS, // exponents where the gap is unchanged: [8, 9, 11, 13, 15]
  realignmentGaps: REALIGNMENT_GAPS, // [7.795e-4, 1.971e-4, 4.708e-5, 1.396e-5]
  realignmentDropRatios: REALIGNMENT_DROP_RATIOS, // ~[3.96, 4.19, 3.37]
  finding: {
    V1_sawtooth_holds_grid_wide:
      'The re-run discrete argmax gap equals min(frac,1-frac)*step to <1e-6 at every rung 1/128 .. ' +
      '1/32768 and stays bounded by step/2 throughout -- the imp-33942 P3 identity is grid-wide.',
    V2_phase_is_a_doubling_map_orbit:
      'The sawtooth phase obeys frac_{e+1} = frac(2*frac_e) exactly (<1e-9): the successive-refinement ' +
      'phase is the Bernoulli doubling-map orbit of the fixed continuum phase (k*-6), seeded at ' +
      'frac_7 ~ 0.099776. The whole schedule is the orbit of that one phase.',
    V3_closed_form_realignment_rule:
      'The frozen gap resumes descent at level e+1 IFF frac_e lands in the reflection band (1/4,3/4) ' +
      '(the doubling crosses 1/2); it FREEZES (min(frac,1-frac) doubling exactly to cancel the step ' +
      'halving) iff frac_e is in [0,1/4] union [3/4,1). This predicts descents exactly at e=10,12,14 ' +
      '(1/1024, 1/4096, 1/16384) and freezes at e=8,9,11,13,15, matching the tabulated gaps.',
    V4_first_descent_at_1024_corrects_imp33983:
      'The first descent resumes at 1/1024 (argmax 8.8212890625, gap 1.9706e-4), NOT 1/2048. imp-33983 ' +
      'skipped 1/1024 (out-of-ladder steps [1/2048,1/4096]) and reported the descent at 1/2048, but ' +
      '1/2048 merely INHERITS that argmax because 8.8212890625 = 6+2887/1024 is a terminating dyadic. ' +
      'The imp-33983 out-of-ladder numbers are correct; the level attribution was off by one rung.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). CHARACTERIZES the imp-33983 phase-gated sawtooth freeze as a ' +
    'closed-form doubling-map schedule. Extending the imp-33878 resid_exp(k) argmax ladder across the ' +
    'full dyadic range 1/128 .. 1/32768 on the same imp-33810 model, the re-run argmax gap distToKStar ' +
    'matches the imp-33942 sawtooth min(frac,1-frac)*step EXACTLY (<1e-6) at every rung and stays ' +
    'bounded by step/2. The successive-refinement phase is the Bernoulli doubling map frac_{e+1} = ' +
    'frac(2*frac_e) of the fixed continuum phase (k*-6), seeded at frac_7 ~ 0.099776, and the frozen ' +
    'gap resumes descent at level e+1 IFF frac_e lands in the reflection band (1/4,3/4) -- predicting ' +
    'realignments at exactly 1/1024, 1/4096, 1/16384 and freezes at 1/256, 1/512, 1/2048, 1/8192, ' +
    '1/32768, matching the tabulated gaps (7.795e-4, 1.971e-4, 4.708e-5, 1.396e-5; per-realignment ' +
    'drop ratios ~3.96, 4.19, 3.37). The first descent is at 1/1024 (a one-rung correction to ' +
    'imp-33983, which skipped 1/1024 and reported it at 1/2048; 1/2048 inherits that argmax because ' +
    '8.8212890625 = 6+2887/1024 is a terminating dyadic). The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is ' +
    'descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33983 (the frozen gap and out-of-ladder rungs scheduled here; corrected by one rung); ' +
    'imp-33942 (P3 sawtooth-residue closed form); imp-33878 (source of k*~8.821092 and the ' +
    'resid_exp model, extended here); imp-33810 (the ladder storing resid_exp(k), reused verbatim); ' +
    'imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE_ASSERTIONS = [
  {
    // (V1) The sawtooth closed form matches the re-run argmax gap at every rung, bounded by step/2.
    id: 'imp34044-sawtooth-holds-grid-wide',
    description: 'min(frac,1-frac)*step reproduces the re-run argmax gap to <1e-6 and gap<=step/2 across 1/128 .. 1/32768',
    holds: () => SAWTOOTH_MATCHES_ALL && BOUNDED_BY_HALF_STEP_ALL && RUNGS.length === 9,
  },
  {
    // (V2) The refinement phase is the doubling-map orbit frac_{e+1} = frac(2*frac_e).
    id: 'imp34044-phase-is-doubling-map-orbit',
    description: 'frac_{e+1} = frac(2*frac_e) to <1e-9 across the ladder, seeded at frac_7 ~ 0.099776',
    holds: () => DOUBLING_MAP_HOLDS && RUNGS[0].frac > 0.099 && RUNGS[0].frac < 0.1006,
  },
  {
    // (V3) Realignment rule: level e+1 realigns IFF frac_e in (1/4,3/4); descents at e=10,12,14.
    id: 'imp34044-closed-form-realignment-rule',
    description: 'gap drops at e+1 IFF frac_e in (1/4,3/4); realignment levels are exactly [10,12,14]',
    holds: () => REALIGNMENT_RULE_HOLDS && REALIGNMENT_LEVELS_AS_PREDICTED,
  },
  {
    // (V4) The first descent is at 1/1024 (e=10), not 1/2048: a one-rung correction to imp-33983.
    id: 'imp34044-first-descent-at-1024-corrects-imp33983',
    description: 'descent resumes at 1/1024 (argmax 8.8212890625, gap 1.9706e-4); 1/2048 inherits (freezes) it',
    holds: () => FIRST_DESCENT_AT_1024,
  },
  {
    // Honesty gate: measurement only, isRigorous false, characterizes imp-33983, no QED, no refereed bound is changed.
    id: 'imp34044-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, CHARACTERIZES the imp-33983 freeze, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.isRigorous === false &&
      /CHARACTERIZES the imp-33983/.test(IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.verdict) &&
      /NO QED/.test(IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.verdict) &&
      /refereed bound is changed/i.test(IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.verdict),
  },
];

for (const a of IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34044-sawtooth-phase-realignment-schedule assertion failed: ${a.id}`);
  }
}
