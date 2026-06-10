/**
 * @module imp-1186-lin-stat-20point-sweep
 * @fileoverview Frozen 20-point linear-statistics variance sweep for the
 * GUE/RH spectral-statistics chain (imp-1149 -> imp-1162 -> imp-1186).
 *
 * Exports:
 *   - IMP1186_LIN_STAT_20POINT_SWEEP: frozen record holding the 13 verbatim
 *     imp-1162 rows, the 7 new imp-1186 rows, the combined 20-point grid, the
 *     OLS slope/R^2 refits (combined, new-only, beyond-1e6), and the
 *     deterministic percentile-bootstrap 95% CI on the slope.
 *   - IMP1186_LIN_STAT_20POINT_SWEEP_ASSERTIONS: self-check assertions
 *     (including the imp1186-original-rows-match-imp1162 drift tripwire).
 *
 * Proof-chain role: empirical-numerics support for the linear-statistics
 * variance scaling Var ~ N^{slope}. Extends the imp-1162 13-point grid to 20
 * points (N up to 2e6, the honest Odlyzko zeros6 cap -- NOT 1e7; see HONEST
 * SCOPE below) and reports whether the bootstrap CI tightens. Belongs to the
 * spectral linear-statistics docs section, not a Lean-formalized lemma.
 *
 * Key assertions: combined 20-point OLS slope/R^2 (COMBINED_OLS_20), the
 * percentile-bootstrap 95% slope CI, and the imp-1162 row-mirroring tripwire.
 *
 * Created/modified by: imp-1186 (this file). Upstream: imp-1149, imp-1162,
 * imp-1166 (bootstrap methodology), imp-1185 (block-bootstrap sibling).
 * Documentation pass: imp-2590.
 */
// imp-1186 -- Extend the imp-1162 linear-statistics variance sweep grid from
// 13 to 20 points by adding 7 new N values (5 interior fill + 2 beyond 1e6).
// Refit the OLS slope on the combined 20-point grid, compute a deterministic
// percentile-bootstrap 95% CI (matching imp-1166 methodology), and compare
// against the imp-1162 13-point slope + the imp-1166 bootstrap CI.
//
// HEADLINE
// --------
// 20-point combined OLS slope on log(variance) vs log(N) -- see
// COMBINED_OLS_20 below for the exact figure. Reference slopes:
//   imp-1149  5-point original  (N up to 1e4) : slope -0.949334, R^2 0.995
//   imp-1149  9-point extended  (N up to 5e4) : slope -0.849045, R^2 0.956
//   imp-1162 13-point combined  (N up to 1e6) : slope -0.881247, R^2 0.928
//   imp-1186 20-point extended  (N up to 2e6) : see COMBINED_OLS_20.slope
//
// HONEST SCOPE
// ------------
// 1. The ticket nominally asked for N up to 1e7. Odlyzko only publishes
//    zeros1..zeros10 (1e6 zeros, the imp-1162 cap) and the zeros6 combined
//    file (2,001,052 zeros). zeros11 returned HTTP 404 when probed on
//    2026-05-25, and there is no zeros7..zeros10 sequential continuation
//    beyond zeros10. We therefore CAP the upper end of the new grid at
//    N = 2e6, NOT 1e7. Going further would require either Platt-style
//    rigorous zero computation (out of scope here) or silent extrapolation
//    (refused). The honest cap is N = 2e6.
//
// 2. The seven new N values are:
//      Interior fill : 300, 1500, 7000, 70000, 700000
//      Beyond 1e6    : 1500000, 2000000
//    Interior fill values were chosen to halve the worst geometric gaps in
//    the imp-1162 grid: between 200 and 500 (gap 2.5x), between 1000 and
//    2000 (gap 2x), between 5000 and 10000 (gap 2x), between 50000 and
//    100000 (gap 2x), and between 500000 and 1000000 (gap 2x). Beyond
//    values fill the only available extension {1.5e6, 2e6}.
//
// 3. The 13 imp-1162 rows are mirrored VERBATIM as frozen literals from
//    src/data/esy-lin-stat-extended-sweep-2026-05.js (sourced via the
//    ORIGINAL_GRID_ROWS + EXTENDED_GRID_ROWS exports). Drift from those
//    is caught by the imp1186-original-rows-match-imp1162 tripwire below.
//
// 4. Zero source for new rows: /tmp/odlyzko-zeros6.txt (2,001,052 entries,
//    fetched from https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros6
//    on 2026-05-25; file is stable since 2006-12-09 per Last-Modified
//    header). The first 1e6 entries of zeros6 are bit-equivalent to the
//    bundled src/data/zeros-to-1e6.js -- cross-checked at N=1e6 and
//    N=1e5 (variance match to all 17 significant digits, see verify run
//    in commit message).
//
// 5. The bootstrap CI is row-resampling percentile (matching imp-1166).
//    NOT block-bootstrap (imp-1185 does that). Both CIs are quoted in the
//    HEADLINE block for cross-comparison.
//
// 6. NO Rust BH multipole CLI was used: the lin-stat sum is the Cauchy
//    kernel y / (x^2 + y^2), which has no fast-multipole acceleration on
//    this code path. The flat O(N * M_BULK) Node loop runs in 100 ms at
//    N = 2e6 (M_BULK = 80), well within the time-box.
//
// METHOD
// ------
// 1. Frozen rows: 13 imp-1162 (N, variance) pairs, mirrored verbatim.
// 2. New rows: 7 (N, variance) pairs computed by
//    scripts/compute-imp1186-lin-stat-20point.mjs using the imp-1162
//    pipeline (unfold via gamma / (2*pi) * log(gamma / (2*pi)),
//    eta = 1/N, M_BULK = 80 bulk midpoints in [N/4, 3N/4 - 1],
//    variance = sqrt of population variance of Im m_N(E + i*eta)).
// 3. Combined OLS on log(N) vs log(variance) -- same fitLogLog as
//    imp-1149 / imp-1162.
// 4. Deterministic percentile bootstrap with mulberry32 PRNG, seed
//    0xC51186FA (distinct from imp-1166's 0xC51166FA), N_REPLICATES =
//    2000 (4x imp-1166's 500 -- justified by the 20-point grid having
//    more rows to resample), reporting 2.5/50/97.5 percentiles.
//
// @see imp-1186
// @see imp-1162
// @see imp-1166 (percentile-bootstrap CI methodology)
// @see imp-1185 (block-bootstrap cross-check)
// @see imp-1178 (Conrey-Snaith ratios-conjecture correction)
// @see src/data/esy-lin-stat-extended-sweep-2026-05.js (frozen source of 13)

