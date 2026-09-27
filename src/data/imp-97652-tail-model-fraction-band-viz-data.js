/**
 * @module imp-97652-tail-model-fraction-band-viz-data
 *
 * imp-97652: import-light viz-data reshaping the imp-97626 three-tail-model fit into chart-ready
 * rows -- the full T=12..64 ladder fit under 1/T, 1/T^2, (log T)/T spreads the realizable fraction
 * widely (0.5078..0.5429) because the small-T rungs are pre-asymptotic, while restricting to the
 * asymptotic tail (T>=28) collapses all three models into the tight [0.508, 0.520] band that
 * brackets the imp-97564 two-rung headline ~0.5132.
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97626 literals verbatim -- no re-derivation, no new
 * computation. No bound moves; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97626-window-extrapolation-model-spread.js (IMP97626_FIT_FULL, IMP97626_FIT_TAIL4,
 *      IMP97626_SPREAD, IMP97626_TWO_RUNG_FRACTION, IMP97626_VERDICT)
 */

import {
  IMP97626_FIT_FULL,
  IMP97626_FIT_TAIL4,
  IMP97626_SPREAD,
  IMP97626_TWO_RUNG_FRACTION,
  IMP97626_VERDICT,
} from './imp-97626-window-extrapolation-model-spread.js';

const _MODEL_LABELS = Object.freeze({
  invT: '1/T',
  invT2: '1/T^2',
  logToverT: '(log T)/T',
});

// Grouped-bar rows: fraction per tail model, full-ladder (T=12..64) vs tail-restricted (T=28..64).
export const IMP97652_MODEL_ROWS = Object.freeze(
  Object.keys(_MODEL_LABELS).map((key) =>
    Object.freeze({
      label: _MODEL_LABELS[key],
      fullFraction: IMP97626_FIT_FULL[key].fraction,
      tailFraction: IMP97626_FIT_TAIL4[key].fraction,
      fullR2: IMP97626_FIT_FULL[key].r2,
      tailR2: IMP97626_FIT_TAIL4[key].r2,
    })
  )
);

// Band-comparison rows: full-ladder band [0.508, 0.543] vs tail-restricted band [0.508, 0.520].
export const IMP97652_BAND_ROWS = Object.freeze([
  Object.freeze({
    label: 'Full ladder (T=12..64)',
    lo: IMP97626_SPREAD.full.fractionMin,
    hi: IMP97626_SPREAD.full.fractionMax,
  }),
  Object.freeze({
    label: 'Asymptotic tail (T=28..64)',
    lo: IMP97626_SPREAD.tail4.fractionMin,
    hi: IMP97626_SPREAD.tail4.fractionMax,
  }),
]);

export const IMP97652_TWO_RUNG_FRACTION = IMP97626_TWO_RUNG_FRACTION;

export const IMP97652_SUMMARY = Object.freeze({
  reading:
    `On the full T=12..64 ladder the three tail models spread the realizable fraction from `
    + `${IMP97626_SPREAD.full.fractionMin.toFixed(4)} to ${IMP97626_SPREAD.full.fractionMax.toFixed(4)} `
    + `(width ${IMP97626_SPREAD.full.fractionSpread.toFixed(4)}) because the small-T rungs are `
    + 'pre-asymptotic. Restricting to the asymptotic tail (T>=28) collapses the spread to '
    + `${IMP97626_SPREAD.tail4.fractionMin.toFixed(4)}..${IMP97626_SPREAD.tail4.fractionMax.toFixed(4)} `
    + `(width ${IMP97626_SPREAD.tail4.fractionSpread.toFixed(4)}), which brackets the imp-97564 `
    + `two-rung headline ${IMP97652_TWO_RUNG_FRACTION.toFixed(4)}.`,
  verdict: IMP97626_VERDICT.answer,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97652_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97652-model-rows-tail-tighter-than-full',
    description: 'every model row must have tailFraction closer to the cluster than fullFraction spreads',
    holds: () => {
      const fullVals = IMP97652_MODEL_ROWS.map((r) => r.fullFraction);
      const tailVals = IMP97652_MODEL_ROWS.map((r) => r.tailFraction);
      const fullSpread = Math.max(...fullVals) - Math.min(...fullVals);
      const tailSpread = Math.max(...tailVals) - Math.min(...tailVals);
      return tailSpread < fullSpread;
    },
  },
  {
    id: 'imp97652-band-rows-tail-inside-full',
    description: 'the tail-restricted band must sit inside (or match the low end of) the full-ladder band',
    holds: () => {
      const [full, tail] = IMP97652_BAND_ROWS;
      return tail.lo >= full.lo - 1e-9 && tail.hi <= full.hi + 1e-9;
    },
  },
  {
    id: 'imp97652-two-rung-inside-tail-band',
    description: 'the two-rung headline fraction must lie inside the tail-restricted band',
    holds: () => {
      const [, tail] = IMP97652_BAND_ROWS;
      return IMP97652_TWO_RUNG_FRACTION >= tail.lo - 1e-4 && IMP97652_TWO_RUNG_FRACTION <= tail.hi + 1e-4;
    },
  },
  {
    id: 'imp97652-honesty-gate-no-qed',
    description: 'measurement only: no bound moved, honest markers present',
    holds: () =>
      IMP97626_VERDICT.rigorousLowerBoundPromoted === false &&
      IMP97626_VERDICT.qed === false &&
      /NO QED/.test(IMP97652_SUMMARY.verdict) &&
      /RH open/.test(IMP97652_SUMMARY.verdict),
  },
];

for (const a of IMP97652_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97652-tail-model-fraction-band-viz-data assertion failed: ${a.id}`);
  }
}
