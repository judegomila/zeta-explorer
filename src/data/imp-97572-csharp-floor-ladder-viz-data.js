/**
 * @module imp-97572-csharp-floor-ladder-viz-data
 *
 * imp-97572 (ux): import-light viz-data leaf charting the imp-97492 Krein
 * c_sharp floor-sharpening ladder as a single ordered sequence: the certified
 * rho floor -4336.198, the reproducing-kernel floor -3200.029, the best
 * RIGOROUS joint-bathtub floor -3065.435, the measured realizable floor
 * -1343.796, and the measured c_sharp ~0.581059 itself -- alongside the two
 * named residual shares (realizability +1721.639, 56.2%; discarded t^4 far
 * field +1344.378, 43.8%) that close the gap from the rigorous floor to the
 * measured value.
 *
 * PRESENTATION ONLY. Reuses the imp-97492 cohort-index literals verbatim
 * (bestRigorousFloor, bestMeasuredRealizableFloor, bestMeasuredUpperBracket,
 * the eight-ticket cohort); no re-derivation, no re-solve. Establishes no
 * operator positivity; changes no bound; interval-rigorous certified reach
 * stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97492-krein-csharp-lower-bound-obstruction-cohort-index.js (source cohort index; all values reused verbatim)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (floor -3200.029)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (best rigorous floor -3065.435)
 * @see imp-97457-krein-bathtub-realizability-gap.js (measured realizable floor -1343.796)
 * @see imp-97458-krein-csharp-discarded-positive-far-field.js (discarded far-field residual share)
 *
 * Ticket: imp-97572 (ux, sonnet-4-6, sonnet). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX from './imp-97492-krein-csharp-lower-bound-obstruction-cohort-index.js';

const idx = IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX;

export const IMP97572_FLOOR_LADDER = Object.freeze([
  Object.freeze({
    key: 'certifiedRho',
    label: 'certified rho (imp-97415)',
    value: -4336.198,
    kind: 'certified-lower-bound-precondition',
  }),
  Object.freeze({
    key: 'reproducingKernel',
    label: 'reproducing-kernel floor (imp-97399)',
    value: -3200.029,
    kind: 'finite-floor',
  }),
  Object.freeze({
    key: 'jointBathtub',
    label: 'joint bathtub floor (imp-97416, best RIGOROUS)',
    value: idx.bestRigorousFloor,
    kind: 'finite-floor-rigorous',
  }),
  Object.freeze({
    key: 'realizable',
    label: 'measured realizable floor (imp-97457)',
    value: idx.bestMeasuredRealizableFloor,
    kind: 'measured-not-certified',
  }),
  Object.freeze({
    key: 'measuredCSharp',
    label: 'measured c_sharp (imp-97206/97379/97405)',
    value: idx.bestMeasuredUpperBracket,
    kind: 'measured-positive',
  }),
]);

export const IMP97572_RESIDUAL_SHARES = Object.freeze([
  Object.freeze({
    key: 'realizability',
    label: 'bathtub realizability gap (imp-97457)',
    amount: 1721.639,
    pct: 56.2,
    fromValue: idx.bestRigorousFloor,
    toValue: idx.bestMeasuredRealizableFloor,
  }),
  Object.freeze({
    key: 'discardedFarField',
    label: 'discarded t^4 positive far field (imp-97458)',
    amount: 1344.378,
    pct: 43.8,
    fromValue: idx.bestMeasuredRealizableFloor,
    toValue: idx.bestMeasuredUpperBracket,
  }),
]);

export const IMP97572_VERDICT = Object.freeze({
  ticket: 'imp-97572',
  sourceTicket: 'imp-97492',
  claim:
    'The five-point floor-sharpening ladder (-4336.198 -> -3200.029 -> -3065.435 -> -1343.796 -> ' +
    '~0.581059) is exactly closed by the two named residual shares: realizability contributes ' +
    '+1721.639 (56.2%) and the discarded far field contributes +1344.378 (43.8%), summing to the ' +
    'full +3066.017 gap between the best rigorous floor and the measured c_sharp.',
  ladderLength: IMP97572_FLOOR_LADDER.length,
  residualSharesSumToFullGap: true,
  qed: false,
});
export default IMP97572_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97572_ASSERTIONS = [
  {
    id: 'imp97572-five-ladder-rungs-monotone-increasing',
    holds: () =>
      IMP97572_FLOOR_LADDER.length === 5 &&
      IMP97572_FLOOR_LADDER.every((r, i) => i === 0 || r.value > IMP97572_FLOOR_LADDER[i - 1].value),
    why: 'the ladder must strictly climb from the worst certified floor to the measured positive value.',
  },
  {
    id: 'imp97572-ladder-reuses-cohort-index-literals-verbatim',
    holds: () =>
      IMP97572_FLOOR_LADDER[2].value === idx.bestRigorousFloor &&
      IMP97572_FLOOR_LADDER[3].value === idx.bestMeasuredRealizableFloor &&
      IMP97572_FLOOR_LADDER[4].value === idx.bestMeasuredUpperBracket,
    why: 'no re-derivation: the rigorous floor, realizable floor, and measured bracket must match the imp-97492 index exactly.',
  },
  {
    id: 'imp97572-residual-shares-sum-to-full-gap',
    holds: () => {
      const gap = idx.bestMeasuredUpperBracket - idx.bestRigorousFloor;
      const sum = IMP97572_RESIDUAL_SHARES.reduce((s, r) => s + r.amount, 0);
      return Math.abs(sum - gap) < 1e-2;
    },
    why: 'the two named residual shares (realizability + discarded far field) must account for the entire gap from the rigorous floor to the measured c_sharp, leaving no unnamed residual.',
  },
  {
    id: 'imp97572-residual-shares-chain-through-realizable-floor',
    holds: () =>
      IMP97572_RESIDUAL_SHARES[0].toValue === IMP97572_RESIDUAL_SHARES[1].fromValue &&
      IMP97572_RESIDUAL_SHARES[0].toValue === idx.bestMeasuredRealizableFloor,
    why: 'the realizability share must land exactly on the measured realizable floor before the far-field share is added.',
  },
  {
    id: 'imp97572-honesty-gate-no-qed',
    holds: () =>
      IMP97572_VERDICT.qed === false &&
      idx.lowerBoundOnCSharpProved === false &&
      idx.certifiedReach === 0.96,
    why: 'presentation-only leaf reusing an already-completed cohort index verbatim: no bound moved, NO QED.',
  },
];

for (const t of IMP97572_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97572-csharp-floor-ladder-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
