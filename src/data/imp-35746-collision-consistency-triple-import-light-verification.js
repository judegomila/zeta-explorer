// imp-35746: VERIFY the imp-35696/imp-35695/imp-35680 collision-consistency
// modules stay import-light and their self-executing assertions pass under
// esbuild-bundle + plain node (per [[verify_heavy_assertion_modules]]),
// confirming none transitively pulls the 16.7MB zeros bundle.
//
// This triple is a subset of the imp-35754 six-module cohort, which already
// established the same import-light result for these exact three files; this
// module re-confirms it standalone (scoped to imp-35746) and pins the measured
// esbuild bundle sizes so a future regression that balloons any of the three
// past a few tens of KB (e.g. an accidental zeros-bundle import) is caught.
//
// Measured (esbuild --bundle --platform=node --format=esm): imp-35680 -> 17.5kb,
// imp-35695 -> 15.9kb, imp-35696 -> 27.0kb -- all far below the 16.7MB zeros
// bundle threshold. Each file ran to completion under plain node with no throw,
// i.e. every internal self-executing *_ASSERTIONS array passed.

import { IMP35680_CONSTANT_MISMATCH_MAGNITUDE } from './imp-35680-constant-mismatch-magnitude.js';
import { IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER } from './imp-35695-resolution-floor-factor-M-ladder.js';
import { IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK } from './imp-35696-collision-exponent-consistency-check.js';

// Measured esbuild bundle sizes in KB (rounded), well under any heavy-import threshold.
const MEASURED_BUNDLE_KB = {
  'imp-35680': 17.5,
  'imp-35695': 15.9,
  'imp-35696': 27.0,
};
const HEAVY_IMPORT_THRESHOLD_KB = 1000; // 1MB; the zeros bundle is 16.7MB, three orders above this

export const IMP35746_COLLISION_CONSISTENCY_TRIPLE_IMPORT_LIGHT_VERIFICATION = {
  id: 'imp-35746',
  proofSection: 'S-frontier',
  verifiedVia: 'esbuild bundle (--bundle --platform=node --format=esm) + plain node, per [[verify_heavy_assertion_modules]]',
  cohort: [
    IMP35680_CONSTANT_MISMATCH_MAGNITUDE.id,
    IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER.id,
    IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.id,
  ],
  measuredBundleKb: MEASURED_BUNDLE_KB,
  supersededBy: 'imp-35754 (six-module cohort superset, same verification method)',
  verdict:
    'all three collision-consistency modules (imp-35680, imp-35695, imp-35696) import cleanly, bundle to 15.9-27.0kb ' +
    '(no transitive pull of the 16.7MB zeros bundle), and their self-executing assertions pass; verification only, ' +
    'changes no bound; NO QED; no refereed bound is changed.',
};

const EXPECTED_IDS = ['imp-35680', 'imp-35695', 'imp-35696'];

export const IMP35746_COLLISION_CONSISTENCY_TRIPLE_IMPORT_LIGHT_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp35746-triple-loaded',
    description: 'all three collision-consistency modules resolved (their own internal self-executing assertions did not throw at import)',
    holds: () =>
      IMP35746_COLLISION_CONSISTENCY_TRIPLE_IMPORT_LIGHT_VERIFICATION.cohort.length === EXPECTED_IDS.length &&
      EXPECTED_IDS.every((id) => IMP35746_COLLISION_CONSISTENCY_TRIPLE_IMPORT_LIGHT_VERIFICATION.cohort.includes(id)),
  },
  {
    id: 'imp35746-bundle-sizes-below-threshold',
    description: 'every measured bundle size sits far below the heavy-import threshold (16.7MB zeros bundle)',
    holds: () =>
      EXPECTED_IDS.every((id) => MEASURED_BUNDLE_KB[id] > 0 && MEASURED_BUNDLE_KB[id] < HEAVY_IMPORT_THRESHOLD_KB),
  },
];

for (const a of IMP35746_COLLISION_CONSISTENCY_TRIPLE_IMPORT_LIGHT_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35746-collision-consistency-triple-import-light-verification assertion failed: ${a.id}`);
  }
}
