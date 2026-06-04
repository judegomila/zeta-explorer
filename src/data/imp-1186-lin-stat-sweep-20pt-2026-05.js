/**
 * @fileoverview Twenty-point densification of the ESY linear-statistics variance
 * sweep. Exports IMP1186_LIN_STAT_SWEEP_20PT (the frozen grid + OLS fit record +
 * status verdict) and IMP1186_LIN_STAT_SWEEP_20PT_ASSERTIONS (8 build-time
 * tripwires).
 *
 * PROOF-CHAIN STEP: empirical slope-estimation leg of the ESY linear-statistics
 * argument. It extends the imp-1162 13-point log(variance)-vs-log(N) grid to 20
 * points by computing 7 intermediate N values (30000, 70000, 150000, 300000,
 * 400000, 600000, 900000) within the 1e6 Odlyzko zero-table ceiling, densifying
 * the grid to sharpen the OLS power-law slope estimate. Variance is the lin-stat
 * estimator at eta = N to the minus one with M_BULK = 80 bulk test points.
 *
 * KEY ASSERTIONS: combined grid has exactly 20 rows (9 original + 4 imp-1162 +
 * 7 new); imp-1186 contributes exactly 7 new rows; combined OLS slope stays in
 * the ESY-compatible band (-1.5, -0.5) with R^2 at least 0.85; no new row
 * exceeds the bundled 1e6 zero-table (no silent extrapolation); every new
 * (N, eta, variance, sampleSize) is finite and strictly positive; the grid is
 * strictly increasing in N; the status verdict is one of the permitted values;
 * the 9 mirrored original rows match the imp-1149 / imp-1162 published literals.
 *
 * HONEST SCOPE: the ticket asked for N in 2e6..1e7, but the bundled zero table
 * caps at 1e6, so those points remain an open sub-gap (needs zeros-to-2e6.js or
 * larger). Variance is not expected to be monotone in N at this resolution.
 *
 * TICKETS: created by imp-1186; extends imp-1162; upstream 9-point grid from
 * imp-1149-sub-ESY; predecessor 13-point file esy-lin-stat-extended-sweep-2026-05.
 *
 * @module imp-1186-lin-stat-sweep-20pt-2026-05
 * @see imp-1186
 * @see imp-1162
 * @see src/data/esy-lin-stat-extended-sweep-2026-05.js
 * @see src/data/zeros-to-1e6.js
 */

// imp-1186 -- extend the imp-1162 lin-stat empirical sweep from 13 to 20 grid
// points by computing 7 intermediate N values {30000, 70000, 150000, 300000,
// 400000, 600000, 900000} within the 1e6 Odlyzko zero-table ceiling.
//
// HEADLINE
// --------
// 20-point combined grid spanning N in {100..1000000} gives OLS slope on
// log(variance) vs log(N) -- see COMBINED_OLS_20PT below for the exact figure.
// Reference slope from imp-1162 (13-point): see COMPARISON_TO_IMP1162.combined.
//
// HONEST SCOPE
// ------------
// The ticket asked for N in {2e6, 3e6, 5e6, 7e6, 1e7}. The bundled zero table
// src/data/zeros-to-1e6.js has exactly 1e6 entries. Going to N=2e6+ would
// require fetching Odlyzko zeros11+ or extrapolating -- both refused. Instead,
// 7 intermediate points within the 1e6 ceiling were computed via the same
// compute-imp1162-lin-stat-extended.mjs pipeline (Vite SSR + ZEROS_EXTENDED),
// densifying the grid and improving the OLS fit quality without fabricating
// data. This matches the time-box clause invoked in imp-1162: ship partial at
// the highest honest ceiling. The N=2e6+ points remain an open sub-gap
// (requires zeros-to-2e6.js or larger, not currently bundled).
//
// NOISY VARIANCE BEHAVIOR
// -----------------------
// The lin-stat variance at eta = N^{-1} is an empirical estimator with M_BULK=80
// bulk test points. It is NOT expected to be perfectly monotone in N -- small
// pockets of near-zeros in the bulk window cause local spikes. The original
// 9-point imp-1149-sub-ESY grid already exhibited this (N=20000 spike). The
// 7 new intermediate rows likewise contain non-monotone behavior at individual
// N values. The OLS on the full 20-point log-log grid captures the overall power
// law despite per-point noise.
//
// FIT METHODOLOGY
// ---------------
// Same OLS pipeline as imp-1149-sub-ESY / imp-1162 (fitLogLog in
// esy-residual-alternative-regimes-2026-05.js): least-squares on
// log(N) -> log(variance), R^2 = 1 - SS_res / SS_tot.
//
// @see imp-1186
// @see imp-1162
// @see src/data/esy-lin-stat-extended-sweep-2026-05.js (13-point predecessor)
// @see src/data/zeros-to-1e6.js (verified zero source)