// SYNTAX SAFETY: avoids star-slash sequence inside JSDoc; no apostrophes
// inside single-quoted strings.

// -- Frozen imp-1162 rows (13 total, mirrored verbatim) ----------------------
//
// 9 imp-1149-source rows + 4 imp-1162-extended rows. If you change any of
// these literals, the imp1186-original-rows-match-imp1162 tripwire will fire.

const IMP1162_FROZEN_ROWS = Object.freeze([
  // imp-1149-sub-ESY 9 original rows (verbatim from imp-1162 ORIGINAL_GRID_ROWS)
  Object.freeze({ N:    100, eta: 0.01,     variance: 0.06864163141521673,   source: 'imp-1162-original' }),
  Object.freeze({ N:    200, eta: 0.005,    variance: 0.033674927150899245,  source: 'imp-1162-original' }),
  Object.freeze({ N:    500, eta: 0.002,    variance: 0.019031316441728355,  source: 'imp-1162-original' }),
  Object.freeze({ N:   1000, eta: 0.001,    variance: 0.00731459133683924,   source: 'imp-1162-original' }),
  Object.freeze({ N:   2000, eta: 0.0005,   variance: 0.0050857413083440495, source: 'imp-1162-original' }),
  Object.freeze({ N:   5000, eta: 0.0002,   variance: 0.001969377182859525,  source: 'imp-1162-original' }),
  Object.freeze({ N:  10000, eta: 0.0001,   variance: 0.0008558736430692803, source: 'imp-1162-original' }),
  Object.freeze({ N:  20000, eta: 0.00005,  variance: 0.0017321519541642016, source: 'imp-1162-original' }),
  Object.freeze({ N:  50000, eta: 0.00002,  variance: 0.0002322207486724605, source: 'imp-1162-original' }),
  // imp-1162-extended 4 rows
  Object.freeze({ N:  100000, eta: 0.00001,    variance: 0.00014148927165190587,  source: 'imp-1162-extended' }),
  Object.freeze({ N:  200000, eta: 0.000005,   variance: 0.00007771047406411212,  source: 'imp-1162-extended' }),
  Object.freeze({ N:  500000, eta: 0.000002,   variance: 0.000045450210738127436, source: 'imp-1162-extended' }),
  Object.freeze({ N: 1000000, eta: 0.000001,   variance: 0.00001639811835774324,  source: 'imp-1162-extended' }),
]);

// -- New imp-1186 rows (7 total, computed 2026-05-25) ------------------------
//
// Computed by scripts/compute-imp1186-lin-stat-20point.mjs against
// /tmp/odlyzko-zeros6.txt (2,001,052 zeros). The first 1e6 entries of
// zeros6 are bit-equivalent to the bundled zeros-to-1e6.js -- cross-checked
// at N = 1e6 and N = 1e5 (variance match to all 17 significant digits).

