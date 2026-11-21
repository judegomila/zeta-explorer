/**
 * @module imp-35978-rdirect-floor-viz-duplicate-audit
 *
 * imp-35978 (ux, S-frontier ticket audit): imp-35978 asked to "Add an import-light
 * viz-data module (baked literals, no heavy imports) for the imp-35892 R_direct vs N
 * floor-departure sweep, marking the <=2-ULP plateau and the NaN cliff at N~10^307.46".
 *
 * Auditing src/data/ BEFORE writing a new viz-data module found this ALREADY
 * DELIVERED: imp-35957-rdirect-floor-height-sweep-viz-data.js already exports the
 * identical imp-35892 R_direct floor-vs-height sweep as baked literals (an 11-row
 * plateau ladder from N=1e13 to the last finite N~2.857e307, the <=2 ULP departure
 * ceiling, and the hard NaN cliff markers), registered into a page
 * (Imp35957RdirectFloorHeightSweepViz.jsx) and route in App.jsx. imp-35978 is a
 * DUPLICATE ticket the anti-starvation frontier scout re-seeded from the same
 * imp-35892 gap description before (or concurrently with) imp-35957 landing.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new viz-data module -- imp-35957 already supplies the baked plateau rows,
 * the plateau ceiling, and the hard-cliff framing. No new numerics; no new claim;
 * changes no bound; NO QED. This module imports the pre-existing imp-35957 exports
 * and pins a permanent regression guard that the imp-35978-requested viz-data stays
 * delivered.
 *
 * @see imp-35957-rdirect-floor-height-sweep-viz-data (the pre-existing module delivering the requested viz-data)
 * @see imp-35892-rdirect-own-floor-departure-height (source measurement)
 * @see imp-35976-tree-shape-viz-duplicate-audit (sibling duplicate-ticket audit pattern)
 */

import {
  IMP35957_PLATEAU_ROWS,
  IMP35957_MAX_DEPART_FINITE,
  IMP35957_MAX_DEPART_ULP,
  IMP35957_THRESHOLD,
  IMP35957_LAST_FINITE_LOG10_N,
  IMP35957_CLIFF_IS_HARD,
  IMP35957_A_STILL_NORMAL_AT_CLIFF,
  IMP35957_OVERFLOW_IS_HEIGHT_INVERSE,
} from './imp-35957-rdirect-floor-height-sweep-viz-data.js';

export const IMP35978_RDIRECT_FLOOR_VIZ_DUPLICATE_AUDIT = {
  id: 'imp-35978',
  proofSection: 'S-frontier',
  question:
    'imp-35978 asked to add an import-light viz-data module (baked literals, no heavy imports) ' +
    'for the imp-35892 R_direct vs N floor-departure sweep, marking the <=2-ULP plateau and the ' +
    'NaN cliff at N~10^307.46; audit whether that viz-data module already exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. imp-35957-rdirect-floor-height-sweep-viz-data.js already exports the ' +
    'identical imp-35892 R_direct floor-vs-height sweep as baked literals -- an 11-row plateau ' +
    'ladder from N=1e13 to the last finite N~2.857e307, the <=2 ULP departure ceiling, and the ' +
    'hard-NaN-cliff markers imp-35978 requested -- and is already wired into a registered page ' +
    'and route.',
  duplicateOf: 'imp-35957 (the ticket that authored the pre-existing R_direct floor-departure viz-data module)',
  deliveredRowCount: IMP35957_PLATEAU_ROWS.length,
  deliveredMaxDepartUlp: IMP35957_MAX_DEPART_ULP,
  deliveredLastFiniteLog10N: IMP35957_LAST_FINITE_LOG10_N,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new viz-data module added -- imp-35957 already supplies the baked plateau ' +
    'rows (N=1e13 through ~1e307.46), the <=2 ULP departure ceiling, and the hard-NaN-cliff ' +
    'reading, plus a page/route. This module records the duplicate-ticket finding and pins a ' +
    'permanent regression guard confirming the delivered viz-data stays present and consistent. ' +
    'Presentation-only; changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
};

export const IMP35978_RDIRECT_FLOOR_VIZ_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35978-delivered-plateau-rows',
    description: 'The pre-existing imp-35957 module exports a non-empty baked plateau row set',
    holds: () => Array.isArray(IMP35957_PLATEAU_ROWS) && IMP35957_PLATEAU_ROWS.length === 11,
  },
  {
    id: 'imp35978-delivered-below-threshold',
    description: 'The delivered plateau ceiling stays below the imp-35892 1e-12 threshold, at <=2 ULP',
    holds: () => IMP35957_MAX_DEPART_FINITE < IMP35957_THRESHOLD && IMP35957_MAX_DEPART_ULP < 2,
  },
  {
    id: 'imp35978-delivered-cliff-is-hard-height-inverse',
    description: 'The delivered cliff markers match the imp-35892 hard NaN cliff at N~10^307.46',
    holds: () =>
      IMP35957_CLIFF_IS_HARD === true &&
      IMP35957_A_STILL_NORMAL_AT_CLIFF === true &&
      IMP35957_OVERFLOW_IS_HEIGHT_INVERSE === true &&
      IMP35957_LAST_FINITE_LOG10_N > 307 &&
      IMP35957_LAST_FINITE_LOG10_N < 308,
  },
  {
    id: 'imp35978-duplicate-of-imp-35957',
    description: 'The audit correctly attributes the pre-existing viz-data module to imp-35957',
    holds: () => IMP35978_RDIRECT_FLOOR_VIZ_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35957'),
  },
  {
    id: 'imp35978-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35978_RDIRECT_FLOOR_VIZ_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35978_RDIRECT_FLOOR_VIZ_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35978_RDIRECT_FLOOR_VIZ_DUPLICATE_AUDIT.verdict) &&
      /GUE-conditional/.test(IMP35978_RDIRECT_FLOOR_VIZ_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35978_RDIRECT_FLOOR_VIZ_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35978-rdirect-floor-viz-duplicate-audit assertion failed: ${a.id}`);
  }
}
