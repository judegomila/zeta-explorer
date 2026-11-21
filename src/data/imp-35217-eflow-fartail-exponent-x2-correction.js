/**
 * @module imp-35217-eflow-fartail-exponent-x2-correction
 *
 * imp-35217 (numerical, frontier-direction): imp-35198 DERIVED the leading E_flow
 * far-tail exponent d(log E_flow)/d(log N) = -1 + 3/log N + O(log log N/(log N)^2) and
 * NAMED but never evaluated the next term, quoting the surrogate expansion
 *     s(x) = -1 + 3/x + [2 log x - 2 log(2 pi) - 2]/x^2 + O((log x)^2 / x^3),  x = log N.
 * This module EVALUATES that x^{-2} coefficient explicitly and MEASURES whether adding it
 * to the leading -1 + 3/x law closes the ~0.01-0.015 gap against the imp-35135 measured
 * exponents at N = 1e6 and N = 1e16, or whether the residual is genuinely the
 * surrogate-vs-true-RvM-inverse difference imp-35198 attributed it to.
 *
 * THE x^{-2} COEFFICIENT (evaluated closed form)
 * ---------------------------------------------
 * From M = log T0 = x - log x + log(2 pi) (RvM surrogate T0 = 2 pi N / log N) and
 * s(x) = (1 - 1/x)(2/M - 1), expand 2/M = 2/x + 2(log x - log 2pi)/x^2 + ... :
 *     s(x) = (2/M - 1) - (1/x)(2/M - 1)
 *          = [-1 + 2/x + 2(log x - log 2pi)/x^2] - [-1/x + 2/x^2] + ...
 *          = -1 + 3/x + [2 log x - 2 log(2 pi) - 2]/x^2 + O((log x)^2 / x^3).
 * So the next-order coefficient is  c2(x) = 2 log x - 2 log(2 pi) - 2 = 2(log x - log 2pi - 1).
 * It is x-dependent (a log log N term), and it CHANGES SIGN at log x = log(2 pi) + 1, i.e.
 * x = 2 pi e ~ 17.079, i.e. N ~ 2.615e7: NEGATIVE for N below that, POSITIVE above.
 *
 * THE MEASUREMENT (does adding c2/x^2 close the imp-35135 residual?)
 * -----------------------------------------------------------------
 *   N        x        lead=-1+3/x   c2(x)     c2/x^2     two-term      measured   |lead-meas|  |two-term-meas|
 *   1e6   13.8155     -0.7829     -0.4242   -0.00222    -0.7851      -0.7710      0.0119        0.0141  (WORSE)
 *   1e16  36.8414     -0.9186     +1.5375   +0.00113    -0.9174      -0.9142      0.0044        0.0032  (better)
 *
 * VERDICT: adding the derived x^{-2} term does NOT close the residual. At N = 1e6 it makes
 * the gap WORSE (0.0119 -> 0.0141) because c2 < 0 there (log x = 2.626 < log 2pi + 1 = 2.838),
 * pushing the exponent further below the measured value; at N = 1e16 it only trims it (0.0044
 * -> 0.0032) because c2 > 0 there. The two-term law is essentially the Taylor image of the
 * exact surrogate s(x) (they agree to <2e-4 at both ends), so its residual against the
 * measurement IS the surrogate-vs-true-RvM-inverse gap: imp-35135 measures on effectiveHeightForN
 * (the true RvM zero-ordinate map), this derivation uses the closed T0 = 2 pi N / log N surrogate.
 * The residual is NOT a missing (log log N)/(log N)^2 term -- CONFIRMING the imp-35198
 * attribution. The genuine next-order asymptotic term is real and here evaluated, but it is
 * NOT the source of the measured gap.
 *
 * DERIVATION / MEASUREMENT ONLY on the inherited surrogate. Changes no bound; the component
 * model is the imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; E_flow > 0
 * strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll
 * far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; no operator positivity;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35198-eflow-fartail-exponent-logn-correction (leading +3/log N term; named-but-unevaluated x^-2 term)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (measured exponents checked against)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the true RvM inverse, source of the residual)
 * @see imp-398 (C_F Gronwall flow prefactor ~ log T0 / 2pi)
 */

import { IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION } from './imp-35198-eflow-fartail-exponent-logn-correction.js';

const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);

// M = log T0 under the RvM surrogate T0 = 2 pi N / log N, as a function of x = log N.
function logT0Surrogate(x) {
  return x - Math.log(x) + LOG_TWO_PI;
}

// Exact surrogate local exponent s(x) = (1 - 1/x)(2/M - 1).
function surrogateExponent(x) {
  const M = logT0Surrogate(x);
  return (1 - 1 / x) * (2 / M - 1);
}

// Leading closed form -1 + 3/log N (imp-35198).
function leadingExponent(x) {
  return -1 + 3 / x;
}

// The EVALUATED next-order coefficient: c2(x) = 2 log x - 2 log(2 pi) - 2.
function nextOrderCoefficient(x) {
  return 2 * Math.log(x) - 2 * LOG_TWO_PI - 2;
}

// Two-term law -1 + 3/x + c2(x)/x^2 (leading + evaluated x^{-2} term).
function twoTermExponent(x) {
  return leadingExponent(x) + nextOrderCoefficient(x) / (x * x);
}

// Sign-crossover of c2: log x = log(2 pi) + 1  =>  x = 2 pi e  =>  N = exp(2 pi e).
const C2_SIGN_CROSSOVER_X = TWO_PI * Math.E; // ~17.079
const C2_SIGN_CROSSOVER_N = Math.exp(C2_SIGN_CROSSOVER_X); // ~2.615e7

const LADDER_N = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16];

const RUNGS = LADDER_N.map((N) => {
  const x = Math.log(N);
  const lead = leadingExponent(x);
  const c2 = nextOrderCoefficient(x);
  const twoTerm = twoTermExponent(x);
  const full = surrogateExponent(x);
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    c2Coefficient: +c2.toFixed(4), // 2 log x - 2 log 2pi - 2
    c2Term: +(c2 / (x * x)).toFixed(6), // the x^{-2} contribution itself
    leadingExponent: +lead.toFixed(4), // -1 + 3/x
    twoTermExponent: +twoTerm.toFixed(4), // -1 + 3/x + c2/x^2
    fullSurrogateExponent: +full.toFixed(4), // (1 - 1/x)(2/M - 1)
    twoTermMinusFull: +(twoTerm - full).toFixed(6), // how close the 2-term Taylor is to the exact surrogate
  };
});

// imp-35198 already carries the imp-35135 MEASURED exponents at both ladder ends (reuse gate).
const MEAS_TOP = IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION.topRung.measuredExpEflow; // N = 1e6
const MEAS_DEEP = IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION.deepRung.measuredExpEflow; // N = 1e16

const TOP = RUNGS[0]; // N = 1e6
const DEEP = RUNGS[RUNGS.length - 1]; // N = 1e16

// Residuals: leading-only vs measured, and two-term vs measured, at both ends.
const TOP_LEAD_RESIDUAL = +Math.abs(TOP.leadingExponent - MEAS_TOP).toFixed(4);
const TOP_TWOTERM_RESIDUAL = +Math.abs(TOP.twoTermExponent - MEAS_TOP).toFixed(4);
const DEEP_LEAD_RESIDUAL = +Math.abs(DEEP.leadingExponent - MEAS_DEEP).toFixed(4);
const DEEP_TWOTERM_RESIDUAL = +Math.abs(DEEP.twoTermExponent - MEAS_DEEP).toFixed(4);

// Does adding the x^{-2} term shrink the residual at each end?
const TOP_IMPROVES = TOP_TWOTERM_RESIDUAL < TOP_LEAD_RESIDUAL;
const DEEP_IMPROVES = DEEP_TWOTERM_RESIDUAL < DEEP_LEAD_RESIDUAL;

