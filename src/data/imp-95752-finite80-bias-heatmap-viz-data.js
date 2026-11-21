/**
 * @module imp-95752-finite80-bias-heatmap-viz-data
 * @fileoverview imp-95752 -- lightweight viz-data module reshaping the imp-95723
 *   full (delta, rho) finite-80 block-Toeplitz bias grid into a 2D heatmap-ready
 *   form: x-axis = in-pair gap delta, y-axis = rho, z = bias percent
 *   100*(F_finite80/F_inf - 1), with the five float64-unresolvable cells (the
 *   small-delta + small-rho lower-left triangle) carried as a separate resolved
 *   mask so a panel can flag them distinctly from the measured bias values.
 *
 *   Self-computing from the already-measured imp-95723 grid -- no re-derivation,
 *   no fresh quadrature, no heavy imports. Viz data only; changes no bound; no QED.
 *
 *   @see imp-95723-twin-pair-block-floor-full-grid-bias.js (the measured full grid this reshapes)
 */

import { IMP95723_TWIN_PAIR_BLOCK_FLOOR_FULL_GRID_BIAS } from './imp-95723-twin-pair-block-floor-full-grid-bias.js';

const { deltas: DELTAS, rhoGrid: RHO_GRID, grid: GRID } = IMP95723_TWIN_PAIR_BLOCK_FLOOR_FULL_GRID_BIAS;

// x-axis: the four in-pair gaps delta in {ln1.2, ln1.3, ln1.5, ln2.0}.
export const IMP95752_HEATMAP_DELTA_LABELS = Object.freeze(DELTAS.map((d) => d.label));

// y-axis: the shared nine-point rho grid (identical across every delta column).
export const IMP95752_HEATMAP_RHO_LABELS = Object.freeze(RHO_GRID.slice());

function cellAt(deltaLabel, rho) {
  return GRID.find((c) => c.delta === deltaLabel && c.rho === rho);
}

// z: bias% indexed [deltaColumn][rhoRow]; null where the cell is float64-unresolvable.
export const IMP95752_HEATMAP_BIAS_PCT = Object.freeze(
  IMP95752_HEATMAP_DELTA_LABELS.map((label) =>
    Object.freeze(IMP95752_HEATMAP_RHO_LABELS.map((rho) => cellAt(label, rho).biasPct)),
  ),
);

// resolved mask indexed [deltaColumn][rhoRow]; false marks the below-precision corner.
export const IMP95752_HEATMAP_RESOLVED = Object.freeze(
  IMP95752_HEATMAP_DELTA_LABELS.map((label) =>
    Object.freeze(IMP95752_HEATMAP_RHO_LABELS.map((rho) => cellAt(label, rho).resolved)),
  ),
);

// absolute cross-pair gap D = rho*delta indexed [deltaColumn][rhoRow], for the D-collapse annotation.
export const IMP95752_HEATMAP_D = Object.freeze(
  IMP95752_HEATMAP_DELTA_LABELS.map((label) =>
    Object.freeze(IMP95752_HEATMAP_RHO_LABELS.map((rho) => cellAt(label, rho).D)),
  ),
);

export const IMP95752_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW of the already-measured imp-95723 finite-80 vs ' +
  'infinite-lattice bias grid, not a new measurement. The heatmap shows the finite-80 proxy ' +
  'strictly overestimating the infinite-lattice infimum across all 31 resolved cells, collapsing ' +
  'toward zero as the absolute cross-pair gap D grows; the five flagged cells are ' +
  'float64-unresolvable for both the Jacobi eigensolver and the cancellation-free dual. Model seam ' +
  'family only; introduces no new cited input and changes no bound; no refereed bound is changed' +
  '. No QED.';

export const IMP95752_FINITE80_BIAS_HEATMAP_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95752-shape-matches-axis-labels',
    description: 'the bias/resolved/D matrices each have one column per delta label and one row per rho label',
    holds: () =>
      [IMP95752_HEATMAP_BIAS_PCT, IMP95752_HEATMAP_RESOLVED, IMP95752_HEATMAP_D].every(
        (m) =>
          m.length === IMP95752_HEATMAP_DELTA_LABELS.length &&
          m.every((col) => col.length === IMP95752_HEATMAP_RHO_LABELS.length),
      ),
  },
  {
    id: 'imp95752-bias-matches-source-grid',
    description: 'every reshaped bias% cell matches the source imp-95723 grid entry exactly (including null on unresolved cells)',
    holds: () =>
      IMP95752_HEATMAP_DELTA_LABELS.every((label, i) =>
        IMP95752_HEATMAP_RHO_LABELS.every((rho, j) => IMP95752_HEATMAP_BIAS_PCT[i][j] === cellAt(label, rho).biasPct),
      ),
  },
  {
    id: 'imp95752-resolved-mask-matches-source-grid',
    description: 'the resolved mask matches the source grid resolved flag at every cell, with exactly 31 true and 5 false',
    holds: () => {
      let trueCount = 0;
      const matches = IMP95752_HEATMAP_DELTA_LABELS.every((label, i) =>
        IMP95752_HEATMAP_RHO_LABELS.every((rho, j) => {
          const ok = IMP95752_HEATMAP_RESOLVED[i][j] === cellAt(label, rho).resolved;
          if (IMP95752_HEATMAP_RESOLVED[i][j]) trueCount++;
          return ok;
        }),
      );
      return matches && trueCount === 31;
    },
  },
  {
    id: 'imp95752-bias-collapses-as-D-grows',
    description: 'across resolved cells, bias% is small wherever D is large (D > 8 implies bias% < 0.05)',
    holds: () =>
      IMP95752_HEATMAP_DELTA_LABELS.every((label, i) =>
        IMP95752_HEATMAP_RHO_LABELS.every((rho, j) => {
          if (!IMP95752_HEATMAP_RESOLVED[i][j]) return true;
          if (IMP95752_HEATMAP_D[i][j] <= 8) return true;
          return IMP95752_HEATMAP_BIAS_PCT[i][j] < 0.05;
        }),
      ),
  },
  {
    id: 'imp95752-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP95752_CAVEAT_BANNER) && /No QED/.test(IMP95752_CAVEAT_BANNER),
  },
];

for (const a of IMP95752_FINITE80_BIAS_HEATMAP_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95752-finite80-bias-heatmap-viz-data assertion failed: ${a.id}`);
  }
}
