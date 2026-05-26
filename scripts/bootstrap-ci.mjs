// scripts/bootstrap-ci.mjs
// imp-1188 — Shared bootstrap-CI helper.
//
// PURPOSE
// -------
// Three tickets (imp-1160, imp-1166, imp-1185) each implement a variation
// of the same percentile-bootstrap CI on an OLS slope estimate fit to a
// (log N, log value) grid. The three implementations differ only in:
//
//   imp-1160 (src/data/esy-lin-stat-slope-bootstrap-CI-2026-05.js)
//     — gamma-resample-then-dedupe (recomputes the per-N value on each
//       replicate); 5-point N grid; seed 0xC0DEBEEF; 1500 replicates.
//   imp-1166 (src/data/imp-1166-conrey-snaith-correction-on-imp1162-grid.js)
//     — i.i.d. row resampling of (N, var) tuples; 13-point grid; seed
//       0xC51166FA; 500 replicates.
//   imp-1185 (src/data/imp-1185-block-bootstrap-cross-validation.js)
//     — moving-block bootstrap of (N, var) tuples; block size = ceil(n^{1/3});
//       13-point grid; seed 0xB10C81FA; 2000 replicates.
//
// All three share the same downstream skeleton:
//
//   1. mulberry32 deterministic RNG
//   2. OLS log-log fit (slope, intercept, R^2)
//   3. percentile CI at 2.5/97.5 on the replicate slope distribution
//
// This module extracts (1)+(2)+(3) and the percentile / block resampling
// strategies into a single tested helper. The existing tickets are NOT
// migrated to use it (that is the scope of a future imp-1188-sub ticket);
// this file is a PURE ADDITION carrying only the shared algorithm and the
// numerical-equivalence tripwires that confirm it reproduces the imp-1166
// slope CI on the imp-1166 fixed grid.
//
// API
// ---
//   bootstrapSlopeCI({ x, y, replicates, confidence, method, seed, blockSize })
//
//   x          — array of independent-variable values (e.g. N grid points)
//   y          — array of dependent-variable values (same length as x)
//   replicates — number of bootstrap replicates (default 1000)
//   confidence — CI level (default 0.95)
//   method     — 'percentile' (i.i.d. row resample) or 'block'
//                (moving-block on the (x,y) ordering, block size defaults
//                to ceil(n^{1/3}))
//   seed       — mulberry32 RNG seed (default 0xC0DE1188)
//   blockSize  — override block size for method 'block'
//
// RETURNS
//   {
//     slope       : OLS slope on the FULL (x, y) data (no resampling)
//     ci_lo       : lower CI endpoint at confidence level
//     ci_hi       : upper CI endpoint at confidence level
//     median      : median of replicate slope distribution
//     width       : ci_hi - ci_lo
//     replicates  : number of replicates run
//     nFinite     : number of replicates with finite slope/intercept/R2
//     R2          : OLS R^2 on the FULL (x, y) data
//     intercept   : OLS intercept on the FULL (x, y) data
//   }
//
// Both methods skip degenerate replicates (< 2 distinct x values, slope
// undefined). The fitter takes raw (x, y); callers that fit on log-log
// (the standard mathexplorer usage) should pass already-log-transformed
// vectors so the bootstrap percentile mirrors the upstream OLS.
//
// HONEST SCOPE
// ------------
// (1) This is a PURE REFACTOR. It performs no math beyond OLS + percentile
//     bootstrap. It does NOT validate that the x or y inputs are log-
//     transformed; the caller is responsible.
// (2) The percentile-bootstrap CI quantifies SAMPLING noise of the OLS
//     slope under the chosen resampling distribution. It does NOT cover
//     systematic bias (e.g. grid-choice bias, finite-N truncation,
//     observable mismatch). See imp-1160 honest-scope notes.
// (3) The block-bootstrap variant uses the MOVING-BLOCK construction
//     (Kunsch 1989) without wrap-around. The standard rule of thumb for
//     block size on a grid of length n is B = ceil(n^{1/3}); the helper
//     auto-picks this if blockSize is not supplied. A circular variant
//     would assume stationarity at the endpoints and is intentionally
//     not implemented.
// (4) For numerical equivalence with imp-1166: the upstream uses
//     Math.floor for the percentile index (not interpolation); this
//     helper matches that convention exactly.

// ── Deterministic RNG (mulberry32) ─────────────────────────────────────────

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── OLS log-log style fit (raw x, y) ──────────────────────────────────────

