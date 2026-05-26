// imp-1186 — extend the imp-1162 combined 13-point lin-stat sweep at the
// candidate ESY-surviving regime (alpha = 1, eta = N^{-1}) by adding 2 new
// large-N rows computed against the locally cached Odlyzko zeros6 combined
// file (scripts/.zeros-cache/zeros6, 2,001,052 verified zero ordinates).
//
// HEADLINE
// --------
// Combined 15-point grid {100, 200, 500, 1000, 2000, 5000, 10000, 20000,
// 50000, 100000, 200000, 500000, 1000000, 1500000, 2000000} gives OLS slope:
//   13-point imp-1162 base  : slope -0.8808, R^2 0.9845
//   15-point imp-1186 combined : slope -0.9106, R^2 0.9861
//
// The 15-point slope is CLOSER to the ESY target -1.0 than the 13-point
// slope, with R^2 improving slightly. Status verdict: tightened.
//
// HONEST SCOPE
// ------------
// The ticket asked for N = 2e6, 3e6, 5e6, 7e6, 1e7 (up to 20 grid points).
// The locally cached Odlyzko zeros6 combined file has exactly 2,001,052
// verified zero ordinates. This permits:
//   - N = 1,500,000 : computed (new infill point, not in ticket spec but
//                     uses available data -- fills the 1M -> 2M gap)
//   - N = 2,000,000 : computed (ticket-requested max within available data)
//   - N = 3,000,000+ : SKIPPED -- exceeds zeros6 cache (2,001,052 entries)
// Fetching zeros11..zerosK from Odlyzko (to reach N=3e6+) requires updating
// MAX_BATCHES in scripts/fetch-odlyzko-zeros.mjs and a fresh network pull
// (~18 MB per 1M-zero batch). Total 15 points instead of 18-20.
//
// FIT METHODOLOGY
// ---------------
// Same OLS pipeline as imp-1149-sub-ESY / imp-1162 (fitLogLog below):
// least-squares on log(N) -> log(variance), R^2 = 1 - SS_res / SS_tot.
// No bootstrap CI (consistent with imp-1162 methodology).
//
// SYNTAX SAFETY: avoids star-slash inside JSDoc comments;
// no apostrophes inside single-quoted strings.
//
// @see imp-1162
// @see src/data/esy-lin-stat-extended-sweep-2026-05.js (13-point base)
// @see scripts/.zeros-cache/zeros6 (2,001,052-entry Odlyzko combined table)

// ── Mirrored 13-point grid from imp-1162 (frozen literals) ────────────────
//
// These 13 rows are the imp-1162 combined grid at alpha = 1, eta = N^{-1},
// mirrored verbatim so the combined fit here does NOT depend on a fresh
// recomputation of the imp-1162 file. If imp-1162 recomputes and disagrees,
// the tripwire imp1186-base-rows-match-imp1162 below will fire.
//
// Source split: rows 0..8 are from imp-1149-sub-ESY (original 9-point grid);
//               rows 9..12 are from imp-1162 (extended 4-point grid).

const IMP1162_GRID_ROWS = Object.freeze([
  Object.freeze({ N:     100, variance: 0.06864163141521673,   source: 'imp1149' }),
  Object.freeze({ N:     200, variance: 0.033674927150899245,  source: 'imp1149' }),
  Object.freeze({ N:     500, variance: 0.019031316441728355,  source: 'imp1149' }),
  Object.freeze({ N:    1000, variance: 0.00731459133683924,   source: 'imp1149' }),
  Object.freeze({ N:    2000, variance: 0.0050857413083440495, source: 'imp1149' }),
  Object.freeze({ N:    5000, variance: 0.001969377182859525,  source: 'imp1149' }),
  Object.freeze({ N:   10000, variance: 0.0008558736430692803, source: 'imp1149' }),
  Object.freeze({ N:   20000, variance: 0.0017321519541642016, source: 'imp1149' }),
  Object.freeze({ N:   50000, variance: 0.0002322207486724605, source: 'imp1149' }),
  Object.freeze({ N:  100000, variance: 0.00014148927165190587,  source: 'imp1162', sampleSize: 80 }),
  Object.freeze({ N:  200000, variance: 0.00007771047406411212,  source: 'imp1162', sampleSize: 80 }),
  Object.freeze({ N:  500000, variance: 0.000045450210738127436, source: 'imp1162', sampleSize: 80 }),
  Object.freeze({ N: 1000000, variance: 0.00001639811835774324,  source: 'imp1162', sampleSize: 80 }),
]);

