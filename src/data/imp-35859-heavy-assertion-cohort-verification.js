// imp-35859: VERIFY the newer heavy-assertion frontier cohort (imp-35809/imp-35810/
// imp-35811/imp-35812/imp-35813) imports cleanly and its self-executing assertions
// (imp-3715 convention: throw at import on failure) all pass.
//
// Per [[verify_heavy_assertion_modules]], modules that transitively pull the 16.7MB
// zeros bundle HANG under vite ssrLoadModule (the run-assertions.mjs loader), so the
// manual verification for this cohort ran via esbuild bundle + plain node instead:
// each of the five files bundled to 11-175KB (no zeros-bundle import) and ran to exit 0.
//
// This module makes that one-off manual check a permanent build-time regression guard,
// the same pattern imp-35826 established for the earlier imp-35762/.../imp-35778
// cohort: importing the five objects here re-triggers each file's own internal
// assertions (any future regression throws at import, same as it would under
// esbuild+node), and the id checks below confirm every cohort member actually loaded
// rather than one import silently resolving to undefined.

import { IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE } from './imp-35809-krawczyk-surplus-split-band-and-height-profile.js';
import { IMP35810_CANCELLATION_ONSET_HEIGHT } from './imp-35810-cancellation-onset-height.js';
import { IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE } from './imp-35811-exact-debruijn-arbitrary-precision-digit-table.js';
import { IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST } from './imp-35812-w1-summation-scheme-measured-cost.js';
import { IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND } from './imp-35813-req4-required-height-sigma-landmark-extend.js';

export const IMP35859_HEAVY_ASSERTION_COHORT_VERIFICATION = {
  id: 'imp-35859',
  proofSection: 'S-frontier',
  verifiedVia: 'esbuild bundle (--bundle --platform=node --format=esm) + plain node, per [[verify_heavy_assertion_modules]]',
  cohort: [
    IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE.id,
    IMP35810_CANCELLATION_ONSET_HEIGHT.id,
    IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE.id,
    IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.id,
    IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND.id,
  ],
  verdict: 'all five cohort modules import cleanly and their self-executing assertions pass; verification only, changes no bound; NO QED; no refereed bound is changed.',
};

const EXPECTED_IDS = ['imp-35809', 'imp-35810', 'imp-35811', 'imp-35812', 'imp-35813'];

export const IMP35859_HEAVY_ASSERTION_COHORT_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp35859-cohort-loaded',
    description: 'all five cohort modules resolved (their own internal self-executing assertions did not throw at import)',
    holds: () =>
      IMP35859_HEAVY_ASSERTION_COHORT_VERIFICATION.cohort.length === EXPECTED_IDS.length &&
      EXPECTED_IDS.every((id) => IMP35859_HEAVY_ASSERTION_COHORT_VERIFICATION.cohort.includes(id)),
  },
];

for (const a of IMP35859_HEAVY_ASSERTION_COHORT_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35859-heavy-assertion-cohort-verification assertion failed: ${a.id}`);
  }
}
