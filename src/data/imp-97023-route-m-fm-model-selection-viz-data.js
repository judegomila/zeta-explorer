/**
 * @module imp-97023-route-m-fm-model-selection-viz-data
 * @fileoverview imp-97023: import-light chart-ready reshape of the imp-96996 Route M ||G||_F
 *   model-selection adjudication. Presentation only -- reuses the imp-96996/imp-96912/imp-96890
 *   fit coefficients and ceilings verbatim, no new computation. Produces the three extrapolant
 *   curves (line / tail / quad) over the exact 18-rung ladder plus a far-field extension through
 *   the quad turnover, the turnover flag at N ~ 2.31e9, and the F < M ceiling band under the
 *   monotonicity prior. Modelling only; the quad ceiling inverts F < M and is disqualified only
 *   under a physical monotonicity prior, not by the data alone; changes no bound; RH open; NO QED.
 *
 * @see imp-96996-route-m-fm-quad-turnover-adjudication.js (source: turnover, ceiling-vs-turnover, monotonicity partition, verdict)
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator.js (source: exact 18-rung ladder, ceilings)
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js (source: line/tail fit coefficients)
 */

import { IMP96912_LADDER, IMP96912_CEILINGS } from './imp-96912-route-m-frobenius-holdout-model-discriminator.js';
import { IMP96890_FIT_LINE, IMP96890_FIT_TAIL } from './imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js';
import {
  IMP96996_QUAD_TURNOVER,
  IMP96996_CEILING_VS_TURNOVER,
  IMP96996_MONOTONICITY_PARTITION,
  IMP96996_VERDICT,
} from './imp-96996-route-m-fm-quad-turnover-adjudication.js';

const froLine = (N) => IMP96890_FIT_LINE.a + IMP96890_FIT_LINE.b * Math.log(N);
const froTail = (N) => IMP96890_FIT_TAIL.a + IMP96890_FIT_TAIL.b * Math.log(N) + IMP96890_FIT_TAIL.d / N;
const froQuad = (N) => {
  const L = Math.log(N);
  return IMP96996_QUAD_TURNOVER.a + IMP96996_QUAD_TURNOVER.b * L + IMP96996_QUAD_TURNOVER.c * L * L;
};

// Chart-ready per-rung series over the exact 18-rung ladder: measured ||G||_F vs the three
// extrapolants, plotted against log10(N) for even x-axis spacing across the doubling ladder.
export const IMP97023_LADDER_SERIES = Object.freeze(
  IMP96912_LADDER.map(({ N, frobenius }) =>
    Object.freeze({
      N,
      log10N: Math.log10(N),
      measured: frobenius,
      line: froLine(N),
      tail: froTail(N),
      quad: froQuad(N),
    }),
  ),
);

// Far-field extension (log-spaced) from the top exact rung through the quad turnover, so a chart
// can show the quad curve visibly peel over while line/tail stay monotone.
const FAR_FIELD_LOG10_NS = [4.3, 5, 6, 7, 7.613, 8, 8.5, 9, 9.363, 9.7, 10];
export const IMP97023_FAR_FIELD_SERIES = Object.freeze(
  FAR_FIELD_LOG10_NS.map((log10N) => {
    const N = Math.pow(10, log10N);
    return Object.freeze({ N, log10N, line: froLine(N), tail: froTail(N), quad: froQuad(N) });
  }),
);

// The quad turnover flag (peak at N ~ 2.31e9) and its position relative to the quad ceiling scale.
export const IMP97023_TURNOVER_FLAG = Object.freeze({
  nPeak: IMP96996_QUAD_TURNOVER.nPeak, // ~2.3084e9
  log10NPeak: Math.log10(IMP96996_QUAD_TURNOVER.nPeak),
  nStarQuad: IMP96996_CEILING_VS_TURNOVER.nStarQuad, // ~4.1029e7
  decadesAboveCeiling: IMP96996_CEILING_VS_TURNOVER.decadesAboveCeiling, // ~1.75
  quadStillMonotoneAtCeiling: IMP96996_CEILING_VS_TURNOVER.quadStillMonotoneAtCeiling, // true
});

