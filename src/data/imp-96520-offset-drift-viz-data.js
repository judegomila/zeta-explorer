/**
 * @module imp-96520-offset-drift-viz-data
 *
 * imp-96520 (ux): import-light viz-data leaf for the imp-96467 offset-drift-slope-vs-L-drift-
 * prediction comparison. Reshapes the baked imp-96467 rows and fit summary into a chart-ready
 * series plus the slope/residual landmarks, so the page can render it without re-deriving
 * anything.
 *
 * No re-derivation: every value plotted is copied verbatim from
 * IMP96467_OFFSET_DRIFT_SLOPE_VS_LDRIFT_PREDICTION. Presentation only; changes no bound;
 * establishes no operator positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96467-offset-drift-slope-vs-Ldrift-prediction.js (the source object this reshapes)
 * @see imp-96431-knee-crossover-tracking-wide-range.js (the underlying measured crossover ladder)
 *
 * Ticket: imp-96520 (ux, sonnet-4-6, low). Plain exported validation object (imp-96294
 * convention), no self-executing assertion throw.
 */

import { IMP96467_OFFSET_DRIFT_SLOPE_VS_LDRIFT_PREDICTION as SRC } from './imp-96467-offset-drift-slope-vs-Ldrift-prediction.js';

export const IMP96520_OFFSET_LADDER_ROWS = [...SRC.rows].sort(
  (a, b) => a.crossoverLog10 - b.crossoverLog10,
);

export const IMP96520_SLOPES = Object.freeze({
  measuredPerDecade: SRC.measuredFit.slopePerDecade,
  analyticPerDecade: SRC.analyticFit.slopePerDecade,
  ratioPredictedOverMeasured: SRC.ratioPredictedOverMeasured,
  residualSubleadingFraction: SRC.residualSubleadingFraction,
});

export const IMP96520_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every offset and slope '
  + 'value plotted here is copied verbatim from the imp-96467 baked fit object; the only '
  + 'computation in this module is sorting the rows by crossover log10. The analytic leading '
  + 'L(N)-drift prediction is the dominant, correctly-signed driver of the imp-96431 measured '
  + 'offset drift but over-predicts its slope by ~'
  + ((SRC.ratioPredictedOverMeasured - 1) * 100).toFixed(0)
  + '%, leaving a ~'
  + (SRC.residualSubleadingFraction * 100).toFixed(0)
  + '% residual sub-leading share unaccounted for. Derivation/measurement diagnostic only, not '
  + 'rigorous; changes no bound, establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96520_VALIDATION = Object.freeze({
  rowsSortedAscending: IMP96520_OFFSET_LADDER_ROWS.every(
    (r, i) => i === 0 || r.crossoverLog10 >= IMP96520_OFFSET_LADDER_ROWS[i - 1].crossoverLog10,
  ),
  bothSlopesNegative: IMP96520_SLOPES.measuredPerDecade < 0 && IMP96520_SLOPES.analyticPerDecade < 0,
  ratioOrderUnity:
    IMP96520_SLOPES.ratioPredictedOverMeasured > 1 && IMP96520_SLOPES.ratioPredictedOverMeasured < 1.5,
  residualFractionInBand:
    IMP96520_SLOPES.residualSubleadingFraction > 0.05 && IMP96520_SLOPES.residualSubleadingFraction < 0.4,
});
