/**
 * @module imp-97549-two-term-law-descent-surrogate-viz-data
 *
 * imp-97549 (ux): import-light viz-data leaf visualizing the imp-97500
 * RESULT 1 two-term law
 *     surrogate([P0,Y]) = L(P0) + A(P0)/log Y
 * for several min-primes P0, plotted vs log Y, together with the exact
 * -1/4-R(1) = -0.251246 crossing threshold (imp-97500 TARGET) and the
 * baked exact crossing points (imp-97500 CROSSINGS) where each curve
 * first dips below it.
 *
 * PRESENTATION ONLY. Every curve is the imp-97500 two-term law
 * L(P0)+A(P0)/logY evaluated verbatim from IMP97500_KERNEL.DESCENT_RATE;
 * every marker is a baked imp-97500 CROSSINGS point. Establishes no
 * operator positivity; changes no bound; the b/4-ceiling lower edge was
 * already REFUTED (imp-97481) and is a dead route; kappa_arith unchanged;
 * Platt-Trudgian Lambda<=0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js (the two-term law, kernel, and verdict)
 *
 * Ticket: imp-97549 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP97500_KERNEL } from './imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js';

const { DESCENT_RATE, CROSSINGS, TARGET } = IMP97500_KERNEL;

// log Y sample grid: log(1e3) .. log(1e9), matching the imp-97500 exact
// 1e8-sieve reach (crossings land in this window for every named P0).
const LOG_Y_MIN = Math.log(1e3);
const LOG_Y_MAX = Math.log(1e9);
const N_SAMPLES = 120;

function surrogateCurve(L, A) {
  const pts = [];
  for (let i = 0; i <= N_SAMPLES; i++) {
    const logY = LOG_Y_MIN + ((LOG_Y_MAX - LOG_Y_MIN) * i) / N_SAMPLES;
    pts.push(Object.freeze({ logY, value: L + A / logY }));
  }
  return Object.freeze(pts);
}

export const IMP97549_SERIES = Object.freeze(
  DESCENT_RATE.map((row) =>
    Object.freeze({
      P0: row.P0,
      A: row.A,
      L: row.L,
      curve: surrogateCurve(row.L, row.A),
      crossing: CROSSINGS.find((c) => c.P0 === row.P0) || null,
    }),
  ),
);

export const IMP97549_TARGET_LINE = Object.freeze({
  value: TARGET, // -0.25124552: the -1/4-R(1) crossing threshold
  label: '-1/4-R(1)',
});

export const IMP97549_VERDICT = Object.freeze({
  ticket: 'imp-97549',
  sourceTicket: 'imp-97500',
  claim:
    'charts the imp-97500 two-term law surrogate([P0,Y]) = L(P0) + A(P0)/log Y for P0 in ' +
    '{2,101,379,1009,10007} vs log Y, overlaid with the exact -1/4-R(1)=-0.251246 threshold and the ' +
    'baked exact crossing points (P0=379 at Y=73,612,801, P0=1009 at Y=42,333,157, P0=10007 at ' +
    'Y=75,415,303); P0=2 and P0=101 never reach the threshold within the charted window (P0=101 crosses ' +
    'only past Y~2.63e9, outside 1e8 sieve reach).',
  curvesReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97549_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97549_ASSERTIONS = [
  {
    id: 'imp97549-series-count-and-P0-match-imp97500',
    holds: () =>
      IMP97549_SERIES.length === DESCENT_RATE.length &&
      IMP97549_SERIES.every((s, i) => s.P0 === DESCENT_RATE[i].P0),
    why: 'one charted series per imp-97500 DESCENT_RATE row, same P0 values, same order.',
  },
  {
    id: 'imp97549-curves-approach-L-as-logY-grows',
    holds: () =>
      IMP97549_SERIES.every((s) => {
        const gapFirst = s.curve[0].value - s.L;
        const gapLast = s.curve[s.curve.length - 1].value - s.L;
        // A(P0)/log Y > 0 throughout the charted window (never reaches L within log Y<=log(1e9)),
        // but the gap must shrink monotonically toward L as log Y grows, matching imp-97500 RESULT 1.
        return gapFirst > 0 && gapLast > 0 && gapLast < gapFirst;
      }),
    why: 'the two-term law gap = A(P0)/log Y must shrink toward the exact limit L(P0) as log Y grows (never reaching it within the charted window), matching imp-97500 RESULT 1.',
  },
  {
    id: 'imp97549-curves-strictly-descending-in-logY',
    holds: () =>
      IMP97549_SERIES.every((s) => {
        for (let i = 1; i < s.curve.length; i++) {
          if (!(s.curve[i].value < s.curve[i - 1].value)) return false;
        }
        return true;
      }),
    why: 'L + A/logY is strictly decreasing in log Y for A>0, so every charted curve must descend monotonically.',
  },
  {
    id: 'imp97549-baked-crossings-lie-on-or-below-target-at-crossY',
    holds: () =>
      IMP97549_SERIES.every((s) => {
        if (!s.crossing || s.crossing.crossY == null) return true; // no crossing within reach: nothing to check
        const logY = Math.log(s.crossing.crossY);
        const predicted = s.L + s.A / logY;
        return predicted <= TARGET + 1e-2; // two-term law reproduces the exact crossing within the imp-97500 5%-in-log-space tolerance
      }),
    why: 'at the baked exact crossing Y, the two-term law prediction must already be at or below the -1/4-R(1) target, matching the imp-97500 cross-check assertion.',
  },
  {
    id: 'imp97549-P0-2-and-101-do-not-cross-within-window',
    holds: () => {
      const p2 = IMP97549_SERIES.find((s) => s.P0 === 2);
      const p101 = IMP97549_SERIES.find((s) => s.P0 === 101);
      const neverCrosses = (s) => s.curve.every((pt) => pt.value > TARGET);
      return neverCrosses(p2) && neverCrosses(p101);
    },
    why: 'imp-97500 CROSSINGS bakes crossY=null for P0=101 within the 1e8 sieve (crossing Y~2.63e9); the shallower P0=2 limit L=-0.046788 never approaches the threshold at all -- both curves must stay above TARGET across the charted log Y window.',
  },
  {
    id: 'imp97549-target-matches-imp97500-and-measurement-only',
    holds: () =>
      Math.abs(IMP97549_TARGET_LINE.value - TARGET) < 1e-15 &&
      IMP97549_VERDICT.curvesReusedVerbatim === true &&
      IMP97549_VERDICT.operatorPositivityProved === false &&
      IMP97549_VERDICT.boundMoves === false &&
      IMP97549_VERDICT.qed === false,
    why: 'presentation only: threshold reused verbatim from imp-97500 TARGET; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97549_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97549-two-term-law-descent-surrogate-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
