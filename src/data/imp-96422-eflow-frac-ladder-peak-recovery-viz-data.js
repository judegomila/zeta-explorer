/**
 * @module imp-96422-eflow-frac-ladder-peak-recovery-viz-data
 *
 * imp-96422 (ux): import-light viz-data leaf for the imp-96266 E_flow fractional-suppression
 * ladder (E_flow/E_N vs log10 N) and the reconstructed-vs-full sigma peak comparison. imp-96266
 * measured that E_flow/E_N falls steeply across the imp-3220 U-shape region (1.38e-1 at 1e3 down
 * to 1.22e-5 at 1e12) and that re-applying that suppression to the peakless closed-form baseline
 * (sigma_recon) recovers the full-share interior maximum to 9.2e-4 in height and 9.1e-2 in
 * location -- but shipped no chart of either the fractional ladder on its own axis or the
 * recon-vs-full peak comparison (imp-96294 charts the residual R(N) curve, a related but
 * different reading).
 *
 * Reshapes the imp-96266 baked eFlowFractionalLadder and peakRecovery/landmarks fields into
 * chart-ready series. No re-derivation: every plotted value is copied verbatim from
 * IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL.
 *
 * MEASUREMENT / PRESENTATION ONLY. The component model is the inherited
 * imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 stays untouched; changes no bound; establishes no operator positivity; RH open;
 * NO QED; no refereed bound is changed.
 *
 * @see imp-96266-eflow-peak-recovery-residual.js (fractional ladder, peak/peak-recovery landmarks)
 * @see imp-96294-eflow-residual-viz-data.js (related residual-R(N) chart; different reading)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 *
 * Ticket: imp-96422 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 * No self-executing assertion throw -- values are validated below via a plain exported check
 * object plus a discoverable *_ASSERTIONS array (per the imp-96294 pattern), so the build-time
 * sweep runs the checks without any import-time throw that could blank a lazy-loaded page.
 */

import { IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL } from './imp-96266-eflow-peak-recovery-residual.js';

const LANDMARKS = IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL.landmarks;
const LADDER = IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL.eFlowFractionalLadder;
const PEAK_RECOVERY = IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL.peakRecovery;

function log10OfLabel(label) {
  // labels are "1eK" strings baked by imp-96266; parse the exponent directly.
  return Number(label.slice(2));
}

// Seven baked ladder rows, reshaped for direct plotting against log10 N.
export const IMP96422_FRAC_LADDER_SERIES = LADDER.map((row) => ({
  log10N: log10OfLabel(row.N),
  eFlowOverEN: row.eFlowOverEN,
}));

// Reconstructed-vs-full sigma peak comparison (single-landmark pair, copied verbatim).
export const IMP96422_PEAK_COMPARISON = Object.freeze({
  full: {
    log10N: Math.log10(LANDMARKS.peak_N_full),
    N: LANDMARKS.peak_N_full,
    sigma: LANDMARKS.peak_sigma_full,
  },
  recon: {
    log10N: Math.log10(PEAK_RECOVERY.peak_N_recon),
    N: PEAK_RECOVERY.peak_N_recon,
    sigma: PEAK_RECOVERY.peak_sigma_recon,
  },
  peakLocationRelErr: PEAK_RECOVERY.peak_location_rel_err,
  peakHeightAbsErr: PEAK_RECOVERY.peak_height_abs_err,
});

export const IMP96422_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every E_flow/E_N ladder '
  + 'reading and the recon-vs-full peak location/height are copied verbatim from the imp-96266 '
  + 'baked landmarks; only the chart-axis reshaping (log10 N parsing) is computed here (no '
  + 're-derivation, no new residual or peak measurement). The component model is the inherited '
  + 'imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional '
  + 'per imp-486 stays untouched; no bound changes, no operator positivity established.';

// -- plain validation object (no self-executing throw).
export const IMP96422_VALIDATION = Object.freeze({
  fracLadderMonotoneDecreasing: IMP96422_FRAC_LADDER_SERIES.every(
    (row, i) => i === 0 || row.eFlowOverEN <= IMP96422_FRAC_LADDER_SERIES[i - 1].eFlowOverEN,
  ),
  seriesLengthMatchesLadder: IMP96422_FRAC_LADDER_SERIES.length === LADDER.length,
  peakComparisonNearImp3220Landmark:
    Math.abs(IMP96422_PEAK_COMPARISON.full.N / 9.22e5 - 1) < 5e-3
    && Math.abs(IMP96422_PEAK_COMPARISON.full.sigma - 0.9494) < 1e-3,
  reconRecoversPeakWithinTolerance:
    IMP96422_PEAK_COMPARISON.peakHeightAbsErr < 1e-3
    && IMP96422_PEAK_COMPARISON.peakLocationRelErr < 1.5e-1,
});

// imp-96397 pattern: registers the IMP96422_VALIDATION checks with the build-time assertion
// sweep (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw -- so this stays inert in the browser (no guard that could
// blank the viz page) while still running under the Node sweep.
export const IMP96422_ASSERTIONS = [
  {
    id: 'imp96422-frac-ladder-monotone-decreasing',
    description: 'E_flow/E_N ladder is non-increasing across the [1e3,1e12] decade rungs',
    holds: () => IMP96422_VALIDATION.fracLadderMonotoneDecreasing,
  },
  {
    id: 'imp96422-series-length-matches-ladder',
    description: 'reshaped fractional ladder series matches the imp-96266 ladder length',
    holds: () => IMP96422_VALIDATION.seriesLengthMatchesLadder,
  },
  {
    id: 'imp96422-peak-comparison-near-imp3220-landmark',
    description: 'full peak N and sigma_full match the imp-3220 landmark within tolerance',
    holds: () => IMP96422_VALIDATION.peakComparisonNearImp3220Landmark,
  },
  {
    id: 'imp96422-recon-recovers-peak-within-tolerance',
    description: 'reconstructed peak matches the full peak within the imp-96266 stated tolerance',
    holds: () => IMP96422_VALIDATION.reconRecoversPeakWithinTolerance,
  },
];
