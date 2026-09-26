/**
 * @module imp-97022-sigma2-tail-envelope-viz-data
 * @fileoverview imp-97022: import-light chart-ready reshape of the imp-96997 corrected
 *   sigma_2-weighted-tail envelope model. Presentation only -- reuses the imp-96997 rows and
 *   verdict verbatim, no new computation. Modelling only; the Rayleigh floor is an UPPER bound;
 *   all rungs are PAST the 2a<=0.96 interval-verified reach and UNVERIFIED; changes no bound;
 *   RH open; NO QED.
 *
 * @see imp-96997-sigma2-weighted-tail-envelope-model.js (source: C_mean, per-N rows, verdict)
 */

import {
  IMP96997_NS,
  IMP96997_ROWS,
  IMP96997_C_MEAN,
  IMP96997_ENVELOPE_CROSSOVER_N,
  IMP96997_MEASURED_CROSSOVER_N,
  IMP96997_VERDICT,
} from './imp-96997-sigma2-weighted-tail-envelope-model.js';

// chart-ready per-N series: measured weightedTailFrac vs the corrected envelope C_mean*residFirstOrder
// vs the linear onset fraction, plus log10(N) for even x-axis spacing across the doubling ladder.
export const IMP97022_SERIES = Object.freeze(
  IMP96997_NS.map((N) => {
    const row = IMP96997_ROWS[N];
    const envelope = IMP96997_C_MEAN * row.residFirstOrder;
    return Object.freeze({
      N,
      log10N: Math.log10(N),
      weightedTailFrac: row.weightedTailFrac,
      envelope,
      onset: row.onset,
      envelopeRelErr: Math.abs(envelope - row.weightedTailFrac) / row.weightedTailFrac,
    });
  }),
);

export const IMP97022_CROSSOVER = Object.freeze({
  envelopeCrossoverN: IMP96997_ENVELOPE_CROSSOVER_N, // 145.93
  measuredCrossoverN: IMP96997_MEASURED_CROSSOVER_N, // 145.34
});

export const IMP97022_HONEST_BANNER = IMP96997_VERDICT.answer;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97022_ASSERTIONS = [
  {
    id: 'imp97022-series-covers-full-ladder',
    holds: () => IMP97022_SERIES.length === IMP96997_NS.length,
    why: 'the reshaped series must carry every N-rung from the imp-96997 source ladder, no truncation.',
  },
  {
    id: 'imp97022-envelope-matches-source-formula',
    holds: () =>
      IMP97022_SERIES.every((r) => {
        const expected = IMP96997_C_MEAN * IMP96997_ROWS[r.N].residFirstOrder;
        return Math.abs(r.envelope - expected) < 1e-9;
      }),
    why: 'the plotted envelope must be exactly C_mean*residFirstOrder, the imp-96997 corrected model, not a re-derived approximation.',
  },
  {
    id: 'imp97022-envelope-brackets-onset-crossover',
    holds: () => {
      const at136 = IMP97022_SERIES.find((r) => r.N === 136);
      const at148 = IMP97022_SERIES.find((r) => r.N === 148);
      return (
        at136.envelope < at136.onset &&
        at148.envelope > at148.onset &&
        IMP97022_CROSSOVER.envelopeCrossoverN > 136 &&
        IMP97022_CROSSOVER.envelopeCrossoverN < 148
      );
    },
    why: 'the reshaped envelope must still sit below the onset at N=136 and above it at N=148, reproducing the imp-96997 N~145.9 crossover bracket.',
  },
  {
    id: 'imp97022-presentation-only-no-qed',
    holds: () => IMP96997_VERDICT.qed === false && IMP96997_VERDICT.operatorPositivityProved === false,
    why: 'presentation only: no operator positivity is established and no QED is claimed by the source finding this leaf reshapes.',
  },
];

for (const a of IMP97022_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97022-sigma2-tail-envelope-viz-data assertion failed: ${a.id}`);
  }
}
