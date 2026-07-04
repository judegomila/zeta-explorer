/**
 * @module imp-33822-decoupled-rate-grid-heatmap-viz-data
 * @fileoverview imp-33822 -- lightweight viz-data module reshaping the imp-33789
 *   decoupled pass/shear-rate grid into a 2D heatmap-ready form: x-axis = shear
 *   rate s_a, y-axis = pass/shear ratio s_b/s_a, z = Perron norm ||R||(s_a, s_b),
 *   with the imp-33789 ||R|| = 1 crossing contour packaged as an overlay series
 *   (one crossing ratio per s_a column). Distinct from the imp-33802 1D
 *   ||R|| vs s_b probe at a single fixed s_a = 3 slice -- this module covers the
 *   FULL two-parameter grid across every s_a in the imp-33789 sweep.
 *
 *   Self-computing from the already-measured imp-33789 GRID and CONTOUR --
 *   no re-derivation, no fresh quadrature, no heavy imports. Viz data only;
 *   changes no bound; no QED.
 *
 *   @see imp-33789-decoupled-rate-grid.js (the measured two-parameter grid and contour)
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (the imp-33765 three-point anchor slice)
 */

import { IMP33789_DECOUPLED_RATE_GRID } from './imp-33789-decoupled-rate-grid.js';

const { grid: GRID, contour: CONTOUR } = IMP33789_DECOUPLED_RATE_GRID.measured;

// x-axis: the shear-rate grid s_a in {1,2,3,4,6,8}.
export const IMP33822_HEATMAP_X_LABELS = Object.freeze(GRID.map((g) => g.sShear));

// y-axis: the shared pass/shear ratio multipliers s_b/s_a (identical across every s_a row).
export const IMP33822_HEATMAP_Y_LABELS = Object.freeze(GRID[0].row.map((r) => r.ratio));

// z: ||R||(s_a, s_b) indexed [sShearColumn][ratioRow], ready for a heatmap grid.
export const IMP33822_HEATMAP_Z = Object.freeze(GRID.map((g) => Object.freeze(g.row.map((r) => r.operatorNorm))));

// The ||R|| = 1 crossing contour, as an (s_a, ratio) line overlay on top of the heatmap.
export const IMP33822_CONTOUR_OVERLAY = Object.freeze(
  CONTOUR.map((c) => ({ sShear: c.sShear, ratio: c.overshootRatio, sPassStar: c.crossingPassRate })),
);

export const IMP33822_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW of the already-measured imp-33789 decoupled-rate grid, ' +
  'not a new measurement. The decoupled probe deliberately breaks the shared-rate exponential and ' +
  'is a diagnostic device, not an admissible imp-3066 modification. Carries no RH verdict; ' +
  'imp-3066 / imp-33725 / imp-33765 / imp-33789 / G7 remain untouched; K_a >= 0 and positivity were ' +
  'not attempted; Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA. No QED.';

export const IMP33822_DECOUPLED_RATE_GRID_HEATMAP_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp33822-shape-matches-axis-labels',
    description: 'the z matrix has one row per x label and one column per y label',
    holds: () =>
      IMP33822_HEATMAP_Z.length === IMP33822_HEATMAP_X_LABELS.length &&
      IMP33822_HEATMAP_Z.every((row) => row.length === IMP33822_HEATMAP_Y_LABELS.length),
  },
  {
    id: 'imp33822-z-matches-source-grid',
    description: 'every reshaped z cell matches the source imp-33789 grid operatorNorm exactly',
    holds: () =>
      GRID.every((g, i) => g.row.every((r, j) => IMP33822_HEATMAP_Z[i][j] === r.operatorNorm)),
  },
  {
    id: 'imp33822-anchor-cell-matches-coupled-anchor',
    description: 'the s_a = 3, ratio = 1 cell (the coupled anchor s_b = s_a = 3) matches the roadmap G7 anchor ~4.617014',
    holds: () => {
      const iSa = IMP33822_HEATMAP_X_LABELS.indexOf(3);
      const jRatio = IMP33822_HEATMAP_Y_LABELS.indexOf(1);
      return iSa >= 0 && jRatio >= 0 && Math.abs(IMP33822_HEATMAP_Z[iSa][jRatio] - 4.617014) < 1e-4;
    },
  },
  {
    id: 'imp33822-contour-overlay-covers-every-column',
    description: 'the contour overlay has exactly one crossing point per s_a column, all with ratio > 1',
    holds: () =>
      IMP33822_CONTOUR_OVERLAY.length === IMP33822_HEATMAP_X_LABELS.length &&
      IMP33822_CONTOUR_OVERLAY.every((c) => c.ratio > 1 && c.sPassStar > c.sShear),
  },
  {
    id: 'imp33822-rows-monotone-decreasing-in-ratio',
    description: 'each heatmap row (fixed s_a, rising ratio) is monotonically decreasing, matching the imp-33789 measurement',
    holds: () =>
      IMP33822_HEATMAP_Z.every((row) => {
        for (let k = 1; k < row.length; k++) {
          if (row[k] >= row[k - 1]) return false;
        }
        return true;
      }),
  },
  {
    id: 'imp33822-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP33822_CAVEAT_BANNER) && /No QED/.test(IMP33822_CAVEAT_BANNER),
  },
];

for (const a of IMP33822_DECOUPLED_RATE_GRID_HEATMAP_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33822-decoupled-rate-grid-heatmap-viz-data assertion failed: ${a.id}`);
  }
}
