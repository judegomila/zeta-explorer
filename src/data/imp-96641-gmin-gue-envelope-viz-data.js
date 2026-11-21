/**
 * @module imp-96641-gmin-gue-envelope-viz-data
 *
 * imp-96641 (ux): import-light viz-data leaf for the imp-96616 g_min(N)/y_N
 * extreme-gap decay ladder. imp-96616 measured the running-min normalized
 * gap ratio over the first 2,001,052 Odlyzko zeros (N = 50..1e6), found a
 * power-law fit exponent -0.3953 (close to, slightly steeper than, the GUE
 * cube-root -1/3), and tracked the GUE median envelope 0.8582 N^{-1/3} to
 * within a factor 0.90..2.21. That finding had a JSDoc table but no chart.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every row (N, ratio, gueMedian,
 * ratioOverGue, argminIdx) is reused verbatim from imp-96616; only the
 * chart-friendly reshape (log-log points + plateau flags) is new here.
 * Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96616-gmin-ratio-extreme-gap-decay.js (source finding + all baked numbers)
 * @see imp-96640-rankr-power-iteration-bracket-viz-data.js (sibling viz-data leaf, same convention)
 *
 * Ticket: imp-96641 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { GMIN_RATIO_EXTREME_GAP_DECAY } from './imp-96616-gmin-ratio-extreme-gap-decay.js';

// argmin zero indices where the running-min freezes across consecutive N rungs
// (imp-96629 plateau-bias note): the same record gap is still the minimum.
// imp-96747 audit: corrected from 3 to 4 -- N=100 also freezes on N=50's
// argminIdx=33, a rung the original ticket comment missed.
const PLATEAU_ARGMIN_IDX = Object.freeze([33, 6708, 95247, 420890]);

// chart-ready ladder: N, ratio, gueMedian, ratioOverGue, argminIdx, isPlateau.
// isPlateau marks a rung whose argminIdx repeats the PRIOR rung's argminIdx
// (the running-min has not found a new record gap since the previous N).
export const IMP96641_LADDER = Object.freeze(
  GMIN_RATIO_EXTREME_GAP_DECAY.ladder.map((row, i, arr) =>
    Object.freeze({
      N: row.N,
      ratio: row.ratio,
      gueMedian: row.gueMedian,
      ratioOverGue: row.ratioOverGue,
      argminIdx: row.argminIdx,
      isPlateau: i > 0 && row.argminIdx === arr[i - 1].argminIdx,
    }),
  ),
);

export const IMP96641_FIT = Object.freeze({
  exponent: GMIN_RATIO_EXTREME_GAP_DECAY.fit.exponent,
  prefactor: GMIN_RATIO_EXTREME_GAP_DECAY.fit.prefactor,
  gueExtremeGapExponent: GMIN_RATIO_EXTREME_GAP_DECAY.fit.gueExtremeGapExponent,
});

export const IMP96641_GUE_MEDIAN_CONSTANT = GMIN_RATIO_EXTREME_GAP_DECAY.gue.medianConstant;

export const IMP96641_PLATEAU_ARGMIN_IDX = PLATEAU_ARGMIN_IDX;

export const IMP96641_READING = GMIN_RATIO_EXTREME_GAP_DECAY.reading;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96641_ASSERTIONS = [
  {
    id: 'imp96641-ladder-has-fourteen-rungs-n50-to-1e6',
    holds: () =>
      IMP96641_LADDER.length === 14 &&
      IMP96641_LADDER[0].N === 50 &&
      IMP96641_LADDER[IMP96641_LADDER.length - 1].N === 1000000,
    why: 'the N-ladder must reproduce all 14 imp-96616 rungs (N=50..1e6) unmodified.',
  },
  {
    id: 'imp96641-four-plateaus-match-known-argmin-freezes',
    holds: () => {
      const plateauRows = IMP96641_LADDER.filter((r) => r.isPlateau);
      const plateauArgmins = new Set(plateauRows.map((r) => r.argminIdx));
      return (
        plateauRows.length === 4 &&
        PLATEAU_ARGMIN_IDX.every((idx) => plateauArgmins.has(idx))
      );
    },
    why: 'the four named argmin-freeze plateaus (idx 33, 6708, 95247, 420890) must each mark exactly one repeated-argmin rung.',
  },
  {
    id: 'imp96641-fit-exponent-matches-source',
    holds: () => Math.abs(IMP96641_FIT.exponent - (-0.3953)) < 1e-9,
    why: 'the plotted fit exponent must match the imp-96616 measured value -0.3953 exactly.',
  },
  {
    id: 'imp96641-gue-constant-matches-source',
    holds: () => Math.abs(IMP96641_GUE_MEDIAN_CONSTANT - 0.8582) < 1e-9,
    why: 'the plotted GUE median envelope constant must match the imp-96616 baked value 0.8582 exactly.',
  },
];

for (const a of IMP96641_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96641-gmin-gue-envelope-viz-data assertion failed: ${a.id}`);
  }
}
