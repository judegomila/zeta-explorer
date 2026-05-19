/**
 * @fileoverview Gram points numerical data (imp-1122).
 * Precomputes first 1000 Gram points via Newton iteration on theta(g_n) = n*pi,
 * evaluates Z(g_n) at each, checks Gram's law (sgn Z(g_n) = (-1)^n), and
 * counts violations. Also verifies zeros fall in Gram intervals and measures
 * Gram-vs-zero spacing ratios.
 *
 * @module gram-points-numerical
 *
 * Exports:
 *   GRAM_POINTS_DATA       - full precomputed data object
 *   GRAM_POINTS_ASSERTIONS - build-time tripwires (5+)
 *
 * Ticket: imp-1122 (opus-4-6, subscription).
 */

import { riemannSiegelTheta, riemannSiegelZEnhanced, ZETA_ZEROS } from '../math/zeta.js';

const TWO_PI = 2 * Math.PI;

// Newton iteration to solve theta(g_n) = n*pi
function gramPoint(n) {
  if (n < 0) return null;
  let t;
  if (n < 2) {
    t = 17.8;
  } else {
    t = TWO_PI * (n + 0.875) / Math.log(n + 2);
    if (t < 10) t = 10;
  }
  for (let i = 0; i < 100; i++) {
    const F = riemannSiegelTheta(t) - n * Math.PI;
    const Fp = 0.5 * Math.log(t / TWO_PI);
    const dt = -F / Fp;
    t += dt;
    if (Math.abs(dt) < 1e-10) return t;
  }
  return t;
}

// Compute first 1000 Gram points
const N_GRAM = 1000;
const ALL_GRAMS = [];
let violationCount = 0;
const violations = [];

for (let n = 0; n < N_GRAM; n++) {
  const g = gramPoint(n);
  if (g === null || g < 1) continue;
  const Z = riemannSiegelZEnhanced(g);
  const expectedSign = (n % 2 === 0) ? 1 : -1;
  const actualSign = Z > 0 ? 1 : (Z < 0 ? -1 : 0);
  const obeys = actualSign === expectedSign;
  const rec = { n, g: +g.toFixed(6), Z: +Z.toFixed(8), expectedSign, actualSign, obeys };
  ALL_GRAMS.push(rec);
  if (!obeys) {
    violationCount++;
    violations.push(rec);
  }
}

const violationRate = +(violationCount / ALL_GRAMS.length * 100).toFixed(2);

// Spacing analysis: compare Gram spacings vs zero spacings over first 50 points
const SPACING_N = 50;
const gramSpacings = [];
const zeroSpacings = [];
for (let i = 0; i < SPACING_N - 1 && i < ALL_GRAMS.length - 1; i++) {
  gramSpacings.push(+(ALL_GRAMS[i + 1].g - ALL_GRAMS[i].g).toFixed(6));
}
for (let i = 0; i < SPACING_N - 1 && i < ZETA_ZEROS.length - 1; i++) {
  zeroSpacings.push(+(ZETA_ZEROS[i + 1] - ZETA_ZEROS[i]).toFixed(6));
}
const avgGramSpacing = gramSpacings.reduce((a, b) => a + b, 0) / gramSpacings.length;
const avgZeroSpacing = zeroSpacings.reduce((a, b) => a + b, 0) / zeroSpacings.length;
const spacingRatio = +(avgGramSpacing / avgZeroSpacing).toFixed(4);

// Verify zeros fall in Gram intervals: for each known zero, find containing interval
const usableZeros = ZETA_ZEROS.filter(z => z < ALL_GRAMS[ALL_GRAMS.length - 1].g);
let zerosWithInterval = 0;
let emptyIntervals = 0;
let singleIntervals = 0;
let doubleIntervals = 0;
const intervalZeroCounts = {};

for (const gamma of usableZeros) {
  for (let i = 0; i < ALL_GRAMS.length - 1; i++) {
    if (ALL_GRAMS[i].g <= gamma && gamma < ALL_GRAMS[i + 1].g) {
      const idx = ALL_GRAMS[i].n;
      intervalZeroCounts[idx] = (intervalZeroCounts[idx] || 0) + 1;
      zerosWithInterval++;
      break;
    }
  }
}

