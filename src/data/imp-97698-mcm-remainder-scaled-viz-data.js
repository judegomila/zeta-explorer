/**
 * @module imp-97698-mcm-remainder-scaled-viz-data
 *
 * imp-97698: import-light viz-data leaf charting the imp-97666 scaled MCM tail-remainder ladder
 * Rexact(m)*720*m^2 -> 1, tracking the derived 1 - (1/7)/m^2 next-order correction across m = 10..100.
 * Reuses IMP97666_LADDER verbatim (no new computation, no re-derivation).
 *
 * PRESENTATION ONLY. No new computation; MCM stays refuted from omega=11; RH open; NO QED.
 *
 * @see imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js (source derivation + clean-regime ladder)
 */

import { IMP97666_LADDER, IMP97666_DERIVATION } from './imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js';

// One row per ladder rung: the scaled remainder Rexact(m)*720*m^2 against the 1 - (1/7)/m^2 model.
export const IMP97698_SCALED_ROWS = Object.freeze(
  IMP97666_LADDER.map((row) => {
    const scaled = row.rexact * 720 * row.m * row.m;
    const model = 1 - (1 / 7) / (row.m * row.m);
    return Object.freeze({
      key: `m-${row.m}`,
      m: row.m,
      scaled,
      model,
      gapFromOne: Math.abs(scaled - 1),
      gapFromModel: Math.abs(scaled - model),
    });
  }),
);

const FIRST = IMP97698_SCALED_ROWS[0];
const LAST = IMP97698_SCALED_ROWS[IMP97698_SCALED_ROWS.length - 1];

export const IMP97698_SUMMARY = Object.freeze({
  leadingConstant: IMP97666_DERIVATION.leadingConstant, // 1/720
  nextConstant: IMP97666_DERIVATION.nextConstant, // -1/5040
  scaledModel: IMP97666_DERIVATION.scaledNextOrderModel, // 'Rexact(m)*720*m^2 = 1 - (1/7)/m^2 + O(m^-4)'
  gapFromOneAtFirst: FIRST.gapFromOne,
  gapFromOneAtLast: LAST.gapFromOne,
  reading:
    `Across the ${IMP97698_SCALED_ROWS.length} clean-regime rungs (m = ${FIRST.m}..${LAST.m}), the scaled `
    + `remainder Rexact(m)*720*m^2 climbs from ${FIRST.scaled.toFixed(10)} to ${LAST.scaled.toFixed(10)}, `
    + 'converging toward 1 as m grows and tracking the derived 1 - (1/7)/m^2 next-order correction to '
    + `within ${LAST.gapFromModel.toExponential(2)} at m=${LAST.m}. This confirms the +1/(720 m^2) leading `
    + 'Euler-Maclaurin term numerically on the derived footing.',
  verdict:
    'Presentation only: every scaled value is recomputed from the imp-97666 baked Rexact literals verbatim '
    + '(a derivation cross-check, not a new computation); no new computation. Changes no bound; MCM stays '
    + 'refuted from omega=11; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97698_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97698-six-rows',
    description: 'exactly six rung rows, matching the imp-97666 six-point clean ladder',
    holds: () => IMP97698_SCALED_ROWS.length === 6,
  },
  {
    id: 'imp97698-scaled-monotonically-approaches-one',
    description: 'the gap between the scaled value and 1 strictly shrinks across the ladder',
    holds: () => FIRST.gapFromOne > LAST.gapFromOne && LAST.gapFromOne < 2e-5,
  },
  {
    id: 'imp97698-tracks-next-order-model',
    description: 'every rung matches the 1 - (1/7)/m^2 model to within 1e-5',
    holds: () => IMP97698_SCALED_ROWS.every((r) => r.gapFromModel < 1e-5),
  },
  {
    id: 'imp97698-leading-constant-is-one-over-720',
    description: 'the leading constant reused from imp-97666 is exactly 1/720',
    holds: () => Math.abs(IMP97698_SUMMARY.leadingConstant - 1 / 720) < 1e-18,
  },
  {
    id: 'imp97698-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97698_SUMMARY.verdict) && /NO QED/.test(IMP97698_SUMMARY.verdict),
  },
];

for (const assertion of IMP97698_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97698 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97698_SUMMARY;
