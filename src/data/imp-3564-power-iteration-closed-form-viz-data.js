/**
 * @module imp-3564-power-iteration-closed-form-viz-data
 * @fileoverview imp-3564 -- lightweight, import-light literal data for a
 *   visualization of the imp-3530 closed-form fit of the power-iteration
 *   budget-to-1e-9 ladder against the measured N=160..800 rungs, and the
 *   underlying gap-decay power law -log rho(N) = A * N^q it rests on.
 *
 *   imp-3530 (offline assertion module, re-runs the Lanczos/Jacobi
 *   eigensolver at every rung) FIT the imp-3505 budget ladder to
 *   budget(N) = C * log(1/eps) / (-log rho(N)), then fit the gap decay
 *   itself to a power law -log rho(N) = A * N^q (q ~ -1.97, near the -2
 *   skew-Toeplitz section-gap heuristic), giving the combined closed form
 *   budget(N) ~ K * N^2 and a-priori extrapolated budgets at untested
 *   N = 1000/1200/1600.
 *
 *   Values below are baked reference literals reproduced from a one-off
 *   evaluation of imp-3530-power-iteration-budget-closed-form-fit.js (its
 *   `measured.rungs` / `measured.prefactorC` / `measured.gapExponentQ` /
 *   `measured.gapCoeffA` / `measured.closedFormK` / `measured.extrapolation`
 *   fields); this module does NOT re-run that computation, so importing it
 *   into a page costs nothing at load time.
 *
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the source measurement)
 *   @see imp-3530-power-iteration-budget-closed-form-fit.js (the closed-form fit computed here)
 *   @see imp-3540-power-iteration-budget-viz-data.js (the raw ladder, without the fit overlay)
 *
 *   Ticket: imp-3564 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Measured rungs: N, the imp-3505 budget-to-1e-9 ladder value, and the
// power-iteration gap-decay rate -log rho(N) = lambda_3(N) / lambda_1(N).
export const IMP3564_MEASURED_RUNGS = Object.freeze([
  { N: 160, budgetMeasured: 520, logInvRho: 0.02299479449754021 },
  { N: 240, budgetMeasured: 1040, logInvRho: 0.010412511115183086 },
  { N: 320, budgetMeasured: 1040, logInvRho: 0.005912775566738589 },
  { N: 400, budgetMeasured: 2080, logInvRho: 0.003805915043645302 },
  { N: 480, budgetMeasured: 4160, logInvRho: 0.0026531601039376093 },
  { N: 640, budgetMeasured: 4160, logInvRho: 0.0014996127973934837 },
  { N: 800, budgetMeasured: 6250, logInvRho: 0.0009625430796462755 },
]);

// Fitted convergence-rate prefactor: budget(N) ~ C * log(1/eps) / (-log rho(N)).
export const IMP3564_PREFACTOR_C = 0.3175639872822732;

// Fitted gap-decay power law: -log rho(N) = A * N^q.
export const IMP3564_GAP_EXPONENT_Q = -1.9724726354460467;
export const IMP3564_GAP_COEFF_A = 514.7122961281697;

// Combined closed-form budget predictor: budget(N) = K * N^(-q) ~ K * N^2.
export const IMP3564_CLOSED_FORM_K = 0.012785711509507976;

// Worst multiplicative deviation of the predictor from the measured ladder.
export const IMP3564_MAX_FIT_RATIO_DEV = 1.8169519063221509;

// A-priori extrapolated budgets at untested N, from the closed form alone.
export const IMP3564_EXTRAPOLATION = Object.freeze([
  { N: 1000, budgetPredicted: 10571.650754842714 },
  { N: 1200, budgetPredicted: 15146.965924757773 },
]);

export function closedFormBudget(N) {
  return IMP3564_CLOSED_FORM_K * Math.pow(N, -IMP3564_GAP_EXPONENT_Q);
}

export function closedFormGapDecay(N) {
  return IMP3564_GAP_COEFF_A * Math.pow(N, IMP3564_GAP_EXPONENT_Q);
}
