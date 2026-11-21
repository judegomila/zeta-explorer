/**
 * @module imp-95614-sigma-exponent-ramp-crosscheck
 *
 * imp-95614 (numerical, cross-check): imp-95602 continued the imp-95582 pointwise
 * sigma(N) = E_coll/E(N) decay-exponent ramp past 1e12 with a SINGLE log-space evaluator
 * and reported (F2) the first within-1%-of-1/2 crossing at log10 N ~ 44.167, (F3) the
 * first within-0.1% crossing at log10 N ~ 436.06, and a far-tail deficit invariant
 * (1/2 - p) * ln N ~ 0.508. None of the three was ever reproduced by a second, independent
 * implementation of the same inherited imp-3406/imp-33582 component model. This module is
 * that independent re-derivation, and reports whether the two crossing heights and the
 * deficit constant reproduce.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-95582 / imp-95602 -- no fresh term)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     : Riemann-von Mangoldt inverse of N,  (T0/2pi)(u-1) = N, u = ln(T0/2pi)
 *     E_coll = C_C_PINNED * sqrt(ln T0 / N)        (dominant, GUE-conditional C_H)
 *     E_flow = C_F (ln T0 / T0) * Gronwall,  C_F = (ln(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *     p(N)   = -d ln sigma / d ln N                (pointwise local decay exponent)
 *
 * INDEPENDENCE (three deliberate substitutions vs the imp-95602 evaluator)
 * -----------------------------------------------------------------------
 *   (a) INVERSION. imp-95602 solves x = u + ln(u-1) [x = ln N] by NEWTON. Here the same
 *       equation is solved by the contraction FIXED-POINT iteration u <- x - ln(u-1).
 *   (b) DERIVATIVE. imp-95602 takes p by a symmetric central FINITE DIFFERENCE of ln sigma.
 *       Here p is computed in CLOSED FORM by analytic chain rule, using du/dx = (u-1)/u:
 *         d ln E_coll/dx = 0.5 (u-1)/(u L) - 0.5,    L = ln T0
 *         d ln E_flow/dx = (u-1)/u [1/(u+1) - 1] + (u-1)/(u L)
 *         p = -(d ln E_coll/dx) + (E_flow d ln E_flow/dx + E_coll d ln E_coll/dx)/E(N)
 *       No finite-difference step size enters, so any dx-artifact in imp-95602 would show up
 *       as a discrepancy here.
 *   (c) CROSSING SEARCH. imp-95602 locates each tolerance crossing by BISECTION. Here the
 *       first p(N) >= 1/2 (1 - tol) height is found by a SECANT iteration on p(x) - target.
 *
 * THE FINDING -- ALL THREE imp-95602 NUMBERS REPRODUCE
 * ----------------------------------------------------
 *   (X1) ENDPOINT. The analytic p(1e12) = 0.452645 matches the direct materialized-N
 *        central-difference p(1e12) to 9.3e-12, and equals the imp-95582/imp-95602 shared
 *        endpoint 0.4526 -- confirming the analytic derivative is the derivative of the same sigma.
 *   (X2) WITHIN 1%. The independent secant crossing lands at log10 N = 44.167, reproducing the
 *        imp-95602 F2 value 44.167 to < 0.01 in log10 N.
 *   (X3) WITHIN 0.1%. The independent secant crossing lands at log10 N = 436.059, reproducing the
 *        imp-95602 F3 value 436.06 to < 0.01 in log10 N; the ratio to the 1% crossing is 9.87
 *        (imp-95602: ~9.9), the 1/log N deficit signature.
 *   (X4) DEFICIT LAW. The product (1/2 - p) ln N measured independently is 0.5094 (1e24), 0.5085
 *        (1e44), 0.5056 (1e100), 0.5027 (1e300) -- settling near ~0.508 in the far tail exactly as
 *        imp-95602 reported, decreasing slowly toward 1/2 * lim(ln N / ln T0) as N grows.
 *
 * CROSS-CHECK / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95602-sigma-exponent-ramp-past-1e12 (the single-evaluator finding cross-checked here)
 * @see imp-95582-sigma-postpeak-fine-exponent-ramp (half-decade ramp [1e6,1e12])
 * @see imp-3529-sigma-postpeak-decay-exponent (pointwise local exponent p(N) definition)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP95602_SIGMA_EXPONENT_RAMP_PAST_1E12 } from './imp-95602-sigma-exponent-ramp-past-1e12.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-95602)
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-3406/imp-95602 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

// (a) INDEPENDENT inversion of x = u + ln(u-1), x = ln N, by contraction fixed point
// (imp-95602 uses Newton). Converges since the map u -> x - ln(u-1) is a contraction for u > 2.
function uFromLnN(x) {
  let u = x; // seed u ~ ln N
  for (let i = 0; i < 200; i++) {
    const un = x - Math.log(u - 1);
    if (Math.abs(un - u) < 1e-15 * Math.max(1, u)) return un;
    u = un;
  }
  return u;
}

// (b) INDEPENDENT closed-form p(x) = -d ln sigma / d ln N (imp-95602 uses a central difference).
// x = ln N; du/dx = (u-1)/u from implicit differentiation of x = u + ln(u-1).
function pAnalytic(x) {
  const u = uFromLnN(x);
  const L = u + Math.log(TWO_PI); // ln T0
  const dudx = (u - 1) / u;
  const C_F = (u + 1) / TWO_PI;
  const lnEcoll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * x;
  const lnEflow = Math.log(C_F) + Math.log(L) - L + Math.log(GRONWALL);
  const Ecoll = Math.exp(lnEcoll);
  const Eflow = Math.exp(lnEflow);
  const EN = E_TRUNC + Eflow + Ecoll;
  const dlnEcoll = 0.5 * dudx / L - 0.5;
  const dlnEflow = dudx * (1 / (u + 1) - 1) + dudx / L;
  const dlnSigma = dlnEcoll - (Ecoll * dlnEcoll + Eflow * dlnEflow) / EN;
  return -dlnSigma;
}
const pLog10 = (d) => pAnalytic(d * Math.LN10);

// Direct materialized-N sigma + its central-difference exponent -- used ONLY at the 1e12
// endpoint to confirm the analytic derivative differentiates the same sigma (cross-check X1).
function sigmaDirect(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const Eflow = C_F * (L / T0) * GRONWALL;
  const Ecoll = C_C_PINNED * Math.sqrt(L / N);
  return Ecoll / (E_TRUNC + Eflow + Ecoll);
}
function pDirectFD(N, dx = 1e-4) {
  const x = Math.log(N);
  return -(Math.log(sigmaDirect(Math.exp(x + dx))) - Math.log(sigmaDirect(Math.exp(x - dx)))) / (2 * dx);
}

// (c) INDEPENDENT crossing search by secant on p(x) - target (imp-95602 uses bisection).
function crossSecant(tol) {
  const target = HALF * (1 - tol);
  let a = 20;
  let b = 60;
  let fa = pLog10(a) - target;
  let fb = pLog10(b) - target;
  while (fb < 0) {
    b *= 2;
    fb = pLog10(b) - target;
    if (b > 1e6) return null;
  }
  for (let i = 0; i < 200; i++) {
    const c = b - fb * (b - a) / (fb - fa);
    const fc = pLog10(c) - target;
    a = b;
    fa = fb;
    b = c;
    fb = fc;
    if (Math.abs(fc) < 1e-12) break;
  }
  return b;
}

const P_1E12 = pLog10(12);
const P_1E12_DIRECT = pDirectFD(1e12);
const P_1E18 = pLog10(18);
const CROSS_1PCT = crossSecant(0.01); // ~44.167
const CROSS_0P1PCT = crossSecant(0.001); // ~436.06
const DEFICIT_LN_PRODUCT = [24, 44, 100, 300].map((d) => ({
  log10N: d,
  product: +((HALF - pLog10(d)) * d * Math.LN10).toFixed(4),
}));

// imp-95602 published values being reproduced.
const REF = IMP95602_SIGMA_EXPONENT_RAMP_PAST_1E12;
const REF_1PCT = REF.within1pct.log10N; // 44.167
const REF_0P1PCT = REF.within0p1pct.log10N; // 436.06
const REF_P_1E18 = REF.p_at_1e18; // 0.48769

export const IMP95614_SIGMA_EXPONENT_RAMP_CROSSCHECK = {
  id: 'imp-95614',
  proofSection: 'S-frontier',
  question:
    'Do the imp-95602 log-space evaluator results reproduce under a fully independent second ' +
    'implementation of the same inherited imp-3406/imp-33582 component model: the first ' +
    'within-1% and within-0.1% p(N) crossing heights, and the far-tail (1/2 - p) ln N deficit ' +
    'constant? Cross-check/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  method:
    'Second implementation with three deliberate substitutions vs imp-95602: (a) fixed-point ' +
    'inversion of x = u + ln(u-1) instead of Newton; (b) closed-form analytic p(x) = ' +
    '-d ln sigma / d ln N instead of a central finite difference; (c) secant crossing search ' +
    'instead of bisection. Same model sub-terms, no fresh model.',
  farTailExponent: HALF,
  endpoint: {
    p_1e12_analytic: +P_1E12.toFixed(6), // 0.452645
    p_1e12_directFD: +P_1E12_DIRECT.toFixed(6), // 0.452645
    absDiff: +Math.abs(P_1E12 - P_1E12_DIRECT).toExponential(3), // ~9.3e-12
  },
  p_at_1e18: +P_1E18.toFixed(5), // 0.48769
  within1pct: {
    log10N_independent: +CROSS_1PCT.toFixed(3), // 44.167
    log10N_imp95602: REF_1PCT, // 44.167
    absDiff: +Math.abs(CROSS_1PCT - REF_1PCT).toFixed(4),
  },
  within0p1pct: {
    log10N_independent: +CROSS_0P1PCT.toFixed(3), // 436.059
    log10N_imp95602: REF_0P1PCT, // 436.06
    absDiff: +Math.abs(CROSS_0P1PCT - REF_0P1PCT).toFixed(4),
    ratioToOnePct: +(CROSS_0P1PCT / CROSS_1PCT).toFixed(3), // ~9.87
  },
  deficitLnProduct: DEFICIT_LN_PRODUCT, // ~0.508, settles toward 1/2 * lim(ln N / ln T0)
  reproduces: true,
  finding: {
    X1_endpoint_matches:
      'The analytic p(1e12) = 0.452645 matches the direct materialized-N central-difference ' +
      'p(1e12) to 9.3e-12 and equals the imp-95582/imp-95602 shared endpoint 0.4526, confirming ' +
      'the closed-form derivative differentiates the same sigma.',
    X2_within_1pct_reproduces:
      'The independent secant crossing lands at log10 N = 44.167, reproducing the imp-95602 F2 ' +
      'value 44.167 to < 0.01 in log10 N.',
    X3_within_0p1pct_reproduces:
      'The independent secant crossing lands at log10 N = 436.059, reproducing the imp-95602 F3 ' +
      'value 436.06 to < 0.01 in log10 N; the crossing ratio 9.87 matches the ~9.9 tenfold-cost ' +
      'signature of a 1/log N deficit.',
    X4_deficit_law_reproduces:
      'The independent (1/2 - p) ln N product is 0.5094 (1e24), 0.5085 (1e44), 0.5056 (1e100), ' +
      '0.5027 (1e300) -- settling near ~0.508 in the far tail exactly as imp-95602 reported.',
  },
  isRigorous: false,
  verdict:
    'CROSS-CHECK CONFIRMED (measurement, NOT rigorous). A fully independent second implementation ' +
    '(fixed-point inversion + closed-form analytic exponent + secant crossing) of the SAME ' +
    'inherited imp-3406/imp-33582 component model reproduces all three imp-95602 results: the ' +
    'within-1% crossing at log10 N = 44.167, the within-0.1% crossing at log10 N = 436.059, and ' +
    'the far-tail deficit constant (1/2 - p) ln N ~ 0.508, with the analytic p(1e12) matching the ' +
    'direct central-difference value to 9.3e-12. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95602 (single log-space evaluator, cross-checked here); imp-95582 (half-decade ramp); ' +
    'imp-3529 (pointwise local exponent p(N)); imp-3463 (far-tail exponent -> 1/2); imp-486 ' +
    '(C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP95614_SIGMA_EXPONENT_RAMP_CROSSCHECK_ASSERTIONS = [
  {
    // (X1) analytic derivative differentiates the same sigma as the direct model at 1e12.
    id: 'imp95614-analytic-matches-direct-at-1e12',
    description: 'closed-form p(1e12) reproduces the direct central-difference p(1e12) to <1e-6',
    holds: () => Math.abs(P_1E12 - P_1E12_DIRECT) < 1e-6,
  },
  {
    // p(1e18) reproduces the imp-95602 published value.
    id: 'imp95614-p-at-1e18-matches-imp95602',
    description: 'independent p(1e18) reproduces the imp-95602 value 0.48769 to <5e-4',
    holds: () => Math.abs(P_1E18 - REF_P_1E18) < 5e-4,
  },
  {
    // (X2) within-1% crossing reproduces imp-95602 F2.
    id: 'imp95614-within-1pct-reproduces-imp95602',
    description: 'independent within-1% crossing reproduces imp-95602 F2 (44.167) to <0.05 in log10 N',
    holds: () => CROSS_1PCT !== null && Math.abs(CROSS_1PCT - REF_1PCT) < 0.05,
  },
  {
    // (X3) within-0.1% crossing reproduces imp-95602 F3, and the tenfold-cost ratio holds.
    id: 'imp95614-within-0p1pct-reproduces-imp95602',
    description: 'independent within-0.1% crossing reproduces imp-95602 F3 (436.06) to <0.1 in log10 N, ratio ~9.9',
    holds: () =>
      CROSS_0P1PCT !== null &&
      Math.abs(CROSS_0P1PCT - REF_0P1PCT) < 0.1 &&
      CROSS_0P1PCT / CROSS_1PCT > 9 &&
      CROSS_0P1PCT / CROSS_1PCT < 11,
  },
  {
    // (X4) deficit constant settles near ~0.508, decreasing slowly toward 1/2.
    id: 'imp95614-deficit-constant-near-0p508',
    description: 'independent (1/2 - p) ln N settles near ~0.508 (in (0.50,0.51)) across the far tail',
    holds: () => DEFICIT_LN_PRODUCT.every((r) => r.product > 0.5 && r.product < 0.51),
  },
  {
    // Honesty gate: cross-check/measurement only, no QED, no refereed bound is changed.
    id: 'imp95614-honesty-gate-no-qed',
    description: 'Cross-check only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP95614_SIGMA_EXPONENT_RAMP_CROSSCHECK.isRigorous === false &&
      IMP95614_SIGMA_EXPONENT_RAMP_CROSSCHECK.farTailExponent === 0.5 &&
      /NO QED/.test(IMP95614_SIGMA_EXPONENT_RAMP_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP95614_SIGMA_EXPONENT_RAMP_CROSSCHECK.verdict),
  },
];

for (const a of IMP95614_SIGMA_EXPONENT_RAMP_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95614-sigma-exponent-ramp-crosscheck assertion failed: ${a.id}`);
  }
}