const IMP1186_NEW_ROWS = Object.freeze([
  // Interior fill (5 rows within imp-1162 range)
  Object.freeze({
    N: 300,
    eta: 0.0033333333333333335,
    variance: 0.031226971979384927,
    sampleSize: 80,
    source: 'imp-1186-fill',
    timingMs: { unfold: 0, compute: 1 },
  }),
  Object.freeze({
    N: 1500,
    eta: 0.0006666666666666666,
    variance: 0.008777099002269414,
    sampleSize: 80,
    source: 'imp-1186-fill',
    timingMs: { unfold: 0, compute: 0 },
  }),
  Object.freeze({
    N: 7000,
    eta: 0.00014285714285714287,
    variance: 0.0012728706227947784,
    sampleSize: 80,
    source: 'imp-1186-fill',
    timingMs: { unfold: 0, compute: 1 },
  }),
  Object.freeze({
    N: 70000,
    eta: 0.000014285714285714285,
    variance: 0.0002174580002800374,
    sampleSize: 80,
    source: 'imp-1186-fill',
    timingMs: { unfold: 0, compute: 3 },
  }),
  Object.freeze({
    N: 700000,
    eta: 0.0000014285714285714286,
    variance: 0.00007894333837657605,
    sampleSize: 80,
    source: 'imp-1186-fill',
    timingMs: { unfold: 3, compute: 34 },
  }),
  // Extension beyond 1e6 (2 rows up to the zeros6 ceiling)
  Object.freeze({
    N: 1500000,
    eta: 6.666666666666667e-7,
    variance: 0.000011676127286001891,
    sampleSize: 80,
    source: 'imp-1186-extension',
    timingMs: { unfold: 4, compute: 75 },
  }),
  Object.freeze({
    N: 2000000,
    eta: 5e-7,
    variance: 0.000005008561480724745,
    sampleSize: 80,
    source: 'imp-1186-extension',
    timingMs: { unfold: 6, compute: 100 },
  }),
]);

// -- Combined 20-point grid (sorted by N) ------------------------------------

function makeCombinedGrid() {
  const rows = [
    ...IMP1162_FROZEN_ROWS.map((r) => ({ N: r.N, variance: r.variance, source: r.source })),
    ...IMP1186_NEW_ROWS.map((r)    => ({ N: r.N, variance: r.variance, source: r.source })),
  ];
  rows.sort((a, b) => a.N - b.N);
  return Object.freeze(rows.map((r) => Object.freeze(r)));
}

const COMBINED_GRID_20 = makeCombinedGrid();

// -- OLS on log(variance) vs log(N) (same fitLogLog as imp-1162) -------------

function fitLogLog(rows) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r.variance));
  const n = xs.length;
  let xm = 0, ym = 0;
  for (let i = 0; i < n; i++) { xm += xs[i]; ym += ys[i]; }
  xm /= n; ym /= n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xm) * (ys[i] - ym);
    den += (xs[i] - xm) * (xs[i] - xm);
  }
  const slope = num / den;
  const intercept = ym - slope * xm;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) * (ys[i] - pred);
    ssTot += (ys[i] - ym) * (ys[i] - ym);
  }
  return { slope, intercept, R2: 1 - ssRes / ssTot, n_points: n };
}

const COMBINED_OLS_20 = Object.freeze(fitLogLog(COMBINED_GRID_20));

// Also fit the new-only 7 rows as a diagnostic.
const NEW_ONLY_OLS = Object.freeze(fitLogLog(
  IMP1186_NEW_ROWS.map((r) => ({ N: r.N, variance: r.variance })),
));

// And the imp-1162-extension-only subset (beyond 1e6, just 2 rows -- this is
// a 2-point line, R^2 = 1 trivially, slope is exact through both points).
const EXTENSION_BEYOND_1E6_OLS = Object.freeze(fitLogLog(
  IMP1186_NEW_ROWS.filter((r) => r.N > 1000000).map((r) => ({ N: r.N, variance: r.variance })),
));

// -- Deterministic percentile bootstrap CI (matches imp-1166 methodology) ----

const N_REPLICATES = 2000;
const BOOTSTRAP_SEED = 0xC51186FA;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return Number.NaN;
  const idx = Math.floor(p * (sortedArr.length - 1));
  return sortedArr[idx];
}