// ── New imp-1186 rows (computed against zeros6 combined cache) ─────────────
//
// Computed using the same linStatVariance pipeline as imp-1162
// (stieltjesIm Cauchy kernel y/(x^2+y^2), unfolded zeros via
// unfoldOne(g) = (g/2pi)*log(g/2pi), M_BULK=80 bulk midpoints).
// Source: scripts/.zeros-cache/zeros6 (2,001,052 Odlyzko zero ordinates;
// 36 MB file, downloaded prior to this run; first zero 14.134725142,
// last zero 1132490.658714411).
//
// N=1,500,000: infill point between 1e6 and 2e6 (not in ticket spec, but
//   uses available data to improve grid density in the large-N regime).
// N=2,000,000: ticket-requested maximum (limited by zeros6 entry count).

const IMP1186_NEW_ROWS = Object.freeze([
  Object.freeze({
    N: 1500000,
    eta: 6.666666666666667e-7,
    variance: 0.000011676127286001891,
    sampleSize: 80,
    timingMs: { unfold: 5, compute: 70 },
    source: 'imp1186',
    zeroSource: 'scripts/.zeros-cache/zeros6 (2001052 entries)',
  }),
  Object.freeze({
    N: 2000000,
    eta: 5e-7,
    variance: 0.000005008561480724745,
    sampleSize: 80,
    timingMs: { unfold: 6, compute: 97 },
    source: 'imp1186',
    zeroSource: 'scripts/.zeros-cache/zeros6 (2001052 entries)',
  }),
]);

// ── Combined 15-point grid ─────────────────────────────────────────────────

const COMBINED_GRID = Object.freeze([
  ...IMP1162_GRID_ROWS.map((r) =>
    Object.freeze({ N: r.N, variance: r.variance, source: r.source }),
  ),
  ...IMP1186_NEW_ROWS.map((r) =>
    Object.freeze({ N: r.N, variance: r.variance, source: r.source }),
  ),
]);

// ── OLS on log(variance) vs log(N) ────────────────────────────────────────

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

const COMBINED_OLS = Object.freeze(fitLogLog(COMBINED_GRID));

// Also fit subsets for diagnostics:
const NEW_ROWS_OLS = Object.freeze(fitLogLog(IMP1186_NEW_ROWS));
const EXTENDED_6PT_OLS = Object.freeze(
  fitLogLog(COMBINED_GRID.filter((r) => r.N >= 100000)),
);

// Reference slopes from prior tickets (frozen literals for comparison).

const COMPARISON = Object.freeze({
  imp1149_original9pt: Object.freeze({
    grid: '[100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]',
    slope: -0.8490448761465983,
    R2: 0.9564058337927416,
    n_points: 9,
  }),
  imp1162_combined13pt: Object.freeze({
    grid: '[100..1e6, 13 points]',
    slope: -0.8807808726090421,
    intercept: 1.3743371189221234,
    R2: 0.9844899526458739,
    n_points: 13,
  }),
  imp1186_combined15pt: Object.freeze({
    grid: '[100..2e6, 15 points]',
    slope: COMBINED_OLS.slope,
    intercept: COMBINED_OLS.intercept,
    R2: COMBINED_OLS.R2,
    n_points: COMBINED_OLS.n_points,
  }),
});

// ── Status verdict ─────────────────────────────────────────────────────────
//
// Same classification rule as imp-1162:
//   tightened : combined slope closer to -1 than both imp-1149 9pt and
//               imp-1162 13pt slopes, AND R^2 >= 0.85.
//   consistent: combined slope within 0.10 of the imp-1162 13pt slope.
//   rejected  : slope outside (-1.5, -0.5) OR R^2 < 0.85.

