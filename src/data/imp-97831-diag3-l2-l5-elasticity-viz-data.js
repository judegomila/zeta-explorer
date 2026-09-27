/**
 * @module imp-97831-diag3-l2-l5-elasticity-viz-data
 *
 * imp-97831: import-light viz-data leaf charting the three-axis elasticities E_CC / E_ET / E_CF and the
 * machine-zero diagonal DIAG3 across ALL FOUR downslope landmarks L2..L5, joining the imp-97644 anchors
 * (L2/L3/L4) with the imp-97710 far-downslope cross-validation (L5, sigma = 0.02). No re-derivation, no
 * new computation -- every value is reused verbatim from the two frozen source modules.
 *
 * WHY L2..L5 TOGETHER: the imp-97644 three anchors already show E_CC/E_ET near +/-2 with a small negative
 * E_CF correction; imp-97710 added the far-downslope L5 rung where E_flow has collapsed almost entirely.
 * Charting all four side by side makes the E_flow-collapse REDUCTION legible: |E_CF| shrinks by roughly
 * five to six orders of magnitude from L2 to L5 while E_CC and E_ET converge onto an almost exact mutual
 * cancellation (E_CC ~ -E_ET), i.e. the identity degenerates from a three-term balance at L2 to an
 * effectively two-term numerator/E_trunc cancellation at L5.
 *
 * PRESENTATION ONLY. No new computation; DIAG3 == 0 is a scaling symmetry (Euler degree-0 homogeneity of
 * sigma = E_coll/E_N), NOT operator positivity; RH open; NO QED.
 *
 * @see imp-97644-three-axis-additivity-flow-prefactor.js (IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR.perLandmark, L2/L3/L4)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation.js (IMP97710_DIAG3_FOURTH_LANDMARK_CROSSVALIDATION, L5)
 */

import { IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR } from './imp-97644-three-axis-additivity-flow-prefactor.js';
import { IMP97710_DIAG3_FOURTH_LANDMARK_CROSSVALIDATION as L5 } from './imp-97710-diag3-fourth-landmark-crossvalidation.js';

const L2_L4 = IMP97644_THREE_AXIS_ADDITIVITY_FLOW_PREFACTOR.perLandmark.map((r) =>
  Object.freeze({
    key: r.key,
    label: r.label,
    sigma: r.sigma,
    elasticity_CC: r.elasticity_CC,
    elasticity_ET: r.elasticity_Et,
    elasticity_CF: r.elasticity_CF,
    diagonal3: r.diagonal3_elasticity,
  })
);

const L5_ROW = Object.freeze({
  key: L5.fourthLandmark.key,
  label: L5.fourthLandmark.label,
  sigma: L5.fourthLandmark.sigma,
  elasticity_CC: L5.directMeasurement.E_CC,
  elasticity_ET: L5.directMeasurement.E_ET,
  elasticity_CF: L5.directMeasurement.E_CF,
  diagonal3: L5.directMeasurement.DIAG3,
});

export const IMP97831_LANDMARK_ROWS = Object.freeze([...L2_L4, L5_ROW]);

const L2 = IMP97831_LANDMARK_ROWS[0];
const CF_SHRINK_L2_TO_L5 = Math.abs(L2.elasticity_CF) / Math.abs(L5_ROW.elasticity_CF);
const CC_ET_CANCELLATION_L5 = Math.abs(L5_ROW.elasticity_CC + L5_ROW.elasticity_ET);

export const IMP97831_SUMMARY = Object.freeze({
  law:
    'Across the four downslope landmarks L2 (sigma=0.9) through L5 (sigma=0.02, imp-97710 far-downslope '
    + 'cross-validation), E_CC and E_ET stay near +/-2 while |E_CF| collapses monotonically as the flow '
    + 'share of E_N vanishes: the three-term identity E_CC + E_ET + E_CF = 0 (DIAG3, machine/stencil-zero '
    + 'at every rung) degenerates into an effectively two-term numerator/E_trunc cancellation E_CC ~ -E_ET '
    + 'at L5.',
  cfShrinkL2ToL5: +CF_SHRINK_L2_TO_L5.toExponential(3),
  ccEtCancellationAtL5: +CC_ET_CANCELLATION_L5.toExponential(3),
  reading:
    `L2 (sigma=${L2.sigma}): E_CC=${L2.elasticity_CC.toFixed(4)}, E_ET=${L2.elasticity_ET.toFixed(4)}, `
    + `E_CF=${L2.elasticity_CF.toExponential(3)}. L5 (sigma=${L5_ROW.sigma}): `
    + `E_CC=${L5_ROW.elasticity_CC.toFixed(6)}, E_ET=${L5_ROW.elasticity_ET.toFixed(6)}, `
    + `E_CF=${L5_ROW.elasticity_CF.toExponential(4)}. |E_CF| shrinks ~${CF_SHRINK_L2_TO_L5.toExponential(2)}x `
    + `from L2 to L5, while |E_CC + E_ET| at L5 is only ${CC_ET_CANCELLATION_L5.toExponential(2)} -- the `
    + `far tail is essentially the numerator/E_trunc cancellation alone.`,
  verdict:
    'Presentation only: every elasticity and diagonal value is reused verbatim from imp-97644 (L2/L3/L4) '
    + 'and imp-97710 (L5); no new computation. DIAG3 == 0 at every landmark is a scaling symmetry (Euler '
    + 'degree-0 homogeneity of sigma = E_coll/E_N), not operator positivity. Conditional-share diagnostic '
    + 'on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional '
    + 'per imp-486, the C_C 1/8 ansatz and the pinned E_trunc are untouched; changes no bound; imp-3066 '
    + 'K_a >= 0 untouched; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97831_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97831-four-rows',
    description: 'exactly four landmark rows (L2, L3, L4, L5)',
    holds: () => IMP97831_LANDMARK_ROWS.length === 4,
  },
  {
    id: 'imp97831-diag3-near-zero-every-row',
    description: 'DIAG3 stays below 1e-6 at every landmark (machine/stencil floor, both sources)',
    holds: () => IMP97831_LANDMARK_ROWS.every((r) => Math.abs(r.diagonal3) < 1e-6),
  },
  {
    id: 'imp97831-cf-shrinks-monotonically',
    description: '|E_CF| strictly shrinks from L2 through L5',
    holds: () => {
      for (let i = 1; i < IMP97831_LANDMARK_ROWS.length; i++) {
        if (Math.abs(IMP97831_LANDMARK_ROWS[i].elasticity_CF) >= Math.abs(IMP97831_LANDMARK_ROWS[i - 1].elasticity_CF)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp97831-cc-et-opposite-signs-every-row',
    description: 'E_CC positive and E_ET negative at every landmark',
    holds: () => IMP97831_LANDMARK_ROWS.every((r) => r.elasticity_CC > 0 && r.elasticity_ET < 0),
  },
  {
    id: 'imp97831-l5-near-two-term-cancellation',
    description: 'at L5, |E_CC + E_ET| is far smaller than |E_CC| itself (near two-term cancellation)',
    holds: () => CC_ET_CANCELLATION_L5 < Math.abs(L5_ROW.elasticity_CC) * 1e-5,
  },
  {
    id: 'imp97831-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97831_SUMMARY.verdict) && /NO QED/.test(IMP97831_SUMMARY.verdict),
  },
];

for (const assertion of IMP97831_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97831 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97831_SUMMARY;
