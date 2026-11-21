/**
 * @module imp-97020-krein-a048-Nladder-viz-data
 *
 * imp-97020 (ux): import-light viz-data leaf for the imp-96998 extended a=0.48
 * (2a=0.96) Krein floor ladder. imp-96998 extended the imp-96977 certified-endpoint
 * Rayleigh floor ladder from N=[20,28,36] to N=[20..76] and measured the per-N
 * decrement profile (which still accelerates through N~52, only starting to contract
 * at N=60-76) alongside the Gram cond(B) conditioning wall (~4e14 by N=76, near the
 * IEEE-double edge). This leaf reshapes the floors, decrements, decrement ratios, and
 * cond(B) into chart-ready series (one row per N-to-N step) so the "still
 * pre-asymptotic, conditioning-wall-limited" reading can be seen at a glance.
 *
 * No re-derivation: every floor, decrement, ratio, and cond(B) value is copied
 * verbatim from imp-96998. The only new arithmetic here is reshaping into
 * plot-ready arrays.
 *
 * @see imp-96998-krein-a048-Nladder-extended.js (the floors/decrements/ratios/cond(B) this leaf reshapes)
 * @see imp-96977-krein-intermediate-rungs.js (the N=[20,28,36] triple imp-96998 extends)
 *
 * Ticket: imp-97020 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no
 * bound; NO QED. No self-executing assertion throw (per the imp-96294/imp-96819
 * convention) -- values are validated below via a plain exported check object
 * instead of an import-time throw.
 */

import {
  IMP96998_A,
  IMP96998_TWO_A,
  IMP96998_N_LADDER,
  IMP96998_FLOORS,
  IMP96998_COND_B,
  IMP96998_DECREMENTS,
  IMP96998_DECREMENT_RATIOS,
  IMP96998_VERDICT,
} from './imp-96998-krein-a048-Nladder-extended.js';

// FINDING 1 (floor ladder): one row per N, for a monotone-decreasing line/bar chart.
export const IMP97020_FLOOR_SERIES = Object.freeze(
  IMP96998_N_LADDER.map((N, i) => ({ N, floor: IMP96998_FLOORS[i], condB: IMP96998_COND_B[i] })),
);

// FINDING 2 (decrement profile): one row per N-to-N step, pairing the decrement d_k
// with the following ratio r_k = d_{k+1}/d_k (undefined on the last step, no ratio).
export const IMP97020_DECREMENT_SERIES = Object.freeze(
  IMP96998_DECREMENTS.map((d, i) => ({
    fromN: IMP96998_N_LADDER[i],
    toN: IMP96998_N_LADDER[i + 1],
    decrement: d,
    ratio: i < IMP96998_DECREMENT_RATIOS.length ? IMP96998_DECREMENT_RATIOS[i] : null,
  })),
);

// FINDING 3 (conditioning wall): cond(B) per rung, log10-scaled for a log-axis chart.
export const IMP97020_COND_B_SERIES = Object.freeze(
  IMP96998_N_LADDER.map((N, i) => ({ N, condB: IMP96998_COND_B[i], log10CondB: Math.log10(IMP96998_COND_B[i]) })),
);

export const IMP97020_LANDMARKS = Object.freeze({
  a: IMP96998_A,
  twoA: IMP96998_TWO_A,
  nMin: IMP96998_N_LADDER[0],
  nMax: IMP96998_N_LADDER[IMP96998_N_LADDER.length - 1],
  floorAtNMin: IMP96998_FLOORS[0],
  floorAtNMax: IMP96998_FLOORS[IMP96998_FLOORS.length - 1],
  peakDecrementStep: IMP97020_DECREMENT_SERIES[IMP96998_DECREMENTS.indexOf(Math.max(...IMP96998_DECREMENTS))],
  condBAtNMax: IMP96998_COND_B[IMP96998_COND_B.length - 1],
  geometricTailReached: IMP96998_VERDICT.geometricTailReached,
  subGapClosed: IMP96998_VERDICT.subGapClosed,
});

export const IMP97020_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every floor, decrement, ' +
  'ratio, and cond(B) value plotted here is copied verbatim from imp-96998. The floors are ' +
  'finite-N Rayleigh UPPER bounds / positive-tail-dropped LOWER bounds, not a certified operator ' +
  'floor. The ladder is still pre-asymptotic (decrements accelerate through N~52) and the Gram ' +
  'cond(B) approaches the IEEE-double conditioning wall by N=76, so IMP96977_TRUE_LIMIT_UNSETTLED ' +
  'stays open. Measurement/reshaping only: changes no bound and establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP97020_VALIDATION = Object.freeze({
  rowCountMatches: IMP97020_FLOOR_SERIES.length === IMP96998_N_LADDER.length,
  decrementRowCountMatches: IMP97020_DECREMENT_SERIES.length === IMP96998_DECREMENTS.length,
  floorsStrictlyDecreasing: IMP97020_FLOOR_SERIES.every(
    (r, i) => i === 0 || IMP97020_FLOOR_SERIES[i - 1].floor > r.floor,
  ),
  condBStrictlyIncreasing: IMP97020_COND_B_SERIES.every(
    (r, i) => i === 0 || IMP97020_COND_B_SERIES[i - 1].condB < r.condB,
  ),
});

export default {
  floorSeries: IMP97020_FLOOR_SERIES,
  decrementSeries: IMP97020_DECREMENT_SERIES,
  condBSeries: IMP97020_COND_B_SERIES,
  landmarks: IMP97020_LANDMARKS,
  banner: IMP97020_HONEST_BANNER,
  validation: IMP97020_VALIDATION,
};
