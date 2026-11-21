// imp-35754: VERIFY the newest heavy-assertion frontier cohort (imp-35677/imp-35678/
// imp-35679/imp-35680/imp-35695/imp-35696) imports cleanly and its self-executing
// assertions (imp-3715 convention: throw at import on failure) all pass.
//
// Per [[verify_heavy_assertion_modules]], modules that transitively pull the 16.7MB
// zeros bundle HANG under vite ssrLoadModule (the run-assertions.mjs loader), so the
// manual verification for this cohort ran via esbuild bundle + plain node instead:
// each of the six files bundled to 8-31KB (no zeros-bundle import) and ran to exit 0.
//
// This module makes that one-off manual check a permanent build-time regression guard:
// importing the six objects here re-triggers each file's own internal assertions (any
// future regression throws at import, same as it would under esbuild+node), and the id
// checks below confirm every cohort member actually loaded rather than one import
// silently resolving to undefined.

import { IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER } from './imp-35677-postport-residual-share-sigma-ladder.js';
import { IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY } from './imp-35678-finite-height-beat-vs-parity-regime-boundary.js';
import { IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION } from './imp-35679-postport-share-sum-unity-excess-reconciliation.js';
import { IMP35680_CONSTANT_MISMATCH_MAGNITUDE } from './imp-35680-constant-mismatch-magnitude.js';
import { IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER } from './imp-35695-resolution-floor-factor-M-ladder.js';
import { IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK } from './imp-35696-collision-exponent-consistency-check.js';

export const IMP35754_HEAVY_ASSERTION_COHORT_VERIFICATION = {
  id: 'imp-35754',
  proofSection: 'S-frontier',
  verifiedVia: 'esbuild bundle (--bundle --platform=node --format=esm) + plain node, per [[verify_heavy_assertion_modules]]',
  cohort: [
    IMP35677_POSTPORT_RESIDUAL_SHARE_SIGMA_LADDER.id,
    IMP35678_FINITE_HEIGHT_BEAT_VS_PARITY_REGIME_BOUNDARY.id,
    IMP35679_POSTPORT_SHARE_SUM_UNITY_EXCESS_RECONCILIATION.id,
    IMP35680_CONSTANT_MISMATCH_MAGNITUDE.id,
    IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER.id,
    IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.id,
  ],
  verdict: 'all six cohort modules import cleanly and their self-executing assertions pass; verification only, changes no bound; NO QED; no refereed bound is changed.',
};

const EXPECTED_IDS = ['imp-35677', 'imp-35678', 'imp-35679', 'imp-35680', 'imp-35695', 'imp-35696'];

export const IMP35754_HEAVY_ASSERTION_COHORT_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp35754-cohort-loaded',
    description: 'all six cohort modules resolved (their own internal self-executing assertions did not throw at import)',
    holds: () =>
      IMP35754_HEAVY_ASSERTION_COHORT_VERIFICATION.cohort.length === EXPECTED_IDS.length &&
      EXPECTED_IDS.every((id) => IMP35754_HEAVY_ASSERTION_COHORT_VERIFICATION.cohort.includes(id)),
  },
];

for (const a of IMP35754_HEAVY_ASSERTION_COHORT_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35754-heavy-assertion-cohort-verification assertion failed: ${a.id}`);
  }
}