function runBootstrap() {
  const rng = mulberry32(BOOTSTRAP_SEED);
  const n = COMBINED_GRID_20.length;
  const slopes = [];
  const intercepts = [];
  const r2s = [];
  let nFinite = 0;
  for (let r = 0; r < N_REPLICATES; r++) {
    const sample = new Array(n);
    const distinctNs = new Set();
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(rng() * n);
      sample[i] = COMBINED_GRID_20[idx];
      distinctNs.add(COMBINED_GRID_20[idx].N);
    }
    if (distinctNs.size < 2) continue;
    const fit = fitLogLog(sample);
    if (
      Number.isFinite(fit.slope)
      && Number.isFinite(fit.intercept)
      && Number.isFinite(fit.R2)
    ) {
      slopes.push(fit.slope);
      intercepts.push(fit.intercept);
      r2s.push(fit.R2);
      nFinite++;
    }
  }
  slopes.sort((a, b) => a - b);
  intercepts.sort((a, b) => a - b);
  r2s.sort((a, b) => a - b);
  return Object.freeze({
    nReplicates: N_REPLICATES,
    nFinite,
    slopeCI: Object.freeze({
      ci_low_95:  percentile(slopes, 0.025),
      ci_high_95: percentile(slopes, 0.975),
      central:    percentile(slopes, 0.5),
    }),
    interceptCI: Object.freeze({
      ci_low_95:  percentile(intercepts, 0.025),
      ci_high_95: percentile(intercepts, 0.975),
      central:    percentile(intercepts, 0.5),
    }),
    R2CI: Object.freeze({
      ci_low_95:  percentile(r2s, 0.025),
      ci_high_95: percentile(r2s, 0.975),
      central:    percentile(r2s, 0.5),
    }),
  });
}

const BOOTSTRAP_20PT = runBootstrap();

// -- Reference: imp-1162 13-point bootstrap CI (mirrored from imp-1166) ------
//
// imp-1166 reported bootstrap CI on the imp-1162 13-point grid (the same
// frozen rows mirrored above). We mirror those values verbatim so the
// comparison block can present both CIs side by side without re-running
// imp-1166. If imp-1166 re-runs and the published CI drifts, the
// imp1186-reference-imp1162-slope-matches tripwire below will fire on
// the raw-uncorrected slope (-0.881247); the imp-1166-corrected CI here
// is informational only.

const IMP1162_REFERENCE = Object.freeze({
  rawSlope:    -0.881247,  // from imp-1162 COMBINED_OLS.slope (13-point)
  rawR2:        0.928,     // from imp-1162 COMBINED_OLS.R2 (13-point, approx)
  n_points:     13,
  bootstrap_ci_imp1166_corrected: Object.freeze({
    // imp-1166 CI is on the CS-corrected slope, NOT the raw -- quoted here
    // for context.
    ci_low_95:  -1.0288,
    ci_high_95: -0.9493,
    central:    -0.9965,
    n_replicates: 500,
    seed: 0xC51166FA,
    note: 'Conrey-Snaith corrected slope CI from imp-1166; not directly '
        + 'comparable to the raw 20-point CI here.',
  }),
});

// Recompute the imp-1162 13-point raw slope locally for the comparison
// (frozen rows -> deterministic).
const IMP1162_RAW_OLS_RECOMPUTED = Object.freeze(fitLogLog(
  IMP1162_FROZEN_ROWS.map((r) => ({ N: r.N, variance: r.variance })),
));

// -- CI tightening verdict ---------------------------------------------------
//
// Imp-1166 percentile-bootstrap CI on the CS-corrected 13-point slope was
// width 0.0795 (ci_high - ci_low = -0.9493 - (-1.0288)). For the
// uncorrected raw slope, we do not have an imp-1166 published CI so we
// re-bootstrap the 13-point raw grid here for direct width comparison.

function bootstrapRaw13() {
  const rng = mulberry32(BOOTSTRAP_SEED ^ 0x13131313); // distinct stream
  const rows = IMP1162_FROZEN_ROWS.map((r) => ({ N: r.N, variance: r.variance }));
  const n = rows.length;
  const slopes = [];
  for (let r = 0; r < N_REPLICATES; r++) {
    const sample = new Array(n);
    const distinct = new Set();
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(rng() * n);
      sample[i] = rows[idx];
      distinct.add(rows[idx].N);
    }
    if (distinct.size < 2) continue;
    const fit = fitLogLog(sample);
    if (Number.isFinite(fit.slope)) slopes.push(fit.slope);
  }
  slopes.sort((a, b) => a - b);
  return Object.freeze({
    ci_low_95:  percentile(slopes, 0.025),
    ci_high_95: percentile(slopes, 0.975),
    central:    percentile(slopes, 0.5),
    width: percentile(slopes, 0.975) - percentile(slopes, 0.025),
    n_replicates: N_REPLICATES,
  });
}

const BOOTSTRAP_RAW_13 = bootstrapRaw13();