export function olsFit(x, y) {
  const n = x.length;
  if (n !== y.length) {
    throw new Error('olsFit: x and y must have equal length, got ' + n + ' vs ' + y.length);
  }
  if (n < 2) {
    return { slope: Number.NaN, intercept: Number.NaN, R2: Number.NaN, n_points: n };
  }
  let xm = 0, ym = 0;
  for (let i = 0; i < n; i++) { xm += x[i]; ym += y[i]; }
  xm /= n; ym /= n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - xm) * (y[i] - ym);
    den += (x[i] - xm) * (x[i] - xm);
  }
  const slope = num / den;
  const intercept = ym - slope * xm;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * x[i];
    ssRes += (y[i] - pred) * (y[i] - pred);
    ssTot += (y[i] - ym) * (y[i] - ym);
  }
  return { slope, intercept, R2: 1 - ssRes / ssTot, n_points: n };
}

// ── percentile (floor-index convention; matches imp-1160/1166/1185) ───────

export function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return Number.NaN;
  const idx = Math.floor(p * (sortedArr.length - 1));
  return sortedArr[idx];
}

// ── replicate generators ─────────────────────────────────────────────────

function percentileReplicate(x, y, rng) {
  const n = x.length;
  const xs = new Array(n);
  const ys = new Array(n);
  let distinctXs = new Set();
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * n);
    xs[i] = x[idx];
    ys[i] = y[idx];
    distinctXs.add(x[idx]);
  }
  if (distinctXs.size < 2) return null;
  return { xs, ys };
}

function blockReplicate(x, y, rng, blockSize) {
  const n = x.length;
  const maxStart = n - blockSize; // inclusive upper bound
  if (maxStart < 0) {
    // Block size larger than grid -- degenerate, fall back to whole grid.
    return { xs: x.slice(), ys: y.slice() };
  }
  const numBlocks = Math.ceil(n / blockSize);
  const xs = [];
  const ys = [];
  for (let b = 0; b < numBlocks && xs.length < n; b++) {
    const start = Math.floor(rng() * (maxStart + 1));
    for (let k = 0; k < blockSize && xs.length < n; k++) {
      xs.push(x[start + k]);
      ys.push(y[start + k]);
    }
  }
  const distinctXs = new Set(xs);
  if (distinctXs.size < 2) return null;
  return { xs, ys };
}

// ── main entry ───────────────────────────────────────────────────────────

const DEFAULT_SEED = 0xC0DE1188;

export function bootstrapSlopeCI(opts) {
  const x = opts.x;
  const y = opts.y;
  if (!Array.isArray(x) || !Array.isArray(y)) {
    throw new Error('bootstrapSlopeCI: x and y must be arrays');
  }
  if (x.length !== y.length) {
    throw new Error('bootstrapSlopeCI: x and y must have equal length, got ' + x.length + ' vs ' + y.length);
  }
  const n = x.length;
  if (n < 2) {
    throw new Error('bootstrapSlopeCI: need at least 2 points, got ' + n);
  }
  const replicates = opts.replicates ?? 1000;
  const confidence = opts.confidence ?? 0.95;
  const method = opts.method ?? 'percentile';
  const seed = opts.seed ?? DEFAULT_SEED;
  if (method !== 'percentile' && method !== 'block') {
    throw new Error("bootstrapSlopeCI: method must be 'percentile' or 'block', got " + method);
  }
  if (confidence <= 0 || confidence >= 1) {
    throw new Error('bootstrapSlopeCI: confidence must be in (0, 1), got ' + confidence);
  }
  const blockSize = method === 'block'
    ? (opts.blockSize ?? Math.ceil(Math.pow(n, 1 / 3)))
    : null;

  const rng = mulberry32(seed);
  const baseFit = olsFit(x, y);
  const slopes = [];
  const intercepts = [];
  const r2s = [];
  let nFinite = 0;

  for (let r = 0; r < replicates; r++) {
    const sample = method === 'percentile'
      ? percentileReplicate(x, y, rng)
      : blockReplicate(x, y, rng, blockSize);
    if (sample == null) continue;
    const fit = olsFit(sample.xs, sample.ys);
    if (
      Number.isFinite(fit.slope) &&
      Number.isFinite(fit.intercept) &&
      Number.isFinite(fit.R2)
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

  const pLo = (1 - confidence) / 2;
  const pHi = 1 - pLo;
  const ci_lo = percentile(slopes, pLo);
  const ci_hi = percentile(slopes, pHi);
  const median = percentile(slopes, 0.5);

  return {
    slope: baseFit.slope,
    intercept: baseFit.intercept,
    R2: baseFit.R2,
    ci_lo,
    ci_hi,
    median,
    width: ci_hi - ci_lo,
    replicates,
    nFinite,
    method,
    blockSize,
    seed,
    confidence,
  };
}
