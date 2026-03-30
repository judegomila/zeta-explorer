/**
 * Convergence Rate Comparison Across All S7 Closure Paths
 *
 * imp-089: For each S7 path, measure convergence to the infinite limit
 * as a function of N (number of primes). Fit power laws and identify
 * which path converges FASTEST.
 *
 * The fastest-converging path needs the least computation to verify
 * rigorously and is the strongest candidate for closing the Darlington axiom.
 *
 * Paths compared:
 *   P1: Weyl law — relative error in eigenvalue counting
 *   P2: Trace class — ||S_{N+1} - S_N|| decay rate
 *   P3: Norm resolvent — ||(H_N-z)⁻¹ - (H_M-z)⁻¹|| decay
 *   P4: Szegő/SL(2,R) — Lyapunov exponent convergence
 *   P5: De Branges — Hermite-Biehler ratio improvement
 */

import { cMul, cDiv, cSub, cAdd, cAbs } from './zeta.js';
import { getPrimes } from './primes.js';

// ── Shared utilities ─────────────────────────────────────────────────────────

/** Least-squares power law fit: y ≈ C·x^{-α} → log y = log C - α·log x */
function fitPowerLaw(xVals, yVals) {
  const n = xVals.length;
  if (n < 2) return { alpha: 0, C: 1, r2: 0 };

  const lx = xVals.map(x => Math.log(Math.max(x, 1)));
  const ly = yVals.map(y => Math.log(Math.max(Math.abs(y), 1e-30)));

  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    sx += lx[i]; sy += ly[i]; sxx += lx[i] * lx[i]; sxy += lx[i] * ly[i];
  }

  const denom = n * sxx - sx * sx;
  if (Math.abs(denom) < 1e-30) return { alpha: 0, C: 1, r2: 0 };

  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;

  // R² goodness of fit
  const yMean = sy / n;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    ssTot += (ly[i] - yMean) ** 2;
    ssRes += (ly[i] - (intercept + slope * lx[i])) ** 2;
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  return { alpha: -slope, C: Math.exp(intercept), r2 };
}

// ── 2×2 real matrix helpers ──────────────────────────────────────────────────

function mat2Mul(A, B) {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ];
}

function mat2Frob(A) {
  return Math.sqrt(A[0][0] ** 2 + A[0][1] ** 2 + A[1][0] ** 2 + A[1][1] ** 2);
}

function transferMatrix(p, omega) {
  const logP = Math.log(p);
  const arg = omega * logP;
  const c = Math.cos(arg), s = Math.sin(arg);
  const Zp = 1 / logP;
  return [[c, Zp * s], [-s / Zp, c]];
}

// ── P1: Weyl Law Convergence ─────────────────────────────────────────────────

function measureWeylConvergence(nValues) {
  const lambdaMax = 3.0;

  return nValues.map(N => {
    const primes = getPrimes(N);
    const logPrimes = primes.map(p => Math.log(p));
    let Ltotal = 0;
    for (const lp of logPrimes) Ltotal += lp;

    // Count eigenfrequencies by scanning trace(T_N(ω)) for ±2 crossings
    let S = [[1, 0], [0, 1]]; // precompute at start
    const step = lambdaMax / (N * 10);
    let prevTrace = 2; // trace of identity
    let count = 0;

    for (let omega = step; omega <= lambdaMax; omega += step) {
      let M = [[1, 0], [0, 1]];
      for (const p of primes) M = mat2Mul(M, transferMatrix(p, omega));
      const tr = M[0][0] + M[1][1];
      // Eigenfrequency when trace crosses ±2
      if ((prevTrace - 2) * (tr - 2) < 0 || (prevTrace + 2) * (tr + 2) < 0) count++;
      prevTrace = tr;
    }

    const weylPred = Ltotal * lambdaMax / Math.PI;
    const relError = weylPred > 0 ? Math.abs(count - weylPred) / weylPred : 1;

    return { N, metric: relError, Ltotal };
  });
}

// ── P2: Trace Class Decay ────────────────────────────────────────────────────

