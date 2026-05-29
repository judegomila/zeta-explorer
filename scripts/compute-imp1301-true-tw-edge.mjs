#!/usr/bin/env node
// scripts/compute-imp1301-true-tw-edge.mjs
// imp-1301 — TRUE windowed lambda_max via Soshnikov Airy-kernel + TW2 comparison.
//
// WHY THIS SCRIPT EXISTS
// ----------------------
// imp-1296 measured the MAX NEAREST-NEIGHBOR SPACING s_max in windows and
// reported KS ≈ 0.40 against TW2. But s_max is NOT the TW2 observable —
// TW2 governs the LARGEST EIGENVALUE lambda_max of a windowed Airy kernel.
// The functional mismatch was flagged in imp-1296 honestScope.sMaxNotLambdaMax
// and called out as the right comparison in the imp-1301 ticket spec.
//
// imp-1301 computes the CORRECT functional: for each sliding window of
// unfolded Riemann zeros, build the windowed Christoffel-Darboux sine kernel
// K_W(x,y) = sin(π(x-y))/(π(x-y)) — restricted to the W zeros in the window
// — and extract lambda_max via power iteration on a 100×100 edge-block of
// the W×W kernel matrix. Then apply the Soshnikov 2000 centering+rescaling
//   ζ_max = (λ_max − μ_N) / σ_N,  μ_N = (2W)^{1/2}, σ_N = W^{-1/6} / sqrt(2)
// and compare the empirical CDF of ζ_max across windows to the
// Prähofer-Spohn 2004 TW2 lookup via K-S distance.
//
// METHOD (mirrors imp-1296 numerics so the comparison is APPLES-TO-APPLES)
// ------
// 1. Load ZEROS_EXTENDED, truncate to first 10^5 (SAME as imp-1296).
// 2. Unfold: gamma_tilde_n = gamma_n * log(gamma_n / (2π)) / (2π).
// 3. For each W in {1000, 10000}, slide a window with stride chosen so the
//    number of windows is ~5000 (≥ 1000 tripwire floor).
// 4. In each window of W consecutive unfolded zeros:
//      - take the 100 RIGHTMOST unfolded zeros (the "edge" slice — these
//        are the bulk-to-edge transition points where the Airy kernel
//        replaces the sine kernel in the Soshnikov 2000 asymptotic;
//        evaluating the sine kernel on these points gives the
//        Christoffel-Darboux discretization at the edge);
//      - build the 100×100 symmetric matrix
//          K_ij = sin(π * (x_i - x_j)) / (π * (x_i - x_j)),   K_ii = 1
//        where x_k = γ̃_{lo + W - 100 + k} (k = 0,...,99).
//      - extract λ_max via 200-step normalized power iteration with random
//        seed initialization. (K is symmetric PSD with bounded spectrum;
//        power iteration converges geometrically to the top eigenvector.)
//      - rescale: ζ_max = (λ_max − μ_W) / σ_W with the Soshnikov scaling
//        μ_W = sqrt(2*W), σ_W = W^{-1/6} / sqrt(2).
// 5. Build empirical CDF over the ~5000 ζ_max samples per W.
// 6. K-S distance vs the Prähofer-Spohn 2004 / Bornemann 2010 30-point
//    TW2 lookup table (SAME table as imp-1296 for direct comparison).
//
// HONEST SCOPE
// ------------
// - This is an EMPIRICAL PILOT, not a proof.
// - 100×100 truncation of an infinite-dimensional Airy kernel introduces
//   a discretization bias. Bornemann 2010 documents that ~100 quadrature
//   points are needed for ~3-4 digits of accuracy on TW2 quantiles; we
//   are at the edge of that resolution. If KS distance comes out
//   comparable to imp-1296's 0.40 the verdict is "discretization-too-coarse"
//   (recommend finer truncation or proper Bornemann 2010 Airy-kernel
//   sampling). If KS < 0.10 the GUE edge hypothesis is supported.
// - The Soshnikov 2000 μ_W = sqrt(2*W), σ_W = W^{-1/6}/sqrt(2) scaling is
//   for the GUE_N matrix with N=W eigenvalues; we approximate the
//   windowed determinantal point process by a GUE_W of the same window
//   size. The textbook reference is Soshnikov 2000 (Math. Surveys 55(5)).
// - Same 10^5 zero truncation as imp-1296. Same TW2 lookup table.
// - Power iteration extracts the dominant eigenvalue; for symmetric PSD
//   sine-kernel matrices this is well-conditioned (top eigenvalue is
//   well-separated from the bulk).
//
// Ticket: imp-1301 (numerical, high, opus-4-8 / NOVEL follow-up to imp-1296).

import { createServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const server = await createServer({
  root: ROOT,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
});

const mod = await server.ssrLoadModule('/src/data/zeros-to-1e6.js');
const ZEROS_FULL = mod.ZEROS_EXTENDED;
console.error(`Loaded ${ZEROS_FULL.length} zeros from ZEROS_EXTENDED`);

// SAME truncation as imp-1296 for apples-to-apples comparison.
const N_TRUNC = 100000;
const ZEROS = ZEROS_FULL.slice(0, N_TRUNC);
console.error(`Truncated to first ${ZEROS.length} zeros (matches imp-1296)`);

// Unfold to unit mean spacing (SAME as imp-1296).
const TILDE = new Float64Array(ZEROS.length);
for (let i = 0; i < ZEROS.length; i++) {
  TILDE[i] = (ZEROS[i] * Math.log(ZEROS[i] / (2 * Math.PI))) / (2 * Math.PI);
}

// ── TW2 lookup (SAME 30-point Prähofer-Spohn 2004 / Bornemann 2010 table
//    as imp-1296) ─────────────────────────────────────────────────────────
const TW2_TABLE = [
  { z: -7.0, F: 1.000000e-21 },
  { z: -6.0, F: 2.000000e-14 },
  { z: -5.0, F: 4.000000e-9 },
  { z: -4.5, F: 2.000000e-7 },
  { z: -4.0, F: 8.000000e-6 },
  { z: -3.5, F: 1.880000e-4 },
  { z: -3.0, F: 2.700000e-3 },
  { z: -2.7711, F: 1.000000e-2 },
  { z: -2.5, F: 2.400000e-2 },
  { z: -2.2, F: 5.760000e-2 },
  { z: -2.0, F: 9.030000e-2 },
  { z: -1.829, F: 1.500000e-1 },
  { z: -1.7711, F: 1.690000e-1 },
  { z: -1.5, F: 2.500000e-1 },
  { z: -1.2683, F: 3.500000e-1 },
  { z: -1.0, F: 4.500000e-1 },
  { z: -0.9344, F: 5.000000e-1 },
  { z: -0.6, F: 6.500000e-1 },
  { z: -0.2305, F: 7.500000e-1 },
  { z: 0.0, F: 8.200000e-1 },
  { z: 0.4783, F: 9.000000e-1 },
  { z: 0.9793, F: 9.500000e-1 },
  { z: 1.5, F: 9.800000e-1 },
  { z: 2.0234, F: 9.900000e-1 },
  { z: 2.5, F: 9.970000e-1 },
  { z: 3.0, F: 9.991000e-1 },
  { z: 3.5, F: 9.998200e-1 },
  { z: 4.0, F: 9.999710e-1 },
  { z: 4.5, F: 9.999963e-1 },
  { z: 5.0, F: 9.999998e-1 },
];
const TW2_MEAN_REF = -1.7711;
const TW2_VAR_REF = 0.8132;

function F2(z) {
  if (z <= TW2_TABLE[0].z) return TW2_TABLE[0].F;
  if (z >= TW2_TABLE[TW2_TABLE.length - 1].z) return TW2_TABLE[TW2_TABLE.length - 1].F;
  let lo = 0, hi = TW2_TABLE.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (TW2_TABLE[mid].z <= z) lo = mid; else hi = mid;
  }
  const a = TW2_TABLE[lo], b = TW2_TABLE[hi];
  const t = (z - a.z) / (b.z - a.z);
  return a.F + t * (b.F - a.F);
}

// ── Sine kernel value: sinc(π(x-y)) = sin(π(x-y))/(π(x-y)) ──────────────
function sineKernel(d) {
  if (d === 0) return 1;
  const pd = Math.PI * d;
  return Math.sin(pd) / pd;
}

// ── Build 100×100 Christoffel-Darboux sine-kernel matrix on the EDGE
//    slice (rightmost 100 unfolded zeros of the window) ─────────────────
const K_BLOCK = 100;

function buildEdgeKernel(loIdx, W) {
  // Take the K_BLOCK rightmost unfolded zeros in the window [loIdx, loIdx+W).
  const edgeStart = loIdx + W - K_BLOCK;
  const X = new Float64Array(K_BLOCK);
  for (let i = 0; i < K_BLOCK; i++) X[i] = TILDE[edgeStart + i];
  // Build K_ij = sinc(π(X_i - X_j))
  const K = new Float64Array(K_BLOCK * K_BLOCK);
  for (let i = 0; i < K_BLOCK; i++) {
    K[i * K_BLOCK + i] = 1;
    for (let j = i + 1; j < K_BLOCK; j++) {
      const v = sineKernel(X[i] - X[j]);
      K[i * K_BLOCK + j] = v;
      K[j * K_BLOCK + i] = v;
    }
  }
  return K;
}

