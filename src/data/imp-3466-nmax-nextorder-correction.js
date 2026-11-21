/**
 * @module imp-3466-nmax-nextorder-correction
 *
 * imp-3466 (numerical, frontier-direction): the imp-3446 verdict recorded that the CRUDE
 * leading-order closed form for the interior MAX location of the imp-3220 conditional share
 * sigma(N) = E_coll(N)/E(N),
 *     N_crude = G L (l^2 - 1) / (4 pi^2 E_trunc)  ~ 1.60e6,
 * MISSES the exact stationarity root N_max = 9.218633e5 by ~73%, because at the peak
 * E_flow ~ 1.53 x E_trunc (comparable, not negligible) and the log-derivatives are order 1.
 * This module DERIVES the next-order correction that RECONCILES the crude ~1.60e6 with the
 * exact ~9.22e5: a pure-log rational CORRECTION FACTOR g(l, L) that multiplies the crude
 * balance, so that N_corr = N_crude / g reproduces the exact bisection root to machine
 * precision. It also gives the leading order-1/l truncation of g and certifies how far each
 * order lands from 9.22e5.
 *
 * THE QUANTITY / SUB-TERMS (identical to imp-3446 / imp-3406 / imp-3220)
 * ---------------------------------------------------------------------
 *     T0      = effectiveHeightForN(N)     (Riemann-von Mangoldt inverse)
 *     L       = log T0,   l = log(T0/2pi)
 *     E_coll  = C_C_PINNED * sqrt(L / N)   (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (L/T0) G,  C_F = (l+1)/2pi  (imp-398),  G = exp(2.37e-4) (Gronwall)
 *     E_trunc = 3.06e-5                     (N-independent fixed-strip floor, imp-2631)
 * sigma = E_coll/(E_trunc+E_flow+E_coll) peaks where R=(E_trunc+E_flow)/E_coll is minimized.
 *
 * THE EXACT STATIONARITY EQUATION (imp-3446, verbatim)
 * ----------------------------------------------------
 *   E_flow [1/(l+1) + 1/L - 1] / (E_trunc + E_flow)  =  1/(2L) - l/(2(l-1)).      (*)
 *
 * THE RECONCILIATION (this module)
 * --------------------------------
 * Solve (*) for the peak floor ratio rho = E_flow/E_trunc. Writing the two small-log
 * abbreviations
 *     a = 1/(l-1),   b = 1/L,   c = 1/(l+1),
 * the LHS bracket is B_L = c + b - 1 = -(1 - b - c) and, using l/(l-1) = 1 + a, the RHS is
 * R_H = 1/(2L) - l/(2(l-1)) = -(1/2)(1 + a - b). Substituting E_flow/(E_trunc+E_flow) =
 * rho/(1+rho) into (*) and solving,
 *     rho/(1+rho) = R_H/B_L = (1/2)(1 + a - b)/(1 - b - c),
 * which rearranges to the CLOSED pure-log correction factor
 *
 *     g(l, L)  :=  E_flow/E_trunc  at the peak  =  (1 + a - b) / (1 - a - b - 2c).       (C)
 *
 * Because the crude balance is precisely "E_flow = E_trunc" (rho = 1, i.e. g -> 1 as the
 * logs are frozen), and E_flow/E_trunc = (l^2-1) L G / (4 pi^2 N E_trunc), condition (C) is
 * ALGEBRAICALLY the exact equation (*) rearranged into "crude x correction":
 *
 *     N_corr  =  N_crude / g(l, L)  =  G L (l^2 - 1) / (4 pi^2 E_trunc * g(l, L)),       (N)
 *
 * solved as a fixed point in T0. So the entire 73% crude miss is the single factor g:
 * g ~ 1.5306 at the peak (equivalently 1/g ~ 0.6533), and 1.5978e6 / 1.5306 = 9.2186e5.
 *
 * THE NEXT-ORDER (order-1/l) TRUNCATION
 * -------------------------------------
 * Expanding (C) around the frozen-log root (a, b, c -> 0) to first order,
 *     g ~ 1 + 2a + 2c = 1 + 2/(l-1) + 2/(l+1) = 1 + 4 l/(l^2 - 1),                     (Cl)
 * (the 1/L pieces cancel at first order). This leading correction already cuts the crude
 * miss from ~73% down to ~18%; retaining the full rational (C) -- one more order in the
 * slow logs -- lands the root to machine precision.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (F1) The exact correction factor (C), g = (1+a-b)/(1-a-b-2c), fed into the fixed point
 *        (N) reproduces the imp-3446 bisection root N_max = 9.218633e5 to relative error
 *        ~1e-15 -- (N) is exactly (*) rewritten as crude/correction. The full 73% crude
 *        miss is the one factor g ~ 1.5306 (1/g ~ 0.6533).
 *   (F2) g equals E_flow/E_trunc at the peak (~1.5306), tying the correction factor directly
 *        to the imp-3446 F2 observation that the two floor terms are comparable.
 *   (F3) The leading order-1/l truncation (Cl), g ~ 1 + 4 l/(l^2-1), gives N ~ 1.086e6,
 *        cutting the miss from ~73% to ~18% -- the correction is genuine but the slow logs
 *        (a, c ~ 0.08-0.10) converge slowly, so the full rational g is required to reach a
 *        few percent. Honest sub-gap: a SINGLE analytic order in 1/l lands ~18%, not a few
 *        percent; the few-percent-or-better reconciliation rests on the full rational (C).
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed. The imp-3066 off-diagonal
 * endpoint-Hankel obstruction is UNTOUCHED.
 *
 * @see imp-3446-nmax-closed-form (the implicit stationarity equation (*) this reconciles)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX pinned N_max ~ 9.22e5 by ternary search)
 * @see imp-3462-nmax-turnover-exponent-derivation (implicit differentiation of (*) in E_trunc)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip floor (imp-2631/imp-3220)
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-3446/imp-3406/imp-3220 exactly

// EXACT imp-3446 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const l = Math.log(T0 / TWO_PI);
  const C_F = (l + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, l, E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}

// The exact imp-3446 implicit stationarity residual (*) and its bisection root (baseline).
function stationarityResidual(T0) {
  const L = Math.log(T0);
  const l = Math.log(T0 / TWO_PI);
  const C_F = (l + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const lhs = (E_flow * (1 / (l + 1) + 1 / L - 1)) / (E_TRUNC_PT + E_flow);
  const rhs = 1 / (2 * L) - l / (2 * (l - 1));
  return lhs - rhs;
}
function solveNmaxImplicit() {
  let a = effectiveHeightForN(5e5);
  let b = effectiveHeightForN(1.747e6);
  for (let i = 0; i < 300; i++) {
    const m = Math.sqrt(a * b);
    if (stationarityResidual(m) < 0) a = m;
    else b = m;
  }
  const T0 = Math.sqrt(a * b);
  const l = Math.log(T0 / TWO_PI);
  return (T0 / TWO_PI) * (l - 1);
}
const N_MAX_BISECTION = solveNmaxImplicit(); // ~9.218633e5 (imp-3446 baseline)

// The crude leading-order form N_crude = G L(l^2-1)/(4 pi^2 E_trunc) (E_flow=E_trunc, frozen logs).
function solveNmaxCrude() {
  let N = 9e5;
  for (let i = 0; i < 400; i++) {
    const T0 = effectiveHeightForN(N);
    const L = Math.log(T0);
    const l = Math.log(T0 / TWO_PI);
    N = (GRONWALL * L * (l * l - 1)) / (4 * Math.PI * Math.PI * E_TRUNC_PT);
  }
  return N;
}
const N_CRUDE = solveNmaxCrude(); // ~1.5978e6, ~73% high
const CRUDE_REL_ERR = Math.abs(N_CRUDE - N_MAX_BISECTION) / N_MAX_BISECTION; // ~0.733

// (C) exact pure-log correction factor g = (1 + a - b)/(1 - a - b - 2c),
//     a = 1/(l-1), b = 1/L, c = 1/(l+1). Algebraically E_flow/E_trunc at the peak.
function gExact(l, L) {
  const a = 1 / (l - 1);
  const b = 1 / L;
  const c = 1 / (l + 1);
  return (1 + a - b) / (1 - a - b - 2 * c);
}
// (Cl) leading order-1/l truncation g ~ 1 + 4 l/(l^2 - 1).
function gLeading(l) {
  return 1 + (4 * l) / (l * l - 1);
}

// (N) corrected fixed point N_corr = N_crude / g, solved self-consistently in T0.
function solveNmaxCorrected(gFun) {
  let N = 9e5;
  for (let i = 0; i < 400; i++) {
    const T0 = effectiveHeightForN(N);
    const L = Math.log(T0);
    const l = Math.log(T0 / TWO_PI);
    const g = gFun(l, L);
    N = (GRONWALL * L * (l * l - 1)) / (4 * Math.PI * Math.PI * E_TRUNC_PT * g);
  }
  return N;
}
const N_CORR_EXACT = solveNmaxCorrected((l, L) => gExact(l, L)); // ~9.218633e5 (machine precision)
const N_CORR_LEADING = solveNmaxCorrected((l) => gLeading(l)); // ~1.086e6 (~18% high)
const CORR_REL_ERR = Math.abs(N_CORR_EXACT - N_MAX_BISECTION) / N_MAX_BISECTION; // ~1e-15
const LEADING_REL_ERR = Math.abs(N_CORR_LEADING - N_MAX_BISECTION) / N_MAX_BISECTION; // ~0.178

const PEAK = parts(N_MAX_BISECTION);
const G_AT_PEAK = gExact(PEAK.l, PEAK.L); // ~1.5306 = E_flow/E_trunc at the peak
const E_FLOW_OVER_E_TRUNC = PEAK.E_flow / E_TRUNC_PT; // ~1.5306

export const IMP3466_NMAX_NEXTORDER_CORRECTION = {
  id: 'imp-3466',
  proofSection: 'S-frontier',
  question:
    'Derive the next-order correction that reconciles the imp-3446 crude leading-order ' +
    'N_crude = G L(l^2-1)/(4 pi^2 E_trunc) ~ 1.60e6 (which misses the exact stationarity ' +
    'root N_max = 9.218633e5 by ~73%) with the full implicit equation, by retaining E_flow ' +
    'and the order-1 log-derivative terms; produce a corrected closed form that lands within ' +
    'a few percent of 9.22e5 and certify it against the exact bisection root. Derivation/' +
    'measurement only; RH-equivalent; no RH verdict.',
  correctionFactor:
    'Solving the exact imp-3446 stationarity equation (*) for the peak floor ratio rho = ' +
    'E_flow/E_trunc yields the CLOSED pure-log factor g(l,L) = (1 + a - b)/(1 - a - b - 2c) ' +
    'with a = 1/(l-1), b = 1/L, c = 1/(l+1). Since the crude balance is E_flow = E_trunc ' +
    '(rho = 1, g -> 1 when the slow logs are frozen) and E_flow/E_trunc = (l^2-1)L G/' +
    '(4 pi^2 N E_trunc), the corrected closed form is the fixed point N_corr = N_crude/g = ' +
    'G L(l^2-1)/(4 pi^2 E_trunc * g(l,L)). The entire 73% crude miss is the single factor ' +
    'g ~ 1.5306 (1/g ~ 0.6533). Leading order-1/l truncation: g ~ 1 + 4 l/(l^2-1).',
  result: {
    N_max_bisection: +N_MAX_BISECTION.toExponential(6), // ~9.218633e5 (imp-3446 baseline)
    N_crude: +N_CRUDE.toExponential(4), // ~1.5978e6
    crude_rel_err: +CRUDE_REL_ERR.toFixed(3), // ~0.733
    N_corr_exact: +N_CORR_EXACT.toExponential(6), // ~9.218633e5
    corr_rel_err: +CORR_REL_ERR.toExponential(3), // ~1e-15
    N_corr_leading: +N_CORR_LEADING.toExponential(4), // ~1.086e6
    leading_rel_err: +LEADING_REL_ERR.toFixed(4), // ~0.178
    g_at_peak: +G_AT_PEAK.toFixed(4), // ~1.5306
    one_over_g: +(1 / G_AT_PEAK).toFixed(4), // ~0.6533
    E_flow_over_E_trunc_at_peak: +E_FLOW_OVER_E_TRUNC.toFixed(4), // ~1.5306 (equals g)
    note:
      'The exact correction factor g = (1+a-b)/(1-a-b-2c) fed into N_corr = N_crude/g ' +
      'reproduces the imp-3446 bisection root 9.218633e5 to relative error ~1e-15 -- it is ' +
      'the full stationarity equation rewritten as crude x correction. The leading order-1/l ' +
      'truncation g ~ 1 + 4l/(l^2-1) cuts the crude miss from ~73% to ~18%.',
  },
  honestSubGap:
    'A SINGLE analytic order in 1/l (g ~ 1 + 4 l/(l^2-1)) lands ~18% high, NOT a few ' +
    'percent, because the slow logs a=1/(l-1), c=1/(l+1) ~ 0.08-0.10 converge slowly at ' +
    'l ~ 11.4. The few-percent-or-better reconciliation rests on the FULL rational factor ' +
    'g = (1+a-b)/(1-a-b-2c), which is algebraically exact -- so N_corr = N_crude/g nails ' +
    '9.22e5 to machine precision, but the closed-form gain over one truncation order is the ' +
    'full rational, not a finite Taylor tail.',
  mechanism:
    'The crude form sets E_flow = E_trunc (the frozen-log crossover, g -> 1). The exact ' +
    'peak sits where the log-derivatives of (E_trunc+E_flow) and E_coll balance, which ' +
    'forces E_flow/E_trunc = g(l,L) ~ 1.53, not 1. Dividing the crude N by that same factor ' +
    'g recovers the exact root: the 73% overshoot is exactly the crude assumption ' +
    'E_flow/E_trunc = 1 versus the true 1.53.',
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). Solving the imp-3446 implicit ' +
    'stationarity equation for the peak floor ratio rho = E_flow/E_trunc yields the closed ' +
    'pure-log correction factor g(l,L) = (1 + a - b)/(1 - a - b - 2c), a = 1/(l-1), ' +
    'b = 1/L, c = 1/(l+1). The corrected closed form N_corr = N_crude/g = ' +
    'G L(l^2-1)/(4 pi^2 E_trunc * g) reproduces the exact bisection root N_max = 9.218633e5 ' +
    'to relative error ~1e-15 -- it is (*) rewritten as crude x correction, with the whole ' +
    '73% crude miss carried by the single factor g ~ 1.5306 (= E_flow/E_trunc at the peak). ' +
    'The leading order-1/l truncation g ~ 1 + 4 l/(l^2-1) cuts the miss from ~73% to ~18%. ' +
    'HONEST SUB-GAP: one analytic order lands ~18%, not a few percent; the few-percent ' +
    'reconciliation rests on the full rational g. Derivation/measurement only; no positivity, ' +
    'no bridge closure, no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-3446 (implicit stationarity equation (*), crude form misses by ~73%); imp-3406 ' +
    '(interior max N_max ~ 9.22e5 by ternary search); imp-3462 (implicit differentiation of ' +
    '(*) in E_trunc); imp-3220 (U-shaped sigma(N) ladder); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip floor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3466_NMAX_NEXTORDER_CORRECTION_ASSERTIONS = [
  {
    // Reuse gate: the imp-3446 baseline bisection root and the crude 73% miss are reproduced
    // here (identical sub-term formulas in use).
    id: 'imp3466-reproduces-imp3446-baseline-and-crude-miss',
    description: 'bisection root ~9.22e5 and crude ~73% miss reproduce imp-3446 (identical formulas)',
    holds: () =>
      N_MAX_BISECTION > 5e5 && N_MAX_BISECTION < 2e6 &&
      CRUDE_REL_ERR > 0.5 && CRUDE_REL_ERR < 1.0,
  },
  {
    // Headline: the exact pure-log correction factor reconciles crude with exact to machine
    // precision -- N_corr = N_crude/g reproduces the bisection root.
    id: 'imp3466-exact-correction-reproduces-root',
    description: 'N_corr = N_crude/g(l,L) matches the exact bisection root to rel err < 1e-9',
    holds: () => CORR_REL_ERR < 1e-9,
  },
  {
    // The correction factor equals E_flow/E_trunc at the peak (~1.53), tying it to imp-3446 F2.
    id: 'imp3466-g-equals-eflow-over-etrunc',
    description: 'correction factor g ~ 1.53 equals E_flow/E_trunc at the peak (comparable floors)',
    holds: () =>
      G_AT_PEAK > 1.5 && G_AT_PEAK < 1.56 &&
      Math.abs(G_AT_PEAK - E_FLOW_OVER_E_TRUNC) < 1e-6,
  },
  {
    // The leading order-1/l truncation genuinely improves on the crude form: cuts the miss
    // from ~73% to ~18% (strictly better, and still on the high side).
    id: 'imp3466-leading-truncation-improves',
    description: 'leading g ~ 1+4l/(l^2-1) cuts the crude ~73% miss to ~18% (strictly better)',
    holds: () =>
      LEADING_REL_ERR < CRUDE_REL_ERR && LEADING_REL_ERR > 0.1 && LEADING_REL_ERR < 0.25,
  },
  {
    // Honesty gate: derivation only, no QED, no refereed bound is changed, honest sub-gap named.
    id: 'imp3466-honesty-gate-no-qed',
    description: 'Derivation only: no QED, no refereed bound is changed, one-order sub-gap named',
    holds: () =>
      IMP3466_NMAX_NEXTORDER_CORRECTION.isRigorous === false &&
      /NO QED/.test(IMP3466_NMAX_NEXTORDER_CORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP3466_NMAX_NEXTORDER_CORRECTION.verdict) &&
      /SUB-GAP/.test(IMP3466_NMAX_NEXTORDER_CORRECTION.verdict),
  },
];

for (const a of IMP3466_NMAX_NEXTORDER_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3466-nmax-nextorder-correction assertion failed: ${a.id}`);
  }
}
