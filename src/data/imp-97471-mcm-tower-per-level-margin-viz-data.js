/**
 * @module imp-97471-mcm-tower-per-level-margin-viz-data
 *
 * imp-97471 (ux): import-light viz-data leaf visualizing the imp-97442 MCM
 * tower per-level margin at omega = 5, 6 -- where the smallness in the
 * iterated multiplicative-difference tower lives (the LEVEL-1 base term,
 * ~1.4e-6, at large x) versus where the MCM induction actually rides (the
 * TOP term, level = omega at x = 1, i.e. T(b), four orders of magnitude
 * further from zero: 2.02e-2 at omega=5, 1.34e-2 at omega=6).
 *
 * Reshapes IMP97442_MEASUREMENTS.omega5/omega6.perLevelMinDiff (imported
 * verbatim, no re-derivation) into per-omega level ladders flagging the
 * base level (1) and the top/induction level (= omega).
 *
 * PRESENTATION ONLY. Reuses the imp-97442 baked sweep verbatim; no re-solve.
 * Establishes no operator positivity; changes no bound; MCM stays VERIFIED
 * (not proved) at omega=5,6 and is FALSE from omega=11 (imp-97432); no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97442-route-m-mcm-omega56-subgrid-verification.js (the per-level minima sweep, omega=5,6)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11; ceiling survives)
 *
 * Ticket: imp-97471 (ux, sonnet-4-6, sonnet). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP97442_MEASUREMENTS } from './imp-97442-route-m-mcm-omega56-subgrid-verification.js';

function buildLadder(omega, m) {
  const points = Object.freeze(
    m.perLevelMinDiff.map((minDiff, i) => {
      const level = i + 1;
      return Object.freeze({
        level,
        minDiff,
        isBase: level === 1,
        isTop: level === omega,
      });
    })
  );
  const base = points[0];
  const top = points[points.length - 1];
  return Object.freeze({
    omega,
    points,
    baseMinDiff: base.minDiff,
    topMinDiff: top.minDiff,
    ordersOfMagnitudeGap: Math.log10(top.minDiff / base.minDiff),
  });
}

export const IMP97471_LADDERS = Object.freeze([
  buildLadder(5, IMP97442_MEASUREMENTS.omega5),
  buildLadder(6, IMP97442_MEASUREMENTS.omega6),
]);

export const IMP97471_VERDICT = Object.freeze({
  ticket: 'imp-97471',
  sourceTicket: 'imp-97442',
  claim:
    'across the full iterated multiplicative-difference tower, the smallest differences sit at LEVEL 1 ' +
    '(the base term h(x)-h(2x) at the largest available x, ~1.4e-6), while the top induction term T(b) ' +
    '(level = omega, x = 1) stays four orders of magnitude away from zero (2.02e-2 at omega=5, 1.34e-2 ' +
    'at omega=6) -- the smallness lives at the base of the tower, not where the MCM induction rides.',
  ordersOfMagnitudeGap: IMP97471_LADDERS.map((l) => ({ omega: l.omega, gap: l.ordersOfMagnitudeGap })),
  mcmVerifiedOmega5: true,
  mcmVerifiedOmega6: true,
  qed: false,
});
export default IMP97471_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97471_ASSERTIONS = [
  {
    id: 'imp97471-two-ladders-correct-lengths',
    holds: () =>
      IMP97471_LADDERS.length === 2 &&
      IMP97471_LADDERS[0].omega === 5 && IMP97471_LADDERS[0].points.length === 5 &&
      IMP97471_LADDERS[1].omega === 6 && IMP97471_LADDERS[1].points.length === 6,
    why: 'the reshaped viz data must carry one ladder per omega (5, 6) with exactly omega points each, matching the imp-97442 perLevelMinDiff arrays.',
  },
  {
    id: 'imp97471-points-match-source-verbatim',
    holds: () =>
      IMP97471_LADDERS.every((l, li) => {
        const src = li === 0 ? IMP97442_MEASUREMENTS.omega5 : IMP97442_MEASUREMENTS.omega6;
        return l.points.every((p, i) => p.minDiff === src.perLevelMinDiff[i]);
      }),
    why: 'every plotted point must equal the imp-97442 IMP97442_MEASUREMENTS.perLevelMinDiff literal exactly (reuse, no re-derivation).',
  },
  {
    id: 'imp97471-base-is-level1-top-is-level-omega',
    holds: () =>
      IMP97471_LADDERS.every((l) => {
        const base = l.points.find((p) => p.isBase);
        const top = l.points.find((p) => p.isTop);
        return base.level === 1 && top.level === l.omega && base.minDiff < top.minDiff;
      }),
    why: 'the flagged base point must be level 1 and the flagged top point must be level = omega, and the base must be strictly smaller than the top (smallness lives at the base, not the top).',
  },
  {
    id: 'imp97471-four-orders-of-magnitude-gap',
    holds: () => IMP97471_LADDERS.every((l) => l.ordersOfMagnitudeGap > 3.5 && l.ordersOfMagnitudeGap < 5),
    why: 'the imp-97442 reading is that the top induction term stays a full four orders of magnitude from the base minimum at omega<=6; this must hold for both ladders.',
  },
  {
    id: 'imp97471-honesty-gate-no-qed',
    holds: () =>
      IMP97471_VERDICT.qed === false &&
      IMP97471_VERDICT.mcmVerifiedOmega5 === true &&
      IMP97471_VERDICT.mcmVerifiedOmega6 === true,
    why: 'presentation-only reuse of a measurement-only sweep: MCM verified (not proved) at omega=5,6, no bound moved, NO QED.',
  },
];

for (const a of IMP97471_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97471-mcm-tower-per-level-margin-viz-data assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