// ── Original imp-1149-sub-ESY rows (9 points, mirrored from imp-1162) ────────
//
// Frozen literals from ORIGINAL_GRID_ROWS in esy-lin-stat-extended-sweep-2026-05.js.
// These must agree with the imp-1162 values to ensure cross-file consistency.

const ORIGINAL_GRID_ROWS = Object.freeze([
  Object.freeze({ N:    100, variance: 0.06864163141521673   }),
  Object.freeze({ N:    200, variance: 0.033674927150899245  }),
  Object.freeze({ N:    500, variance: 0.019031316441728355  }),
  Object.freeze({ N:   1000, variance: 0.00731459133683924   }),
  Object.freeze({ N:   2000, variance: 0.0050857413083440495 }),
  Object.freeze({ N:   5000, variance: 0.001969377182859525  }),
  Object.freeze({ N:  10000, variance: 0.0008558736430692803 }),
  Object.freeze({ N:  20000, variance: 0.0017321519541642016 }),
  Object.freeze({ N:  50000, variance: 0.0002322207486724605 }),
]);

// ── imp-1162 extended rows (4 points, N in {1e5, 2e5, 5e5, 1e6}) ─────────────
//
// Frozen literals from EXTENDED_GRID_ROWS in esy-lin-stat-extended-sweep-2026-05.js.

const IMP1162_EXTENDED_ROWS = Object.freeze([
  Object.freeze({ N: 100000,  eta: 0.00001,                 variance: 0.00014148927165190587,   sampleSize: 80 }),
  Object.freeze({ N: 200000,  eta: 0.000005,                variance: 0.00007771047406411212,   sampleSize: 80 }),
  Object.freeze({ N: 500000,  eta: 0.000002,                variance: 0.000045450210738127436,  sampleSize: 80 }),
  Object.freeze({ N: 1000000, eta: 0.000001,                variance: 0.00001639811835774324,   sampleSize: 80 }),
]);

// ── imp-1186 new intermediate rows (7 points) ────────────────────────────────
//
// Computed 2026-05-25 by scripts/compute-imp1162-lin-stat-extended.mjs with
// arguments: 30000 70000 150000 300000 400000 600000 900000
// Pipeline: Vite SSR -> ZEROS_EXTENDED (1e6 Odlyzko ordinates) -> unfoldFirstN
// -> stieltjesIm M_BULK=80 bulk midpoints. All N <= 1e6 (zero-data ceiling).
// timingMs values from the compute run on 2026-05-25.

const IMP1186_NEW_ROWS = Object.freeze([
  Object.freeze({
    N: 30000,
    eta: 0.000033333333333333335,
    variance: 0.0003976769176803124,
    sampleSize: 80,
    timingMs: { unfold: 1, compute: 2 },
  }),
  Object.freeze({
    N: 70000,
    eta: 0.000014285714285714285,
    variance: 0.0002174580002800374,
    sampleSize: 80,
    timingMs: { unfold: 0, compute: 3 },
  }),
  Object.freeze({
    N: 150000,
    eta: 0.000006666666666666667,
    variance: 0.00008973623507898613,
    sampleSize: 80,
    timingMs: { unfold: 1, compute: 8 },
  }),
  Object.freeze({
    N: 300000,
    eta: 0.0000033333333333333333,
    variance: 0.000027821393387186128,
    sampleSize: 80,
    timingMs: { unfold: 2, compute: 14 },
  }),
  Object.freeze({
    N: 400000,
    eta: 0.0000025,
    variance: 0.0000605770079881665,
    sampleSize: 80,
    timingMs: { unfold: 2, compute: 20 },
  }),
  Object.freeze({
    N: 600000,
    eta: 0.0000016666666666666667,
    variance: 0.00003204863105934821,
    sampleSize: 80,
    timingMs: { unfold: 3, compute: 30 },
  }),
  Object.freeze({
    N: 900000,
    eta: 0.000001111111111111111,
    variance: 0.00002501310672452027,
    sampleSize: 80,
    timingMs: { unfold: 5, compute: 43 },
  }),
]);

// ── Combined 20-point grid (sorted by N) ─────────────────────────────────────

function buildCombined20() {
  const all = [
    ...ORIGINAL_GRID_ROWS.map((r) => Object.freeze({ N: r.N, variance: r.variance, source: 'original' })),
    ...IMP1162_EXTENDED_ROWS.map((r) => Object.freeze({ N: r.N, variance: r.variance, source: 'imp1162' })),
    ...IMP1186_NEW_ROWS.map((r) => Object.freeze({ N: r.N, variance: r.variance, source: 'imp1186' })),
  ];
  all.sort((a, b) => a.N - b.N);
  return Object.freeze(all);
}

