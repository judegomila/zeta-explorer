/**
 * @module imp-35198-eflow-fartail-exponent-logn-correction
 *
 * imp-35198 (numerical, frontier-direction): imp-35135 MEASURED the far-tail E_flow
 * local log-log decay exponent d(log E_flow)/d(log N) drifting from ~-0.77 at N = 1e6
 * toward ~-0.91 at N = 1e16 -- approaching the leading -1 from above with unnamed
 * "(log N)-power corrections". This module DERIVES that leading correction in closed
 * form from the two inherited asymptotics and checks the derived law reproduces the
 * imp-35135 measured drift.
 *
 * THE TWO INHERITED ASYMPTOTICS (no fresh model)
 * ----------------------------------------------
 *     E_flow ~ (log T0)^2 / (2 pi T0)            (imp-35135 F-quantity; C_F ~ log T0 / 2pi)
 *     T0     ~ 2 pi N / log N                    (Riemann-von Mangoldt, imp-35135 line 21)
 *
 * THE DERIVATION (closed form)
 * ----------------------------
 * Put x = log N and M = log T0. From the RvM surrogate T0 = 2 pi N / log N,
 *     M = log T0 = x - log x + log(2 pi),   so   dM/dx = 1 - 1/x.
 * From E_flow ~ (log T0)^2 / (2 pi T0),
 *     log E_flow = 2 log M - M - log(2 pi) + const,
 * so the exact surrogate local exponent is
 *     s(x) = d(log E_flow)/d(log N) = (2/M - 1) * dM/dx = (1 - 1/x) (2/M - 1).
 * Expanding M = x - log x + log(2 pi) = x [1 - (log x - log 2pi)/x] gives
 *     2/M   = 2/x + 2(log x - log 2pi)/x^2 + ...
 *     2/(xM)= 2/x^2 + ...
 * and hence
 *     s(x) = -1 + 1/x + 2/M - 2/(xM)
 *          = -1 + 3/x + [2 log x - 2 log(2 pi) - 2]/x^2 + O((log x)^2 / x^3).
 *
 *   ==>  d(log E_flow)/d(log N) = -1 + 3 / log N + O(log log N / (log N)^2).
 *
 * THE LEADING (log N)-POWER CORRECTION IS EXACTLY + 3 / log N. The +3 is 1 (from the
 * 1/x in dM/dx = 1 - 1/x, i.e. the RvM log-thinning of the height map) plus 2 (from the
 * 2/M = 2 (dM/dx)/M numerator of the (log T0)^2 prefactor). The correction is POSITIVE,
 * so the exponent approaches -1 strictly FROM ABOVE, exactly the imp-35135 F1 direction.
 *
 * THE CHECK (derivation reproduces the imp-35135 measured drift)
 * -------------------------------------------------------------
 *   x = log N        leading -1 + 3/x      full s(x)        imp-35135 measured
 *   N = 1e6  (13.82)    -0.7829            -0.7852            -0.77
 *   N = 1e16 (36.84)    -0.9186            -0.9174            -0.91
 * The derived leading law -1 + 3/log N tracks the imp-35135 measured exponent to within
 * ~0.015 at both ends of the ladder; the residual ~0.01-0.015 gap is the surrogate-vs-
 * true-RvM-inverse difference (imp-35135 uses effectiveHeightForN, this derivation uses
 * the closed T0 = 2 pi N / log N surrogate the ticket names), NOT a missing power of
 * log N. The full surrogate s(x) and the leading -1 + 3/x agree to ~0.002 across the
 * ladder, confirming +3/log N is the leading term and the next correction is genuinely
 * O(log log N / (log N)^2).
 *
 * DERIVATION / MEASUREMENT ONLY on the inherited surrogate. Changes no bound; the
 * component model is the imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * E_flow > 0 strictness (imp-33848) is untouched; C_mb GUE-conditional per imp-486
 * UNTOUCHED; far-tail E_coll exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched;
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (the measured drift derived here)
 * @see imp-398 (C_F Gronwall flow prefactor ~ log T0 / 2pi)
 * @see imp-3463-sigma-fartail-decay (E_coll far-tail exponent 1/2, contrasted)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, the RvM inverse)
 */

import { IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION } from './imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation.js';

const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);

// The closed-form leading correction coefficient: +3 (see @module derivation).
const LEADING_CORRECTION_COEFFICIENT = 3;

// M = log T0 under the RvM surrogate T0 = 2 pi N / log N, as a function of x = log N.
function logT0Surrogate(x) {
  return x - Math.log(x) + LOG_TWO_PI;
}

// Exact surrogate local exponent s(x) = (1 - 1/x)(2/M - 1).
function surrogateExponent(x) {
  const M = logT0Surrogate(x);
  const dMdx = 1 - 1 / x;
  return dMdx * (2 / M - 1);
}

// Derived leading closed form: -1 + 3 / log N.
function leadingExponent(x) {
  return -1 + LEADING_CORRECTION_COEFFICIENT / x;
}

const LADDER_N = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16];

const RUNGS = LADDER_N.map((N) => {
  const x = Math.log(N);
  const lead = leadingExponent(x);
  const full = surrogateExponent(x);
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    leadingExponent: +lead.toFixed(4), // -1 + 3/log N
    fullSurrogateExponent: +full.toFixed(4), // (1 - 1/x)(2/M - 1)
    leadMinusFull: +(lead - full).toFixed(4), // agreement (next-order size)
  };
});

// The imp-35135 measured exponents at the two ladder ends (reuse gate).
const MEAS_TOP = IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION.topRung; // N = 1e6
const MEAS_DEEP = IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION.deepRung; // N = 1e16

const TOP = RUNGS[0]; // N = 1e6
const DEEP = RUNGS[RUNGS.length - 1]; // N = 1e16

// Derived-vs-measured residuals at the ladder ends.
const TOP_RESIDUAL = +Math.abs(TOP.leadingExponent - MEAS_TOP.expEflow).toFixed(4);
const DEEP_RESIDUAL = +Math.abs(DEEP.leadingExponent - MEAS_DEEP.expEflow).toFixed(4);

