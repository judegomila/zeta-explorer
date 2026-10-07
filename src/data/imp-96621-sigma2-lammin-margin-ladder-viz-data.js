/**
 * @module imp-96621-sigma2-lammin-margin-ladder-viz-data
 *
 * imp-96621 (ux): import-light viz-data leaf for the
 * rh-route-i-toeplitz-krein-certificate-2026-09-24 margin tables. Reshapes
 * two baked ladders into chart-ready series:
 *   (1) lambda_min(T_a[sigma_2]) vs support 2a, from a = 0.45 up to 0.58 --
 *       positive and falling through the theorem range (2a <= 0.96), still
 *       positive at (ln 3)/2 (0.552), crossing zero between 2a = 1.12 and
 *       1.1316 (the p = 2-only crossing of the sibling pencil module);
 *   (2) lambda_min(T_a[sigma_1]) (the CC Q-trick / half-pole-free symbol) vs
 *       2a, from a = 0.45 to 0.54 -- positive and falling by two orders of
 *       magnitude, then at exactly (ln 3)/2 the raw t-cutoff spread straddles
 *       zero (tcut300 -1.15e-4, tcut800 +1.4e-4); the module's tail-inclusive
 *       recompute (imp-96607) resolves the sign positive (+2.11e-4), so the
 *       point is plotted as a resolved-positive value with its superseded
 *       raw straddle shown as an error bar.
 *
 * PRESENTATION ONLY. Every number here is reused verbatim from
 * TOEPLITZ_KREIN_LITERALS (rh-route-i-toeplitz-krein-certificate-2026-09-24.js);
 * only the ladder reshape and the zero-crossing bracket are new. Changes no
 * bound, establishes no new positivity result, no RH claim; Platt-Trudgian
 * Lambda <= 0.2 remains SOTA. RH open. NO QED.
 *
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source measurement)
 *
 * Ticket: imp-96621 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only imports the Route I Toeplitz/Krein certificate module,
 * which is itself import-light (no zeros bundle).
 */

import { TOEPLITZ_KREIN_LITERALS } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3);
const LN3_HALF = LN3 / 2;

// --- sigma_2 ladder: lambda_min(T_a[sigma_2]) vs 2a (N = 36 tightest Rayleigh-Ritz estimate) ---
const S2 = TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2;
const SIGMA2_A_VALUES = [
  { a: 0.45, key: 'a045' },
  { a: 0.5, key: 'a050' },
  { a: 0.52, key: 'a052' },
  { a: 0.54, key: 'a054' },
  { a: LN3_HALF, key: 'aLn3Half' },
  { a: 0.555, key: 'a0555' },
  { a: 0.56, key: 'a056' },
  { a: 0.5658, key: 'a05658' },
  { a: 0.58, key: 'a058' },
];

export const IMP96621_SIGMA2_LADDER = Object.freeze(
  SIGMA2_A_VALUES.map(({ a, key }) => {
    const row = S2[key];
    return Object.freeze({ a, twoA: 2 * a, lambdaMinN20: row[0], lambdaMinN28: row[1], lambdaMinN36: row[2] });
  }),
);

// zero crossing bracket: last positive rung (a056, 2a=1.12) to first negative rung (a05658, 2a=1.1316)
export const IMP96621_SIGMA2_CROSSING = Object.freeze({
  lastPositive: { twoA: 1.12, lambdaMin: S2.a056[2] },
  firstNegative: { twoA: 1.1316, lambdaMin: S2.a05658[2] },
  reportedCrossingTwoA: 1.1316,
});

// --- sigma_1 (CC Q-trick, half-pole-free) ladder: lambda_min(T_a[sigma_1]) vs 2a ---
const S1 = TOEPLITZ_KREIN_LITERALS.lambdaMinSigma1Full;
const SIGMA1_RESOLVED = [
  { a: 0.45, lambdaMin: S1.a045 },
  { a: 0.46, lambdaMin: S1.a046 },
  { a: 0.47, lambdaMin: S1.a047 },
  { a: 0.48, lambdaMin: S1.a048 },
  { a: 0.5, lambdaMin: S1.a050 },
  { a: 0.52, lambdaMin: S1.a052 },
  { a: 0.54, lambdaMin: S1.a054 },
];

export const IMP96621_SIGMA1_LADDER = Object.freeze(
  SIGMA1_RESOLVED.map(({ a, lambdaMin }) => Object.freeze({ a, twoA: 2 * a, lambdaMin, ambiguous: false })),
);

