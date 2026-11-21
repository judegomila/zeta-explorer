/**
 * @module imp-34308-trough-peak-perstep-slope-extended-to-pole
 *
 * imp-34308 (numerical, frontier-direction): imp-34234 refined the imp-34153 trough-overtakes-peak per-step
 * crossover to a TENTH-decade (0.1) receding-endpoint grid over kEnd = 11.00..13.00, located the crossover to
 * the single window-step (12.30 -> 12.40), and fit the post-crossover trough-gains-on-peak per-step gap
 * (troughStep - peakStep) as roughly LINEAR with OLS slope ~ +0.00329 per kEnd-midpoint (R^2 ~ 0.978) -- but
 * only over the seven window-steps with midpoints 12.35..12.95 (i.e. only through kEnd = 13.0). It never
 * measured whether that linear "trough gains on peak" slope STAYS CONSTANT, ACCELERATES, or BENDS as the grid
 * is pushed up the computable tail toward the imp-34023/imp-34237 resid_exp surrogate pole k* ~ 21.281.
 *
 * This module extends the IDENTICAL tenth-decade receding-endpoint grid (the exact inherited imp-3220/imp-3406
 * effectiveHeightForN / C_C_PINNED "parts" component sub-terms verbatim, the same ladder rung 0.1, the same
 * imp-33843 log-linear OLS argmax-peak / argmin-trough per-step machinery) from kEnd = 11.00 all the way up to
 * kEnd = 21.00 (101 endpoints, 100 window-steps) -- as far up the tail as the surrogate ratio stays finite and
 * positive, since resid_exp crosses zero (the pole) only at k* ~ 21.281 (resid_exp(21.00) ~ +8.7e-8 > 0,
 * resid_exp(21.30) ~ -4.9e-9 < 0). It re-fits the post-crossover per-step gap over the extended tail and over
 * decade blocks to measure whether the imp-34234 +0.00329/kEnd linear slope persists.
 *
 * THE MEASUREMENT (imp-34234 model reused verbatim; grid ceiling raised 13.0 -> 21.0)
 * ----------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), inherited imp-3220/imp-3406 sub-terms
 *                    EXACTLY as imp-34234/imp-34153 (E_trunc = 3.06e-5 strip, E_coll = C_C_PINNED sqrt(log T0 / N),
 *                    E_flow = C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN(N)).
 *   Ladder / fit     eflow_over_resid over k = 6.00 .. kEnd (0.10 rungs), rounded toExponential(4) exactly as
 *                    imp-34234; y = ln(eflow_over_resid); OLS y = a + b k; peak = argmax residual, trough = argmin.
 *   Grid ceiling     kEnd = 11.00, 11.10, ..., 21.00 (101 endpoints, 100 window-steps) -- imp-34234 stopped at 13.0.
 *   Per-step / gap   peakStep_i = peak(kEnd_i) - peak(kEnd_{i-1}); troughStep_i = |trough_i| - |trough_{i-1}|;
 *                    gap_i = troughStep_i - peakStep_i (the amount the trough gains on the peak per tenth-decade).
 *   Slope contest    OLS gap vs kEnd-midpoint over (a) the imp-34234 window 12.35..12.95, (b) the whole
 *                    endpoint-locked post-crossover band, and (c) successive decade blocks up to the pole.
 *
 * THE FINDING (measurement only -- the imp-34234 linear slope does NOT stay constant; it bends then breaks)
 * ---------------------------------------------------------------------------------------------------------
 *   (R1) THE imp-34234 WINDOW SLOPE IS REPRODUCED BIT-FOR-BIT. Re-fitting the gap over the identical seven
 *        window-steps (midpoints 12.35..12.95) reproduces the imp-34234 slope +0.00329/kEnd (R^2 ~ 0.978) to
 *        the fifth decimal, confirming the extended grid reuses the exact same component/ladder model.
 *   (R2) THE SLOPE DOES NOT STAY CONSTANT -- IT DECELERATES INSIDE THE ENDPOINT-LOCKED BAND. Extending the fit
 *        over the FULL endpoint-locked post-crossover band (midpoints 12.35..15.25, 30 steps, argmax still
 *        pinned on the receding endpoint) drops the OLS slope to ~ +0.00149/kEnd (R^2 ~ 0.888): the gap growth
 *        is concave, not linear -- it climbs 0.00018 -> a plateau ~ +0.0048 (peak at kEnd-mid ~ 15.15) and the
 *        per-decade slope more than halves relative to the immediate post-crossover window. The +0.00329 slope
 *        is a LOCAL tangent at the boundary, not a persistent law.
 *   (R3) A STRUCTURAL BREAK AT kEnd ~ 15.4 REVERSES THE SIGN OF THE GAP. The receding-endpoint argmax stays
 *        pinned through kEnd = 15.3 but DE-PINS at kEnd = 15.4 (the approaching k* ~ 21.281 pole inflates the
 *        near-endpoint eflow_over_resid ratios so the argmax jumps off the receding endpoint). Past the de-pin
 *        the peak step mechanism inverts and the per-step gap flips from ~ +0.0048 to strongly NEGATIVE
 *        (~ -0.006): the trough falls BEHIND the peak again. So the "trough gains on peak" regime is a narrow
 *        transient band kEnd ~ 12.3..15.3, NOT a phenomenon that runs to the pole.
 *   (R4) TOWARD THE POLE THE GAP DIVERGES NEGATIVELY. As kEnd approaches k* ~ 21.281 the shrinking resid_exp
 *        blows up the endpoint eflow_over_resid, so the endpoint peak step explodes (peakStep 0.012 -> 0.068 ->
 *        0.221 across kEnd-mid 20.55..20.95) and the gap plunges to ~ -0.221. The decade-block slopes walk
 *        +0.00237 (12.35..14) -> -0.0066 (14..16) -> ~0 (16..18) -> -0.00095 (18..20) -> -0.221 (20..21):
 *        no constant, no clean acceleration -- a sign-reversing bend gated by the endpoint-argmax de-pin and
 *        then a pole-driven divergence.
 *
 * The punchline: the imp-34234 +0.00329/kEnd linear trough-gains-on-peak slope is NOT a persistent law. Pushed
 * past kEnd = 13 it BENDS -- the slope more than halves (to ~ +0.00149) already within the endpoint-locked
 * post-crossover band -- and then a structural break at kEnd ~ 15.4 (the receding-endpoint argmax de-pinning as
 * the k* ~ 21.281 pole is approached) REVERSES the gap sign, after which the gap diverges negatively toward the
 * pole. The linear regime is a local, transient feature of the immediate post-crossover neighbourhood.
 *
 * MEASUREMENT / LOCATION ONLY. A grid-ceiling extension (13.0 -> 21.0) of the imp-34234 per-step gap
 * measurement on the inherited imp-33810 ladder, NOT an RH bound and distinct from any log-linear-vs-power-law
 * form selection (the imp-33843 log-linear verdict is untouched). The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive, not derived;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34234-trough-peak-perstep-crossover-tenth-decade (the tenth-decade grid extended here to the pole)
 * @see imp-34153-trough-peak-perstep-crossover-locate (the quarter-decade bracket)
 * @see imp-34237 (the resid_exp surrogate pole k* ~ 21.281 approached here)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run on the extended grid)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE } from './imp-34234-trough-peak-perstep-crossover-tenth-decade.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631, exactly as imp-34234)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation, verbatim from imp-34234).
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

// Tenth-decade ladder rung (verbatim from imp-34234), eflow_over_resid rounded toExponential(4) BEFORE the log.
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
    const residExp = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual (surrogate resid_exp)
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    R.push({ k: kk, residExp, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}

// Fit the imp-33843 log-linear surrogate; return argmax (peak) / argmin (trough), verbatim from imp-34234.
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

// Surrogate resid_exp stays positive up to the pole; locate the last positive rung and the sign flip.
const RESID_SCAN = buildLadder(21.5).map((r) => ({ k: r.k, residExp: r.residExp }));
const lastPositiveResidK = RESID_SCAN.filter((r) => r.residExp > 0).slice(-1)[0].k; // ~21.2, resid still > 0
const firstNegativeResidK = RESID_SCAN.filter((r) => r.residExp < 0)[0].k; // ~21.3, resid flipped (past pole)

// EXTENDED receding-endpoint grid: kEnd = 11.00, 11.10, ..., 21.00 (imp-34234 stopped at 13.0). 21.00 is the
// last endpoint whose entire k=6..kEnd ladder has resid_exp > 0 (the pole k* ~ 21.281 lies past 21.0).
const KEND_MAX = 21.0;
const KENDS = [];
for (let ke = 11; ke <= KEND_MAX + 1e-9; ke += 0.1) KENDS.push(+ke.toFixed(2));
const FITS = KENDS.map((ke) => fitLadder(buildLadder(ke)));

const peakSeq = FITS.map((f) => f.argmax.resid);
const troughSeq = FITS.map((f) => f.argmin.resid);
const endpointLocked = FITS.map((f) => f.argmax.isEndpoint);

// Per-tenth-decade-step increments and the trough-gains-on-peak gap (verbatim from imp-34234).
const peakSteps = [];
const troughAbsSteps = [];
const stepMids = [];
const gapSeq = []; // troughStep - peakStep; positive = trough gaining on peak
for (let i = 1; i < FITS.length; i++) {
  const ps = +(peakSeq[i] - peakSeq[i - 1]).toFixed(5);
  const ts = +(Math.abs(troughSeq[i]) - Math.abs(troughSeq[i - 1])).toFixed(5);
  peakSteps.push(ps);
  troughAbsSteps.push(ts);
  stepMids.push(+((KENDS[i] + KENDS[i - 1]) / 2).toFixed(3));
  gapSeq.push(+(ts - ps).toFixed(5));
}

// OLS fit of the gap vs kEnd-midpoint over an inclusive midpoint window [loMid, hiMid].
function fitGap(loMid, hiMid) {
  const xs = [];
  const ys = [];
  for (let i = 0; i < stepMids.length; i++) {
    if (stepMids[i] >= loMid - 1e-9 && stepMids[i] <= hiMid + 1e-9) {
      xs.push(stepMids[i]);
      ys.push(gapSeq[i]);
    }
  }
  const f = ols(xs, ys);
  return { n: xs.length, slope: +f.b.toFixed(5), intercept: +f.a.toFixed(5), r2: +rSquared(xs, ys, f).toFixed(4) };
}

// (R1) reproduce the imp-34234 window slope (midpoints 12.35..12.95) bit-for-bit.
const reproWindowFit = fitGap(12.35, 12.95);
const SRC = IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE;
const reproducesImp34234Slope = Math.abs(reproWindowFit.slope - SRC.gapGrowthFitSlope) < 1e-4;

// (R3) locate the endpoint-argmax de-pin (the structural break) -- first kEnd whose argmax leaves the endpoint.
const dePinIdx = endpointLocked.findIndex((x) => !x);
const dePinKEnd = KENDS[dePinIdx]; // 15.4
const endpointLockedThroughKEnd = KENDS[dePinIdx - 1]; // 15.3

// (R2) full endpoint-locked post-crossover band: midpoints 12.35 .. (last endpoint-locked step midpoint).
const lastLockedStepMid = +((endpointLockedThroughKEnd + KENDS[dePinIdx - 2]) / 2).toFixed(3); // 15.25
const endpointLockedPostCrossoverFit = fitGap(12.35, lastLockedStepMid);

// (R2) gap peak within the endpoint-locked post-crossover band (concavity: it plateaus, not linear).
let gapPeakValue = -Infinity;
let gapPeakMid = null;
for (let i = 0; i < stepMids.length; i++) {
  if (endpointLocked[i + 1] && stepMids[i] >= 12.3 && gapSeq[i] > gapPeakValue) {
    gapPeakValue = gapSeq[i];
    gapPeakMid = stepMids[i];
  }
}

// (R3) sign reversal: the first fully de-pinned step (midpoint 15.45) and all subsequent steps have gap < 0.
const gapAtFirstDepinnedStep = gapSeq[stepMids.indexOf(+((dePinKEnd + KENDS[dePinIdx + 1]) / 2).toFixed(3))]; // mid 15.45
const gapSignReversesAfterDePin =
  gapAtFirstDepinnedStep < 0 &&
  stepMids.every((m, i) => m <= endpointLockedThroughKEnd + 1e-9 || gapSeq[i] < 0 || Math.abs(m - (endpointLockedThroughKEnd + 0.05)) < 1e-9);

// (R4) decade-block slope walk up to the pole and the near-pole divergence.
const decadeBlockFits = [
  { block: '12.35-14.0', ...fitGap(12.35, 14.0) },
  { block: '14.0-16.0', ...fitGap(14.0, 16.0) },
  { block: '16.0-18.0', ...fitGap(16.0, 18.0) },
  { block: '18.0-20.0', ...fitGap(18.0, 20.0) },
  { block: '20.0-21.0', ...fitGap(20.0, 21.0) },
];
const nearPoleGap = gapSeq[gapSeq.length - 1]; // midpoint 20.95, ~ -0.221
const nearPolePeakStep = peakSteps[peakSteps.length - 1]; // ~ 0.221 (endpoint eflow_over_resid blowing up)

export const IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE = {
  id: 'imp-34308',
  proofSection: 'S-frontier',
  question:
    'imp-34234 fit the post-crossover trough-gains-on-peak per-step gap (troughStep - peakStep) as roughly ' +
    'linear with OLS slope ~ +0.00329 per kEnd-midpoint (R^2 ~ 0.978), but only over midpoints 12.35..12.95 ' +
    '(through kEnd = 13.0). Extend the IDENTICAL tenth-decade receding-endpoint grid (same effectiveHeightForN/' +
    'C_C_PINNED sub-terms, same 0.1 ladder rung) up to kEnd = 21.00 toward the resid_exp surrogate pole ' +
    'k* ~ 21.281 and measure whether the +0.00329/kEnd linear slope stays constant, accelerates, or bends. ' +
    'Measurement/extension only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The imp-34234 log-linear OLS argmax-peak/argmin-trough per-step increments and the trough-gains-on-peak ' +
    'per-step gap (troughStep - peakStep) over the tenth-decade receding endpoints kEnd = 11.00..21.00, and ' +
    'OLS slopes of the gap vs kEnd-midpoint over the imp-34234 window, the full endpoint-locked post-crossover ' +
    'band, and successive decade blocks up to the pole',
  gridStepDecades: 0.1,
  ladderRungDecades: RUNG,
  kEndMax: KEND_MAX, // 21.0 -- the last endpoint whose whole ladder has resid_exp > 0 (pole k* ~ 21.281 lies past it)
  surrogatePoleKStar: 21.281, // imp-34237 resid_exp zero
  lastPositiveResidK, // ~21.2 -- last k rung with resid_exp > 0
  firstNegativeResidK, // ~21.3 -- first k rung past the pole (resid_exp < 0)
  kEnds: KENDS, // 11.00, 11.10, ..., 21.00 (101 endpoints)
  peakSequence: peakSeq,
  troughSequence: troughSeq,
  endpointLockedFlags: endpointLocked, // true while the argmax is pinned on the receding endpoint
  peakStepIncrements: peakSteps,
  troughAbsStepIncrements: troughAbsSteps,
  stepMidpoints: stepMids,
  gapSequence: gapSeq, // troughStep - peakStep per tenth-decade step
  // (R1) imp-34234 reproduction
  reproducedImp34234WindowSlope: reproWindowFit.slope, // ~ +0.00329
  reproducedImp34234WindowR2: reproWindowFit.r2, // ~0.978
  imp34234WindowSlope: SRC.gapGrowthFitSlope, // 0.00329
  reproducesImp34234Slope, // true -- extended grid reuses the exact same model
  // (R2) deceleration within the endpoint-locked band
  endpointLockedThroughKEnd, // 15.3 -- argmax pinned on the receding endpoint through here
  endpointLockedPostCrossoverFit, // slope ~ +0.00149, R^2 ~ 0.888 over 30 steps (12.35..15.25): concave, not linear
  gapPeakValue, // ~ +0.00478 -- the endpoint-locked-band gap plateau
  gapPeakMid, // ~ 15.15
  slopeMoreThanHalves: reproWindowFit.slope > endpointLockedPostCrossoverFit.slope * 1.5, // true
  // (R3) structural break: endpoint-argmax de-pin reverses the gap sign
  dePinKEnd, // 15.4 -- the receding-endpoint argmax de-pins here (pole inflates near-endpoint ratios)
  gapAtFirstDepinnedStep, // ~ -0.006 -- the gap flips negative past the de-pin
  gapSignReversesAfterDePin, // true -- trough falls behind the peak again for the whole tail past 15.3
  // (R4) decade-block slope walk and near-pole divergence
  decadeBlockFits,
  nearPoleGap, // ~ -0.221 at midpoint 20.95
  nearPolePeakStep, // ~ +0.221 -- endpoint eflow_over_resid blowing up as resid_exp -> 0
  finding: {
    R1_imp34234_window_slope_reproduced:
      'Re-fitting the gap over the identical seven window-steps (midpoints 12.35..12.95) reproduces the ' +
      'imp-34234 slope +0.00329/kEnd (R^2 ~ 0.978) to the fifth decimal, confirming the extended grid reuses ' +
      'the exact same inherited component/ladder model.',
    R2_slope_decelerates_not_constant:
      'Extending the fit over the full endpoint-locked post-crossover band (midpoints 12.35..15.25, 30 steps, ' +
      'argmax still endpoint-pinned) drops the OLS slope to ~ +0.00149/kEnd (R^2 ~ 0.888): the gap growth is ' +
      'concave, climbing to a plateau ~ +0.0048 (peak at kEnd-mid ~ 15.15). The +0.00329 slope more than ' +
      'halves -- it is a local boundary tangent, not a persistent linear law.',
    R3_structural_break_reverses_sign_at_kend_15p4:
      'The receding-endpoint argmax stays pinned through kEnd = 15.3 but DE-PINS at kEnd = 15.4 (the ' +
      'approaching k* ~ 21.281 pole inflates the near-endpoint eflow_over_resid so the argmax jumps off the ' +
      'endpoint). Past the de-pin the per-step gap flips from ~ +0.0048 to strongly negative (~ -0.006): the ' +
      'trough falls BEHIND the peak again. The trough-gains-on-peak regime is a narrow transient band ' +
      'kEnd ~ 12.3..15.3, not a phenomenon that runs to the pole.',
    R4_gap_diverges_negatively_toward_pole:
      'As kEnd approaches k* ~ 21.281 the shrinking resid_exp blows up the endpoint eflow_over_resid, so the ' +
      'peak step explodes (0.012 -> 0.068 -> 0.221 across kEnd-mid 20.55..20.95) and the gap plunges to ' +
      '~ -0.221. The decade-block slopes walk +0.00237 (12.35..14) -> -0.0066 (14..16) -> ~0 (16..18) -> ' +
      '-0.00095 (18..20) -> -0.221 (20..21): no constant, no clean acceleration -- a sign-reversing bend ' +
      'gated by the endpoint-argmax de-pin, then a pole-driven divergence.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / EXTENSION (frontier-direction, NOT rigorous). Extending the imp-34234 tenth-decade ' +
    'receding-endpoint grid -- the IDENTICAL inherited effectiveHeightForN/C_C_PINNED component sub-terms ' +
    '(parts model verbatim), the same 0.1 ladder rung, the same imp-33843 log-linear argmax/argmin machinery ' +
    '-- from kEnd = 13.0 up to kEnd = 21.00 toward the imp-34237 resid_exp surrogate pole k* ~ 21.281 shows ' +
    'that the imp-34234 +0.00329/kEnd linear trough-gains-on-peak slope DOES NOT STAY CONSTANT: it BENDS. The ' +
    'window slope +0.00329 (R^2 ~ 0.978, reproduced bit-for-bit) more than HALVES to ~ +0.00149 (R^2 ~ 0.888) ' +
    'over the full endpoint-locked post-crossover band (midpoints 12.35..15.25) -- the gap growth is concave, ' +
    'plateauing at ~ +0.0048 (peak kEnd-mid ~ 15.15). A STRUCTURAL BREAK then occurs at kEnd ~ 15.4, where the ' +
    'receding-endpoint argmax DE-PINS (the approaching pole inflates the near-endpoint eflow_over_resid), and ' +
    'the per-step gap REVERSES SIGN to strongly negative (~ -0.006) -- the trough falls behind the peak again ' +
    'for the whole tail. Toward the pole the shrinking resid_exp blows up the endpoint step (peakStep -> 0.221) ' +
    'and the gap diverges to ~ -0.221 (decade-block slopes walk +0.00237 -> -0.0066 -> ~0 -> -0.00095 -> ' +
    '-0.221). So the +0.00329 linear slope is a LOCAL, transient feature of the immediate post-crossover ' +
    'neighbourhood, and the trough-gains-on-peak regime is confined to a narrow band kEnd ~ 12.3..15.3, not a ' +
    'law extending to the pole. A grid-ceiling extension of an inherited-surrogate diagnostic; the imp-33843 ' +
    'log-linear verdict is untouched. The OLS surrogate is descriptive, not derived; the component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34234 (the tenth-decade grid and +0.00329/kEnd window slope extended here); imp-34153 (the ' +
    'quarter-decade bracket); imp-34237 (the resid_exp surrogate pole k* ~ 21.281 approached here); imp-33843 ' +
    '(the log-linear OLS re-run on the extended grid); imp-33810 (the k=6..11 ladder); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE_ASSERTIONS = [
  {
    // Grid ceiling raised 13.0 -> 21.0: 101 tenth-decade endpoints, 100 window-steps, rung 0.1, top endpoint
    // still below the pole so its whole ladder has resid_exp > 0.
    id: 'imp34308-extended-grid-shape-below-pole',
    description: 'kEnd = 11.00..21.00 in 0.1 steps -> 101 endpoints, 100 window-steps; rung 0.1; pole k* ~ 21.281 lies past kEndMax',
    holds: () =>
      KENDS.length === 101 &&
      peakSteps.length === 100 &&
      gapSeq.length === 100 &&
      KENDS[0] === 11 &&
      KENDS[100] === 21 &&
      KEND_MAX < 21.281 &&
      firstNegativeResidK > 21.0 &&
      IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE.gridStepDecades === 0.1 &&
      IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE.ladderRungDecades === 0.1,
  },
  {
    // (R1) The imp-34234 window slope is reproduced bit-for-bit: same inherited model.
    id: 'imp34308-reproduces-imp34234-window-slope',
    description: 'gap fit over midpoints 12.35..12.95 reproduces imp-34234 slope +0.00329 (R^2 ~0.978)',
    holds: () =>
      reproWindowFit.n === 7 &&
      reproducesImp34234Slope === true &&
      Math.abs(reproWindowFit.slope - 0.00329) < 1e-4 &&
      Math.abs(reproWindowFit.r2 - 0.978) < 0.01,
  },
  {
    // (R2) The slope does NOT stay constant: it more than halves within the endpoint-locked post-crossover band.
    id: 'imp34308-slope-decelerates-within-locked-band',
    description: 'full endpoint-locked post-crossover fit (12.35..15.25) slope ~+0.00149 < half the +0.00329 window slope; gap plateaus ~+0.0048',
    holds: () =>
      endpointLockedThroughKEnd === 15.3 &&
      endpointLockedPostCrossoverFit.n === 30 &&
      endpointLockedPostCrossoverFit.slope > 0 &&
      endpointLockedPostCrossoverFit.slope < 0.5 * reproWindowFit.slope &&
      IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE.slopeMoreThanHalves === true &&
      Math.abs(endpointLockedPostCrossoverFit.slope - 0.00149) < 1e-4 &&
      Math.abs(gapPeakValue - 0.00478) < 1e-4 &&
      Math.abs(gapPeakMid - 15.15) < 1e-6,
  },
  {
    // (R3) Structural break: the receding-endpoint argmax de-pins at kEnd = 15.4 and the gap sign reverses.
    id: 'imp34308-structural-break-sign-reversal-at-15p4',
    description: 'argmax pinned through kEnd=15.3, de-pins at 15.4; gap flips negative past the de-pin (trough falls behind peak)',
    holds: () =>
      dePinKEnd === 15.4 &&
      endpointLocked.slice(0, dePinIdx).every((x) => x === true) &&
      gapAtFirstDepinnedStep < 0 &&
      gapSignReversesAfterDePin === true,
  },
  {
    // (R4) Toward the pole the gap diverges negatively and the decade-block slopes walk (no constant, no clean accel).
    id: 'imp34308-gap-diverges-negatively-toward-pole',
    description: 'near-pole gap ~ -0.221, peakStep ~ +0.221; decade-block slopes walk +0.00237 -> -0.0066 -> ~0 -> -0.00095 -> -0.221',
    holds: () =>
      nearPoleGap < -0.2 &&
      nearPolePeakStep > 0.2 &&
      decadeBlockFits.length === 5 &&
      decadeBlockFits[0].slope > 0 &&
      decadeBlockFits[1].slope < 0 &&
      decadeBlockFits[4].slope < -0.1,
  },
  {
    // Honesty gate: measurement only -- isRigorous false, log-linear form verdict untouched, no QED, no refereed bound is changed,
    // imp-3066 K_a >= 0 untouched, C_mb GUE-conditional per imp-486 untouched.
    id: 'imp34308-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, C_mb GUE-conditional untouched',
    holds: () =>
      IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE.isRigorous === false &&
      /NO QED/.test(IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE.verdict) &&
      /refereed bound is changed/i.test(IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE.verdict),
  },
];

for (const a of IMP34308_TROUGH_PEAK_PERSTEP_SLOPE_EXTENDED_TO_POLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34308-trough-peak-perstep-slope-extended-to-pole assertion failed: ${a.id}`);
  }
}
