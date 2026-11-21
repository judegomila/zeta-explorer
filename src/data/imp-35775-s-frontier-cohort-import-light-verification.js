// imp-35775: VERIFY the recent S-frontier data modules imp-35721/imp-35722/imp-35724/
// imp-35725/imp-35726/imp-35727 stay import-light and their self-executing assertions
// pass under esbuild-bundle + plain node (per [[verify_heavy_assertion_modules]]: modules
// importing the 16.7MB zeros bundle HANG under vite ssrLoadModule / npm-run-assert).
//
// Manual check: `npx esbuild <file> --bundle --platform=node --format=esm` on each of the
// six files bundled to 8.3KB-37KB (no trace of zeros-to-1e6.js, improvements.js, or
// improvement-queue.js anywhere in the transitive closure), and every bundle ran under
// plain `node` to exit 0 with its internal assertions passing.
//
// This module makes that check a permanent build-time regression guard, the same pattern
// imp-35826/imp-35859/imp-35880 established for earlier cohorts: importing all six
// objects here re-triggers each file's own internal assertions (any future regression
// throws at import), and the id checks below confirm every cohort member actually loaded
// rather than one import silently resolving to undefined.

import { IMP35721_CC_AMPLITUDE_MISMATCH_DUAL_READING_RECONCILIATION } from './imp-35721-cc-amplitude-mismatch-dual-reading-reconciliation.js';
import { IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER } from './imp-35722-req4-required-height-landmark-ladder.js';
import { IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION } from './imp-35724-collision-scale-landmark-prefactor-propagation.js';
import { IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET } from './imp-35725-w1-effective-error-cap-budget.js';
import { IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE } from './imp-35726-w1-sign-reconciliation-cost-scope.js';
import { IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE } from './imp-35727-w2-certified-winding-count-ingredients-scope.js';

export const IMP35775_S_FRONTIER_COHORT_IMPORT_LIGHT_VERIFICATION = {
  id: 'imp-35775',
  proofSection: 'S-frontier',
  verifiedVia: 'esbuild bundle (--bundle --platform=node --format=esm) + plain node, per [[verify_heavy_assertion_modules]]',
  cohort: [
    IMP35721_CC_AMPLITUDE_MISMATCH_DUAL_READING_RECONCILIATION.id,
    IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER.id,
    IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION.id,
    IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.id,
    IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.id,
    IMP35727_W2_CERTIFIED_WINDING_COUNT_INGREDIENTS_SCOPE.id,
  ],
  verdict: 'all six cohort modules import cleanly, stay import-light (8.3KB-37KB bundled, no zeros-bundle in the transitive closure), and their self-executing assertions pass. Verification only, changes no bound; NO QED; no refereed bound is changed.',
};

const EXPECTED_IDS = ['imp-35721', 'imp-35722', 'imp-35724', 'imp-35725', 'imp-35726', 'imp-35727'];

export const IMP35775_S_FRONTIER_COHORT_IMPORT_LIGHT_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp35775-cohort-loaded',
    description: 'all six cohort modules resolved (their own internal self-executing assertions did not throw at import)',
    holds: () =>
      IMP35775_S_FRONTIER_COHORT_IMPORT_LIGHT_VERIFICATION.cohort.length === EXPECTED_IDS.length &&
      EXPECTED_IDS.every((id) => IMP35775_S_FRONTIER_COHORT_IMPORT_LIGHT_VERIFICATION.cohort.includes(id)),
  },
];

for (const a of IMP35775_S_FRONTIER_COHORT_IMPORT_LIGHT_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35775-s-frontier-cohort-import-light-verification assertion failed: ${a.id}`);
  }
}
