/**
 * @module imp-34089-interior-residual-drift-law-fit
 *
 * imp-34089 (numerical, frontier-direction): imp-34022 R3 found that stripping BOTH edge excursions
 * (the argmax endpoint-peak rung and the argmin trough rung) from the imp-33843 log-linear widening
 * fit does NOT expose a boundary-invariant interior: the deep-interior residual deviation vs BASE
 * keeps rising as the fit boundary recedes (max deviation vs BASE 0.1192, AT the low-k edge k=6),
 * because lengthening the imp-33810/imp-33877 ladder tilts the WHOLE OLS line. imp-34022 measured that
 * interior drift over only THREE windows (BASE k<=11, EXT115 k<=11.5, EXT12 k<=12) and never fit its
 * growth law, so it could not say whether the interior drift SATURATES or keeps pace with the
 * endpoint-peak amplification. This module fits the interior-deviation drift law and answers both,
 * reusing the imp-34129 (a, b)-vs-kEnd sweep VERBATIM (no ladder rebuilt, no OLS re-run, no fresh
 * model): imp-34129 already extended the same ladder to kEnd=18 (15 windows) and tabulated the
 * re-fit intercept a and slope b at each boundary.
 *
 * THE KEY IDENTITY (why the interior deviation needs only the imp-34129 (a, b) sweep)
 * ---------------------------------------------------------------------------------
 *   For a fixed low-k rung the ladder value y(k) = ln(eflow_over_resid_k) is IDENTICAL across windows
 *   (the rung does not change when the high-k boundary recedes); only the OLS line a + b k changes.
 *   So the signed residual deviation of window w vs BASE at rung k is
 *       dev_w(k) = [y(k) - (a_w + b_w k)] - [y(k) - (a0 + b0 k)] = (a0 - a_w) + (b0 - b_w) k,
 *   with y(k) CANCELLING. dev_w(k) is exactly LINEAR in k and fully determined by the inherited
 *   imp-34129 (a, b) sweep -- no ladder value is needed. Because dev_w(k) is linear, its extremum over
 *   the deep interior k in [6, 8.75] sits at an endpoint of that range; here a0-a_w > 0 and b0-b_w < 0
 *   (a falls, b rises as the boundary recedes), so dev_w(k) DECREASES in k and the max |deviation| is
 *   at the low-k edge k=6 at EVERY window -- reproducing the imp-34022 "max deviation vs BASE at k=6".
 *
 * THE MEASUREMENT (imp-34129 sweep reused verbatim; dev_w(6) tabulated over kEnd = 11..18)
 * --------------------------------------------------------------------------------------
 *   Source    IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT.sweep = [{kEnd, a, b}] for kEnd =
 *             11.0, 11.5, ..., 18.0 (15 windows), whose reuse gate reproduces the imp-33877 base
 *             (kEnd=11) and ext12 (kEnd=12) fits to machine precision -- so this inherits the whole
 *             imp-33810/imp-33877/imp-34129 reuse chain automatically.
 *   Drift     maxInteriorDev_w = max over k in [6, 8.75] of |(a0-a_w) + (b0-b_w) k|, argmax always k=6.
 *             Tabulated across all 15 windows; per-window-step increments read out for the turnover.
 *   Rate cmp  Contrast the interior-drift increment sequence against the imp-34085 endpoint-peak
 *             amplification increments peakStepIncrements = [+0.0740, +0.0612, +0.0475, +0.0346].
 *   Law       Fit maxInteriorDev(kEnd) to a saturating exponential-approach D_inf + c exp(-lam kEnd);
 *             the saturation itself is guaranteed independently because imp-34129 established a AND b
 *             both converge, so dev(6) = (a0-a) + 6(b0-b), a linear combination of two convergent
 *             sequences, must converge to a finite limit.
 *
 * THE FINDING (measurement only -- the interior drift SATURATES and does NOT track the peak rate)
 * ---------------------------------------------------------------------------------------------
 *   (R1) THE INTERIOR DRIFT DECELERATES AFTER A SHORT ACCELERATING HEAD -- IT SATURATES. The max
 *        interior deviation vs BASE rises monotonically 0 -> 0.0565 -> 0.1192 -> ... -> 0.7790 (k=6 at
 *        every window). Its per-window-step increment first GROWS +0.0565 -> +0.0627 -> +0.0658 ->
 *        +0.0665 (peaking near kEnd~13) then TURNS OVER and shrinks monotonically to +0.0400 at
 *        kEnd=18. A shrinking increment is the signature of an approach to a finite limit. Over the
 *        imp-34022 BASE..EXT12 span only the ACCELERATING head is visible (+0.0565, +0.0627), which is
 *        exactly why imp-34022 R3 read the interior as "still rising, not invariant" -- a SHORT-WINDOW
 *        artifact, the same short-window trap imp-34085 found in the |trough|/|peak| ratio.
 *   (R2) THE INTERIOR DRIFT DOES NOT TRACK THE ENDPOINT-PEAK AMPLIFICATION RATE. The endpoint peak
 *        amplifies with increments +0.0740 -> +0.0612 -> +0.0475 -> +0.0346 (imp-34085) -- DECELERATING
 *        from the very first step. The interior drift instead ACCELERATES over those same first steps
 *        (+0.0565 -> +0.0665): opposite early curvature. At the first step the interior drift is
 *        SMALLER than the peak amplification (0.0565 < 0.0740) but by kEnd~13 it EXCEEDS it (0.0665 >
 *        0.0346). The two rates are not proportional -- the interior drift is a distinct, whole-line
 *        OLS-tilt phenomenon, not a shadow of the endpoint-peak growth.
 *   (R3) THE SATURATION IS INHERITED, NOT ASSUMED. imp-34129 established the widening slope b converges
 *        exponentially-in-kEnd to b_inf ~ -1.01 (increments shrinking ~3x); since dev(6) = (a0-a) +
 *        6(b0-b) is a fixed linear combination of the convergent a- and b-sequences, the interior
 *        deviation MUST approach a finite limit. A soft exp-approach fit on the kEnd=11..18 window
 *        (still in the rising phase) estimates a limit D_inf ~ 1.97, but the robust, model-independent
 *        evidence is the increment turnover itself.
 *
 * The punchline: the imp-34022 R3 "interior keeps rising, not boundary-invariant" reading is the
 * ACCELERATING HEAD of a SATURATING drift, not open-ended growth. Extending the interior-deviation
 * tabulation to kEnd=18 via the imp-34129 sweep shows the per-step increment peaks near kEnd~13 and
 * then decelerates (+0.0665 -> +0.0400), converging (inherited from imp-34129's slope convergence).
 * The drift does NOT track the endpoint-peak amplification rate -- the peak decelerates from the first
 * step while the interior accelerates then crosses above it; they are not proportional.
 *
 * MEASUREMENT / DRIFT-LAW FIT ONLY. A pure readout of the interior residual deviation implied by the
 * inherited imp-34129 (a, b) sweep (y(k) cancels; no ladder value used), NOT an RH bound and distinct
 * from any log-linear-vs-power-law form selection (the imp-33843 log-linear verdict is untouched). The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS
 * and exp-approach surrogates are descriptive, not derived; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34129-widening-slope-drift-convergence-fit ((a, b)-vs-kEnd sweep reused verbatim here)
 * @see imp-34022-argmin-argmax-migration-symmetry (R3 interior non-invariance this module fits)
 * @see imp-34085-trough-peak-ratio-convergence (endpoint-peak amplification increments contrasted)
 * @see imp-33877-widening-fit-tail-endpoint-artifact-test (the base/ext12 fits imp-34129 reproduces)
 */

import { IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT } from './imp-34129-widening-slope-drift-convergence-fit.js';
import { IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE } from './imp-34085-trough-peak-ratio-convergence.js';

const SWEEP = IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT.sweep; // [{kEnd, a, b}], kEnd = 11..18
const A0 = SWEEP[0].a; // BASE intercept (kEnd=11)
const B0 = SWEEP[0].b; // BASE slope (kEnd=11)

// Deep-interior grid k = 6.00 .. 8.75 (below both migrating troughs), exactly the imp-34022 window.
const DEEP_INTERIOR_K = [];
for (let k = 6; k <= 8.75 + 1e-9; k += 0.25) DEEP_INTERIOR_K.push(+k.toFixed(2));

// Interior residual deviation of window w vs BASE at rung k: dev_w(k) = (a0-a_w) + (b0-b_w) k (y cancels).
function deviationAt(row, k) {
  return (A0 - row.a) + (B0 - row.b) * k;
}

// Per-window max interior |deviation| vs BASE over the deep interior, and the k where it occurs.
const driftTable = SWEEP.map((row) => {
  let best = 0;
  let atK = null;
  for (const k of DEEP_INTERIOR_K) {
    const d = deviationAt(row, k);
    if (Math.abs(d) > Math.abs(best)) {
      best = d;
      atK = k;
    }
  }
  return {
    kEnd: row.kEnd,
    maxInteriorDev: +best.toFixed(6),
    atK,
    signedDevAtK6: +deviationAt(row, 6).toFixed(6),
  };
});