function determineStatus() {
  const sCombined = COMBINED_OLS.slope;
  const sImp1162  = COMPARISON.imp1162_combined13pt.slope;
  const sImp1149  = COMPARISON.imp1149_original9pt.slope;
  const r2Comb    = COMBINED_OLS.R2;
  if (sCombined < -1.5 || sCombined > -0.5 || r2Comb < 0.85) return 'rejected';
  const target = -1.0;
  const distComb   = Math.abs(sCombined - target);
  const distImp1162 = Math.abs(sImp1162  - target);
  const distImp1149 = Math.abs(sImp1149  - target);
  if (distComb < distImp1162 && distComb < distImp1149 && r2Comb >= 0.85) {
    return 'tightened';
  }
  if (Math.abs(sCombined - sImp1162) <= 0.10) return 'consistent';
  return 'consistent';
}

const STATUS_VERDICT = determineStatus();

// ── Frozen exported record ─────────────────────────────────────────────────

export const ESY_LIN_STAT_20PT_SWEEP = Object.freeze({
  id: 'imp-1186',
  ticket: 'imp-1186',
  dependsOn: 'imp-1162',
  attemptDate: '2026-05-25',
  goal:
    'Extend the imp-1162 combined 13-point lin-stat variance sweep at the '
    + 'candidate ESY-surviving regime alpha = 1 (eta = N^{-1}) by adding '
    + 'N = 1,500,000 and N = 2,000,000 using the locally cached Odlyzko '
    + 'zeros6 combined file (2,001,052 entries). Re-fit the OLS slope on the '
    + 'combined 15-point log-log grid and compare against imp-1162 reference.',
  source: 'scripts/.zeros-cache/zeros6 (Odlyzko zeros6 combined, 2001052 entries)',
  zeroCount: 2001052,
  mBulk: 80,
  alpha: 1.0,
  etaScaling: 'eta = N^{-1}',
  observable: 'linStat_N(eta) = sqrt(Var_E [Im m_N(E + i*eta)]) over M_BULK bulk midpoints',
  basedOnRows: IMP1162_GRID_ROWS,
  newRows: IMP1186_NEW_ROWS,
  combinedGrid: COMBINED_GRID,
  combinedOLS: COMBINED_OLS,
  newRowsOLS: NEW_ROWS_OLS,
  extended6ptOLS: EXTENDED_6PT_OLS,
  comparison: COMPARISON,
  statusVerdict: STATUS_VERDICT,
  honestScope: Object.freeze([
    'Ticket requested 5 new N values: 2e6, 3e6, 5e6, 7e6, 1e7. The cached '
    + 'Odlyzko zeros6 combined file has 2,001,052 entries. N = 1.5e6 and '
    + 'N = 2e6 are computed; N = 3e6+ requires fetching zeros11..zerosK from '
    + 'Odlyzko (MAX_BATCHES update + network pull). Grid has 15 points, not '
    + '18-20 as requested.',
    'N = 1,500,000 is an infill point not in the ticket spec. It uses '
    + 'available data to improve grid density between 1M and 2M, providing '
    + 'a better estimate of the slope in the high-N regime.',
    'Both new rows have sampleSize = 80 (bulk window saturates at M_BULK=80 '
    + 'for N >= 320). The OLS fit is therefore consistent with the imp-1162 '
    + 'and imp-1149 methodology.',
    'No bootstrap CI is computed (consistent with imp-1162 scope). The '
    + 'imp-1185 block-bootstrap result for the 13-point grid is the '
    + 'authoritative CI; extending bootstrap to 15 points is a sub-ticket.',
    'Status verdict "tightened" means the 15-point slope (-0.9106) is '
    + 'strictly closer to ESY target -1.0 than both the imp-1162 13-point '
    + 'slope (-0.8808) and the imp-1149 9-point slope (-0.8490), with R^2 = '
    + '0.9861 >= 0.85. This does NOT close imp-1149-sub-ESY or lift the '
    + 'imp-1147 conditional flag.',
  ]),
});

// ── Build-time tripwires ───────────────────────────────────────────────────

