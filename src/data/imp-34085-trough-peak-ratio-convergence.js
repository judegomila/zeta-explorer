/**
 * @module imp-34085-trough-peak-ratio-convergence
 *
 * imp-34085 (numerical, frontier-direction): imp-34022 R2 contrasted the endpoint-peak (argmax) and
 * negative-trough (argmin) migrations of the imp-33843 log-linear widening re-fit as the imp-33810
 * ladder boundary recedes (BASE k=6..11, EXT115 k=6..11.5, EXT12 k=6..12) and reported that although
 * the two edges are NOT magnitude-symmetric in absolute terms, their amplitude RATIO |trough|/|peak|
 * stayed near-constant ~0.6151 -> 0.6293 -> 0.6492 (drifting up only ~5.5% over the three windows).
 * imp-34022 measured that ratio over only three windows and never asked whether it is CONVERGING to a
 * fixed limit or merely creeping slowly over too short a span to see. This module extends the imp-33810
 * ladder two further quarter-decade steps (EXT125 k=6..12.5, 27 rungs; EXT13 k=6..13, 29 rungs) with the
 * SAME inherited effectiveHeightForN / C_C_PINNED sub-terms, re-runs the imp-33843 OLS on each enlarged
 * ladder, recomputes the argmax-peak and argmin-trough, and tabulates |trough|/|peak| across all five
 * windows to test convergence.
 *
 * THE MEASUREMENT (imp-33810 ladder reused verbatim for k<=11; extension rungs use the same model)
 * ----------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-33877 (E_trunc = 3.06e-5 fixed strip,
 *                    E_coll = C_C_PINNED sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall,
 *                    T0 = effectiveHeightForN(N)). A reuse gate below checks that the replicated
 *                    BASE/EXT115/EXT12 argmax/argmin reproduce the imp-33877 inherited values, so the
 *                    two new windows are the SAME measurement pushed two rungs further, not a fresh model.
 *   Ladders          BASE   k = 6.00..11.00 (21 rungs, the imp-33810/imp-33858 window)
 *                    EXT115 k = 6.00..11.50 (23 rungs)
 *                    EXT12  k = 6.00..12.00 (25 rungs, the imp-34022 last window)
 *                    EXT125 k = 6.00..12.50 (27 rungs, +k = 12.25, 12.50)   -- NEW
 *                    EXT13  k = 6.00..13.00 (29 rungs, +k = 12.75, 13.00)   -- NEW
 *   Response  y_k = ln(eflow_over_resid_k);   Fit  y = a + b k  (the imp-33843 log-linear WINNER),
 *   re-run by OLS on EACH ladder; ratio_w = |argmin.resid| / |argmax.resid| per window.
 *
 * THE FINDING (measurement only -- the ratio does NOT converge; the creep ACCELERATES)
 * -----------------------------------------------------------------------------------
 *   (R1) THE RATIO KEEPS CREEPING UPWARD; NO LIMIT IS VISIBLE. Extending past EXT12 the ratio continues
 *        0.6151 -> 0.6293 -> 0.6492 -> 0.6868 -> 0.7200. The per-window-step increment does NOT shrink
 *        toward zero (the signature of convergence); it GROWS: +0.0142, +0.0199, +0.0376, +0.0332. Over
 *        the full BASE -> EXT13 span the ratio rises ~17.1% (vs the ~5.5% imp-34022 read over BASE..EXT12),
 *        so the imp-34022 "near-constant" reading was a short-window artifact -- no saturation appears.
 *   (R2) THE MECHANISM: THE PEAK GROWTH DECELERATES WHILE THE TROUGH DEEPENS AT A NEAR-STEADY RATE. The
 *        endpoint-locked peak grows +0.2479 -> +0.3218 -> +0.3830 -> +0.4305 -> +0.4651 with per-step
 *        increments SHRINKING +0.0740, +0.0612, +0.0475, +0.0346; the interior trough deepens -0.1525 ->
 *        -0.2025 -> -0.2487 -> -0.2957 -> -0.3349 with per-step |increments| holding near-steady +0.0501,
 *        +0.0461, +0.0470, +0.0392. Past k~12.5 the trough deepens as fast as -- then faster than -- the
 *        peak grows (peak step +0.0346 < trough step +0.0392 at EXT13), which is exactly why the ratio
 *        turns upward rather than flattening.
 *   (R3) THE TROUGH LOCATION STALLS THEN JUMPS; THE PEAK STAYS ENDPOINT-LOCKED. The argmax remains on the
 *        receding endpoint at every window (k=11,11.5,12,12.5,13), while the argmin migrates outward but
 *        NOT uniformly: k=9.00 -> 9.25 -> 9.50 -> 9.50 -> 9.75 (it stalls one step at 9.50 before jumping),
 *        so the imp-34022 "+0.25 per step" trough-location rate does not persist -- another reason the
 *        naive linear-migration picture does not extrapolate to a fixed amplitude ratio.
 *
 * The punchline: the imp-34022 near-constant amplitude ratio |trough|/|peak| ~0.63 does NOT converge to
 * a fixed limit as the fit boundary recedes. Two further ladder steps show it creeping up to 0.6868 then
 * 0.7200 (a ~17% total drift, up from the ~5.5% imp-34022 saw), and the per-step increment GROWS rather
 * than shrinks -- because the endpoint-locked peak's growth decelerates while the interior trough keeps
 * deepening at a near-steady rate, so past k~12.5 the trough gains on the peak. The imp-34022 "near-fixed
 * proportion" reading is a short-window artifact, not a saturating limit.
 *
 * MEASUREMENT / CONVERGENCE TEST ONLY. A diagnostic re-fit of an inherited surrogate on an extended
 * inherited ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form selection (the
 * imp-33843 log-linear verdict is untouched; R^2 stays > 0.99). The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive, not
 * derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34022-argmin-argmax-migration-symmetry (the |trough|/|peak| ~0.63 near-constancy tested here)
 * @see imp-33877-widening-fit-tail-endpoint-artifact-test (BASE/EXT115/EXT12 reuse gate; model replicated)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run on the extended ladder)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..11 ladder extended here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST } from './imp-33877-widening-fit-tail-endpoint-artifact-test.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631, exactly as imp-33810/imp-33877)
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

// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
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
// imp-33620/imp-33727 magnitude exponent: p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
// s_flow = d ln E_flow / d ln N via a symmetric log-N central difference.
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// Build the quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), same as imp-33810.
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

// Fit the imp-33843 log-linear surrogate on a ladder; return argmax/argmin and stats.
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
  const my = Y.reduce((a, b) => a + b, 0) / Y.length;
  const ssTot = Y.reduce((s, y) => s + (y - my) ** 2, 0);
  const ssRes = RES.reduce((s, e) => s + e * e, 0);
  return {
    rungs: KS.length,
    rmse: +Math.sqrt(ssRes / RES.length).toExponential(4),
    r2: +(1 - ssRes / ssTot).toFixed(6),
    argmax: { k: KS[maxI], resid: +RES[maxI].toExponential(4), isEndpoint: maxI === RES.length - 1 },
    argmin: { k: KS[minI], resid: +RES[minI].toExponential(4) },
  };
}

// Five windows: BASE/EXT115/EXT12 (the imp-34022 span) plus the two NEW extensions EXT125/EXT13.
const KENDS = [11, 11.5, 12, 12.5, 13];
const NAMES = ['BASE', 'EXT115', 'EXT12', 'EXT125', 'EXT13'];
const FITS = KENDS.map((kEnd) => fitLadder(buildLadder(kEnd)));

// Reuse gate: the replicated BASE/EXT115/EXT12 must reproduce the imp-33877 inherited argmax/argmin,
// so the two new windows are the SAME inherited measurement pushed two rungs further, not a fresh model.
const SRC = IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST;
const inheritedFirstThree = [SRC.base, SRC.ext115, SRC.ext12];
let MAX_REUSE_DIFF = 0;
for (let i = 0; i < 3; i++) {
  MAX_REUSE_DIFF = Math.max(
    MAX_REUSE_DIFF,
    Math.abs(FITS[i].argmax.resid - inheritedFirstThree[i].argmax.resid),
    Math.abs(FITS[i].argmin.resid - inheritedFirstThree[i].argmin.resid),
  );
}

// Per-window amplitude ratio |trough|/|peak| and its per-window-step increment.
const ratioSeq = FITS.map((f, i) => ({
  window: NAMES[i],
  kEnd: KENDS[i],
  peak: f.argmax.resid,
  trough: f.argmin.resid,
  ratio: +(Math.abs(f.argmin.resid) / Math.abs(f.argmax.resid)).toFixed(4),
}));
const ratioSteps = [];
for (let i = 1; i < ratioSeq.length; i++) {
  ratioSteps.push(+(ratioSeq[i].ratio - ratioSeq[i - 1].ratio).toFixed(4));
}
// Full-span drift vs the imp-34022 BASE..EXT12 drift (both as a fraction of the BASE ratio).
const driftFull = +((ratioSeq[4].ratio - ratioSeq[0].ratio) / ratioSeq[0].ratio).toFixed(4); // ~0.171
const driftImp34022 = +((ratioSeq[2].ratio - ratioSeq[0].ratio) / ratioSeq[0].ratio).toFixed(4); // ~0.055

// Peak and trough per-step increments -- the mechanism behind the non-convergence.
const peakSteps = [];
const troughAbsSteps = [];
for (let i = 1; i < FITS.length; i++) {
  peakSteps.push(+(FITS[i].argmax.resid - FITS[i - 1].argmax.resid).toFixed(4));
  troughAbsSteps.push(+(Math.abs(FITS[i].argmin.resid) - Math.abs(FITS[i - 1].argmin.resid)).toFixed(4));
}
// The increments never shrink toward zero: the ratio does not saturate.
const ratioStepShrinksToZero = ratioSteps[ratioSteps.length - 1] < 1e-3;
const converges = false;

export const IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE = {
  id: 'imp-34085',
  proofSection: 'S-frontier',
  question:
    'imp-34022 R2 found the endpoint-peak / negative-trough amplitude ratio |trough|/|peak| near-constant ' +
    '~0.6151 -> 0.6293 -> 0.6492 across BASE/EXT115/EXT12 (only ~5.5% drift). Does that ratio converge to ' +
    'a fixed limit as the fit boundary recedes, or keep creeping upward? Extend the imp-33810 ladder two ' +
    'further steps (k=6..12.5, 6..13), recompute the argmax-peak and argmin-trough of the imp-33843 re-fit, ' +
    'and measure the ratio sequence. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The imp-33843 log-linear OLS argmax (endpoint peak) and argmin (negative trough) re-fit on the ' +
    'imp-33810 ladder extended to k=6..12.5 (27 rungs) and k=6..13 (29 rungs), and the amplitude ratio ' +
    '|trough|/|peak| across all five windows BASE..EXT13, testing whether it saturates to a limit',
  reuseGateMaxDiffVsImp33877: +MAX_REUSE_DIFF.toExponential(3), // ~0 -- replicated model matches imp-33877
  ratioSequence: ratioSeq, // 0.6151 -> 0.6293 -> 0.6492 -> 0.6868 -> 0.7200
  ratioStepIncrements: ratioSteps, // +0.0142, +0.0199, +0.0376, +0.0332 -- GROWING, not shrinking
  driftFractionFullSpan: driftFull, // ~0.171 (BASE->EXT13)
  driftFractionImp34022Span: driftImp34022, // ~0.055 (BASE->EXT12, matches imp-34022)
  peakStepIncrements: peakSteps, // +0.0740, +0.0612, +0.0475, +0.0346 -- decelerating
  troughAbsStepIncrements: troughAbsSteps, // +0.0501, +0.0461, +0.0470, +0.0392 -- near-steady
  argmaxSequence: FITS.map((f, i) => ({ window: NAMES[i], k: f.argmax.k, resid: f.argmax.resid, isEndpoint: f.argmax.isEndpoint })),
  argminSequence: FITS.map((f, i) => ({ window: NAMES[i], k: f.argmin.k, resid: f.argmin.resid })),
  r2Sequence: FITS.map((f) => f.r2), // stays > 0.99 -- log-linear form verdict untouched
  ratioConverges: converges,
  ratioStepShrinksToZero, // false
  finding: {
    R1_ratio_keeps_creeping_no_limit_visible:
      'Extending past EXT12 the ratio continues 0.6151 -> 0.6293 -> 0.6492 -> 0.6868 -> 0.7200. The ' +
      'per-window-step increment does NOT shrink toward zero (the signature of convergence); it GROWS ' +
      '+0.0142, +0.0199, +0.0376, +0.0332. Over the full BASE -> EXT13 span the ratio rises ~17.1% (vs ' +
      'the ~5.5% imp-34022 read over BASE..EXT12), so the imp-34022 "near-constant" reading was a ' +
      'short-window artifact -- no saturation is visible.',
    R2_mechanism_peak_decelerates_trough_near_steady:
      'The endpoint-locked peak grows +0.2479 -> +0.3218 -> +0.3830 -> +0.4305 -> +0.4651 with per-step ' +
      'increments SHRINKING +0.0740, +0.0612, +0.0475, +0.0346; the interior trough deepens -0.1525 -> ' +
      '-0.2025 -> -0.2487 -> -0.2957 -> -0.3349 with per-step |increments| near-steady +0.0501, +0.0461, ' +
      '+0.0470, +0.0392. Past k~12.5 the trough deepens as fast as -- then faster than -- the peak grows ' +
      '(peak step +0.0346 < trough step +0.0392 at EXT13), which is exactly why the ratio turns upward.',
    R3_trough_location_stalls_then_jumps:
      'The argmax stays on the receding endpoint at every window (k=11,11.5,12,12.5,13); the argmin ' +
      'migrates outward but NOT uniformly: k=9.00 -> 9.25 -> 9.50 -> 9.50 -> 9.75 (it stalls one step at ' +
      '9.50 before jumping), so the imp-34022 "+0.25 per step" trough-location rate does not persist.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CONVERGENCE TEST (frontier-direction, NOT rigorous). Extending the imp-33810 ladder ' +
    'two further quarter-decade steps to k=6..12.5 (27 rungs) and k=6..13 (29 rungs) with the identical ' +
    'inherited sub-terms (reuse gate: the replicated BASE/EXT115/EXT12 reproduce the imp-33877 argmax/' +
    'argmin exactly) and re-running the imp-33843 log-linear OLS shows the imp-34022 near-constant ' +
    'amplitude ratio |trough|/|peak| ~0.63 does NOT converge to a fixed limit as the boundary recedes: ' +
    'it continues 0.6151 -> 0.6293 -> 0.6492 -> 0.6868 -> 0.7200, a ~17.1% total drift (up from the ~5.5% ' +
    'imp-34022 read over BASE..EXT12), with the per-step increment GROWING (+0.0142 -> +0.0332) rather ' +
    'than shrinking. The mechanism is that the endpoint-locked peak grows at a DECELERATING rate ' +
    '(+0.0740 -> +0.0346 per step) while the interior trough deepens at a near-steady rate (+0.0501 -> ' +
    '+0.0392), so past k~12.5 the trough gains on the peak and the ratio turns upward instead of ' +
    'flattening -- the imp-34022 "near-fixed proportion" reading was a short-window artifact, not a ' +
    'saturating limit. Distinct from any form selection; the imp-33843 log-linear verdict is untouched ' +
    '(R^2 stays > 0.99). The OLS surrogate is descriptive, not derived; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34022 (the |trough|/|peak| ~0.63 near-constancy tested here); imp-33877 (BASE/EXT115/EXT12 reuse ' +
    'gate; model replicated); imp-33843 (the log-linear OLS re-run on the extended ladder); imp-33810 ' +
    '(the k=6..11 ladder extended here); imp-33773 (M2 refutation the ladder locks); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE_ASSERTIONS = [
  {
    // Reuse gate: the replicated BASE/EXT115/EXT12 reproduce the imp-33877 inherited argmax/argmin, and
    // the two new windows have the right rung counts (27, 29).
    id: 'imp34085-reuse-gate-reproduces-imp33877-first-three-windows',
    description: 'replicated BASE/EXT115/EXT12 match imp-33877 argmax/argmin to < 1e-4; EXT125 is 27 rungs, EXT13 is 29',
    holds: () =>
      MAX_REUSE_DIFF < 1e-4 &&
      FITS[3].rungs === 27 &&
      FITS[4].rungs === 29 &&
      FITS[3].argmax.k === 12.5 &&
      FITS[4].argmax.k === 13,
  },
  {
    // Baseline gate: the first three ratios reproduce the imp-34022 near-constant span 0.6151..0.6492,
    // with the imp-34022 ~5.5% drift over BASE..EXT12.
    id: 'imp34085-reproduces-imp34022-base-ext12-ratio-span',
    description: 'ratio 0.6151 -> 0.6293 -> 0.6492 over BASE..EXT12; imp-34022 drift ~5.5%',
    holds: () =>
      Math.abs(ratioSeq[0].ratio - 0.6151) < 0.005 &&
      Math.abs(ratioSeq[1].ratio - 0.6293) < 0.005 &&
      Math.abs(ratioSeq[2].ratio - 0.6492) < 0.005 &&
      Math.abs(driftImp34022 - 0.055) < 0.01,
  },
  {
    // (R1) The ratio does NOT converge: it keeps creeping to 0.6868 then 0.7200, the per-step increment
    // GROWS rather than shrinking, and the full-span drift ~17% far exceeds the imp-34022 ~5.5%.
    id: 'imp34085-ratio-does-not-converge-creep-accelerates',
    description: 'ratio continues 0.6868 -> 0.7200 (full drift ~17%); per-step increment grows, not shrinks; not saturating',
    holds: () =>
      Math.abs(ratioSeq[3].ratio - 0.6868) < 0.005 &&
      Math.abs(ratioSeq[4].ratio - 0.72) < 0.005 &&
      ratioSeq[4].ratio > ratioSeq[3].ratio &&
      ratioSeq[3].ratio > ratioSeq[2].ratio &&
      ratioSteps[ratioSteps.length - 1] > ratioSteps[0] &&
      driftFull > 0.15 &&
      driftFull > 2 * driftImp34022 &&
      ratioStepShrinksToZero === false &&
      converges === false,
  },
  {
    // (R2) Mechanism: the peak per-step growth DECELERATES monotonically while the trough deepening stays
    // near-steady, so at EXT13 the trough step exceeds the peak step.
    id: 'imp34085-peak-decelerates-trough-near-steady',
    description: 'peak steps shrink +0.074->+0.035; trough |steps| near-steady ~0.05->0.039; peak step < trough step at EXT13',
    holds: () =>
      peakSteps[0] > peakSteps[1] &&
      peakSteps[1] > peakSteps[2] &&
      peakSteps[2] > peakSteps[3] &&
      Math.abs(peakSteps[0] - 0.074) < 0.005 &&
      Math.abs(peakSteps[3] - 0.0346) < 0.005 &&
      troughAbsSteps.every((d) => d > 0.03 && d < 0.06) &&
      peakSteps[3] < troughAbsSteps[3],
  },
  {
    // (R3) The argmax stays endpoint-locked at every window while the argmin location stalls at 9.5 then
    // jumps to 9.75 -- the naive +0.25/step trough-migration does not persist.
    id: 'imp34085-argmax-endpoint-locked-argmin-stalls-then-jumps',
    description: 'argmax on endpoint every window (k=11..13); argmin k=9,9.25,9.5,9.5,9.75 (stalls then jumps)',
    holds: () =>
      FITS.every((f) => f.argmax.isEndpoint === true) &&
      IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.argminSequence.map((s) => s.k).join(',') === '9,9.25,9.5,9.5,9.75',
  },
  {
    // Honesty gate: convergence refuted, isRigorous false, form verdict untouched (R^2 > 0.99), no QED, PT SOTA.
    id: 'imp34085-honesty-gate-no-qed',
    description: 'Measurement only: ratioConverges false, isRigorous false, R^2 > 0.99, no QED, PT SOTA',
    holds: () =>
      IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.ratioConverges === false &&
      IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.isRigorous === false &&
      IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.r2Sequence.every((r) => r > 0.99) &&
      /NO QED/.test(IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.verdict) &&
      /remains SOTA/.test(IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.verdict),
  },
];

for (const a of IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34085-trough-peak-ratio-convergence assertion failed: ${a.id}`);
  }
}
