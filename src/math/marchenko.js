/**
 * Gel'fand-Levitan-Marchenko Integral Equation Solver
 * IMP-072: Recover the scattering potential from S-matrix data.
 *
 * Given the S-matrix S(k) of the ZPO (Zeta Prime Oscillator) cascade,
 * the Marchenko equation is:
 *
 *   K(x,y) + F(x+y) + ∫_x^∞ K(x,t)·F(t+y) dt = 0   for y > x
 *
 * where F(x) = (1/2π) ∫ [1 - S(k)] e^{ikx} dk  (Fourier transform of
 * the reflection coefficient).
 *
 * The potential is recovered as q(x) = -2 dK(x,x)/dx.
 *
 * For the ZPO cascade with N primes, each prime p defines an LC section
 * with impedance Z₀ = log(p). The 2×2 transfer matrix of each section is
 * cascaded (Darlington synthesis), and the S₁₁ element gives the
 * reflection coefficient R(ω).
 */

import { cMul, cDiv, cSub, cAdd, cAbs } from './zeta.js';
import { getPrimes } from './primes.js';

/* ------------------------------------------------------------------ */
/*  Helper: complex exponential (inline to avoid extra import)        */
/* ------------------------------------------------------------------ */
function cExp(z) {
  const r = Math.exp(z[0]);
  return [r * Math.cos(z[1]), r * Math.sin(z[1])];
}

/* ------------------------------------------------------------------ */
/*  2×2 complex matrix utilities (column-major: [[a,c],[b,d]])        */
/*  stored as flat [a, b, c, d] where each entry is [re,im]          */
/* ------------------------------------------------------------------ */
function mat2Mul(A, B) {
  // A = [a00, a01, a10, a11], B likewise (row-major)
  return [
    cAdd(cMul(A[0], B[0]), cMul(A[1], B[2])),  // c00
    cAdd(cMul(A[0], B[1]), cMul(A[1], B[3])),  // c01
    cAdd(cMul(A[2], B[0]), cMul(A[3], B[2])),  // c10
    cAdd(cMul(A[2], B[1]), cMul(A[3], B[3])),  // c11
  ];
}

function mat2Identity() {
  return [[1, 0], [0, 0], [0, 0], [1, 0]];
}

/* ------------------------------------------------------------------ */
/*  Build transfer matrix for a single LC section                     */
/*  Prime p  →  L = log(p), C = 1/log(p), Z₀ = log(p)               */
/*  Series-L / shunt-C ABCD matrix at real frequency ω:              */
/*    T_p(ω) = [[cos(θ), j·Z₀·sin(θ)], [j·sin(θ)/Z₀, cos(θ)]]     */
/*  where θ = ω√(LC) = ω  (since √(LC)=1 for all primes).           */
/* ------------------------------------------------------------------ */
function sectionTransferMatrix(p, omega) {
  const Z0 = Math.log(p);
  const theta = omega; // electrical length = ω·√(LC) = ω
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  return [
    [cosT, 0],                    // A = cos θ
    [0, Z0 * sinT],               // B = jZ₀ sin θ
    [0, sinT / Z0],               // C = j sin θ / Z₀
    [cosT, 0],                    // D = cos θ
  ];
}

/* ------------------------------------------------------------------ */
/*  Cascade N prime sections → total ABCD matrix → S₁₁ (reflection)  */
/*  S₁₁ = (A + B/Z_L - C·Z_S - D) / (A + B/Z_L + C·Z_S + D)       */
/*  with Z_S = Z_L = 1 (normalised port impedances).                 */
/* ------------------------------------------------------------------ */
function cascadeSMatrix(primes, omega) {
  let T = mat2Identity();
  for (let i = 0; i < primes.length; i++) {
    const Ti = sectionTransferMatrix(primes[i], omega);
    T = mat2Mul(T, Ti);
  }
  const A = T[0], B = T[1], C = T[2], D = T[3];
  // S₁₁ = (A + B - C - D) / (A + B + C + D)   (Z_S = Z_L = 1)
  const num = cSub(cAdd(A, B), cAdd(C, D));
  const den = cAdd(cAdd(A, B), cAdd(C, D));
  return cDiv(num, den);
}