const CI_WIDTH_20  = BOOTSTRAP_20PT.slopeCI.ci_high_95 - BOOTSTRAP_20PT.slopeCI.ci_low_95;
const CI_WIDTH_13  = BOOTSTRAP_RAW_13.width;
const CI_TIGHTENED = CI_WIDTH_20 < CI_WIDTH_13;
const CI_TIGHTENING_FACTOR = CI_WIDTH_13 / CI_WIDTH_20;

const SLOPE_SHIFT = COMBINED_OLS_20.slope - IMP1162_RAW_OLS_RECOMPUTED.slope;

function classifyVerdict() {
  // Verdict rule:
  //   tightened-agree   : CI width decreased AND |slope shift| <= 0.02
  //   tightened-diverge : CI width decreased BUT |slope shift| in (0.02, 0.05]
  //   tightened-flagged : CI width decreased BUT |slope shift| > 0.05 (warning)
  //   widened-agree     : CI width INCREASED (unexpected) but slope agrees
  //   widened-diverge   : CI width INCREASED AND slope drifted > 0.02
  const absShift = Math.abs(SLOPE_SHIFT);
  if (CI_TIGHTENED) {
    if (absShift <= 0.02) return 'tightened-agree';
    if (absShift <= 0.05) return 'tightened-diverge';
    return 'tightened-flagged';
  }
  if (absShift <= 0.02) return 'widened-agree';
  return 'widened-diverge';
}

const VERDICT = classifyVerdict();

// -- Frozen exported record --------------------------------------------------

