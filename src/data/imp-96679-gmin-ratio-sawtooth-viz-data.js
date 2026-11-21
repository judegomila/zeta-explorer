/**
 * @module imp-96679-gmin-ratio-sawtooth-viz-data
 *
 * imp-96679 (ux): import-light viz-data leaf for the imp-96654 GUE running-min
 * sawtooth. Reshapes the imp-96616 14-rung ladder (N = 50..1e6) into
 * ratioOverGue = g_min(N) / (0.8582 N^{-1/3}) points tagged by whether the
 * rung continues an argmin-freeze plateau (numerator frozen, ratioOverGue
 * rises as N^{+1/3}, i.e. x2^{1/3} = x1.2599 per doubling of N) or starts a
 * fresh one after a new record gap resets the numerator.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every N / ratioOverGue / argminIdx value
 * is reused verbatim from imp-96616; the plateau/reset flags and doubling
 * factors are reused verbatim from imp-96654's plateauSlope table. Only the
 * chart-friendly reshape is new here. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96616-gmin-ratio-extreme-gap-decay.js (source ladder)
 * @see imp-96654-gmin-crossover-sensitivity-oscillation.js (source sawtooth / doubling analysis)
 * @see imp-96641-gmin-gue-envelope-viz-data.js (sibling viz-data leaf, same reshape convention)
 *
 * Ticket: imp-96679 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { GMIN_RATIO_EXTREME_GAP_DECAY } from './imp-96616-gmin-ratio-extreme-gap-decay.js';
import { GMIN_CROSSOVER_SENSITIVITY_OSCILLATION } from './imp-96654-gmin-crossover-sensitivity-oscillation.js';

// chart-ready ladder: N, ratioOverGue, argminIdx, isPlateau (this rung's
// argmin repeats the prior rung's -- numerator frozen, ratio climbing on a
// plateau), isReset (this rung's argmin differs from the prior rung's -- a
// new record gap was just found, resetting the numerator).
export const IMP96679_LADDER = Object.freeze(
  GMIN_RATIO_EXTREME_GAP_DECAY.ladder.map((row, i, arr) =>
    Object.freeze({
      N: row.N,
      ratioOverGue: row.ratioOverGue,
      argminIdx: row.argminIdx,
      isPlateau: i > 0 && row.argminIdx === arr[i - 1].argminIdx,
      isReset: i > 0 && row.argminIdx !== arr[i - 1].argminIdx,
    }),
  ),
);

// the four measured argmin-freeze plateau doublings: ratioOverGue x2^{1/3} = x1.2599
export const IMP96679_MEASURED_DOUBLINGS = Object.freeze(
  GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation.plateauSlope.measuredDoublings.map((d) =>
    Object.freeze({ ...d }),
  ),
);

export const IMP96679_TWO_FOLD_FACTOR =
  GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation.plateauSlope.twoFold;

// the ten distinct record-gap argmin indices, in the order they take over as the running minimum
export const IMP96679_ARGMIN_JUMPS = Object.freeze(
  [...GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation.plateauSlope.argminJumps],
);

export const IMP96679_OSCILLATION = Object.freeze({
  min: GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation.ratioOverGueMin,
  max: GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation.ratioOverGueMax,
  mean: GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation.mean,
  peakToPeakAmplitude: GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation.peakToPeakAmplitude,
  rmsDeviationFromOne: GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation.rmsDeviationFromOne,
  subOneDips: GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.oscillation.subOneDips.map((d) => ({ ...d })),
});

export const IMP96679_READING = GMIN_CROSSOVER_SENSITIVITY_OSCILLATION.reading;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96679_ASSERTIONS = [
  {
    id: 'imp96679-ladder-has-fourteen-rungs-n50-to-1e6',
    holds: () =>
      IMP96679_LADDER.length === 14 &&
      IMP96679_LADDER[0].N === 50 &&
      IMP96679_LADDER[IMP96679_LADDER.length - 1].N === 1000000,
    why: 'the N-ladder must reproduce all 14 imp-96616 rungs (N=50..1e6) unmodified.',
  },
  {
    id: 'imp96679-plateau-and-reset-partition-the-non-first-rungs',
    holds: () =>
      IMP96679_LADDER.slice(1).every((r) => r.isPlateau !== r.isReset) &&
      IMP96679_LADDER.filter((r) => r.isPlateau).length === 4 &&
      IMP96679_LADDER.filter((r) => r.isReset).length === 9,
    why: 'each of the 13 non-first rungs must be exactly one of plateau-continuation (4, matching the four measured doublings) or reset (9, matching the nine new-record transitions between the ten argminJumps).',
  },
  {
    id: 'imp96679-two-fold-factor-is-cube-root-of-two',
    holds: () => Math.abs(IMP96679_TWO_FOLD_FACTOR - Math.pow(2, 1 / 3)) < 1e-3,
    why: 'the plateau doubling factor must equal 2^{1/3} = 1.2599, the N^{+1/3} growth rate of ratioOverGue when the numerator g_min(N) is frozen.',
  },
  {
    id: 'imp96679-measured-doublings-match-plateau-rungs',
    holds: () => {
      const plateauN = new Set(IMP96679_LADDER.filter((r) => r.isPlateau).map((r) => r.N));
      return (
        IMP96679_MEASURED_DOUBLINGS.length === 4 &&
        IMP96679_MEASURED_DOUBLINGS.every((d) => plateauN.has(d.to))
      );
    },
    why: 'each measured doubling must land on a rung flagged isPlateau (the "to" endpoint of a frozen-argmin doubling).',
  },
  {
    id: 'imp96679-oscillation-bounds-match-source',
    holds: () =>
      Math.abs(IMP96679_OSCILLATION.min - 0.8966) < 1e-9 &&
      Math.abs(IMP96679_OSCILLATION.max - 2.2105) < 1e-9,
    why: 'the plotted oscillation range must match the imp-96654 baked min/max exactly.',
  },
];

for (const a of IMP96679_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96679-gmin-ratio-sawtooth-viz-data assertion failed: ${a.id}`);
  }
}
