/**
 * @module imp-35771-req4-required-height-multiple-viz-data
 *
 * imp-35771 (ux): import-light viz-data module for the imp-35722 REQ-4
 * required-height MULTIPLE ladder (200 / log T0) across its three named
 * landmarks, with the residual log-height gap column (200 - log T0).
 *
 * imp-35580 bar-charted the four raw log-heights (peak, crossover, PT anchor,
 * REQ-4 needed) but never formed the required-height MULTIPLE -- imp-35722
 * computed that ratio column afterwards. This module re-exports the
 * imp-35722 ladder verbatim as a dedicated multiple+gap chart, distinct from
 * the later imp-35823 six-rung MERGED ladder (which folds in the imp-35763
 * sigma<0.9/0.5/0.1 interior rungs); this one stays scoped to imp-35722's
 * original three base landmarks.
 *
 * @see imp-35722-req4-required-height-landmark-ladder.js (source: the three-rung ladder this re-exports)
 * @see imp-35580-req4-height-gap-viz-data.js (raw log-height bar chart; no multiple column)
 * @see imp-35823-required-height-ladder-viz-data.js (later six-rung MERGED ladder incl. sigma interior rungs)
 *
 * Ticket: imp-35771 (ux, low). Presentation only, RH-free; C_mb GUE-conditional
 * (imp-486) untouched; imp-35337a stays OPEN; changes no bound; NO QED.
 * No refereed bound is changed.
 */

import { IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER } from './imp-35722-req4-required-height-landmark-ladder.js';

const SRC = IMP35722_REQ4_REQUIRED_HEIGHT_LANDMARK_LADDER;

// -- the three-rung multiple+gap ladder, re-exported verbatim from imp-35722.
export const IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER = Object.freeze(
  SRC.ladder.map((row) => Object.freeze({ ...row })),
);

export const IMP35771_SUMMARY = Object.freeze({
  logT0Needed: SRC.logT0Needed, // 200
  T0Needed: SRC.T0Needed, // ~7.23e86
  peakMultiple: SRC.peakMultiple, // ~15.12x (the new column imp-35580 never formed)
  crossMultiple: SRC.crossMultiple, // ~9.59x
  ptMultiple: SRC.ptMultiple, // ~6.96x
});

export default Object.freeze({
  id: 'imp-35771-req4-required-height-multiple-viz-data',
  ticket: 'imp-35771',
  sources: ['imp-35722-req4-required-height-landmark-ladder.js'],
  ladder: IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER,
  summary: IMP35771_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35771_ASSERTIONS = [
  {
    id: 'imp35771-three-rungs-ascending-logt0-descending-multiple',
    description: 'the ladder has exactly 3 rungs, strictly ascending in logT0 and descending in requiredMultiple',
    holds: () =>
      IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER.length === 3 &&
      IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER.every(
        (r, i) => i === 0 || r.logT0 > IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER[i - 1].logT0,
      ) &&
      IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER.every(
        (r, i) => i === 0 || r.requiredMultiple < IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER[i - 1].requiredMultiple,
      ),
  },
  {
    id: 'imp35771-peak-cross-pt-multiples-match-imp35722',
    description: 'the peak/cross/pt multiples match the imp-35722 source figures ~15.12x / ~9.59x / ~6.96x',
    holds: () =>
      Math.abs(IMP35771_SUMMARY.peakMultiple - 15.12) < 0.01 &&
      Math.abs(IMP35771_SUMMARY.crossMultiple - 9.59) < 0.01 &&
      Math.abs(IMP35771_SUMMARY.ptMultiple - 6.96) < 0.01,
  },
  {
    id: 'imp35771-gap-column-consistent-with-multiple-column',
    description: 'each row logHeightGap = logT0Needed - logT0, consistent with requiredMultiple = logT0Needed / logT0',
    holds: () =>
      IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER.every(
        (r) =>
          Math.abs(r.logHeightGap - (IMP35771_SUMMARY.logT0Needed - r.logT0)) < 1e-4 &&
          Math.abs(r.requiredMultiple * r.logT0 - IMP35771_SUMMARY.logT0Needed) < 0.01,
      ),
  },
];

for (const a of IMP35771_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35771-req4-required-height-multiple-viz-data assertion failed: ${a.id}`);
  }
}