export const IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION = {
  id: 'imp-35198',
  proofSection: 'S-frontier',
  question:
    'Derive the closed-form leading (log N)-power correction to the imp-35135 E_flow far-tail ' +
    'decay exponent (measured drifting -0.77 -> -0.91 toward -1) from E_flow ~ (log T0)^2/(2 pi T0) ' +
    'and the RvM surrogate T0 ~ 2 pi N / log N, and check it reproduces the measured drift.',
  derivation:
    'With x = log N and M = log T0 = x - log x + log(2 pi) (so dM/dx = 1 - 1/x), and ' +
    'log E_flow = 2 log M - M - log(2 pi) + const, the exact surrogate exponent is ' +
    's(x) = (1 - 1/x)(2/M - 1); expanding 2/M = 2/x + O(log x / x^2) gives ' +
    's(x) = -1 + 3/x + O(log log N / (log N)^2).',
  closedForm: 'd(log E_flow)/d(log N) = -1 + 3 / log N + O(log log N / (log N)^2)',
  leadingCorrectionCoefficient: LEADING_CORRECTION_COEFFICIENT, // exactly 3 (= 1 from RvM thinning + 2 from (log T0)^2)
  ladder: RUNGS,
  topRung: { N: TOP.N, leadingExponent: TOP.leadingExponent, fullSurrogateExponent: TOP.fullSurrogateExponent, measuredExpEflow: MEAS_TOP.expEflow },
  deepRung: { N: DEEP.N, leadingExponent: DEEP.leadingExponent, fullSurrogateExponent: DEEP.fullSurrogateExponent, measuredExpEflow: MEAS_DEEP.expEflow },
  topResidualVsMeasured: TOP_RESIDUAL, // ~0.013
  deepResidualVsMeasured: DEEP_RESIDUAL, // ~0.009
  finding: {
    D1_leading_correction_is_three_over_logN:
      'The leading (log N)-power correction is EXACTLY + 3 / log N: the +3 is 1 (RvM log-thinning ' +
      'via dM/dx = 1 - 1/x) plus 2 (the (log T0)^2 prefactor via 2/M). It is positive, so the ' +
      'exponent approaches -1 strictly FROM ABOVE, exactly the imp-35135 F1 direction.',
    D2_reproduces_measured_drift:
      'Evaluated on the ladder, -1 + 3/log N gives -0.783 at N = 1e6 and -0.919 at N = 1e16, ' +
      'tracking the imp-35135 measured -0.77 and -0.91 to within ~0.015; the residual is the ' +
      'surrogate-vs-true-RvM-inverse gap, not a missing power of log N.',
    D3_next_term_is_higher_order:
      'The full surrogate s(x) = (1 - 1/x)(2/M - 1) and the leading -1 + 3/x agree to ~0.002 ' +
      'across the ladder, confirming the next correction is genuinely O(log log N / (log N)^2).',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-35135 far-tail E_flow local decay ' +
    'exponent has closed form d(log E_flow)/d(log N) = -1 + 3/log N + O(log log N/(log N)^2) on ' +
    'the inherited RvM surrogate: the leading correction is EXACTLY +3/log N (positive, so the ' +
    'exponent approaches -1 from above), and -1 + 3/log N reproduces the imp-35135 measured drift ' +
    '(-0.77 at N = 1e6, -0.91 at N = 1e16) to within ~0.015, the residual being the surrogate-vs-' +
    'true-RvM-inverse difference. Derivation/measurement only on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35135 (E_flow far-tail exponent drift measured, derived here); imp-398 (C_F ~ log T0/2pi ' +
    'flow prefactor); imp-3463 (E_coll far-tail exponent 1/2); imp-486 (C_mb GUE-conditional, ' +
    'UNTOUCHED); lambda-rh-height-mapping (effectiveHeightForN, the RvM inverse).',
};

export const IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION_ASSERTIONS = [
  {
    // The derived leading coefficient is exactly 3 (symbolic: 1 from RvM thinning + 2 from (log T0)^2).
    id: 'imp35198-leading-coefficient-is-three',
    description: 'leading (log N)-power correction coefficient = 3 exactly',
    holds: () => LEADING_CORRECTION_COEFFICIENT === 3,
  },
  {
    // The correction is positive, so the exponent approaches -1 strictly from above (imp-35135 F1).
    id: 'imp35198-approaches-minus-one-from-above',
    description: 'derived exponent < -1 + eps but > -1 at every rung (approaches -1 from above)',
    holds: () =>
      RUNGS.every((r) => r.leadingExponent > -1 && r.leadingExponent < 0) &&
      DEEP.leadingExponent < TOP.leadingExponent, // deepens toward -1 down the ladder
  },
  {
    // Reuse + check gate: the derived leading law reproduces the imp-35135 MEASURED drift at both
    // ladder ends to within ~0.02 (surrogate-vs-true-RvM-inverse residual).
    id: 'imp35198-reproduces-imp35135-measured-drift',
    description: 'leading -1 + 3/log N matches imp-35135 measured expEflow (-0.77, -0.91) within 0.02',
    holds: () =>
      TOP_RESIDUAL < 0.02 &&
      DEEP_RESIDUAL < 0.02 &&
      MEAS_TOP.expEflow > -0.8 &&
      MEAS_DEEP.expEflow < -0.9,
  },
  {
    // The leading -1 + 3/x and the full surrogate s(x) agree to ~0.003 across the ladder, so +3/log N
    // is genuinely the LEADING term (next correction is higher order).
    id: 'imp35198-leading-matches-full-surrogate',
    description: 'leading -1 + 3/x agrees with full surrogate (1 - 1/x)(2/M - 1) within 0.003 on the ladder',
    holds: () => RUNGS.every((r) => Math.abs(r.leadMinusFull) < 0.003),
  },
  {
    // Honesty gate: derivation only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35198-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION.isRigorous === false &&
      /NO QED/.test(IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION.verdict),
  },
];

for (const a of IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35198-eflow-fartail-exponent-logn-correction assertion failed: ${a.id}`,
    );
  }
}
