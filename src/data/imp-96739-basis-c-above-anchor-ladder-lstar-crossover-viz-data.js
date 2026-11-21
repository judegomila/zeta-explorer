/**
 * @module imp-96739-basis-c-above-anchor-ladder-lstar-crossover-viz-data
 *
 * imp-96739 (ux): import-light viz-data leaf for the imp-96690 basis-C
 * above-anchor floor(L) ladder (five rungs, PT anchor 5.9e6 .. 5e7) and the
 * imp-96712 accelerating-exponent L* corroboration-reach bracket. Both
 * modules have the numbers as JSDoc/literal tables only; this reshapes them
 * into chart-ready arrays: the log-log floor ladder, the imp-96690
 * constant-OLS crossover baseline, the imp-96712 three-model bracket around
 * it, and the earlier imp-96568 two-point projection for scale contrast.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96690
 * / imp-96712 exports; only the log10 reshaping is new. Changes no bound,
 * establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96690-basis-c-above-anchor-rung-ladder.js (the five-rung floor ladder + OLS crossover)
 * @see imp-96712-basis-c-accelerating-exponent-model.js (the three-model L* bracket)
 *
 * Ticket: imp-96739 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96690 and imp-96712 (both
 * themselves import-light, no zeros bundle).
 */

import { IMP96690_BASIS_C_ABOVE_ANCHOR_RUNG_LADDER, IMP96690_HONEST_BANNER } from './imp-96690-basis-c-above-anchor-rung-ladder.js';
import { IMP96712_BASIS_C_ACCELERATING_EXPONENT_MODEL } from './imp-96712-basis-c-accelerating-exponent-model.js';

const { aboveAnchorRungs, ptAnchorL, floorGrowth, crossover } = IMP96690_BASIS_C_ABOVE_ANCHOR_RUNG_LADDER;
const { bracket } = IMP96712_BASIS_C_ACCELERATING_EXPONENT_MODEL;

// The five above-anchor rungs, reshaped to log-log coordinates for the ladder chart.
export const IMP96739_LADDER = Object.freeze(
  aboveAnchorRungs.map((row) => ({
    L: row.L,
    logL: Math.log10(row.L),
    floor: row.floor,
    logFloor: Math.log10(row.floor),
    optPpp: row.optPpp,
  })),
);

// imp-96690's constant-OLS crossover baseline (the projection this ticket's ladder feeds into).
export const IMP96739_OLS_CROSSOVER = Object.freeze({
  L: crossover.extended.L,
  logL: Math.log10(crossover.extended.L),
  exponent: crossover.extended.exponent,
  signal: crossover.extended.signal,
  decadesPastAnchor: crossover.extended.decadesPastAnchor,
});

// imp-96712's three-model accelerating-exponent bracket around the OLS baseline.
export const IMP96739_LSTAR_BRACKET = Object.freeze({
  lo: bracket.lo,
  logLo: Math.log10(bracket.lo),
  hi: bracket.hi,
  logHi: Math.log10(bracket.hi),
  decadesPastAnchorLo: bracket.decadesPastAnchorLo,
  decadesPastAnchorHi: bracket.decadesPastAnchorHi,
  spanFractionOfOls: bracket.spanFractionOfOls,
});

// The earlier imp-96568 two-point projection, for scale contrast against the tightened bracket.
export const IMP96739_OLD_PROJECTION = Object.freeze({
  L: crossover.imp96568Reproduction,
  logL: Math.log10(crossover.imp96568Reproduction),
  exponent: floorGrowth.imp96568TwoPointExponent,
});

export const IMP96739_PT_ANCHOR_L = ptAnchorL;

export const IMP96739_HONEST_BANNER = IMP96690_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96739_ASSERTIONS = [
  {
    id: 'imp96739-ladder-has-five-rungs-monotone-in-L-and-floor',
    holds: () =>
      IMP96739_LADDER.length === 5 &&
      IMP96739_LADDER.every(
        (row, i) => i === 0 || (row.L > IMP96739_LADDER[i - 1].L && row.floor > IMP96739_LADDER[i - 1].floor),
      ),
    why: 'imp-96690 measured exactly five above-anchor rungs (anchor, 1e7, 2e7, 3e7, 5e7), both L and floor strictly increasing.',
  },
  {
    id: 'imp96739-bracket-contains-ols-baseline',
    holds: () =>
      IMP96739_LSTAR_BRACKET.lo < IMP96739_LSTAR_BRACKET.hi &&
      IMP96739_LSTAR_BRACKET.lo <= IMP96739_OLS_CROSSOVER.L &&
      IMP96739_OLS_CROSSOVER.L <= IMP96739_LSTAR_BRACKET.hi,
    why: 'imp-96712 FINDING 1: the imp-96690 constant-OLS crossover (~8.08e7) sits inside the three-model bracket ~[7.6e7,8.2e7].',
  },
  {
    id: 'imp96739-old-projection-well-outside-and-above-the-bracket',
    holds: () => IMP96739_OLD_PROJECTION.L > IMP96739_LSTAR_BRACKET.hi * 2,
    why: 'the imp-96568 two-point projection (~1.9e8) sits well past the imp-96690/96712 tightened bracket, showing the reach contracted by more than one factor of 2.',
  },
  {
    id: 'imp96739-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96739_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96739_HONEST_BANNER) &&
      /NO QED/.test(IMP96739_HONEST_BANNER),
    why: 'every Route I/basis-C viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96739_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96739-basis-c-above-anchor-ladder-lstar-crossover-viz-data assertion failed: ${a.id}`);
  }
}
