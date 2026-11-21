/**
 * @module imp-97612-cusp-separation-viz-data
 *
 * imp-97612: import-light viz-data reshaping the imp-97576 FINDING 2/3 cusp x0 -> 0 ladder into
 * chart-ready rows -- the Gauss-Kuzmin AVERAGE mean(r/x^2) shrinking toward zero (-7.68e-2 -> -2.61e-3)
 * versus the pointwise WOBBLE sd rising (3.21e-3 -> 2.72e-2) across x0 in {0.2,0.1,0.05,0.02,0.01,0.005}.
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97576_CUSP_LADDER literals verbatim -- no re-derivation,
 * no new computation. kappa_smooth stays NOT pinned; no bound moves; RH open; NO QED.
 *
 * @see imp-97576-route-m-gauss-kuzmin-wobble-average.js (IMP97576_CUSP_LADDER, FINDING 2/3, VERDICT)
 */

import { IMP97576_CUSP_LADDER, IMP97576_KAPPA_SMOOTH_UPPER } from './imp-97576-route-m-gauss-kuzmin-wobble-average.js';

// Chart rows: |mean| (the shrinking Gauss-Kuzmin average) vs sd (the growing pointwise wobble), per x0.
export const IMP97612_CUSP_ROWS = Object.freeze(
  IMP97576_CUSP_LADDER.map((row) =>
    Object.freeze({
      x0: row.x0,
      absMean: Math.abs(row.mean),
      mean: row.mean,
      sd: row.sd,
      ratio: Math.abs(row.mean) / row.sd, // |mean|/sd -- widening separation as x0 -> 0
    })),
);

export const IMP97612_KAPPA_SMOOTH_UPPER = IMP97576_KAPPA_SMOOTH_UPPER;

export const IMP97612_SUMMARY = Object.freeze({
  law:
    'Across the imp-97576 cusp ladder x0 in {0.2,0.1,0.05,0.02,0.01,0.005}, the Gauss-Kuzmin average '
    + '|mean(r/x^2)| falls monotonically from 7.68e-2 to 2.61e-3 while the pointwise wobble sd rises '
    + 'monotonically from 3.21e-3 to 2.72e-2 -- two scales moving in OPPOSITE directions as the cusp '
    + 'x -> 0 is approached, with the separation widening (|mean|/sd falls from ~23.9 to ~0.096).',
  reading:
    `At x0 = ${IMP97612_CUSP_ROWS[0].x0}, |mean| = ${IMP97612_CUSP_ROWS[0].absMean.toExponential(3)} `
    + `dwarfs sd = ${IMP97612_CUSP_ROWS[0].sd.toExponential(3)} (ratio `
    + `${IMP97612_CUSP_ROWS[0].ratio.toFixed(2)}). By x0 = ${IMP97612_CUSP_ROWS[IMP97612_CUSP_ROWS.length - 1].x0}, `
    + `the mean has collapsed to ${IMP97612_CUSP_ROWS[IMP97612_CUSP_ROWS.length - 1].absMean.toExponential(3)} `
    + `(below the ${IMP97612_KAPPA_SMOOTH_UPPER.toExponential(0)} smooth-bound) while sd has grown to `
    + `${IMP97612_CUSP_ROWS[IMP97612_CUSP_ROWS.length - 1].sd.toExponential(3)} -- the ratio inverts from `
    + `~23.9 down to ~${IMP97612_CUSP_ROWS[IMP97612_CUSP_ROWS.length - 1].ratio.toFixed(3)}.`,
  verdict:
    'PRESENTATION ONLY, no new computation; reshapes imp-97576 literals verbatim. kappa_smooth is NOT '
    + 'pinned (only the cusp limit is measured, not extrapolated to an exact constant). Changes no '
    + 'bound, establishes no operator positivity, no RH claim; no refereed bound is changed'
    + '; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97612_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97612-row-count-matches-source-ladder',
    description: 'six rows, one per imp-97576 x0 rung',
    holds: () => IMP97612_CUSP_ROWS.length === 6,
  },
  {
    id: 'imp97612-absmean-monotone-decreasing',
    description: '|mean| strictly decreases down the ladder as x0 shrinks',
    holds: () => {
      for (let i = 1; i < IMP97612_CUSP_ROWS.length; i++) {
        if (IMP97612_CUSP_ROWS[i].absMean >= IMP97612_CUSP_ROWS[i - 1].absMean) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97612-sd-monotone-increasing',
    description: 'sd strictly increases down the ladder as x0 shrinks',
    holds: () => {
      for (let i = 1; i < IMP97612_CUSP_ROWS.length; i++) {
        if (IMP97612_CUSP_ROWS[i].sd <= IMP97612_CUSP_ROWS[i - 1].sd) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97612-ratio-crosses-below-one',
    description: 'the |mean|/sd ratio starts well above 1 and ends well below 1 -- the two-scale crossing',
    holds: () =>
      IMP97612_CUSP_ROWS[0].ratio > 5 &&
      IMP97612_CUSP_ROWS[IMP97612_CUSP_ROWS.length - 1].ratio < 0.15,
  },
  {
    id: 'imp97612-final-mean-below-smooth-bound',
    description: 'the cusp-limit |mean| at x0=0.005 sits below the 1e-2 smooth upper bound',
    holds: () =>
      IMP97612_CUSP_ROWS[IMP97612_CUSP_ROWS.length - 1].absMean < IMP97612_KAPPA_SMOOTH_UPPER,
  },
  {
    id: 'imp97612-honest-status-carried',
    description: 'summary verdict restates NOT-pinned / no-bound-moved / NO-QED honesty markers',
    holds: () =>
      /NOT/.test(IMP97612_SUMMARY.verdict) &&
      /no bound/.test(IMP97612_SUMMARY.verdict) &&
      /NO QED/.test(IMP97612_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP97612_SUMMARY.verdict),
  },
];

for (const assertion of IMP97612_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97612 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97612_SUMMARY;
