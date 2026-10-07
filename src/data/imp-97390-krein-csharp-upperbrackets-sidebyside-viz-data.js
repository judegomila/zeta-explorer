/**
 * @module imp-97390-krein-csharp-upperbrackets-sidebyside-viz-data
 *
 * imp-97390 (ux): import-light viz-data leaf for the imp-97355 side-by-side
 * reconciliation of the two independent Krein c_sharp = lambda_min(P_a M_sigma2 P_a)
 * upper-bracket extrapolations at the binding 2a=ln3 rung:
 *
 *   (B) imp-97335: fixed-N=100 rising T-sweep {800,1200,1600,2000,2800} extrapolated
 *       via a near-exact 1/T^2 law to a measured T->infinity limit L=0.5822.
 *   (C) imp-97206: the coupled 6x4 N,T grid extrapolated with the two-stage order
 *       (inner T->inf per N, then outer N->inf) to a flat plateau 0.581687 +/- 0.000590,
 *       joint range [0.5817, 0.5842].
 *
 * This module reshapes those literals (imported directly, no transcription) into a
 * chart-ready T-sweep series plus a three-bar side-by-side comparison of the two
 * brackets against the coupled joint-range band.
 *
 * PRESENTATION ONLY. Both figures are Rayleigh-Ritz UPPER bounds, not a certified
 * floor; no operator positivity established; changes no bound; interval-rigorous
 * certificate reach stays 2a<=0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA;
 * RH open; NO QED.
 *
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (fixed-N=100 T-limit ~0.5822)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T plateau ~0.5817)
 * @see imp-97355-krein-csharp-tlimit-vs-coupled-crossval.js (the reconciliation this leaf visualizes)
 *
 * Ticket: imp-97390 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97335_TSWEEP_SOURCE,
  IMP97335_TLIMIT_EXTRAP,
} from './imp-97335-krein-csharp-naive-lowerbound-tlimit.js';

import {
  IMP97206_JOINT_INTERVAL,
  IMP97206_PLATEAU_MEAN,
  IMP97206_PLATEAU_STD,
} from './imp-97206-krein-csharp-coupled-nt-jointlimit.js';

import {
  IMP97355_TIGHTER_BRACKET,
  IMP97355_RECONCILIATION,
} from './imp-97355-krein-csharp-tlimit-vs-coupled-crossval.js';

// Chart-ready T-sweep series (imp-97335, fixed N=100), plus the extrapolated T->inf limit.
export const IMP97390_TSWEEP_SERIES = Object.freeze(
  IMP97335_TSWEEP_SOURCE.map((row) => Object.freeze({ T: row.T, lamMin: row.lamMin })),
);
export const IMP97390_TSWEEP_LIMIT = IMP97335_TLIMIT_EXTRAP.bestFitL; // 0.5822

// Three-bar side-by-side comparison of the two measured upper brackets, plus the
// coupled joint-range band both are checked against.
export const IMP97390_BRACKET_BARS = Object.freeze([
  Object.freeze({
    key: 'imp97335',
    label: 'imp-97335: fixed-N=100 T→∞ limit',
    value: IMP97335_TLIMIT_EXTRAP.bestFitL, // 0.5822
    color: '#facc15',
  }),
  Object.freeze({
    key: 'imp97206-inner',
    label: 'imp-97206: coupled inner N=100',
    value: IMP97355_RECONCILIATION.imp97206Value, // 0.581059
    color: '#4ade80',
  }),
  Object.freeze({
    key: 'imp97206-plateau',
    label: 'imp-97206: coupled plateau mean',
    value: IMP97206_PLATEAU_MEAN, // 0.581687
    color: '#38bdf8',
  }),
]);

export const IMP97390_JOINT_BAND = Object.freeze({
  lo: IMP97206_JOINT_INTERVAL[0], // 0.5817
  hi: IMP97206_JOINT_INTERVAL[1], // 0.5842
});

export const IMP97390_PLATEAU_STD = IMP97206_PLATEAU_STD;

export const IMP97390_TIGHTEST_BRACKET = Object.freeze({
  value: IMP97355_TIGHTER_BRACKET.bestMeasuredUpperBracket, // 0.581059
  tighterRun: IMP97355_TIGHTER_BRACKET.tighterRun, // 'imp-97206'
});

export const IMP97390_HONEST_BANNER =
  'Measurement only: both bars are Rayleigh-Ritz UPPER bounds on c_sharp = lambda_min(P_a M_sigma2 P_a) ' +
  'at 2a=ln3, not a certified floor. No operator positivity established; changes no bound; ' +
  'interval-rigorous certificate reach stays 2a<=0.96; RH open; PT Lambda <= 0.2 remains SOTA; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97390_ASSERTIONS = [
  {
    id: 'imp97390-tsweep-series-five-rungs-rising',
    holds: () =>
      IMP97390_TSWEEP_SERIES.length === 5 &&
      IMP97390_TSWEEP_SERIES.every((r, i) => i === 0 || r.lamMin > IMP97390_TSWEEP_SERIES[i - 1].lamMin) &&
      IMP97390_TSWEEP_LIMIT > IMP97390_TSWEEP_SERIES[IMP97390_TSWEEP_SERIES.length - 1].lamMin,
    why: 'the imp-97335 fixed-N=100 T-sweep must carry all five rungs (800..2800), rising monotonically, below the extrapolated T->inf limit 0.5822.',
  },
  {
    id: 'imp97390-three-bars-inside-or-near-joint-band',
    holds: () => {
      const B = IMP97390_BRACKET_BARS;
      const band = IMP97390_JOINT_BAND;
      // The imp-97206 band edges are stored to 4 decimals (lo 0.5817 IS the
      // plateau mean 0.581687 rounded), so membership is checked up to that
      // storage rounding (5e-5); an exact >= against the rounded edge fails.
      const ROUND = 5e-5;
      const inBand = (v) => v >= band.lo - ROUND && v <= band.hi + ROUND;
      return B.length === 3 && B.every((b) => typeof b.value === 'number' && b.value > 0.55 && b.value < 0.6) &&
        inBand(B[0].value) && B[1].value < band.hi && inBand(B[2].value);
    },
    why: 'all three measured upper-bracket bars must sit in the ~0.58 range, with the imp-97335 T-limit and coupled plateau mean falling inside the imp-97206 joint range [0.5817,0.5842].',
  },
  {
    id: 'imp97390-tightest-bracket-is-coupled-inner',
    holds: () =>
      IMP97390_TIGHTEST_BRACKET.tighterRun === 'imp-97206' &&
      Math.abs(IMP97390_TIGHTEST_BRACKET.value - 0.581059) < 1e-6 &&
      IMP97390_TIGHTEST_BRACKET.value < IMP97390_TSWEEP_LIMIT,
    why: 'the coupled inner N=100 reading (0.581059) is the tighter (lower) of the two measured Rayleigh-Ritz upper brackets, per the imp-97355 reconciliation.',
  },
  {
    id: 'imp97390-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97390_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97390_HONEST_BANNER) &&
      /NO QED/.test(IMP97390_HONEST_BANNER),
    why: 'every Route I viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97390_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97390-krein-csharp-upperbrackets-sidebyside-viz-data assertion failed: ${a.id}`);
  }
}