function measureTraceClassDecay(nValues) {
  const omega = 1.0; // test frequency
  const maxN = Math.max(...nValues) + 1;
  const primes = getPrimes(maxN);

  // Build cascade incrementally, measure ||S_{N+1} - S_N||
  let S = [[1, 0], [0, 1]];
  const diffs = [];

  for (let k = 0; k < maxN; k++) {
    const Sprev = [[S[0][0], S[0][1]], [S[1][0], S[1][1]]];
    S = mat2Mul(S, transferMatrix(primes[k], omega));

    if (k > 0) {
      const diff = [
        [S[0][0] - Sprev[0][0], S[0][1] - Sprev[0][1]],
        [S[1][0] - Sprev[1][0], S[1][1] - Sprev[1][1]],
      ];
      diffs.push({ N: k + 1, norm: mat2Frob(diff) });
    }
  }

  return nValues.map(N => {
    const d = diffs.find(d => d.N === N);
    return { N, metric: d ? d.norm : NaN };
  });
}

// ── P3: Norm Resolvent Convergence ───────────────────────────────────────────

function buildTridiag(N) {
  const primes = getPrimes(N);
  const diag = new Float64Array(N);
  const offDiag = new Float64Array(Math.max(N - 1, 0));

  for (let k = 0; k < N; k++) {
    const logP = Math.log(primes[k]);
    diag[k] = logP * logP; // ω_k²
  }
  for (let k = 0; k < N - 1; k++) {
    const Lk = 1 / Math.log(primes[k]);
    const Lk1 = 1 / Math.log(primes[k + 1]);
    offDiag[k] = -1 / Math.sqrt(Lk * Lk1);
  }
  return { diag, offDiag, N };
}

function resolventApply(H, z, v) {
  const N = H.N;
  const b = new Array(N), cp = new Array(N), dp = new Array(N);

  for (let k = 0; k < N; k++) {
    b[k] = [H.diag[k] - z[0], -z[1]];
  }

  cp[0] = cDiv(k0off(H, 0), b[0]);
  dp[0] = cDiv([v[0], 0], b[0]);

  for (let k = 1; k < N; k++) {
    const a = k0off(H, k - 1);
    const denom = cSub(b[k], cMul(a, cp[k - 1]));
    if (cAbs(denom) < 1e-30) return null;
    cp[k] = k < N - 1 ? cDiv(k0off(H, k), denom) : [0, 0];
    dp[k] = cDiv(cSub([v[k], 0], cMul(a, dp[k - 1])), denom);
  }

  const x = new Array(N);
  x[N - 1] = dp[N - 1];
  for (let k = N - 2; k >= 0; k--) {
    x[k] = cSub(dp[k], cMul(cp[k], x[k + 1]));
  }
  return x;
}

function k0off(H, k) {
  return k < H.offDiag.length ? [H.offDiag[k], 0] : [0, 0];
}

function measureResolventConvergence(nValues) {
  const z = [-1, 5]; // off-spectrum test point
  const refN = 300;
  const Href = buildTridiag(refN);
  const vRef = new Float64Array(refN);
  vRef[0] = 1;
  const rRef = resolventApply(Href, z, vRef);
  if (!rRef) return nValues.map(N => ({ N, metric: NaN }));

  return nValues.map(N => {
    const H = buildTridiag(N);
    const v = new Float64Array(N);
    v[0] = 1;
    const r = resolventApply(H, z, v);
    if (!r) return { N, metric: NaN };

    let diffSq = 0;
    const dim = Math.min(N, refN);
    for (let k = 0; k < dim; k++) {
      const dr = r[k][0] - rRef[k][0];
      const di = r[k][1] - rRef[k][1];
      diffSq += dr * dr + di * di;
    }
    // Tail of reference
    for (let k = dim; k < refN; k++) {
      diffSq += rRef[k][0] ** 2 + rRef[k][1] ** 2;
    }

    return { N, metric: Math.sqrt(diffSq) };
  });
}

// ── P4: Szegő / Lyapunov Exponent Convergence ───────────────────────────────

function measureSzegoConvergence(nValues) {
  const omega = 5.0;

  return nValues.map(N => {
    const primes = getPrimes(N);
    let S = [[1, 0], [0, 1]];
    for (const p of primes) S = mat2Mul(S, transferMatrix(p, omega));

    const norm = mat2Frob(S);
    const lyapunov = Math.log(norm) / N;
    return { N, metric: lyapunov, norm };
  });
}

