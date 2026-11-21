/**
 * @module imp-34886-eflow-strength-knee-inflection-crossing
 *
 * imp-34886 (numerical, frontier-direction): imp-34837 measured that under E_flow reinstatement the
 * SECOND-order sigmoid D2 INFLECTION shifts UP by +9.03e-3 dex, while imp-34858 measured that the
 * THIRD-order sigma-KNEE shifts DOWN by -7.32e-3 dex, from their common no-E_flow separation ~+1.27e-2
 * dex (knee ABOVE inflection, imp-34820). Because the two landmarks move in OPPOSITE directions as
 * E_flow is reinstated, the knee-above-inflection gap must SHRINK, cross zero, and flip sign somewhere
 * between the E_flow strengths s=0 (dropped) and s=1 (carried) -- imp-34837 already showed the endpoint
 * gap FLIPS to -3.61e-3 dex at s=1. This module SOLVES for the crossing strength s* where the two
 * logistic landmarks COINCIDE, X*_knee(s*) = X*_infl(s*), and reports whether s* lands in the physical
 * [0,1] range and the sensitivity dGap/ds.
 *
 * THE SETUP (E_flow is an EXACT additive log-odds shift, reused VERBATIM from imp-34749/34837/34858)
 * ------------------------------------------------------------------------------------------------
 * The full model sigma_full = E_coll/(E_trunc + E_flow + E_coll) has log-odds u_full(x) = u_0(x) + phi(x)
 * EXACTLY, where u_0(x) = ln A + 0.5 ln L - x/2 is the imp-34846/34710 no-E_flow log-odds (A = C_C/E_trunc,
 * L = log T0, x = ln N) and phi(x) = -ln(1 + E_flow/E_trunc) is the imp-34749 E_flow perturbation. Scaling
 * phi by a strength s in [0,1] (s=0 dropped, s=1 carried) interpolates the E_flow reinstatement continuously.
 * The two landmarks are read off the SAME imp-34820/34846 closed-form kernels evaluated on u_full = u_0 + s*phi:
 *   - the D2 INFLECTION locator (imp-34820/34837):  (1-2S) u_full_prime^2 + u_full_secondDeriv = 0
 *   - the D3 sigma-KNEE locator  (imp-34710/34749/34858): S v^3 (2S-1) + 3 S v v_prime + v_secondDeriv = 0,
 *     v = -u_full_prime  (the imp-34749 F=0 knee condition, root-identical to imp-34846 g_thirdDeriv=0).
 *
 * THE SOLVE (h = 1e-2, the imp-34820/34846 step; central-difference u-derivatives; identical bracketing)
 * -----------------------------------------------------------------------------------------------------
 *   (A) THE TWO ENDPOINTS REPRODUCE imp-34837/34858 VERBATIM. At s=0 the knee sits at log10 N* ~ 9.53638
 *       and the inflection at ~9.52364, a +1.27e-2 dex knee-above-inflection gap (imp-34820); at s=1 the
 *       knee drops to ~9.52906 (-7.32e-3, imp-34858) and the inflection rises to ~9.53267 (+9.03e-3,
 *       imp-34837), FLIPPING the gap to ~-3.61e-3 dex (imp-34837 KNEE_MINUS_INFL_FULL). Gap(s) = X*_knee(s)
 *       - X*_infl(s) is therefore POSITIVE at s=0 and NEGATIVE at s=1 -- an interior sign change.
 *   (B) THE CROSSING STRENGTH s* IS SOLVED BY BISECTION ON Gap(s)=0 OVER s in [0,1]. Because both landmark
 *       shifts are first-order-captured to ~100% (imp-34837 ~101%, imp-34858 ~100.3%, deep linear regime
 *       E_flow/E_trunc ~ 1.8e-3), Gap(s) is very nearly linear, so s* ~ Gap(0)/(Gap(0)-Gap(1)) ~ +1.27e-2/
 *       (1.27e-2 + 3.61e-3) ~ 0.78; the exact bisected root lands at s* ~ 0.78, WELL INSIDE the physical
 *       [0,1] range. So there IS an E_flow strength at which the sigma-knee and the D2 inflection coincide.
 *   (C) THE SENSITIVITY dGap/ds ~ -1.65e-2 dex PER UNIT STRENGTH. The gap collapses at the sum of the two
 *       opposite-signed landmark slopes: dX*_knee/ds|_0 ~ -7.34e-3 (imp-34858) minus dX*_infl/ds|_0 ~
 *       +9.15e-3 (imp-34837) = ~-1.65e-2 dex per unit s; the crossing is a clean transversal (nonzero slope),
 *       and s* ~ Gap(0)/|dGap/ds| ~ +1.27e-2/1.65e-2 ~ 0.77 corroborates the bisected root.
 *
 * THE FINDING (measurement / derivation only; answers imp-34886)
 * --------------------------------------------------------------
 *   (F1) THE CROSSING STRENGTH s* LIES IN THE PHYSICAL [0,1] RANGE, s* ~ 0.78. Solving X*_knee(s*) =
 *        X*_infl(s*) by bisection on Gap(s) over s in [0,1] (Gap(0) ~ +1.27e-2 > 0, Gap(1) ~ -3.61e-3 < 0)
 *        gives s* ~ 0.78 -- there IS a partial E_flow reinstatement strength at which the sigma-KNEE and
 *        the D2 sigmoid-inflection COINCIDE, and it sits comfortably inside [0,1] (not at an endpoint, not
 *        extrapolated). The common landmark location there is log10 N* ~ 9.531 (between the two endpoints).
 *   (F2) THE CROSSING IS TRANSVERSAL, dGap/ds ~ -1.65e-2 dex/unit. The gap collapses at the sum of the
 *        imp-34858 knee slope (-7.34e-3) and the imp-34837 inflection slope (+9.15e-3, entering with a
 *        minus sign in Gap = knee - infl), a nonzero -1.65e-2 dex per unit strength, so the two landmarks
 *        cross cleanly (single simple root) rather than touching tangentially; s* ~ Gap(0)/|dGap/ds| ~ 0.77
 *        matches the bisected root to within the mild first-order curvature.
 *   (F3) THE ENDPOINTS REPRODUCE imp-34837/34858. Gap(0) ~ +1.27e-2 dex (imp-34820 knee-above-inflection)
 *        and Gap(1) ~ -3.61e-3 dex (imp-34837 flipped gap) are recovered VERBATIM from the reused kernels,
 *        so s* is the interpolation of the two published-endpoint measurements, not a re-derivation of them.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34837-sigmoid-inflection-d2-eflow-reinstatement (the D2 inflection +9.03e-3 UP shift and the flipped -3.61e-3 endpoint gap reused here)
 * @see imp-34858-sigma-knee-d3-eflow-reinstatement (the D3 knee -7.32e-3 DOWN shift and -7.34e-3 first-order slope reused here)
 * @see imp-34846-sigma-knee-third-order-closed-form-locator (the closed-form D3 knee kernel)
 * @see imp-34820-sigmoid-inflection-d2-closed-form-locator (the closed-form D2 inflection kernel and the +1.27e-2 no-E_flow gap)
 * @see imp-34749-sigma-knee-eflow-corrected-closed-form (the exact additive log-odds shift phi = -ln(1+E_flow/E_trunc))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34749/imp-34837/imp-34858 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc at ln N = x (the small ratio ~1.8e-3 at the landmarks that phi packages). Prefactor is the
// imp-398 pinned C_F = (log(T0/2pi)+1)/2pi, identical sub-terms to imp-34749/34837/34858.
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
// No-E_flow log-odds u_0 = ln(E_coll/E_trunc) = ln A + 0.5 ln L - x/2 (imp-34820/34846/34710 uOf).
function u0(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
// E_flow perturbation of the log-odds, scaled by strength s (s=1 carried, s=0 dropped). phi = -ln(1 + s ratio).
function phi(x, s) {
  return -Math.log(1 + s * eflowRatio(x));
}
// Corrected log-odds u_full = u_0 + phi. sigma_full = logistic(u_full) EXACTLY at s=1.
function uFull(x, s) {
  return u0(x) + phi(x, s);
}
function sigmaOf(x, s) {
  return 1 / (1 + Math.exp(-uFull(x, s)));
}

// central-difference stencils on the log-odds (imp-34820/34846 step h = 1e-2)
const H_ID = 1e-2;
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}

// SECOND-order sigmoid-INFLECTION kernel (imp-34820/34837 closed-form D2 locator) on u_full:
// (1-2S) u_full_prime^2 + u_full_secondDeriv. Root = D2 inflection.
function d2Cond(x, s, h) {
  const S = sigmaOf(x, s);
  const up = d1((z) => uFull(z, s), x, h);
  const upp = d2((z) => uFull(z, s), x, h);
  return (1 - 2 * S) * up * up + upp;
}
// THIRD-order sigma-KNEE condition (imp-34749/34710/34858 route) on u_full, root-identical to the imp-34846
// closed-form g_thirdDeriv=0 knee: F = S v^3 (2S-1) + 3 S v v_prime + v_secondDeriv, v = -u_full_prime.
function fKnee(x, s, h) {
  const S = sigmaOf(x, s);
  const v = -d1((z) => uFull(z, s), x, h);
  const vp = -d2((z) => uFull(z, s), x, h);
  const vpp = -d3((z) => uFull(z, s), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

// robust sign-change bisection on a bracket known to contain a single root
function bisect(f, a, b) {
  let fa = f(a);
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return 0.5 * (a + b);
}

const LN10 = Math.LN10;
const LO = Math.log(1e9);
const HI = Math.log(1e11);

// the two landmark locators as functions of the E_flow strength s (ln-N units)
function kneeAt(s) {
  return bisect((x) => fKnee(x, s, H_ID), LO, HI);
}
function inflAt(s) {
  return bisect((x) => d2Cond(x, s, H_ID), LO, HI);
}
// signed knee-minus-inflection gap in dex (positive => knee above inflection, imp-34820 ordering)
function gapAt(s) {
  return (kneeAt(s) - inflAt(s)) / LN10;
}

// ---- (A) the two endpoints reproduce imp-34837/34858/34820 verbatim ----------------------------------------
const KNEE_S0 = kneeAt(0);
const INFL_S0 = inflAt(0);
const KNEE_S1 = kneeAt(1);
const INFL_S1 = inflAt(1);
const LOG10_KNEE_S0 = KNEE_S0 / LN10; // ~9.53638 (imp-34846/34820 no-E_flow knee)
const LOG10_INFL_S0 = INFL_S0 / LN10; // ~9.52364 (imp-34820 no-E_flow inflection)
const LOG10_KNEE_S1 = KNEE_S1 / LN10; // ~9.52906 (imp-34858 E_flow-carried knee)
const LOG10_INFL_S1 = INFL_S1 / LN10; // ~9.53267 (imp-34837 E_flow-carried inflection)
const GAP_S0 = gapAt(0); // ~+1.27e-2 dex (knee above; imp-34820)
const GAP_S1 = gapAt(1); // ~-3.61e-3 dex (knee below; imp-34837 flipped gap)

// ---- (B) SOLVE for the crossing strength s* where X*_knee(s*) = X*_infl(s*), i.e. gapAt(s*)=0 --------------
const S_STAR = bisect((s) => gapAt(s), 0, 1); // ~0.78, well inside [0,1]
const S_STAR_IN_RANGE = S_STAR > 0 && S_STAR < 1; // true: the crossing is physical
const LOG10_N_AT_CROSSING = 0.5 * (kneeAt(S_STAR) + inflAt(S_STAR)) / LN10; // common location ~9.531
const GAP_AT_STAR = gapAt(S_STAR); // ~0 (residual < a few 1e-6 dex)

// ---- (C) sensitivity dGap/ds and the linear corroboration of s* -------------------------------------------
const S_EPS = 0.02;
const DGAP_DS = (gapAt(S_STAR + S_EPS) - gapAt(S_STAR - S_EPS)) / (2 * S_EPS); // ~-1.65e-2 dex per unit s
// the two opposite-signed landmark slopes whose difference gives dGap/ds (imp-34837/34858 first-order slopes)
const DKNEE_DS0 = (kneeAt(S_EPS) - kneeAt(-S_EPS)) / (2 * S_EPS) / LN10; // ~-7.34e-3 dex/unit (imp-34858)
const DINFL_DS0 = (inflAt(S_EPS) - inflAt(-S_EPS)) / (2 * S_EPS) / LN10; // ~+9.15e-3 dex/unit (imp-34837)
const S_STAR_LINEAR = GAP_S0 / (GAP_S0 - GAP_S1); // ~0.78 (linear corroboration of the bisected root)

// published-endpoint literals reused VERBATIM for the reproduction check
const IMP34858_KNEE_SHIFT_LOG10 = -7.32e-3; // imp-34858 knee shift (DOWN)
const IMP34837_INFL_SHIFT_LOG10 = +9.03e-3; // imp-34837 inflection shift (UP)
const IMP34837_GAP_FULL_LOG10 = -3.61e-3; // imp-34837 KNEE_MINUS_INFL_FULL (flipped gap at s=1)
const IMP34820_GAP_NOFLOW_LOG10 = +1.27e-2; // imp-34820 no-E_flow knee-above-inflection gap

export const IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING = {
  id: 'imp-34886',
  proofSection: 'S-frontier',
  question:
    'imp-34837 found the D2 sigmoid-inflection shifts UP (+9.03e-3 dex) under E_flow reinstatement while ' +
    'imp-34858 found the D3 sigma-KNEE shifts DOWN (-7.32e-3 dex), from their common no-E_flow separation ' +
    '~+1.27e-2 dex (imp-34820), so the two logistic landmarks must CROSS as E_flow is reinstated. Locate the ' +
    'E_flow strength s* in [0,1] at which they COINCIDE, X*_knee(s*) = X*_infl(s*), using the exact additive ' +
    'log-odds shift phi = -ln(1+E_flow/E_trunc); report whether s* is physical and the sensitivity dGap/ds. ' +
    'Measurement/derivation on the inherited surrogate; C_mb GUE-conditional (imp-486); changes no bound; NO QED.',
  verdictShort:
    'YES the crossing is physical: s* ~ 0.78 lies WELL INSIDE [0,1]. Solving gapAt(s)=X*_knee(s)-X*_infl(s)=0 ' +
    'by bisection over s in [0,1] (Gap(0) ~ +1.27e-2, Gap(1) ~ -3.61e-3) gives s* ~ 0.78, common location ' +
    'log10 N* ~ 9.531. The crossing is transversal, dGap/ds ~ -1.65e-2 dex/unit (the sum of the imp-34858 ' +
    'knee slope -7.34e-3 and the imp-34837 inflection slope +9.15e-3), so s* ~ Gap(0)/|dGap/ds| ~ 0.77 corroborates.',
  measuredQuantity:
    'the E_flow strength s* in [0,1] at which the imp-34710/34749 D3 sigma-KNEE and the imp-34820 D2 ' +
    'sigmoid-inflection COINCIDE (X*_knee(s*) = X*_infl(s*)), solved by bisection on the signed gap Gap(s) = ' +
    'X*_knee(s) - X*_infl(s) with E_flow carried as the exact additive log-odds shift phi = ' +
    '-ln(1+E_flow/E_trunc) scaled by s, plus the crossing sensitivity dGap/ds',
  endpoints: {
    log10NstarKneeS0: +LOG10_KNEE_S0.toFixed(6), // ~9.53638 (imp-34846/34820 no-E_flow knee)
    log10NstarInflS0: +LOG10_INFL_S0.toFixed(6), // ~9.52364 (imp-34820 no-E_flow inflection)
    log10NstarKneeS1: +LOG10_KNEE_S1.toFixed(6), // ~9.52906 (imp-34858 E_flow-carried knee)
    log10NstarInflS1: +LOG10_INFL_S1.toFixed(6), // ~9.53267 (imp-34837 E_flow-carried inflection)
    gapS0Log10: +GAP_S0.toExponential(4), // ~+1.27e-2 (knee above; imp-34820)
    gapS1Log10: +GAP_S1.toExponential(4), // ~-3.61e-3 (knee below; imp-34837 flipped gap)
  },
  crossing: {
    sStar: +S_STAR.toFixed(4), // ~0.78 (crossing strength)
    sStarInPhysicalRange: S_STAR_IN_RANGE, // true: 0 < s* < 1
    log10NstarAtCrossing: +LOG10_N_AT_CROSSING.toFixed(6), // ~9.531 (common landmark location)
    gapResidualAtStar: +GAP_AT_STAR.toExponential(3), // ~0 (bisection residual, dex)
    sStarLinearCorroboration: +S_STAR_LINEAR.toFixed(4), // ~0.78 (Gap(0)/(Gap(0)-Gap(1)))
  },
  sensitivity: {
    dGap_ds: +DGAP_DS.toExponential(4), // ~-1.65e-2 dex per unit strength (transversal crossing)
    dKnee_ds0_log10: +DKNEE_DS0.toExponential(4), // ~-7.34e-3 (imp-34858 knee slope)
    dInfl_ds0_log10: +DINFL_DS0.toExponential(4), // ~+9.15e-3 (imp-34837 inflection slope)
  },
  vsPublishedEndpoints: {
    imp34858KneeShiftLog10: IMP34858_KNEE_SHIFT_LOG10, // -7.32e-3 (knee DOWN)
    imp34837InflShiftLog10: IMP34837_INFL_SHIFT_LOG10, // +9.03e-3 (inflection UP)
    imp34837GapFullLog10: IMP34837_GAP_FULL_LOG10, // -3.61e-3 (flipped gap at s=1)
    imp34820GapNoflowLog10: IMP34820_GAP_NOFLOW_LOG10, // +1.27e-2 (no-E_flow gap)
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_crossing_strength_is_physical:
      'Solving X*_knee(s*) = X*_infl(s*) by bisection on Gap(s) = X*_knee(s) - X*_infl(s) over s in [0,1] ' +
      '(Gap(0) ~ +1.27e-2 > 0, Gap(1) ~ -3.61e-3 < 0) gives s* ~ 0.78 -- there IS a partial E_flow ' +
      'reinstatement strength at which the sigma-KNEE and the D2 sigmoid-inflection COINCIDE, and it sits ' +
      'comfortably inside the physical [0,1] range (not an endpoint, not extrapolated). The common landmark ' +
      'location there is log10 N* ~ 9.531, between the two endpoint locations.',
    F2_crossing_is_transversal:
      'The gap collapses at dGap/ds ~ -1.65e-2 dex per unit strength -- the sum of the imp-34858 knee slope ' +
      '(-7.34e-3) and the imp-34837 inflection slope (+9.15e-3, entering Gap = knee - infl with a minus ' +
      'sign) -- a nonzero slope, so the two landmarks cross cleanly (single simple root) rather than touching ' +
      'tangentially. The linear estimate s* ~ Gap(0)/|dGap/ds| ~ 0.77 matches the bisected root to within the ' +
      'mild first-order curvature of the two deep-linear-regime shifts.',
    F3_endpoints_reproduce_imp34837_and_imp34858:
      'The endpoints Gap(0) ~ +1.27e-2 dex (imp-34820 knee-above-inflection) and Gap(1) ~ -3.61e-3 dex ' +
      '(imp-34837 flipped gap) are recovered VERBATIM from the reused imp-34820/34837/34858 kernels, so s* is ' +
      'the interpolation of the two published-endpoint measurements, not a re-derivation of them.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT + DERIVATION (frontier-direction, NOT rigorous). imp-34837 found the D2 sigmoid-inflection ' +
    'shifts UP (+9.03e-3 dex) under E_flow reinstatement while imp-34858 found the D3 sigma-KNEE shifts DOWN ' +
    '(-7.32e-3 dex), from a common no-E_flow separation of ~+1.27e-2 dex (imp-34820, knee above inflection), ' +
    'so the two logistic landmarks must cross. Carrying E_flow exactly as the imp-34749 additive log-odds ' +
    'shift phi = -ln(1 + E_flow/E_trunc) scaled by a strength s in [0,1] (u_full = u_0 + s*phi) and reading ' +
    'both landmarks off the reused imp-34820 D2 and imp-34710/34749/34858 D3 kernels: (A) the endpoints ' +
    'reproduce imp-34837/34858 verbatim -- Gap(0) = X*_knee(0) - X*_infl(0) ~ +1.27e-2 > 0 and Gap(1) ~ ' +
    '-3.61e-3 < 0, an interior sign change. (B) Bisection on Gap(s) = 0 over s in [0,1] locates the crossing ' +
    'strength s* ~ 0.78, WELL INSIDE the physical [0,1] range, at common location log10 N* ~ 9.531 -- there ' +
    'IS an E_flow strength at which the sigma-KNEE and the D2 inflection coincide. (C) The crossing is ' +
    'transversal, dGap/ds ~ -1.65e-2 dex per unit strength (the sum of the imp-34858 knee slope -7.34e-3 and ' +
    'the imp-34837 inflection slope +9.15e-3), so s* ~ Gap(0)/|dGap/ds| ~ 0.77 corroborates the bisected ' +
    'root. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  subGap:
    'ANSWERS imp-34886: the imp-34837 (inflection UP) and imp-34858 (knee DOWN) opposite-signed E_flow shifts ' +
    'cross at a PHYSICAL strength s* ~ 0.78 in [0,1], where X*_knee = X*_infl at log10 N* ~ 9.531, with a ' +
    'transversal sensitivity dGap/ds ~ -1.65e-2 dex/unit. What stays OPEN (deferred, changes no bound): a ' +
    'root-free closed form for s*(that would express the crossing strength directly from the two landmark ' +
    'slopes and curvatures), and whether the mild first-order-capture curvature (imp-34837 ~101%, imp-34858 ' +
    '~100.3%) shifts s* measurably away from the linear ~0.77 estimate at larger E_flow/E_trunc ratios lower ' +
    'on the ramp.',
  citation:
    'imp-34837 (the D2 inflection +9.03e-3 UP shift and the flipped -3.61e-3 endpoint gap reused here); ' +
    'imp-34858 (the D3 knee -7.32e-3 DOWN shift and the -7.34e-3 first-order slope reused here); imp-34846 ' +
    '(the closed-form D3 knee kernel); imp-34820 (the closed-form D2 inflection kernel and the +1.27e-2 ' +
    'no-E_flow gap); imp-34749 (the exact additive log-odds shift phi = -ln(1+E_flow/E_trunc)); imp-3463 ' +
    '(far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING_ASSERTIONS = [
  {
    // (F3): the s=0 endpoints reproduce the imp-34820 no-E_flow landmarks and the +1.27e-2 knee-above gap.
    id: 'imp34886-endpoints-reproduce-imp34820-s0-gap',
    description: 's=0 knee ~9.53638, inflection ~9.52364, gap ~+1.27e-2 dex (imp-34820, knee above)',
    holds: () =>
      Math.abs(LOG10_KNEE_S0 - 9.53638) < 1e-3 &&
      Math.abs(LOG10_INFL_S0 - 9.52364) < 1e-3 &&
      Math.abs(GAP_S0 - IMP34820_GAP_NOFLOW_LOG10) < 1e-3 &&
      GAP_S0 > 0,
  },
  {
    // (F3): the s=1 endpoints reproduce the imp-34858 knee, imp-34837 inflection, and the flipped gap.
    id: 'imp34886-endpoints-reproduce-s1-flipped-gap',
    description: 's=1 knee ~9.52906, inflection ~9.53267, gap ~-3.61e-3 dex (imp-34837 flipped)',
    holds: () =>
      Math.abs(LOG10_KNEE_S1 - 9.52906) < 1e-3 &&
      Math.abs(LOG10_INFL_S1 - 9.53267) < 1e-3 &&
      Math.abs(GAP_S1 - IMP34837_GAP_FULL_LOG10) < 1.5e-3 &&
      GAP_S1 < 0,
  },
  {
    // (F1): the crossing strength s* lands well inside the physical [0,1] range (~0.78).
    id: 'imp34886-crossing-strength-is-physical',
    description: 'the crossing s* ~ 0.78 lies strictly inside [0,1]',
    holds: () => S_STAR_IN_RANGE && S_STAR > 0.6 && S_STAR < 0.95,
  },
  {
    // (F1): at s* the two landmarks actually coincide -- the bisected gap residual is negligible.
    id: 'imp34886-landmarks-coincide-at-star',
    description: 'gap residual at s* is < 1e-4 dex (X*_knee(s*) = X*_infl(s*))',
    holds: () => Math.abs(GAP_AT_STAR) < 1e-4,
  },
  {
    // (F2): the crossing is transversal (nonzero, negative) and the linear estimate corroborates the root.
    id: 'imp34886-transversal-crossing-and-linear-corroboration',
    description: 'dGap/ds ~ -1.65e-2 dex/unit (< 0) and s* matches Gap(0)/(Gap(0)-Gap(1)) to ~5%',
    holds: () =>
      DGAP_DS < -1e-2 &&
      DGAP_DS > -2.5e-2 &&
      Math.abs(S_STAR - S_STAR_LINEAR) < 0.05,
  },
  {
    // (F2): dGap/ds equals the sum of the opposite-signed imp-34858 knee and imp-34837 inflection slopes.
    id: 'imp34886-dgap-is-sum-of-landmark-slopes',
    description: 'dGap/ds ~ dKnee/ds - dInfl/ds (knee slope < 0, inflection slope > 0)',
    holds: () =>
      DKNEE_DS0 < 0 &&
      DINFL_DS0 > 0 &&
      Math.abs(DGAP_DS - (DKNEE_DS0 - DINFL_DS0)) < 2e-3,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34886-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING.isRigorous === false &&
      IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING.farTailExponent === 0.5 &&
      typeof IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING.subGap === 'string' &&
      /NO QED/.test(IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING.verdict),
  },
];

for (const a of IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34886-eflow-strength-knee-inflection-crossing assertion failed: ${a.id}`);
  }
}