const lastUsableN = ALL_GRAMS.length > 1
  ? ALL_GRAMS.findIndex(g => g.g > usableZeros[usableZeros.length - 1]) - 1
  : 0;
for (let i = 0; i < Math.min(lastUsableN, ALL_GRAMS.length - 1); i++) {
  const n = ALL_GRAMS[i].n;
  const c = intervalZeroCounts[n] || 0;
  if (c === 0) emptyIntervals++;
  else if (c === 1) singleIntervals++;
  else doubleIntervals++;
}
const totalChecked = emptyIntervals + singleIntervals + doubleIntervals;
const gramLawIntervalPct = totalChecked > 0 ? +(singleIntervals / totalChecked * 100).toFixed(2) : 0;

// First exception at n=126 (classical result, Hutchinson 1925)
const exc126 = ALL_GRAMS.find(g => g.n === 126);

// Bin violations by blocks of 100 for the violation-density chart
const violationBins = [];
for (let start = 0; start < N_GRAM; start += 100) {
  const end = Math.min(start + 100, N_GRAM);
  const block = ALL_GRAMS.filter(g => g.n >= start && g.n < end);
  const viol = block.filter(g => !g.obeys).length;
  violationBins.push({ range: `${start}-${end - 1}`, violations: viol, total: block.length, rate: +(viol / block.length * 100).toFixed(1) });
}

// Sample points for SVG scatter: every 1st point for n < 200, then every 5th
const scatterSample = ALL_GRAMS.filter((g, i) => g.n < 200 || g.n % 5 === 0);

export const GRAM_POINTS_DATA = Object.freeze({
  ticket: "imp-1122",
  method: "Gram points via Newton on theta(g_n) = n*pi, Gram law check via Z(g_n)",
  totalComputed: ALL_GRAMS.length,
  totalViolations: violationCount,
  violationRate,
  firstException: exc126 || null,
  violationBins,
  scatterSample,
  allGrams: ALL_GRAMS,
  violations,
  spacing: Object.freeze({
    avgGramSpacing: +avgGramSpacing.toFixed(4),
    avgZeroSpacing: +avgZeroSpacing.toFixed(4),
    ratio: spacingRatio,
  }),
  intervalAnalysis: Object.freeze({
    zerosChecked: zerosWithInterval,
    totalIntervals: totalChecked,
    empty: emptyIntervals,
    single: singleIntervals,
    double: doubleIntervals,
    gramLawIntervalPct,
  }),
});

export const GRAM_POINTS_ASSERTIONS = [
  {
    id: "gram-1000-points-computed",
    holds: () => ALL_GRAMS.length >= 990,
    why:
      "Newton iteration must converge for at least 990 of the first 1000 Gram points. " +
      "Failure indicates a bug in the initial guess or theta function.",
  },
  {
    id: "gram-violation-rate-15-to-40-pct",
    holds: () => violationRate >= 15 && violationRate <= 40,
    why:
      "Classical result: Gram law violation rate is roughly 27% in this range. " +
      "Rate outside [15%, 40%] signals a sign-check or theta computation bug.",
  },
  {
    id: "gram-first-exception-at-126",
    holds: () => exc126 !== null && !exc126.obeys,
    why:
      "Hutchinson 1925: the first Gram exception is at n=126. " +
      "If g_126 obeys Gram's law, the sign check is broken.",
  },
  {
    id: "gram-spacing-ratio-near-unity",
    holds: () => spacingRatio > 0.7 && spacingRatio < 1.5,
    why:
      "Gram spacings are asymptotically equal to zero spacings: " +
      "2*pi / log(g_n/(2*pi)). The ratio of averages should be near 1.",
  },
  {
    id: "gram-interval-analysis-nontrivial",
    holds: () => totalChecked > 50 && gramLawIntervalPct > 50,
    why:
      "Most Gram intervals should contain exactly one zero. " +
      "A majority (>50%) of intervals with exactly 1 zero is the expected pattern.",
  },
  {
    id: "gram-monotonicity",
    holds: () => {
      for (let i = 1; i < ALL_GRAMS.length; i++) {
        if (ALL_GRAMS[i].g <= ALL_GRAMS[i - 1].g) return false;
      }
      return true;
    },
    why:
      "Gram points g_n are strictly increasing: theta is strictly increasing for t > 7, " +
      "so the sequence g_0 < g_1 < ... must be monotone.",
  },
];