export const IMP96621_SIGMA1_AMBIGUOUS_POINT = Object.freeze({
  a: LN3_HALF,
  twoA: LN3,
  rawTcut300: S1.aLn3Half.tcut300,
  rawTcut800: S1.aLn3Half.tcut800,
  resolvedConverged: S1.aLn3Half.converged,
  resolvedSign: S1.aLn3Half.sign,
  note: S1.aLn3Half.note,
});

export const IMP96621_HONEST_BANNER =
  'Every value is reused verbatim from the imp-96609/96607 rh-route-i-toeplitz-krein-certificate-2026-09-24 tables. ' +
  'The sigma_2 zero crossing (2a between 1.12 and 1.1316) sits far past the interval-verified theorem range ' +
  '2a <= 0.96 and is a floating-point Rayleigh-Ritz measurement, not a proof of failure past that point. ' +
  'RH open; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96621_ASSERTIONS = [
  {
    id: 'imp96621-sigma2-nine-rungs-present',
    holds: () => IMP96621_SIGMA2_LADDER.length === 9,
    why: 'the baked lambdaMinSigma2 table has nine support rungs from a=0.45 to a=0.58.',
  },
  {
    id: 'imp96621-sigma2-decreasing-and-sign-flips',
    holds: () =>
      IMP96621_SIGMA2_LADDER.every((row, i) => i === 0 || row.lambdaMinN36 < IMP96621_SIGMA2_LADDER[i - 1].lambdaMinN36) &&
      IMP96621_SIGMA2_LADDER[IMP96621_SIGMA2_LADDER.length - 3].lambdaMinN36 > 0 &&
      IMP96621_SIGMA2_LADDER[IMP96621_SIGMA2_LADDER.length - 2].lambdaMinN36 < 0,
    why: 'lambda_min(T_a[sigma_2]) falls monotonically in a and flips sign between the a056 and a05658 rungs.',
  },
  {
    id: 'imp96621-sigma2-crossing-brackets-theorem-range',
    holds: () =>
      IMP96621_SIGMA2_CROSSING.lastPositive.twoA > 0.96 &&
      IMP96621_SIGMA2_CROSSING.firstNegative.twoA > IMP96621_SIGMA2_CROSSING.lastPositive.twoA &&
      IMP96621_SIGMA2_CROSSING.reportedCrossingTwoA === IMP96621_SIGMA2_CROSSING.firstNegative.twoA,
    why: 'the measured zero crossing (2a in [1.12, 1.1316]) is strictly past the interval-verified theorem range 2a <= 0.96.',
  },
  {
    id: 'imp96621-sigma1-seven-rungs-present-and-positive-decreasing',
    holds: () =>
      IMP96621_SIGMA1_LADDER.length === 7 &&
      IMP96621_SIGMA1_LADDER.every(
        (row, i) => row.lambdaMin > 0 && (i === 0 || row.lambdaMin < IMP96621_SIGMA1_LADDER[i - 1].lambdaMin),
      ),
    why: 'the half-pole-free sigma_1 margin is positive and falls monotonically across a=0.45..0.54.',
  },
  {
    id: 'imp96621-sigma1-ambiguous-point-straddles-zero-but-resolves-positive',
    holds: () =>
      IMP96621_SIGMA1_AMBIGUOUS_POINT.rawTcut300 < 0 &&
      IMP96621_SIGMA1_AMBIGUOUS_POINT.rawTcut800 > 0 &&
      IMP96621_SIGMA1_AMBIGUOUS_POINT.resolvedConverged > 0 &&
      IMP96621_SIGMA1_AMBIGUOUS_POINT.resolvedSign === 'positive' &&
      Math.abs(IMP96621_SIGMA1_AMBIGUOUS_POINT.twoA - LN3) < 1e-9,
    why: 'at exactly (ln 3)/2 the raw finite-cutoff sigma_1 estimates straddle zero, but the tail-inclusive recompute resolves the sign positive.',
  },
  {
    id: 'imp96621-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96621_HONEST_BANNER) &&
      // banner spells the PT marker out as "Platt-Trudgian"; accept both forms
      /(PT|Platt-Trudgian) Lambda <= 0.2/.test(IMP96621_HONEST_BANNER) &&
      /NO QED/.test(IMP96621_HONEST_BANNER),
    why: 'every Route I Toeplitz/Krein viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96621_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96621-sigma2-lammin-margin-ladder-viz-data assertion failed: ${a.id}`);
  }
}
