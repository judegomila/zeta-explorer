/**
 * @module imp-97000-krein-intermediate-rungs-viz-data
 *
 * imp-97000 (ux): import-light viz-data leaf for the imp-96977 Route I
 * intermediate-rung Krein floor ladder (a=0.46..0.49, 2a=0.92..0.98), with
 * the directly-pinned a=0.48 (2a=0.96) certified endpoint highlighted.
 *
 * imp-96977 computed the interval-rigorous Rayleigh floor
 * lambda_min(T_a[sigma_2]) directly at the four intermediate rungs that fill
 * the flanking gap between the tabulated a=0.45/a=0.50 anchors, and pinned
 * the a=0.48 certified-endpoint value (18.636 at N=36) that was previously
 * only flanked (7.743, 56.05). It shipped the rungs as plain nested objects
 * with no chart-ready shape. This leaf imports IMP96977_INTERMEDIATE_RUNGS /
 * IMP96977_N_LADDER / IMP96977_A048_FLOOR_N36 / IMP96977_N36_LADDER_VS_2A
 * verbatim (no transcription) and reshapes them into an N-indexed
 * per-rung series suitable for a small multi-line floor-vs-N chart, plus a
 * single 2a-indexed series for the full refined-grid monotone ladder.
 *
 * PRESENTATION ONLY. Changes no bound; establishes no operator positivity;
 * every tabulated floor is a positive-tail-dropped Rayleigh LOWER bound on
 * the finite-N value and a finite-N UPPER bound on the true infinite-dim
 * lambda_min (sub-gap IMP96977_TRUE_LIMIT_UNSETTLED stays open); the
 * interval-rigorous certificate reach stays exactly 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96977-krein-intermediate-rungs.js (source table, reused verbatim)
 * @see imp-96985-bessel-onset-finer-ladder-viz-data.js (sibling leaf convention)
 */

import {
  IMP96977_N_LADDER,
  IMP96977_INTERMEDIATE_RUNGS,
  IMP96977_A048_FLOOR_N36,
  IMP96977_N36_LADDER_VS_2A,
  IMP96977_LOGLIN_INTERP_A048,
  IMP96977_RITZ_BAND_A096,
  IMP96977_VERDICT,
} from './imp-96977-krein-intermediate-rungs.js';

// chart-ready per-rung, per-N series: one row per (a, N) pair across the four
// intermediate rungs, x = N, y = floor (positive-tail-dropped Rayleigh floor).
export const IMP97000_RUNG_SERIES = Object.freeze(
  Object.entries(IMP96977_INTERMEDIATE_RUNGS).flatMap(([key, rung]) =>
    IMP96977_N_LADDER.map((N, i) =>
      Object.freeze({
        rung: key,
        twoA: rung.twoA,
        N,
        floor: rung.floors[i],
        isCertifiedEndpoint: key === 'a048',
      }),
    ),
  ),
);

// chart-ready full refined-grid (converged N=36) monotone ladder, x = 2a, y = floor.
export const IMP97000_LADDER_VS_2A_SERIES = Object.freeze(
  IMP96977_N36_LADDER_VS_2A.map((row) =>
    Object.freeze({
      twoA: row.twoA,
      floor: row.floor,
      isCertifiedEndpoint: Math.abs(row.twoA - 0.96) < 1e-9,
    }),
  ),
);

export const IMP97000_A048_FLOOR_N36 = IMP96977_A048_FLOOR_N36;
export const IMP97000_LOGLIN_INTERP_A048 = IMP96977_LOGLIN_INTERP_A048;
export const IMP97000_RITZ_BAND_A096 = IMP96977_RITZ_BAND_A096;

export const IMP97000_HONEST_BANNER =
  'Presentation only: the a=0.48 (2a=0.96) certified-endpoint floor is directly PINNED at 18.636 ' +
  '(N=36), above the log-linear interpolation ~17.09 and inside the imp-96938 Ritz band ' +
  '[12.0089,21.0155]. Every tabulated floor is a positive-tail-dropped Rayleigh LOWER bound on the ' +
  'finite-N value and a finite-N UPPER bound on the true infinite-dim lambda_min; sub-gap ' +
  'IMP96977_TRUE_LIMIT_UNSETTLED stays open. No operator positivity established; interval-rigorous ' +
  'certificate reach stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.';

// plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
// leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page). Checked
// by scripts/run-assertions.mjs via the IMP97000_ASSERTIONS array below, not at import time.
export const IMP97000_VALIDATION = Object.freeze({
  twelveRungNPairsPresent: IMP97000_RUNG_SERIES.length === 12,
  everyRungFloorMonotoneDecreasingInN: ['a046', 'a047', 'a048', 'a049'].every((key) => {
    const rows = IMP97000_RUNG_SERIES.filter((r) => r.rung === key);
    return rows.every((row, i) => i === 0 || row.floor < rows[i - 1].floor);
  }),
  a048RowsFlaggedAsCertifiedEndpoint: IMP97000_RUNG_SERIES.filter((r) => r.rung === 'a048').every(
    (r) => r.isCertifiedEndpoint === true,
  ),
  nonA048RowsNotFlagged: IMP97000_RUNG_SERIES.filter((r) => r.rung !== 'a048').every(
    (r) => r.isCertifiedEndpoint === false,
  ),
  sixRefinedGridPointsPresent: IMP97000_LADDER_VS_2A_SERIES.length === 6,
  ladderMonotoneDecreasingIn2a: IMP97000_LADDER_VS_2A_SERIES.every(
    (row, i) => i === 0 || row.floor < IMP97000_LADDER_VS_2A_SERIES[i - 1].floor,
  ),
  exactlyOneCertifiedEndpointInLadder:
    IMP97000_LADDER_VS_2A_SERIES.filter((row) => row.isCertifiedEndpoint).length === 1,
  a048EndpointAboveInterpAndInsideRitzBand:
    IMP97000_A048_FLOOR_N36 > IMP97000_LOGLIN_INTERP_A048 &&
    IMP97000_A048_FLOOR_N36 > IMP97000_RITZ_BAND_A096.lo &&
    IMP97000_A048_FLOOR_N36 < IMP97000_RITZ_BAND_A096.hi,
  matchesSourceVerdict:
    IMP96977_VERDICT.operatorPositivityProved === false &&
    IMP96977_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
    IMP96977_VERDICT.qed === false,
  honestBannerPresent:
    /RH open/.test(IMP97000_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97000_HONEST_BANNER) &&
    /NO QED/.test(IMP97000_HONEST_BANNER),
});

// imp-96397: registers the IMP97000_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP97000_ASSERTIONS = [
  {
    id: 'imp97000-twelve-rung-n-pairs-present',
    description: 'all four intermediate rungs x three N values reshape into 12 chart-ready rows',
    holds: () => IMP97000_VALIDATION.twelveRungNPairsPresent,
  },
  {
    id: 'imp97000-every-rung-floor-monotone-decreasing-in-n',
    description: 'within each rung, the floor decreases monotonically as N grows (Rayleigh upper bound tightens)',
    holds: () => IMP97000_VALIDATION.everyRungFloorMonotoneDecreasingInN,
  },
  {
    id: 'imp97000-a048-rows-flagged-as-certified-endpoint',
    description: 'every a=0.48 row carries the certified-endpoint flag',
    holds: () => IMP97000_VALIDATION.a048RowsFlaggedAsCertifiedEndpoint,
  },
  {
    id: 'imp97000-non-a048-rows-not-flagged',
    description: 'no rung other than a=0.48 is flagged as the certified endpoint',
    holds: () => IMP97000_VALIDATION.nonA048RowsNotFlagged,
  },
  {
    id: 'imp97000-six-refined-grid-points-present',
    description: 'the full refined-grid (2a=0.90..1.00) ladder carries all six points',
    holds: () => IMP97000_VALIDATION.sixRefinedGridPointsPresent,
  },
  {
    id: 'imp97000-ladder-monotone-decreasing-in-2a',
    description: 'the converged N=36 floor strictly decreases as 2a rises across the refined grid',
    holds: () => IMP97000_VALIDATION.ladderMonotoneDecreasingIn2a,
  },
  {
    id: 'imp97000-exactly-one-certified-endpoint-in-ladder',
    description: 'exactly one point on the refined-grid ladder (2a=0.96) is flagged as the certified endpoint',
    holds: () => IMP97000_VALIDATION.exactlyOneCertifiedEndpointInLadder,
  },
  {
    id: 'imp97000-a048-endpoint-above-interp-and-inside-ritz-band',
    description: 'the pinned a=0.48 floor sits above the log-linear interpolation and inside the imp-96938 Ritz band',
    holds: () => IMP97000_VALIDATION.a048EndpointAboveInterpAndInsideRitzBand,
  },
  {
    id: 'imp97000-matches-source-verdict',
    description: 'the leaf agrees with the imp-96977 source verdict (no operator positivity, reach unchanged at 2a<=0.96, no QED)',
    holds: () => IMP97000_VALIDATION.matchesSourceVerdict,
  },
  {
    id: 'imp97000-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP97000_VALIDATION.honestBannerPresent,
  },
];
