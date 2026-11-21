/**
 * @module imp-95971-crossing-height-map-viz-data
 * @fileoverview imp-95971 -- lightweight viz-data module reshaping the imp-95940
 *   crossing-height map T_x(a_0) = 2pi exp(exp(2pi^2 C0 - 2(gamma + 1 + a_0)))
 *   into a chart-ready log10(T_x) vs a_0 grid, spanning the empirical a_0
 *   spread [-0.615, +0.561] recorded by imp-95940. Exposes the three named
 *   anchor points (a_0 min / mean / max) and the d ln T_x / d a_0 ~ -78
 *   double-exponential sensitivity so the ~40-order crossing-height range is
 *   visible as a curve rather than three isolated numbers.
 *
 *   Also plots the six per-height a_0 back-out estimates (imp-95710/imp-95562
 *   measured heights) and a reference line at the imp-95519 window bottom
 *   T=3e12, the verified height this crossing map is meant to be compared
 *   against.
 *
 *   Self-computing from the already-baked imp-95940 closed form and empirical
 *   a_0 rows -- no re-derivation, no fresh measurement, no heavy imports.
 *   Viz data only; changes no bound; NO QED.
 *
 *   @see imp-95940-arithmetic-intercept-a0-obstruction.js (source: a0Rows, a0Empirical, crossingSensitivity, obstruction)
 *   @see imp-95921-c0-offset-approach-analytic-bracket (named sub-gap; slope pinned, intercept not)
 */

import { IMP95940_ARITHMETIC_INTERCEPT_A0_OBSTRUCTION } from './imp-95940-arithmetic-intercept-a0-obstruction.js';
import { IMP95984_FUJII_VARS_CONSTANT_LITERATURE_LOCATE } from './imp-95984-fujii-varS-constant-literature-locate.js';

const { a0Rows, a0Empirical, crossingSensitivity, obstruction, verdict } =
  IMP95940_ARITHMETIC_INTERCEPT_A0_OBSTRUCTION;

const { rigorousBracketRH: IF_RIGOROUS_BRACKET_RH } =
  IMP95984_FUJII_VARS_CONSTANT_LITERATURE_LOCATE.unavailableTerm;

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const PI2 = Math.PI * Math.PI;
const C0 = 0.3337213835371905; // imp-95722 / imp-95921 pinned max accessible offset

const crossingT = (a0) => TWO_PI * Math.exp(Math.exp(2 * PI2 * C0 - 2 * (EULER + 1 + a0)));

// Fine a_0 grid spanning the empirical spread with a small pad on each side,
// so the curve visibly continues past the three measured anchor points.
const PAD = 0.08;
const GRID_POINTS = 33;
const gridLo = a0Empirical.min - PAD;
const gridHi = a0Empirical.max + PAD;

export const IMP95971_CROSSING_HEIGHT_ROWS = Object.freeze(
  Array.from({ length: GRID_POINTS }, (_, i) => {
    const a0 = gridLo + ((gridHi - gridLo) * i) / (GRID_POINTS - 1);
    const Tx = crossingT(a0);
    return Object.freeze({ a0, Tx, log10Tx: Math.log10(Tx) });
  }),
);

export const IMP95971_ANCHORS = Object.freeze([
  Object.freeze({ label: 'a_0 min', a0: a0Empirical.min, Tx: crossingSensitivity.crossingAtMin }),
  Object.freeze({ label: 'a_0 mean', a0: a0Empirical.mean, Tx: crossingSensitivity.crossingAtMean }),
  Object.freeze({ label: 'a_0 max', a0: a0Empirical.max, Tx: crossingSensitivity.crossingAtMax }),
]);

// Per-height a_0 back-out estimates (imp-95710/imp-95562 measured heights),
// each plotted through the SAME closed form for its own T_x(a_0).
export const IMP95971_PER_HEIGHT_ROWS = Object.freeze(
  a0Rows.map((r) => Object.freeze({ Tc: r.Tc, a0: r.a0, Tx: crossingT(r.a0) })),
);

// imp-95519 window-bottom verified height -- the reference this crossing map
// is meant to be compared against (well below every empirical Tx anchor).
export const IMP95971_VERIFIED_HEIGHT = Object.freeze({ T: 3e12, log10T: Math.log10(3e12) });

export const IMP95971_SENSITIVITY = Object.freeze({
  dLnTxDa0: crossingSensitivity.dLnTxDa0, // ~-78
  a0AccuracyForOneDecade: crossingSensitivity.a0AccuracyForOneDecade, // ~0.03
  a0Spread: a0Empirical.spread, // ~1.18, straddles zero
});