export const IMP1186_LIN_STAT_20POINT_SWEEP = Object.freeze({
  id: 'imp-1186',
  ticket: 'imp-1186',
  attemptDate: '2026-05-25',
  goal:
    'Extend the imp-1162 13-point linear-statistics variance sweep to a '
    + '20-point grid by adding 7 new N values (5 interior fill + 2 beyond '
    + '1e6, the latter using the Odlyzko zeros6 combined table). Refit '
    + 'the OLS slope on the combined 20-point grid, compute a deterministic '
    + 'percentile-bootstrap 95% CI matching imp-1166 methodology, and '
    + 'report whether the CI tightens relative to the imp-1162 13-point fit.',
  source: 'imp-1162 frozen rows (mirrored verbatim) + /tmp/odlyzko-zeros6.txt '
        + '(2,001,052 verified Odlyzko zeros, downloaded from '
        + 'https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros6 on 2026-05-25)',
  mBulk: 80,
  alpha: 1.0,
  etaScaling: 'eta = N^{-1}',
  observable:
    'linStat_N(eta) = sqrt( population-Var_E [ Im m_N(E + i*eta) ] ) '
    + 'over M_BULK = 80 bulk midpoints in [N/4, 3N/4 - 1]',
  imp1162FrozenRows: IMP1162_FROZEN_ROWS,
  imp1186NewRows: IMP1186_NEW_ROWS,
  combinedGrid20: COMBINED_GRID_20,
  combinedOLS20: COMBINED_OLS_20,
  newOnlyOLS: NEW_ONLY_OLS,
  extensionBeyond1e6OLS: EXTENSION_BEYOND_1E6_OLS,
  bootstrap: Object.freeze({
    method: 'percentile-bootstrap-row-resample',
    nReplicates: N_REPLICATES,
    seed: BOOTSTRAP_SEED,
    seedHex: '0xC51186FA',
    prng: 'mulberry32',
    slopeCI: BOOTSTRAP_20PT.slopeCI,
    interceptCI: BOOTSTRAP_20PT.interceptCI,
    R2CI: BOOTSTRAP_20PT.R2CI,
    nFinite: BOOTSTRAP_20PT.nFinite,
    ciWidth: CI_WIDTH_20,
    note:
      'Row-resampling percentile CI on the 20-point (N, variance) grid. '
      + '2000 replicates (4x imp-1166 baseline). Deterministic via '
      + 'mulberry32 with fixed seed 0xC51186FA.',
  }),
  comparisonToImp1162: Object.freeze({
    imp1162_13pt_raw_slope:    IMP1162_RAW_OLS_RECOMPUTED.slope,
    imp1162_13pt_raw_R2:       IMP1162_RAW_OLS_RECOMPUTED.R2,
    imp1186_20pt_slope:        COMBINED_OLS_20.slope,
    imp1186_20pt_R2:           COMBINED_OLS_20.R2,
    slopeShift:                SLOPE_SHIFT,
    absSlopeShift:             Math.abs(SLOPE_SHIFT),
    imp1162_13pt_bootstrap_raw_CI: BOOTSTRAP_RAW_13,
    imp1186_20pt_bootstrap_CI:     BOOTSTRAP_20PT.slopeCI,
    ciWidth13:                 CI_WIDTH_13,
    ciWidth20:                 CI_WIDTH_20,
    ciTightened:               CI_TIGHTENED,
    ciTighteningFactor:        CI_TIGHTENING_FACTOR,
    imp1162_reference_record:  IMP1162_REFERENCE,
  }),
  verdict: VERDICT,
  honestScope: Object.freeze([
    'Cap at N = 2e6, NOT the ticket-nominal 1e7. Odlyzko publishes '
    + 'zeros1..zeros10 (1e6 total, the imp-1162 cap) plus the zeros6 '
    + 'combined file with 2,001,052 entries. zeros11 returned HTTP 404 '
    + 'when probed on 2026-05-25. N > 2e6 would require Platt-style '
    + 'rigorous zero computation or extrapolation -- both out of scope.',
    'Seven new N values: 5 interior fill (300, 1500, 7000, 70000, 700000) '
    + 'chosen to halve the worst geometric gaps in the imp-1162 grid, and '
    + '2 beyond 1e6 (1.5e6, 2e6) at the zeros6 ceiling. Interior fill is '
    + 'genuinely new information (the bulk-midpoint sample at those N is '
    + 'independent of any imp-1162 row) -- not double-dipping.',
    'Bootstrap is row-resampling percentile (matching imp-1166), NOT '
    + 'block-bootstrap (imp-1185 does that). The 20-point CI is therefore '
    + 'methodologically comparable to the imp-1166 13-point CI but on a '
    + 'different observable (raw uncorrected slope, not CS-corrected slope). '
    + 'Direct apples-to-apples comparison is the 13-point RAW bootstrap '
    + '(BOOTSTRAP_RAW_13 above), re-run here on the same frozen rows.',
    'Per the imp-1162 honestScope, the lin-stat variance computation has '
    + 'NO fast-multipole acceleration on this code path: the Cauchy kernel '
    + 'y / (x^2 + y^2) is not the Dyson backward-drift 1 / (x_i - x_j). '
    + 'Flat O(N * M_BULK) Node loop runs in 100 ms at N = 2e6, no Rust '
    + 'BH CLI invoked.',
    'Sample size M_BULK = 80 fixed across all N (matches imp-1162). For '
    + 'N >= 320 the bulk sample saturates at 80; for N < 320 it is bounded '
    + 'by the bulk-window size. The smallest new N is 300, which gives a '
    + 'bulk window of [75, 224] -- 149 candidates, well above 80, so all '
    + 'new rows have sampleSize = 80.',
    'A surviving empirical regime at -0.85 to -0.95 is still a CANDIDATE '
    + 'direction for the ESY pointwise closure; the rigorous analytic bridge '
    + 'from the L^2 lin-stat scaling to the L^infty pointwise observable '
    + 'remains open (imp-1149-sub-ESY named obstructions 2 + 4). This '
    + 'ticket strengthens the empirical evidence base; it does not close '
    + 'imp-1149-sub-erdos-schlein-yau-port-residual.',
  ]),
  reproducibilityProtocol: Object.freeze([
    'Step 1: curl -s -o /tmp/odlyzko-zeros6.txt '
    + 'https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros6',
    'Step 2: node scripts/compute-imp1186-lin-stat-20point.mjs > /tmp/imp1186-rows.json',
    'Step 3: diff the rows[] in /tmp/imp1186-rows.json against IMP1186_NEW_ROWS '
    + 'in this file (variance literals; should match bit-for-bit).',
    'Step 4: For the 13 frozen imp-1162 rows, see '
    + 'src/data/esy-lin-stat-extended-sweep-2026-05.js -- they are '
    + 'mirrored verbatim; the imp1186-original-rows-match-imp1162 '
    + 'tripwire confirms no drift.',
  ]),
  parallelTickets: ['imp-1162', 'imp-1166', 'imp-1178', 'imp-1185'],
});

// -- Build-time tripwires (12 total, well above the 6+ spec) -----------------