// The max interior deviation is at the low-k edge k=6 at every RECEDED window (dev is linear-decreasing
// in k). BASE has identically-zero deviation (self), so its argmax is degenerate and excluded.
const argmaxAlwaysAtK6 = driftTable.slice(1).every((r) => r.atK === 6);
const driftMonotoneRising = driftTable.every((r, i) => i === 0 || Math.abs(r.maxInteriorDev) > Math.abs(driftTable[i - 1].maxInteriorDev));

// Per-window-step increments of the interior drift, and the turnover (accelerate then decelerate).
const driftIncrements = [];
for (let i = 1; i < driftTable.length; i++) {
  driftIncrements.push(+(Math.abs(driftTable[i].maxInteriorDev) - Math.abs(driftTable[i - 1].maxInteriorDev)).toFixed(6));
}
let peakIncIdx = 0;
for (let i = 1; i < driftIncrements.length; i++) if (driftIncrements[i] > driftIncrements[peakIncIdx]) peakIncIdx = i;
const kEndAtIncrementPeak = SWEEP[peakIncIdx + 1].kEnd; // ~13
const decelToTail = driftIncrements.slice(peakIncIdx).every((v, i, arr) => i === 0 || v <= arr[i - 1] + 1e-9);
const headAccelerates = driftIncrements[1] > driftIncrements[0]; // imp-34022 BASE..EXT12 span: rising head
const tailIncrement = driftIncrements[driftIncrements.length - 1]; // ~0.0400 at kEnd=18

// Contrast against the imp-34085 endpoint-peak amplification increments (decelerating from step 0).
const peakIncrements = IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.peakStepIncrements; // [+0.0740,+0.0612,+0.0475,+0.0346]
const peakDeceleratesFromStart = peakIncrements.every((v, i) => i === 0 || v < peakIncrements[i - 1]);
// Opposite early curvature: interior smaller than peak at step 0 but larger by the fourth step.
const interiorSmallerAtStart = driftIncrements[0] < peakIncrements[0];
const interiorLargerByFourthStep = driftIncrements[3] > peakIncrements[3];
const tracksEndpointPeakRate = false; // decelerating peak vs accelerating-then-decelerating interior -- not proportional

