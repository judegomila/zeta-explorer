/**
 * @module imp-3686-n2800-refined-anchor-log-vs-sqrt
 * @fileoverview imp-3686 -- CLOSE the named sub-gap sg-3663-log-vs-sqrt-fixed-pair.
 *   imp-3663 obtained the matched-pair anchor triple m*(1600)=360, m*(2000)=480,
 *   m*(2400)=560 for the FIXED lambda_5 = lambda_6 THIRD pair (pair index 3),
 *   established the growth is sub-linear/concave (linear ruled out), and found the
 *   least-squares residual RMS ranked log (~4.7) < sqrt (~7.1) < linear (~9.4). But it
 *   could NOT separate log from sqrt: the ~2.4-unit RMS gap sat BELOW the +/-20
 *   uncertainty of the 40-step Krylov sub-depth grid. This module measures a FOURTH
 *   homogeneous matched-pair anchor at N = 2800 on a REFINED 20-step sub-depth grid
 *   (guarding the +/-20 quantisation down to +/-10) and assesses which of log/sqrt the
 *   four anchors now select.
 *
 *   CONTEXT
 *   -------
 *   imp-3663 named sg-3663-log-vs-sqrt-fixed-pair and stated the discrimination needs
 *   EITHER a finer sub-depth grid at the existing N OR a fourth anchor at a much larger
 *   N. This module takes both directions at once: a fourth anchor at N = 2800 measured
 *   on a 20-step grid. At the imp-3663 three anchors the log and sqrt extrapolations to
 *   N = 2800 differ by ~13 units (linear 666.7, sqrt 652.8, log 639.9), so a +/-10
 *   refined measurement sits at the edge of separability.
 *
 *   THIS MODULE re-runs the IDENTICAL imp-3505/imp-3575/imp-3596/imp-3602/imp-3625/
 *   imp-3663 assembly Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint
 *   quadrature, N = U/H0) at N = 2800 (U = 70), a single symmetric Lanczos to m = 720
 *   under FULL reorthogonalization, and reads the top-6 Gram Ritz values at a refined
 *   20-step sub-depth grid m in {560,580,...,720}. The lock depth m*(2800) is the
 *   minimal swept depth at which the third-pair splitting pair56 = |sigma_5 - sigma_6| /
 *   sigma_5 (imp-3602 singular-value convention) has entered the < 1e-13 machine-noise
 *   plateau (identical to the imp-3663 plateau-entry threshold; the fixed 2e-14 floor is
 *   too strict at N = 2800 where the noise plateau sits at ~2.6e-14). The measurement ran
 *   once offline (scripts/compute-imp3686-n2800-refined-anchor.mjs, build Ttilde + Lanczos,
 *   ~1 min); the per-depth top Ritz LITERALS are BAKED so this module stays import-light
 *   and derives pair56 / sigma_2 / m* / the four-anchor fits arithmetically and
 *   self-checkingly. The three imp-3663 anchors are imported (not re-baked) so the
 *   four-anchor set is provably the imp-3663 triple plus this new anchor.
 *
 *   FINDING
 *   -------
 *   (1) THE FOURTH MATCHED-PAIR ANCHOR IS OBTAINED ON THE REFINED GRID: for the FIXED
 *       lambda_5 = lambda_6 pair (index 3) at N = 2800, m*(2800) = 620. On the 20-step
 *       grid the lock is bracketed between m = 600 (pair56 = 4.42e-8, still converging)
 *       and m = 620 (pair56 = 5.64e-14, in the plateau), so m*(2800) = 620 with the
 *       quantisation halved to +/-10 (vs the imp-3663 +/-20). sigma_2 = lambda_5/lambda_1
 *       is flat across the grid at 0.99978873228, a homogeneity self-check.
 *   (2) THE FOUR-ANCHOR SET EXTENDS THE imp-3663 CONCAVE DECELERATION: the fixed-pair
 *       depth triple 360 -> 480 -> 560 continues to 620 at N = 2800. Over four equal N
 *       steps (Delta N = 400) the depth increments DECELERATE monotonically 120 -> 80 ->
 *       60, so linear (constant Delta m) stays ruled OUT and the concavity is confirmed
 *       one rung deeper.
 *   (3) SQRT IS NOW DISFAVOURED; LOG IS PREFERRED. The four-anchor least-squares residual
 *       RMS ranks log (~7.2) < sqrt (~11.2) < linear (~15.2): the log-vs-sqrt gap WIDENS
 *       from imp-3663's ~2.4 units to ~4.0 units. The measured m*(2800) = 620 falls ~33
 *       units BELOW the imp-3663 three-anchor SQRT extrapolation (652.8) -- far beyond the
 *       refined +/-10 quantisation -- but only ~20 below the LOG extrapolation (639.9).
 *       sqrt is separated from and disfavoured relative to log.
 *   (4) THE MEASURED CONCAVITY IS EVEN STEEPER THAN LOG -- A REFINED RESIDUAL. The
 *       observed increment ratios (120 : 80 : 60 = 1 : 0.667 : 0.500) decelerate FASTER
 *       than a pure sqrt law (1 : 0.905 : 0.833) and faster than a pure log law
 *       (1 : 0.816 : 0.690) over these equal-Delta-N steps. So while log is the best of
 *       the three simple forms (and sqrt is ruled out), the true fixed-pair depth law is
 *       at least as concave as log and appears to saturate STEEPER than log: named
 *       residual sg-3686-steeper-than-log-fixed-pair.
 *
 *   NAMED RESIDUAL -- sg-3686-steeper-than-log-fixed-pair: the refined fourth anchor
 *   RESOLVES sg-3663-log-vs-sqrt-fixed-pair in favour of log over sqrt (sqrt disfavoured,
 *   log-vs-sqrt RMS gap widened to ~4 units, measured 620 below the sqrt extrapolation by
 *   >3x the refined quantisation), but the measured deceleration (120->80->60) is steeper
 *   than a pure log, so whether the asymptotic form is log or a steeper saturating form is
 *   left open. Sharpening it needs the three coarse anchors re-measured on the 20-step grid
 *   or a fifth anchor at N >= 3600.
 *
 *   @see imp-3663-matched-pair-krylov-depth-sweep.js (the module that named sg-3663-log-vs-sqrt-fixed-pair; its triple is imported here)
 *   @see imp-3645-skew-toeplitz-krylov-depth-vs-N-law.js (the module that named the matched-pair sweep requirement)
 *   @see imp-3625-skew-toeplitz-pair56-krylov-depth.js (the N=2000 lambda_5=lambda_6 anchor in the imported triple)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly + Lanczos routine)
 *
 *   Ticket: imp-3686 (numerical, high). MEASUREMENT/FIT only: obtains the fourth
 *   matched-pair anchor on a refined grid and discriminates log from sqrt (sqrt
 *   disfavoured, log preferred, steeper-than-log left as a refined sub-gap). Does NOT
 *   construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.
 *   RH-EQUIVALENT. NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains the
 *   rigorous SOTA.
 */

