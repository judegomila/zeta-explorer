/**
 * @module imp-97631-sigma-landmark-elasticity-comparison-viz-data
 *
 * imp-97631: import-light viz-data pairing the two frozen sensitivity axes measured for the four
 * imp-97520 sigma(N) landmarks -- the imp-97584 E_trunc-elasticity and the imp-97598 C_C-elasticity --
 * into one side-by-side comparison. Reuses both ELASTICITY objects verbatim (no re-derivation, no new
 * computation): C_C sits in the numerator of E_coll where E_trunc sits in the denominator of sigma, so
 * every downslope landmark sign-flips (+2 vs -2) while the interior peak L1 is the shared odd one out,
 * going from merely shallowest on the E_trunc axis (~-1.373) to EXACTLY zero on the C_C axis (a constant
 * multiplicative prefactor cannot move an extremum).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97584-sigma-landmark-etrunc-sensitivity.js (IMP97584_SIGMA_LANDMARK_ETRUNC_SENSITIVITY.elasticity)
 * @see imp-97598-sigma-landmark-cc-sensitivity.js (IMP97598_SIGMA_LANDMARK_CC_SENSITIVITY.elasticity)
 */

import { IMP97584_SIGMA_LANDMARK_ETRUNC_SENSITIVITY } from './imp-97584-sigma-landmark-etrunc-sensitivity.js';
import { IMP97598_SIGMA_LANDMARK_CC_SENSITIVITY } from './imp-97598-sigma-landmark-cc-sensitivity.js';

const ET = IMP97584_SIGMA_LANDMARK_ETRUNC_SENSITIVITY.elasticity;
const CC = IMP97598_SIGMA_LANDMARK_CC_SENSITIVITY.elasticity;

// One row per landmark, pairing the two axes for a grouped bar chart.
export const IMP97631_LANDMARK_ROWS = Object.freeze([
  Object.freeze({
    key: 'L1_peak',
    label: 'L1 interior peak',
    etrunc: ET.L1_peak, // ~ -1.373 (shallowest on this axis, but not zero)
    cc: CC.L1_peak, // ~  0.000 (EXACTLY C_C-invariant)
    note: 'the shared odd-one-out on both axes; C_C-invariant because C_C is a common factor of E_coll',
  }),
  Object.freeze({
    key: 'L2_below_0p9',
    label: 'L2 downslope below 0.9',
    etrunc: ET.L2_below_0p9, // ~ -2.304 (steepest on the E_trunc axis)
    cc: CC.L2_below_0p9, // ~ +2.555 (steepest on the C_C axis)
    note: 'steepest downslope crossing on BOTH axes',
  }),
  Object.freeze({
    key: 'L3_halving',
    label: 'L3 halving (sigma = 1/2)',
    etrunc: ET.L3_halving, // ~ -2.098
    cc: CC.L3_halving, // ~ +2.102
    note: 'nearly symmetric magnitude across the sign flip; matches the imp-97565 closed-form 2.102347',
  }),
  Object.freeze({
    key: 'L4_below_0p1',
    label: 'L4 tail below 0.1',
    etrunc: ET.L4_below_0p1, // ~ -2.079
    cc: CC.L4_below_0p1, // ~ +2.079
    note: 'closest of the three downslope landmarks to the closed-form magnitude 2',
  }),
]);

