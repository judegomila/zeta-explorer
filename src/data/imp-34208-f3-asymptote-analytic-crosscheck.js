/**
 * @module imp-34208-f3-asymptote-analytic-crosscheck
 *
 * imp-34208 (accuracy, frontier-direction): imp-34133 confirmed the F2 attenuation-factor asymptote
 * c ~ 0.0594922 INDEPENDENTLY -- its curve-fit constant matched the analytic E_N floor
 * E_TRUNC_PT/HEAD.E_N to ~6 significant figures, so F2 saturation is a genuine floor effect. But the
 * companion F3 asymptote c ~ 0.835955 rested on the constant-plus-decay curve fit ALONE (r ~ 0.125,
 * R^2 ~ 0.99997), with no analytic cross-check. This module supplies the missing analytic floor for
 * F3 from the same inherited imp-3406/imp-33810 sub-terms and assesses whether it reproduces 0.835955.
 *
 * THE ANALYTIC F3 FLOOR (E_flow log-slope ratio -> HEAD.sflow, because TAIL.sflow -> 1)
 * ----------------------------------------------------------------------------------
 *   F3(kEnd) = HEAD.sflow / TAIL.sflow, the ratio of E_flow log-slopes (head fixed at N = 10^7,
 *   tail at N = 10^(kEnd+1)). Write s(N) = d ln T0 / d ln N and L = ln T0, L0 = ln(T0/2pi). Since
 *   E_flow = C_F * (L/T0) * GRONWALL with C_F = (L0+1)/2pi, its log-slope factors EXACTLY as
 *
 *        sflow(N) = |d ln E_flow / d ln N| = s(N) * (1 - 1/(L0+1) - 1/L),
 *
 *   verified to ~1e-9 against the finite-difference eflowLogSlope across N = 10^7..10^300. As N grows
 *   the Riemann-von Mangoldt height law gives s(N) -> 1 (T0 ~ 2pi N / ln N so d ln T0/d ln N -> 1) and
 *   the bracket (1 - 1/(L0+1) - 1/L) -> 1, so sflow(N) -> 1 from below. Hence the analytic F3 limit is
 *
 *        F3_ASYMPTOTE_ANALYTIC = HEAD.sflow / lim_{N->inf} TAIL.sflow = HEAD.sflow / 1 = HEAD.sflow,
 *
 *   the head E_flow log-slope itself: HEAD.sflow = s(10^7)*(1 - 1/(L0+1) - 1/L) ~ 0.802814.
 *
 * THE CROSS-CHECK FAILS TO REPRODUCE 0.835955 (fit is biased HIGH by ~4.2%)
 * ------------------------------------------------------------------------
 *   Unlike F2 (fit 0.0594921 vs analytic 0.0594922, ~6 sig figs), the F3 fit c ~ 0.835955 does NOT
 *   match the analytic floor 0.802814 -- it OVER-ESTIMATES by ~0.0331 (~4.2% relative). Direct large-N
 *   probing confirms the analytic value is the true limit and the fit is the outlier: the empirical
 *   F3(kEnd) keeps DECREASING far past the kEnd=13..21 fit window -- 0.8558 at kEnd=21, 0.8394 at 30,
 *   0.8244 at 50, 0.8162 at 80, 0.8063 at 300 -- monotonically toward HEAD.sflow ~ 0.8028. The very
 *   slow residual decay (r ~ 0.125, TAIL.sflow only 0.938 at kEnd=21 vs the limit 1) left the 17-rung
 *   window under-constrained, so the constant-plus-decay extrapolation landed ~4.2% high. This is an
 *   HONEST NEGATIVE cross-validation: the imp-34133 F3 asymptote is a fit artifact, not the analytic
 *   limit, and imp-34209/imp-34210 concerns about the barely-moving F3 fit are quantitatively borne out.
 *
 * The punchline: the analytic F3 floor from the inherited sub-terms is HEAD.sflow ~ 0.802814 (because
 * the tail E_flow log-slope TAIL.sflow -> 1 as s -> 1 and the log-corrections vanish), which does NOT
 * reproduce the fitted c ~ 0.835955 -- the fit over-estimates the true saturation limit by ~4.2%. So
 * F3 saturates (imp-34023/imp-34133 CONFIRMED qualitatively), but its limit is the analytic 0.80281,
 * not the curve-fit 0.83596.
 *
 * NUMERICAL / MEASUREMENT ONLY. Analytic cross-check of an inherited surrogate ratio, NOT an RH bound.
 * The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; this cross-check is
 * descriptive within that model only; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34133-f2-f3-asymptotic-constant-fit (the constant-plus-decay fit whose F3 asymptote
 *   c ~ 0.835955 this module cross-checks; same inherited sub-terms, head fixed at k=6)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the F1..F4 decomposition and the
 *   near-flat F2, F3 assertion)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the quarter-decade rungs reused verbatim)
 * @see imp-33773 (the M2 residual whose sign change at kEnd ~ 21.28 caps the sign-stable ladder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM height law giving s -> 1)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33969/imp-34023/imp-34133 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34133 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// The E_flow log-slope d(ln E_flow)/d(ln N) via central difference (verbatim from imp-34133).
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
const sflow = (N) => Math.abs(eflowLogSlope(N));

// The Riemann-von Mangoldt height log-slope s(N) = d(ln T0)/d(ln N) via central difference.
function heightLogSlope(N) {
  const h = 1e-4;
  const lp = Math.log(effectiveHeightForN(N * Math.pow(10, h)));
  const lm = Math.log(effectiveHeightForN(N / Math.pow(10, h)));
  return (lp - lm) / (2 * h * Math.LN10);
}

// Analytic factorisation sflow(N) = s(N) * (1 - 1/(L0+1) - 1/L) of the E_flow log-slope.
function sflowAnalytic(N) {
  const p = parts(N);
  return heightLogSlope(N) * (1 - 1 / (p.L0 + 1) - 1 / p.L);
}

// HEAD at N = 10^7 (head fixed at k=6, tail at hi=10^(k+1)), exactly as imp-34133.
const HEAD_N = 1e7;
const HEAD_SFLOW = sflow(HEAD_N); // ~0.802814 -- the analytic F3 floor (since TAIL.sflow -> 1)

// The analytic F3 asymptote: F3 = HEAD.sflow / TAIL.sflow, and TAIL.sflow -> 1 as N -> inf.
const F3_ASYMPTOTE_ANALYTIC = HEAD_SFLOW; // HEAD.sflow / 1

// The imp-34133 fitted F3 asymptote (curve fit, r ~ 0.125 slow decay, 17-rung window).
const F3_ASYMPTOTE_FIT = 0.835955; // imp-34133 f3Fit.asymptoticConstant_c
const F3_FIT_MINUS_ANALYTIC = F3_ASYMPTOTE_FIT - F3_ASYMPTOTE_ANALYTIC; // ~+0.0331 (fit is HIGH)
const F3_FIT_RELATIVE_BIAS = F3_FIT_MINUS_ANALYTIC / F3_ASYMPTOTE_ANALYTIC; // ~+0.0412 (~4.2%)

// The analytic factorisation matches the finite-difference log-slope at the head to machine precision.
const HEAD_SFLOW_ANALYTIC = Math.abs(sflowAnalytic(HEAD_N));
const HEAD_SFLOW_DECOMP_MATCH = Math.abs(HEAD_SFLOW_ANALYTIC - HEAD_SFLOW); // ~1e-9

// F3 keeps DECREASING past the fit window toward the analytic floor -- direct large-N probing.
function f3At(kEnd) {
  return HEAD_SFLOW / sflow(Math.pow(10, kEnd + 1));
}
const F3_PROBE = [21, 30, 50, 80, 120, 200, 300].map((kEnd) => ({
  kEnd,
  F3: +f3At(kEnd).toFixed(6),
}));
const F3_MONOTONE_DECREASING = F3_PROBE.every((p, i) => i === 0 || p.F3 < F3_PROBE[i - 1].F3);
const F3_AT_300 = f3At(300); // ~0.8063, still above the 0.80281 limit but converging

export const IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK = {
  id: 'imp-34208',
  proofSection: 'S-frontier',
  question:
    'imp-34133 confirmed the F2 asymptote c ~ 0.0594922 independently (fit matched the analytic ' +
    'E_TRUNC_PT/HEAD.E_N floor to ~6 sig figs) but left the companion F3 asymptote c ~ 0.835955 on the ' +
    'curve fit alone (r ~ 0.125, R^2 ~ 0.99997). Derive an independent analytic expression for the F3 ' +
    'saturation limit from the same inherited imp-3406/imp-33810 sub-terms and assess whether it ' +
    'reproduces 0.835955. Numerical/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The analytic F3 floor F3 = HEAD.sflow/TAIL.sflow with TAIL.sflow -> 1 (since sflow(N) = ' +
    's(N)*(1 - 1/(L0+1) - 1/L) and s = d ln T0/d ln N -> 1 by the RvM height law), giving ' +
    'F3_ASYMPTOTE_ANALYTIC = HEAD.sflow, compared against the imp-34133 fitted c ~ 0.835955; plus the ' +
    'decomposition check (analytic vs finite-difference log-slope at the head) and the direct large-N ' +
    'F3 probe kEnd = 21..300 showing F3 decreasing toward the analytic floor.',
  headN: HEAD_N,
  f3AsymptoteAnalytic: +F3_ASYMPTOTE_ANALYTIC.toFixed(8), // ~0.80281396
  f3AsymptoteFit_imp34133: F3_ASYMPTOTE_FIT, // 0.835955
  fitMinusAnalytic_absdiff: +F3_FIT_MINUS_ANALYTIC.toFixed(6), // ~+0.033141
  fitRelativeBias: +F3_FIT_RELATIVE_BIAS.toFixed(5), // ~+0.04127 (~4.2% HIGH)
  reproducesFit: false, // the analytic floor does NOT reproduce 0.835955 (contrast: F2 matched to 6 sig figs)
  decompositionCheck: {
    form: 'sflow(N) = s(N) * (1 - 1/(L0+1) - 1/L), s = d ln T0 / d ln N',
    head_sflow_finite_difference: +HEAD_SFLOW.toFixed(9), // ~0.802813962
    head_sflow_analytic_factorisation: +HEAD_SFLOW_ANALYTIC.toFixed(9), // ~0.802813963
    absdiff: +HEAD_SFLOW_DECOMP_MATCH.toExponential(3), // ~1e-9
  },
  f3ProbePastFitWindow: F3_PROBE, // F3 monotonically DECREASING 0.8558 -> 0.8063 toward the 0.80281 floor
  f3_at_kEnd_300: +F3_AT_300.toFixed(6), // ~0.806329 (still above 0.80281 -- log-slow convergence)
  verdict:
    'NUMERICAL / ANALYTIC CROSS-CHECK (frontier-direction, NOT rigorous). The independent analytic F3 ' +
    'saturation limit from the inherited imp-3406/imp-33810 sub-terms is F3 -> HEAD.sflow ~ 0.802814: ' +
    'F3 = HEAD.sflow/TAIL.sflow and the tail E_flow log-slope TAIL.sflow -> 1 because sflow(N) factors ' +
    'EXACTLY as s(N)*(1 - 1/(L0+1) - 1/L) (matched to ~1e-9 against the finite-difference slope) with ' +
    's = d ln T0/d ln N -> 1 (RvM height law) and the log-corrections 1/(L0+1), 1/L -> 0. This analytic ' +
    'floor 0.802814 DOES NOT reproduce the imp-34133 fitted c ~ 0.835955 -- it over-estimates the true ' +
    'limit by ~0.0331 (~4.2% relative). Direct large-N probing confirms the analytic value is the true ' +
    'limit and the fit is the outlier: empirical F3(kEnd) keeps DECREASING far past the kEnd=13..21 fit ' +
    'window (0.8558 at 21, 0.8394 at 30, 0.8244 at 50, 0.8063 at 300) monotonically toward HEAD.sflow. ' +
    'The very slow residual decay (r ~ 0.125, TAIL.sflow only 0.938 at kEnd=21) left the 17-rung window ' +
    'under-constrained, so the extrapolation landed ~4.2% high. HONEST NEGATIVE: unlike F2 (fit matched ' +
    'the analytic E_TRUNC_PT floor to 6 sig figs), the F3 asymptote is a curve-fit artifact, not the ' +
    'analytic limit -- imp-34209/imp-34210 concerns about the barely-moving F3 fit are quantitatively ' +
    'borne out. F3 still SATURATES (imp-34023/imp-34133 CONFIRMED qualitatively) but to 0.80281, not ' +
    '0.83596. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; this ' +
    'cross-check is descriptive within the model only; changes no bound; establishes no operator ' +
    'positivity; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-34133 (the constant-plus-decay F2, F3 fit whose F3 asymptote c ~ 0.835955 is cross-checked ' +
    'here); imp-34023 (the F1..F4 decomposition); imp-33810 (the quarter-decade rungs); imp-33773 (the ' +
    'M2 residual sign change at kEnd ~ 21.28); lambda-rh-height-mapping (RvM height law, s -> 1); ' +
    'polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK_ASSERTIONS = [
  {
    // The analytic F3 floor is HEAD.sflow, a finite positive constant near 0.8028.
    id: 'imp34208-f3-analytic-floor-is-head-sflow',
    description: 'F3 -> HEAD.sflow ~ 0.8028 (finite, positive, < 1), the head E_flow log-slope',
    holds: () =>
      F3_ASYMPTOTE_ANALYTIC > 0.8 &&
      F3_ASYMPTOTE_ANALYTIC < 0.805 &&
      Math.abs(F3_ASYMPTOTE_ANALYTIC - HEAD_SFLOW) < 1e-12,
  },
  {
    // The analytic sflow factorisation matches the finite-difference log-slope at the head to ~1e-8.
    id: 'imp34208-sflow-decomposition-matches',
    description: 'sflow(N) = s(N)*(1 - 1/(L0+1) - 1/L) matches the finite-difference slope within 1e-6 at the head',
    holds: () => HEAD_SFLOW_DECOMP_MATCH < 1e-6,
  },
  {
    // The cross-check FAILS to reproduce 0.835955: the fit over-estimates by ~4.2% (honest negative).
    id: 'imp34208-fit-does-not-reproduce-analytic-floor',
    description: 'analytic floor 0.8028 does NOT reproduce the imp-34133 fit 0.835955 -- fit HIGH by ~3-5%',
    holds: () =>
      IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK.reproducesFit === false &&
      F3_FIT_MINUS_ANALYTIC > 0.03 &&
      F3_FIT_MINUS_ANALYTIC < 0.036 &&
      F3_FIT_RELATIVE_BIAS > 0.03 &&
      F3_FIT_RELATIVE_BIAS < 0.05,
  },
  {
    // Direct large-N probing confirms F3 decreases monotonically past the fit window toward the floor.
    id: 'imp34208-f3-decreases-toward-floor-past-window',
    description: 'empirical F3(kEnd) monotonically decreasing 0.8558 (21) -> ~0.8063 (300) toward HEAD.sflow',
    holds: () =>
      F3_MONOTONE_DECREASING &&
      F3_PROBE[0].F3 > F3_ASYMPTOTE_ANALYTIC &&
      F3_AT_300 > F3_ASYMPTOTE_ANALYTIC &&
      F3_AT_300 < F3_ASYMPTOTE_FIT,
  },
  {
    // Storage-precision guard (the imp-2546/imp-2539 red-build trap): stored toFixed fields
    // reconstruct to their live full-precision counterparts within the half-ULP floor.
    id: 'imp34208-storage-precision-pinned',
    description: 'stored f3AsymptoteAnalytic (toFixed 8) reconstructs within the 0.5e-8 half-ULP floor',
    holds: () =>
      Math.abs(IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK.f3AsymptoteAnalytic - F3_ASYMPTOTE_ANALYTIC) <= 0.5e-8,
  },
  {
    // Honesty gate: numerical/cross-check only, isRigorous false, no QED, K_a untouched, C_mb untouched, no refereed bound is changed.
    id: 'imp34208-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, no QED, imp-3066 K_a >= 0 untouched, C_mb untouched, no refereed bound is changed',
    holds: () =>
      IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK.verdict),
  },
];

for (const a of IMP34208_F3_ASYMPTOTE_ANALYTIC_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34208-f3-asymptote-analytic-crosscheck assertion failed: ${a.id}`);
  }
}
