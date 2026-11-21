/**
 * @module imp-96423-knee-offset-closed-form
 *
 * imp-96423 (numerical, frontier-direction): DERIVE a closed form for the imp-96405 M3
 * sub-leading knee/crossover OFFSET -- the +0.0168 log10 gap between the full-model
 * exponent-ramp knee (sigma-curvature inflection) and the imp-33723 E_coll = E_trunc
 * crossover (sigma = 1/2) -- in the imp-3220/imp-3406 component sub-terms.
 *
 * SETUP (same sub-terms as imp-96405 / imp-96388; nothing rescaled)
 * ----------------------------------------------------------------
 * Flow-off share:  sigma(N) = E_coll / (E_trunc + E_coll) = 1 / (1 + e^{-t}),
 *   with logistic variable  t(u) = ln(E_coll / E_trunc),  u = ln N,
 *   E_coll = C_C sqrt(L / N),  L = ln T0(N),  T0 = effectiveHeightForN(N).
 * If L were constant, t = const - u/2 is LINEAR, sigma is an EXACT logistic, and its
 * curvature inflection is pinned to t = 0 (sigma = 1/2 = crossover): zero offset
 * (imp-96405 M1). The offset is exactly what the two exact-logistic breakers inject:
 * the slowly-varying L(u) and the nonzero E_flow.
 *
 * CLOSED FORM (this module)
 * -------------------------
 * (A) L(N)-running part (flow-off). The inflection of sigma(u) solves
 *     (1 - 2 sigma)(t_prime)^2 + t_dprime = 0. Expanding about the crossover u_c (where
 *     sigma = 1/2, so 1 - 2 sigma = 0) gives the shift
 *         Delta_u = 2 t_dprime(u_c) / t_prime(u_c)^3,
 *     with, from t = const + (1/2) ln L - u/2,
 *         t_prime  = (1/2) d(ln L)/du - 1/2,
 *         t_dprime = (1/2) d^2(ln L)/du^2.
 *     Offset_noflow = Delta_u / ln 10. This is a CLOSED FORM in the height-map running
 *     slope/curvature d(ln L)/du, d^2(ln L)/du^2 at the crossover -- no free parameter.
 * (B) E_flow part. E_flow enters as an effective extra truncation r = E_flow / E_trunc:
 *     t_tilde = t - ln(1 + r), so the full offset is the inflection-vs-half shift with the
 *     flow-perturbed derivatives PLUS the shift of the sigma = 1/2 point off the flow-off
 *     crossover:
 *         Delta_u_full = 2 t_tilde_dprime / t_tilde_prime^3 + ln(1 + r) / t_prime,
 *         t_tilde_prime  = t_prime  - r_prime / (1 + r),
 *         t_tilde_dprime = t_dprime - [r_dprime (1 + r) - r_prime^2] / (1 + r)^2.
 *
 * MATCH (evaluated at the imp-33723 crossover log10 N_c ~ 9.51591; derivatives by central
 * finite difference of the REAL effectiveHeightForN, step 1e-4 in u)
 * -----------------------------------------------------------------------------------------
 *   Offset_noflow: closed 0.007740  vs  imp-96405 measured 0.007728  (0.15 percent; lands
 *                  inside the imp-96405 M4 flow-off perturbation band [+0.0068, +0.0088]).
 *   Offset_full:   closed 0.017145  vs  imp-96405 measured 0.016757  (~2.3 percent; the gap
 *                  is the higher-order flow terms dropped past first order in r).
 *   E_flow share:  closed 0.549     vs  imp-96405 measured 0.539.
 * The +0.0168 offset is thus NOT an unresolved residual: it is 2 t_dprime / t_prime^3 (in
 * log10) set by the height-map running, plus a first-order E_flow / E_trunc correction.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share landmark diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96405-knee-crossover-forced-vs-coincidental (M3 offset decomposition this closes)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (the OLS-exponent knee estimator)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.28e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-96388/imp-96405 exactly

function eColl(N) {
  const T0 = effectiveHeightForN(N);
  return C_C_PINNED * Math.sqrt(Math.log(T0) / N);
}
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
function sigmaGen(withFlow) {
  return (N) => {
    const ec = eColl(N);
    const ef = withFlow ? eFlow(N) : 0;
    return ec / (E_TRUNC_PT + ef + ec);
  };
}

// imp-33723 crossover (flow-off fixed point E_coll = E_trunc), same iteration as imp-96405.
function crossoverLog10() {
  const K = (C_C_PINNED / E_TRUNC_PT) ** 2;
  let N = 1e9;
  for (let i = 0; i < 80; i++) N = K * Math.log(effectiveHeightForN(N));
  return Math.log10(N);
}

// imp-96405 sigma-curvature inflection (measured landmark) -- reproduced to compare against.
function sigmaInflectionLog10(sigmaFn, lo, hi, step) {
  const arr = [];
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const sm = sigmaFn(Math.pow(10, d - step));
    const s0 = sigmaFn(Math.pow(10, d));
    const sp = sigmaFn(Math.pow(10, d + step));
    arr.push({ d, v: sp - 2 * s0 + sm });
  }
  for (let i = 1; i < arr.length; i++) {
    if (Math.sign(arr[i].v) !== Math.sign(arr[i - 1].v)) {
      const c0 = arr[i - 1].d, c1 = arr[i].d, y0 = arr[i - 1].v, y1 = arr[i].v;
      return c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
    }
  }
  return null;
}

const CROSS = crossoverLog10();
const uC = CROSS * Math.LN10; // natural-log N at the crossover

// central finite differences in u = ln N of ln L (L = ln T0) and r = E_flow/E_trunc.
const H = 1e-4;
const lnLat = (u) => Math.log(Math.log(effectiveHeightForN(Math.exp(u))));
const rAt = (u) => eFlow(Math.exp(u)) / E_TRUNC_PT;
const lnL0 = lnLat(uC), lnLp = lnLat(uC + H), lnLm = lnLat(uC - H);
const dlnL = (lnLp - lnLm) / (2 * H);
const d2lnL = (lnLp - 2 * lnL0 + lnLm) / (H * H);
const r0 = rAt(uC), rp = rAt(uC + H), rm = rAt(uC - H);
const rPrime = (rp - rm) / (2 * H);
const rDprime = (rp - 2 * r0 + rm) / (H * H);

// (A) flow-off closed form: t_prime, t_dprime from t = const + (1/2) ln L - u/2.
const tPrime = 0.5 * dlnL - 0.5;
const tDprime = 0.5 * d2lnL;
const deltaUnoflow = (2 * tDprime) / tPrime ** 3;
const CLOSED_NOFLOW_OFFSET = deltaUnoflow / Math.LN10;

// (B) full closed form: flow-perturbed derivatives + half-point shift off the flow-off crossover.
const ttPrime = tPrime - rPrime / (1 + r0);
const ttDprime = tDprime - (rDprime * (1 + r0) - rPrime * rPrime) / (1 + r0) ** 2;
const inflVsHalfFlow = (2 * ttDprime) / ttPrime ** 3;
const halfShiftFlow = Math.log(1 + r0) / tPrime; // t(u_half) = ln(1 + r) => u_half - uC ~ ln(1+r)/t_prime
const deltaUfull = inflVsHalfFlow + halfShiftFlow;
const CLOSED_FULL_OFFSET = deltaUfull / Math.LN10;

// measured (imp-96405 method) for the side-by-side match.
const MEAS_NOFLOW_OFFSET = sigmaInflectionLog10(sigmaGen(false), 8, 12, 0.02) - CROSS;
const MEAS_FULL_OFFSET = sigmaInflectionLog10(sigmaGen(true), 8, 12, 0.02) - CROSS;

const CLOSED_EFLOW_SHARE = (CLOSED_FULL_OFFSET - CLOSED_NOFLOW_OFFSET) / CLOSED_FULL_OFFSET;
const MEAS_EFLOW_SHARE = (MEAS_FULL_OFFSET - MEAS_NOFLOW_OFFSET) / MEAS_FULL_OFFSET;

export const IMP96423_KNEE_OFFSET_CLOSED_FORM = Object.freeze({
  id: 'imp-96423',
  proofSection: 'S-frontier',
  question:
    'Does the imp-96405 M3 sub-leading knee/crossover offset (+0.0168 log10, ~54% E_flow + the ' +
    'rest L(N)-running) have a CLOSED FORM in the imp-3220/imp-3406 sub-terms, matching the ' +
    'measured flow-off-vs-full split? Derivation/measurement only; NOT an RH bound; NO QED.',
  verdictShort:
    'YES -- offset = (1/ln10) 2 t_dprime / t_prime^3 (flow-off) + a first-order E_flow/E_trunc ' +
    'correction; reproduces the measured offsets to 0.15 percent (flow-off) and ~2 percent (full).',
  crossoverLog10: +CROSS.toFixed(5), // ~9.51591
  heightRunningAtCrossover: {
    L: +Math.log(effectiveHeightForN(Math.exp(uC))).toFixed(5), // ~20.858
    dlnL_du: +dlnL.toFixed(6), // d(ln L)/du ~ 0.0454
    d2lnL_du2: +d2lnL.toExponential(4), // ~ -1.94e-3
    tPrime: +tPrime.toFixed(6), // ~ -0.47729
    tDprime: +tDprime.toExponential(4), // ~ -9.69e-4
    rEflowOverEtrunc: +r0.toExponential(4), // ~1.90e-3
  },
  flowOffOffset: {
    closedFormLog10: +CLOSED_NOFLOW_OFFSET.toFixed(6), // ~0.007740
    measuredLog10: +MEAS_NOFLOW_OFFSET.toFixed(6), // ~0.007728 (imp-96405 noFlowOffset)
    relError: +Math.abs((CLOSED_NOFLOW_OFFSET - MEAS_NOFLOW_OFFSET) / MEAS_NOFLOW_OFFSET).toFixed(4),
    formula: 'Offset_noflow = (1/ln10) * 2 t_dprime / t_prime^3, t_prime = (1/2)dlnL/du - 1/2, t_dprime = (1/2)d2lnL/du2',
  },
  fullOffset: {
    closedFormLog10: +CLOSED_FULL_OFFSET.toFixed(6), // ~0.017145
    measuredLog10: +MEAS_FULL_OFFSET.toFixed(6), // ~0.016757 (imp-96405 fullModel offset)
    relError: +Math.abs((CLOSED_FULL_OFFSET - MEAS_FULL_OFFSET) / MEAS_FULL_OFFSET).toFixed(4),
    inflVsHalfFlowLog10: +(inflVsHalfFlow / Math.LN10).toFixed(6), // ~0.018871
    halfPointShiftLog10: +(halfShiftFlow / Math.LN10).toFixed(6), // ~ -0.001727
    formula: 'Offset_full = (1/ln10)*(2 t_tilde_dprime / t_tilde_prime^3 + ln(1+r)/t_prime), r = E_flow/E_trunc',
  },
  eflowShare: {
    closed: +CLOSED_EFLOW_SHARE.toFixed(3), // ~0.549
    measured: +MEAS_EFLOW_SHARE.toFixed(3), // ~0.539 (imp-96405 eflowShareOfOffset)
  },
  finding: {
    flow_off_is_essentially_exact:
      'The L(N)-running part is Offset_noflow = (1/ln10) 2 t_dprime / t_prime^3 with t_prime, ' +
      't_dprime the running slope/curvature of ln(ln T0) at the crossover; it reproduces the ' +
      'imp-96405 measured flow-off offset 0.007728 to 0.15 percent (closed 0.007740) and lands ' +
      'inside the imp-96405 M4 flow-off perturbation band [+0.0068, +0.0088].',
    full_offset_is_a_first_order_flow_correction:
      'Adding E_flow as an effective extra truncation r = E_flow/E_trunc (t_tilde = t - ln(1+r)) ' +
      'plus the half-point shift ln(1+r)/t_prime gives the full closed form 0.017145 vs measured ' +
      '0.016757 (~2.3 percent); the residual is the higher-order flow terms dropped past first ' +
      'order in r. E_flow share closed 0.549 vs measured 0.539.',
    conclusion:
      'The imp-96405 +0.0168 offset is NOT an unresolved residual: it is a closed form in the ' +
      'height-map running derivatives d(ln L)/du, d^2(ln L)/du^2 and the first-order E_flow/E_trunc ' +
      'surplus at the crossover. Changes no bound; C_mb GUE-conditional untouched; NO QED.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). The imp-96405 M3 sub-leading ' +
    'knee/crossover offset HAS a closed form in the imp-3220/imp-3406 sub-terms. Writing the ' +
    'conditional share as a logistic in the variable t = ln(E_coll/E_trunc), the exact-logistic ' +
    'form is broken only by the slowly-varying L(N) = ln T0(N) and the nonzero E_flow. The ' +
    'inflection condition (1 - 2 sigma)(t_prime)^2 + t_dprime = 0 expanded about the sigma = 1/2 ' +
    'crossover gives the flow-off offset (1/ln10) 2 t_dprime / t_prime^3 with t_prime = ' +
    '(1/2)d(lnL)/du - 1/2 and t_dprime = (1/2)d^2(lnL)/du^2 -- reproducing the imp-96405 measured ' +
    'flow-off offset 0.007728 to 0.15 percent (closed 0.007740), inside the M4 band [+0.0068, ' +
    '+0.0088]. Carrying E_flow as an effective extra truncation r = E_flow/E_trunc gives the full ' +
    'offset (1/ln10)(2 t_tilde_dprime/t_tilde_prime^3 + ln(1+r)/t_prime) = 0.017145 vs measured ' +
    '0.016757 (~2.3 percent), E_flow share 0.549 vs 0.539. So the +0.0168 gap is set by the ' +
    'height-map running derivatives plus a first-order flow surplus, not an accident. Component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96405 (M3 offset decomposition: +0.0168, ~54 percent E_flow); imp-96388 (OLS-exponent ' +
    'knee estimator); imp-33723 (closed-form crossover N_cross ~ 3.28e9); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping.',
});

export default IMP96423_KNEE_OFFSET_CLOSED_FORM;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96423_ASSERTIONS = [
  {
    id: 'imp96423-flow-off-closed-form-matches',
    description: 'the flow-off closed form 2 t_dprime/t_prime^3 reproduces the imp-96405 measured flow-off offset',
    holds: () =>
      Math.abs(CLOSED_NOFLOW_OFFSET - MEAS_NOFLOW_OFFSET) < 5e-4 &&
      CLOSED_NOFLOW_OFFSET > 0.0068 &&
      CLOSED_NOFLOW_OFFSET < 0.0088,
  },
  {
    id: 'imp96423-full-closed-form-matches',
    description: 'the full closed form (flow correction added) reproduces the imp-96405 measured full offset to a few percent',
    holds: () =>
      Math.abs(CLOSED_FULL_OFFSET - MEAS_FULL_OFFSET) < 1e-3 &&
      CLOSED_FULL_OFFSET > 0.015 &&
      CLOSED_FULL_OFFSET < 0.02,
  },
  {
    id: 'imp96423-eflow-share-matches',
    description: 'the closed-form E_flow share of the offset matches the imp-96405 measured ~54 percent',
    holds: () => Math.abs(CLOSED_EFLOW_SHARE - MEAS_EFLOW_SHARE) < 0.05 && CLOSED_EFLOW_SHARE > 0.3 && CLOSED_EFLOW_SHARE < 0.8,
  },
  {
    id: 'imp96423-tprime-near-minus-half',
    description: 'the logistic slope t_prime sits near -1/2 (E_coll power law) with a small positive L-running correction',
    holds: () => tPrime < -0.4 && tPrime > -0.5 && dlnL > 0,
  },
  {
    id: 'imp96423-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96423_KNEE_OFFSET_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP96423_KNEE_OFFSET_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP96423_KNEE_OFFSET_CLOSED_FORM.verdict),
  },
];

for (const a of IMP96423_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96423-knee-offset-closed-form assertion failed: ${a.id}`);
  }
}
