/**
 * imp-95914 -- viz panel for the imp-95885 three-delta u_fit comparison table.
 *
 * imp-95885 assembled the per-delta u_fit certified intervals (ln 1.2 / ln 1.25 /
 * ln 1.3) side by side but never rendered them visually. This module derives a
 * flat, chart-ready row per delta (A_fit vs dual A_opt, u_fit_rel, u_fit/u_opt,
 * reach, conditioning) directly from the frozen imp-95885 record -- no new cited
 * input, no re-derivation of any interval.
 *
 * Import-light: only imports the imp-95885 module (no zeros bundle).
 *
 * CAVEAT: imp-95885 FINDING A's "conditioning orders the intervals" reading (for
 * the two deltas it covered) is superseded by imp-95895, which refines it to a
 * reach-to-conditioning INTERPLAY once the ln 1.25 cell is included -- see the
 * banner text below and imp-95905 / imp-95932 for that refinement's own headword.
 *
 * @see imp-95885-per-delta-ufit-comparison-table (the source record this renders)
 * @see imp-95895-ln125-ufit-interval.js (refines FINDING A: reach-to-conditioning interplay)
 */

import { IMP95885_PER_DELTA_UFIT_COMPARISON_TABLE } from './imp-95885-per-delta-ufit-comparison-table.js';

const SRC = IMP95885_PER_DELTA_UFIT_COMPARISON_TABLE;

// one row per delta: A_fit (latest chain step, null for ln1.25), dual A_opt,
// u_fit_rel%, u_fit/u_opt, reach, and approximate conditioning.
export const IMP95914_COMPARISON_ROWS = Object.freeze(
  SRC.perDelta.map((row) => {
    const chain = row.uFitChain;
    const aFitLatest = chain ? chain[chain.length - 1].aFit : null;
    return Object.freeze({
      label: row.label,
      delta: row.delta,
      aFitLatest,
      aOpt: row.aOpt,
      hasUFitInterval: row.uFitRelLatest !== null,
      uFitRelPct: row.uFitRelLatest === null ? null : row.uFitRelLatest * 100,
      uFitOverUOptLatest: row.uFitOverUOptLatest,
      reachLatest: row.reachLatest,
      condApprox: row.condApprox,
    });
  }),
);

export const IMP95914_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-95885 per-delta comparison verbatim ' +
  '(no re-derivation, no fresh extrapolation run). ln 1.25 carries no u_fit interval ' +
  '(crossing/shift-budget thread only, recorded N/A). Reach alone does not order the ' +
  'intervals across deltas (imp-95885 FINDING A); conditioning alone does not either ' +
  '-- imp-95895 refines the reading to a reach-to-conditioning interplay (ln 1.25 ' +
  'pairs a long reach with only moderate conditioning and is tightest of the three). ' +
  'Changes no bound, establishes no operator positivity, no RH claim; no refereed bound is changed' +
  '; NO QED.';

export const IMP95914_ASSERTIONS = [
  {
    id: 'imp95914-three-rows-one-per-delta',
    description:
      'exactly three comparison rows exist, labeled ln1.2/ln1.25/ln1.3 in that order, ' +
      'matching the imp-95885 perDelta source order',
    holds: () =>
      IMP95914_COMPARISON_ROWS.length === 3 &&
      IMP95914_COMPARISON_ROWS.map((r) => r.label).join(',') === 'ln1.2,ln1.25,ln1.3',
  },
  {
    id: 'imp95914-aFitLatest-matches-source-chain-tail',
    description:
      'each row aFitLatest equals the last uFitChain entry aFit of the matching ' +
      'imp-95885 perDelta row (null when the delta has no chain, e.g. ln1.25)',
    holds: () =>
      IMP95914_COMPARISON_ROWS.every((row) => {
        const srcRow = SRC.perDelta.find((r) => r.label === row.label);
        const expected = srcRow.uFitChain
          ? srcRow.uFitChain[srcRow.uFitChain.length - 1].aFit
          : null;
        return row.aFitLatest === expected;
      }),
  },
  {
    id: 'imp95914-percentages-match-source-fractions',
    description:
      'uFitRelPct is exactly 100x the source uFitRelLatest fraction wherever an ' +
      'interval exists, and null exactly where imp-95885 records ln1.25 as N/A',
    holds: () =>
      IMP95914_COMPARISON_ROWS.every((row) => {
        const srcRow = SRC.perDelta.find((r) => r.label === row.label);
        if (srcRow.uFitRelLatest === null) return row.uFitRelPct === null && row.hasUFitInterval === false;
        return (
          Math.abs(row.uFitRelPct - srcRow.uFitRelLatest * 100) < 1e-12 &&
          row.hasUFitInterval === true
        );
      }),
  },
  {
    id: 'imp95914-reach-does-not-order-intervals',
    description:
      'reproduces imp-95885 FINDING A on the derived rows: ln1.2 reach exceeds ' +
      'ln1.3 reach yet ln1.2 u_fit_rel is looser (larger), matching SRC.reachOrdersIntervals === false',
    holds: () => {
      const l12 = IMP95914_COMPARISON_ROWS.find((r) => r.label === 'ln1.2');
      const l13 = IMP95914_COMPARISON_ROWS.find((r) => r.label === 'ln1.3');
      return (
        l12.reachLatest > l13.reachLatest &&
        l12.uFitRelPct > l13.uFitRelPct &&
        SRC.reachOrdersIntervals === false
      );
    },
  },
  {
    id: 'imp95914-no-new-bound-caveat-present',
    description: 'the caveat banner names both the N/A ln1.25 case and the no-QED status',
    holds: () =>
      /ln 1\.25/.test(IMP95914_CAVEAT_BANNER) &&
      /NO QED/.test(IMP95914_CAVEAT_BANNER) &&
      SRC.qed === false,
  },
];

for (const a of IMP95914_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95914-ufit-comparison-panel-viz-data assertion failed: ${a.id}`);
  }
}
