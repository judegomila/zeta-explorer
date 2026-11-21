/**
 * @module imp-97505-krein-well-capture-tradeoff-viz-data
 *
 * imp-97505 (ux): import-light viz-data leaf visualizing the imp-97483
 * U-shaped well-capture vs far-field-cost trade-off curve for the
 * band-limited Krein minimiser at 2a = ln3, never charted by imp-97483
 * itself:
 *
 *   (a) captured negative int sigma_2^- |psi|^2, incurred positive
 *       int sigma_2^+ |psi|^2, and the total int sigma_2 |psi|^2, all vs
 *       the confinement radius R, showing the single interior minimum at
 *       R* = 3.35 where the two curves nearly cancel;
 *   (b) the optimum total (~6.83, converging ~7.3) against the measured
 *       c_sharp upper bracket (0.582), showing the ~12x gap that no radius
 *       closes.
 *
 * PRESENTATION ONLY. All points and constants are reused verbatim from
 * imp-97483. Establishes no operator positivity; changes no bound;
 * interval-rigorous reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97483-krein-well-capture-vs-farfield-cost-tradeoff.js (the measured trade-off curve, optimum, and verdict)
 *
 * Ticket: imp-97505 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97483_TRADEOFF_CURVE,
  IMP97483_OPTIMUM,
  IMP97483_CSHARP_UPPER_BRACKET,
  IMP97483_VERDICT,
} from './imp-97483-krein-well-capture-vs-farfield-cost-tradeoff.js';

export const IMP97505_CURVE = IMP97483_TRADEOFF_CURVE;
export const IMP97505_OPTIMUM = IMP97483_OPTIMUM;
export const IMP97505_CSHARP_UPPER_BRACKET = IMP97483_CSHARP_UPPER_BRACKET;

export const IMP97505_VERDICT = Object.freeze({
  ticket: 'imp-97505',
  sourceTicket: 'imp-97483',
  claim:
    'charts the imp-97483 U-shaped well-capture vs far-field-cost trade-off curve for the band-limited Krein ' +
    'minimiser at 2a=ln3: the captured negative, incurred positive, and total integrals vs confinement radius R ' +
    'cross to a single interior minimum at R*=3.35 (total ~6.83, converging ~7.3), still ~12x the measured ' +
    'c_sharp upper bracket 0.582 -- no radius closes the gap.',
  pointsReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97505_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97505_ASSERTIONS = [
  {
    id: 'imp97505-curve-reproduces-imp97483-u-shape',
    holds: () => {
      const totals = IMP97505_CURVE.map((p) => p.tot);
      const minIdx = totals.indexOf(Math.min(...totals));
      return (
        IMP97505_CURVE.length === 12 &&
        IMP97505_CURVE[minIdx].R === 3.35 &&
        minIdx > 0 &&
        minIdx < IMP97505_CURVE.length - 1
      );
    },
    why: 'the charted curve must reproduce the imp-97483 U-shape: an interior minimum at R=3.35, strictly between the under-confined and over-spread endpoints.',
  },
  {
    id: 'imp97505-optimum-matches-imp97483',
    holds: () =>
      IMP97505_OPTIMUM.Rstar === 3.35 &&
      Math.abs(IMP97505_OPTIMUM.total - 6.83) < 1e-9 &&
      Math.abs(IMP97505_OPTIMUM.ratioToCsharp - 11.7) < 1e-9,
    why: 'the charted optimum must equal the imp-97483 measured minimum (R*=3.35, total=6.83, ratio=11.7) exactly.',
  },
  {
    id: 'imp97505-measurement-only-no-qed',
    holds: () =>
      IMP97505_VERDICT.pointsReusedVerbatim === true &&
      IMP97505_VERDICT.operatorPositivityProved === false &&
      IMP97505_VERDICT.boundMoves === false &&
      IMP97505_VERDICT.qed === false &&
      IMP97483_VERDICT.qed === false,
    why: 'presentation only: points and constants reused verbatim from imp-97483; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97505_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97505-krein-well-capture-tradeoff-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