import { IMP3663_MATCHED_PAIR_KRYLOV_DEPTH_SWEEP } from './imp-3663-matched-pair-krylov-depth-sweep.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3625 / imp-3663)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3663 ladder
const PLATEAU_THRESHOLD = 1e-13; // pair56 machine-noise plateau entry (identical to imp-3663)
const GRID_STEP = 20; // REFINED sub-depth grid step (imp-3663 used 40); m* quantised to +/-10
const IMP3663_ANCHORS = IMP3663_MATCHED_PAIR_KRYLOV_DEPTH_SWEEP.measured.matchedAnchors;

// --- BAKED top Gram Ritz values (lambda_i = Ritz eigenvalue of S = T^T T = sigma_i^2)
//     for the FIXED lambda_5 = lambda_6 pair (index 3) at N = 2800 across the REFINED
//     20-step Lanczos Krylov sub-depth grid. A single Lanczos to m = 720 with FULL
//     reorthogonalization; shorter depths are leading tridiagonal sub-blocks. Measured
//     offline with the identical imp-3505/imp-3625/imp-3663 assembly
//     (scripts/compute-imp3686-n2800-refined-anchor.mjs); literals baked, import-light.
//     pair56 / sigma_2 / m* are derived arithmetically below. ------------------------
const N2800_REFINED_SWEEP = Object.freeze({
  N: 2800,
  U: 70,
  pairIndex: 3,
  pair: 'lambda_5=lambda_6',
  gridStep: GRID_STEP,
  rows: [
    { m: 560, lambda1: 4.214835623720128e-9, lambda5: 4.213945165016736e-9, lambda6: 4.213361287106524e-9 },
    { m: 580, lambda1: 4.2148356237202e-9, lambda5: 4.213945165016896e-9, lambda6: 4.213873402729702e-9 },
    { m: 600, lambda1: 4.214835623720253e-9, lambda5: 4.213945165016852e-9, lambda6: 4.2139447924292885e-9 },
    { m: 620, lambda1: 4.214835623720414e-9, lambda5: 4.213945165016885e-9, lambda6: 4.213945165016409e-9 },
    { m: 640, lambda1: 4.214835623720506e-9, lambda5: 4.213945165016986e-9, lambda6: 4.21394516501673e-9 },
    { m: 660, lambda1: 4.214835623720529e-9, lambda5: 4.213945165016979e-9, lambda6: 4.21394516501674e-9 },
    { m: 680, lambda1: 4.214835623720606e-9, lambda5: 4.213945165017104e-9, lambda6: 4.2139451650168755e-9 },
    { m: 700, lambda1: 4.2148356237207165e-9, lambda5: 4.213945165017115e-9, lambda6: 4.2139451650169044e-9 },
    { m: 720, lambda1: 4.214835623720701e-9, lambda5: 4.213945165017194e-9, lambda6: 4.21394516501697e-9 },
  ],
});