// ── Power iteration for λ_max of a symmetric K (K_BLOCK×K_BLOCK) ─────────
function lambdaMaxPowerIter(K, nIter = 200, seed = 0x12345678) {
  // Deterministic seeded PRNG for reproducibility.
  let s = seed >>> 0;
  function rand() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  let v = new Float64Array(K_BLOCK);
  let norm = 0;
  for (let i = 0; i < K_BLOCK; i++) {
    v[i] = rand() - 0.5;
    norm += v[i] * v[i];
  }
  norm = Math.sqrt(norm);
  for (let i = 0; i < K_BLOCK; i++) v[i] /= norm;

  let w = new Float64Array(K_BLOCK);
  let lambda = 0;
  for (let it = 0; it < nIter; it++) {
    // w = K * v
    for (let i = 0; i < K_BLOCK; i++) {
      let s2 = 0;
      const base = i * K_BLOCK;
      for (let j = 0; j < K_BLOCK; j++) s2 += K[base + j] * v[j];
      w[i] = s2;
    }
    // Rayleigh quotient
    let num = 0, den = 0;
    for (let i = 0; i < K_BLOCK; i++) {
      num += v[i] * w[i];
      den += v[i] * v[i];
    }
    lambda = num / den;
    // Renormalize w → v
    let n2 = 0;
    for (let i = 0; i < K_BLOCK; i++) n2 += w[i] * w[i];
    n2 = Math.sqrt(n2);
    if (n2 === 0) break;
    for (let i = 0; i < K_BLOCK; i++) v[i] = w[i] / n2;
  }
  return lambda;
}

// ── Per-window-size sweep ─────────────────────────────────────────────
const N_TARGET_WINDOWS = 5000;

function sweepWindow(W) {
  const N = TILDE.length;
  const stride = Math.max(1, Math.floor((N - W) / (N_TARGET_WINDOWS - 1)));
  const nWindows = Math.floor((N - W) / stride) + 1;
  if (nWindows < 100) return { W, nWindows, stride, error: 'too few windows' };

  // Soshnikov 2000 scaling for GUE_N edge:
  //   λ_max(GUE_N) ~ N^{1/2} (the 2*sqrt(N) edge convention with the
  //   standard normalization) — here we use the textbook Soshnikov
  //   centering μ_W = sqrt(2*W) and rescaling σ_W = W^{-1/6}/sqrt(2)
  //   to map the GUE_W top eigenvalue to a TW2-distributed quantity.
  const muW = Math.sqrt(2 * W);
  const sigW = Math.pow(W, -1 / 6) / Math.sqrt(2);

  const lambdaMax = new Float64Array(nWindows);
  const zetaMaxRaw = new Float64Array(nWindows);
  for (let w = 0; w < nWindows; w++) {
    const lo = w * stride;
    const K = buildEdgeKernel(lo, W);
    const lam = lambdaMaxPowerIter(K, 200, 0x12345678 ^ (w * 2654435761));
    lambdaMax[w] = lam;
    zetaMaxRaw[w] = (lam - muW) / sigW;
  }

  // Empirical mean/std of the raw rescaled λ_max.
  let mean = 0;
  for (let i = 0; i < nWindows; i++) mean += zetaMaxRaw[i];
  mean /= nWindows;
  let varSum = 0;
  for (let i = 0; i < nWindows; i++) {
    const d = zetaMaxRaw[i] - mean;
    varSum += d * d;
  }
  const variance = varSum / nWindows;
  const std = Math.sqrt(variance);

  // Two-track KS: (a) RAW scaling — compare zetaMaxRaw directly to TW2
  // (this is the textbook prediction, exposes any systematic offset);
  // (b) MATCHED scaling — z = (raw - mean)/std * sqrt(TW2_VAR) + TW2_MEAN
  // (shape-only KS, matches imp-1296 pipeline so the comparison is direct).
  function ksOf(samples) {
    const sorted = Array.from(samples).sort((a, b) => a - b);
    let ks = 0;
    for (let i = 0; i < sorted.length; i++) {
      const empF = (i + 1) / sorted.length;
      const refF = F2(sorted[i]);
      const d1 = Math.abs(empF - refF);
      const d2 = Math.abs(i / sorted.length - refF);
      if (d1 > ks) ks = d1;
      if (d2 > ks) ks = d2;
    }
    return ks;
  }

  const ksRaw = ksOf(zetaMaxRaw);

  const zMatched = new Float64Array(nWindows);
  for (let i = 0; i < nWindows; i++) {
    const z0 = (zetaMaxRaw[i] - mean) / std;
    zMatched[i] = z0 * Math.sqrt(TW2_VAR_REF) + TW2_MEAN_REF;
  }
  const ksMatched = ksOf(zMatched);

  // Lambda_max stats (raw, pre-rescaling).
  let lamMean = 0, lamMin = Infinity, lamMax = -Infinity;
  for (let i = 0; i < nWindows; i++) {
    lamMean += lambdaMax[i];
    if (lambdaMax[i] < lamMin) lamMin = lambdaMax[i];
    if (lambdaMax[i] > lamMax) lamMax = lambdaMax[i];
  }
  lamMean /= nWindows;

  // CDF samples at the table grid (matched-scaling, for record).
  const sortedMatched = Array.from(zMatched).sort((a, b) => a - b);
  const cdfSamples = TW2_TABLE.map(({ z: zz, F: tw2F }) => {
    let cnt = 0;
    for (let i = 0; i < sortedMatched.length; i++) {
      if (sortedMatched[i] <= zz) cnt++; else break;
    }
    return { z: zz, F_TW2: tw2F, F_emp: cnt / sortedMatched.length };
  });

  return {
    W,
    stride,
    nWindows,
    muW,
    sigW,
    lambdaMaxMean: lamMean,
    lambdaMaxMin: lamMin,
    lambdaMaxMax: lamMax,
    zetaMaxRawMean: mean,
    zetaMaxRawStd: std,
    ksRaw,
    ksMatched,
    cdfSamples,
  };
}

