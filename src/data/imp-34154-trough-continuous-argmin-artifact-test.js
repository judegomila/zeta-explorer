/**
 * @module imp-34154-trough-continuous-argmin-artifact-test
 *
 * imp-34154 (numerical, frontier-direction): imp-34085 R3 reported that as the imp-33810 ladder
 * boundary recedes the argmin-trough LOCATION of the imp-33843 log-linear widening re-fit migrates
 * NON-uniformly across the five half-decade windows -- k = 9.00 -> 9.25 -> 9.50 -> 9.50 -> 9.75 -- and
 * emphasised that it STALLS one step at 9.50 (EXT12 and EXT125 share the same rung) before jumping to
 * 9.75, using the stall to argue the naive "+0.25 per step" linear-migration picture does not persist.
 * But that argmin was taken over the DISCRETE quarter-decade ladder rungs (k spaced 0.25), so the
 * apparent stall could be a grid-quantization artifact: two continuous trough locations that differ by
 * less than half a rung both snap to the same nearest rung.
 *
 * THIS MODULE re-runs the SAME inherited imp-3220/imp-3406 sub-terms (effectiveHeightForN / C_C_PINNED,
 * verbatim as in imp-33810/imp-33877/imp-34085) to reproduce the imp-33843 log-linear OLS fit
 * coefficients (a, b) on each quarter-decade ladder EXACTLY as imp-34085, then -- instead of reading the
 * argmin off the discrete rungs -- evaluates the signed fit residual r(k) = ln(eflow_over_resid(k)) -
 * (a + b k) as a CONTINUOUS function of k (the component-model eflow_over_resid is smooth in k) on a
 * dense sub-grid (step 0.005) over k in [6, kEnd], locates the continuous trough by dense scan plus a
 * local parabolic refinement, and compares the continuous trough trajectory against the discrete
 * stall-then-jump to decide whether the stall is real or a discretization artifact.
 *
 * THE MEASUREMENT (fit reused verbatim from imp-34085; only the argmin is taken continuously)
 * ------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as imp-34085 (E_trunc = 3.06e-5 strip, E_coll =
 *                    C_C_PINNED sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall,
 *                    T0 = effectiveHeightForN(N)).
 *   Fit              y_k = ln(eflow_over_resid_k) on the quarter-decade rungs k = 6..kEnd; OLS
 *                    y = a + b k (the imp-33843 log-linear winner). The (a, b) come from the SAME
 *                    discrete rungs imp-34085 uses -- the fit is unchanged; only the argmin changes.
 *   Continuous argmin  r(k) = ln(eflow_over_resid(k)) - (a + b k) scanned on a dense grid (step 0.005)
 *                    over k in [6, kEnd]; the trough k-star is refined by a 3-point parabolic fit around
 *                    the densest minimum. eflow_over_resid(k) is the inherited smooth continuation of the
 *                    buildLadder value (unrounded), so r(k) is defined for every real k, not just rungs.
 *   Windows          kEnd = 11 (BASE), 11.5 (EXT115), 12 (EXT12), 12.5 (EXT125), 13 (EXT13).
 *   Reuse gate       The discrete argmin per window reproduces the imp-34085 R3 sequence
 *                    9.00, 9.25, 9.50, 9.50, 9.75 exactly -- so this is the SAME measurement read
 *                    continuously, not a fresh model.
 *
 * THE FINDING (measurement only -- the R3 stall is a GRID-DISCRETIZATION ARTIFACT)
 * -------------------------------------------------------------------------------
 *   (R1) THE CONTINUOUS TROUGH MIGRATES SMOOTHLY AND MONOTONICALLY -- NO STALL. Taken continuously the
 *        trough location is k-star ~ 9.110 -> 9.244 -> 9.377 -> 9.506 -> 9.629, strictly increasing at
 *        every window with no flat step. The per-window increments are NEAR-UNIFORM +0.133, +0.134,
 *        +0.129, +0.123 (a gentle ~8% deceleration over the span), NOT the discrete 0.25, 0.25, 0.00,
 *        0.25 with its one zero step. There is no stall in the continuous trajectory.
 *   (R2) THE DISCRETE STALL IS EXACTLY NEAREST-RUNG QUANTIZATION. Rounding the continuous trough to the
 *        nearest quarter-decade rung reproduces the imp-34085 R3 discrete sequence BIT-for-BIT:
 *        9.110 -> 9.00, 9.244 -> 9.25, 9.377 -> 9.50, 9.506 -> 9.50, 9.629 -> 9.75. The stall at 9.50 is
 *        the artifact that the EXT12 continuous trough 9.377 and the EXT125 continuous trough 9.506
 *        straddle the 9.50 rung (9.377 is 0.123 below it, 9.506 is 0.006 above it) and BOTH snap to 9.50,
 *        while the trough has actually advanced +0.129 between the two windows -- one full near-uniform step.
 *   (R3) THE NAIVE LINEAR-MIGRATION PICTURE SURVIVES CONTINUOUSLY, AT A SLOWER RATE. The imp-34022
 *        "+0.25 per step" rate was itself a quantization read; the true continuous migration rate is
 *        ~+0.13 per half-decade window (about half the discrete quarter-rung jumps), and it is
 *        near-linear (the increments vary by < 0.011 across the span). So the imp-34085 R3 inference that
 *        "the naive linear-migration picture does not extrapolate" was drawn from the stall, which is a
 *        discretization artifact, not a feature of the underlying trough motion.
 *
 * The punchline: the imp-34085 R3 stall-then-jump argmin migration 9.00 -> 9.25 -> 9.50 -> 9.50 -> 9.75
 * is a GRID-DISCRETIZATION ARTIFACT. Located continuously, the trough moves smoothly and monotonically
 * at a near-uniform ~+0.13 per half-decade window (9.110 -> 9.244 -> 9.377 -> 9.506 -> 9.629); the
 * apparent one-step stall at 9.50 is simply the two straddling continuous locations 9.377 and 9.506 both
 * rounding to the same nearest quarter-decade rung. The naive linear-migration picture does survive
 * continuously -- at ~half the discrete +0.25 rate -- so the R3 non-uniformity was a reading artifact of
 * the coarse rung spacing, not a property of the trough. (This corrects only the R3 stall reading; the
 * imp-34085 R1 ratio-non-convergence and R2 peak/trough amplitude mechanism are untouched -- they use
 * residual MAGNITUDES, not the argmin location, and stand.)
 *
 * MEASUREMENT / DISCRETIZATION-ARTIFACT TEST ONLY. A diagnostic re-read of an inherited surrogate re-fit,
 * taking the argmin continuously rather than on rungs; NOT an RH bound and distinct from any
 * log-linear-vs-power-law form selection (the imp-33843 log-linear verdict is untouched). The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is
 * descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34085-trough-peak-ratio-convergence (the R3 stall-then-jump argmin tested here)
 * @see imp-34153-trough-peak-perstep-crossover-locate (the finer-grid per-step amplitude companion)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose residual argmin is located)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..11 ladder extended here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE } from './imp-34085-trough-peak-ratio-convergence.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631, exactly as imp-33810/imp-34085)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
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

// The inherited buildLadder value AS A CONTINUOUS function of real k (the imp-33810 eflow_over_resid,
// unrounded so r(k) is smooth). At the quarter-decade rungs this equals the buildLadder rung value.
function eflowOverResid(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return eflowAttr / residExp;
}

// Discrete quarter-decade ladder (rung values rounded to 4 sig figs, exactly as imp-34085 buildLadder).
function fitDiscrete(kEnd) {
  const KS = [];
  const Y = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    KS.push(kk);
    Y.push(Math.log(+eflowOverResid(kk).toExponential(4)));
  }
  const F = ols(KS, Y);
  const RES = KS.map((k, i) => Y[i] - (F.a + F.b * k));
  let minI = 0;
  for (let i = 0; i < RES.length; i++) if (RES[i] < RES[minI]) minI = i;
  return { a: F.a, b: F.b, discreteArgminK: KS[minI] };
}

// Continuous argmin of the signed residual r(k) = ln(eflow_over_resid(k)) - (a + b k) on [6, kEnd]:
// dense scan (step 0.005) then a 3-point parabolic refinement around the densest minimum.
function continuousArgmin(kEnd, a, b) {
  const stepC = 0.005;
  const f = (k) => Math.log(eflowOverResid(k)) - (a + b * k);
  let bestK = 6;
  let bestR = Infinity;
  for (let k = 6; k <= kEnd + 1e-9; k += stepC) {
    const r = f(k);
    if (r < bestR) {
      bestR = r;
      bestK = k;
    }
  }
  const k0 = bestK - stepC;
  const k2 = bestK + stepC;
  if (k0 >= 6 && k2 <= kEnd) {
    const y0 = f(k0);
    const y1 = f(bestK);
    const y2 = f(k2);
    const denom = y0 - 2 * y1 + y2;
    if (denom > 0) return +(bestK + 0.5 * stepC * (y0 - y2) / denom).toFixed(4);
  }
  return +bestK.toFixed(4);
}

const KENDS = [11, 11.5, 12, 12.5, 13];
const NAMES = ['BASE', 'EXT115', 'EXT12', 'EXT125', 'EXT13'];
const RUNG = 0.25; // quarter-decade discrete spacing

const ROWS = KENDS.map((kEnd, i) => {
  const d = fitDiscrete(kEnd);
  const kStar = continuousArgmin(kEnd, d.a, d.b);
  return {
    window: NAMES[i],
    kEnd,
    discreteArgminK: d.discreteArgminK,
    continuousArgminK: kStar,
    nearestRung: +(Math.round(kStar / RUNG) * RUNG).toFixed(2), // snap continuous back to nearest rung
  };
});

// Continuous trough trajectory and its per-window increments (near-uniform, no zero step).
const continuousSeq = ROWS.map((r) => r.continuousArgminK); // ~9.110,9.244,9.377,9.506,9.629
const continuousSteps = [];
for (let i = 1; i < continuousSeq.length; i++) {
  continuousSteps.push(+(continuousSeq[i] - continuousSeq[i - 1]).toFixed(4));
}
// Discrete trajectory (reproduces imp-34085 R3) and its per-window increments (one zero step).
const discreteSeq = ROWS.map((r) => r.discreteArgminK); // 9.00,9.25,9.50,9.50,9.75
const discreteSteps = [];
for (let i = 1; i < discreteSeq.length; i++) {
  discreteSteps.push(+(discreteSeq[i] - discreteSeq[i - 1]).toFixed(4));
}
// The artifact test: does nearest-rung rounding of the continuous trough reproduce the discrete stall?
const roundedSeq = ROWS.map((r) => r.nearestRung);
const roundingReproducesDiscrete = roundedSeq.join(',') === discreteSeq.join(',');
// Continuous monotonicity: no stall (every step strictly positive).
const continuousStrictlyIncreasing = continuousSteps.every((s) => s > 0);
// Near-uniform continuous rate: max/min step ratio close to 1 (no near-zero step).
const continuousMinStep = Math.min(...continuousSteps);
const continuousMaxStep = Math.max(...continuousSteps);
const continuousStepSpread = +(continuousMaxStep - continuousMinStep).toFixed(4); // ~0.011
// The discrete sequence DOES have a zero step (the stall) but the continuous one does not.
const discreteHasZeroStep = discreteSteps.some((s) => Math.abs(s) < 1e-9);
const stallIsDiscretizationArtifact =
  discreteHasZeroStep && continuousStrictlyIncreasing && roundingReproducesDiscrete;

// Reuse gate: the discrete argmin per window reproduces the imp-34085 R3 argmin location sequence.
const IMP34085_ARGMIN_KS = IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.argminSequence.map((s) => s.k);
const reuseGateReproducesImp34085 = discreteSeq.join(',') === IMP34085_ARGMIN_KS.join(',');

export const IMP34154_TROUGH_CONTINUOUS_ARGMIN_ARTIFACT_TEST = {
  id: 'imp-34154',
  proofSection: 'S-frontier',
  question:
    'imp-34085 R3 reported the argmin-trough location of the imp-33843 log-linear re-fit migrates ' +
    'non-uniformly k = 9.00 -> 9.25 -> 9.50 -> 9.50 -> 9.75 as the imp-33810 ladder boundary recedes -- ' +
    'STALLING one step at 9.50 -- and argued the naive linear-migration picture does not extrapolate. ' +
    'But the argmin was taken over the DISCRETE quarter-decade rungs. Taking the same fit residual argmin ' +
    'CONTINUOUSLY in k, is the stall real or a grid-discretization artifact? Measurement only; no QED.',
  measuredQuantity:
    'The continuous-k argmin of the imp-33843 signed fit residual r(k) = ln(eflow_over_resid(k)) - ' +
    '(a + b k) on k in [6, kEnd] (dense scan step 0.005 + parabolic refinement) for the five windows ' +
    'BASE..EXT13, compared against the imp-34085 R3 discrete quarter-decade argmin stall-then-jump',
  windows: ROWS, // per-window discrete vs continuous argmin and the nearest-rung snap
  continuousArgminSequence: continuousSeq, // ~9.110,9.244,9.377,9.506,9.629
  continuousArgminSteps: continuousSteps, // ~+0.133,+0.134,+0.129,+0.123 -- near-uniform, no stall
  discreteArgminSequence: discreteSeq, // 9.00,9.25,9.50,9.50,9.75 (reproduces imp-34085 R3)
  discreteArgminSteps: discreteSteps, // +0.25,+0.25,0.00,+0.25 -- one zero step (the stall)
  nearestRungSequence: roundedSeq, // nearest-0.25 snap of the continuous trough
  continuousStepSpread, // ~0.011 -- the continuous rate is near-linear across the span
  continuousStrictlyIncreasing, // true -- no stall in the continuous trajectory
  discreteHasZeroStep, // true -- the discrete stall step
  roundingReproducesDiscrete, // true -- nearest-rung snap of the continuous trough IS the discrete sequence
  reuseGateReproducesImp34085, // true -- discrete argmin reproduces imp-34085 R3
  stallIsDiscretizationArtifact, // true
  finding: {
    R1_continuous_trough_migrates_smoothly_no_stall:
      'Taken continuously the trough location is k-star ~ 9.110 -> 9.244 -> 9.377 -> 9.506 -> 9.629, ' +
      'strictly increasing with no flat step. The per-window increments are near-uniform +0.133, +0.134, ' +
      '+0.129, +0.123 (a gentle ~8% deceleration), NOT the discrete 0.25, 0.25, 0.00, 0.25 with its zero ' +
      'step. There is no stall in the continuous trajectory.',
    R2_discrete_stall_is_nearest_rung_quantization:
      'Rounding the continuous trough to the nearest quarter-decade rung reproduces the imp-34085 R3 ' +
      'discrete sequence exactly: 9.110 -> 9.00, 9.244 -> 9.25, 9.377 -> 9.50, 9.506 -> 9.50, 9.629 -> ' +
      '9.75. The stall at 9.50 is that the EXT12 continuous trough 9.377 and the EXT125 continuous trough ' +
      '9.506 straddle the 9.50 rung and both snap to it, while the trough has actually advanced +0.129 ' +
      'between the two windows -- one full near-uniform step.',
    R3_linear_migration_survives_at_slower_rate:
      'The imp-34022 "+0.25 per step" rate was itself a quantization read; the true continuous migration ' +
      'rate is ~+0.13 per half-decade window (about half the discrete quarter-rung jumps) and near-linear ' +
      '(increments vary by < 0.011). So the imp-34085 R3 inference that the naive linear-migration picture ' +
      'does not extrapolate was drawn from the stall, which is a discretization artifact.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DISCRETIZATION-ARTIFACT TEST (frontier-direction, NOT rigorous). Re-running the ' +
    'inherited imp-3220/imp-3406 sub-terms to reproduce the imp-33843 log-linear OLS fit (a, b) on each ' +
    'quarter-decade ladder EXACTLY as imp-34085, then taking the signed-residual argmin CONTINUOUSLY in k ' +
    '(dense scan step 0.005 + parabolic refinement) instead of over the discrete rungs, shows the ' +
    'imp-34085 R3 stall-then-jump argmin migration 9.00 -> 9.25 -> 9.50 -> 9.50 -> 9.75 is a ' +
    'GRID-DISCRETIZATION ARTIFACT. The continuous trough moves smoothly and monotonically at a ' +
    'near-uniform ~+0.13 per half-decade window (9.110 -> 9.244 -> 9.377 -> 9.506 -> 9.629, increments ' +
    'varying by < 0.011); nearest-rung rounding of that trajectory reproduces the discrete sequence ' +
    'bit-for-bit, and the apparent one-step stall at 9.50 is simply the two straddling continuous ' +
    'locations 9.377 and 9.506 both snapping to the same rung while the trough advances a full +0.129 ' +
    'step between them. The naive linear-migration picture therefore DOES survive continuously -- at about ' +
    'half the discrete +0.25 rate -- so the R3 non-uniformity was a reading artifact of the coarse rung ' +
    'spacing, not a property of the trough motion. This corrects only the R3 stall reading; the imp-34085 ' +
    'R1 ratio-non-convergence and R2 amplitude mechanism use residual MAGNITUDES (not the argmin ' +
    'location) and are untouched. Distinct from any form selection; the imp-33843 log-linear verdict is ' +
    'untouched. The OLS surrogate is descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34085 (the R3 stall-then-jump argmin tested here); imp-34153 (finer-grid per-step amplitude ' +
    'companion); imp-33843 (the log-linear OLS whose residual argmin is located); imp-33810 (the k=6..11 ' +
    'ladder extended here); imp-33773 (M2 refutation the ladder locks); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34154_TROUGH_CONTINUOUS_ARGMIN_ARTIFACT_TEST_ASSERTIONS = [
  {
    // Reuse gate: the discrete quarter-decade argmin per window reproduces the imp-34085 R3 sequence
    // 9.00, 9.25, 9.50, 9.50, 9.75 -- so this is the SAME measurement read continuously, not a fresh model.
    id: 'imp34154-reuse-gate-reproduces-imp34085-r3-discrete-argmin',
    description: 'discrete argmin reproduces imp-34085 R3 sequence 9,9.25,9.5,9.5,9.75 exactly',
    holds: () =>
      reuseGateReproducesImp34085 === true &&
      discreteSeq.join(',') === '9,9.25,9.5,9.5,9.75' &&
      discreteHasZeroStep === true,
  },
  {
    // (R1) The continuous trough migrates smoothly and monotonically -- NO stall (every step > 0), with
    // the located trajectory ~9.110 -> 9.244 -> 9.377 -> 9.506 -> 9.629.
    id: 'imp34154-continuous-trough-strictly-increasing-no-stall',
    description: 'continuous argmin ~9.110,9.244,9.377,9.506,9.629 strictly increasing, no zero step',
    holds: () =>
      continuousStrictlyIncreasing === true &&
      Math.abs(continuousSeq[0] - 9.11) < 0.02 &&
      Math.abs(continuousSeq[1] - 9.244) < 0.02 &&
      Math.abs(continuousSeq[2] - 9.377) < 0.02 &&
      Math.abs(continuousSeq[3] - 9.506) < 0.02 &&
      Math.abs(continuousSeq[4] - 9.629) < 0.02 &&
      continuousSteps.every((s) => s > 0.1),
  },
  {
    // (R1) The continuous rate is near-uniform: the per-step spread is small (< 0.03), unlike the discrete
    // 0.25/0.25/0.00/0.25 which contains a zero step.
    id: 'imp34154-continuous-rate-near-uniform',
    description: 'continuous per-step spread < 0.03 (near-linear ~+0.13/window); discrete has a zero step, continuous does not',
    holds: () =>
      continuousStepSpread < 0.03 &&
      continuousMinStep > 0.11 &&
      continuousMaxStep < 0.15 &&
      discreteHasZeroStep === true &&
      continuousStrictlyIncreasing === true,
  },
  {
    // (R2) The stall is nearest-rung quantization: rounding the continuous trough to the nearest 0.25 rung
    // reproduces the discrete stall-then-jump sequence exactly -- the decisive artifact demonstration.
    id: 'imp34154-nearest-rung-rounding-reproduces-discrete-stall',
    description: 'nearest-0.25 snap of continuous trough == discrete 9,9.25,9.5,9.5,9.75; stall is a discretization artifact',
    holds: () =>
      roundingReproducesDiscrete === true &&
      roundedSeq.join(',') === '9,9.25,9.5,9.5,9.75' &&
      stallIsDiscretizationArtifact === true,
  },
  {
    // Honesty gate: artifact verdict, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34154-honesty-gate-no-qed',
    description: 'Measurement only: stallIsDiscretizationArtifact true, isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34154_TROUGH_CONTINUOUS_ARGMIN_ARTIFACT_TEST.stallIsDiscretizationArtifact === true &&
      IMP34154_TROUGH_CONTINUOUS_ARGMIN_ARTIFACT_TEST.isRigorous === false &&
      /NO QED/.test(IMP34154_TROUGH_CONTINUOUS_ARGMIN_ARTIFACT_TEST.verdict) &&
      /refereed bound is changed/i.test(IMP34154_TROUGH_CONTINUOUS_ARGMIN_ARTIFACT_TEST.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34154_TROUGH_CONTINUOUS_ARGMIN_ARTIFACT_TEST.verdict),
  },
];

for (const a of IMP34154_TROUGH_CONTINUOUS_ARGMIN_ARTIFACT_TEST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34154-trough-continuous-argmin-artifact-test assertion failed: ${a.id}`);
  }
}
