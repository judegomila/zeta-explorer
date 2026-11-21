/**
 * @module imp-34265-argmax-unlock-residual-margin-classification
 *
 * imp-34265 (numerical, frontier-direction): imp-34196 F4 found that the fixed-band (k <= 10) argmax
 * rung of the imp-33843 log-linear OLS holds k = 6.50 through kEnd = 18.75 then creeps to k = 6.25 at
 * kEnd = 19.0, 19.25, 19.5 -- the "un-lock". imp-34047 F3 had earlier concluded (over kEnd = 14..17,
 * where imp-34040 measured the argmax LOCKED at 6.50) that the peak location STABILIZES / locks and does
 * NOT migrate steadily inward. Those two readings appear to conflict. This module adjudicates by measuring
 * the quantity neither predecessor reported: the RESIDUAL MARGIN between the two contending band rungs
 * (k = 6.50 and k = 6.25) across the un-lock window kEnd = 18.5 .. 19.5, and classifies whether the F4
 * un-lock is (a) a genuine RESOLVED crossover -- real resumed inward migration in tension with the
 * locked-at-6.50 reading -- or (b) a knife-edge sub-ULP TIE artifact, or (c) deep-tail contamination as
 * kEnd approaches the imp-34023 resid_exp pole at kEnd* ~ 21.281 (where estimators lose significance).
 *
 * WHAT "RESIDUAL MARGIN" MEANS (the discriminator imp-34196 F4 / imp-34047 never measured)
 * --------------------------------------------------------------------------------------
 *   fixedBandPeak reports only the ARGMAX rung and its residual -- a winner-take-all label that flips the
 *   instant the runner-up nudges ahead by any amount, however tiny. The un-lock 6.50 -> 6.25 is therefore
 *   uninterpretable from the argmax label alone: a flip driven by a 1e-15 float tie and a flip driven by a
 *   decisive residual reordering look identical. The MARGIN = res(top rung) - res(runner-up rung) -- and
 *   specifically the signed gap res(6.50) - res(6.25) of the two persistent leaders -- resolves this: a
 *   knife-edge margin near the flip means a fragile tie; a margin that crosses zero cleanly and then WIDENS
 *   means a genuine reordering.
 *
 * THE MEASUREMENT (imp-34196 machinery reused verbatim; only the per-rung band residuals are newly exposed)
 * --------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-34040/imp-34109/imp-34196. No re-derivation.
 *   Ladder / OLS     imp-33810 quarter-decade ladder k = 6.00 .. kEnd, imp-33843 log-linear OLS residual
 *                    vector -- the identical construction imp-34196 fixedBandPeak reads its argmax from.
 *   Window           kEnd = 18.5, 18.75, 19.0, 19.25, 19.5 (5 windows straddling the imp-34196 F4 un-lock
 *                    at 19.0), the imp-33810 ladder 0.25 rung spacing (finest kEnd resolves).
 *   Margin           per window: the top band residual and its rung, the runner-up residual and its rung,
 *                    the top-minus-runner-up margin, and the signed gap res(6.50) - res(6.25).
 *   Widening test    past the crossover, the successive 6.25-lead magnitudes and their increments -- LINEAR
 *                    (constant increments) vs DIVERGENT (accelerating, the 1/(kEnd* - kEnd) pole signature).
 *
 * THE FINDING (measurement / classification only -- the un-lock is a GENUINE RESOLVED crossover, NOT a tie
 * artifact; it is a delayed SECOND creep step in tension with the locked-at-6.50 reading but does NOT reach
 * the band floor, and the widening is LINEAR so NOT yet dominated by the k* ~ 21.281 pole)
 * ------------------------------------------------------------------------------------------------------------
 *   (F1) THE 6.50/6.25 GAP NARROWS TO A KNIFE-EDGE THEN CROSSES ZERO CLEANLY. res(6.50) - res(6.25) runs
 *        +0.001360 (kEnd=18.5) -> +0.000224 (18.75, the knife-edge) -> -0.000892 (19.0) -> -0.002001 (19.25)
 *        -> -0.003120 (19.5). The minimum |gap| is 0.000224 at kEnd = 18.75 -- small but ~1e12 x the float
 *        ULP of the ~0.77 residuals, so the crossover is genuinely RESOLVED, NOT a sub-ULP tie.
 *   (F2) 6.50 AND 6.25 ARE ALWAYS THE TOP TWO BAND RUNGS; THE MARGIN IS EXACTLY THEIR GAP. Across all 5
 *        windows the argmax and runner-up are {6.50, 6.25}, so the band top-minus-runner-up margin equals
 *        |res(6.50) - res(6.25)|: 0.001360, 0.000224, 0.000892, 0.002001, 0.003120. The un-lock is a
 *        two-horse race, not a scramble -- consistent with imp-34047 s convex single-peak band.
 *   (F3) PAST THE CROSSOVER THE 6.25 LEAD WIDENS MONOTONICALLY AND ~LINEARLY -- NOT A POLE BLOW-UP. The
 *        post-flip 6.25-lead magnitudes 0.000892 -> 0.002001 -> 0.003120 rise with near-constant increments
 *        (+0.001109, +0.001119; second difference ~ +1e-5), i.e. LINEAR widening. A resid_exp-pole
 *        contamination approaching kEnd* ~ 21.281 would widen DIVERGENTLY (~ 1/(kEnd* - kEnd)); at
 *        kEnd <= 19.5 (still ~1.8 boundary decades short of the pole) the margin shows no such acceleration.
 *   (F4) CLASSIFICATION: a GENUINE RESOLVED SECOND CREEP STEP, in tension with the LOCKED-at-6.50 reading
 *        but NOT reaching the band floor. The un-lock resolves cleanly (F1) and widens decisively (F3), so
 *        it is real, not a tie artifact -- the imp-34047 kEnd=14..17 "argmax locked at 6.50" reading does
 *        NOT persist past kEnd = 18.75. BUT the rung reaches only 6.25 (one imp-33810 step above the band
 *        floor 6.00) through kEnd = 19.5, so imp-34047 s STRONGER claim -- that the peak does not march
 *        steadily to the floor -- is NOT falsified: this is one further delayed step, coincident with the
 *        imp-34196 increment-minimum inflection kEnd* ~ 18.64 driven by the same approaching-pole OLS tilt.
 *        A deep-tail (pole) ORIGIN for the step cannot be excluded, but its within-window signature (linear,
 *        resolved) is that of a real reordering, not a numerical artifact.
 *
 * The punchline: exposing the per-rung band residuals imp-34196 fixedBandPeak hides, the imp-34196 F4 argmax
 * un-lock 6.50 -> 6.25 is a GENUINELY RESOLVED crossover -- the two leaders  gap narrows to a knife-edge
 * +0.000224 at kEnd = 18.75 (still ~1e12 x float ULP, not a tie), crosses zero at the 18.75 -> 19.0 step,
 * then the 6.25 lead widens monotonically and LINEARLY (increments ~ +0.00111, second diff ~ +1e-5), with
 * no 1/(kEnd* - kEnd) pole-divergence at kEnd <= 19.5. So the un-lock is real resumed inward migration that
 * un-locks the imp-34047 kEnd=14..17 "locked at 6.50" reading -- but it reaches only k = 6.25 (one step above
 * the band floor), so imp-34047 s stronger "does not march to the floor" verdict is NOT falsified; it is a
 * single delayed second creep step whose deep-tail (imp-34023 pole) origin cannot be excluded.
 *
 * MEASUREMENT / RESIDUAL-MARGIN CLASSIFICATION ONLY. A descriptive read of an inherited-surrogate argmax
 * flip, NOT an RH bound and distinct from any form selection (the imp-33843 log-linear-over-power-law
 * verdict, the imp-33940 R2 finding, and the imp-34047 / imp-34196 drift readings it adjudicates are
 * untouched). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the OLS surrogate and the crossover/widening classification are descriptive, not derived; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (F4 there is the argmax un-lock this classifies; machinery reused verbatim)
 * @see imp-34047-argmax-rung-creep-descent-law (the kEnd=14..17 "peak stabilizes / locked at 6.50" verdict this adjudicates)
 * @see imp-34040-fixed-band-drift-saturation-decade (the kEnd=14..17 argmax-locked-at-6.50 measurement imp-34047 relied on)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the resid_exp pole kEnd* ~ 21.281 the deep-tail hypothesis invokes)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the same fixed-band peak tracked to the same pole)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim; its 0.25 rung spacing sets the two contending rungs)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 *
 * IMPORT-WEIGHT AUDIT: this module imports only lambda-rh-height-mapping and polymath15-constant-C-C, the
 * identical light two-module chain the imp-34196 audit traced and confirmed does NOT reach the 20.8MB
 * zeros-to-1e6.js bundle; per [[no_heavy_imports_in_pages]] it stays safe to import from a lazy-loaded page.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34196
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34196.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

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
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-34196.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const lo = Math.pow(10, kk);
    const hi = Math.pow(10, kk + 1);
    const pSigma = olsSigmaExponent(lo, hi);
    const pEcoll = ecollExponentMag(lo, hi);
    const ph = parts(hi);
    const residExp = pEcoll * (1 - ph.sigma) - pSigma;
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}

// imp-33843 log-linear OLS residual vector on a ladder, verbatim imp-34196.
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}

// NEW: the full band residual table (k <= kMax) sorted descending, plus the residual of a named rung.
function bandResiduals(R, kMax) {
  const { KS, RES } = residualVector(R);
  const rows = [];
  for (let i = 0; i < RES.length; i++) if (KS[i] <= kMax + 1e-9) rows.push({ k: KS[i], res: RES[i] });
  rows.sort((a, b) => b.res - a.res);
  return rows;
}
function rungRes(rows, kTarget) {
  const hit = rows.find((r) => Math.abs(r.k - kTarget) < 1e-9);
  return hit ? hit.res : NaN;
}

const FIXED_BAND_KMAX = 10.0; // identical boundary-independent band to imp-34047 / imp-34196
const RUNG_A = 6.5; // the imp-34047 locked rung
const RUNG_B = 6.25; // the imp-34196 F4 un-lock target rung (one imp-33810 step in)
const BAND_FLOOR_K = 6.0; // imp-33810 ladder floor -- the imp-34047 stronger-claim target
const RESID_EXP_POLE_KEND = 21.281; // imp-34023 bisected resid_exp sign-change ceiling (deep-tail hypothesis)

// 5 windows straddling the imp-34196 F4 un-lock at kEnd = 19.0.
const K_ENDS = [18.5, 18.75, 19.0, 19.25, 19.5];

const MARGIN_ROWS = K_ENDS.map((kEnd) => {
  const rows = bandResiduals(buildLadder(kEnd), FIXED_BAND_KMAX);
  const top = rows[0];
  const runnerUp = rows[1];
  const res650 = rungRes(rows, RUNG_A);
  const res625 = rungRes(rows, RUNG_B);
  return {
    kEnd,
    argmaxK: top.k,
    topRes: +top.res.toFixed(6),
    runnerUpK: runnerUp.k,
    runnerUpRes: +runnerUp.res.toFixed(6),
    margin: +(top.res - runnerUp.res).toFixed(6), // top minus runner-up (>= 0 by construction)
    res650: +res650.toFixed(6),
    res625: +res625.toFixed(6),
    gap650minus625: +(res650 - res625).toFixed(6), // signed: > 0 while 6.50 leads, < 0 after the flip
  };
});

// (F1) The signed 6.50-minus-6.25 gap, its knife-edge (minimum |gap|), and the zero-crossing step.
const GAPS = MARGIN_ROWS.map((r) => r.gap650minus625); // +.., knife-edge, -.., -.., -..
let KNIFE_I = 0;
for (let i = 1; i < GAPS.length; i++) if (Math.abs(GAPS[i]) < Math.abs(GAPS[KNIFE_I])) KNIFE_I = i;
const KNIFE_EDGE_GAP = Math.abs(GAPS[KNIFE_I]); // ~0.000224 at kEnd = 18.75
const KNIFE_EDGE_KEND = K_ENDS[KNIFE_I]; // 18.75
let GAP_CROSSES_ZERO = false;
let CROSS_STEP_KEND = null;
for (let i = 1; i < GAPS.length; i++) {
  if (GAPS[i - 1] > 0 && GAPS[i] < 0) {
    GAP_CROSSES_ZERO = true;
    CROSS_STEP_KEND = K_ENDS[i]; // 19.0 -- first window where 6.25 leads
    break;
  }
}
// A resolved (non-tie) crossover: the knife-edge margin is orders of magnitude above the float ULP of the
// ~0.77 residuals (~1.7e-16), i.e. the flip is a real reordering, not a sub-ULP numerical tie.
const RESID_SCALE = Math.max(...MARGIN_ROWS.map((r) => Math.abs(r.topRes)));
const ULP_AT_SCALE = RESID_SCALE * Number.EPSILON; // ~1.7e-16
const KNIFE_EDGE_ULPS = KNIFE_EDGE_GAP / ULP_AT_SCALE; // ~1.3e12 -- vastly resolved
const CROSSOVER_RESOLVED = KNIFE_EDGE_GAP > 1e6 * ULP_AT_SCALE; // not a tie artifact

// (F2) 6.50 and 6.25 are always the top two band rungs, so the band margin IS their gap magnitude.
const TWO_HORSE_RACE = MARGIN_ROWS.every(
  (r) =>
    (r.argmaxK === RUNG_A || r.argmaxK === RUNG_B) &&
    (r.runnerUpK === RUNG_A || r.runnerUpK === RUNG_B) &&
    Math.abs(r.margin - Math.abs(r.gap650minus625)) < 1e-9
);

// (F3) Post-crossover 6.25-lead magnitudes and whether the widening is LINEAR (not a pole blow-up).
const POST_LEADS = GAPS.filter((g) => g < 0).map((g) => -g); // 0.000892, 0.002001, 0.003120
const WIDENING_INCS = [];
for (let i = 1; i < POST_LEADS.length; i++) WIDENING_INCS.push(+(POST_LEADS[i] - POST_LEADS[i - 1]).toFixed(6));
const WIDENING_MONOTONIC = POST_LEADS.every((v, i) => i === 0 || v > POST_LEADS[i - 1]);
// Linear widening: successive increments near-equal (|second difference| small vs the increment). A
// 1/(kEnd* - kEnd) pole blow-up would ACCELERATE (increments rising fast). Here second diff ~ +1e-5.
const WIDENING_SECOND_DIFF =
  WIDENING_INCS.length >= 2 ? +(WIDENING_INCS[1] - WIDENING_INCS[0]).toFixed(6) : NaN;
const MEAN_WIDENING_INC = WIDENING_INCS.reduce((a, b) => a + b, 0) / WIDENING_INCS.length;
const WIDENING_IS_LINEAR = Math.abs(WIDENING_SECOND_DIFF) < 0.1 * Math.abs(MEAN_WIDENING_INC);
const POLE_DIVERGENT = !WIDENING_IS_LINEAR && WIDENING_SECOND_DIFF > 0; // no accelerating blow-up here

// (F4) Classification booleans against the imp-34047 verdict.
const ARGMAX_UNLOCK_KEND = (() => {
  for (let i = 1; i < MARGIN_ROWS.length; i++)
    if (MARGIN_ROWS[i].argmaxK !== MARGIN_ROWS[0].argmaxK) return MARGIN_ROWS[i].kEnd;
  return null;
})(); // 19.0
const LOCKED_AT_650_READING_UNLOCKS = ARGMAX_UNLOCK_KEND !== null && CROSSOVER_RESOLVED; // imp-34047 narrow reading falsified
const REACHES_BAND_FLOOR = MARGIN_ROWS.some((r) => r.argmaxK <= BAND_FLOOR_K + 1e-9); // false: only 6.25
const MARCH_TO_FLOOR_FALSIFIED = LOCKED_AT_650_READING_UNLOCKS && REACHES_BAND_FLOOR; // false -- one step only
// The honest classification: a genuine RESOLVED second creep step (not a tie artifact, not a pole blow-up),
// tensioning the locked-at-6.50 reading but NOT reaching the floor -- deep-tail origin not excluded.
const GENUINE_RESOLVED_SECOND_STEP =
  CROSSOVER_RESOLVED && WIDENING_MONOTONIC && WIDENING_IS_LINEAR && LOCKED_AT_650_READING_UNLOCKS && !REACHES_BAND_FLOOR;

export const IMP34265_ARGMAX_UNLOCK_RESIDUAL_MARGIN_CLASSIFICATION = {
  id: 'imp-34265',
  proofSection: 'S-frontier',
  question:
    'imp-34196 F4 found the fixed-band (k <= 10) argmax rung un-locks 6.50 -> 6.25 at kEnd = 19.0, while ' +
    'imp-34047 F3 concluded (over kEnd = 14..17) the peak location STABILIZES / locks at 6.50. Measuring the ' +
    'residual MARGIN between the two contending rungs across kEnd = 18.5 .. 19.5, is the un-lock a genuine ' +
    'resolved crossover (falsifying the locked-at-6.50 reading), a knife-edge tie artifact, or deep-tail ' +
    'contamination approaching the imp-34023 resid_exp pole kEnd* ~ 21.281? Measurement only; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'Per boundary kEnd = 18.5, 18.75, 19.0, 19.25, 19.5: the top band residual (k <= 10) and its rung, the ' +
    'runner-up residual and its rung, the top-minus-runner-up margin, and the signed gap res(6.50) - ' +
    'res(6.25); the knife-edge (minimum |gap|), the zero-crossing step, and the post-crossover 6.25-lead ' +
    'widening increments (linear vs pole-divergent)',
  fixedBandKMax: FIXED_BAND_KMAX,
  contendingRungs: [RUNG_A, RUNG_B],
  bandFloorK: BAND_FLOOR_K,
  residExpPoleKEnd: RESID_EXP_POLE_KEND,
  kEnds: K_ENDS,
  marginRows: MARGIN_ROWS, // {kEnd, argmaxK, topRes, runnerUpK, runnerUpRes, margin, res650, res625, gap650minus625} x 5
  gap650minus625: GAPS, // +0.001360, +0.000224, -0.000892, -0.002001, -0.003120
  knifeEdgeGap: +KNIFE_EDGE_GAP.toFixed(6), // ~0.000224 -- minimum |gap|, the near-tie
  knifeEdgeKEnd: KNIFE_EDGE_KEND, // 18.75 -- last window before the flip
  knifeEdgeUlps: +KNIFE_EDGE_ULPS.toExponential(3), // ~1.3e12 -- knife-edge vastly above float ULP => resolved
  crossoverResolved: CROSSOVER_RESOLVED, // true -- a real reordering, not a sub-ULP tie
  gapCrossesZero: GAP_CROSSES_ZERO, // true
  crossoverStepKEnd: CROSS_STEP_KEND, // 19.0 -- first window where 6.25 leads
  twoHorseRace: TWO_HORSE_RACE, // true -- {6.50, 6.25} are always the top two; margin = their gap magnitude
  argmaxUnlockKEnd: ARGMAX_UNLOCK_KEND, // 19.0 (reproduces imp-34196 F4)
  postCrossoverLeads: POST_LEADS.map((v) => +v.toFixed(6)), // 0.000892, 0.002001, 0.003120
  wideningIncrements: WIDENING_INCS, // +0.001109, +0.001119 -- near-constant => linear
  wideningSecondDiff: WIDENING_SECOND_DIFF, // ~ +0.000010 -- essentially flat
  wideningMonotonic: WIDENING_MONOTONIC, // true
  wideningIsLinear: WIDENING_IS_LINEAR, // true -- NOT a 1/(kEnd* - kEnd) pole blow-up at kEnd <= 19.5
  poleDivergent: POLE_DIVERGENT, // false -- no accelerating deep-tail signature within the window
  lockedAt650ReadingUnlocks: LOCKED_AT_650_READING_UNLOCKS, // true -- imp-34047 narrow reading falsified past 18.75
  reachesBandFloor: REACHES_BAND_FLOOR, // false -- rung reaches only 6.25 through kEnd = 19.5
  marchToFloorFalsified: MARCH_TO_FLOOR_FALSIFIED, // false -- imp-34047 stronger claim NOT falsified
  genuineResolvedSecondStep: GENUINE_RESOLVED_SECOND_STEP, // TRUE -- the classification verdict
  finding: {
    F1_gap_narrows_to_knife_edge_then_crosses_cleanly:
      'res(6.50) - res(6.25) runs +0.001360 (kEnd=18.5) -> +0.000224 (18.75, the knife-edge) -> -0.000892 ' +
      '(19.0) -> -0.002001 (19.25) -> -0.003120 (19.5). The minimum |gap| 0.000224 at kEnd = 18.75 is ~1.3e12 ' +
      'x the float ULP of the ~0.77 residuals, so the crossover is genuinely RESOLVED, NOT a sub-ULP tie.',
    F2_two_horse_race_margin_is_the_gap:
      'Across all 5 windows the argmax and runner-up band rungs are {6.50, 6.25}, so the band top-minus-' +
      'runner-up margin equals |res(6.50) - res(6.25)| (0.001360, 0.000224, 0.000892, 0.002001, 0.003120) -- ' +
      'a two-horse race, not a scramble, consistent with the imp-34047 convex single-peak band.',
    F3_post_crossover_widening_is_linear_not_pole_divergent:
      'The post-flip 6.25-lead magnitudes 0.000892 -> 0.002001 -> 0.003120 rise with near-constant increments ' +
      '(+0.001109, +0.001119; second difference ~ +1e-5) -- LINEAR widening. A resid_exp-pole contamination ' +
      'approaching kEnd* ~ 21.281 would widen DIVERGENTLY (~ 1/(kEnd* - kEnd)); at kEnd <= 19.5 (~1.8 boundary ' +
      'decades short of the pole) the margin shows no such acceleration.',
    F4_classification_resolved_second_step_not_to_floor:
      'The un-lock resolves cleanly (F1) and widens decisively and linearly (F3), so it is a GENUINE resumed ' +
      'inward-migration step, NOT a tie artifact -- the imp-34047 kEnd=14..17 "argmax locked at 6.50" reading ' +
      'does NOT persist past kEnd = 18.75. BUT the rung reaches only 6.25 (one imp-33810 step above the band ' +
      'floor 6.00) through kEnd = 19.5, so imp-34047 s STRONGER claim (the peak does not march steadily to the ' +
      'floor) is NOT falsified: this is one delayed second creep step, coincident with the imp-34196 increment-' +
      'minimum inflection kEnd* ~ 18.64 driven by the same approaching-pole OLS tilt, whose deep-tail origin ' +
      'cannot be excluded but whose within-window signature is a real reordering, not a numerical artifact.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / RESIDUAL-MARGIN CLASSIFICATION (frontier-direction, NOT rigorous). Exposing the per-rung ' +
    'band residuals the imp-34196 fixedBandPeak argmax label hides, the imp-34196 F4 un-lock 6.50 -> 6.25 is a ' +
    'GENUINELY RESOLVED crossover: res(6.50) - res(6.25) narrows to a knife-edge +0.000224 at kEnd = 18.75 ' +
    '(~1.3e12 x the ~1.7e-16 float ULP of the ~0.77 residuals, so NOT a sub-ULP tie), crosses zero at the ' +
    '18.75 -> 19.0 step, then the 6.25 lead widens monotonically and LINEARLY (increments +0.001109, ' +
    '+0.001119; second diff ~ +1e-5), with no 1/(kEnd* - kEnd) divergence at kEnd <= 19.5 (still ~1.8 ' +
    'boundary decades short of the imp-34023 resid_exp pole kEnd* ~ 21.281). So the un-lock is REAL resumed ' +
    'inward migration that un-locks the imp-34047 kEnd=14..17 "locked at 6.50" reading past kEnd = 18.75 -- ' +
    'but it reaches only k = 6.25 (one imp-33810 step above the band floor 6.00), so imp-34047 s stronger ' +
    '"does not march steadily to the floor" verdict is NOT falsified; it is a single delayed second creep ' +
    'step, coincident with the imp-34196 increment-minimum inflection kEnd* ~ 18.64 driven by the same ' +
    'approaching-pole OLS tilt, whose deep-tail (imp-34023 pole) origin cannot be excluded but whose ' +
    'within-window signature is a resolved reordering, not a tie artifact. Distinct from any form selection; ' +
    'the imp-33843 log-linear verdict, the imp-33940 R2 finding, and the imp-34047 / imp-34196 drift readings ' +
    'are untouched. The OLS surrogate and the crossover/widening classification are descriptive, not derived; ' +
    'the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34196 (the F4 argmax un-lock this classifies; machinery reused verbatim); imp-34047 (the kEnd=14..17 ' +
    '"peak stabilizes / locked at 6.50" verdict adjudicated); imp-34040 (the argmax-locked-at-6.50 ' +
    'measurement imp-34047 relied on); imp-34023 (the resid_exp pole kEnd* ~ 21.281 of the deep-tail ' +
    'hypothesis); imp-33810 (the k=6.. ladder reused verbatim; its 0.25 rung spacing sets the two contending ' +
    'rungs); imp-33843 (the log-linear OLS whose fixed-band residuals are read); imp-486 (C_mb GUE-conditional).',
};

export const IMP34265_ARGMAX_UNLOCK_RESIDUAL_MARGIN_CLASSIFICATION_ASSERTIONS = [
  {
    // Reuse gate: 5 windows kEnd 18.5..19.5; the argmax reproduces imp-34196 F4 (6.50 through 18.75, un-lock
    // to 6.25 at 19.0), and 6.50/6.25 are always the top two band rungs.
    id: 'imp34265-reuse-gate-reproduces-imp34196-f4',
    description: '5 windows kEnd 18.5..19.5; argmax 6.50 through 18.75 then 6.25 at 19.0 (reproduces imp-34196 F4); {6.50,6.25} always top two',
    holds: () =>
      MARGIN_ROWS.length === 5 &&
      MARGIN_ROWS[0].argmaxK === 6.5 &&
      MARGIN_ROWS[1].argmaxK === 6.5 &&
      MARGIN_ROWS[2].argmaxK === 6.25 &&
      MARGIN_ROWS[MARGIN_ROWS.length - 1].argmaxK === 6.25 &&
      ARGMAX_UNLOCK_KEND === 19.0 &&
      TWO_HORSE_RACE === true,
  },
  {
    // (F1) The signed 6.50-minus-6.25 gap narrows to a knife-edge ~0.000224 at kEnd = 18.75, crosses zero at
    // 19.0, and the knife-edge is orders of magnitude above the float ULP -- a RESOLVED crossover, not a tie.
    id: 'imp34265-gap-narrows-then-crosses-resolved',
    description: 'gap +0.00136 -> +0.000224 (knife-edge, 18.75) -> negative; crosses zero at 19.0; knife-edge >> float ULP (resolved)',
    holds: () =>
      GAPS[0] > 0 &&
      GAPS[1] > 0 &&
      GAPS[2] < 0 &&
      Math.abs(KNIFE_EDGE_GAP - 0.000224) < 5e-5 &&
      KNIFE_EDGE_KEND === 18.75 &&
      GAP_CROSSES_ZERO === true &&
      CROSS_STEP_KEND === 19.0 &&
      CROSSOVER_RESOLVED === true,
  },
  {
    // (F3) The post-crossover 6.25 lead widens monotonically and LINEARLY (near-constant increments,
    // |second diff| < 10% of the mean increment) -- no 1/(kEnd* - kEnd) pole divergence within the window.
    id: 'imp34265-post-crossover-widening-linear-not-pole',
    description: 'post-flip 6.25 lead 0.000892 -> 0.002001 -> 0.003120 widens monotonically and linearly; not pole-divergent',
    holds: () =>
      POST_LEADS.length === 3 &&
      WIDENING_MONOTONIC === true &&
      WIDENING_IS_LINEAR === true &&
      POLE_DIVERGENT === false &&
      Math.abs(WIDENING_SECOND_DIFF) < 1e-4,
  },
  {
    // (F4) Classification: a genuine resolved second creep step that un-locks the locked-at-6.50 reading but
    // does NOT reach the band floor (rung reaches only 6.25), so imp-34047 s stronger march-to-floor claim
    // is not falsified.
    id: 'imp34265-classification-resolved-step-not-to-floor',
    description: 'locked-at-6.50 reading un-locks (resolved); rung reaches only 6.25 (not the floor 6.00); march-to-floor NOT falsified',
    holds: () =>
      LOCKED_AT_650_READING_UNLOCKS === true &&
      REACHES_BAND_FLOOR === false &&
      MARCH_TO_FLOOR_FALSIFIED === false &&
      GENUINE_RESOLVED_SECOND_STEP === true,
  },
  {
    // Honesty gate: measurement/classification only, isRigorous false, no QED, no refereed bound is changed, C_mb / imp-3066
    // untouched.
    id: 'imp34265-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, C_mb GUE-conditional / imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34265_ARGMAX_UNLOCK_RESIDUAL_MARGIN_CLASSIFICATION.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34265_ARGMAX_UNLOCK_RESIDUAL_MARGIN_CLASSIFICATION.verdict) &&
      /NO QED/.test(IMP34265_ARGMAX_UNLOCK_RESIDUAL_MARGIN_CLASSIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP34265_ARGMAX_UNLOCK_RESIDUAL_MARGIN_CLASSIFICATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34265_ARGMAX_UNLOCK_RESIDUAL_MARGIN_CLASSIFICATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34265_ARGMAX_UNLOCK_RESIDUAL_MARGIN_CLASSIFICATION.verdict),
  },
];

for (const a of IMP34265_ARGMAX_UNLOCK_RESIDUAL_MARGIN_CLASSIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34265-argmax-unlock-residual-margin-classification assertion failed: ${a.id}`);
  }
}