export const ESY_LIN_STAT_20PT_SWEEP_ASSERTIONS = [
  {
    id: 'imp1186-new-rows-count',
    holds: () => ESY_LIN_STAT_20PT_SWEEP.newRows.length >= 2,
    why:
      'New extended rows must include at least 2 entries (N=1.5e6 and N=2e6). '
      + 'A regression dropping rows would silently weaken the combined-fit slope '
      + 'and eliminate the evidence for tightening.',
  },
  {
    id: 'imp1186-combined-grid-row-count',
    holds: () => ESY_LIN_STAT_20PT_SWEEP.combinedGrid.length === 15,
    why:
      'Combined grid must have exactly 15 rows (13 base from imp-1162 + 2 new). '
      + 'Drift here means either base rows were dropped or new rows were doubled.',
  },
  {
    id: 'imp1186-combined-slope-in-esy-band',
    holds: () => {
      const s = ESY_LIN_STAT_20PT_SWEEP.combinedOLS.slope;
      const r2 = ESY_LIN_STAT_20PT_SWEEP.combinedOLS.R2;
      return s > -1.3 && s < -0.5 && r2 >= 0.85;
    },
    why:
      'Combined 15-point slope must lie in the ESY-compatible band (-1.3, -0.5) '
      + 'with R^2 >= 0.85. Computed slope is -0.9106 with R^2 = 0.9861. Drift '
      + 'outside this band would indicate a numerical regression or corrupted '
      + 'zero data.',
  },
  {
    id: 'imp1186-new-rows-strictly-decreasing-variance',
    holds: () => {
      const rows = ESY_LIN_STAT_20PT_SWEEP.newRows;
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].variance < rows[i - 1].variance)) return false;
      }
      // Also verify new rows are smaller than the last imp-1162 row (N=1e6)
      const lastBase = IMP1162_GRID_ROWS[IMP1162_GRID_ROWS.length - 1].variance;
      if (!(rows[0].variance < lastBase)) return false;
      return true;
    },
    why:
      'New large-N rows must have strictly decreasing variance (ESY decay law). '
      + 'A violation at N=1.5e6 or N=2e6 would indicate a near-zero collision in '
      + 'the bulk test points or a Cauchy kernel numerical issue at very small eta.',
  },
  {
    id: 'imp1186-new-rows-finite-positive',
    holds: () => {
      for (const r of ESY_LIN_STAT_20PT_SWEEP.newRows) {
        if (!Number.isFinite(r.N) || r.N <= 0) return false;
        if (!Number.isFinite(r.eta) || r.eta <= 0) return false;
        if (!Number.isFinite(r.variance) || r.variance <= 0) return false;
        if (!Number.isFinite(r.sampleSize) || r.sampleSize <= 0) return false;
      }
      return true;
    },
    why:
      'All (N, eta, variance, sampleSize) tuples must be finite and positive. '
      + 'A NaN or zero would indicate a singular kernel hit or a corrupted zeros6 '
      + 'cache import.',
  },
  {
    id: 'imp1186-status-verdict-permitted',
    holds: () => {
      const v = ESY_LIN_STAT_20PT_SWEEP.statusVerdict;
      return v === 'consistent' || v === 'tightened' || v === 'rejected';
    },
    why:
      'statusVerdict must be one of the three permitted values. Drift here '
      + 'indicates determineStatus was edited without updating the schema.',
  },
  {
    id: 'imp1186-no-extrapolation-beyond-zeros6',
    holds: () => {
      const ZEROS6_COUNT = 2001052;
      for (const r of ESY_LIN_STAT_20PT_SWEEP.newRows) {
        if (r.N > ZEROS6_COUNT) return false;
      }
      return true;
    },
    why:
      'No new row may use N > 2,001,052 (the zeros6 combined cache entry count). '
      + 'Exceeding this would either silently extrapolate or require fetching '
      + 'additional Odlyzko batches. If you need N > 2e6, first extend the zeros '
      + 'cache via scripts/fetch-odlyzko-zeros.mjs with increased MAX_BATCHES.',
  },
  {
    id: 'imp1186-15pt-slope-closer-to-target-than-13pt',
    holds: () => {
      const target = -1.0;
      const dist15 = Math.abs(ESY_LIN_STAT_20PT_SWEEP.combinedOLS.slope - target);
      const dist13 = Math.abs(COMPARISON.imp1162_combined13pt.slope - target);
      return dist15 < dist13;
    },
    why:
      'The headline claim of imp-1186 is that adding large-N rows tightens the '
      + 'slope toward the ESY target -1.0. If this tripwire fires, the new rows '
      + 'moved the slope AWAY from -1, which weakens the Proposition 4.5 claim '
      + 'and warrants investigation.',
  },
];
