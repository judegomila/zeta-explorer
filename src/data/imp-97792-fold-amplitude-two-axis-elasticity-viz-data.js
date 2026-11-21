/**
 * @module imp-97792-fold-amplitude-two-axis-elasticity-viz-data
 *
 * imp-97792: import-light viz-data leaf charting the imp-97757 fold-amplitude
 * two-axis elasticities: FLOOR dlnK/dlng = +0.2205 (numerator/share channel) versus
 * HEIGHT dlnK/dlng = -0.1234 (denominator/curvature channel), opposite-signed,
 * floor-dominated (magnitude ratio ~1.79). Reuses the frozen
 * IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB dominance/channels fields verbatim
 * (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97757-fold-amplitude-axis-crosstab.js (IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB)
 */

import { IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB } from './imp-97757-fold-amplitude-axis-crosstab.js';

const DOMINANCE = IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB.dominance;
const CHANNELS = IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB.channels;

// Two-bar chart rows: one per perturbation axis, signed elasticity plus dominant channel.
export const IMP97792_AXIS_ROWS = Object.freeze([
  Object.freeze({
    axis: 'floor',
    label: 'E_trunc floor (imp-97743)',
    elasticity: DOMINANCE.floor_local_elasticity_dlnK_dlng, // +0.2205
    channel: 'numerator (share S)',
    channelFactor: CHANNELS.floor_S_factor, // ~1.635
    otherChannelFactor: CHANNELS.floor_phi_xx_factor, // ~1.129
    fullSweepFactor: DOMINANCE.floor_full_sweep_K_factor, // ~1.358
  }),
  Object.freeze({
    axis: 'height',
    label: 'evaluation height (imp-97735)',
    elasticity: DOMINANCE.height_local_elasticity_dlnK_dlng, // -0.1234
    channel: 'denominator (curvature phi_xx)',
    channelFactor: CHANNELS.height_phi_xx_factor, // ~1.401
    otherChannelFactor: CHANNELS.height_S_factor, // ~1.031
    fullSweepFactor: DOMINANCE.height_full_sweep_K_factor, // ~1.182
  }),
]);

export const IMP97792_SUMMARY = Object.freeze({
  law:
    'The floor axis moves K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) mainly through the numerator '
    + 'share and the height axis moves it mainly through the denominator curvature; the two local '
    + 'elasticities dlnK/dln g are opposite-signed and the floor axis is the larger mover.',
  reading:
    `floor dlnK/dlng = ${IMP97792_AXIS_ROWS[0].elasticity.toFixed(4)} (numerator/share, ratio `
    + `${DOMINANCE.elasticity_magnitude_ratio.toFixed(2)} vs height); height dlnK/dlng = `
    + `${IMP97792_AXIS_ROWS[1].elasticity.toFixed(4)} (denominator/curvature). Signs disagree: `
    + `${DOMINANCE.signs_disagree}. Floor dominates: ${DOMINANCE.floor_dominates_locally}.`,
  verdict:
    'Presentation only: every elasticity and channel factor is reused verbatim from imp-97757 (a '
    + 'measurement, not a derivation); no new computation. Cross-validation / measurement only on the '
    + 'inherited imp-3220/imp-3406 extrapolation surrogate, not a rigorous asymptotic. Changes no bound; '
    + 'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97792_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97792-two-rows',
    description: 'exactly two axis rows (floor, height)',
    holds: () => IMP97792_AXIS_ROWS.length === 2,
  },
  {
    id: 'imp97792-opposite-signed',
    description: 'floor elasticity positive, height elasticity negative',
    holds: () => IMP97792_AXIS_ROWS[0].elasticity > 0 && IMP97792_AXIS_ROWS[1].elasticity < 0,
  },
  {
    id: 'imp97792-floor-dominates',
    description: '|floor elasticity| exceeds |height elasticity|',
    holds: () => Math.abs(IMP97792_AXIS_ROWS[0].elasticity) > Math.abs(IMP97792_AXIS_ROWS[1].elasticity),
  },
  {
    id: 'imp97792-different-channels',
    description: 'floor channel factor exceeds its other-channel factor and vice versa for height',
    holds: () =>
      IMP97792_AXIS_ROWS[0].channelFactor > IMP97792_AXIS_ROWS[0].otherChannelFactor &&
      IMP97792_AXIS_ROWS[1].channelFactor > IMP97792_AXIS_ROWS[1].otherChannelFactor,
  },
  {
    id: 'imp97792-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97792_SUMMARY.verdict) && /NO QED/.test(IMP97792_SUMMARY.verdict),
  },
];

for (const assertion of IMP97792_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97792 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97792_SUMMARY;
