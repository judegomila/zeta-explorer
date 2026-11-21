// imp-35826: VERIFY the newest heavy-assertion frontier cohort (imp-35762/imp-35763/
// imp-35764/imp-35766/imp-35777/imp-35778) imports cleanly and its self-executing
// assertions (imp-3715 convention: throw at import on failure) all pass.
//
// Per [[verify_heavy_assertion_modules]], modules that transitively pull the 16.7MB
// zeros bundle HANG under vite ssrLoadModule (the run-assertions.mjs loader), so the
// manual verification for this cohort ran via esbuild bundle + plain node instead:
// each of the six files bundled to 8-160KB (no zeros-bundle import) and ran to exit 0.
//
// This module makes that one-off manual check a permanent build-time regression guard:
// importing the six objects here re-triggers each file's own internal assertions (any
// future regression throws at import, same as it would under esbuild+node), and the id
// checks below confirm every cohort member actually loaded rather than one import
// silently resolving to undefined.

import { IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION } from './imp-35762-krawczyk-surplus-shift-residual-isolation.js';
import { IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL } from './imp-35763-req4-required-height-sigma-landmark-fill.js';
import { IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION } from './imp-35764-collision-scale-pt-anchor-prefactor-propagation.js';
import { IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND } from './imp-35766-krawczyk-cancellation-ratio-beyond-band.js';
import { IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE } from './imp-35777-i2-logderivative-panel-cap-scope.js';
import { IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE } from './imp-35778-i3-edge-type-floor-decomposition-scope.js';

export const IMP35826_HEAVY_ASSERTION_COHORT_VERIFICATION = {
  id: 'imp-35826',
  proofSection: 'S-frontier',
  verifiedVia: 'esbuild bundle (--bundle --platform=node --format=esm) + plain node, per [[verify_heavy_assertion_modules]]',
  cohort: [
    IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION.id,
    IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL.id,
    IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION.id,
    IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND.id,
    IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.id,
    IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE.id,
  ],
  verdict: 'all six cohort modules import cleanly and their self-executing assertions pass; verification only, changes no bound; NO QED; no refereed bound is changed.',
};

const EXPECTED_IDS = ['imp-35762', 'imp-35763', 'imp-35764', 'imp-35766', 'imp-35777', 'imp-35778'];

export const IMP35826_HEAVY_ASSERTION_COHORT_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp35826-cohort-loaded',
    description: 'all six cohort modules resolved (their own internal self-executing assertions did not throw at import)',
    holds: () =>
      IMP35826_HEAVY_ASSERTION_COHORT_VERIFICATION.cohort.length === EXPECTED_IDS.length &&
      EXPECTED_IDS.every((id) => IMP35826_HEAVY_ASSERTION_COHORT_VERIFICATION.cohort.includes(id)),
  },
];

for (const a of IMP35826_HEAVY_ASSERTION_COHORT_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35826-heavy-assertion-cohort-verification assertion failed: ${a.id}`);
  }
}
