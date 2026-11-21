/**
 * @module imp-96883-coprime-core-tn-extended-viz-data
 *
 * imp-96883 (ux): import-light viz-data leaf for the imp-96849 EXTENDED
 * coprime-core Vasyunin second-moment T(N) ladder (N=250..8000) -- the
 * linear-in-log fit T ~ 3.544 log N (rms 0.0024) that TIGHTENS past the
 * imp-96828 N=4000 reach, plus the local-exponent-vs-N trace that keeps
 * falling below 1.05 (the wrong direction for the imp-96795 (log N)^2 target).
 *
 * imp-96849 exported IMP96849_LADDER + IMP96849_FITS but shipped no
 * visualization: this module reshapes those literals (imported directly, no
 * re-fit) into a chart-ready row list (T ladder + linear-in-log fit curve)
 * and a separate local-exponent trace, reusing every number verbatim.
 * Mirrors the imp-96858 viz-data leaf convention for the pre-extension ladder.
 *
 * PRESENTATION ONLY. Proves no growth law; establishes no operator
 * positivity; interval-rigorous certificate reach stays 2a<=0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96849-coprime-core-vasyunin-second-moment-ladder-extension.js (source ladder + fits)
 * @see imp-96858-coprime-core-tn-growth-viz-data.js (sibling viz-data leaf for the pre-extension ladder)
 *
 * Ticket: imp-96883 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96849_LADDER, IMP96849_FITS } from './imp-96849-coprime-core-vasyunin-second-moment-ladder-extension.js';

const { modelB_linearInLog } = IMP96849_FITS;

// Chart-ready row per rung: measured T against log N, plus the winning
// linear-in-log fit curve (verbatim coefficients, no re-fit).
export const IMP96883_ROWS = Object.freeze(
  IMP96849_LADDER.map((row) => {
    const logN = Math.log(row.N);
    return Object.freeze({
      N: row.N,
      logN,
      T: row.T,
      linearFit: modelB_linearInLog.c1 * logN + modelB_linearInLog.c0,
    });
  }),
);

// Local power exponent p in T ~ (log N)^p between consecutive rungs, verbatim
// from the imp-96849 header table -- falling below 1.05 by N=8000, the wrong
// direction for the conjectured quadratic exponent 2.
export const IMP96883_LOCAL_EXPONENT = Object.freeze(
  IMP96849_LADDER.slice(1).map((row, i) =>
    Object.freeze({
      fromN: IMP96849_LADDER[i].N,
      toN: row.N,
      exponent: row.pLocal,
    }),
  ),
);

export const IMP96883_HONEST_BANNER =
  'Presentation only: reshapes the imp-96849 EXTENDED measured T(N) ladder (N=250..8000) and its ' +
  'linear-in-log fit into chart-ready rows, no re-fit and no new numbers. The fit curve ' +
  'T ~ 3.544 log N - 1.437 tracks the measured ladder to rms 0.0024; the local exponent keeps ' +
  'falling (1.0534 at N=4000 down to 1.0496 at N=8000, i.e. below 1.05), trending away from the ' +
  'conjectured quadratic exponent 2, not toward it. Proves no growth law; no refereed bound is changed; ' +
  'RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96883_ASSERTIONS = [
  {
    id: 'imp96883-rows-match-ladder-length',
    holds: () => IMP96883_ROWS.length === IMP96849_LADDER.length && IMP96883_ROWS.length === 10,
    why: 'the chart-ready row list must carry every rung of the source imp-96849 extended ladder (N=250..8000), no dropped or invented points.',
  },
  {
    id: 'imp96883-linear-fit-tracks-measured-T',
    holds: () => IMP96883_ROWS.every((r) => Math.abs(r.linearFit - r.T) < 0.02),
    why: 'the linear-in-log fit curve must closely track the measured T at every rung, matching the imp-96849 rms 0.0024 reading.',
  },
  {
    id: 'imp96883-local-exponent-below-1p05-at-reach',
    holds: () => {
      const last = IMP96883_LOCAL_EXPONENT[IMP96883_LOCAL_EXPONENT.length - 1];
      return (
        IMP96883_LOCAL_EXPONENT.length === 9 &&
        last.toN === 8000 &&
        last.exponent < 1.05 &&
        IMP96883_LOCAL_EXPONENT.every((e) => e.exponent > 1.0 && e.exponent < 1.1)
      );
    },
    why: 'the local-exponent-vs-N trace must reach the N=8000 rung below 1.05, staying nowhere near the conjectured quadratic exponent 2, as measured by imp-96849.',
  },
  {
    id: 'imp96883-local-exponent-monotone-decreasing',
    holds: () =>
      IMP96883_LOCAL_EXPONENT.every((e, i) => (i === 0 ? true : e.exponent <= IMP96883_LOCAL_EXPONENT[i - 1].exponent)),
    why: 'the local exponent must keep decreasing across the extended ladder, the wrong direction for an eventual climb toward the quadratic exponent 2.',
  },
  {
    id: 'imp96883-honesty-markers-present',
    holds: () =>
      /RH open/.test(IMP96883_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96883_HONEST_BANNER) &&
      /NO QED/.test(IMP96883_HONEST_BANNER),
    why: 'the viz leaf must carry the RH-open / PT-Lambda / NO-QED honesty markers, matching every sibling finding module.',
  },
];

for (const a of IMP96883_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96883-coprime-core-tn-extended-viz-data assertion failed: ${a.id}`);
  }
}
