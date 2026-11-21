/**
 * @module imp-96884-sigma-peak-cc-etrunc-heatmap-viz-data
 *
 * imp-96884 (ux): import-light viz-data leaf for the imp-96851 2D
 * (log C_C, log E_trunc) sigma_max sensitivity band -- the binding
 * GUE-conditional peak share responds to the two levers essentially
 * additively (small positive mixed second derivative), and no in-model
 * combination over the realistic 2D band shrinks the ~0.95 conditioning
 * burden below ~0.85.
 *
 * imp-96851 exported summary statistics (base row, single-lever partials,
 * cross-term, band min/max corners) but no full grid: this module reshapes
 * the IMP96851_FULL_GRID literal (added alongside this leaf, verbatim
 * sigma_max values from the existing imp-96851 band loop, no re-fit and no
 * new numbers) into a chart-ready row-major heatmap grid plus the
 * single-lever partial annotations, following the imp-96836 viz-data-leaf
 * convention.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity;
 * C_mb/C_C stay GUE-conditional (imp-486); interval-rigorous certificate
 * reach stays 2a<=0.96; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-96851-sigma-peak-share-cc-etrunc-joint-sensitivity.js (source grid + verdict)
 * @see imp-96836-krein-tsweep-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96884 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96851_SIGMA_PEAK_SHARE_CC_ETRUNC_JOINT_SENSITIVITY,
  IMP96851_FULL_GRID,
} from './imp-96851-sigma-peak-share-cc-etrunc-joint-sensitivity.js';

const { singleLeverPartials, crossTerm, bandEnvelope, baseRow, verdict } =
  IMP96851_SIGMA_PEAK_SHARE_CC_ETRUNC_JOINT_SENSITIVITY;

export const IMP96884_CC_FACTORS = bandEnvelope.ccFactors;
export const IMP96884_ET_FACTORS = bandEnvelope.etFactors;

// Row-major heatmap: one row per ccFactor, one column per etFactor, verbatim
// sigma_max values from the IMP96851_FULL_GRID (no re-fit, no new numbers).
export const IMP96884_HEATMAP_ROWS = Object.freeze(
  IMP96884_CC_FACTORS.map((ccFactor) =>
    Object.freeze({
      ccFactor,
      cells: Object.freeze(
        IMP96884_ET_FACTORS.map((etFactor) => {
          const cell = IMP96851_FULL_GRID.find(
            (g) => g.ccFactor === ccFactor && g.etFactor === etFactor,
          );
          return Object.freeze({ etFactor, sigma_max: cell.sigma_max });
        }),
      ),
    }),
  ),
);

// Single-lever partials + cross-term, for an annotation panel next to the heatmap.
export const IMP96884_PARTIALS = Object.freeze({
  baseSigmaMax: baseRow.sigma_max,
  dSigmaDLogCC: singleLeverPartials.d_sigma_max_d_log_cc,
  dSigmaDLogETrunc: singleLeverPartials.d_sigma_max_d_log_etrunc,
  mixedSecondDerivative: crossTerm.measured_mixed_d2,
  crossTermSign: crossTerm.sign,
});

export const IMP96884_BAND_RANGE = Object.freeze({
  sigmaMaxMin: bandEnvelope.sigma_max_min,
  sigmaMaxMinCorner: bandEnvelope.sigma_max_min_corner,
  sigmaMaxMax: bandEnvelope.sigma_max_max,
  sigmaMaxMaxCorner: bandEnvelope.sigma_max_max_corner,
  span: bandEnvelope.span,
});

export const IMP96884_HONEST_BANNER =
  'Presentation only: reshapes the imp-96851 2D (log C_C, log E_trunc) sigma_max grid into a ' +
  'chart-ready heatmap, no re-fit and no new numbers. The two levers combine essentially ' +
  'additively (mixed second derivative ~+0.017, an order below the dominant C_C partial ' +
  '~+0.049); over the full band sigma_max ranges only ~0.846..0.985, so no in-model ' +
  'combination shrinks the ~0.95 GUE-conditional peak share. C_mb/C_C stay GUE-conditional ' +
  '(imp-486); RH open; no refereed bound is changed; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96884_ASSERTIONS = [
  {
    id: 'imp96884-heatmap-full-grid-shape',
    holds: () =>
      IMP96884_HEATMAP_ROWS.length === IMP96884_CC_FACTORS.length &&
      IMP96884_HEATMAP_ROWS.every((row) => row.cells.length === IMP96884_ET_FACTORS.length),
    why: 'the heatmap must carry every ccFactor x etFactor pair from the imp-96851 band sweep, no dropped rows or columns.',
  },
  {
    id: 'imp96884-heatmap-matches-full-grid-verbatim',
    holds: () =>
      IMP96851_FULL_GRID.every((g) => {
        const row = IMP96884_HEATMAP_ROWS.find((r) => r.ccFactor === g.ccFactor);
        const cell = row.cells.find((c) => c.etFactor === g.etFactor);
        return cell.sigma_max === g.sigma_max;
      }),
    why: 'every heatmap cell must reproduce the source imp-96851 grid value verbatim, with no re-fit or invented number.',
  },
  {
    id: 'imp96884-base-cell-matches-baserow',
    holds: () => {
      const row = IMP96884_HEATMAP_ROWS.find((r) => r.ccFactor === 1.0);
      const cell = row.cells.find((c) => c.etFactor === 1.0);
      return Math.abs(cell.sigma_max - IMP96884_PARTIALS.baseSigmaMax) < 1e-9;
    },
    why: 'the (1x, 1x) heatmap cell must reproduce the imp-96851 base peak share exactly.',
  },
  {
    id: 'imp96884-band-range-matches-heatmap-extrema',
    holds: () => {
      const all = IMP96884_HEATMAP_ROWS.flatMap((row) => row.cells.map((c) => c.sigma_max));
      return (
        Math.abs(Math.min(...all) - IMP96884_BAND_RANGE.sigmaMaxMin) < 1e-9 &&
        Math.abs(Math.max(...all) - IMP96884_BAND_RANGE.sigmaMaxMax) < 1e-9
      );
    },
    why: 'the reported band min/max must equal the actual extrema of the heatmap grid.',
  },
  {
    id: 'imp96884-honesty-markers-present',
    holds: () =>
      /RH open/.test(IMP96884_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96884_HONEST_BANNER) &&
      /NO QED/.test(IMP96884_HONEST_BANNER) &&
      /NO QED/.test(verdict),
    why: 'the viz leaf must carry the RH-open / PT-Lambda / NO-QED honesty markers, matching every sibling finding module.',
  },
];

for (const a of IMP96884_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96884-sigma-peak-cc-etrunc-heatmap-viz-data assertion failed: ${a.id}`);
  }
}