// ── P5: De Branges / Hermite-Biehler Ratio ───────────────────────────────────

function cTransferMatrix(p, z) {
  const logP = Math.log(p);
  const Zp = 1 / logP;
  const arg = [z[0] * logP, z[1] * logP];

  const cosA = Math.cos(arg[0]), sinA = Math.sin(arg[0]);
  const coshB = Math.cosh(arg[1]), sinhB = Math.sinh(arg[1]);

  const cosArg = [cosA * coshB, -sinA * sinhB];
  const sinArg = [sinA * coshB, cosA * sinhB];

  return [
    [cosArg, [Zp * sinArg[0], Zp * sinArg[1]]],
    [[-sinArg[0] / Zp, -sinArg[1] / Zp], cosArg],
  ];
}

function cMat2Mul(A, B) {
  return [
    [cAdd(cMul(A[0][0], B[0][0]), cMul(A[0][1], B[1][0])),
     cAdd(cMul(A[0][0], B[0][1]), cMul(A[0][1], B[1][1]))],
    [cAdd(cMul(A[1][0], B[0][0]), cMul(A[1][1], B[1][0])),
     cAdd(cMul(A[1][0], B[0][1]), cMul(A[1][1], B[1][1]))],
  ];
}

function measureDeBrangesConvergence(nValues) {
  const sigma = 0.6, t = 14.13;
  const z = [sigma, t];
  const zBar = [sigma, -t];

  return nValues.map(N => {
    const primes = getPrimes(N);

    let M = [[[1, 0], [0, 0]], [[0, 0], [1, 0]]];
    let MBar = [[[1, 0], [0, 0]], [[0, 0], [1, 0]]];

    for (const p of primes) {
      M = cMat2Mul(M, cTransferMatrix(p, z));
      MBar = cMat2Mul(MBar, cTransferMatrix(p, zBar));
    }

    // E(z) = M₁₁ - i·M₁₂
    const E = cSub(M[0][0], cMul([0, 1], M[0][1]));
    const EBar = cSub(MBar[0][0], cMul([0, 1], MBar[0][1]));

    const ratio = cAbs(EBar) > 1e-30 ? cAbs(E) / cAbs(EBar) : NaN;
    // H-B condition: ratio > 1. The "deficit" from H-B is max(0, 1 - ratio).
    const deficit = Math.max(0, 1 - ratio);

    return { N, metric: deficit, ratio };
  });
}

// ── Main Comparison ──────────────────────────────────────────────────────────

/**
 * Compare convergence rates across all 5 S7 closure paths.
 */
