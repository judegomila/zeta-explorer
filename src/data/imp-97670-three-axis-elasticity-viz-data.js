/**
 * @module imp-97670-three-axis-elasticity-viz-data
 *
 * imp-97670: import-light viz-data leaf charting the imp-97644 single-axis elasticities
 * (E_CC, E_ET, E_CF) and the machine-zero three-axis diagonal (DIAG3) across the imp-97520
 * sigma landmarks L2/L3/L4. Reuses the frozen IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR
 * perLandmark rows verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97644-three-axis-additivity-flow-prefactor.js (IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR.perLandmark)
 */

import { IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR } from './imp-97644-three-axis-additivity-flow-prefactor.js';

const PER_LANDMARK = IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR.perLandmark;

// One row per landmark, carrying the three single-axis elasticities and the diagonal for a grouped
// bar chart (E_CC, E_ET, E_CF) plus a separate machine-zero DIAG3 readout.
export const IMP97670_LANDMARK_ROWS = Object.freeze(
  PER_LANDMARK.map((r) =>
    Object.freeze({
      key: r.key,
      label: r.label,
      sigma: r.sigma,
      elasticity_CC: r.elasticity_CC,
      elasticity_ET: r.elasticity_Et,
      elasticity_CF: r.elasticity_CF,
      diagonal3: r.diagonal3_elasticity,
    })
  )
);

export const IMP97670_SUMMARY = Object.freeze({
  law:
    'Across all three downslope landmarks the C_C and E_trunc elasticities sit close to +/-2 and '
    + 'nearly cancel, while the C_F flow-prefactor elasticity is a small negative correction (same sign '
    + 'as E_ET, two to four orders of magnitude smaller) that exactly closes the sum: E_CC + E_ET + E_CF '
    + 'is machine-zero relative to the three-axis diagonal DIAG3, which is itself machine-zero because '
    + 'sigma is degree-0 homogeneous in the three amplitudes.',
  reading:
    IMP97670_LANDMARK_ROWS
      ? `L2 (sigma=0.9): E_CC=${IMP97670_LANDMARK_ROWS[0].elasticity_CC.toFixed(4)}, `
        + `E_ET=${IMP97670_LANDMARK_ROWS[0].elasticity_ET.toFixed(4)}, `
        + `E_CF=${IMP97670_LANDMARK_ROWS[0].elasticity_CF.toExponential(3)}. `
        + `L3 (sigma=0.5): E_CC=${IMP97670_LANDMARK_ROWS[1].elasticity_CC.toFixed(4)}, `
        + `E_ET=${IMP97670_LANDMARK_ROWS[1].elasticity_ET.toFixed(4)}, `
        + `E_CF=${IMP97670_LANDMARK_ROWS[1].elasticity_CF.toExponential(3)}. `
        + `L4 (sigma=0.1): E_CC=${IMP97670_LANDMARK_ROWS[2].elasticity_CC.toFixed(4)}, `
        + `E_ET=${IMP97670_LANDMARK_ROWS[2].elasticity_ET.toFixed(4)}, `
        + `E_CF=${IMP97670_LANDMARK_ROWS[2].elasticity_CF.toExponential(3)}. `
        + `DIAG3 is machine-zero (< 1e-9) at every landmark.`
      : '',
  verdict:
    'Presentation only: every elasticity and diagonal value is reused verbatim from imp-97644 (a '
    + 'measurement, not a derivation); no new computation. Conditional-share diagnostic on the '
    + 'inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; '
    + 'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97670_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97670-three-rows',
    description: 'exactly three landmark rows (L2, L3, L4)',
    holds: () => IMP97670_LANDMARK_ROWS.length === 3,
  },
  {
    id: 'imp97670-diag3-machine-zero',
    description: 'DIAG3 is machine-zero (< 1e-9) at every landmark',
    holds: () => IMP97670_LANDMARK_ROWS.every((r) => Math.abs(r.diagonal3) < 1e-9),
  },
  {
    id: 'imp97670-cc-et-opposite-signs',
    description: 'E_CC positive and E_ET negative at every landmark (downslope sign flip)',
    holds: () => IMP97670_LANDMARK_ROWS.every((r) => r.elasticity_CC > 0 && r.elasticity_ET < 0),
  },
  {
    id: 'imp97670-cf-small-and-same-sign-as-et',
    description: 'E_CF shares the E_ET sign and is strictly smaller in magnitude at every landmark',
    holds: () =>
      IMP97670_LANDMARK_ROWS.every(
        (r) => r.elasticity_CF < 0 && Math.abs(r.elasticity_CF) < Math.abs(r.elasticity_ET)
      ),
  },
  {
    id: 'imp97670-cf-shrinks-outward',
    description: '|E_CF| strictly shrinks from L2 to L3 to L4 (flow share of E_N decays outward)',
    holds: () => {
      const [l2, l3, l4] = IMP97670_LANDMARK_ROWS;
      return Math.abs(l2.elasticity_CF) > Math.abs(l3.elasticity_CF) && Math.abs(l3.elasticity_CF) > Math.abs(l4.elasticity_CF);
    },
  },
  {
    id: 'imp97670-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97670_SUMMARY.verdict) && /NO QED/.test(IMP97670_SUMMARY.verdict),
  },
];

for (const assertion of IMP97670_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97670 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97670_SUMMARY;