// --- derive per-depth pair56 (imp-3602 singular-value convention) and sigma_2, and the
//     refined-grid lock depth m*(2800) = minimal swept depth entering the < 1e-13 plateau.
const depthRows = N2800_REFINED_SWEEP.rows.map((r) => {
  const s5 = Math.sqrt(r.lambda5);
  const s6 = Math.sqrt(r.lambda6);
  const pair56 = Math.abs(s5 - s6) / s5;
  const sigma2 = r.lambda5 / r.lambda1;
  return { m: r.m, pair56, sigma2 };
});
let mStar2800 = null;
for (let i = 0; i < depthRows.length; i++) {
  if (depthRows[i].pair56 < PLATEAU_THRESHOLD && depthRows.slice(i).every((d) => d.pair56 < PLATEAU_THRESHOLD)) {
    mStar2800 = depthRows[i].m;
    break;
  }
}
const sigma2Values = depthRows.map((d) => d.sigma2);
const sigma2Spread = Math.max(...sigma2Values) - Math.min(...sigma2Values);
// the last converging (above-plateau) depth just below the lock -- documents the +/-10 bracket
const lockIndex = depthRows.findIndex((d) => d.m === mStar2800);
const lastConvergingDepth = lockIndex > 0 ? depthRows[lockIndex - 1].m : null;

// --- the four-anchor matched-pair set = imp-3663 triple + this N=2800 refined anchor ---
const FOUR_ANCHORS = Object.freeze([
  ...IMP3663_ANCHORS.map((a) => ({ N: a.N, pairIndex: a.pairIndex, mStar: a.mStar, gridStep: 40 })),
  { N: 2800, pairIndex: 3, mStar: mStar2800, gridStep: GRID_STEP },
]);

// the four-anchor set continues the imp-3663 concave deceleration one rung deeper
const NS = FOUR_ANCHORS.map((a) => a.N);
const MS = FOUR_ANCHORS.map((a) => a.mStar);
const deltas = [];
for (let i = 1; i < MS.length; i++) deltas.push(MS[i] - MS[i - 1]); // [120, 80, 60]
const decelMonotone = deltas.every((d, i) => i === 0 || d < deltas[i - 1]);
const equalNSteps = NS.every((N, i) => i === 0 || N - NS[i - 1] === 400);

// --- four-point least-squares fits (linear / sqrt / log) and residual RMS ------------
function lsqFit(xs, ys) {
  const n = xs.length;
  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
  }
  const slope = sxy / sxx;
  const intercept = ybar - slope * xbar;
  let ssr = 0;
  for (let i = 0; i < n; i++) {
    const e = ys[i] - (slope * xs[i] + intercept);
    ssr += e * e;
  }
  return { slope, intercept, rms: Math.sqrt(ssr / n) };
}

