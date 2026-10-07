/**
 * @module imp-124918-kernel-ratio-bracket-viz-data
 *
 * imp-124918: import-light viz-data leaf merging the imp-124776 gap-keyed and imp-97843 decade-index-keyed
 * reconstruction-kernel |K| = |1/(N sigma_N)| per-decade ratio rows onto a SINGLE shared axis (one row per
 * decade, carrying both the bare decade index and its actual near-peak gap g), with a per-row bracket_width
 * = |upslope_ratio - downslope_ratio| column to expose the two-arm bracketing of sqrt(10) = 3.162278 directly,
 * rather than the two-table side-by-side framing already shown by the imp-124843 consumer page.
 *
 * Reuses both sibling leaves' frozen rows verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124776-kernel-decade-ratio-vs-gap-viz-data.js (gap-keyed source)
 * @see imp-97843-kernel-decade-growth-viz-data.js (decade-index-keyed source)
 */

import {
  IMP124776_WIDE_RATIO_VS_GAP,
  IMP124776_DEEP_RATIO_VS_GAP,
} from './imp-124776-kernel-decade-ratio-vs-gap-viz-data.js';
import {
  IMP97843_WIDE_RATIO_ROWS,
  IMP97843_DEEP_RATIO_ROWS,
} from './imp-97843-kernel-decade-growth-viz-data.js';

const SQRT10 = IMP124776_WIDE_RATIO_VS_GAP[0].sqrt10;

function mergeOntoSharedAxis(gapRows, decadeRows) {
  return Object.freeze(
    gapRows.map((gapRow, i) =>
      Object.freeze({
        decade: decadeRows[i].decade,
        gap: gapRow.gap,
        upslope_ratio: gapRow.upslope_ratio,
        downslope_ratio: gapRow.downslope_ratio,
        sqrt10: SQRT10,
        bracket_width: Math.abs(gapRow.upslope_ratio - gapRow.downslope_ratio),
      }),
    ),
  );
}

export const IMP124918_WIDE_BRACKET_ROWS = mergeOntoSharedAxis(
  IMP124776_WIDE_RATIO_VS_GAP,
  IMP97843_WIDE_RATIO_ROWS,
);

export const IMP124918_DEEP_BRACKET_ROWS = mergeOntoSharedAxis(
  IMP124776_DEEP_RATIO_VS_GAP,
  IMP97843_DEEP_RATIO_ROWS,
);

export const IMP124918_SUMMARY = Object.freeze({
  law:
    'Merging the imp-124776 gap-keyed and imp-97843 decade-index-keyed ratio rows onto one shared axis makes '
    + 'the two-arm bracketing explicit as a single bracket_width = |upslope_ratio - downslope_ratio| column: '
    + `it shrinks from ${IMP124918_WIDE_BRACKET_ROWS[0].bracket_width} at the widest decade to `
    + `${IMP124918_DEEP_BRACKET_ROWS[IMP124918_DEEP_BRACKET_ROWS.length - 1].bracket_width} in the deep window, `
    + `with sqrt(10) = ${SQRT10} inside the bracket on every row.`,
  reading:
    `wide bracket widths: ${IMP124918_WIDE_BRACKET_ROWS.map((r) => r.bracket_width.toExponential(3)).join(' -> ')}; `
    + `deep bracket widths: ${IMP124918_DEEP_BRACKET_ROWS.map((r) => r.bracket_width.toExponential(3)).join(' -> ')}.`,
  verdict:
    'Presentation only: every ratio is reused verbatim from the imp-124776/imp-97843 sibling leaves '
    + '(themselves reused from imp-97823, a measurement, not a derivation); the merge and bracket_width column '
    + 'are presentational only, no new computation. Changes no bound; establishes no operator positivity; '
    + 'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124918_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124918-six-wide-rows',
    description: 'one merged bracket row per wide-ladder decade (6 rows, matching both sources)',
    holds: () => IMP124918_WIDE_BRACKET_ROWS.length === 6,
  },
  {
    id: 'imp124918-three-deep-rows',
    description: 'one merged bracket row per deep-window decade (3 rows, matching both sources)',
    holds: () => IMP124918_DEEP_BRACKET_ROWS.length === 3,
  },
  {
    id: 'imp124918-decade-and-gap-both-present',
    description: 'every merged row carries both a bare decade index and its actual gap g',
    holds: () =>
      [...IMP124918_WIDE_BRACKET_ROWS, ...IMP124918_DEEP_BRACKET_ROWS].every(
        (r) => typeof r.decade === 'number' && typeof r.gap === 'number',
      ),
  },
  {
    id: 'imp124918-sqrt10-inside-every-bracket',
    description: 'sqrt(10) lies strictly between the two arm ratios on every merged row',
    holds: () =>
      [...IMP124918_WIDE_BRACKET_ROWS, ...IMP124918_DEEP_BRACKET_ROWS].every((r) => {
        const lo = Math.min(r.upslope_ratio, r.downslope_ratio);
        const hi = Math.max(r.upslope_ratio, r.downslope_ratio);
        return lo < SQRT10 && SQRT10 < hi;
      }),
  },
  {
    id: 'imp124918-deep-bracket-narrower-than-wide',
    description: 'the narrowest deep-window bracket is tighter than the widest wide-ladder bracket',
    holds: () =>
      IMP124918_DEEP_BRACKET_ROWS[IMP124918_DEEP_BRACKET_ROWS.length - 1].bracket_width
      < IMP124918_WIDE_BRACKET_ROWS[0].bracket_width,
  },
  {
    id: 'imp124918-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124918_SUMMARY.verdict) && /NO QED/.test(IMP124918_SUMMARY.verdict),
  },
];

for (const assertion of IMP124918_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124918 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124918_SUMMARY;