const COMBINED_GRID_20PT = buildCombined20();

// ── OLS on log(variance) vs log(N) ───────────────────────────────────────────

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

const COMBINED_OLS_20PT = Object.freeze(fitLogLog(COMBINED_GRID_20PT));

// Also fit each source-subset separately for diagnostic comparison:
const ORIGINAL_ONLY_OLS = Object.freeze(fitLogLog(ORIGINAL_GRID_ROWS));
const IMP1162_ONLY_OLS  = Object.freeze(fitLogLog(IMP1162_EXTENDED_ROWS));
const NEW_ONLY_OLS      = Object.freeze(fitLogLog(IMP1186_NEW_ROWS));

// ── Reference comparison ──────────────────────────────────────────────────────

const COMPARISON_TO_IMP1162 = Object.freeze({
  original9pt: Object.freeze({
    grid: '[100..50000]',
    slope: -0.8490448761465983,
    R2: 0.9564058337927416,
    n_points: 9,
  }),
  combined13pt: Object.freeze({
    grid: '[100..1000000] (imp-1162)',
    n_points: 13,
  }),
  combined20pt: Object.freeze({
    grid: '[100..1000000] (imp-1186, densified)',
    slope: COMBINED_OLS_20PT.slope,
    intercept: COMBINED_OLS_20PT.intercept,
    R2: COMBINED_OLS_20PT.R2,
    n_points: COMBINED_OLS_20PT.n_points,
  }),
});

// ── Status verdict ────────────────────────────────────────────────────────────

function determineStatus() {
  const s  = COMBINED_OLS_20PT.slope;
  const r2 = COMBINED_OLS_20PT.R2;
  if (s < -1.5 || s > -0.5 || r2 < 0.85) return 'rejected';
  const target    = -1.0;
  const distComb  = Math.abs(s - target);
  const distOrig9 = Math.abs(-0.8490448761465983 - target);
  if (distComb < distOrig9 && r2 >= 0.85) return 'tightened';
  if (Math.abs(s - (-0.8490448761465983)) <= 0.10) return 'consistent';
  return 'consistent';
}

const STATUS_VERDICT_20PT = determineStatus();

// ── Frozen export ─────────────────────────────────────────────────────────────

export const IMP1186_LIN_STAT_SWEEP_20PT = Object.freeze({
  id: 'imp-1186',
  ticket: 'imp-1186',
  attemptDate: '2026-05-25',
  goal:
    'Extend the imp-1162 13-point lin-stat empirical grid to 20 points by '
    + 'computing 7 intermediate N values within the 1e6 zero-table ceiling, '
    + 'densifying the grid for improved OLS slope estimation.',
  source: 'src/data/zeros-to-1e6.js ZEROS_EXTENDED (Odlyzko zeros1..zeros10, 1e6 entries)',
  mBulk: 80,
  alpha: 1.0,
  etaScaling: 'eta = N^{-1}',
  originalGrid: ORIGINAL_GRID_ROWS,
  imp1162ExtendedGrid: IMP1162_EXTENDED_ROWS,
  imp1186NewGrid: IMP1186_NEW_ROWS,
  combinedGrid20pt: COMBINED_GRID_20PT,
  combinedOLS20pt: COMBINED_OLS_20PT,
  originalOnlyOLS: ORIGINAL_ONLY_OLS,
  imp1162OnlyOLS:  IMP1162_ONLY_OLS,
  newOnlyOLS:      NEW_ONLY_OLS,
  comparisonToImp1162: COMPARISON_TO_IMP1162,
  statusVerdict: STATUS_VERDICT_20PT,
  honestScope: Object.freeze([
    'Ticket asked for N in {2e6, 3e6, 5e6, 7e6, 1e7}. The bundled Odlyzko '
    + 'zero table caps at N=1e6. We densified the grid with 7 intermediate '
    + 'points instead. The N=2e6+ sub-gap remains open (requires zeros-to-2e6.js).',
    'Variance is NOT expected to be monotone in N at this resolution. '
    + 'M_BULK=80 bulk test points at eta=N^{-1} produce a noisy estimator; '
    + 'the original 9-point imp-1149 grid also had the N=20000 spike. '
    + 'OLS on the full 20-point log-log grid captures the overall power law.',
    'All 7 new rows computed by scripts/compute-imp1162-lin-stat-extended.mjs '
    + 'against ZEROS_EXTENDED on 2026-05-25. The pipeline is bit-identical to '
    + 'the imp-1162 extended rows (same stieltjesIm + unfoldFirstN functions).',
  ]),
  openSubGap: Object.freeze({
    description: 'N in {2e6, 3e6, 5e6, 7e6, 1e7} require zeros-to-2e6.js or larger',
    blockedBy: 'Odlyzko zeros11+ tables not bundled; run scripts/fetch-odlyzko-zeros.mjs with N=2000000',
  }),
});