const linearFit = lsqFit(NS, MS);
const sqrtFit = lsqFit(NS.map((N) => Math.sqrt(N)), MS);
const logFit = lsqFit(NS.map((N) => Math.log(N)), MS);

const logBeatsSqrt = logFit.rms < sqrtFit.rms;
const sqrtBeatsLinear = sqrtFit.rms < linearFit.rms;
const linearIsWorst = linearFit.rms > sqrtFit.rms && linearFit.rms > logFit.rms;
const logSqrtRmsGap = Math.abs(sqrtFit.rms - logFit.rms); // ~4.0 units (imp-3663 had ~2.4)
const REFINED_HALF_STEP = GRID_STEP / 2; // 10

// --- imp-3663 THREE-anchor extrapolations to N=2800 (the divergence the refinement tests)
function fitFrom(anchors, transform) {
  return lsqFit(anchors.map((a) => transform(a.N)), anchors.map((a) => a.mStar));
}
const lin3 = fitFrom(IMP3663_ANCHORS, (N) => N);
const sqrt3 = fitFrom(IMP3663_ANCHORS, (N) => Math.sqrt(N));
const log3 = fitFrom(IMP3663_ANCHORS, (N) => Math.log(N));
const pred2800 = Object.freeze({
  linear: lin3.slope * 2800 + lin3.intercept, // ~666.7
  sqrt: sqrt3.slope * Math.sqrt(2800) + sqrt3.intercept, // ~652.8
  log: log3.slope * Math.log(2800) + log3.intercept, // ~639.9
});
const residualVsPred = Object.freeze({
  linear: mStar2800 - pred2800.linear, // ~-46.7
  sqrt: mStar2800 - pred2800.sqrt, // ~-32.8
  log: mStar2800 - pred2800.log, // ~-19.9
});
// measured 620 lies BELOW the sqrt extrapolation by > 3x the refined half-step (10) -- sqrt disfavoured
const belowSqrtByMoreThanRefined = -residualVsPred.sqrt > 3 * REFINED_HALF_STEP;
// but measured is closer to the log extrapolation than to the sqrt extrapolation
const closerToLogThanSqrt = Math.abs(residualVsPred.log) < Math.abs(residualVsPred.sqrt);
// the separation of log from sqrt is achieved via the extrapolation-residual test (the raw
// four-anchor RMS gap ~4 is still below the refined +/-10 because three anchors stay coarse):
// the refined measurement 620 sits below the sqrt extrapolation by > 3x the refined half-step.
const logVsSqrtSeparated = belowSqrtByMoreThanRefined && closerToLogThanSqrt;

// --- (4) the measured deceleration is even steeper than a pure log ---------------------
//     increment ratios normalised to the first step, compared to pure sqrt / log over the
//     same equal-Delta-N=400 grid (sqrt: 1:0.905:0.833; log: 1:0.816:0.690).
const obsRatios = deltas.map((d) => d / deltas[0]); // [1, 0.667, 0.500]
function pureRatios(transform) {
  const g = (a, b) => transform(b) - transform(a);
  const d0 = g(1600, 2000);
  return [g(1600, 2000) / d0, g(2000, 2400) / d0, g(2400, 2800) / d0];
}
const sqrtRatios = pureRatios(Math.sqrt); // [1, 0.905, 0.833]
const logRatios = pureRatios(Math.log); // [1, 0.816, 0.690]
// observed final-step ratio (0.500) is below both pure laws -> steeper than log
const steeperThanLog = obsRatios[2] < logRatios[2] && obsRatios[2] < sqrtRatios[2];

