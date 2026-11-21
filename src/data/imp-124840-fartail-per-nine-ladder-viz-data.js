/**
 * @module imp-124840-fartail-per-nine-ladder-viz-data
 *
 * imp-124840 (ux): import-light viz-data leaf for the imp-124793 pure per-nine far-tail
 * spacing ladder. Reshapes the imp-124793 LADDER (log10 N at t = 0.9/0.99/0.999/0.9999) and
 * SPACING (consecutive log10 N gaps and their ratio climbing toward 10) into chart-ready rows,
 * so the page can render the ladder without re-deriving anything.
 *
 * No re-derivation: every log10 N / spacing / ratio value is copied verbatim from
 * IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER. Presentation only; changes no bound;
 * establishes no operator positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js (the source object this reshapes)
 *
 * Ticket: imp-124840 (ux, sonnet-4-6, low). Plain exported validation object (imp-96294
 * convention), no self-executing assertion throw.
 */

import { IMP124793_FARTAIL_DIAGNOSTIC_PER_NINE_SPACING_LADDER as SRC } from './imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js';

export const IMP124840_LADDER_ROWS = Object.freeze(
  SRC.ladder.map((row) =>
    Object.freeze({
      nines: row.nines,
      target: row.target,
      log10N: row.log10_N,
    })
  )
);

export const IMP124840_SPACING_ROWS = Object.freeze(
  SRC.spacing.map((row) =>
    Object.freeze({
      from: row.from,
      to: row.to,
      deltaLog10N: row.deltaLog10N,
      ratioToPrev: row.ratioToPrev,
    })
  )
);

export const IMP124840_SPACING_RATIO_LIMIT = SRC.spacingRatioLimit; // 10

export const IMP124840_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every log10 N / spacing / '
  + 'ratio value plotted here is copied verbatim from the imp-124793 pure per-nine far-tail ladder '
  + '(a closed-form RvM inversion, not a rigorous asymptotic). Conditional-share diagnostic, changes '
  + 'no bound, establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP124840_VALIDATION = Object.freeze({
  fourRungs: IMP124840_LADDER_ROWS.length === 4,
  log10NMonotoneRising: IMP124840_LADDER_ROWS.every(
    (r, i) => i === 0 || r.log10N > IMP124840_LADDER_ROWS[i - 1].log10N
  ),
  threeSpacings: IMP124840_SPACING_ROWS.length === 3,
  ratiosClimbTowardTen: IMP124840_SPACING_ROWS.filter((r) => r.ratioToPrev !== null).every(
    (r) => r.ratioToPrev > 9 && r.ratioToPrev < 10
  ),
  spacingRatioLimitIsTen: IMP124840_SPACING_RATIO_LIMIT === 10,
});
