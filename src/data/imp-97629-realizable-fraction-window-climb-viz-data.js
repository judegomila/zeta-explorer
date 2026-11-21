/**
 * @module imp-97629-realizable-fraction-window-climb-viz-data
 *
 * imp-97629: import-light viz-data reshaping the imp-97564 window-widening ladder into chart-ready
 * rows. Holding the grid-converged spacing h=0.01 and widening the window half-width T from 12 to 64
 * climbs the realizable/bathtub fraction 0.43837 -> 0.50552 with decelerating increments (the fraction
 * is saturating, not running away to 1), and a 1/T Richardson extrapolation from the last two rungs
 * gives R_inf ~ 1573 (fraction ~ 0.513). This corrects the imp-97457 43.84% reading: that value was
 * grid-converged but WINDOW-TRUNCATED at T=12, not the saturated fraction.
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97564_WINDOW_LADDER / IMP97564_RESOLUTION literals verbatim
 * -- no re-derivation, no new computation. No bound moves; RH open; NO QED.
 *
 * @see imp-97564-realizability-fraction-resolution-sweep.js (IMP97564_WINDOW_LADDER, IMP97564_RESOLUTION)
 * @see imp-97457-krein-bathtub-realizability-gap.js (the 43.84% T=12 measurement this corrects)
 */

import {
  IMP97564_WINDOW_LADDER,
  IMP97564_RESOLUTION,
} from './imp-97564-realizability-fraction-resolution-sweep.js';

export const IMP97629_EXTRAP_R_INF = IMP97564_RESOLUTION.extrapR_inf; // ~1573
export const IMP97629_EXTRAP_FRACTION = IMP97564_RESOLUTION.extrapFraction; // ~0.513
export const IMP97629_ENVELOPE = IMP97564_RESOLUTION.envelope; // 3065.429

export const IMP97629_ROWS = Object.freeze(
  IMP97564_WINDOW_LADDER.map((row, i, arr) =>
    Object.freeze({
      T: row.T,
      N: row.N,
      R: row.R,
      fraction: row.fraction,
      increment: i === 0 ? null : row.R - arr[i - 1].R,
      isFirst: i === 0,
      isLast: i === arr.length - 1,
    })),
);

export const IMP97629_SUMMARY = Object.freeze({
  law:
    'Holding the grid-converged spacing h=0.01 fixed, widening the window half-width T=12->64 climbs '
    + 'R = lambda_max(P_a M_sigma2^- P_a) monotonically with decelerating increments; a 1/T Richardson '
    + 'extrapolation from the last two rungs (T=48, T=64) gives R_inf ~ 1573.',
  reading:
    `The realizable fraction climbs from ${IMP97629_ROWS[0].fraction.toFixed(5)} at T=${IMP97629_ROWS[0].T} `
    + `to ${IMP97629_ROWS[IMP97629_ROWS.length - 1].fraction.toFixed(5)} at T=${IMP97629_ROWS[IMP97629_ROWS.length - 1].T}, `
    + `with each successive rung adding less than the one before it. The 1/T extrapolation puts the `
    + `infinite-window limit at R_inf ~ ${IMP97629_EXTRAP_R_INF.toFixed(1)} (fraction ~ ${IMP97629_EXTRAP_FRACTION.toFixed(3)}), `
    + `so the imp-97457 43.84% reading was a [-12,12] window-truncation artifact, not the saturated value.`,
  verdict:
    'MEASUREMENT ONLY. R is a finite-section IEEE-double/Lanczos eigenvalue on a truncated window and '
    + 'R_inf is a 1/T extrapolation, not a certified limit; the realizable psi still captures only ~half '
    + 'the bathtub envelope, so the realizability gap persists; no bound moved; interval-rigorous reach '
    + 'stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97629_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97629-six-rows-window-ladder',
    description: 'exactly six rows, one per IMP97564_WINDOW_LADDER rung, T ascending',
    holds: () => {
      if (IMP97629_ROWS.length !== 6) return false;
      for (let i = 1; i < IMP97629_ROWS.length; i++) {
        if (!(IMP97629_ROWS[i].T > IMP97629_ROWS[i - 1].T)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97629-fraction-and-R-monotone-increasing',
    description: 'R and fraction strictly increase with T',
    holds: () => {
      for (let i = 1; i < IMP97629_ROWS.length; i++) {
        if (!(IMP97629_ROWS[i].R > IMP97629_ROWS[i - 1].R)) return false;
        if (!(IMP97629_ROWS[i].fraction > IMP97629_ROWS[i - 1].fraction)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97629-increments-decelerate',
    description: 'the R increments (T=20 onward) decelerate: the last increment is smaller than the first',
    holds: () => {
      const incs = IMP97629_ROWS.filter((r) => r.increment !== null).map((r) => r.increment);
      return incs[incs.length - 1] < incs[0];
    },
  },
  {
    id: 'imp97629-endpoint-values-match-imp97564',
    description: 'first/last rows reproduce the imp-97457 T=12 fraction and the widest-measured T=64 fraction',
    holds: () =>
      Math.abs(IMP97629_ROWS[0].fraction - 0.43837) < 1e-4
      && Math.abs(IMP97629_ROWS[IMP97629_ROWS.length - 1].fraction - 0.50552) < 1e-4,
  },
  {
    id: 'imp97629-extrapolation-exceeds-widest-rung-below-envelope',
    description: 'R_inf exceeds the widest measured R yet stays below the full envelope; extrapolated fraction ~0.513',
    holds: () =>
      IMP97629_EXTRAP_R_INF > IMP97629_ROWS[IMP97629_ROWS.length - 1].R
      && IMP97629_EXTRAP_R_INF < IMP97629_ENVELOPE
      && IMP97629_EXTRAP_FRACTION > 0.5 && IMP97629_EXTRAP_FRACTION < 0.55,
  },
  {
    id: 'imp97629-honest-status-carried',
    description: 'verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () =>
      /no bound/.test(IMP97629_SUMMARY.verdict) &&
      /NO QED/.test(IMP97629_SUMMARY.verdict),
  },
];

for (const assertion of IMP97629_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97629 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97629_SUMMARY;
