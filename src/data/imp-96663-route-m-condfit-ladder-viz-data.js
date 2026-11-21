/**
 * @module imp-96663-route-m-condfit-ladder-viz-data
 *
 * imp-96663 (ux): import-light viz-data leaf for the imp-96570
 * directly-measured cond#(N) = lam_max/lam_min ladder, its single-object
 * power fit cond# ~ C N^q (q ~ 1.96 dense / 1.98 all), and the three
 * conditioning ceilings (independent 3.78e7-4.30e7, composed measured
 * 4.11e7, rigorous trace lower 2.59e7) against the imp-96352 wall-clock
 * compute ceiling ~9916 -- which had FINDING numbers but no chart.
 *
 * MEASUREMENT / PRESENTATION ONLY. All rows, the power-fit coefficients,
 * and the three ceiling values are reused verbatim from imp-96570; no new
 * measurement or Gram rebuild here. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96570-route-m-conditioning-ceiling-crossvalidation.js (source ladder, fit, ceilings)
 * @see imp-96581-route-m-lammax-rigorous-vs-measured-viz-data.js (same viz-page convention)
 *
 * Ticket: imp-96663 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96570_COND_ROWS,
  IMP96570_FIT,
  IMP96570_CROSSCHECK,
} from './imp-96570-route-m-conditioning-ceiling-crossvalidation.js';

// log-log ladder points (N, cond#) plus the dense power-fit curve, reused
// verbatim from the imp-96570 baked rows and fit coefficients.
export const IMP96663_LADDER = Object.freeze(
  IMP96570_COND_ROWS.map((r) => Object.freeze({ N: r.N, cond: r.cond })),
);

export const IMP96663_FIT_CURVE = Object.freeze({
  q: IMP96570_FIT.dense.q,
  C: IMP96570_FIT.dense.C,
  r2: IMP96570_FIT.dense.r2,
  // sample the fitted power law across the ladder's log-N span for plotting.
  points: Object.freeze(
    (() => {
      const minN = IMP96663_LADDER[0].N;
      const maxN = IMP96663_LADDER[IMP96663_LADDER.length - 1].N;
      const steps = 24;
      const out = [];
      for (let i = 0; i <= steps; i++) {
        const logN = Math.log(minN) + (i / steps) * (Math.log(maxN) - Math.log(minN));
        const N = Math.exp(logN);
        out.push(Object.freeze({ N, cond: IMP96570_FIT.dense.C * Math.pow(N, IMP96570_FIT.dense.q) }));
      }
      return out;
    })(),
  ),
});

// the three ceilings plus the compute wall, restated for the chart's
// vertical marker lines (all N-axis values).
export const IMP96663_CEILINGS = Object.freeze({
  independentCeilingDense: IMP96570_CROSSCHECK.independentCeilingDense, // ~4.30e7
  independentCeilingAll: IMP96570_CROSSCHECK.independentCeilingAll, // ~3.78e7
  composedMeasuredCeiling: IMP96570_CROSSCHECK.composedMeasuredCeiling, // 4.11e7
  rigorousLowerCeiling: IMP96570_CROSSCHECK.rigorousLowerCeiling, // 2.59e7
  computeCeiling: 9916, // imp-96352 wall-clock reach
  computeFactor: IMP96570_CROSSCHECK.bothAboveComputeFactor, // ~3800x
});

export const IMP96663_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every ladder row, the ' +
  'power-fit coefficients, and the three ceiling values are reused verbatim from imp-96570; no ' +
  'new measurement or Gram rebuild. Changes no bound and establishes no operator positivity. ' +
  'Per imp-96731 FINDING 2: of the three ceilings only the rigorous trace lower ceiling ' +
  '(2.59e7, proven closed-form asymptotic) is rigorously anchored -- the composed measured ' +
  '(4.11e7) and independent dense-fit (~4.30e7) ceilings are ~four-decade log-fit ' +
  'extrapolations with no proven asymptotic.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96663_ASSERTIONS = [
  {
    id: 'imp96663-ladder-matches-source-rows',
    holds: () =>
      IMP96663_LADDER.length === IMP96570_COND_ROWS.length &&
      IMP96663_LADDER.every((r, i) => r.N === IMP96570_COND_ROWS[i].N && r.cond === IMP96570_COND_ROWS[i].cond),
    why: 'the plotted ladder must reuse the imp-96570 rows verbatim (N and cond# values), no re-derivation.',
  },
  {
    id: 'imp96663-fit-curve-anchored-to-top-rung',
    holds: () => {
      const top = IMP96663_LADDER[IMP96663_LADDER.length - 1];
      const predicted = IMP96663_FIT_CURVE.C * Math.pow(top.N, IMP96663_FIT_CURVE.q);
      return Math.abs(predicted - top.cond) / top.cond < 0.02;
    },
    why: 'the dense power-fit curve must reproduce the top accessible rung N=6000 to <2%, matching the imp-96570 FINDING 3 anchoring claim.',
  },
  {
    id: 'imp96663-ceilings-ordered-rigorous-below-composed-below-independent-dense',
    holds: () =>
      IMP96663_CEILINGS.rigorousLowerCeiling < IMP96663_CEILINGS.composedMeasuredCeiling &&
      IMP96663_CEILINGS.composedMeasuredCeiling < IMP96663_CEILINGS.independentCeilingDense,
    why: 'the rigorous trace lower ceiling (2.59e7) must sit below the composed measured ceiling (4.11e7), which must sit below the independent dense-fit ceiling (~4.30e7), per imp-96570 FINDING 2.',
  },
  {
    id: 'imp96663-all-ceilings-far-above-compute-wall',
    holds: () =>
      IMP96663_CEILINGS.rigorousLowerCeiling / IMP96663_CEILINGS.computeCeiling > 2000 &&
      IMP96663_CEILINGS.computeFactor > 2000,
    why: 'every conditioning ceiling must sit far (>2000x) above the imp-96352 wall-clock compute ceiling ~9916, so compute binds first independently of which ceiling is used.',
  },
  {
    id: 'imp96663-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96663_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96663_HONEST_BANNER) &&
      /NO QED/.test(IMP96663_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
  {
    id: 'imp96663-banner-flags-rigor-gap',
    holds: () =>
      /imp-96731/.test(IMP96663_HONEST_BANNER) &&
      /rigorously anchored/.test(IMP96663_HONEST_BANNER) &&
      /extrapolations/.test(IMP96663_HONEST_BANNER),
    why: 'imp-96731 FINDING 2: only the trace lower ceiling is rigorously anchored, while the composed measured and independent dense-fit ceilings are log-fit extrapolations; the banner must say so, not present all three as equally certain.',
  },
];

for (const a of IMP96663_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96663-route-m-condfit-ladder-viz-data assertion failed: ${a.id}`,
    );
  }
}
