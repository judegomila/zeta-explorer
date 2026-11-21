/**
 * @module imp-34234-trough-peak-perstep-crossover-tenth-decade
 *
 * imp-34234 (numerical, frontier-direction): imp-34153 refined the imp-34085 HALF-decade bracket of the
 * trough-deepening-overtakes-peak-growth crossover to a QUARTER-decade (0.25) receding-endpoint grid over
 * kEnd = 11.00..13.00, locating the boundary where the interior-trough per-step increment first exceeds the
 * endpoint-peak per-step increment to the window-step (12.25 -> 12.50) (boundary endpoint kEnd = 12.50,
 * interpolated crossover midpoint kEnd* ~ 12.286). It never fit HOW FAST the trough gains once past that
 * boundary, and the located boundary was still only a quarter-decade window.
 *
 * This module refines the receding-endpoint grid one step further to a TENTH-decade (0.1) grid
 * (kEnd = 11.00, 11.10, ..., 13.00 -- 21 endpoints, 20 window-steps of 0.1), reusing the IDENTICAL inherited
 * imp-3220/imp-3406 component sub-terms verbatim (the exact effectiveHeightForN / C_C_PINNED parts model as in
 * imp-33810/imp-33877/imp-34085/imp-34153), LOCATES the crossover to sub-quarter-decade resolution, and FITS
 * the post-crossover gap growth (troughStep - peakStep) to characterise how fast the interior trough gains on
 * the endpoint peak once past the boundary.
 *
 * NOTE ON THE LADDER RUNG (honest scope). Because the eflow_over_resid ladder rungs are quantized to the same
 * decade step as the grid, refining the receding-endpoint grid to 0.1 REQUIRES refining the ladder rung to 0.1
 * as well -- a 0.1-decade kEnd on a 0.25 rung would alias (kEnd = 11.0, 11.1, 11.2 would all land on the same
 * last rung k = 11.0 and produce an identical ladder). So BOTH the grid AND the rung step move 0.25 -> 0.1.
 * That denser ladder gives a different OLS fit, so the argmax/argmin residual MAGNITUDES here are NOT
 * bit-identical to imp-34153 (peak reaches 0.4831 at kEnd = 13 vs imp-34153 0.4651 on the coarser rung).
 * What is reused verbatim is the COMPONENT sub-term model (parts), and the CONSISTENCY the finer grid must
 * satisfy is nesting: the located crossover window must fall inside imp-34153 quarter-decade bracket and the
 * interpolated kEnd* must agree with imp-34153 to a few hundredths.
 *
 * THE MEASUREMENT (imp-34153 model reused verbatim; grid AND rung refined 0.25 -> 0.1)
 * ---------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), inherited imp-3220/imp-3406 sub-terms
 *                    EXACTLY as imp-34153 (E_trunc = 3.06e-5 strip, E_coll = C_C_PINNED sqrt(log T0 / N),
 *                    E_flow = C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN(N)).
 *   Ladder / fit     eflow_over_resid over k = 6.00 .. kEnd (0.10 rungs), y = ln(eflow_over_resid),
 *                    OLS y = a + b k; peak = argmax residual (endpoint-locked), trough = argmin (interior).
 *   Grid refinement  kEnd = 11.00, 11.10, ..., 13.00 (tenth-decade; imp-34153 used quarter-decade 0.25).
 *   Per-step         peakStep_i = peak(kEnd_i) - peak(kEnd_{i-1});
 *                    troughStep_i = |trough(kEnd_i)| - |trough(kEnd_{i-1})|.
 *   Gap-growth fit   Over the post-crossover window-steps, gap_i = troughStep_i - peakStep_i (the amount the
 *                    trough gains on the peak per tenth-decade); OLS gap vs the window-step midpoint kEnd.
 *
 * THE FINDING (measurement / location only)
 * -----------------------------------------
 *   (R1) THE PEAK PER-STEP GROWTH DECAYS SMOOTHLY AND STRICTLY MONOTONICALLY. On the tenth-decade grid the
 *        endpoint-locked peak step falls strictly 0.01592 -> 0.00568 across kEnd 11.00..13.00 with no bumps,
 *        because the argmax stays pinned on the receding endpoint (all 21 fits endpoint-locked).
 *   (R2) THE TROUGH PER-STEP DEEPENING IS NEAR-STEADY BUT BUMPY. The trough step holds ~0.0096 -> 0.0078,
 *        wobbling as the interior argmin relocates in discrete 0.1-rung jumps (argmin k walks 9.1 -> 9.6),
 *        which is why the crossover margin is thin.
 *   (R3) THE CROSSOVER IS LOCATED TO A SINGLE TENTH-DECADE WINDOW -- SHARPER THAN THE imp-34153 QUARTER-
 *        DECADE BRACKET. The trough step first exceeds the peak step at window-step (12.30 -> 12.40):
 *        peak 0.00869 < trough 0.00887, whereas at (12.20 -> 12.30) peak 0.00931 > trough 0.00887. So the
 *        boundary receding endpoint is kEnd = 12.40, the crossing is PERMANENT through 13.00 with no earlier
 *        crossing, and the interpolated crossover midpoint is kEnd* ~ 12.321. This window (12.30, 12.40)
 *        NESTS strictly inside the imp-34153 quarter-decade bracket (12.25, 12.50), and kEnd* ~ 12.321 agrees
 *        with imp-34153 kEnd* ~ 12.286 to ~0.035 -- the tenth-decade grid pulls the boundary endpoint down
 *        from 12.50 to 12.40 and confirms the crossover neighbourhood ~ 12.3.
 *   (R4) THE TROUGH-GAINS-ON-PEAK BRANCH GROWS ROUGHLY LINEARLY PAST THE BOUNDARY. Fitting the per-step gap
 *        (troughStep - peakStep) over the seven post-crossover window-steps (midpoints 12.35..12.95) gives a
 *        gap climbing 0.00018 -> 0.00212, an OLS slope ~ +0.00329 per unit kEnd-midpoint (R^2 ~ 0.978, mean
 *        per-step growth ~ +0.00032). The gap is bumpy from the same discrete argmin relocation but is clearly
 *        monotone-increasing: once past the boundary the trough gains on the peak at an accelerating cumulative
 *        (roughly linear per-step) rate over the computable tail.
 *
 * The punchline: refining the imp-34153 crossover measurement to a tenth-decade grid LOCATES the trough-
 * overtakes-peak boundary to the single window-step (12.30 -> 12.40) (boundary endpoint kEnd = 12.40;
 * interpolated kEnd* ~ 12.321), nested inside and consistent with the imp-34153 quarter-decade bracket, and
 * FITS the post-crossover trough-gains-on-peak branch as a roughly linear per-step gap growth (slope ~ +0.0033
 * per kEnd-midpoint, R^2 ~ 0.98) -- characterising, for the first time past the imp-34085 bracket, how fast the
 * interior trough gains on the endpoint peak once past the boundary.
 *
 * MEASUREMENT / LOCATION ONLY. A grid-and-rung refinement of the imp-34153 per-step increment measurement on
 * the inherited imp-33810 ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form selection
 * (the imp-33843 log-linear verdict is untouched). The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive, not derived; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34153-trough-peak-perstep-crossover-locate (the quarter-decade bracket refined and nested here)
 * @see imp-34085-trough-peak-ratio-convergence (the half-decade per-step increments and original crossover bracket)
 * @see imp-34154 (whether the argmin stall-then-jump behind the thin margin is a discretization artifact)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run on the refined grid)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..11 ladder extended here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE } from './imp-34153-trough-peak-perstep-crossover-locate.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631, exactly as imp-33810/imp-34153)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation, verbatim from imp-34153).
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
function rSquared(xs, ys, fit) {
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < xs.length; i++) {
    const pred = fit.a + fit.b * xs[i];
    ssTot += (ys[i] - my) ** 2;
    ssRes += (ys[i] - pred) ** 2;
  }
  return 1 - ssRes / ssTot;
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

// FINER ladder rung: tenth-decade (imp-34153 used 0.25, forced to move with the grid; see NOTE above).
const RUNG = 0.1;
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += RUNG) {
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

// Fit the imp-33843 log-linear surrogate; return argmax (peak) / argmin (trough), same as imp-34153.
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

// FINEST receding-endpoint grid: tenth-decade kEnd = 11.00, 11.10, ..., 13.00 (imp-34153 used 0.25).
const KENDS = [];
for (let ke = 11; ke <= 13 + 1e-9; ke += 0.1) KENDS.push(+ke.toFixed(2));
const FITS = KENDS.map((ke) => fitLadder(buildLadder(ke)));

const peakSeq = FITS.map((f) => f.argmax.resid);
const troughSeq = FITS.map((f) => f.argmin.resid);
const argminKs = FITS.map((f) => f.argmin.k);

// Per-tenth-decade-step increments (the mechanism, at finer resolution than imp-34153).
const peakSteps = [];
const troughAbsSteps = [];
const stepMids = [];
const stepDiff = []; // peakStep - troughStep; sign flips at the crossover
for (let i = 1; i < FITS.length; i++) {
  const ps = +(peakSeq[i] - peakSeq[i - 1]).toFixed(5);
  const ts = +(Math.abs(troughSeq[i]) - Math.abs(troughSeq[i - 1])).toFixed(5);
  peakSteps.push(ps);
  troughAbsSteps.push(ts);
  stepMids.push(+((KENDS[i] + KENDS[i - 1]) / 2).toFixed(3));
  stepDiff.push(+(ps - ts).toFixed(5));
}

// LOCATE the crossover: first window-step where the trough step exceeds the peak step (stepDiff < 0).
let crossIdx = -1;
for (let i = 0; i < stepDiff.length; i++) {
  if (stepDiff[i] < 0) {
    crossIdx = i;
    break;
  }
}
const crossoverBracket = { kEndLo: KENDS[crossIdx], kEndHi: KENDS[crossIdx + 1] }; // {12.3, 12.4}
const boundaryKEnd = KENDS[crossIdx + 1]; // 12.4 -- receding endpoint of the first trough-ahead step
// Soft interpolated crossover midpoint kEnd* (trough step is grid-quantized, so this is descriptive).
const interpKEndStar = +(
  stepMids[crossIdx - 1] +
  0.1 * (stepDiff[crossIdx - 1] / (stepDiff[crossIdx - 1] - stepDiff[crossIdx]))
).toFixed(4); // ~12.321
// Permanence: once the trough step overtakes, it stays ahead through kEnd = 13.0 (no reversion).
const crossoverIsPermanent = stepDiff.slice(crossIdx).every((d) => d < 0);
// No earlier crossing: every window-step before the boundary has the peak step still ahead.
const noEarlierCrossing = stepDiff.slice(0, crossIdx).every((d) => d > 0);
// Peak step decays smoothly and strictly monotonically (endpoint-locked argmax).
const peakStepMonotoneDecay = peakSteps.every((d, i) => i === 0 || d < peakSteps[i - 1]);
const allEndpointLocked = FITS.every((f) => f.argmax.isEndpoint);

// (R4) FIT the trough-gains-on-peak branch: per-step gap = troughStep - peakStep over post-crossover steps.
const gapMids = [];
const gapSeq = [];
for (let i = crossIdx; i < stepDiff.length; i++) {
  gapMids.push(stepMids[i]);
  gapSeq.push(+(-stepDiff[i]).toFixed(5)); // troughStep - peakStep = -stepDiff, positive past the crossover
}
const gapFit = ols(gapMids, gapSeq); // gap ~ a + b*kEndMid
const gapFitR2 = +rSquared(gapMids, gapSeq, gapFit).toFixed(4);
const gapFitSlope = +gapFit.b.toFixed(5);
const gapFitIntercept = +gapFit.a.toFixed(5);
const meanGapGrowthPerStep = +((gapSeq[gapSeq.length - 1] - gapSeq[0]) / (gapSeq.length - 1)).toFixed(5);

// CONSISTENCY (nesting) gate vs imp-34153: the tenth-decade located window must fall inside the imp-34153
// quarter-decade bracket, and the interpolated kEnd* must agree with imp-34153 to a few hundredths.
const SRC = IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE;
const nestsInImp34153Bracket =
  crossoverBracket.kEndLo >= SRC.crossoverBracket.kEndLo - 1e-9 &&
  crossoverBracket.kEndHi <= SRC.crossoverBracket.kEndHi + 1e-9;
const interpAgreesWithImp34153 = Math.abs(interpKEndStar - SRC.interpolatedCrossoverKEnd) < 0.05;

export const IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE = {
  id: 'imp-34234',
  proofSection: 'S-frontier',
  question:
    'imp-34153 located the trough-overtakes-peak per-step crossover to a QUARTER-decade window (kEnd 12.25 ' +
    '-> 12.50, interpolated kEnd* ~ 12.286) but never fit HOW FAST the trough gains once past the boundary. ' +
    'Refine the receding-endpoint grid to a TENTH-decade (0.1) grid (kEnd = 11.00, 11.10, ..., 13.00), reusing ' +
    'the SAME inherited effectiveHeightForN/C_C_PINNED sub-terms, LOCATE the crossover to sub-quarter-decade ' +
    'resolution, and FIT the post-crossover trough-gains-on-peak gap growth. Measurement/location only; NOT an ' +
    'RH bound; no QED.',
  measuredQuantity:
    'The imp-33843 log-linear OLS argmax-peak and argmin-trough per-step increments over consecutive ' +
    'tenth-decade receding endpoints kEnd = 11.00..13.00, the boundary kEnd at which the trough step first ' +
    '(and permanently) exceeds the peak step, and a linear fit of the post-crossover per-step gap ' +
    '(troughStep - peakStep) characterising how fast the trough gains on the peak',
  gridStepDecades: 0.1, // imp-34153 used 0.25; this refines the receding-endpoint step (and the ladder rung) further
  ladderRungDecades: RUNG, // 0.1 -- forced to move with the grid so 0.1-decade kEnd endpoints land on rungs
  kEnds: KENDS, // 11.00, 11.10, ..., 13.00 (21 endpoints)
  peakSequence: peakSeq, // 0.2678 .. 0.4831, endpoint-locked argmax residual (denser ladder than imp-34153)
  troughSequence: troughSeq, // -0.1478 .. -0.3299, interior argmin residual
  argminKSequence: argminKs, // 9.1 -> 9.6, the interior argmin walking in 0.1-rung jumps
  peakStepIncrements: peakSteps, // 0.01592 -> 0.00568, smooth strict monotone deceleration
  troughAbsStepIncrements: troughAbsSteps, // ~0.0096 -> 0.0078, near-steady, bumpy at the argmin relocation
  stepMidpoints: stepMids,
  stepDiff, // peakStep - troughStep: +...+, then flips negative at the crossover
  crossoverStepIndex: crossIdx, // 13 (the 12.30 -> 12.40 window-step)
  crossoverBracket, // {kEndLo: 12.3, kEndHi: 12.4}
  boundaryKEnd, // 12.4 -- receding endpoint at which the trough step first overtakes the peak step
  interpolatedCrossoverKEnd: interpKEndStar, // ~12.321 (soft; trough step is grid-quantized)
  crossoverIsPermanent, // true -- trough step stays ahead through kEnd = 13.0
  noEarlierCrossing, // true -- every step before the boundary has the peak step ahead
  peakStepMonotoneDecay, // true -- argmax stays endpoint-locked, so the peak step decays cleanly
  allEndpointLocked, // true -- all 21 argmax fits are endpoint-locked
  // (R4) trough-gains-on-peak branch fit
  postCrossoverGapMidpoints: gapMids, // 12.35 .. 12.95
  postCrossoverGapSequence: gapSeq, // 0.00018 -> 0.00212, per-step gap (troughStep - peakStep)
  gapGrowthFitSlope: gapFitSlope, // ~ +0.00329 per unit kEnd-midpoint
  gapGrowthFitIntercept: gapFitIntercept, // ~ -0.04035
  gapGrowthFitR2: gapFitR2, // ~0.978 -- roughly linear (bumpy from argmin relocation)
  meanGapGrowthPerStep, // ~ +0.00032 per tenth-decade step
  // consistency vs imp-34153
  nestsInImp34153Bracket, // true -- (12.3, 12.4) nests inside imp-34153 (12.25, 12.50)
  interpAgreesWithImp34153, // true -- kEnd* 12.321 vs imp-34153 12.286, within ~0.035
  imp34153InterpolatedCrossoverKEnd: SRC.interpolatedCrossoverKEnd, // 12.286
  finding: {
    R1_peak_step_smooth_monotone_decay:
      'On the tenth-decade grid the endpoint-locked peak step falls strictly 0.01592 -> 0.00568 across kEnd ' +
      '11.00..13.00 -- a clean deceleration with no bumps, because the argmax stays pinned on the receding ' +
      'endpoint (all 21 fits endpoint-locked).',
    R2_trough_step_near_steady_but_bumpy:
      'The trough step holds ~0.0096 -> 0.0078, wobbling as the interior argmin relocates in discrete ' +
      '0.1-rung jumps (argmin k walks 9.1 -> 9.6), which is why the crossover margin is thin.',
    R3_crossover_located_to_single_tenth_decade_window:
      'The trough step first exceeds the peak step at window-step (12.30 -> 12.40): peak 0.00869 < trough ' +
      '0.00887, whereas at (12.20 -> 12.30) peak 0.00931 > trough 0.00887. Boundary endpoint kEnd = 12.40, ' +
      'crossing PERMANENT through 13.00 with no earlier crossing, interpolated kEnd* ~ 12.321. This window ' +
      '(12.30, 12.40) NESTS inside the imp-34153 quarter-decade bracket (12.25, 12.50) and kEnd* ~ 12.321 ' +
      'agrees with imp-34153 kEnd* ~ 12.286 to ~0.035; the tenth-decade grid pulls the boundary endpoint ' +
      'down from 12.50 to 12.40.',
    R4_trough_gains_on_peak_grows_roughly_linearly:
      'Fitting the per-step gap (troughStep - peakStep) over the seven post-crossover window-steps (midpoints ' +
      '12.35..12.95) gives a gap climbing 0.00018 -> 0.00212, OLS slope ~ +0.00329 per unit kEnd-midpoint ' +
      '(R^2 ~ 0.978, mean per-step growth ~ +0.00032). Bumpy from the argmin relocation but clearly ' +
      'monotone-increasing: once past the boundary the trough gains on the peak at a roughly linear per-step ' +
      'rate over the computable tail.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / LOCATION (frontier-direction, NOT rigorous). Refining the imp-34153 per-step increment ' +
    'measurement -- the IDENTICAL inherited effectiveHeightForN/C_C_PINNED component sub-terms (parts model ' +
    'verbatim) -- to a TENTH-decade receding-endpoint grid (kEnd = 11.00, 11.10, ..., 13.00; the ladder rung ' +
    'is refined 0.25 -> 0.1 in lockstep so the 0.1-decade endpoints land on rungs, which changes the residual ' +
    'MAGNITUDES but not the crossover structure) LOCATES the imp-34153 trough-overtakes-peak crossover to the ' +
    'single window-step (12.30 -> 12.40) (boundary endpoint kEnd = 12.40; interpolated crossover midpoint ' +
    'kEnd* ~ 12.321) -- nested inside and consistent with the imp-34153 quarter-decade bracket (12.25, 12.50) ' +
    '(kEnd* 12.321 vs 12.286). The endpoint-locked peak step decays smoothly and strictly monotonically ' +
    '(0.01592 -> 0.00568) while the interior trough step holds near-steady (~0.0096 -> 0.0078), so the ' +
    'crossing is genuine and permanent through kEnd = 13.0 with no earlier crossing; the thin margin at the ' +
    'boundary reflects the grid-quantized argmin relocation (whether that is a discretization artifact is ' +
    'imp-34154). FITTING the post-crossover trough-gains-on-peak branch (per-step gap troughStep - peakStep ' +
    'over midpoints 12.35..12.95) gives a roughly linear gap growth, slope ~ +0.00329 per kEnd-midpoint ' +
    '(R^2 ~ 0.978), characterising for the first time how fast the trough gains on the peak past the imp-34085 ' +
    'bracket. A grid-and-rung refinement of an inherited-surrogate diagnostic, distinct from any form ' +
    'selection; the imp-33843 log-linear verdict is untouched. The OLS surrogate is descriptive, not derived; ' +
    'the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34153 (the quarter-decade bracket refined and nested here); imp-34085 (the half-decade per-step ' +
    'increments and original crossover bracket); imp-34154 (the argmin-relocation discretization question ' +
    'behind the thin margin); imp-33843 (the log-linear OLS re-run on the refined grid); imp-33810 (the ' +
    'k=6..11 ladder extended here); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE_ASSERTIONS = [
  {
    // Grid shape: tenth-decade receding-endpoint grid has 21 endpoints (11.00..13.00) and 20 window-steps,
    // step size 0.1 (imp-34153 used 0.25); the ladder rung moves in lockstep to 0.1.
    id: 'imp34234-tenth-decade-grid-shape',
    description: 'kEnd = 11.00..13.00 in 0.1 steps -> 21 endpoints, 20 window-steps, rung 0.1',
    holds: () =>
      KENDS.length === 21 &&
      peakSteps.length === 20 &&
      troughAbsSteps.length === 20 &&
      KENDS[0] === 11 &&
      KENDS[20] === 13 &&
      IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE.gridStepDecades === 0.1 &&
      IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE.ladderRungDecades === 0.1,
  },
  {
    // (R1) The endpoint-locked peak step decays smoothly and strictly monotonically 0.01592 -> 0.00568.
    id: 'imp34234-peak-step-monotone-smooth-decay',
    description: 'peak per-step increment strictly decreasing 0.01592 -> 0.00568 across kEnd 11..13; all argmax endpoint-locked',
    holds: () =>
      peakStepMonotoneDecay === true &&
      allEndpointLocked === true &&
      Math.abs(peakSteps[0] - 0.01592) < 1e-6 &&
      Math.abs(peakSteps[peakSteps.length - 1] - 0.00568) < 1e-6,
  },
  {
    // (R3) The crossover is LOCATED at the kEnd 12.30 -> 12.40 window-step; boundary endpoint kEnd = 12.40.
    id: 'imp34234-crossover-located-at-12p30-to-12p40',
    description: 'trough step first exceeds peak step at window-step (12.30 -> 12.40); boundaryKEnd = 12.40',
    holds: () =>
      crossIdx === 13 &&
      crossoverBracket.kEndLo === 12.3 &&
      crossoverBracket.kEndHi === 12.4 &&
      boundaryKEnd === 12.4 &&
      peakSteps[crossIdx] < troughAbsSteps[crossIdx] &&
      peakSteps[crossIdx - 1] > troughAbsSteps[crossIdx - 1],
  },
  {
    // (R3) The located window NESTS inside the imp-34153 quarter-decade bracket and kEnd* agrees; crossover
    // permanent through 13.0 with no earlier crossing.
    id: 'imp34234-nests-in-imp34153-bracket-and-permanent',
    description: 'located window (12.3,12.4) nests in imp-34153 (12.25,12.5); interp kEnd* ~12.321 agrees with imp-34153 12.286; permanent, no earlier crossing',
    holds: () =>
      nestsInImp34153Bracket === true &&
      interpAgreesWithImp34153 === true &&
      interpKEndStar > 12.25 &&
      interpKEndStar < 12.4 &&
      Math.abs(interpKEndStar - 12.321) < 0.01 &&
      crossoverIsPermanent === true &&
      noEarlierCrossing === true,
  },
  {
    // (R4) The post-crossover trough-gains-on-peak gap grows roughly linearly: 7 steps, positive slope, high R^2.
    id: 'imp34234-trough-gains-on-peak-gap-growth-fit',
    description: 'post-crossover per-step gap (troughStep - peakStep) grows roughly linearly: slope ~+0.00329, R^2 ~0.978 over 7 steps',
    holds: () =>
      gapMids.length === 7 &&
      gapSeq.length === 7 &&
      gapSeq.every((g) => g > 0) &&
      gapFitSlope > 0 &&
      Math.abs(gapFitSlope - 0.00329) < 5e-4 &&
      gapFitR2 > 0.9 &&
      Math.abs(gapFitR2 - 0.978) < 0.02,
  },
  {
    // Honesty gate: measurement only -- isRigorous false, log-linear form verdict untouched, no QED, no refereed bound is changed,
    // imp-3066 K_a >= 0 untouched, C_mb GUE-conditional per imp-486 untouched.
    id: 'imp34234-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, C_mb GUE-conditional untouched',
    holds: () =>
      IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE.isRigorous === false &&
      /NO QED/.test(IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE.verdict) &&
      /refereed bound is changed/i.test(IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE.verdict),
  },
];

for (const a of IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34234-trough-peak-perstep-crossover-tenth-decade assertion failed: ${a.id}`);
  }
}