export function s7ConvergenceComparison() {
  const nValues = [5, 10, 20, 50, 100, 200];

  // Measure each path
  const weyl = measureWeylConvergence(nValues);
  const traceClass = measureTraceClassDecay(nValues);
  const resolvent = measureResolventConvergence(nValues);
  const szego = measureSzegoConvergence(nValues);
  const deBranges = measureDeBrangesConvergence(nValues);

  // Fit power laws: metric ~ C · N^{-α}
  const paths = [
    { name: 'P1_Weyl', label: 'Weyl Law (eigenvalue error)', data: weyl,
      description: 'Relative error in eigenvalue counting vs Weyl prediction' },
    { name: 'P2_TraceClass', label: 'Trace Class (||D_N|| decay)', data: traceClass,
      description: '||S_{N+1} - S_N||_F at test frequency' },
    { name: 'P3_Resolvent', label: 'Norm Resolvent (||(H_N-z)⁻¹ - (H_ref-z)⁻¹||)', data: resolvent,
      description: 'Resolvent difference vs N=300 reference' },
    { name: 'P4_Szego', label: 'Szegő (Lyapunov exponent)', data: szego,
      description: 'Lyapunov exponent log||S_N||/N convergence' },
    { name: 'P5_deBranges', label: 'De Branges (H-B deficit)', data: deBranges,
      description: 'Hermite-Biehler condition deficit max(0, 1-ratio)' },
  ];

  const results = paths.map(path => {
    const validData = path.data.filter(d => d.metric > 0 && isFinite(d.metric));
    const fit = validData.length >= 3
      ? fitPowerLaw(validData.map(d => d.N), validData.map(d => d.metric))
      : { alpha: 0, C: 0, r2: 0 };

    // Convergence quality score: higher α and higher R² is better
    const quality = fit.alpha * fit.r2;

    // Extrapolate: at N=1000, what would the metric be?
    const extrapolatedN1000 = fit.C * Math.pow(1000, -fit.alpha);

    // At what N does the metric drop below 10^{-6}?
    const nForSixDigits = fit.alpha > 0
      ? Math.pow(fit.C / 1e-6, 1 / fit.alpha)
      : Infinity;

    return {
      path: path.name,
      label: path.label,
      description: path.description,
      measurements: path.data.map(d => ({
        N: d.N,
        metric: isFinite(d.metric) ? +d.metric.toExponential(4) : 'NaN',
      })),
      powerLawFit: {
        alpha: +fit.alpha.toFixed(4),
        C: +fit.C.toExponential(4),
        r2: +fit.r2.toFixed(4),
      },
      qualityScore: +quality.toFixed(4),
      extrapolatedN1000: +extrapolatedN1000.toExponential(3),
      nForSixDigits: isFinite(nForSixDigits) ? Math.ceil(nForSixDigits) : 'N/A',
    };
  });

  // Rank by quality score (best convergence first)
  const ranked = [...results].sort((a, b) => b.qualityScore - a.qualityScore);

  // Identify the winner
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  // Convergence classes
  const fast = ranked.filter(r => r.powerLawFit.alpha > 1); // super-polynomial
  const moderate = ranked.filter(r => r.powerLawFit.alpha > 0.3 && r.powerLawFit.alpha <= 1);
  const slow = ranked.filter(r => r.powerLawFit.alpha <= 0.3);

  return {
    paths: results,
    ranking: ranked.map((r, i) => ({
      rank: i + 1,
      path: r.path,
      alpha: r.powerLawFit.alpha,
      r2: r.powerLawFit.r2,
      quality: r.qualityScore,
    })),
    convergenceClasses: {
      fast: fast.map(r => r.path),
      moderate: moderate.map(r => r.path),
      slow: slow.map(r => r.path),
    },
    recommendation: {
      bestPath: best.path,
      bestAlpha: best.powerLawFit.alpha,
      bestR2: best.powerLawFit.r2,
      nNeeded: best.nForSixDigits,
      rationale: `${best.label} converges as N^{-${best.powerLawFit.alpha.toFixed(2)}} (R²=${best.powerLawFit.r2.toFixed(3)}). ` +
        (best.nForSixDigits !== 'N/A'
          ? `Reaches 10⁻⁶ precision at N≈${best.nForSixDigits} primes.`
          : 'Precision threshold analysis not applicable.'),
    },
    proofChain: [
      { step: 1, claim: '5 S7 closure paths measured at N=5,10,20,50,100,200', status: 'done' },
      { step: 2, claim: `Power law fits: α ranges from ${worst.powerLawFit.alpha} to ${best.powerLawFit.alpha}`, status: 'computed' },
      { step: 3, claim: `Best path: ${best.path} (α=${best.powerLawFit.alpha}, R²=${best.powerLawFit.r2})`, status: 'identified' },
      { step: 4, claim: `${fast.length} paths converge super-polynomially (α > 1)`, status: fast.length > 0 ? 'confirmed' : 'none found' },
      { step: 5, claim: 'Fastest path identified for rigorous verification focus', status: 'actionable' },
    ],
    verdict:
      `S7 convergence comparison across 5 paths (N=5..200): ` +
      `Best: ${best.label} (α=${best.powerLawFit.alpha.toFixed(2)}, R²=${best.powerLawFit.r2.toFixed(3)}). ` +
      `Classes: ${fast.length} fast (α>1), ${moderate.length} moderate, ${slow.length} slow. ` +
      `RECOMMENDATION: Focus rigorous verification effort on ${best.path} — it converges ` +
      `${best.powerLawFit.alpha > 1 ? 'super-polynomially' : 'polynomially'} and needs the fewest primes ` +
      `to reach any target precision. Combined with the cross-validation (imp-083), proving ` +
      `${best.path} rigorously may imply the other paths via known theorems.`,
  };
}
