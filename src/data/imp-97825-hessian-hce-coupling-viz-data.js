/**
 * @module imp-97825-hessian-hce-coupling-viz-data
 *
 * imp-97825: import-light viz-data leaf charting the imp-97720 diag3 log-Hessian off-diagonal
 * coupling H_ce (C_C / E_trunc mixed second elasticity) across the three imp-97520 landmarks
 * L2/L3/L4, paired with the closed-form share-product overlay H_ce = sigma * (E_trunc/E_N) --
 * the exact doubly-centered softmax-difference identity imp-97720 derived and measured. Reuses
 * IMP97720_DIAG3_SECOND_ORDER_HESSIAN.perLandmark verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97720-diag3-second-order-hessian.js (perLandmark, Hoff_CC_ET, share_coll, share_trunc, verdict)
 */

import { IMP97720_DIAG3_SECOND_ORDER_HESSIAN } from './imp-97720-diag3-second-order-hessian.js';

const { perLandmark, verdict } = IMP97720_DIAG3_SECOND_ORDER_HESSIAN;

// One row per landmark: the measured H_ce coupling vs its closed-form share product sigma * (E_trunc/E_N).
export const IMP97825_HCE_ROWS = Object.freeze(
  perLandmark.map((r) =>
    Object.freeze({
      key: r.key,
      label: r.label,
      sigma: r.sigma,
      N_L: r.N_L,
      H_ce_measured: r.Hoff_CC_ET,
      share_product: +(r.share_coll * r.share_trunc).toExponential(6),
      reldiff: +Math.abs(r.Hoff_CC_ET / (r.share_coll * r.share_trunc) - 1).toExponential(3),
    })
  )
);

const MAX_RELDIFF = Math.max(...IMP97825_HCE_ROWS.map((r) => r.reldiff));

export const IMP97825_SUMMARY = Object.freeze({
  reading:
    `The mixed second elasticity H_ce climbs and falls across the landmark ladder ` +
    `(${IMP97825_HCE_ROWS.map((r) => `${r.H_ce_measured} at ${r.label}`).join(', ')}), matching its ` +
    `closed-form share product sigma * (E_trunc/E_N) to < ${MAX_RELDIFF.toExponential(2)} relative at every ` +
    `landmark -- the exact doubly-centered softmax-difference identity, not a numerical coincidence.`,
  verdict,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97825_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97825-three-landmark-rows',
    description: 'exactly three landmark rows (L2, L3, L4)',
    holds: () => IMP97825_HCE_ROWS.length === 3,
  },
  {
    id: 'imp97825-hce-nonzero-every-landmark',
    description: 'H_ce is nonzero at every landmark (mixed second elasticity survives)',
    holds: () => IMP97825_HCE_ROWS.every((r) => Math.abs(r.H_ce_measured) > 1e-6),
  },
  {
    id: 'imp97825-hce-matches-share-product',
    description: 'H_ce matches sigma * (E_trunc/E_N) to < 1e-4 relative at every landmark',
    holds: () => MAX_RELDIFF < 1e-4,
  },
  {
    id: 'imp97825-values-match-imp97720-source',
    description: 'H_ce rows match the imp-97720 perLandmark Hoff_CC_ET field verbatim',
    holds: () => IMP97825_HCE_ROWS.every((row, i) => row.H_ce_measured === perLandmark[i].Hoff_CC_ET),
  },
  {
    id: 'imp97825-honesty-gate-no-qed',
    description: 'the reused verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97825_SUMMARY.verdict) && /NO QED/.test(IMP97825_SUMMARY.verdict),
  },
];

for (const assertion of IMP97825_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97825 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97825_SUMMARY;
