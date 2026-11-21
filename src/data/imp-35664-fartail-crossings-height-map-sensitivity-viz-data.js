/**
 * @module imp-35664-fartail-crossings-height-map-sensitivity-viz-data
 * @fileoverview imp-35664 -- VIZ DATA ONLY for the imp-35577 far-tail-crossing HEIGHT-MAP
 *   sensitivity table: side-by-side surrogate-vs-RvM-inverse crossings for the E_flow
 *   far-tail fd-vs-analytic remnant sub-1e-3 and sub-1e-4 thresholds, showing the decade
 *   shift GROWS deeper (+15.31 -> +46.84 decades) even as the raw height divergence SHRINKS
 *   (9.24 percent -> 2.65 percent), in contrast to the benign sub-1 percent imp-35458
 *   crossover log-damping.
 *
 *   Re-exports the imp-35577 crossings table directly (that module is import-light: pure
 *   Math, a Newton solve, and bisection, no heavy dependency, never the 16.7MB zeros
 *   bundle), per [[no_heavy_imports_in_pages]]. Also imports the imp-35458 module directly
 *   (imp-35689) so the hand-entered IMP35664_BENIGN_CROSSOVER contrast literals are
 *   guarded against drifting stale versus their live source; imp-35458 is itself
 *   import-light (effectiveHeightForN + C_C_PINNED, no zeros bundle).
 *
 *   @see imp-35577-fartail-crossings-height-map-sensitivity.js (the two-crossing table this re-exports)
 *   @see imp-35458-crossover-height-map-sensitivity.js (the benign sub-1 percent log-damped crossover, contrasted here; now imported directly for the imp-35689 staleness guard)
 *   @see imp-35497-fartail-crossing-height-map-sensitivity.js (the sub-1e-3 swap alone)
 *   @see imp-35561-peak-height-map-sensitivity-viz-data.js (sibling viz for the robust interior peak)
 *
 *   Ticket: imp-35664 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Discharges nothing; imp-35337a stays OPEN. C_mb GUE-conditional
 *   per imp-486 UNTOUCHED. NO QED. No refereed bound is changed.
 */

import IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY from './imp-35577-fartail-crossings-height-map-sensitivity.js';
import { IMP35458_CROSSOVER_HEIGHT_MAP_SENSITIVITY } from './imp-35458-crossover-height-map-sensitivity.js';

export const IMP35664_CROSSINGS = IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY.crossings;

export const IMP35664_ROWS = [
  { key: 'sub1e3', label: 'sub-1e-3', ...IMP35664_CROSSINGS.sub1e3 },
  { key: 'sub1e4', label: 'sub-1e-4', ...IMP35664_CROSSINGS.sub1e4 },
];

// The imp-35458 benign crossover, for the on-page contrast banner.
export const IMP35664_BENIGN_CROSSOVER = Object.freeze({
  label: 'E_coll = E_trunc crossover (imp-35458)',
  relativeShiftPct: -0.9826,
  rawHeightGapPct: 18,
  dampingFactor: 18, // ~18x smaller shift than raw height gap
});

export const IMP35664_SUMMARY = Object.freeze({
  rowCount: IMP35664_ROWS.length,
  shiftGrows: IMP35664_ROWS[1].shiftDecades > IMP35664_ROWS[0].shiftDecades,
  divergenceShrinks: IMP35664_ROWS[1].heightDivergence < IMP35664_ROWS[0].heightDivergence,
  shiftRatio: +(IMP35664_ROWS[1].shiftDecades / IMP35664_ROWS[0].shiftDecades).toFixed(4),
  logDampingVerdict: IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY.logDampingVerdict,
});

export default Object.freeze({
  id: 'imp-35664-fartail-crossings-height-map-sensitivity-viz-data',
  ticket: 'imp-35664',
  sources: ['imp-35577-fartail-crossings-height-map-sensitivity.js'],
  rows: IMP35664_ROWS,
  benignCrossover: IMP35664_BENIGN_CROSSOVER,
  summary: IMP35664_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35664_ASSERTIONS = [
  {
    id: 'imp35664-two-rows-present',
    holds: () => IMP35664_ROWS.length === 2,
    why: 'The table must cover both far-tail crossings (sub-1e-3 and sub-1e-4).',
  },
  {
    id: 'imp35664-shift-grows-deeper',
    holds: () => IMP35664_SUMMARY.shiftGrows === true,
    why: 'The decade shift must grow deeper (sub-1e-4 shift > sub-1e-3 shift), matching the imp-35577 finding.',
  },
  {
    id: 'imp35664-divergence-shrinks-deeper',
    holds: () => IMP35664_SUMMARY.divergenceShrinks === true,
    why: 'The raw height divergence must shrink deeper (sub-1e-4 < sub-1e-3), the opposite direction from the shift.',
  },
  {
    id: 'imp35664-shift-values-match-imp35577',
    holds: () =>
      Math.abs(IMP35664_ROWS[0].shiftDecades - 15.31) < 0.05 &&
      Math.abs(IMP35664_ROWS[1].shiftDecades - 46.84) < 0.05,
    why: 'The two shift values must reproduce imp-35577: +15.31 decades (sub-1e-3) and +46.84 decades (sub-1e-4).',
  },
  {
    id: 'imp35664-contrast-with-benign-crossover',
    holds: () =>
      Math.abs(IMP35664_BENIGN_CROSSOVER.relativeShiftPct) < 1 &&
      IMP35664_ROWS[0].shiftDecades > 10 &&
      IMP35664_ROWS[1].shiftDecades > 40,
    why: 'The imp-35458 crossover shift must stay under 1 percent while both far-tail crossings shift by double-digit-plus decades, grounding the banner contrast.',
  },
  {
    // Guards against IMP35664_BENIGN_CROSSOVER drifting stale vs its live imp-35458 source.
    id: 'imp35664-benign-crossover-not-stale',
    holds: () => {
      const src = IMP35458_CROSSOVER_HEIGHT_MAP_SENSITIVITY;
      const rawHeightGapPctLive = (1 - src.findings.M3_log_damps_the_height_map_choice.raw_height_ratio) * 100;
      const dampingFactorLive = src.findings.M3_log_damps_the_height_map_choice.damping_factor;
      return (
        Math.abs(IMP35664_BENIGN_CROSSOVER.relativeShiftPct - src.crossover.relative_shift_pct) < 1e-4 &&
        Math.abs(IMP35664_BENIGN_CROSSOVER.rawHeightGapPct - rawHeightGapPctLive) < 1 &&
        Math.abs(IMP35664_BENIGN_CROSSOVER.dampingFactor - dampingFactorLive) < 1
      );
    },
    why: 'The hand-entered imp-35458 contrast literals (relativeShiftPct, rawHeightGapPct, dampingFactor) must stay within rounding tolerance of the live imp-35458 module output, so a future edit to that source cannot silently leave this banner stale.',
  },
];

for (const assertion of IMP35664_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35664-fartail-crossings-height-map-sensitivity-viz-data assertion failed: ${assertion.id}`);
  }
}