export const IMP95971_SUBGAP = obstruction.subGap; // 'imp-95940-subgap-fujii-varS-constant'

export const IMP95971_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-95940 closed form T_x(a_0) over its own ' +
  'measured a_0 range (no re-derivation, no new bound); a_0 is NOT pinned to a point -- the ' +
  'curve visualizes why an unresolved O(1) intercept sweeps the crossing height across ~40 ' +
  `orders of magnitude; imp-95984 identifies this unresolved intercept EXACTLY as the ` +
  `pair-correlation integral I_F, rigorously bracketed only in (${IF_RIGOROUS_BRACKET_RH[0].toFixed(2)}, ` +
  `${IF_RIGOROUS_BRACKET_RH[1]}) under RH -- so the a_0 spread this chart plots is not merely ` +
  'unpinned but has a named, rigorously-wide obstruction; establishes no operator positivity, ' +
  'no RH claim; no refereed bound is changed; NO QED.';

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const rows = IMP95971_CROSSING_HEIGHT_ROWS;
  if (rows.length !== GRID_POINTS) throw new Error('imp-95971: grid row count mismatch');
  // grid must be monotonically increasing in a_0.
  for (let i = 1; i < rows.length; i++) {
    if (!(rows[i].a0 > rows[i - 1].a0)) throw new Error('imp-95971: grid a_0 must be strictly increasing');
  }
  // T_x must be monotonically DECREASING in a_0 (higher intercept -> lower crossing height).
  for (let i = 1; i < rows.length; i++) {
    if (!(rows[i].Tx < rows[i - 1].Tx)) throw new Error('imp-95971: T_x must decrease as a_0 increases');
  }
  // the grid must bracket all three empirical anchors and all six per-height rows.
  for (const a of IMP95971_ANCHORS) {
    if (!(a.a0 >= gridLo && a.a0 <= gridHi)) throw new Error('imp-95971: grid must bracket every anchor a_0');
  }
  for (const r of IMP95971_PER_HEIGHT_ROWS) {
    if (!(r.a0 >= gridLo && r.a0 <= gridHi)) throw new Error('imp-95971: grid must bracket every per-height a_0');
  }
  if (IMP95971_PER_HEIGHT_ROWS.length !== 6) throw new Error('imp-95971: expected six per-height rows');
  // anchors reproduce the imp-95940 closed form to high precision.
  for (const a of IMP95971_ANCHORS) {
    const recomputed = crossingT(a.a0);
    const relErr = Math.abs(recomputed - a.Tx) / a.Tx;
    if (!(relErr < 1e-9)) throw new Error('imp-95971: anchor T_x must reproduce the imp-95940 closed form');
  }
  // the verified-height reference line sits inside the plotted log10(T_x) range.
  const yAll = rows.map((r) => r.log10Tx);
  if (!(IMP95971_VERIFIED_HEIGHT.log10T > Math.min(...yAll) && IMP95971_VERIFIED_HEIGHT.log10T < Math.max(...yAll)))
    throw new Error('imp-95971: verified-height reference must fall inside the plotted range');
  // the grid spans many orders of magnitude in T_x (the double-exponential amplifier).
  const log10Spread = rows[rows.length - 1].log10Tx === rows[0].log10Tx
    ? 0
    : rows[0].log10Tx - rows[rows.length - 1].log10Tx;
  if (!(log10Spread > 20)) throw new Error('imp-95971: log10(T_x) must span tens of orders across the grid');
  // HONESTY gates: no false pin, sub-gap named, no refereed bound is changed.
  if (!/imp-95940-subgap-fujii-varS-constant/.test(IMP95971_SUBGAP))
    throw new Error('imp-95971: sub-gap name dropped');
  if (!/NO QED/.test(verdict)) throw new Error('imp-95971: source verdict dropped the NO QED banner');
  // the banner must cite the imp-95984 I_F identity and its rigorous RH bracket.
  if (!/I_F/.test(IMP95971_CAVEAT_BANNER)) throw new Error('imp-95971: caveat banner dropped the I_F identity citation');
  if (!IMP95971_CAVEAT_BANNER.includes(`(${IF_RIGOROUS_BRACKET_RH[0].toFixed(2)}, ${IF_RIGOROUS_BRACKET_RH[1]})`))
    throw new Error('imp-95971: caveat banner dropped the imp-95984 rigorous I_F bracket');
  if (!/NO QED/.test(IMP95971_CAVEAT_BANNER)) throw new Error('imp-95971: caveat banner dropped NO QED');
  if (!/refereed bound is changed/i.test(IMP95971_CAVEAT_BANNER))
    throw new Error('imp-95971: caveat banner dropped the no-refereed-bound-change banner');
})();
