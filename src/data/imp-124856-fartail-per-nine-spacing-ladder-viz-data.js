/**
 * @module imp-124856-fartail-per-nine-spacing-ladder-viz-data
 *
 * imp-124856: import-light viz-data leaf charting the imp-124793 pure per-nine far-tail spacing
 * ladder (log10 N vs added nines, k = 1..4 for t = 0.9/0.99/0.999/0.9999) with the per-nine
 * log10-N spacing-ratio -> 10 overlay. Reuses
 * IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER verbatim (no re-derivation, no new
 * computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js (ladder, spacing, closed-form inversion)
 */

import { IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER } from './imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js';

const { ladder, spacing, spacingRatioLimit, verdict } = IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER;

// log10 N vs added nines k = 1..4, one point per rung of the pure per-nine ladder.
export const IMP124856_LADDER_ROWS = Object.freeze(
  ladder.map((r) =>
    Object.freeze({
      key: `k${r.nines}`,
      nines: r.nines,
      target: r.target,
      log10_N: r.log10_N,
      N_mantissa: r.N_mantissa,
      N_exp10: r.N_exp10,
    })
  )
);

// Consecutive per-nine log10-N spacing and its ratio-to-prev overlay (-> 10).
export const IMP124856_SPACING_ROWS = Object.freeze(
  spacing.map((s, i) =>
    Object.freeze({
      key: `gap${i + 1}`,
      from: s.from,
      to: s.to,
      deltaLog10N: s.deltaLog10N,
      ratioToPrev: s.ratioToPrev,
    })
  )
);

export const IMP124856_SUMMARY = Object.freeze({
  reading:
    'Each added nine of the per-nine target (t = 0.9 -> 0.99 -> 0.999 -> 0.9999) multiplies the ' +
    'crossing height log10 N roughly tenfold: log10 N climbs 5.2972 -> 45.4251 -> 437.2940 -> ' +
    '4346.9448, and the consecutive spacing ratio climbs 9.7655 -> 9.9769 toward the exact limit ' +
    '10, the closed-form geometric signature of the logarithmic approach of the far-tail diagnostic ' +
    'to 1.',
  spacingRatioLimit,
  verdict,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124856_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124856-four-ladder-rows',
    description: 'exactly four ladder rows, nines = 1..4 in order',
    holds: () =>
      IMP124856_LADDER_ROWS.length === 4 &&
      IMP124856_LADDER_ROWS.every((r, i) => r.nines === i + 1),
  },
  {
    id: 'imp124856-log10N-monotone',
    description: 'log10 N strictly increases across the four per-nine rungs',
    holds: () =>
      IMP124856_LADDER_ROWS.every(
        (r, i) => i === 0 || r.log10_N > IMP124856_LADDER_ROWS[i - 1].log10_N
      ),
  },
  {
    id: 'imp124856-three-spacing-rows',
    description: 'exactly three spacing rows (one gap per consecutive ladder pair)',
    holds: () => IMP124856_SPACING_ROWS.length === 3,
  },
  {
    id: 'imp124856-ratio-overlay-climbs-toward-ten',
    description: 'non-null spacing ratios lie in (9, 10) and climb monotonically toward 10',
    holds: () => {
      const ratios = IMP124856_SPACING_ROWS.map((s) => s.ratioToPrev).filter((r) => r !== null);
      return ratios.length === 2 && ratios.every((r) => r > 9 && r < 10) && ratios[1] > ratios[0];
    },
  },
  {
    id: 'imp124856-values-match-imp124793-source-verbatim',
    description: 'ladder/spacing values are reused verbatim from imp-124793 (no re-derivation)',
    holds: () =>
      IMP124856_LADDER_ROWS.every((row) => {
        const src = ladder.find((l) => l.nines === row.nines);
        return src && row.log10_N === src.log10_N && row.target === src.target;
      }) &&
      IMP124856_SPACING_ROWS.every((row, i) => row.deltaLog10N === spacing[i].deltaLog10N),
  },
  {
    id: 'imp124856-honesty-gate-no-qed',
    description: 'spacingRatioLimit is 10 and the restated verdict carries the no-QED markers',
    holds: () =>
      IMP124856_SUMMARY.spacingRatioLimit === 10 &&
      /NO QED/.test(IMP124856_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP124856_SUMMARY.verdict),
  },
];

for (const assertion of IMP124856_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124856 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}