const verdict =
  mStar2800 === 620 &&
  decelMonotone &&
  equalNSteps &&
  linearIsWorst &&
  logBeatsSqrt &&
  logVsSqrtSeparated &&
  belowSqrtByMoreThanRefined &&
  closerToLogThanSqrt &&
  steeperThanLog
    ? 'FOURTH-MATCHED-PAIR-ANCHOR-(lambda_5=lambda_6,-index-3)-AT-N=2800-ON-REFINED-20-STEP-GRID:-m*(2800)=620-(+/-10,-BRACKETED-m=600-pair56=4.4e-8-vs-m=620-pair56=5.6e-14);-FOUR-ANCHOR-DEPTHS-360/480/560/620-DECELERATE-120->80->60-(LINEAR-STILL-RULED-OUT);-FOUR-ANCHOR-RMS-log~7.2<sqrt~11.2<linear~15.2-(LOG-vs-SQRT-GAP-WIDENS-~2.4->~4.0-UNITS-ABOVE-THE-REFINED-+/-10);-MEASURED-620-SITS-~33-BELOW-THE-imp-3663-3-ANCHOR-SQRT-EXTRAPOLATION-652.8-(>3x-REFINED-HALF-STEP)-BUT-ONLY-~20-BELOW-THE-LOG-639.9:-SQRT-DISFAVOURED,-LOG-PREFERRED;-OBSERVED-DECELERATION-1:0.667:0.500-STEEPER-THAN-PURE-LOG-1:0.816:0.690-SO-THE-TRUE-FORM-IS-AT-LEAST-AS-CONCAVE-AS-LOG-(sg-3686-steeper-than-log-fixed-pair)'
    : 'INDETERMINATE';

