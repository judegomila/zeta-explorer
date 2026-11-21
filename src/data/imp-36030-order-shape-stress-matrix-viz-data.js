/**
 * @module imp-36030-order-shape-stress-matrix-viz-data
 * @fileoverview imp-36030 -- import-light viz-data module for the imp-35973 order-x-shape
 *   pairwise-summation STRESS MATRIX at N = floor(sqrt(T_PT/4 pi)) ~ 488602: four rows
 *   (order-only, shape-only, combined cross, Kahan-Babuska floor), each carrying its
 *   normalized error and its fraction of the log2(N)*eps pairwise ceiling.
 *
 *   Values below are baked literals reproduced verbatim from the imp-35973 module's CONFIGS /
 *   crossTerm / kahanClusteredNormErr exports (rounded the same way the source module reports
 *   them) so this module has NO imports and costs nothing to load into a page, per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35973-w1-summation-order-shape-cross-term.js (source: full derivation, assertions, per-config math)
 *   @see imp-35852-w1-summation-adversarial-ordering.js (order-only worst: clustered same-sign runs)
 *   @see imp-35893-w1-summation-pairwise-tree-shape.js (shape-only worst: caterpillarR)
 *   @see imp-36023-kbn-combined-worst-ladder.js (KBN N-ladder floor, tighter than classic Kahan)
 *   @see imp-35761-w1-certified-rounding-cost-scope.js (log2(N)*eps pairwise ceiling this matrix normalizes against)
 *
 *   Ticket: imp-36030 (ux, low). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. NO QED. No refereed bound is changed.
 */

export const IMP36030_N_AT_TPT = 488602; // floor(sqrt(T_PT/4 pi)), T_PT = 3e12
export const IMP36030_CEIL_PAIRWISE = 4.196265611312305e-15; // log2(N)*eps at N ~ 488602

// The four-row stress matrix: normalized pairwise error and its fraction of the ceiling above.
export const IMP36030_STRESS_MATRIX = Object.freeze(
  [
    { config: 'order-only (balanced tree, clustered order)', treeDepth: 12, normErr: 3.148e-17, ceilingFraction: 0.0075019 },
    { config: 'shape-only (caterpillarR, original order)', treeDepth: 3817, normErr: 1.854e-18, ceilingFraction: 0.00044182 },
    { config: 'combined (caterpillarR, clustered order)', treeDepth: 3817, normErr: 4.324e-16, ceilingFraction: 0.10304400 },
    { config: 'Kahan-Babuska floor (clustered order)', treeDepth: null, normErr: 2.31e-19, ceilingFraction: 0.00005505 },
  ].map((row) => Object.freeze(row)),
);

export const IMP36030_SUMMARY = Object.freeze({
  worstRow: 'combined (caterpillarR, clustered order)',
  worstCeilingFraction: 0.10304400,
  combinedOverOrderOnly: 13.7, // ~4.324e-16 / 3.148e-17
  combinedOverShapeOnly: 233.2, // ~4.324e-16 / 1.854e-18
  kahanOverCeiling: 0.00005505, // Kahan-Babuska stays ~5.5e-5 of the ceiling: precision non-binding
});

export default Object.freeze({
  id: 'imp-36030-order-shape-stress-matrix-viz-data',
  ticket: 'imp-36030',
  sources: ['imp-35973-w1-summation-order-shape-cross-term.js'],
  nAtTPT: IMP36030_N_AT_TPT,
  ceilingPairwise: IMP36030_CEIL_PAIRWISE,
  rows: IMP36030_STRESS_MATRIX,
  summary: IMP36030_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36030_ASSERTIONS = [
  {
    id: 'imp36030-four-rows-present',
    holds: () => IMP36030_STRESS_MATRIX.length === 4,
    why: 'The stress matrix must carry all four imp-35973 rows: order-only, shape-only, combined, Kahan floor.',
  },
  {
    id: 'imp36030-combined-is-worst-and-highest-fraction',
    holds: () =>
      IMP36030_STRESS_MATRIX.every(
        (row) => row.config === 'combined (caterpillarR, clustered order)' || row.normErr < 4.324e-16,
      ) &&
      IMP36030_SUMMARY.worstCeilingFraction === Math.max(...IMP36030_STRESS_MATRIX.map((r) => r.ceilingFraction)),
    why: 'imp-35973 found the combined (order x shape) row is the worst pairwise configuration in this matrix.',
  },
  {
    id: 'imp36030-kahan-lowest-fraction-precision-non-binding',
    holds: () =>
      IMP36030_SUMMARY.kahanOverCeiling === Math.min(...IMP36030_STRESS_MATRIX.map((r) => r.ceilingFraction)) &&
      IMP36030_SUMMARY.kahanOverCeiling < 1e-3,
    why: 'Kahan-Babuska compensation must stay the smallest fraction of the ceiling, showing precision is non-binding even under the combined stress.',
  },
  {
    id: 'imp36030-all-rows-below-ceiling',
    holds: () => IMP36030_STRESS_MATRIX.every((row) => row.ceilingFraction < 1),
    why: 'No configuration in the matrix attains the log2(N)*eps ceiling, matching the imp-35973 headline finding.',
  },
  {
    id: 'imp36030-ceiling-matches-n-anchor',
    holds: () =>
      Math.abs(IMP36030_N_AT_TPT - Math.floor(Math.sqrt(3e12 / (4 * Math.PI)))) === 0 &&
      Math.abs(IMP36030_CEIL_PAIRWISE - Math.log2(IMP36030_N_AT_TPT) * 2 ** -52) / IMP36030_CEIL_PAIRWISE < 1e-9,
    why: 'The baked ceiling literal must match log2(N)*eps recomputed from the baked N anchor.',
  },
];

for (const assertion of IMP36030_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36030-order-shape-stress-matrix-viz-data assertion failed: ${assertion.id}`);
  }
}
