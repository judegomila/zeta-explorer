/**
 * @module imp-35137-step2-rigorous-upgrade-gap-viz-data
 * @fileoverview imp-35137 -- lightweight, import-light literal data for a
 *   three-obligation OPEN-status panel visualizing the imp-35058 Step-2
 *   (backward-Dyson-ODE) numerical-to-rigorous scoping map: G-step-error,
 *   G-gronwall, and G-interval-enclosure, each with its need/machinery
 *   summary and closed:false state, plus the no-bound caveat.
 *
 *   Values below are baked reference literals reproduced from the
 *   LAMBDA_CHAIN_STEPS Step 2 `rigorousUpgradeGap` field in
 *   lambda-roadmap.js (added by imp-35058). This module does NOT import
 *   lambda-roadmap.js or the surrounding Odlyzko-zeros/Dyson dependency
 *   chain, so importing it into a page costs nothing at load time.
 *
 *   @see lambda-roadmap.js LAMBDA_CHAIN_STEPS step 2 rigorousUpgradeGap (source field, imp-35058)
 *   @see imp-35181 (pending: honest-status card wiring this same field onto the roadmap UI)
 *
 *   Ticket: imp-35137 (ux, medium). Visualization-DATA only; none of the
 *   three obligations is closed; discharging all three would change no
 *   Lambda bound on its own (Step 2 feeds the E(N) bridge constants, not
 *   the headline inequality); no refereed bound is changed; NO QED.
 */

export const IMP35137_OBLIGATIONS = Object.freeze([
  {
    key: 'G-step-error',
    label: 'RK4/DP5 step-budget truncation bound',
    need:
      'A CERTIFIED a-priori bound on the local + accumulated truncation ' +
      'error of the integrator as a function of step dt and N, not merely ' +
      'the empirical two-method gap |t_c_RK4 - t_c_DP5|.',
    machinery: 'imp-2466 (DP5 cross-integrator), imp-357 cross-integrator check',
    closed: false,
  },
  {
    key: 'G-gronwall',
    label: 'Gronwall stability constant, certified and N-uniform',
    need:
      'An explicit, N-uniform Gronwall propagation constant controlling how ' +
      'zero-ordinate input error and per-step error amplify along the ' +
      'backward flow up to the collision front.',
    machinery: 'backward-flow-stability-gronwall.js (imp-2520)',
    closed: false,
  },
  {
    key: 'G-interval-enclosure',
    label: 'Interval-arithmetic enclosure of the flow, N-uniform',
    need:
      'A rigorous interval-arithmetic (or ball-arithmetic) enclosure ' +
      '[t_c_lo(N), t_c_hi(N)] valid at the measured N and extensible with a ' +
      'documented N-dependence.',
    machinery: 'imp-362 (interval RK4 witness, LAMBDA_INTERVAL_DYSON)',
    closed: false,
  },
]);

export const IMP35137_GAP_SUMMARY = Object.freeze({
  step: 2,
  grade: 'numerical',
  wouldRequire: 'rigorous',
  status: 'OPEN — none of the three obligations below is closed',
  caveat:
    'Discharging all three would elevate Step 2 to rigorous but changes NO ' +
    'Lambda bound on its own: Step 2 feeds the E(N) bridge constants (Step 4), ' +
    'not the headline inequality. This panel is a scoping map only.',
  by: 'imp-35058',
});

export const IMP35137_OBLIGATION_COUNT = IMP35137_OBLIGATIONS.length; // 3
export const IMP35137_CLOSED_COUNT = IMP35137_OBLIGATIONS.filter((o) => o.closed).length; // 0
