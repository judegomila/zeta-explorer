/**
 * @module imp-36068-clustered-order-shape-sweep-viz-data
 * @fileoverview imp-36068 -- lightweight, import-light literal data for a
 *   visualization of the imp-36020 SEVEN-SHAPE ceiling-fraction sweep: under
 *   the imp-35852 CLUSTERED same-sign term order, every one of the seven
 *   imp-35893 pairing-tree shapes (balanced midpoint, four skew-fraction
 *   splits, left/right caterpillar) is re-summed at N = 488602 against the
 *   same order- and association-invariant exact BigInt reference. The
 *   combined normalized error is highly non-monotone in tree depth: skew0.03
 *   (depth 276) sits BELOW balanced (depth 12), yet caterpillarL (depth 3817)
 *   is the arg-max at ~41.2% of the log2(N)*eps pairwise ceiling -- ~4.0x the
 *   caterpillarR cross-term (~10.3%) imp-35973 had highlighted.
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-36020 measured `shapes` table (its self-computing BigInt-reference
 *   sweep); this module does NOT re-run that machinery, so importing it into
 *   a page costs nothing at load time.
 *
 *   @see imp-36020-w1-clustered-order-shape-argmax.js (source measurement: SHAPES, summary, verdict)
 *   @see imp-35973-w1-summation-order-shape-cross-term.js (fixed-shape cross-term this sweeps across all shapes)
 *   @see imp-35893-w1-summation-pairwise-tree-shape.js (tree-SHAPE stress at natural order)
 *   @see imp-35852-w1-summation-adversarial-ordering.js (term-ORDER stress at balanced tree)
 *
 *   Ticket: imp-36068 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; no refereed bound is changed; NO QED.
 */

// Per-shape combined normalized error under the clustered order, and its
// fraction of the log2(N)*eps pairwise ceiling (imp-36020 SHAPES, N = 488602).
export const IMP36068_SHAPE_SWEEP = Object.freeze([
  { shape: 'balanced(0.5)', treeDepth: 12, combinedNormErr: 3.148e-17, ratioToPairwiseCeiling: 7.5e-3 },
  { shape: 'skew0.25', treeDepth: 29, combinedNormErr: 3.148e-17, ratioToPairwiseCeiling: 7.5e-3 },
  { shape: 'skew0.1', treeDepth: 79, combinedNormErr: 3.148e-17, ratioToPairwiseCeiling: 7.5e-3 },
  { shape: 'skew0.03', treeDepth: 276, combinedNormErr: 1.55e-17, ratioToPairwiseCeiling: 3.69e-3 },
  { shape: 'skew0.01', treeDepth: 874, combinedNormErr: 6.345e-17, ratioToPairwiseCeiling: 1.51e-2 },
  { shape: 'caterpillarL', treeDepth: 3817, combinedNormErr: 1.731e-15, ratioToPairwiseCeiling: 4.12e-1 },
  { shape: 'caterpillarR', treeDepth: 3817, combinedNormErr: 4.324e-16, ratioToPairwiseCeiling: 1.03e-1 },
]);

export const IMP36068_ARGMAX_SHAPE = 'caterpillarL';
export const IMP36068_ARGMAX_RATIO_TO_CEILING = 4.12e-1; // ~41.2% of the log2(N)*eps ceiling
export const IMP36068_ARGMAX_OVER_CATERPILLAR_R = 4.0; // caterpillarL / caterpillarR combined error
export const IMP36068_ARGMAX_OVER_BALANCED = 55.0; // caterpillarL / shallow-tree order-only worst

// Non-monotone-in-depth highlight: skew0.03 (deeper tree) sits below balanced (shallower).
export const IMP36068_NON_MONOTONE_PAIR = {
  shallower: { shape: 'balanced(0.5)', treeDepth: 12, combinedNormErr: 3.148e-17 },
  deeper: { shape: 'skew0.03', treeDepth: 276, combinedNormErr: 1.55e-17 },
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36068_ASSERTIONS = [
  {
    id: 'imp36068-seven-shapes',
    holds: () => IMP36068_SHAPE_SWEEP.length === 7,
    why: 'The sweep must cover all seven imp-35893 pairing-tree shapes.',
  },
  {
    id: 'imp36068-argmax-is-caterpillarL',
    holds: () =>
      IMP36068_ARGMAX_SHAPE === 'caterpillarL' &&
      IMP36068_SHAPE_SWEEP.every((r) => r.combinedNormErr <= 1.731e-15 + 1e-25),
    why: 'caterpillarL must be the arg-max combined-error shape reproduced from imp-36020.',
  },
  {
    id: 'imp36068-argmax-ratio-in-range',
    holds: () => IMP36068_ARGMAX_RATIO_TO_CEILING > 0.35 && IMP36068_ARGMAX_RATIO_TO_CEILING < 0.5,
    why: 'The baked arg-max ceiling fraction must reproduce the imp-36020 ~41.2% figure.',
  },
  {
    id: 'imp36068-non-monotone-in-depth',
    holds: () =>
      IMP36068_NON_MONOTONE_PAIR.deeper.treeDepth > IMP36068_NON_MONOTONE_PAIR.shallower.treeDepth &&
      IMP36068_NON_MONOTONE_PAIR.deeper.combinedNormErr < IMP36068_NON_MONOTONE_PAIR.shallower.combinedNormErr,
    why: 'skew0.03 (deeper) must sit below balanced (shallower) -- the imp-36020 non-monotone-in-depth finding.',
  },
];

for (const assertion of IMP36068_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36068-clustered-order-shape-sweep-viz-data assertion failed: ${assertion.id}`);
  }
}