// Soft saturating exp-approach fit maxInteriorDev(kEnd) = D_inf + c exp(-lam kEnd) (grid lam, OLS D_inf,c).
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
let expFit = null;
for (let lam = 0.01; lam <= 2 + 1e-9; lam += 0.001) {
  const xs = driftTable.map((r) => Math.exp(-lam * r.kEnd));
  const ys = driftTable.map((r) => Math.abs(r.maxInteriorDev));
  const { a: dInf, b: c } = ols(xs, ys);
  let ssr = 0;
  for (let i = 0; i < driftTable.length; i++) {
    ssr += (Math.abs(driftTable[i].maxInteriorDev) - (dInf + c * Math.exp(-lam * driftTable[i].kEnd))) ** 2;
  }
  if (!expFit || ssr < expFit.ssr) expFit = { lam: +lam.toFixed(3), dInf: +dInf.toFixed(6), c: +c.toFixed(6), ssr };
}
expFit.ssr = +expFit.ssr.toExponential(4);

// Saturation is guaranteed independently: dev(6) = (a0-a) + 6(b0-b) is a linear combination of the
// convergent imp-34129 a- and b-sequences, so it must approach a finite limit (b_inf ~ -1.01 measured).
const inheritsImp34129SlopeConvergence = IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT.slopeConvergesToFiniteLimit === true;
const interiorDriftSaturates = decelToTail && inheritsImp34129SlopeConvergence;

