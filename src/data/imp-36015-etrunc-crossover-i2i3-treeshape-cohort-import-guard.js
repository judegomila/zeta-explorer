// imp-36015: permanent build-time cohort import-guard for the newest
// measurement/viz modules imp-35950/imp-35951/imp-35956 (imp-35905/imp-35880 pattern).
//
// Per [[verify_heavy_assertion_modules]], modules that transitively pull the 16.7MB
// zeros-to-1e6 bundle HANG under vite ssrLoadModule; this cohort was re-verified via
// esbuild bundle (--bundle --platform=node --format=esm) + plain node instead: all
// three files bundled to 8.7-132.0KB with zero "zeros-to-1e6" references anywhere in
// their transitive closure, and every bundle ran to exit 0 with its internal
// self-executing assertions passing.
//
// This module makes that check a permanent build-time regression guard, the same
// pattern imp-35826/imp-35859/imp-35880/imp-35905 established for earlier cohorts:
// importing all three objects here re-triggers each file's own internal
// self-executing assertions (any future regression throws at import), and the id
// checks below confirm every cohort member actually loaded rather than one import
// silently resolving to undefined.

import { IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT } from './imp-35950-etrunc-ecoll-crossover-height.js';
import { IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY } from './imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy.js';
import { IMP35956_TREE_SHAPE_LADDER_VIZ_DATA } from './imp-35956-pairwise-tree-shape-ladder-viz-data.js';

export const IMP36015_NEWEST_COHORT_IMPORT_GUARD = {
  id: 'imp-36015',
  proofSection: 'S-frontier',
  verifiedVia: 'esbuild bundle (--bundle --platform=node --format=esm) + plain node, per [[verify_heavy_assertion_modules]]',
  cohort: [
    IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT.id,
    IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY.id,
    IMP35956_TREE_SHAPE_LADDER_VIZ_DATA.ticket,
  ],
  verdict: 'all three cohort modules import cleanly (no zeros-to-1e6 in their transitive bundle) and their self-executing assertions pass; now covered by a permanent regression guard. Verification only, changes no bound; NO QED; no refereed bound is changed.',
};

const EXPECTED_IDS = ['imp-35950', 'imp-35951', 'imp-35956'];

export const IMP36015_NEWEST_COHORT_IMPORT_GUARD_ASSERTIONS = [
  {
    id: 'imp36015-cohort-loaded',
    description: 'all three cohort modules resolved (their own internal self-executing assertions did not throw at import)',
    holds: () =>
      IMP36015_NEWEST_COHORT_IMPORT_GUARD.cohort.length === EXPECTED_IDS.length &&
      EXPECTED_IDS.every((id) => IMP36015_NEWEST_COHORT_IMPORT_GUARD.cohort.includes(id)),
  },
];

for (const a of IMP36015_NEWEST_COHORT_IMPORT_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36015-etrunc-crossover-i2i3-treeshape-cohort-import-guard assertion failed: ${a.id}`);
  }
}