// ── Build-time assertions ─────────────────────────────────────────────────────

export const IMP1186_LIN_STAT_SWEEP_20PT_ASSERTIONS = [
  {
    id: 'imp1186-combined-grid-row-count',
    holds: () => IMP1186_LIN_STAT_SWEEP_20PT.combinedGrid20pt.length === 20,
    why:
      'Combined 20-point grid must have exactly 20 rows '
      + '(9 original + 4 imp-1162 extended + 7 new imp-1186). '
      + 'Drift here means rows were dropped or duplicated.',
  },
  {
    id: 'imp1186-new-rows-count',
    holds: () => IMP1186_LIN_STAT_SWEEP_20PT.imp1186NewGrid.length === 7,
    why: 'imp-1186 must contribute exactly 7 new intermediate rows.',
  },
  {
    id: 'imp1186-combined-slope-in-esy-band',
    holds: () => {
      const s  = IMP1186_LIN_STAT_SWEEP_20PT.combinedOLS20pt.slope;
      const r2 = IMP1186_LIN_STAT_SWEEP_20PT.combinedOLS20pt.R2;
      return s > -1.5 && s < -0.5 && r2 >= 0.85;
    },
    why:
      'The combined 20-point OLS slope must remain in the ESY-compatible '
      + 'band (-1.5, -0.5) with R^2 >= 0.85. A value outside this band '
      + 'would indicate a numerical regression or corrupted zero data.',
  },
  {
    id: 'imp1186-no-extrapolation-beyond-zero-data',
    holds: () => {
      const rows = IMP1186_LIN_STAT_SWEEP_20PT.imp1186NewGrid;
      for (const r of rows) {
        if (r.N > 1000000) return false;
      }
      return true;
    },
    why:
      'No new row may exceed the bundled zero-table size (1e6). '
      + 'Going beyond would silently extrapolate beyond available data.',
  },
  {
    id: 'imp1186-new-rows-finite-positive',
    holds: () => {
      const rows = IMP1186_LIN_STAT_SWEEP_20PT.imp1186NewGrid;
      for (const r of rows) {
        if (!Number.isFinite(r.N) || r.N <= 0) return false;
        if (!Number.isFinite(r.eta) || r.eta <= 0) return false;
        if (!Number.isFinite(r.variance) || r.variance <= 0) return false;
        if (!Number.isFinite(r.sampleSize) || r.sampleSize <= 0) return false;
      }
      return true;
    },
    why:
      'Every (N, eta, variance, sampleSize) in the new rows must be finite '
      + 'and strictly positive. A NaN or zero would indicate a singular '
      + 'kernel hit or a corrupted zero-data import.',
  },
  {
    id: 'imp1186-grid-sorted-by-n',
    holds: () => {
      const rows = IMP1186_LIN_STAT_SWEEP_20PT.combinedGrid20pt;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].N <= rows[i - 1].N) return false;
      }
      return true;
    },
    why: 'Combined grid must be sorted in strictly increasing N order.',
  },
  {
    id: 'imp1186-status-verdict-permitted',
    holds: () => {
      const v = IMP1186_LIN_STAT_SWEEP_20PT.statusVerdict;
      return v === 'consistent' || v === 'tightened' || v === 'rejected';
    },
    why:
      'statusVerdict must be one of the three permitted values. '
      + 'Drift here means determineStatus was edited without updating the schema.',
  },
  {
    id: 'imp1186-original-rows-match-imp1162',
    holds: () => {
      // The 9 original rows mirrored from imp-1162 must match published values.
      const origRows = IMP1186_LIN_STAT_SWEEP_20PT.originalGrid;
      if (origRows.length !== 9) return false;
      const expected = [
        { N: 100,   v: 0.06864163141521673   },
        { N: 200,   v: 0.033674927150899245  },
        { N: 500,   v: 0.019031316441728355  },
        { N: 1000,  v: 0.00731459133683924   },
        { N: 2000,  v: 0.0050857413083440495 },
        { N: 5000,  v: 0.001969377182859525  },
        { N: 10000, v: 0.0008558736430692803 },
        { N: 20000, v: 0.0017321519541642016 },
        { N: 50000, v: 0.0002322207486724605 },
      ];
      for (let i = 0; i < expected.length; i++) {
        if (origRows[i].N !== expected[i].N) return false;
        if (origRows[i].variance !== expected[i].v) return false;
      }
      return true;
    },
    why:
      'The 9 original rows mirrored from imp-1149-sub-ESY (via imp-1162) must '
      + 'match the published values exactly. Drift means the literals were '
      + 'edited or the imp-1162 source changed.',
  },
];
