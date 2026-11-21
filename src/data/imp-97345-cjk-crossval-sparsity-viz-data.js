/**
 * @module imp-97345-cjk-crossval-sparsity-viz-data
 *
 * imp-97345 (ux): import-light viz-data leaf for the imp-97313 c_jk Gegenbauer-Legendre overlap
 * sparsity pattern { j+k even AND k <= j+6 } (2850 nonzero of the 100x106 matrix). imp-97313
 * INDEPENDENTLY confirmed the imp-97293 exact BigInt-rational support rule via a completely
 * distinct float64 path (pointwise Gegenbauer/Legendre recurrence + n=160 Gauss-Legendre
 * quadrature) but shipped only raw exports, no chart-ready cross-validation surface.
 *
 * Reuses imp-97313's and imp-97293's exported constants verbatim (no re-derivation of any
 * overlap integral, no quadrature, no BigInt-rational arithmetic here):
 *   - IMP97313_ANCHOR_CROSSVAL: per-anchor { exact, exactFloat, quad, relerr }.
 *   - IMP97313_WORST_ANCHOR_RELERR, IMP97313_CENSUS, IMP97313_PARAMS.
 *   - IMP97293_SPARSITY: the exact BigInt-rational census being cross-checked against.
 *
 * THREE CHART-READY SURFACES.
 *   1. ANCHOR_RELERR_TABLE -- every anchor's relative error on a log10 scale, sorted by
 *      integrand degree j+k, so a chart can show the error stays flat (~1e-14) even as the
 *      degree climbs toward the top band edge (j+k up to 204).
 *   2. SEPARATION_BARS -- the three-way log10 magnitude gap that makes the 1e-6 sparsity
 *      threshold unambiguous: smallest true-nonzero |c_jk| (1.07e-2) vs the threshold (1e-6)
 *      vs the largest spurious true-zero residual (1.74e-9) -- a clean ~7-order corridor.
 *   3. CENSUS_CROSSCHECK -- the four census counts (nonzero / parity-zero / band-zero / total)
 *      compared side by side between the imp-97293 exact-rational sweep and the imp-97313
 *      independent float-quadrature sweep, with an exact-match flag per row.
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no operator positivity, no RH
 * claim; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97313-krein-cjk-gauss-legendre-crossval.js (source: independent anchor/census cross-validation)
 * @see imp-97293-krein-committed-cjk-gegenbauer-overlap.js (source: exact BigInt-rational census)
 * @see imp-97316-committed-cjk-sparsity-band-viz-data.js (sibling viz: the imp-97293 per-row band shape itself)
 *
 * Ticket: imp-97345 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: imports only the small frozen constants from imp-97313 and imp-97293 (no sibling
 * zeros-bundle imports, no re-execution of any quadrature or BigInt-rational sweep).
 */

import {
  IMP97313_ANCHOR_CROSSVAL,
  IMP97313_WORST_ANCHOR_RELERR,
  IMP97313_CENSUS,
  IMP97313_PARAMS,
} from './imp-97313-krein-cjk-gauss-legendre-crossval.js';
import { IMP97293_SPARSITY } from './imp-97293-krein-committed-cjk-gegenbauer-overlap.js';

const log10 = (x) => Math.log(Math.abs(x)) / Math.LN10;

// Surface 1: per-anchor relative error, sorted by integrand degree j+k.
export const IMP97345_ANCHOR_RELERR_TABLE = Object.freeze(
  Object.entries(IMP97313_ANCHOR_CROSSVAL)
    .map(([key, entry]) => {
      const [j, k] = key.split(',').map(Number);
      return Object.freeze({
        j,
        k,
        degree: j + k,
        exactFloat: entry.exactFloat,
        quad: entry.quad,
        relerr: entry.relerr,
        log10Relerr: entry.relerr > 0 ? log10(entry.relerr) : -Infinity,
      });
    })
    .sort((a, b) => a.degree - b.degree),
);

// Surface 2: the three-way log10 magnitude corridor that makes the 1e-6 threshold unambiguous.
export const IMP97345_SEPARATION_BARS = Object.freeze([
  Object.freeze({
    label: 'smallest true-nonzero |c_jk|',
    value: IMP97313_CENSUS.smallestTrueNonzeroMagnitude,
    log10Value: log10(IMP97313_CENSUS.smallestTrueNonzeroMagnitude),
  }),
  Object.freeze({
    label: 'sparsity threshold',
    value: IMP97313_CENSUS.threshold,
    log10Value: log10(IMP97313_CENSUS.threshold),
  }),
  Object.freeze({
    label: 'largest spurious true-zero residual',
    value: IMP97313_CENSUS.largestSpuriousZeroResidual,
    log10Value: log10(IMP97313_CENSUS.largestSpuriousZeroResidual),
  }),
]);

