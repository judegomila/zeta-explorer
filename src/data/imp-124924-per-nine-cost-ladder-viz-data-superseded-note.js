/**
 * @module imp-124924-per-nine-cost-ladder-viz-data-superseded-note
 * @fileoverview imp-124924 -- SUPERSEDED-TICKET NOTE (no new solve): imp-124924 asked for an
 * import-light viz-data leaf charting the imp-124793 per-nine cost ladder (log10 N vs nine target
 * t = 0.9/0.99/0.999/0.9999) with the spacing-ratio -> 10 overlay. That exact leaf was already
 * delivered by imp-124856 (imp-124856-fartail-per-nine-spacing-ladder-viz-data.js), which reuses
 * IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER verbatim to export the same four-rung
 * log10 N ladder rows (IMP124856_LADDER_ROWS) and the three-gap spacing-ratio overlay
 * (IMP124856_SPACING_ROWS, ratioToPrev climbing 9.7655 -> 9.9769 toward the limit 10).
 *
 * NO NEW WORK PERFORMED HERE: this note only records the ticket-level supersession so imp-124924
 * is not re-attempted as a duplicate leaf. Nothing in the verified ledger moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-124856-fartail-per-nine-spacing-ladder-viz-data.js (the viz-data leaf this defers to)
 * @see imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js (the underlying ladder/spacing source)
 *
 * Ticket: imp-124924 (ux, low, sonnet-4-6). Reconciliation only; no bound on Lambda moves; NO QED.
 */

import {
  IMP124856_LADDER_ROWS,
  IMP124856_SPACING_ROWS,
  IMP124856_SUMMARY,
} from './imp-124856-fartail-per-nine-spacing-ladder-viz-data.js';

export const IMP124924_VERDICT = Object.freeze({
  ticket: 'imp-124924',
  question:
    'add an import-light viz-data leaf charting the imp-124793 per-nine cost ladder (log10 N vs ' +
    'nine target t = 0.9/0.99/0.999/0.9999) with the spacing-ratio -> 10 overlay.',
  answer:
    'already delivered by imp-124856, which exports the identical four-rung ladder and three-gap ' +
    'spacing-ratio overlay from the same imp-124793 source; this note only records that supersession.',
  supersededBy: 'imp-124856',
  newSolvePerformed: false,
  anyBoundMoved: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP124924_VERDICT.supersededBy === 'imp-124856' &&
    IMP124924_VERDICT.newSolvePerformed === false &&
    IMP124924_VERDICT.anyBoundMoved === false &&
    IMP124924_VERDICT.qed === false &&
    IMP124856_LADDER_ROWS.length === 4 &&
    IMP124856_SPACING_ROWS.length === 3 &&
    IMP124856_SUMMARY.spacingRatioLimit === 10 &&
    /NO QED/.test(IMP124856_SUMMARY.verdict)
  )
) {
  throw new Error(
    'imp-124924-per-nine-cost-ladder-viz-data-superseded-note assertion FAILED: must reproduce ' +
      'imp-124856 ladder/spacing shape and cite the per-nine spacing-ratio overlay.'
  );
}

export default IMP124924_VERDICT;