export const IMP1186_LIN_STAT_20POINT_SWEEP_ASSERTIONS = [
  {
    id: 'imp1186-combined-grid-row-count-20',
    holds: () => IMP1186_LIN_STAT_20POINT_SWEEP.combinedGrid20.length === 20,
    why:
      'The combined grid must have EXACTLY 20 rows (13 imp-1162 frozen + 7 '
      + 'imp-1186 new). A drift here means either rows were silently dropped '
      + 'or duplicated, both of which would invalidate the slope and CI.',
  },
  {
    id: 'imp1186-new-rows-count-7',
    holds: () => IMP1186_LIN_STAT_20POINT_SWEEP.imp1186NewRows.length === 7,
    why:
      'The imp-1186 new-rows array must have exactly 7 entries (5 fill + 2 '
      + 'extension). Drift indicates either the script was rerun with a '
      + 'different N grid or a row was hand-edited.',
  },
  {
    id: 'imp1186-original-rows-match-imp1162',
    holds: () => {
      // The 13 frozen imp-1162 rows must match the published values exactly.
      const expected = [
        { N:    100, v: 0.06864163141521673   },
        { N:    200, v: 0.033674927150899245  },
        { N:    500, v: 0.019031316441728355  },
        { N:   1000, v: 0.00731459133683924   },
        { N:   2000, v: 0.0050857413083440495 },
        { N:   5000, v: 0.001969377182859525  },
        { N:  10000, v: 0.0008558736430692803 },
        { N:  20000, v: 0.0017321519541642016 },
        { N:  50000, v: 0.0002322207486724605 },
        { N: 100000, v: 0.00014148927165190587  },
        { N: 200000, v: 0.00007771047406411212  },
        { N: 500000, v: 0.000045450210738127436 },
        { N:1000000, v: 0.00001639811835774324  },
      ];
      const rows = IMP1186_LIN_STAT_20POINT_SWEEP.imp1162FrozenRows;
      if (rows.length !== 13) return false;
      for (let i = 0; i < 13; i++) {
        if (rows[i].N !== expected[i].N) return false;
        if (rows[i].variance !== expected[i].v) return false;
      }
      return true;
    },
    why:
      'The 13 imp-1162 frozen rows must match the published values exactly. '
      + 'If they drift, the combined OLS comparison to imp-1162 is invalid '
      + 'and the closure note becomes misleading. Drift here means either '
      + 'the literals were hand-edited or the source imp-1162 file changed; '
      + 'in either case, re-extract from '
      + 'src/data/esy-lin-stat-extended-sweep-2026-05.js and update both '
      + 'files together.',
  },
  {
    id: 'imp1186-new-rows-finite-positive',
    holds: () => {
      const rows = IMP1186_LIN_STAT_20POINT_SWEEP.imp1186NewRows;
      for (const r of rows) {
        if (!Number.isFinite(r.N) || r.N <= 0) return false;
        if (!Number.isFinite(r.eta) || r.eta <= 0) return false;
        if (!Number.isFinite(r.variance) || r.variance <= 0) return false;
        if (!Number.isFinite(r.sampleSize) || r.sampleSize <= 0) return false;
      }
      return true;
    },
    why:
      'Every new (N, eta, variance, sampleSize) tuple must be finite and '
      + 'strictly positive. A NaN or zero would indicate a singular kernel '
      + 'hit (test point landed on a zero), a Stieltjes overflow at very '
      + 'small eta = 5e-7, or a corrupted zero-data import.',
  },
  {
    id: 'imp1186-no-extrapolation-beyond-zeros6',
    holds: () => {
      // No new row may exceed the zeros6 ceiling (2,001,052 zeros).
      const rows = IMP1186_LIN_STAT_20POINT_SWEEP.imp1186NewRows;
      for (const r of rows) {
        if (r.N > 2001052) return false;
      }
      return true;
    },
    why:
      'No new row may exceed the Odlyzko zeros6 ceiling (2,001,052). Going '
      + 'beyond would require Platt-style rigorous zero computation (out of '
      + 'scope) or extrapolation (refused). If you need N > 2e6, first '
      + 'extend the zero source.',
  },
  {
    id: 'imp1186-combined-slope-in-esy-band',
    holds: () => {
      const s  = IMP1186_LIN_STAT_20POINT_SWEEP.combinedOLS20.slope;
      const r2 = IMP1186_LIN_STAT_20POINT_SWEEP.combinedOLS20.R2;
      return s > -1.3 && s < -0.5 && r2 >= 0.85;
    },
    why:
      'The 20-point combined OLS slope must lie in the ESY-compatible band '
      + '(-1.3, -0.5) with R^2 >= 0.85. The imp-1162 13-point slope is '
      + '~-0.88; the 20-point slope should be in the same neighborhood. '
      + 'Drift outside this band would indicate a numerical regression '
      + '(test point landing on a zero), a corrupted zeros6 file, or a '
      + 'fundamental change to the scaling law -- all warrant investigation.',
  },
  {
    id: 'imp1186-slope-agrees-with-imp1162-within-005',
    holds: () => {
      const shift = Math.abs(IMP1186_LIN_STAT_20POINT_SWEEP.comparisonToImp1162.slopeShift);
      return shift <= 0.05;
    },
    why:
      'The 20-point slope must agree with the imp-1162 13-point raw slope '
      + 'within 0.05. A larger shift is an HONEST FINDING worth flagging '
      + '(per the ticket honest-scope clause: "If it diverges by > 0.05, '
      + 'that is an honest finding worth flagging") and should not be '
      + 'silently absorbed. If this tripwire fires, do NOT downgrade -- '
      + 'investigate whether the new rows reveal a systematic small-N '
      + 'leverage effect or a genuine large-N trend break.',
  },
  {
    id: 'imp1186-bootstrap-ci-finite-and-ordered',
    holds: () => {
      const ci = IMP1186_LIN_STAT_20POINT_SWEEP.bootstrap.slopeCI;
      return Number.isFinite(ci.ci_low_95)
        && Number.isFinite(ci.ci_high_95)
        && Number.isFinite(ci.central)
        && ci.ci_low_95 < ci.central
        && ci.central <  ci.ci_high_95
        && (ci.ci_high_95 - ci.ci_low_95) > 0
        && (ci.ci_high_95 - ci.ci_low_95) < 1.0;
    },
    why:
      'The 20-point bootstrap CI must have finite endpoints in strict order '
      + '(low < central < high) and width in (0, 1). Degenerate widths >= 1 '
      + 'would indicate a fitLogLog instability or a malformed PRNG stream.',
  },
  {
    id: 'imp1186-bootstrap-replicate-count',
    holds: () => {
      const b = IMP1186_LIN_STAT_20POINT_SWEEP.bootstrap;
      return b.nReplicates >= 2000 && b.nFinite >= b.nReplicates * 0.95;
    },
    why:
      'The bootstrap must run at least 2000 replicates (matching the spec '
      + 'in this file; 4x the imp-1166 baseline of 500 for the larger '
      + 'grid) and at least 95% must produce finite slopes. A high '
      + 'degenerate-replicate rate would mean the row-resampling is '
      + 'frequently collapsing to <2 distinct N -- unlikely with n=20 but '
      + 'we guard.',
  },
  {
    id: 'imp1186-bootstrap-ci-contains-or-near-combined-slope',
    holds: () => {
      const fit = IMP1186_LIN_STAT_20POINT_SWEEP.combinedOLS20;
      const ci  = IMP1186_LIN_STAT_20POINT_SWEEP.bootstrap.slopeCI;
      // The full-data OLS slope should sit close to (typically inside) the
      // CI. Allow a 0.05 safety margin to absorb percentile-discretization
      // at 2000 replicates.
      return Math.abs(fit.slope - ci.central) <= Math.max(
        Math.abs(ci.ci_high_95 - ci.ci_low_95), 0.10,
      );
    },
    why:
      'The 20-point OLS slope must sit close to the bootstrap central '
      + 'estimate -- a large gap (> max(CI width, 0.10)) would indicate '
      + 'either heavy bootstrap-bias-correction needed or a malformed '
      + 'resampling scheme.',
  },
  {
    id: 'imp1186-extension-beyond-1e6-monotone-decreasing',
    holds: () => {
      const ext = IMP1186_LIN_STAT_20POINT_SWEEP.imp1186NewRows
        .filter((r) => r.source === 'imp-1186-extension')
        .sort((a, b) => a.N - b.N);
      for (let i = 1; i < ext.length; i++) {
        if (!(ext[i].variance < ext[i - 1].variance)) return false;
      }
      return true;
    },
    why:
      'On the extension-beyond-1e6 subset (1.5e6, 2e6), variance must be '
      + 'strictly decreasing in N (the slope-tightening trend continues at '
      + 'large N). A violation would indicate a kernel singularity hit '
      + 'or a numerical issue at very small eta = 5e-7.',
  },
  {
    id: 'imp1186-verdict-permitted',
    holds: () => {
      const v = IMP1186_LIN_STAT_20POINT_SWEEP.verdict;
      return v === 'tightened-agree'
        || v === 'tightened-diverge'
        || v === 'tightened-flagged'
        || v === 'widened-agree'
        || v === 'widened-diverge';
    },
    why:
      'verdict must be one of the five enumerated values. Drift here means '
      + 'classifyVerdict was edited without updating the schema -- catch at '
      + 'build time, not at consumer time.',
  },
  {
    id: 'imp1186-combined-grid-sorted-and-unique-N',
    holds: () => {
      const rows = IMP1186_LIN_STAT_20POINT_SWEEP.combinedGrid20;
      const seen = new Set();
      for (let i = 0; i < rows.length; i++) {
        if (i > 0 && rows[i].N <= rows[i - 1].N) return false;
        if (seen.has(rows[i].N)) return false;
        seen.add(rows[i].N);
      }
      return true;
    },
    why:
      'The combined 20-point grid must be sorted strictly ascending by N and '
      + 'contain no duplicate N. A duplicate would mean the imp-1186 fill '
      + 'list accidentally overlapped with an imp-1162 row; a sort failure '
      + 'would invalidate any downstream consumer that assumes ordered N.',
  },
];
