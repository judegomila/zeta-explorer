// imp-35905: permanent build-time cohort import-guard for the imp-35852/imp-35853/
// imp-35854/imp-35855 S-frontier measurement cohort (imp-35880 pattern).
//
// Per [[verify_heavy_assertion_modules]], modules that transitively pull the 16.7MB
// zeros bundle HANG under vite ssrLoadModule; this cohort was re-verified via esbuild
// bundle (--bundle --platform=node --format=esm) + plain node instead: all four files
// bundled to 12.8-183.9KB (no zeros-bundle import anywhere in their transitive closure)
// and every bundle ran to exit 0 with its internal assertions passing.
//
// This module makes that check a permanent build-time regression guard, the same
// pattern imp-35826/imp-35859/imp-35880 established for earlier cohorts: importing all
// four objects here re-triggers each file's own internal self-executing assertions (any
// future regression throws at import), and the id checks below confirm every cohort
// member actually loaded rather than one import silently resolving to undefined.

import { IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING } from './imp-35852-w1-summation-adversarial-ordering.js';
import { IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE } from './imp-35853-req4-required-height-continuous-sigma-knee.js';
import { IMP35854_W1_SUMMATION_KAPPA_SWEEP } from './imp-35854-w1-summation-kappa-sweep.js';
import { IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION } from './imp-35855-rclean-interval-de-cancellation-assessment.js';

export const IMP35905_FRONTIER_MEASUREMENT_COHORT_IMPORT_GUARD = {
  id: 'imp-35905',
  proofSection: 'S-frontier',
  verifiedVia: 'esbuild bundle (--bundle --platform=node --format=esm) + plain node, per [[verify_heavy_assertion_modules]]',
  cohort: [
    IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.id,
    IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.id,
    IMP35854_W1_SUMMATION_KAPPA_SWEEP.id,
    IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION.id,
  ],
  verdict: 'all four cohort modules import cleanly and their self-executing assertions pass; now covered by a permanent regression guard. Verification only, changes no bound; NO QED; no refereed bound is changed.',
};

const EXPECTED_IDS = ['imp-35852', 'imp-35853', 'imp-35854', 'imp-35855'];

export const IMP35905_FRONTIER_MEASUREMENT_COHORT_IMPORT_GUARD_ASSERTIONS = [
  {
    id: 'imp35905-cohort-loaded',
    description: 'all four cohort modules resolved (their own internal self-executing assertions did not throw at import)',
    holds: () =>
      IMP35905_FRONTIER_MEASUREMENT_COHORT_IMPORT_GUARD.cohort.length === EXPECTED_IDS.length &&
      EXPECTED_IDS.every((id) => IMP35905_FRONTIER_MEASUREMENT_COHORT_IMPORT_GUARD.cohort.includes(id)),
  },
];

for (const a of IMP35905_FRONTIER_MEASUREMENT_COHORT_IMPORT_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35905-frontier-measurement-cohort-import-guard assertion failed: ${a.id}`);
  }
}
