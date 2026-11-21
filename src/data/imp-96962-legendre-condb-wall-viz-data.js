/**
 * @module imp-96962-legendre-condb-wall-viz-data
 *
 * imp-96962 (ux): import-light viz-data leaf for the imp-96932 matched-N
 * Legendre-vs-Gegenbauer condB ladder and the N=112->124 double-precision wall.
 *
 * imp-96932 tabulated, per N in {76,88,100,112,124} at 2a=ln3, the Legendre
 * Gram condition number condB, its smallest eigenvalue minEigB, the raw
 * LAPACK generalized-eig floor lamRaw, the Loewdin-reorthonormalized floor
 * lamReortho, the trusted condB=1 Gegenbauer floor lamGegen, and the matched-N
 * disagreement rawGegenAbs -- but left the table as an object-literal array
 * with no chart-ready log-scale series. This leaf imports IMP96932_LADDER
 * verbatim (no transcription) and reshapes it into an N-indexed series with
 * log10 coordinates for condB and minEigB, suitable for a log-log condition-
 * number-vs-N chart with the N=112->124 double-precision wall marked.
 *
 * PRESENTATION ONLY. Changes no bound; establishes no operator positivity;
 * the Rayleigh floor stays an UPPER-bound measurement, not a certificate;
 * interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96932-krein-ln3-legendre-recondition-assessment.js (source table, reused verbatim)
 * @see imp-96894-krein-ln3-legendre-gegenbauer-crossbasis.js (original N=76-capped cross-check)
 * @see imp-96961-bessel-onset-mass-tail-residual-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96962 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96932_TWO_A,
  IMP96932_LADDER,
  IMP96932_RAW_MATCHED_NMAX,
  IMP96932_RAW_MATCHED_TOL,
  IMP96932_CORRUPTION_NMAX,
  IMP96932_VERDICT,
} from './imp-96932-krein-ln3-legendre-recondition-assessment.js';

// chart-ready per-N series: x = log10(N), log-scale conditioning pair, linear floor pair.
export const IMP96962_CONDB_SERIES = Object.freeze(
  IMP96932_LADDER.map((r) => ({
    N: r.N,
    log10N: +Math.log10(r.N).toFixed(4),
    log10CondB: +Math.log10(r.condB).toFixed(4),
    log10MinEigB: +Math.log10(r.minEigB).toFixed(4),
    lamRaw: r.lamRaw,
    lamReortho: r.lamReortho,
    lamGegen: r.lamGegen,
    rawGegenAbs: r.rawGegenAbs,
    log10RawGegenAbs: +Math.log10(r.rawGegenAbs).toFixed(4),
    pastDoublePrecisionWall: r.N > IMP96932_RAW_MATCHED_NMAX,
  })),
);

export const IMP96962_TWO_A = IMP96932_TWO_A;
export const IMP96962_RAW_MATCHED_NMAX = IMP96932_RAW_MATCHED_NMAX;
export const IMP96962_RAW_MATCHED_TOL = IMP96932_RAW_MATCHED_TOL;
export const IMP96962_CORRUPTION_NMAX = IMP96932_CORRUPTION_NMAX;

export const IMP96962_HONEST_BANNER =
  'Presentation only: the raw LAPACK generalized-eig Legendre floor tracks the condB=1 Gegenbauer ' +
  'tail to <=3.6e-5 through N=112 with no reconditioning, extending the matched-N cross-check three ' +
  'rungs past the prior N=76 cap; the true double-precision wall for this matched comparison sits ' +
  'between N=112 and N=124 (condB crosses 1/eps, drift jumps to 1.42e-3), not at N=76. No operator ' +
  'positivity established; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed' +
  '; RH open; NO QED.';

// plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
// leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page). Checked
// by scripts/run-assertions.mjs via the IMP96962_ASSERTIONS array below, not at import time.
export const IMP96962_VALIDATION = Object.freeze({
  fiveRungsPresent: IMP96962_CONDB_SERIES.length === 5,
  log10NMonotoneIncreasing: IMP96962_CONDB_SERIES.every(
    (row, i) => i === 0 || row.log10N > IMP96962_CONDB_SERIES[i - 1].log10N,
  ),
  condBMonotoneIncreasing: IMP96962_CONDB_SERIES.every(
    (row, i) => i === 0 || row.log10CondB > IMP96962_CONDB_SERIES[i - 1].log10CondB,
  ),
  wallMarkedAtN124Only: IMP96962_CONDB_SERIES.filter((row) => row.pastDoublePrecisionWall).every(
    (row) => row.N === 124,
  ) && IMP96962_CONDB_SERIES.some((row) => row.pastDoublePrecisionWall),
  matchedThroughN112: IMP96962_CONDB_SERIES.filter((row) => row.N <= 112).every(
    (row) => row.rawGegenAbs <= IMP96962_RAW_MATCHED_TOL,
  ),
  n124Corrupts: IMP96962_CONDB_SERIES.find((row) => row.N === IMP96962_CORRUPTION_NMAX).rawGegenAbs > 1e-3,
  matchesSourceVerdict:
    IMP96932_VERDICT.operatorPositivityProved === false &&
    IMP96932_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
    IMP96932_VERDICT.qed === false,
  honestBannerPresent:
    /RH open/.test(IMP96962_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96962_HONEST_BANNER) &&
    /NO QED/.test(IMP96962_HONEST_BANNER),
});

// registers the IMP96962_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP96962_ASSERTIONS = [
  {
    id: 'imp96962-five-rungs-present',
    description: 'all five N rungs (76/88/100/112/124) are reshaped into a chart-ready series',
    holds: () => IMP96962_VALIDATION.fiveRungsPresent,
  },
  {
    id: 'imp96962-log10n-monotone-increasing',
    description: 'log10(N) increases monotonically across the series',
    holds: () => IMP96962_VALIDATION.log10NMonotoneIncreasing,
  },
  {
    id: 'imp96962-condb-monotone-increasing',
    description: 'log10(condB) increases monotonically across the series',
    holds: () => IMP96962_VALIDATION.condBMonotoneIncreasing,
  },
  {
    id: 'imp96962-wall-marked-at-n124-only',
    description: 'the double-precision wall flag is set exactly at N=124, matching the source corruption rung',
    holds: () => IMP96962_VALIDATION.wallMarkedAtN124Only,
  },
  {
    id: 'imp96962-matched-through-n112',
    description: 'every rung N<=112 stays within the raw-matched tolerance (<=3.6e-5)',
    holds: () => IMP96962_VALIDATION.matchedThroughN112,
  },
  {
    id: 'imp96962-n124-corrupts',
    description: 'N=124 drifts more than 1e-3 above the trusted Gegenbauer floor, confirming the wall',
    holds: () => IMP96962_VALIDATION.n124Corrupts,
  },
  {
    id: 'imp96962-matches-source-verdict',
    description: 'the leaf agrees with the imp-96932 source verdict (no operator positivity, reach unchanged at 2a<=0.96, no QED)',
    holds: () => IMP96962_VALIDATION.matchesSourceVerdict,
  },
  {
    id: 'imp96962-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP96962_VALIDATION.honestBannerPresent,
  },
];
