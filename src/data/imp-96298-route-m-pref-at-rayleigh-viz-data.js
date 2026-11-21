/**
 * @module imp-96298-route-m-pref-at-rayleigh-viz-data
 *
 * imp-96298 (ux): import-light viz-data leaf for the imp-96264 Route M
 * two-tone AICc preference at the Rayleigh span, prefAtRayleigh, plotted
 * against the amplitude ratio rho = A4/A5. imp-96264 tabulated
 * prefAtRayleigh across seven ratios and found it is MAXIMAL at rho = 1
 * (equal amplitude, 0.944) and falls off monotonically with amplitude
 * imbalance in both directions -- but shipped no chart.
 *
 * Reshapes the imp-96264 baked IMP96264_RATIO_TABLE rows into a chart-ready
 * series (log rho, prefAtRayleigh). No re-derivation: every plotted value is
 * copied verbatim from IMP96264_RATIO_TABLE.
 *
 * PRESENTATION ONLY. Simulation-derived values (synthetic q4+q5 two-tone
 * plus matched noise); no new zeros, no Gram build, no bound changes, no
 * operator positivity established; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96264-route-m-amplitude-ratio-sensitivity.js (ratio table, verdict, sub-gap this reshapes)
 *
 * Ticket: imp-96298 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 * No self-executing assertion throw (per the imp-96294 convention) -- values are validated below
 * via a plain exported check object instead of an import-time throw.
 */

import {
  IMP96264_RATIO_TABLE,
  IMP96264_VERDICT,
  IMP96264_RAYLEIGH_SPAN,
} from './imp-96264-route-m-amplitude-ratio-sensitivity.js';

// The seven baked ratio rows, reshaped for plotting against log(rho).
export const IMP96298_PREF_SERIES = IMP96264_RATIO_TABLE.map((row) => ({
  rho: row.rho,
  logRho: Math.log(row.rho),
  prefAtRayleigh: row.prefAtRayleigh,
  isEqualAmplitude: row.rho === 1.0,
}));

export const IMP96298_ANCHORS = Object.freeze({
  rayleighSpan: IMP96264_RAYLEIGH_SPAN,
  peakRho: 1.0,
  peakPref: IMP96264_RATIO_TABLE.find((r) => r.rho === 1.0).prefAtRayleigh,
  confidentThreshold: 0.90,
  prefAtRayleighPeaksAtEqual: IMP96264_VERDICT.prefAtRayleighPeaksAtEqual,
});

export const IMP96298_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every prefAtRayleigh and rho '
  + 'value is copied verbatim from the imp-96264 baked ratio table; only the log(rho) axis reshaping '
  + 'is computed here (no re-derivation, no new Monte-Carlo run). Synthetic q4+q5 two-tone simulation '
  + 'only; no new zeros, no Gram build, no bound changes, no operator positivity established.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96298_VALIDATION = Object.freeze({
  seriesLengthMatchesRatioTable: IMP96298_PREF_SERIES.length === IMP96264_RATIO_TABLE.length,
  peaksAtEqualAmplitude: IMP96298_PREF_SERIES.every(
    (p) => p.isEqualAmplitude || p.prefAtRayleigh <= IMP96298_ANCHORS.peakPref + 1e-9
  ),
  peakClearsConfidentThreshold: IMP96298_ANCHORS.peakPref > IMP96298_ANCHORS.confidentThreshold,
});

export default {
  series: IMP96298_PREF_SERIES,
  anchors: IMP96298_ANCHORS,
  banner: IMP96298_HONEST_BANNER,
  validation: IMP96298_VALIDATION,
};
