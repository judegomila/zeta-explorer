/**
 * @module imp-96782-accelerating-exponent-reach-overlay-viz-data
 *
 * imp-96782 (ux): import-light viz-data leaf for the imp-96712 accelerating
 * local-exponent trajectory (1.81 -> 2.81 -> 2.08 -> 2.65) with the imp-96711
 * single-crossover reach overlay. Both source modules carry this as nested
 * JSDoc tables / object literals only; this reshapes them into two aligned
 * chart-ready series: (1) the four consecutive local exponents against their
 * geometric-midpoint rung length, and (2) the imp-96711 exponent -> L*
 * reach points (p = 1.0 / ~1.81 / ~2.42) plus the imp-96712 +/-6% bracket
 * band, so a reader can see how the trajectory's exponent range maps onto
 * the single-crossover reach curve.
 *
 * PRESENTATION ONLY. Every number here is reused verbatim from the imp-96712
 * and imp-96711 exports; only the flat chart-ready reshape (log10 axes,
 * geometric-midpoint L, point grouping) is new. Changes no bound,
 * establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96712-basis-c-accelerating-exponent-model.js (source: local-exponent trajectory + bracket)
 * @see imp-96711-basis-c-corroboration-reach-cross-tab.js (source: exponent -> L* single-crossover reach)
 *
 * Ticket: imp-96782 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96712 and imp-96711 (both
 * import-light, no zeros bundle, no sibling imports).
 */

import {
  IMP96712_BASIS_C_ACCELERATING_EXPONENT_MODEL,
  IMP96712_HONEST_BANNER,
} from './imp-96712-basis-c-accelerating-exponent-model.js';
import { IMP96711_BASIS_C_CORROBORATION_REACH_CROSS_TAB } from './imp-96711-basis-c-corroboration-reach-cross-tab.js';

const { rungs, localExponents, bracket } = IMP96712_BASIS_C_ACCELERATING_EXPONENT_MODEL;
const { crossTab } = IMP96711_BASIS_C_CORROBORATION_REACH_CROSS_TAB;

// (a) The four consecutive local exponents, each plotted at the geometric-midpoint
// rung length of the two rungs it spans (identical construction to the source module).
export const IMP96782_LOCAL_EXPONENT_SERIES = Object.freeze(
  localExponents.map((p, i) => {
    const fromL = rungs[i].L;
    const toL = rungs[i + 1].L;
    const xMidL = Math.sqrt(fromL * toL);
    return Object.freeze({
      rungIndex: i,
      fromL,
      toL,
      xMidL,
      log10XMidL: Math.log10(xMidL),
      p,
    });
  }),
);

// (b) The imp-96711 exponent -> L* single-crossover reach points, sorted by exponent.
export const IMP96782_REACH_OVERLAY = Object.freeze(
  crossTab
    .map((row) => Object.freeze({
      ticket: row.ticket,
      exponent: row.exponent,
      lstar: row.lstarRederived,
      log10Lstar: Math.log10(row.lstarRederived),
    }))
    .sort((a, b) => a.exponent - b.exponent),
);

// (c) The imp-96712 +/-6% bracket band, for overlay near the OLS exponent (~2.42).
export const IMP96782_BRACKET_BAND = Object.freeze({
  lo: bracket.lo,
  hi: bracket.hi,
  olsBaseline: bracket.imp96690OlsBaseline,
  log10Lo: Math.log10(bracket.lo),
  log10Hi: Math.log10(bracket.hi),
  log10OlsBaseline: Math.log10(bracket.imp96690OlsBaseline),
  decadesPastAnchorLo: bracket.decadesPastAnchorLo,
  decadesPastAnchorHi: bracket.decadesPastAnchorHi,
});

export const IMP96782_HONEST_BANNER = IMP96712_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96782_ASSERTIONS = [
  {
    id: 'imp96782-local-exponent-series-matches-source',
    holds: () =>
      IMP96782_LOCAL_EXPONENT_SERIES.length === localExponents.length &&
      IMP96782_LOCAL_EXPONENT_SERIES.every((r, i) => r.p === localExponents[i] && Number.isFinite(r.log10XMidL)),
    why: 'the local-exponent series must carry every imp-96712 trajectory point (1.81, 2.81, 2.08, 2.65) with a finite log10(L) coordinate.',
  },
  {
    id: 'imp96782-local-exponent-xmid-increasing',
    holds: () =>
      IMP96782_LOCAL_EXPONENT_SERIES.every(
        (r, i) => i === 0 || r.xMidL > IMP96782_LOCAL_EXPONENT_SERIES[i - 1].xMidL,
      ),
    why: 'the geometric-midpoint rung length must be strictly increasing along the trajectory for the log-L axis to be monotone.',
  },
  {
    id: 'imp96782-reach-overlay-has-three-points',
    holds: () => IMP96782_REACH_OVERLAY.length === 3,
    why: 'the single-crossover reach overlay must carry all three imp-96711 exponent -> L* rows (imp-96531/imp-96568/imp-96690).',
  },
  {
    id: 'imp96782-reach-overlay-monotone-decreasing-in-exponent',
    holds: () =>
      IMP96782_REACH_OVERLAY.every(
        (r, i) => i === 0 || r.lstar < IMP96782_REACH_OVERLAY[i - 1].lstar,
      ),
    why: 'L* must be monotone decreasing in the exponent (steeper floor, earlier crossover), per the imp-96711 finding.',
  },
  {
    id: 'imp96782-bracket-band-contains-ols-baseline',
    holds: () =>
      IMP96782_BRACKET_BAND.lo <= IMP96782_BRACKET_BAND.olsBaseline &&
      IMP96782_BRACKET_BAND.olsBaseline <= IMP96782_BRACKET_BAND.hi,
    why: 'the imp-96712 +/-6% bracket band must contain the imp-96690 OLS baseline it brackets.',
  },
  {
    id: 'imp96782-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96782_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96782_HONEST_BANNER) &&
      /NO QED/.test(IMP96782_HONEST_BANNER),
    why: 'every Route I / basis-C corroboration-reach viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96782_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96782-accelerating-exponent-reach-overlay-viz-data assertion failed: ${a.id}`);
  }
}