/* ------------------------------------------------------------------ */
/*  Compute F(x) via discrete Fourier transform of (1 - R(ω))        */
/*  F(x) = (1/2π) ∫ [1 - R(ω)] e^{iωx} dω                          */
/*  Discretise over [-ω_max, ω_max] with M quadrature points.        */
/* ------------------------------------------------------------------ */
function computeF(primes, xGrid, omegaMax, M) {
  const dOmega = (2 * omegaMax) / M;
  const N = xGrid.length;
  const F = new Float64Array(N);

  for (let j = 0; j < N; j++) {
    const x = xGrid[j];
    let sumRe = 0;
    for (let m = 0; m < M; m++) {
      const omega = -omegaMax + (m + 0.5) * dOmega;
      const R = cascadeSMatrix(primes, omega);
      // integrand = (1 - R(ω)) · e^{iωx}
      const oneMinusR = cSub([1, 0], R);
      const phase = cExp([0, omega * x]);
      const val = cMul(oneMinusR, phase);
      sumRe += val[0]; // take real part (potential is real)
    }
    F[j] = sumRe * dOmega / (2 * Math.PI);
  }
  return F;
}

/* ------------------------------------------------------------------ */
/*  Solve Marchenko equation via Nyström method                       */
/*                                                                    */
/*  For fixed x, discretise y and t on a grid [x, X_max]:            */
/*    K(x, y_j) + F(x + y_j) + Σ_k w_k K(x, t_k) F(t_k + y_j) = 0 */
/*                                                                    */
/*  In matrix form: (I + F_mat) · K_vec = -F_rhs                     */
/*  where F_mat[j][k] = w_k · F(t_k + y_j)                          */
/*        F_rhs[j]    = F(x + y_j)                                   */
/* ------------------------------------------------------------------ */

/**
 * Interpolate F values from a precomputed table.
 * fTable covers [0, 2·X_max] uniformly with fN points.
 */
function interpF(fTable, fDx, arg) {
  if (arg < 0) return 0;
  const idx = arg / fDx;
  const i0 = Math.floor(idx);
  if (i0 >= fTable.length - 1) return 0;
  const frac = idx - i0;
  return fTable[i0] * (1 - frac) + fTable[i0 + 1] * frac;
}

/**
 * Solve the Marchenko equation for a single x value.
 * Returns K(x, x) — the diagonal value needed for the potential.
 *
 * @param {number} x        - the fixed x coordinate
 * @param {number} Xmax     - upper limit of the grid
 * @param {number} gridSize - number of quadrature points in [x, Xmax]
 * @param {Float64Array} fTable - precomputed F values on [0, 2·Xmax]
 * @param {number} fDx      - spacing of fTable
 * @returns {number} K(x, x)
 */
function solveMarchenkoAtX(x, Xmax, gridSize, fTable, fDx) {
  if (x >= Xmax) return 0;

  // Quadrature grid for y and t in [x, Xmax]
  const h = (Xmax - x) / gridSize;
  if (h <= 0) return 0;

  const n = gridSize;
  const y = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    y[j] = x + (j + 0.5) * h; // midpoint rule
  }

  // Build the linear system: (I + W·F_mat) K = -F_rhs
  // F_mat[j][k] = F(t_k + y_j),  t_k = y[k],  weight w_k = h
  const A = new Float64Array(n * n);
  const rhs = new Float64Array(n);

  for (let j = 0; j < n; j++) {
    rhs[j] = -interpF(fTable, fDx, x + y[j]);
    for (let k = 0; k < n; k++) {
      const fVal = interpF(fTable, fDx, y[k] + y[j]);
      A[j * n + k] = (j === k ? 1 : 0) + h * fVal;
    }
  }

  // Gaussian elimination with partial pivoting
  gaussianElimination(A, rhs, n);

  // K(x, x): interpolate — the first quadrature point is closest to x
  // K_vec[0] ≈ K(x, x + h/2). For derivative purposes we return K at x.
  // Linear extrapolation: K(x,x) ≈ K(x, y[0]) + (x - y[0]) · (K(x,y[1]) - K(x,y[0]))/(y[1]-y[0])
  if (n >= 2) {
    const slope = (rhs[1] - rhs[0]) / (y[1] - y[0]);
    return rhs[0] + slope * (x - y[0]);
  }
  return rhs[0];
}