// The F < M ceiling band under the monotonicity prior: line/tail admissible and below M_lo,
// quad disqualified (turns over) and the only model that inverts F < M.
export const IMP97023_CEILING_BAND = Object.freeze({
  mLow: IMP96996_MONOTONICITY_PARTITION.mLow,
  line: IMP96996_MONOTONICITY_PARTITION.line,
  tail: IMP96996_MONOTONICITY_PARTITION.tail,
  quad: IMP96996_MONOTONICITY_PARTITION.quad,
  quadShiftPct: IMP96912_CEILINGS.quadShiftPct,
  tailShiftPct: IMP96912_CEILINGS.tailShiftPct,
});

export const IMP97023_HONEST_BANNER = IMP96996_VERDICT.conclusion;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97023_ASSERTIONS = [
  {
    id: 'imp97023-ladder-series-covers-full-ladder',
    holds: () => IMP97023_LADDER_SERIES.length === IMP96912_LADDER.length,
    why: 'the reshaped ladder series must carry every exact rung from the imp-96912 source ladder, no truncation.',
  },
  {
    id: 'imp97023-extrapolants-match-source-formulas',
    holds: () =>
      IMP97023_LADDER_SERIES.every((r) => {
        const L = Math.log(r.N);
        const expectedQuad = IMP96996_QUAD_TURNOVER.a + IMP96996_QUAD_TURNOVER.b * L + IMP96996_QUAD_TURNOVER.c * L * L;
        return Math.abs(r.quad - expectedQuad) < 1e-9 && Math.abs(r.line - froLine(r.N)) < 1e-9;
      }),
    why: 'the plotted extrapolants must be exactly the imp-96890/imp-96996 fitted forms, not re-derived approximations.',
  },
  {
    id: 'imp97023-far-field-reaches-past-turnover',
    holds: () =>
      IMP97023_FAR_FIELD_SERIES[IMP97023_FAR_FIELD_SERIES.length - 1].log10N > IMP97023_TURNOVER_FLAG.log10NPeak &&
      IMP97023_FAR_FIELD_SERIES.find((r) => Math.abs(r.log10N - IMP97023_TURNOVER_FLAG.log10NPeak) < 0.01) !== undefined,
    why: 'the far-field extension must run past the quad turnover point so a chart can show the peel-over, and must include a sample point at the turnover itself.',
  },
  {
    id: 'imp97023-turnover-past-ceiling-both-sides-consistent',
    holds: () =>
      IMP97023_TURNOVER_FLAG.decadesAboveCeiling > 1.5 &&
      IMP97023_TURNOVER_FLAG.decadesAboveCeiling < 2.0 &&
      IMP97023_TURNOVER_FLAG.quadStillMonotoneAtCeiling === true,
    why: 'the turnover flag carried into the viz must reproduce the imp-96996 ~1.75-decade gap between the ceiling scale and the turnover peak.',
  },
  {
    id: 'imp97023-ceiling-band-quad-disqualified-line-tail-admissible',
    holds: () =>
      IMP97023_CEILING_BAND.quad.admissible === false &&
      IMP97023_CEILING_BAND.quad.invertsFM === true &&
      IMP97023_CEILING_BAND.tail.admissible === true &&
      IMP97023_CEILING_BAND.tail.belowM === true &&
      IMP97023_CEILING_BAND.line.admissible === true &&
      IMP97023_CEILING_BAND.line.belowM === true,
    why: 'the carried ceiling band must preserve the imp-96996 monotonicity partition: quad disqualified and inverting F < M, line and tail admissible and below M_lo.',
  },
  {
    id: 'imp97023-presentation-only-no-qed',
    holds: () => IMP96996_VERDICT.qed === false && IMP96996_VERDICT.anyBoundMoved === false,
    why: 'presentation only: no bound is moved and no QED is claimed by the source finding this leaf reshapes.',
  },
];

for (const a of IMP97023_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97023-route-m-fm-model-selection-viz-data assertion failed: ${a.id}`);
  }
}