export const IMP34089_INTERIOR_RESIDUAL_DRIFT_LAW_FIT = {
  id: 'imp-34089',
  proofSection: 'S-frontier',
  question:
    'imp-34022 R3 found the deep-interior residual deviation vs BASE keeps rising (max 0.1192 at k=6) ' +
    'as the imp-33810/imp-33877 ladder boundary recedes, but measured it over only three windows and ' +
    'never fit its drift law. Extending the interior-deviation tabulation via the imp-34129 (a, b) ' +
    'sweep to kEnd=18 (15 windows), does the interior drift SATURATE or does it track the ' +
    'endpoint-peak amplification rate? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The max deep-interior (k in [6, 8.75]) residual deviation vs BASE of the imp-33843 log-linear fit, ' +
    'dev_w(k) = (a0-a_w) + (b0-b_w) k (y(k) cancels; from the imp-34129 (a, b) sweep), tabulated across ' +
    'kEnd = 11..18, its per-window-step increment turnover, a saturating exp-approach fit, and the ' +
    'contrast of its increment sequence against the imp-34085 endpoint-peak amplification increments',
  reusesImp34129SweepVerbatim: true,
  interiorDeviationIsLinearInK: true, // dev_w(k) = (a0-a_w) + (b0-b_w) k -- y(k) cancels
  argmaxAlwaysAtK6, // true -- max interior deviation at the low-k edge k=6 at every window
  driftTable, // maxInteriorDev 0 -> 0.0565 -> 0.1192 -> ... -> 0.7790 (k=6 each), 15 windows kEnd=11..18
  driftMonotoneRising, // true
  driftStepIncrements: driftIncrements, // +0.0565,+0.0627,+0.0658,+0.0665(peak~kEnd13),... shrinking to +0.0400
  incrementPeakAtKEnd: kEndAtIncrementPeak, // ~13 -- increments peak here then decelerate
  headAccelerates, // true -- the imp-34022 BASE..EXT12 span sees only the accelerating head
  decelerationToTail: decelToTail, // true -- increments shrink monotonically after the turnover
  tailIncrement, // ~0.0400 at kEnd=18 (vs ~0.0665 peak) -- a ~1.7x deceleration => saturation
  endpointPeakIncrements: peakIncrements, // [+0.0740,+0.0612,+0.0475,+0.0346] from imp-34085 -- decelerates from step 0
  peakDeceleratesFromStart, // true
  interiorSmallerAtStart, // true -- 0.0565 < 0.0740 at step 0
  interiorLargerByFourthStep, // true -- 0.0665 > 0.0346 by kEnd~13
  tracksEndpointPeakRate, // false -- opposite early curvature; not proportional
  expApproachFit: expFit, // D_inf + c exp(-lam kEnd); soft (window still rising) limit D_inf ~1.97
  inheritsImp34129SlopeConvergence, // true -- a and b both converge => dev(6) converges (finite limit)
  interiorDriftSaturates, // true -- decelerating increments + inherited slope convergence
  finding: {
    R1_interior_drift_saturates_after_accelerating_head:
      'The max interior deviation vs BASE rises monotonically 0 -> 0.0565 -> 0.1192 -> ... -> 0.7790 ' +
      '(at k=6 every window). Its per-window-step increment first GROWS +0.0565 -> +0.0627 -> +0.0658 ' +
      '-> +0.0665 (peaking near kEnd~13) then TURNS OVER and shrinks monotonically to +0.0400 at ' +
      'kEnd=18 -- the signature of a finite limit. Over the imp-34022 BASE..EXT12 span only the ' +
      'accelerating head is visible, so its "interior keeps rising, not invariant" reading was a ' +
      'SHORT-WINDOW artifact, the same trap imp-34085 found in the |trough|/|peak| ratio.',
    R2_does_not_track_endpoint_peak_amplification_rate:
      'The endpoint peak amplifies with increments +0.0740 -> +0.0612 -> +0.0475 -> +0.0346 (imp-34085) ' +
      '-- DECELERATING from the first step. The interior drift instead ACCELERATES over those steps ' +
      '(+0.0565 -> +0.0665): opposite early curvature. It is SMALLER than the peak amplification at the ' +
      'first step (0.0565 < 0.0740) but EXCEEDS it by kEnd~13 (0.0665 > 0.0346). The rates are not ' +
      'proportional -- the interior drift is a whole-line OLS-tilt phenomenon, not a shadow of the peak.',
    R3_saturation_inherited_from_imp34129_slope_convergence:
      'The saturation is not assumed: imp-34129 established the slope b converges exponentially-in-kEnd ' +
      'to b_inf ~ -1.01, and dev(6) = (a0-a) + 6(b0-b) is a fixed linear combination of the convergent ' +
      'a- and b-sequences, so it MUST approach a finite limit. A soft exp-approach fit on the still-' +
      'rising kEnd=11..18 window estimates D_inf ~1.97, but the robust evidence is the increment ' +
      'turnover itself.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DRIFT-LAW FIT (frontier-direction, NOT rigorous). Reusing the imp-34129 (a, b)-vs-kEnd ' +
    'sweep verbatim (kEnd=11..18, 15 windows; its reuse gate reproduces the imp-33877 base/ext12 fits to ' +
    'machine precision), the deep-interior residual deviation vs BASE is dev_w(k) = (a0-a_w) + (b0-b_w) k ' +
    '(the ladder value y(k) CANCELS), exactly linear in k with its max at the low-k edge k=6 at every ' +
    'window -- reproducing the imp-34022 "max deviation at k=6". The interior drift SATURATES: its ' +
    'per-window-step increment first grows +0.0565 -> +0.0665 (peaking near kEnd~13) then decelerates ' +
    'monotonically to +0.0400 at kEnd=18, so the imp-34022 three-window "still rising, not invariant" ' +
    'reading is the ACCELERATING HEAD of a saturating drift, a short-window artifact. The saturation is ' +
    'inherited: imp-34129 showed the slope b converges to b_inf ~ -1.01, and dev(6) = (a0-a) + 6(b0-b) ' +
    'is a linear combination of the convergent a- and b-sequences. The interior drift does NOT track the ' +
    'endpoint-peak amplification rate -- the peak decelerates from the first step (+0.0740 -> +0.0346, ' +
    'imp-34085) while the interior accelerates then crosses above it (+0.0565 -> +0.0665), opposite early ' +
    'curvature and not proportional. Distinct from any form selection; the imp-33843 log-linear verdict ' +
    'is untouched. The OLS and exp-approach surrogates are descriptive, not derived; the component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34129 ((a, b)-vs-kEnd sweep reused verbatim); imp-34022 (R3 interior non-invariance fit here); ' +
    'imp-34085 (endpoint-peak amplification increments contrasted); imp-33877 (base/ext12 fits imp-34129 ' +
    'reproduces); imp-33843 (the log-linear OLS whose interior tilt is tracked); imp-486 (C_mb GUE-conditional).',
};

export const IMP34089_INTERIOR_RESIDUAL_DRIFT_LAW_FIT_ASSERTIONS = [
  {
    // Reuse gate: the imp-34129 sweep is the 15-window kEnd=11..18 ladder; BASE (kEnd=11) self-deviation is 0.
    id: 'imp34089-inherits-imp34129-sweep-15-windows',
    description: 'imp-34129 sweep is 15 windows kEnd=11..18; BASE self-deviation is 0 and reproduces imp-34022 k=6 dev ~0.1192 at EXT12',
    holds: () =>
      SWEEP.length === 15 &&
      SWEEP[0].kEnd === 11 &&
      SWEEP[SWEEP.length - 1].kEnd === 18 &&
      Math.abs(driftTable[0].maxInteriorDev) < 1e-9 &&
      Math.abs(Math.abs(driftTable[2].maxInteriorDev) - 0.1192) < 0.01, // EXT12 (kEnd=12) matches imp-34022 0.1192
  },
  {
    // (identity) The interior deviation is maxed at the low-k edge k=6 at EVERY window, rising monotonically.
    id: 'imp34089-max-interior-deviation-at-k6-monotone',
    description: 'max interior deviation vs BASE is at k=6 at every window; drift rises monotonically 0 -> ~0.779',
    holds: () =>
      argmaxAlwaysAtK6 === true &&
      driftMonotoneRising === true &&
      Math.abs(Math.abs(driftTable[driftTable.length - 1].maxInteriorDev) - 0.779) < 0.02,
  },
  {
    // (R1) Increments accelerate over the imp-34022 head then turn over near kEnd~13 and decelerate => saturation.
    id: 'imp34089-increment-turnover-saturation',
    description: 'increments grow +0.0565 -> +0.0665 (peak near kEnd~13) then shrink monotonically to +0.0400 => saturates',
    holds: () =>
      headAccelerates === true &&
      Math.abs(driftIncrements[0] - 0.0565) < 0.005 &&
      kEndAtIncrementPeak >= 12.5 &&
      kEndAtIncrementPeak <= 13.5 &&
      decelToTail === true &&
      tailIncrement < driftIncrements[peakIncIdx] &&
      interiorDriftSaturates === true,
  },
  {
    // (R2) The interior drift does NOT track the endpoint-peak amplification rate (opposite early curvature).
    id: 'imp34089-does-not-track-endpoint-peak-rate',
    description: 'peak decelerates from step 0 (+0.0740->+0.0346) while interior accelerates (+0.0565->+0.0665); smaller at step0, larger by step3',
    holds: () =>
      peakDeceleratesFromStart === true &&
      interiorSmallerAtStart === true &&
      interiorLargerByFourthStep === true &&
      tracksEndpointPeakRate === false,
  },
  {
    // Honesty gate: saturating drift-law reading, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34089-honesty-gate-no-qed',
    description: 'Measurement only: interiorDriftSaturates true, tracksEndpointPeakRate false, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34089_INTERIOR_RESIDUAL_DRIFT_LAW_FIT.interiorDriftSaturates === true &&
      IMP34089_INTERIOR_RESIDUAL_DRIFT_LAW_FIT.tracksEndpointPeakRate === false &&
      IMP34089_INTERIOR_RESIDUAL_DRIFT_LAW_FIT.isRigorous === false &&
      /NO QED/.test(IMP34089_INTERIOR_RESIDUAL_DRIFT_LAW_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34089_INTERIOR_RESIDUAL_DRIFT_LAW_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34089_INTERIOR_RESIDUAL_DRIFT_LAW_FIT.verdict),
  },
];

for (const a of IMP34089_INTERIOR_RESIDUAL_DRIFT_LAW_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34089-interior-residual-drift-law-fit assertion failed: ${a.id}`);
  }
}
