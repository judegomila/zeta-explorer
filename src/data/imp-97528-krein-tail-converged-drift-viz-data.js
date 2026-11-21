/**
 * @module imp-97528-krein-tail-converged-drift-viz-data
 *
 * imp-97528 (content): import-light viz-data leaf visualizing the imp-97497
 * tail-convergence of the imp-97483 well-capture scalar optimum:
 *
 *   (a) the truncation drift ladder tot(T) at T = 200/300/400/800 rising
 *       toward the tail-converged limit tot(inf) = 7.53, with the shrinking
 *       tail residual tot(inf) - tot(T) at each T;
 *   (b) the exact/tail split-point self-consistency at T0 = 600/800/1000 --
 *       the exact core grows (7.132 -> 7.271) while the analytic tail shrinks
 *       (0.403 -> 0.264) and the sum is invariant at tot(inf) = 7.5352.
 *
 * PRESENTATION ONLY. All points and constants are reused verbatim from
 * imp-97497. Establishes no operator positivity; changes no bound;
 * interval-rigorous reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97497-krein-welloptimum-tail-converged.js (the measured drift ladder, split-point table, and verdict)
 *
 * Ticket: imp-97528 (content, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97497_DRIFT_LADDER,
  IMP97497_SPLIT_POINT_CONVERGENCE,
  IMP97497_TAIL_CONVERGED_OPTIMUM,
  IMP97497_CSHARP_UPPER_BRACKET,
  IMP97497_VERDICT,
} from './imp-97497-krein-welloptimum-tail-converged.js';

export const IMP97528_DRIFT_LADDER = IMP97497_DRIFT_LADDER;
export const IMP97528_SPLIT_POINT_CONVERGENCE = IMP97497_SPLIT_POINT_CONVERGENCE;
export const IMP97528_TAIL_CONVERGED_OPTIMUM = IMP97497_TAIL_CONVERGED_OPTIMUM;
export const IMP97528_CSHARP_UPPER_BRACKET = IMP97497_CSHARP_UPPER_BRACKET;

export const IMP97528_VERDICT = Object.freeze({
  ticket: 'imp-97528',
  sourceTicket: 'imp-97497',
  claim:
    'charts the imp-97497 tail-convergence of the imp-97483 well-capture scalar optimum: the truncation drift ' +
    'tot(T) = 6.56/6.83/6.97/7.22 at T=200/300/400/800 rising toward the tail-converged limit tot(inf)=7.53, and ' +
    'the exact/tail split-point self-consistency at T0=600/800/1000 where exact grows and tail shrinks but the ' +
    'sum stays fixed at 7.5352.',
  pointsReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97528_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97528_ASSERTIONS = [
  {
    id: 'imp97528-drift-ladder-rises-toward-tail-converged-limit',
    holds: () => {
      const tots = IMP97528_DRIFT_LADDER.map((p) => p.tot);
      const residuals = IMP97528_DRIFT_LADDER.map((p) => p.tailResidual);
      const monotoneUp = tots.every((v, i) => i === 0 || v > tots[i - 1]);
      const monotoneDownResidual = residuals.every((v, i) => i === 0 || v < residuals[i - 1]);
      return (
        IMP97528_DRIFT_LADDER.length === 4 &&
        monotoneUp &&
        monotoneDownResidual &&
        tots[tots.length - 1] < IMP97528_TAIL_CONVERGED_OPTIMUM.totInf
      );
    },
    why: 'the drift ladder must rise monotonically with T while the tail residual shrinks monotonically, always staying below the tail-converged limit 7.53.',
  },
  {
    id: 'imp97528-split-point-sums-to-fixed-limit',
    holds: () =>
      IMP97528_SPLIT_POINT_CONVERGENCE.length === 3 &&
      IMP97528_SPLIT_POINT_CONVERGENCE.every((r) => Math.abs(r.exact + r.tail - r.totInf) < 1e-3) &&
      IMP97528_SPLIT_POINT_CONVERGENCE.every((r) => Math.abs(r.totInf - 7.5352) < 1e-3) &&
      IMP97528_SPLIT_POINT_CONVERGENCE[0].exact < IMP97528_SPLIT_POINT_CONVERGENCE[2].exact &&
      IMP97528_SPLIT_POINT_CONVERGENCE[0].tail > IMP97528_SPLIT_POINT_CONVERGENCE[2].tail,
    why: 'the charted split-point table must reproduce the imp-97497 self-consistency: exact + tail sums to the same limit at each T0, with exact growing and tail shrinking as T0 increases.',
  },
  {
    id: 'imp97528-measurement-only-no-qed',
    holds: () =>
      IMP97528_TAIL_CONVERGED_OPTIMUM.totInf === 7.53 &&
      IMP97528_TAIL_CONVERGED_OPTIMUM.totInf > IMP97528_TAIL_CONVERGED_OPTIMUM.informalEstimate &&
      IMP97528_CSHARP_UPPER_BRACKET === 0.582 &&
      IMP97528_VERDICT.pointsReusedVerbatim === true &&
      IMP97528_VERDICT.operatorPositivityProved === false &&
      IMP97528_VERDICT.boundMoves === false &&
      IMP97528_VERDICT.qed === false &&
      IMP97497_VERDICT.qed === false,
    why: 'presentation only: points and constants reused verbatim from imp-97497; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97528_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97528-krein-tail-converged-drift-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
