/**
 * @module imp-35593-peak-damping-viz-data
 * @fileoverview imp-35593 -- VIZ DATA ONLY for the imp-35574 peak-LOCATION vs
 *   crossover height-map DAMPING comparison: the raw-height gap, the relative
 *   landmark shift, and the damping factor (1 - raw-height ratio) / |shift|
 *   at both landmarks, plus the ~32.55x readout of how much more strongly the
 *   crossover is log-damped than the peak location.
 *
 *   imp-35574 measured that the imp-35458 crossover damping (~18x, a ~18pct
 *   raw-height gap compresses to a ~0.98pct shift) does NOT carry over to the
 *   interior sigma-peak LOCATION, which instead AMPLIFIES a ~24.33pct raw gap
 *   into a ~43.99pct shift (damping factor ~0.553, < 1). This comparison was
 *   measured and pinned (imp-35591) but never given a page, so the contrast
 *   is not visually legible anywhere on the site.
 *
 *   Re-exports the imp-35574 peak / rawHeightGapAtPeak / dampingComparison
 *   fields directly (that module is import-light: pure Math plus an inlined
 *   effectiveHeightForN, no heavy dependency, never the 16.7MB zeros bundle),
 *   per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35574-peak-location-height-map-damping.js (the fields re-exported here)
 *   @see imp-35458-crossover-height-map-sensitivity (the ~18x crossover damping mirrored)
 *   @see imp-35591-peak-damping-literals-assertion.js (independent literal-pinning of the same figures)
 *   @see imp-35587-arm-asymmetry-viz-data.js (sibling import-light viz-data module, same pattern)
 *
 *   Ticket: imp-35593 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Discharges nothing; imp-35337a stays OPEN. C_C = (1/8) sqrt(3 pi)
 *   ansatz (imp-2642/imp-2643) UNTOUCHED. NO QED. No refereed bound is changed.
 */

import { IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING } from './imp-35574-peak-location-height-map-damping.js';

export const IMP35593_PEAK = IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.peak;

export const IMP35593_RAW_HEIGHT_GAP = IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.rawHeightGapAtPeak;

export const IMP35593_DAMPING = IMP35574_PEAK_LOCATION_HEIGHT_MAP_DAMPING.dampingComparison;

// imp-35458 crossover reference figures (verbatim, mirrored inside imp-35574 itself).
const CROSSOVER_RAW_HEIGHT_GAP_PCT = 18; // imp-35458 M3
const CROSSOVER_RELATIVE_SHIFT_PCT = -0.983; // imp-35458 M3 (~-0.98pct)

export const IMP35593_BARS = Object.freeze({
  rawHeightGapPct: Object.freeze([
    Object.freeze({ landmark: 'peak location', pct: IMP35593_RAW_HEIGHT_GAP.raw_height_gap_pct }),
    Object.freeze({ landmark: 'crossover', pct: CROSSOVER_RAW_HEIGHT_GAP_PCT }),
  ]),
  relativeShiftPct: Object.freeze([
    Object.freeze({ landmark: 'peak location', pct: IMP35593_PEAK.relative_shift_pct }),
    Object.freeze({ landmark: 'crossover', pct: CROSSOVER_RELATIVE_SHIFT_PCT }),
  ]),
  dampingFactor: Object.freeze([
    Object.freeze({ landmark: 'peak location', factor: IMP35593_DAMPING.damping_factor_peak }),
    Object.freeze({ landmark: 'crossover', factor: IMP35593_DAMPING.damping_factor_crossover }),
  ]),
});

export const IMP35593_SUMMARY = Object.freeze({
  dampingFactorPeak: IMP35593_DAMPING.damping_factor_peak,
  dampingFactorCrossover: IMP35593_DAMPING.damping_factor_crossover,
  crossoverVsPeakRatio: IMP35593_DAMPING.crossover_vs_peak_ratio,
  peakIsDamped: IMP35593_DAMPING.peak_is_damped,
});

export default Object.freeze({
  id: 'imp-35593-peak-damping-viz-data',
  ticket: 'imp-35593',
  sources: ['imp-35574-peak-location-height-map-damping.js'],
  peak: IMP35593_PEAK,
  rawHeightGap: IMP35593_RAW_HEIGHT_GAP,
  damping: IMP35593_DAMPING,
  bars: IMP35593_BARS,
  summary: IMP35593_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35593_ASSERTIONS = [
  {
    id: 'imp35593-peak-damping-below-one-amplified',
    holds: () => IMP35593_SUMMARY.dampingFactorPeak > 0.4 && IMP35593_SUMMARY.dampingFactorPeak < 0.7,
    why: 'The peak-location damping factor must stay ~0.553 (< 1, amplification), matching imp-35574/imp-35591.',
  },
  {
    id: 'imp35593-crossover-damping-far-above-peak',
    holds: () =>
      IMP35593_SUMMARY.dampingFactorCrossover > IMP35593_SUMMARY.dampingFactorPeak * 10 &&
      IMP35593_SUMMARY.crossoverVsPeakRatio > 10,
    why: 'The crossover damping factor (~18x) must be over an order of magnitude stronger than the peak-location factor (~0.55), giving the ~32.55x contrast the page displays.',
  },
  {
    id: 'imp35593-peak-not-damped-flag',
    holds: () => IMP35593_SUMMARY.peakIsDamped === false,
    why: 'peakIsDamped must read false: the peak location is amplified, not log-damped, unlike the crossover.',
  },
  {
    id: 'imp35593-raw-gap-bars-both-positive',
    holds: () => IMP35593_BARS.rawHeightGapPct.every((b) => b.pct > 0),
    why: 'Both raw-height-gap bars (peak ~24.33pct, crossover 18pct) must be positive percentages for the bar chart to render sensibly.',
  },
  {
    id: 'imp35593-shift-bars-opposite-signs',
    holds: () => IMP35593_BARS.relativeShiftPct[0].pct > 0 && IMP35593_BARS.relativeShiftPct[1].pct < 0,
    why: 'The peak-location shift is positive (surrogate overshoots) while the crossover shift is negative (surrogate undershoots), matching imp-35574/imp-35458 signs.',
  },
];

for (const assertion of IMP35593_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35593-peak-damping-viz-data assertion failed: ${assertion.id}`);
  }
}
