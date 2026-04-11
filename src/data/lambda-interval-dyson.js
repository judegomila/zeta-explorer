/**
 * imp-362: data-layer manifest for the interval-arithmetic Dyson integrator.
 *
 * The actual numerical work (interval primitives, dysonDriftInterval,
 * rk4IntervalStep, backwardCollisionInterval, and the PATH_C_BASELINE_FIT
 * witness table) lives in src/math/interval-dyson-integrator.mjs. That file
 * uses the .mjs extension so it can be run directly as a Node script
 * (node src/math/interval-dyson-integrator.mjs) during integrator
 * development. This file is the thin data-layer wrapper that re-exports
 * the LAMBDA_INTERVAL_DYSON record so the Vite build picks it up and the
 * assertion registry can import it like any other data module.
 *
 * Scope and honest limitation: JavaScript does not expose IEEE 754
 * directed-rounding modes, so the integrator emulates directed rounding
 * with one-ULP outward inflation on every Float64 operation. This is
 * strictly weaker than true Arb / MPFI / CAPD interval arithmetic.
 * Witness table shows 4 of 5 PATH_C_BASELINE_FIT rows yield a closed
 * bracket with width strictly smaller than the 0.01 heuristic; the N =
 * 2458 row is out of scope because ZETA_ZEROS bundles only 870 zeros.
 * Full scope tripwires and open-work items are recorded on the
 * LAMBDA_INTERVAL_DYSON record itself.
 */

import { LAMBDA_INTERVAL_DYSON } from '../math/interval-dyson-integrator.mjs';

export { LAMBDA_INTERVAL_DYSON };

export const LAMBDA_INTERVAL_DYSON_ASSERTIONS = [
  {
    id: 'imp362-at-least-one-closed-bracket',
    holds: () =>
      LAMBDA_INTERVAL_DYSON.witness.some(
        (r) => r.reason === 'gap-lower-bound-nonpositive',
      ),
    why:
      'At least one PATH_C_BASELINE_FIT row must close its interval ' +
      'bracket (reason = gap-lower-bound-nonpositive). If every row ' +
      'exhausts the step budget or errors out, the interval integrator ' +
      'has not actually produced a certified collision time at any N ' +
      'and the verdict is vacuous.',
  },
  {
    id: 'imp362-closed-brackets-have-positive-lower-bound',
    holds: () =>
      LAMBDA_INTERVAL_DYSON.witness
        .filter((r) => r.reason === 'gap-lower-bound-nonpositive')
        .every((r) => typeof r.t_c_lo === 'number' && r.t_c_lo > 0),
    why:
      'Every CLOSED bracket must have t_c_lo strictly greater than zero. ' +
      'A lower bound of 0 would mean the interval integrator cannot ' +
      'distinguish "collision at t = 0" from "collision at some small ' +
      'positive t", which is the exact failure mode the ticket is meant ' +
      'to rule out.',
  },
  {
    id: 'imp362-at-least-one-row-narrower-than-heuristic',
    holds: () =>
      LAMBDA_INTERVAL_DYSON.witness.some(
        (r) =>
          r.reason === 'gap-lower-bound-nonpositive' &&
          typeof r.width === 'number' &&
          r.width < 0.01,
      ),
    why:
      'At least one closed bracket must have width strictly less than ' +
      'the 0.01 heuristic pm currently absorbed into the Path C Lambda ' +
      'bound. Otherwise the interval integrator is not an improvement ' +
      'over the heuristic at any N and the verdict is merely ' +
      'methodological, not quantitative.',
  },
  {
    id: 'imp362-verdict-status-pinned',
    holds: () =>
      LAMBDA_INTERVAL_DYSON.verdict.status ===
      'certified-interval-narrower-than-heuristic',
    why:
      'The verdict status must be certified-interval-narrower-than- ' +
      'heuristic. Any drift to certified-bracket-wider-than-heuristic or ' +
      'no-closed-bracket means the integrator has regressed and the ' +
      'imp-362 deliverable has slipped.',
  },
  {
    id: 'imp362-limitation-documented',
    holds: () =>
      typeof LAMBDA_INTERVAL_DYSON.limitation === 'string' &&
      LAMBDA_INTERVAL_DYSON.limitation.includes('ULP') &&
      LAMBDA_INTERVAL_DYSON.limitation.includes('directed rounding'),
    why:
      'HONEST SCOPE TRIPWIRE: the JavaScript one-ULP inflation limitation ' +
      'MUST remain documented on the exported record. Removing this field ' +
      'or rewording it to drop the ULP / directed-rounding disclosure ' +
      'would be a silent regression on the ticket scope.',
  },
];
