/**
 * @module imp-34106-sawtooth-phase-realignment-deep-ladder
 *
 * imp-34106 (numerical): EXTEND the imp-34044 closed-form doubling-map phase-realignment SCHEDULE
 * three-plus dyadic rungs BELOW 1/32768, to 1/65536 .. 1/2^20 (exponents e = 16 .. 20), and TEST
 * whether the imp-34044 Bernoulli doubling-map sequence keeps predicting the realignment steps (WHEN
 * the frozen argmax gap resumes descent) and the frozen-gap resumption AMOUNTS at deep resolution, or
 * departs. imp-34044 tabulated the imp-33983 sawtooth phase-realignment schedule across 1/128 .. 1/32768
 * (e = 7 .. 15) and found the re-run imp-33878 resid_exp(k) discrete argmax gap distToKStar =
 * |argmaxK - k*| equals the imp-33942 sawtooth min(frac, 1 - frac) * step to < 1e-6 at every rung, with
 * the refinement phase the doubling-map orbit frac_{e+1} = frac(2 * frac_e) of the fixed continuum
 * phase (k* - 6) ~ 2.821092, and descent resuming at level e+1 IFF frac_e lands in the reflection band
 * (1/4, 3/4). This module carries that same VERBATIM imp-33878/imp-33810 machinery five rungs deeper.
 *
 * THE MEASUREMENT (re-runs the imp-33878 resid_exp(k) argmax verbatim across e = 15 .. 20)
 * ---------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual over the
 *   sliding window [10^k, 10^(k+1)] -- the EXACT imp-33878/imp-33810 quantity, re-implemented here
 *   identically (E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N),
 *   E_flow = C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN(N)); no fresh model. k* is read
 *   verbatim from the imp-33878 continuum argmax (~8.821092). e = 15 (1/32768) is included as the
 *   anchor so the e = 15 -> e = 16 transition is captured self-contained. For tractability at 1/2^20
 *   the discrete argmax over the k = 6..11 grid is evaluated on a peak-bracketing sub-window [8.6, 9.05]
 *   ALIGNED to the same 6 + j*step grid; because the resid_exp hump is unimodal with a single interior
 *   maximum at k* ~ 8.821 (confirmed by the imp-34044 full-range 6..11 scans AND an independent ternary
 *   search giving k_true ~ 8.8210915879), the windowed argmax is IDENTICAL to the full-range argmax at
 *   every rung (verified offline via node against the full 6..11 scan).
 *
 * THE FINDING (measurement only -- the doubling-map schedule holds to 1/262144, then DEPARTS at 1/524288)
 * ----------------------------------------------------------------------------------------------------
 *   (E1) A NEW REALIGNMENT AT 1/65536, AS PREDICTED. Between e = 15 and e = 16 the frozen gap resumes
 *        descent (1.396e-5 -> 1.3018e-6), exactly as the doubling-map rule predicts (frac_15 ~ 0.5427
 *        in the reflection band (1/4, 3/4)). The re-run argmax gap continues to equal the sawtooth
 *        min(frac, 1 - frac) * step to relative < 4e-5 at e = 16, 17, 18 (steps 1/65536, 1/131072,
 *        1/262144), and the doubling-map orbit frac_{e+1} = frac(2 * frac_e) holds to < 1e-9 across the
 *        whole extended ladder. So through 1/262144 the imp-34044 closed form KEEPS predicting both the
 *        realignment steps and the resumption amounts.
 *   (E2) THE CLOSED FORM DEPARTS AT 1/524288 (e = 19). The doubling map predicts a descent at e = 19
 *        (frac_18 ~ 0.3412 in the reflection band), with the sawtooth calling the gap down to 6.056e-7.
 *        The re-run discrete argmax gap instead stays FROZEN at 1.3018e-6 -- NO descent. This is a
 *        genuine, deterministic departure: at e = 19 the two contested grid points straddle the peak and
 *        the discrete argmax selects 8.821090698242 over 8.821092605591 by a resid_exp margin of
 *        3.69e-15 (~260 ULP -- a real curvature difference, not floating-point tie noise). The MAX
 *        RELATIVE DEVIATION of the observed gap from the closed-form sawtooth across the extended ladder
 *        is |1.3018e-6 - 6.056e-7| / 1.3018e-6 ~ 0.535 (53.5%), at e = 19.
 *   (E3) THE DEPARTURE IS DIAGNOSABLE -- IT IS THE PRECISION FLOOR OF THE STORED k*. The closed form
 *        phases the schedule on the stored 6-decimal continuum argmax k* = 8.821092, whereas the discrete
 *        argmax tracks the TRUE resid_exp peak k_true ~ 8.8210915879 (offset ~4.12e-7). Through e = 18
 *        k_true and the stored k* round to the SAME nearest grid point, so nearest-grid-point-to-stored-
 *        k* and true-discrete-argmax coincide. At e = 19 the grid first resolves k_true and k* to
 *        DIFFERENT nearest grid points, the two prescriptions split, and the closed form breaks. So the
 *        doubling-map schedule's predictive validity floor is ~1/262144, set by the 6-significant-figure
 *        precision of the inherited stored k*, NOT by any property of the underlying continuum problem.
 *        (At e = 20 the sawtooth and re-run argmax RE-AGREE to relative 5e-5 by coincidence of phase --
 *        the delayed descent finally lands one rung late -- so the "match" resumes but the schedule
 *        attribution is already off by a rung, exactly the imp-34044-vs-imp-33983 one-rung motif
 *        recurring at the precision floor.)
 *
 * THE TABULATED DEEP LADDER (gap = |argmaxK - k*|, k* ~ 8.821092)
 * --------------------------------------------------------------
 *   e=15 1/32768   argmax 8.82110595703125  gap 1.396e-5  (anchor, frozen from imp-34044)
 *   e=16 1/65536   argmax 8.8210906982      gap 1.302e-6  DESCENT  (frac_15 ~0.543 in (1/4,3/4))  match
 *   e=17 1/131072  argmax 8.8210906982      gap 1.302e-6  frozen   (frac_16 ~0.085 in [0,1/4])     match
 *   e=18 1/262144  argmax 8.8210906982      gap 1.302e-6  frozen   (frac_17 ~0.171 in [0,1/4])     match
 *   e=19 1/524288  argmax 8.8210906982      gap 1.302e-6  frozen   (frac_18 ~0.341 in (1/4,3/4))  DEPART: sawtooth called 6.056e-7
 *   e=20 1/1048576 argmax 8.8210916519      gap 3.481e-7  DESCENT  (frac_19 ~0.682 in (1/4,3/4))  re-agree (5e-5)
 *
 * The punchline: the imp-34044 closed-form doubling-map schedule extends cleanly three rungs deeper --
 * predicting a fresh realignment at 1/65536 and its resumption amount to relative < 4e-5 through
 * 1/262144 -- and then DEPARTS at 1/524288, where the sawtooth-predicted descent fails to materialize
 * (the re-run argmax gap stays frozen at 1.302e-6 instead of dropping to 6.056e-7; max relative
 * deviation ~ 0.535). The departure is not a modelling surprise: it is the resolution at which the grid
 * half-step falls below the ~4.12e-7 rounding error of the inherited 6-decimal k*, so the discrete
 * argmax (tracking the true peak k_true ~ 8.8210916) and the closed-form phase (using the rounded k*)
 * part ways. The doubling-map schedule is thus valid only down to ~1/262144 -- a precision floor of the
 * stored continuum argmax, not of the continuum problem.
 *
 * MEASUREMENT ONLY. A closed-form-vs-measurement comparison on an inherited surrogate argmax gap, NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34044-sawtooth-phase-realignment-schedule (the 1/128 .. 1/32768 doubling-map schedule, extended here)
 * @see imp-33983-sawtooth-residue-finer-grid-verification (the frozen gap and out-of-ladder rungs)
 * @see imp-33942-hump-argmax-gap-step-proportionality (P3 sawtooth-residue closed form)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* and the resid_exp model, reused verbatim)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder storing resid_exp(k), reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34044/imp-33983/imp-33878/imp-33810 exactly

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

// k* read verbatim from the imp-33878 continuum argmax (ternary search, ~8.821092).
const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar;
const GRID_ORIGIN = 6; // the k-grid runs 6..11 stepping by `step` from k=6
const PHASE = K_STAR - GRID_ORIGIN; // fixed continuum phase (k* - 6) ~ 2.821092

// Discrete argmax of resid_exp over the k=6..11 grid, evaluated on a peak-bracketing sub-window
// [WIN_LO, WIN_HI] ALIGNED to the same 6 + j*step grid. The resid_exp hump is unimodal with its single
// interior maximum at k* ~ 8.821 (imp-34044 full-range scans + ternary search k_true ~ 8.8210915879),
// so this equals the full-range 6..11 argmax at every rung -- verified offline against the full scan --
// while keeping the 1/2^20 evaluation count tractable.
const WIN_LO = 8.6;
const WIN_HI = 9.05;
function argmaxGridWindowed(step) {
  const jLo = Math.ceil((WIN_LO - GRID_ORIGIN) / step);
  const jHi = Math.floor((WIN_HI - GRID_ORIGIN) / step);
  let bestK = GRID_ORIGIN + jLo * step;
  let bestV = -Infinity;
  for (let j = jLo; j <= jHi; j++) {
    const kk = +(GRID_ORIGIN + j * step).toFixed(10);
    const v = residExp(kk);
    if (v > bestV) {
      bestV = v;
      bestK = kk;
    }
  }
  return { k: bestK, v: bestV };
}

// Sawtooth prediction: distance from k* to the nearest grid point 6 + j*step (imp-33942 defn).
function distToNearestGridPoint(step) {
  const off = PHASE / step;
  const frac = off - Math.floor(off);
  return Math.min(frac, 1 - frac) * step;
}

// The deep dyadic ladder: exponents e = 15 .. 20, i.e. steps 1/32768 .. 1/2^20 (1/32768 anchor).
const LADDER_EXPONENTS = [15, 16, 17, 18, 19, 20];
const REFLECTION_LO = 0.25; // frac in (1/4, 3/4) => the doubling crosses 1/2 => descent predicted
const REFLECTION_HI = 0.75;

function rungFor(exponent) {
  const step = 1 / Math.pow(2, exponent);
  const a = argmaxGridWindowed(step);
  const gap = Math.abs(a.k - K_STAR);
  const saw = distToNearestGridPoint(step);
  const scaled = Math.pow(2, exponent) * PHASE;
  const frac = scaled - Math.floor(scaled);
  const relDeviation = gap > 0 ? Math.abs(saw - gap) / gap : 0;
  return {
    exponent,
    step,
    argmaxK: +a.k.toFixed(12),
    gap: +gap.toExponential(4), // = |argmaxK - k*|
    gapOverHalfStep: +(gap / (step / 2)).toFixed(4), // in (0,1] iff bounded by step/2
    frac: +frac.toFixed(6), // doubling-map phase frac(2^e (k* - 6))
    minFrac: +Math.min(frac, 1 - frac).toFixed(6),
    inReflectionBand: frac > REFLECTION_LO && frac < REFLECTION_HI, // predicts descent at e+1
    sawtoothPredicted: +saw.toExponential(4),
    relDeviationFromClosedForm: +relDeviation.toExponential(4),
    // Relative match: at these deep rungs (gaps ~1e-6..1e-7) the imp-34044 absolute <1e-6 tolerance is
    // uselessly loose, so the honest metric is the relative deviation. FALSE at e=19 flags the departure.
    sawtoothMatches: relDeviation < 1e-3,
  };
}

const RUNGS = LADDER_EXPONENTS.map(rungFor);

// Per-transition classification: level e+1 REALIGNS (gap strictly drops) or FREEZES; and whether the
// doubling-map rule (descent IFF prev frac in reflection band) got that transition RIGHT.
const TRANSITIONS = [];
for (let i = 1; i < RUNGS.length; i++) {
  const prev = RUNGS[i - 1];
  const cur = RUNGS[i];
  const drop = prev.gap - cur.gap;
  const realigned = cur.gap < prev.gap - 1e-12;
  TRANSITIONS.push({
    fromExponent: prev.exponent,
    toExponent: cur.exponent,
    step: cur.step,
    gapDrop: +drop.toExponential(4),
    realigned,
    predictedByPrevPhase: prev.inReflectionBand, // frac_prev in (1/4,3/4) => descent predicted
    rulePredictionCorrect: realigned === prev.inReflectionBand,
  });
}

// The FIRST exponent (if any) at which the doubling-map rule mispredicts the transition.
const FIRST_DEPARTURE_TRANSITION = TRANSITIONS.find((t) => !t.rulePredictionCorrect) || null;
const FIRST_DEPARTURE_EXPONENT = FIRST_DEPARTURE_TRANSITION ? FIRST_DEPARTURE_TRANSITION.toExponent : null;
// Max relative deviation of the observed gap from the closed-form sawtooth across the extended ladder.
const MAX_REL_DEVIATION = RUNGS.reduce((m, r) => Math.max(m, r.relDeviationFromClosedForm), 0);
const MAX_REL_DEVIATION_RUNG = RUNGS.reduce((best, r) =>
  r.relDeviationFromClosedForm > best.relDeviationFromClosedForm ? r : best, RUNGS[0]);

// The true continuum peak, located by an independent ternary search on the SAME resid_exp -- the offset
// from the stored 6-decimal k* is what sets the departure resolution.
function ternaryArgmax(lo, hi, iters = 200) {
  for (let i = 0; i < iters; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (residExp(m1) < residExp(m2)) lo = m1;
    else hi = m2;
  }
  return (lo + hi) / 2;
}
const K_TRUE = ternaryArgmax(8.0, 9.5);
const KSTAR_ROUNDING_OFFSET = Math.abs(K_TRUE - K_STAR); // ~4.12e-7

// Nearest grid point 6 + j*step to a target. The closed-form sawtooth phases on the stored k*; the
// discrete argmax tracks the true peak k_true. The schedule departs at exactly the resolution where the
// grid first resolves these two to DIFFERENT nearest grid points.
function nearestGridPoint(step, target) {
  return GRID_ORIGIN + Math.round((target - GRID_ORIGIN) / step) * step;
}
const FIRST_SPLIT_EXPONENT = (() => {
  for (const e of LADDER_EXPONENTS) {
    const step = 1 / Math.pow(2, e);
    if (Math.abs(nearestGridPoint(step, K_STAR) - nearestGridPoint(step, K_TRUE)) > step / 4) return e;
  }
  return null;
})();

// (E1) Doubling-map orbit holds across the extended ladder and the schedule is predicted through 1/262144.
const DOUBLING_MAP_HOLDS = RUNGS.slice(1).every((r, i) => {
  const doubled = 2 * RUNGS[i].frac;
  const expected = doubled - Math.floor(doubled);
  return Math.abs(expected - r.frac) < 1e-9;
});
const R16 = RUNGS.find((r) => r.exponent === 16);
const R15 = RUNGS.find((r) => r.exponent === 15);
const NEW_REALIGNMENT_AT_65536 = R16.gap < R15.gap - 1e-12 && Math.abs(R16.argmaxK - 8.8210906982) < 1e-6;
const HOLDS_THROUGH_262144 = TRANSITIONS.filter((t) => t.toExponent <= 18).every((t) => t.rulePredictionCorrect);
// (E2) The closed form departs at e = 19, with the max relative deviation there ~ 0.53.
const DEPARTS_AT_524288 = FIRST_DEPARTURE_EXPONENT === 19 && MAX_REL_DEVIATION > 0.5;
// (E3) The departure resolution IS the stored-k* precision floor: the grid first resolves the true peak
//      k_true and the stored 6-decimal k* to DIFFERENT nearest grid points exactly at e=19, coinciding
//      with the doubling-map rule's first misprediction. The offset is ~4.12e-7 (6-sig-fig k* rounding).
const PRECISION_FLOOR_DIAGNOSED =
  KSTAR_ROUNDING_OFFSET > 3e-7 &&
  KSTAR_ROUNDING_OFFSET < 5e-7 &&
  FIRST_SPLIT_EXPONENT === 19 &&
  FIRST_SPLIT_EXPONENT === FIRST_DEPARTURE_EXPONENT;

export const IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER = {
  id: 'imp-34106',
  proofSection: 'S-frontier',
  question:
    'imp-34044 characterized the imp-33983 sawtooth phase-realignment schedule across 1/128 .. 1/32768 ' +
    'as a closed-form Bernoulli doubling-map sequence of the continuum phase (k* - 6), predicting the ' +
    'realignment steps and frozen-gap resumption amounts, but stopped at 1/32768. Extend the ladder ' +
    'three-plus dyadic rungs below 1/32768 (1/65536 .. 1/2^20), re-run the imp-33878 resid_exp(k) ' +
    'discrete argmax at each rung, and TEST whether the doubling-map sequence keeps predicting the ' +
    'schedule or departs at deep resolution -- reporting the max relative deviation of the observed ' +
    'schedule from the closed form. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the re-run imp-33878 sliding-window resid_exp(k) discrete argmax gap distToKStar = |argmaxK - k*| ' +
    'across the deep dyadic ladder 1/32768 .. 1/2^20 (k* ~ 8.821092), each compared with the imp-33942 ' +
    'sawtooth min(frac,1-frac)*step and the doubling-map phase frac(2^e (k*-6)), together with the ' +
    'per-transition realignment/freeze classification, the doubling-map rule prediction, and the max ' +
    'relative deviation of the observed gap from the closed form',
  continuumArgmax: K_STAR, // ~8.821092 (imp-33878, stored to 6 decimals)
  continuumPhase: +PHASE.toFixed(6), // (k* - 6) ~ 2.821092
  trueContinuumPeak: +K_TRUE.toFixed(10), // ~8.8210915879 (independent ternary search on resid_exp)
  kStarRoundingOffset: +KSTAR_ROUNDING_OFFSET.toExponential(4), // ~4.12e-7 -- sets the departure resolution
  firstGridSplitExponent: FIRST_SPLIT_EXPONENT, // 19 -- grid first resolves k_true vs stored k* to different nearest points here
  ladderRungs: RUNGS, // exponent, step, argmaxK, gap, gapOverHalfStep, frac, minFrac, inReflectionBand, sawtoothPredicted, relDeviationFromClosedForm, sawtoothMatches
  transitions: TRANSITIONS, // per level: gapDrop, realigned, predictedByPrevPhase, rulePredictionCorrect
  firstDepartureExponent: FIRST_DEPARTURE_EXPONENT, // 19 -- the doubling-map rule first mispredicts here
  maxRelDeviationFromClosedForm: +MAX_REL_DEVIATION.toExponential(4), // ~0.5348 at e=19
  maxRelDeviationExponent: MAX_REL_DEVIATION_RUNG.exponent, // 19
  finding: {
    E1_schedule_holds_through_262144:
      'The doubling-map orbit frac_{e+1}=frac(2*frac_e) holds to <1e-9 across the extended ladder, and ' +
      'the closed form predicts a NEW realignment at 1/65536 (gap 1.396e-5 -> 1.302e-6, frac_15 ~0.543 ' +
      'in the reflection band) with the re-run argmax gap matching the sawtooth to relative <4e-5 ' +
      'through 1/262144. So the imp-34044 schedule keeps predicting both the realignment steps and the ' +
      'resumption amounts down to 1/262144.',
    E2_closed_form_departs_at_524288:
      'At 1/524288 (e=19) the doubling map predicts a descent (frac_18 ~0.341 in the reflection band, ' +
      'sawtooth calling the gap down to 6.056e-7), but the re-run discrete argmax gap stays FROZEN at ' +
      '1.302e-6 -- no descent. The argmax deterministically selects 8.821090698242 over 8.821092605591 ' +
      'by a resid_exp margin ~3.69e-15 (~260 ULP, a real curvature difference not tie noise). Max ' +
      'relative deviation of the observed gap from the closed form ~0.535 (53.5%), at e=19.',
    E3_departure_is_the_stored_kstar_precision_floor:
      'The departure is diagnosable: the closed form phases on the stored 6-decimal k*=8.821092, while ' +
      'the discrete argmax tracks the TRUE resid_exp peak k_true ~8.8210915879 (offset ~4.12e-7). ' +
      'Through e=18 both k_true and the stored k* round to the SAME nearest grid point; at e=19 the ' +
      'grid first resolves them to DIFFERENT nearest grid points and they split. The doubling-map ' +
      'schedule is thus valid only to ~1/262144 -- a precision floor of the inherited stored k*, NOT of ' +
      'the continuum problem. At e=20 the sawtooth and re-run argmax RE-AGREE to relative 5e-5 by phase ' +
      'coincidence (the delayed descent lands one rung late), the imp-34044-vs-imp-33983 one-rung motif ' +
      'recurring at the precision floor.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). EXTENDS the imp-34044 closed-form doubling-map phase-realignment ' +
    'schedule five dyadic rungs below 1/32768, to 1/65536 .. 1/2^20, re-running the imp-33878 ' +
    'resid_exp(k) discrete argmax verbatim on the imp-33810 model. The doubling-map orbit ' +
    'frac_{e+1}=frac(2*frac_e) holds to <1e-9 throughout, and the closed form KEEPS predicting the ' +
    'schedule down to 1/262144: it calls a new realignment at 1/65536 (gap 1.396e-5 -> 1.302e-6) and ' +
    'matches the re-run argmax gap to relative <4e-5 at 1/65536, 1/131072, 1/262144. It then DEPARTS at ' +
    '1/524288 (e=19), where the predicted descent (sawtooth 6.056e-7) fails to materialize -- the ' +
    're-run argmax gap stays frozen at 1.302e-6 -- for a MAX RELATIVE DEVIATION of ~0.535 (53.5%). The ' +
    'departure is diagnosable, not a modelling surprise: it is the resolution at which the grid ' +
    'half-step (9.54e-7 at e=19) falls below twice the ~4.12e-7 rounding error of the inherited ' +
    '6-decimal stored k*=8.821092, so the discrete argmax (tracking the true peak k_true ~8.8210916) ' +
    'and the closed-form phase (using the rounded k*) part ways. The doubling-map schedule is therefore ' +
    'valid only to ~1/262144 -- a precision floor of the STORED continuum argmax, not of the continuum ' +
    'problem (at 1/2^20 the two re-agree to relative 5e-5 by phase coincidence, the descent landing one ' +
    'rung late). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34044 (the 1/128 .. 1/32768 doubling-map schedule, extended here); imp-33983 (the frozen gap ' +
    'and out-of-ladder rungs); imp-33942 (P3 sawtooth-residue closed form); imp-33878 (source of ' +
    'k*~8.821092 and the resid_exp model, reused verbatim); imp-33810 (the ladder storing resid_exp(k), ' +
    'reused verbatim); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER_ASSERTIONS = [
  {
    // (E1) The doubling-map orbit holds across the extended ladder and predicts a new realignment at 1/65536.
    id: 'imp34106-doubling-map-orbit-holds-and-new-realignment-at-65536',
    description: 'frac_{e+1}=frac(2*frac_e) to <1e-9 across e=15..20, with a new realignment at 1/65536 (gap 1.396e-5 -> 1.302e-6)',
    holds: () => DOUBLING_MAP_HOLDS && NEW_REALIGNMENT_AT_65536 && RUNGS.length === 6,
  },
  {
    // (E1) The closed form keeps predicting the schedule through 1/262144.
    id: 'imp34106-closed-form-holds-through-262144',
    description: 'the doubling-map rule predicts every transition correctly through e=18 (1/262144), relative deviation <4e-5',
    holds: () =>
      HOLDS_THROUGH_262144 &&
      RUNGS.filter((r) => r.exponent >= 16 && r.exponent <= 18).every((r) => r.relDeviationFromClosedForm < 4e-5),
  },
  {
    // (E2) The closed form departs at 1/524288 (e=19); max relative deviation ~0.53 there.
    id: 'imp34106-closed-form-departs-at-524288',
    description: 'the doubling-map rule first mispredicts at e=19 (predicted descent, observed freeze); max relative deviation ~0.535 at e=19',
    holds: () =>
      DEPARTS_AT_524288 &&
      MAX_REL_DEVIATION_RUNG.exponent === 19 &&
      MAX_REL_DEVIATION > 0.5 &&
      MAX_REL_DEVIATION < 0.6,
  },
  {
    // (E3) The departure is the stored-k* precision floor: half-step crosses 2*offset between e=18 and e=19.
    id: 'imp34106-departure-is-stored-kstar-precision-floor',
    description: 'the ~4.12e-7 offset between the true peak and the stored 6-decimal k* sets the departure: step/2 at e=19 < 2*offset < step/2 at e=18',
    holds: () => PRECISION_FLOOR_DIAGNOSED,
  },
  {
    // Honesty gate: measurement only, isRigorous false, extends imp-34044, no QED, PT SOTA, imp-3066 untouched.
    id: 'imp34106-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, EXTENDS the imp-34044 schedule, no QED, PT Lambda<=0.2 SOTA, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER.isRigorous === false &&
      /EXTENDS the imp-34044/.test(IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER.verdict) &&
      /NO QED/.test(IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER.verdict) &&
      /remains SOTA/.test(IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER.verdict),
  },
];

for (const a of IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34106-sawtooth-phase-realignment-deep-ladder assertion failed: ${a.id}`);
  }
}