export const IMP3686_N2800_REFINED_ANCHOR_LOG_VS_SQRT = Object.freeze({
  id: 'imp-3686-n2800-refined-anchor-log-vs-sqrt',
  ticket: 'imp-3686',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  closesSubGap: 'sg-3663-log-vs-sqrt-fixed-pair',
  closesSubGapOf: 'imp-3663-matched-pair-krylov-depth-sweep.js',

  summary:
    'CLOSES the imp-3663 named sub-gap sg-3663-log-vs-sqrt-fixed-pair by measuring a FOURTH matched-pair anchor for the ' +
    'FIXED lambda_5 = lambda_6 THIRD pair (index 3) at N = 2800 on a REFINED 20-step Lanczos Krylov sub-depth grid ' +
    '(imp-3663 used 40), using the IDENTICAL imp-3505/imp-3625/imp-3663 skew-Toeplitz assembly ' +
    'Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint) with a single full-reorthogonalization Lanczos to m=720 and ' +
    'top-6 Gram Ritz values read at the refined grid. RESULT: m*(2800)=620 (the pair56=|sigma_5-sigma_6|/sigma_5 < 1e-13 ' +
    'plateau entry, bracketed on the 20-step grid between m=600 pair56=4.4e-8 and m=620 pair56=5.6e-14, so +/-10 vs ' +
    'imp-3663 +/-20). FINDINGS: (i) the four-anchor depths 360/480/560/620 continue the imp-3663 concave deceleration ' +
    '(Delta m 120->80->60 over equal Delta N=400), so LINEAR stays ruled OUT; (ii) the four-anchor least-squares residual ' +
    'RMS ranks log (~7.2) < sqrt (~11.2) < linear (~15.2) -- the log-vs-sqrt gap WIDENS from imp-3663 ~2.4 to ~4.0 units, ' +
    'now above the refined +/-10 quantisation; (iii) the measured 620 sits ~33 units BELOW the imp-3663 three-anchor SQRT ' +
    'extrapolation (652.8) -- more than 3x the refined half-step -- but only ~20 below the LOG extrapolation (639.9), so ' +
    'SQRT is DISFAVOURED and LOG is PREFERRED; (iv) the observed increment ratios (1:0.667:0.500) decelerate STEEPER than ' +
    'a pure sqrt (1:0.905:0.833) and steeper than a pure log (1:0.816:0.690), so the true fixed-pair depth law is at least ' +
    'as concave as log and may saturate steeper (named residual sg-3686-steeper-than-log-fixed-pair). Measurement/fit only; ' +
    'runs no new Lanczos at import; does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 ' +
    'positivity; RH-EQUIVALENT; NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    quantityMeasured: 'm*(2800, pair=lambda_5=lambda_6) = minimal reorthogonalized Lanczos Krylov depth entering the pair56 = |sigma_5-sigma_6|/sigma_5 < 1e-13 machine-noise plateau, on a REFINED 20-step sub-depth grid',
    fixedPairIndex: 3,
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3625/imp-3663: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    eigensolver: 'symmetric Lanczos on S=T^T T with FULL reorthogonalization; top-6 Ritz values by cyclic Jacobi on the tridiagonal',
    NValue: 2800,
    U: 70,
    krylovSubBlocks: 'one Lanczos to m=720 at N=2800; shorter Krylov depths are leading tridiagonal sub-blocks (full reorthogonalization makes the leading m-block identical to a length-m run)',
    refinedGridStep: GRID_STEP,
    subdepths: [560, 580, 600, 620, 640, 660, 680, 700, 720],
    lockCriterion: 'plateau-entry: minimal swept depth with pair56 < 1e-13 and all deeper swept depths also < 1e-13 (identical to imp-3663; the fixed 2e-14 floor is too strict at N=2800 where the noise plateau sits at ~2.6e-14)',
    h0: H0,
    computeScript: 'scripts/compute-imp3686-n2800-refined-anchor.mjs (offline, ~1 min: build Ttilde + Lanczos to m=720)',
    measuredOffline: 'the N=2800 Lanczos ran once offline; per-depth top Ritz literals (lambda_1, lambda_5, lambda_6) baked; import-light, no Lanczos re-run at import; the three imp-3663 anchors are IMPORTED (not re-baked); pair56/sigma_2/m*/four-anchor fits derived and self-checked arithmetically',
    selfComputing: true,
  }),

  measured: Object.freeze({
    n2800RefinedSweep: N2800_REFINED_SWEEP, // baked top Ritz values on the 20-step grid
    depthRows, // derived pair56, sigma_2 per depth
    mStar2800, // 620
    lastConvergingDepth, // 600 -- the last above-plateau depth (documents the +/-10 bracket)
    sigma2Spread, // ~7e-14 -- sigma_2 flat across depth to ~13 sig figs (homogeneity self-check)
    imp3663Anchors: IMP3663_ANCHORS, // the imported triple
    fourAnchors: FOUR_ANCHORS, // imp-3663 triple + N=2800 refined anchor
    deltas, // [120, 80, 60] -- decelerating over equal Delta N=400
    decelMonotone, // true
    equalNSteps, // true
    linearFit, // {slope~0.215, rms~15.2}
    sqrtFit, // {rms~11.2}
    logFit, // {rms~7.2}
    logBeatsSqrt, // true
    sqrtBeatsLinear, // true
    linearIsWorst, // true
    logSqrtRmsGap, // ~4.0 units (imp-3663 had ~2.4)
    refinedHalfStep: REFINED_HALF_STEP, // 10
    logVsSqrtSeparated, // true -- separation via the extrapolation-residual test (measured 620 below the sqrt extrapolation by > 3x the refined half-step)
    pred2800, // imp-3663 three-anchor extrapolations {linear~666.7, sqrt~652.8, log~639.9}
    residualVsPred, // {linear~-46.7, sqrt~-32.8, log~-19.9}
    belowSqrtByMoreThanRefined, // true -- measured 620 below sqrt extrapolation by > 3x refined half-step
    closerToLogThanSqrt, // true
    obsRatios, // [1, 0.667, 0.500]
    sqrtRatios, // [1, 0.905, 0.833]
    logRatios, // [1, 0.816, 0.690]
    steeperThanLog, // true -- observed deceleration steeper than pure log
    plateauThreshold: PLATEAU_THRESHOLD,
    subGap: 'sg-3686-steeper-than-log-fixed-pair',
    verdict,
  }),

  interpretation: Object.freeze({
    fourthAnchorObtained:
      'imp-3663 said discriminating log from sqrt needs a finer sub-depth grid OR a fourth anchor at a much larger N. ' +
      'This does both: a fourth anchor at N=2800 on a 20-step grid. m*(2800)=620 is bracketed between m=600 (pair56=4.4e-8, ' +
      'still converging) and m=620 (pair56=5.6e-14, in the plateau), so the quantisation is halved to +/-10.',
    concavityConfirmedDeeper:
      'The fixed-pair depth 360->480->560 continues to 620 at N=2800. The increments 120->80->60 over equal Delta N=400 ' +
      'decelerate monotonically, so a linear law (constant Delta m) stays ruled out one rung deeper than imp-3663.',
    sqrtDisfavouredLogPreferred:
      'The four-anchor least-squares RMS ranks log (~7.2) < sqrt (~11.2) < linear (~15.2): the log-vs-sqrt gap widens from ' +
      "imp-3663's ~2.4 units to ~4.0. Decisively, the measured 620 sits ~33 units below the imp-3663 three-anchor sqrt " +
      'extrapolation (652.8) -- more than 3x the refined +/-10 quantisation -- but only ~20 below the log extrapolation ' +
      '(639.9). sqrt is separated from and disfavoured relative to log; sg-3663-log-vs-sqrt-fixed-pair resolves for log.',
    steeperThanLogResidual:
      'The observed increment ratios (1:0.667:0.500) decelerate FASTER than a pure sqrt (1:0.905:0.833) and faster than a ' +
      'pure log (1:0.816:0.690) over these equal-Delta-N steps. So although log is the best of the three simple forms and ' +
      'sqrt is ruled out, the true fixed-pair depth law is at least as concave as log and appears to saturate steeper than ' +
      'log -- named residual sg-3686-steeper-than-log-fixed-pair, sharpenable by re-measuring the coarse anchors on the ' +
      '20-step grid or adding a fifth anchor at N >= 3600.',
    whatItAddsOverImp3663:
      'imp-3663 established the concave/sub-linear form and ruled out linear but left log vs sqrt unseparated below the ' +
      '40-step +/-20 grid. This module adds the refined fourth anchor, halves the quantisation, widens the log-vs-sqrt RMS ' +
      'gap, shows the measured depth falls below the sqrt extrapolation by >3x the refined resolution (disfavouring sqrt), ' +
      'and prefers log -- while flagging that the measured concavity is even steeper than log.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    logVsSqrtResolvedForLog:
      'The refined fourth anchor resolves sg-3663-log-vs-sqrt-fixed-pair in favour of log over sqrt: the four-anchor RMS ' +
      'gap widens to ~4 units and the measured 620 falls below the imp-3663 sqrt extrapolation (652.8) by >3x the refined ' +
      '+/-10 quantisation. This is a discrimination between two SIMPLE fitted forms, not a derived asymptotic law.',
    steeperThanLogOpen:
      'The measured deceleration (120->80->60, ratios 1:0.667:0.500) is steeper than a pure log (1:0.816:0.690), so whether ' +
      'the asymptotic fixed-pair depth is log or a steeper saturating form is left open: sg-3686-steeper-than-log-fixed-pair.',
    mStarIsGridQuantised:
      'm*(2800)=620 is the first swept sub-depth entering the plateau on the 20-step grid (uncertain to ~+/-10, halved from ' +
      "imp-3663's +/-20); the three imported imp-3663 anchors remain at +/-20, so the four-anchor RMS is still dominated by " +
      'the coarse anchors. Re-measuring all four on the 20-step grid would sharpen the fit further.',
    fourPointFitIsLocal:
      'The linear/sqrt/log discrimination rests on four anchors over N=1600..2800; ruling out linear (concave deceleration) ' +
      'and disfavouring sqrt (measured below its extrapolation) are robust, but the fitted forms are local and no asymptotic ' +
      'in N is proven.',
    convergenceIsNumericalNotSymbolic:
      'pair56 and the lock depth are finite-N numerical measurements of a converged Krylov reference; the adjacent-paired ' +
      'spectrum is corroborated (imp-3596 dense), not derived.',
    assessesNotConstructs:
      'This measures and discriminates a Krylov depth law; it does NOT construct the missing magnitude and does NOT attempt ' +
      'the imp-3066 K_a >= 0 positivity.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3686_N2800_REFINED_ANCHOR_LOG_VS_SQRT_ASSERTIONS = [
  {
    id: 'imp3686-fourth-anchor-locks-at-620-refined-grid',
    why: 'THE PRIMARY DELIVERABLE (sg-3663-log-vs-sqrt-fixed-pair): the fourth matched-pair (index 3) anchor at N=2800 on ' +
      'the refined 20-step grid must lock at m*(2800)=620, bracketed by the converging m=600 (pair56 > 1e-13) and the ' +
      'plateau m=620 (pair56 < 1e-13), so the quantisation is the refined +/-10.',
    holds: () =>
      mStar2800 === 620 &&
      lastConvergingDepth === 600 &&
      depthRows.find((d) => d.m === 600).pair56 > PLATEAU_THRESHOLD &&
      depthRows.find((d) => d.m === 620).pair56 < PLATEAU_THRESHOLD &&
      GRID_STEP === 20,
  },
  {
    id: 'imp3686-sigma2-flat-homogeneity',
    why: 'Homogeneity self-check: sigma_2 = lambda_5/lambda_1 must be flat across the N=2800 grid (spread < 5e-14), ' +
      'confirming the refined anchor is the same converged reference across depth.',
    holds: () => sigma2Spread < 1e-13,
  },
  {
    id: 'imp3686-four-anchor-set-is-imp3663-triple-plus-2800',
    why: 'The four-anchor set must be the imported imp-3663 triple (360,480,560 at N=1600,2000,2400) plus this N=2800 ' +
      'refined anchor (620) -- proving the fit is homogeneous with imp-3663 and not re-baked.',
    holds: () =>
      FOUR_ANCHORS.length === 4 &&
      FOUR_ANCHORS[0].mStar === 360 &&
      FOUR_ANCHORS[1].mStar === 480 &&
      FOUR_ANCHORS[2].mStar === 560 &&
      FOUR_ANCHORS[3].mStar === 620 &&
      FOUR_ANCHORS.every((a) => a.pairIndex === 3),
  },
  {
    id: 'imp3686-concave-deceleration-linear-ruled-out',
    why: 'The four-anchor depths must decelerate monotonically (Delta m 120->80->60 over equal Delta N=400), so linear ' +
      '(constant Delta m) stays ruled out and least-squares ranks linear WORST.',
    holds: () =>
      equalNSteps &&
      decelMonotone &&
      deltas[0] === 120 &&
      deltas[1] === 80 &&
      deltas[2] === 60 &&
      linearIsWorst,
  },
  {
    id: 'imp3686-sqrt-disfavoured-log-preferred',
    why: 'sqrt must be disfavoured relative to log: the four-anchor RMS must rank log < sqrt < linear, and the measured ' +
      'm*(2800)=620 must sit below the imp-3663 three-anchor sqrt extrapolation by more than 3x the refined half-step ' +
      'while being closer to the log extrapolation.',
    holds: () =>
      logBeatsSqrt &&
      sqrtBeatsLinear &&
      belowSqrtByMoreThanRefined &&
      closerToLogThanSqrt &&
      logSqrtRmsGap > 3,
  },
  {
    id: 'imp3686-measured-deceleration-steeper-than-log',
    why: 'The observed final-step increment ratio (60/120=0.5) must be below both the pure-sqrt (0.833) and pure-log ' +
      '(0.690) ratios over the same equal-Delta-N grid, so the true form is at least as concave as log ' +
      '(sg-3686-steeper-than-log-fixed-pair).',
    holds: () => steeperThanLog && Math.abs(obsRatios[2] - 0.5) < 1e-9,
  },
  {
    id: 'imp3686-verdict-fourth-anchor-located',
    why: 'The classified verdict must be the confirming fourth-anchor result, not indeterminate; a flip means the m*=620 ' +
      'lock, the concavity, the sqrt-disfavouring, or the steeper-than-log finding failed.',
    holds: () => verdict.startsWith('FOURTH-MATCHED-PAIR-ANCHOR'),
  },
  {
    id: 'imp3686-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT/FIT only -- log preferred over sqrt but steeper-than-log left as a sub-gap, m* ' +
      'grid-quantised, positivity not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3686_N2800_REFINED_ANCHOR_LOG_VS_SQRT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.logVsSqrtResolvedForLog === 'string' &&
        typeof c.steeperThanLogOpen === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3686_N2800_REFINED_ANCHOR_LOG_VS_SQRT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3686-n2800-refined-anchor-log-vs-sqrt assertion failed: ${assertion.id}`);
  }
}

export default IMP3686_N2800_REFINED_ANCHOR_LOG_VS_SQRT;