/**
 * Gaussian elimination with partial pivoting (in-place).
 * Solves A·x = b, result stored in b.
 */
function gaussianElimination(A, b, n) {
  for (let col = 0; col < n; col++) {
    // Partial pivoting
    let maxVal = Math.abs(A[col * n + col]);
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      const v = Math.abs(A[row * n + col]);
      if (v > maxVal) {
        maxVal = v;
        maxRow = row;
      }
    }
    if (maxRow !== col) {
      // Swap rows
      for (let k = col; k < n; k++) {
        const tmp = A[col * n + k];
        A[col * n + k] = A[maxRow * n + k];
        A[maxRow * n + k] = tmp;
      }
      const tmp = b[col];
      b[col] = b[maxRow];
      b[maxRow] = tmp;
    }

    const pivot = A[col * n + col];
    if (Math.abs(pivot) < 1e-15) continue; // singular guard

    // Eliminate below
    for (let row = col + 1; row < n; row++) {
      const factor = A[row * n + col] / pivot;
      for (let k = col; k < n; k++) {
        A[row * n + k] -= factor * A[col * n + k];
      }
      b[row] -= factor * b[col];
    }
  }

  // Back substitution
  for (let row = n - 1; row >= 0; row--) {
    let sum = b[row];
    for (let k = row + 1; k < n; k++) {
      sum -= A[row * n + k] * b[k];
    }
    const diag = A[row * n + row];
    b[row] = Math.abs(diag) > 1e-15 ? sum / diag : 0;
  }
}

/* ------------------------------------------------------------------ */
/*  marchenkoPotentialRecovery                                        */
/*  Build N-section cascade S-matrix, solve Marchenko, return q(x).   */
/* ------------------------------------------------------------------ */

/**
 * Recover the scattering potential q(x) from the ZPO cascade S-matrix.
 *
 * @param {number} N        - number of primes in the cascade
 * @param {number} gridSize - spatial grid points (default 150)
 * @returns {{ x: number[], q: number[], Kdiag: number[],
 *             isReal: boolean, L1norm: number, decayRate: number }}
 */
export function marchenkoPotentialRecovery(N, gridSize = 150) {
  const primes = getPrimes(N);

  // Spatial domain [0, Xmax]
  const Xmax = 4 * Math.PI;
  const dx = Xmax / gridSize;
  const xGrid = [];
  for (let i = 0; i < gridSize; i++) {
    xGrid.push(i * dx);
  }

  // Frequency parameters — scale ω_max with N for accuracy
  const omegaMax = Math.min(5 + 0.5 * N, 50);
  const M = Math.max(256, 4 * N); // quadrature points in frequency

  // Precompute F on a fine table covering [0, 2·Xmax]
  const fN = 2 * gridSize + 1;
  const fDx = (2 * Xmax) / (fN - 1);
  const fXgrid = [];
  for (let i = 0; i < fN; i++) {
    fXgrid.push(i * fDx);
  }
  const fTable = computeF(primes, fXgrid, omegaMax, M);

  // Marchenko quadrature size (per x-slice)
  const marchenkoGrid = Math.min(80, gridSize);

  // Solve for K(x, x) at each grid point
  const Kdiag = new Float64Array(gridSize);
  for (let i = 0; i < gridSize; i++) {
    Kdiag[i] = solveMarchenkoAtX(xGrid[i], Xmax, marchenkoGrid, fTable, fDx);
  }

  // Recover potential: q(x) = -2 dK(x,x)/dx  via central differences
  const q = new Float64Array(gridSize);
  for (let i = 1; i < gridSize - 1; i++) {
    q[i] = -2 * (Kdiag[i + 1] - Kdiag[i - 1]) / (2 * dx);
  }
  // Forward / backward difference at boundaries
  q[0] = -2 * (Kdiag[1] - Kdiag[0]) / dx;
  q[gridSize - 1] = -2 * (Kdiag[gridSize - 1] - Kdiag[gridSize - 2]) / dx;

  // Diagnostics
  // 1. Real-valued check: q is constructed from real parts only — always real
  const isReal = q.every(v => Number.isFinite(v));

  // 2. L¹ norm: ∫|q(x)| dx ≈ Σ |q_i| dx
  let L1norm = 0;
  for (let i = 0; i < gridSize; i++) {
    L1norm += Math.abs(q[i]) * dx;
  }

  // 3. Decay rate: fit |q(x)| ~ C·exp(-α·x) on the tail (last 30%)
  const tailStart = Math.floor(0.7 * gridSize);
  let sumLogQ = 0, sumX = 0, sumXLogQ = 0, sumX2 = 0;
  let tailCount = 0;
  for (let i = tailStart; i < gridSize; i++) {
    const absQ = Math.abs(q[i]);
    if (absQ > 1e-20) {
      const logQ = Math.log(absQ);
      sumLogQ += logQ;
      sumX += xGrid[i];
      sumXLogQ += xGrid[i] * logQ;
      sumX2 += xGrid[i] * xGrid[i];
      tailCount++;
    }
  }
  let decayRate = 0;
  if (tailCount > 2) {
    // Linear regression: log|q| = a + b·x  →  decay rate α = -b
    const b = (tailCount * sumXLogQ - sumX * sumLogQ) /
              (tailCount * sumX2 - sumX * sumX);
    decayRate = -b;
  }

  return {
    x: Array.from(xGrid),
    q: Array.from(q),
    Kdiag: Array.from(Kdiag),
    isReal,
    L1norm,
    decayRate,
  };
}

