// imp-35880: VERIFY the imp-35808/imp-35809/imp-35810/imp-35811/imp-35812/imp-35813
// frontier-batch assertion modules import cleanly and their self-executing assertions
// (imp-3715 convention: throw at import on failure) all pass.
//
// The earlier imp-35859 cohort guard covered only five of the six (imp-35809..imp-35813);
// imp-35808 (the I3 long-edge derivative-delivery-scope module) was never wired into a
// permanent cohort check. Per [[verify_heavy_assertion_modules]], modules that
// transitively pull the 16.7MB zeros bundle HANG under vite ssrLoadModule (the
// run-assertions.mjs loader), so this cohort was manually re-verified via esbuild bundle
// (--bundle --platform=node --format=esm) + plain node: all six files bundled to
// 10-171KB (no zeros-bundle import anywhere in their transitive closure) and every
// bundle ran to exit 0 with its internal assertions passing.
//
// This module makes that check a permanent build-time regression guard, the same
// pattern imp-35826/imp-35859 established for earlier cohorts: importing all six
// objects here re-triggers each file's own internal assertions (any future regression
// throws at import, same as it would under esbuild+node), and the id checks below
// confirm every cohort member actually loaded rather than one import silently
// resolving to undefined.

import { IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE } from './imp-35808-i3-long-edge-derivative-delivery-scope.js';
import { IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE } from './imp-35809-krawczyk-surplus-split-band-and-height-profile.js';
import { IMP35810_CANCELLATION_ONSET_HEIGHT } from './imp-35810-cancellation-onset-height.js';
import { IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE } from './imp-35811-exact-debruijn-arbitrary-precision-digit-table.js';
import { IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST } from './imp-35812-w1-summation-scheme-measured-cost.js';
import { IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND } from './imp-35813-req4-required-height-sigma-landmark-extend.js';

export const IMP35880_FRONTIER_BATCH_COHORT_VERIFICATION = {
  id: 'imp-35880',
  proofSection: 'S-frontier',
  verifiedVia: 'esbuild bundle (--bundle --platform=node --format=esm) + plain node, per [[verify_heavy_assertion_modules]]',
  cohort: [
    IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.id,
    IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE.id,
    IMP35810_CANCELLATION_ONSET_HEIGHT.id,
    IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE.id,
    IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.id,
    IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND.id,
  ],
  verdict: 'all six cohort modules import cleanly and their self-executing assertions pass; imp-35808 is now covered by a permanent regression guard (previously only imp-35859 covered five of the six). Verification only, changes no bound; NO QED; no refereed bound is changed.',
};

const EXPECTED_IDS = ['imp-35808', 'imp-35809', 'imp-35810', 'imp-35811', 'imp-35812', 'imp-35813'];

export const IMP35880_FRONTIER_BATCH_COHORT_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp35880-cohort-loaded',
    description: 'all six cohort modules resolved (their own internal self-executing assertions did not throw at import)',
    holds: () =>
      IMP35880_FRONTIER_BATCH_COHORT_VERIFICATION.cohort.length === EXPECTED_IDS.length &&
      EXPECTED_IDS.every((id) => IMP35880_FRONTIER_BATCH_COHORT_VERIFICATION.cohort.includes(id)),
  },
];

for (const a of IMP35880_FRONTIER_BATCH_COHORT_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35880-frontier-batch-cohort-verification assertion failed: ${a.id}`);
  }
}
