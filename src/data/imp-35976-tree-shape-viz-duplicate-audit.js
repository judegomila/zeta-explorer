/**
 * @module imp-35976-tree-shape-viz-duplicate-audit
 *
 * imp-35976 (ux, S-frontier ticket audit): imp-35976 asked to "Add an import-light
 * viz-data module (baked literals, no heavy imports) for the imp-35893 pairing-tree
 * SHAPE depth-vs-error table (7 shapes, depth 12->3817, err and err/ceiling)".
 *
 * Auditing src/data/ BEFORE writing a new viz-data module found this ALREADY
 * DELIVERED: imp-35956-pairwise-tree-shape-ladder-viz-data.js already exports the
 * identical seven-row imp-35893 pairing-tree SHAPE ladder (balanced depth 12 through
 * caterpillarR depth 3817) as baked literals -- shape, treeDepth, pairwiseNormErr,
 * and ratioToPairwiseCeiling per row -- with the same non-monotone-in-depth /
 * worst=caterpillarR framing imp-35976 requested, plus its own self-executing
 * assertions. imp-35976 is a DUPLICATE ticket the anti-starvation frontier scout
 * re-seeded from the same imp-35893 gap description before (or concurrently with)
 * imp-35956 landing.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new viz-data module -- imp-35956 already supplies the seven baked rows,
 * the scales, and the honest-status framing. No new numerics; no new claim;
 * changes no bound; NO QED. This module imports the pre-existing imp-35956 export
 * and pins a permanent regression guard that the imp-35976-requested viz-data
 * stays delivered.
 *
 * @see imp-35956-pairwise-tree-shape-ladder-viz-data (the pre-existing module delivering the requested viz-data)
 * @see imp-35893-w1-summation-pairwise-tree-shape (source measurement)
 * @see imp-35946-tree-shape-duplicate-audit (sibling duplicate-ticket audit pattern)
 */

import {
  IMP35956_TREE_SHAPE_LADDER_VIZ_DATA,
  IMP35956_TREE_SHAPE_LADDER,
  IMP35956_SCALES,
} from './imp-35956-pairwise-tree-shape-ladder-viz-data.js';

const DELIVERED = IMP35956_TREE_SHAPE_LADDER_VIZ_DATA;

export const IMP35976_TREE_SHAPE_VIZ_DUPLICATE_AUDIT = {
  id: 'imp-35976',
  proofSection: 'S-frontier',
  question:
    'imp-35976 asked to add an import-light viz-data module (baked literals, no heavy imports) ' +
    'for the imp-35893 pairing-tree SHAPE depth-vs-error table (7 shapes, depth 12->3817, ' +
    'err and err/ceiling); audit whether that viz-data module already exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. imp-35956-pairwise-tree-shape-ladder-viz-data.js already exports the ' +
    'identical seven-row imp-35893 pairing-tree shape ladder (balanced depth 12 through ' +
    'caterpillarR depth 3817) as baked literals with pairwiseNormErr and ratioToPairwiseCeiling ' +
    'per row, plus the non-monotone-in-depth note and self-executing assertions imp-35976 requested.',
  duplicateOf: 'imp-35956 (the ticket that authored the pre-existing pairing-tree shape viz-data module)',
  deliveredRungCount: IMP35956_TREE_SHAPE_LADDER.length,
  deliveredMaxDepth: IMP35956_SCALES.maxDepth,
  deliveredBalancedDepth: IMP35956_SCALES.balancedDepth,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new viz-data module added -- imp-35956 already supplies the seven baked ' +
    'pairing-tree shape rows (depth 12 -> 3817), their normalized error and ratio-to-ceiling ' +
    'columns, and the non-monotone-in-depth reading. This module records the duplicate-ticket ' +
    'finding and pins a permanent regression guard confirming the delivered viz-data stays ' +
    'present and consistent. Presentation-only; changes no bound; C_mb GUE-conditional (imp-486) ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35976_TREE_SHAPE_VIZ_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35976-delivered-seven-rungs',
    description: 'The pre-existing imp-35956 module exports exactly 7 pairing-tree shape rungs',
    holds: () => IMP35956_TREE_SHAPE_LADDER.length === 7,
  },
  {
    id: 'imp35976-delivered-depth-sweep-balanced-to-caterpillar',
    description: 'The delivered ladder sweeps tree depth from 12 (balanced) to 3817 (caterpillar)',
    holds: () =>
      IMP35956_SCALES.balancedDepth === 12 &&
      IMP35956_SCALES.maxDepth === 3817 &&
      IMP35956_TREE_SHAPE_LADDER.every((r) => typeof r.pairwiseNormErr === 'number' && typeof r.ratioToPairwiseCeiling === 'number'),
  },
  {
    id: 'imp35976-delivered-worst-is-caterpillarR',
    description: 'The delivered measurement identifies caterpillarR as the worst-error rung',
    holds: () => {
      const worst = IMP35956_TREE_SHAPE_LADDER.reduce((a, b) => (b.pairwiseNormErr > a.pairwiseNormErr ? b : a));
      return worst.shape === 'caterpillarR';
    },
  },
  {
    id: 'imp35976-duplicate-of-imp-35956',
    description: 'The audit correctly attributes the pre-existing viz-data module to imp-35956',
    holds: () => IMP35976_TREE_SHAPE_VIZ_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35956'),
  },
  {
    id: 'imp35976-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35976_TREE_SHAPE_VIZ_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35976_TREE_SHAPE_VIZ_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35976_TREE_SHAPE_VIZ_DUPLICATE_AUDIT.verdict) &&
      /GUE-conditional/.test(IMP35976_TREE_SHAPE_VIZ_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35976_TREE_SHAPE_VIZ_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35976-tree-shape-viz-duplicate-audit assertion failed: ${a.id}`);
  }
}