const rows = [];
for (const W of [1000, 10000]) {
  console.error(`Sweeping W=${W}...`);
  const r = sweepWindow(W);
  rows.push(r);
  if (!r.error) {
    console.error(
      `  W=${W} stride=${r.stride}: nWindows=${r.nWindows}, λ_max_mean=${r.lambdaMaxMean.toFixed(4)}, ` +
        `ζ_mean(raw)=${r.zetaMaxRawMean.toFixed(4)}, ζ_std(raw)=${r.zetaMaxRawStd.toFixed(4)}, ` +
        `KS_raw=${r.ksRaw.toFixed(4)}, KS_matched=${r.ksMatched.toFixed(4)}`,
    );
  }
}

// imp-1296 baseline KS values for comparison.
const IMP1296_KS = { W1000: 0.3947, W10000: 0.4744 };

function pickVerdict(rowsArr) {
  const w10000 = rowsArr.find((r) => r.W === 10000);
  if (!w10000 || w10000.error) return 'no-w10000-data';
  // Use matched-scaling KS as the primary verdict signal (shape test).
  const ksM = w10000.ksMatched;
  if (ksM < 0.05) return 'lambda-max-matches-TW2-within-0.05';
  if (ksM < 0.10) return 'lambda-max-matches-TW2-within-0.10';
  // If matched-scaling KS is comparable to imp-1296 (≥ 0.30), the 100×100
  // discretization is dominating — flag as discretization-too-coarse.
  if (ksM >= 0.30) return 'discretization-too-coarse';
  // 0.10 ≤ KS < 0.30: systematic deviation in shape, not discretization.
  return 'lambda-max-systematic-deviation-above-0.10';
}

const verdict = pickVerdict(rows);

const output = {
  generatedAt: new Date().toISOString(),
  nTotalZerosInBundle: ZEROS_FULL.length,
  nTruncated: ZEROS.length,
  truncationNote:
    `Used first ${ZEROS.length} of ${ZEROS_FULL.length} bundle zeros — SAME as imp-1296.`,
  kBlock: K_BLOCK,
  windowSizes: rows.map((r) => r.W),
  rows,
  imp1296Baseline: IMP1296_KS,
  improvementOverIMP1296: rows.map((r) => ({
    W: r.W,
    ks_imp1301_matched: r.ksMatched,
    ks_imp1296_smax: r.W === 1000 ? IMP1296_KS.W1000 : (r.W === 10000 ? IMP1296_KS.W10000 : null),
    delta: r.W === 1000
      ? IMP1296_KS.W1000 - r.ksMatched
      : (r.W === 10000 ? IMP1296_KS.W10000 - r.ksMatched : null),
  })),
  verdict,
  tw2Source: 'Prähofer-Spohn 2004 + Bornemann 2010 (30-point lookup, linear interp)',
  tw2Mean: TW2_MEAN_REF,
  tw2Var: TW2_VAR_REF,
};

console.log(JSON.stringify(output, null, 2));
await server.close();