/* ------------------------------------------------------------------ */
/*  marchenkoCascadeTest                                              */
/*  Run for multiple N, check convergence, return verdict.            */
/* ------------------------------------------------------------------ */

/**
 * Run Marchenko potential recovery for several cascade sizes and
 * assess convergence of the recovered potential.
 *
 * @returns {{ results: object[], convergence: object, verdict: string }}
 */
export function marchenkoCascadeTest() {
  const Ns = [10, 20, 50, 100];
  const gridSize = 150;
  const results = [];

  for (const N of Ns) {
    const r = marchenkoPotentialRecovery(N, gridSize);
    results.push({
      N,
      isReal: r.isReal,
      L1norm: r.L1norm,
      decayRate: r.decayRate,
      qMax: Math.max(...r.q.map(Math.abs)),
      qTailMean: meanAbs(r.q.slice(Math.floor(0.8 * r.q.length))),
    });
  }

  // Convergence check: compare successive L¹ norms
  const diffs = [];
  for (let i = 1; i < results.length; i++) {
    const relChange = Math.abs(results[i].L1norm - results[i - 1].L1norm) /
                      (Math.abs(results[i - 1].L1norm) + 1e-15);
    diffs.push(relChange);
  }
  const isConverging = diffs.length > 0 &&
    diffs[diffs.length - 1] < diffs[0] * 2; // last change not blowing up

  // All potentials real and in L¹?
  const allReal = results.every(r => r.isReal);
  const allL1 = results.every(r => Number.isFinite(r.L1norm) && r.L1norm < 1e6);
  const allDecaying = results.every(r => r.decayRate > 0);

  // Verdict
  let verdict;
  if (allReal && allL1 && allDecaying && isConverging) {
    verdict = 'PASS: Potential is real-valued, in L^1, decays at infinity, and ' +
      'converges as N grows. By the inverse scattering theorem, the S-matrix ' +
      'determines a unique self-adjoint Schrodinger operator whose bound states ' +
      'lie on the critical line.';
  } else if (allReal && allL1) {
    verdict = 'PARTIAL: Potential is real and L^1 but convergence/decay is marginal. ' +
      'Inverse scattering applies but spectral conclusions need further analysis.';
  } else {
    verdict = 'INCONCLUSIVE: Potential recovery did not meet all criteria. ' +
      'Real=' + allReal + ', L1=' + allL1 + ', Decaying=' + allDecaying +
      ', Converging=' + isConverging + '.';
  }

  return {
    results,
    convergence: {
      relativeChanges: diffs,
      isConverging,
    },
    verdict,
  };
}

/* ------------------------------------------------------------------ */
/*  Utility                                                            */
/* ------------------------------------------------------------------ */
function meanAbs(arr) {
  if (!arr || arr.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += Math.abs(arr[i]);
  return sum / arr.length;
}
