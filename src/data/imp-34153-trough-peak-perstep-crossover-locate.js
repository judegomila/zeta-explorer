/**
 * @module imp-34153-trough-peak-perstep-crossover-locate
 *
 * imp-34153 (numerical, frontier-direction): imp-34085 R2 found the amplitude ratio |trough|/|peak|
 * of the imp-33843 log-linear widening re-fit creeps UP (0.615 -> 0.720) as the imp-33810 ladder
 * boundary recedes, and diagnosed the mechanism: the endpoint-locked peak grows at a DECELERATING
 * per-step rate (half-decade steps +0.0740 -> +0.0612 -> +0.0475 -> +0.0346) while the interior trough
 * deepens at a near-steady rate (+0.0501 -> +0.0461 -> +0.0470 -> +0.0392), so past k~12.5 the trough
 * gains on the peak. imp-34085 measured those per-step increments on the coarse HALF-decade kEnd grid
 * (kEnd = 11, 11.5, 12, 12.5, 13) and could only bracket the crossover -- where the trough-deepening
 * step first exceeds the peak-growth step -- to the last half-decade window (peak step +0.0475 >
 * trough +0.0470 at EXT125 vs peak +0.0346 < trough +0.0392 at EXT13), i.e. somewhere in kEnd in
 * (12.5, 13.0]. It never located the boundary precisely.
 *
 * This module re-runs the SAME inherited effectiveHeightForN / C_C_PINNED sub-terms (the exact
 * imp-3220/imp-3406 component model, verbatim as in imp-33810/imp-33877/imp-34085) on a FINER set of
 * receding endpoints -- the quarter-decade kEnd grid kEnd = 11.00, 11.25, ..., 13.00 (9 endpoints, 8
 * window-steps of 0.25 each) -- tabulates the argmax-peak and argmin-trough per-step increments over
 * consecutive quarter-decade steps, and LOCATES the boundary kEnd at which the trough-deepening step
 * first overtakes the peak-growth step.
 *
 * THE MEASUREMENT (imp-34085 model reused verbatim; only the kEnd grid is refined 0.5 -> 0.25)
 * -------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as imp-34085 (E_trunc = 3.06e-5 strip, E_coll =
 *                    C_C_PINNED sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall,
 *                    T0 = effectiveHeightForN(N)).
 *   Ladder / fit     eflow_over_resid over k = 6.00 .. kEnd (0.25 rungs), y = ln(eflow_over_resid),
 *                    OLS y = a + b k (the imp-33843 log-linear winner); peak = argmax residual
 *                    (endpoint-locked), trough = argmin residual (interior).
 *   Grid refinement  kEnd = 11.00, 11.25, ..., 13.00 (quarter-decade; imp-34085 used half-decade).
 *   Per-step         peakStep_i = peak(kEnd_i) - peak(kEnd_{i-1});
 *                    troughStep_i = |trough(kEnd_i)| - |trough(kEnd_{i-1})|.
 *   Reuse gate       At the 5 half-decade endpoints kEnd in {11,11.5,12,12.5,13} the refined-grid
 *                    peak/trough reproduce the imp-34085 argmax/argmin resids exactly, and the
 *                    half-decade sub-sampled per-step increments reproduce the imp-34085
 *                    peakStepIncrements / troughAbsStepIncrements -- so this is the SAME measurement
 *                    on a finer grid, not a fresh model.
 *
 * THE FINDING (measurement only -- the crossover boundary is located and refined earlier)
 * --------------------------------------------------------------------------------------
 *   (R1) THE PEAK PER-STEP GROWTH DECAYS SMOOTHLY AND MONOTONICALLY. On the quarter-decade grid the
 *        endpoint-locked peak step falls strictly 0.0384 -> 0.0355 -> 0.0323 -> 0.0289 -> 0.0254 ->
 *        0.0220 -> 0.0188 -> 0.0158 across kEnd 11.00..13.00 -- a clean deceleration with no bumps,
 *        because the argmax stays pinned on the receding endpoint.
 *   (R2) THE TROUGH PER-STEP DEEPENING IS NEAR-STEADY BUT BUMPY. The trough step holds ~0.025 ->
 *        0.019 (0.0250, 0.0251, 0.0238, 0.0223, 0.0245, 0.0225, 0.0205, 0.0187) with a local bump at
 *        the 12.00 -> 12.25 step (0.0245) where the argmin has just settled at k=9.5 -- a discrete
 *        argmin-relocation artifact (the continuous-k question is imp-34154), which is why the
 *        crossover margin is thin.
 *   (R3) THE CROSSOVER BOUNDARY IS LOCATED AT THE kEnd 12.25 -> 12.50 STEP -- EARLIER THAN THE
 *        imp-34085 HALF-DECADE BRACKET. The trough step first exceeds the peak step at window-step
 *        (12.25 -> 12.50): peak 0.0220 < trough 0.0225 (margin only ~0.0005), whereas at the prior
 *        step (12.00 -> 12.25) peak 0.0254 > trough 0.0245. So the boundary receding endpoint is
 *        kEnd = 12.50, and the crossing is PERMANENT (trough step stays above peak step through
 *        13.00: 0.0205 > 0.0188, 0.0187 > 0.0158) with no earlier crossing. Linearly interpolating
 *        (peakStep - troughStep) against the window-step midpoint gives a crossover midpoint kEnd*
 *        ~ 12.286 (a soft estimate, since the trough step is grid-quantized). The imp-34085
 *        half-decade grid could only say "somewhere in (12.5, 13.0]"; the quarter-decade grid pulls
 *        the located boundary DOWN to ~12.29-12.50, roughly half a decade earlier.
 *
 * The punchline: the imp-34085 R2 trough-overtakes-peak crossover -- bracketed only to the last
 * half-decade window (12.5, 13.0] -- is LOCATED on a finer quarter-decade grid to the kEnd 12.25 ->
 * 12.50 window-step (boundary endpoint kEnd = 12.50; interpolated kEnd* ~ 12.286), roughly half a
 * decade earlier than the half-decade bracket implied. The peak step decays smoothly and monotonically
 * while the trough step holds near-steady, so the crossover is genuine and permanent; the thin ~0.0005
 * margin at the boundary reflects the grid-quantized argmin relocation (deferred to imp-34154).
 *
 * MEASUREMENT / LOCATION ONLY. A grid-refinement of the imp-34085 per-step increment measurement on the
 * inherited imp-33810 ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form
 * selection (the imp-33843 log-linear verdict is untouched). The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive, not
 * derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34085-trough-peak-ratio-convergence (the half-decade per-step increments and the bracketed crossover located here)
 * @see imp-34154 (whether the argmin stall-then-jump behind the thin margin is a discretization artifact)
 * @see imp-33877-widening-fit-tail-endpoint-artifact-test (the inherited model replicated)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run on the refined grid)
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

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation, verbatim from imp-34085).
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

// Build the quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd, same as imp-33810/imp-34085.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const lo = Math.pow(10, kk);
    const hi = Math.pow(10, kk + 1);
    const pSigma = olsSigmaExponent(lo, hi);
    const pEcoll = ecollExponentMag(lo, hi);
    const ph = parts(hi);
    const residExp = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}

// Fit the imp-33843 log-linear surrogate; return argmax (peak) / argmin (trough), same as imp-34085.
function fitLadder(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  const RES = KS.map((k, i) => Y[i] - (F.a + F.b * k));
  let minI = 0;
  let maxI = 0;
  for (let i = 0; i < RES.length; i++) {
    if (RES[i] < RES[minI]) minI = i;
    if (RES[i] > RES[maxI]) maxI = i;
  }
  return {
    argmax: { k: KS[maxI], resid: +RES[maxI].toExponential(4), isEndpoint: maxI === RES.length - 1 },
    argmin: { k: KS[minI], resid: +RES[minI].toExponential(4) },
  };
}

// FINER receding-endpoint grid: quarter-decade kEnd = 11.00, 11.25, ..., 13.00 (imp-34085 used 0.5).
const KENDS = [];
for (let ke = 11; ke <= 13 + 1e-9; ke += 0.25) KENDS.push(+ke.toFixed(2));
const FITS = KENDS.map((ke) => fitLadder(buildLadder(ke)));

const peakSeq = FITS.map((f) => f.argmax.resid);
const troughSeq = FITS.map((f) => f.argmin.resid);

// Per-quarter-decade-step increments (the mechanism, at finer resolution than imp-34085).
const peakSteps = [];
const troughAbsSteps = [];
const stepMids = [];
const stepDiff = []; // peakStep - troughStep; sign flips at the crossover
for (let i = 1; i < FITS.length; i++) {
  const ps = +(peakSeq[i] - peakSeq[i - 1]).toFixed(4);
  const ts = +(Math.abs(troughSeq[i]) - Math.abs(troughSeq[i - 1])).toFixed(4);
  peakSteps.push(ps);
  troughAbsSteps.push(ts);
  stepMids.push(+((KENDS[i] + KENDS[i - 1]) / 2).toFixed(3));
  stepDiff.push(+(ps - ts).toFixed(4));
}

// LOCATE the crossover: first window-step where the trough step exceeds the peak step (stepDiff < 0).
let crossIdx = -1;
for (let i = 0; i < stepDiff.length; i++) {
  if (stepDiff[i] < 0) {
    crossIdx = i;
    break;
  }
}
const crossoverBracket = { kEndLo: KENDS[crossIdx], kEndHi: KENDS[crossIdx + 1] }; // {12.25, 12.5}
const boundaryKEnd = KENDS[crossIdx + 1]; // 12.5 -- receding endpoint of the first trough-ahead step
// Soft interpolated crossover midpoint kEnd* (trough step is grid-quantized, so this is descriptive).
const interpKEndStar = +(
  stepMids[crossIdx - 1] +
  0.25 * (stepDiff[crossIdx - 1] / (stepDiff[crossIdx - 1] - stepDiff[crossIdx]))
).toFixed(4); // ~12.286
// Permanence: once the trough step overtakes, it stays ahead through kEnd = 13.0 (no reversion).
const crossoverIsPermanent = stepDiff.slice(crossIdx).every((d) => d < 0);
// No earlier crossing: every window-step before the boundary has the peak step still ahead.
const noEarlierCrossing = stepDiff.slice(0, crossIdx).every((d) => d > 0);
// Peak step decays smoothly and monotonically (endpoint-locked argmax).
const peakStepMonotoneDecay = peakSteps.every((d, i) => i === 0 || d < peakSteps[i - 1]);

// Reuse gate: at the 5 half-decade endpoints the refined grid must reproduce the imp-34085 argmax/argmin
// resids exactly, and the half-decade sub-sampled per-step increments must reproduce imp-34085's.
const SRC = IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE;
// The half-decade endpoints are KENDS indices 0,2,4,6,8 (11,11.5,12,12.5,13).
const HD = [0, 2, 4, 6, 8];
let maxReuseResidDiff = 0;
for (let j = 0; j < HD.length; j++) {
  maxReuseResidDiff = Math.max(
    maxReuseResidDiff,
    Math.abs(FITS[HD[j]].argmax.resid - SRC.argmaxSequence[j].resid),
    Math.abs(FITS[HD[j]].argmin.resid - SRC.argminSequence[j].resid),
  );
}
// Half-decade sub-sampled per-step increments reproduce imp-34085 peakStepIncrements / troughAbsStepIncrements.
const hdPeakSteps = [];
const hdTroughSteps = [];
for (let j = 1; j < HD.length; j++) {
  hdPeakSteps.push(+(peakSeq[HD[j]] - peakSeq[HD[j - 1]]).toFixed(4));
  hdTroughSteps.push(+(Math.abs(troughSeq[HD[j]]) - Math.abs(troughSeq[HD[j - 1]])).toFixed(4));
}
let maxHdStepDiff = 0;
for (let j = 0; j < hdPeakSteps.length; j++) {
  maxHdStepDiff = Math.max(
    maxHdStepDiff,
    Math.abs(hdPeakSteps[j] - SRC.peakStepIncrements[j]),
    Math.abs(hdTroughSteps[j] - SRC.troughAbsStepIncrements[j]),
  );
}
const reuseGateReproducesImp34085 = maxReuseResidDiff < 1e-9 && maxHdStepDiff < 1e-9;

export const IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE = {
  id: 'imp-34153',
  proofSection: 'S-frontier',
  question:
    'imp-34085 R2 bracketed the window where the interior-trough per-step deepening overtakes the ' +
    'endpoint-peak per-step growth to the last HALF-decade step (kEnd in (12.5, 13.0]) but never located ' +
    'it. Re-run the SAME inherited effectiveHeightForN/C_C_PINNED sub-terms on a finer QUARTER-decade ' +
    'set of receding endpoints (kEnd = 11.00, 11.25, ..., 13.00), tabulate the peak and trough per-step ' +
    'increments, and locate the boundary kEnd at which the trough-deepening step first overtakes the ' +
    'peak-growth step. Measurement/location only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The imp-33843 log-linear OLS argmax-peak and argmin-trough per-step increments over consecutive ' +
    'quarter-decade receding endpoints kEnd = 11.00..13.00, and the boundary kEnd at which the trough ' +
    'step first (and permanently) exceeds the peak step',
  gridStepDecades: 0.25, // imp-34085 used 0.5; this halves the receding-endpoint step
  kEnds: KENDS, // 11.00, 11.25, ..., 13.00 (9 endpoints)
  peakSequence: peakSeq, // 0.2479 .. 0.4651, endpoint-locked argmax residual
  troughSequence: troughSeq, // -0.1525 .. -0.3349, interior argmin residual
  peakStepIncrements: peakSteps, // 0.0384 -> 0.0158, smooth monotone deceleration
  troughAbsStepIncrements: troughAbsSteps, // ~0.025 -> 0.019, near-steady, bumpy at the argmin relocation
  stepMidpoints: stepMids,
  stepDiff, // peakStep - troughStep: +...+, then flips negative at the crossover
  crossoverStepIndex: crossIdx, // 5 (the 12.25 -> 12.50 window-step)
  crossoverBracket, // {kEndLo: 12.25, kEndHi: 12.5}
  boundaryKEnd, // 12.5 -- the receding endpoint at which the trough step first overtakes the peak step
  interpolatedCrossoverKEnd: interpKEndStar, // ~12.286 (soft; trough step is grid-quantized)
  crossoverIsPermanent, // true -- trough step stays ahead through kEnd = 13.0
  noEarlierCrossing, // true -- every step before the boundary has the peak step ahead
  peakStepMonotoneDecay, // true -- argmax stays endpoint-locked, so the peak step decays cleanly
  reuseGateMaxResidDiffVsImp34085: +maxReuseResidDiff.toExponential(3), // ~0
  reuseGateMaxHalfDecadeStepDiffVsImp34085: +maxHdStepDiff.toExponential(3), // ~0
  reuseGateReproducesImp34085, // true -- same model, finer grid
  finding: {
    R1_peak_step_smooth_monotone_decay:
      'On the quarter-decade grid the endpoint-locked peak step falls strictly 0.0384 -> 0.0355 -> ' +
      '0.0323 -> 0.0289 -> 0.0254 -> 0.0220 -> 0.0188 -> 0.0158 across kEnd 11.00..13.00 -- a clean ' +
      'deceleration with no bumps, because the argmax stays pinned on the receding endpoint.',
    R2_trough_step_near_steady_but_bumpy:
      'The trough step holds ~0.025 -> 0.019 (0.0250, 0.0251, 0.0238, 0.0223, 0.0245, 0.0225, 0.0205, ' +
      '0.0187) with a local bump at the 12.00 -> 12.25 step (0.0245) where the argmin has just settled ' +
      'at k=9.5 -- a discrete argmin-relocation artifact (imp-34154), which is why the crossover margin ' +
      'is thin.',
    R3_crossover_located_earlier_than_half_decade_bracket:
      'The trough step first exceeds the peak step at window-step (12.25 -> 12.50): peak 0.0220 < trough ' +
      '0.0225 (margin ~0.0005), whereas at 12.00 -> 12.25 peak 0.0254 > trough 0.0245. So the boundary ' +
      'receding endpoint is kEnd = 12.50, the crossing is PERMANENT through 13.00 (0.0205 > 0.0188, ' +
      '0.0187 > 0.0158) with no earlier crossing, and the interpolated crossover midpoint is kEnd* ~ ' +
      '12.286. The imp-34085 half-decade grid could only say "(12.5, 13.0]"; the quarter-decade grid ' +
      'pulls the located boundary DOWN to ~12.29-12.50, roughly half a decade earlier.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / LOCATION (frontier-direction, NOT rigorous). Re-running the imp-34085 per-step ' +
    'increment measurement -- the IDENTICAL inherited effectiveHeightForN/C_C_PINNED sub-terms (reuse ' +
    'gate: at the 5 half-decade endpoints the refined grid reproduces the imp-34085 argmax/argmin resids ' +
    'and half-decade per-step increments to ~0) -- on a finer QUARTER-decade set of receding endpoints ' +
    '(kEnd = 11.00, 11.25, ..., 13.00) LOCATES the imp-34085 R2 trough-overtakes-peak crossover to the ' +
    'kEnd 12.25 -> 12.50 window-step (boundary endpoint kEnd = 12.50; interpolated crossover midpoint ' +
    'kEnd* ~ 12.286), roughly half a decade earlier than the imp-34085 half-decade bracket (12.5, 13.0] ' +
    'implied. The endpoint-locked peak step decays smoothly and monotonically (0.0384 -> 0.0158) while ' +
    'the interior trough step holds near-steady (~0.025 -> 0.019), so the crossing is genuine and ' +
    'permanent through kEnd = 13.0 with no earlier crossing; the thin ~0.0005 margin at the boundary ' +
    'reflects the grid-quantized argmin relocation (whether that is a discretization artifact is ' +
    'imp-34154). A grid-refinement of an inherited-surrogate diagnostic, distinct from any form ' +
    'selection; the imp-33843 log-linear verdict is untouched. The OLS surrogate is descriptive, not ' +
    'derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= ' +
    '0.2 remains SOTA.',
  citation:
    'imp-34085 (the half-decade per-step increments and the bracketed crossover located here); ' +
    'imp-34154 (the argmin-relocation discretization question behind the thin margin); imp-33877 (the ' +
    'inherited model replicated); imp-33843 (the log-linear OLS re-run on the refined grid); imp-33810 ' +
    '(the k=6..11 ladder extended here); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE_ASSERTIONS = [
  {
    // Reuse gate: at the 5 half-decade endpoints the refined grid reproduces the imp-34085 argmax/argmin
    // resids AND the half-decade sub-sampled per-step increments to ~0 -- same model, finer grid.
    id: 'imp34153-reuse-gate-reproduces-imp34085-half-decade',
    description: 'refined quarter-decade grid reproduces imp-34085 argmax/argmin resids and half-decade per-step increments at kEnd 11,11.5,12,12.5,13 (diff ~0)',
    holds: () =>
      reuseGateReproducesImp34085 === true &&
      maxReuseResidDiff < 1e-9 &&
      maxHdStepDiff < 1e-9,
  },
  {
    // Grid shape: quarter-decade receding-endpoint grid has 9 endpoints (11.00..13.00) and 8 window-steps,
    // step size 0.25 (imp-34085 used 0.5).
    id: 'imp34153-quarter-decade-grid-shape',
    description: 'kEnd = 11.00..13.00 in 0.25 steps -> 9 endpoints, 8 window-steps',
    holds: () =>
      KENDS.length === 9 &&
      peakSteps.length === 8 &&
      troughAbsSteps.length === 8 &&
      KENDS[0] === 11 &&
      KENDS[8] === 13 &&
      IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE.gridStepDecades === 0.25,
  },
  {
    // (R1) The endpoint-locked peak step decays smoothly and strictly monotonically 0.0384 -> 0.0158.
    id: 'imp34153-peak-step-monotone-smooth-decay',
    description: 'peak per-step increment strictly decreasing 0.0384 -> 0.0158 across kEnd 11..13',
    holds: () =>
      peakStepMonotoneDecay === true &&
      Math.abs(peakSteps[0] - 0.0384) < 1e-6 &&
      Math.abs(peakSteps[peakSteps.length - 1] - 0.0158) < 1e-6,
  },
  {
    // (R3) The crossover is LOCATED at the kEnd 12.25 -> 12.50 window-step; boundary endpoint kEnd = 12.50.
    id: 'imp34153-crossover-located-at-12p25-to-12p50',
    description: 'trough step first exceeds peak step at window-step (12.25 -> 12.50); boundaryKEnd = 12.50',
    holds: () =>
      crossIdx === 5 &&
      crossoverBracket.kEndLo === 12.25 &&
      crossoverBracket.kEndHi === 12.5 &&
      boundaryKEnd === 12.5 &&
      peakSteps[crossIdx] < troughAbsSteps[crossIdx] &&
      peakSteps[crossIdx - 1] > troughAbsSteps[crossIdx - 1],
  },
  {
    // The located boundary is EARLIER than the imp-34085 half-decade bracket (which put the crossover in
    // (12.5, 13.0]): the interpolated crossover kEnd* ~ 12.286 lies below 12.5, and the crossing is
    // permanent through 13.0 with no earlier crossing.
    id: 'imp34153-boundary-earlier-than-imp34085-bracket-and-permanent',
    description: 'interpolated kEnd* ~12.286 < 12.5 (earlier than imp-34085 half-decade bracket); crossover permanent, no earlier crossing',
    holds: () =>
      interpKEndStar > 12.25 &&
      interpKEndStar < 12.5 &&
      Math.abs(interpKEndStar - 12.286) < 0.01 &&
      crossoverIsPermanent === true &&
      noEarlierCrossing === true,
  },
  {
    // Honesty gate: measurement only -- isRigorous false, log-linear form verdict untouched, no QED, PT SOTA,
    // imp-3066 K_a >= 0 untouched, C_mb GUE-conditional per imp-486 untouched.
    id: 'imp34153-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA, imp-3066 K_a>=0 untouched, C_mb GUE-conditional untouched',
    holds: () =>
      IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE.isRigorous === false &&
      /NO QED/.test(IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE.verdict) &&
      /remains SOTA/.test(IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE.verdict),
  },
];

for (const a of IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34153-trough-peak-perstep-crossover-locate assertion failed: ${a.id}`);
  }
}
