/**
 * @module imp-97693-cc-elasticity-fold-viz-data
 *
 * imp-97693: import-light viz-data leaf charting the imp-97662 C_C-elasticity square-root fold --
 * E*sqrt(sigma_max - s) approaching +/-K ~ 0.4233 on the downslope (+K) and upslope (-K) branches as
 * the target level s closes in on the imp-97520 L1 interior peak sigma_max ~ 0.949429. Reuses the
 * imp-97662 gap ladder, scaled-elasticity rows, and predicted amplitude verbatim (no new computation,
 * no re-derivation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97662-cc-elasticity-peak-divergence.js (source divergence law + gap ladder)
 */

import { IMP97662_CC_ELASTICITY_PEAK_DIVERGENCE as SRC } from './imp-97662-cc-elasticity-peak-divergence.js';

const D = SRC.divergenceLaw;

// One row per gap: the closed-form scaled elasticity on both branches, converging on +/-K.
export const IMP97693_FOLD_ROWS = Object.freeze(
  D.gaps.map((gap, i) =>
    Object.freeze({
      gap,
      downScaled: D.E_times_sqrtgap_down[i], // -> +K
      upScaled: D.E_times_sqrtgap_up[i], // -> -K
    }),
  ),
);

export const IMP97693_SUMMARY = Object.freeze({
  amplitude_K: D.amplitude_K_predicted, // ~0.423330
  law: D.form,
  reading:
    `As the gap sigma_max - s shrinks across the decade ladder ${D.gaps.join(', ')}, the scaled elasticity `
    + `E*sqrt(gap) closes in on +/-K ~ ${D.amplitude_K_predicted.toFixed(4)} on both branches: downslope `
    + `${IMP97693_FOLD_ROWS.map((r) => r.downScaled.toFixed(4)).join(' -> ')}, upslope `
    + `${IMP97693_FOLD_ROWS.map((r) => r.upScaled.toFixed(4)).join(' -> ')}. The successive-decade ratios `
    + `${D.decade_ratios_down.join(', ')} track 1/sqrt(10) = 0.31623, the signature of the inverse-square-root `
    + 'fold rather than a simple pole.',
  verdict:
    'Presentation only: all fields reused verbatim from imp-97662 (peak-divergence measurement), no new '
    + 'computation. Changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains '
    + 'SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97693_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97693-four-rows',
    description: 'exactly four gap-ladder rows, matching the imp-97662 decade ladder',
    holds: () => IMP97693_FOLD_ROWS.length === 4,
  },
  {
    id: 'imp97693-branches-opposite-signs',
    description: 'downslope scaled values are positive, upslope scaled values are negative',
    holds: () => IMP97693_FOLD_ROWS.every((r) => r.downScaled > 0 && r.upScaled < 0),
  },
  {
    id: 'imp97693-both-branches-converge-to-K',
    description: 'the last (smallest-gap) row sits within 0.02 of +/-K on both branches',
    holds: () => {
      const last = IMP97693_FOLD_ROWS[IMP97693_FOLD_ROWS.length - 1];
      return (
        Math.abs(last.downScaled - IMP97693_SUMMARY.amplitude_K) < 0.02
        && Math.abs(last.upScaled + IMP97693_SUMMARY.amplitude_K) < 0.02
      );
    },
  },
  {
    id: 'imp97693-amplitude-matches-imp97662',
    description: 'the amplitude K equals the imp-97662 predicted fold amplitude ~0.4233',
    holds: () => Math.abs(IMP97693_SUMMARY.amplitude_K - 0.42333) < 5e-3,
  },
  {
    id: 'imp97693-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97693_SUMMARY.verdict) && /NO QED/.test(IMP97693_SUMMARY.verdict),
  },
];

for (const assertion of IMP97693_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97693 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97693_SUMMARY;