// Surface 3: census cross-check between the two independent evaluation paths.
export const IMP97345_CENSUS_CROSSCHECK = Object.freeze(
  ['nonzero', 'zeroByParity', 'zeroByDegreeBand', 'total'].map((metric) => {
    const exactRational = IMP97293_SPARSITY[metric];
    const independentFloat = IMP97313_CENSUS[metric];
    return Object.freeze({
      metric,
      exactRational,
      independentFloat,
      match: exactRational === independentFloat,
    });
  }),
);

export const IMP97345_SUMMARY = Object.freeze({
  rows: IMP97313_PARAMS.N,
  cols: IMP97313_PARAMS.Kmax + 1,
  supportRule: 'j+k even AND k <= j+6',
  worstAnchorRelerr: IMP97313_WORST_ANCHOR_RELERR,
  anchorCount: IMP97345_ANCHOR_RELERR_TABLE.length,
  maxAnchorDegree: IMP97345_ANCHOR_RELERR_TABLE[IMP97345_ANCHOR_RELERR_TABLE.length - 1].degree,
  separationOrders: IMP97313_CENSUS.separationOrders,
  censusMismatches: IMP97313_CENSUS.mismatchesVsExactSupport,
});

export const IMP97345_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every value here is copied ' +
  'verbatim from the imp-97313 independent Gauss-Legendre cross-validation and the imp-97293 exact ' +
  'BigInt-rational census (no re-derivation of any overlap integral or quadrature). Changes no bound.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97345_ASSERTIONS = [
  {
    id: 'imp97345-anchor-table-sorted-and-nonempty',
    holds: () =>
      IMP97345_ANCHOR_RELERR_TABLE.length > 0 &&
      IMP97345_ANCHOR_RELERR_TABLE.every(
        (r, i) => i === 0 || r.degree >= IMP97345_ANCHOR_RELERR_TABLE[i - 1].degree,
      ),
    why: 'the anchor cross-validation table must be non-empty and sorted by ascending integrand degree j+k for a monotone x-axis chart.',
  },
  {
    id: 'imp97345-anchor-relerrs-all-tiny',
    holds: () =>
      IMP97345_ANCHOR_RELERR_TABLE.every((r) => r.relerr < 1e-12) &&
      IMP97345_SUMMARY.worstAnchorRelerr < 1e-12,
    why: 'imp-97313 measured every anchor relative error <= 1.9e-14, well within the 1e-12 float slack; this must survive the reshape unchanged.',
  },
  {
    id: 'imp97345-separation-bars-strictly-ordered',
    holds: () =>
      IMP97345_SEPARATION_BARS.length === 3 &&
      IMP97345_SEPARATION_BARS[2].value < IMP97345_SEPARATION_BARS[1].value &&
      IMP97345_SEPARATION_BARS[1].value < IMP97345_SEPARATION_BARS[0].value,
    why: 'the corridor must be strictly ordered: largest spurious residual (1.74e-9) < threshold (1e-6) < smallest true nonzero (1.07e-2), the ~7-order gap that makes the sparsity threshold unambiguous.',
  },
  {
    id: 'imp97345-census-crosscheck-all-match',
    holds: () =>
      IMP97345_CENSUS_CROSSCHECK.length === 4 &&
      IMP97345_CENSUS_CROSSCHECK.every((r) => r.match === true) &&
      IMP97345_CENSUS_CROSSCHECK.find((r) => r.metric === 'nonzero').exactRational === 2850,
    why: 'the exact BigInt-rational census (imp-97293) and the independent float-quadrature census (imp-97313) must agree on all four counts, including the headline 2850 nonzero.',
  },
  {
    id: 'imp97345-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97345_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97345_HONEST_BANNER) &&
      /NO QED/.test(IMP97345_HONEST_BANNER),
    why: 'every Krein-route viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97345_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97345-cjk-crossval-sparsity-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  anchorRelerrTable: IMP97345_ANCHOR_RELERR_TABLE,
  separationBars: IMP97345_SEPARATION_BARS,
  censusCrosscheck: IMP97345_CENSUS_CROSSCHECK,
  summary: IMP97345_SUMMARY,
  banner: IMP97345_HONEST_BANNER,
};
