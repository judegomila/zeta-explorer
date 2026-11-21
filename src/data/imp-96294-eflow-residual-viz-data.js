/**
 * @module imp-96294-eflow-residual-viz-data
 *
 * imp-96294 (ux): import-light viz-data leaf for the imp-96266 closed-form E_flow suppression
 * residual. imp-96266 derived the exact identity R(N) = sigma_full - sigma_CF =
 * -sigma_full(N) * E_flow(N) / (E_trunc + E_coll(N)) (an algebraic identity to ~1.5e-16, not a
 * fit): a strictly-negative differential suppression that manufactures the imp-3220 U-shape
 * interior peak by pulling the left arm of the share curve down harder than the right -- but
 * shipped no chart of the curve.
 *
 * Reshapes the imp-96266 baked eFlowFractionalLadder (seven rows, N in [1e3,1e12]) plus the
 * peak/peak-recovery landmarks into chart-ready series (residual R(N) and E_flow/E_N vs log10 N).
 * No re-derivation: every plotted value is copied verbatim from
 * IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL.
 *
 * MEASUREMENT / PRESENTATION ONLY. The component model is the inherited
 * imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 stays untouched; changes no bound; establishes no operator positivity; RH open;
 * NO QED; no refereed bound is changed.
 *
 * @see imp-96266-eflow-peak-recovery-residual.js (residual identity, ladder, peak/recovery landmarks)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 *
 * Ticket: imp-96294 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 * No self-executing assertion throw (per ticket spec) -- values are validated below via a plain
 * exported check object instead of an import-time throw.
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
export const IMP96294_RESIDUAL_SERIES = LADDER.map((row) => ({
  log10N: log10OfLabel(row.N),
  residual: row.residualFullMinusCF,
}));

export const IMP96294_EFLOW_FRAC_SERIES = LADDER.map((row) => ({
  log10N: log10OfLabel(row.N),
  eFlowOverEN: row.eFlowOverEN,
}));

// Peak-manufacturing region annotation (copied verbatim from imp-96266 landmarks).
export const IMP96294_PEAK_ANNOTATION = Object.freeze({
  log10PeakN: Math.log10(LANDMARKS.peak_N_full),
  peakN: LANDMARKS.peak_N_full,
  peakSigmaFull: LANDMARKS.peak_sigma_full,
  residualAtPeak: LANDMARKS.residual_at_peak,
  eFlowOverENAtPeak: LANDMARKS.E_flow_over_EN_at_peak,
  peakSigmaRecon: PEAK_RECOVERY.peak_sigma_recon,
  peakLocationRelErr: PEAK_RECOVERY.peak_location_rel_err,
  peakHeightAbsErr: PEAK_RECOVERY.peak_height_abs_err,
});

export const IMP96294_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every R(N), E_flow/E_N, and '
  + 'peak/peak-recovery reading is copied verbatim from the imp-96266 baked landmarks; only the '
  + 'chart-axis reshaping (log10 N parsing) is computed here (no re-derivation, no new residual '
  + 'measurement). The component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, '
  + 'not a rigorous asymptotic; the C_mb GUE-conditional per imp-486 stays untouched; no bound '
  + 'changes, no operator positivity established.';

// -- plain validation object (no self-executing throw; the ticket calls for a viz-data leaf
//    without an import-time throw guard, so this is exported for callers/tests to check instead).
export const IMP96294_VALIDATION = Object.freeze({
  residualStrictlyNegative: IMP96294_RESIDUAL_SERIES.every((r) => r.residual < 0),
  seriesLengthMatchesLadder:
    IMP96294_RESIDUAL_SERIES.length === LADDER.length
    && IMP96294_EFLOW_FRAC_SERIES.length === LADDER.length,
  peakAnnotationNearImp3220Landmark:
    Math.abs(IMP96294_PEAK_ANNOTATION.peakN / 9.22e5 - 1) < 5e-3
    && Math.abs(IMP96294_PEAK_ANNOTATION.peakSigmaFull - 0.9494) < 1e-3,
});

// imp-96397: registers the IMP96294_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw -- so this stays inert in the browser (no guard that could
// blank the viz page) while still running under the Node sweep.
export const IMP96294_ASSERTIONS = [
  {
    id: 'imp96294-residual-strictly-negative',
    description: 'every plotted R(N) residual point is strictly negative',
    holds: () => IMP96294_VALIDATION.residualStrictlyNegative,
  },
  {
    id: 'imp96294-series-length-matches-ladder',
    description: 'reshaped residual and E_flow/E_N series both match the imp-96266 ladder length',
    holds: () => IMP96294_VALIDATION.seriesLengthMatchesLadder,
  },
  {
    id: 'imp96294-peak-annotation-near-imp3220-landmark',
    description: 'peak annotation N and sigma_full match the imp-3220 landmark within tolerance',
    holds: () => IMP96294_VALIDATION.peakAnnotationNearImp3220Landmark,
  },
];