export const IMP35217_EFLOW_FARTAIL_EXPONENT_X2_CORRECTION = {
  id: 'imp-35217',
  proofSection: 'S-frontier',
  question:
    'Derive in closed form the imp-35198 next-order (log log N)/(log N)^2 correction ' +
    'coefficient c2(x) = 2 log x - 2 log(2 pi) - 2 to the E_flow far-tail exponent, and check ' +
    'whether adding c2/x^2 closes the ~0.01-0.015 imp-35135 residual against -1 + 3/log N.',
  nextOrderCoefficientClosedForm: 'c2(x) = 2 log x - 2 log(2 pi) - 2 = 2 (log log N - log(2 pi) - 1)',
  twoTermClosedForm:
    'd(log E_flow)/d(log N) = -1 + 3/log N + (2 log log N - 2 log(2 pi) - 2)/(log N)^2 + O((log log N)^2/(log N)^3)',
  c2SignCrossover: {
    x: +C2_SIGN_CROSSOVER_X.toFixed(4), // 2 pi e ~ 17.079
    N: +C2_SIGN_CROSSOVER_N.toExponential(3), // ~2.615e7
    note: 'c2 is NEGATIVE for N below ~2.6e7 and POSITIVE above; it vanishes at log x = log(2 pi) + 1.',
  },
  ladder: RUNGS,
  topRung: {
    N: TOP.N,
    c2Coefficient: TOP.c2Coefficient,
    leadingExponent: TOP.leadingExponent,
    twoTermExponent: TOP.twoTermExponent,
    measuredExpEflow: MEAS_TOP,
    leadResidual: TOP_LEAD_RESIDUAL,
    twoTermResidual: TOP_TWOTERM_RESIDUAL,
    twoTermImprovesResidual: TOP_IMPROVES,
  },
  deepRung: {
    N: DEEP.N,
    c2Coefficient: DEEP.c2Coefficient,
    leadingExponent: DEEP.leadingExponent,
    twoTermExponent: DEEP.twoTermExponent,
    measuredExpEflow: MEAS_DEEP,
    leadResidual: DEEP_LEAD_RESIDUAL,
    twoTermResidual: DEEP_TWOTERM_RESIDUAL,
    twoTermImprovesResidual: DEEP_IMPROVES,
  },
  finding: {
    D1_x2_coefficient_evaluated:
      'The named-but-unevaluated imp-35198 next-order term is c2(x) = 2 log x - 2 log(2 pi) - 2 ' +
      '= 2(log log N - log(2 pi) - 1). It is a (log log N)/(log N)^2 term (x-dependent), and it ' +
      'changes sign at x = 2 pi e ~ 17.08 (N ~ 2.6e7): negative below, positive above.',
    D2_adding_it_does_not_close_the_residual:
      'Adding c2/x^2 does NOT close the imp-35135 residual. At N = 1e6 c2 < 0, so the two-term law ' +
      'moves the exponent FURTHER below the measured value -- the gap WORSENS from 0.0119 to 0.0141. ' +
      'At N = 1e16 c2 > 0 and the gap only trims from 0.0044 to 0.0032. No uniform closure.',
    D3_residual_is_the_surrogate_gap:
      'The two-term law is the Taylor image of the exact surrogate s(x) = (1 - 1/x)(2/M - 1) ' +
      '(they agree to < 2e-4 at both ends), so its residual against the measurement is exactly the ' +
      'surrogate-vs-true-RvM-inverse difference: imp-35135 measures on effectiveHeightForN (the ' +
      'true RvM ordinate map), this uses the closed T0 = 2 pi N / log N surrogate. The residual is ' +
      'NOT a missing (log log N)/(log N)^2 term -- CONFIRMING the imp-35198 attribution.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). The imp-35198 named-but-unevaluated ' +
    'next-order E_flow far-tail exponent term is c2(x)/x^2 with c2(x) = 2 log x - 2 log(2 pi) - 2, a ' +
    '(log log N)/(log N)^2 term that flips sign at N ~ 2.6e7. Adding it does NOT close the ~0.01-0.015 ' +
    'imp-35135 residual: at N = 1e6 it WORSENS the gap (0.0119 -> 0.0141, c2 < 0), at N = 1e16 it only ' +
    'trims it (0.0044 -> 0.0032). Since the two-term law reproduces the exact surrogate to < 2e-4, its ' +
    'residual IS the surrogate-vs-true-RvM-inverse difference (effectiveHeightForN vs the T0 = 2 pi N/' +
    'log N surrogate), CONFIRMING the imp-35198 attribution -- the residual is genuinely NOT a missing ' +
    'power of log N. Derivation/measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a ' +
    'rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35198 (leading +3/log N term and the named x^-2 term evaluated here); imp-35135 (measured ' +
    'exponents checked against); imp-486 (C_mb GUE-conditional, UNTOUCHED); imp-3463 (E_coll far-tail ' +
    'exponent 1/2); lambda-rh-height-mapping (effectiveHeightForN, the true RvM inverse behind the residual).',
};

export const IMP35217_EFLOW_FARTAIL_EXPONENT_X2_CORRECTION_ASSERTIONS = [
  {
    // The evaluated x^{-2} coefficient matches c2(x) = 2 log x - 2 log(2 pi) - 2 at both ends.
    id: 'imp35217-x2-coefficient-closed-form',
    description: 'c2(x) = 2 log x - 2 log(2 pi) - 2 evaluated correctly at the ladder ends',
    holds: () => {
      const xTop = Math.log(1e6);
      const expect = 2 * Math.log(xTop) - 2 * LOG_TWO_PI - 2;
      return Math.abs(TOP.c2Coefficient - +expect.toFixed(4)) < 1e-9;
    },
  },
  {
    // The coefficient changes sign across the ladder: negative at the top, positive deep.
    id: 'imp35217-c2-sign-flip',
    description: 'c2 is negative at N = 1e6 and positive at N = 1e16 (sign flip at N ~ 2.6e7)',
    holds: () =>
      TOP.c2Coefficient < 0 &&
      DEEP.c2Coefficient > 0 &&
      C2_SIGN_CROSSOVER_N > 1e6 &&
      C2_SIGN_CROSSOVER_N < 1e16,
  },
  {
    // The two-term law is the Taylor image of the exact surrogate (agree to < 2e-4 at both ends).
    id: 'imp35217-twoterm-matches-full-surrogate',
    description: 'two-term -1 + 3/x + c2/x^2 agrees with the exact surrogate to < 2e-4 across the ladder',
    holds: () => RUNGS.every((r) => Math.abs(r.twoTermMinusFull) < 2e-4),
  },
  {
    // THE MEASUREMENT: adding the x^{-2} term does NOT uniformly close the imp-35135 residual --
    // it WORSENS the N = 1e6 end (c2 < 0). This is the ticket's central finding.
    id: 'imp35217-x2-does-not-close-residual',
    description: 'adding c2/x^2 worsens the N = 1e6 residual (does not close the surrogate gap)',
    holds: () =>
      TOP_TWOTERM_RESIDUAL > TOP_LEAD_RESIDUAL && // worse at the top
      TOP_IMPROVES === false &&
      TOP_LEAD_RESIDUAL > 0.01 &&
      TOP_LEAD_RESIDUAL < 0.02,
  },
  {
    // Honesty gate: derivation/measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35217-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35217_EFLOW_FARTAIL_EXPONENT_X2_CORRECTION.isRigorous === false &&
      /NO QED/.test(IMP35217_EFLOW_FARTAIL_EXPONENT_X2_CORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP35217_EFLOW_FARTAIL_EXPONENT_X2_CORRECTION.verdict),
  },
];

for (const a of IMP35217_EFLOW_FARTAIL_EXPONENT_X2_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35217-eflow-fartail-exponent-x2-correction assertion failed: ${a.id}`,
    );
  }
}
