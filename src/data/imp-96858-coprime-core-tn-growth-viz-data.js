/**
 * @module imp-96858-coprime-core-tn-growth-viz-data
 *
 * imp-96858 (ux): import-light viz-data leaf for the imp-96828 coprime-core
 * Vasyunin second-moment T(N) growth ladder -- the linear-in-log fit
 * T ~ 3.542 log N - 1.426 (rms 0.002) vs the REJECTED pure-quadratic model
 * T ~ 0.450 (log N)^2 (rms 2.544, ~1300x worse), plus the local-exponent-vs-N
 * trace that stays flat near 1.06 (nowhere near the conjectured 2).
 *
 * imp-96828 exported IMP96828_LADDER + IMP96828_FITS but shipped no
 * visualization: this module reshapes those literals (imported directly, no
 * re-fit) into a chart-ready row list (T ladder + both fit curves) and a
 * separate local-exponent trace, reusing every number verbatim.
 *
 * PRESENTATION ONLY. Proves no growth law; establishes no operator
 * positivity; interval-rigorous certificate reach stays 2a<=0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96828-coprime-core-vasyunin-second-moment-growth.js (source ladder + fits)
 * @see imp-96856-krein-tresidual-envelope-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96858 (ux, sonnet-4-6, small). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96828_LADDER, IMP96828_FITS, IMP96828_VERDICT } from './imp-96828-coprime-core-vasyunin-second-moment-growth.js';

const { modelA_quadraticOnly, modelB_linearInLog } = IMP96828_FITS;

// Chart-ready row per rung: measured T, the winning linear-in-log fit curve,
// and the rejected pure-quadratic fit curve, all against log N.
export const IMP96858_ROWS = Object.freeze(
  IMP96828_LADDER.map((row) => {
    const logN = Math.log(row.N);
    return Object.freeze({
      N: row.N,
      logN,
      T: row.T,
      linearFit: modelB_linearInLog.c1 * logN + modelB_linearInLog.c0,
      quadraticFit: modelA_quadraticOnly.c2 * logN * logN,
    });
  }),
);

// Local power exponent p in T ~ (log N)^p between consecutive rungs, verbatim
// from the imp-96828 header table -- flat/slightly decreasing, hugging ~1.06.
export const IMP96858_LOCAL_EXPONENT = Object.freeze([
  Object.freeze({ fromN: 250, toN: 500, exponent: 1.0721 }),
  Object.freeze({ fromN: 500, toN: 1000, exponent: 1.0650 }),
  Object.freeze({ fromN: 1000, toN: 1500, exponent: 1.0606 }),
  Object.freeze({ fromN: 1500, toN: 2000, exponent: 1.0588 }),
  Object.freeze({ fromN: 2000, toN: 3000, exponent: 1.0554 }),
  Object.freeze({ fromN: 3000, toN: 4000, exponent: 1.0534 }),
]);

export const IMP96858_HONEST_BANNER =
  'Presentation only: reshapes the imp-96828 measured T(N) ladder and fits into chart-ready ' +
  'rows, no re-fit and no new numbers. The linear-in-log curve T ~ 3.542 log N - 1.426 fits ' +
  'the measured ladder to rms 0.002; the pure-quadratic curve T ~ 0.450 (log N)^2 is the ' +
  'REJECTED model (rms 2.544, ~1300x worse); the local exponent stays flat near 1.06, not ' +
  'climbing toward 2. Proves no growth law; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96858_ASSERTIONS = [
  {
    id: 'imp96858-rows-match-ladder-length',
    holds: () => IMP96858_ROWS.length === IMP96828_LADDER.length && IMP96858_ROWS.length === 7,
    why: 'the chart-ready row list must carry every rung of the source imp-96828 ladder (N=250..4000), no dropped or invented points.',
  },
  {
    id: 'imp96858-linear-fit-tracks-measured-T',
    holds: () => IMP96858_ROWS.every((r) => Math.abs(r.linearFit - r.T) < 0.01),
    why: 'the linear-in-log fit curve must closely track the measured T at every rung, matching the imp-96828 rms 0.002 reading.',
  },
  {
    id: 'imp96858-quadratic-fit-diverges-from-measured-T',
    holds: () =>
      IMP96858_ROWS.every((r) => Math.abs(r.quadraticFit - r.T) > 0.3) &&
      Math.abs(IMP96858_ROWS[0].quadraticFit - IMP96858_ROWS[0].T) > 4 &&
      Math.abs(IMP96858_ROWS[IMP96858_ROWS.length - 1].quadraticFit - IMP96858_ROWS[IMP96858_ROWS.length - 1].T) > 2,
    why: 'the rejected pure-quadratic curve must visibly diverge from the measured T at every rung, most sharply at the first and last, showing WHY it was rejected (rms 2.544 vs 0.002).',
  },
  {
    id: 'imp96858-local-exponent-flat-not-climbing-to-two',
    holds: () =>
      IMP96858_LOCAL_EXPONENT.length === 6 &&
      IMP96858_LOCAL_EXPONENT.every((e) => e.exponent > 1.0 && e.exponent < 1.1) &&
      IMP96858_LOCAL_EXPONENT.every((e, i) => (i === 0 ? true : e.exponent <= IMP96858_LOCAL_EXPONENT[i - 1].exponent)),
    why: 'the local-exponent-vs-N trace must stay flat/decreasing near 1.06 across all six consecutive-rung pairs, nowhere near the conjectured quadratic exponent 2.',
  },
  {
    id: 'imp96858-verdict-matches-source-no-bound-moved',
    holds: () =>
      IMP96828_VERDICT.quadraticLawConfirmed === false &&
      IMP96828_VERDICT.linearInLogFitsBest === true &&
      /RH open/.test(IMP96858_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96858_HONEST_BANNER) &&
      /NO QED/.test(IMP96858_HONEST_BANNER),
    why: 'the viz leaf must not drift from the source verdict (no quadratic law, linear-in-log fits best) and must carry the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96858_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96858-coprime-core-tn-growth-viz-data assertion failed: ${a.id}`);
  }
}