export const IMP97631_SUMMARY = Object.freeze({
  law:
    'The three downslope landmarks (L2/L3/L4) sign-flip between the two axes (N ~ E_trunc^-2 vs '
    + 'N ~ C_C^2) because E_trunc sits in the denominator of sigma while C_C sits in the numerator of '
    + 'E_coll -- but their magnitudes stay close to the shared closed-form value 2. The interior peak L1 '
    + 'is the outlier on both axes, and strictly more so on the C_C axis: shallow-but-nonzero '
    + '(~-1.373) on E_trunc versus EXACTLY zero on C_C, since a constant multiplicative prefactor of '
    + 'E_coll cannot shift the location of the extremum it helps define.',
  reading:
    `L1 goes from ${ET.L1_peak.toFixed(3)} on the E_trunc axis to ${CC.L1_peak.toFixed(3)} on the C_C `
    + `axis (invariant). L2 is the steepest downslope landmark on both axes: ${ET.L2_below_0p9.toFixed(3)} `
    + `vs +${CC.L2_below_0p9.toFixed(3)}. L3 halving is near-symmetric: ${ET.L3_halving.toFixed(3)} vs `
    + `+${CC.L3_halving.toFixed(3)}. L4 tail sits closest to the closed-form magnitude 2 on both axes: `
    + `${ET.L4_below_0p1.toFixed(3)} vs +${CC.L4_below_0p1.toFixed(3)}.`,
  verdict:
    'Presentation only: both elasticity axes are reused verbatim from imp-97584 and imp-97598 (prior '
    + 'measurements, not derivations); no new computation. Changes no bound; establishes no operator '
    + 'positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97631_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97631-four-rows',
    description: 'exactly four landmark rows, one per imp-97520 landmark',
    holds: () => IMP97631_LANDMARK_ROWS.length === 4,
  },
  {
    id: 'imp97631-downslope-sign-flip',
    description: 'L2/L3/L4 have opposite signs across the two axes (etrunc negative, cc positive)',
    holds: () =>
      IMP97631_LANDMARK_ROWS.filter((r) => r.key !== 'L1_peak').every(
        (r) => r.etrunc < 0 && r.cc > 0
      ),
  },
  {
    id: 'imp97631-peak-is-cc-invariant',
    description: 'the L1 peak C_C-elasticity is ~0, strictly smaller in magnitude than its E_trunc value',
    holds: () => {
      const l1 = IMP97631_LANDMARK_ROWS.find((r) => r.key === 'L1_peak');
      return Math.abs(l1.cc) < 1e-2 && Math.abs(l1.cc) < Math.abs(l1.etrunc);
    },
  },
  {
    id: 'imp97631-l2-steepest-on-both-axes',
    description: 'L2 has the largest-magnitude elasticity among the three downslope landmarks on both axes',
    holds: () => {
      const [l2, l3, l4] = ['L2_below_0p9', 'L3_halving', 'L4_below_0p1'].map((k) =>
        IMP97631_LANDMARK_ROWS.find((r) => r.key === k)
      );
      return (
        Math.abs(l2.etrunc) > Math.abs(l3.etrunc) &&
        Math.abs(l2.etrunc) > Math.abs(l4.etrunc) &&
        Math.abs(l2.cc) > Math.abs(l3.cc) &&
        Math.abs(l2.cc) > Math.abs(l4.cc)
      );
    },
  },
  {
    id: 'imp97631-downslope-magnitudes-near-two',
    description: 'all three downslope elasticities sit within 0.6 of magnitude 2 on both axes',
    holds: () =>
      IMP97631_LANDMARK_ROWS.filter((r) => r.key !== 'L1_peak').every(
        (r) => Math.abs(Math.abs(r.etrunc) - 2) < 0.6 && Math.abs(Math.abs(r.cc) - 2) < 0.6
      ),
  },
  {
    id: 'imp97631-l3-near-symmetric-magnitude',
    description: 'L3 halving magnitudes agree to within 0.01 across the sign flip',
    holds: () => {
      const l3 = IMP97631_LANDMARK_ROWS.find((r) => r.key === 'L3_halving');
      return Math.abs(Math.abs(l3.etrunc) - Math.abs(l3.cc)) < 0.01;
    },
  },
  {
    id: 'imp97631-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97631_SUMMARY.verdict) && /NO QED/.test(IMP97631_SUMMARY.verdict),
  },
];

for (const assertion of IMP97631_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97631 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97631_SUMMARY;
