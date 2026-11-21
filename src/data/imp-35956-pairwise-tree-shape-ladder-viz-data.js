/**
 * @module imp-35956-pairwise-tree-shape-ladder-viz-data
 * @fileoverview imp-35956 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35893 pairwise
 *   divide-and-conquer PAIRING-TREE SHAPE ladder: tree depth vs normalized pairwise
 *   error vs ratio-to-the-log2(N)*eps ceiling, swept from the balanced midpoint
 *   split (depth 12) through skew-fraction splits to the maximally-unbalanced
 *   caterpillar (depth 3817), all at the fixed N = 488602 imp-35812 term family.
 *
 *   The seven rungs are copied verbatim from imp-35893's measured table (balanced,
 *   skew0.25, skew0.1, skew0.03, skew0.01, caterpillarL, caterpillarR). This module
 *   does not import imp-35893 (no re-running the seven pairing trees at page-load
 *   time); it only bakes the recorded literals for direct charting.
 *
 *   @see imp-35893-w1-summation-pairwise-tree-shape.js (source measurement)
 *   @see imp-35852-w1-summation-adversarial-ordering.js (term-ORDER stress; imp-35893 varies tree SHAPE instead)
 *   @see imp-35897-kappa-sweep-ceiling-floor-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-35956 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

const N_AT_TPT = 488602; // Polymath15 retained-term count at T_PT = 3e12 (imp-35674 Part D)
const EPS_DOUBLE = 2 ** -52; // machine epsilon
const CEIL_PAIRWISE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (balanced-tree log2(N)*eps ceiling)

// Measured pairing-tree shape ladder (imp-35893), depth-ordered.
export const IMP35956_TREE_SHAPE_LADDER = Object.freeze([
  { shape: 'balanced(0.5)', treeDepth: 12, pairwiseNormErr: 3.56e-19, ratioToPairwiseCeiling: 8.48e-5 },
  { shape: 'skew0.25', treeDepth: 29, pairwiseNormErr: 1.89e-20, ratioToPairwiseCeiling: 4.51e-6, label: 'best' },
  { shape: 'skew0.1', treeDepth: 79, pairwiseNormErr: 3.56e-19, ratioToPairwiseCeiling: 8.48e-5 },
  { shape: 'skew0.03', treeDepth: 276, pairwiseNormErr: 2.31e-19, ratioToPairwiseCeiling: 5.50e-5 },
  { shape: 'skew0.01', treeDepth: 874, pairwiseNormErr: 2.31e-19, ratioToPairwiseCeiling: 5.50e-5 },
  { shape: 'caterpillarL', treeDepth: 3817, pairwiseNormErr: 1.44e-19, ratioToPairwiseCeiling: 3.43e-5 },
  { shape: 'caterpillarR', treeDepth: 3817, pairwiseNormErr: 1.85e-18, ratioToPairwiseCeiling: 4.42e-4, label: 'worst' },
]);

export const IMP35956_SCALES = Object.freeze({
  N: N_AT_TPT,
  eps: EPS_DOUBLE,
  pairwiseCeiling: CEIL_PAIRWISE,
  balancedDepth: IMP35956_TREE_SHAPE_LADDER[0].treeDepth,
  maxDepth: Math.max(...IMP35956_TREE_SHAPE_LADDER.map((r) => r.treeDepth)),
});

export const IMP35956_TREE_SHAPE_LADDER_VIZ_DATA = {
  ticket: 'imp-35956',
  sourceTicket: 'imp-35893',
  ladder: IMP35956_TREE_SHAPE_LADDER,
  scales: IMP35956_SCALES,
  note:
    'Measured pairwise divide-and-conquer normalized error and its ratio to the log2(N)*eps ceiling ' +
    '(imp-35893, seven pairing-tree shapes, N = 488602) as tree depth sweeps ~300x from balanced (12) ' +
    'to caterpillar (3817). The error stays non-monotone in depth (skew0.25, deeper than balanced, has ' +
    'a lower error) and the worst shape (caterpillarR) reaches only ~4.42e-4 of the ceiling.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35893 exact-BigInt-referenced pairing-tree ' +
    'shape measurement; adds no new derivation and changes no bound. Measurement only; certifies no ' +
    'W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; establishes no ' +
    'positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A). NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35956_VIZ_ASSERTIONS = [
  {
    id: 'imp35956-ladder-seven-rungs',
    description: 'ladder has exactly 7 rungs (the imp-35893 tree shapes)',
    holds: () => IMP35956_TREE_SHAPE_LADDER.length === 7,
  },
  {
    id: 'imp35956-depth-sweeps-balanced-to-caterpillar',
    description: 'tree depth sweeps from 12 (balanced) to 3817 (caterpillar), a >100x imbalance range',
    holds: () =>
      IMP35956_SCALES.balancedDepth === 12 &&
      IMP35956_SCALES.maxDepth === 3817 &&
      IMP35956_SCALES.maxDepth / IMP35956_SCALES.balancedDepth > 100,
  },
  {
    id: 'imp35956-all-rungs-below-ceiling',
    description: 'every rung normalized error stays below the log2(N)*eps ceiling',
    holds: () => IMP35956_TREE_SHAPE_LADDER.every((r) => r.pairwiseNormErr < IMP35956_SCALES.pairwiseCeiling),
  },
  {
    id: 'imp35956-worst-is-caterpillarR',
    description: 'the worst-error rung is caterpillarR, at ~4.42e-4 of ceiling',
    holds: () => {
      const worst = IMP35956_TREE_SHAPE_LADDER.reduce((a, b) => (b.pairwiseNormErr > a.pairwiseNormErr ? b : a));
      return worst.shape === 'caterpillarR' && Math.abs(worst.ratioToPairwiseCeiling - 4.42e-4) / 4.42e-4 < 0.01;
    },
  },
  {
    id: 'imp35956-non-monotone-in-depth',
    description: 'skew0.25 is deeper than balanced yet has a lower error (non-monotone in depth)',
    holds: () => {
      const balanced = IMP35956_TREE_SHAPE_LADDER.find((r) => r.shape === 'balanced(0.5)');
      const skew025 = IMP35956_TREE_SHAPE_LADDER.find((r) => r.shape === 'skew0.25');
      return skew025.treeDepth > balanced.treeDepth && skew025.pairwiseNormErr < balanced.pairwiseNormErr;
    },
  },
  {
    id: 'imp35956-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35956_TREE_SHAPE_LADDER_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP35956_TREE_SHAPE_LADDER_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35956_TREE_SHAPE_LADDER_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35956_TREE_SHAPE_LADDER_VIZ_DATA.honest),
  },
];

for (const a of IMP35956_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35956-pairwise-tree-shape-ladder-viz-data assertion failed: ${a.id}`);
  }
}
