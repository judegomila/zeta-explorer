/**
 * @module imp-97678-cc-elasticity-landmark-flowshare-viz-data
 *
 * imp-97678: import-light viz-data leaf charting the imp-97642 independently-verified C_C-elasticity
 * across the three downslope sigma landmarks (L2 +2.5554 steepest, L3 +2.1023, L4 +2.0790), paired with
 * the flow-share driver decomposition -- how much of each landmark's elasticity survives once the
 * E_flow term is frozen out (d ln R/dx -> 0). Reuses the imp-97642 landmark fields verbatim (no new
 * computation, no re-derivation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97642-l2-cc-elasticity-independent-verify.js (source landmarks + flowShareIsolation)
 */

import { IMP97642_L2_CC_ELASTICITY_INDEPENDENT_VERIFY as SRC } from './imp-97642-l2-cc-elasticity-independent-verify.js';

const L = SRC.landmarks;

// One row per downslope landmark: full elasticity vs the flow-frozen ("no flow") residual.
export const IMP97678_LANDMARK_ROWS = Object.freeze([
  Object.freeze({
    key: 'L2_below_0p9',
    label: 'L2 downslope below 0.9',
    elasticity: L.L2_below_0p9.elasticity_5point, // +2.55535443 -- steepest
    flowRemoved: L.L2_below_0p9.elasticity_flow_removed, // +2.12112700
    flowExcess: SRC.flowShareIsolation.L2_excess_from_flow, // +0.434228
    note: 'flow share still live at N ~ 2.57e7; carries almost all of the excess over the g_prime band',
  }),
  Object.freeze({
    key: 'L3_halving',
    label: 'L3 halving (sigma = 1/2)',
    elasticity: L.L3_halving.elasticity_5point, // +2.10234724
    flowRemoved: L.L3_halving.elasticity_flow_removed, // +2.09518700
    flowExcess: SRC.flowShareIsolation.L3_excess_from_flow, // +0.007161
    note: 'flow share nearly decayed away by N ~ 3.27e9',
  }),
  Object.freeze({
    key: 'L4_below_0p1',
    label: 'L4 tail below 0.1',
    elasticity: L.L4_below_0p1.elasticity_5point, // +2.07902469
    flowRemoved: L.L4_below_0p1.elasticity_flow_removed, // +2.07889000
    flowExcess: SRC.flowShareIsolation.L4_excess_from_flow, // +0.000135
    note: 'flow share essentially gone by N ~ 3.21e11 -- nearly all g_prime',
  }),
]);

export const IMP97678_SUMMARY = Object.freeze({
  law:
    'Freezing the E_flow term (d ln R/dx -> 0, i.e. R -> E_trunc) collapses all three downslope C_C-'
    + 'elasticities into the narrow g_prime-only band 2.079-2.121. The full elasticity minus that '
    + 'flow-removed residual is the flow-share excess, and it decays by three orders of magnitude from '
    + 'L2 to L4 as the crossing height climbs -- the flow share is the sole reason L2 is the steepest '
    + 'landmark, not any change in the g_prime-driven halving structure.',
  reading:
    `L2: ${IMP97678_LANDMARK_ROWS[0].elasticity.toFixed(6)} full vs `
    + `${IMP97678_LANDMARK_ROWS[0].flowRemoved.toFixed(6)} flow-removed (excess `
    + `+${IMP97678_LANDMARK_ROWS[0].flowExcess.toFixed(6)}). L3: `
    + `${IMP97678_LANDMARK_ROWS[1].elasticity.toFixed(6)} vs ${IMP97678_LANDMARK_ROWS[1].flowRemoved.toFixed(6)} `
    + `(excess +${IMP97678_LANDMARK_ROWS[1].flowExcess.toFixed(6)}). L4: `
    + `${IMP97678_LANDMARK_ROWS[2].elasticity.toFixed(6)} vs ${IMP97678_LANDMARK_ROWS[2].flowRemoved.toFixed(6)} `
    + `(excess +${IMP97678_LANDMARK_ROWS[2].flowExcess.toFixed(6)}).`,
  verdict:
    'Presentation only: all fields reused verbatim from imp-97642 (a prior independent verification), no '
    + 'new computation. Changes no bound; establishes no operator positivity; no refereed bound is changed'
    + '; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97678_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97678-three-rows',
    description: 'exactly three downslope landmark rows',
    holds: () => IMP97678_LANDMARK_ROWS.length === 3,
  },
  {
    id: 'imp97678-elasticity-order',
    description: 'L2 > L3 > L4 on the full elasticity, matching imp-97642',
    holds: () =>
      IMP97678_LANDMARK_ROWS[0].elasticity > IMP97678_LANDMARK_ROWS[1].elasticity
      && IMP97678_LANDMARK_ROWS[1].elasticity > IMP97678_LANDMARK_ROWS[2].elasticity,
  },
  {
    id: 'imp97678-flow-excess-decays',
    description: 'flow-share excess decays monotonically from L2 to L4',
    holds: () =>
      IMP97678_LANDMARK_ROWS[0].flowExcess > IMP97678_LANDMARK_ROWS[1].flowExcess
      && IMP97678_LANDMARK_ROWS[1].flowExcess > IMP97678_LANDMARK_ROWS[2].flowExcess
      && IMP97678_LANDMARK_ROWS[2].flowExcess > 0,
  },
  {
    id: 'imp97678-flow-removed-band-narrow',
    description: 'flow-removed residuals sit within a narrow 0.05-wide band across all three landmarks',
    holds: () => {
      const vals = IMP97678_LANDMARK_ROWS.map((r) => r.flowRemoved);
      return Math.max(...vals) - Math.min(...vals) < 0.05;
    },
  },
  {
    id: 'imp97678-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97678_SUMMARY.verdict) && /NO QED/.test(IMP97678_SUMMARY.verdict),
  },
];

for (const assertion of IMP97678_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97678 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97678_SUMMARY;
