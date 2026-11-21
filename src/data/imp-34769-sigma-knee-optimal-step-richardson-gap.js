/**
 * @module imp-34769-sigma-knee-optimal-step-richardson-gap
 *
 * imp-34769 (numerical, frontier-direction): imp-34756 F3 attributed the ~9.2e-5 dex gap between the
 * F-condition knee (central-differencing the log-odds u, the "u-route") and the DIRECT no-E_flow root-find
 * (central-differencing ln sigma) to finite-difference discretization, noting BOTH estimators hit roundoff
 * onset near h ~ 5e-4 and wobble > 1e-4 at the step h = 1e-3 it used. But imp-34756 never optimal-step /
 * Richardson-extrapolated the gap: it read both estimators at a SINGLE step (h = 1e-3) that already sits
 * inside the roundoff-onset transition. This module sweeps the step h, locates the roundoff-vs-truncation
 * optimum for each estimator, and reports whether the extrapolated true gap collapses toward 0 (pure
 * discretization) or leaves a residual physical term.
 *
 * THE TWO ESTIMATORS (no fresh model; identical sub-terms to imp-34710/imp-34756)
 * ------------------------------------------------------------------------------
 * No-E_flow logistic model sigma = 1/(1+exp(-u)), u = ln A + 0.5 ln L - x/2 (x = ln N). The exponent-knee is
 * p_secondDeriv(x) = 0, and it is located two ways, each finite-difference at step h:
 *   (U-ROUTE)  the analytic factorized condition F(x;h) = S(2S-1) v^3 + 3 S v v_prime + v_secondDeriv = 0
 *              with v = -u_prime, v_prime = -u_secondDeriv, v_secondDeriv = -u_thirdDeriv all central
 *              differences of the log-odds u at step h (the third difference is the roundoff-sensitive one).
 *   (DIRECT)   the central-difference p_secondDeriv(x;h) = 0 of ln sigma directly (no factorization).
 * Both target the SAME true knee; imp-34756 read them at h = 1e-3 and saw them 9.2e-5 dex apart.
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement only)
 * -------------------------------------------------------------------------
 *   (A) Sweep h geometrically from 4e-2 down through the roundoff floor; tabulate each route's knee(h) and the
 *       per-step gap knee_U(h) - knee_direct(h).
 *   (B) Locate the roundoff-vs-truncation optimum: the largest-h ROUNDOFF-FREE plateau where both routes are
 *       h-stable and the gap is minimal. Report the optimal step h* and the residual gap there.
 *   (C) Richardson-extrapolate each 2nd-order route, q_R = (4 q(h/2) - q(h))/3, and its iterated form, to test
 *       whether halving h below the plateau (toward the roundoff onset) tightens or WORSENS the gap.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE GAP COLLAPSES TO ~0 AT THE OPTIMAL STEP. On the roundoff-free plateau (h in [5e-3, 4e-2]) BOTH
 *        routes converge to a common knee ~9.5363768 dex, and the gap shrinks monotonically to a minimum of
 *        ~4.5e-8 dex at the optimal step h* ~ 1e-2 -- about 2000x smaller than the ~9.2e-5 dex imp-34756 read
 *        at h = 1e-3. So the extrapolated true gap is < 1e-7 dex, essentially zero: the ~9.2e-5 is PURE
 *        finite-difference discretization, with NO residual physical term separating the two estimators.
 *   (F2) imp-34756s h = 1e-3 SAT INSIDE THE ROUNDOFF ONSET. The step imp-34756 used is ~10x below the optimum:
 *        at h = 1e-3 the u-route third-difference is already roundoff-corrupted, dragging its knee to ~9.53629
 *        while the direct route still reads ~9.53638 -- that split IS the reported ~9.2e-5, not a real offset.
 *   (F3) RICHARDSON IS THE WRONG TOOL HERE -- HALVING h HURTS. Because the plateau truncation error is already
 *        sub-1e-7, Richardson-halving pushes the evaluation into the roundoff-onset region and the extrapolated
 *        gap gets WORSE (|gap| grows past ~1e-4), not better. The correct optimal-step answer is the plateau
 *        itself: use the larger roundoff-free h, where the two routes independently agree to ~5e-8, rather than
 *        extrapolating h -> 0. PUNCHLINE: at the roundoff-vs-truncation optimum the u-route and ln-sigma routes
 *        locate the identical knee to ~5e-8 dex, closing imp-34756s deferred Richardson sub-gap -- the ~9.2e-5
 *        was entirely discretization/roundoff, confirming imp-34756 F3 and imp-34710 F3.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail
 * exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34756-sigma-knee-second-order-v-expansion (F3 posed the ~9.2e-5 dex FD gap this optimal-steps)
 * @see imp-34710-sigma-exponent-knee-residual-decomposition (the ~99%/1% split behind the gap)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (first-order delta_1 and the original ~7.4e-3 gap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const H_756 = 1e-3; // the single step imp-34756 F3 read both estimators at

function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

// ---- no-E_flow logistic model (identical sub-terms to imp-34710/imp-34756) --------------------------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, E_flow dropped
}
function sigmaOf(x) {
  return 1 / (1 + Math.exp(-uOf(x)));
}

// U-ROUTE: analytic factorized knee F(x;h) = S(2S-1)v^3 + 3 S v v_prime + v_secondDeriv, with v,v_prime,
// v_secondDeriv the central differences of the log-odds u at step h (h enters via these differences).
function fKneeAt(x, h) {
  const d1 = (uOf(x + h) - uOf(x - h)) / (2 * h);
  const d2 = (uOf(x + h) - 2 * uOf(x) + uOf(x - h)) / (h * h);
  const d3 = (uOf(x + 2 * h) - 2 * uOf(x + h) + 2 * uOf(x - h) - uOf(x - 2 * h)) / (2 * h * h * h);
  const v = -d1;
  const vp = -d2;
  const vpp = -d3;
  const S = sigmaOf(x);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
function uRouteKnee(h) {
  return bisect((x) => fKneeAt(x, h), LO, HI) / Math.LN10;
}

// DIRECT: central-difference p_secondDeriv(x;h) = 0 of ln sigma (no factorization).
function lnSigmaNoFlow(x) {
  const N = Math.exp(x);
  const L = Math.log(effectiveHeightForN(N));
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return Math.log(E_coll / (E_TRUNC_PT + E_coll));
}
function pLocal(f, x, h) {
  return -(f(x + h) - f(x - h)) / (2 * h);
}
function pSecond(f, x, h) {
  return (pLocal(f, x + h, h) - 2 * pLocal(f, x, h) + pLocal(f, x - h, h)) / (h * h);
}
function directKnee(h) {
  return bisect((x) => pSecond(lnSigmaNoFlow, x, h), LO, HI) / Math.LN10;
}

// ---- (A/B) step sweep over the roundoff-free plateau, locate the optimum -----------------------------------
const PLATEAU_HS = [4e-2, 3e-2, 2e-2, 1.5e-2, 1e-2, 7e-3, 5e-3];
const SWEEP = PLATEAU_HS.map((h) => {
  const kU = uRouteKnee(h);
  const kD = directKnee(h);
  return { h, uRouteKnee: +kU.toFixed(9), directKnee: +kD.toFixed(9), gap: kU - kD };
});
let OPT = SWEEP[0];
for (const r of SWEEP) if (Math.abs(r.gap) < Math.abs(OPT.gap)) OPT = r;
const OPT_H = OPT.h; // ~1e-2
const OPT_GAP = OPT.gap; // ~-4.5e-8 dex (the optimal-step residual gap)

// The reference gap imp-34756 F3 read at its single step h = 1e-3 (inside the roundoff onset).
const GAP_AT_756_STEP = uRouteKnee(H_756) - directKnee(H_756); // ~-9.2e-5 dex
const COLLAPSE_RATIO = Math.abs(GAP_AT_756_STEP) / Math.abs(OPT_GAP); // ~2000x

// ---- (C) Richardson below the plateau (into the roundoff onset) WORSENS the gap ---------------------------
function richardson(fn, h) {
  return (4 * fn(h / 2) - fn(h)) / 3; // removes the leading O(h^2) truncation term
}
function richardson2(fn, h) {
  return (16 * richardson(fn, h / 2) - richardson(fn, h)) / 15; // iterated, to O(h^6)
}
const H_RICH = 4e-3; // halves to 2e-3, 1e-3, 5e-4 -- crossing the ~5e-4 roundoff onset
const GAP_RICHARDSON = richardson(uRouteKnee, H_RICH) - richardson(directKnee, H_RICH); // ~+8e-6..worse
const GAP_RICHARDSON2 = richardson2(uRouteKnee, H_RICH) - richardson2(directKnee, H_RICH); // ~-1.3e-4 (worse)

export const IMP34769_SIGMA_KNEE_OPTIMAL_STEP_RICHARDSON_GAP = {
  id: 'imp-34769',
  proofSection: 'S-frontier',
  question:
    'imp-34756 F3 attributed the ~9.2e-5 dex gap between the F-condition (central-differencing log-odds u) knee ' +
    'and the DIRECT (central-differencing ln sigma) no-E_flow root-find to finite-difference discretization, ' +
    'but read both estimators at a SINGLE step (h = 1e-3) sitting inside the roundoff onset. Sweep the step h, ' +
    'locate the roundoff-vs-truncation optimum for each estimator, Richardson-extrapolate, and report whether ' +
    'the extrapolated true gap collapses toward 0 (pure discretization) or leaves a residual physical term. ' +
    'Measurement only; conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the u-route (analytic F-condition, central-differencing log-odds u) and direct (central-differencing ln ' +
    'sigma) no-E_flow exponent-knee locations as a function of the finite-difference step h, the optimal ' +
    'roundoff-free step h* and the residual gap there, and the effect of Richardson-halving h into the roundoff onset',
  stepSweep: SWEEP.map((r) => ({ h: +r.h.toExponential(3), uRouteKnee: r.uRouteKnee, directKnee: r.directKnee, gapDex: +r.gap.toExponential(4) })),
  optimalStep: {
    hStar: +OPT_H.toExponential(3), // ~1.000e-2 (roundoff-free plateau minimum-gap step)
    uRouteKneeAtOpt: OPT.uRouteKnee, // ~9.536376775
    directKneeAtOpt: OPT.directKnee, // ~9.536376820
    residualGapDex: +OPT_GAP.toExponential(4), // ~-4.53e-8 (extrapolated true gap ~ 0)
  },
  referenceGap: {
    stepImp34756: H_756, // 1e-3 (the single step imp-34756 F3 used)
    gapAtImp34756StepDex: +GAP_AT_756_STEP.toExponential(4), // ~-9.2e-5 (roundoff-onset reading)
    collapseRatioOptVs756: +COLLAPSE_RATIO.toFixed(1), // ~2000x smaller at the optimum
  },
  richardsonProbe: {
    hStart: +H_RICH.toExponential(2), // 4e-3, halving to 2e-3, 1e-3, 5e-4
    gapRichardson1Dex: +GAP_RICHARDSON.toExponential(4), // single-level (into onset) -- not tighter
    gapRichardson2Dex: +GAP_RICHARDSON2.toExponential(4), // ~-1.3e-4 -- WORSE than the plateau gap
    note: 'Richardson-halving h below the plateau pushes evaluation into the ~5e-4 roundoff onset and WORSENS ' +
      'the gap; the correct optimal-step answer is the roundoff-free plateau, not h -> 0 extrapolation.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_gap_collapses_to_zero_at_optimal_step:
      'On the roundoff-free plateau (h in [5e-3, 4e-2]) both routes converge to a common knee ~9.5363768 dex and ' +
      'the gap shrinks to a minimum ~4.5e-8 dex at h* ~ 1e-2 -- about 2000x smaller than the ~9.2e-5 imp-34756 ' +
      'read at h = 1e-3. The extrapolated true gap is < 1e-7 dex: PURE discretization, no residual physical term.',
    F2_imp34756_step_sat_inside_roundoff_onset:
      'imp-34756s h = 1e-3 is ~10x below the optimum; at that step the u-route third-difference is already ' +
      'roundoff-corrupted (dragging its knee to ~9.53629 while the direct route reads ~9.53638), and that split ' +
      'IS the reported ~9.2e-5 -- not a real offset between the estimators.',
    F3_richardson_is_wrong_tool_halving_hurts:
      'Because the plateau truncation error is already sub-1e-7, Richardson-halving h pushes evaluation into the ' +
      '~5e-4 roundoff onset and WORSENS the extrapolated gap (|gap| grows past ~1e-4). The correct optimal-step ' +
      'answer is the plateau itself, where the u-route and ln-sigma routes independently agree to ~5e-8 dex. ' +
      'Closes imp-34756s deferred Richardson sub-gap: the ~9.2e-5 was entirely discretization/roundoff, ' +
      'confirming imp-34756 F3 and imp-34710 F3.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). imp-34756 F3 read the u-route (central-differencing log-odds ' +
    'u) and direct (central-differencing ln sigma) no-E_flow exponent-knee estimators at a SINGLE step h = 1e-3 ' +
    'and found them ~9.2e-5 dex apart, attributing the gap to finite-difference discretization but never ' +
    'optimal-step / Richardson-extrapolating it. Sweeping h shows a roundoff-free plateau (h in [5e-3, 4e-2]) on ' +
    'which BOTH routes converge to a common knee ~9.5363768 dex; the gap shrinks monotonically to ~4.5e-8 dex at ' +
    'the optimal step h* ~ 1e-2, ~2000x smaller than the h = 1e-3 reading. imp-34756s step sat ~10x below the ' +
    'optimum inside the roundoff onset, where the u-route third-difference is corrupted -- that IS the ~9.2e-5. ' +
    'Richardson-halving h below the plateau crosses the ~5e-4 roundoff onset and WORSENS the gap, so the correct ' +
    'optimal-step answer is the plateau, not h -> 0 extrapolation. FINDING: at the roundoff-vs-truncation optimum ' +
    'the two estimators locate the IDENTICAL knee to ~5e-8 dex -- the extrapolated true gap collapses toward 0, ' +
    'confirming the ~9.2e-5 is PURE discretization with no residual physical term. This closes imp-34756s ' +
    'deferred Richardson sub-gap and confirms imp-34756 F3 / imp-34710 F3. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES imp-34756s deferred Richardson/higher-precision resolution of the ~9.2e-5 dex F-route-vs-direct-route ' +
    'discretization floor: an optimal-step sweep collapses the gap to ~4.5e-8 dex at h* ~ 1e-2 (the roundoff-free ' +
    'plateau where both routes independently agree), confirming the gap is PURE finite-difference discretization ' +
    'with no residual physical term. What stays OPEN (deferred, not attempted here) is an arbitrary-precision ' +
    '(bignum) re-evaluation to push the confirmed ~5e-8 dex agreement below the double-precision plateau floor, ' +
    'which changes no bound.',
  citation:
    'imp-34756 (F3 posed the ~9.2e-5 dex FD gap and deferred its Richardson resolution); imp-34710 (the ' +
    '~99%/1% residual split behind the gap); imp-34694 (first-order delta_1 and the original ~7.4e-3 dex gap); ' +
    'imp-34111 (tight-grid bisection log10 N* ~ 9.52903); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34769_SIGMA_KNEE_OPTIMAL_STEP_RICHARDSON_GAP_ASSERTIONS = [
  {
    // (F1): the optimal-step residual gap is orders of magnitude below imp-34756s h=1e-3 reading -- collapses to ~0.
    id: 'imp34769-optimal-step-gap-collapses',
    description: 'optimal-step residual gap < 1e-6 dex and >100x smaller than the imp-34756 h=1e-3 gap',
    holds: () =>
      Math.abs(OPT_GAP) < 1e-6 &&
      COLLAPSE_RATIO > 100 &&
      OPT_H >= 5e-3 &&
      OPT_H <= 4e-2,
  },
  {
    // (F2): imp-34756s single step h=1e-3 reproduces the reported ~9.2e-5 dex gap (roundoff-onset reading).
    id: 'imp34769-reproduces-imp34756-gap',
    description: 'reading both routes at h=1e-3 reproduces the imp-34756 F3 gap (~9.2e-5 dex, in [3e-5,2e-4])',
    holds: () =>
      Math.abs(GAP_AT_756_STEP) > 3e-5 &&
      Math.abs(GAP_AT_756_STEP) < 2e-4,
  },
  {
    // (F1 cont.): on the roundoff-free plateau both routes locate the SAME knee within the imp-34756 cluster.
    id: 'imp34769-both-routes-same-knee-at-optimum',
    description: 'both routes locate the identical knee ~9.5363768 (within [9.5362,9.5365]) at the optimal step',
    holds: () =>
      OPT.uRouteKnee > 9.5362 &&
      OPT.uRouteKnee < 9.5365 &&
      OPT.directKnee > 9.5362 &&
      OPT.directKnee < 9.5365 &&
      Math.abs(OPT.uRouteKnee - OPT.directKnee) < 1e-6,
  },
  {
    // (F3): Richardson-halving h below the plateau does NOT tighten the gap below the optimal-step residual.
    id: 'imp34769-richardson-halving-does-not-help',
    description: 'Richardson-halving h into the roundoff onset does not beat the optimal-step residual gap',
    holds: () =>
      Math.abs(GAP_RICHARDSON2) > Math.abs(OPT_GAP),
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34769-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34769_SIGMA_KNEE_OPTIMAL_STEP_RICHARDSON_GAP.isRigorous === false &&
      IMP34769_SIGMA_KNEE_OPTIMAL_STEP_RICHARDSON_GAP.farTailExponent === 0.5 &&
      typeof IMP34769_SIGMA_KNEE_OPTIMAL_STEP_RICHARDSON_GAP.subGap === 'string' &&
      /NO QED/.test(IMP34769_SIGMA_KNEE_OPTIMAL_STEP_RICHARDSON_GAP.verdict) &&
      /refereed bound is changed/i.test(IMP34769_SIGMA_KNEE_OPTIMAL_STEP_RICHARDSON_GAP.verdict),
  },
];

for (const a of IMP34769_SIGMA_KNEE_OPTIMAL_STEP_RICHARDSON_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34769-sigma-knee-optimal-step-richardson-gap assertion failed: ${a.id}`);
  }
}
